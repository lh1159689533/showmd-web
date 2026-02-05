<script lang="ts" setup>
import { ref, computed, onMounted, onBeforeUnmount, defineProps, watchEffect } from 'vue';
import storage from '@src/utils/storage';

const theme = ref('light');

const changeTheme = () => {
  const x = 0;
  const y = 0;
  const endRadius = Math.hypot(
    Math.max(x, innerWidth - x),
    Math.max(y, innerHeight - y)
  );
  let hasDark = false;
  const transition = (document as any).startViewTransition(() => {
    const root = document.documentElement;
    hasDark = root.classList.contains('dark');
    root.classList.remove(hasDark ? 'dark' : 'light');
    root.classList.add(hasDark ? 'light' : 'dark');
  });

  transition.ready.then(() => {
    const clipPath = [
      `circle(0px at ${innerWidth}px ${y}px)`,
      `circle(${endRadius}px at ${x}px ${innerHeight}px)`,
    ];
    document.documentElement.animate(
      {
        clipPath: clipPath,
      },
      {
        duration: 500,
        easing: 'ease-in',
        pseudoElement: '::view-transition-new(root)',
      }
    );
    theme.value = !hasDark ? 'dark' : 'light';
    storage.setItem('theme', theme.value);
  });
};

onMounted(() => {
  theme.value = storage.getItem('theme') ?? 'light';
  document.documentElement.classList.remove(document.documentElement.classList.item(0));
  document.documentElement.classList.add(theme.value);
});
</script>
<template>
  <span class="absolute top-3 right-6 text-sm cursor-pointer">
    <div class="theme-switcher">
      <div class="switch-container">
        <input type="checkbox" class="switch-input" id="themeSwitch" @click="changeTheme">
        <label for="themeSwitch" class="switch">
          <div class="switch-thumb">
            <div class="sun-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" fill="#fef3c7" stroke="#fcd34d"></path>
                <g class="sun-rays">
                  <path
                    d="M12 4v1M17.66 6.344l-.828.828M20.005 12.004h-1M17.66 17.664l-.828-.828M12 20.01V19M6.34 17.664l.835-.836M3.995 12.004h1.01M6 6l.835.836"
                    stroke="#fcd34d"></path>
                </g>
              </svg>
            </div>
            <svg class="moon-icon" viewBox="0 0 24 24" fill="none">
              <path fill-rule="evenodd" clip-rule="evenodd"
                d="M17.715 15.15A6.5 6.5 0 0 1 9 6.035C6.106 6.922 4 9.645 4 12.867c0 3.94 3.153 7.136 7.042 7.136 3.101 0 5.734-2.032 6.673-4.853Z"
                class="fill-gray-300/20"></path>
              <path
                d="m17.715 15.15.95.316a1 1 0 0 0-1.445-1.185l.495.869ZM9 6.035l.846.534a1 1 0 0 0-1.14-1.49L9 6.035Zm8.221 8.246a5.47 5.47 0 0 1-2.72.718v2a7.47 7.47 0 0 0 3.71-.98l-.99-1.738Zm-2.72.718A5.5 5.5 0 0 1 9 9.5H7a7.5 7.5 0 0 0 7.5 7.5v-2ZM9 9.5c0-1.079.31-2.082.845-2.93L8.153 5.5A7.47 7.47 0 0 0 7 9.5h2Zm-4 3.368C5 10.089 6.815 7.75 9.292 6.99L8.706 5.08C5.397 6.094 3 9.201 3 12.867h2Zm6.042 6.136C7.718 19.003 5 16.268 5 12.867H3c0 4.48 3.588 8.136 8.042 8.136v-2Zm5.725-4.17c-.81 2.433-3.074 4.17-5.725 4.17v2c3.552 0 6.553-2.327 7.622-5.537l-1.897-.632Z"
                class="fill-gray-300"></path>
              <path fill-rule="evenodd" clip-rule="evenodd"
                d="M17 3a1 1 0 0 1 1 1 2 2 0 0 0 2 2 1 1 0 1 1 0 2 2 2 0 0 0-2 2 1 1 0 1 1-2 0 2 2 0 0 0-2-2 1 1 0 1 1 0-2 2 2 0 0 0 2-2 1 1 0 0 1 1-1Z"
                class="fill-gray-300"></path>
            </svg>
          </div>
        </label>
      </div>
    </div>
  </span>
</template>
<style>
.switch-label {
  font-size: 1.2rem;
  font-weight: 500;
  margin-bottom: 15px;
  color: #666666;
}

.switch-container {
  position: relative;
  width: 60px;
  height: 30px;
  border-radius: 999px;
  background: var(--blue-light-1);
}

.switch-input {
  display: none;
}

.switch {
  position: relative;
  width: 100%;
  height: 100%;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.switch-thumb {
  position: absolute;
  left: 6px;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
  overflow: hidden;
}

.switch-input:checked~.switch .switch-thumb {
  transform: translateX(30px);
}

.sun-icon,
.moon-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 1;
  transition: opacity 0.3s,
    transform 0.3s;
}

.sun-icon {
  width: 28px;
  height: 28px;
}

.moon-icon {
  width: 24px;
  height: 24px;
}

.switch-input:checked~.switch .sun-icon {
  opacity: 0;
  transform: translate(-50%, -50%) rotate(90deg);
}

.switch-input~.switch .moon-icon {
  opacity: 0;
  transform: translate(-50%, -50%) rotate(-90deg);
}

.switch-input:checked~.switch .moon-icon {
  opacity: 1;
  transform: translate(-50%, -50%) rotate(0deg);
}

.content {
  background-color: #f0f0f0;
  border-radius: 16px;
  padding: 30px;
  width: 100%;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
}

.section {
  margin-bottom: 30px;
}

.section h2 {
  color: #333333;
  margin-bottom: 15px;
  font-size: 1.8rem;
}

.section p {
  color: #666666;
  line-height: 1.6;
  margin-bottom: 15px;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
}

.card {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.card h3 {
  margin-bottom: 10px;
  color: #333333;
}

.card p {
  color: #666666;
  font-size: 0.95rem;
}

.button {
  background-color: #333333;
  color: #ffffff;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  margin-top: 10px;
  transition: opacity 0.3s;
}

.button:hover {
  opacity: 0.85;
}

@media (max-width: 600px) {
  .cards {
    grid-template-columns: 1fr;
  }

  h1 {
    font-size: 2rem;
  }
}
</style>