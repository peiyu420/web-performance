var express = require('express');
var db = require('../db.js');
var comb = require('comb');
var router = express.Router();


router.get('/', function (req, res) {
    db.query("select * from perf.`perf-keys` order by `dept`,`group`;", null, function (err, data) {
        res.render('index', { title: 'index', data: data });
    })

});

router.get('/p/chart', function (req, res) {
    var k = req.query.k;

    res.render('p/chart', {k: k,ck: k.replace(":","_").replace(":","_") });
})
router.get('/p/chart/data', function (req, res) {
    var k = req.query.k;

    db.query("select * from perf.`perf-tp-5m` where `key`=? order by `date` desc limit 10;", k, function (err, data) {

        var tp999 = new Array();
        var tp99 = new Array();
        var tp90 = new Array();
        var tp50 = new Array();
        var call = new Array();
        var date = new Array();
        for (var n in data) {
            var m = data[n];
            date.push(comb.date.format(m.date, "yyyy-MM-dd H:m:s"));
            tp999.push(m.tp999);
            tp99.push(m.tp99);
            tp90.push(m.tp90);
            tp50.push(m.tp50);
            call.push(m.call);
        }
        res.send({h: {tp999: tp999.reverse(), tp99: tp99.reverse(), tp90: tp90.reverse(), tp50: tp50.reverse(), call: call.reverse()}, d: date.reverse()});
    })
})
router.get('/p/d', function (req, res) {
    res.render('p/d');
})
router.post('/p/keys', function (req, res) {

    db.query("select * from perf.`perf-keys` order by `dept`,`group`;", null, function (err, data) {
        var a = new Array();
        var d = {};
        for (var n  in data) {
            var m = data[n];
            if (!d[m.dept]) {
                d[m.dept] = {};
            }
            if (!d[m.dept][m.group]) {
                d[m.dept][m.group] = new Array();
            }
            d[m.dept][m.group].push(m.key);
        }
        for (var n in d) {
            var m = d[n];
            var t = {};
            t["text"] = n;
            t["children"] = new Array();
            for (var o in m) {
                var w = {};
                var q = m[o];
                w["text"] = o;
                w["children"] = new Array();

                //last node
                for (var e in q) {
                    var r = {};
                    var k = n + ":" + o + ":" + q[e];
                    r["text"] = q[e];
                    r["attributes"] = {
                        "url": "/p/chart?k=" + k,
                        desp: k
                    }
                    w["children"].push(r);
                }
                t["children"].push(w);
            }
            a.push(t);
        }
        res.send(a);
    })
});

module.exports = router;
