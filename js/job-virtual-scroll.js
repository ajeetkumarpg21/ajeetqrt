/* ═══════════════════════════════════════════════════════════════════════════
   VIRTUAL SCROLLING FOR JOB LIST — Render only visible items
   Dramatically improves performance for large lists
   ═══════════════════════════════════════════════════════════════════════════ */

const JobVirtualScroll = {
  itemHeight: 120,
  containerHeight: null,
  visibleCount: 0,
  allJobs: [],
  
  /**
   * Initialize virtual scrolling
   */
  init(containerId, jobs) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    this.allJobs = jobs;
    this.containerHeight = container.clientHeight;
    this.visibleCount = Math.ceil(this.containerHeight / this.itemHeight) + 2;
    
    // Create virtual scroller wrapper
    const wrapper = document.createElement('div');
    wrapper.style.cssText = `
      position: relative;
      height: ${jobs.length * this.itemHeight}px;
    `;
    
    const viewport = document.createElement('div');
    viewport.style.cssText = `
      position: fixed;
      overflow-y: auto;
      height: 100%;
      width: 100%;
    `;
    
    let scrollTop = 0;
    viewport.addEventListener('scroll', () => {
      scrollTop = viewport.scrollTop;
      this.render(container, scrollTop);
    }, { passive: true });
    
    container.appendChild(wrapper);
    this.render(container, 0);
  },
  
  /**
   * Render only visible items
   */
  render(container, scrollTop) {
    const startIdx = Math.floor(scrollTop / this.itemHeight);
    const endIdx = Math.min(startIdx + this.visibleCount, this.allJobs.length);
    
    // Clear existing items
    container.innerHTML = '';
    
    // Add visible items with offset
    for (let i = startIdx; i < endIdx; i++) {
      const job = this.allJobs[i];
      const item = this.createJobElement(job);
      item.style.transform = `translateY(${i * this.itemHeight}px)`;
      item.style.position = 'absolute';
      item.style.width = '100%';
      container.appendChild(item);
    }
  },
  
  /**
   * Create job card element
   */
  createJobElement(job) {
    const div = document.createElement('div');
    div.className = 'job-card';
    div.innerHTML = `
      <div>
        <div class="job-title">${job.title}</div>
        <div class="job-company">${job.company}</div>
        <div class="job-tags">${job.tags.map(t => `<span class="tag tag-cyan">${t}</span>`).join('')}</div>
      </div>
      <div class="job-right">
        <div class="job-match ${job.matchClass}">${job.match}% Match</div>
        <div class="job-location"><i class="fas fa-map-marker-alt"></i> ${job.location} · ${job.type}</div>
      </div>
    `;
    return div;
  },
};
