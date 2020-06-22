const { desktopCapturer } = require('electron');
vid = document.getElementById('source-vid');
let stream;

let width = 1000;
let height = 400;
(async function() {
  var screenCount = 1;
  desktopCapturer.getSources({ types: ['screen'] }).then(async screens => {
    for (screen in screens) {
      navigator.mediaDevices
        .getUserMedia({
          video: {
            mandatory: {
              chromeMediaSource: 'desktop',
              minWidth: 1000
            }
          }
        })
        .then(async stream => {
          vid.srcObject = await stream;
          var canvas = [];
          for (let index = 0; index < screenCount; index++) {
            x = document.createElement('canvas');
            y = document.createElement('video');
            x.height = 900;
            x.width = 1600;
            console.log(stream);
            c = x.getContext('2d');
            while (true) {
              c.drawImage(stream, 0, 0, 1600, 900, 0, 0, 1600, 900);
            }
            y.srcObject = x.captureStream();
          }
        });
    }
  });
})();
