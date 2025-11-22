// ============================================
// MAIN.JS - Entry point của ứng dụng
// ============================================

/**
 * Khởi tạo ứng dụng khi DOM loaded
 */
window.onload = function() {
    renderQuickSelectButtons();
    setupDragAndDrop();
};

function setupDragAndDrop() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');

    if (!uploadArea || !fileInput) return;

    const preventDefaults = (event) => {
        event.preventDefault();
        event.stopPropagation();
    };

    ['dragenter', 'dragover'].forEach(eventName => {
        uploadArea.addEventListener(eventName, (event) => {
            preventDefaults(event);
            uploadArea.classList.add('drag-over');
        });
    });

    ['dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, (event) => {
            preventDefaults(event);
            if (eventName === 'drop') {
                const file = event.dataTransfer.files[0];
                processUploadedFile(file);
            }
            uploadArea.classList.remove('drag-over');
        });
    });

    // Ngăn trình duyệt mở file khi kéo-thả ngoài vùng upload
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        document.addEventListener(eventName, preventDefaults);
    });
}
