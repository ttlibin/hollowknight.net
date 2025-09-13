/**
 * Boss列表页面JavaScript功能
 * ============================
 */

// Boss数据（从JSON文件加载）
let bossData = [];
let filteredBosses = [];
let currentPage = 1;
const itemsPerPage = 9;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    loadBossData();
    initializeSearchAndFilter();
    initializeLoadMore();
    
    console.log('📋 Boss列表页面已加载');
});

/**
 * 加载Boss数据
 */
async function loadBossData() {
    try {
        // 尝试从JSON文件加载数据
        const response = await fetch('../../data/bosses.json');
        if (response.ok) {
            const data = await response.json();
            bossData = data.bosses;
        } else {
            // 如果文件不存在，使用内置数据
            bossData = getDefaultBossData();
        }
        
        filteredBosses = [...bossData];
        renderBossList();
        updateStatistics();
        
    } catch (error) {
        console.log('使用内置Boss数据');
        bossData = getDefaultBossData();
        filteredBosses = [...bossData];
        renderBossList();
        updateStatistics();
    }
}

/**
 * 获取默认Boss数据
 */
function getDefaultBossData() {
    return [
        {
            id: "false-knight",
            name: "False Knight",
            englishName: "False Knight",
            difficulty: 1,
            location: "Forgotten Crossroads",
            hp: 156,
            reward: "City Crest",
            type: "Story Boss",
            description: "Infected Myla, wearing massive armor. The first true challenge in the game.",
            image: "../../images/bosses/false-knight.jpg"
        },
        {
            id: "nail-master",
            name: "Nail Master",
            englishName: "Nail Master",
            difficulty: 2,
            location: "Kingdom's Edge",
            hp: 300,
            reward: "Cyclone Slash",
            type: "Optional Boss",
            description: "A reclusive master of ancient sword techniques. Defeat him to learn powerful cyclone slash skills.",
            image: "../../images/bosses/nail-master.jpg"
        },
        {
            id: "hornet-1",
            name: "Hornet (Greenpath)",
            englishName: "Hornet (Greenpath)",
            difficulty: 2,
            location: "Greenpath",
            hp: 225,
            reward: "Dash Ability",
            type: "Story Boss",
            description: "Protector of Hallownest, an agile and powerful warrior.",
            image: "../../images/bosses/hornet-1.jpg"
        },
        {
            id: "sheo",
            name: "Sheo",
            englishName: "Sheo",
            difficulty: 3,
            location: "Greenpath",
            hp: 400,
            reward: "Dash Slash",
            type: "Optional Boss",
            description: "A Nail Master who transitioned from warrior to artist, possessing a unique combat style.",
            image: "../../images/bosses/sheo.jpg"
        },
        {
            id: "oro-mato",
            name: "Oro & Mato",
            englishName: "Oro & Mato",
            difficulty: 5,
            location: "Kingdom's Edge",
            hp: 600,
            reward: "Great Slash",
            type: "Hidden Boss",
            description: "The last Nail Master brothers, the ultimate challenge of fighting simultaneously.",
            image: "../../images/bosses/oro-mato.jpg"
        },
        {
            id: "gruz-mother",
            name: "Gruz Mother",
            englishName: "Gruz Mother",
            difficulty: 1,
            location: "Forgotten Crossroads",
            hp: 35,
            reward: "None",
            type: "Mini Boss",
            description: "A giant Gruz that constantly spawns small Gruz.",
            image: "../../images/bosses/gruz-mother.jpg"
        }
    ];
}

/**
 * 渲染Boss列表
 */
function renderBossList() {
    const bossGrid = document.getElementById('boss-grid');
    const startIndex = 0;
    const endIndex = currentPage * itemsPerPage;
    const bossesToShow = filteredBosses.slice(startIndex, endIndex);
    
    if (bossesToShow.length === 0) {
        bossGrid.innerHTML = getEmptyStateHTML();
        return;
    }
    
    bossGrid.innerHTML = bossesToShow.map(boss => createBossCardHTML(boss)).join('');
    
    // 更新加载更多按钮状态
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (endIndex >= filteredBosses.length) {
        loadMoreBtn.style.display = 'none';
    } else {
        loadMoreBtn.style.display = 'block';
    }
    
    // 添加动画效果
    animateBossCards();
}

/**
 * 创建Boss卡片HTML
 */
function createBossCardHTML(boss) {
    const difficultyStars = '★'.repeat(boss.difficulty) + '☆'.repeat(5 - boss.difficulty);
    
    return `
        <a href="${boss.id}.html" class="boss-card" data-boss-id="${boss.id}">
            <div class="boss-image-container">
                <img src="${boss.image}" alt="${boss.name}" class="boss-card-image" 
                     onerror="this.src='../../images/placeholder-boss.jpg'">
                <div class="boss-difficulty-badge">${difficultyStars}</div>
                <div class="boss-type-badge">${boss.type}</div>
            </div>
            <div class="boss-card-content">
                <h3 class="boss-card-title">${boss.name}</h3>
                <p class="boss-card-subtitle">${boss.englishName}</p>
                <p class="boss-card-description">${boss.description}</p>
                <div class="boss-card-meta">
                    <span class="boss-location">📍 ${boss.location}</span>
                    <span class="boss-reward">🏆 ${boss.reward}</span>
                </div>
            </div>
        </a>
    `;
}

/**
 * 获取空状态HTML
 */
function getEmptyStateHTML() {
    return `
        <div class="empty-state">
            <div class="empty-state-icon">🔍</div>
            <h3>No matching bosses found</h3>
            <p>Try adjusting your search terms or filters</p>
        </div>
    `;
}

/**
 * 动画效果
 */
function animateBossCards() {
    const cards = document.querySelectorAll('.boss-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

/**
 * 初始化搜索和筛选功能
 */
function initializeSearchAndFilter() {
    const searchInput = document.getElementById('boss-search');
    const difficultyFilter = document.getElementById('difficulty-filter');
    const typeFilter = document.getElementById('type-filter');
    const locationFilter = document.getElementById('location-filter');
    const searchBtn = document.querySelector('.search-btn');
    
    // 搜索功能
    let searchTimeout;
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            applyFilters();
        }, 300);
    });
    
    // 搜索按钮点击
    searchBtn.addEventListener('click', function() {
        applyFilters();
    });
    
    // 筛选器变化
    difficultyFilter.addEventListener('change', applyFilters);
    typeFilter.addEventListener('change', applyFilters);
    locationFilter.addEventListener('change', applyFilters);
    
    // 回车键搜索
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            applyFilters();
        }
    });
}

/**
 * 应用筛选条件
 */
function applyFilters() {
    const searchTerm = document.getElementById('boss-search').value.toLowerCase().trim();
    const difficultyFilter = document.getElementById('difficulty-filter').value;
    const typeFilter = document.getElementById('type-filter').value;
    const locationFilter = document.getElementById('location-filter').value;
    
    filteredBosses = bossData.filter(boss => {
        // 搜索条件
        const matchesSearch = !searchTerm || 
            boss.name.toLowerCase().includes(searchTerm) ||
            boss.englishName.toLowerCase().includes(searchTerm) ||
            boss.description.toLowerCase().includes(searchTerm);
        
        // 难度筛选
        const matchesDifficulty = !difficultyFilter || 
            boss.difficulty.toString() === difficultyFilter;
        
        // 类型筛选
        const matchesType = !typeFilter || boss.type === typeFilter;
        
        // 位置筛选
        const matchesLocation = !locationFilter || boss.location === locationFilter;
        
        return matchesSearch && matchesDifficulty && matchesType && matchesLocation;
    });
    
    // 重置分页
    currentPage = 1;
    
    // 重新渲染
    renderBossList();
    updateStatistics();
    
    // 显示筛选结果统计
    showFilterResults();
}

/**
 * 显示筛选结果
 */
function showFilterResults() {
    const totalResults = filteredBosses.length;
    const searchTerm = document.getElementById('boss-search').value.trim();
    
    if (searchTerm && totalResults === 0) {
        showNotification(`No bosses found containing "${searchTerm}"`, 'info');
    } else if (searchTerm && totalResults > 0) {
        showNotification(`Found ${totalResults} related bosses`, 'success');
    }
}

/**
 * 初始化加载更多功能
 */
function initializeLoadMore() {
    const loadMoreBtn = document.getElementById('load-more-btn');
    
    loadMoreBtn.addEventListener('click', function() {
        // 显示加载状态
        const originalText = this.textContent;
        this.innerHTML = '<span class="loading"></span> Loading...';
        this.disabled = true;
        
        // 模拟加载延迟
        setTimeout(() => {
            currentPage++;
            renderBossList();
            
            // 恢复按钮状态
            this.textContent = originalText;
            this.disabled = false;
        }, 500);
    });
}

/**
 * 更新统计信息
 */
function updateStatistics() {
    const totalBosses = filteredBosses.length;
    const storyBosses = filteredBosses.filter(boss => boss.type === '剧情Boss').length;
    const optionalBosses = filteredBosses.filter(boss => boss.type === '可选Boss').length;
    const hiddenBosses = filteredBosses.filter(boss => boss.type === '隐藏Boss').length;
    
    // 更新统计数字
    animateNumber('total-bosses', totalBosses);
    animateNumber('story-bosses', storyBosses);
    animateNumber('optional-bosses', optionalBosses);
    animateNumber('hidden-bosses', hiddenBosses);
}

/**
 * 数字动画效果
 */
function animateNumber(elementId, targetNumber) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const startNumber = parseInt(element.textContent) || 0;
    const increment = (targetNumber - startNumber) / 20;
    let currentNumber = startNumber;
    
    const timer = setInterval(() => {
        currentNumber += increment;
        if ((increment > 0 && currentNumber >= targetNumber) ||
            (increment < 0 && currentNumber <= targetNumber)) {
            currentNumber = targetNumber;
            clearInterval(timer);
        }
        element.textContent = Math.round(currentNumber);
    }, 50);
}

/**
 * Boss卡片点击事件
 */
function initializeBossCardClicks() {
    document.addEventListener('click', function(e) {
        const bossCard = e.target.closest('.boss-card');
        if (bossCard) {
            const bossId = bossCard.getAttribute('data-boss-id');
            const boss = bossData.find(b => b.id === bossId);
            
            if (boss) {
                // 添加点击动画
                bossCard.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    bossCard.style.transform = '';
                }, 150);
                
                // 记录访问统计
                recordBossView(bossId);
            }
        }
    });
}

/**
 * 记录Boss访问统计
 */
function recordBossView(bossId) {
    try {
        let viewStats = JSON.parse(localStorage.getItem('bossViewStats')) || {};
        viewStats[bossId] = (viewStats[bossId] || 0) + 1;
        localStorage.setItem('bossViewStats', JSON.stringify(viewStats));
    } catch (error) {
        console.log('Unable to save view statistics');
    }
}

/**
 * 快捷键支持
 */
function initializeKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + K 聚焦搜索框
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            document.getElementById('boss-search').focus();
        }
        
        // ESC 清空搜索
        if (e.key === 'Escape') {
            const searchInput = document.getElementById('boss-search');
            if (searchInput.value) {
                searchInput.value = '';
                applyFilters();
            }
        }
    });
}

/**
 * 添加收藏功能
 */
function initializeFavorites() {
    // 获取收藏列表
    function getFavorites() {
        try {
            return JSON.parse(localStorage.getItem('favoriteBosses')) || [];
        } catch {
            return [];
        }
    }
    
    // 切换收藏状态
    function toggleFavorite(bossId) {
        let favorites = getFavorites();
        const index = favorites.indexOf(bossId);
        
        if (index > -1) {
            favorites.splice(index, 1);
            showNotification('Removed from favorites', 'info');
        } else {
            favorites.push(bossId);
            showNotification('Added to favorites', 'success');
        }
        
        localStorage.setItem('favoriteBosses', JSON.stringify(favorites));
        updateFavoriteUI();
    }
    
    // 更新收藏UI
    function updateFavoriteUI() {
        const favorites = getFavorites();
        document.querySelectorAll('.boss-card').forEach(card => {
            const bossId = card.getAttribute('data-boss-id');
            const isFavorite = favorites.includes(bossId);
            
            // 添加或移除收藏标记
            let favoriteBtn = card.querySelector('.favorite-btn');
            if (!favoriteBtn) {
                favoriteBtn = document.createElement('button');
                favoriteBtn.className = 'favorite-btn';
                favoriteBtn.innerHTML = '⭐';
                card.querySelector('.boss-image-container').appendChild(favoriteBtn);
                
                favoriteBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleFavorite(bossId);
                });
            }
            
            favoriteBtn.classList.toggle('active', isFavorite);
        });
    }
    
    // 初始化收藏UI
    setTimeout(updateFavoriteUI, 100);
}

// 页面加载后初始化所有功能
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        initializeBossCardClicks();
        initializeKeyboardShortcuts();
        initializeFavorites();
    }, 500);
});

// 导出函数供其他脚本使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        loadBossData,
        applyFilters,
        renderBossList
    };
}
