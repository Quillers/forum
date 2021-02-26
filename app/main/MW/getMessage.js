const message_code = require('./message_code.json')
/**
 * Gets the message code included in url when redirected
 */
const getMessage = (request, response, next) => {

  if (request.query.msg_code) {

    const code = request.query.msg_code
    let message = message_code[code];

    if (code.substring(0, 1) === 'F') {
      message = message + '\\ln' + message_code.FATALITY
    }

    console.log('getMessage');
    response.info = message;
  }
  next()
}

module.exports = getMessage;
