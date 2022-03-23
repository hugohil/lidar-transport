import Tail from 'tail-file';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { io } from "socket.io-client";

const argv = yargs(hideBin(process.argv)).argv;
const addr = argv.address || '127.0.0.1';
const port = argv.port || 3000;
const fifofile = argv.fifofile || '/tmp/pidar';

const socket = io(`ws://${addr}:${port}`);

const re = /S;(.+)E;/gmi;

// convert from polar space to cartesian space
function p2c (r, theta) {
  return {
    x: r * Math.cos(theta),
    y: r * Math.sin(theta)
  }
};

function d2r (deg) {
  return deg * (Math.PI / 180);
}

const tail = new Tail(fifofile);

tail.on('error', err => { throw(err) });
tail.on('line', line => {
  const res = data.match(re);

  if (res) {
    const datas = res[0].match(/\-?\d+\.\d+/gmi);

    const angles = datas?.filter((d, i) => (i % 2 === 0));
    const distances = datas?.filter((d, i) => (i % 2 === 1));

    const lidar = angles?.map((angle, i) => {
      const a = Number(d2r(angle));
      const d = Number(distances[i] ?? 0);
      const { x, y } = p2c(d, a);

      return {
        x: Number(x.toFixed(2)),
        y: Number(y.toFixed(2))
      }
    }) ?? [];

    socket.emit('data', lidar);
  }
});
tail.on('ready', fd => console.log('All line are belong to us') );
tail.on('eof', pos => console.log('Catched up to the last line') );
tail.on('skip', pos => console.log('file suddenly got replaced with a large file') );
tail.on('secondary', filename => console.log(`myfile.log is missing. Tailing ${filename} instead`) );
tail.on('restart', reason => {
  if( reason == 'PRIMEFOUND' ) console.log('Now we can finally start tailing. File has appeared');
  if( reason == 'NEWPRIME' ) console.log('We will switch over to the new file now');
  if( reason == 'TRUNCATE' ) console.log('The file got smaller. I will go up and continue');
  if( reason == 'CATCHUP' ) console.log('We found a start in an earlier file and are now moving to the next one in the list');
});

tail.start();
