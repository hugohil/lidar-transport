import { Tail } from 'tail';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { io } from "socket.io-client";

const argv = yargs(hideBin(process.argv)).argv;
const addr = argv.address || '127.0.0.1';
const port = argv.port || 3000;
const fifofile = argv.fifofile || '/tmp/pidar';

const socket = io(`ws://${argv.address || 'localhost'}:${argv.port || 3000}`);

const re = /S;(.+)E;/gmi;

const tail = new Tail(fifofile);
tail.on('line', (data) => {
  const res = data.match(re);
  res && socket.emit('data', res[0]);
});
