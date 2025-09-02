+++
title = 'How I setting a brand new fedora system'
date = 2024-08-02T15:38:13+08:00
draft = false
tags = [ "Linux" ]

+++
# Basic Settings

My personal fedora setup

## Terminal shortcuts

```bash
gnome-terminal
```

## SSH service for winscp/xshell

- install openssh-server

  ```bash
  $ sudo dnf install openssh-server
  ```

- start ssh service to ensure that port 22 is not refused

  ```bash
  $ sudo systemctl start sshd
  ```

  or use the enable command to set this service to start by default

  ```bash
  $ sudo systemctl enable sshd
  ```

- now we can get access to host by  using SSH service

## Soft Link

```bash
$ ln -s src linkname
```

## Valgrind tool package

Installation

```bash
$ sudo dnf install valgrind
```

set shortcuts

```bash
$ vim ~/.bashrc
```

add the following line of code

```bash
valgrind --tool=memcheck --leak-check=full ./a.out
```

add alias

```yaml
alias memcheck='valgrind --tool=memcheck --leak-check=full --show-reachable=yes
```

## PS1 Customize

config the file

```bash
$ vim ~/.bashrc
```

add this:

```bash
export PS1="\[\e[1;35m\]$\[\e[m\] "
```

enable the settings

```bash
$ source ~/.bashrc
```

## Generate Pivate Key

```bash
$ ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```

```bash
$ cd ~/.ssh
```

## Git 

git global config set

```bash
$ git config --global user.name "Your Name"
$ git config --global user.email "your_email@example.com"
```

proxy settings

```bash
git config --global http.proxy http://127.0.0.1:xxxx
git config --global https.proxy http://127.0.0.1:xxxx
```

# Software settings

## SDCV

```bash
$ sudo dnf install sdcv
```

Dowonload dicts at：https://www.nchrs.xyz/stardict/zh_CN/index.html

recommand 朗道英汉字典/ 朗道汉英字典。

dictionaries position: ~/.stardict/dic

```bash
$ mkdir -p ~/.stardict/dic
$ tar -xvf stardict-oxford-gb-2.4.2.tar.bz2 -C ~/.stardict/dic
$ sdcv -l
```

## snippet

```bash
$ cd ~/.vim/plugged/prepare-code/snippet
```

## Markdown settigns

1. inject.

   ```bash
   $ cargo build --bin node-inject --release
   $ mv target/release/node-inject /opt/typora
   $ cd /opt/typora
   $ sudo ./node-inject
   ```

2. generator a license.

   ```bash
   $ cargo run --bin license-gen --release
   ```

3. input license in software.

4. set a desktop shortcuts

   ```bash
   $ cd /usr/share/applications
   $ vim xxx.desktop
   ```

   ```yaml
   [Desktop Entry]
   Version=1.0
   Type=Application
   Name=YourAppName
   Comment=Your application description
   Exec=/path/to/your/executable
   Icon=/path/to/your/icon.png
   Terminal=false
   Categories=Utility;Application;
   ```

5. restart system to see if the software on the desktop

6. set default md application

   ```bash
   $ vim ~/.config/mimeapps.list
   ```

   add one line

   ```bash
   text/markdown=typora.desktop;
   ```

   
