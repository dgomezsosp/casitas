const express = require('express')
const router = express.Router()
const controller = require('../../controllers/customer/element-controller.js')

router.get('/', controller.findAll)
router.get('/:propertyId', controller.findOne)

module.exports = router