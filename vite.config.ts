import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { viteMockServe } from 'vite-plugin-mock'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // viteMockServe({
    //   mockPath:'mock',
    //   // 加上下面这个提示不影响功能执行，继续往下走
    //   // @ts-ignore
    //   localEnabled:true,
    //   enabled:true
    // })
  ],
  server:{
      proxy:{
          '/api':{
              target:'http://localhost:8080',
              changeOrigin:true,
              rewrite:(path)=>path.replace(/^\/api/,'')
          }
      }
  },
  resolve:{

    alias:{
      '@': path.resolve(__dirname,'src')
    }

  }
})
