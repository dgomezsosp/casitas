module.exports = (req, res, next) => {
  req.isRobot = /bot|crawler|spider|crawling/i.test(req.headers['user-agent'])
  req.userLanguage = req.headers['accept-language'] ? (req.headers['accept-language'].split(',')[0]).split('-')[0] : process.env.DEFAULT_LANGUAGE

  next()
}

// Se puede escribir así: declarar función y exportar función:

// const userAgentMiddleware = (req, res, next) => {
//   req.isRobot = /bot|crawler|spider|crawling/i.test(req.headers['user-agent'])
//   req.userLanguage = req.headers['accept-language'] ? (req.headers['accept-language'].split(',')[0]).split('-')[0] : process.env.DEFAULT_LANGUAGE

//   next()
// }

// module.exports = userAgentMiddleware
