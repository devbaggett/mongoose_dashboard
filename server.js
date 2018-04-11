var express = require("express");
var path = require("path");
var session = require('express-session');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var moment = require('moment');

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

// basic_mongoose ends up being our new DB
mongoose.connect('mongodb://localhost/mongoose_dashboard');

var MongooseDashSchema = new mongoose.Schema({
 name: {type: String, required: true, minlength: 2},
 age: {type: Number, required: true}
}, {timestamps: true, versionKey: false});

mongoose.model('Mongoose', MongooseDashSchema); // We are setting this Schema in our Models as 'User'
var Mongoose = mongoose.model('Mongoose') // We are retrieving this Schema from our Models, named 'User'


// use native promises
mongoose.Promise = global.Promise;


app.get('/', function(req, res) {
  Mongoose.find({}, function(err, mongooses){
    res.render("index", {mongooses: mongooses});
  })
});

app.post('/process_add', function(req, res) {
  console.log("POST DATA", req.body);
  var mongoose = new Mongoose(req.body);
  mongoose.save(function(err){
    if (err){
      Mongoose.find({}, function(err, mongooses){
        res.render('index', {errors: mongoose.errors, mongooses: mongooses});
      })
    }
    else{
      res.redirect('/');
    }
  });
})

app.get('/mongooses/:id', function(req, res){
  Mongoose.findOne({_id: req.params.id}, function(err, mongoose){
    res.render("info", {mongoose: mongoose});
  })
})

app.get('/mongooses/edit/:id', function(req, res){
  Mongoose.findOne({_id: req.params.id}, function(err, mongoose){
    res.render('edit', {mongoose: mongoose});
  })
})

app.post('/mongooses/:id', function(req, res){
  Mongoose.update({_id: req.params.id}, {name: req.body.name, age: req.body.age}, {runValidators: true}, function(err){
    if (err){
      res.redirect('/');
    }
    else{
      res.redirect('/');
    }
  })
})

app.post('/mongooses/destroy/:id', function(req, res){
  Mongoose.remove({_id: req.params.id}, function(){
    res.redirect('/');
  })
})

var server = app.listen(8000, function() {
    console.log("listening on port 8000");
});