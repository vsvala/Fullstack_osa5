import React from 'react'
import Togglable from './Togglable'

const Blog = ({ blog, deleteBlog, addLike, user }) => {
  //const label = 'poista'

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

 return(

 //<li className> <h2>{blog.title}</h2>author: {blog.author}<p>url: {blog.url}</p><p>{blog.likes} likes < button onClick={addLike}>like</button> </p>< button onClick={deleteBlog}>{label}</button>  </li>
<div style={blogStyle}><p>{blog.title} by {blog.author}</p>
<Togglable buttonLabel="show more" > url: {blog.url}<p>{blog.likes} likes < button onClick={addLike}>like</button></p>
<p>Added by {blog.user.name}</p> 
<Togglable buttonLabel= "delete"><button onClick={deleteBlog} >delete</button></Togglable></Togglable>

</div>
 
) 
} 
export default Blog


