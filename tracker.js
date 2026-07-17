/* ============================================
   ESAHUB - Visitor Tracker
   ============================================ */

/**
 * Initialize tracker
 */
function initializeTracker() {
    // Track page view
    trackPageView();
    
    // Track user interactions
    trackInteractions();
    
    // Track time on page
    trackTimeOnPage();
    
    console.log('✅ Tracker initialized');
}

/**
 * Track page view
 */
function trackPageView() {
    const pageView = {
        page: window.location.pathname,
        referrer: document.referrer,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        language: navigator.language,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
    
    // Save page view
    const pageViews = getStorageData('pageViews') || [];
    pageViews.push(pageView);
    setStorageData('pageViews', pageViews);
    
    console.log('📊 Page view tracked:', pageView);
}

/**
 * Track user interactions
 */
function trackInteractions() {
    // Track clicks
    document.addEventListener('click', function(e) {
        const target = e.target;
        
        if (target.tagName === 'A' || target.tagName === 'BUTTON') {
            trackEvent('click', {
                element: target.tagName,
                text: target.textContent.substring(0, 50),
                href: target.href || target.id,
                class: target.className
            });
        }
    });
    
    // Track form submissions
    document.addEventListener('submit', function(e) {
        trackEvent('form_submit', {
            formId: e.target.id,
            formName: e.target.name,
            timestamp: new Date().toISOString()
        });
    });
    
    // Track scroll
    let lastScrollTime = 0;
    window.addEventListener('scroll', function() {
        const now = Date.now();
        if (now - lastScrollTime > 1000) {
            trackEvent('scroll', {
                scrollY: window.scrollY,
                scrollPercentage: (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
            });
            lastScrollTime = now;
        }
    });
    
    // Track mouse movement (sampled)
    let mouseTrackCount = 0;
    document.addEventListener('mousemove', function(e) {
        mouseTrackCount++;
        if (mouseTrackCount % 100 === 0) {
            trackEvent('mouse_move', {
                x: e.clientX,
                y: e.clientY
            });
        }
    });
}

/**
 * Track time on page
 */
function trackTimeOnPage() {
    const startTime = Date.now();
    
    window.addEventListener('beforeunload', function() {
        const timeOnPage = (Date.now() - startTime) / 1000; // in seconds
        
        trackEvent('page_exit', {
            timeOnPage: timeOnPage,
            timestamp: new Date().toISOString()
        });
    });
}

/**
 * Track custom event
 * @param {string} eventName - Event name
 * @param {object} data - Event data
 */
function trackEvent(eventName, data = {}) {
    const event = {
        name: eventName,
        data: data,
        timestamp: new Date().toISOString(),
        url: window.location.href
    };
    
    // Save event
    const events = getStorageData('events') || [];
    events.push(event);
    setStorageData('events', events);
    
    console.log('📍 Event tracked:', eventName, data);
}

/**
 * Get all tracked events
 * @returns {array} List of events
 */
function getTrackedEvents() {
    return getStorageData('events') || [];
}

/**
 * Get page views
 * @returns {array} List of page views
 */
function getPageViews() {
    return getStorageData('pageViews') || [];
}

/**
 * Get analytics summary
 * @returns {object} Analytics data
 */
function getAnalyticsSummary() {
    const events = getTrackedEvents();
    const pageViews = getPageViews();
    
    const summary = {
        totalEvents: events.length,
        totalPageViews: pageViews.length,
        clicks: events.filter(e => e.name === 'click').length,
        scrolls: events.filter(e => e.name === 'scroll').length,
        formSubmissions: events.filter(e => e.name === 'form_submit').length,
        averageTimeOnPage: calculateAverageTimeOnPage(),
        topPages: getTopPages(),
        topLinks: getTopLinks(),
        deviceInfo: getDeviceInfo()
    };
    
    return summary;
}

/**
 * Calculate average time on page
 * @returns {number} Average time in seconds
 */
function calculateAverageTimeOnPage() {
    const events = getTrackedEvents();
    const pageExits = events.filter(e => e.name === 'page_exit');
    
    if (pageExits.length === 0) return 0;
    
    const totalTime = pageExits.reduce((sum, e) => sum + (e.data.timeOnPage || 0), 0);
    return (totalTime / pageExits.length).toFixed(2);
}

/**
 * Get top visited pages
 * @returns {array} Top pages
 */
function getTopPages() {
    const pageViews = getPageViews();
    const pages = {};
    
    pageViews.forEach(pv => {
        pages[pv.page] = (pages[pv.page] || 0) + 1;
    });
    
    return Object.entries(pages)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([page, count]) => ({ page, count }));
}

/**
 * Get top clicked links
 * @returns {array} Top links
 */
function getTopLinks() {
    const events = getTrackedEvents();
    const clicks = events.filter(e => e.name === 'click');
    const links = {};
    
    clicks.forEach(click => {
        const href = click.data.href || 'unknown';
        links[href] = (links[href] || 0) + 1;
    });
    
    return Object.entries(links)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([link, count]) => ({ link, count }));
}

/**
 * Get device information
 * @returns {object} Device info
 */
function getDeviceInfo() {
    const pageViews = getPageViews();
    
    if (pageViews.length === 0) return {};
    
    const latestPageView = pageViews[pageViews.length - 1];
    
    return {
        userAgent: latestPageView.userAgent,
        language: latestPageView.language,
        screenResolution: latestPageView.screenResolution,
        timezone: latestPageView.timezone,
        isMobile: /Mobile|Android|iPhone/i.test(latestPageView.userAgent)
    };
}

/**
 * Export analytics data
 * @returns {object} Analytics data
 */
function exportAnalytics() {
    return {
        summary: getAnalyticsSummary(),
        events: getTrackedEvents(),
        pageViews: getPageViews(),
        exportDate: new Date().toISOString()
    };
}

/**
 * Clear all tracking data
 */
function clearTrackingData() {
    removeStorageData('events');
    removeStorageData('pageViews');
    console.log('✅ Tracking data cleared');
}

/**
 * Get heatmap data (simplified)
 * @returns {array} Heatmap data
 */
function getHeatmapData() {
    const events = getTrackedEvents();
    const mouseMoves = events.filter(e => e.name === 'mouse_move');
    
    return mouseMoves.map(e => ({
        x: e.data.x,
        y: e.data.y,
        timestamp: e.timestamp
    }));
}

/**
 * Generate analytics report
 * @returns {string} HTML report
 */
function generateAnalyticsReport() {
    const summary = getAnalyticsSummary();
    
    let report = '<h2>Analytics Report</h2>';
    report += `<p>Total Events: ${summary.totalEvents}</p>`;
    report += `<p>Total Page Views: ${summary.totalPageViews}</p>`;
    report += `<p>Clicks: ${summary.clicks}</p>`;
    report += `<p>Average Time on Page: ${summary.averageTimeOnPage}s</p>`;
    report += '<h3>Top Pages</h3><ul>';
    
    summary.topPages.forEach(page => {
        report += `<li>${page.page}: ${page.count} views</li>`;
    });
    
    report += '</ul>';
    
    return report;
}

console.log('✅ Tracker Loaded');
