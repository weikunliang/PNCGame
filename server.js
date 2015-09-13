var express = require('express'),
  morgan = require('morgan'),
  path = require('path');

// This app uses the expressjs framework
app = express();
// Log requests
app.use(morgan('[:date] :method :url :status'));
// Process static files which will be found in the public subdirectory
app.use(express.static(path.join(__dirname, 'public')));

/*
 * This simple server will work on your laptop if you have installed
 * Nodejs, or deployed to OpenShift.  OpenShift will provide environment
 * variables indicating the IP address and PORT to use.  If those variables
 * are not available (e.g. when you are testing the application on your
 * laptop) then use default values of localhost (127.0.0.1) and
 * port 33333 (port is an arbitrary choice).
 */
ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
port = process.env.OPENSHIFT_NODEJS_PORT || 33333;

//  Start listening on the specific IP and PORT
app.listen(port, ipaddress, function() {
  console.log('%s: Simple static content server started on %s:%d ...', Date(Date.now()), ipaddress, port);
});
