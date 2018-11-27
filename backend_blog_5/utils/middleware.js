// middleware, hiljennetty testien ajaksi
const logger = (request, response, next) => {
  if ( process.env.NODE_ENV === 'test' ) {
    return next()
  }

  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

// middleware errorien käsittelyyn
const error = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}


// token middleware
const tokenExtractor = (request, response, next) => {
  const authorization = request.get('Authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = authorization.substring(7)
  }

  next()
}


module.exports = {
  logger,
  error,
  tokenExtractor
}