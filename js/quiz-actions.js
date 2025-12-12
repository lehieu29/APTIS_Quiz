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
        // Nếu đang ở practice mode và trả lời đúng, loại bỏ khỏi danh sách sai
        if (practiceMode.isActive) {
            const practiceIdx = practiceMode.wrongIndexes.indexOf(currentIndex);
            if (practiceIdx > -1) {
                practiceMode.wrongIndexes.splice(practiceIdx, 1);
            }
        }
    } else {
        wrongAnswers++;
        // Ghi nhận câu sai (nếu chưa có trong danh sách)
        if (!practiceMode.isActive && !practiceMode.wrongIndexes.includes(currentIndex)) {
            practiceMode.wrongIndexes.push(currentIndex);
        }
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
        // Nếu đang ở practice mode và trả lời đúng, loại bỏ khỏi danh sách sai
        if (practiceMode.isActive) {
            const practiceIdx = practiceMode.wrongIndexes.indexOf(currentIndex);
            if (practiceIdx > -1) {
                practiceMode.wrongIndexes.splice(practiceIdx, 1);
            }
        }
    } else {
        wrongAnswers++;
        // Ghi nhận câu sai (nếu chưa có trong danh sách)
        if (!practiceMode.isActive && !practiceMode.wrongIndexes.includes(currentIndex)) {
            practiceMode.wrongIndexes.push(currentIndex);
        }
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
        // Nếu đang ở practice mode và trả lời đúng, loại bỏ item khỏi danh sách sai
        if (practiceMode.isActive) {
            const practiceIdx = practiceMode.wrongItemIndexes.indexOf(currentIndex);
            if (practiceIdx > -1) {
                practiceMode.wrongItemIndexes.splice(practiceIdx, 1);
            }
        }
    } else {
        wrongAnswers++;
        // Ghi nhận item sai (nếu chưa có trong danh sách)
        if (!practiceMode.isActive && !practiceMode.wrongItemIndexes.includes(currentIndex)) {
            practiceMode.wrongItemIndexes.push(currentIndex);
        }
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
 * Kiểm tra câu trả lời cho Reading Part 4
 */
function checkAnswerReadingPart4(selectedAnswer, item, questionIndex) {
    // Lưu đáp án
    readingPart4State.userAnswers[questionIndex] = selectedAnswer;
    
    // Disable tất cả các button
    const buttons = document.querySelectorAll('.option-btn');
    buttons.forEach(btn => {
        btn.disabled = true;
        btn.style.opacity = '0.6';
        btn.style.cursor = 'not-allowed';
    });
    
    // Chuyển sang câu hỏi tiếp theo sau 500ms
    setTimeout(() => {
        readingPart4State.currentQuestionIndex++;
        
        // Kiểm tra xem đã hết câu hỏi chưa
        if (readingPart4State.currentQuestionIndex >= item.questions.length) {
            // Đã trả lời hết → Hiển thị kết quả tổng hợp
            showReadingPart4Result(item);
        } else {
            // Còn câu hỏi → Hiển thị câu tiếp theo
            renderReadingPart4Question(item, readingPart4State.currentQuestionIndex);
        }
    }, 500);
}

/**
 * Chuyển sang câu tiếp theo
 */
function nextQuestion() {
    // Nếu là reading_part_2_3 và chưa submit, thì submit trước
    if ((currentQuizType === 'reading_part_2_3' || currentQuizType === 'reading_part_5') && !hasSubmitted) {
        submitAnswer();
        return; // Không chuyển sang câu tiếp theo
    }
    
    currentIndex++;
    
    // Kiểm tra xem đã hết câu chưa
    if (currentIndex >= questions.length) {
        // Đã làm xong tất cả câu
        checkAndStartPracticeMode();
    } else {
        renderQuestion();
    }
}

/**
 * Kiểm tra và chuyển sang Practice Mode nếu có câu sai
 */
function checkAndStartPracticeMode() {
    // Kiểm tra có câu/item sai không
    const hasWrongQuestions = (currentQuizType === 'reading_part_2_3' || currentQuizType === 'reading_part_5' || currentQuizType === 'reading_part_4') 
        ? practiceMode.wrongItemIndexes.length > 0 
        : practiceMode.wrongIndexes.length > 0;
    
    if (hasWrongQuestions) {
        // Có câu sai → Chuyển sang Practice Mode
        startPracticeMode();
    } else {
        // Không có câu sai → Hiển thị completion
        showCompletion();
    }
}

/**
 * Bắt đầu Practice Mode - Làm lại các câu sai
 */
function startPracticeMode() {
    practiceMode.isActive = true;
    practiceMode.currentPracticeIndex = 0;
    practiceMode.retryRound++;
    
    // Backup questions gốc nếu chưa có
    if (practiceMode.originalQuestions.length === 0) {
        practiceMode.originalQuestions = [...questions];
    }
    
    // Tạo danh sách câu hỏi cần làm lại
    if (currentQuizType === 'reading_part_2_3' || currentQuizType === 'reading_part_5' || currentQuizType === 'reading_part_4') {
        // Với reading_part_2_3, reading_part_4 và reading_part_5 làm lại cả item
        questions = practiceMode.wrongItemIndexes.map(idx => practiceMode.originalQuestions[idx]);
    } else {
        // Với default và listening_part_3, chỉ làm lại câu sai
        questions = practiceMode.wrongIndexes.map(idx => practiceMode.originalQuestions[idx]);
    }
    
    // Reset current index và render câu đầu tiên
    currentIndex = 0;
    renderQuestion();
}

/**
 * Bỏ qua Practice Mode - Xem kết quả luôn
 */
function skipPracticeMode() {
    showModal({
        icon: '⚠️',
        title: 'Bỏ qua làm lại',
        message: 'Bạn có chắc muốn bỏ qua và xem kết quả luôn? Các câu sai sẽ không được cải thiện.',
        confirmText: 'Bỏ qua',
        cancelText: 'Tiếp tục làm'
    }).then(confirmed => {
        if (confirmed) {
            // Reset practice mode và restore câu hỏi gốc
            if (practiceMode.originalQuestions.length > 0) {
                questions = practiceMode.originalQuestions;
            }
            practiceMode.isActive = false;
            practiceMode.wrongIndexes = [];
            practiceMode.wrongItemIndexes = [];
            practiceMode.currentPracticeIndex = 0;
            practiceMode.originalQuestions = [];
            
            // Hiển thị completion screen
            showCompletion();
        }
    });
}

/**
 * Shuffle câu hỏi theo priority (priority cao hơn → hiển thị trước)
 * Áp dụng cho speaking_part_1 và writing_part_1
 */
function shuffleByPriority(questions) {
    // Nhóm câu hỏi theo priority
    const grouped = {};
    questions.forEach(q => {
        const priority = q.priority || 1;
        if (!grouped[priority]) {
            grouped[priority] = [];
        }
        grouped[priority].push(q);
    });
    
    // Shuffle trong từng nhóm
    Object.keys(grouped).forEach(priority => {
        grouped[priority].sort(() => Math.random() - 0.5);
    });
    
    // Ghép lại theo thứ tự priority giảm dần (3 → 2 → 1)
    const priorities = Object.keys(grouped).map(Number).sort((a, b) => b - a);
    const result = [];
    priorities.forEach(priority => {
        result.push(...grouped[priority]);
    });
    
    return result;
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
            // Shuffle theo priority cho speaking/writing, còn lại shuffle thường
            if (currentQuizType === 'speaking_part_1' || currentQuizType === 'writing_part_1') {
                questions = shuffleByPriority(questions);
            } else {
                questions = shuffleAnswers(questions);
            }
            
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
            
            // Reset practice mode
            practiceMode.isActive = false;
            practiceMode.wrongIndexes = [];
            practiceMode.wrongItemIndexes = [];
            practiceMode.currentPracticeIndex = 0;
            practiceMode.retryRound = 1;
            practiceMode.originalQuestions = [];
            
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
    
    // Reset practice mode và restore questions gốc nếu cần
    if (practiceMode.originalQuestions.length > 0) {
        questions = practiceMode.originalQuestions;
    }
    practiceMode.isActive = false;
    practiceMode.wrongIndexes = [];
    practiceMode.wrongItemIndexes = [];
    practiceMode.currentPracticeIndex = 0;
    practiceMode.retryRound = 1;
    practiceMode.originalQuestions = [];
    
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

    const isReadingPart5 = questions.every(q => 
        q.type === 'reading_part_5' && q.fixed && q.items && q.answer
    );

    if (isReadingPart23 || isReadingPart5) {
        // Xử lý riêng cho reading_part_2_3 và reading_part_5
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

    // Kiểm tra xem có phải reading_part_4 không
    const isReadingPart4 = questions.every(q => 
        q.people && q.questions && Array.isArray(q.questions)
    );

    if (isReadingPart4) {
        // Xử lý riêng cho reading_part_4
        return questions.map(item => {
            // Trộn vị trí của people (A, B, C, D)
            const peopleKeys = ['A', 'B', 'C', 'D'];
            const shuffledKeys = [...peopleKeys].sort(() => Math.random() - 0.5);
            
            // Tạo mapping: text gốc từ key nào → sẽ chuyển đến key nào
            // Ví dụ: Text của Person A (gốc) sẽ chuyển đến vị trí B (mới)
            const keyMapping = {};
            peopleKeys.forEach((originalKey, index) => {
                keyMapping[originalKey] = shuffledKeys[index];
            });
            
            console.log('🔀 Shuffle Reading Part 4:');
            console.log('Text mapping (từ → đến):', keyMapping);
            
            // Tạo people object mới: Giữ nguyên label, chỉ swap text
            // Logic: Vị trí A (label "Person A") sẽ chứa TEXT từ person nào?
            const newPeople = {};
            peopleKeys.forEach(newKey => {
                // Tìm person gốc nào có text được map đến vị trí newKey này
                const originalKey = Object.keys(keyMapping).find(k => keyMapping[k] === newKey);
                const sourcePerson = item.people[originalKey];
                
                // Giữ label cố định, chỉ lấy text từ sourcePerson
                newPeople[newKey] = {
                    label: `Person ${newKey}`, // Label luôn cố định theo key
                    text: sourcePerson.text,
                    text_vi: sourcePerson.text_vi,
                    text_summary_vi: sourcePerson.text_summary_vi
                };
                
                console.log(`Person ${newKey} → Text từ Person ${originalKey}`);
            });
            
            // Trộn thứ tự câu hỏi và update đáp án theo mapping
            const shuffledQuestions = [...item.questions]
                .sort(() => Math.random() - 0.5)
                .map(q => {
                    const oldAnswer = q.answer;
                    const newAnswer = keyMapping[q.answer];
                    console.log(`Câu "${q.question.substring(0, 30)}..." - Đáp án: ${oldAnswer} → ${newAnswer}`);
                    return {
                        ...q,
                        answer: newAnswer
                    };
                });
            
            return {
                ...item,
                people: newPeople,
                questions: shuffledQuestions
            };
        }).sort(() => Math.random() - 0.5); // Trộn thứ tự items
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

/**
 * ============================================
 * SPEAKING PART 1 ACTIONS
 * ============================================
 */

/**
 * Handle Enter key press trong Speaking textarea
 */
function handleSpeakingEnterKey(event) {
    // Chỉ submit khi nhấn Enter đơn (không phải Shift+Enter)
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault(); // Ngăn xuống dòng
        submitSpeakingAnswer();
    }
}

/**
 * Toggle recording on/off
 */
function toggleRecording() {
    if (speakingPart1State.isRecording) {
        stopRecording();
    } else {
        startRecording();
    }
}

/**
 * Bắt đầu ghi âm
 */
function startRecording() {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            speakingPart1State.mediaRecorder = new MediaRecorder(stream);
            speakingPart1State.audioChunks = [];
            
            speakingPart1State.mediaRecorder.addEventListener('dataavailable', event => {
                speakingPart1State.audioChunks.push(event.data);
            });
            
            speakingPart1State.mediaRecorder.addEventListener('stop', () => {
                const audioBlob = new Blob(speakingPart1State.audioChunks, { type: 'audio/webm' });
                const audioUrl = URL.createObjectURL(audioBlob);
                
                // Hiển thị audio playback
                const audioPlayer = document.getElementById('audioPlayback');
                audioPlayer.src = audioUrl;
                audioPlayer.style.display = 'block';
                
                // Lưu blob để submit sau
                speakingPart1State.currentAudioBlob = audioBlob;
                speakingPart1State.currentAudioUrl = audioUrl;
                
                // Stop all tracks
                stream.getTracks().forEach(track => track.stop());
            });
            
            speakingPart1State.mediaRecorder.start();
            speakingPart1State.isRecording = true;
            
            // Update UI
            const recordBtn = document.getElementById('recordBtn');
            recordBtn.innerHTML = '⏹️ Dừng ghi âm';
            recordBtn.style.background = '#f44336';
            
            document.getElementById('recordingIndicator').style.display = 'flex';
        })
        .catch(error => {
            console.error('Error accessing microphone:', error);
            alert('Không thể truy cập microphone. Vui lòng cho phép quyền truy cập.');
        });
}

/**
 * Dừng ghi âm
 */
function stopRecording() {
    if (speakingPart1State.mediaRecorder && speakingPart1State.isRecording) {
        speakingPart1State.mediaRecorder.stop();
        speakingPart1State.isRecording = false;
        
        // Update UI
        const recordBtn = document.getElementById('recordBtn');
        recordBtn.innerHTML = '🔴 Bắt đầu ghi âm';
        recordBtn.style.background = '';
        
        document.getElementById('recordingIndicator').style.display = 'none';
    }
}

/**
 * Submit câu trả lời Speaking
 */
function submitSpeakingAnswer() {
    const textAnswer = document.getElementById('speakingTextAnswer')?.value.trim();
    const audioUrl = speakingPart1State.currentAudioUrl;
    
    // Kiểm tra có câu trả lời không
    /*if (!textAnswer && !audioUrl) {
        alert('Vui lòng nhập câu trả lời hoặc ghi âm trước khi submit!');
        return;
    }*/
    
    // Lưu câu trả lời
    if (textAnswer) {
        speakingPart1State.userAnswers[currentIndex] = {
            type: 'text',
            content: textAnswer
        };
    } else {
        speakingPart1State.userAnswers[currentIndex] = {
            type: 'audio',
            content: audioUrl,
            blob: speakingPart1State.currentAudioBlob
        };
    }
    
    // Đánh dấu đã submit
    speakingPart1State.hasSubmitted = true;
    
    // Stop timer
    hideSpeakingTimer();
    
    // Re-render để hiển thị sample answer
    renderSpeakingPart1(questions[currentIndex], currentIndex, questions.length);
}

/**
 * Auto submit khi hết giờ
 */
function autoSubmitSpeakingAnswer() {
    const textAnswer = document.getElementById('speakingTextAnswer')?.value.trim();
    const audioUrl = speakingPart1State.currentAudioUrl;
    
    // Lưu câu trả lời (có thể rỗng)
    if (textAnswer) {
        speakingPart1State.userAnswers[currentIndex] = {
            type: 'text',
            content: textAnswer || '[Không có câu trả lời]'
        };
    } else if (audioUrl) {
        speakingPart1State.userAnswers[currentIndex] = {
            type: 'audio',
            content: audioUrl,
            blob: speakingPart1State.currentAudioBlob
        };
    } else {
        speakingPart1State.userAnswers[currentIndex] = {
            type: 'text',
            content: '[Không có câu trả lời]'
        };
    }
    
    // Tự động chuyển câu tiếp theo
    nextSpeakingQuestion();
}

/**
 * Chuyển sang câu Speaking tiếp theo
 */
function nextSpeakingQuestion() {
    // Reset state cho câu mới
    speakingPart1State.hasSubmitted = false;
    speakingPart1State.currentAudioBlob = null;
    speakingPart1State.currentAudioUrl = null;
    
    // Chuyển câu
    currentIndex++;
    
    if (currentIndex < questions.length) {
        // Còn câu hỏi → render câu tiếp
        renderSpeakingPart1(questions[currentIndex], currentIndex, questions.length);
        updateStats();
    } else {
        // Hết câu hỏi → hiển thị completion
        showSpeakingCompletion();
    }
}

/**
 * Copy tất cả câu hỏi & đáp án để gửi AI
 */
function copySpeakingAnswers() {
    let text = '=== SPEAKING PART 1 - YOUR ANSWERS ===\n\n';
    
    questions.forEach((q, idx) => {
        const answer = speakingPart1State.userAnswers[idx];
        text += `Question ${idx + 1}: ${q.question}\n`;
        text += `Your answer: ${answer.type === 'text' ? answer.content : '[Audio recorded]'}\n\n`;
    });
    
    text += '=== END ===';
    
    // Copy to clipboard
    navigator.clipboard.writeText(text)
        .then(() => {
            alert('✅ Đã copy! Bạn có thể paste vào ChatGPT hoặc AI khác để chấm.');
        })
        .catch(err => {
            console.error('Copy failed:', err);
            // Fallback: show text in alert
            prompt('Copy đoạn text này:', text);
        });
}

/**
 * ============================================
 * WRITING PART 1 ACTIONS
 * ============================================
 */

/**
 * Handle Enter key press trong Writing textarea
 */
function handleWritingEnterKey(event) {
    // Chỉ submit khi nhấn Enter đơn (không phải Shift+Enter)
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault(); // Ngăn xuống dòng
        submitWritingAnswer();
    }
}

/**
 * Submit câu trả lời Writing
 */
function submitWritingAnswer() {
    const textAnswer = document.getElementById('writingTextAnswer')?.value.trim();
    
    // Kiểm tra có câu trả lời không
    /*if (!textAnswer) {
        alert('Vui lòng nhập câu trả lời trước khi submit!');
        return;
    }*/
    
    // Lưu câu trả lời
    writingPart1State.userAnswers[currentIndex] = textAnswer;
    
    // Đánh dấu đã submit
    writingPart1State.hasSubmitted = true;
    
    // Re-render để hiển thị sample answer
    renderWritingPart1(questions[currentIndex], currentIndex, questions.length);
}

/**
 * Chuyển sang câu Writing tiếp theo
 */
function nextWritingQuestion() {
    // Reset state cho câu mới
    writingPart1State.hasSubmitted = false;
    
    // Chuyển câu
    currentIndex++;
    
    if (currentIndex < questions.length) {
        // Còn câu hỏi → render câu tiếp
        renderWritingPart1(questions[currentIndex], currentIndex, questions.length);
        updateStats();
    } else {
        // Hết câu hỏi → hiển thị completion
        showWritingCompletion();
    }
}

/**
 * Copy tất cả câu hỏi & đáp án Writing để gửi AI
 */
function copyWritingAnswers() {
    let text = '=== WRITING PART 1 - YOUR ANSWERS ===\n\n';
    
    questions.forEach((q, idx) => {
        const answer = writingPart1State.userAnswers[idx];
        text += `Question ${idx + 1}: ${q.question}\n`;
        text += `Your answer: ${answer || '[Không có câu trả lời]'}\n\n`;
    });
    
    text += '=== END ===';
    
    // Copy to clipboard
    navigator.clipboard.writeText(text)
        .then(() => {
            alert('✅ Đã copy! Bạn có thể paste vào ChatGPT hoặc AI khác để chấm.');
        })
        .catch(err => {
            console.error('Copy failed:', err);
            // Fallback: show text in alert
            prompt('Copy đoạn text này:', text);
        });
}

/**
 * ============================================
 * WRITING PART 2, 3, 4 ACTIONS
 * ============================================
 */

/**
 * Handle Enter key press trong Writing Part 2,3,4 textarea
 */
function handleWritingPart234EnterKey(event) {
    // Chỉ submit khi nhấn Enter đơn (không phải Shift+Enter)
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        submitWritingPart234Answer();
    }
}

/**
 * Submit câu trả lời Writing Part 2,3,4
 */
function submitWritingPart234Answer() {
    const textAnswer = document.getElementById('writingPart234Answer')?.value.trim();
    
    // Kiểm tra có câu trả lời không
    /*if (!textAnswer) {
        alert('Vui lòng nhập câu trả lời trước khi submit!');
        return;
    }*/
    
    const club = writingPart234State.currentClub;
    const q = writingPart234State.questionsList[currentIndex];
    
    // Lưu câu trả lời
    writingPart234State.userAnswers[club.club_name][q.key] = textAnswer;
    
    // Đánh dấu đã submit
    writingPart234State.hasSubmitted = true;
    
    // Re-render để hiển thị sample answer
    renderWritingPart234(q);
}

/**
 * Chuyển sang câu tiếp theo trong Writing Part 2,3,4
 */
function nextWritingPart234Question() {
    // Reset state cho câu mới
    writingPart234State.hasSubmitted = false;
    
    // Chuyển câu
    currentIndex++;
    
    if (currentIndex < writingPart234State.totalQuestions) {
        // Còn câu hỏi → render câu tiếp
        renderWritingPart234(writingPart234State.questionsList[currentIndex]);
        updateStats();
    } else {
        // Hết câu hỏi → hiển thị completion
        showClubCompletion();
    }
}

/**
 * Chuyển sang CLB tiếp theo
 */
function nextClub() {
    // Reset completion screen
    document.getElementById('completionScreen').classList.remove('show');
    document.getElementById('quizSection').style.display = 'block';
    
    // Load CLB tiếp theo
    const nextIndex = writingPart234State.currentClubIndex + 1;
    loadClub(nextIndex);
}

/**
 * Copy tất cả câu hỏi & đáp án Writing Part 2,3,4 để gửi AI
 */
function copyWritingPart234Answers() {
    const club = writingPart234State.currentClub;
    const answers = writingPart234State.userAnswers[club.club_name];
    const questionsList = writingPart234State.questionsList;
    
    let text = `=== WRITING PART 2, 3, 4 - ${club.club_name} ===\n\n`;
    
    questionsList.forEach((q, idx) => {
        const answer = answers[q.key] || '[Không có câu trả lời]';
        text += `${q.partLabel}:\n`;
        text += `Question: ${q.data.question || ''}\n`;
        text += `Your answer: ${answer}\n\n`;
    });
    
    text += '=== END ===';
    
    // Copy to clipboard
    navigator.clipboard.writeText(text)
        .then(() => {
            alert('✅ Đã copy! Bạn có thể paste vào ChatGPT hoặc AI khác để chấm.');
        })
        .catch(err => {
            console.error('Copy failed:', err);
            prompt('Copy đoạn text này:', text);
        });
}

/**
 * Kiểm tra đã submit chưa theo currentQuizType
 * @param {*} currentQuizType 
 * @returns 
 */
function checkSubmitted(currentQuizType) {
    switch(currentQuizType) {
        case 'writing_part_1':
            return writingPart1State.hasSubmitted;
        case 'writing_part_2_3_4':
            return writingPart234State.hasSubmitted;
        case 'speaking_part_1':
            return speakingPart1State.hasSubmitted;
        default:
            return false;
    }
}

/**
 * Chuyển sang câu tiếp theo theo currentQuizType
 * @param {*} currentQuizType 
 */
function nextQuestionByCurrentQuizType(currentQuizType) {
    switch(currentQuizType) {
        case 'writing_part_1':
            nextWritingQuestion();
            break;
        case 'writing_part_2_3_4':
            nextWritingPart234Question();
            break;
        case 'speaking_part_1':
            nextSpeakingQuestion();
            break;
        default:
            return false;
    }
}

/**
 * Hoàn thành câu --> gán timeLeft về 3
 * @param {*} currentQuizType 
 * @returns 
 */
function clearTimerByCurrentQuizType(currentQuizType) {
    switch(currentQuizType) {
        case 'speaking_part_1':
            speakingPart1State.timeLeft = 3;
            break;
    }
}