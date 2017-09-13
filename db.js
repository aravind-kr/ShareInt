var mongoose = require('mongoose');

var User = mongoose.Schema({
    id : Number,
    Name: String,
    password : String,
    emailId: String
});
var UserModel = mongoose.model('UserModel',User,"users");

var Interest = mongoose.Schema({
    Id : Number,
    UserId : Number,
    Title : String,
    Text : String,
    Date : {type : Date , default : Date.now()},
    Likes : Number,
    Comment : [{UserName : String, Text : String}]
});

var InterestModel = mongoose.model('InterestModel',Interest,"Interest");

var HostString = "mongodb://<dbuser>:<dbpassword>@ds121222.mlab.com:21222/shareint";
mongoose.connect(HostString,{useMongoClient : true});


