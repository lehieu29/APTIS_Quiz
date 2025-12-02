// ============================================
// CONFIG.JS - Cấu hình và Constants
// ============================================

// Danh sách các file quiz có sẵn
const availableQuizFiles = [
    {
        filename: 'listening_part_1.json',
        title: 'Listening Part 1',
        icon: '🎧',
        description: 'Luyện nghe cơ bản'
    },
    {
        filename: 'reading_part_1.json',
        title: 'Reading Part 1',
        icon: '📖',
        description: 'Luyện đọc cơ bản'
    },
    {
        filename: 'reading_part_2_3.json',
        title: 'Reading Part 2-3',
        icon: '📝',
        description: 'Sắp xếp câu theo thứ tự'
    },
    {
        filename: 'reading_part_4.json',
        title: 'Reading Part 4',
        icon: '👥',
        description: 'Chọn người phù hợp'
    },
    {
        filename: 'reading_part_5.json',
        title: 'Reading Part 5',
        icon: '📝',
        description: 'Sắp xếp câu theo thứ tự'
    },
    {
        filename: 'gv.json',
        title: 'Grammar & Vocab',
        icon: '📝',
        description: 'Chọn đáp án đúng'
    },
    {
        filename: 'speaking_part_1.json',
        title: 'Speaking Part 1',
        icon: '🎤',
        description: 'Luyện nói cơ bản'
    },
    {
        filename: 'writing_part_1.json',
        title: 'Writing Part 1',
        icon: '✍️',
        description: 'Luyện viết câu ngắn'
    }
];

// Biến global state
let allPassages = [];
let currentPassageIndex = 0;
let questions = [];
let currentIndex = 0;
let correctAnswers = 0;
let wrongAnswers = 0;
let answered = false;
let isMultiPassageFormat = false;
let currentQuizType = ''; // 'reading_part_2_3', 'listening_part_3', 'reading_part_4', 'default'
let userAnswerOrder = []; // Thứ tự user sắp xếp cho reading_part_2_3
let hasSubmitted = false; // Đã submit chưa
let draggedElement = null; // Cho drag & drop

// State cho Reading Part 4
let readingPart4State = {
    currentQuestionIndex: 0,  // Đang ở câu hỏi nào (0-based)
    userAnswers: [],          // Mảng lưu đáp án user chọn
    hasFinishedAll: false     // Đã trả lời hết tất cả câu hỏi chưa
};

// State cho Practice Mode - Làm lại các câu sai
let practiceMode = {
    isActive: false,              // Đang ở chế độ làm lại không
    wrongIndexes: [],             // Mảng index câu sai [30, 45, 150] (cho default & listening_part_3)
    wrongItemIndexes: [],         // Mảng index item sai [2, 5] (cho reading_part_2_3 & reading_part_4)
    currentPracticeIndex: 0,      // Đang làm lại câu/item thứ mấy trong danh sách sai
    retryRound: 1,                // Đang ở vòng làm lại thứ mấy
    originalQuestions: []         // Backup câu hỏi gốc
};

// State cho Speaking Part 1
let speakingPart1State = {
    settings: {
        showHints: false,         // Hiển thị gợi ý không
        autoNext: false,          // Tự động chuyển câu không
        enableTimer: false        // Bật đếm thời gian không
    },
    userAnswers: [],              // Lưu câu trả lời (text hoặc audio blob)
    currentTimer: null,           // Timer hiện tại
    timeLeft: 0,                  // Số giây còn lại
    mediaRecorder: null,          // MediaRecorder instance
    audioChunks: [],              // Audio data chunks
    isRecording: false,           // Đang ghi âm không
    hasSubmitted: false,          // Đã submit câu hiện tại chưa
    currentAudioBlob: null,       // Audio blob hiện tại
    currentAudioUrl: null         // Audio URL hiện tại
};

// State cho Writing Part 1
let writingPart1State = {
    settings: {
        showHints: false          // Hiển thị gợi ý không (chỉ có 1 setting)
    },
    userAnswers: [],              // Lưu câu trả lời (text only)
    hasSubmitted: false           // Đã submit câu hiện tại chưa
};
