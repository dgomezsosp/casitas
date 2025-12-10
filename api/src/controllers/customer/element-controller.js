const mongooseDb = require('../../models/mongoose')
const MongoDBService = require('../../services/mongodb-service')

const elementService = new MongoDBService(mongooseDb.Element)

exports.findAll = async (req, res, next) => {
  try {
    const response = await elementService.findAll()
    res.status(200).send(response)
  } catch (err) {
    next(err)
  }
}

exports.findOne = async (req, res, next) => {
  try {
    const { propertyId } = req.params
    
    const response = await elementService.findOne({ propertyId })

    if (!response) {
      return res.status(404).send({ message: 'Elemento no encontrado' })
    }

    res.status(200).send(response)
  } catch (err) {
    next(err)
  }
}