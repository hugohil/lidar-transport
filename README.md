# fifo-lidar-transport installation

## toolbox

- [headless ssh raspberry setup](https://desertbot.io/blog/headless-raspberry-pi-4-ssh-wifi-setup)

## example setup:

- hostname: `pidar-00`

# step 1 → get LiDAR datas

on a fresh raspberry pi os installation, with your LiDAR plugged:

```bash
$ mkdir sources && cd $_
$ git clone git@github.com:hugohil/rplidar_sdk.git
$ cd rplidar_sdk
$ make
$ cd output/Linux/Release/
$ ./fifo-lidar --port /dev/ttyUSB0 115200 /tmp/pidar

# open an other terminal window and connect to pidar-00
$ tail -f /tmp/pidar
```

you should see logs in the following format:

```
S;...{angle;distance;}E;

for example:
S;0.543823;315.000000;1.043701;318.000000;1.955566;0.000000;2.120361;323.000000;3.081665;[...];357.385254;298.000000;357.890625;301.000000;358.401489;304.000000;358.967285;307.000000;359.467163;310.000000;359.983521;312.000000;E;
```

# step 2 → open an endpoint for remote access to LiDAR datas

### install `vim`, `zsh` (oh-my-zsh) and `node`

```bash
# install vim
$ sudo apt-get install vim
# install zsh
$ sudo apt-get install zsh
$ chsh -s /bin/zsh
$ sh -c "$(wget https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh -O -)"
# install node via nvm
$ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
$ exec zsh # restart your shell
$ nvm install --lts
```

### make the connection

in the **raspberry**:

```bash
$ cd ~/sources
$ git clone git@github.com:hugohil/fifo-lidar-transport.git
```

with fifo-lidar running, in another terminal window, run the client script

```bash
$ cd fifo-lidar-transport/
$ npm i
$ node client.mjs --address="127.0.0.1" --port=3000 --fifofile="/tmp/pidar" # these are the default values
```

in the target computer, clone the [fifo-lidar-transport](https://github.com/hugohil/fifo-lidar-transport) repo as well and run the `sio-server.mjs` script.
