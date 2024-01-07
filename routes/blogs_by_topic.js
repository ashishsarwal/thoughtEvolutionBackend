const express = require('express');
const router = express.Router();
const con  = require('../config/connection');

router.get('/', (req,res) => {

    con.connect(function(err){
        if(err) console.log(err); 
        //console.log('Connected...');
        con.query(`select blog.*
        ,	      topic_blog.topicId
        from	  blog
        inner join topic_blog on blog.id = topic_blog.blogid;`
    , function (err, result, fields) {
            if (err) throw err;
            res.send(result);
            res.end();
          });
    });
});

router.get('/:id', (req,res) => {

    con.connect(function(err){
        if(err) console.log(err); 
        //console.log('Connected...');
        con.query(`select blog.Id
        ,         blog.Title
        ,         blog.Description
        ,         blog.BlogImage
        ,	      topic_blog.topicId
        from	  blog
        inner join topic_blog on blog.id = topic_blog.blogid
        where     topic_blog.topicId = ${req.params.id};`
    , function (err, result, fields) {
            if (err) throw err;
            res.send(result);
            res.end();
          });
    });
});

module.exports = router;
