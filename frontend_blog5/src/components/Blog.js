import React from 'react'


const Blog = ({ blog, deleteBlog, addLike }) => {
  const label = 'poista'
 return(
 


 <li className> <h2>{blog.title}</h2>author: {blog.author}<p>url: {blog.url}</p><p>{blog.likes} likes < button onClick={addLike}>like</button> </p>< button onClick={deleteBlog}>{label}</button>  </li>

) 
}
export default Blog


