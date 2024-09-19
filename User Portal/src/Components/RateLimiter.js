class RateLimiter {
    constructor(limit, interval) {
      this.limit = limit; // Maximum allowed actions
      this.interval = interval; // Time interval (in milliseconds)
      this.count = 0; // Current count of actions
      this.lastReset = parseInt(localStorage.getItem('rateLimiterLastReset')) || Date.now(); // Timestamp of last reset or current time if not set
    }
  
    checkLimit() {
      const now = Date.now();
      if (now - this.lastReset >= this.interval) {
        // If the interval has passed, reset the count
        this.count = 0;
        this.lastReset = now;
        localStorage.setItem('rateLimiterLastReset', this.lastReset); // Store the last reset time in local storage
      }
      return this.count < this.limit;
    }
  
    incrementCount() {
      this.count++;
    }
  }
  
  export default RateLimiter;
  