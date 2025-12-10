module.exports = async (req, res, next) => {
  next()

  try {
    if (!req.ip || req.ip !== '::1') {
      const userIp = req.ip.replace('::ffff:', '')
      console.log(`UserIp: ${userIp}`)

      // Con split:
      // const userIp = req.ip.split(':')[3]
      // console.log(`UserIp: ${userIp}`)

      const response = await fetch(`http://ip-api.com/json/${userIp}`)
      const result = await response.json()
      console.log(result)
    }
  } catch (error) {
    console.log(error)
  }
}
