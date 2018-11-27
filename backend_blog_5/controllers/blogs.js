const notesRouter = require('express').Router() // luodaan router olio
const jwt = require('jsonwebtoken')  //Authorization-headeria autentikointiin
const Blog = require('../models/blog')
const User = require('../models/user')
//moduuli sisältää kaikki blogeihin liittyvien reittien määrittelyt


//siirretty middlewareen
// const getTokenFrom = (request) => {
//   const authorization = request.get('authorization')
//   if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
//     return authorization.substring(7)
//   }
//   return null
// }


notesRouter.get('/', async (request, response) => {
  const blogs =await Blog
    .find({})
    .populate('user', { username: 1, name: 1, age:1 } )
    //liitosten tekeminen mongoosen komennolla populate ja rajataan mukaan otettavat

  response.json(blogs.map(Blog.format))
})


// palvelimelle lähetys
notesRouter.post('/', async (request, response) => {
  const body = request.body

  try {
    //Apufunktio getTokenFrom eristää tokenin headerista authorization.
    //const token = getTokenFrom(request)
    const decodedToken = jwt.verify(request.token, process.env.SECRET) //Tokenin oikeellisuus varmistetaan
    //Metodi myös dekoodaa tokenin, eli palauttaa olion, jonka perusteella token on laaditt
    if (!request.token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    if (body.title === undefined) {
      return response.status(400).json({ error: 'title missing' })
    }
    if (body.url === undefined) {
      return response.status(400).json({ error: 'url missing' })
    }

    const user = await User.findById(decodedToken.id)
    //const user = await User.findById(body.userId)

    const blog = new Blog({
      title: body.title,
      author:body.author,
      url: body.url,
      likes:body.likes === undefined? false : body.likes===0,
      user: user._id
    })
    const savedBlog =await blog.save()

    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.json(Blog.format(blog))//savedBlog
  } catch(exception){
    if (exception.name === 'JsonWebTokenError') {
      response.status(401).json({ error: exception.message })
    } else {
      response.status(500).json({ error:'Something went wrong...' })
    }
  }
})



// notesRouter.post('/', (request, response) => {
//   const blog = new Blog(request.body)

//   if (blog.likes === undefined) {
//     console.log('eimääritelty')
//     blog.likes === 0
//     console.log(blog.likes)
//     return response.status(400).json({ error: 'like content missing' })
//   }

//   blog
//     .save()
//     .then(result => {
//       response.status(201).json(result)
//     })
//     .catch(error => {
//       console.log(error)
//       response.status(500).json({ error: 'something went wrong...' })
//     })


notesRouter.delete('/:id', async (request, response) => {
  try {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } catch (exception) {
    console.log(exception)
    response.status(400).send({ error: 'malformatted id' })
  }
})


notesRouter.put('/:id', (request, response) => {
  const body = request.bod

  const blog = {
    title: body.title,
    author:body.author,
    url: body.url,
    likes:body.likes
  }
  Blog
    .findByIdAndUpdate(request.params.id, blog, { new: true })
    .then(updatedBlog => {
      response.json(Blog.format(updatedBlog))
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' })
    })
})

//Tiedosto eksporttaa moduulin käyttäjille määritellyn routerin.
module.exports = notesRouter