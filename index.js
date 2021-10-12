const express = require('express');
const config = require('./config/default.json');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const Animal = require('./models/animal');
// SERVER

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// DATABASE 

mongoose.connect(config.mongoDBAtlasURI, {useNewUrlParser: true})
    .then(() => {
        console.log('Connected to MongoDB Atlas via Mongoose.');
    });
// mongoose.connection.on('connected', () => {
//     console.log('connected to mongodb atlas database.')
// })


// APP FUNCTIONALITY 

const comments = [{
    comment: 'that is so funny hahaha',
    writer: 'Alexis'
},
{
    comment: 'yea right...',
    writer: 'Olivia'
},
{
    comment: 'is she really going to do that?',
    writer: 'John'
},
{
    comment: 'i think so.. man that is hilarious!!!',
    writer: 'Abba'
}]; // props: comment, writer

app.listen(config.PORT, () => {
    console.log(`app listening on PORT${config.PORT}!`);
});


app.get('/comments', (req, res) => {
    res.render('./comments/comments', {comments: comments})
})
app.post('/comments', (req, res) => {
    console.log(req.body)
    const {comment, author} = req.body;
    comments.push({comment, writer: author});
    res.redirect('/comments');
})
app.get('/comments/new', (req, res) => {
    res.render('./comments/newcomment')
})

app.get('/animals', (req, res) => {
    Animal.find()
        .then(data => {
            console.log(data);
            res.send(data);
        })
        .catch(err => {
            console.log(err)
        })
});
