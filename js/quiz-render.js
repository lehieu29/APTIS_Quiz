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
        const totalWrong = (currentQuizType === 'reading_part_2_3' || currentQuizType == 'reading_part_5' || currentQuizType === 'reading_part_4') 
            ? practiceMode.wrongItemIndexes.length 
            : practiceMode.wrongIndexes.length;
        
        const itemType = (currentQuizType === 'reading_part_2_3' || currentQuizType == 'reading_part_5' || currentQuizType === 'reading_part_4') ? 'đề' : 'câu';
        
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
    if (currentQuizType === 'reading_part_2_3' || currentQuizType === 'reading_part_5') {
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
    } else if (currentQuizType === 'speaking_part_1') {
        renderSpeakingPart1(question);
        
        // Hide buttons for speaking part 1 (use custom buttons)
        buttonContainer.classList.remove('button-grid');
        submitBtn.classList.remove('show');
        nextBtn.style.display = 'none';
        nextBtn.disabled = true;
    } else if (currentQuizType === 'writing_part_1') {
        renderWritingPart1(question);
        
        // Hide buttons for writing part 1 (use custom buttons)
        buttonContainer.classList.remove('button-grid');
        submitBtn.classList.remove('show');
        nextBtn.style.display = 'none';
        nextBtn.disabled = true;
    } else if (currentQuizType === 'writing_part_2_3_4') {
        renderWritingPart234(question);
        
        // Hide buttons for writing part 2,3,4 (use custom buttons)
        buttonContainer.classList.remove('button-grid');
        submitBtn.classList.remove('show');
        nextBtn.style.display = 'none';
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
    
    // Ẩn correct/wrong stats cho speaking/writing
    if (currentQuizType === 'speaking_part_1' || currentQuizType === 'writing_part_1' || currentQuizType === 'writing_part_2_3_4') {
        document.getElementById('correctCount').textContent = '-';
        document.getElementById('wrongCount').textContent = '-';
    } else {
        document.getElementById('correctCount').textContent = correctAnswers;
        document.getElementById('wrongCount').textContent = wrongAnswers;
    }
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
            // Dùng label từ person object (đã được shuffle) để hiển thị đúng
            html += `
                <div style="padding: 20px; background: #f8f9fa; border-radius: 12px; border-left: 4px solid #667eea;">
                    <div style="font-weight: bold; color: #667eea; margin-bottom: 10px; font-size: 16px;">
                        ${person.label}
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
                        ${person.label}
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

/**
 * ============================================
 * SPEAKING PART 1 FUNCTIONS
 * ============================================
 */

/**
 * Hiển thị modal cài đặt cho Speaking Part 1
 */
function showSpeakingSettingsModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'speakingSettingsModal';
    modal.style.display = 'flex';
    
    modal.innerHTML = `
        <div class="modal-box" style="max-width: 500px;">
            <h2 style="color: #667eea; margin-bottom: 25px;">⚙️ Cài đặt Speaking Part 1</h2>
            
            <div style="text-align: left; margin-bottom: 30px;">
                <label style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px; cursor: pointer;">
                    <input type="checkbox" id="showHintsCheckbox" checked style="width: 20px; height: 20px; cursor: pointer;">
                    <span style="font-size: 16px;">💡 Hiển thị gợi ý (suggestion)</span>
                </label>
                
                <label style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px; cursor: pointer;">
                    <input type="checkbox" id="autoNextCheckbox" style="width: 20px; height: 20px; cursor: pointer;">
                    <span style="font-size: 16px;">⏭️ Tự động chuyển câu tiếp theo</span>
                </label>
                
                <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                    <input type="checkbox" id="enableTimerCheckbox" checked style="width: 20px; height: 20px; cursor: pointer;">
                    <span style="font-size: 16px;">⏱️ Bật đếm thời gian</span>
                </label>
            </div>
            
            <div class="modal-buttons">
                <button class="modal-btn modal-btn-primary" onclick="startSpeakingPart1()">
                    🎤 Bắt đầu
                </button>
                <button class="modal-btn modal-btn-secondary" onclick="closeSpeakingSettingsModal()">
                    Hủy
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

/**
 * Đóng modal và quay về trang chủ
 */
function closeSpeakingSettingsModal() {
    const modal = document.getElementById('speakingSettingsModal');
    if (modal) {
        modal.remove();
    }
    // Reset về trang chủ
    document.getElementById('uploadSection').style.display = 'block';
    document.getElementById('quizSection').style.display = 'none';
}

/**
 * Bắt đầu Speaking Part 1 với settings đã chọn
 */
function startSpeakingPart1() {
    // Lưu settings
    speakingPart1State.settings.showHints = document.getElementById('showHintsCheckbox').checked;
    speakingPart1State.settings.autoNext = document.getElementById('autoNextCheckbox').checked;
    speakingPart1State.settings.enableTimer = document.getElementById('enableTimerCheckbox').checked;
    
    // Đóng modal
    const modal = document.getElementById('speakingSettingsModal');
    if (modal) {
        modal.remove();
    }
    
    // Reset state
    currentIndex = 0;
    speakingPart1State.userAnswers = [];
    speakingPart1State.hasSubmitted = false;
    
    // Bắt đầu quiz
    startQuiz();
}

/**
 * Render Speaking Part 1 question
 */
function renderSpeakingPart1(question) {
    const passageContainer = document.getElementById('passageContainer');
    const optionsContainer = document.getElementById('optionsContainer');
    
    // Ẩn passage container
    passageContainer.innerHTML = '';
    
    // Hiển thị câu hỏi
    document.getElementById('vnTitle').textContent = '';
    document.getElementById('questionText').innerHTML = `
        <div style="font-size: 1.3em; font-weight: bold; color: #333; margin-bottom: 20px;">
            📝 ${question.question}
        </div>
    `;
    
    // Hiển thị gợi ý (nếu bật và chưa submit)
    let html = '';
    if (speakingPart1State.settings.showHints && !speakingPart1State.hasSubmitted) {
        html += `
            <div class="suggestion-box">
                <div style="font-weight: bold; color: #f57c00; margin-bottom: 8px;">💡 Gợi ý:</div>
                <div style="color: #666;">${question.suggestion_text}</div>
            </div>
        `;
    }
    
    // Nếu đã submit, hiển thị thông tin tiếng Việt
    if (speakingPart1State.hasSubmitted) {
        html += `
            <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <div style="font-weight: bold; color: #2e7d32; margin-bottom: 8px;">🇻🇳 Câu hỏi tiếng Việt:</div>
                <div style="color: #333;">${question.question_vi}</div>
            </div>
            
            <div class="suggestion-box">
                <div style="font-weight: bold; color: #f57c00; margin-bottom: 8px;">💡 Gợi ý:</div>
                <div style="color: #666; margin-bottom: 5px;">${question.suggestion_text}</div>
                <div style="color: #999; font-style: italic;">${question.suggestion_text_vi}</div>
            </div>
        `;
    }
    
    // Hiển thị input area (nếu chưa submit)
    if (!speakingPart1State.hasSubmitted) {
        html += `
            <div class="speaking-answer-area">
                <div style="font-weight: bold; margin-bottom: 10px;">✍️ Trả lời bằng văn bản:</div>
                <textarea id="speakingTextAnswer" class="speaking-textarea" placeholder="Nhập câu trả lời của bạn ở đây..." onkeydown="handleSpeakingEnterKey(event)"></textarea>
            </div>
            
            <div class="voice-recording">
                <div style="font-weight: bold; margin-bottom: 15px;">🎤 Hoặc thu âm giọng nói:</div>
                <button id="recordBtn" class="btn" onclick="toggleRecording()">
                    🔴 Bắt đầu ghi âm
                </button>
                <div id="recordingIndicator" style="display: none;" class="recording-indicator">
                    <div class="recording-dot"></div>
                    <span style="color: #f44336; font-weight: bold;">Đang ghi âm...</span>
                </div>
                <audio id="audioPlayback" class="audio-player" controls style="display: none;"></audio>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
                <button class="btn btn-primary" onclick="submitSpeakingAnswer()" style="font-size: 18px; padding: 15px 40px;">
                    📤 Submit
                </button>
                <div style="font-size: 12px; color: #999; margin-top: 10px;">
                    💡 Tip: Nhấn <kbd>Enter</kbd> để submit nhanh
                </div>
            </div>
        `;
    } else {
        // Hiển thị câu trả lời đã submit
        const userAnswer = speakingPart1State.userAnswers[currentIndex];
        html += `
            <div style="background: #f8f9ff; padding: 20px; border-radius: 12px; margin: 20px 0; border-left: 4px solid #667eea;">
                <div style="font-weight: bold; color: #667eea; margin-bottom: 10px;">✅ Câu trả lời của bạn:</div>
                <div style="color: #333;">
                    ${userAnswer.type === 'text' ? userAnswer.content : '🎤 <i>Audio recorded</i>'}
                </div>
                ${userAnswer.type === 'audio' ? `<audio controls class="audio-player"><source src="${userAnswer.content}" type="audio/webm"></audio>` : ''}
            </div>
            
            <div class="sample-answer-box">
                <strong>📖 Sample Answer (English):</strong>
                ${question.sample_answer}
            </div>
            
            <div class="sample-answer-box" style="border-left-color: #4caf50;">
                <strong>🇻🇳 Sample Answer (Tiếng Việt):</strong>
                ${question.sample_answer_vi}
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
                <button class="btn btn-primary" onclick="nextSpeakingQuestion()" style="font-size: 18px; padding: 15px 40px;">
                    ${currentIndex < questions.length - 1 ? '➡️ Câu tiếp theo' : '🏁 Hoàn thành'}
                </button>
            </div>
        `;
    }
    
    optionsContainer.innerHTML = html;
    
    // Bắt đầu timer nếu chưa submit và có bật timer
    if (!speakingPart1State.hasSubmitted && speakingPart1State.settings.enableTimer) {
        startSpeakingTimer(question.time);
    } else {
        // Ẩn timer nếu đã submit
        hideSpeakingTimer();
    }
}

/**
 * Bắt đầu circular timer
 */
function startSpeakingTimer(duration) {
    speakingPart1State.timeLeft = duration;
    
    // Tạo timer HTML nếu chưa có
    let timerDiv = document.getElementById('speakingTimer');
    if (!timerDiv) {
        timerDiv = document.createElement('div');
        timerDiv.id = 'speakingTimer';
        timerDiv.className = 'speaking-timer';
        document.body.appendChild(timerDiv);
    }
    
    const radius = 71; // 150/2 - 8 (stroke width)
    const circumference = 2 * Math.PI * radius;
    
    timerDiv.innerHTML = `
        <div class="timer-circle">
            <svg class="timer-svg">
                <circle class="timer-circle-bg" cx="75" cy="75" r="${radius}"></circle>
                <circle class="timer-circle-progress" cx="75" cy="75" r="${radius}"
                    stroke-dasharray="${circumference}"
                    stroke-dashoffset="0"></circle>
            </svg>
            <div class="timer-text">${duration}</div>
        </div>
    `;
    
    timerDiv.style.display = 'block';
    
    // Clear timer cũ nếu có
    if (speakingPart1State.currentTimer) {
        clearInterval(speakingPart1State.currentTimer);
    }
    
    // Bắt đầu đếm ngược
    const progressCircle = timerDiv.querySelector('.timer-circle-progress');
    const timerText = timerDiv.querySelector('.timer-text');
    
    speakingPart1State.currentTimer = setInterval(() => {
        speakingPart1State.timeLeft--;
        
        // Update text
        timerText.textContent = speakingPart1State.timeLeft;
        
        // Update circle progress
        const progress = speakingPart1State.timeLeft / duration;
        const offset = circumference * (1 - progress);
        progressCircle.style.strokeDashoffset = offset;
        
        // Đổi màu khi sắp hết giờ
        if (speakingPart1State.timeLeft <= 5) {
            progressCircle.style.stroke = '#f44336';
            timerText.style.color = '#f44336';
        }
        
        // Hết giờ
        if (speakingPart1State.timeLeft <= 0) {
            clearInterval(speakingPart1State.currentTimer);
            speakingPart1State.currentTimer = null;
            
            // Tự động chuyển câu nếu bật
            if (speakingPart1State.settings.autoNext && !speakingPart1State.hasSubmitted) {
                autoSubmitSpeakingAnswer();
            }
        }
    }, 1000);
}

/**
 * Ẩn timer
 */
function hideSpeakingTimer() {
    const timerDiv = document.getElementById('speakingTimer');
    if (timerDiv) {
        timerDiv.style.display = 'none';
    }
    
    if (speakingPart1State.currentTimer) {
        clearInterval(speakingPart1State.currentTimer);
        speakingPart1State.currentTimer = null;
    }
}

/**
 * Hiển thị màn hình hoàn thành Speaking Part 1
 */
function showSpeakingCompletion() {
    document.getElementById('quizSection').style.display = 'none';
    const completionScreen = document.getElementById('completionScreen');
    completionScreen.classList.add('show');
    
    // Ẩn timer
    hideSpeakingTimer();
    
    // Build completion HTML
    let html = `
        <div class="speaking-completion">
            <h2 style="color: #667eea; margin-bottom: 30px;">🎉 Hoàn thành Speaking Part 1!</h2>
            
            <div style="margin-bottom: 30px;">
                <h3 style="color: #333; margin-bottom: 20px;">📋 Tổng hợp câu hỏi & đáp án:</h3>
    `;
    
    questions.forEach((q, idx) => {
        const answer = speakingPart1State.userAnswers[idx];
        html += `
            <div class="answer-item">
                <div class="answer-item-question">
                    Câu ${idx + 1}: ${q.question}
                </div>
                <div class="answer-item-answer">
                    ${answer.type === 'text' ? answer.content : '🎤 <i>Audio recorded</i>'}
                </div>
            </div>
        `;
    });
    
    html += `
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
                <button class="copy-btn" onclick="copySpeakingAnswers()">
                    📋 Copy tất cả để gửi AI chấm
                </button>
            </div>
            
            <div style="text-align: center; margin-top: 20px;">
                <button class="btn" onclick="location.reload()">🏠 Về trang chủ</button>
            </div>
        </div>
    `;
    
    document.getElementById('finalScore').innerHTML = html;
}

/**
 * ============================================
 * WRITING PART 1 FUNCTIONS
 * ============================================
 */

/**
 * Hiển thị modal cài đặt cho Writing Part 1 (đơn giản hơn Speaking)
 */
function showWritingSettingsModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'writingSettingsModal';
    modal.style.display = 'flex';
    
    modal.innerHTML = `
        <div class="modal-box" style="max-width: 450px;">
            <h2 style="color: #667eea; margin-bottom: 25px;">⚙️ Cài đặt Writing Part 1</h2>
            
            <div style="text-align: left; margin-bottom: 30px;">
                <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                    <input type="checkbox" id="writingShowHintsCheckbox" checked style="width: 20px; height: 20px; cursor: pointer;">
                    <span style="font-size: 16px;">💡 Hiển thị gợi ý (suggestion)</span>
                </label>
            </div>
            
            <div class="modal-buttons">
                <button class="modal-btn modal-btn-primary" onclick="startWritingPart1()">
                    ✍️ Bắt đầu
                </button>
                <button class="modal-btn modal-btn-secondary" onclick="closeWritingSettingsModal()">
                    Hủy
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

/**
 * Đóng modal Writing và quay về trang chủ
 */
function closeWritingSettingsModal() {
    const modal = document.getElementById('writingSettingsModal');
    if (modal) {
        modal.remove();
    }
    document.getElementById('uploadSection').style.display = 'block';
    document.getElementById('quizSection').style.display = 'none';
}

/**
 * Bắt đầu Writing Part 1
 */
function startWritingPart1() {
    // Lưu settings
    writingPart1State.settings.showHints = document.getElementById('writingShowHintsCheckbox').checked;
    
    // Đóng modal
    const modal = document.getElementById('writingSettingsModal');
    if (modal) {
        modal.remove();
    }
    
    // Reset state
    currentIndex = 0;
    writingPart1State.userAnswers = [];
    writingPart1State.hasSubmitted = false;
    
    // Bắt đầu quiz
    startQuiz();
}

/**
 * Render Writing Part 1 question (giống Speaking nhưng không có timer và voice)
 */
function renderWritingPart1(question) {
    const passageContainer = document.getElementById('passageContainer');
    const optionsContainer = document.getElementById('optionsContainer');
    
    // Ẩn passage container
    passageContainer.innerHTML = '';
    
    // Hiển thị câu hỏi
    document.getElementById('vnTitle').textContent = '';
    document.getElementById('questionText').innerHTML = `
        <div style="font-size: 1.3em; font-weight: bold; color: #333; margin-bottom: 20px;">
            📝 ${question.question}
        </div>
    `;
    
    // Hiển thị gợi ý (nếu bật và chưa submit)
    let html = '';
    if (writingPart1State.settings.showHints && !writingPart1State.hasSubmitted) {
        html += `
            <div class="suggestion-box">
                <div style="font-weight: bold; color: #f57c00; margin-bottom: 8px;">💡 Gợi ý:</div>
                <div style="color: #666;">${question.suggestion_text}</div>
            </div>
        `;
    }
    
    // Nếu đã submit, hiển thị thông tin tiếng Việt
    if (writingPart1State.hasSubmitted) {
        html += `
            <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <div style="font-weight: bold; color: #2e7d32; margin-bottom: 8px;">🇻🇳 Câu hỏi tiếng Việt:</div>
                <div style="color: #333;">${question.question_vi}</div>
            </div>
            
            <div class="suggestion-box">
                <div style="font-weight: bold; color: #f57c00; margin-bottom: 8px;">💡 Gợi ý:</div>
                <div style="color: #666; margin-bottom: 5px;">${question.suggestion_text}</div>
                <div style="color: #999; font-style: italic;">${question.suggestion_text_vi}</div>
            </div>
        `;
    }
    
    // Hiển thị input area (nếu chưa submit)
    if (!writingPart1State.hasSubmitted) {
        html += `
            <div class="speaking-answer-area">
                <div style="font-weight: bold; margin-bottom: 10px;">✍️ Câu trả lời của bạn:</div>
                <textarea id="writingTextAnswer" class="speaking-textarea" placeholder="Nhập câu trả lời của bạn ở đây..." onkeydown="handleWritingEnterKey(event)"></textarea>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
                <button class="btn btn-primary" onclick="submitWritingAnswer()" style="font-size: 18px; padding: 15px 40px;">
                    📤 Submit
                </button>
                <div style="font-size: 12px; color: #999; margin-top: 10px;">
                    💡 Tip: Nhấn <kbd>Enter</kbd> để submit nhanh
                </div>
            </div>
        `;
    } else {
        // Hiển thị câu trả lời đã submit
        const userAnswer = writingPart1State.userAnswers[currentIndex];
        html += `
            <div style="background: #f8f9ff; padding: 20px; border-radius: 12px; margin: 20px 0; border-left: 4px solid #667eea;">
                <div style="font-weight: bold; color: #667eea; margin-bottom: 10px;">✅ Câu trả lời của bạn:</div>
                <div style="color: #333;">${userAnswer}</div>
            </div>
            
            <div class="sample-answer-box">
                <strong>📖 Sample Answer (English):</strong>
                ${question.sample_answer}
            </div>
            
            <div class="sample-answer-box" style="border-left-color: #4caf50;">
                <strong>🇻🇳 Sample Answer (Tiếng Việt):</strong>
                ${question.sample_answer_vi}
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
                <button class="btn btn-primary" onclick="nextWritingQuestion()" style="font-size: 18px; padding: 15px 40px;">
                    ${currentIndex < questions.length - 1 ? '➡️ Câu tiếp theo' : '🏁 Hoàn thành'}
                </button>
            </div>
        `;
    }
    
    optionsContainer.innerHTML = html;
}

/**
 * Hiển thị màn hình hoàn thành Writing Part 1
 */
function showWritingCompletion() {
    document.getElementById('quizSection').style.display = 'none';
    const completionScreen = document.getElementById('completionScreen');
    completionScreen.classList.add('show');
    
    // Build completion HTML
    let html = `
        <div class="speaking-completion">
            <h2 style="color: #667eea; margin-bottom: 30px;">🎉 Hoàn thành Writing Part 1!</h2>
            
            <div style="margin-bottom: 30px;">
                <h3 style="color: #333; margin-bottom: 20px;">📋 Tổng hợp câu hỏi & đáp án:</h3>
    `;
    
    questions.forEach((q, idx) => {
        const answer = writingPart1State.userAnswers[idx];
        html += `
            <div class="answer-item">
                <div class="answer-item-question">
                    Câu ${idx + 1}: ${q.question}
                </div>
                <div class="answer-item-answer">
                    ${answer || '[Không có câu trả lời]'}
                </div>
            </div>
        `;
    });
    
    html += `
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
                <button class="copy-btn" onclick="copyWritingAnswers()">
                    📋 Copy tất cả để gửi AI chấm
                </button>
            </div>
            
            <div style="text-align: center; margin-top: 20px;">
                <button class="btn" onclick="location.reload()">🏠 Về trang chủ</button>
            </div>
        </div>
    `;
    
    document.getElementById('finalScore').innerHTML = html;
}

/**
 * ============================================
 * WRITING PART 2, 3, 4 FUNCTIONS
 * ============================================
 */

/**
 * Hiển thị modal cài đặt cho Writing Part 2, 3, 4
 */
function showWritingPart234SettingsModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'writingPart234SettingsModal';
    modal.style.display = 'flex';
    
    modal.innerHTML = `
        <div class="modal-box" style="max-width: 500px;">
            <h2 style="color: #667eea; margin-bottom: 25px;">⚙️ Cài đặt Writing Part 2, 3, 4</h2>
            
            <div class="setting-group">
                <label>
                    <input type="checkbox" id="showFormatCheckbox" checked>
                    <div class="setting-text">
                        <span class="setting-title">📝 Hiển thị gợi ý format</span>
                        <span class="setting-desc">Hiển thị mẫu câu trả lời với [PLACEHOLDER]</span>
                    </div>
                </label>
                
                <label>
                    <input type="checkbox" id="showKeywordsCheckbox">
                    <div class="setting-text">
                        <span class="setting-title">🔑 Hiển thị từ khóa gợi ý</span>
                        <span class="setting-desc">Hiển thị nội dung điền vào [PLACEHOLDER]</span>
                    </div>
                </label>
            </div>
            
            <div style="background: #f8f9ff; padding: 15px; border-radius: 10px; margin-bottom: 20px;">
                <div style="font-size: 0.9em; color: #666;">
                    📊 <strong>${writingPart234State.allClubs.length}</strong> CLB có sẵn
                </div>
            </div>
            
            <div class="modal-buttons">
                <button class="modal-btn modal-btn-primary" onclick="startWritingPart234()">
                    📝 Bắt đầu
                </button>
                <button class="modal-btn modal-btn-secondary" onclick="closeWritingPart234SettingsModal()">
                    Hủy
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

/**
 * Đóng modal và quay về trang chủ
 */
function closeWritingPart234SettingsModal() {
    const modal = document.getElementById('writingPart234SettingsModal');
    if (modal) modal.remove();
    document.getElementById('uploadSection').style.display = 'block';
    document.getElementById('quizSection').style.display = 'none';
}

/**
 * Bắt đầu Writing Part 2, 3, 4
 */
function startWritingPart234() {
    // Lưu settings
    writingPart234State.settings.showFormat = document.getElementById('showFormatCheckbox').checked;
    writingPart234State.settings.showKeywords = document.getElementById('showKeywordsCheckbox').checked;
    
    // Đóng modal
    const modal = document.getElementById('writingPart234SettingsModal');
    if (modal) modal.remove();
    
    // Shuffle CLB theo priority
    writingPart234State.allClubs = shuffleByPriority(writingPart234State.allClubs);
    
    // Reset state
    writingPart234State.currentClubIndex = 0;
    writingPart234State.userAnswers = {};
    
    // Load CLB đầu tiên
    loadClub(0);
}

/**
 * Load một CLB và flatten câu hỏi
 */
function loadClub(clubIndex) {
    const club = writingPart234State.allClubs[clubIndex];
    writingPart234State.currentClub = club;
    writingPart234State.currentClubIndex = clubIndex;
    writingPart234State.currentPartIndex = 0;
    writingPart234State.hasSubmitted = false;
    
    // Khởi tạo userAnswers cho CLB này
    if (!writingPart234State.userAnswers[club.club_name]) {
        writingPart234State.userAnswers[club.club_name] = {};
    }
    
    // Flatten câu hỏi thành danh sách
    const questionsList = [];
    
    // Part 2 (1 câu)
    questionsList.push({
        part: 'part_2',
        partLabel: 'Part 2',
        data: club.content.part_2,
        key: 'part2'
    });
    
    // Part 3 (nhiều câu)
    if (club.content.part_3 && Array.isArray(club.content.part_3)) {
        club.content.part_3.forEach((item, idx) => {
            questionsList.push({
                part: 'part_3',
                partLabel: `Part 3 - Speaker ${item.speaker}`,
                speaker: item.speaker,
                type: item.type,
                data: item,
                key: `part3${item.speaker}`
            });
        });
    }
    
    // Part 4 (2 task)
    if (club.content.part_4) {
        const part4 = club.content.part_4;
        
        if (part4.task_1_friend) {
            questionsList.push({
                part: 'part_4',
                partLabel: 'Part 4 - Task 1',
                taskType: 'friend',
                context: part4.context,
                context_vi: part4.context_vi,
                data: part4.task_1_friend,
                key: 'part4Task1'
            });
        }
        
        if (part4.task_2_manager) {
            questionsList.push({
                part: 'part_4',
                partLabel: 'Part 4 - Task 2',
                taskType: 'manager',
                context: part4.context,
                context_vi: part4.context_vi,
                data: part4.task_2_manager,
                key: 'part4Task2'
            });
        }
    }
    
    writingPart234State.questionsList = questionsList;
    writingPart234State.totalQuestions = questionsList.length;
    
    // Update questions array cho compatibility
    questions = questionsList;
    currentIndex = 0;
    
    // Bắt đầu quiz
    startQuiz();
}

/**
 * Render Writing Part 2, 3, 4 question
 */
function renderWritingPart234(questionData) {
    const club = writingPart234State.currentClub;
    const q = questionData;
    const data = q.data;
    
    const passageContainer = document.getElementById('passageContainer');
    const optionsContainer = document.getElementById('optionsContainer');
    
    // Clear passage
    passageContainer.innerHTML = '';
    
    // Club header
    document.getElementById('vnTitle').textContent = '';
    document.getElementById('questionText').innerHTML = `
        <div class="club-header">
            <div class="club-name">🏷️ ${club.club_name}</div>
            <div class="club-progress">Câu ${currentIndex + 1}/${writingPart234State.totalQuestions}</div>
        </div>
    `;
    
    let html = '';
    
    // Part indicator
    let partClass = q.part.replace('_', '-');
    html += `<span class="part-indicator ${partClass}">${q.partLabel}</span>`;
    
    // Speaker badge cho Part 3 (type badge chỉ hiển thị sau submit)
    if (q.part === 'part_3' && q.speaker) {
        html += `<span class="speaker-badge">${q.speaker}</span>`;
        // Chỉ hiển thị type badge sau khi submit
        if (q.type && hasSubmitted) {
            const typeClass = q.type.toLowerCase();
            html += `<span class="type-badge ${typeClass}">${q.type}</span>`;
        }
    }
    
    // Task label cho Part 4
    if (q.part === 'part_4') {
        const taskClass = q.taskType === 'friend' ? 'friend' : 'manager';
        const taskLabel = q.taskType === 'friend' ? '📧 Email to Friend' : '📧 Email to Manager';
        html += `<div class="task-label ${taskClass}">${taskLabel}</div>`;
    }
    
    // Context box cho Part 4
    if (q.part === 'part_4' && q.context) {
        html += `
            <div class="context-box">
                <div class="context-label">📌 Tình huống:</div>
                <div class="context-text">${q.context}</div>
                ${q.context_vi ? `<div class="context-text" style="color: #888; font-style: italic; margin-top: 5px;">${q.context_vi}</div>` : ''}
            </div>
        `;
    }
    
    // Question
    html += `
        <div style="font-size: 1.1em; font-weight: bold; color: #333; margin: 20px 0; line-height: 1.6;">
            📝 ${data.question || ''}
        </div>
    `;
    
    // Nếu đã submit
    if (writingPart234State.hasSubmitted) {
        // Question VI
        if (data.question_vi) {
            html += `
                <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                    <div style="font-weight: bold; color: #2e7d32; margin-bottom: 8px;">🇻🇳 Câu hỏi tiếng Việt:</div>
                    <div style="color: #333;">${data.question_vi}</div>
                </div>
            `;
        }
        
        // User answer
        const userAnswer = writingPart234State.userAnswers[club.club_name][q.key] || '';
        html += `
            <div style="background: #f8f9ff; padding: 20px; border-radius: 12px; margin: 20px 0; border-left: 4px solid #667eea;">
                <div style="font-weight: bold; color: #667eea; margin-bottom: 10px;">✅ Câu trả lời của bạn:</div>
                <div style="color: #333; white-space: pre-line;">${userAnswer}</div>
            </div>
        `;
        
        // Format hint (always show after submit)
        if (data.suggested_answer_format) {
            html += `
                <div class="format-hint-box">
                    <div class="format-label">📖 Gợi ý format (EN):</div>
                    <div class="format-text">${data.suggested_answer_format}</div>
                </div>
            `;
        }
        if (data.suggested_answer_format_vi) {
            html += `
                <div class="format-hint-box" style="border-left-color: #4caf50; background: #e8f5e9;">
                    <div class="format-label" style="color: #2e7d32;">🇻🇳 Gợi ý format (VI):</div>
                    <div class="format-text" style="color: #1b5e20;">${data.suggested_answer_format_vi}</div>
                </div>
            `;
        }
        
        // Keywords (always show after submit)
        if (data.suggested_answer_text) {
            html += renderKeywordList(data.suggested_answer_text, 'EN');
        }
        if (data.suggested_answer_text_vi) {
            html += renderKeywordList(data.suggested_answer_text_vi, 'VI');
        }
        
        // Next button
        const isLastQuestion = currentIndex >= writingPart234State.totalQuestions - 1;
        html += `
            <div style="text-align: center; margin-top: 30px;">
                <button class="btn btn-primary" onclick="nextWritingPart234Question()" style="font-size: 18px; padding: 15px 40px;">
                    ${isLastQuestion ? '🏁 Hoàn thành CLB' : '➡️ Câu tiếp theo'}
                </button>
            </div>
        `;
    } else {
        // Chưa submit - hiển thị hints nếu bật
        if (writingPart234State.settings.showFormat && data.suggested_answer_format) {
            html += `
                <div class="format-hint-box">
                    <div class="format-label">💡 Gợi ý format:</div>
                    <div class="format-text">${data.suggested_answer_format}</div>
                </div>
            `;
        }
        
        if (writingPart234State.settings.showKeywords && data.suggested_answer_text) {
            html += renderKeywordList(data.suggested_answer_text, 'Từ khóa');
        }
        
        // Textarea
        html += `
            <div class="speaking-answer-area">
                <div style="font-weight: bold; margin-bottom: 10px;">✍️ Câu trả lời của bạn:</div>
                <textarea id="writingPart234Answer" class="speaking-textarea" 
                    placeholder="Nhập câu trả lời của bạn ở đây..." 
                    oninput="updateWordCount()"
                    onkeydown="handleWritingPart234EnterKey(event)"></textarea>
                <div class="word-counter">
                    <span class="count">📊 <span id="wordCount">0</span> từ</span>
                    <span class="hint">Nhấn Enter để submit</span>
                </div>
            </div>
            
            <div style="text-align: center; margin-top: 20px;">
                <button class="btn btn-primary" onclick="submitWritingPart234Answer()" style="font-size: 18px; padding: 15px 40px;">
                    📤 Submit
                </button>
            </div>
        `;
    }
    
    optionsContainer.innerHTML = html;
}

/**
 * Render keyword list
 */
function renderKeywordList(keywords, label) {
    let html = `
        <div class="keyword-list">
            <div class="keyword-label">🔑 ${label}:</div>
    `;
    
    for (const [key, value] of Object.entries(keywords)) {
        html += `
            <div class="keyword-item">
                <span class="key">[${key}]</span>
                <span class="value">${value}</span>
            </div>
        `;
    }
    
    html += '</div>';
    return html;
}

/**
 * Update word count real-time
 */
function updateWordCount() {
    const textarea = document.getElementById('writingPart234Answer');
    if (!textarea) return;
    
    const text = textarea.value.trim();
    const wordCount = text.length === 0 ? 0 : text.split(/\s+/).filter(w => w.length > 0).length;
    
    const countElement = document.getElementById('wordCount');
    if (countElement) {
        countElement.textContent = wordCount;
    }
}

/**
 * Hiển thị màn hình hoàn thành CLB
 */
function showClubCompletion() {
    const club = writingPart234State.currentClub;
    const answers = writingPart234State.userAnswers[club.club_name];
    const questionsList = writingPart234State.questionsList;
    
    document.getElementById('quizSection').style.display = 'none';
    const completionScreen = document.getElementById('completionScreen');
    completionScreen.classList.add('show');
    
    let html = `
        <div class="club-completion">
            <h2>🎉 Hoàn thành!</h2>
            <div class="club-name-display">${club.club_name}</div>
            
            <div class="answer-summary">
                <h3 style="color: #333; margin-bottom: 20px;">📋 Tổng hợp câu hỏi & đáp án:</h3>
    `;
    
    questionsList.forEach((q, idx) => {
        const answer = answers[q.key] || '[Không có câu trả lời]';
        html += `
            <div class="answer-summary-item">
                <div class="part-label">${q.partLabel}</div>
                <div class="question-text">${q.data.question || ''}</div>
                <div class="user-answer">${answer}</div>
            </div>
        `;
    });
    
    const hasMoreClubs = writingPart234State.currentClubIndex < writingPart234State.allClubs.length - 1;
    
    html += `
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
                <button class="copy-btn" onclick="copyWritingPart234Answers()">
                    📋 Copy tất cả để gửi AI chấm
                </button>
            </div>
            
            <div class="club-nav-buttons">
                ${hasMoreClubs ? `
                    <button class="btn btn-primary" onclick="nextClub()">
                        ➡️ CLB tiếp theo
                    </button>
                ` : ''}
                <button class="btn" onclick="location.reload()">🏠 Về trang chủ</button>
            </div>
        </div>
    `;
    
    document.getElementById('finalScore').innerHTML = html;
}
