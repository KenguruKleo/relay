import cluster from 'cluster';
import os from 'os';
import server from './server';

const workers = {};
let requests = 0;

const numCPU = os.cpus().length;

/** addWorker */
const addWorker = ({ cluster, workers }) => {
  const worker = cluster.fork();
  const pid = worker.process.pid;
  worker.on('message', message => {
    if (message.cmd === 'incrementRequestTotal') {
      requests++;
      Object.keys(workers)
        .forEach(pid =>  {
          const worker = workers[pid];
          worker.send({
            cmd: 'updateOfRequestTotal',
            requests,
          });
        });
    }
  });
  return { pid, worker };
};

if (cluster.isMaster) {
  console.log(`Start: ${process.pid}, isMaster: ${cluster.isMaster}`);
  for (let i = 0; i < numCPU; i++) {
    const { pid, worker } = addWorker({ cluster, workers });
    workers[pid] = worker;
  }
  cluster.on('exit', (worker, code, signal) => {
    const pid = worker.process.pid;
    delete workers[pid];
    console.log('Worker %s died.', pid);

    const { pid: newPid, worker: newWorker } = addWorker({ cluster, workers });
    workers[newPid] = newWorker;
    console.log('Restart new worker with pid: %s', newPid);
  });
} else {
  server();
}
