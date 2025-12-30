/**
 * Hollow Knight 攻略站 - 主要JavaScript功能
 * ==========================================
 */

// DOM 内容加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    
    // 初始化所有功能
    initNavigation();
    initScrollEffects();
    initCardInteractions();
    initSmoothScroll();
    initMobileMenu();
    
    console.log('🎮 Hollow Knight 攻略站已成功加载！');
});

/**
 * 导航栏功能初始化
 */
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // 滚动时导航栏效果
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(26, 26, 26, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
        } else {
            navbar.style.background = 'rgba(26, 26, 26, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });
    
    // 导航链接活跃状态
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // 移除所有活跃状态
            navLinks.forEach(l => l.classList.remove('active'));

            // 添加当前活跃状态
            this.classList.add('active');

            // 只处理页面内锚点链接（以#开头）
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(href);

                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
            // 其他链接（如 pages/xxx）让它们正常跳转
        });
    });
}

/**
 * 滚动效果初始化
 */
function initScrollEffects() {
    // 创建交叉观察器
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // 观察所有需要动画的元素
    const animatedElements = document.querySelectorAll('.nav-card, .guide-card, .stat-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

/**
 * 卡片交互效果
 */
function initCardInteractions() {
    const navCards = document.querySelectorAll('.nav-card');
    const guideCards = document.querySelectorAll('.guide-card');
    
    // 快速导航卡片点击
    navCards.forEach(card => {
        card.addEventListener('click', function() {
            const section = this.getAttribute('data-section');
            const targetElement = document.getElementById(section);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
            
            // 添加点击动画
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
        
        // 鼠标悬停效果
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
    
    // 攻略卡片点击效果
    guideCards.forEach(card => {
        card.addEventListener('click', function() {
            // 这里可以添加跳转到具体攻略页面的逻辑
            const guideTitle = this.querySelector('h3').textContent;
            showNotification(`正在加载：${guideTitle}`);
        });
    });
}

/**
 * 平滑滚动初始化
 */
function initSmoothScroll() {
    // 为所有内部链接添加平滑滚动
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // 考虑固定导航栏高度
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * 移动端菜单功能
 */
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (!hamburger || !navMenu) return;
    
    // 汉堡菜单点击事件
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // 防止背景滚动
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    // 菜单项点击后关闭菜单
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // 点击菜单外部关闭菜单
    document.addEventListener('click', function(e) {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

/**
 * 显示通知消息
 * @param {string} message - 要显示的消息
 * @param {string} type - 消息类型 ('success', 'error', 'info')
 */
function showNotification(message, type = 'info') {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // 添加样式
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--accent-color);
        color: var(--text-dark);
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        font-weight: 500;
        max-width: 300px;
    `;
    
    // 添加到页面
    document.body.appendChild(notification);
    
    // 显示动画
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // 自动隐藏
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

/**
 * 搜索功能（为未来扩展预留）
 */
function initSearch() {
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    
    if (!searchInput) return;
    
    let searchTimeout;
    
    searchInput.addEventListener('input', function() {
        const query = this.value.trim();
        
        clearTimeout(searchTimeout);
        
        if (query.length < 2) {
            hideSearchResults();
            return;
        }
        
        searchTimeout = setTimeout(() => {
            performSearch(query);
        }, 300);
    });
    
    function performSearch(query) {
        // 这里可以实现搜索逻辑
        // 可以搜索Boss名称、魅力名称、区域名称等
        console.log('搜索:', query);
        
        // 示例搜索结果
        const mockResults = [
            { title: '骨钉大师', type: 'Boss', url: '#bosses' },
            { title: '快速治疗', type: '魅力', url: '#charms' },
            { title: '忘却十字路', type: '区域', url: '#map' }
        ].filter(item => 
            item.title.toLowerCase().includes(query.toLowerCase())
        );
        
        showSearchResults(mockResults);
    }
    
    function showSearchResults(results) {
        if (!searchResults) return;
        
        searchResults.innerHTML = results.map(result => `
            <div class="search-result-item" data-url="${result.url}">
                <span class="result-title">${result.title}</span>
                <span class="result-type">${result.type}</span>
            </div>
        `).join('');
        
        searchResults.style.display = 'block';
        
        // 添加点击事件
        searchResults.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', function() {
                const url = this.getAttribute('data-url');
                document.querySelector(url)?.scrollIntoView({ behavior: 'smooth' });
                hideSearchResults();
            });
        });
    }
    
    function hideSearchResults() {
        if (searchResults) {
            searchResults.style.display = 'none';
        }
    }
}

/**
 * 性能优化 - 防抖函数
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * 性能优化 - 节流函数
 */
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// 监听窗口大小变化，优化响应式布局
window.addEventListener('resize', debounce(function() {
    // 重新计算布局
    const navMenu = document.querySelector('.nav-menu');
    const hamburger = document.querySelector('.hamburger');
    
    if (window.innerWidth > 768) {
        navMenu?.classList.remove('active');
        hamburger?.classList.remove('active');
        document.body.style.overflow = '';
    }
}, 250));

// 优化滚动性能
window.addEventListener('scroll', throttle(function() {
    // 可以在这里添加滚动相关的性能优化代码
}, 16)); // 约60fps

/**
 * 错误处理
 */
window.addEventListener('error', function(e) {
    console.error('JavaScript错误:', e.error);
    // 可以在这里添加错误上报逻辑
});

// 页面离开前的清理工作
window.addEventListener('beforeunload', function() {
    // 清理定时器、事件监听器等
});

export { showNotification, debounce, throttle };
