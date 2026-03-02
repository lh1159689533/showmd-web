/**
 * 🎨 现代化主题管理器
 * 参考 Hashnode 等现代网站的主题切换最佳实践
 */

import { ref, computed, onMounted, onUnmounted } from 'vue';

export type ThemeMode = 'light' | 'dark' | 'auto';
export type ThemePreference = 'light' | 'dark';

export interface ThemeConfig {
  mode: ThemeMode;
  preference?: ThemePreference;
  followSystem: boolean;
  transitions: boolean;
}

export interface ThemeChangeEvent {
  theme: ThemePreference;
  mode: ThemeMode;
  isSystemPreference: boolean;
}

class ThemeManager {
  private static instance: ThemeManager;
  private currentTheme: ThemePreference = 'light';
  private currentMode: ThemeMode = 'auto';
  private followSystem = true;
  private mediaQuery: MediaQueryList | null = null;
  private listeners: Set<(event: ThemeChangeEvent) => void> = new Set();
  
  // 🎯 存储键名
  private readonly STORAGE_KEY = 'showmd-theme-config';
  private readonly LEGACY_KEY = 'theme'; // 兼容旧版本
  
  constructor() {
    this.initializeTheme();
    this.setupSystemListener();
  }
  
  // 🏭 单例模式
  static getInstance(): ThemeManager {
    if (!ThemeManager.instance) {
      ThemeManager.instance = new ThemeManager();
    }
    return ThemeManager.instance;
  }
  
  // 🚀 初始化主题
  private initializeTheme(): void {
    const config = this.loadConfig();
    this.currentMode = config.mode;
    this.followSystem = config.followSystem;
    
    // 🎯 确定实际主题
    if (config.mode === 'auto') {
      this.currentTheme = this.getSystemPreference();
    } else {
      this.currentTheme = config.preference || config.mode as ThemePreference;
    }
    
    this.applyTheme(this.currentTheme);
  }
  
  // 🎧 设置系统主题监听
  private setupSystemListener(): void {
    if (typeof window !== 'undefined' && window.matchMedia) {
      this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      this.mediaQuery.addEventListener('change', this.handleSystemThemeChange.bind(this));
    }
  }
  
  // 🔄 处理系统主题变化
  private handleSystemThemeChange(event: MediaQueryListEvent): void {
    if (this.followSystem && this.currentMode === 'auto') {
      const newTheme = event.matches ? 'dark' : 'light';
      this.currentTheme = newTheme;
      this.applyTheme(newTheme);
      this.notifyListeners({
        theme: newTheme,
        mode: this.currentMode,
        isSystemPreference: true
      });
    }
  }
  
  // 🎨 应用主题到 DOM
  private applyTheme(theme: ThemePreference): void {
    if (typeof document === 'undefined') return;
    
    const root = document.documentElement;
    const oppositeTheme = theme === 'dark' ? 'light' : 'dark';
    
    // 🎪 使用 View Transition API（如果支持）
    if ('startViewTransition' in document && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      (document as any).startViewTransition(() => {
        root.classList.remove(oppositeTheme);
        root.classList.add(theme);
      });
    } else {
      root.classList.remove(oppositeTheme);
      root.classList.add(theme);
    }
    
    // 🎯 更新 meta 标签（移动端状态栏）
    this.updateMetaThemeColor(theme);
    
    // 📱 更新 favicon（可选）
    this.updateFavicon(theme);
  }
  
  // 🎨 更新 meta 主题色
  private updateMetaThemeColor(theme: ThemePreference): void {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    const color = theme === 'dark' ? '#18181b' : '#ffffff';
    
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', color);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'theme-color';
      meta.content = color;
      document.head.appendChild(meta);
    }
  }
  
  // 🎭 更新 favicon
  private updateFavicon(theme: ThemePreference): void {
    const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
    if (favicon) {
      const currentHref = favicon.href;
      if (theme === 'dark' && !currentHref.includes('-dark')) {
        favicon.href = currentHref.replace('.ico', '-dark.ico').replace('.png', '-dark.png');
      } else if (theme === 'light' && currentHref.includes('-dark')) {
        favicon.href = currentHref.replace('-dark.ico', '.ico').replace('-dark.png', '.png');
      }
    }
  }
  
  // 📱 获取系统主题偏好
  private getSystemPreference(): ThemePreference {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  }
  
  // 💾 加载配置
  private loadConfig(): ThemeConfig {
    try {
      // 🔄 优先使用新配置格式
      const configStr = localStorage.getItem(this.STORAGE_KEY);
      if (configStr) {
        const config = JSON.parse(configStr) as ThemeConfig;
        return {
          mode: config.mode || 'auto',
          preference: config.preference,
          followSystem: config.followSystem !== false,
          transitions: config.transitions !== false
        };
      }
      
      // 🔄 兼容旧版本配置
      const legacyTheme = localStorage.getItem(this.LEGACY_KEY) as ThemePreference;
      if (legacyTheme && ['light', 'dark'].includes(legacyTheme)) {
        return {
          mode: legacyTheme,
          preference: legacyTheme,
          followSystem: false,
          transitions: true
        };
      }
    } catch (error) {
      console.warn('Failed to load theme config:', error);
    }
    
    // 🎯 默认配置
    return {
      mode: 'auto',
      followSystem: true,
      transitions: true
    };
  }
  
  // 💾 保存配置
  private saveConfig(config: ThemeConfig): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(config));
      // 🔄 保持向后兼容
      localStorage.setItem(this.LEGACY_KEY, config.preference || config.mode as string);
    } catch (error) {
      console.warn('Failed to save theme config:', error);
    }
  }
  
  // 🔄 切换主题
  public toggle(): ThemePreference {
    const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
    return newTheme;
  }
  
  // 🎯 设置特定主题
  public setTheme(theme: ThemePreference): void {
    this.currentTheme = theme;
    this.currentMode = theme;
    this.followSystem = false;
    
    this.applyTheme(theme);
    this.saveConfig({
      mode: theme,
      preference: theme,
      followSystem: false,
      transitions: true
    });
    
    this.notifyListeners({
      theme,
      mode: theme,
      isSystemPreference: false
    });
  }
  
  // 🎯 设置模式（包括 auto）
  public setMode(mode: ThemeMode): void {
    this.currentMode = mode;
    
    if (mode === 'auto') {
      this.followSystem = true;
      this.currentTheme = this.getSystemPreference();
    } else {
      this.followSystem = false;
      this.currentTheme = mode as ThemePreference;
    }
    
    this.applyTheme(this.currentTheme);
    this.saveConfig({
      mode,
      preference: mode === 'auto' ? undefined : mode as ThemePreference,
      followSystem: mode === 'auto',
      transitions: true
    });
    
    this.notifyListeners({
      theme: this.currentTheme,
      mode,
      isSystemPreference: mode === 'auto'
    });
  }
  
  // 🎧 添加主题变化监听器
  public addListener(callback: (event: ThemeChangeEvent) => void): () => void {
    this.listeners.add(callback);
    
    // 🔄 返回取消监听的函数
    return () => {
      this.listeners.delete(callback);
    };
  }
  
  // 📢 通知监听器
  private notifyListeners(event: ThemeChangeEvent): void {
    this.listeners.forEach(callback => {
      try {
        callback(event);
      } catch (error) {
        console.warn('Theme listener error:', error);
      }
    });
  }
  
  // 📊 获取当前状态
  public getCurrentTheme(): ThemePreference {
    return this.currentTheme;
  }
  
  public getCurrentMode(): ThemeMode {
    return this.currentMode;
  }
  
  public isFollowingSystem(): boolean {
    return this.followSystem;
  }
  
  public isDark(): boolean {
    return this.currentTheme === 'dark';
  }
  
  public isLight(): boolean {
    return this.currentTheme === 'light';
  }
  
  // 🧹 清理资源
  public destroy(): void {
    if (this.mediaQuery) {
      this.mediaQuery.removeEventListener('change', this.handleSystemThemeChange.bind(this));
    }
    this.listeners.clear();
  }
}

// 🎁 导出单例实例
export const themeManager = ThemeManager.getInstance();

// 🎯 便捷函数
export const toggleTheme = () => themeManager.toggle();
export const setTheme = (theme: ThemePreference) => themeManager.setTheme(theme);
export const setThemeMode = (mode: ThemeMode) => themeManager.setMode(mode);
export const getCurrentTheme = () => themeManager.getCurrentTheme();
export const isDarkTheme = () => themeManager.isDark();
export const isLightTheme = () => themeManager.isLight();
export const addThemeListener = (callback: (event: ThemeChangeEvent) => void) => 
  themeManager.addListener(callback);

// 🎪 Vue 3 Composition API 支持
export function useTheme() {
  
  const currentTheme = ref(themeManager.getCurrentTheme());
  const currentMode = ref(themeManager.getCurrentMode());
  const isFollowingSystem = ref(themeManager.isFollowingSystem());
  
  const isDark = computed(() => currentTheme.value === 'dark');
  const isLight = computed(() => currentTheme.value === 'light');
  
  let unsubscribe: (() => void) | null = null;
  
  onMounted(() => {
    // 🎧 监听主题变化
    unsubscribe = themeManager.addListener((event) => {
      currentTheme.value = event.theme;
      currentMode.value = event.mode;
      isFollowingSystem.value = event.isSystemPreference;
    });
  });
  
  onUnmounted(() => {
    if (unsubscribe) {
      unsubscribe();
    }
  });
  
  return {
    // 🎯 状态
    currentTheme,
    currentMode,
    isFollowingSystem,
    isDark,
    isLight,
    
    // 🔄 方法
    toggle: () => themeManager.toggle(),
    setTheme: (theme: ThemePreference) => themeManager.setTheme(theme),
    setMode: (mode: ThemeMode) => themeManager.setMode(mode),
  };
}

export default themeManager;