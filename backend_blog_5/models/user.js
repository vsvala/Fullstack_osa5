const mongoose = require('mongoose')

const userSchema  = new mongoose.Schema({
  username: String,
  name: String,
  age: Boolean,
  passwordHash: String,
  blogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }]
})

userSchema.statics.format = (user) => {
  return {
    id: user.id,
    username: user.username,
    name: user.name,
    age:user.age,
    blogs: user.blogs
  }
}
const User = mongoose.model('User', userSchema)

module.exports = User