// ===== IP-TRACKER.JS - IP TRACKING SYSTEM =====

class IPTracker {
    constructor() {
        this.init();
    }
    
    init() {
        this.trackCurrentVisitor();
    }
    
    trackCurrentVisitor() {
        // Track visitor silently
        fetch('https://api.ipify.org?format=json')
            .then(response => response.json())
            .then(data => {
                this.saveVisitorIP(data.ip);
            })
            .catch(err => console.log('Tracking disabled'));
    }
    
    saveVisitorIP(ip) {
        const visitorIPs = JSON.parse(localStorage.getItem('esa_visitor_ips') || '[]');
        const ipData = {
            ip: ip,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent.substring(0, 50)
        };
        
        // Keep only last 100 IPs
        visitorIPs.push(ipData);
        if (visitorIPs.length > 100) {
            visitorIPs.shift();
        }
        
        localStorage.setItem('esa_visitor_ips', JSON.stringify(visitorIPs));
    }
}

// Initialize tracker
document.addEventListener('DOMContentLoaded', () => {
    window.ipTracker = new IPTracker();
});
