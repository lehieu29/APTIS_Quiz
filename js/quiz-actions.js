// ============================================
// QUIZ-ACTIONS.JS - Các hành động trong Quiz
// ============================================

/**
 * Kiểm tra câu trả lời (cho default quiz)
 */
function checkAnswer(selectedAnswer) {
    if (answered) return;
    answered = true;

    const question = questions[currentIndex];
    const isCorrect = selectedAnswer === question.answer;
    
    if (isCorrect) {
        correctAnswers++;
    } else {
        wrongAnswers++;
    }
    updateStats();

    document.getElementById('vnTitle').classList.add('show');

    const buttons = document.querySelectorAll('.option-btn');
    buttons.forEach((btn, index) => {
        btn.disabled = true;
        const key = Object.keys(question.options)[index];
        
        const optionViElement = btn.querySelector('.option-vi');
        if (optionViElement && optionViElement.textContent.trim()) {
            optionViElement.classList.add('show');
        }
        
        if (key === question.answer) {
            btn.classList.add('correct');
        } else if (key === selectedAnswer && !isCorrect) {
            btn.classList.add('wrong');
        }
    });

    const resultBox = document.getElementById('resultBox');
    resultBox.classList.add('show');
    resultBox.className = 'result-box show ' + (isCorrect ? 'correct' : 'wrong');
    
    document.getElementById('resultIcon').textContent = isCorrect ? '✅' : '❌';
    document.getElementById('resultText').textContent = isCorrect ? 'Chính xác!' : 'Chưa đúng!';
    
    const correctOption = question.options[question.answer];
    const correctViText = correctOption.vi ? ` (${correctOption.vi})` : '';
    document.getElementById('correctAnswer').innerHTML = 
        `<strong>Đáp án đúng:</strong> ${question.answer}. ${correctOption.text}${correctViText}`;
    
    if (question.question_vi) {
        document.getElementById('questionVi').innerHTML = 
            `<strong>Câu hỏi tiếng Việt:</strong> ${question.question_vi}`;
    } else {
        document.getElementById('questionVi').innerHTML = '';
    }
    
    document.getElementById('nextBtn').disabled = false;
}

/**
 * Kiểm tra câu trả lời cho Listening Part 3
 */
function checkAnswerListening(selectedAnswer) {
    if (answered) return;
    answered = true;

    const question = questions[currentIndex];
    const isCorrect = selectedAnswer === question.answer;
    
    if (isCorrect) {
        correctAnswers++;
    } else {
        wrongAnswers++;
    }
    updateStats();

    document.getElementById('vnTitle').classList.add('show');

    const buttons = document.querySelectorAll('.option-btn');
    buttons.forEach((btn, index) => {
        btn.disabled = true;
        const key = Object.keys(question.options)[index];
        
        const optionViElement = btn.querySelector('.option-vi');
        if (optionViElement && optionViElement.textContent.trim()) {
            optionViElement.classList.add('show');
        }
        
        if (key === question.answer) {
            btn.classList.add('correct');
        } else if (key === selectedAnswer && !isCorrect) {
            btn.classList.add('wrong');
        }
    });

    const resultBox = document.getElementById('resultBox');
    resultBox.classList.add('show');
    resultBox.className = 'result-box show ' + (isCorrect ? 'correct' : 'wrong');
    
    document.getElementById('resultIcon').textContent = isCorrect ? '✅' : '❌';
    document.getElementById('resultText').textContent = isCorrect ? 'Chính xác!' : 'Chưa đúng!';
    
    const correctOption = question.options[question.answer];
    const correctViText = correctOption.vi ? ` (${correctOption.vi})` : '';
    
    // Hiển thị đáp án đúng
    let answerHTML = `<strong>Đáp án đúng:</strong> ${question.answer}. ${correctOption.text}${correctViText}`;
    
    // Hiển thị audio_text
    if (question.audio_text) {
        answerHTML += `<br><br><strong>📝 Transcript:</strong><br>${question.audio_text}`;
    }

    // Hiển thị audio_text_vi và audio_summary_vi nếu có
    if (question.audio_text_vi) {
        answerHTML += `<br><br><strong>📝 Transcript (Tiếng Việt):</strong><br>${question.audio_text_vi}`;
    }
    
    if (question.audio_summary_vi) {
        answerHTML += `<br><br><strong>💡 Tóm tắt:</strong> ${question.audio_summary_vi}`;
    }
    
    document.getElementById('correctAnswer').innerHTML = answerHTML;
    document.getElementById('questionVi').innerHTML = '';
    
    document.getElementById('nextBtn').disabled = false;
}

/**
 * Submit answer (cho Reading Part 2-3)
 */
function submitAnswer() {
    if (hasSubmitted) return;
    hasSubmitted = true;
    
    const question = questions[currentIndex];
    
    // Lấy thứ tự hiện tại của user
    const items = document.querySelectorAll('.sortable-item');
    userAnswerOrder = Array.from(items).map(item => 
        parseInt(item.dataset.originalNumber)
    );
    
    // So sánh với đáp án đúng
    const correctAnswer = question.answer;
    const isCorrect = JSON.stringify(userAnswerOrder) === JSON.stringify(correctAnswer);
    
    if (isCorrect) {
        correctAnswers++;
    } else {
        wrongAnswers++;
    }
    updateStats();
    
    // Hiển thị tiếng Việt và đánh dấu đúng/sai
    document.getElementById('vnTitle').classList.add('show');
    items.forEach((item, index) => {
        const viElement = item.querySelector('.item-vi');
        if (viElement && viElement.textContent.trim()) {
            viElement.classList.add('show');
        }
        
        // Đánh dấu đúng/sai
        const currentPos = index + 1; // Vị trí hiện tại (1-indexed)
        const originalNum = parseInt(item.dataset.originalNumber);
        const correctPos = correctAnswer.indexOf(originalNum) + 1; // Vị trí đúng (1-indexed)
        
        if (currentPos === correctPos) {
            item.classList.add('correct');
        } else {
            item.classList.add('wrong');
        }
        
        // Disable dragging
        item.draggable = false;
        item.style.cursor = 'default';
    });
    
    // Hiển thị fixed sentence với tiếng Việt
    const fixedSentence = document.querySelector('.fixed-sentence');
    if (fixedSentence && question.fixed.vi) {
        fixedSentence.innerHTML += `
            <div class="item-vi show" style="margin-top: 10px;">${question.fixed.vi}</div>
        `;
    }
    
    // Hiển thị result box
    const resultBox = document.getElementById('resultBox');
    resultBox.classList.add('show');
    resultBox.className = 'result-box show ' + (isCorrect ? 'correct' : 'wrong');
    
    document.getElementById('resultIcon').textContent = isCorrect ? '✅' : '❌';
    document.getElementById('resultText').textContent = isCorrect ? 'Chính xác!' : 'Chưa đúng!';
    
    // Hiển thị đáp án đúng
    const correctOrderText = correctAnswer.map((num, idx) => 
        `${idx + 1}. Câu ${num}`
    ).join(' → ');
    
    const userOrderText = userAnswerOrder.map((num, idx) => 
        `${idx + 1}. Câu ${num}`
    ).join(' → ');
    
    document.getElementById('correctAnswer').innerHTML = 
        `<strong>Thứ tự đúng:</strong> ${correctOrderText}<br>
         <strong>Thứ tự của bạn:</strong> ${userOrderText}`;
    
    document.getElementById('questionVi').innerHTML = '';
    
    // Enable next button
    document.getElementById('submitBtn').disabled = true;
    document.getElementById('nextBtn').disabled = false;
}

/**
 * Chuyển sang câu tiếp theo
 */
function nextQuestion() {
    // Nếu là reading_part_2_3 và chưa submit, thì submit trước
    if (currentQuizType === 'reading_part_2_3' && !hasSubmitted) {
        submitAnswer();
        return; // Không chuyển sang câu tiếp theo
    }
    
    currentIndex++;
    renderQuestion();
}

/**
 * Trộn câu hỏi
 */
function shuffleQuestions() {
    showModal({
        icon: '🔀',
        title: 'Trộn câu hỏi',
        message: 'Bạn có chắc muốn trộn ngẫu nhiên câu hỏi? Tiến độ hiện tại sẽ bị mất.',
        confirmText: 'Trộn ngay',
        cancelText: 'Hủy bỏ'
    }).then(confirmed => {
        if (confirmed) {
            questions = shuffleAnswers(questions);
            currentIndex = 0;
            correctAnswers = 0;
            wrongAnswers = 0;
            updateStats();
            renderQuestion();
        }
    });
}

/**
 * Reset quiz
 */
function resetQuiz() {
    showModal({
        icon: '🔄',
        title: 'Làm mới Quiz',
        message: 'Bạn có chắc muốn làm mới và tải file mới? Tất cả tiến độ sẽ bị xóa.',
        confirmText: 'Làm mới',
        cancelText: 'Hủy bỏ'
    }).then(confirmed => {
        if (confirmed) {
            questions = [];
            allPassages = [];
            currentIndex = 0;
            currentPassageIndex = 0;
            correctAnswers = 0;
            wrongAnswers = 0;
            isMultiPassageFormat = false;
            document.getElementById('quizSection').style.display = 'none';
            document.getElementById('completionScreen').classList.remove('show');
            document.getElementById('uploadSection').style.display = 'block';
            document.getElementById('fileInput').value = '';
            updateStats();
        }
    });
}

/**
 * Restart quiz
 */
function restartQuiz() {
    currentIndex = 0;
    correctAnswers = 0;
    wrongAnswers = 0;
    document.getElementById('completionScreen').classList.remove('show');
    document.getElementById('quizSection').style.display = 'block';
    updateStats();
    renderQuestion();
}

/**
 * Shuffle và restart
 */
function shuffleAndRestart() {
    questions = questions.sort(() => Math.random() - 0.5);
    restartQuiz();
}

/**
 * Shuffle answers (trộn đáp án)
 */
function shuffleAnswers(questions) {
    // Kiểm tra xem có phải reading_part_2_3 không
    const isReadingPart23 = questions.every(q => 
        q.type === 'reading_part_2_3' && q.fixed && q.items && q.answer
    );

    if (isReadingPart23) {
        // Xử lý riêng cho reading_part_2_3
        return questions.map(q => {
            // Trộn items
            const shuffledItems = [...q.items].sort(() => Math.random() - 0.5);
            
            // Cập nhật lại number cho items theo vị trí mới
            const newItems = shuffledItems.map((item, index) => ({
                ...item,
                number: index + 1 // Đánh lại số từ 1 đến n
            }));
            
            // Tạo mapping: originalNumber -> newNumber
            const numberMapping = {};
            shuffledItems.forEach((item, index) => {
                numberMapping[item.number] = index + 1;
            });
            
            // Cập nhật answer theo mapping
            const newAnswer = q.answer.map(origNum => numberMapping[origNum]);
            
            return {
                ...q,
                items: newItems,
                originalAnswer: q.answer, // Lưu answer gốc
                answer: newAnswer
            };
        }).sort(() => Math.random() - 0.5);
    }

    // Kiểm tra định dạng câu hỏi thường (hỗ trợ cả question và audio)
    const isValidFormat = questions.every(q => {
        return q.id && 
               (q.question || q.audio) && // Hỗ trợ cả question (default) và audio (listening)
               q.options && 
               typeof q.options === 'object' &&
               q.answer &&
               q.options[q.answer]; // Kiểm tra đáp án có tồn tại trong options
    });

    // Nếu không đúng định dạng, chỉ trộn câu hỏi theo cách cũ
    if (!isValidFormat) {
        return questions.sort(() => Math.random() - 0.5);
    }

    // Trộn cả câu hỏi và đáp án
    return questions.map(q => {
        // Lấy danh sách các key của options (A, B, C, ...)
        const optionKeys = Object.keys(q.options);
        
        // Tạo mảng các đáp án để trộn
        const answersArray = optionKeys.map(key => ({
            key: key,
            content: q.options[key]
        }));
        
        // Trộn mảng đáp án
        const shuffledAnswers = answersArray.sort(() => Math.random() - 0.5);
        
        // Tạo object options mới
        const newOptions = {};
        let newAnswer = q.answer;
        
        shuffledAnswers.forEach((item, index) => {
            const newKey = optionKeys[index];
            newOptions[newKey] = item.content;
            
            // Cập nhật đáp án đúng
            if (item.key === q.answer) {
                newAnswer = newKey;
            }
        });
        
        return {
            ...q,
            options: newOptions,
            answer: newAnswer
        };
    }).sort(() => Math.random() - 0.5); // Trộn thứ tự câu hỏi
}
