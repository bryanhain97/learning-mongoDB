const express = require('express');
const config = require('./config/default.json');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const Animal = require('./models/animal');
const Comment = require('./models/comment');
// SERVER

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));        // OR app.set('views', process.cwd() + '/views' )

// DATABASE 

mongoose.connect(config.mongoDBAtlasURI, { useNewUrlParser: true })
    .then(() => {
        console.log('Connected to MongoDB Atlas via Mongoose.');
    });
// mongoose.connection.on('connected', () => {
//     console.log('connected to mongodb atlas database.')
// })


// APP FUNCTIONALITY 

app.listen(config.PORT, () => {
    console.log(`app listening on PORT${config.PORT}!`);
});

app.get('/comments', (req, res) => {
    Comment.find()                      // can we use CACHE and save load time??
        .then(c => {
            res.render('./comments/comments', {comments: c})
        })
        .catch(err => {
            console.log(err)
        })
})

app.post('/comments', async (req, res) => {
    console.log(req.body);
    const newComment = new Comment(req.body);
    await newComment.save()
        .then(() => {
            console.log('saved new comment to database');
            res.redirect('/comments')
        })
        .catch(err => console.log(err));
})
app.get('/comments/newcomment', (req, res) => {
    res.render('./comments/newcomment')
})

app.get('/animals', (req, res) => {
    Animal.findOne({ name: 'Blue Whale' })
        .then(data => {
            console.log('your data: ', data);
            console.log('your data id: ', data._id)
            res.send(data);
        })
        .catch(err => {
            console.log(err)
        })
});