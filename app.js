const express = require('express');
const app = express();
const port  = 3000;

const topic = require('./routes/topic');
const blog = require('./routes/blog');
const topic_blog = require('./routes/topic_blog');

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/topic', topic);
app.use('/blog', blog);
app.use('/topic_blog', topic_blog);

app.listen(port, ()=>{
    console.log('listening on port 3000...');
});