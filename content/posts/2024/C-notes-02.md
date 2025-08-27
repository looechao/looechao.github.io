+++
title = 'C语言复习笔记-02'
date = 2024-05-03T15:38:13+08:00
draft = false
summary = "指针及相关应用"
tags = [ "技术", "C/C++"]

+++

# 指针及应用

## 指针基础

### 概念

- 地址： 计算机最小的寻址单位 - 字节
- 变量的地址：变量首字节的地址
- 指针：地址
- 指针变量：存储地址值的变量

### 语法
#### 声明
```c
int* p;
```
- 变量名：p
- 类型:
```c
int*
```
- 注意事项：
  声明指针变量时，要制定它指向的对象的类型
  类型
  - 内存大小
  - 怎么解释它指向的那片内存空间

#### 两个基本操作
- 取地址： & —— &i
- 解引用： * —— int* p = &i;
  *p有什么意义：
  - 指针变量指向对象的别名
  - 间接引用：访问内存两次

```c
printf("%d", *p);
*p = 10;
```
### 特殊指针

- 野指针：不知道指向哪个对象的指针（eg.选空指针）

  - 形式
  ```c
  int* p
  int* p = 0xCAFEBABE;  //用整数给其赋值
  ```

- 空指针：不指向任何对象的指针 —— NULL；

**不能对野指针和空指针进行解引用**，对野指针进行解引用操作是未定义行为，空指针没有指向变量；

### 给指针变量赋值

```c
//A.取地址
int* p = &i;
//B.用另一个指针赋值
int* q = p; //p,q 指向同一个对象
*p = *q  //使指向的变量相同
//C.使用空指针
int* p = NULL; 
```
## 指针的应用
- 作为参数使用：
  - 在被调函数中修改主调函数的值
```c
void swap(int* p1, int* p2) {
	int t = *p1; 
	*p1 = *p2;
	*p2 = t;
}

int main(void) {
	int a = 3, b = 4;

	printf("a = %d, b = %d\n", a, b);
	swap(&a, &b);
	printf("a = %d, b = %d\n", a, b);
	return 0;
}
```
- 指针作为返回值
```c
int* foo(void){
	int arr[]={1,2,3,4,5};
	return &arr[1];
}

int main(void){
	int* p = foo();
	printf("*p = %d\n", *p);
	printf("*p = %d\n", *p);
	return 0;
}
```
```bash
*p = 2
*p = -8598993460
```

  结论（教训）：**不要返回指向当前栈帧的指针**

## 常量指针 和 指针常量

本质：限制指针变量的写权限

|表达式|p代指的内存|i代指的内存|
|:----|:--------:|:------:|
|int* p = &i|r/w|r/w|
|int* const p = &i|r|r/w|
|const int* p = &i|r/w|r|
|const int* const p = &i|r|r|

### 常量指针

```c
const int* p = &i;
```

- const限制导致指针指向的值不能修改
- 可以修改路径, 即可以让指针指向别的元素空间

### 指针常量

```c
int* const p = &i;
```

- const限制了指针的路径的修改
- 可以修改指针指向的值

### 传入参数和传出参数
- const int* p
  - 传入参数，在函数里面不通过指针变量修改指向的对象
- int *p 
  - 传出参数，在函数里面可以通过指针变量修改指针指向的对象

## 指针的运算

### 指针的算术运算

注意：**指针不是整数**

1. 指针加上一个整数，结果仍然是一个指针

   ```c
   int arr[]={0,1,2,3,4,5,6,7,8,9};
   int* p = &arr[2];
   p = p+3;
   printf("*p = %d\n", *p);
   ```

2.  指针减去一个整数，结果仍然是一个指针 

3.  两个指针相减，结果是一个整数，类型变了

   ```c
   int *p = &arr[8];
   int *q = &arr[2];
   printf("p - q = %ld\n", p - q);
   printf("q - p = %ld\n", q - p);
   ```

   ```bash
   p - q = 6
   q - p = -6
   ```

   表示相隔的单位数量

### 逻辑运算

- 指针支持比较运算

## 指针和数组的关系

### 1. 用指针可以处理数组

```c
int main(void){
    int arr[] = {1,2,3,4,5,6,7,8,9,10};
    int sum = 0;
    for(int* p = &arr[0]; p < &arr[10]; p++){
        sum += *p;
    }
    printf("sum = %d\n", sum);
    
    sum = 0;
    for(int i = 0; i<10; i++){
        sum+=arr[i];
    }
    return 0;
}
```
#### *和++ --的组合

  ```c
  	sum = 0;
    int* p = arr[0];
    while(p < &arr[10]){
    sum += *p++;  //*和++ --的组合
    }
  ```
|组合形式|表达式值|副作用|
|:-----:|:----:|:----:|
|*p++      *(p++)|*p|p自增|
|(*p)++|*p|*p自增|
|*++p|*(++p)|p自增|
|++&#42;p  ++(*p)|(*p)+1|*p自增|

- 每次进行arr[i]时，都会进行加法和乘法运算

  ```mathematica
  i_addr = base_addr + i*4;
  ```

- 而使用指针顺序扫描时，只需要进行一次加法运算

  ```mathematica
  addr = addr + 4; 
  ```

  早期编译器对乘法的优化差，因此常用指针做处理

### 2. 数组可以退化为指针 
1. 在必要的时候（例如作为参数时），数组可以退化成指向它索引为0的元素的指针

    ```c
    for(int* p = arr; p< arr+10; p++){
        sum += *p;
    }
    ```

2. 数组在赋值表达式的右边时，会退化成指针

   ```c
   int *p = arr;
   ```

3. 数组参与算术运算的时候，也会退化成指针

   ```c
   arr+3;
   ```

### 3. 指针也支持取下标运算

```c
int arr[] = {1,2,3,4,5,6,7,8,9,10}
int* p = arr;
int sum = 0;
for(int i=0; i < 10; i++){
    sum+=p[i];   //指针取下标运算
}
return 0;
```

例如数组退化成指针 

```c
#define SIZE(a) (sizeof(a)/sizeof(a[0]))
// p[i] <=> * (p+i) <=> *(i+p) <=> i[p]
int  sum_array(int arr[];int n){   //arr的类型时int*
    int sum = 0;
    for(int i = 0; i< n; i++){
        sum + = *(arr+i)    //解引用
        sum + = i[arr];    //防御式编程
        sum + = arr[i];   //与上式效果一样
    }
    return sum;
}
```

# 字符串 

## 总纲

  - **C语言没有字符串类型**（没有String）
  - C语言中的字符串依赖在字符数组存在
  - C语言中的字符串是一种“逻辑类型”
    |h|e|l|l|o|&#92;|0|w|o|r|l|d|&#92;|n|
    |:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|

  该字符串是hello，因为后一位是\0空字符标志着结束

## 字符串字面值

字面值：“hello world” ，写死在括号里的是字面值

### 三种书写方式
```c
  printf("I love xixi  -- From looe\n");
  printf("I love xixi  \
         -- From looe\n");
  printf("I love xixi"  
         "-- From looe\n");
```

效果：

```bash
I love xixi -- From looe
I love xixi        -- From looe
I love xixi -- From looe
```

可以应用在打印图形上

- 注意区分常量和字面值

### 内存模式 
在内存中的代码段中，是不能够修改的，以空字符结尾

- 扩展-各种'空'
|名称|类型|
|:-:|:-:|
|void| 空类型|
|\0|   空字符|
|NULL | 空指针|
|“ ”| 空字符串|

### 操作
- 常量数组能支持的操作，字符串字面值都支持
  
  eg1.  指针思维
  
  ```c
  "ABC"[0] = 'a'
  char* p = "ABC" + 1; //指向B
  ```
  result
  ```bash
  B
  ```
  将“ABC”看成一个数组名
  
  ```c
  printf("abc");  //传入的其实是数组"abc"的地址
  ```
  
  eg2. 字面值的灵活应用
  
  ```c
  //数字转换成16进制
  char digit_to_hex(int digit){
  	return "0123456789ABCDEF"[digit];
  }
  ```

## 字符串变量

### 声明和初始化

1. 初始化字符数组

  ```c
  char str1[10] = {'h','e','l','l','o','\0'}; //数组的初始化
  ```
  上例字符串的长度是5，字符数组长度为10；

2. 初始化字符串

  ```c
  char str2[] = "Hello";  //语法糖，这里的"hello"是字符串数组初始化的简写形式
  ```

- 长度问题：
  ```c
   char str[] = "hello";  //长度为6，表示字符串
   char str[5] = "hello"; //长度为5，不表示字符串
  ```
  
- 注意事项
     ```c
     char str[] = "hello";  //"hello":数组的初始化式
     char* p = "hello";    //“hello”:字符串字面值
     ```

### 读和写操作（和用户交互）
常用%s对字符串进行读写操作

- 写操作
  ```c
  char str[] = "Hello world";
  printf("%s\n", str);
  printf("%s.5\n", str);   //%s.p 最多输出p个字符
  puts(str);
  ```
  
  result
  ```bash
  Hello world
  Hello
  Hello world
  ```
  
  puts(str)，等价于 printf("%s\n",str)  但是puts效率更高
  
- 读操作，匹配规则
  
  ```c
  #define MAX_LEN 128
  char str[MAX_LEN];
  scanf("%s", str);  //数组不需要加取地址运算符，会忽略前置空白字符
  printf("%s", str);
  return 0;
  ```
  
  result:
  ```bash
  D:\home\   hello world
  hello
  ```
   %s的匹配规则：
  
  常用于读取一个单词
  
  - 忽略前置的空白字符
  
  - 遇到空的字符结束
  
  
  缺点：
   1. 不能存储空白字符
   2. 不会检查数组越界，很容易输入过多超过下标
- gets对字符串进行读写操作
  ```c
  char str[MAX_LEN] = "Hello world"
  printf("%s\n", str);
  gets(str);  //读取一行数据，存入字符数组，并将换行符替换成空字符，不会检查越界
  fgets(str,MAX_LNE,stdin); //和gets相比，会检查数组是否越界，会存储换行符，并在后面添加空字符
  ```
  
### 常用操作

- strlen

```c
#include<string.h>

strlen("ABC") //结果是3，不会计算空字符

const char* p = s;
while(*p){
    p++;
}
return p - s;
```

- strcpy & strncpy
```c
cahr s1[MAX_LEN]
strcpy(s1,"hello world");
strncpy(s1, "helloworld", MAX_LNE-1);
s1[MAXL_LEN - 1] = '\0';

return 0;
```

- strcat & strncat

- strcmp
  类比于做减法

- 惯用法：

```c
while(*s1++ == *s2++);
```

**数组只支持取下标操作，不能赋值**

- 注意事项
  
  1. 字符串必须以‘\0’空字符结尾
  2. 在C语言中iqu字符串的长度不是O(1)的时间复杂度

## 字符串数组
### 二维字符数组

字符数组的数组

```c
char planets[][] {}
```
特点：
- 可能会浪费内存空间
- 不灵活
### 字符指针数组

字符指针数组，实质上是一维数组
特点：
- 灵活

## 命令行参数

### 概念

- 操作系统调用main函数时，传递的参数

### 使用方法
main（**状态码**） &rarr; 操作系统； 0成功，非0失败 

操作系统（**命令行参数**）&rarr; main

```c
int main(int argc, char* argv[]){
    // argc: argument count,命令行参数的个数
    // argv: argument vector,命令行参数，字符串
    // 第一个参数，即argv[0]是可执行程序的路径
    printf("argc = %d\n", argc);
    //打印所有的命令行参数
    for(int i = 0; i < argc; i++){
        puts(argv[i]);
    }
    
    //命令行参数的转换
    //xxx.exe n f
    //argv[0] argv[1] argv[2]
    
    int n;
    float f;
    
    sscanf(argv[1],"%d",&n);
    sscanf(argv[2],"%lf",&f);
    
    return 0;
}
```

result:

```bash
argc = 1
D:\Documents\Coding\wangdao-coding-notebook\summer-camp\practice\CDay008.c\output\p1.exe  
```

- 命令行参数都是字符串
  - 参数的转换：sscanf(....);

- 命令行参数的转换

​    stdin(字符数据)scanf &rarr;程序&larr; sscanf字符串（内存）

### 两个问题

- 命令行参数和stdin读取数据有什么区别?

  - 命令行参数执行时程序未执行
  - stdin读取数据程序已经执行

- 命令行参数有什么作用?

  - 能够写出非常通用的程序

    ```bash
    cp src dst
    ```
    
  - 改变程序的行为，参数不同，行为不同
    
    ```bash
    ls -l
    ```

## 结构体
### 基础概念

C语言中的结构体，自定义类型，类似于其它语言中的类

特点：C语言中的结构体只有属性，没有方法（可以用函数指针解决这个问题）
- 定义/声明并初始化
```c
struct student{
    int id;
    char name[25];
    char gender;
    int chinese;
    int math;
    int english;
};

int main(void){
    //声明并初始化变量
    struct student s1 = {1,"xixi",'F','100','100','100'};
    struct student s2 = {2, "peanut", 'M'};   //未指定的成员，会赋0值
    return 0;
}
```

### 内存模型

结构体内存模型的特点：

1. 一片连续的内存空间

2. 会按类型声明的顺序存放每一个成员
| id(int) | name(char) | gender(char) | chinese(int) | math(int) | english(int) |
| ---- | ---- | ------ | ------- | ---- | ------- |
| 4    | 25   | 1+2      | 4       | 4    | 4       |
3. 在结构体变量的中间或者后面，可能会有一些填充
   
    若没有填充，结构体的大小应该是42字节，但结果是44字节，填充部位在gender和chinese之间，填充是为了**内存对齐**；早期的计算机访存时，一次性读4个字节，因此对齐是为了防止访存顿挫（一个对象访存两次）, 提高性能

### 操作
#### 获取成员 
- .获取成员运算符
```c
printf("%d", s1.id);
```

- 语法糖 ->运算符

左边是结构体指针,右边是成员

```c
printf("%d",s->id); 
```

等价于

```c
(*s).id
```



#### 赋值

  - 赋值操作的本质:
    内存空间的复制,把s1代指的内存空间复制到s2代指的内从空间
  - 缺点:
    当传递或者返回一个结构体时,都会产生一个结构体的复制,耗时,影响程序的性能
```c
//结构体变量的赋值
//更习惯传递一个指向结构体变量的指针，避免整个结构体的复制
student s1;
student s2;
s2 = s1;

void print_stu_info(const struct student* s){
	printf("%d\n",(*s).id)//注意优先级,*s.id不可用
}
```

#### 定义别名

- 匿名结构体: 没有标签的结构体类型
```c
struct {
	int id;
	char name[25];
	char gendaer;
} s1,s2;
```
s1, s2 是变量

```c
struct student{
	int id;
	char name[25];
}
student s1,s2;
```
s1,s2 与eg1相同

```c
typedef struct student{
	int id;
	char name[25];
} Student, *pStudent;

// 等价于 
Student* pstudent;
```
用student 起别名, 用*pStudent作为别名的指针

- 为结构体类型起别名

```c
// typedef 类型 别名
typedef struct student{
    int id;
    char name[25]
    char gender;
    int chinese;
    int math;
    int english;
}Student;

int main(void){
    //两种声明对比
    Student s1 = {1,"xixi",'F','100','100','100'};   //匿名结构体
    struct student s1 = {2,"penut",'F','100','100','100'};
}
```

注意：**不要给指针类型定义别名**

### 枚举

- 作用: 表示一些离散值(例如 类别 状态), 有提高代码可读性的作用，在底层就是整数；

- 语法

  - 定义枚举类型

  - 使用枚举值
```c
typedef enum suit{
    //罗列的是枚举值
    DIAMOND,    // 0
    CLUB = 4,
    HEART = 10,
    SPADE       // 11
}Suit;

int main(void){
    enum Suit suit1 = DIAMOND;
    //定义别名后
    Suit suit1 = DIAMOND;
}
```

## 指针的高级用法

### 动态内存分配 ⭐

进程的虚拟内存空间, 堆空间的管理常用算法(freelist/伙伴算法)

|                |                        |
| :------------: | :--------------------: |
|     高地址     |         内核区         |
|      动态      | **栈**（管理函数调用） |
|      动态      |     &darr; &uarr;      |
|      动态      | **堆**（存放动态数据） |
|      数据      |       **数据段**       |
| 低地址（指令） |       **代码段**       |

- 管理堆很麻烦，为什么要在堆中存放动态数据, 而不是在栈中？
  1. 栈帧的大小是在编译期间就确定的,不能存放动态大小的数据
  2. 栈空间是有限的,不能存放很大的数据(主线程: 8M, 其它进程2M), 而堆区常常多达几个GB.
  3. 栈空间最好不要放多线程的数据，有可能堆中放的是共享数据，放在栈中容易被释放
  
- 什么是动态大小的数据

  ```c
  int main(void){
      int n = 10;
      int arr1[n];//动态大小，在运行时才能确定，不存栈里
      int arr2[10];
      return 0;
  }
  ```

  


### 如何申请堆空间

#### void* - 通用指针类型
  - 指向对象的类型还不确定， 因此不能够直接操作通用指针（解引用等）
  - 作用： 可以和其它类型指针相互转换
  - 缺点：通用指针不能参与指针的运算（解引用，自增减等）

  eg.
  ```c
  void* p = malloc(sizeof(int)*100);
  p++;  //该操作非法，不能对通用指针进行直接操作
  ```

#### malloc函数

memory allocate

  ```c
    void* malloc(size_t size);
  ```

```c
  int main(void){
      int* p = malloc(sizeof(int)*100);  //通用指针转换成int*      
      if(p == NULL){   //判断空间是否申请成功
          printf("Error: malloc failed in main.");
          exit(1);
      }
      
      if(!p){   //p指向的对象不存在
          printf("Error: malloc failed in main.");
          exit(1);
      }
  }
```

  |栈帧|变量|
  |---|:-:|
  |main|p &darr;|
  |堆|一串数组（连续空间）|

​    用栈上的指针访问堆中的数据

​    分配size个字节的内存块

#### catlloc函数

clear + allocate

```c
int* p = calloc(100,sizeof(int));
//            元素个数  元素大小
if(!p){
    printf("")
}
```

#### realloc函数

重新分配内存空间

```C
void* realloc(void * ptr, size_t size);
//*ptr指向先前分配的内存块
//size 指新内存块的大小
```

- 缩容

  截断最后的部分，前半部分保持不变

- 扩容

  1. 原地扩容，不一定成功，而且扩容出来的空间不一定是初始化的
  1. 若扩容失败，空间不足，会在堆中重新申请足够大的内存空间，把旧的数据拷贝过去并释放旧的内存块，返回新空间的整体指针

- 若申请失败，返回NULL, 并且旧的内存块不会被释放

##### 惯用法

```c
void *p = realloc(ptr, size);
if(!p){
    //错误处理
}
ptr = p;

//错误用法,会产生垃圾空间
ptr = realloc(ptr,size);

```

#### free

##### 分类

- 垃圾回收器：减轻程序员负担
  - 不确定因素 -> stop the world ->不适合写实时系统，必须在某个确定时间内完成某个任务
- 没有垃圾回收器（C/C++/Rust）
  - C     :    free
  - C++ :    析构函数/RAII机制/智能指针 
  - Rust:    所有权机制

##### 错误用法

两种错误操作

1. double free
2. use after free

结论：**当堆上数据不再使用时，应该有且只释放一次**

```c
int main(void){
    //1. double free
    int* p = malloc(100 * sizeof(int));
    free(p); //该操作不会改变P的值，只会将P指向的内存空间释放出去
 	//执行完成上述操作后，p会编程悬空指针（野指针的一种）
    
    //2. use after free
    int* p = malloc(100 * sizeof(int));
    free(p);   //p成为悬空指针
    p[o]=1; //use after free;
    return 0;
}
```

## 动态数组

从内存模型开始逐步分析实现一个Vector

### 内存模型

|elements|* |
|-|-|
|capacity|int |
|size|int |

### 头文件

vector.h

```c
typdef int E;   //增加灵活性

typedef struct vector{
    E* elements;
    int capacity;
    int size;
} Vector;
```

方法（API声明）

```c
//构造函数
Vector* vector_create(void);
//析构函数
void vector_destroy(Vector* v);

void push_back(Vector*v, E val);
void push_front(Vector*v, E val);
void pop_back(Vector*v, E val);
void pop_front(Vector*v, E val);
```

### API实现

vector.c

```c
#include<stdlib.h>
#include<stdio.h>
#include "Vector.h"  
//""搜索路径：当前目录->系统头文件包含目录下
//<>搜索路径：系统头文件包含目录下
#define DEFAULT_CAPACITY 8   //避免频繁扩容
#define PREALLOC_MAX 4096 //扩大到的内存空间上限
// 创建空的动态数组
Vector* vector_create(void){
    Vector* v = malloc(sizeof(Vector));
    if(!v){   //抛出错误异常
        printf("Error: malloc failed in vector_create");
        exit(1);
    }
    v->elements = malloc(DEFAULT_CAPACITY* sizeof(E));
    if(!v->elements){
        free(v);
        printf("Error: malloc failed in vector_create");
        exit(1);
    }
    v -> capacity = DEFAULT_CAPACITY;
    V -> size = 0;
    return v;
}

//扩容策略，不算API，用户不需要知道
void grow_capacity(Vecot *v){
    int new_capacity = v->capacity < PREALLOC_MAX ?
        v-> capacity << 1 : v -> capacity + PREALLOC_MAX;
    
    // v->elements = realloc(v->elemets, new_capacity * sizeof(E));   //错误用法，realloc失败会返回NULL,原来的内存空间不会被释放
    E* temp = realloc(v->elemets, new_capacity*sizeof(E));
	if(!temp){
        printf("Error: malloc failed in grow_capacity");
    	exit(1);
    }
    v -> elements = temp;    //改变指向的新的结构体
    v -> capacity = new_capacity;   //更新容量
}

void push_back(Vector* v, E val){
    //判断是否需要扩容
    if(v->size == v-> capacity){
        grow_capacity(v);
    }
    //添加元素val
    v->elements[v->size++] = val;   //只要更改size就可以
}

void vector_destroy(Vector* v){
	//原则，要按照申请的相反顺序释放
    free(v->elements);   //悬空函数
    free(v);
}
```

### 主函数

main.c 用于进行单元测试

- 依赖接口(*.h Interface)，不要依赖实现(.c文件)：

    因为接口是稳定的，而实现常常是会变化的、不稳定的

- 依赖关系

  main.c -> vector.h（接口:类型定义和API声明）<- vector.c（实现）


```c
#include<stdio.h>
#include<vector.h>

//单元测试
int main(){
    // 创建空的动态数组
    Vector* v = vector_create();
    
    // 添加元素
    for(int i = 1; i < 200; i++){
        push_back(v,i);
    }
    
    // 销毁
    vector_destroy(v);
    return 0;
}
```

### 大端法和小端法

- 大端法：低有效位放在高地址
  - 一般英特尔系CPU采用小端法

- 小端法：低有效位放在低地址
  - 网络里的数据一般采用大端法
  - spark芯片采用大端法

```c
值-------编码------> 二进制-----大端法/小端法----->内存存储

1 ---补码--->0x00000001---大端法---->00000001（低->高）
1 ---补码--->0x00000001---大端法---->01000000（低->高）

```



## 链式结构

### 链表

- 数据域：存放数据
- 指针域：存放节点的地址

#### 分类

- 单向链表

  最后一个节点的指针是空指针

- 单向循环链表

  环形

- 双向链表

  首节点的prev指针和尾节点的next指针为空

- 双向循环链表

#### 构建

声明和初始化

```c
typedef struct node{
    int data;
    struct node* next;
}Node;
//OnePass过程
//从头到尾遍历一次，提前使用Node编译器会不认识


//头插法插入节点
Node* addNode(Node* head, int data){
	//创建节点
    Node* new_node = malloc(sizeof(Node));
    if(!new_node){
        printf("Error:malloc failed in addNode.\n");
        exit(1);
    }
    //初始化节点
    new_node->data = data;
    new_node->=head;
    head = new_node;
    
    return head;
}

int main(void){
	Node* head = NULL; //空链表
    head = addNode(head, 1);
    head = addNode(head, 2);
    head = addNode(head, 3);  

    return 0;
}	
```

## 二级指针

```c
     [*]---------->[*]--->[int i = 10]
    ptr2           ptr1    
int** ptr2        int* ptr1
```

| 表达式 | 访存次数 | 等价于 |
| :----: | :------: | :----: |
| **ptr2 |    2     | *ptr1  |
| *ptr1  |    1     |  ptr1  |

### 使用时的问题 

QA：传一级指针还是传二级指针？

  想修改哪个变量，就传递那个变量的地址

  - 想修改指针指向的对象，传递一级指针
  - 想修改指针的指向（值），传递二级指针

## 函数指针

### 基本概念

```asm
main:
        push    rbp
        mov     rbp, rsp
        sub     rsp, 16
        call    foo
        mov     QWORD PTR [rbp-8], rax
        mov     rax, QWORD PTR [rbp-8]
        mov     eax, DWORD PTR [rax]
        mov     esi, eax
        mov     edi, OFFSET FLAT:.LC0
        mov     eax, 0
        call    printf
        mov     rax, QWORD PTR [rbp-8]
        mov     eax, DWORD PTR [rax]
        mov     esi, eax
        mov     edi, OFFSET FLAT:.LC0
        mov     eax, 0
        call    printf
        mov     eax, 0
        leave
        ret
```

函数指针指向函数的起点，在汇编中遇到ret会停止

- 函数指针变量类型的声明

 ```c
    int   (*p)(int, int); //声明指针变量
返回值类型       参数类型    //foo, &foo
    int*   p2(int, int);  //声明函数，返回int*
 ```

- 赋值

```c
int foo(int a, int b){
    return 1;
}

int main(void){
    int (*p1)(int, int) = foo;
    int (*p2)(int, int) = &foo;  //效果一样
}
```

- 操作

```c
p(a,b);      //对应 int (*p)(int,int) = foo;
(*p)(a,b);   //对应 int* p(int,int) = &foo;
```

### 使用

```c
int add(int a, int b){
    printf("%d+%d=%d\n",a,b,a+b);
    return a+b;
}

int add(int a, int b){
    printf("%dx%d=%d\n",a,b,a*b);
    return a*b;
}

int main(void){
    //声明函数指针变量，并赋值
    int (*p1)(int, int) = add;
    int (*p2)(int, int) = &mul;
    //通过函数指针调用函数
    p1(3,4);       
    (*p2)(3,4);   
}
```

### 作用

函数式编程（javascript, python,....闭包等），C通过函数指针支持函数式编程，可以传递函数指针，返回函数指针

- 编写一些非常通用的函数

- 分解任务，解耦合
  

### 例子（Qsort）：

```c
//通过qsort函数演示函数指针的应用
//可以对任意一个数组进行排序
//将元素从小到大进行排序
//base 指向起始地址
//memb 待排序的元素个数
//size 每个元素的大小
//compar 函数指针，类比strcmp进行理解

// void qsort(void* base, size_t nmemb, size_t size, int (*compar)(const void *, const void *));

typedef struct{
    int id;
    char name[25];
    char gendar;
    int chinese;
    int math;
    int english;
} Student;

// 封装比较规则：按总分从大到小排序
// 如果总分相同，按语数外的成绩从大到小排序
// 如果各科成绩都一样，再按ID从小到大排序


//若返回值小于0，则认为p1<p2, 
//若返回值等于0，则认为p1=p2, 
//若返回值大于0，则认为p1>p2, 
int cmp(const void* p1, const void* p2){
    //指定通用指针的类型
    Student* s1 = p1;
    Student* s2 = p2;
    
    int total1 = s1->chinese+s1->math+s1->english;
    int total2 = s2->chinese+s2->math+s2->english; 
    if(total1!=total2){
        return total2 - total1;  //总分越高越靠后
    }
    if(s1->chinese!=s2->chinese){
        return s2->chinese - s1->chinese;
    }
    if(s1->math!=s2->math){
        return s2->math - s1->math;
    }
    if(s1->english!=s2->english){
        return s2->english - s1->english;
    } 
    
    return s1 -> - s2->id;
}

void print_stu_info(const &Student* s){
    printf("%d %s %c %d %d\n",
          s->id,
          s->name,
          s->gendar,
          s->chinese,
          s->math,
          s->english);
}

int main(){
    Student students[5];
    //从键盘录入信息
    for(int i = 0; i < 5; i++){
        scanf("%d%s %c%d%d",
              &students[i]->id,
              students[i]->name,
              &students[i]->gendar,
              &students[i]->chinese,
              &students[i]->math,
              &students[i]->english);
    }
    
    //从小到大排序
    qsort(students,5,sizeof(Student),cmp);
    
    printf("------------------");
    for(int i = 0; i < 5; i++){
        printf_stu_info(&student[i]);
    }
    return 0;
}
```

### 总结

函数式编程的过程

```bash
[qsort() 函数]<------->[cmp() 函数]
               函数指针   钩子函数
```

qsort 通过函数指针调用用户修改好的cmp()函数，分解任务和解耦合

追求了高内聚低耦合的特性

