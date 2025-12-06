// ============================================
// MAIN.JS - Entry point của ứng dụng
// ============================================

/**
 * Khởi tạo ứng dụng khi DOM loaded
 */
window.onload = function() {
    renderQuickSelectButtons();
    setupDragAndDrop();
    setupKeyboardShortcuts();
};

/**
 * Setup keyboard shortcuts
 */
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function(event) {
        // Chỉ xử lý khi đang ở Writing Part 2,3,4
        if (currentQuizType !== 'writing_part_2_3_4'
            || currentQuizType !== 'speaking_part_1'
            || currentQuizType !== 'writing_part_1'
        ) {
            return;
        }
        
        // Bỏ qua nếu đang focus vào textarea (trừ phím "/")
        const isInTextarea = document.activeElement.tagName === 'TEXTAREA';
        
        // Phím "/" → Focus vào textarea (khi chưa focus)
        if (event.key === '/' && !isInTextarea) {
            event.preventDefault();
            const textarea = document.getElementById('writingPart234Answer');
            if (textarea) textarea.focus();
            return;
        }
        
        if (isInTextarea) return;

        // Kiểm tra đã submit chưa
        const hasSubmitted = checkSubmitted(currentQuizType);
        
        // Phím mũi tên phải → Câu tiếp theo (chỉ khi đã submit)
        if (event.key === 'ArrowRight' && hasSubmitted) {
            event.preventDefault();
            nextQuestionByCurrentQuizType(currentQuizType);
        }
    });
}

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
