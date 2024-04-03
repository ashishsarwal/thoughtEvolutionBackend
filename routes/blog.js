const express = require('express');
const router = express.Router();
const pool  = require('../config/connection');
const fs = require('fs');
const { Buffer } = require('node:buffer');

router.get('/', (req,res) => {
    pool.query(`select *
                from blog
                order by blog.UpdatedOn desc;`
    , function (err, result, fields) {
            if (err) throw err;
            res.send(result);
            res.end();
    });
});

router.get('/:id',(req,res) =>{
    pool.query(`select *
                from blog
                where blog.Id = ${req.params.id};`
    , function (err, result, fields) {
            if (err) throw err;
            res.send(result);
            res.end();
          });
});



router.post('/',(req,res) => {
        pool.query(`select 1
                   from   blog
                   where  blog.Id = ${req.body.Id};`
        ,function(err,result,feilds){
            if (err) throw err;
            if(result.length > 0){
                    pool.query(`UPDATE blog
                               SET    blog.title = '${req.body.Title}'
                               ,      blog.description = '${req.body.Description}'
                               ,      blog.content = '${req.body.Content}'
                               ,      blog.isActive = ${req.body.IsActive}
                               ,      blog.updatedBy = NULL
                               ,      blog.updatedOn = current_date()
                               WHERE  blog.id = ${req.body.Id};
                               --
                               DELETE 
                               FROM     topic_blog
                               WHERE    topic_blog.BlogId = ${req.body.Id};`
                , function (err, result, fields) {
                        if (err) throw err;
                        req.body.Topics.split(',').forEach(item => {
                                                          console.log(item);
                                                          pool.query(`INSERT INTO 
                                                          topic_blog(TopicId
                                                                    ,BlogId
                                                                    ,IsActive
                                                                    ,CreatedOn
                                                                    ,UpdatedOn)
                                                              VALUES(${item}
                                                                    ,${req.body.Id}
                                                                    ,true
                                                                    ,current_date()
                                                                    ,current_date())`
                                                          ,function (err, result, fields) {
                                                            if (err) throw err;
                                                            if(req.body.BlogImage){
                                                                //REMOVE UPDATE CODE...
                                                                pool.query(`UPDATE blog
                                                                           SET    blog.BlogImage = ''
                                                                           WHERE  blog.id = ${req.body.Id};`
                                                                ,function (err, result, fields) {
                                                                    if (err) throw err;});
                                                            }
                                                          });
                                                    });

                        });
            }
            else{
                pool.query(`INSERT INTO blog
                            (Id,
                            Title,
                            Description,
                            Content,
                            BlogImage,
                            IsActive,
                            CreatedBy,
                            CreatedOn,
                            UpdatedBy,
                            UpdatedOn)
                            VALUES
                            (NULL,
                            '${req.body.Title}',
                            '${req.body.Description}',
                            '${req.body.Content}',
                            '',
                            ${req.body.IsActive},
                            NULL,
                            current_date(),
                            NULL,
                            current_date());`
                , function (err, result, fields) {
                        if (err) throw err;
                        req.body.Topics.split(',').forEach(item => {
                                                        console.log(item);
                                                        pool.query(`INSERT INTO 
                                                        topic_blog(TopicId
                                                                ,BlogId
                                                                ,IsActive
                                                                ,CreatedOn
                                                                ,UpdatedOn)
                                                            VALUES(${item}
                                                                ,(select id
                                                                    from blog
                                                                    where blog.title = '${req.body.Title}')
                                                                ,true
                                                                ,current_date()
                                                                ,current_date())`
                                                        ,function (err, result, fields) {
                                                        if (err) throw err;
                                                    });
                                                });
                 });
            }
            //Save image in file path if image is present
            if(req.body.BlogImage){
                let base64 = req.body.BlogImage.split(",")[1];
                let buffer = Buffer.from(base64, 'base64');
                fs.writeFile(`public/images/blog-${req.body.Id}.png`,buffer,(err)=>{
                    if(err){
                        console.log(err);
                    }
                    else{
                        console.log('image written on location.....');
                    }
                });
            }
            res.end();
        })
});

module.exports = router;
