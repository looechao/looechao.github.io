+++
title = 'Linux学习笔记-24年5月第一组'
date = 2024-05-18T15:38:13+08:00
draft = false
summary = "Linux基础知识-排版待整理"
tags = [ "技术", "Linux"]
+++
# 推荐书籍

the linux command line

linux 系统编程

linux 系统编程接口

APUE 

操作系统导论 - 深入理解操作系统

# 常用命令

## Vim

Vim是一种多模式的编辑器

- Normal（命令模式）

  | 命令类型         | 效果                                                         |
  | ---------------- | ------------------------------------------------------------ |
  | 短命令           | 直接敲                                                       |
  | 底部命令         | 冒号开头，enter结尾                                          |
  | motion(移动光标) | h j k l [n]- [n]G gg 0 ^ $ w/W b/B t/T f/F                   |
  | text object      |                                                              |
  | action           |                                                              |
  | 组合             | action+textobject  <br />action+motion                       |
  | 撤销和恢复       | u（u for undo）<br />[ctrl] + r<br />类比入栈和出栈          |
  | 粘贴             | p/P                                                          |
  | 查找文本         | /pattern 向下查找<br />?pattern 向上查找<br />搭配使用 n/N 移动光标 |
  | 替换             | substitute<br />:s/pattern/replace             替换所在行的第一个匹配项<br />:s/pattern/replace/g         替换所在行的所有匹配项<br />:m,n s/pattern/replace/g 限定范围[m,n]<br />:% s/pattern/replace/g     全文替换 |

  motion:

  ```bash
  h j k l [n]- [n]G gg 0 ^ $ w/W b/B t/T
  ```

  text object:

  ```bash
  d
  y
  c(c for change, 删除并进入到编辑模式)
  ```

- Insert（编辑文本）

  - i 光标前 I 行前 a A o O 区分

- Visual / V-Block （行选/竖选）

  - v 行选Visual
  - [ctrl] + v 竖选V-Block
  - 批量注释 
    - 进入到竖选模式 [ctrl] + v
    - 选择范围
    - 在行首插入 I
    - 按ESC完成注释

### 基本操作

移动(motion)

| 按键      | 操作       |
| --------- | ---------- |
| O         | 行首       |
| $         | 行尾       |
| w(word)   | 下一个词首 |
| b(before) | 上一个词首 |

动作(action)

| 按键      | 操作               |
| --------- | ------------------ |
| d         | delete             |
| y         | yank               |
| c(change) | 删除并进入插入模式 |

组合操作：action+motion

撤销恢复和删除

查找

```bash
/pattern    向下查找 n下一个匹配项  N 上一个匹配项
```

```bash
?pattern    向上查找
```

替换

```bash
:s/pattern/replace/g
:5,100s/pattern/replace/g   指定范围进行替换
:%s/pattern/replace/g    全文替换
```

多窗口

| 类型     | 操作                 |
| -------- | -------------------- |
| 水平分割 | :split /:sp :new     |
| 垂直分割 | :/vsplit /:vsp :vnew |
| 切换窗口 | [ctrl]+ww            |
| 退出窗口 | :q :only :qa         |
| 保存     | :W :wa               |

## Linux 

### 体系结构

- 内核（kernal）

  - 管理硬件资源
    - CPU -> 进程调度模块
    - 内存 -> 内存管理模块
    - 外部设备 -> 文件管理，网络通信，设备驱动
  - 对上层应用程序提供接口->系统调用

- 系统调用（system calls）

  - 内核给上层应用程序提供的接口

- 库函数（library functions）

  - 对系统调用的包装

    | 给用户的接口 | 包装的系统调用 |
    | ------------ | -------------- |
    | malloc       | sbrk           |
    | printf       | write          |

    不同系统相同功能的系统调用是不同的，封装包装好系统调用有以下优点

    - 方便使用
    - 可移植

### Linux用户

| 用户类型 |                     权限                     |
| :------: | :------------------------------------------: |
|   root   |    超级用户，（皇帝，拥有至高无上的权限）    |
| sudoers  | 管理员用户，（太监，可以用sudo临时提高权限） |
| 普通用户 |                     平民                     |

- 创建用户

  ```bash
  useradd
  ```

- 删除用户

  ```bash
  userdel
  ```

- 修改用户密码

  ```bash
  passwd
  ```

- 切换用户

  ```bash
  su
  ```

- 退出切换

  ```bash
  exit
  ```

- 查看所用用户

  ```bash
  sudo cat /etc/passwd
  ```

- 添加用户

  ```bash
  useradd [options] username
  ```


## 文件子系统

Windows以程序划分文件，而Linux是按照功能划分文件位置，分门别类的管理

| 目录名          | 功能                                        |
| --------------- | ------------------------------------------- |
| /bin(binary)    | 存放可执行文件                              |
| /sys(system)    | 存放系统文件                                |
| /dev(device)    | 设备文件                                    |
| /etc            | 配置文件（passwd放用户信息/shadow存放密码） |
| /lib(library)   | 库文件                                      |
| /var(variable)  | 日志文件等会发生变化的文件                  |
| /proc(process)  | 进程文件                                    |
| /root           | 根目录                                      |
| /home(username) | 普通用户的家目录                            |



```bash
 [                      /                              ]
  
 [bin]   [sys] [dev]  [etc]  [lib]  [var]  [root] [home]   
                        /   \                        |
                       /     \                       |
                   [passwd]  [shadow]             [a.txt] -> inode -> 物理地址
                    
```

### 通配符

通配符（wildcard character）: **用于匹配文件名字**，注意与正则表达式的区别，正则表达式是用于匹配文件内容的。

```bash
*: 匹配任意多个字符，包括0个
?: 匹配任意一个字符
集合（类）: 
[ characters] 匹配集合内任意一个字符
[!characters] 匹配集合外任意一个字符
[abc] [!abc] [0-9] [a-z] [A-z]
```

```bash
[looechao@fedora linux02]$ tree
.
├── dira
├── diraaa
├── dirb
├── dirbbb
├── dirc
├── dirccc
├── dirxxx
├── diryyy
└── dirzzz

10 directories, 0 files
[looechao@fedora linux02]$ rmdir dir*
[looechao@fedora linux02]$ tree
.
[looechao@fedora linux02]$ 
```



- 匹配任意多个字符
- 匹配任意一个字符

### ls命令

| 常用选项 |                      作用                      |
| :------: | :--------------------------------------------: |
| list -i  |    显示inode编号，inode是物理文件的唯一标识    |
| list -l  |    long format，用长格式显示每个目录的内容     |
| list -h  | 常和-l一起使用，以人类可读的方式显示文件的大小 |

```bash
[looechao@fedora ~]$ ls -l
总计 0
drwxr-xr-x. 1 looechao looechao   0  4月25日 14:33 公共
drwxr-xr-x. 1 looechao looechao   0  4月25日 14:33 模板
drwxr-xr-x. 1 looechao looechao  12  4月26日 18:56 视频
drwxr-xr-x. 1 looechao looechao  12  4月26日 18:56 图片
drwxr-xr-x. 1 looechao looechao   0  4月25日 14:33 文档
drwxr-xr-x. 1 looechao looechao 324  5月13日 14:19 下载
drwxr-xr-x. 1 looechao looechao   0  4月25日 14:33 音乐
drwxr-xr-x. 1 looechao looechao   0  4月25日 14:33 桌面

第一个字符文件类型
    -: 普通文件  d(dir):目录  c(character):字符设备文件，键盘屏幕 b(block): 块设备文件（磁盘 u盘）
    p(pipe): 有名管道  -s(socket):本地套接字  -l(link):符号链接
剩余的九个字符：权限
    文件拥有者usr:rw-
    文件所有组group:rw-
    其他人others: r--
```

### 创建目录

```bash
mkdir -p  创建目录
rmdir -p  删除目录
打印当前目录
pwd
切换当前目录
cd - . / ~  上一次目录保存在OLDPWD环境变量中
复制
cp src dst 复制文件
cp -r src dst 递归复制目录
cp src .. srcn dst 将多个文件复制到某个目录下
cp -n 不抢夺
cp -i 交互式方式询问
```

### mv命令

```bash
mv text1 text2

[text1]   [text2]                [text2]
   \      /             ->          |
   [inode]                       [inode]
  
```

```bash
mv text1 dir
```

### 别名

```bash
alias cd = 'rm -rf'
```

### 创建文件

- 创建空文件

  ```bash
  touch
  ```

- 创建文件并输入简短的内容

  ```bash
  echo
  ```

- 编辑文件

  ```bash
  vim
  ```

### 查找

find命令

```bash
find . -empty   找到空的文件和文件夹
find . -user root 根据用户名称进行查找
find . -uid root  根据用户id进行查找
find . -perm 775 读写执行 读执行 根据权限查找
```

关于时间

- a(access) 文件访问时间
- c(change) 文件属性发生改变的时间
- m(modigy) 文件内容发生改变的时间
- min 以分钟为单位
- time 以天为单位

```bash
find . -mtime 1
find . -mmin 2
find . -mmin +2
find . -mtime 1 一到两天内发生过内容修改的文件
```

组合查找

```bash
find /dev -type c -a -name "tty*"
find /dev -type b -o -name "tty*"
find /dev -type c -a !-name "tty*"
```



### 查看

cat 和 head

```
head -n 5 bible
tail -n +5 bible
```

less 单页浏览文件

```
less bible
```

### 重定向

| 标准流 | 文件描述符 | 重定向符号 |
| ------ | ---------- | ---------- |
| stdin  | 0          | <          |
| stdout | 1          | >和>>      |
| stderr | 2          | 2>或2>>    |

```bash
 > 覆盖重定向
>> 追加重定向
[ctrl] + D 输入EOF
```

```bash
wc users   
          键盘 stdin-[程序] 
                    /  
          文件  [  ]
wc < users

```

### grep

用于搜索文件内容 globally search for a regular expression, 如果文件中某一行匹配指定的正则表达式，grep命令会显示这一行

```bash
grep -E 使用拓展的正则表达式
grep -i ignore忽略大小写
grep -v --invert-match显示不匹配正则表达式的行
grep -c 统计包含查找值的行数
```

### 正则表达式

1. 基本单位

   - 字符
   - 转义字符
   - 集合

2. 基本操作

   操作对象是基本单位

   - 连接:

     | 操作   | 效果      |
     | ------ | --------- |
     | ab     | ab        |
     | [abc]x | ax bx cx  |
     | .txt   | atxt btxt |

   - 重复:  

     指前面的基本单位重复的次数

     - ‘+’ 重复至少一次     "[abc]+" "abc+" "(abc)+"
     - ‘？’重复零次或一次 "abc?" "[abc]?" "(abc)?"
     - ‘*’  重复任意次数    

   - 指定基本位置

## 命令组合

1. cmd1; cmd2

   ```bash
   root@fedora:/home/looechao# mkdir linux03; cd linux03
   root@fedora:/home/looechao/linux03# 
   ```

2. cmd1 | cmd2

   管道，pipe, 用history 的输出输入到wc -l 这个程序中

   ```bash
   root@fedora:/home/looechao/cpp58# history | wc -l
   ```

   ```bash
     cmd 1               cmd2
   [ stdout ]->[管道]->[ stdin xargs[] ]
                 ^
                 |
        内存，由内核管理的数据结构  
   ```

3. cmd1 | xargs cmd2

   将cmd1输出的每一行作为cmd2的命令行参数

## 文件的权限

| 类型 | 权限   |
| ---- | ------ |
| r    | 可读   |
| w    | 可写   |
| x    | 可执行 |

```python
#! /usr/bin/env python                                              sharp bang shebang 脚本文件的解释器       
```

增加可执行权限

```bash
root@fedora:/home/looechao/coding# chmod +x hello.py
root@fedora:/home/looechao/coding# ./hello.py
hello world
```

关于目录项

```bash
 目录项（directory entry: direct）
   |
  [.]->[a.txt]->[text]->[..]
  
       [      library        ]
       /     /    |      \    \
    [dir] [.]  [a.txt] [text] [..]
   /  |  \
  a   b   c
```

| 目录文件的权限 | 说明                        |
| -------------- | --------------------------- |
| r              | ls tree                     |
| w              | 删除目录项，添加目录项      |
| x              | 最基本的权限(cd, ls , w ,r) |

### chmod 命令

```bash
$ chmod o+w text1   为其他人添加写权限
$ chmod u=rwx,g=rx,o=r text1
$ chmod 664 text1 数字设定法
```

### 文件创建掩码

umask ：u for unix

```bash
$ umask 0023
```

## 符号链接

```bash
$ ln -s text1 link
```

删除命令不会更改链接指向的值

如果创建的链接是指向空目录的时候，就会产生一个悬空链接，类似于C语言当中的野指针

## 远程控制

scp: secure copy （基于SSH协议）， 进行远程复制（上传和下载），上传即将本地数值远程复制到远程，下载即将远程数据复制到本地

- **本地路径**：
  - 绝对路径：
  - 相对路径：
- **远程路径**
  - 用户名(远程机器的用户名)@IP:绝对路径 

```bash
$ scp 
```

## 打包

tar: text archieve

```bash
tar c  创建
tar r  追加
tar x  释放
tar t  查看
tar f  指定文件的名称
tar v  verbose 详细信息
tar z  使用zip算法压缩或者解压缩文件
```

```
tar czvf create zip verbose 命名.tar.gz
```

# 编译工具链

对应集成开发环境(IDE)，又叫SDK（Software Development Kit）

过程

| 过程                      | 生成文件                                                     |
| ------------------------- | ------------------------------------------------------------ |
| gcc -E                    | 预处理后文件(*.i)                                            |
| gcc -S                    | 汇编代码(*.s)                                                |
| gcc -C                    | 目标文件(*.o)                                                |
| 无                        | 可执行程序                                                   |
| gcc -l$                   | 链接&{lib}库                                                 |
| gcc -Wall                 | 警告消息                                                     |
| gcc -g                    | 补充调试信息                                                 |
| gcc -O1 -O2 -O3           | 指定优化级别                                                 |
| gcc -D${macro}            | #define &{macro}定义宏                                       |
| gcc -D${macro} = ${value} | #define &{macro} ${value}                                    |
| gcc -l${dir}              | #include<>${dir} -> 系统的include目录下搜索<br />#include" "${dir} -> 当前工作目录下搜索 |

```bash
$ gcc -E 预处理 
$ gcc -S 汇编 -> 汇编代码
$ gcc -c 目标文件 compiled生成 hello.o
$ gcc 生成可执行程序
$ gcc -wall warning all
$ gcc -o0 -o1 -o2 -o3
       ^     ^
       | [生产阶段] 
$ gcc -g 生成调试信息

$ Dmacro: 在文件开头 #define macro

$ gcc -E main.c -o main.i DEBUG  

rm main.[^c]  一处所有.c 之外的文件 
rm main 
```

```c
#include<func.h>

#ifndef MAXSIZE
#define MAXSIZE 4096
#endif

int main( ){
    int i;
    printf("%d", MAXSIZE)
#ifdef DEBUG
	printf("i = %d", i);
#endif
    return 0;
}
```

## 条件编译

作用：在预处理阶段决定包含哪些代码块，不包含哪些代码块

方法：

```c
#if  ... #elif ... #else ... #endif
#ifdef ... #endif
#ifndef ... #endif
```

应用场景：

- 编写可以指的代码
- 给宏提供默认值
- 调试程序

```c
#include<stdio.h>

#define DEBUG 0

int main(int argc, char* argv[]){
    
}
```

## gdb 调试

- 调试往往更难

- 调试程序流程
  - 走走
  
    ```bash
    (gdb) run/n
    (gdb) continue/n
    (gdb) next/n
    (gdb) step/s
    (gdb) finish/f  回到主调函数
    (gdb) ignore(NUM) 忽略断点NUM次,调试循环时非常有用
    ```
  
  - 停停
  
    ```bash
    (gdb) break/b
    (gdb) delete/s
    ```
  
  - 看看（观察是否和预期一致）
    
    - 预期错了，说明快找到原因了
    - 程序错了，表明提出线索
    
    ```bash
    (gdb) print/p
    (gdb) display/EXPR
    (gdb) info display
    (gdb) undisplay
    (gdb) info locals
    (gdb) info args
    (gdb) info registers
    ```

```BASH
$gdb main
$gcc main.c -o main -g   编译必须要加g
$gdb main aaa bbb ccc 
      |   命令行参数
  executable
  
```

```bash
(gdb) quit //退出
(gdb) run(r)  //跑程序
(gdb) set args aaa bbb ccc //设置命令行参数
(gdb) list  //显示代码，默认10行

(gdb) break(b)  //设置断点 
(gdb) break 14
(gdb) break main.c :14
(gdb) break foo  //指定函数的名字
(gdb) break main.c:foo

(gdb) info break //停一停程序

(gdb) delete 1 //删除断点1
(gdb) delete //会询问是否删除所有的断点

(gdb) next(n)  //下一步下一行或者遇到函数会执行完整个函数调用
(gdb) step //单步调试

(gdb) finish // 执行完这次函数调用会回到被调函数
```

**常见用法**

```bash
(gdb) display r
(gdb) display PI*r*r
(gdb) info display
(gdb) undisplay
(gdb) undisplay
```

**查看内存**

```bash
gcc main.c -o main -Wall -g
(gdb) gdb main
(gdb) break 11
(gdb) r
(gdb) x/nFU address
  n个单元的内存 U表示内存单元
(gdb) x/4db arr+5
(gdb) x/4xb arr+5
```

**用gdb查看core文件**

- core文件
  - 概念：类比黑匣子，core文件是程序异常终止时的内存快照（包含一些堆、栈、寄存器信息）
  - 功能：恢复场景，还原错误
  - 方法：用gdb生成core文件

- 生成core文件

```bash
查看系统是否允许生成coredump文件
$ ulimit -a
$ ulimit -c unlimited  将core文件的大小临时设置为不受限制

设置coredump文件的格式
$ vim /etc/sysctl.conf
 kernel.core_pattern = %e_core_%s_%t executubal-name sigbal time
$ sysctl -p  让配置生效

 sysctl for system control

$ gcc test .c -o test -g  注意-g补充调试信息
$ ./test
Floating point exception (core dumped)

```

- 查看core文件

```bash
(gdb) test test_core_8_1715911762.2496
(gdb) backtrace   或者 bt 打开栈帧的调试情况 结果显示从栈顶到栈底
#0  ···
 ·  ···
#3
(gdb) frame3 查看栈帧
(gdb) info args 查看局部变量的值
(gdb) info locals
(gdb) 
```

## Makefile原理

- Makefile

  - makefile 是一个脚本文件，使用make工具可以解释执行makefile脚本文件

  - makefile 的优点

    - 自动编译
    - 增量编译（只编译新增和修改过的.c文件）

    ```bash
    a.c  -> a.o
    b.c  -> b.o   
    c.c  -> b.o   -> 链接生成 executable
    ···            
    x.c  -> x.o
    ```

- 书写方法

  makefile对语法要求非常严格

  algs.h

  ```c
  
  #ifndef __WD_ALGS
  #DEFINE __WD_ALGS
  
  int add(int a, int b);
  int mul(int a, int b);
  int dev(int a, int b);
  ```

  add.c

  ```c
  #include "algs.h"
  
  int add(int a, int b){
      return a + b;
  }
  ```

  mul.c

  ```c
  #include "algs.h"
  
  int mul(int a, int b){
      return a * b;
  }
  ```

  div.c

  ```c
  #include "algs.h"
  
  int div(int a, int b){
      return a / b;
  }
  ```

  main.c

  ```c
  #include "algs.h"
  
  int main(int argc, char* argv){
      int a = 1, b = 3;
      return mul(3,4);
  }
  ```

  Makefile

  ```makefile
  main: main.o  add.o mul.o div.o ##目标文件和依赖文件  
  	gcc main.0 add.o sub.o mul.o div.o -o main  ##shell命令
  ## 目标和命令共同构成了规则
  main.o: main.c algs.h
  	gcc -c main.c -Wall -g
  add.o: add.c algs.h
  	gcc -c add.c -Wall-g
  sub.o: mul.c algs.h
  	gcc -c mul.c -wall-g
  div.o: div.c algs.h
  	gcc -c div.c -Wall-g
  	....
  .PHONY: clean rebuild
  clean:
  	rm- rf *.o main
  rebuild: clean main
  ```

- 原理

  - 依赖关系: 一般使用有向无环图来表示（Directed Acyclic Graph, DAG）, make在执行脚本的时候，在内部会生成DAG，执行过程会用到DFS（深度优先遍历）

    ```bsah
               main 
            /   |   \              
       main.o add.o sub.o  ···
        / \    | |  ···  ··· 
    main.c \   |add.c 
           algs.h
    ```

    通过拓扑排序可以保证有向无环图的依赖关系, 常常会用到DFS算法

  - 伪目标：规则中的shell命令不一定要生成目标文件

    ```makefile
    .PHONY: clean    ##PHONY伪目标
    clean: 
    	rm-rf *.o main
    ```

    如上规则，没有任何目标文件

    ```bash
    $ make clean
    ```

    这样的伪目标可以反复执行

  - 什么情况下会执行命令？
    - 目标不存在
    - 依赖比目标更新

- 效果

  ```bash
  $ make
  ```

  会有**自动编译**和**增量编译**的效果

## 库文件

什么是库文件：库文件是目标文件(*.o)的集合

分类：

- **静态库**：.lib .a 对函数的链接在连接阶段完成

  优点：

  - 移植方便

  缺点

  - 浪费空间，每一个进程中都有静态库的一个副本

    ```bash
    [进程 .lib]    [进程  .lib] 
    ```

  - 对程序的更新，部署，发布不友好

- **动态库**：.ddl  .so (dynamic link library) 在运行时完成对函数的链接

  优点：

  - 可以共享

  - 对程序更新，部署，发布友好

    ```bash
    [进程]   [进程]
         \   /
         [.so]
    ```

  缺点

  - 不方便移植

**打包生成静态库的流程：**

```bash
$ ls
args.h add.c  sub.c mul.c div.c  
$ make
或者
$ gcc -c add.c sub.c mul.c div.c
$ ar crsv libalgs.a add.o sub.o mul.o div.o   ##打包生成静态库
$ sudo mv libalgs.a /usr/lib
$ mv * tmp/
$ vim main.c
```

在main.c中使用

```c
#incldue "algs.h"
```

**打包生成动态库**

```bash
$ ls 
args.h add.c  sub.c mul.c div.c
$ gcc -c *.c -fpic     
$ ls
args.h add.c  sub.c mul.c div.c add.o  sub.o mul.o div.o
$ gcc -shared add.o sub.o mul.o div.o -o libarlgs.so
$ sudo mv libalgs.so /usr/lib  移动到系统的库目录下面去
$ rm *.o
$ gcc main.c -o main -lalgs
$ ./main
/usr/lib$ mv libalgs.so libalgs.so.0.0.1
$ ./main 跑不通
```



