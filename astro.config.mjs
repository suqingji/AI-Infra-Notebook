// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import tailwindcss from '@tailwindcss/vite';
// import tailwind from '@astrojs/tailwind';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
// https://astro.build/config
export default defineConfig({
  site: 'https://suqingji.github.io', 
  base: '/AI-Infra-Notebook', 

  // 👇 2. 告诉 Astro 的 Markdown 解析器使用这两个引擎
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  },

  integrations: [
      starlight({
          title: '主页',

          head: [
            {
              tag: 'link',
              attrs: {
                rel: 'stylesheet',
                href: 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css',
              },
            },
          ],

          social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/suqingji/AI-Infra-Notebook' }],
          sidebar: [
              {
                  label: 'AI Infra from zero to hero',
                //   collapsed: true,
                  items: [
                    { label: '引言', slug: 'guides/ai-infra-introduction' },
                    { label: '学习路线', slug: 'guides/ai-infra学习路线' },
                    { 
                        label: '前置知识', 
                        collapsed: true,
                        items: [
                            { label: '第1章-编程语言基础', slug: 'guides/模块一-前置知识/第1章-编程语言基础' },
                            { label: '第2章-数学基础', slug: 'guides/模块一-前置知识/第2章-数学基础' },
                            { 
                                label: '第3章-Transformer架构详解', 
                                collapsed: true,
                                items: [
                                    { label: '模块导读', slug: 'guides/模块一-前置知识/第3章-transformer架构详解' },
                                    { autogenerate: { directory: 'guides/模块一-前置知识/transformer' } }
                                ],
                            },
                            { 
                                label: '第4章-PyTorch框架', 
                                collapsed: true,
                                items: [
                                    { label: '模块导读', slug: 'guides/模块一-前置知识/第4章-pytorch框架' },
                                    { autogenerate: { directory: 'guides/模块一-前置知识/pyrtoch' } }
                                ],
                            },
                            { 
                                label: '第5章-GPU硬件概论', 
                                collapsed: true,
                                items: [
                                    { label: '模块导读', slug: 'guides/模块一-前置知识/第5章-gpu硬件概论' },
                                    { autogenerate: { directory: 'guides/模块一-前置知识/gpu' } }
                                ],
                            },
                            { 
                                label: '第6章-集合通信基础', 
                                collapsed: true,
                                items: [
                                    { label: '模块导读', slug: 'guides/模块一-前置知识/第6章-集合通信基础' },
                                    { autogenerate: { directory: 'guides/模块一-前置知识/communication' } }
                                ],
                            },
                        ] 
                    },
                    { 
                        label: 'CUDA编程与算子优化', 
                        collapsed: true,
                        items: [
                            { label: 'CUDA编程入门指南', slug: 'guides/模块二-cuda编程与算子优化/cuda编程入门指南' },
                            { 
                                label: '第1章-CUDA编程入门', 
                                collapsed: true,
                                items: [
                                    { label: '本章导读', slug: 'guides/模块二-cuda编程与算子优化/第1章-cuda编程入门' },
                                    { label: '1.1-CUDA开发环境搭建', slug: 'guides/模块二-cuda编程与算子优化/11-cuda开发环境搭建' },
                                    { label: '1.2-CUDA编程模型', slug: 'guides/模块二-cuda编程与算子优化/12-cuda编程模型' },
                                    { label: '1.3-CUDA内存模型', slug: 'guides/模块二-cuda编程与算子优化/13-cuda内存模型' },
                                    { label: '1.4-第一个实用Kernel', slug: 'guides/模块二-cuda编程与算子优化/14-第一个实用kernel' },
                                ] 
                            },
                            { 
                                label: '第2章-CUDA性能优化基础', 
                                collapsed: true,
                                items: [
                                    { label: '本章导读', slug: 'guides/模块二-cuda编程与算子优化/第2章-cuda性能优化基础' },
                                    { label: '2.1-Warp与执行模型', slug: 'guides/模块二-cuda编程与算子优化/21-warp与执行模型' },
                                    { label: '2.2-内存访问优化', slug: 'guides/模块二-cuda编程与算子优化/22-内存访问优化' },
                                    { label: '2.3-Occupancy与资源分配', slug: 'guides/模块二-cuda编程与算子优化/23-occupancy与资源分配' },
                                    { label: '2.4-同步与原子操作', slug: 'guides/模块二-cuda编程与算子优化/24-同步与原子操作' },
                                ] 
                            },
                            { 
                                label: '第3章-经典算子实现-Reduce', 
                                collapsed: true,
                                items: [
                                    { label: '本章导读', slug: 'guides/模块二-cuda编程与算子优化/第3章-经典算子实现-reduce' },
                                    { label: '3.1-CUDA Reduce算子优化', slug: 'guides/模块二-cuda编程与算子优化/31-cuda-reduce算子优化' },
                                ] 
                            },
                            { 
                                label: '第4章-经典算子实现-GEMM', 
                                collapsed: true,
                                items: [
                                    { label: '本章导读', slug: 'guides/模块二-cuda编程与算子优化/第4章-经典算子实现-gemm' },
                                    { label: '4.1-CUDA GEMM算子性能优化', slug: 'guides/模块二-cuda编程与算子优化/41-cuda-gemm算子性能优化' },
                                ] 
                            },
                            { 
                                label: '第5章-经典算子实现-Softmax与算子融合', 
                                collapsed: true,
                                items: [
                                    { label: '本章导读', slug: 'guides/模块二-cuda编程与算子优化/第5章-经典算子实现-softmax与算子融合' },
                                    { label: '5.1-CUDA Softmax朴素实现优化', slug: 'guides/模块二-cuda编程与算子优化/51-cuda-softmax朴素实现优化' },
                                    { label: '5.2-CUDA Online Softmax实现', slug: 'guides/模块二-cuda编程与算子优化/52-cuda-online-softmax实现' },
                                ] 
                            },
                            { label: '第6章-Attention算子', slug: 'guides/模块二-cuda编程与算子优化/第6章-attention算子' },
                            { label: '第7章-AI编译器', slug: 'guides/模块二-cuda编程与算子优化/第7章-ai编译器' },
                            { label: '第8章-性能分析工具链', slug: 'guides/模块二-cuda编程与算子优化/第8章-性能分析工具链' },
                        ]
                    },
                    { 
                        label: '分布式训练', 
                        collapsed: true,
                        items: [
                            { autogenerate: { directory: 'guides/模块三-分布式训练' } },
                            // { label: 'pytorch-distributed', slug: 'guides/模块三-分布式训练/pytorch-distributed' },
                            // { label: '第1章-分布式训练总论', slug: 'guides/模块三-分布式训练/第1章-分布式训练总论' },
                            // { label: '第2章-优化器', slug: 'guides/模块三-分布式训练/第2章-优化器' },
                            // { label: '第3章-数据并行', slug: 'guides/模块三-分布式训练/第3章-数据并行' },
                            // { label: '第4章-ZeRO系列', slug: 'guides/模块三-分布式训练/第4章-zero系列' },
                            // { label: '第5章-张量并行与序列并行', slug: 'guides/模块三-分布式训练/第5章-张量并行与序列并行' },
                            // { label: '第6章-流水线并行', slug: 'guides/模块三-分布式训练/第6章-流水线并行' },
                            // { label: '第7章-其他显存优化技术', slug: 'guides/模块三-分布式训练/第7章-其他显存优化技术' },
                            // { label: '第8章-训练框架实战', slug: 'guides/模块三-分布式训练/第8章-训练框架实战' },
                        ] 
                    },
                    { 
                        label: '推理优化', 
                        collapsed: true,
                        items: [
                            { label: '第1章-LLM推理基础', slug: 'guides/模块四-推理优化/第1章-llm推理基础' },
                            { label: '第2章-推理引擎核心技术', slug: 'guides/模块四-推理优化/第2章-推理引擎核心技术' },
                            { 
                                label: '第3章-主流推理框架', 
                                collapsed: true,
                                items: [
                                    { label: '模块导读', slug: 'guides/模块四-推理优化/第3章-主流推理框架/第3章-主流推理框架' },
                                    { label: 'vllm快速入门', slug: 'guides/模块四-推理优化/第3章-主流推理框架/vllm快速入门' },
                                ],
                            },
                            { label: '第4章-量化', slug: 'guides/模块四-推理优化/第4章-量化' },
                            { label: '第5章-Speculative-Decoding', slug: 'guides/模块四-推理优化/第5章-speculative-decoding' },
                            { label: '第6章-PD解耦架构', slug: 'guides/模块四-推理优化/第6章-pd解耦架构' },
                            { label: '第7章-性能分析与Benchmark', slug: 'guides/模块四-推理优化/第7章-性能分析与benchmark' },
                            { label: '第8章-推理优化选型与端到端实战', slug: 'guides/模块四-推理优化/第8章-推理优化选型与端到端实战' },
                        ] 
                    },
                    { label: '个人笔记', slug: 'guides/个人笔记/cuda编程' },
                ]
              },
              {
                  label: '数值计算',
                  items: [
                        { label: 'BLAS', slug: 'ptesc/blas-lapack/blas的详细教程' },
                ]
              },
              {
                  label: '机器学习',
                  items: [
                        { label: '机器学习', slug: 'machine-learning/机器学习' },
                ]
              },

          ],
      }),
    //   tailwind(),
	],

  vite: {
    plugins: [tailwindcss()],
  },

});