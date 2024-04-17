+++
title = '刷题笔记-24年4月-训练营基础题'
date = 2024-04-14T20:25:13+08:00
draft = false
summary = "训练营作业P01-P60，C语言和部分C++Primer相关"
tags = [ "刷题", "C++"]

+++
# P01★
题目描述：判断输入的不同x值，计算相应的y值。
#### 思路
- main函数之外初始化x, y
- 用if语句输入不同的y值
#### 总结
简单的输入输出和if判断
```c
int main()
{
    scanf("%d",&x);
    if(x<5) y=x;
    if(x>=5&&x<15) y=x+6;
    if(x>=15) y=x-6;
    printf("%d",y);
	return 0;
}
```
# P02★
题目描述：输入小写字母，转换为大写字母
#### 思路
- 定义char型字符并且读入小写字母；
- 利用Ascii大小写字母的差值转换大小写
#### 总结
```c
char c;
int main()
{
    scanf("%c",&c);
    printf("%c",c-32);   //小写字母的ASCII数值比大写的小32
    return 0;
}
```
# P03★
题目描述：计算一个3x3矩阵的主对角线的元素之和
#### 思路
- 读入矩阵
- 若i=j，则元素为主对角线元素
- 计算主对角线元素之和
#### 总结
简单的判断逻辑
```c
    for(int i=0;i<3;i++)    //计算对角线元素
    {
        for(int j=0;j<3;j++)
        {
            if(i==j) sum+=a[i][j];  
        }
    }
    printf("%d",sum);
    return 0;
```
# P04★
题目描述：求100-999之间的所有的水仙花数(每位数的立方之和是该数本身)
#### 思路
- 将数字的每位数分离出来
- 判断书否是水仙花数
- 输出数字
#### 总结
主要涉及字符型与整型的互相转换
- C语言中把整型转换成字符串的方法，使用sprintf函数：
```c
   char str[30];  //定义字符串数组
   sprintf(str, "%d", i);  //将整型转换成字符串
```
- C语言中把字符转换成整型的方法，直接-'0'赋值；
```c
   int a=str[i]-'0';
```
# P05★
题目描述：将百分制成绩转换成五级分制
#### 思路
- 读入成绩
- 判断成绩所属的区间
- 输出五级分制的成绩
#### 总结
关键是if条件判断
# P06★
题目描述：不使用递归方法实现斐波那契数列
#### 思路
用for循环+条件判断来实现
- 从0开始依次输出斐波那契数列
- 若最新的数大于n，则break
#### 总结
```c
    for(int i=0;;i++)
    {
        if(i==0)
        {
            printf("%d ",a);
        }
        if(i==1)
        {
            printf("%d ",b);
        }
        if(i>1)
        {
            printf("%d ",a+b);
            int temp=a+b;
            a=b;
            b=temp;
        }
        if(a+b>x) break;
    }
```
# P07★
题目描述：将数组中的值按逆序存放
#### 思路
- 使用for循环
- 将第一个与最后一个元素置换
- 置换到n/2处结束
#### 总结
```c
    for(int i=0;i<n/2;i++)   //置换元素位置
    {
        int temp=a[i];
        a[i]=a[n-i-1];
        a[n-i-1]=temp;
    }
```
# P08★
题目描述：输入三角形的三条边判断其是否能组成三角形，如果可以则输出他的面积和类型
#### 思路
- 判断能否组成三角形：两边之和大于第三边
- 判断类型：三边相等是等边，两边相等是等腰，符合勾股定理是直角
- 输出结果
#### 总结
写全条件判断即可：
# P09★
题目描述：输入若干元素表示成绩，输入负数表示成绩输入完毕，停止录入；统计最高分和最低分；
#### 思路
- 用malloc和relloc创建动态数组，可以动态分配数组的大小
- 用limits.h库中的INT_MAX和INT_MIN来统计最高分和最低分
#### 总结
- 动态数组的创建方法
```c
    int *array =NULL;  //空数组
    int count=0;
    array = realloc(array, (count + 1) * sizeof(int)); //分配一个空间
```
# P10★
题目描述：将华氏温度转换成摄氏温度
#### 思路
- 编写int func(int x)函数，套入转换公式，返回摄氏温度数值
- 在main函数中调用func
#### 总结
还算容易的一道题，要注意先声明函数再调用
# P11★
题目描述：输入一个自然数，输出其各个因子的连乘形式
#### 思路
- 第一个因子默认是1
- 找到余数从2开始的第一个因子，并用n/2
- 当n<0时结束while循环
#### 总结

算法的核心部分

    while(n>0)
    {
        for(int i=2;i<=n;i++)   //找到余数的第一个约束
        {
            if(n%i==0)
            {
                printf("*%d",i);
                n/=i;   //将余数存入n
                break;
            }
        }
    }
# P12★
题目描述：n个整数从小到大排列，输入一个新整数，使这N+1个整数仍然有序
#### 思路
- 先输入n的值
- 用户按升序输入n个数
- 让用户输入第n+1个数
- 将a[n]与之前的数比较，从后往前重新排序
#### 总结
排序算法
```c
    for(int i=n;i>0;i--)   //从后往前比较并排序
    {
        int temp=a[i-1];
        if(a[i-1]>a[i])
        {
            a[i-1]=a[i];
            a[i]=temp;
        }
    }
```
# P13★
题目描述： 在100～200之间找出满足用3除余2，用5除余3和用7除余2的所有整
数。
#### 思路
- 从100开始进行for循环，到200结束
- 用if语句判断三个并列条件
#### 总结
```c
        if(i%3==2&&i%5==3&&i%7==2)
        {
            printf("%d ",i);
        }
```
# P14★
题目描述： 输入10 个同学的成绩，统计80分以上和不及格的人数，并输出平均值
#### 思路
- 输入成绩
- 统计不及格的人数
- 统计平均值
#### 总结
```c
    for(int i=0;i<10;i++)   //统计
    {
        scanf("%d",&a[i]);
        if(a[i]<60)
        {
            count++;
        }
        sum+=a[i];
    }
```
# P15★
题目描述：编写一个函数来检验输入的一个字符是大写字母还是小写字母或不是26个
英文字母
#### 思路
需要使用ASCII码值来判断
- 输入字符
- 判断字符类型
#### 总结
```c
    if(x>=97&&x<=122)
    {
        printf("小写字母");
        return 0;
    }
    if(x>=65&&x<=90)
    {
        printf("大写字母");
        return 0;
    }
    printf("不是字母");
```
# P16★
题目描述：从键盘输入半径和高，输出圆柱体的底面积和体积。
#### 思路
- 定义pi的值
- 输入半径和高
- 输出底面积和体积
#### 总结
定义pi的两种方法
```c
#define PI 3.1415926
//或者用Math库
#include<math.h>
double x = M_PI;
```
# P17★
题目描述：输入一行字符，分别统计出其中英文字母、空格、数字和其他字符的个数。
#### 思路
- 用字符串存放数组
- 用for循环扫描每个字符，判断其类型
- 输出结果
#### 总结
判断语句要写对
```c
        if(s[i]>='A'&&s[i]<='Z'||s[i]>='a'&&s[i]<='z')
        {
            countalpha++;
        }
        else if(s[i]==' ')
        {
            countspace++;
        }
        else if(s[i]>='0'&&s[i]<='9')
        {
            countnum++;
        }
        else
        {
            countother++;
        }
```
# P18★
题目描述：输出矩阵
#### 思路
- 双重for循环输出数值
- 第一层循环中定义x值记录当前所在行数
- 第二重循环先递减输出x在输出1
#### 总结
```c
    for(int i=0;i<5;i++)
    {
        int x=i+1;
        for(int j=0;j<5;j++)
        {
            if(x!=1)  //x没有减到1时，先输出x的值
            {
                printf("%d",x);
                x--;
            }
            else  //x减到1，输出1
                printf("1");
        }
        printf("\n");
    }
    retu
```
# P19★
题目描述：递归函数完成计算 12+22+32+···+n2
#### 思路
- 定义递归函数
- 声明函数
- 输出计算结果
#### 总结
```c
long sum(int n)    //递归函数
{
    if(n==1) return 12;
    else return sum(n-1)+n*10+2;
}
```
# P20★★★
题目描述：编写将整数转换成字符串的函数, 有点难，先跳过了
#### 思路
- 输入整数
- 将每个字符存入字符串数组
#### 总结
# P21★
题目描述：写一个函数，输入年月日时分秒，输出下一秒
#### 思路
第一反应就是mod运算,但实际不需要，只需要自加和if判断就可以
- 读取年月日时分秒
- 秒+1运算
- 判断年月日是否需要进位
#### 总结
注意闰年的判断
```c
    if(d==30)
    {
        if(m==2||y%4==0)   //闰年2月29天
        {
            m++;
            d=1;
        }
    }
    if(d==29)
    {
        if(m==2||y%4!=0)   //平年2月28天
        {
            m++;
            d=1;
        }
    }
```
# P22★
题目描述：不用第三块内存交换两个数
#### 思路
不能使用temp,直接在两数的基础上进行加减运算
#### 总结
很巧妙的方法，三次求和运算就可以完成两数的交换
```c
    a=a+b;
    b=a-b;
    a=a-b;
```
# P23★
题目描述：统计文本中的单词的数量
#### 思路
单词中间的间隔不一定是空格，可能是标点符号加空格
- 用for循环开始扫描
- 扫描到字母时，打开flag
- 扫描到空格或者其它符号时，关闭flag
- flag的打开次数表示单词数目
#### 总结
- c 语言 字符串的输入：
```c
    char s[500]="\0";  //初值为空的字符数组，用于存放字符串
    scanf("%[^\n]s", s)
```
- 判断过程
```c
    for(int i = 0; i < strlen(s); i++)
    {
        if((s[i] >= 'a' && s[i] <= 'z') || (s[i] >= 'A' && s[i] <= 'Z'))
        {
            if(flag == false)
            {
                flag = true;
                count++;
            }
        }
        else
        {
            flag = false;
        }
    }
```
# P24★★★(不太懂)
题目描述：国际象棋8x8，皇后横竖斜移动，在一个棋盘放置8个皇后，使他们彼此无法互相威胁
#### 解法（有待研究）：

```c++
int A[QUEENS + 1], B[QUEENS * 3 + 1], C[QUEENS * 3 + 1], k[QUEENS + 1][QUEENS + 1];
int inc, *a = A, *b = B + QUEENS, *c = C;
void lay(int i) {
  int j = 0, t, u;

  while (++j <= QUEENS)
    if (a[j] + b[j - i] + c[j + i] == 0) {
      k[i][j] = a[j] = b[j - i] = c[j + i] = 1;
      if (i < QUEENS) lay(i + 1);
      else {
        ++inc;
        if (IS_OUTPUT) {
          for (printf("(%d)\n", inc), u = QUEENS + 1; --u; printf("\n"))
            for (t = QUEENS + 1; --t; ) k[t][u] ? printf("Q ") : printf("+ ");
          printf("\n\n\n");
        }
      }
      a[j] = b[j - i] = c[j + i] = k[i][j] = 0;
    }
}

```



# P25★
题目描述：将某串字符的某部分复制到另一串字符的指定位置
#### 思路
- 定义题设的两个字符串
- 使用strncpy函数进行操作
#### 总结
- strncpy函数的用法
```c
#include<string.h>
strncpy(destination, source, number)
```
# P26★
题目描述：分数序列，1/2，1/4，1/6，函数调用求数列的前20项
#### 思路
- 创建函数sum(int n)
- 调用函数
#### 总结
注意函数sum的类型应该是float
```c
float sum(int n)
{
    float sum=0;
    for(int i=1;i<=n;i++)
    {
        sum+=1/(float)(2*i);
    }
    return sum;
}
```
# P27★★★
题目描述：已知一个单向链表的头，请写出删除其某一个结点的算法，要求，先找到此结点，然后删除
#### 思路

- 找到该节点的前一个结点
- 更改前一个结点的next指针，使其指向下一个节点
- 删除该节点

#### 总结

链表的操作有待深入研究：

```c++
// 删除节点函数
void deleteNode(Node*& head, int value) {
    if(head == nullptr) {
        return;
    }
    if(head->data == value) {
        Node* toDelete = head;
        head = head->next;
        delete toDelete;
        return;
    }
    Node* current = head;
    while(current->next != nullptr && current->next->data != value) {
        current = current->next;
    }
    if(current->next != nullptr) {
        Node* toDelete = current->next;
        current->next = current->next->next;
        delete toDelete;
    }
}
```



# P28★
题目描述：冒泡法对十个数排序
#### 思路
- 输入十个数
- 使用冒泡法排序
#### 总结
冒泡法的关键是双重for循环
```c
for(int i=0;i<9;i++)
    {
        for(int j=0;j<9;j++)
        {
            if(a[j]>a[j+1])   //满足条件则交换前后次序
            {
                int temp=a[j];
                a[j]=a[j+1];
                a[j+1]=temp;
            }
        }
    }
```
# P29★
题目描述：有一个 16 位的整数，每 4 位为一个数，写函数求他们的和。比如：
整数 1101010110110111（十进制为 54711），和 1101+0101+1011+0111（十进制为 36
#### 思路
- 读入字符串s[16]
- 将字符串的每个字符转换成整型赋值给a[i]；
- 计算二进制数
#### 总结
注意数字字符转换成整型的方法
```c
    char s[16]=("^[\0]");
    char a[16];
    scanf("%s",s);   //读入字符串
    for(int i=0;i<16;i++)
    {
        int n=s[i]-'0';   //将单个字符转换成数字
        a[i] = n;   //赋值给a
    }
    while(p<=12)    //计算二进制求和
    {
        for(int i=1;i<=4;i++)
        {
            int q= 4-i;
            int x= 1 << q;   //求2的q次方
            sum+=a[p+i-1]*x;
        }
        p+=4;
    }
    printf("%d",sum);
```
# P30★
题目描述：设编号为1，2，…n的n个人围坐一圈，约定编号为k（1<=k<=n）的人从
1 开始报数，数到m 的那个人出列，它的下一位又从1开始报数，数到m的那个
人又出列，依次类推，直到所有人出列为止，由此产生一个出队编号的序列。
#### 思路
考虑到链表的操作，和入队的操作
- 输入n和m，k
- 不断找到第m个人
#### 总结
```c
int main()
{
    printf("输入人数，第几个出列，从谁开始报数：");
    scanf("%d %d %d",&n,&m,&k);
    bool a[n+1];

    a[0]=false;
    for(int i=1;i<=n;i++)
    {
        a[i]=true;
    }
    int h=1;
    while(p<n)    //模拟报数过程
    {
        if(a[k]==true)   //如果该人未出列
        {
            count++;    //报数
            if(count==m)   //报数报到了m，进行出列
            {
                a[k]=false;
                p++;
                printf("%d出列 ",k);   
                count=0;
            }
        }
        k++;
        if(k==n+1)   //实现循环操作
        {
            k=1;
        }
    }
    return 0;
}
```
# P31★★★
题目描述： 声明一个类String，其数据成员为charhead[100]，构造函数String（char
 *Head）实现head的初始化，成员函数void reverse（）实现head内字符串的
逆序存放，成员函数void print()实现head内字符串的输出。

#### 思路
- 声明类
- 在主函数中调用成员函数
#### 总结

类的构造

```c++
class String {
    char head[100];

public:
    // 构造函数
    String(char *Head) {
        strncpy(head, Head, sizeof(head) - 1);
        head[sizeof(head) - 1] = '\0';  // 确保结束字符存在
    }

    // 翻转字符串
    void reverse() {
        int len = strlen(head);
        for(int i = 0; i < len / 2; ++i) {
            swap(head[i], head[len - 1 - i]);
        }
    }

    // 打印字符串
    void print() {
        cout << head << endl;
    }
};
```



# P32★
题目描述：定义盒子Box类，要求具有以下成员：可设置盒子形状；可计算盒子体积；
可计算盒子的表面积
#### 思路
- private中存放盒子的长、宽、高
- public中存放构造函数、计算体积的函数、计算表面积的函数
#### 总结
- 注意this 指针的使用
```c++
class Box{
private:
    int length;  //长
    int width;  //宽
    int height; //高
public:
    // 添加带参数的构造函数
    Box(int length, int width, int height) {
        this->length = length;
        this->width = width;
        this->height = height;
    }

    int calcv()   //计算体积
    {
        return width*length*height;
    }
    int calcs()    //
    {
        return length*width*2+length*height*2+width*height*2;
    }
};
```
# P33★
题目描述：  声明一个Tree（树）类，有成员ages(树龄),成员函数grow(int years)用以对ages加上years，showAge()用以显示tree对象的ages值。在主函数中定义Tree类对象，并调用成员函数（自行指定实参数据）。
#### 思路
- private 中定义ages
- public 中声明构造函数、grow()函数、showAge（）函数
#### 总结
```c++
class Tree{
private:
    int ages;  //树龄
public:
    Tree(int ages)
    {
        this->ages=ages;
    }
    int grow(int years)
    {
        ages+=years;
    }
    void showage()
    {
        cout<<"增长后的树龄是:"<<ages<<endl;;
    }
};
```
# P34★
题目描述： 有一个学生类Student,包括学生姓名、成绩，设计一个友元函数，输出成
绩对应的等级：
#### 思路
- private 存放姓名和成绩
- public中声明构造函数和友元函数
#### 总结
```c++
class Student{
private:
    string name;
    int score;
public:
    //构造函数
    Student(const string& name, int score) : name(name), score(score) {}
    //友元函数,可以使用引用传递
    friend void showscore(Student&);
};
```
# P35★★★
题目描述：定义一个复数类，用友元函数实现对双目运算符“+”的运算符重载，使其
适用于复数运算。
#### 解答（有待深入思考）

```c++
class Complex {
private:
    double real, imag;
public:
    // 构造函数
    Complex(double r = 0, double i = 0) : real(r), imag(i) {}

    // 使用友元函数来重载‘+’运算符
    friend Complex operator+ (const Complex &c1, const Complex &c2);

    // 显示复数
    void display() {
        cout << real << " + " << imag << "i" << endl;
    }
};

Complex operator+ (const Complex &c1, const Complex &c2) {
    return Complex(c1.real + c2.real, c1.imag + c2.imag);
}

int main() {
    Complex c1(3.1, 4.2), c2(2.3, 3.4);
    Complex c3 = c1 + c2;  // 使用重载的 '+' 运算符
    c3.display();     // 输出结果
    return 0;
}

```




# P36★
题目描述：有一个Time类，包含数据成员minute(分)和sec(秒)，模拟秒表，每次走
一秒，满60秒进一分钟，此时秒又从0开始算。要求输出分和秒的值。（提示：
重载单目运算符++）。
#### 思路
- private 中声明minute和sec
- public中声明构造函数 和 重载运算符 “++”
#### 总结
```c++
class Time{
private:
    int minute;   //分
    int sec;    //秒
public:
    Time(int mm = 0, int ss = 0) : minute(mm), sec(ss) {}
    // 使用成员函数来重载‘++’运算符
    Time& operator++ ();
    void showtime()
    {
        cout<<minute<<":"<<sec;
    }
};


Time& Time::operator++ ()
{
    if(sec!=59)
    {
        sec++;
    }
    else
    {
        sec=0;
        minute++;
    }
    return *this;
}

int main()
{
    Time t1(10,59);
    ++t1;
    t1.showtime();
    return 0;
}
```
# P37★
题目描述： 设计一个三角形类Triangle，包含三角形三条边长的私有数据成员，另有
一个重载运算符“+”，以实现求两个三角形对象的面积之和。

#### 思路
- private 中声明三条边长
- pubic 中声明构造函数和重载运算符“+”
#### 总结
```c++

class Triangle{
private:
    int a;
    int b;
    int c;
public:
    Triangle(int aa = 0, int bb = 0, int cc = 0) : a(aa), b(bb), c(cc) {}
    double calcs()    //计算面积
    {
        double s=(a+b+c)/2;
        return sqrt(s * (s - a) * (s - b) * (s - c));
    }
    friend double operator+(Triangle &t1, Triangle &t2);   //重载“+”
};

double operator+ (Triangle &t1, Triangle &t2) {
    return t1.calcs() + t2.calcs();
}
int main()
{
    Triangle t1(3,4,5);
    Triangle t2(6,8,10);
    double totalArea = t1 + t2;
    cout<<"两三角形的面积之和："<<totalArea<<endl;
}
```
# P38★
题目描述： 使用函数重载的方法定义两个重名函数，分别求出整型数的两数之和和浮点 数的两数之和，并在主函数中调用。
#### 思路

- 定义两个都为sum的重名函数
- 函数返回的值和处理的值不同，分别是int和float

#### 总结

```c++
int sum(int a, int b){
    return a+b;
}

// 浮点数之和的函数
float sum(float a, float b){
    return a+b;
}

int main(){
    int x = 1, y = 2;
    float m = 1.5, n = 2.5;
    
    cout << "Integer sum: " << sum(x, y) << endl;  // 输出 "Integer sum: 3"
    cout << "Float sum: " << sum(m, n) << endl;    // 输出 "Float sum: 4"
    
    return 0;
}
```



# P39★
题目描述：定义一个抽象类Shape用以计算面积，从中派生出计算长方形、梯形、圆形
面积的派生类。程序中通过基类指针来调用派生类中的虚函数，计算不同形状的面积。
#### 思路
- 基类要写一个虚函数
- 在长方形、梯形和圆形的public 中重新声明虚函数的内部
#### 总结
```c++
class Shape {
    public:
        virtual double calcs() = 0;  // 纯虚函数
};
//继承于shape类的长方形类
class Rectangle: public Shape {
    double width, height;
    public:
        Rectangle(double w, double h) : width(w), height(h) {}
        double calcs() { return width * height; }  // 重写shape类的虚函数
};
```
# P40★
题目描述：定义计数器类Counter。要求具有以下成员：计数器值；可进行增值和减值
记数；可提供记数值。
#### 解答：

```c++
class Counter {
    private:
        int count; // 计数器值
    public:
        Counter() : count(0) {} // 构造函数，初始化计数器为0
        void increment() { count++; } // 增加计数
        void decrement() { if(count > 0) count--; } // 减少计数，但不会小于0
        int get_count() const { return count; } // 返回当前计数
};
```

# P41★
题目描述：声明一个哺乳动物Mammal类，再由此派生出狗Dog类，二者都定义speak( )
成员函数，基类中定义为虚函数。声明一个Dog类的对象，调用speak()函数，
观察运行结果。
#### 思路
考察的继承
- Mammal类的speak()函数中不输出任何内容；
- Dog类的speak()函数做出一定的修改，输出wolf！
#### 总结
```c++
class Mammal{
    public:
        virtual void speak(){};  // 纯虚函数
};
//定义继承于Mammal类的Dog类
class Dog: public Mammal {
    public:
        virtual void speak(){cout<<"wolf!";}  // 纯虚函数
};

```
# P42★
题目描述：编写一个程序计算“三角形、正方形、圆形”三种图形的面积，要求：
a) 抽象出一个基类Base；
b) 在其中说明一个虚函数用来求面积；
c) 利用派生类定义“三角形、正方形、圆形”；
d) 编写主函数并测试。
#### 思路
与P39重复，仅仅是基类的命名不同
#### 总结
```c++
class Base {
    public:
        virtual double calcs() = 0;  // 纯虚函数
};
//继承于Base类的长方形类
class Rectangle: public Base {
    double width, height;
    public:
        Rectangle(double w, double h) : width(w), height(h) {}
        double calcs() { return width * height; }  // 重写shape类的虚函数
};
```
# P43★
题目描述： 编写一段程序，从标准输入中一次读入一整行，存入std::string中，然后修改该程序，使其一次读入一个词
#### 思路
分别使用getline和cin>>实现
#### 总结
- 读入一整行文本，可以包含空格
```c++
    string line;
    while(getline(cin,line))
        cout<<line<<endl;
```
-  值读入字符，不能包含空格
```c++
    string word;
	//循环读取，每次读一个单词
	cout << "请输入字符串" << endl;
	while (cin>>word)
		cout << word<< endl;
	return 0;
```
# P44★
题目描述：解释 string 类型的输入操作符和 getline 函数分别如何处理空白字符。 
## 解答
- Cin>>这种方法会自动忽略到空白字符，例如空格和换行符
- 而getline(cin>>str)不会忽略空白字符，到换行符会自动终止
# P45★
题目描述：编写一段程序从标准输入中读入多个字符串并将它们连接在一起，输出连接
成的大字符串。然后修改上述程序，用空格把输入的多个字符串分隔开来。
#### 思路
- 可以使用str1+str2连接字符串
#### 总结
```c++
int main()
{
    cin>>str1>>str2;
    //将stt1和str2连接起来
    string str=str1+str2;
    cout<<str<<endl;
    //用空格分隔两个字符串
    cout<<str1<<" "<<str2;
    return 0;
}
```
# P46★
题目描述：写一段程序，读入一个包含标点符号的字符串，将标点符号去除后输出字
符串剩余的部分。
#### 思路
- 输入字符串
- 循环扫描读到的每个字符
- 将除了标点之外的字符存入到新串中
- 输出新串
#### 总结
- 注意空串的定义方法：
```c++
int main()
{
    string str1;
    string str2("\0");   //str2用于存放新串,故置空
    getline(cin,str1);  //读取一行字符
    for(int i=0;i<str1.size();i++)
    {
        if(!ispunct(str1.at(i)))
        {
            str2+=str1.at(i);  //将非标点符号的字符放入新串
        }
    }
    cout<<str2;
}
```
# P47★★★ 关于迭代器
题目描述：编写一段程序，创建一个含有10个整数的vector对象，然后使用迭代器将
所有元素的值都变成原来的两倍。输出vector对象的内容，检验程序是否正确。
#### 思路
- 创建vector<int> num数组
- 输入num内的元素
- 用迭代器和for循环将元素的值乘2
- 输出vector的元素
#### 总结
```c++
    vector<int> num(10,0);
    for(int i=0;i<num.size();i++)
    {
        cin>>num[i];
    }
    // 使用迭代器将所有元素的值都变成原来的两倍
    for(auto it = num.begin(); it != num.end(); ++it)
    {
        *it *= 2;
    }
    // 输出vector对象的内容
    for(const auto &value : num)
    {
        cout << value << " ";
    }
```
# P48★
题目描述：编写一段程序，比较两个std::string对象。再编写一段程序，比较两个C
风格字符串的内容。
#### 思路
- C++可以直接比较
- C语言需要通过string.h库中的strcmp函数
#### 总结
- C++风格
```c++
    if(s1 == s2)
```
- C语言风格
```c
	strcmp(s3, s4)
```
# P49★
题目描述：对于下面的程序任务，vector、deque和list哪种容器最为合适？解释你
的选择的理由。如果没有哪一种容器优于其他容器，也请解释理由。（练习9.1）
#### 解答
- 读取固定数量的单词，将他们按字典序插入到容器中。
```
选择list, 按字典序插入需要频繁的在中间位置进行插入操作，用list很合适
```
- 读取未知数量的单词，总是将新单词插入到末尾。删除操作在头部进行。
```
选择deque，支持高效的首位插入和删除操作
```
- 从一个文件读取未知数量的整数。将这些数排序，然后将他们打印到标
准输出
```
选择vector, vector在动态增长和内存使用方面更有效率
```
# P50★
题目描述：对6种创建和初始化vector对象的方法，每一种都给出一个实例。解释每
个vector 包含什么值
#### 解答
1. 默认构造
```c++
vector<int> v1;   //空的vector，不含任何元素
```
2. 填充构造
```c++
vector<int> v2(5,10);   //5个元素，每个值都是0
```
3. 范围构造
```c++
vector<int> v2_copy(v2.begin(),v2.end());   //复制v2开始到结束的副本
```
4. 列表初始化
```c++
vector<int> v3{1,2,3,4,5};   //v3包含5个元素，值为1，2，3，4，5
```
5. 复制构造
```c++
vector<int> v4(v3);   //包含v3的所有元素
```
6. 移动构造
```c++
vector<int> v5(move(v4));  //拥有V4的所有元素，而V4变空
```
# P51★
题目描述：如何从一个list<int>初始化一个vector<double>?从一个vector<int>又
该如何创建？编写代码验证你的答案。
#### 思路
- 不能直接拷贝
- 使用vec.begin(), vec.end() 将元素拷贝到其他类型的容器中
#### 总结
```c++
 	list<int> ilist(10,0);
 	vector<int> ivec(10,0);
 	vector<double> doublevec1(ilist.begin(),ilist.end());//初始化
 	vector<double> doublevec2(ivec.begin(),ivec.end());//初始化
    for(int i=0;i<doublevec1.size();i++)
    {
        cout<<doublevec1[i]<<" ";
    }
    cout<<endl;
    for(int i=0;i<doublevec2.size();i++)
    {
        cout<<doublevec2[i]<<" ";
    }
    return 0;
```
# P52★
题目描述： 编程程序，将一个list中的char*指针（指向C风格字符串）元素赋值给
一个vector中的string。
#### 思路
- 通过clist.cbegin(), clist.cend(), 将字list中的字符串元素传递给stringvec
- 通过迭代器循环输出stringvec的每个串
#### 总结
```c++
    list<const char*> clist{"string1","string2"};
    vector<string> stringvec(clist.cbegin(),clist.cend());
    for(auto i=stringvec.begin();i<=stringvec.end();i++)    //使用迭代器访问元素
        cout<<*i<<" ";
    cout<<endl;
```
# P53★
题目描述：编写程序，从标准输入读取string序列，存入一个deque中。编写一个循
环，用迭代器打印deque中的元素。
#### 思路
- 标准输入cin读取string序列
- 将string入队
- 通过迭代器输出deque中的所有字符串
#### 总结
```c++
    deque<string> sde;
    string str;
    while(cin>>str)
    {
        sde.push_back(str);    //将字符串入队
        if(cin.get()=='\n')
        {
            break;
        }
    }
    for(auto i=sde.begin();i<=sde.end();i++)  //循环输出元素
    {
        cout<<*i<<" ";
    }
```
# P54★
题目描述：编写程序，从一个list<int>拷贝元素到两个deque中，其中值为偶数的所
有元素都拷贝到一个deque中，而奇数元素都拷贝到另一个deque中
#### 思路
- 先创建list容器，存入奇偶元素
- 循环判断元素的奇偶性，分别push到对应的队列中
#### 总结
- 注意list的迭代器不能用<=list.end(); 而应该使用!=list.end();
```c++
    list<int> ilist{1,2,3,4,5,6,7,8,9,10};
    deque<int> deq1,deq2;
    for(auto i=ilist.begin();i!=ilist.end();i++)
    {
        if(*i%2==0)
        {
            deq2.push_back(*i);
        }
        else
            deq1.push_back(*i);
    }
```
# P55★
题目描述：假定你希望每次读取一个字符存入一个std::string中，而且知道最少需要
读取100个字符，应该如何提高程序的性能？
#### 解答
由于知道至少读取100个字符，因此可以用reserve先为string分配100个字符的空间，然后逐个读取字符，用push_back添加到string末尾。
#### 总结
```c++
int main() {
    string s;
    s.reserve(100);  //预先分配至少100个字符的内存
    char ch;
    while(cin >> ch)
    {
        s.push_back(ch);
    }

    return 0;
}
```
# P56★
题目描述：编写一个函数，接受一个表示名字的std::string参数和两个分别表示前缀
（如“Mr.”或“Ms.”）和后缀（如“Jr.”“III”）的字符串。使用迭代器及insert 和 append 函数将前缀和后缀加到给定的名字中，生成新的string并返回
#### 思路
- 声明字符串 surname 用于存放姓氏
- 创建函数add_pre_surf()
#### 总结
注意insert和append的用法
```c++
string add_pre_suf(string n,string pre,string suf)
{
    n.insert(n.begin(),pre.begin(),pre.end());
    n.append(suf);
    return n;
}
```
# P57★
题目描述：定义一个map，关键字是家庭的姓，值是一个vector，保存家中孩子（们）
的名。编写代码，实现添加新的家庭以及向已有家庭中添加新的孩子。
#### 思路
- 定义map
- 将一组家庭的孩子添加到另一组家庭
- 打印家庭成员
#### 总结
- 注意map的创建和使用
```c++
    vector<string> vec={"Tom","Jerry","Lucy"};
    map<string,vector<string>> family = {{"Green",vec},{"White",vec}};
```
# P58★
题目描述：编写一个程序，在一个vector而不是一个set中保存不重复的单词。使用
set 的优点是什么？
#### 解答
- set是一种关联容器，set中的元素只有键，没有实值，往其中插入已存在的元素是无效的，所意set本身所有的元素都是唯一的
# P59★
题目描述：可以用什么类型来对一个map进行下标操作？下标运算符返回的类型时什
么？请给出一个具体例子，即定义一个map，然后写出一个可以用来对map进行
下标操作的类型以及下标运算符将会返回的类型。
#### 思路
- 创建一个map，包含姓名和年龄
- 用姓名返回出年龄
#### 总结
```c++
int main(){
    map<string,int> mymap;
    mymap = {{"Alice",25}};
    cout<<mymap["Alice"];
    return 0;
}
```
# P60★
题目描述： 用冒泡法对10个整数排序。（用STL的vector容器实现）
#### 思路
- 创建Vector
- 存入十个整数
- 用冒泡法排序
#### 总结
```c++
int main(){
    vector<int> vec(10,0);
    for(int i=0;i<vec.size();i++){
        cin>>vec[i];
    }

    for(int i=0;i<vec.size()-1;i++){    //冒泡法排序
        for(int j=0;j<vec.size()-i-1;j++){
            if(vec[j] > vec[j+1]){
                int temp = vec[j];
                vec[j] = vec[j+1];
                vec[j+1] = temp;
            }
        }
    }

    for(int i=0;i<vec.size();i++){
        cout<<vec[i]<<" ";
    }

    return 0;
}
```