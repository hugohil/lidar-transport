#!/usr/bin/env node

import process from 'process';

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { io } from "socket.io-client";

const argv = yargs(hideBin(process.argv)).argv;
const addr = argv.address || '127.0.0.1';
const port = argv.port || 3000;
const name = argv.name || 'lidar-transport';
const fps = argv.fps || 30;

const socket = io(`ws://${addr}:${port}`, { query: { name } });

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

let fulldatas = null;
let rawdatas = '';

process.stdin.setEncoding('utf-8');
process.stdin.on('data', (chunk) => {
  rawdatas += chunk;

  fulldatas = rawdatas?.match(re);
});

function transmit () {
  if (fulldatas?.length) {
    rawdatas = '';
    const datas = fulldatas[0].match(/\-?\d+\.\d+/gmi);

    const angles = datas?.filter((d, i) => (i % 2 === 0));
    const distances = datas?.filter((d, i) => (i % 2 === 1));

    const lidar = angles?.map((angle, i) => {
      const a = Number(d2r(angle));
      const d = Number(distances[i] ?? 0);
      const { x, y } = p2c(d, a);

      return {
        a,
        d,
        x: Number(x.toFixed(2)),
        y: Number(y.toFixed(2))
      }
    }) ?? [];

    socket.emit('data', lidar);
  }
}

setInterval(transmit, (1000 / fps));
