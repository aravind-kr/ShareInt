var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var sessions = require('client-sessions');
var jsonDb = require('node-json-db');

var index = require('./routes/index');
var users = require('./routes/users');
var main = require('./routes/main');

var app = express();
//db
var db = require('./db');
var mongoose = require('mongoose');
var UserModel = mongoose.model('UserModel');
var InterestModel = mongoose.model('InterestModel');

// view engine setup
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

//client sessions
app.use(sessions({
    cookieName: 'Session',
    secret: 'largeunguessablestring',
    duration: 24 * 60 * 60 * 1000,
    activeDuration: 1000 * 60 * 5
}));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/main',main);


//request processing
var userId;
var userName;
app.post('/login',function (req,res) {
    console.log(req.body);
    UserModel.find({'emailId' : req.body.email , 'password' : req.body.pwd},function (err,user) {
        if(err)
            console.log(err.message);
       if(user.length != 0){
           InterestModel.find({},function (err,Int) {
               if(err)
                   console.log(err);
               console.log(Int);
               req.session = true;
               userId = user[0].id;
               userName = user[0].Name;
               res.render("main",{
                   "name" : user[0].Name,
                   "title": "ShareInt",
                   "Interest" : Int,
                   "message" : "Successful Login"
               });
           });

       }else{
           res.render("index",{
               "title" : "ShareInt",
              "message" : "Invalid Login Credentials"
           });
       }
    });
});

app.post('/AddInt',function (req,res) {
    console.log(req.body);
    InterestModel.find({},function (err,Interests) {
        var Interest = {
            Id : Interests.length + 1,
            UserId : userId,
            Title : req.body.InterestTitle,
            Text : req.body.InterestText,
            Likes : 0,
            Comment : []
        };
        InterestModel.collection.insert(Interest,function (err) {
            if(err)
                console.log(err);
        });
        res.render("main",{
            "name" : Interests[userId].Name,
            "title": "ShareInt",
            "Interest" : Interests,
            "message" : "Successful Login"
        });
    });
});

app.get('/like/:id',function (req,res) {
    console.log(req.params.id.toString().substring(1));
    InterestModel.findOne({Id : req.params.id.toString().substring(1)},function (err,int) {
        console.log(int);
        int.Likes += 1;
        int.save();
        res.json({
            Id : int.Id,
            Likes : int.Likes
        });
    });
});

app.post('/Comment/:id',function (req,res) {
    console.log(req.params.id.toString().substring(1));
    console.log(req.body);
    InterestModel.findOne({Id : req.params.id.toString().substring(1)},function (err,int) {
        console.log(int);
        int.Comment.push({'UserName' : userName , 'Text' : req.body.CommentText });
        int.save();
    });
    InterestModel.find({},function (err,Interests) {
        res.render("main",{
            "name" : userName,
            "title": "ShareInt",
            "Interest" : Interests,
            "message" : "Successful Login"
        });
    });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
