
const express = require('express');
const router = express.Router();
const pool  = require('../config/connection');
const fs = require('fs');
const { Buffer } = require('node:buffer');

router.get('/', (req,res) => {

        pool.query(`select *
                   from topic
                   order by topic.UpdatedOn desc;`
    , function (err, result, fields) {
            if (err) throw err;
            res.send(result);
            res.end();
          });
});

router.get('/active', (req,res) => {

        pool.query(`select *
                   from    topic
                   where   topic.isactive = 1;`
    , function (err, result, fields) {
            if (err) throw err;
            res.send(result);
            res.end();
          });
});

router.get('/top-5', (req,res) => {

        pool.query(`select *
                   from    topic
                   where   topic.isactive = 1
                   limit   5;`
    , function (err, result, fields) {
            if (err) throw err;
            res.send(result);
            res.end();
          });
});

router.get('/:id',(req,res) =>{
        pool.query(`select *
                   from topic
                   where topic.Id = ${req.params.id};`
    , function (err, result, fields) {
            if (err) throw err;
            res.send(result);
            res.end();
          });
});



router.post('/',(req,res) => {
        pool.query(`select 1
                   from   topic
                   where  topic.Id like ${req.body.Id};`
        ,function(err,result,feilds){
            if (err) throw err;
            if(result.length > 0){
                    pool.query(`UPDATE topic
                               SET    topic.name = '${req.body.Name}'
                               ,      topic.description = '${req.body.Description}'
                               ,      topic.quote = '${req.body.Quote}'
                               ,      topic.isActive = ${req.body.IsActive}
                               ,      topic.updatedBy = NULL
                               ,      topic.updatedOn = current_date()
                               where  topic.id = ${req.body.Id};`
                               
                , function (err, result, fields) {
                        if (err) throw err;
                        });
            }
            else{
                    pool.query(`INSERT INTO topic
                                (Id,
                                Name,
                                Description,
                                Quote,
                                IsActive,
                                CreatedBy,
                                CreatedOn,
                                UpdatedBy,
                                UpdatedOn)
                                VALUES
                                (NULL,
                                '${req.body.Name}',
                                '${req.body.Description}',
                                '${req.body.Quote}',
                                ${req.body.IsActive},
                                NULL,
                                current_date(),
                                NULL,
                                current_date());`
                , function (err, result, fields) {
                        if (err) throw err;
                        });
        }
        //Save image in file path if image is present
        console.log('starting image processing...');
        if(req.body.topicImage){
                console.log('processing image...');
                let base64 = req.body.topicImage.split(",")[1];
                let buffer = Buffer.from(base64, 'base64');
                fs.writeFile(`public/images/topic-${req.body.Id}.png`,buffer,(err)=>{
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
