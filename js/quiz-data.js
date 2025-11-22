// ============================================
// QUIZ-DATA.JS - Xử lý dữ liệu Quiz
// ============================================

/**
 * Tải file quiz từ server
 */
async function loadQuizFile(filename, title) {
    try {
        const response = await fetch(filename);
        if (!response.ok) {
            throw new Error(`Không tìm thấy file: ${filename}`);
        }
        
        const data = await response.json();
        processQuizData(data);
    } catch (error) {
        showError(`Lỗi tải file "${filename}": ${error.message}. Vui lòng đảm bảo file tồn tại trong cùng thư mục với index.html`);
    }
}

/**
 * Xử lý file upload từ user
 */
function handleFileUpload(event) {
    const file = event.target.files[0];
    processUploadedFile(file);
}

/**
 * Xử lý file được kéo thả hoặc chọn thủ công
 */
function processUploadedFile(file) {
    if (!file) return;

    const isJsonFile = file.type === 'application/json' || file.name.toLowerCase().endsWith('.json');
    if (!isJsonFile) {
        showError('Vui lòng chọn file JSON hợp lệ (.json)!');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            processQuizData(data);
        } catch (error) {
            showError('Lỗi đọc file JSON: ' + error.message);
        }
    };

    reader.onerror = function() {
        showError('Không thể đọc file: ' + reader.error);
    };

    reader.readAsText(file);
}

/**
 * Xử lý dữ liệu quiz và phân loại format
 */
function processQuizData(data) {
    // Kiểm tra xem có phải là mảng các đề không
    if (Array.isArray(data)) {
        // Kiểm tra xem có phải là reading_part_2_3 không
        const isReadingPart23 = data.every(item => 
            item.type === 'reading_part_2_3' && 
            item.fixed && 
            item.items && 
            Array.isArray(item.items) && 
            item.answer
        );

        if (isReadingPart23) {
            // Format reading_part_2_3
            currentQuizType = 'reading_part_2_3';
            isMultiPassageFormat = false;
            allPassages = [];
            questions = data;
            
            if (questions.length === 0) {
                showError('File JSON không chứa câu hỏi nào!');
                return;
            }
            
            startQuiz();
            return;
        }

        // Kiểm tra xem có phải là listening_part_3 không
        const isListeningPart3 = data.every(item => 
            item.audio && 
            item.options && 
            item.answer && 
            !item.question // Listening không có question
        );

        if (isListeningPart3) {
            // Format listening_part_3
            currentQuizType = 'listening_part_3';
            isMultiPassageFormat = false;
            allPassages = [];
            questions = data;
            
            if (questions.length === 0) {
                showError('File JSON không chứa câu hỏi nào!');
                return;
            }
            
            startQuiz();
            return;
        }

        // Kiểm tra xem có phải là reading_part_4 không
        const isReadingPart4 = data.every(item => 
            item.people && 
            item.questions && 
            Array.isArray(item.questions) &&
            item.people.A && item.people.B && item.people.C && item.people.D
        );

        if (isReadingPart4) {
            // Format reading_part_4
            currentQuizType = 'reading_part_4';
            isMultiPassageFormat = false;
            allPassages = [];
            questions = data;
            
            if (questions.length === 0) {
                showError('File JSON không chứa dữ liệu nào!');
                return;
            }
            
            startQuiz();
            return;
        }

        // Kiểm tra xem có phải là mảng đề (mỗi phần tử có items và text) không
        const isArrayOfPassages = data.every(item => 
            item.items && Array.isArray(item.items) && item.text
        );

        if (isArrayOfPassages) {
            // Mảng nhiều đề
            currentQuizType = 'default';
            isMultiPassageFormat = true;
            allPassages = data;
            currentPassageIndex = 0;
            loadPassage(0);
            startQuiz();
        } else {
            // Mảng câu hỏi cũ
            currentQuizType = 'default';
            isMultiPassageFormat = false;
            allPassages = [];
            questions = data;
            
            if (questions.length === 0) {
                showError('File JSON không chứa câu hỏi nào!');
                return;
            }

            const isValid = questions.every(q => 
                (q.question || q.audio) && // Hỗ trợ cả question và audio
                q.options && 
                q.answer
            );

            if (!isValid) {
                showError('Cấu trúc câu hỏi không hợp lệ! Vui lòng kiểm tra lại file JSON.');
                return;
            }

            startQuiz();
        }
    } else if (data.items && Array.isArray(data.items) && data.text) {
        // Đề đơn
        currentQuizType = 'default';
        isMultiPassageFormat = true;
        allPassages = [data];
        currentPassageIndex = 0;
        loadPassage(0);
        startQuiz();
    } else {
        showError('Format file JSON không hợp lệ!');
        return;
    }
}

/**
 * Load passage cụ thể
 */
function loadPassage(index) {
    if (index < 0 || index >= allPassages.length) return;
    
    currentPassageIndex = index;
    const passage = allPassages[index];
    
    // Chuyển đổi items sang format câu hỏi chuẩn
    questions = passage.items.map(item => ({
        question: item.sentence || item.question || '',
        question_vi: item.sentence_vi || '',
        vn_title: passage.vn_title || '',
        passage_text: passage.text || '',
        options: item.options || {},
        answer: item.answer || ''
    }));

    currentIndex = 0;
    renderPassageSelector();
    renderQuestion();
}

/**
 * Chuyển đổi passage
 */
function switchPassage(index) {
    if (index === currentPassageIndex) return;
    
    showModal({
        icon: '📝',
        title: 'Chuyển đề',
        message: 'Bạn có muốn chuyển sang đề khác? Tiến độ đề hiện tại sẽ được lưu.',
        confirmText: 'Chuyển đề',
        cancelText: 'Hủy'
    }).then(confirmed => {
        if (confirmed) {
            loadPassage(index);
        }
    });
}
