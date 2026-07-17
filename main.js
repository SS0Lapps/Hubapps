/* ============================================
   ESAHUB - Main JavaScript
   ============================================ */

// Default Projects Data
const defaultProjects = [
    {
        id: 1,
        name: 'تطبيق إدارة المشاريع',
        description: 'تطبيق ويب متقدم لإدارة المشاريع والمهام بسهولة',
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop',
        link: '#'
    },
    {
        id: 2,
        name: 'منصة التعليم الإلكتروني',
        description: 'منصة تعليمية شاملة مع دورات تفاعلية وشهادات',
        image: 'https://images.unsplash.com/photo-1516321318423-f06f70d504f0?w=500&h=300&fit=crop',
        link: '#'
    },
    {
        id: 3,
        name: 'متجر إلكتروني متقدم',
        description: 'متجر إلكتروني كامل مع نظام دفع وإدارة مخزون',
        image: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=500&h=300&fit=crop',
        link: '#'
    },
    {
        id: 4,
        name: 'تطبيق الشبكة الاجتماعية',
        description: 'شبكة اجتماعية حديثة مع ميزات تفاعلية متقدمة',
        image: 'https://images.unsplash.com/photo-1553531088-189a6eaa0c3f?w=500&h=300&fit=crop',
        link: '#'
    },
    {
        id: 5,
        name: 'نظام إدارة المحتوى',
        description: 'نظام CMS قوي وسهل الاستخدام لإدارة المحتوى',
        image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&h=300&fit=crop',
        link: '#'
    },
    {
        id: 6,
        name: 'تطبيق تحليل البيانات',
        description: 'أداة تحليل بيانات متقدمة مع تقارير شاملة',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=300&fit=crop',
        link: '#'
    }
];

// Initialize on Page Load
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Esahub Website Loaded');
    
    // Load projects
    loadProjects();
    
    // Setup event listeners
    setupEventListeners();
    
    // Load saved data from storage
    loadSavedData();
    
    // Initialize tracker
    initializeTracker();
});

// Load Projects
function loadProjects() {
    const projectsGrid = document.getElementById('projectsGrid');
    const projects = getStorageData('projects') || defaultProjects;
    
    projectsGrid.innerHTML = '';
    
    projects.forEach((project, index) => {
        const projectCard = createProjectCard(project);
        projectCard.classList.add('stagger-item');
        projectCard.style.animationDelay = `${index * 0.1}s`;
        projectsGrid.appendChild(projectCard);
    });
    
    // Update project count in stats
    updateStats();
}

// Create Project Card
function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.innerHTML = `
        <img src="${project.image}" alt="${project.name}" class="project-image" onerror="this.src='https://via.placeholder.com/500x300?text=Project'">
        <div class="project-content">
            <h3>${project.name}</h3>
            <p>${project.description}</p>
            <a href="${project.link}" class="project-link">اعرف أكثر →</a>
        </div>
    `;
    return card;
}

// Setup Event Listeners
function setupEventListeners() {
    // Hamburger Menu
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // Close menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // Developer Mode Keyboard Shortcut (Ctrl+Shift+D)
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.shiftKey && e.key === 'D') {
            e.preventDefault();
            toggleDevMode();
        }
    });
    
    // Developer Mode Panel Controls
    const closeDevModeBtn = document.getElementById('closeDevMode');
    if (closeDevModeBtn) {
        closeDevModeBtn.addEventListener('click', toggleDevMode);
    }
    
    // Tab switching in Developer Mode
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            switchTab(this.dataset.tab);
        });
    });
    
    // Footer secret click
    document.querySelector('.footer-secret')?.addEventListener('click', toggleDevMode);
}

// Toggle Developer Mode
function toggleDevMode() {
    const panel = document.getElementById('devModePanel');
    panel.classList.toggle('active');
    
    if (panel.classList.contains('active')) {
        console.log('🔧 Developer Mode Activated');
        loadVisitorData();
    }
}

// Switch Tabs in Developer Mode
function switchTab(tabName) {
    // Remove active class from all tabs and contents
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    // Add active class to clicked tab
    event.target.classList.add('active');
    document.getElementById(`${tabName}-tab`).classList.add('active');
}

// Load Visitor Data
async function loadVisitorData() {
    try {
        // Get IP Address
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        document.getElementById('visitorIP').textContent = ipData.ip;
        
        // Get Geolocation Data
        const geoResponse = await fetch(`https://ipapi.co/${ipData.ip}/json/`);
        const geoData = await geoResponse.json();
        
        document.getElementById('visitorCountry').textContent = geoData.country_name || 'Unknown';
        document.getElementById('visitorCity').textContent = geoData.city || 'Unknown';
        document.getElementById('visitorISP').textContent = geoData.org || 'Unknown';
        
        // Get Browser Info
        const browserInfo = getBrowserInfo();
        document.getElementById('visitorBrowser').textContent = browserInfo;
        
        // Save visitor data
        saveVisitorData({
            ip: ipData.ip,
            country: geoData.country_name,
            city: geoData.city,
            isp: geoData.org,
            browser: browserInfo,
            timestamp: new Date().toLocaleString('ar-SA')
        });
        
        // Load visitor log
        loadVisitorLog();
        
    } catch (error) {
        console.error('Error loading visitor data:', error);
        document.getElementById('visitorIP').textContent = 'Error loading data';
    }
}

// Get Browser Information
function getBrowserInfo() {
    const ua = navigator.userAgent;
    let browser = 'Unknown';
    
    if (ua.indexOf('Firefox') > -1) browser = 'Firefox';
    else if (ua.indexOf('Chrome') > -1) browser = 'Chrome';
    else if (ua.indexOf('Safari') > -1) browser = 'Safari';
    else if (ua.indexOf('Edge') > -1) browser = 'Edge';
    else if (ua.indexOf('Opera') > -1) browser = 'Opera';
    
    const os = ua.indexOf('Windows') > -1 ? 'Windows' : 
               ua.indexOf('Mac') > -1 ? 'Mac' : 
               ua.indexOf('Linux') > -1 ? 'Linux' : 
               ua.indexOf('Android') > -1 ? 'Android' : 
               ua.indexOf('iPhone') > -1 ? 'iOS' : 'Unknown';
    
    return `${browser} on ${os}`;
}

// Save Visitor Data
function saveVisitorData(data) {
    const visitors = getStorageData('visitors') || [];
    visitors.push(data);
    setStorageData('visitors', visitors);
    updateStats();
}

// Load Visitor Log
function loadVisitorLog() {
    const visitors = getStorageData('visitors') || [];
    const log = document.getElementById('visitorsLog');
    
    log.innerHTML = '';
    
    // Show last 10 visitors
    visitors.slice(-10).reverse().forEach(visitor => {
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        entry.innerHTML = `
            <strong>${visitor.country}</strong> - ${visitor.city}<br>
            IP: ${visitor.ip} | ${visitor.browser}<br>
            <small>${visitor.timestamp}</small>
        `;
        log.appendChild(entry);
    });
}

// Update Statistics
function updateStats() {
    const visitors = getStorageData('visitors') || [];
    const projects = getStorageData('projects') || defaultProjects;
    
    document.getElementById('totalVisitors').textContent = visitors.length;
    
    // Today's visitors
    const today = new Date().toLocaleDateString('ar-SA');
    const todayVisitors = visitors.filter(v => v.timestamp.includes(today)).length;
    document.getElementById('todayVisitors').textContent = todayVisitors;
    
    // Top country
    if (visitors.length > 0) {
        const countries = {};
        visitors.forEach(v => {
            countries[v.country] = (countries[v.country] || 0) + 1;
        });
        const topCountry = Object.keys(countries).reduce((a, b) => 
            countries[a] > countries[b] ? a : b
        );
        document.getElementById('topCountry').textContent = topCountry;
    }
    
    document.getElementById('projectCount').textContent = projects.length;
}

// Load Saved Data
function loadSavedData() {
    const siteTitle = getStorageData('siteTitle');
    if (siteTitle) {
        document.querySelector('.hero-title').textContent = siteTitle;
    }
}

// Update Site Title
function updateSiteTitle() {
    const input = document.getElementById('siteTitle');
    const newTitle = input.value.trim();
    
    if (newTitle) {
        document.querySelector('.hero-title').textContent = newTitle;
        setStorageData('siteTitle', newTitle);
        input.value = '';
        showNotification('تم تحديث العنوان بنجاح!');
    }
}

// Add New Project
function addNewProject() {
    const name = document.getElementById('projectName').value.trim();
    const desc = document.getElementById('projectDesc').value.trim();
    const image = document.getElementById('projectImage').value.trim();
    
    if (name && desc) {
        const projects = getStorageData('projects') || defaultProjects;
        const newProject = {
            id: projects.length + 1,
            name: name,
            description: desc,
            image: image || 'https://via.placeholder.com/500x300?text=Project',
            link: '#'
        };
        
        projects.push(newProject);
        setStorageData('projects', projects);
        
        // Clear inputs
        document.getElementById('projectName').value = '';
        document.getElementById('projectDesc').value = '';
        document.getElementById('projectImage').value = '';
        
        // Reload projects
        loadProjects();
        showNotification('تم إضافة المشروع بنجاح!');
    }
}

// Inject Custom Code
function injectCustomCode() {
    const code = document.getElementById('customCode').value.trim();
    
    if (code) {
        try {
            // Create and execute script
            const script = document.createElement('script');
            script.textContent = code;
            document.body.appendChild(script);
            
            // Save code
            const customCodes = getStorageData('customCodes') || [];
            customCodes.push({
                code: code,
                timestamp: new Date().toLocaleString('ar-SA')
            });
            setStorageData('customCodes', customCodes);
            
            document.getElementById('customCode').value = '';
            showNotification('تم تشغيل الكود بنجاح!');
        } catch (error) {
            showNotification('خطأ في الكود: ' + error.message, 'error');
        }
    }
}

// Show Notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#22c55e' : '#ef4444'};
        color: white;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 10001;
        animation: slideInRight 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideInLeft 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

console.log('✅ Main JavaScript Loaded Successfully');
