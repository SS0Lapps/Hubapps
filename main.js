// ===== MAIN.JS - HUB FUNCTIONALITY =====

class ESAHub {
    constructor() {
        this.projects = [];
        this.init();
    }
    
    init() {
        this.loadProjects();
        this.setupEventListeners();
        this.renderProjects();
        this.trackVisitor();
    }
    
    loadProjects() {
        const saved = localStorage.getItem('esa_projects');
        this.projects = saved ? JSON.parse(saved) : [];
    }
    
    saveProjects() {
        localStorage.setItem('esa_projects', JSON.stringify(this.projects));
    }
    
    addProject(project) {
        this.projects.push({
            id: Date.now(),
            ...project
        });
        this.saveProjects();
        this.renderProjects();
    }
    
    renderProjects() {
        const container = document.getElementById('projectsContainer');
        if (!container) return;
        
        if (this.projects.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📁</div>
                    <h3>لا توجد مشاريع حالياً</h3>
                    <p>سيتم إضافة المشاريع قريباً</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = this.projects.map(project => `
            <div class="project-card">
                <div class="project-icon">${project.icon}</div>
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <a href="${project.url}" target="_blank" class="project-link">
                    زيارة المشروع
                </a>
            </div>
        `).join('');
    }
    
    setupEventListeners() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }
    
    trackVisitor() {
        const visitors = JSON.parse(localStorage.getItem('esa_visitors') || '[]');
        const visitorData = {
            timestamp: new Date().toLocaleString('ar-SA'),
            userAgent: navigator.userAgent
        };
        visitors.push(visitorData);
        localStorage.setItem('esa_visitors', JSON.stringify(visitors));
    }
}

// Initialize Hub
document.addEventListener('DOMContentLoaded', () => {
    window.hub = new ESAHub();
});

// Add project helper
function addProjectToHub(title, description, url, icon = '🚀') {
    if (window.hub) {
        window.hub.addProject({
            title,
            description,
            url,
            icon
        });
    }
}
