/* ═══════════════════════════════════════════════════════════════════════════
   PERFORMANCE CONFIGURATION — Ajeet Kumar Portfolio
   Manages all performance optimizations and animation control
   ═══════════════════════════════════════════════════════════════════════════ */

const PerformanceConfig = {
  // Animation control flags
  animationsEnabled: true,
  activeAnimations: new Set(),
  observerMap: new Map(),
  
  // Lazy load configuration
  lazyLoadThreshold: '200px',
  
  // Resize debounce
  resizeDebounceMs: 250,
  resizeTimeout: null,
  
  // Chart.js pooling
  chartInstances: new Map(),
  maxChartInstances: 3,
  
  // localStorage batching
  localStorageBatch: {},
  batchSaveDelay: 1000,
  batchSaveTimeout: null,
  
  // Section visibility state
  sectionVisibility: new Map(),
  
  /**
   * Initialize performance monitoring
   */
  init() {
    this.setupResizeDebounce();
    this.setupVisibilityTracking();
    this.setupPerformanceMarks();
    console.log('✓ PerformanceConfig initialized');
  },
  
  /**
   * Setup debounced resize handler
   */
  setupResizeDebounce() {
    window.addEventListener('resize', () => {
      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = setTimeout(() => {
        // Broadcast resize to all active animation modules
        this.activeAnimations.forEach(moduleKey => {
          const evt = new CustomEvent('optimized-resize', { detail: { moduleKey } });
          window.dispatchEvent(evt);
        });
      }, this.resizeDebounceMs);
    }, { passive: true });
  },
  
  /**
   * Track which sections are visible
   */
  setupVisibilityTracking() {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const sectionId = entry.target.id;
        this.sectionVisibility.set(sectionId, entry.isIntersecting);
        
        if (entry.isIntersecting) {
          // Lazy-load Three.js if needed
          if (entry.target.querySelector('[data-theme]')) {
            this.lazyLoadThreeJS();
          }
        }
      });
    }, { threshold: 0.1 });
    
    // Observe all sections
    document.querySelectorAll('section').forEach(sec => observer.observe(sec));
  },
  
  /**
   * Lazy load Three.js only when needed
   */
  lazyLoadThreeJS() {
    if (window.THREE || document.querySelector('script[src*="three.js"]')) return;
    
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    script.async = true;
    script.onload = () => {
      // Trigger bg3d initialization
      const initEvent = new Event('three-loaded');
      window.dispatchEvent(initEvent);
    };
    document.head.appendChild(script);
  },
  
  /**
   * Performance marks for monitoring
   */
  setupPerformanceMarks() {
    if ('PerformanceMark' in window && window.performance) {
      window.performance.mark('portfolio-init-start');
      window.addEventListener('load', () => {
        window.performance.mark('portfolio-init-end');
        window.performance.measure('portfolio-init', 'portfolio-init-start', 'portfolio-init-end');
        const measure = window.performance.getEntriesByName('portfolio-init')[0];
        if (measure.duration > 3000) {
          console.warn(`⚠ Slow initial load: ${measure.duration.toFixed(0)}ms`);
        }
      });
    }
  },
  
  /**
   * Register animation module for control
   */
  registerAnimation(moduleKey, startFn, stopFn) {
    this.activeAnimations.add(moduleKey);
    this.observerMap.set(moduleKey, { start: startFn, stop: stopFn });
  },
  
  /**
   * Stop animation when section goes off-screen
   */
  pauseAnimationForSection(sectionId) {
    const isVisible = this.sectionVisibility.get(sectionId);
    this.observerMap.forEach((handlers, key) => {
      if (key.includes(sectionId)) {
        if (!isVisible && handlers.stop) handlers.stop();
        else if (isVisible && handlers.start) handlers.start();
      }
    });
  },
  
  /**
   * Batch localStorage writes
   */
  batchSetLocalStorage(key, value) {
    this.localStorageBatch[key] = value;
    
    clearTimeout(this.batchSaveTimeout);
    this.batchSaveTimeout = setTimeout(() => {
      Object.entries(this.localStorageBatch).forEach(([k, v]) => {
        try {
          localStorage.setItem(k, JSON.stringify(v));
        } catch (e) {
          console.error('LocalStorage write failed:', e);
        }
      });
      this.localStorageBatch = {};
    }, this.batchSaveDelay);
  },
  
  /**
   * Get Chart.js instance or create from pool
   */
  getChartInstance(canvasId) {
    if (!this.chartInstances.has(canvasId)) {
      this.chartInstances.set(canvasId, null);
    }
    return this.chartInstances.get(canvasId);
  },
  
  /**
   * Store Chart.js instance for reuse
   */
  setChartInstance(canvasId, instance) {
    if (this.chartInstances.size >= this.maxChartInstances) {
      // Destroy oldest
      const firstKey = this.chartInstances.keys().next().value;
      const oldChart = this.chartInstances.get(firstKey);
      if (oldChart && oldChart.destroy) oldChart.destroy();
      this.chartInstances.delete(firstKey);
    }
    this.chartInstances.set(canvasId, instance);
  },
  
  /**
   * Get current FPS (for debugging)
   */
  getFPS() {
    let lastTime = Date.now();
    let frames = 0;
    return () => {
      frames++;
      const now = Date.now();
      if (now >= lastTime + 1000) {
        console.log(`FPS: ${frames}`);
        frames = 0;
        lastTime = now;
      }
    };
  },
};

// Initialize on DOM ready
if (document.readyState !== 'loading') {
  PerformanceConfig.init();
} else {
  document.addEventListener('DOMContentLoaded', () => PerformanceConfig.init());
}
