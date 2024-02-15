const express = require('express');
const app = express();
const port = process.env.PORT || 3000; //80; -- Older Port For Server
const bodyParser = require('body-parser');


const topic = require('./routes/topic');
const blog = require('./routes/blog');
const banner = require('./routes/banner');
const topic_blog = require('./routes/topic_blog');
const blogs_by_topic = require('./routes/blogs_by_topic');
const test = require('./routes/test');

// Express 4.0
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));


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
app.use(express.static(__dirname + '/public'));
app.use('/thought-evolution-api/topic', topic);
app.use('/thought-evolution-api/blog', blog);
app.use('/thought-evolution-api/banner', banner);
app.use('/thought-evolution-api/topic_blog', topic_blog);
app.use('/thought-evolution-api/blogs_by_topic',blogs_by_topic);
app.use('/thought-evolution-api/test',test);

app.listen(port, ()=>{
    console.log('listening on port 3000...');
});