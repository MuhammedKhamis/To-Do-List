var express = require('express');
var fs = require("fs");
var session = require("express-session");
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var wrongLogin = false;
var wrongRegister = false;
var successRegister = false;
//var authenticatedUser= null ;
var urlencodedParser = bodyParser.urlencoded({ extended: true });
//app.locals.info = require('./users.json');
app.use(session({secret:"sdlkfasfsln23ksa20nvaoqz",resave:false,saveUninitialized:true}));
app.get('/index.html', function (req, res) {

	if (req.session.user == null){
		res.redirect('http://127.0.0.1:8081/');
	}
	else {
		res.sendFile( __dirname + "/" + "index.html" );
	}
});

app.get('/', function (req, res) {
	if (req.session.user != null){
		res.redirect('http://127.0.0.1:8081/index.html');
	}
	else {
		fs.readFile( __dirname + "/" + "welcome.html", 'utf8', function (err, data) {
		res.end( data );
	    });
	}
});

app.use(express.static(path.join(__dirname + "/" + "..")));

app.post('/request',urlencodedParser, function(req, res){
	res.send([wrongLogin, wrongRegister, successRegister]);
	wrongLogin = false;
	wrongRegister = false;
	successRegister = false;
});

app.post('/ajaxRequest2',urlencodedParser, function(req, res){
	
	if (req.session.user != null){
			fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
				if (err){
					res.redirect('http://127.0.0.1:8081/');
				}
				data = JSON.parse( data );
				var n = "Logged in as: " + data[req.session.user].name;
				//console.log(n);
				//console.log(req.body.name);
				//console.log("added");
				if (n != req.body.name){
					res.redirect('http://127.0.0.1:8081/');
				}
				else {
					if (req.body.tasks == "null"){
						data[req.session.user].info = [];
					}
					else
						data[req.session.user].info = req.body.tasks;
					fs.writeFile(__dirname + "/" + "users.json",JSON.stringify(data), function (err) {
						if (err) return console.log(err);
					});
				}
			});
		
	}
});

app.post('/ajaxRequest',urlencodedParser, function(req, res){
	
	if (req.session.user != null){
		fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
			data = JSON.parse( data );
			res.send([data[req.session.user].info, data[req.session.user].name]);	
		});
	}
	else {
		res.send([]);
	}
});

app.post('/logout', urlencodedParser, function (req, res) {
	req.session.user = null;
	res.redirect('http://127.0.0.1:8081/');
});

app.post('/login', urlencodedParser, function (req, res) {
	if (req.session.user != null){
		res.redirect('http://127.0.0.1:8081/index.html');
	}
	else {
		email = req.body.email;
		password = req.body.password;
		fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
			// Note that err here is for handling any error occuring in opening the file
			data = JSON.parse( data );
			var flag = 0;
			var authenticatedUser = null;
			for (var user in data) {
				if(email.toLowerCase() == data[user].email.toLowerCase() && password==data[user].password){flag = 1; authenticatedUser = user; break;}
				else{flag = 0;  }
			}
			if(flag == 1){
				req.session.user = authenticatedUser;
				res.redirect('http://127.0.0.1:8081/index.html');
				
			}
			// Handle invalid login by redirecting the user to the login page once again
			else{
				wrongLogin = true;
				res.redirect('http://127.0.0.1:8081/');
				//res.sendFile( __dirname + "/" + "welcome.html" );
			}
		});
	}
});
app.post('/register',urlencodedParser,function(req,res){
    nameInput = req.body.firstname;
	emailInput = req.body.email;
	passwordInput = req.body.password;
	var user = {
		"name" : nameInput,
		"email" : emailInput,
		"password" : passwordInput,
        "info":[] 
	};
	fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
		if(err){
			console.log(err);
		}
		var i=0;
		data = JSON.parse( data );
		var flag = false;
		for(var counter in data){
			if (data[counter].email.toLowerCase() == emailInput.toLowerCase()){
				flag = true;
			}
			i++ ;
		}
		if (flag){
			wrongRegister = true;
			res.redirect('http://127.0.0.1:8081/');
		}
		else {
			data[i] = user;
			//res.end( JSON.stringify(data));
			fs.writeFile(__dirname + "/" + "users.json",JSON.stringify(data), function (err) {
				if (err) return console.log(err);
				successRegister = true;
			});
			res.redirect('http://127.0.0.1:8081/index.html');
		}
	});
});

app.get('*', function(req, res){
	res.sendFile( __dirname + "/" + "404.html" );
});

var server = app.listen(8081, function () {
var host = server.address().address
var port = server.address().port
console.log("Example app listening at http://%s:%s", host, port) })
