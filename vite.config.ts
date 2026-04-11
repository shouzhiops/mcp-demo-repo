import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths";
import { traeBadgePlugin } from 'vite-plugin-trae-solo-badge';

export default defineConfig(({ command }) => {
  const enableDevLocator = command === 'serve'

  return {
    build: {
      sourcemap: false,
      minify: 'esbuild',
      reportCompressedSize: false,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes('node_modules')) return
            const [, rest] = id.split('node_modules/')
            if (!rest) return 'vendor'
            const parts = rest.split('/')
            const pkgName = parts[0]?.startsWith('@') ? `${parts[0]}/${parts[1]}` : parts[0]
            if (!pkgName) return 'vendor'
            if (pkgName === 'antd' || pkgName.startsWith('@ant-design/') || pkgName.startsWith('rc-')) return 'antd'
            if (pkgName === 'leaflet' || pkgName === 'react-leaflet') return 'leaflet'
            if (pkgName === 'echarts' || pkgName === 'echarts-for-react') return 'echarts'
            if (pkgName === 'react' || pkgName === 'react-dom' || pkgName === 'scheduler') return 'react'
            return `vendor-${pkgName.replace('@', '').replace('/', '-')}`
          }
        }
      },
    },
    plugins: [
      react(enableDevLocator ? {
        babel: {
          plugins: [
            'react-dev-locator',
          ],
        },
      } : {}),
      traeBadgePlugin({
        variant: 'dark',
        position: 'bottom-right',
        prodOnly: true,
        clickable: true,
        clickUrl: 'https://www.trae.ai/solo?showJoin=1',
        autoTheme: true,
        autoThemeTarget: '#root'
      }), 
      tsconfigPaths()
    ],
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
        }
      }
    }
  }
})
