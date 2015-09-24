const config = require('./config');

function init() {
  require('./console-hook').hook();
  console.log(' ' + '==>' + ' ' + 'HOOK CONTROLLER ACTIVE');

  require('./server').serverUp();
  console.log(' ' + '==>' + ' ' + 'SERVER CONFIGURATIONS ACTIVE');

  require('./config').port;
  console.log(' ' + '==>' + ' ' + 'SERVER PORT ACTIVE ON' + ' ' + config.port);

  require('./config').s3;
  console.log(' ' + '==>' + ' ' + 'S3 PARARMS NOT SET');

  require('./config').s3_enabled;
  console.log(' ' + '==>' + ' ' + 'S3 CONNECTION INACTIVE');

  require('./config').upload_dir;
  console.log(' ' + '==>' + ' ' + 'UPLOAD DIR PATH IS:' + ' ' + config.upload_dir);

  require('./router').routesReady();
  console.log(' ' + '==>' + ' ' + 'ROUTER CONFIGURATIONS ACTIVE');

  require('./controller').launch();
  console.log(' ' + '==>' + ' ' + 'SERVER ACTIVE');

  require('./rend').renderProc();
  console.log(' ' + '==>' + ' ' + 'RENDER PROCESS ACTIVE!!!!!');
}

module.exports = {
  init
};
