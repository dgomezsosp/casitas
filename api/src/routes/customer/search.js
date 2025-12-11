const express = require('express')
const router = express.Router()
const controller = require('../../controllers/customer/search-controller.js')

router.post('/', controller.search)

module.exports = router
