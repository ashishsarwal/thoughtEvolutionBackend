
const express = require('express');
const router = express.Router();
const pool  = require('../config/connection');

router.get('/', (req,res) => {

        pool.query(`select *
                   from topic;`
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
                        res.status(200).send('Topic created succesfully!');
                        res.end();
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
                        res.status(200).send('Topic created succesfully!');
                        res.end();
                        });
            }
        })
    });
    
module.exports = router;
