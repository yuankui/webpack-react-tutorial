const QRCode = require('qrcode');

QRCode.toString('http://www.baidu.com', {type: 'terminal'}, function (err, url) {
  console.log(url)
});
