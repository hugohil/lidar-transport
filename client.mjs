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

// convert from polar space to cartesian space
function p2c (r, theta) {
  return {
    x: r * Math.cos(theta),
    y: r * Math.sin(theta)
  }
};

const tail = new Tail(fifofile);
tail.on('line', (data) => {
  const res = data.match(re);

  if (res) {
    const datas = res[0].match(/\-?\d+\.\d+/gmi);

    const angles = datas?.filter((d, i) => (i % 2 === 0));
    const distances = datas?.filter((d, i) => (i % 2 === 1));
    const lidar = angles?.map((angle, i) => {
      const a = Number(angle);
      const d = Number(distances[i] ?? 0);
      const { x, y } = p2c(d, a);
      return {
        x: Number(x.toFixed(2)),
  y: Number(y.toFixed(2)),
  a: Number(a.toFixed(2)),
  d: Number(d.toFixed(2))
      }
    }) ?? [];

    socket.emit('data', lidar);
  }
});