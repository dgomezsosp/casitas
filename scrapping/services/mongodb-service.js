const { MongoClient } = require("mongodb")

module.exports = class MongoDBService {

  constructor({
    url = "mongodb://localhost:27017",
    dbName,
    collectionName
  }) {
    if (!dbName) {
      throw new Error("MongoDBService: dbName es obligatorio")
    }
    if (!collectionName) {
      throw new Error("MongoDBService: collectionName es obligatorio")
    }

    this.url = url
    this.dbName = dbName
    this.collectionName = collectionName
    this.client = null
    this.db = null
    this.collection = null
  }

  async connect() {
    if (!this.client) {
      this.client = new MongoClient(this.url)
      await this.client.connect()
      this.db = this.client.db(this.dbName)
      this.collection = this.db.collection(this.collectionName)
    }
  }

  async insertMany(documents) {
    await this.connect()
    const result = await this.collection.insertMany(documents)
    return result
  }

  async insertOne(document) {
    await this.connect()
    const result = await this.collection.insertOne(document)
    return result
  }

  async find(query = {}, options = {}) {
    await this.connect()
    const result = await this.collection.find(query, options).toArray()
    return result
  }

  async findOne(query = {}) {
    await this.connect()
    const result = await this.collection.findOne(query)
    return result
  }

  async updateOne(filter, update) {
    await this.connect()
    const result = await this.collection.updateOne(filter, update)
    return result
  }

  async updateMany(filter, update) {
    await this.connect()
    const result = await this.collection.updateMany(filter, update)
    return result
  }

  async deleteOne(filter) {
    await this.connect()
    const result = await this.collection.deleteOne(filter)
    return result
  }

  async deleteMany(filter) {
    await this.connect()
    const result = await this.collection.deleteMany(filter)
    return result
  }

  async countDocuments(query = {}) {
    await this.connect()
    const result = await this.collection.countDocuments(query)
    return result
  }

  async close() {
    if (this.client) {
      await this.client.close()
      this.client = null
      this.db = null
      this.collection = null
    }
  }
}