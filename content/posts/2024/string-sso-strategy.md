---
title: 浅谈C++中string的SSO策略
date: "2024-07-10T22:53:13+08:00"
draft: false
summary: 短字符串的优化策略
tags:
  - 技术
  - C/C++
  - SSO
  - string
---
## string的存储结构

```cpp
class string {
 	union Buffer{
 		char * _pointer;
 		char _local[16];
 	};
    
 	size_t _size;
 	size_t _capacity;
	Buffer _buffer;
};
```

string对象共占32个字节，buffer 占 16个字节，size和capacity共占用16个字节

## 验证

可以通过如下程序进行验证：

```cpp
#include <iostream>
#include <string>

using namespace std;

void test0(){
    string str1 = "hello,world!!!!";
    string str2 = "hello,world!!!!!";
    cout << &str1 << endl;
    printf("%p\n", &str1[0]);
    cout << &str2 << endl;
    printf("%p\n", &str2[0]);

}

int main()
{
    test0();
    return 0;
}
```

```bash
[looechao@fedora cpp12]$ ./a.out 
0x7ffcdfdd77d0
0x7ffcdfdd77e0
0x7ffcdfdd77b0
0xbe2f2b0
```

可以发现SSO的策略如下：



```mermaid
graph TD
    A[String对象: 32字节] --> B{字符串长度}
    B -->| < 15字节| C[使用SSO策略]
    B -->| 超过15字节| D[使用堆内存]
    
    C --> E[Buffer._local存储<br>直接使用栈空间<br>16字节]
    D --> F[Buffer._pointer指向<br>堆上分配的内存]
    
    subgraph "String对象结构" 
    direction TB
    G[_size: 8字节]
    H[_capacity: 8字节]
    I[Buffer联合体: 16字节]
    G --> H --> I
    end
```





- 针对16个字节以内的字符串，直接使用栈上的空间存储buffer
- 针对16个字节以上的字符串，将buffer存在堆区



