const express = require('express');
const { Worker } = require('worker_threads');

const app = express();
const port = 3000;

app.get('/non-blocking', (req, res) => {
  res.status(200).send('This is a non-blocking endpoint!');
});

app.get('/blocking', (req, res) => {
  console.log('Main thread: Request received for /blocking. Spawning a worker...');

  const worker = new Worker('./worker.js');

  worker.postMessage('start');

  worker.on('message', (message) => {
    if (message === 'done') {
      console.log('Main thread: Worker has completed the task. Sending response.');
      res.status(200).send('Blocking operation completed!');
      worker.terminate();
    }
  });

  worker.on('error', (err) => {
    console.error('Worker error:', err);
    if (!res.headersSent) {
      res.status(500).send('Internal Server Error');
    }
  });

  worker.on('exit', (code) => {
    if (code !== 0) {
      console.error(`Worker stopped with exit code ${code}`);
    } else {
      console.log('Worker thread exited successfully.');
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

