---
title: "BLAS教程"
description: ""
pubDate: 2026-06-095
category: ""
order: 0
tags: 
---

# BLAS (Basic Linear Algebra Subprograms) 详细教程

## 1. 简介

BLAS（Basic Linear Algebra Subprograms，基础线性代数子程序）是一个应用程序接口（API）标准，用于发布基础线性代数操作，如向量和矩阵乘法。这些子程序最初作为 LAPACK 的一部分发布，现在被广泛用作许多其他数学软件（如 NumPy, MATLAB, R 等）的底层构建块，因为它们通常由硬件供应商（如 Intel MKL, OpenBLAS, AMD ACML）进行了高度优化。

## 2. BLAS 的三个级别 (Levels)

BLAS 的功能按其处理的数据结构和计算复杂度分为三个级别：

### 2.1 Level 1 BLAS (向量-向量操作)
处理的是一维数组（向量）。
- **计算复杂度**: $O(N)$
- **数据访问**: $O(N)$
- **典型操作**: 
  - 向量缩放 (`SCAL`): $x \leftarrow \alpha x$
  - 向量加法 (`AXPY`): $y \leftarrow \alpha x + y$
  - 点积 (`DOT`): $r \leftarrow x^T y$
  - 范数计算 (`NRM2`): $r \leftarrow ||x||_2$
  - 找出最大绝对值的元素索引 (`AMAX`)

### 2.2 Level 2 BLAS (矩阵-向量操作)
处理的是二维数组（矩阵）和一维数组（向量）之间的操作。
- **计算复杂度**: $O(N^2)$
- **数据访问**: $O(N^2)$
- **典型操作**:
  - 一般矩阵-向量乘法 (`GEMV`): $y \leftarrow \alpha Ax + \beta y$
  - 对称矩阵-向量乘法 (`SYMV`): $y \leftarrow \alpha Ax + \beta y$ (A为对称矩阵)
  - 三角矩阵-向量乘法 (`TRMV`): $x \leftarrow Ax$ (A为三角矩阵)
  - 秩一更新 (`GER`): $A \leftarrow \alpha x y^T + A$

### 2.3 Level 3 BLAS (矩阵-矩阵操作)
处理的是二维数组（矩阵）和二维数组（矩阵）之间的操作。这是 BLAS 中最重要的一部分，因为它可以充分利用现代 CPU 的缓存（Cache），实现极高的计算效率。
- **计算复杂度**: $O(N^3)$
- **数据访问**: $O(N^2)$
- **典型操作**:
  - 一般矩阵-矩阵乘法 (`GEMM`): $C \leftarrow \alpha AB + \beta C$
  - 对称矩阵-矩阵乘法 (`SYMM`): $C \leftarrow \alpha AB + \beta C$ (A或B为对称矩阵)
  - 三角矩阵乘法 (`TRMM`): $B \leftarrow \alpha AB$ 或 $B \leftarrow \alpha BA$ (A为三角矩阵)
  - 求解三角矩阵方程 (`TRSM`): $X \leftarrow \alpha A^{-1}B$ (A为三角矩阵)

## 3. BLAS 函数命名规则

BLAS 中的函数名通常有 4-6 个字符，其命名规则为：

**`<数据类型><矩阵类型><操作类型>`**

### 3.1 数据类型 (Prefix)
- **`S`** (Single): 单精度实数 (float)
- **`D`** (Double): 双精度实数 (double)
- **`C`** (Complex): 单精度复数 (complex float)
- **`Z`** (Double Complex): 双精度复数 (complex double)

### 3.2 矩阵类型 (Matrix Type, 针对 Level 2 & 3)
- **`GE`** (General): 一般矩阵
- **`SY`** (Symmetric): 对称矩阵
- **`HE`** (Hermitian): 埃尔米特矩阵 (复数域上的共轭对称矩阵)
- **`TR`** (Triangular): 三角矩阵
- **`GB`** (General Band): 一般带状矩阵
- **`SB`** (Symmetric Band): 对称带状矩阵
- **`SP`** (Symmetric Packed): 对称打包存储矩阵

### 3.3 操作类型 (Operation)
- **`MM`** (Matrix-Matrix Multiply): 矩阵乘矩阵
- **`MV`** (Matrix-Vector Multiply): 矩阵乘向量
- **`SM`** (Solve Matrix): 求解矩阵方程
- **`SV`** (Solve Vector): 求解向量方程
- **`RK`** (Rank-K Update): 秩K更新
- **`DOT`** (Dot Product): 点积
- **`AXPY`** (Alpha X Plus Y): $y \leftarrow \alpha x + y$

**示例**：
- `SGEMM`: 单精度(S) 一般矩阵(GE) 矩阵乘法(MM)
- `DGEMV`: 双精度(D) 一般矩阵(GE) 矩阵向量乘法(MV)
- `DAXPY`: 双精度(D) 向量缩放加法(AXPY)

## 4. 核心函数详解：GEMM

`GEMM` (General Matrix-Matrix Multiplication) 是 BLAS 中最核心、被优化得最好的函数。在深度学习和科学计算中，绝大多数计算时间都花在 `GEMM` 上。

以 `cblas_dgemm` (C语言接口的双精度版本) 为例：

```c
void cblas_dgemm(const enum CBLAS_ORDER Order, const enum CBLAS_TRANSPOSE TransA,
                 const enum CBLAS_TRANSPOSE TransB, const int M, const int N,
                 const int K, const double alpha, const double *A,
                 const int lda, const double *B, const int ldb,
                 const double beta, double *C, const int ldc);
```

执行的操作是： $C \leftarrow \alpha \cdot op(A) \cdot op(B) + \beta \cdot C$

- `Order`: 矩阵的存储顺序，`CblasRowMajor` (按行存储，如C/C++) 或 `CblasColMajor` (按列存储，如Fortran/MATLAB)。
- `TransA`, `TransB`: 矩阵A和B是否需要转置。`CblasNoTrans` (不转置), `CblasTrans` (转置), `CblasConjTrans` (共轭转置)。
- `M`, `N`, `K`: 维度信息。如果 `op(A)` 是 $M \times K$ 矩阵，`op(B)` 是 $K \times N$ 矩阵，那么 `C` 是 $M \times N$ 矩阵。
- `alpha`, `beta`: 标量系数。
- `A`, `B`, `C`: 指向矩阵数据的指针。
- `lda`, `ldb`, `ldc`: Leading Dimension。指的是在内存中，矩阵相邻两行（行主序）或相邻两列（列主序）的同一位置元素之间的跨度。用于提取子矩阵。

## 5. 常用的 BLAS 实现

1. **Netlib BLAS**: 官方参考实现（Fortran），性能较差，主要用于参考和测试。
2. **OpenBLAS**: 开源、跨平台、高性能，基于 GotoBLAS，针对多种 CPU 架构进行了汇编级优化。
3. **Intel MKL (Math Kernel Library)**: 闭源，对 Intel 处理器优化极佳，现在被称为 Intel oneMKL。
4. **AMD AOCL/ACML**: AMD 处理器的优化库。
5. **cuBLAS**: NVIDIA 提供的在 GPU 上运行的 BLAS 实现。
6. **Apple Accelerate**: Apple macOS/iOS 系统内置的优化数学库。

## 6. 在 C/C++ 中使用 OpenBLAS 的简单例子

首先，确保安装了 OpenBLAS (例如在 Ubuntu 下：`sudo apt install libopenblas-dev`)。

```c
#include <stdio.h>
#include <stdlib.h>
#include <cblas.h>

int main() {
    int m = 2, n = 2, k = 2;
    double alpha = 1.0, beta = 0.0;
    
    // A = [1.0, 2.0; 3.0, 4.0] (Row Major)
    double A[4] = {1.0, 2.0, 3.0, 4.0};
    
    // B = [5.0, 6.0; 7.0, 8.0] (Row Major)
    double B[4] = {5.0, 6.0, 7.0, 8.0};
    
    double C[4];
    
    // 计算 C = alpha * A * B + beta * C
    cblas_dgemm(CblasRowMajor, CblasNoTrans, CblasNoTrans, 
                m, n, k, alpha, 
                A, k, // lda = k
                B, n, // ldb = n
                beta, 
                C, n); // ldc = n
                
    printf("Result Matrix C:\n");
    for(int i = 0; i < m; i++) {
        for(int j = 0; j < n; j++) {
            printf("%f ", C[i * n + j]);
        }
        printf("\n");
    }
    
    return 0;
}
```

编译命令：
```bash
gcc test_blas.c -o test_blas -lopenblas
./test_blas
```

## 7. 总结

BLAS 是高性能计算的基石。理解 BLAS 的级别划分、命名规则，以及深刻理解 `GEMM` 的运作机制，是进行高性能科学计算、开发深度学习框架不可或缺的基础知识。在实际应用中，很少需要自己手写这些计算过程，而是应该尽可能调用高度优化的 BLAS 库来完成任务。
