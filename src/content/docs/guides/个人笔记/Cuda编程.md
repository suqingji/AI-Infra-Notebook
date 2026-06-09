---
title: "Cuda学习乱七八糟的笔记与思考"
description: ""
pubDate: 2026-06-095
category: ""
order: 0
tags: 
---

# Cuda编程





\[nvidia\-ampere\-architecture\-whitepaper\.pdf\]



\[CUDA C\+\+ Programming Guide \(NVIDIA\) \(Z\-Library\)\.pdf\]











# 基础入门

## 前言

关于CPU与GPU的区别



**CPU 的特点：**

1. **通用性强：**

CPU 是通用计算设备，可以处理各种不同的任务，从操作系统的运行到复杂的逻辑和控制。

2. **核心数较少，单核性能高：**

CPU 通常拥有较少的核心数（通常在 4 到 64 核之间，取决于型号），但单个核心的性能很强，能够执行复杂的逻辑运算。

3. **多样化的指令集：**

CPU 支持复杂指令集，能够灵活处理各种任务，包括分支预测和流水线操作。

4. **高频率：**

CPU 通常运行在较高的时钟频率下，适合低延迟、高复杂度的任务。



**GPU 的特点：**

1. **专为并行计算设计：**

GPU 拥有大量的核心（从几百到几千个），可以同时执行大量简单的计算，非常适合并行任务。

2. **吞吐量高：**

GPU 的设计目标是高吞吐量，可以在大规模数据处理中高效地完成任务。

3. **有限的灵活性：**

GPU 主要针对浮点数运算和矢量化计算进行了优化，通常在通用性和指令集灵活性上不如 CPU。

4. **低频率：**

为了容纳更多的核心，GPU 的单核运行频率通常较低。



**哪些场景不能用 GPU，必须用 CPU：**

1. **逻辑复杂、非并行的任务：**

    - 需要复杂的决策、条件分支、多线程管理时，CPU 更适合。例如，操作系统调度、程序控制流的管理。

    - GPU 在处理复杂的条件判断（如嵌套分支）时效率会显著下降。

2. **依赖低延迟的任务：**

    - 需要快速响应、低延迟的场景（如实时系统、交互式任务）。GPU 的高延迟和启动开销使其不适合这些场景。

3. **小数据量处理：**

    - GPU 在数据量较小时无法充分利用其并行能力，而 CPU 能够在小数据量场景下更高效地处理。

4. **任务的启动开销很高时：**

    - 将任务从主机（CPU）传递到 GPU 会有数据传输开销，对于计算量小、任务短的场景，CPU 反而更高效。

5. **某些串行计算任务：**

    - 比如递归算法、动态规划等需要依赖前一步计算结果的任务。

6. **需要广泛使用系统资源的任务：**

    - 涉及大量 I/O 操作（磁盘、网络）、中断处理或硬件管理的任务，GPU 无法直接胜任。

7. **专用库或框架不支持的计算：**

    - 如果某些特定计算未被 GPU 的框架（如 CUDA、OpenCL）优化或支持，开发者需要自己实现支持，成本较高。

        

CPU 是通用计算领域的主力，适合小规模任务、复杂逻辑和低延迟需求的计算；GPU 则擅长大规模并行计算和数据密集型任务，如图像处理、深度学习和科学计算。在实际应用中，CPU 和 GPU 经常协同工作，各自负责不同类型的任务，以达到更高效的计算性能。



严格来说，**没有场景是 GPU 可以完成而 CPU 完全无法完成的**，因为 GPU 和 CPU 都是通用图灵机的一部分，理论上可以完成任何可计算的任务。然而，在**实际应用中**，有些场景虽然 CPU 能完成，但由于性能和效率的限制，它实际上是“不可行”的。这些场景下，GPU 才是真正的解决方案。





## cuda环境安装



### Windows

#### 安装

1\.有一张N卡

2\.安装驱动\(在官网下载\)（注意要使得cuda版本比驱动使用的cuda版本低才行）

验证驱动：nvidia\-smi



```C++

 PS C:\Users\suqin> nvidia-smi
 Thu Nov 20 21:40:55 2025
 +-----------------------------------------------------------------------------------------+
 | NVIDIA-SMI 560.94                 Driver Version: 560.94         CUDA Version: 12.6     |
 |-----------------------------------------+------------------------+----------------------+
 | GPU  Name                  Driver-Model | Bus-Id          Disp.A | Volatile Uncorr. ECC |
 | Fan  Temp   Perf          Pwr:Usage/Cap |           Memory-Usage | GPU-Util  Compute M. |
 |                                         |                        |               MIG M. |
 |=========================================+========================+======================|
 |   0  NVIDIA GeForce RTX 4060      WDDM  |   00000000:01:00.0 Off |                  N/A |
 |  0%   42C    P0             N/A /  115W |    3311MiB /   8188MiB |      0%      Default |
 |                                         |                        |                  N/A |
 +-----------------------------------------+------------------------+----------------------+
 
 +-----------------------------------------------------------------------------------------+
 | Processes:                                                                              |
 |  GPU   GI   CI        PID   Type   Process name                              GPU Memory |
 |        ID   ID                                                               Usage      |
 |=========================================================================================|
 |    0   N/A  N/A      1696    C+G   ...2txyewy\StartMenuExperienceHost.exe      N/A      |
 |    0   N/A  N/A      2628    C+G   C:\Windows\System32\ShellHost.exe           N/A      |
 |    0   N/A  N/A      4912    C+G   ...__8wekyb3d8bbwe\WindowsTerminal.exe      N/A      |
 |    0   N/A  N/A      4960    C+G   ...ekyb3d8bbwe\PhoneExperienceHost.exe      N/A      |
 |    0   N/A  N/A      7244    C+G   C:\Windows\explorer.exe                     N/A      |
 |    0   N/A  N/A      8340    C+G   ...\AMD\CNext\CNext\RadeonSoftware.exe      N/A      |
 |    0   N/A  N/A     10416    C+G   C:\Windows\explorer.exe                     N/A      |
 |    0   N/A  N/A     12924    C+G   C:\Windows\explorer.exe                     N/A      |
 |    0   N/A  N/A     13672    C+G   ...CBS_cw5n1h2txyewy\TextInputHost.exe      N/A      |
 |    0   N/A  N/A     13836    C+G   ...1\Multiphysics\bin\win64\comsol.exe      N/A      |
 |    0   N/A  N/A     14472    C+G   ...nt.CBS_cw5n1h2txyewy\SearchHost.exe      N/A      |
 |    0   N/A  N/A     18352    C+G   C:\Windows\explorer.exe                     N/A      |
 |    0   N/A  N/A     21124    C+G   ...1\Multiphysics\bin\win64\comsol.exe      N/A      |
 |    0   N/A  N/A     27364    C+G   ...5n1h2txyewy\ShellExperienceHost.exe      N/A      |
 |    0   N/A  N/A     27928    C+G   ...7\extracted\runtime\WeChatAppEx.exe      N/A      |
 |    0   N/A  N/A     28664    C+G   ...on\141.0.3537.99\msedgewebview2.exe      N/A      |
 |    0   N/A  N/A     29380    C+G   ...ud\ACC\Creative Cloud UI Helper.exe      N/A      |
 |    0   N/A  N/A     30532    C+G   ...oogle\Chrome\Application\chrome.exe      N/A      |
 |    0   N/A  N/A     34260    C+G   ...1\Multiphysics\bin\win64\comsol.exe      N/A      |
 |    0   N/A  N/A     34640    C+G   ...harp\CefSharp.BrowserSubprocess.exe      N/A      |
 |    0   N/A  N/A     34728    C+G   ...on\142.0.3595.69\msedgewebview2.exe      N/A      |
 |    0   N/A  N/A     37084    C+G   C:\Windows\explorer.exe                     N/A      |
 |    0   N/A  N/A     42544    C+G   ...twise2023.1\win64\bin\Pointwise.exe      N/A      |
 |    0   N/A  N/A     44060    C+G   ...clang11.1vc14.2-r8\lib\starccmw.exe      N/A      |
 |    0   N/A  N/A     45656    C+G   ...1\Multiphysics\bin\win64\comsol.exe      N/A      |
 |    0   N/A  N/A     46524    C+G   ...twise2023.1\win64\bin\Pointwise.exe      N/A      |
 |    0   N/A  N/A     50952    C+G   ...22\Community\Common7\IDE\devenv.exe      N/A      |
 |    0   N/A  N/A     51516    C+G   ...on\142.0.3595.90\msedgewebview2.exe      N/A      |
 +-----------------------------------------------------------------------------------------+
```



3\.安装cuda toolkit 和 nvcc

[https://developer\.nvidia\.com/cuda\-downloads](https://developer.nvidia.com/cuda-downloads)

旧版本直接搜即可

[https://developer\.nvidia\.com/cuda\-12\-2\-0\-download\-archive?target\_os=Windows](https://developer.nvidia.com/cuda-12-2-0-download-archive?target_os=Windows)



然后配置好环境变量

如何验证安装成功

打开终端

```C++
PS C:\Users\suqin> nvcc -V
 nvcc: NVIDIA (R) Cuda compiler driver
 Copyright (c) 2005-2025 NVIDIA Corporation
 Built on Wed_Aug_20_13:58:20_Pacific_Daylight_Time_2025
 Cuda compilation tools, release 13.0, V13.0.88
 Build cuda_13.0.r13.0/compiler.36424714_0
```

总结：安装很简单，被petsc等库折磨后，总觉得c\+\+库安装和环境变量配置会非常麻烦，其实先进的商业库是很强的。

#### VS Studio



##### 使用cuda

安装了Cuda tool kit以后，在VS中新建项目时会多出来一个CUDA的项目创建。

当然，在 Visual Studio 中也完全可以使用 CMake 来进行 CUDA 编程。 这是目前 Windows 上 最灵活、最现代 的 CUDA 项目方式之一，与 VS 的原生 CUDA 工程相比，CMake 的移植性更强。



##### 问题排查

###### 那么 VS 报 “未定义标识符” 但程序能正常编译运行，这完全是：

✅ IntelliSense 误报（VS IDE 的代码分析器报错，不影响 nvcc 编译）

这是 Windows 下 CUDA 工程最常见的问题之一。



#### VS code

需要安装一个插件 `Nsight Visual studio Code edition`



#### Clion

可以创建项目时指定cuda项目，

然后工具链设置好，

### WSL

#### 安装驱动

从 Windows 10 21H2 / Windows 11 开始，WSL2 原生支持 GPU 直通。

你在 Windows 上安装驱动 后，WSL 自动就能访问 GPU。

你可以用下面命令验证 WSL 是否识别 GPU：

nvidia\-smi



在 Windows 上安装驱动后，WSL 里 只要安装 CUDA Toolkit（工具链）即可：

Ubuntu 示例：

```C++
sudo apt update
 sudo apt install nvidia-cuda-toolkit
```



或者安装官方 CUDA Toolkit（推荐）：

```Bash
wget https://developer.download.nvidia.com/compute/cuda/repos/wsl-ubuntu/x86_64/cuda-wsl-ubuntu.pin
 sudo mv cuda-wsl-ubuntu.pin /etc/apt/preferences.d/cuda-repository-pin-600
 wget https://developer.download.nvidia.com/compute/cuda/12.6.0/local_installers/cuda-repo-wsl-ubuntu-12-6-local_12.6.0-1_amd64.deb
 sudo dpkg -i cuda-repo-wsl-ubuntu-12-6-local_12.6.0-1_amd64.deb
 sudo cp /var/cuda-repo-wsl-ubuntu-12-6-local/cuda-*-keyring.gpg /usr/share/keyrings/
 sudo apt-get update
 sudo apt-get -y install cuda-toolkit-12-6
```



#### 验证 NVCC 是否安装成功：

```C++
nvcc --version
 
 nvcc: NVIDIA (R) Cuda compiler driver
 Copyright (c) 2005-2023 NVIDIA Corporation
 Built on Fri_Jan__6_16:45:21_PST_2023
 Cuda compilation tools, release 12.0, V12.0.140
 Build cuda_12.0.r12.0/compiler.32267302_0
```

#### 测试 GPU 是否能在 WSL 中跑 CUDA 程序

```C++
测试示例（vectorAdd）：
 nvcc vectorAdd.cu -o vectorAdd
 ./vectorAdd
```

#### 其他C\+\+相关库



```C++
sudo apt install build-essential gdb pkg-config
 sudo apt install cmake make
 sudo apt install git
 Ninja（可选，但比 make 快）
 sudo apt install ninja-build
 sudo apt install gcc g++
```







## cuda设备基础知识

在 CPU 中，大量的晶体管被分配给了**控制逻辑（Control）**（用于分支预测、乱序执行）和**大容量缓存（Cache）**，以尽可能降低单个指令的延迟。 而在 GPU 中，绝大部分晶体管被分配给了**算术逻辑单元（ALU）**。GPU 处理内存延迟的策略不是“缓存它”，而是“掩盖它”：当一组线程在等待内存数据读取时，GPU 的调度器会瞬间切换到另一组已经准备好数据的线程去执行计算，以此来保持计算单元的极高利用率。



GPU 的硬件是从宏观到微观层层嵌套的：

- **GPU \(Device\)：** 整个显卡芯片。

- **GPC \(Graphics Processing Cluster\)：** 包含多个 SM，是更高一级的组织结构。

- **SM \(Streaming Multiprocessor，流多处理器\)：** **这是 GPU 架构中最核心的组件。** 类似于 CPU 的一个核心，但内部包含了成百上千个计算单元。它拥有自己的控制逻辑、指令缓存、寄存器堆（Registers）和共享内存（Shared Memory）。

- **CUDA Cores \(SP \- Streaming Processor\)：** SM 内部的执行单元，负责具体的浮点或整数运算。

- **Tensor Cores / RT Cores：** 现代 GPU 架构（如 Volta 及之后）引入的专门用于矩阵乘法（深度学习核心）或光线追踪的专用硬件单元。对于基于 PINNs 融合物理约束和深度学习的框架，Tensor Cores 能发挥巨大作用。

![Image](https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/authcode/?code=YTIzNGEyODI2NmIxMDUyOGIyNzExNzllN2UwODZiOGRfN2E2MTEyNjE2YzljMGMwM2YxNTU0MWU1NDVhNjdlNTVfSUQ6NzY0ODE3ODM0OTYzMzczNTY1Ml8xNzgxMDE3MDM4OjE3ODExMDM0MzhfVjM)





我们在写 CUDA 代码时定义的软件层级，在运行时会严格映射到硬件上：

- **Thread \(线程\) **$\rightarrow$** CUDA Core：** 最小的执行单元。

- **Warp \(线程束\) **$\rightarrow$** SM 的调度单位：** 硬件实际上是以 Warp 为单位（通常是 32 个线程）进行调度的。这 32 个线程**被迫执行相同的指令**（SIMT：单指令多线程）。如果在计算多面体网格界面的通量时，Warp 内的线程因为复杂的边界条件判断走向了不同的 `if-else` 分支，就会发生**Warp 分支发散 \(Warp Divergence\)**，导致性能急剧下降，因为它们必须串行执行不同的分支。

- **Block \(线程块\) **$\rightarrow$** SM：** 一个 Block 内的所有线程一定会被分配到**同一个 SM** 上并发执行。它们可以共享该 SM 内部极速的 Shared Memory，并进行非常低成本的同步。

- **Grid \(网格\) **$\rightarrow$** GPU：** 一次 Kernel 启动的所有线程块组成了 Grid，分布在整个 GPU 的所有 SM 上。





## GPU架构认识

https://www\.bilibili\.com/video/BV1LD6BBPEjt/?spm\_id\_from=333\.337\.search\-card\.all\.click\&vd\_source=6aa3c1e3a40a42a86f0eb675488a0bb1





![Image](https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/authcode/?code=YmQ2NGMyYWFlNjNiOTk4ZDcwODBhN2JkMGQ4ZDI5NGRfZDM0OTE1ZmU3NTQxOWNkMDhkNWQyYjU0N2ZkZDg4YzdfSUQ6NzY0OTI4Mjg5ODgyMDY4MDY2NF8xNzgxMDE3MDM4OjE3ODExMDM0MzhfVjM)



![Image](https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/authcode/?code=MjVkNWQwN2UzOWE1NzA5OTExYWE1MWI5ZGI5N2QyYWVfMTRjOGJlMGQ0NmEwMjU4OTdkMzBhZTgxNzY3YWJjNTNfSUQ6NzY0OTM1MzMwMjA1MjM5MTg3Ml8xNzgxMDE3MDM4OjE3ODExMDM0MzhfVjM)



延迟导向设计 vs 吞吐导向设计



GPU上更多面积分配给ALU单元，储存变少，传输延迟变高，但是通过其他手段容忍这种延迟。

CPU也是单核双线程，也通过多线程交替执行指令来加速，当一个线程没准备好指令时先执行另一个线程的，GPU把这种方案发挥到极致，用海量的线程来掩盖延迟问题，32或者64条线程中交替执行，因此GPU频率也要做低，防止高发热







尽管GPU和CPU都是完备图灵机，但是一般GPU不能单独计算，需要和CPU组成异构计算，CPU起到控制作用，被称为主机Host，GPU作为协处理器，称之为Device，两者之间内存交互通过PCIe总线通信



**CPU（Host）专精于“控制与逻辑”：** CPU的晶体管大量被用于极其复杂的控制单元（Control Unit）、分支预测和多级大容量缓存（Cache）。这使得它非常擅长处理复杂的逻辑判断、操作系统的全局调度以及串行代码。

**GPU（Device）专精于“吞吐与并行”：** GPU牺牲了复杂的控制逻辑和缓存机制，将绝大多数晶体管转化为了计算逻辑单元（ALU）。它就像一个拥有成千上万工人的超级工厂，但这些工人只懂执行极其简单的重复性指令，并且需要一个“包工头”（CPU）来为他们准备材料、分配任务并发号施令。















































