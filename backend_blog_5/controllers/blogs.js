const blogsRouter = require('express').Router() // luodaan router olio
const jwt = require('jsonwebtoken')  //Authorization-headeria autentikointiin
const Blog = require('../models/blog')
const User = require('../models/user')
//moduuli sisältää kaikki blogeihin liittyvien reittien määrittelyt



// muistiinpanojen hakeminen tietokannasta
blogsRouter.get('/', async (request, response) => {
  const blogs =await Blog
    .find({})
    .populate('user', { username: 1, name: 1, age:1 } )
    //liitosten tekeminen mongoosen komennolla populate ja rajataan mukaan otettavat

  response.json(blogs.map(Blog.format)) //palautetaan HTTP-pyynnön vastauksena format funktion avulla muotoiltuja oliota
})


// palvelimelle lähetys
blogsRouter.post('/', async (request, response) => {
  const body = request.body

  try {
    //Apufunktio getTokenFrom eristää tokenin headerista authorization.
    //const token = getTokenFrom(request)
    const decodedToken = jwt.verify(request.token, process.env.SECRET) //Tokenin oikeellisuus varmistetaan
    //Metodi myös dekoodaa tokenin, eli palauttaa olion, jonka perusteella token on laadittu
    if (!request.token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    if (body.title === '') {
      return response.status(400).json({ error: 'title missing' })
    }
    if (body.author === '') {
      return response.status(400).json({ error: 'author missing' })
    }
    if (body.url === '') {
      return response.status(400).json({ error: 'url missing' })
    }
    // if (body.likes === '') {
    //   console.log("LIKEEEEEEEEEEEEEE")
    //   body.likes === 5
    //   //return response.status(400).json({ error: 'like missing' })
    // }

    const user = await User.findById(decodedToken.id)
    //const user = await User.findById(body.userId)

    const blog = new Blog({
      title: body.title,
      author:body.author,
      url: body.url,
      likes:body.likes ===''? false : body.likes === 0,
      user: user._id
    })

    // if (body.likes === undefined) {
    //   console.log('eimääritelty')
    //   body.likes === 5
    //   //blog.likes === 0
    //   console.log(blog.likes)
    //   return response.status(400).json({ error: 'like content missing' })
    // }

    const savedBlog =await blog.save()

    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.json(Blog.format(savedBlog)) //blo

  } catch(exception){
    if (exception.name === 'JsonWebTokenError') {
      response.status(401).json({ error: exception.message })
    } else {
      response.status(500).json({ error:'Something went wrong...' })
    }
  }
})

// tietokannasta poistaminen
blogsRouter.delete('/:id', async (request, response) => {
  try {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end() //no content
  } catch (exception) {
    console.log(exception)
    response.status(400).send({ error: 'malformatted id' })
  }
})

//yksittäisen blogin haku
blogsRouter.get('/:id', async (request, response) => {
  try {
    const oneBlog = await Blog.findById(request.params.id)
    response.json(oneBlog.format)
  } catch (exception) {
    console.log(exception)
    response.status(400).send({ error: 'malformatted id' })
  }
})


// app.get('/notes/:id', (request, response) => {
//   const id = Number(request.params.id)
//   const note = notes.find(note => note.id === id)

//   if ( note ) {
//     response.json(note)
//   } else {
//     response.status(404).end()
//   }
// })


// muokkaus
blogsRouter.put('/:id', (request, response) => {
  const body = request.body

  const blog = {
    title: body.title,
    author:body.author,
    url: body.url,
    likes:body.likes
  }
  //Oletusarvoisesti tapahtumankäsittelijä saa parametrikseen updatedNote päivitetyn olion ennen muutosta olleen tilan.
  //Lisäsimme operaatioon parametrin new: true jotta saamme muuttuneen olion palautetuksi kutsujalle.
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
module.exports = blogsRouter