# lidar-transport installation

A project for connecting RP LiDAR devices from a raspberry pi to any other device over socket.io.

# usage

```bash
$ git clone git@github.com:hugohil/lidar-transport.git
$ cd lidar-transport/
$ npm i
$ ./bin/linux/print-lidar --port '/dev/ttyUSB0' | ./main.mjs --address="127.0.0.1" --port=3000 # these are the default values
```

> `lidar-transport` comes with prebuild binaries for linux (raspberry pi) and macos only, feel free to make a PR and add builds for other platforms.

# toolbox

> [headless ssh raspberry setup](https://desertbot.io/blog/headless-raspberry-pi-4-ssh-wifi-setup)

## building `print-lidar` from the sources

```bash
$ mkdir sources && cd $_
$ git clone git@github.com:hugohil/rplidar_sdk.git
$ cd rplidar_sdk
$ make
$ cd output/Linux/Release/
$ ./print-lidar --port /dev/ttyUSB0 115200
```

you should see logs in the following format:

```
S;...{angle;distance;}E;

for example:
S;0.543823;315.000000;1.043701;318.000000;1.955566;0.000000;2.120361;323.000000;3.081665;[...];357.385254;298.000000;357.890625;301.000000;358.401489;304.000000;358.967285;307.000000;359.467163;310.000000;359.983521;312.000000;E;
```

> note: angle is in degree (0-360) and distance is in mm.

## install `vim`, `zsh` (oh-my-zsh) and `node`

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