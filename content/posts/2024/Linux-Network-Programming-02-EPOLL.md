---
title: 网络编程-EPOLL的使用
date: "2024-06-17T15:38:13+08:00"
draft: false
summary: 用EPOLL代替SELECT
tags:
  - 技术
  - Linux
  - 网络编程
  - SELECT
  - EPOLL
  - 海量连接处理
---
# EPOLL

## select的缺陷

- 监听和就绪耦合
- fd_set固定了大小为1024，不方便更改
- 每次调用select，都要把fd_set从用户态换成内核态，资源开销很大
- **就绪机制不合理**：轮询机制是用户层面的，在海量连接的状态下表现很差（海量连接，少量就绪）

由以上缺陷可以引出了EPOLL，它解决了select的缺点，效率是十分高的，E for event, poll means 轮询，Epoll只用处理就绪的实践，**只有Linux支持Epoll**,mac和windows平台使用其他的多路复用

## 操作流程

1. 建立一个文件对象：文件对象是分配在内核区的，所有操作对象都分配在epoll当中

2. Epoll文件对象有**监听集合**和**就序集合**构成，监听集合中的数据结构使用的是红黑树（**大小无限制**），保证了轮询效率 O(logN)

   ```bash
   epoll文件对象
   |监听集合|就绪集合|      
      |        |
    红黑树    线性表
   ------------|----
               |
            [][][][]
   用户只需要遍历用户集合即可，效率非常高
   ```

3. 监听和就绪分离

4. 用户只需要遍历就绪集合：保证了效率（尤其是在海量连接的情况下）

## 相关api

- epoll_create 创建epoll文件对象，类比fd_set
- epoll_ctl 增加监听，类比fd_zero/fd_set，可以放在循环外面

- epoll_wait 陷入等待，类比select

  **注意**：要先准备好一个epoll_event数组来保存就绪事件，返回值是event的长度

  ```c
                   文件对象                   events数组     数组长度      超时时间
                      |                          |           |             |     
  int epoll_wait(int epfd, struct epoll_event *events,int maxevents, int timeout);
   |
  描述有多少个fd就绪
  ```

  epoll_events数组将要存储就绪集合，当epoll_wait返回时，用户需要遍历events（这样做比遍历fd_set效率高很多）

- epoll_ctl

  ```c
                   文件对象  操作                   事件
                     |       |                     | 
  int epoll_ctl(int epfd, int op, int fd,struct epoll_event *_Nullable event);
  ```

## 案例-用epoll的即时聊天

用epoll取代select操作的server

```c
#include <func.h>

int main(int argc, char* argv[])
{
    // ./2_azhen.c 192.168.68.128 1234
    ARGS_CHECK(argc, 3);
    int sockfd = socket(AF_INET, SOCK_STREAM, 0);
    struct sockaddr_in addr; //服务端地址的结构体初始化
    addr.sin_family = AF_INET;
    //向ip结构体中传入ip地址和端口号参数
    addr.sin_port = htons(atoi(argv[2]));
    addr.sin_addr.s_addr = inet_addr(argv[1]);
    int ret = bind(sockfd, (struct sockaddr *)&addr, sizeof(addr));
    ERROR_CHECK(ret, -1, "bind");
    listen(sockfd, 10);   //DDOS攻击的点
    struct sockaddr_in clientAddr;
    socklen_t clientAddrSize = sizeof(clientAddr); //该变量必须初始化
    int netfd =  accept(sockfd,(struct sockaddr *)&clientAddr, &clientAddrSize);
    printf("netfd = %d\n", netfd);
    printf("client ip = %s, port = %d\n",
           inet_ntoa(clientAddr.sin_addr), ntohs(clientAddr.sin_port));
    //1 fd_set rdset;
    int epfd = epoll_create(1); //epoll_create 取代定义 fd_set这个对象
    //2 设置监听 取代fd_set
    //如果使用epoll_ctl 可以在循环外面使用
    struct epoll_event event;
    event.data.fd = STDIN_FILENO;
    event.events = EPOLLIN;
    epoll_ctl(epfd, EPOLL_CTL_ADD, STDIN_FILENO, &event); //fd_set
    //每次用完event之后都要重新赋值
    event.data.fd = netfd;
    event.events = EPOLLIN; //读事件
    epoll_ctl(epfd, EPOLL_CTL_ADD, netfd, &event);
    char buf[4096];

    while(1){
        //FD_ZERO(&rdset);
        //FD_SET(STDIN_FILENO, &rdset);
        //FD_SET(netfd, &rdset);
        //select(netfd+1, &rdset, NULL, NULL, NULL);
        // 4 更换成epoll wait
        // 现申请一个数组
        struct epoll_event readySet[2];
        int readyNum = epoll_wait(epfd, readySet, 2, -1); //永久等待使用-1参数
       // if(FD_ISSET(STDIN_FILENO, &rdset)){
       //     //memset(buf, 0, sizeof(buf));
       //     bzero(buf, sizeof(buf));
       //     ssize_t sret = read(STDIN_FILENO, buf, sizeof(buf));
       //     //send(sockfd, buf, strlen(buf), 0);
       //     send(netfd, buf, sret, 0);
       // }
       // if(FD_ISSET(netfd, &rdset)){
       //     bzero(buf, sizeof(buf));
       //     ssize_t sret = recv(netfd, buf, sizeof(buf), 0);
       //     printf("buf = %s\n", buf);
       // }
       
       //从就绪事件集合中进行操作 
        for(int i = 0; i < readyNum; ++i){
            if(readySet[i].data.fd == STDIN_FILENO){
                //memset(buf, 0, sizeof(buf));
                bzero(buf, sizeof(buf));
                ssize_t sret = read(STDIN_FILENO, buf, sizeof(buf));
                //send(sockfd, buf, strlen(buf), 0);
                if(sret == 0){
                    send(netfd, "nishigehaoren", 13, 0);
                    goto end;
                }
                send(netfd, buf, sret, 0);
            }
            else if(readySet[i].data.fd == netfd){
                bzero(buf, sizeof(buf));
                ssize_t sret = recv(netfd, buf, sizeof(buf), 0);
                if(sret == 0){
                    printf("hehe\n");
                    goto end;
                }
                printf("buf = %s\n", buf);
            }
        }
    }
end:   
    close(netfd);
    return 0;
}
```

- Q:说说你的高性能服务器？高性能体现在哪里？

  A:我们曾经有一个老版本的项目使用select来写的，当用户量非常大的时候我们会发现性能表现会非常差，这时候我们采用了新的IO复用技术EPOLL来代替select，EPOLL处理时间只选择处理就绪事件，大大提高的海量连接下的性能表现

## 用epoll的聊天室

4_server_chatroom_epoll:

```c
typedef struct conn_s{
    int netfd;
    int is_alive;
    int lastactive; //活跃时间
} conn_t;

int main(int argc, char* argv[])
{
    // ./4_server_chatroom_epoll 192.168.68.128 1234
    ARGS_CHECK(argc, 3);
    int sockfd = socket(AF_INET, SOCK_STREAM, 0);
    struct sockaddr_in addr; //服务端地址的结构体初始化
    addr.sin_family = AF_INET;
    //向ip结构体中传入ip地址和端口号参数
    addr.sin_port = htons(atoi(argv[2]));
    addr.sin_addr.s_addr = inet_addr(argv[1]);
    int ret = bind(sockfd, (struct sockaddr *)&addr, sizeof(addr));
    ERROR_CHECK(ret, -1, "bind");
    listen(sockfd, 10);   //DDOS攻击的点
    
    conn_t clientArr[10];  //保存所有炼乳客户端的信息
    int curidx = 0; //保存下一个炼乳客户端的下标
    
    char buf[4096];
    int epfd = epoll_create(1);
    struct epoll_event event;
    event.data.fd = sockfd;
    event.events = EPOLLIN; //sockfd accept 对应的也是读行为
    epoll_ctl(epfd, EPOLL_CTL_ADD, sockfd, &event);
    time_t curtime;
    while(1){
        struct epoll_event readySet[1024]; //聊天室弄得大一点
        //select(100, &rdset, NULL, NULL, NULL);
        
        int readyNum = epoll_wait(epfd, readySet, 1024, 1000);  //等待最多1000毫秒
        for(int i = 0; i < readyNum; ++i){
            if(readySet[i].data.fd == sockfd){
                struct sockaddr_in clientAddr;
                socklen_t clientAddrSize = sizeof(clientAddr); //该变量必须初始化
                int netfd =  accept(sockfd,(struct sockaddr *)&clientAddr, &clientAddrSize);
                printf("netfd = %d\n", netfd);
                printf("client ip = %s, port = %d\n",
                   inet_ntoa(clientAddr.sin_addr), ntohs(clientAddr.sin_port));
                clientArr[curidx].netfd = netfd;
                clientArr[curidx].is_alive = 1; //1 表示存货 0表示已经断开
                clientArr[curidx].lastactive = time(NULL);  //初始化活跃时间
                event.data.fd = netfd;
                event.events = EPOLLIN;
                epoll_ctl(epfd, EPOLL_CTL_ADD, netfd, &event);   //将新连接加入到监听当中
                ++curidx;
            }
            else{
                // 从readySet[i].data.fd 读取数据转发给其它所有存活的客户端
                ssize_t sret = recv(readySet[i].data.fd, buf, sizeof(buf), 0);
                if(sret == 0){//客户端主动断开
                    for(int j = 0; j < curidx; ++j){
                        if(clientArr[j].netfd == readySet[i].data.fd){
                            clientArr[j].is_alive = 0;
                            epoll_ctl(epfd, EPOLL_CTL_DEL, clientArr[j].netfd, NULL); //移除监听
                            close(clientArr[i].netfd);
                            break;
                        }
                    }
                }
                for(int j = 0; j < curidx; ++j){
                    if(clientArr[j].is_alive == 0 || clientArr[j].netfd == readySet[i].data.fd){
                        continue; //如果是已经断开的 or 自己本身 就跳过
                    }
                    // 广播操作，发送给其它所有的活跃客户端
                    send(clientArr[j].netfd, buf, strlen(buf), 0);
                }
                for(int j = 0; j <curidx; ++j){
                    if(clientArr[i].netfd == readySet[i].data.fd){
                        clientArr[j].lastactive = time(NULL);
                        break;
                    }
                }
            }
        }    
    
        //SELECT操作如下，如同大海捞针的轮询操作
       // for(int i = 0; i < curidx; ++i){
       //     if(clientArr[i].is_alive && FD_ISSET(clientArr[i].netfd, &rdset)){
       //         //读取该客户端发送的消息并且转发给其它所有的客户端
       //         bzero(buf, sizeof(buf));
       //         ssize_t sret = recv(clientArr[i].netfd, buf, sizeof(buf), 0);
       //         if(sret == 0){
       //             clientArr[i].is_alive = 0; //i号客户端已经终止
       //             FD_CLR(clientArr[i].netfd, &monitorset);
       //             close(clientArr[i].netfd);
       //         }
       //         //转发给其他所有的客户端
       //         for(int j = 0; j < curidx; ++j){
       //             if(j == i || clientArr[j].is_alive == 0){
       //                 continue; //发送的目标是自己或者发送的目标已经关闭，就继续
       //             }
       //             //相当于做一个广播的操作
       //            send(clientArr[j].netfd, buf, strlen(buf), 0);;
       //         }
       //     }
       // }
       curtime = time(NULL);
       printf("curtime = %s\n", ctime(&curtime));
       for(int i = 0; i < curidx; ++i){
           if(clientArr[i].is_alive == 1 && curtime - clientArr[i].lastactive > 100){
               clientArr[i].is_alive = 0;
               epoll_ctl(epfd, EPOLL_CTL_DEL, clientArr[i].netfd, NULL);
               close(clientArr[i].netfd);
           }
       }
    }
    close(sockfd);
    return 0;
}
```

断线重连问题尚未修复

## 非阻塞和阻塞的区别

read操作的阻塞状况

| 类型   | 是否会阻塞 |
| ------ | ---------- |
| 文件   | 不会阻塞   |
| 管道   | 会阻塞     |
| stdin  | 会阻塞     |
| socket | 会阻塞     |

```c
while(1){
	read(磁盘文件)->ret;
    ret为0则退出；
}
while(1){
    recv(socket); 一旦阻塞会陷入永久阻塞
}
```

### 把管道弄成非阻塞式

```c
int setnonblock(int fd){
    int flag = fcntl(fd, F_GETFL); //获取已经打开的fd的属性
    flag = flag|O_NONBLOCK; //增加一个非阻塞属性
    int ret = fcntl(fd, F_SETFL, flag);
    ERROR_CHECK(ret, -1, "fcntl");
    return 0;
}

int main(int argc, char* argv[])
{
    int fd = open("1.pipe", O_RDONLY);
    setnonblock(fd);
    char buf[1024] = {0};
    while(1){
        bzero(buf, sizeof(buf));
        ssize_t sret = read(fd, buf, 3);
        printf("sret = %ld, buf = %s\n", sret, buf);
        sleep(1);
    }
    return 0;
}
```

```bash
sret = -1, buf = 
sret = 3, buf = hel
sret = 2, buf = lo
sret = -1, buf = 
sret = -1, buf = 
sret = -1, buf = 
sret = 0, buf = 
sret = 0, buf = 
```

## 5种IO模型

- 同步阻塞
- 同步非阻塞
- **同步IO多路复用**
- 异步IO
- 信号驱动IO

## EPOLL触发方式

socket怎么让epoll就绪：当socket被关闭或者读缓冲区有数据（水平触发）时，则认为读操作是就绪的

- 水平触发

  ```bash
  数据量
    |     _
    |    /  \__
    |___/_______\______________t
  ```

  只要数据量大于0，不管数据量是上升、平稳、或者下降，都会进行水平触发

  - 

  ```bash
  epoll wait ready!
  buf = ni
  epoll wait ready!
  buf = sh
  epoll wait ready!
  buf = ig
  epoll wait ready!
  buf = eh
  epoll wait ready!
  buf = ao
  epoll wait ready!
  buf = re
  epoll wait ready!
  buf = n
  ```

  可以看到epoll默认情况下时水平触发的

-  边缘触发的处理

  某些情况下使用边缘触发会更加公平

  ```bash
  数据量
    |     _
    |    /|  \__
    |___/_|______\______________t
         |
   仅在该阶段进行触发
  ```

  仅当数据处于上升沿时，才会导致边缘触发

  ```c
  event.events = EPOLLIN|EPOLLET; //读数据。增加边缘触发属性
  ```

  ```bash
  epoll wait ready!
  buf = ni
  ```

  如果这样操作

  ```c
  ssize_t sret;
  while(1){
      sret = recv(netfd, buf, sizeof(buf)-1, 0);
      printf("buf = %s \n", buf);
  }
  ```

  虽然能够收取到所有的消息，但是会阻塞在recv函数里

  用while循环配合非阻塞

  因此需要在recv中加上MSG_DONTWAIT参数（非阻塞）

  ```c
  while(1){
     bzero(buf, sizeof(buf));
     sret = recv(netfd, buf, sizeof(buf)-1, MSG_DONTWAIT);
     printf("sret = %ld, buf = %s \n", sret, buf);
     if(sret == -1){
         break;
     }
     else if(sret == 0){
         printf("hehe\n");
         goto end;
     }
  }
  ```

  ```bash
  epoll wait ready!
  sret = 2, buf = ni 
  sret = 2, buf = sh 
  sret = 2, buf = ig 
  sret = 2, buf = ah 
  sret = 2, buf = ao 
  sret = 2, buf = re 
  sret = 2, buf = n
   
  sret = -1, buf =  
  epoll wait ready!
  sret = 2, buf = ni 
  sret = 2, buf = ha 
  sret = 2, buf = oh 
  sret = 2, buf = ua 
  sret = 2, buf = i
   
  sret = -1, buf =  
  ```

  

