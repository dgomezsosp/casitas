(async () => {
  try {
    const fs = require("fs")
    const MongoDBService = require("./services/mongodb-service")

    const dir = "./data/2025-11-28"

    console.log("Conectando a MongoDB...")
    const mongoService = new MongoDBService({
      url: "mongodb://localhost:27017",
      dbName: "idealista-scrapping",
      collectionName: "idealista-scrapping"
    })

    await mongoService.connect()
    console.log("✅ Conectado a MongoDB")

    const jsonFiles = fs.readdirSync(dir)
      .filter(f => f.endsWith(".json") && !f.includes("location-"))

    console.log(`📁 Encontrados ${jsonFiles.length} archivos JSON`)

    const documents = []

    for (const file of jsonFiles) {
      const raw = fs.readFileSync(`${dir}/${file}`, "utf8")
      const obj = JSON.parse(raw)

      const propertyId = file.replace(".json", "")

      const document = {
        propertyId,
        ...obj
      }

      documents.push(document)
    }

    await mongoService.insertMany(documents)

    await mongoService.close()
    console.log("🔒 Conexión cerrada")

  } catch (error) {
    console.error("❌ Error:", error)
    process.exit(1)
  }
})()