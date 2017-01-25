/*eslint-env node*/
var http = require('http');
var express = require('express');
var mongoose = require('mongoose');
// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

var bodyParser = require('body-parser');
var csrf = require('csurf');
var session = require('client-sessions');

var middleware = require('./middleware');

var schedule = require('node-schedule');
var alert = require('./routes/alert');

//NODE-RED
var RED = require("node-red");
//A1r0$39$39

var redSettings = {
    httpAdminRoot:"/admingui",
    httpNodeRoot: "/api",
    functionGlobalContext: {
        'querystringModule': require('querystring'),
        'httpsModule': require('https')
    } ,   // enables global context
    autoInstallModules: true,
    storageModule: require("./mongostorage"),
    mongoAppname:"196t1lt0h7j",
    httpNodeAuth: {user:"system",pass:"$2a$04$ad3oyKo6sxEQMeQ9sPYW2.LaCInwu3/DMvIpEqFONqPE0F4jvrieG."}
};

// create a new express server
var app = express();

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

var server = http.createServer(app);

/*====================NODE-RED Settings==================================*/
if (process.env.NODE_RED_USERNAME && process.env.NODE_RED_PASSWORD) {
    redSettings.adminAuth = {
        type: "credentials",
        users: [{
            username:"admin",
            password: "$2a$08$zZWtXTja0fB1pzD4sHCMyOCMYz2Z6dNbM6tl8sJogENOMcxWV9DN.",
            permissions: "*"
        }]
    }
}

redSettings.mongoUrl = 'mongodb://airosense:gaurav123@candidate.40.mongolayer.com:11030,candidate.62.mongolayer.com:10315/airosense?replicaSet=set-569dc02968fcabb03d00077b';

// Initialise the runtime with a server and settings
RED.init(server,redSettings);

// Serve the editor UI from /red
app.use(redSettings.httpAdminRoot,RED.httpAdmin);

// Serve the http nodes UI from /api
app.use(redSettings.httpNodeRoot,RED.httpNode);


/*====================Scheduler Settings==================================*/
var rule = new schedule.RecurrenceRule();
rule.minute = new schedule.Range(0, 59, 1);
var j = schedule.scheduleJob(rule, function(){
   console.log("call alert mechanism");
  //alert.alertCheck();
});


/*====================NODE-RED Settings==================================*/

/*====================Express Server setup for login=====================*/
// settings

mongoose.connect(redSettings.mongoUrl);
//app.set('view engine', 'jade');
//app.engine('html', require('jade').renderFile)
// app.js
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
// middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    cookieName: 'session',
    secret: 'keyboard cat',
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000
}));
app.use(csrf());
app.use(middleware.simpleAuth);

// routes
app.use(require('./routes/auth'));
app.use(require('./routes/main'));

/*====================Express Server setup for login=====================*/
// start server on the specified port and binding host
server.listen(appEnv.port, '0.0.0.0', function() {
	// print a message when the server starts listening
    console.log("server starting on " + appEnv.port );
    console.dir(appEnv);
    console.dir(cfenv);
});

RED.start();
