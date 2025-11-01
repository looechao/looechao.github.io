/**
 * 图片点击放大功能
 * 
 * 功能特性:
 * - 点击文章中的图片可以放大显示
 * - 支持点击任意位置或按ESC键关闭
 * - 灰色调模态框设计
 * - 平滑的动画过渡效果
 */

document.addEventListener('DOMContentLoaded', function() {
    initImageZoom();
});

/**
 * 初始化图片放大功能
 */
function initImageZoom() {
    const articleImages = document.querySelectorAll('.article-content img');
    
    if (articleImages.length === 0) return;
    
    // 创建模态框并添加到页面
    const modal = createModal();
    document.body.appendChild(modal);
    
    // 为每个图片添加点击事件
    setupImageClickEvents(articleImages);
}

/**
 * 为图片设置点击事件
 */
function setupImageClickEvents(images) {
    images.forEach(img => {
        // 添加可点击样式和类名
        img.style.cursor = 'pointer';
        img.classList.add('zoomable-image');
        
        // 绑定点击事件
        img.addEventListener('click', function(e) {
            e.preventDefault();
            openModal(this.src, this.alt);
        });
    });
}

/**
 * 创建模态框结构
 */
function createModal() {
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = `
        <div class="image-modal-backdrop"></div>
        <div class="image-modal-content">
            <button class="image-modal-close" aria-label="关闭">&times;</button>
            <img class="image-modal-img" src="" alt="">
            <div class="image-modal-caption"></div>
        </div>
    `;
    
    // 设置各种关闭事件
    setupModalEvents(modal);
    
    return modal;
}

/**
 * 设置模态框事件监听
 */
function setupModalEvents(modal) {
    const backdrop = modal.querySelector('.image-modal-backdrop');
    const closeBtn = modal.querySelector('.image-modal-close');
    const modalContent = modal.querySelector('.image-modal-content');
    
    // 点击背景、关闭按钮或内容区域都可以关闭
    [backdrop, closeBtn, modalContent].forEach(element => {
        element.addEventListener('click', closeModal);
    });
    
    // ESC键关闭
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

/**
 * 打开模态框显示图片
 */
function openModal(src, alt) {
    const modal = document.querySelector('.image-modal');
    const modalImg = modal.querySelector('.image-modal-img');
    const modalCaption = modal.querySelector('.image-modal-caption');
    
    // 设置图片信息
    modalImg.src = src;
    modalImg.alt = alt;
    modalCaption.textContent = alt || '';
    
    // 显示模态框
    modal.classList.add('active');
    document.body.classList.add('modal-open');
    document.body.style.overflow = 'hidden';
}

/**
 * 关闭模态框
 */
function closeModal() {
    const modal = document.querySelector('.image-modal');
    
    // 隐藏模态框
    modal.classList.remove('active');
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
}