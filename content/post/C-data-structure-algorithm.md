+++
title = '常用的数据结构和算法'
date = 2024-05-10T22:53:13+08:00
draft = false
summary = "动态数组，链表，栈，队列，哈希表，位图，二叉树，排序，二分查找"
tags = [ "技术", "C/C++"]
+++
# 数据结构和算法

## 动态数组（Vector）

分析过程

- 模型

- 基本操作

  - 增

    一般在末尾添加

  - 删

    一般在末尾删除

  - 查找

    - 根据索引查找值
    - 查找与特定值相等的元素（有序用二分/无序顺序查找）

  - 遍历

- 实现

## 链表

- 数据域：存放数据
- 指针域：存放节点的地址

### 分类

- 单向链表

  最后一个节点的指针是空指针

- 单向循环链表

  环形

- 双向链表

  首节点的prev指针和尾节点的next指针为空

- 双向循环链表

### 单链表操作

|          操作          | 复杂度 |
| :--------------------: | :----: |
|  增(某个节点后面添加)  |  O(1)  |
|  删(某个节点后面删除)  |  O(1)  |
|     查（根据索引）     |  O(n)  |
| 查（与特定值相等的点） |  O(n)  |
|          遍历          |  O(n)  |

- 增：在某个节点后面添加

  ```
  new_node->next=curr->next
  curr->next = new_node;
  ```

- 删：在某个节点后面删除

  ```c
  curr->next = curr->next->next;
  ```

- 查：

  - 根据索引查找结点

  - 查找与特定值相等的节点
    - 元素大小无序
    - 元素大小有序

- 遍历：正向遍历

### 实现单链表

list.h

```
NODE    []]----->[]]----->[]]---->[]]---->[]]
         ^                                 ^
         |                                 |
LIST   head                              tail
```



```c
typedef int E;

typedef struct node{
    E data;
    struct node* next;
}Node;

typedef struct{
    Node* head;
    Node* tail;    
    int size;
}List;

//API
List* list_create(void);
void list_destroy(List* list);

//插入
void add_before_head(List* list, E val);
void add_behind_head(List* list, E val);
void add_node(List* list, int idx, E val)
```

list.c

```c
#include"List.h"
#include<stdio.h>
#include<stdlib.h>

//API
List* list_create(void){
    return calloc(1,sizeof(List)); //创建并清零
}

void list_destroy(List* list);

//头插法
void add_before_head(List* list, E val){
    //1.创建新节点
    Node* new_node = malloc(sizeof(Node));
    if(!new_node){
        printf("Error:malloc failed in add_before_head");
        exit(1);
    }
    //2.初始化节点
    new_node -> data = val;
    new_node -> next = list->head;
    //3.更新链表的信息
    list->tail = new_node;
    if(list->tail == NULL){
		list->tail = new_node;
    }
    list->size++;
}

void add_behind_head(List* list, E val){
    //1.创建新节点
    Node* new_node = malloc(sizeof(Node));
    if(!new_node){
        printf("Error:malloc failed in add_behind_head");
        exit(1);
    }
    //2.初始化节点
    new_node -> data = val;
    new_node-next = NULL;
    //new_node -> next = list->NULL;空指针解引用异常
    //3.链接到尾部
   	if(list->tail == NULL){
        list->head = new_node;
        list->tail = new_node;
    }else{
        list->tail->next = new_node;
        list->tail = new_node;
    }
    //4.更新链表的信息
    list->tail = new_node;
    if(list->tail == NULL){
		list->tail = new_node;
    }
    list->size++;
}


void add_node(List* list, int idx, E val){
    //参数校验
    if(idx < 0 || idx > list->size){
        printf("Error:Illegal Argument: idx = %d, size = %d\n", idx, list-> size);
        exit(1);
    }
    if(idx = 0){
        add_before_head(list,val);
        return;
    }
    if(idx == list->size){
        add_behind_tail(list,val);
    }
    //在链表的中间插入
    //找索引为idx-1的节点
    //循环不变式，current和i对应
    //进入循环体前一直不变的关系
    Node* curr - list -> head;
    for(int i = 0; i < idx-1; i++){
 		curr = curr->next;       
    } // i = idx - 1,curr指向索引为idx-1的节点
    //再curr后添加节点
    //1.创建新节点
    Node* new_node = malloc(sizeof(Node));
    if(!new_node){
        printf("Error:malloc failed in add_behind_head");
        exit(1);
    }
    //2.初始化节点
    new_node -> data = val;
    new_node-next = curr->next;
    //3.链接
    curr->next = new_node;
    //4.修改链表的信息
    list->size++;
    }
}
```

main.c

```c
#include"List.h"
//单元测试
int main(void){
    List* list = list_create();
    add_before_head(list,1);
    add_before_head(list,1);
    add_before_head(list,1);
    add_before_head(list,1);
    
    return 0;
}
```

### 双链表

```bash
[*][D][*] <====> [*][D][*] <====> [*][D][*] 
```

- 基本操作

  - 增：在某个节点前面添加0

  - 删：删除当前节点

  - 查

    - 根据索引查找值
    - 查找特定值相等的点（无序O(n) / 有序）
    
    ```c
    //优化
    Static Node* last;  //记录上一次查找的节点
    ```
    
    |操作|根据索引查|遍历时间|根据定值查|
    |:-:|:--:|:---:|:---:|
    |单链表|O(n)|n/2|效率低|
    |双链表|O(n)|n/4|效率高(优化)|
    
    - 查找前驱节点：O(1)
  
- 拓展 - 关于空间和时间

  - 空间换时间：缓存，缓冲
- 时间换空间：压缩，交换区(swap area)

- 优点：
  - 效率高（空间换时间）

### 常见面试题

#### 1. 求链表中间结点的值

   ```bash
   Eg1.
      input: 1-->2-->3
     output: 2
   Eg2.
      input: 1-->2-->3-->4
     output: 3
   ```

   - 思路1

     - 遍历链表，求链表的长度n
     - 求索引为n/2的节点

   - 思路2

     - 使用快慢指针fast和slow指针，

     - fast走两步，slow走一步

     - 当fast到达末尾时，返回slow所指的结点

       **注意短路原则**：

       ```bash
       fast->next == NULL || fast == NULL (x)
       //fast->next == NULL可能对空指针进行解引用
       //应该使用下面的方法
       fast == NULL || fast->next == NULL (V)
       ```

#### 2. 判断单链表是否有环

   ```bash
   [1][*]--->[2][*]--->[3][*]--->[4][*]---->NULL
   
   
                        <----------- ^
                        |            |
   [1][*]--->[2][*]--->[3][*]--->[4][*]
   
   
     <------------------------------ ^
     |                               |
   [1][*]--->[2][*]--->[3][*]--->[4][*]
   
   ```

   ```c
   bool hasCycle(struct ListNode *heaed);
   ```

   - 思路1 - 迷雾森林

     - 用travelled存放：已遍历节点的指针
     - 遍历节点：
       - 判断当前节点curr, 是否在travelled集合
         - 是：true;
         - 否：将curr节点添加到travelled集合
       - curr = NULL, false;
     - 时间：和集合travelled的查找算法相关，如果使用hashtable, 复杂度为O(n)
     - 空间：O(n);

   - 思路2 - 快慢指针

     可以类比跑道

     ---

     ​               fast

                       &darr;

       &uarr;

     slow

     ---

     - 如果是无环的，则fast和slow永远不可能相遇

     - 若有环，fast和slow一定会再一次相遇

     - 时间：O(n)，慢指针走不了一圈
     - 空间：O(1)

#### 3. 反转单链表

```c
struct ListNode* revereseList(struct ListNode* head);
```

```c
Eg1.
   input: 1-->2-->3
  output: 3-->2-->1
Eg2.
   input: 1
  output: 1
```

- 思路1 - 头插法

  遍历链表，依次反转每一个元素, 添加到新的链表中

  ```bash
      NULL    [1][*]----->[2][*]--->NULL
       ^       ^           ^
       |       |           |
  prev[*]     [*]curr     [*]next
  ```

  - 时间：O(n)
  - 空间：O(1)

- 思路2 - 递归

  - 边界条件：

    ```C
    head == NULL || head->next -> NULL
    ```

  - 递归

    在反转后n-1个节点的情况下，如何反转第一个节点

  - 时间：O(n)

  - 空间：O(n)

#### 4. 合并两条有序单链表

```bash
Eg1.
   input: 1-->3-->5
          2-->4-->6
  output: 1-->2-->3-->4-->5-->6
Eg2.
   input: 1-->2-->3-->4
          6-->7-->8
  output: 1-->2-->3-->4-->6-->7-->8
```

- 思路 - dummy node

  通过使用哑节点来简化链表的操作

  ```bash
  dummy node
    [ ][*]--> [1][*]--> [2][*]
     ^
     |
    [*]
    head
  ```

## 栈

线性表：数组、链表

### 模型

  栈是操作受限的线性表，只能在线性表的同一端进行添加或删除元素，FIRST IN LAST OUT;

  ```bash
      |_____|栈顶(只能在栈顶操作)
      |_____|  
      |_____|
      |_____|
      |_____|栈底
  ```

- Q：为什么需要栈这种数据结构

  - 安全
  - 可读性强
  - 和现实生活中的场景是对应的

### 基本操作

  - 添加 push
  - 删除 pop
  - 查找(查看栈顶) peek
  - 判空 empty  可用于遍历栈

### 实现

可以通过链表实现栈

Q：用单链表还是双向链表？

```bash
    [ ][*]-->[ ][*]-->[ ][*]-->[ ][*]
     ^                          
     |                          
  top[栈顶]
```

单链表的栈顶的不能通过增删操作判定，需要从遍历看，单链表只能从表头开始遍历

### 应用

栈一般应用在符合LIFO特性的场景

- 函数调用栈

  ```bash
  · call main() 入栈
  |
  ---· call foo() 入栈
     |
     ·----· call bar() 入栈
          |
     ·----· return bar() 出栈
     |
  ---·return foo() 出栈
  |
  ·return main() 出栈
  ```

- 符号匹配问题

  ```c
  { [ ( ) ] }
  1 2 3 3 2 1
  ```

  遍历字符串

  1. 遇到左括号，将对应的右括号入栈
  2. 遇到右括号，出栈，判断是否和遇到的符号相等
  3. 遍历完成后，若栈为空，返回true

- 表示优先级

  常使用**单调栈**表示优先级，例如表达式求值问题

  - 中缀表达式

    人类视角下尝试用中缀表达式

    ```bash
    a+b*c/d  =>  优先级
    1 + 3 * 4 / 2
    ```

  - 后缀表达式

    ```bash
    1 3 4 * 2 / +
    ```

    没有优先级，运算符出现的顺序，就是实际执行的顺序

  Q. 如何计算后缀表达式？

  - 遇到操作数
    - 入栈
  - 遇到运算符
    - 连续出栈两个操作数
    - 计算
    - 将结果入栈
  
- 用栈来记录轨迹

  - 浏览器的前进/后退功能

    HTTP是无状态的协议，每一次请求都是独立的浏览器可以通过两个STACK来存放网页地址

    ```bash
                |___|
    |___|       |___|
    |___|       |___|
      A           B
    ```

    A存放访问页面，B存放关闭了的页面，当后退时，会将B的栈顶入栈到A

  - 深度优先搜索

  - 回溯算法

## 队列

### 模型

操作受限的线性表，一端添加元素，另一端删除元素，FIFO

```
         _______________
<---出队  a1 a2 a3 ... an   <--入队
         _______________
```

### 基本操作

- 入队 queue_push
- 出队 queue_pop
- 查看队头元素 queue_peek
- 判空 queue_empty
- 判满 queue_full

### 实现

可以通过动态数组实现队

- 方案A, 用rear标识队尾

  ```
   [A][B][C][D][E][F][G]
                      |
                      |
    0  1  2  3       rear
  ```

  | 操作 | 时间复杂度/方法 |
  | ---- | --------------- |
  | 入队 | O(1)            |
  | 出队 | o(n)            |
  | peek | O(1)            |
  | 判空 | rear = 0        |
  | 判满 | rear = capacity |

  缺点，出队复杂度过高

- 方案B，用front和rear标识队头队尾

  ```bash
   [A][B][C][D][E][F][G]
    |                 |
    |                 |
  front              rear
  ```

  | 操作 | 时间复杂度/方法         |
  | ---- | ----------------------- |
  | 入队 | O(1)                    |
  | 出队 | o(1)                    |
  | peek | O(1)                    |
  | 判空 | front - rear = 0        |
  | 判满 | rear - front = capacity |

  两种判满方式的比较

  | 方式                    | 缺点             |
  | ----------------------- | ---------------- |
  | rear = capacity         | 浪费大量空间     |
  | rear - front = capacity | 需要大量移动元素 |

- 方案C 采用循环数组

  ```bash
  [ ][ ][ ][A][B][C][D][E][F][G] capacity
   |        |                       |
   |        |                       |
  rear    front                    rear
  ```

  当rear达到容量时，可以让其指向数组起点

  ```math
  rear+1 % capacity
  ```

  - 扩容：

    - 如果采用**realloc扩容**， 会破坏队列的逻辑结构

    ```bash
    [A][B][C][D][ E ][F][G]
                 | |
                 | |
                 f r
    
    [A][B][C][D][E][F][G][ ][ ][ ][ ][ ][ ][ ]
                 |        |
                 |        |
                 f        r 
    ```

    - 使用**malloc扩容**，会重新申请一篇更大的空间，并将元素迁移到新的空间

    ```bash
    step 1:队满
    [A][B][C][D][ E ][F][G]
                 | |
                 | |
                 f r
    step 2:扩容
    [E][F][G][A][B][C][D][ ][ ][ ][ ][ ][ ][ ]
     |                    |
     |                    |
     f                    r
     
     step 3:
     清除旧数组的内从空间
    ```

    

  - 入队：注意使用扩容策略

    ```c
    if(需要扩容){
        grow_capacity();
    }
    elemnts[rear] = val;
    rear = (rear+1)%capcaity;
    ```

  - 出队

    ```c
    front = (front + 1)%capacity
    ```

  - 查看队头

    ```c
    elements[front]
    ```

  - 判空

    ```c
    rear = front; 
    ```

  - 判满

    ```c
    type 1:队满
    [A][B][C][D][ E ][F][G]
                 ^ ^
                 | |
                 f r
    此时队满条件
    rear = front
    与队空条件重叠
        
    解决方法1
    添加size 属性,队满条件 
    rear == front && size == capacity
        
    解决方法2
    空出一个位置,队满条件 
    [A][B][C][D][ ][F][G]
              ^     ^
              |     |
              r     f
    ```

- 结构体

  ```c
  //Queue.h
  #define MAX_CAPACITY
  typedef int E;
  typedef struct{
      E* elements;
      int front;
      int rear;
      int size;
      int capacity;
  }Queue;
  __________
  |*elements|   ---->  [ ][ ][ ][ ]
  
  ```

### 应用

- 缓冲（FIFO, 具有公平性）

  例如电商平台的促销活动，订单放入缓冲区（队列），采用有界队列可以防止OOM（Out Of Memory, 会杀死进程）

- 消息队列

  中间件的一种，处理单点故障

  ```bash
        [单点故障]---[B]
          |    /   |
         [A]------[C]   
     
     一个集群耦合，会导致故障扩散 
    
         [单点故障]------[B]
          | \          / |
          |   [消息队列]  |
          | /          \ |
         [A]------------[C]
  ```

- 广度优先搜索DFS

  社交平台三度好友，人脉圈

## 哈希表 ⭐

QA：为什么需要哈希表？

- 扩展- Key-Value **键值对数据**

  | 键     | 值           |
  | ------ | ------------ |
  | 单词   | 释义         |
  | 账号   | 账号信息     |
  | 关键字 | 一串相关网页 |

- 统计一个文件中，字母出现的次数(不区分大小写)

  | 值   | A    | B    | C    | D    | ···  | Z    |
  | ---- | ---- | ---- | ---- | ---- | ---- | ---- |
  | 键   | 0    | 1    | 2    | 3    | ···  | 25   |

- 用数组表示键值对数据 ，有如下限制
  
  - 键的取值范围很小
  - 键可以很容易的转化成数组的下标

- 如果不满足上述的限制条件，推荐使用hash table

### 模型

```bash

                             ┌────────hash桶-[]
                             |
[Key的取值范围]---取出key--->hash函数────hash桶-[]-[]
                             |
                             └────────hash桶(容器)
```

注意

- hash桶可以看作是一个容器

- **同一个hash表，hash桶的数据结构可以不一样**

### 基本操作

- 增 

  ``` c
  put(key,val)
  ```

  - key的值是唯一的

- 删

  ```c
  delete(key)
  ```

- 查

  ```
  val = get(key)
  ```

- 遍历

  依次遍历每一个hash桶

### 实现

#### 哈希函数（数据的指纹）

如果哈希函数的新能足够好，就可以将其当作数据的指纹

```bash
checksam:
     256bit
      [ ]─────────────────>[ ]
       A              	    B
md5──>md5码(256b)    md5──>md5码(256b)
       |                    |
      指纹                验证指纹
```

Q 什么是好的哈希函数?

- 计算速度要快

- 要求hash值**平均分布**

  注意：以下三点是为了满足安全性：

- hash碰撞的概率低

- 要对数据非常敏感

  相似的数据，生成的哈希值应该完全不同

- 逆向要非常困难

  ```bash
  hash值 ---> data
  ```

  要让通过hash值找出原数据几乎不可能实现

完美的hash函数是在模拟等概率随机映射

只能通过模拟，不能实际应用，用有规律的算法模拟离散的数据

#### 哈希桶（解决哈希冲突）

解决哈希冲突的两种方法

- 拉链法

  本质上是用链表来做哈希桶，例如C++的unordered_map，Java的HashMap

  ```bash
  
  [ ][*][ ][ ][ ]
      |
    [key]
    [val]
     [*]
      |
    [key]
    [val]
     [*]
  ```

- 开放地址法

  探测后面的空余地址，将发生碰撞的元素存入其中

  - 线性探测 

    每次探测只+1

  - 平方探测 

    每次探测的幅度不一样

  - 再散列法 

    从has1 hash2等不同的哈希函数中找新的hash函数定位

  **哈希桶**，开放地址法的哈希桶是一种逻辑结构，只要映射的位置相同，就属于同一个哈希桶

实现过程

```bash
//size 是key-val键值对的个数
//hashseed 用于保证安全性
   
   table[*]------>[*][*][*][*][*][*][*][*]
    size[ ]           |
capacity[ ]         [key]
hashseed[ ]         [val]
                     [*]
                      |
                    [key]
                    [val]
                     [*]
```

API 

```c
//Hashmap.c
typedef struct{
    Node** table;
    int size;
    int capacity;
    uint32_t hashseed;
}HashMap;
```

测试单元 

```c
//
#icnlude<stdio.h>
#include"Hashmap.h"

int main(void){
    //1.创建空的哈希表
    HashMap* map = hashmap_create();
    hashmap_put(map,"liuqiangdong","zhangzetian");
    hashmap_put(map,"wangbaoqiang","marong");
    hashmap_put(map,"wenzhang","mayiliang");
    hashmap_put(map,"jianailiang","lixaolu");
    return 0;
}
```

函数实现

```c
#include<hashmap.h>
#include<time.h>
#define DEDAULT_CAPACITY
typedef char* V;
HashMap* hasmap_create(void){
    HashMap* map = malloc(sizeof(HashMap));
    if(!map){
        //错误处理
    }
    //NULL用calloc
    map->table = calloc(DEFAULT_CAPACITY,sizeof(Node*));
	map->size = 0;
    map->capacity = DEFAULT_CAPACITY;
    map->hashseed = time(NULL);
    
    return map;
}

// 如果key不存在，添加key-val,并返回null
// 如果key存在，更新key关联的val，并返回原来的val
V hashmap_put(HashMap* map, K key, V val){
    int idx = hash(key,strlen(key),map->hashseed)%map->capacity;  //求得索引(hash桶)
    //遍历链表
    Node* curr = map->table[idx]; //table中的第一个元素是链表的地址
    while(curr){
        if(strcmp(curr->key,key) == 0){
            //更新Key关联的值，并返回原来的值
            V oldval val = curr->val;
            curr->val = val;
            return oldval;
        }
        curr = curr->next;
    }// curr == NULL
    //添加Key-val,并返回null;用头插法
    Node* newnode = malloc(sizeof(Node));
    
    newnode->key = key;
    newnode->val = val;
    newnode->next = map->table[idx];
    //链接过程
    map->table[idx] = newnode;
	//更新hash表的信息
    map->size++;
    return NULL;
}


//根据Key，获取关联值，如果Key不存在，返回NULL
V hashmap_get(HashMap* map, K key){
  	int idx = hash(key,strlen(key), map->hashseed) % map->capacity;
    Node* curr = map->table[idx];
    while(curr){
        if(strcmp(curr->key,key) == 0){
            return curr->val;
        }
        curr = curr->next;
    }
    return NULL;
}

//删除键值对，如果Key不存在，什么也不做
void hashmap_delete(HashMap* map, K key){
    int idx = hash(key,strlen(key),map->hashseed)%map->capacity;
    Node* prev = NULL;
    Node* curr = map->table[idx];
    while(curr){
        if(strcmp(curr->key, key) == 0){
            // todo: 删除curr节点
            	if(prev == NULL){
                    map->table[idx] = curr->next;
                }else{
                    prev->next = curr->next;
                }
            	free(curr);
            	map->size--;
            	return;
        }
        prev = curr;
        curr = curr->next;
    }
}


//销毁hash表
void hashmap_destroy(HashMap* map){
    for (int i = 0; i < map->capacity; i++){
        Node* curr = map->table[i];
        while(curr){
            Node* next = curr->next;
            free(curr);
            curr = next;
        }
        //释放动态数组
        free(map->table);
    }
    free(map);
}
    
```

- 哈希表的扩容
  1. 安全性(hashseed）
  2. 用calloc申请新的更大的动态数组
  3. rehash，将所有的节点挂载到新数组中
  4. 释放原数组

#### 性能

|  操作  | 时间复杂度 |
| :----: | :--------: |
|  get   |    O(L)    |
|  put   |    O(L)    |
| delete |    O(L)    |

L表示链表的平均长度

```bash
L = size/capacity
要保证L不超过一个一个常 数(L<=1或L<=0.75)
                   |
              load factor
                负载因子
```

哈希表的本质是用空间换时间

### 应用

- 存储键值对数据

- Redis,内存数据库（键值对数据库），Redis底层大量使用了Hash表

## 位图

### 模型

位图的实质是位的数组

Q：为什么需要构建一个专门的数据结构表示位的数组

原因：计算机的最小寻址单位是字节，而不是位

### 基本操作

- 增

  set, 将某一位设置为1

- 删

  unset, 将某一位设为0

- 查

  isset, 判断某一位是不是1

- 遍历

### 实现

位图是一种内存紧凑的数据结构

```bash
 BitMap
 
array[*]---->[][][][][][]
 bits[ ]
```

```c
//bitmap.h
#include<stdint.h>
#include<stdlib.h>
typedef struct{
    uint32_t* array;  //动态数组，放在堆上，大小要确定（32bits）,2.无符号整数
    size_t btis;  //位图的长度
}BitMap;

//API
BitMap* bitmap_create(size_t bits);
void bitmap_destroy(BitMap* bm);

void bitmap_set(BitMap* bm, size_t n);
void bitmap_unset(BitMap* bm, size_t n);
void bitmap_isset(BitMap* bm, size_t n);
void bitmap_clear(BitMap* bm);
```

```c
//bitmap.c
#include<bitmap.h>
#include<stdio.h>

#define BITS_PER_WORD 32
#define BITMAP_SHIFT 5
#define BITMAP_MASK 0X1F

// 存储bits,需要word的长度，因为空间申请是按字申请
#define BITMAP_SIZE(bits) ((bits + BITS_PER_WORD -1) >> BITMAP_SHIFT)  //要向上取整

// bits: 位图的长度
// bits = 100
// 100 / 32 + 1  = (100 + 32 -1) / 32
// 1 + (32 - 1) / 32
BitMap* bitmap_create(size_t bits){
    BitMap* bm = malloc(sizeof(BitMap));
    bm->array = calloc(BITMAP_SIZE(bits) ,BITS_PER_WORD >> 3); 
    //乘除2的幂，考虑位运算
    bm->bits = bits;
    return bm;
}

//扩充位图，能够存下Bits位
void grow_capacity(BitMap* bm, size_t bits){
    //位图：内存紧凑的数据结构，应尽可能少的减少扩充空间
    //扩容策略，需要多大，就申请多大的内存空间,可以考虑使用relloc函数
    uint32_t* new_array = realloc(bm->array, BITMAP_SIZE(bits)*(BITS_PER_WORD >> 3);
    if(!new_array){
        printf("Error:failed to allocate in new_array");
        exit(1);
    }
    bm->array = new_array;
    //将扩充的部分置为0
    int bytes = (BITMAP_SIZE(bits) - BITMAP_SIZE(bm->bits)) * (BITS_PER_WORD>>3);
    memset(bm->array + BITMAP_SIZE(bm->bits),0,bytes);
}

//设置索引为n的位
//100, 32 * 4 = 128 
void bitmap_set(BitMap* bm, size_t n){
    if(n+1 > bm->bits){    
        if(BITMAP_SIZE(n+1) > BITMAP_SIZE(bm->bits)){
        //扩容
        	grow_capacity(bm,bits);
    	}
        bm->bits = n + 1;
    }

    //容量足够，直接设置第n位
    //如何表示第n位(word, offset) 在哪个字，偏移值
	size_t word = n >> BITMAP_SHIFT;
    size_t offset = n % 32;  //等价于 n & 0x1F  11011 00 10000
    bm->array[word] |= (0x1 << offset);  // 与其进行0001 000或运算
}
                                  
                                  
void bitmap_unset(BitMap* bm, size_t n){
    //找到第n位
    if(n >= b->bits){
        return;
    }
    size_t word = n >> BITMAP_SHIFT;
    size_t offset = n & BITMAP_MASK;
    bm->array[word] & = ~(0x1 << offset); 
}
                                  
void bitmap_isset(BitMap* bm, size_t n){
    //找到第n位
    if(n >= bm->bits){
        return false;
    }
    //找到第n位
    size_t word = n >> BITMAP_SHIFT;
    size_t offset = n & BITMAP_MASK;
    return bm->array[word] & (0x1 << offset); /*000001000*/; 
}
                                  
void bitmap_clear(BitMap* bm){
    size_t bytes = BITMAP_SIZE(bm->bits)*sizeof(Word);
    memset(bm->array, 0x00, bytes); 
}
```

关于memoryset

一个字节一个字节地设置

```c
                                              长度    
memset(bm->array + BITMAP_SIZE(bm->bits), 0, bytes);
                     起始地址              |  
                                     每一个字节的值（0~0xFF）
```

总结

|  操作  | 位操作 |
| :----: | :----: |
| n * 32 |  n<<5  |
| n / 32 |  n>>5  |
| n % 32 | n&0x1F |



```c
//测设单元 main.c
#include "BitMap.h"

int main(void){
    BitMap* bm = bitmap_create(100);
    bitmap_set(bm, 9);
    bitmap_set(bm, 5);    
    bitmap_set(bm, 2);
    bitmap_set(bm, 7);
    
    bitmap_set(bm, 128);
    return 0;
}
```

### 应用

- 面试题：存储10亿个qq用户每个人的在线状态，是或否

  - 如果用int数组存的话，过于消耗存储空间，需要4GB;

  - 如果用位图存储的话，只需要250MB;

- 排序并去重

  ```bash
  [128][7][468][···]
  ```

  - 采用排序算法 
    - 排序O(n*logn)
    - 去重O(n)
  - 位图
    - 将数值当作下标，设置其在位图中的值为1

## 二叉树

- 定义：每一个结点的度都<=2

- 二叉树的两种特殊形态：

  - 完全二叉树：除了第h层外，其它各层节点都达到最大值，且第h层的节点都连续排在最左边
  - 满二叉树：每一层的节点数目都达到最大值

  满二叉树一定是一个完全二叉树

### 二叉搜索树

BST(Binary Search Tree)：在二叉树的基础上加了限制条件，使得树中的节点可以按照某种规则进行比较

- 左子树中的所有节点的key值都比根节点小，并且左子树也是二叉搜索树
- 右子树中所有的key值都比根节点的key值大，并且右子树也是二叉搜索树

```bash
         BST    [*]
                 |            
            [*][key][*]
            /          \
       [*][key][*]  [*][key][*]   
```

### 实现

```c
typedef int K;
typedef struct tree_node{
    K key;
    struct tree_node* left;
    struct tree_node* right;
}TreeNode;

//typedef TreeNode* BST; 给指针定义别名的方法，灵活性过差，不易扩展其它信息

typedef struct{
    TreeNode* root;
}BST;

//API
#include<stdlib.h>
#include<stdio.h>

//创建一棵空树
BST* bst_create(void){
    return calloc(1,sizeof(BST)); //使用了Calloc返回NULL值
}

//如果key存在，什么也不做,查找路径类似单链表，插入用尾插法
//如果Key不存在，则添加Key
BST* bst_insert(BST* tree,K key){
    TreeNode* parent = NULL;
    TreeNode* curr = tree->root;
    int cmp = 0;
    while(curr){
        cmp = key - curr->key
        if(cmp < 0){
            parent = curr;
            curr = curr->left;
        }else if(cmp > 0){
            parent = curr;
            curr = curr->right;
        }else{
            //相等的情况，说明已经存在，直接返回
            return;
        }
    }//curr == NULL
    //插入节点
    TreeNode* node = malloc(sizeof(TreeNode));
    node->key = key;
    //链接到树中
    if(parent == NULL){
        tree->root = node;
    }else if(cmp < 0){
        parent->left  = key;
    }else if(cmp < 0){
        parent->left  = key;
    }else{
        return;
    }
}

BST* bst_search(BST* tree,K key){
    TreeNode* curr = tree->root;
    while(curr){
        int cmp = key - curr->key;
        if(cmp < 0){
            curr = curr->left;
        }else if(cmp > 0){
            curr = curr->right;
        }else{
            return curr;
        }
    }//curr == NULL的情况
    return NULL;
}

//中序遍历内部细节
void inorder(TreeNode* root){
    //a.边界条件
    if(root == NULL){
        return;
    }
    //b.递归公式
    //遍历左子树
    inorder(root->left);
    //遍历根节点
    printf("%d ",root->key);
    //遍历右子树
    inorder(root->right);
}

//中序遍历对外的API
void bst_inorder(TreeNode* tree){
    //委托给inorder，外包
    inorder(tree->root);
    printf("\n");
}

//层次遍历
void bst_levelorder(BST* tree){
    //1.创建队列
    Queue* q = queue_create();
    //2.将根节点入队列
    queue_push(q, tree->root);
    //3.循环遍历
    while(queue_empty){
        //出队列
        TreeNode* node = queue_pop(q);
        //遍历该节点
        printf("%d ", node->queue->key);
        //判断该节点是否有左孩子
        if(node->left){
            queue_push(q,node->left);
        }
        if(node->right){
            queue_push(q,node->right);
        }
    }// queue_empty(q) == true
    printf("\n");
}

BST* bst_delete(BST* tree,K key){
    //1.查找要删除的节点
    TreeNode* parent = NULL;
    TreeNode* curr = tree->root;
    while(curr){
        int cmp = key - curr->key;
        if(cmp < 0){
        	parent = curr;
            curr = curr->left;
        }else if(cmp > 0){
            parent = curr;
            curr = curr->right;
        }else{
            //TODO:删除curr节点
            //代码缩进的层次越高，代码的复杂度越高
            break;
        }
    }//curr == NULL，不用进行任何操作
    if(curr == NULL) return;
    if(curr->left && curr->right){
        //退化成degree == 0 || degree == 1
        TreeNode* p = curr;
        TreeNode* min = curr->right;
        while(min->left){
            p = min;
            min = min->left;
        }//min->left == NULL;
        
		curr->key = min->key;
        parent = p;
        curr = min;
    }
    // 统一处理（degree == 0 || degree == 1）
    // 删除curr节点
    TreeNode* child = curr->left > curr->right ? curr->left : curr->right;  //找到唯一的孩子
    
    if(parent == NULL){
        tree->root = child;
    }else{
        int cmp = curr->key - parent->key;
        if(cmp < 0){
            parent->left = child;
        }else if(cmp > 0){
            parent->right = child;
        }else{
            parent->right = child
        }
        free(p);
    }
}

BST* bst_destroy(BST* tree);


//测试单元
int main(){
   BST* tree = best_create();
    
   bst_insert
}
```

- 二叉树的遍历

  ```bash
        [ 9 ]
        /   \
      [5]   [42]
      /      /  \
    [3]    [13] [57]
  ```

  - 深度优先遍历

    LDR LRD DLR  (左孩子优先) 

    DRL RLD RDL  (右孩子优先)

    根据根节点的遍历顺序又可以分为先序、中序、后序遍历,其时间复杂度都是O(n)

  - 广度优先遍历

    1. 将根节点入队列

    2. 判断队列是否为空

       - 空：结束

       - 非空：

         - 出队列

         - 遍历该节点
         - 判断该节点是否有左孩子，有则入队
         - 判断该节点是否有右孩子，有则入队

    3. 返回第二步

    不变式：**当上一层所有节点出队列时，队列中放的是下一层的所有节点**

- 二叉树的删除

  1. 要删除的节点的度为0

  2. 要删除的节点的度为1

  3. 要删除的节点的度为2

- BST的性能分析

  h表示树高
  
  | 操作         | 性能 |
  | ------------ | ---- |
  | 查找(search) | O(h) |
  | 插入(insert) | O(h) |
  | 删除(delete) | O(h) |
  | 遍历         | O(n) |
  
- Q：一棵二叉树，有n个节点，高度的取值范围是多少？

  A：(Log2n,n]

  Q：一棵二叉树，有n个节点，高度最低是多少？

  A：完全二叉树高度最低

  Q：一颗有n个节点的完全二叉树，高度h是多少

  ```bash
            []      2^0
           [][]     2^1
         [][][][]   2^h
  ```

  Q：一棵高度为h的完全二叉树，其节点数目范围是多少

  A：2^0+2^1+···+2^(h-1)  <= n < 2^0+2^1+···+2^(h-1) +1

  ​                                  2^h   <= n < 2^(h)+1

  ​                      log2n-1< h   <= log2n

### 平衡二叉搜索树

分类

- AVL：对任意一个节点，左子树和右子树的高度之差不会超过1
  - 定义很严格
  - 每次添加或删除需要的调整比较多
- 红黑树：平衡，整棵树的高度O(lgn)

## 红黑树

### 模型

由*Robert* Sedgewick提出，红黑树是2-3-4树的实现，是4阶B树

java的TreeMap、C中的ordermap、linux中的epoll都是红黑树

Q1：如何表示3-node和4-node

```bash

  [   ]      []     [ ]
  / | \     [] \    / []
            /\         \
            

  [     ]       [ ]     
  / | | \       / \
              [ ] [ ]    
              / \ / \       
```

不能有两条连续的红色边表示四节点，是为了控制整棵树的高度

Q2：“边”是一个逻辑结构是不存在的，是不存在的，如何表示边的颜色？

A：应该用孩子节点的颜色来表示，父节点表示不清楚是那个孩子的；

### 基本操作

和BST一样

### 应用

- 有序数组

  | 操作 |  性能   |
  | :--: | :-----: |
  |  增  |  O(n)   |
  |  删  |  O(n)   |
  |  查  | O(logn) |
  | 遍历 |  O(n)   |

  有序数组性能不如二叉搜索树，保证有序性，存储静态数据

- 保证有序性，需要动态添加和删除元素时，可以考虑BST

## 二分查找

### 前提：

1. 数组
2. 有序：通过一次比较，可以丢掉几乎一半的区间
3. 作用：减少了比较的操作次数

性能：

- O(log n)

- 本质是减少比较的次数

### 实现

两种思路：

- 递归
- 循环

变种：

   二分查找的变种很多：

- 查找第一个和key值相等的元素
- 查找最后一个和key值相等的元素
- 查找第一个大于等于key值相等的元素
- 查找最后一个小于等于key值的元素

```c
#define SIZE(a) (sizeof(a)/sizeof(a[0]))

int bsearch(int arr[], int left, int right, int key){
    //边界条件
    if(left > right) return -1; 
    //递归公式
    int mid = left + (right - left >> 1);
    int cmp = key - arr[mid];
    
    if(cmp < 0) return bsearch(arr, left, mid - 1, key);
    if(cmp > 0) return bsearch(arr, mid + 1, right, key);
    return mid;
}

//递归方法
int binary_search1(int arr[], int key){
    //闭区间：[0,n-1]
    return bsearch(arr, 0, n-1, key);
}


//循环方法
int binary_search2(int arr[], int key){
    //闭区间：[0,n-1]
	int left = 0, right = n - 1;
    while(left <= right){//注意事项1：left <= right注意等号要不要加
        int mid = left + (right - left >> 1);   //注意事项2
        int cmp = key - arr[mid];
        if( cmp < 0 ){
            right = mid - 1;   //注意事项3
        }else if(cmp > 0){
            left = mid + 1;   //注意事项4
        }else{
            return mid;
        }
    }//left > right
    return -1;
}



//查找第一个和key值相等的元素
int binary_search3(int arr[], int key){
    //闭区间：[0,n-1]
	int left = 0, right = n - 1;
    while(left <= right){//注意事项1：left <= right注意等号要不要加
        int mid = left + (right - left >> 1);   //注意事项2
        int cmp = key - arr[mid];
        if( cmp < 0 ){
            right = mid - 1;   //注意事项3
        }else if(cmp > 0){
            left = mid + 1;   //注意事项4
        }else{
            //if(是第一个和key相等的元素){
            if(mid == left || arr[mid - 1] < key){  
            	return mid;
            }
            right = mid - 1;
        }
    }//left > right
    return -1;
}

//查找第一个大于等于key值相等的元素
int binary_search4(int arr[], int key){
    //闭区间：[0,n-1]
	int left = 0, right = n - 1;
    while(left <= right){//注意事项1：left <= right注意等号要不要加
        int mid = left + (right - left >> 1);   //注意事项2
        
        int cmp = key - arr[mid];
        if( cmp < 0 ){
            left = mid + 1;
        }else{
            if(时第一个大于等于key的元素){
                return mid;
            }
            right = mid - 1;
        }
    }//left > right
    return -1;
}



int main(void){
    int arr[] = {0, 10, 20, 30, 40, 50, 60, 70, 80, 90};
    return 0;
}
```

## 排序算法

如何分析一个排序算法：

1. 时间复杂度

   - 最好情况
   - 最坏情况
   - 平均情况

2. 空间复杂度：原地排序为O(1)

3. **稳定性**：数据集中相等的元素，排序前后相对次序不变，则稳定

   例如处理订单排序：首先按照下单时间排序，再按照金额排序（具有稳定性的算法）

### 选择排序

```bash
16 1 45 23 99 2 18 67 42 10
i  min_idx
```

- 从未排序的元素开始遍历，用min_index记录最小的元素的索引

- 交换

  ```c
  swap(arr[i], arr[min_idx]);
  ```

- i向后移并且重新向后遍历

时间复杂度：

- 任何情况下都是O(n^2)

- 比较：
  $$
  n(n-1) + ··· + 1 = \frac{n(n-1)}{2}
  $$
  
- 交换次数：n-1

空间复杂度：O(1)

稳定性：不稳定

### 冒泡排序

- 顺序对

  ```c
  i<j, arr[i]<arr[j]
  ```

- 逆序对

  ```c
  i<j, arr[i]>arr[j]
  ```

排序的过程就是让逆序对的数量变为零，经历过一轮操作，小元素会慢慢地浮到数组的前面，**而整个数组最大的元素在最末尾**

优点：冒泡排序可以提前感知到数组是否有序

**时间复杂度**：

- 最好和最坏情况

|            |  最好情况  |  最坏情况  |
| :--------: | :--------: | :--------: |
|  数组状态  | 原数组有序 | 原数组逆序 |
|  比较次数  |    n-1     |  n(n-1)/2  |
|  交换次数  |     0      |  n(n-1)/2  |
| 时间复杂度 |    O(n)    |   O(n^2)   |

- 平均时间复杂度
  $$
  交换次数=逆序对 = \frac{n(n-1)}{4}  \\
  交换次数<=比较次数<=\frac{n(n-1)}{2}
  $$

- 空间复杂度:O(1)

- 稳定性：稳定

### 插入排序

类比打牌时的理牌过程，从无序区按顺序找第一张牌（value），在有序区**从后往前**找到第一个**小于等于**value的元素,插入到该元素的后面

#### 实现

```c
#include<stdio.h>

void insertion_sort(int arr[], int n){
	for(int i = 1; i < n; i++){
        //i表示要插入元素的索引
        int value = arr[i];
        int j = i - 1;
        while(j >= 0 && arr[j] > value){
            arr[j+1] = arr[j]; 
            j--;
        }  //j == 1 || arr[j] <=value
        arr[j + 1] = value;
    }
    print_array(arr, n);
}


void print_array(int arr[], int n){
    for(int i = 0; i < n; i++){
        printf("%d ", arr[i]);
    }
    printf("\n");
}

int main(void){
    int arr[] = {3, 6, 4, 2, 11, 10, 5 };
    return 0;
}
```

#### 分析

时间：

|            |  最好情况  |  最坏情况  |
| :--------: | :--------: | :--------: |
|  数组状态  | 原数组有序 | 原数组逆序 |
|  比较次数  |    n-1     |  n(n-1)/2  |
|  交换次数  |     0      |  n(n-1)/2  |
| 时间复杂度 |    O(n)    |   O(n^2)   |

- 平均时间复杂度
  $$
  逆序时：逆序对 = 顺序对 = \frac{C_{n}^{2}}{2} = \frac{(n-1)}{4}
  $$
  
  $$
  比较：大于等于比较次数，小于等于 \frac{n(n-1)}{2}
  $$

$$
平均时间复杂度复杂度 = O(n^2)
$$



空间

- 空间复杂度：0(1)
- 稳定性：稳定（交换相邻元素，能够保证原先的次序）

#### 应用

1. 数组长度比较小
2. 原数组基本有序时（离最终的位置很近），插入排序可以在O(1)的时间内完成排序

### 希尔排序

插入排序的简单扩展，n=10, gap= 5, 2, 1, 0;

**循环过程**：

- 多个人抓牌，自己理牌

- gap/2，抓牌人变少

到最后只剩下一个人拽牌，变成了简单的插入排序，最后一轮的时间复杂度为O(n)

#### 实现

```c
void shell_sort(int arr[], int n){
    //gap序列：n/2,n/4;
    int gap = n >> 1;
    while(gap){
        //组件插入排序(gap个人轮流抓牌)
        for(int i = gap; i < n; i++){
            //排堆，（gap,n）
            int value = arr[i];
            //保证自己的手牌有序
           	int j = i - gap;
            while(j >= 0 && arr[j] > value){
                arr[j+gap] = arr[j];
                j - = gap;
            }// j < 0 || arr[j]<=value
            arr[j + gap] = value;
        }
        //查看流程
    	print_array(arr, n);
    	gap >>= 2;
    }
    gap >> = 1;
}
```

**优点**：

- 长距离优化，可以减少交换的次数

分析：

- 时间复杂度：
  $$
  和gap序列相关，一般来说，平均情况小于O(n^2)
  $$

- 空间复杂度：O(1)

- 稳定性：

  不稳定（发生长距离的交换，牺牲了稳定性，换取了时间）

### 归并排序

分治思想：一般通过递归实现

**步骤**：

```bash
            [38][27][43][3][9][82][10]         O(n)
··· 递
         [38][27][43][3]       [9][82][10]       O(n)
          
       [38][27]  [43][3]     [9][82]   [10]       O(n)
       
     [38]  [27]  [43]  [3]  [9]  [82]   [10]       O(n)
···· merge
       [27][38]  [3][43]     [9][82]   [10]        O(n)
       
         [3][27][38][43]       [9][10][82]        O(n)
            
            [3][9][10][27][38][43][82]          O(n)
```

**实现**

```c
#include<stdio.h>
#define SIZE(a) (sizeof(a)/sizeof(a[]))

void print_array(int arr[], int n){
    for(int i = 0; i < n; i++){
        printf("%d ", arr[i]);
    }
    printf("\n");
}

int tmp[N];

void merge(int arr[], int left, int mid, int right){
    // 左：[left, mid]
    // 右：[mid+1,right]
    int i = left, j = mid + 1, k = left;
   	
    while(i <= mid && j <= right){
        if(arr[i] <= arr[j]){
            tmp[k++] = arr[i++];
        }else if{
            tmp[k++] = arr[j++];
        }
    }
    
    while(i <= mid){
        tmp[k++] = arr[i++];
    }
    
    while(j <= right){
        tmp[k++] = arr[j++];
    }
    
    //将tmp数组的对应区间，复制到arr数组中
    for(int k = left; k <= right; k++){
        arr[k] = tmp[k];
    }
}

void m_sort(int arr[], int left, int right){
    //边界条件
    if(left >= right) return;
    //递归公式
    int mid = left + (right - left >> 1);
    //对左边区间进行排序
    m_sort(arr, left, mid);
    //对右边区间排序
    m_sort(arr, mid+1, right);
    //归并操作
    merge(arr, left, mid, right);
}

void merge_sort(int arr[], int n){
    m_sort(arr, 0, n - 1);
}

int main(void){
 	int arr[N] = {38, 27, 43, 3, 9, 83, 20};   
    return 0;
}
```

**时间复杂度**

$$
T(n) = 2 T\frac{n}{2} + O(n)  \\
T(n) = log_2n·O(n) = O(nlog_2n)=O(nlogn)
$$

- 对于递归算法尝试用递归树分析时间复杂度

- 归并排序对数据不敏感，任何情况都是O(nlogn)

**空间复杂度**： 
$$
O(logn)+O(n) = O(n)
$$

**稳定性**： 稳定

### 快速排序

**算法步骤**

1. partition：分区

   选取一个基准值：Pivot

   ```bash
   [<=pivot][p][>=pivot]
             ^    
           pivot
   ```

2. 对左边进行快速排序

3. 对右边进行快速排序

递归执行上述操作

#### 实现

关键是如何实现分区算法

- a.单向分区

  ```bash
  store
    |
    3 7 8 5 2 1 9 5 4
    |
    i
  ```

  选择最右边的元素作为基准值:

  ```bash
  pivot = 4
  ```

  两个索引的作用:

  - store:下一个<=pivot的元素应该放置的位置

  - i: 用于遍历所有的元素

  单向分区的不变式

  
  $$
  [o,store)<= pivot，满足条件\\
  遍历时，[store, i) > pivot，不满足条件 \\
  终止 i = n-1
  $$
  **平均操作次数：**
  $$
  \frac{n}{2}·3=1.5n (赋值)
  $$
  
- b.双向分区

  ```bash
    3 7 8 5 2 1 9 5 4
    |               |
    i               j
  ```

  选择pivot = 3

  **两个索引的作用：**

  - i：下一个<=pivot的元素置于的位置
  - j：下一个>=pivot的元素置于的位置

  双向分区的不变式

  
  $$
  [o,)<= pivot，满足条件\\
  [j, n-1) >= pivot，不满足条件 \\
  $$
  **平均操作次数：**
  $$
  \frac{n}{2}·1=0.5n (赋值)
  $$
  
- c.三向分区

  ```bash
  [<=pivot][p][>=pivot]
            ^    
          pivot
  ```

  相同元素比较多的情况下才使用三项分区

```c
#include<stdio.h>
#define SIZE(a) (sizeof(a)/sizeof(a[0]))

void partition(int arr[], int left, int right){
    //1.选取基准值
    int pivot = arr[left];
    //2. 双向分区
    int i = left, j = right;
    while(i < j){
        // 先移动j，找<pivot的元素
        while(i < j && arr[j] >= pivot){
            j--;
        }// i == j || arr[j] < pivot
        arr[i] = arr[j];
        
        //再移动i，找>pivot的元素
        while(i < j && arr[j] <= pivot){
            i++;
        }// i == j || arr[j] < pivot
        arr[j] = arr[i];
    } // i == j
    arr[i] = pivot;
    return i;
}

void q_sort(int arr[], int left, int right){
    //边界条件
    if(left >= right) return;
    //递归公式
    //1.分区
    int idx = partition(arr, left, right);
    //2.对左边区间进行排序
    q_sort(arr, left, idx-1);
    //3.对右边区间排序
    q_sort(arr, idx+1, right);
}

void quick_sort(int arr[], int n){
    //通过委托实现
    q_sort(arr, 0, n-1);
}


int main(){
	int a[N] = {3, 7, 8, 5, 2, 1, 9, 5, 4}    
    
}
```

#### 分析

时间：

- 最好情况 O(nlogn)

  每次分区基准值都在中间
  $$
  T(n) = O(n) + T(\frac{n}{2})+T(\frac{n}{2})\\
  = O(n) + 2·T(\frac{n}{2})\\
  =O(n·logn)
  $$
  
- 最坏情况 O(n^2)

  每次分区，基准值都位于两边
  $$
  T(n) = c·n+c·(n-1)+···+c·2+c = c·\frac{n·(n-1)}{2}=O(n^2)
  $$
  
- 平均复杂度 O(n·logn)

  假定每次分区，都分成大约为9：1的区间
  $$
  T(n) <= log_\frac{10}{9}n·c·n=O(nlogn)
  $$

空间：O(logn)

稳定性：不稳定

#### 改进策略

- 选取基准值

  - 随机选取
  - 选取3到5个元素，选取其中位数

- 当区间长度小于某个值(<=32， 64)，改用插入排序

- 改分区算法

  当重复元素比较多时，可以选择使用三向分区算法

### 堆排序

二叉堆：实质上是一棵二叉树

- 大顶堆：左右子树的key都小于根节点，并且左右子树都是大顶堆
- 小顶堆：左右子树的key都大于根节点，并且左右子树都是小顶堆

算法步骤：

```bash
数组 

16 1 45 23 99 2 18 67 42 10

将数组看作一颗二叉树

          16
       /      \
      1        45
    /   \      /  \  
   23    99   2   18
  / \    /
 67  42 10
 
 parent(i) = (i-1)/2
 lchild(i) = 2i+1
 rchild(i) = 2i+2
```

1. 构建大顶堆

   从后往前构建大顶堆（能够保证左右子树都是大顶堆）

2. 无序区length = n

   交换堆顶元素和无序区的最后一个元素

   无序区的长度length--

   重新调整成大顶堆

3. 直到无序区的长度为1为止

#### 实现

```c
#include<stdio.h>
#define SIZE(a) (sizeof(a)/sizeof(a[0]))
#define SWAP(arr, i, j){ \
	int t = arr[i];
	arr[i] = arr[j];
	arr[j] = t;
}

void heapify(int arr, int i, int n){
    while(i < n){
        // 求三个元素的最大值
        int lchild = 2 * i + 1;
        int rchild = 2 * i + 2;
        int maxId = i;
        if(lchild < n && arr[lchild] > arr[maxIdx]){
            maxIdx = lchild;
        }
        if(rchild < n && arr[rchild] > arr[maxIdx]){
        	maxIdx = rchild;
        }
        //如果最大值是根节点，调整结束
        if(maxIdx == i) break;
        //如果不是，交换根节点和最大直接点
        SWAP(arr, i, maxIdx);
        //调整maxIdx节点
        i = maxIdx;
    }
}

void build_heap(int arr[], int n){
    //从后往前依次构建大顶堆
    //找到第一个非叶子节点: lchild(i) = 2i+1 <= n -1; => i<= ( n - 2 >> 1)
    for(int i = ( n - 2 >> 1); i >= 0; i--){
        heapify(arr, i, n);
    }
}

void heap_sort(int arr[], int n){
    //1.构建大顶堆
    build_heap(arr,n);　　　
    print_array(arr,n);
    //2.初始化无序区的长度
    int len = n;
    //3.交换堆顶元素和无序区最后一个元素,直到len == 1
    while(len > 1){
        SWAP(arr, 0, len-1);
        len--;
        heapify(arr, 0, len);
        print_array(arr,n);
    }
}

int main(void){
    return 0;
}
```

#### 分析

- 时间复杂度：对数据不敏感

  ```c
  build_heap()  复杂度为O(n)
  ```

  $$
  调整次数=2^0·h+2^1·(h-1)+2^2·(h-2)+···+·2^{h-1}·1\\
  =2^1·h+2^2·(h-1)+···+2^{h-1}·2+2^h·1\\
  =2^0·h+(2^1+2^2+···+2{h-1}+2{h})\\
  = 2^{h+1}-2-h\\
  =2·n-2-log_2n\\
  $$

  $$
  T(n) = O(n)+(n-1)·O(logn) = O(nlogn)
  $$

- 空间复杂度：O(1)
- 稳定性：稳定

## 如何设计一个通用的排序算法

|        数据量        |   方法   |
| :------------------: | :------: |
|       数据量少       | 插入排序 |
|       数据量大       | 快速排序 |
| 数据量大&&需要稳定性 |  堆排序  |

