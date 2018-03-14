module.exports = function (db, total, totalDoc, motors, healthCheck) {
    const express = require('express');

    const router = express.Router();

    router.get('/', function(req, res, next) {
        res.render('index.html');
    });

    router.get('/findmotors', function (req, res, next) {
        let motor = motors.find();
        db.on("error", function(errDoc) {
            res.send({status: 500});
        });
        res.send(motor);
    });

    router.post('/addmotor', function (req, res, next) {
        let no = total.findOne({name: 'motors'}).no;
        motors.insert({
            mno: no + 1,
            speed: 5,
            captureSpeeds: [5]
        });
        healthCheck.insert({
            mno: no + 1,
            speed: 5
        });
        totalDoc.no = no + 1;
        total.update(totalDoc);
        res.send({mno: no + 1, speed: 5});
    });

    router.post('/motorupdates', function (req, res, next) {
        // let flag = false;
        // while (!flag) {
        //     const changes = db.serializeChanges(['health']);
        //     if (changes.length > 0) {
        //         const result = JSON.parse(changes);
        //         healthCheck.flushChanges();
        //         flag = true;
        //     }
        //     if (flag) {
        //         res.send({data: result});
        //     }
        // }
        const changes = db.serializeChanges(['health']);
        if (changes.length > 0) {
            const result = JSON.parse(changes);
            healthCheck.flushChanges();
            res.send({data: result});
        } else {
            res.send({data: null});
        }
    });

    router.post('/onmotor', function (req, res, next) {
        let motorDoc = motors.by('mno', parseInt(req.body.mno));
        motorDoc.speed = 5;
        let healthDoc = healthCheck.by('mno', parseInt(req.body.mno));
        healthDoc.speed = 5;
        motors.update(motorDoc);
        healthCheck.update(healthDoc);
        res.send({mno: motorDoc.mno, speed: motorDoc.speed});
    });

    router.post('/offmotor', function (req, res, next) {
        let motorDoc = motors.by('mno', parseInt(req.body.mno));
        motorDoc.speed = 0;
        let healthDoc = healthCheck.by('mno', parseInt(req.body.mno));
        healthDoc.speed = 0;
        motors.update(motorDoc);
        healthCheck.update(healthDoc);
        res.send({mno: motorDoc.mno, speed: motorDoc.speed});
    });

    router.post('/incmotor', function (req, res, next) {
        let motorDoc = motors.by('mno', parseInt(req.body.mno));
        motorDoc.speed += 1;
        let healthDoc = healthCheck.by('mno', parseInt(req.body.mno));
        healthDoc.speed += 1;
        motors.update(motorDoc);
        healthCheck.update(healthDoc);
        res.send({mno: motorDoc.mno, speed: motorDoc.speed});
    });

    router.post('/decmotor', function (req, res, next) {
        let motorDoc = motors.by('mno', parseInt(req.body.mno));
        motorDoc.speed -= 1;
        let healthDoc = healthCheck.by('mno', parseInt(req.body.mno));
        healthDoc.speed -= 1;
        motors.update(motorDoc);
        healthCheck.update(healthDoc);
        res.send({mno: motorDoc.mno, speed: motorDoc.speed});
    });

    router.post('/updatecapturespeeds', function (req, res, next) {
        let motor = motors.find();
        for (let i = 0; i < motor.length; i++) {
            motor[i].captureSpeeds.push(parseInt(req.body['speeds[]'][i]));
        }
        db.on("error", function(errDoc) {
            res.send({status: 500});
        });
        res.send({status: 200});
    });
    return router;
};
