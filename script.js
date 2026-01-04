// Dữ liệu câu hỏi theo độ khó và ngôn ngữ
const data = {
    vi: {
        easy: [
            { q: "Xin chào trong tiếng Anh là gì?", options: ["Goodbye", "Hello", "Thank you", "Sorry"], a: 1 },
            { q: "Táo tiếng Anh là?", options: ["Orange", "Banana", "Apple", "Mango"], a: 2 },
            { q: "Cảm ơn là gì?", options: ["Hello", "Goodbye", "Thank you", "Please"], a: 2 }
        ],
        normal: [
            { q: "Từ 'Beautiful' nghĩa là?", options: ["Xấu xí", "Đẹp", "Buồn", "Vui"], a: 1 },
            { q: "'Run' nghĩa là gì?", options: ["Ngồi", "Đi bộ", "Chạy", "Ngủ"], a: 2 }
        ],
        hard: [
            { q: "Từ 'Opportunity' nghĩa là gì?", options: ["Cơ hội", "Thất bại", "Kế hoạch", "Thử thách"], a: 0 },
            { q: "'Exquisite' nghĩa là?", options: ["Bình thường", "Tinh tế, tuyệt vời", "Xấu", "Lớn"], a: 1 }
        ],
        superhard: [
            { q: "Từ 'Ephemeral' nghĩa là?", options: ["Vĩnh cửu", "Ngắn ngủi", "Mạnh mẽ", "Lâu dài"], a: 1 },
            { q: "'Ubiquitous' nghĩa là?", options: ["Hiếm", "Có mặt khắp nơi", "Cổ điển", "Mới"], a: 1 }
        ],
        extreme: [
            { q: "Từ 'Sesquipedalian' nghĩa là gì?", options: ["Ngắn gọn", "Dùng từ dài phức tạp", "Im lặng", "Hài hước"], a: 1 },
            { q: "'Defenestration' nghĩa là hành động gì?", options: ["Ném ai đó ra cửa sổ", "Mở cửa", "Đóng cửa", "Ăn uống"], a: 0 }
        ]
    },
    en: {
        easy: [
            { q: "What is 'Xin chào' in English?", options: ["Goodbye", "Hello", "Thank you", "Sorry"], a: 1 },
            { q: "What is 'Táo' in English?", options: ["Orange", "Banana", "Apple", "Mango"], a: 2 }
        ],
        normal: [
            { q: "What does 'Beautiful' mean in Vietnamese?", options: ["Ugly", "Đẹp", "Sad", "Happy"], a: 1 }
        ],
        // Có thể thêm nhiều hơn...
        hard: [], superhard: [], extreme: []
    }
};

let currentLang = 'vi';
let currentMode = 'easy';
let currentQuestions = [];
let currentQuestion = 0;
let score = 0;

const elements = {
    startScreen: document.getElementById('start-screen'),
    quizScreen: document.getElementById('quiz-screen'),
    question: document.getElementById('question'),
    options: document.getElementById('options'),
    result: document.getElementById('result'),
    scoreEl: document.getElementById('score'),
    nextBtn: document.getElementById('next-btn'),
    speakBtn: document.getElementById('speak-btn'),
    modeBtn: document.getElementById('mode-btn'),
    welcomeTitle: document.getElementById('welcome-title')
};

function updateTexts() {
    document.querySelector('header h1').textContent = currentLang === 'vi' 
        ? '🇻🇳 Học Tiếng Anh Cùng Chí Dự 🇻🇳' 
        : '🇻🇳 Learn English With Chí Dự 🇻🇳';
    elements.welcomeTitle.textContent = currentLang === 'vi'
        ? 'Chào mừng bạn đến với quiz học ngoại ngữ!'
        : 'Welcome to the language learning quiz!';
}

// Chọn ngôn ngữ
document.getElementById('lang-btn').onclick = () => {
    document.getElementById('lang-modal').classList.remove('hidden');
};

document.querySelectorAll('[data-lang]').forEach(btn => {
    btn.onclick = () => {
        const newLang = btn.dataset.lang;
        if (newLang !== currentLang) {
            if (confirm(currentLang === 'vi' 
                ? 'Bạn có chắc muốn đổi ngôn ngữ?' 
                : 'Are you sure you want to change language?')) {
                currentLang = newLang;
                updateTexts();
                loadQuestions();
                document.getElementById('lang-modal').classList.add('hidden');
            }
        }
    };
});

document.getElementById('close-lang').onclick = () => {
    document.getElementById('lang-modal').classList.add('hidden');
};

// Chọn mode
document.getElementById('mode-btn').onclick = () => {
    const modes = ['easy', 'normal', 'hard', 'superhard', 'extreme'];
    const names = { easy: 'Dễ', normal: 'Bình Thường', hard: 'Khó', superhard: 'Super Hard', extreme: 'Extreme Mode' };
    const idx = modes.indexOf(currentMode);
    const next = modes[(idx + 1) % modes.length];

    if (next === 'extreme') {
        if (!confirm('⚠️ EXTREME MODE ⚠️\nChế độ này chỉ dành cho thánh tiếng Anh!\nBạn có dám thử không? 😈')) {
            return;
        }
    }

    currentMode = next;
    elements.modeBtn.textContent = `⚡ Mode: ${names[next]}`;
    loadQuestions();
};

// Thông tin
document.getElementById('info-btn').onclick = () => {
    document.getElementById('info-modal').classList.remove('hidden');
};
document.getElementById('close-info').onclick = () => {
    document.getElementById('info-modal').classList.add('hidden');
};

// Bắt đầu
document.getElementById('start-btn').onclick = () => {
    if (confirm(currentLang === 'vi' ? 'Bạn đã sẵn sàng học chưa? 💪' : 'Are you ready to learn? 💪')) {
        elements.startScreen.classList.add('hidden');
        elements.quizScreen.classList.remove('hidden');
        loadQuestions();
        loadQuestion();
    }
};

function loadQuestions() {
    currentQuestions = data[currentLang][currentMode] || data[currentLang].easy;
    if (currentQuestions.length === 0) {
        currentQuestions = [{ q: currentLang === 'vi' ? "Chưa có câu hỏi cho mode này!" : "No questions yet!", options: [], a: -1 }];
    }
    currentQuestion = 0;
    score = 0;
    updateScore();
}

function loadQuestion() {
    const q = currentQuestions[currentQuestion];
    elements.question.textContent = q.q;
    elements.options.innerHTML = '';
    elements.result.textContent = '';
    elements.nextBtn.disabled = true;

    q.options.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.textContent = opt;
        btn.classList.add('option-btn');
        btn.onclick = () => checkAnswer(i);
        elements.options.appendChild(btn);
    });
}

function checkAnswer(selected) {
    const q = currentQuestions[currentQuestion];
    const buttons = document.querySelectorAll('.option-btn');

    buttons.forEach((btn, i) => {
        btn.disabled = true;
        if (i === q.a) btn.style.background = '#00b894';
        if (i === selected && i !== q.a) btn.style.background = '#ff6b6b';
    });

    if (selected === q.a) {
        score += 10;
        elements.result.textContent = currentLang === 'vi' ? 'Đúng rồi! +10 điểm 🎉' : 'Correct! +10 points 🎉';
    } else {
        elements.result.textContent = currentLang === 'vi' 
            ? `Sai rồi! Đáp án: ${q.options[q.a]}` 
            : `Wrong! Correct: ${q.options[q.a]}`;
    }

    updateScore();
    elements.nextBtn.disabled = false;
}

function updateScore() {
    elements.scoreEl.textContent = `Điểm: ${score}`;
}

elements.nextBtn.onclick = () => {
    currentQuestion++;
    if (currentQuestion < currentQuestions.length) {
        loadQuestion();
    } else {
        elements.question.textContent = currentLang === 'vi' ? 'Hoàn thành! 🎊' : 'Completed! 🎊';
        elements.options.innerHTML = '';
        elements.nextBtn.disabled = true;
        elements.result.textContent = currentLang === 'vi' 
            ? `Bạn đạt ${score} điểm!` 
            : `You scored ${score} points!`;
    }
};

// Phát âm bằng Google TTS
elements.speakBtn.onclick = () => {
    const text = currentQuestions[currentQuestion].q;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = currentLang === 'vi' ? 'vi-VN' : 'en-US';
    utterance.rate = 0.9;
    speechSynthesis.speak(utterance);
};

// Các nút điều khiển
document.getElementById('restart-btn').onclick = () => { currentQuestion = 0; loadQuestion(); };
document.getElementById('reset-score-btn').onclick = () => { score = 0; updateScore(); };
document.getElementById('quit-btn').onclick = () => {
    elements.quizScreen.classList.add('hidden');
    elements.startScreen.classList.remove('hidden');
};

// Khởi tạo
updateTexts();
