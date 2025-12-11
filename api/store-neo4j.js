require('dotenv').config()
const mongoose = require('mongoose')
const mongooseDb = require('./src/models/mongoose')
const GraphService = require('./src/services/graph-service')

;(async () => {
  const graphService = new GraphService()

  try {
    console.log('🚀 Iniciando carga de datos en Neo4j...')

    // Esperar a que MongoDB esté conectado
    console.log('📦 Esperando conexión a MongoDB...')
    if (mongoose.connection.readyState !== 1) {
      await new Promise((resolve) => {
        mongoose.connection.once('connected', resolve)
      })
    }
    console.log('✅ MongoDB conectado')

    // Obtener todos los elementos de MongoDB
    console.log('📖 Obteniendo elementos de MongoDB...')
    const elements = await mongooseDb.Element.find({})
    console.log(`✅ Se encontraron ${elements.length} elementos`)

    if (elements.length === 0) {
      console.log('❌ No hay elementos en MongoDB para procesar')
      process.exit(1)
    }

    // Limpiar base de datos de Neo4j
    console.log('🗑️  Limpiando base de datos de Neo4j...')
    await graphService.session.run('MATCH (n) DETACH DELETE n')
    console.log('✅ Base de datos limpiada')

    // Paso 1: Recolectar todas las especificaciones únicas
    console.log('🔍 Recolectando especificaciones únicas...')
    const specificationSet = new Set()

    elements.forEach(element => {
      if (element.specifications && Array.isArray(element.specifications)) {
        element.specifications.forEach(spec => {
          const normalized = String(spec).trim()
          if (normalized.length > 0) {
            specificationSet.add(normalized)
          }
        })
      }
    })

    const uniqueSpecifications = Array.from(specificationSet)
    console.log(`✅ Se encontraron ${uniqueSpecifications.length} especificaciones únicas`)

    // Paso 2: Crear nodos de Specification
    console.log('📝 Creando nodos de Specification...')
    for (let i = 0; i < uniqueSpecifications.length; i++) {
      const id = String(i + 1)
      await graphService.createNode('Specification', {
        id,
        name: uniqueSpecifications[i]
      })

      if ((i + 1) % 10 === 0 || i === uniqueSpecifications.length - 1) {
        console.log(`   Creadas ${i + 1}/${uniqueSpecifications.length} especificaciones`)
      }
    }

    // Paso 3: Crear nodos de Element y relaciones
    console.log('🏠 Creando nodos de Element y relaciones...')
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i]
      const elementObj = element.toObject()

      // Preparar datos del elemento (sin specifications, _id, __v)
      const elementData = { ...elementObj }
      delete elementData.specifications
      delete elementData._id
      delete elementData.__v
      elementData.id = element.propertyId

      // Crear nodo Element
      await graphService.createNode('Element', elementData)

      // Crear relaciones con Specifications
      if (element.specifications && Array.isArray(element.specifications)) {
        for (const spec of element.specifications) {
          const normalized = String(spec).trim()
          if (normalized.length > 0) {
            const specIndex = uniqueSpecifications.indexOf(normalized)
            if (specIndex !== -1) {
              await graphService.createRelation(
                'Element',
                'HAS_SPECIFICATION',
                'Specification',
                {
                  entityId: element.propertyId,
                  relatedEntityId: String(specIndex + 1)
                }
              )
            }
          }
        }
      }

      if ((i + 1) % 10 === 0 || i === elements.length - 1) {
        console.log(`   Procesados ${i + 1}/${elements.length} elementos`)
      }
    }

    console.log('✅ ¡Proceso completado exitosamente!')
    console.log(`   📊 Elementos creados: ${elements.length}`)
    console.log(`   📊 Especificaciones creadas: ${uniqueSpecifications.length}`)

    await graphService.close()
    process.exit(0)
  } catch (error) {
    console.error('❌ Error general:', error)
    await graphService.close()
    process.exit(1)
  }
})()
