const { Worker, isMainThread, parentPort } = require('worker_threads');

if (isMainThread) { // thread principal
  const worker1 = new Worker(__filename);
  const worker2 = new Worker(__filename);

  let totalMessages = 0;
  const maxMessages = 5;

  worker1.on('message', (message) => {
    console.log('Thread 1 diz:', message);
    totalMessages++;

    if (totalMessages < maxMessages) {
      setTimeout(() => worker2.postMessage('Olá da Thread 1'), 500);
    } else {
      console.log('Encerrando.');
      worker1.terminate();
      worker2.terminate();
    }
  });

  worker2.on('message', (message) => {
    console.log('Thread 2 diz:', message);
    totalMessages++;

    if (totalMessages < maxMessages) {
      setTimeout(() => worker1.postMessage('Olá da Thread 2'), 500);
    } else {
      console.log('Encerrando.');
      worker1.terminate();
      worker2.terminate();
    }
  });

  worker1.postMessage('Iniciar');
} else { // threads secundária
  parentPort.on('message', (message) => {
    console.log('Threads secundaria diz:', message);
    setTimeout(() => parentPort.postMessage('Olá da Thread Secundaria'), 500);
  });
}
