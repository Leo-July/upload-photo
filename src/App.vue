<script setup lang="ts">
import { shallowRef } from 'vue'
import Photograph from './components/photo/Photograph.vue'

const photoDataUrl = shallowRef('')
const completionMessage = shallowRef('')

function handleUpload(): void {
  completionMessage.value = '照片已完成本地优化，可以继续交给你的业务流程。'
}

function handleClear(): void {
  completionMessage.value = ''
}
</script>

<template>
  <div class="app-shell">
    <a class="skip-link" href="#photo-workspace">跳到照片处理区</a>

    <header class="site-header">
      <a class="brand" href="./" aria-label="拾光首页">
        <svg class="brand__mark" viewBox="0 0 40 40" aria-hidden="true">
          <circle cx="20" cy="20" r="12" />
          <circle cx="20" cy="20" r="4.5" />
          <path d="M20 3v8M20 29v8M3 20h8M29 20h8M8 8l6 6M26 26l6 6M32 8l-6 6M14 26l-6 6" />
        </svg>
        <span>拾光</span>
      </a>
      <p class="site-header__note">浏览器本地处理</p>
    </header>

    <main class="main-layout">
      <section class="intro" aria-labelledby="page-title">
        <p class="intro__index" aria-hidden="true">01 / 01</p>
        <h1 id="page-title" class="intro__title">让每一张照片，<br />都轻盈抵达</h1>
        <p class="intro__description">
          选择或拍摄一张照片。拾光会在你的设备上自动调整方向、尺寸与体积，不会把原图发送到服务器。
        </p>

        <ol class="intro__steps" aria-label="照片处理步骤">
          <li><span>选择</span>从相册选取或直接拍摄</li>
          <li><span>优化</span>自动压缩并清理 EXIF 信息</li>
          <li><span>完成</span>获取可用于后续上传的照片</li>
        </ol>
      </section>

      <section id="photo-workspace" class="workspace" aria-labelledby="workspace-title">
        <div class="workspace__heading">
          <div>
            <p class="workspace__label">照片工作台</p>
            <h2 id="workspace-title">准备你的照片</h2>
          </div>
          <svg class="workspace__corner" viewBox="0 0 64 64" aria-hidden="true">
            <path d="M8 56 56 8M27 8h29v29" />
          </svg>
        </div>

        <Photograph v-model="photoDataUrl" @upload="handleUpload" @clear="handleClear" />

        <p class="sr-only" aria-live="polite">{{ completionMessage }}</p>
      </section>
    </main>

    <footer class="site-footer">
      <p>你的照片，只属于你的设备。</p>
      <p>Vue 3 · Local image processing</p>
    </footer>
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100svh;
  display: flex;
  flex-direction: column;
}

.skip-link {
  position: fixed;
  inset-block-start: var(--space-3);
  inset-inline-start: var(--space-3);
  z-index: 20;
  padding: 0.75rem 1rem;
  color: var(--color-white);
  background: var(--color-ink);
  border-radius: var(--radius-sm);
  transform: translateY(-160%);
}

.skip-link:focus {
  transform: translateY(0);
}

.site-header {
  width: min(100% - 2rem, var(--content-width));
  min-height: 5.5rem;
  margin-inline: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-block-end: 1px solid var(--color-border);
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: var(--space-3);
  min-height: 2.75rem;
  color: var(--color-ink);
  font-size: 1.15rem;
  font-weight: 750;
  letter-spacing: 0.12em;
}

.brand__mark {
  width: 2rem;
  height: 2rem;
  fill: none;
  stroke: var(--color-primary);
  stroke-width: 2.25;
  stroke-linecap: round;
}

.site-header__note {
  color: var(--color-muted);
  font-size: 0.8125rem;
  letter-spacing: 0.08em;
}

.main-layout {
  width: min(100% - 2rem, var(--content-width));
  margin: auto;
  padding-block: clamp(3rem, 7vw, 7rem);
  display: grid;
  gap: clamp(3rem, 7vw, 7.5rem);
}

.intro {
  align-self: center;
}

.intro__index,
.workspace__label {
  margin: 0 0 var(--space-6);
  color: var(--color-primary);
  font-size: 0.75rem;
  font-weight: 750;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.intro__title {
  max-width: 10em;
  margin: 0;
  color: var(--color-ink);
  font-size: clamp(2.5rem, 5vw, 4.75rem);
  font-weight: 680;
  letter-spacing: -0.055em;
  line-height: 1.08;
}

.intro__description {
  max-width: 34rem;
  margin: var(--space-8) 0 0;
  color: var(--color-body);
  font-size: 1rem;
  line-height: 1.85;
}

.intro__steps {
  max-width: 34rem;
  margin: var(--space-10) 0 0;
  padding: 0;
  list-style: none;
  border-block-start: 1px solid var(--color-border);
}

.intro__steps li {
  display: grid;
  grid-template-columns: 4.25rem 1fr;
  gap: var(--space-3);
  padding-block: var(--space-4);
  color: var(--color-muted);
  font-size: 0.875rem;
  line-height: 1.6;
  border-block-end: 1px solid var(--color-border);
}

.intro__steps span {
  color: var(--color-ink);
  font-weight: 700;
}

.workspace {
  min-width: 0;
  padding: clamp(1.25rem, 4vw, 2rem);
  background: var(--color-white);
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
}

.workspace__heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-4);
  margin-block-end: var(--space-6);
}

.workspace__heading h2 {
  margin: 0;
  color: var(--color-ink);
  font-size: clamp(1.375rem, 3vw, 1.75rem);
  line-height: 1.25;
}

.workspace__label {
  margin-block-end: var(--space-2);
}

.workspace__corner {
  width: 2.25rem;
  flex: 0 0 auto;
  fill: none;
  stroke: var(--color-border-strong);
  stroke-width: 1.5;
}

.site-footer {
  width: min(100% - 2rem, var(--content-width));
  margin-inline: auto;
  padding-block: var(--space-5);
  display: flex;
  justify-content: space-between;
  gap: var(--space-4);
  color: var(--color-muted);
  font-size: 0.75rem;
  border-block-start: 1px solid var(--color-border);
}

.site-footer p {
  margin: 0;
}

@media (min-width: 62rem) {
  .main-layout {
    grid-template-columns: minmax(0, 0.85fr) minmax(32rem, 1.15fr);
    align-items: center;
  }
}

@media (max-width: 39.9375rem) {
  .site-header {
    min-height: 4.75rem;
  }

  .site-header__note {
    max-width: 5rem;
    text-align: end;
    line-height: 1.4;
  }

  .main-layout {
    padding-block: var(--space-10);
  }

  .intro__description {
    line-height: 1.7;
  }

  .intro__steps {
    margin-block-start: var(--space-8);
  }

  .site-footer {
    flex-direction: column;
  }
}
</style>
