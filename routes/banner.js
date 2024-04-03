const express = require('express');
const router = express.Router();
const pool  = require('../config/connection');
const fs = require('fs');
const { Buffer } = require('node:buffer');

router.get('/', (req,res) => {
    pool.query(`select *
                from banner
                order by banner.UpdatedOn desc;`
    , function (err, result, fields) {
            if (err) throw err;
            res.send(result);
            res.end();
    });
});

router.get('/active', (req,res) => {
    pool.query(`select *
                from   banner
                where  banner.isactive = 1;`
    , function (err, result, fields) {
            if (err) throw err;
            res.send(result);
            res.end();
    });
});

router.get('/:id',(req,res) =>{
    pool.query(`select *
                from banner
                where banner.Id = ${req.params.id};`
    , function (err, result, fields) {
            if (err) throw err;
            res.send(result);
            res.end();
          });
});



router.post('/',(req,res) => {
        pool.query(`select 1
                   from   banner
                   where  banner.Id = ${req.body.Id};`
        ,function(err,result,feilds){
            if (err) throw err;
            if(result.length > 0){
                    pool.query(`UPDATE banner
                               SET    banner.title = '${req.body.Title}'
                               ,      banner.description = '${req.body.Description}'
                               ,      banner.blogid = ${req.body.BlogId}
                               ,      banner.isActive = ${req.body.IsActive}
                               ,      banner.updatedBy = NULL
                               ,      banner.updatedOn = current_date()
                               WHERE  banner.id = ${req.body.Id};`
                , function (err, result, fields) {
                        if (err) throw err;
                        });
            }
            else{
                pool.query(`INSERT INTO banner
                            (Id,
                            Title,
                            Description,
                            BlogId,
                            IsActive,
                            CreatedBy,
                            CreatedOn,
                            UpdatedBy,
                            UpdatedOn)
                            VALUES
                            (NULL,
                            '${req.body.Title}',
                            '${req.body.Description}',
                            ${req.body.BlogId}, 
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
            if(req.body.bannerImage){
                let base64 = req.body.bannerImage.split(",")[1];
                let buffer = Buffer.from(base64, 'base64');
                fs.writeFile(`public/images/banner-${req.body.Id}.png`,buffer,(err)=>{
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
