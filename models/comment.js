const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: true,
    },
    writer: {
        type: String,
        required: true
    },
    dateOfEntry: {
        type: String,
        default: new Date().toLocaleDateString()
    }
})

const Comment = new mongoose.model('Comment', commentSchema);


module.exports = Comment;