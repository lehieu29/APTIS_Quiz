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
    
    // Reset practice mode khi bắt đầu quiz mới
    practiceMode.isActive = false;
    practiceMode.wrongIndexes = [];
    practiceMode.wrongItemIndexes = [];
    practiceMode.currentPracticeIndex = 0;
    practiceMode.retryRound = 1;
    practiceMode.originalQuestions = [];
    
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
    
    // Hiển thị Practice Mode Warning nếu đang làm lại câu sai
    if (practiceMode.isActive) {
        const totalWrong = (currentQuizType === 'reading_part_2_3' || currentQuizType === 'reading_part_4') 
            ? practiceMode.wrongItemIndexes.length 
            : practiceMode.wrongIndexes.length;
        
        const itemType = (currentQuizType === 'reading_part_2_3' || currentQuizType === 'reading_part_4') ? 'đề' : 'câu';
        
        passageContainer.innerHTML = `
            <div style="background: #ffe6e6; color: #d32f2f; padding: 15px; border-radius: 8px; margin-bottom: 20px; font-weight: bold; border-left: 4px solid #d32f2f;">
                ⚠️ LÀM LẠI CÁC ${itemType.toUpperCase()} SAI
                <div style="font-size: 14px; margin-top: 5px; font-weight: normal;">
                    Còn <strong>${totalWrong}</strong> ${itemType} cần làm lại
                </div>
                <button onclick="skipPracticeMode()" style="margin-top: 10px; padding: 8px 15px; background: white; color: #d32f2f; border: 2px solid #d32f2f; border-radius: 6px; cursor: pointer; font-weight: bold;">
                    Bỏ qua - Xem kết quả
                </button>
            </div>
        `;
    } else if (isMultiPassageFormat && currentIndex === 0 && question.passage_text) {
        passageContainer.innerHTML = `
            <div class="passage-text">
                <strong style="color: #764ba2; display: block; margin-bottom: 10px;">${question.vn_title || ''}</strong>
                ${question.passage_text}
            </div>
        `;
    } else if (!isMultiPassageFormat) {
        passageContainer.innerHTML = '';
    }
    
    // Hiển thị số câu (kèm theo thông tin là câu sai nếu ở practice mode)
    const questionNumberText = practiceMode.isActive 
        ? `Câu ${currentIndex + 1}/${questions.length} [Câu sai - Lần ${practiceMode.retryRound}]`
        : `Câu ${currentIndex + 1}/${questions.length}`;
    
    document.getElementById('questionNumber').textContent = questionNumberText;
    
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
    } else if (currentQuizType === 'reading_part_4') {
        renderReadingPart4(question);
        
        // Hide submit button for reading part 4
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

/**
 * Render Reading Part 4 - Hiển thị đoạn văn của 4 người và câu hỏi đầu tiên
 */
function renderReadingPart4(item) {
    // Reset state
    readingPart4State.currentQuestionIndex = 0;
    readingPart4State.userAnswers = [];
    readingPart4State.hasFinishedAll = false;
    
    const passageContainer = document.getElementById('passageContainer');
    const optionsContainer = document.getElementById('optionsContainer');
    
    // Hiển thị topic và note
    let html = '';
    if (item.vn_title) {
        html += `<div style="color: #764ba2; font-weight: bold; font-size: 18px; margin-bottom: 10px;">${item.vn_title}</div>`;
    }
    if (item.note) {
        html += `<div style="color: #666; font-style: italic; margin-bottom: 20px;">💡 ${item.note}</div>`;
    }
    if (item.topic) {
        html += `<div style="color: #667eea; font-weight: bold; margin-bottom: 20px;">📝 Topic: ${item.topic}</div>`;
    }
    
    // Hiển thị text của 4 người (chỉ text tiếng Anh, chưa có dịch và summary)
    html += '<div style="display: grid; gap: 15px; margin-bottom: 30px;">';
    
    ['A', 'B', 'C', 'D'].forEach(key => {
        const person = item.people[key];
        if (person) {
            html += `
                <div style="padding: 20px; background: #f8f9fa; border-radius: 12px; border-left: 4px solid #667eea;">
                    <div style="font-weight: bold; color: #667eea; margin-bottom: 10px; font-size: 16px;">
                        ${person.label || `Person ${key}`}
                    </div>
                    <div style="line-height: 1.8; color: #333;">
                        ${person.text}
                    </div>
                </div>
            `;
        }
    });
    
    html += '</div>';
    passageContainer.innerHTML = html;
    
    // Ẩn vnTitle và questionText
    document.getElementById('vnTitle').textContent = '';
    document.getElementById('questionText').textContent = '';
    
    // Render câu hỏi đầu tiên
    renderReadingPart4Question(item, 0);
}

/**
 * Render câu hỏi cụ thể cho Reading Part 4
 */
function renderReadingPart4Question(item, questionIndex) {
    const question = item.questions[questionIndex];
    const optionsContainer = document.getElementById('optionsContainer');
    
    // Update question number
    document.getElementById('questionNumber').textContent = 
        `Câu ${questionIndex + 1}/${item.questions.length}`;
    
    // Hiển thị câu hỏi
    optionsContainer.innerHTML = `
        <div style="margin-bottom: 20px;">
            <div style="font-size: 18px; font-weight: bold; color: #333; margin-bottom: 5px;">
                ${question.question}
            </div>
            <div style="font-size: 14px; color: #666; font-style: italic;">
                ${question.question_vi || ''}
            </div>
        </div>
    `;
    
    // Render options
    Object.keys(question.options).forEach(key => {
        const option = question.options[key];
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.onclick = () => checkAnswerReadingPart4(key, item, questionIndex);
        btn.innerHTML = `
            <div class="option-label">${key}</div>
            <div class="option-text">
                <div>${option.text}</div>
                <div class="option-vi">${option.vi || ''}</div>
            </div>
        `;
        optionsContainer.appendChild(btn);
    });
    
    // Hide result box
    document.getElementById('resultBox').classList.remove('show');
}

/**
 * Hiển thị kết quả tổng hợp cho Reading Part 4
 */
function showReadingPart4Result(item) {
    const optionsContainer = document.getElementById('optionsContainer');
    
    // Tính số câu đúng
    let correctCount = 0;
    item.questions.forEach((q, idx) => {
        if (readingPart4State.userAnswers[idx] === q.answer) {
            correctCount++;
        }
    });
    
    // Cập nhật stats
    correctAnswers += correctCount;
    wrongAnswers += (item.questions.length - correctCount);
    updateStats();
    
    // Track item sai cho practice mode (nếu có câu sai trong item)
    if (correctCount < item.questions.length) {
        // Có câu sai trong item này
        if (!practiceMode.isActive && !practiceMode.wrongItemIndexes.includes(currentIndex)) {
            practiceMode.wrongItemIndexes.push(currentIndex);
        }
    } else {
        // Trả lời đúng hết → loại bỏ khỏi danh sách sai (nếu đang ở practice mode)
        if (practiceMode.isActive) {
            const practiceIdx = practiceMode.wrongItemIndexes.indexOf(currentIndex);
            if (practiceIdx > -1) {
                practiceMode.wrongItemIndexes.splice(practiceIdx, 1);
            }
        }
    }
    
    // Hiển thị kết quả tổng hợp
    let html = `
        <div style="padding: 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 12px; text-align: center; margin-bottom: 30px;">
            <div style="font-size: 24px; font-weight: bold; margin-bottom: 10px;">
                ✅ Kết quả: ${correctCount}/${item.questions.length} câu đúng
            </div>
            <div style="font-size: 16px; opacity: 0.9;">
                ${Math.round((correctCount / item.questions.length) * 100)}% chính xác
            </div>
        </div>
    `;
    
    // Hiển thị chi tiết từng câu
    html += '<div style="margin-bottom: 30px;"><div style="font-weight: bold; font-size: 18px; margin-bottom: 15px; color: #667eea;">📊 Chi tiết từng câu:</div>';
    
    item.questions.forEach((q, idx) => {
        const isCorrect = readingPart4State.userAnswers[idx] === q.answer;
        const userAnswer = readingPart4State.userAnswers[idx];
        
        html += `
            <div style="padding: 15px; background: ${isCorrect ? '#d4edda' : '#f8d7da'}; border-radius: 8px; margin-bottom: 10px;">
                <div style="font-weight: bold; color: ${isCorrect ? '#155724' : '#721c24'};">
                    ${isCorrect ? '✅' : '❌'} Câu ${idx + 1}: ${q.question}
                </div>
                ${q.question_vi ? `<div style="margin-top: 5px; color: #666; font-style: italic;">${q.question_vi}</div>` : ''}
                <div style="margin-top: 5px; color: #333;">
                    <strong>Đáp án đúng:</strong> ${q.answer} - ${q.options[q.answer].text}
                </div>
                ${!isCorrect ? `<div style="margin-top: 5px; color: #721c24;"><strong>Bạn chọn:</strong> ${userAnswer} - ${q.options[userAnswer].text}</div>` : ''}
            </div>
        `;
    });
    
    html += '</div>';
    
    // Hiển thị text tiếng Anh, text_vi và text_summary_vi của 4 người
    html += '<div style="margin-bottom: 20px;"><div style="font-weight: bold; font-size: 18px; margin-bottom: 15px; color: #667eea;">📖 Dịch tiếng Việt & Tóm tắt:</div>';
    
    ['A', 'B', 'C', 'D'].forEach(key => {
        const person = item.people[key];
        if (person) {
            html += `
                <div style="padding: 20px; background: #f8f9fa; border-radius: 12px; border-left: 4px solid #667eea; margin-bottom: 15px;">
                    <div style="font-weight: bold; color: #667eea; margin-bottom: 15px; font-size: 16px;">
                        ${person.label || `Person ${key}`}
                    </div>
                    
                    <div style="margin-bottom: 15px;">
                        <div style="font-weight: bold; color: #333; margin-bottom: 5px;">🇬🇧 English:</div>
                        <div style="line-height: 1.8; color: #555;">
                            ${person.text}
                        </div>
                    </div>
                    
                    ${person.text_vi ? `
                        <div style="margin-bottom: 15px;">
                            <div style="font-weight: bold; color: #333; margin-bottom: 5px;">🇻🇳 Tiếng Việt:</div>
                            <div style="line-height: 1.8; color: #555;">
                                ${person.text_vi}
                            </div>
                        </div>
                    ` : ''}
                    
                    ${person.text_summary_vi ? `
                        <div style="padding: 10px; background: #fff; border-radius: 8px;">
                            <div style="font-weight: bold; color: #667eea; margin-bottom: 5px;">💡 Tóm tắt:</div>
                            <div style="line-height: 1.6; color: #555; font-style: italic;">
                                ${person.text_summary_vi}
                            </div>
                        </div>
                    ` : ''}
                </div>
            `;
        }
    });
    
    html += '</div>';
    
    optionsContainer.innerHTML = html;
    
    // Enable next button để chuyển sang item tiếp theo
    document.getElementById('nextBtn').disabled = false;
    
    // Đánh dấu đã hoàn thành
    readingPart4State.hasFinishedAll = true;
}
