const express = require('express');
const router = express.Router();
const pool  = require('../config/connection');

router.get('/', (req,res) => {

    pool.query(`select blog.*
                ,	      topic_blog.topicId
                from	  blog
                inner join topic_blog on blog.id = topic_blog.blogid
                                        and blog.IsActive = 1
                             and topic.IsActive = 1;`
    , function (err, result, fields) {
            if (err) throw err;
            res.send(result);
            res.end();
          });
});

router.get('/:id', (req,res) => {
    pool.query(`select blog.Id
    ,         blog.Title
    ,         blog.Description
    ,         blog.BlogImage
    ,	      topic_blog.topicId
    from	  blog
    inner join topic_blog on blog.id = topic_blog.blogid
                            and blog.IsActive = 1
    inner join topic on topic.id = topic_blog.topicid
                    and topic.IsActive = 1
    where     topic_blog.topicId = ${req.params.id}
    order by  blog.UpdatedOn desc;`
    , function (err, result, fields) {
            if (err) throw err;
            res.send(result);
            res.end();
    });
});

router.get('/top/:id', (req,res) => {
    pool.query(`select blog.Id
    ,         blog.Title
    ,         blog.Description
    ,         blog.BlogImage
    ,	      topic_blog.topicId
    from	  blog
    inner join topic_blog on blog.id = topic_blog.blogid
                            and blog.IsActive = 1
    inner join topic on topic.id = topic_blog.topicid
                    and topic.IsActive = 1
    where     topic_blog.topicId = ${req.params.id}
    order by  blog.UpdatedOn desc
    limit     5;`
    , function (err, result, fields) {
            if (err) throw err;
            res.send(result);
            res.end();
    });
});

module.exports = router;
