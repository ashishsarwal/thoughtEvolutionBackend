
const express = require('express');
const router = express.Router();
const pool  = require('../config/connection');

router.get('/:id', (req,res) => {

    pool.query(`SELECT 	  topic.*
                ,		  CASE WHEN topic_blog.BlogId IS NOT NULL THEN TRUE ELSE FALSE END AS IsSelected
                FROM      topic
                LEFT JOIN topic_blog ON topic.id = topic_blog.TopicId
                                    AND topic_blog.BlogId = ${req.params.id};`
    , function (err, result, fields) {
            if (err) throw err;
            res.send(result);
            res.end();
          });
    });

module.exports = router;
