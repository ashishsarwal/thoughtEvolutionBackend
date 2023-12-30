const express = require('express');
const router = express.Router();
const con  = require('../config/connection');

router.get('/', (req,res) => {

    con.connect(function(err){
        if(err) console.log(err); 
        //console.log('Connected...');
        con.query(`select *
                   from blog;`
    , function (err, result, fields) {
            if (err) throw err;
            res.send(result);
            res.end();
          });
    });
});

router.get('/:id',(req,res) =>{
    con.connect(function(err){
        if(err) console.log(err); 
        //console.log('Connected...');
        con.query(`select *
                   from blog
                   where blog.Id = ${req.params.id};`
    , function (err, result, fields) {
            if (err) throw err;
            res.send(result);
            res.end();
          });
        });
});



router.post('/',(req,res) => {
    // log body to console
    console.log(req.body);
    // insert blog into the table
    con.connect(function(err){
        if(err) console.log(err)
        con.query(`select 1
                   from   blog
                   where  blog.Id = ${req.body.Id};`
        ,function(err,result,feilds){
            if (err) throw err;
            if(result.length > 0){
                con.connect(function(err){
                    if(err) console.log(err); 
                    //console.log('Connected...');
                    con.query(`UPDATE blog
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
                                                          con.query(`INSERT INTO 
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
                                                          });
                                                    });

                        });
                });
            }
            else{
                con.connect(function(err){
                    if(err) console.log(err); 
                    //console.log('Connected...');
                    con.query(`INSERT INTO blog
                                (Id,
                                Title,
                                Description,
                                Content,
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
                                ${req.body.IsActive},
                                NULL,
                                current_date(),
                                NULL,
                                current_date());`
                , function (err, result, fields) {
                        if (err) throw err;
                        req.body.Topics.split(',').forEach(item => {
                                                        console.log(item);
                                                        con.query(`INSERT INTO 
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

                });
            }
        })
    })
});

module.exports = router;
