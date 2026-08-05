# 拾光 · 照片优化

一个基于 Vue 3 的浏览器端照片选择、预览与压缩组件示例。照片在本地完成方向纠正、尺寸收敛和体积优化，不会发送到服务器。

## 能力

- 支持相册选择、移动端拍照入口和桌面拖放。
- 支持 JPG、PNG、WebP，单文件最大 15 MB。
- 自动处理 EXIF 方向，最长边收敛至 2560 px，目标大小 1.5 MB。
- 默认移除 EXIF 元数据，减少隐私泄露与无效体积。
- 提供处理中、成功、失败、重选和清除状态。
- 保留组件的 `v-model` 与 `upload` 事件语义，并提供优化后的 `File` 和尺寸信息。
- 响应式布局，支持键盘操作、屏幕阅读器状态播报和减少动态效果偏好。

## 技术栈

- Vue 3.5 + Composition API + TypeScript
- Vite 8
- browser-image-compression
- Vitest + Vue Test Utils
- ESLint flat config + Prettier

需要 Node.js `^20.19.0` 或 `>=22.12.0`，包管理器使用 npm 10。

## 开发

```bash
npm install
npm run dev
```

常用命令：

```bash
npm run typecheck
npm run lint
npm run test
npm run format:check
```

仓库保留了 `npm run build` 脚本供发布流程使用。本项目的代理协作指令明确要求不执行前端构建校验，因此日常变更验证使用上面的类型、lint、测试和格式检查。

## 组件用法

```vue
<script setup lang="ts">
import { shallowRef } from 'vue'
import Photograph from './components/photo/Photograph.vue'
import type { PhotoResult } from './types/photo'

const photo = shallowRef('')

function handleUpload(dataUrl: string, result: PhotoResult) {
  // dataUrl 可直接用于预览；result.file 可交给业务上传。
  console.info(dataUrl, result.file, result.details)
}
</script>

<template>
  <Photograph v-model="photo" @upload="handleUpload" />
</template>
```

### 对外契约

- `v-model`: 优化后的 Data URL；清除时更新为空字符串。
- `upload(dataUrl, result)`: 处理完成后触发。`result.file` 为优化后的文件，`result.details` 包含文件名、原始/优化后体积、输出尺寸和 MIME 类型。
- `clear`: 用户移除当前照片时触发。

## 处理边界

此项目只负责客户端照片处理，不包含后端存储或上传接口。压缩 Worker 使用随应用发布的本地依赖脚本，不访问第三方 CDN。若接入严格的 Content Security Policy，需要允许应用自身脚本与 `blob:` Worker。
