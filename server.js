var express = require('express');
var app = express();


app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    next();
});

var bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

var Datastore = require('nedb')
    , db = new Datastore({ filename: './db/data.db', autoload: true });


var Info = (function () {
    return function Info(Info) {
        this.name = Info.name;
        this.contact = Info.contact;
        this.telephone = Info.telephone;
        this.number = Info.number;
        this.location = Info.location;
        this.remove = "";
    }
}());

app.post('/add', (req, res) => {
    var data = new Info(req.body);
    db.insert(data, function (err, data) {

        if (err) return res.status(500).send("Database error");
        return res.json(data);
    });
})

app.put('/update', (req, res) => {
    var name = req.body.name;
    var contact = req.body.contact;
    var telephone = req.body.telephone;
    var number = req.body.number;
    var location = req.body.location;
    var id = req.body["_id"];

    db.update({ "_id": id }, { $set: { "name": name, "contact": contact, "location": location, "telephone": telephone, "number": number } }, function (err, numReplaced) {
        return res.json(numReplaced);
    });
})

app.delete('/delete/:id', (req, res) => {
    var id = req.params.id;
    db.remove({ _id: id }, {}, function (err, numRemove) {
        if (err) return res.status(500).send("Database error");
        return res.json(id);
    });
})

app.get('/data', (req, res) => {
    db.find({}, function (err, docs) {
        res.json(docs);
    });
})

app.listen(3000);