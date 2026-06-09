// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import tailwindcss from '@tailwindcss/vite';
// import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  integrations: [
      starlight({
          title: '主页',
          social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/suqingji/AI-Infra-Notebook' }],
          sidebar: [
              {
                  label: 'Guides',
                  items: [
                      // Each item here is one entry in the navigation menu.
                      { label: 'Example Guide', slug: 'guides/example' },
                  ],
              },
              {
                  label: 'Reference',
                  items: [{ autogenerate: { directory: 'reference' } }],
              },
          ],
      }),
    //   tailwind(),
	],

  vite: {
    plugins: [tailwindcss()],
  },
  site: 'https://suqingji.github.io', 
  
  // 👇 填入你的 GitHub 仓库名 (注意前面必须有斜杠)
  // 如果你的仓库直接叫 你的用户名.github.io，这一行就不需要写！
  base: 'AI-Infra-Notebook', 
});