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
let currentQuizType = ''; // 'reading_part_2_3', 'listening_part_3', 'default'
let userAnswerOrder = []; // Thứ tự user sắp xếp cho reading_part_2_3
let hasSubmitted = false; // Đã submit chưa
let draggedElement = null; // Cho drag & drop
