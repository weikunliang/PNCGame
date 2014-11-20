// Bring in ("require") modules that will be needed in this app.
var express = require('express'), // web application framework
    morgan  = require('morgan');  // middleware for logging

// Create a class that will be our main application
var SimpleStaticServer = function() {

  // set self to the scope of the class
  var self = this;  
  
  self.app = express();
  self.app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://www.andrew.cmu.edu");
    next();
   });

  self.app.use(morgan('[:date] :method :url :status'));	// Log requests
  self.app.use(redirectHTTPS);
  self.app.get('/fooworld', function(req,res) { res.send("<h1>fooworld</h1>"); });
  self.app.use(express.static(__dirname+'/public'));	// Process static files

  // Start the server, the key action being beginning to listen for requests
  self.start = function() {
    /*
     * OpenShift will provide environment variables indicating the IP 
     * address and PORT to use.  If those variables are not available
     * (e.g. when you are testing the application on your laptop) then
     * use default values of localhost (127.0.0.1) and 33333 (arbitrary).
     */
    self.ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
    self.port      = process.env.OPENSHIFT_NODEJS_PORT || 33333;

    //  Start listening on the specific IP and PORT
    self.app.listen(self.port, self.ipaddress, function() {
      console.log('%s: Node server started on %s:%d ...',
                        Date(Date.now() ), self.ipaddress, self.port);
    });
  };
}; 

// Main code:  instantiate a SimpleStaticServer and start it running
var sss = new SimpleStaticServer();
sss.start();

function redirectHTTPS(req, res, next) {
        if (req.headers['x-forwarded-proto'] == 'http') { 
            res.redirect('https://' + req.headers.host + req.path);
        } else {
            return next();
        }
    }

