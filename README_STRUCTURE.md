# 📂 CẤU TRÚC DỰ ÁN MỚI

## 🎯 Mục đích
Tách file `index.html` ban đầu (930 dòng) thành nhiều file nhỏ để:
- ✅ Dễ dàng bảo trì và chỉnh sửa
- ✅ Tránh lỗi khi edit file quá lớn
- ✅ Code có tổ chức và rõ ràng hơn

---

## 📁 Cấu trúc thư mục

```
Quiz/
├── index.html              ← FILE CŨ (930 dòng, BACKUP)
├── index_new.html          ← FILE MỚI (chỉ HTML, 130 dòng)
├── style.css               ← CSS (giữ nguyên)
├── listening_part_1.json   ← Data files
├── listening_part_3.json
├── reading_part_1.json
├── reading_part_2_3.json
├── README_STRUCTURE.md     ← File này
│
└── js/                     ← THƯMỤC MỚI chứa JavaScript
    ├── config.js           ← Cấu hình & biến global (45 dòng)
    ├── utils.js            ← Modal, error handling (69 dòng)
    ├── quiz-data.js        ← Xử lý data, load file (200 dòng)
    ├── quiz-render.js      ← Render UI, hiển thị (320 dòng)
    ├── quiz-actions.js     ← Các hành động (check answer, shuffle...) (420 dòng)
    ├── drag-drop.js        ← Drag & drop cho Reading Part 2-3 (75 dòng)
    └── main.js             ← Entry point (10 dòng)
```

---

## 📄 Mô tả từng file

### 🔧 **js/config.js**
- Chứa danh sách `availableQuizFiles`
- Khai báo tất cả biến global state (questions, currentIndex, correctAnswers...)
- Không có logic xử lý

### 🛠️ **js/utils.js**
- `showModal()` - Hiển thị modal xác nhận
- `showError()` - Hiển thị thông báo lỗi

### 📊 **js/quiz-data.js**
- `loadQuizFile()` - Tải file quiz từ server
- `handleFileUpload()` - Xử lý file upload
- `processQuizData()` - Phân loại format quiz (reading_part_2_3, listening_part_3, default)
- `loadPassage()` - Load passage cụ thể
- `switchPassage()` - Chuyển đổi passage

### 🎨 **js/quiz-render.js**
- `renderQuickSelectButtons()` - Render nút quick select
- `renderPassageSelector()` - Render bộ chọn đề
- `startQuiz()` - Bắt đầu quiz
- `renderQuestion()` - Render câu hỏi chính
- `renderListeningPart3()` - Render Listening Part 3 (audio + options)
- `renderReadingPart23()` - Render Reading Part 2-3 (drag & drop)
- `showCompletion()` - Màn hình hoàn thành
- `updateStats()` - Cập nhật thống kê

### ⚡ **js/quiz-actions.js**
- `checkAnswer()` - Kiểm tra câu trả lời (default quiz)
- `checkAnswerListening()` - Kiểm tra câu trả lời Listening Part 3
- `submitAnswer()` - Submit answer cho Reading Part 2-3
- `nextQuestion()` - Chuyển sang câu tiếp theo
- `shuffleQuestions()` - Trộn câu hỏi
- `shuffleAnswers()` - Trộn đáp án (logic phức tạp)
- `resetQuiz()` - Reset quiz
- `restartQuiz()` - Restart quiz
- `shuffleAndRestart()` - Trộn và restart

### 🖱️ **js/drag-drop.js**
- `handleDragStart()` - Bắt đầu kéo
- `handleDragEnd()` - Kết thúc kéo
- `handleDragOver()` - Kéo qua
- `handleDragEnter()` - Kéo vào
- `handleDragLeave()` - Kéo ra
- `handleDrop()` - Thả

### 🚀 **js/main.js**
- `window.onload` - Entry point, khởi tạo app

---

## 🔄 CÁCH SỬ DỤNG

### Option 1: Thay thế file index.html cũ
```bash
# Backup file cũ
mv index.html index_old_backup.html

# Đổi tên file mới
mv index_new.html index.html
```

### Option 2: Giữ cả 2 file để test
- Mở `index_new.html` để test cấu trúc mới
- Giữ `index.html` làm backup

---

## ✨ ƯU ĐIỂM CẤU TRÚC MỚI

### 1. **Dễ bảo trì**
- Mỗi file có trách nhiệm rõ ràng
- Tìm bug dễ dàng hơn (biết file nào chứa logic gì)

### 2. **Dễ mở rộng**
- Muốn thêm Listening Part 3? → Chỉ sửa `quiz-render.js` và `quiz-actions.js`
- Muốn thêm quiz type mới? → Thêm vào `quiz-data.js` (detection) và `quiz-render.js` (render)

### 3. **Không bị lỗi khi edit**
- File nhỏ (< 500 dòng) → Tool edit không bị crash
- Logic tách biệt → Sửa 1 file không ảnh hưởng file khác

### 4. **Dễ đọc code**
- Tên file rõ ràng
- Mỗi function có comment mô tả

---

## 🎯 TIẾP THEO - THÊM LISTENING PART 3

Để thêm hỗ trợ Listening Part 3, chỉ cần:

### 1. ✅ ĐÃ HOÀN THÀNH:
- `config.js`: Đã thêm listening_part_3.json vào `availableQuizFiles`
- `quiz-data.js`: Đã có detection logic cho Listening Part 3
- `quiz-render.js`: Đã có `renderListeningPart3()` function
- `quiz-actions.js`: Đã có `checkAnswerListening()` với audio_text_vi và audio_summary_vi

### 2. CẦN LÀM:
- Test với file `listening_part_3.json` thực tế
- Điều chỉnh CSS nếu cần (cho audio player)

---

## 📝 GHI CHÚ

- Tất cả file JS đều dùng ES5 syntax (không dùng ES6 modules) để tương thích với mọi trình duyệt
- File được load theo thứ tự trong `index_new.html`:
  1. config.js (biến global)
  2. utils.js (tiện ích)
  3. quiz-data.js (xử lý data)
  4. quiz-render.js (render UI)
  5. quiz-actions.js (actions)
  6. drag-drop.js (drag & drop)
  7. main.js (khởi tạo)

---

## 🆘 TROUBLESHOOTING

### Lỗi "function not defined"
→ Kiểm tra thứ tự load file JS trong `index_new.html`

### Quiz không hoạt động
→ Mở Console (F12) xem lỗi gì, thường là do missing function

### Listening Part 3 không play audio
→ Kiểm tra đường dẫn file audio trong JSON (phải đúng với file thực tế)

---

Tạo bởi: Cascade AI
Ngày: 2025-11-21
