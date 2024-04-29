+++
title = 'C语言学习笔记-24年4月第一组'
date = 2024-04-28T22:53:13+08:00
draft = false
summary = "类型，表达式，语句，数组，函数"
tags = [ "技术", "C/C++"]

+++

### C语言基础

#### 编译和链接
- 预处理
  执行以#开头的指令：**头文件**、**宏定义**、**宏函数**

  最终生成.i文件

- 编译

  生成汇编代码

- 汇编

  生成.o目标文件（二进制代码）

- 链接

  链接库文件和各种目标文件成为可执行程序
#### 宏定义(macro definition)

在预处理阶段会把宏替换为其表示的值

- 多用宏定义可以避免魔法数字（防止公式看不懂）
- 提供了一定的宏编程能力（简单的函数）
- 避免调用函数的开销
不使用宏函数的汇编代码：

```asm
.LC0:
        .string "hello world!%d\n"
main:
        push    rbp
        mov     rbp, rsp
        mov     esi, 16
        mov     edi, OFFSET FLAT:.LC0
        mov     eax, 0
        call    printf
        mov     eax, 0
        pop     rbp
        ret
foo1(int):
        push    rbp
        mov     rbp, rsp
        mov     DWORD PTR [rbp-4], edi
        mov     eax, DWORD PTR [rbp-4]
        lea     edx, [rax+1]
        mov     eax, DWORD PTR [rbp-4]
        add     eax, 1
        imul    eax, edx
        pop     rbp
        ret
```
使用宏函数的汇编代码：
```asm
.LC0:
        .string "hello world!%d\n"
main:
        push    rbp
        mov     rbp, rsp
        mov     esi, 16
        mov     edi, OFFSET FLAT:.LC0
        mov     eax, 0
        call    printf
        mov     eax, 0
        pop     rbp
        ret
```
可以很直观的看出，相同功能的函数，如果使用宏定义更高效

---

#### 变量

- 铆钉一个值
- 变量三要素：
  - 值
  - 变量名：引用铆钉的值
  - 类型 
    1. 限定值的范围（编码（内存大小->sizeof）
    2. 值能够进行的操作
    取变量名要贴合意思
#### 拓展-进程的虚拟内存空间
| 高地址 |内核区|
|:-:|:----:|
|动态|**栈**（管理函数调用）|
|动态|&darr; &uarr;|
|动态|**堆**（存放动态数据）|
|数据|**数据段**|
|低地址（指令）|**代码段**|

### 格式化输入\输出
#### 输入输出模型
解决CPU与内存速度不匹配的方法：键盘&rarr;缓冲区 &rarr; stdin &rarr;程序&rarr; stdout &rarr; 显示器 
#### 由格式串控制的printf与scanf

##### The printf Function

- 普通字符：原样输出
- 转换说明：占位符
- 输出格式的控制： %m.px 或 %-m.px
  - x用于进行类型转换
  - m(**minimum field width**)是最小字段宽度
  - -号表示靠左对齐
  - p(**precision**)表示精度
- eg：
```c
  printf("|%d|%5d|%-5d|%5.3d|\n", i, i, i, i);
  printf("|%10.3f|%10.3e|%-10g|\n", x, x, x);
```
```cmd
 |40|   40|40   |  040|
 |   839.210| 8.392e+02|839.21    |
```

##### The scanf Function
本质是一个：模式匹配函数
- 普通字符：精确匹配
- 空白字符：**任意个数**
- 转换说明：区分%d和%f
- 工作原理:
  - 从左到右一次匹配格式串的每一项
  - 忽略**空白字符white-space character**(space /制表符 tab / 换页符form-feed / 换行符 new-line characters)
  - 返回值：表示成功匹配的转换说明的个数
- 关于%c，忽略前置空白字符，匹配第一个非空白字符scanf(" %c",&c);

### 类型
#### 基本数据类型
- 整型
  - 无符号整数&rarr;编码&rarr;二进制编码
  - 有符号整数&rarr;编码&rarr;补码
  
- 浮点型
  - 编码：IEEE754
  - 不精确的
  
- 字符型
  1. 如何表示值
  - 字符转义序列
  - 数字转义序列
    - 八进制：以'\'开头，后面接最多3个八进制数字（eg. '\0'）
    - 十六进制：以'\x'开头，后面接十六进制数字
  2. 操作
    - C语言吧字符当作一个字节的整数处理，例如相加减
    - <ctype.h> 
      - 字符分类函数
      - 大小写转换函数 &raar to_uppper/to_lower()
  
  3. 和用户交换（读/写）
    - scanf/printf &raar %c
    - putchar / getchar
      注意getchar的惯用法（类似成语）
      ```c
      while(getchar()!='\n'); //跳过这一行的空白字符
      ```
  4. 常用编码
    - 空字符： 0 
    - 空格：32
    - ‘0’：48
    - ‘A’： 64
    - ‘a’: 97
#### 类型转换
- 隐式转换
  1. 证书提升
  2. 表示范围小&raar; 表示范围大
  3. 同一整数转换等级:有符号整数&raar;无符号整数 （不要一起计算）
  
- 强制转换
  - 计算浮点数的小数部分
  ```c
  float sum = scale_factor*(temp-freezing_point)
  ```
  -  解释说明
  -  精准控制类型的转换
  -  避溢出ss

- 定义别名
  - 格式
  ```C
  typedef 类型 别名
  //eg
  typedef int quantity
  ```
  - 作用
    1. 提高代码的可读性
    2. 提高代码的可移植性
  - ```sizeof```运算符
    - 计算某一类型的值，所占内存空间的大小，以字节为单位

------

### 表达式

- 本质：计算某个值的**公式**，最简单的表达式: 变量和常量

- 运算符：链接表达式，创建更复杂的表达式
  - 性质
    - 优先级
    - 结合性(eg. 从右向左结合)
  - 赋值运算 （eg. f=i=3.14f）
    - 副作用：会给变量赋值
  - 算术运算
    - /  向0取整
    - % remainder 余数可能是负数，其符号与被除数一致
  - 自增和自减
    - ++i
    - i++ 表达式的值仍然为i
#### 拓展 - 位运算符
- 六种位运算符

<table>
    <tr>
        <td>符号</td>
        <td>含义</td>
    </tr>
    <tr>
        <td>&lt;&lt;</td>
        <td>左移位</td>
    </tr>
    <tr>
        <td>&gt;&gt;</td>
        <td>右移位</td>
    </tr>
    <tr>
        <td>~</td>
        <td>按位取反</td>
    </tr>
    <tr>
        <td>&amp;</td>
        <td>按位与（相同为1）</td>
    </tr>
    <tr>
        <td>^</td>
        <td>按位异或 (不同为1)</td>
    </tr>
    <tr>
        <td>|</td>
        <td>按位或 (有1为1)</td>
    </tr>
</table>

##### 位运算的基础应用
- 按位与的应用场景：掩码
  - 判断一个数是否为奇数: n&0x1
  - 判断一个数是否为2的幂: /
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

- 异或的良好性质
  - a^0=a
  - a^a=a
  - a^b=b^a
  - (a^b)^c=a^(b^c)

##### 位运算的拓展应用

- eg1. 找出last set bit: 
  - 令xor=3, 找到xor的last set bit
    - 3的补码表示是0011
    - 3的反码表示是1100
    - **3的反码+1表示是1101
    - -3的补码表示是1101**
    可用的操作:
    1101
    0011按位做与运算得到 Last Set Bit
  ```c  
  lsb=xor&(^xor+1) 
  ```
  ```c
  lsb=xor&(-xor)
  ```
- eg2.筛出数组中单独的数（其余的都出现了两次）singlenum
  ```c
  int main(){
    int nums[5] = {1,4,2,1,2};
    int xor=0;
    for(int i=0; i<5; i++){
        xor^=nums[i];
    }
    printf("%d", xor);
    return 0;
   }
  ```
  不断做异或运算，可以保留得到最后唯一的那个元素
- eg3. 拓展：晒出数组中的两个只单独的数（其余的都出现了两次）
  ```c
  int main(){
    int nums[6] = {1,2,1,3,2,5};
  
    int xor = 0;
    for(int i=0; i<6; i++){
        xor ^= nums[i];  
    }
    
    int lsb = xor&(~xor+1);    //last set bit;a与b在这一位上不同，用作分类
    
    int a=0,b=0;
    for(int i=0;i<6;i++){
        if(lsb&nums[i]){
            a^=nums[i];
        }else{
            b^=nums[i];
        }
    }
    printf("[%d %d]", a,b);
    return 0;
  }
  ```
  用0与整个数组异或的结果的lsb可以将数组分为两个只包含一个唯一元素的数组，再按照eg2的方法可以筛出唯一元素

###　语句

#### 选择语句

- if语句
- switch语句
  - 优点
    - 可读性强
    - 分支多时，效率高
  - 限制条件
    - switch后的表达式只能是整型（char,整型）
    - switch后的表达式和case标签，是通过==比较的
  - 注意事项
    1. 多个case标签可以共用一组语句
    2. 警惕使用case穿透现象，必要使用时注意标记注释*/*break_throgh*/*

####　循环语句

- while语句

- do...while语句

- for语句

#### 跳转语句
- continue语句
- break语句
- goto语句
- return语句
###　数组
#### 概念/模型
- 内存模型
  - 一片连续的内存空间
  - 这篇空间被划分为大小相等的小空间
- 为什么索引总是从0开始
  - 随机访问公式：
    ```c
    i_addr=base_addr+i*sizeof(elem_type)  //i从0开始不需要额外做减法
    ```
- 刻板印象（效率比链表高）
  - 空间利用率
  - 空间局部性（一般都要用到附近的一片元素）
#### 声明 
```c
int arr[10]={1,2,3,4};
```
- 变量名：arr
- 类型: int[10]
- 值: 1,2,3,4,0,0,0,0,0,0
#### 操作
- 取下标: arr[5];
- 数组和for形影不离
- 宏函数
```c
#define SIZE(a) (sizeof(a)/sizeof(a[0])
```
#### 二维数组
- 本质：元素是一维数组的数组，因此二维数组在内从中也连续
- 逻辑视角：矩阵
- 声明：
```c
int matrix[3][7]={{...},{...},{...}};   
//matrix是一个长度为3的由长度为7的数组构成的数组
```
- 操作
  - 取下标
    - matrix[1] --- int[7]
    - matrix[1][5] --- int
  - 二维数组和嵌套for循环形影不离
####　常量数组
```ｃ
const char suits[4]={'S','H','C','D'};
```
- 特性
  - 不能修改常量数组的元素，因此安全
  - 效率更高
- 使用场景
  - 存储静态数据：在程序运行过程中不会发生修改的数据
### 函数

#### 基本思想

- 函数的功能应该越单一越好：
  要追求高内聚，低耦合
-  理解好C语言是面向过程的语言：
  函数是C语言的”基本构造组件“，C语言程序的本质就是函数之间的调用
#### 定义和声明
  - 函数定义
  ```c
  void foo(int a){.....};
  ```
  - 函数声明
  ```c
  void foo(int a);
  ```
##### 例题
###### 扑克牌游戏
题目描述：写一个随机发牌的程序。用户指定发几张牌，程序打印手牌。程序的会话如下：
Enter number of cards in hand: 5
Your hand: 9c 7d 3c 5d kd

思路：
- 用二维数组描述扑克牌
- 用while循环模拟发牌的过程
```c
int main(){
    const char suits[4]={'S','H','C','D'};
    const char ranks[13]={'2','3','4','5','6','7','8','9','T','J','Q','A'};

    int cards;
    printf("Enter number of cards in hand:");
    scanf("%d", &cards);

    bool in_hands[4][13]={false};
    
    //发牌
    printf("your hands:");

    srand(time(NULL));
    while(cards){
        int i=rand()%4;
        int j=rand()%13;
        if(!in_hands[i][j]){
            in_hands[i][j]=true;
            cards--;
            printf("%c%c ",suits[i],ranks[j]);
        }
    }

    return 0;
}
```
总结
- 注意srand()和time()的组合使用
  ```c
  #include<stdlib.h>
  #include<time.h>
  srand(time(NULL));
  ```
###### 掷骰子游戏（理解面向过程）
题目描述：第一次掷的时候，如 果点数之和为 7 或 11 则获胜；如果点数之和为2、3或12则落败；其他情况下的点数之和称为“目标”，游戏继续。在后续的投掷中，如果玩家再次掷出“目标”点数则获胜，掷出7则落败，其他情况都忽略，游戏继续进行。
每局游戏结束时，程序询问用户是否再玩一次，如果用 户输入的回答不是 y 或 Y ，程序会显示胜败的次数然后终止。(拓展题，不要求每个同学回答)

思路
- 用函数执行特定的任务
- roll_dices 用于模拟摇骰子的过程，返回值为int型
- play_game用与模拟玩游戏的过程，返回值为bool型
  - 当要到目标时，需要在内部执行do...while循环
- 在main函数中使用do...while循环执行play_game函数
```c
char again;

int roll_dices(void){
    int dice1=rand()%6+1;
    int dice2=rand()%6+1;
    return dice1+dice2;
}

bool play_game(void){
    srand(time(NULL));
    int result=roll_dices();
    printf("you rolled:%d\n", result);
    if(result==7||result==11){
        printf("you win!\n");
        return true;
    }else if(result==2||result==3||result==12){
        printf("you lose!\n");
        return false;
    }else{
        int point = result;
        printf("your point is %d\n", point);
        int new_roll=roll_dices();
        printf("you rolled %d\n", new_roll);
        if(new_roll==7){
            printf("you lose!");
            return false;
        }
        do{
            int new_roll=roll_dices();
            printf("you rolled %d\n", new_roll);
            if(new_roll==point){
                printf("you win!\n");
                return true;
            }
            if(new_roll==7){
            printf("you lose!");
            return false;
            }
        }while(new_roll!=7);
    }
}

int main(void){
    int wins=0, losses=0;
    play_game();
    do{
        play_game()? wins++:losses++;
        printf("\nPlay again?");
        again = getchar();
        getchar();
    } while(again == 'y'||again =='Y') ;
    printf("wins:%d losses:%d",wins, losses);
    return 0;    
}
```

#### 参数传递
- 传递什么： 实参传递给形参
- 方式：
  - 值传递：
    - 不能通过修改形参来修改实参
    - 解决方法 - 指针
  - 例外：数组
    传递数组是，数组会退化成指向第一个元素的指针：
      - 丢失长度信息
      - 需要额外传递数组的长度


#### 变量分类与存储期限

##### 变量

- 局部变量
  - 定义：定义在函数里面的变量
  - 作用域：**块作用域**，从定义开始到块的末尾

- 全局变量（外部变量）
  - 定义：定义在函数外面的变量
  - 作用域：**文件作用域**，从定义的开始到文件末尾

##### 存储期限
- 定义：变量绑定的值可以被引用的时间范围
- 分类
  - 自动存储期限栈
    - 帧入栈和出栈
  - 动态存储期限程
    - 序员管理:malloc开始&free消亡
  - 静态存储期限
    - 进程运行全过程 

| 高地址 |内核区|存储期限|
|:-:|:----:|:---:|
|动态|**栈**（管理函数调用）|自动存储期限|
|动态|&darr; &uarr;||
|动态|**堆**（存放动态数据）|动态存储期限|
|数据|**数据段**|静态存储期限|
|低地址（指令）|**代码段**|静态存储期限|

- 局部变量的默认存储期限：自动存储期限
  - 改变方法：添加static关键字可以将其变成静态存储期限

#### 递归

- Recursion : 走重复的路，递是将大问题分解成子问题，归是把子问题的解合并成大的问题的解
  - 例子
    - 电影院的例子
    - Fibonacci数列
    - 汉诺塔问题
    - 约瑟夫环问题

##### 递归的三个原则

1. 找到问题的递归结构
2. 要不要使用递归求解
  - 存在重复计算问题
  - 问题缩减的幅度（若幅度太小，可能会栈溢出Stack Overflow）

    栈空间：
    - 主线程: ８M
    - 其他线程：2M
3. 大胆放心使用递归
　写递归时要注意：
  -  边界条件
  - 递归公式
    这一层和下一层之间的关系

##### 经典例题
######  Hanoi塔问题
思路：
- 递归过程
  1. 将上面的n-1个盘子经过目标盘子移动到中间盘子
  2. 将最大盘子移动到目标盘子
  3. 将n-1中的n-2个盘子从中间盘子经过起始盘子移动到目标盘子（回到更小规模的起始问题）
    - 将最大盘子移动到目标盘子
- 边界条件
  - 当n=1时，从起始移到目标盘子
  题解：
```c
void hanoi(int n, char start, char middle, char target){
    //边界条件，最后一个盘子移动到目标盘子
    if(n==1){
        printf("%c->%c\n", start, target);
        return;
    }
    //递归公式
    //将n-1个盘子，经过目标盘子，移动到中间盘子；
    hanoi(n-1,start,target,middle);
    //将最大的盘子移动到目标盘子
    printf("%c->%c\n", start, target);
    //将n-1个盘子，经过起始盘子，移动到目标盘子；
    hanoi(n-1,middle,start,target);
}

    //s(1)=1
    //s(n)=s(n-1)+1+s(n-1)
    //s(n)=2s(n-1)+1
    //s(n)+1=2s(n-1)+2
    //s(1)+1=2  s(n)+1=2^n  s(n)=2^2-1

    //打印移动次数
    printf("Total steps = %lld", (1ll<<n)- 1 );
```
###### Joseph环问题
思路：
- 递归过程
  - 每次杀掉一个人，问题规模都会缩小，重新编号形成新的小问题，这是递的过程
  - 从最后的一个人的编号推到所有人的编号的过程，是归的过程
  - 编号过程 eg. f(n,m)  =（7，3）
    |起 始| 0| 1| 2| 3|  4| 5| 6|
    |----|--|--|--|-|-|-|-|
    |第一轮| 4 |5|  | 0 | 1 |2 |3 |

    **f(n)=(f(n-1)+m)%n**
- 边界条件：
  
  - 当n=1时，返回1；
  题解：
```c
int joseph(int n, int m){
    //边界条件
    if(n==1){
        return 0;
    }else{   //递归
       return ((joseph(n-1,m))+m)%n;
    }
}

int main(){
    int n,m;
    printf("请输入人数n和间隔m:");
    scanf("%d %d", &n, &m);
    printf("存活的人的编号是：%d",joseph(n,m)+1);
}
```