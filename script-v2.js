// ... (toàn bộ code data, biến, hàm như lần trước)

// ĐÓNG MODAL CHẮC CHẮN
document.getElementById('close-info').onclick = () => {
    document.getElementById('info-modal').classList.add('hidden');
};
document.getElementById('close-lang').onclick = () => {
    document.getElementById('lang-modal').classList.add('hidden');
};

// Click nền đen hoặc ESC
document.querySelectorAll('.modal').forEach(m => {
    m.addEventListener('click', e => {
        if (e.target === m) m.classList.add('hidden');
    });
});
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden'));
    }
});

// ... (còn lại tất cả code quiz, mode, ngôn ngữ, phát âm như cũ)
