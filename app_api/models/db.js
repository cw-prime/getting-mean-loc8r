var mongoose = require('mongoose');
var gracefulShutdown;
var dbUri = 'mongodb://localhost/Loc8r';

if (process.env.NODE_ENV === 'production') {
    dbUri = process.env.MONGODB_URI;
}

mongoose.connect(dbUri);

var readline = require('readline');
if (process.platform === "win32") {
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.on("SIGINT", function() {
        process.emit("SIGINT");
    });
}

mongoose.connection.on('connected', function() {
    console.log('Mongoose connected to ' + dbUri);
});

mongoose.connection.on('error', function(err) {
    console.log('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', function() {
    console.log('Mongoose disconnected');
});

var gracefulShutdown = function(msg, callback) {
    mongoose.connection.close(function() {
        console.log('Mongoose disconnected through ' + msg);
        callback;
    })
};

// For Nodemon restarts
process.once('SIGUSER2', function() {
    gracefulShutdown('nodemon restart', function() {
        process.kill(process.pid, 'SIGUSER2');
    });
});

// For app termination
process.once('SIGINT', function() {
    gracefulShutdown('app termination', function() {
        process.exit(0);
    });
});

// For Heroku app termination
process.once('SIGTERM', function() {
    gracefulShutdown('Heroku app shutdown', function() {
        process.exit(0);
    });
});

// BRING IN YOUR SCHEMAS & MODELS
require('./locations');
require('./users');