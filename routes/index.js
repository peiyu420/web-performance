var express = require('express');
var db = require('../db.js');
var router = express.Router();


router.get('/', function (req, res) {

    db.query("select * from perf.`perf-keys` order by `dept`,`group`;", null, function (err, data) {
        res.render('index', { title: 'index', data: data });
    })

});
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
                for (var e in q) {
                    var r = {};
                    r["text"] = q[e];
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