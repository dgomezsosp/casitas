require('dotenv').config()
const VectorService = require('./src/services/vector-service')

;(async () => {
  try {
    const vs = new VectorService({ collectionName: process.env.CHROMADB_DATABASE })
    const result = await vs.searchBestMatch('casa con terraza')
    console.log('✅ Búsqueda funciona! ID encontrado:', result)
    process.exit(0)
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
})()
