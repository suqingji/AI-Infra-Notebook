// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import tailwindcss from '@tailwindcss/vite';
// import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  site: 'https://suqingji.github.io', 
  base: 'AI-Infra-Notebook', 
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

});