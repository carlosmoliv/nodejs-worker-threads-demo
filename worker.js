const { count } = require('console');
const { parentPort } = require('worker_threads');

let blocking = false;

parentPort.on('message', (msg) => {
  if (msg === 'start') {
    blocking = true;
    const start = Date.now();
    let counter = 0;
    while (Date.now() - start < 50000) {
      counter++;
      if (counter % 100000000 === 0) {
        console.log('Worker thread is busy processing...');
      }
    }
    blocking = false;
    parentPort.postMessage('done');
  } 
});