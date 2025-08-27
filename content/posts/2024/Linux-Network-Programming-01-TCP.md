+++
title = '网络编程-TCP和UDP通信模型'
date = 2024-06-16T15:38:13+08:00
draft = false
summary = "TCP和UDP的通信模型"
tags = [ "技术", "Linux", "网络编程", "TCP", "UDP", "即时通信系统"]
+++

<div style="width: 80%; margin: auto;">
    <img src="https://raw.githubusercontent.com/looechao/blogimg/main/post/TCP-UDP.jpg" alt="shotonspf" style="width: 100%;" />
</div>

# TCP 通信

这里的应用编写属于应用层的实现，而SOCKET的实现属于传输层

## TCP鸟瞰图

```bash
socket                socket
   |                    |
   |                   bind
   |                    |
   |                  lisent
connect-----------------|
   |                  accept
   |                    |
 send                 recv
   |                    |
 close                close
```

## 网络也是一种文件

socket文件对象实在内核态空间创建的，有两个缓冲区，分别是snd和rcv缓冲区，为了实现全双工通信，需要两个管道

## 各个api的作用

- socket

  创建一个套接字设备（规定地址类型例如ipv4、TCP流式传输和UDP数据报通信、默认socket协议）

- bind

  给套接字赋予一个本地地址，在TCP传输中，服务端必须要bind一个IP地址，因为客户端总是需要向服务端发送请求的，**如果都绑定了地址**，在断连后重连会浪费更多的时间，所以在tcp协议中，并不建议两端都bind，**不bind本地ip地址会报错**，**bind 0.0.0.0 相当于绑定外网地址**

  - bind的流程
    1. 先创建struct sockaddr_in
    2. 设置好地址内容参数
    3. 传递参数

- connect

  建立连接，要请求一个服务端的ip和端口，调用该api时，传输层会进行三次握手协议

- listen

  服务端开启监听，可以接受客户端的连接，执行listen之后，会复制一个socket文件对象，将snd和rcv缓冲区换成半连接队列和全连接队列，**也就是说listen之后，socket将不再能够发送和接受数据，只能新建连接，处理三次握手相关的内容**；所以我们把listen之后的socket称作服务端socket

- accept

  用于从服务端socket中的全连接队列中取出内容，构建一个新的文件对象（Net Socket），netsocket才是真正用于通信的

- send

  ```c
  int send(int s, const void *msg, size_t len, int flags);
  ssize_t write(int fd, const void *buf, size_t count);
  ```

  send是一个特殊的write函数

- recv

  ```c
  ssize_t recv(int sockfd, void buf[.len], size_t len,int flags);
  ssize_t read(int fd, void *buf, size_t count);
  ```

  recv是一个特殊的read函数

  send/recv只是把数据在buf和select之间来回拷贝，真正的发送和接收行为是内核协议栈来完成的，如果服务端调用recv函数时，接收缓冲区是空的，则会阻塞；**send/recv不是简单的收发关系，不是一一对应的**，TCP数据是没有边界的，应用层的表现和两根管道是一模一样的

  - rcv缓冲区为空时，recv会阻塞

  - rcv非空时，recv的返回值在（0，count）

    如果recv的ret为0，表示对面close了

## 即时通信系统

服务端：

```c
int main(int argc, char* argv[])
{
    // ./2_aqiang 192.168.68.128 1234
    //socket 是两端通信的端点
    ARGS_CHECK(argc, 3);
    int sockfd = socket(AF_INET, SOCK_STREAM, 0);
    struct sockaddr_in addr;
    addr.sin_family = AF_INET;
    addr.sin_port = htons(atoi(argv[2]));
    addr.sin_addr.s_addr = inet_addr(argv[1]);
    int ret = connect(sockfd, (struct sockaddr *)&addr, sizeof(addr));
    ERROR_CHECK(ret, -1, "connect");
    fd_set rdset;
    char buf[4096];
    while(1){
         FD_ZERO(&rdset);
         FD_SET(STDIN_FILENO, &rdset);
         FD_SET(sockfd, &rdset);
         select(sockfd+1, &rdset, NULL, NULL, NULL);
         if(FD_ISSET(STDIN_FILENO, &rdset)){
             //memset(buf, 0, sizeof(buf));
             bzero(buf, sizeof(buf));
             ssize_t sret = read(STDIN_FILENO, buf, sizeof(buf));
             //send(sockfd, buf, strlen(buf), 0);
             send(sockfd, buf, sret, 0);
         }                  
         if(FD_ISSET(sockfd, &rdset)){
             bzero(buf, sizeof(buf));
             ssize_t sret = recv(sockfd, buf, sizeof(buf), 0);                                 
             printf("buf = %s\n", buf);
         }                       
    }                           
    return 0;
}
```

客户端

```c
int main(int argc, char* argv[])
{
    // ./2_aqiang 192.168.68.128 1234
    //socket 是两端通信的端点
    ARGS_CHECK(argc, 3);
    int sockfd = socket(AF_INET, SOCK_STREAM, 0);
    struct sockaddr_in addr;
    addr.sin_family = AF_INET;
    addr.sin_port = htons(atoi(argv[2]));
    addr.sin_addr.s_addr = inet_addr(argv[1]);
    int ret = connect(sockfd, (struct sockaddr *)&addr, sizeof(addr));
    ERROR_CHECK(ret, -1, "connect");
    fd_set rdset;
    char buf[4096];
    while(1){
         FD_ZERO(&rdset);
         FD_SET(STDIN_FILENO, &rdset);
         FD_SET(sockfd, &rdset);
         select(sockfd+1, &rdset, NULL, NULL, NULL);
         if(FD_ISSET(STDIN_FILENO, &rdset)){
             //memset(buf, 0, sizeof(buf));
             bzero(buf, sizeof(buf));
             ssize_t sret = read(STDIN_FILENO, buf, sizeof(buf));
             //send(sockfd, buf, strlen(buf), 0);
             send(sockfd, buf, sret, 0);
         }                  
         if(FD_ISSET(sockfd, &rdset)){
             bzero(buf, sizeof(buf));
             ssize_t sret = recv(sockfd, buf, sizeof(buf), 0);                                 
             printf("buf = %s\n", buf);
         }                       
    }                           

    return 0;
}
```

## 聊天室

server

```c
typedef struct conn_s{
    int netfd;
    int is_alive;
} conn_t;

int main(int argc, char* argv[])
{
    // ./2_server 192.168.68.128 1234
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
    fd_set rdset;
    fd_set monitorset;
    FD_ZERO(&monitorset);
    FD_SET(sockfd, &monitorset);
    while(1){
        memcpy(&rdset, &monitorset, sizeof(fd_set));
        select(100, &rdset, NULL, NULL, NULL);
        if(FD_ISSET(sockfd, &rdset)){
            struct sockaddr_in clientAddr;
            socklen_t clientAddrSize = sizeof(clientAddr); //该变量必须初始化
            int netfd =  accept(sockfd,(struct sockaddr *)&clientAddr, &clientAddrSize);
            printf("netfd = %d\n", netfd);
            printf("client ip = %s, port = %d\n",
               inet_ntoa(clientAddr.sin_addr), ntohs(clientAddr.sin_port));
            clientArr[curidx].netfd = netfd;
            clientArr[curidx].is_alive = 1; //1 表示存货 0表示已经断开
            FD_SET(netfd, &monitorset);
            ++curidx;
        }
        for(int i = 0; i < curidx; ++i){
            if(clientArr[i].is_alive && FD_ISSET(clientArr[i].netfd, &rdset)){
                //读取该客户端发送的消息并且转发给其它所有的客户端
                bzero(buf, sizeof(buf));
                ssize_t sret = recv(clientArr[i].netfd, buf, sizeof(buf), 0);
                if(sret == 0){
                    clientArr[i].isalive = 0; //i号客户端已经终止
                    FD_CLR(clientArr[i].netfd, &monitorset);
                    close(clientArr[i].netfd);
                }
                //转发给其他所有的客户端
                for(int j = 0; j < curidx; ++j){
                    if(j == i || clientArr[j].is_alive == 0){
                        continue; //发送的目标是自己或者发送的目标已经关闭，就继续
                    }
                    //相当于做一个广播的操作
                   send(clientArr[j].netfd, buf, strlen(buf), 0);;
                }
            }
        }
    }
    close(sockfd);
    return 0;
}
```

client

```c
int main(int argc, char* argv[])
{
    // ./2_aqiang 192.168.68.128 1234
    //socket 是两端通信的端点
    ARGS_CHECK(argc, 3);
    int sockfd = socket(AF_INET, SOCK_STREAM, 0);
    struct sockaddr_in addr;
    addr.sin_family = AF_INET;
    addr.sin_port = htons(atoi(argv[2]));
    addr.sin_addr.s_addr = inet_addr(argv[1]);
    int ret = connect(sockfd, (struct sockaddr *)&addr, sizeof(addr));
    ERROR_CHECK(ret, -1, "connect");
    fd_set rdset;
    char buf[4096];
    while(1){
         FD_ZERO(&rdset);
         FD_SET(STDIN_FILENO, &rdset);
         FD_SET(sockfd, &rdset);
         select(sockfd+1, &rdset, NULL, NULL, NULL);
         if(FD_ISSET(STDIN_FILENO, &rdset)){
             //memset(buf, 0, sizeof(buf));
             bzero(buf, sizeof(buf));
             ssize_t sret = read(STDIN_FILENO, buf, sizeof(buf));
             //send(sockfd, buf, strlen(buf), 0);
             send(sockfd, buf, sret, 0);
         }                  
         if(FD_ISSET(sockfd, &rdset)){
             bzero(buf, sizeof(buf));
             ssize_t sret = recv(sockfd, buf, sizeof(buf), 0);                                 
             printf("buf = %s\n", buf);
         }                       
    }                           

    return 0;
}
```



## 杂项

- 端口号的选择：

  0-65535之间进行选择，0-1000的端口属于悉知端口号，尽量不要选择

# UDP通信

## UDP鸟瞰图

```bash
   客户端           服务端
   socket          socket
      |              |
      |             bind
      |              |
    sendto -------> recvfrom
      |              |
   recvfrom <------ sendto
      |
     close
```

问题？

> TCP和UDP能否bind同一个端口?
>
> 可以bind，tcp和udp走的信道不同，不会产生干扰，因此可以bind同一个端口

> UDP 需要listen 和 connect 吗？
>
> 不需要，UDP是无连接的

## API功能概览

1. socket函数

   ```c
   int socket(int domain, int type, int protocal)
   ```

   - domain 指定通讯选用的协议，常用的有IPv4网络协议，AF_INET
   - type 用于指定通讯的语义，SOCK_STREAM 提供可靠有序的字节流通讯，而SOCK_DGRAM 提供数据报通讯
   - protocal 用于指定套接字的协议

2. sendto 和 recvfrom 函数

   ```c
   ssize_t send(int sockfd, const void buf[.len], size_t len, int flags);
   ssize_t sendto(int sockfd, const void buf[.len], size_t len, int flags, 
                  const struct sockaddr *dest_addr, socklen_t addrlen);
   
   ssize_t recv(int sockfd, void buf[.len], size_t len, int flags);
   ssize_t recvfrom(int sockfd, void buf[restrict .len], size_t len, int flags,
                    struct sockaddr *_Nullable restrict src_addr,
                    socklen_t *_Nullable restrict addrlen);
   ```

   UDP的 sendto 和 recvfrom 每次收发数据都需要绑定一个地址信息，而TCP不需要

3. UDP 必须客户端先 sendto ， 服务端先 recvfrom，客户端的地址不是固定的，而服务端 

## UDP通信例子

一个简单的UDP通信例子：

- 服务端server

  ```c
  #include<func.h>
  
  int main(){
      // ./4_server 0.0.0.0 1234
      ARGS_CHECK(args, 3);
      int sockfd = socket(AF_INET, SOCK_DGRAM, 0);  //UDP SOCK_DGRAM
      struct sockaddr_in serverAddr; 
      serverAddr.sin_family = AF_INET;
      serverAddr.sin_port = htons(atoi(argv[2]));
      serverAddr.sin_addr = inet_addr(argv[1]);
      // 进行bind操作
      int ret = bind(sockfd, (struct sockaddr *)&serverAddr, sizeof(serverAddr));
      ERROR_CHECK(ret, -1, "bind");
      // 服务端先recvfrom
      struct sockaddr_in clientAddr;
      socklen_t clientAddrSize = sizeof(clientAddr);
      char buf[4096];
      recvfrom(sockfd, buf, sizeof(buf),0,
              (struct sockaddr *)&clientAddr, &clientAddrSize);
      printf("client ip = %s, port = %d\n",
            inent_ntoa(clientAddr.sin_addr), ntohs(clientAddr.sin_port));
      printf("buf = %s", buf);
      close(sockfd);
      return 0;
  }
  ```

- 客户端

  ```c
  #include<func.h>
  
  int main(){
      // ./4_client 192.168.68.128 1234
      ARGS_CHECK(args, 3);
      int sockfd = socket(AF_INET, SOCK_DGRAM, 0);  //UDP SOCK_DGRAM
      struct sockaddr_in serverAddr; 
      serverAddr.sin_family = AF_INET;
      serverAddr.sin_port = htons(atoi(argv[2]));
      serverAddr.sin_addr = inet_addr(argv[1]);
      // 客户端先 sendto
      sendto(sockfd, "zaima", 5, 0,
            (struct sockaddr *)&serverAddr, sizeof(serverAddr));
      return 0;
  }
  ```

  
