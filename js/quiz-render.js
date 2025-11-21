// ============================================
// QUIZ-RENDER.JS - Render giao diện Quiz
// ============================================

/**
 * Render các nút quick select
 */
function renderQuickSelectButtons() {
    const container = document.getElementById('quickSelectContainer');
    container.innerHTML = '';

    availableQuizFiles.forEach(file => {
        const btn = document.createElement('button');
        btn.className = 'quick-select-btn';
        btn.onclick = () => loadQuizFile(file.filename, file.title);
        btn.innerHTML = `
            <div class="icon">${file.icon}</div>
            <div class="title">${file.title}</div>
            <div class="count">${file.description}</div>
        `;
        container.appendChild(btn);
    });
}

/**
 * Render passage selector
 */
function renderPassageSelector() {
    const container = document.getElementById('passageSelectorContainer');
    
    if (!isMultiPassageFormat || allPassages.length <= 1) {
        container.innerHTML = '';
        return;
    }

    let html = '<div class="passage-selector">';
    html += '<div class="passage-selector-title">📝 Chọn đề:</div>';
    html += '<div class="passage-buttons">';
    
    allPassages.forEach((passage, index) => {
        const isActive = index === currentPassageIndex;
        html += `
            <button 
                class="passage-btn ${isActive ? 'active' : ''}" 
                onclick="switchPassage(${index})"
            >
                Đề ${index + 1}
            </button>
        `;
    });
    
    html += '</div></div>';
    container.innerHTML = html;
}

/**
 * Bắt đầu quiz
 */
function startQuiz() {
    document.getElementById('uploadSection').style.display = 'none';
    document.getElementById('quizSection').style.display = 'block';
    document.getElementById('totalQuestions').textContent = questions.length;
    currentIndex = 0;
    correctAnswers = 0;
    wrongAnswers = 0;
    updateStats();
    renderPassageSelector();
    renderQuestion();
}

/**
 * Render câu hỏi hiện tại
 */
function renderQuestion() {
    if (currentIndex >= questions.length) {
        showCompletion();
        return;
    }

    answered = false;
    hasSubmitted = false;
    const question = questions[currentIndex];
    
    // Reset button container
    const buttonContainer = document.getElementById('buttonContainer');
    const submitBtn = document.getElementById('submitBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    // Hiển thị đoạn văn nếu là format đoạn văn
    const passageContainer = document.getElementById('passageContainer');
    if (isMultiPassageFormat && currentIndex === 0 && question.passage_text) {
        passageContainer.innerHTML = `
            <div class="passage-text">
                <strong style="color: #764ba2; display: block; margin-bottom: 10px;">${question.vn_title || ''}</strong>
                ${question.passage_text}
            </div>
        `;
    } else if (!isMultiPassageFormat) {
        passageContainer.innerHTML = '';
    }
    
    document.getElementById('questionNumber').textContent = 
        `Câu ${currentIndex + 1}/${questions.length}`;
    
    const vnTitleElement = document.getElementById('vnTitle');
    vnTitleElement.textContent = question.vn_title || '';
    vnTitleElement.classList.remove('show');
    
    const optionsContainer = document.getElementById('optionsContainer');
    document.getElementById('resultBox').classList.remove('show');
    
    // Kiểm tra loại quiz
    if (currentQuizType === 'reading_part_2_3') {
        renderReadingPart23(question);
        
        // Show submit button, hide next initially
        buttonContainer.classList.add('button-grid');
        submitBtn.classList.add('show');
        submitBtn.disabled = false;
        nextBtn.disabled = true;
    } else if (currentQuizType === 'listening_part_3') {
        renderListeningPart3(question);
        
        // Hide submit button for listening quiz
        buttonContainer.classList.remove('button-grid');
        submitBtn.classList.remove('show');
        nextBtn.disabled = true;
    } else {
        // Default quiz rendering
        document.getElementById('questionText').textContent = question.question;
        optionsContainer.innerHTML = '';
        
        Object.keys(question.options).forEach(key => {
            const option = question.options[key];
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.onclick = () => checkAnswer(key);
            btn.innerHTML = `
                <div class="option-label">${key}</div>
                <div class="option-text">
                    <div>${option.text}</div>
                    <div class="option-vi">${option.vi || ''}</div>
                </div>
            `;
            optionsContainer.appendChild(btn);
        });
        
        // Hide submit button for default quiz
        buttonContainer.classList.remove('button-grid');
        submitBtn.classList.remove('show');
        nextBtn.disabled = true;
    }
}

/**
 * Render Listening Part 3
 */
function renderListeningPart3(question) {
    document.getElementById('questionText').textContent = '';
    const optionsContainer = document.getElementById('optionsContainer');
    optionsContainer.innerHTML = '';
    
    // Render audio player
    if (question.audio) {
        const audioContainer = document.createElement('div');
        audioContainer.className = 'audio-container';
        audioContainer.style.cssText = 'margin: 20px 0; padding: 20px; background: #f8f9fa; border-radius: 12px; text-align: center;';
        audioContainer.innerHTML = `
            <div style="margin-bottom: 15px; color: #667eea; font-weight: bold; font-size: 16px;">🎧 Audio</div>
            <audio controls style="width: 100%; max-width: 500px;">
                <source src="${question.audio}" type="audio/mpeg">
                <source src="${question.audio}" type="audio/wav">
                Trình duyệt của bạn không hỗ trợ audio.
            </audio>
        `;
        optionsContainer.appendChild(audioContainer);
    }
    
    // Render options
    Object.keys(question.options).forEach(key => {
        const option = question.options[key];
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.onclick = () => checkAnswerListening(key);
        btn.innerHTML = `
            <div class="option-label">${key}</div>
            <div class="option-text">
                <div>${option.text}</div>
                <div class="option-vi">${option.vi || ''}</div>
            </div>
        `;
        optionsContainer.appendChild(btn);
    });
}

/**
 * Render Reading Part 2-3
 */
function renderReadingPart23(question) {
    // Ẩn question text mặc định, hiển thị title
    document.getElementById('questionText').textContent = '';
    document.getElementById('vnTitle').textContent = question.vn_title || '';
    
    const optionsContainer = document.getElementById('optionsContainer');
    optionsContainer.innerHTML = '';
    
    // Tạo container cho sorting
    const sortingContainer = document.createElement('div');
    sortingContainer.className = 'sorting-container';
    
    // Hiển thị câu cố định
    const fixedDiv = document.createElement('div');
    fixedDiv.className = 'fixed-sentence';
    fixedDiv.innerHTML = `
        <div class="fixed-sentence-label">0. (Câu cố định)</div>
        <div>${question.fixed.sentence}</div>
    `;
    sortingContainer.appendChild(fixedDiv);
    
    // Hiển thị các câu cần sắp xếp
    question.items.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'sortable-item';
        itemDiv.draggable = true;
        itemDiv.dataset.originalNumber = item.number;
        itemDiv.dataset.index = index;
        
        itemDiv.innerHTML = `
            <span class="drag-handle">☰</span>
            <div class="item-number">${item.number}</div>
            <div class="item-content">
                <div>${item.sentence}</div>
                <div class="item-vi">${item.vi || ''}</div>
            </div>
        `;
        
        // Thêm drag & drop event listeners
        itemDiv.addEventListener('dragstart', handleDragStart);
        itemDiv.addEventListener('dragend', handleDragEnd);
        itemDiv.addEventListener('dragover', handleDragOver);
        itemDiv.addEventListener('drop', handleDrop);
        itemDiv.addEventListener('dragenter', handleDragEnter);
        itemDiv.addEventListener('dragleave', handleDragLeave);
        
        sortingContainer.appendChild(itemDiv);
    });
    
    optionsContainer.appendChild(sortingContainer);
}

/**
 * Hiển thị màn hình hoàn thành
 */
function showCompletion() {
    document.getElementById('quizSection').style.display = 'none';
    const completionScreen = document.getElementById('completionScreen');
    completionScreen.classList.add('show');
    
    const percentage = Math.round((correctAnswers / questions.length) * 100);
    document.getElementById('finalScore').textContent = `${correctAnswers}/${questions.length} (${percentage}%)`;
    
    let message = '';
    if (percentage === 100) {
        message = '🌟 Xuất sắc! Bạn trả lời đúng tất cả!';
    } else if (percentage >= 80) {
        message = '👏 Tuyệt vời! Bạn làm rất tốt!';
    } else if (percentage >= 60) {
        message = '👍 Khá tốt! Tiếp tục cố gắng!';
    } else {
        message = '💪 Đừng nản lòng! Hãy thử lại nhé!';
    }
    document.getElementById('completionMessage').textContent = message;
}

/**
 * Update stats display
 */
function updateStats() {
    document.getElementById('currentQuestion').textContent = currentIndex + 1;
    document.getElementById('correctCount').textContent = correctAnswers;
    document.getElementById('wrongCount').textContent = wrongAnswers;
}
