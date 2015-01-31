var mic = require('microphone');

mic.audioStream.on('data', function(data) {
    process.stdout.write(data);
});

mic.infoStream.on('data', function(data) {

});


mic.startCapture();
