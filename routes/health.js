module.exports = function (db, total, totalDoc, motors, healthCheck) {
    const express = require('express');
    const router = express.Router();

    router.get('/', function(req, res, next) {
        res.render('health.html');
    });

    router.get('/findmotors', function (req, res, next) {
        let motor = motors.find();
        db.on("error", function(errDoc) {
            res.send({status: 500});
        });
        res.send(motor);
    });

    router.post('/motorupdates', function (req, res, next) {
        // let flag = false;
        // while (!flag) {
        //     const changes = db.serializeChanges(['motors']);
        //     if (changes.length > 0) {
        //         const result = JSON.parse(changes);
        //         motors.flushChanges();
        //         flag = true;
        //     }
        //     if (flag) {
        //         res.send({data: result});
        //     }
        // }
        const changes = db.serializeChanges(['motors']);
        if (changes.length > 0) {
            const result = JSON.parse(changes);
            motors.flushChanges();
            res.send({data: result});
        } else {
            res.send({data: null});
        }
    });

    router.post('/fixmotor', function (req, res, next) {
        let motorDoc = motors.by('mno', parseInt(req.body.mno));
        motorDoc.speed = 5;
        let healthDoc = healthCheck.by('mno', parseInt(req.body.mno));
        healthDoc.speed = 5;
        motors.update(motorDoc);
        healthCheck.update(healthDoc);
        res.send({mno: motorDoc.mno, speed: motorDoc.speed});
    });

    return router;
};
