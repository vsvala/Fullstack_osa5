import React from 'react'

const BlogForm = ({ onSubmit, handleChange, handleChange1, handleChange2, handleChange3, title, author, url, likes }) => {
    return (
      <div>
        <h2>Create new blog</h2>

        <form onSubmit={onSubmit}>

                Title:
                 <input
                  type="text"
                  name="title"
                  value={title}
                  onChange={handleChange}
                  />
                 
                 <div>
                  Author:
                  <input
                    type="text"
                    name="author"
                    value ={author}
                    onChange={handleChange1}
                    />
                    </div>

                <div>
                Url:
               <input
               type="text"
               name="url"
               value ={url}
               onChange={handleChange2}
               />
               </div>

              <div>
                likes:
              <input
                name="likes"
                value ={likes}
                onChange={this.handleChange3}
                  />
              </div>

          <button type="submit">tallenna</button>
        </form>
      </div>
    )
  }
  export default BlogForm

