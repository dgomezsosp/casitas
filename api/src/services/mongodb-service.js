const moment = require('moment')

class MongoDBService {
  constructor(model) {
    this.model = model
  }

  async findAll(filters = {}) {
    const whereStatement = { ...filters }
    whereStatement.deletedAt = { $exists: false }

    const result = await this.model
      .find(whereStatement)
      .sort({ createdAt: -1 })
      .lean()
      .exec()

    return result.map(doc => this.formatResponse(doc))
  }

  async findOne(filters = {}) {
    const whereStatement = { ...filters }
    whereStatement.deletedAt = { $exists: false }

    const doc = await this.model
      .findOne(whereStatement)
      .lean()
      .exec()

    if (!doc) {
      return null
    }

    return this.formatResponse(doc)
  }

  formatResponse(doc) {
    return {
      ...doc,
      id: doc._id,
      _id: undefined,
      createdAt: doc.createdAt ? moment(doc.createdAt).format('YYYY-MM-DD HH:mm') : undefined,
      updatedAt: doc.updatedAt ? moment(doc.updatedAt).format('YYYY-MM-DD HH:mm') : undefined
    }
  }
}

module.exports = MongoDBService