import fs from 'fs';
import { io } from "socket.io-client";

const socket = io('http://192.168.2.139:3000');

const re = /S;(.+)E;/gmi;

import { Tail } from 'tail';

const tail = new Tail('/tmp/pidar');
tail.on('line', (data) => {
  const res = data.match(re);
  res && socket.emit('data', res[0]);
});
