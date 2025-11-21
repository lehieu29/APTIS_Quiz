// ============================================
// UTILS.JS - Các hàm tiện ích
// ============================================

/**
 * Hiển thị modal xác nhận
 */
function showModal(options) {
    return new Promise((resolve) => {
        const modal = document.getElementById('modalOverlay');
        const icon = document.getElementById('modalIcon');
        const title = document.getElementById('modalTitle');
        const message = document.getElementById('modalMessage');
        const confirmBtn = document.getElementById('modalConfirm');
        const cancelBtn = document.getElementById('modalCancel');

        icon.textContent = options.icon || '❓';
        title.textContent = options.title || 'Xác nhận';
        message.textContent = options.message || 'Bạn có chắc chắn?';
        confirmBtn.textContent = options.confirmText || 'Đồng ý';
        cancelBtn.textContent = options.cancelText || 'Hủy';

        modal.classList.add('show');

        const handleConfirm = () => {
            modal.classList.remove('show');
            cleanup();
            resolve(true);
        };

        const handleCancel = () => {
            modal.classList.remove('show');
            cleanup();
            resolve(false);
        };

        const handleOverlayClick = (e) => {
            if (e.target === modal) handleCancel();
        };

        const handleEscape = (e) => {
            if (e.key === 'Escape') handleCancel();
        };

        const cleanup = () => {
            confirmBtn.removeEventListener('click', handleConfirm);
            cancelBtn.removeEventListener('click', handleCancel);
            modal.removeEventListener('click', handleOverlayClick);
            document.removeEventListener('keydown', handleEscape);
        };

        confirmBtn.addEventListener('click', handleConfirm);
        cancelBtn.addEventListener('click', handleCancel);
        modal.addEventListener('click', handleOverlayClick);
        document.addEventListener('keydown', handleEscape);
    });
}

/**
 * Hiển thị thông báo lỗi
 */
function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.textContent = '❌ ' + message;
    errorDiv.classList.add('show');
    setTimeout(() => {
        errorDiv.classList.remove('show');
    }, 5000);
}
