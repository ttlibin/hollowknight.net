// 交互式地图功能
class InteractiveMap {
    constructor() {
        this.viewport = document.getElementById('mapViewport');
        this.wrapper = document.getElementById('mapWrapper');
        this.image = document.getElementById('mapImage');
        this.zoomInBtn = document.getElementById('zoomIn');
        this.zoomOutBtn = document.getElementById('zoomOut');
        this.resetBtn = document.getElementById('resetView');
        this.zoomLevel = document.getElementById('zoomLevel');
        this.loadingEl = document.getElementById('mapLoading');
        
        // 状态变量
        this.currentZoom = 1;
        this.minZoom = 0.5;
        this.maxZoom = 3;
        this.zoomStep = 0.2;
        
        // 拖拽状态
        this.isDragging = false;
        this.startX = 0;
        this.startY = 0;
        this.translateX = 0;
        this.translateY = 0;
        this.initialTranslateX = 0;
        this.initialTranslateY = 0;
        
        this.init();
    }
    
    init() {
        // 绑定事件监听器
        this.bindEvents();
        // 处理图片加载
        this.handleImageLoad();
        // 初始化显示
        this.updateDisplay();
    }
    
    handleImageLoad() {
        // 图片加载完成后隐藏加载动画
        this.image.addEventListener('load', () => {
            if (this.loadingEl) {
                this.loadingEl.classList.add('hidden');
            }
        });
        
        // 图片加载失败处理
        this.image.addEventListener('error', () => {
            if (this.loadingEl) {
                this.loadingEl.innerHTML = `
                    <div style="text-align: center; color: var(--text-light);">
                        <p>❌ 地图加载失败</p>
                        <p style="font-size: 0.9rem; opacity: 0.8;">请检查网络连接或稍后重试</p>
                    </div>
                `;
            }
        });
        
        // 如果图片已经加载完成（缓存情况）
        if (this.image.complete) {
            if (this.loadingEl) {
                this.loadingEl.classList.add('hidden');
            }
        }
    }
    
    bindEvents() {
        // 缩放按钮事件
        this.zoomInBtn.addEventListener('click', () => this.zoomIn());
        this.zoomOutBtn.addEventListener('click', () => this.zoomOut());
        this.resetBtn.addEventListener('click', () => this.resetView());
        
        // 鼠标滚轮缩放
        this.viewport.addEventListener('wheel', (e) => this.handleWheel(e));
        
        // 鼠标拖拽事件
        this.viewport.addEventListener('mousedown', (e) => this.startDrag(e));
        document.addEventListener('mousemove', (e) => this.drag(e));
        document.addEventListener('mouseup', () => this.endDrag());
        
        // 触摸事件（移动端支持）
        this.viewport.addEventListener('touchstart', (e) => this.startTouch(e));
        this.viewport.addEventListener('touchmove', (e) => this.moveTouch(e));
        this.viewport.addEventListener('touchend', () => this.endTouch());
        
        // 防止图片被拖拽
        this.image.addEventListener('dragstart', (e) => e.preventDefault());
        
        // 双击缩放
        this.viewport.addEventListener('dblclick', (e) => this.handleDoubleClick(e));
        
        // 键盘快捷键
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }
    
    // 放大
    zoomIn() {
        if (this.currentZoom < this.maxZoom) {
            this.currentZoom = Math.min(this.currentZoom + this.zoomStep, this.maxZoom);
            this.updateDisplay();
        }
    }
    
    // 缩小
    zoomOut() {
        if (this.currentZoom > this.minZoom) {
            this.currentZoom = Math.max(this.currentZoom - this.zoomStep, this.minZoom);
            this.updateDisplay();
        }
    }
    
    // 重置视图
    resetView() {
        this.currentZoom = 1;
        this.translateX = 0;
        this.translateY = 0;
        this.updateDisplay();
    }
    
    // 滚轮缩放
    handleWheel(e) {
        e.preventDefault();
        
        const rect = this.viewport.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        if (e.deltaY < 0) {
            this.zoomIn();
        } else {
            this.zoomOut();
        }
    }
    
    // 开始拖拽
    startDrag(e) {
        e.preventDefault();
        this.isDragging = true;
        this.startX = e.clientX;
        this.startY = e.clientY;
        this.initialTranslateX = this.translateX;
        this.initialTranslateY = this.translateY;
        
        this.viewport.style.cursor = 'grabbing';
    }
    
    // 拖拽中
    drag(e) {
        if (!this.isDragging) return;
        
        e.preventDefault();
        const deltaX = e.clientX - this.startX;
        const deltaY = e.clientY - this.startY;
        
        this.translateX = this.initialTranslateX + deltaX;
        this.translateY = this.initialTranslateY + deltaY;
        
        this.constrainTranslation();
        this.updateDisplay();
    }
    
    // 结束拖拽
    endDrag() {
        this.isDragging = false;
        this.viewport.style.cursor = 'grab';
    }
    
    // 触摸开始
    startTouch(e) {
        e.preventDefault();
        if (e.touches.length === 1) {
            const touch = e.touches[0];
            this.isDragging = true;
            this.startX = touch.clientX;
            this.startY = touch.clientY;
            this.initialTranslateX = this.translateX;
            this.initialTranslateY = this.translateY;
        }
    }
    
    // 触摸移动
    moveTouch(e) {
        if (!this.isDragging || e.touches.length !== 1) return;
        
        e.preventDefault();
        const touch = e.touches[0];
        const deltaX = touch.clientX - this.startX;
        const deltaY = touch.clientY - this.startY;
        
        this.translateX = this.initialTranslateX + deltaX;
        this.translateY = this.initialTranslateY + deltaY;
        
        this.constrainTranslation();
        this.updateDisplay();
    }
    
    // 触摸结束
    endTouch() {
        this.isDragging = false;
    }
    
    // 双击缩放
    handleDoubleClick(e) {
        e.preventDefault();
        
        // 获取点击位置相对于视口的坐标
        const rect = this.viewport.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;
        
        // 计算点击位置相对于视口中心的偏移
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const offsetX = clickX - centerX;
        const offsetY = clickY - centerY;
        
        if (this.currentZoom < this.maxZoom) {
            // 放大并将点击位置移动到中心
            const newZoom = Math.min(this.currentZoom * 2, this.maxZoom);
            const zoomFactor = newZoom / this.currentZoom;
            
            this.currentZoom = newZoom;
            this.translateX -= offsetX * (zoomFactor - 1) / this.currentZoom;
            this.translateY -= offsetY * (zoomFactor - 1) / this.currentZoom;
            
            this.constrainTranslation();
            this.updateDisplay();
        } else {
            // 如果已经是最大缩放，重置视图
            this.resetView();
        }
    }
    
    // 键盘快捷键
    handleKeyboard(e) {
        // 只在地图页面响应键盘事件
        if (!document.getElementById('mapViewport')) return;
        
        switch(e.key) {
            case '+':
            case '=':
                e.preventDefault();
                this.zoomIn();
                break;
            case '-':
                e.preventDefault();
                this.zoomOut();
                break;
            case '0':
                e.preventDefault();
                this.resetView();
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.translateY += 50;
                this.constrainTranslation();
                this.updateDisplay();
                break;
            case 'ArrowDown':
                e.preventDefault();
                this.translateY -= 50;
                this.constrainTranslation();
                this.updateDisplay();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                this.translateX += 50;
                this.constrainTranslation();
                this.updateDisplay();
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.translateX -= 50;
                this.constrainTranslation();
                this.updateDisplay();
                break;
        }
    }
    
    // 限制平移范围
    constrainTranslation() {
        const rect = this.viewport.getBoundingClientRect();
        
        // 获取图片的原始尺寸
        const imageWidth = this.image.naturalWidth || this.image.width;
        const imageHeight = this.image.naturalHeight || this.image.height;
        
        // 计算缩放后的图片尺寸
        const scaledWidth = imageWidth * this.currentZoom;
        const scaledHeight = imageHeight * this.currentZoom;
        
        // 计算最大允许的平移距离
        const maxTranslateX = Math.max(0, (scaledWidth - rect.width) / 2 / this.currentZoom);
        const maxTranslateY = Math.max(0, (scaledHeight - rect.height) / 2 / this.currentZoom);
        
        // 限制平移范围
        this.translateX = Math.max(-maxTranslateX, Math.min(maxTranslateX, this.translateX));
        this.translateY = Math.max(-maxTranslateY, Math.min(maxTranslateY, this.translateY));
    }
    
    // 更新显示
    updateDisplay() {
        // 应用变换
        this.wrapper.style.transform = `scale(${this.currentZoom}) translate(${this.translateX}px, ${this.translateY}px)`;
        
        // 更新缩放指示器
        this.zoomLevel.textContent = `${Math.round(this.currentZoom * 100)}%`;
        
        // 更新按钮状态
        this.zoomInBtn.disabled = this.currentZoom >= this.maxZoom;
        this.zoomOutBtn.disabled = this.currentZoom <= this.minZoom;
        
        // 添加视觉反馈
        if (this.currentZoom >= this.maxZoom) {
            this.zoomInBtn.style.opacity = '0.5';
        } else {
            this.zoomInBtn.style.opacity = '1';
        }
        
        if (this.currentZoom <= this.minZoom) {
            this.zoomOutBtn.style.opacity = '0.5';
        } else {
            this.zoomOutBtn.style.opacity = '1';
        }
    }
}

// 当页面加载完成时初始化地图
document.addEventListener('DOMContentLoaded', () => {
    // 检查是否在地图页面
    if (document.getElementById('mapViewport')) {
        new InteractiveMap();
    }
});

// 全局错误处理
window.addEventListener('error', (e) => {
    if (e.target.tagName === 'IMG' && e.target.id === 'mapImage') {
        console.error('地图图片加载失败:', e);
    }
});
