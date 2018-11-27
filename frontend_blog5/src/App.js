import React from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'

import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'

import blogService from './services/blogs'
import loginService from './services/login'


class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      blogs: [],
      newHeader: 'new title...',
      newText: 'new author..',
      newUrl: 'new url..',
      like:'',
      showAll:'true',
      error: null,
      notification: null,
      username: '',
      password: '',
      user: null,
      newBlog: '',
    }
  }

  componentDidMount() { // lifecycle-metodi, jota React-kutsuu heti komponentin ensimmäisen renderöinnin jälkeen
    blogService
    .getAll()
    .then(blogs =>{
      this.setState({ blogs })
     })
// kun sivulle tullaan uudelleen(uudelleenlataus)tulee tarkistaa löytyykö local storagesta tiedot kirjautuneesta käyttäjästä. 
//Jos löytyy, asetetaan ne sovelluksen tilaan ja noteServicelle.
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON) //muutetaantakaisin JS-olennoksi
      this.setState({user})
      blogService.setToken(user.token)
     
    } 
  } 

  addBlog = async(event) => {
    event.preventDefault()
    //this.blogForm.toggleVisibility() //moduulissa
    try {
    const blogObject = {
      title: this.state.newHeader,
      author: this.state.newText,
      url: this.state.newUrl,
      likes:this.state.like,

    }
    // if (this.includesBlog){
    //   const blog = this.findBlog();
   
    //    if(window.confirm(blog.title +" blogikirjoitus on jo luotu, haluatko muokata tykkäyksiä")) {
    //      blogService
    //                     .update(blog.id, blogObject)
    //                     .then(response => {
    //                         this.setState({
    //                             blogs: this.state.blogs.map(p => p.id !== blog.id ? p : blogObject),
    //                             newHeader: '',
    //                             newText:'',
    //                             newUrl: '',
    //                             like:'',
    //                             notification: `Blogikirjoituksen '${blogObject.title}'päivitys onnistui!`
    //          })
   
    //          setTimeout(() => {
    //            this.setState({notification: null})
    //          }, 5000)
    //        })
    //        .catch(error => {
    //          this.setState({
    //                      error: `Blogi '${blogObject.title}' on jo valitettavasti poistettu palvelimelta`,
    //                      blogs: this.state.blogs.filter(n => n.id !==blog.id)
    //                    })
    //                    setTimeout(() => {
    //                      this.setState({error: null})
    //                    }, 5000)
    //                  })
    //  }
       //}

      //  else{
        const saveBlog = await blogService.create(blogObject)
  //  blogService
  //     .create(blogObject)
  //     .then(NewHeader => {
        this.setState({
          blogs: this.state.blogs.concat(saveBlog),
          newHeader: '',
          newText: '',
          newUrl: '',
          like: '',
          notification: `A new blog '${blogObject.title}' by '${blogObject.author}' added`
        })
        this.newBlogForm.toggleVisibility()

        setTimeout(() => {
          this.setState({notification: null})
        }, 5000)
      } catch (exception) {
        console.log(exception)
        this.setState({
          error: 'something went wrong and blog is not saved'
        })
        setTimeout(() => {
          this.setState({ error: '' })
        }, 5000)
  
        // })
  }
}
  includesBlog = () => {
    const blogger = this.state.blogs.map(blog=> blog.title.toLowerCase());
  
    if (blogger.includes(this.state.newHeader.toLowerCase())) {
        return true;
    } else {
        return false;
    }
  }
  
  findBlog = () => {
    let p = this.state.blogs.find(blog => blog.title.toLowerCase() === this.state.newHeader.toLowerCase())
  
    if (p) {
        return p;
    } else {
        return false;
    }
  }

 addLike = (id) => {
    return () => {
      const blog = this.state.blogs.find(n => n.id === id)
      
      const blogObject = {
        id:this.state.id,
        user:this.state.user,
        title: blog.title,
        author:blog.author,
        url: blog.url,
        likes:blog.likes+1
      }

      blogService
      .update(blog.id, blogObject)
      .then(response => {
            this.setState({
                              //blogs: this.state.blogs.concat(blogObject),
                              blogs: this.state.blogs.map(p => p.id !== blog.id ? p : blogObject),
                              newHeader: '',
                              newText:'',
                              newUrl: '',
                              like:'',
                              notification: `Blogikirjoituksen '${blogObject.title}'liken lisäys onnistui!`
           })
 
           setTimeout(() => {
             this.setState({notification: null})
           }, 5000)
         })
         .catch(error => {
           this.setState({
                       error: `Blogin '${blogObject.title}' likejen päivitys epäonnistui, voit likettää yhtä blogia vain yhden kerran loggautumisesi yhteydessä`,
                      // blogs: this.state.blogs.filter(n => n.id !==blog.id)
                     })
                     setTimeout(() => {
                       this.setState({error: null})
                     }, 5000)
                   })
   }
     }

  deleteBlog = (id) => {
    return () => {
        const blog = this.state.blogs.find(n => n.id === id)

  if(window.confirm("Poistetaanko " +blog.title+ "?")) {
      blogService
        .deleteOne(id)
        .then(changedBlog => {
            const blogs= this.state.blogs.filter(n => n.id !== id)
            this.setState({
              blogs: blogs,
              notification: `blogi kirjoituksen '${blog.title}' poisto palvelimelta onnistui`
              })
              setTimeout(() => {
                this.setState({notification: null})
              }, 5000)
        })
        .catch(error => {
          this.setState({
                      error: `blogikirjoituksen '${blog.title}' voi poistaa vain sen lisääjää kirjautuneena`,
                     // blogs: this.state.blogs.filter(n => n.id !== id)
                    })
                    setTimeout(() => {
                      this.setState({error: null})
                    }, 5000)
                  })
              }
    }
  }

// Kirjautumisen käsittelystä huolehtiva metodi
  login = async (event) => {
    event.preventDefault()
    try {
      // kutsutaan login metodia
      const user = await loginService.login({  
        username: this.state.username,
        password: this.state.password
      })
    // Jotta Token ei katoa sivua uudelleenladatessa talletetaan  kirjautumistiedot local storageen eli 
    //selaimessa olevaan avain-arvo-eli key-value-periaatteella toimivaan tietokantaan.
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user)) // avain, arvo(JSolio muutettuna stringiksi)
     
      blogService.setToken(user.token) //onnistuneen syötteen kohdalla tapahtumankäsittelijä kutsuu servisenblogia asettamaan tokenin
      this.setState({ username: '', password: '', user}) // onnistuessa nollataan kentät ja talleteaan user
    } catch(exception) {
      this.setState({
        error: 'wrong username or password',
      })
      setTimeout(() => {
        this.setState({ error: null })
      }, 5000)
    }
}

logout = () => {
  alert('localstorage cleared!');
   window.localStorage.removeItem('loggedBlogappUser')
 }


  handleFieldChange=(event) => {
    this.setState({ [event.target.name]: event.target.value })
  }
  handleNoteChange = (event) => {
    this.setState({ newBlog: event.target.value })
  }
  handleHeadChange = (event) => {
    console.log(event.target.value)
    this.setState({ newHeader: event.target.value })
  }
  handleTextChange = (event) => {
    console.log(event.target.value)
    this.setState({ newText: event.target.value })
  }
  handleUrlChange = (event) => {
    console.log(event.target.value)
    this.setState({ newUrl: event.target.value })
  }
  handleLikeChange = (event) => {
    console.log(event.target.value)
    this.setState({ like: event.target.value })
  }


  render() {
 
 //const blogsToShow =
 //this.state.showAll ?
 //this.state.blogs 
 //this.state.blogs.filter(blog => blog.important === true)


// määritellään render apufunktiot login ja blogin lomakkeiden generointia varten (moduulissa)
  const loginForm = () => (
    <Togglable buttonLabel="login"> 
      <LoginForm //lapsikomponentti
        visible={this.state.visible}
        username={this.state.username}
        password={this.state.password}
        handleChange={this.handleLoginFieldChange} //määritellään oikea tapahtumankäsittelijä
        handleSubmit={this.login}
      />
    </Togglable>
)
 
const blogForm = () => (
  // parametrin component arvona on viite komponenttiin. Funktio tallettaa viitteen muuttujaan 
  // this.blogForm eli App-komponentin kenttään blogForm.
  <Togglable buttonLabel="new blog" ref={component => this.blogForm = component}> 
       <BlogForm
        onSubmit={this.addBlog}
      
        title={this.state.newHeader}
        handleChange={this.handleHeadChange}
        
        author ={this.state.newText} 
        handleChange1={this.handleTextChange}

        url ={this.state.newUrl} 
        handleChange2={this.handleUrlChange}

        value={this.state.like} 
        handleChange3={this.handleLikeChange}  
      /> 
      </Togglable>
  )
 
const blogit = () => (
  this.state.blogs.map(blog =>
  <Blog key={blog._id} blog={blog} />
)

)
    return (
      <div>
        <h1>Blogs</h1>

        <Notification message={this.state.error} />
        <Notification message={this.state.notification}/>

     {/*  this.state.user === null on truthy, suoritetaan loginForm ja muussa tapauksessa noteForm 
      jos käyttäjä kirjautunut renderöidään nimi*/}
      {this.state.user === null ?
      loginForm() : 
      <div><p>{this.state.user.name} logged in <button type="button" onClick={this.logout}>logout</button> </p>
      {blogForm()} 
      </div> 
      } 

      <div>
      <h2>blogs</h2>
    
       {/* {this.state.blogs.map(blog =>
        <Blog key={blog._id} title={blog._title} blog={blog}/>
      )}  */}

       <ul>
      { this.state.blogs.map(blog =>
        <Blog key={blog._id} blog={blog} 
        deleteBlog={this.deleteBlog(blog.id)}
        addLike={this.addLike(blog.id)}
        user={this.state.user}
         />
      )}
      </ul> 
      
      {/* <ul>
      {blogsToDelete.map(blog =>
      <Blog key={blog.id} blog={blog}
      deleteNote={this.deleteNote(blog.id)}
      />  )}
       </ul> */}
       </div>
      </div>
    )
  }
}
export default App
//ulos kirj kirjoita konsoliin
//window.localStorage.removeItem('loggedBlogappUser')
