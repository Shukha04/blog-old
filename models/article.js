const {
  model,
  Schema
} = require('mongoose')

const articleSchema = new Schema({
  image: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  desc: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  views: {
    type: Number,
    required: true,
    default: 0
  },
  comments: [{
    commentId: {
      type: Schema.Types.ObjectId,
      ref: 'Comment'
    }
  }]
})

module.exports = model('Article', articleSchema)