+++
title = 'C语言中的六种位运算符'
date = 2024-04-24T21:09:13+08:00
draft = false
summary = "位运算符的灵活应用"
tags = [ "C/C++", "技术", "位运算符"]
+++
#### 六种位运算符

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
        0011按位做与运算得到last set bit

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

  - eg3. 拓展：筛出数组中的两个单独的数（其余的都出现了两次）

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
