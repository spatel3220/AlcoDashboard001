var http = require("http");

exports.alertCheck=function (){
  var options = {
    hostname: 'localhost',
    port: 6001,
    path: '/api/aqialert',
    method: 'GET'
  };
  var req = http.request(options, function(res) {
    res.setEncoding('utf8');
    res.on('data', function (body) {
      console.log(body);
    });
  });
  req.on('error', function(e) {
    console.log('problem with request: ' + e.message);
  });

  req.end();
};