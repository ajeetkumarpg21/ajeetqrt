/* ═══════════════════════════════════════════════════════════════════════════
   CHART.JS POOLING — Reuse Chart instances to reduce memory overhead
   ═══════════════════════════════════════════════════════════════════════════ */

const ChartPool = {
  instances: new Map(),
  configs: new Map(),
  maxInstances: 3,
  
  /**
   * Create or reuse a Chart instance
   */
  getChart(canvasId, config) {
    // Return existing chart if available
    if (this.instances.has(canvasId)) {
      const existing = this.instances.get(canvasId);
      // Update data only (faster than destroying and recreating)
      if (config.data) {
        existing.data = config.data;
        existing.update('none'); // Update without animation
      }
      return existing;
    }
    
    // Clean up old charts if pool is full
    if (this.instances.size >= this.maxInstances) {
      const firstKey = this.instances.keys().next().value;
      const oldChart = this.instances.get(firstKey);
      if (oldChart && oldChart.destroy) oldChart.destroy();
      this.instances.delete(firstKey);
    }
    
    // Create new chart
    const canvas = document.getElementById(canvasId);
    if (!canvas) return null;
    
    let ctx;
    try {
      ctx = canvas.getContext('2d');
    } catch (e) {
      console.warn(`Cannot create context for ${canvasId}`);
      return null;
    }
    
    // Check if Chart.js is available
    if (typeof Chart === 'undefined') {
      console.warn('Chart.js not loaded');
      return null;
    }
    
    const chart = new Chart(ctx, config);
    this.instances.set(canvasId, chart);
    this.configs.set(canvasId, config);
    
    return chart;
  },
  
  /**
   * Update chart data without recreating
   */
  updateChart(canvasId, newData) {
    const chart = this.instances.get(canvasId);
    if (!chart) return false;
    
    chart.data.labels = newData.labels || chart.data.labels;
    if (newData.datasets) {
      chart.data.datasets = newData.datasets;
    }
    chart.update('none');
    return true;
  },
  
  /**
   * Destroy specific chart
   */
  destroyChart(canvasId) {
    const chart = this.instances.get(canvasId);
    if (chart) {
      chart.destroy();
      this.instances.delete(canvasId);
      this.configs.delete(canvasId);
    }
  },
  
  /**
   * Clear all charts
   */
  clearAll() {
    this.instances.forEach(chart => {
      if (chart.destroy) chart.destroy();
    });
    this.instances.clear();
    this.configs.clear();
  },
  
  /**
   * Get current pool size
   */
  getPoolSize() {
    return this.instances.size;
  },
};

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ChartPool;
}
