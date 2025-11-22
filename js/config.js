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
        filename: 'listening_part_3.json',
        title: 'Listening Part 3',
        icon: '🎧',
        description: 'Luyện nghe nâng cao'
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
