/**
 * Boss攻略页面专用JavaScript功能
 * =====================================
 */

document.addEventListener('DOMContentLoaded', function() {
    initTableOfContents();
    initReadingProgress();
    initBackToTop();
    initImageLazyLoading();
    initPrintOptimization();
    
    console.log('📖 Boss攻略页面功能已加载');
});

/**
 * 目录导航功能
 */
function initTableOfContents() {
    const tocLinks = document.querySelectorAll('.toc a');
    const sections = document.querySelectorAll('.guide-section');
    
    // 平滑滚动到对应章节
    tocLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                // 移除所有活跃状态
                tocLinks.forEach(l => l.classList.remove('active'));
                
                // 添加当前活跃状态
                this.classList.add('active');
                
                // 滚动到目标位置
                const offsetTop = targetSection.offsetTop - 100;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // 滚动时更新活跃状态
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '-100px 0px -50% 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                const correspondingLink = document.querySelector(`.toc a[href="#${id}"]`);
                
                if (correspondingLink) {
                    // 移除所有活跃状态
                    tocLinks.forEach(l => l.classList.remove('active'));
                    
                    // 添加当前活跃状态
                    correspondingLink.classList.add('active');
                }
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        observer.observe(section);
    });
}

/**
 * 阅读进度指示器
 */
function initReadingProgress() {
    // 创建进度条
    const progressContainer = document.createElement('div');
    progressContainer.className = 'reading-progress';
    
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress-bar';
    
    progressContainer.appendChild(progressBar);
    document.body.appendChild(progressContainer);
    
    // 更新进度
    function updateProgress() {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrollTop = window.pageYOffset;
        
        const progress = (scrollTop / documentHeight) * 100;
        progressBar.style.width = Math.min(progress, 100) + '%';
    }
    
    // 节流优化滚动性能
    let ticking = false;
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateProgress);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', function() {
        requestTick();
        ticking = false;
    });
    
    // 初始化进度
    updateProgress();
}

/**
 * 返回顶部按钮
 */
function initBackToTop() {
    // 创建返回顶部按钮
    const backToTopBtn = document.createElement('button');
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.innerHTML = '↑';
    backToTopBtn.title = '返回顶部';
    
    document.body.appendChild(backToTopBtn);
    
    // 显示/隐藏按钮
    function toggleBackToTop() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    }
    
    // 点击返回顶部
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // 滚动时检查是否显示按钮
    window.addEventListener('scroll', toggleBackToTop);
    
    // 初始检查
    toggleBackToTop();
}

/**
 * 图片懒加载
 */
function initImageLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => {
            img.classList.add('lazy');
            imageObserver.observe(img);
        });
    } else {
        // 降级处理：直接加载所有图片
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    }
}

/**
 * 魅力推荐交互
 */
function initCharmInteractions() {
    const charmItems = document.querySelectorAll('.charm-item');
    
    charmItems.forEach(item => {
        item.addEventListener('click', function() {
            const charmName = this.querySelector('span').textContent;
            showCharmDetails(charmName);
        });
        
        // 悬停效果
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.05)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
}

/**
 * 显示魅力详情
 */
function showCharmDetails(charmName) {
    // 这里可以实现魅力详情弹窗
    const modal = createModal(`
        <h3>${charmName}</h3>
        <p>这里显示魅力的详细信息...</p>
        <button onclick="closeModal()">关闭</button>
    `);
    
    document.body.appendChild(modal);
}

/**
 * 创建模态框
 */
function createModal(content) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeModal()"></div>
        <div class="modal-content">
            ${content}
        </div>
    `;
    
    // 模态框样式
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    return modal;
}

/**
 * 关闭模态框
 */
function closeModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.remove();
    }
}

/**
 * 攻击模式演示
 */
function initAttackPatternDemo() {
    const attackVisuals = document.querySelectorAll('.attack-visual img');
    
    attackVisuals.forEach(img => {
        img.addEventListener('click', function() {
            // 全屏显示攻击演示
            const fullscreenViewer = createImageViewer(this.src, this.alt);
            document.body.appendChild(fullscreenViewer);
        });
    });
}

/**
 * 创建图片查看器
 */
function createImageViewer(src, alt) {
    const viewer = document.createElement('div');
    viewer.className = 'image-viewer';
    viewer.innerHTML = `
        <div class="viewer-overlay" onclick="closeImageViewer()"></div>
        <div class="viewer-content">
            <img src="${src}" alt="${alt}">
            <button class="viewer-close" onclick="closeImageViewer()">×</button>
        </div>
    `;
    
    viewer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    return viewer;
}

/**
 * 关闭图片查看器
 */
function closeImageViewer() {
    const viewer = document.querySelector('.image-viewer');
    if (viewer) {
        viewer.remove();
    }
}

/**
 * 打印优化
 */
function initPrintOptimization() {
    // 检测打印事件
    window.addEventListener('beforeprint', function() {
        // 展开所有折叠内容
        const collapsedElements = document.querySelectorAll('.collapsed');
        collapsedElements.forEach(el => {
            el.classList.remove('collapsed');
        });
        
        // 移除懒加载状态，确保所有图片都显示
        const lazyImages = document.querySelectorAll('img.lazy');
        lazyImages.forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.classList.remove('lazy');
            }
        });
    });
}

/**
 * 键盘导航支持
 */
function initKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        // ESC 键关闭模态框
        if (e.key === 'Escape') {
            closeModal();
            closeImageViewer();
        }
        
        // 方向键导航目录
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            const activeLink = document.querySelector('.toc a.active');
            if (activeLink) {
                const allLinks = Array.from(document.querySelectorAll('.toc a'));
                const currentIndex = allLinks.indexOf(activeLink);
                
                let nextIndex;
                if (e.key === 'ArrowUp') {
                    nextIndex = currentIndex > 0 ? currentIndex - 1 : allLinks.length - 1;
                } else {
                    nextIndex = currentIndex < allLinks.length - 1 ? currentIndex + 1 : 0;
                }
                
                allLinks[nextIndex].click();
                e.preventDefault();
            }
        }
    });
}

/**
 * 分享功能
 */
function initShareFeatures() {
    const shareBtn = document.createElement('button');
    shareBtn.className = 'share-btn';
    shareBtn.innerHTML = '📤';
    shareBtn.title = '分享攻略';
    
    shareBtn.style.cssText = `
        position: fixed;
        bottom: 90px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: var(--accent-color);
        color: var(--text-dark);
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        transition: var(--transition);
        z-index: 1000;
    `;
    
    shareBtn.addEventListener('click', function() {
        if (navigator.share) {
            navigator.share({
                title: document.title,
                url: window.location.href
            });
        } else {
            // 降级处理：复制链接到剪贴板
            navigator.clipboard.writeText(window.location.href).then(() => {
                showNotification('链接已复制到剪贴板！', 'success');
            });
        }
    });
    
    document.body.appendChild(shareBtn);
}

/**
 * 收藏功能
 */
function initBookmarkFeature() {
    const bookmarkBtn = document.createElement('button');
    bookmarkBtn.className = 'bookmark-btn';
    bookmarkBtn.innerHTML = '⭐';
    bookmarkBtn.title = '收藏攻略';
    
    bookmarkBtn.style.cssText = `
        position: fixed;
        bottom: 150px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: var(--accent-color);
        color: var(--text-dark);
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        transition: var(--transition);
        z-index: 1000;
    `;
    
    // 检查是否已收藏
    const isBookmarked = localStorage.getItem(`bookmark_${window.location.pathname}`);
    if (isBookmarked) {
        bookmarkBtn.style.background = '#ff6b6b';
        bookmarkBtn.innerHTML = '❤️';
    }
    
    bookmarkBtn.addEventListener('click', function() {
        const currentPath = window.location.pathname;
        const isCurrentlyBookmarked = localStorage.getItem(`bookmark_${currentPath}`);
        
        if (isCurrentlyBookmarked) {
            // 取消收藏
            localStorage.removeItem(`bookmark_${currentPath}`);
            this.style.background = 'var(--accent-color)';
            this.innerHTML = '⭐';
            showNotification('已取消收藏', 'info');
        } else {
            // 添加收藏
            localStorage.setItem(`bookmark_${currentPath}`, JSON.stringify({
                title: document.title,
                url: window.location.href,
                timestamp: Date.now()
            }));
            this.style.background = '#ff6b6b';
            this.innerHTML = '❤️';
            showNotification('已添加到收藏', 'success');
        }
    });
    
    document.body.appendChild(bookmarkBtn);
}

// 页面加载完成后初始化所有功能
document.addEventListener('DOMContentLoaded', function() {
    initCharmInteractions();
    initAttackPatternDemo();
    initKeyboardNavigation();
    initShareFeatures();
    initBookmarkFeature();
});

// 导出函数供其他脚本使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        showCharmDetails,
        createModal,
        closeModal,
        createImageViewer,
        closeImageViewer
    };
}
