/* ═══════════════════════════════════════════════════════════════════════════
   API HANDLER — Server-side relay for external API calls
   Protects API keys and optimizes network requests
   ═══════════════════════════════════════════════════════════════════════════ */

const APIHandler = {
  // Request cache to prevent duplicate API calls
  cache: new Map(),
  cacheTTL: 5 * 60 * 1000, // 5 minutes
  
  /**
   * Call AI chat via server (not client)
   * Server stores actual API key securely
   */
  async callAIChat(message, context) {
    // Create cache key
    const cacheKey = `ai_${context}_${message}`;
    
    // Check cache
    if (this.cache.has(cacheKey)) {
      const { data, timestamp } = this.cache.get(cacheKey);
      if (Date.now() - timestamp < this.cacheTTL) {
        return data;
      }
    }
    
    try {
      // Call to YOUR server endpoint (not external API directly)
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, context }),
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Cache the result
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now(),
      });
      
      // Clean old cache entries
      this.cleanCache();
      
      return data;
    } catch (error) {
      console.error('AI Chat error:', error);
      return { error: 'Unable to process request' };
    }
  },
  
  /**
   * Get job listings (could be from server or cached)
   */
  async getJobListings(filters = {}) {
    const cacheKey = `jobs_${JSON.stringify(filters)}`;
    
    if (this.cache.has(cacheKey)) {
      const { data, timestamp } = this.cache.get(cacheKey);
      if (Date.now() - timestamp < this.cacheTTL) {
        return data;
      }
    }
    
    try {
      const queryString = new URLSearchParams(filters).toString();
      const response = await fetch(`/api/jobs?${queryString}`);
      
      if (!response.ok) throw new Error('Failed to fetch jobs');
      
      const data = await response.json();
      this.cache.set(cacheKey, { data, timestamp: Date.now() });
      this.cleanCache();
      
      return data;
    } catch (error) {
      console.error('Jobs fetch error:', error);
      return { jobs: [] };
    }
  },
  
  /**
   * Submit contact form via server
   */
  async submitContactForm(formData) {
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) throw new Error('Form submission failed');
      
      return await response.json();
    } catch (error) {
      console.error('Contact form error:', error);
      return { success: false, error: error.message };
    }
  },
  
  /**
   * Clean expired cache entries
   */
  cleanCache() {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > this.cacheTTL) {
        this.cache.delete(key);
      }
    }
  },
  
  /**
   * Clear all cache
   */
  clearCache() {
    this.cache.clear();
  },
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = APIHandler;
}
