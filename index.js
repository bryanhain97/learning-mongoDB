const express = require('express');
const config = require('./config/default.json');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const Animal = require('./models/animal');
const Comment = require('./models/comment');
const methodOverride = require('method-override');
// SERVER

app.use(express.static(process.cwd() + '/public')); // absolute path to /public folder
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));


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
app.get('/', (req, res) => {
    res.render('index')
})
app.get('/comments', (req, res) => {
    Comment.find()                      // can we use CACHE and save load time??
        .then(c => {
            res.render('./comments/comments', { comments: c })
        })
        .catch(err => {
            console.log(err)
        })
})
app.put('/comments/:id', (req, res) => {
    const { id } = req.params;
    const { comment, author } = req.body;
    Comment.findByIdAndUpdate(id, { comment, writer: author }, { runValidators: true, new: true })
        .then(updatedComment => {
            console.log('update successful');
            console.log(updatedComment);
            res.redirect('/comments');
        })
        .catch(err => console.log(err));
})
app.delete('/comments/:id', async (req, res) => {
    const { id } = req.params;
    const deletedComment = await Comment.findByIdAndDelete(id);
    console.log(deletedComment);
    console.log('successfully deleted comment');
    res.redirect('/comments')
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

app.get('/comments/:id', async (req, res) => {
    const { id } = req.params;
    await Comment.findById({ _id: id })
        .then(c => {
            console.log(c);
            res.render('./comments/comment', { comment: c })
        })
        .catch(err => console.log(err))
})
app.get('/comments/:id/edit', async (req, res) => {
    const { id } = req.params;
    await Comment.findById({ _id: id })
        .then(c => {
            res.render('./comments/edit', { comment: c })
        })
        .catch(err => console.log(err))
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

app.use((req, res) => {
    res.status(404).render('error404')
}) // handling unmatched routes