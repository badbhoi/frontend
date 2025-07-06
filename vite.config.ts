// import { defineConfig } from 'vite'

// import tailwindcss from '@tailwindcss/vite'

// export default defineConfig({
//   plugins: [
//     tailwindcss(),
//   ],
// })


import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  build: {
   
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === 'TS_ERROR') return
        warn(warning)
      }
    }
  }
})