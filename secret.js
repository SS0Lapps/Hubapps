// ===== SECRET.JS - SECRET CODE PROTECTION =====

const SECRET_CODE = 'ESA2026DEV';
let secretAttempts = 0;
const MAX_ATTEMPTS = 3;
let secretLocked = false;

// Developer Mode activation
document.addEventListener('keydown', (e) => {
    // Ctrl+Shift+D to activate developer mode
    if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        if (secretLocked) {
            alert('Developer Mode مقفل. حاول لاحقاً.');
            return;
        }
        promptSecretCode();
    }
});

function promptSecretCode() {
    const code = prompt('أدخل Secret Code:');
    if (code === null) return;
    
    if (code === SECRET_CODE) {
        secretAttempts = 0;
        openSecretPanel();
    } else {
        secretAttempts++;
        if (secretAttempts >= MAX_ATTEMPTS) {
            secretLocked = true;
            alert('تم قفل Developer Mode. حاول بعد 5 دقائق.');
            setTimeout(() => {
                secretLocked = false;
                secretAttempts = 0;
            }, 5 * 60 * 1000);
        } else {
            alert(`كود خاطئ. محاولات متبقية: ${MAX_ATTEMPTS - secretAttempts}`);
        }
    }
}

function openSecretPanel() {
    const panel = document.getElementById('secretPanel');
    if (panel) {
        panel.classList.remove('hidden');
        loadVisitorData();
    }
}

function closeSecretPanel() {
    const panel = document.getElementById('secretPanel');
    if (panel) {
        panel.classList.add('hidden');
    }
}

function loadVisitorData() {
    // Get current visitor IP
    fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(data => {
            document.getElementById('ipAddress').textContent = data.ip;
            
            // Get IP details
            fetch(`https://ipapi.co/${data.ip}/json/`)
                .then(response => response.json())
                .then(details => {
                    document.getElementById('country').textContent = details.country_name || 'Unknown';
                    document.getElementById('city').textContent = details.city || 'Unknown';
                    document.getElementById('isp').textContent = details.org || 'Unknown';
                })
                .catch(() => {
                    document.getElementById('country').textContent = 'Error';
                    document.getElementById('city').textContent = 'Error';
                    document.getElementById('isp').textContent = 'Error';
                });
        })
        .catch(() => {
            document.getElementById('ipAddress').textContent = 'Error fetching IP';
        });
    
    // Load visitors list
    const visitors = JSON.parse(localStorage.getItem('esa_visitors') || '[]');
    const visitorsList = document.getElementById('visitorsList');
    if (visitorsList) {
        visitorsList.innerHTML = visitors.slice(-20).reverse().map((v, i) => `
            <div class="visitor-item">
                <strong>#${visitors.length - i}</strong> - 
                <span>${v.timestamp}</span>
            </div>
        `).join('');
    }
}

// Close panel when clicking outside
document.addEventListener('click', (e) => {
    const panel = document.getElementById('secretPanel');
    const content = document.querySelector('.secret-content');
    if (panel && !panel.classList.contains('hidden') && e.target === panel) {
        closeSecretPanel();
    }
});
