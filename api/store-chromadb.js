require('dotenv').config()
const mongoose = require('mongoose')
const mongooseDb = require('./src/models/mongoose')
const VectorService = require('./src/services/vector-service')

;(async () => {
  try {
    console.log('🚀 Iniciando carga de datos en ChromaDB...')

    // Esperar a que MongoDB esté conectado
    console.log('📦 Esperando conexión a MongoDB...')
    if (mongoose.connection.readyState !== 1) {
      await new Promise((resolve) => {
        mongoose.connection.once('connected', resolve)
      })
    }
    console.log('✅ MongoDB conectado')

    const vectorService = new VectorService({
      collectionName: process.env.CHROMADB_DATABASE
    })

    // Obtener todos los elementos de MongoDB
    console.log('📖 Obteniendo elementos de MongoDB...')
    const elements = await mongooseDb.Element.find({})
    console.log(`✅ Se encontraron ${elements.length} elementos`)

    if (elements.length === 0) {
      console.log('❌ No hay elementos en MongoDB para procesar')
      process.exit(1)
    }

    // Resetear colección de ChromaDB
    console.log('🗑️  Limpiando colección de ChromaDB...')
    await vectorService.resetCollection()
    console.log('✅ Colección limpiada')

    console.log('🔄 Procesando elementos...')

    let totalProcessed = 0

    // Procesar y guardar en lotes
    const batchSize = 50 // Guardar cada 50 elementos
    for (let i = 0; i < elements.length; i += batchSize) {
      const batch = elements.slice(i, i + batchSize)

      const result = {
        ids: [],
        documents: [],
        metadatas: []
      }

      const tasks = batch.map(async (element) => {
        try {
          const elementObj = element.toObject()

          // Crear documento de texto directamente (sin prompts de OpenAI)
          // Combinar título, descripción y especificaciones
          const textParts = []

          if (elementObj.title) textParts.push(elementObj.title)
          if (elementObj.description) textParts.push(elementObj.description)
          if (elementObj.locationSlug) textParts.push(elementObj.locationSlug)
          if (elementObj.specifications && Array.isArray(elementObj.specifications)) {
            textParts.push(elementObj.specifications.join(' '))
          }

          const documentText = textParts.join(' ')

          // Preparar metadata limpia (sin specifications, nulls, ni tipos incompatibles)
          const metadata = {}

          // ChromaDB solo acepta: string, number, boolean
          // Convertir todo a estos tipos y eliminar nulls
          Object.entries(elementObj).forEach(([key, value]) => {
            // Ignorar campos especiales
            if (key === 'specifications' || key === '_id' || key === '__v') {
              return
            }

            // Ignorar valores null o undefined
            if (value === null || value === undefined) {
              return
            }

            // Convertir a tipos compatibles
            if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
              metadata[key] = value
            } else if (value instanceof Date) {
              metadata[key] = value.toISOString()
            } else if (Array.isArray(value)) {
              metadata[key] = value.join(', ')
            } else if (typeof value === 'object') {
              metadata[key] = JSON.stringify(value)
            }
          })

          return {
            id: element.propertyId,
            document: documentText,
            metadata
          }
        } catch (error) {
          console.error(`❌ Error procesando elemento ${element.propertyId}:`, error.message)
          return null
        }
      })

      const batchResults = await Promise.all(tasks)

      // Agregar resultados válidos
      batchResults.forEach(item => {
        if (item) {
          result.ids.push(item.id)
          result.documents.push(item.document)
          result.metadatas.push(item.metadata)
        }
      })

      // Guardar este lote en ChromaDB
      if (result.ids.length > 0) {
        await vectorService.addDocuments(result)
        totalProcessed += result.ids.length
      }

      console.log(`   Procesados ${Math.min((i + batchSize), elements.length)}/${elements.length} elementos (${totalProcessed} guardados)`)
    }

    console.log(`✅ ¡Proceso completado! ${totalProcessed} elementos guardados en ChromaDB`)

    process.exit(0)
  } catch (error) {
    console.error('❌ Error general:', error)
    process.exit(1)
  }
})()
