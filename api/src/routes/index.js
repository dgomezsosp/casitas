const express = require('express')
const router = express.Router()

// Customer Routes

router.use('/customer/elements', require('./customer/elements'))
router.use('/customer/search', require('./customer/search'))

module.exports = router
