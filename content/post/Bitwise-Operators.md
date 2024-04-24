+++
title = 'C语言中的六种位运算符'
date = 2024-04-24T21:09:13+08:00
draft = false
summary = "应用场景小总结"
tags = [ "C++", "技术"]
+++
#### 六种位运算符

| 符号|含义 |
|:-:|:- :|
| << |左移位 |
| >> |右移位 |
| ~ |按位取反 |
| & |按位与（相同为1） |
| ^ |按位异或(不同为1) |
| \| |按位或（有1为1） |

- 按位与的应用场景：掩码

 eg.测试0xCAFE最后 4 位中是不是最少有 3 位为 1.

```c
#include<stdio.h>

int main(){
    int n = 0xCAFE;
    int mask=0x000F;   //掩码
    int result = mask & n;
    if(result==0xF||result==0x7||result==0xB||result==0xD||result==0xE){
        printf("至少有三个1");
    }
    return 0;
}
```

- 移码的应用：

eg. 逆转0xCAFE的字节序

```c
#include<stdio.h>

int main(){
    int left=0xCAFE,right=0xCAFE,n = 0xCAFE;
    left<<=8;
    right>>=8;
    
    int sum=left+right;

    int mask=0x00FFFF;
    sum&=mask;
    printf("%x",sum);
    return 0;
}
```
