// ===== CONFIGURATION =====
const CONFIG = {
    typingDelay: 80,
    erasingDelay: 40,
    newTextDelay: 2000,
    scrollThreshold: 300,
    localStoragePrefix: 'portfolio_'
};

// ===== GOOGLE SHEETS CONFIGURATION =====
// IMPORTANT: Replace this URL with your Google Apps Script Web App URL
// After deploying your Google Apps Script, copy the URL and paste it here
const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycby7yNnyXk73w6Rgnhh5BQ0U4XOl05RbMtEQ8cGrh6n-u8zFq-_9pLVuCwLjD-HTtRk2/exec';

// ===== MOBILE MENU =====
class MobileMenu {
    constructor() {
        this.hamburger = document.querySelector('.hamburger');
        this.navMenu = document.querySelector('.nav-menu');
        this.isOpen = false;

        if (this.hamburger && this.navMenu) {
            this.init();
        }
    }

    init() {
        this.hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMenu();
        });

        this.navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });

        document.addEventListener('click', (e) => {
            if (this.isOpen && !this.navMenu.contains(e.target) && !this.hamburger.contains(e.target)) {
                this.closeMenu();
            }
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && this.isOpen) {
                this.closeMenu();
            }
        });
    }

    toggleMenu() {
        this.isOpen ? this.closeMenu() : this.openMenu();
    }

    openMenu() {
        this.isOpen = true;
        this.hamburger.classList.add('active');
        this.navMenu.classList.add('active');
        const icon = this.hamburger.querySelector('i');
        if (icon) icon.classList.replace('fa-bars', 'fa-times');
        document.body.style.overflow = 'hidden';
        document.body.classList.add('menu-open');
    }

    closeMenu() {
        this.isOpen = false;
        this.hamburger.classList.remove('active');
        this.navMenu.classList.remove('active');
        const icon = this.hamburger.querySelector('i');
        if (icon) icon.classList.replace('fa-times', 'fa-bars');
        document.body.style.overflow = '';
        document.body.classList.remove('menu-open');
    }
}

// ===== TYPING EFFECT =====
class TypingEffect {
    constructor() {
        this.element = document.querySelector('.typed-text');
        this.texts = [
            "Full Stack MERN Developer",
            "Spring Boot & Java Expert",
            "Responsive Web Engineer",
            "Database Management Specialist"
        ];
        this.currentIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;

        if (this.element) this.init();
    }

    init() {
        this.type();
    }

    type() {
        const currentText = this.texts[this.currentIndex];

        if (this.isDeleting) {
            this.element.textContent = currentText.substring(0, this.charIndex - 1);
            this.charIndex--;
        } else {
            this.element.textContent = currentText.substring(0, this.charIndex + 1);
            this.charIndex++;
        }

        if (!this.isDeleting && this.charIndex === currentText.length) {
            this.isDeleting = true;
            setTimeout(() => this.type(), CONFIG.newTextDelay);
            return;
        }

        if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.currentIndex = (this.currentIndex + 1) % this.texts.length;
            setTimeout(() => this.type(), CONFIG.typingDelay);
            return;
        }

        const delay = this.isDeleting ? CONFIG.erasingDelay : CONFIG.typingDelay;
        setTimeout(() => this.type(), delay);
    }
}

// ===== SCROLL MANAGER =====
class ScrollManager {
    constructor() {
        this.progressBar = null;
        this.backToTop = document.getElementById('backToTop');
        this.navbar = document.querySelector('.navbar');
        this.init();
    }

    init() {
        this.createProgressBar();
        this.setupEventListeners();
        this.updateActiveNavLink();
    }

    createProgressBar() {
        this.progressBar = document.createElement('div');
        this.progressBar.className = 'modern-progress';
        document.body.appendChild(this.progressBar);
    }

    setupEventListeners() {
        window.addEventListener('scroll', () => this.handleScroll(), { passive: true });

        if (this.backToTop) {
            this.backToTop.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
    }

    handleScroll() {
        const winScroll = document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;

        if (this.progressBar) {
            this.progressBar.style.width = scrolled + '%';
        }

        if (this.backToTop) {
            this.backToTop.style.display = winScroll > CONFIG.scrollThreshold ? 'flex' : 'none';
        }

        if (this.navbar) {
            this.navbar.classList.toggle('scrolled', winScroll > 50);
        }
    }

    updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-menu a');

        window.addEventListener('scroll', () => {
            let current = '';
            const scrollY = window.scrollY;

            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                const sectionBottom = sectionTop + section.offsetHeight;

                if (scrollY >= sectionTop && scrollY < sectionBottom) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    }
}

// ===== TABS MANAGER =====
class TabsManager {
    constructor() {
        this.tabBtns = document.querySelectorAll('.tab-btn');
        this.tabContents = document.querySelectorAll('.tab-content');
        if (this.tabBtns.length) this.init();
    }

    init() {
        this.tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabId = btn.getAttribute('data-tab');
                this.tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.tabContents.forEach(content => content.classList.remove('active'));
                const activeContent = document.getElementById(tabId);
                if (activeContent) activeContent.classList.add('active');
            });
        });
    }
}

// ===== STATS ANIMATION =====
class StatsAnimation {
    constructor() {
        this.statNumbers = document.querySelectorAll('.stat-number');
        this.animated = false;
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animated) {
                    this.animateStats();
                    this.animated = true;
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        const statsContainer = document.querySelector('.stats-container');
        if (statsContainer) observer.observe(statsContainer);
    }

    animateStats() {
        this.statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            let current = 0;
            const increment = target / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    stat.textContent = target;
                    clearInterval(timer);
                } else {
                    stat.textContent = Math.floor(current);
                }
            }, 20);
        });
    }
}

// ===== LOAD MORE PROJECTS =====
class LoadMoreProjects {
    constructor() {
        this.grid = document.getElementById('coding-projects-grid');
        this.loadMoreBtn = document.getElementById('load-more-btn');
        this.visibleCount = 3;

        if (this.grid && this.loadMoreBtn) {
            this.cards = Array.from(this.grid.querySelectorAll('.project-card'));
            this.init();
        }
    }

    init() {
        this.updateVisibility();
        this.loadMoreBtn.addEventListener('click', () => {
            this.visibleCount += 3;
            this.updateVisibility();
        });
    }

    updateVisibility() {
        this.cards.forEach((card, index) => {
            if (index < this.visibleCount) {
                card.style.display = 'block';
                setTimeout(() => card.classList.add('show'), 50);
            } else {
                card.style.display = 'none';
                card.classList.remove('show');
            }
        });
        if (this.visibleCount >= this.cards.length) {
            this.loadMoreBtn.style.display = 'none';
        }
    }
}

// ===== SKILLS ANIMATION =====
class SkillsAnimation {
    constructor() {
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const skillBars = entry.target.querySelectorAll('.skill-per');
                    skillBars.forEach(bar => {
                        const width = bar.style.width;
                        bar.style.width = '0';
                        setTimeout(() => {
                            bar.style.width = width;
                        }, 100);
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        document.querySelectorAll('.skill-category').forEach(category => {
            observer.observe(category);
        });
    }
}

// ===== CONTACT FORM WITH GOOGLE SHEETS =====
class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        if (this.form) {
            this.init();
        }
    }

    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    showMessage(message, type) {
        const existingMsg = document.querySelector('.form-message-modern');
        if (existingMsg) existingMsg.remove();

        const msgDiv = document.createElement('div');
        msgDiv.className = `form-message-modern ${type}`;
        msgDiv.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
            <button class="message-close" onclick="this.parentElement.remove()">&times;</button>
        `;

        if (!document.querySelector('#message-styles')) {
            const style = document.createElement('style');
            style.id = 'message-styles';
            style.textContent = `
                .form-message-modern {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 15px 20px;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    z-index: 10000;
                    animation: slideInRight 0.3s ease;
                    background: #1a1a1a;
                    border-left: 4px solid;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                }
                .form-message-modern.success { border-left-color: #00c853; color: #00c853; }
                .form-message-modern.error { border-left-color: #ff3b30; color: #ff3b30; }
                .form-message-modern .message-close {
                    background: none;
                    border: none;
                    color: inherit;
                    cursor: pointer;
                    font-size: 18px;
                    margin-left: 10px;
                }
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(msgDiv);

        setTimeout(() => {
            if (msgDiv && msgDiv.parentNode) msgDiv.remove();
        }, 5000);
    }

    async handleSubmit(e) {
        e.preventDefault();

        const name = document.getElementById('name')?.value.trim();
        const email = document.getElementById('email')?.value.trim();
        const subject = document.getElementById('subject')?.value.trim();
        const message = document.getElementById('message')?.value.trim();

        if (!name || !email || !message) {
            this.showMessage('Please fill in all required fields', 'error');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            this.showMessage('Please enter a valid email address', 'error');
            return;
        }

        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

        try {
            // Send to Google Sheets
            const formData = new URLSearchParams();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('subject', subject || 'Portfolio Contact');
            formData.append('message', message);
            formData.append('timestamp', new Date().toLocaleString());

            const response = await fetch(GOOGLE_SHEETS_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData.toString()
            });

            this.showMessage('✓ Message sent successfully! Data saved to Google Sheets.', 'success');
            this.form.reset();

        } catch (error) {
            console.error('Error:', error);
            this.showMessage('❌ Failed to send message. Please try again.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    }
}

// ===== PROJECT MODAL =====
class ProjectModal {
    constructor() {
        this.init();
        this.addModalStyles();
    }

    init() {
        document.querySelectorAll('.project-card .btn, .project-card .view-details-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const card = button.closest('.project-card');
                if (card) {
                    const title = card.querySelector('.project-title')?.textContent || 'Project';
                    const desc = card.querySelector('.project-desc')?.textContent || '';
                    const tags = Array.from(card.querySelectorAll('.tag')).map(t => t.textContent);
                    const image = card.querySelector('img')?.src || '';
                    const demoLink = button.href;

                    this.showModal(title, desc, tags, image, demoLink);
                }
            });
        });
    }

    showModal(title, description, tags, image, demoLink) {
        const modal = document.createElement('div');
        modal.className = 'glass-modal';
        modal.innerHTML = `
            <div class="modal-container">
              <button class="modal-close" aria-label="Close Modal">✕</button>
                ${image ? `<div class="modal-image"><img src="${image}" alt="${title}"></div>` : ''}
                <div class="modal-content">
                    <h2>${title}</h2>
                    <div class="modal-tags">${tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
                    <p>${description}</p>
                    <a href="${demoLink}" target="_blank" class="btn">View Live Demo</a>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';

        setTimeout(() => modal.classList.add('active'), 10);

        const closeModal = () => {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.remove();
                document.body.style.overflow = '';
            }, 300);
        };

        modal.querySelector('.modal-close').addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); }, { once: true });
    }

    addModalStyles() {
        //if (document.getElementById('modal-styles')) return;
        const style = document.createElement('style');
        style.id = 'modal-styles';
        style.textContent = `
            .glass-modal {
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(0,0,0,0.9); backdrop-filter: blur(10px);
                display: flex; align-items: center; justify-content: center;
                z-index: 2000; opacity: 0; transition: opacity 0.3s;
                padding: 20px;
            }
            .glass-modal.active { opacity: 1; }
            .modal-container {
                background: #1a1a1a; border-radius: 16px; max-width: 500px;
                width: 100%; position: relative; transform: scale(0.9);
                transition: transform 0.3s; overflow: hidden;
            }
            .glass-modal.active .modal-container { transform: scale(1); }
            .modal-close {
                position: absolute; top: 15px; right: 15px;
                background: rgba(255,255,255,0.1); border: none;
                width: 35px; height: 35px; border-radius: 50%;
                color: white; font-size: 20px; cursor: pointer;
            }
            .modal-image { height: 200px; overflow: hidden; }
            .modal-image img { width: 100%; height: 100%; object-fit: cover; }
            .modal-content { padding: 25px; }
            .modal-content h2 { margin-bottom: 15px; }
            .modal-tags { display: flex; flex-wrap: wrap; gap: 8px; margin: 15px 0; }
            .modal-content p { color: #aaa; margin-bottom: 20px; line-height: 1.6; }
        `;
        document.head.appendChild(style);
    }
}

// ===== SMOOTH SCROLL =====
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    e.preventDefault();
                    const offsetTop = target.offsetTop - 70;
                    window.scrollTo({ top: offsetTop, behavior: 'smooth' });

                    const navMenu = document.querySelector('.nav-menu');
                    if (navMenu && navMenu.classList.contains('active')) {
                        document.querySelector('.hamburger')?.click();
                    }
                }
            });
        });
    }
}

// ===== UPDATE FOOTER YEAR =====
function updateFooterYear() {
    const footer = document.querySelector('footer p');
    if (footer) {
        const year = new Date().getFullYear();
        footer.innerHTML = footer.innerHTML.replace(/\d{4}/g, year);
    }
}

// ===== INITIALIZE EVERYTHING =====
document.addEventListener('DOMContentLoaded', () => {
    new MobileMenu();
    new TypingEffect();
    new ScrollManager();
    new TabsManager();
    new StatsAnimation();
    new LoadMoreProjects();
    new SkillsAnimation();
    new ContactForm();
    new ProjectModal();
    new SmoothScroll();
    updateFooterYear();
});

// ===== GLOBAL STYLES =====
const globalStyles = document.createElement('style');
globalStyles.textContent = `
    ::selection { background: #8B8000; color: #000; }
    html { scroll-behavior: smooth; }
    ::-webkit-scrollbar { width: 8px; }
    ::-webkit-scrollbar-track { background: #101010; }
    ::-webkit-scrollbar-thumb { background: #8B8000; border-radius: 4px; }
    .project-card { display: none; }
    .project-card.show { display: block; animation: fadeInUp 0.5s ease; }
    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    .modern-progress {
        position: fixed; top: 0; left: 0; height: 3px;
        background: linear-gradient(90deg, #8B8000, #c4b500);
        z-index: 1002; transition: width 0.1s ease;
    }
`;
document.head.appendChild(globalStyles);