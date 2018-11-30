import React from 'react'
import { shallow } from 'enzyme'
import SimpleBlog from  './SimpleBlog'

describe.only('<SimpleBlog />', () => {
  it('renders content', () => {
    const blog = {
      title: 'Komponenttitestaus tapahtuu jestillä ja enzymellä',
      author: 'Jaska'
    }

    const noteComponent = shallow(<SimpleBlog blog={blog} />)
   //console.log(noteComponent.debug())
    const contentDiv = noteComponent.find('.content')
    //console.log(contentDiv.debug())

    expect(contentDiv.text()).toContain(blog.title)
    expect(contentDiv.text()).toContain(blog.author)
  })
})
describe.only('<SimpleBloglikes />', () => {
    it('renders liket', () => {
      const blog = {
      likes: 5
      }
  
      const noteComponent = shallow(<SimpleBlog blog={blog} />)
      const contentDiv = noteComponent.find('.liket')
      //console.log(contentDiv.debug())

expect(contentDiv.text()).toContain(blog.likes)
})
})

describe.only('<SimpleBloglikes />', () => {

  it('clicking the button 2 times calls event handler twice', () => {
    const blog = {
        title: 'Komponenttitestaus tapahtuu jestillä ja enzymellä',
        author: 'Jaska'
    }
  
    const mockHandler = jest.fn()
  
    const blogComponent = shallow(
      <SimpleBlog
        blog={blog}
        onClick={mockHandler}
      />
    )
  
    const button = blogComponent.find('button')
    button.simulate('click')
    button.simulate('click')
  
    expect(mockHandler.mock.calls.length).toBe(2)
  })
})