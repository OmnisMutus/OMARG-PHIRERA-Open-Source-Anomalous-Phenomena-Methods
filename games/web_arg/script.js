document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form');
    const input = document.getElementById('password');
    const errorMsg = document.getElementById('error-msg');
    const successPanel = document.getElementById('success-panel');
    const scrambleElements = document.querySelectorAll('.scramble-text');

    // Scramble text effect
    const chars = '!<>-_\\\\/[]{}—=+*^?#________';
    
    function scramble(element) {
        const originalText = element.dataset.original || element.innerText;
        element.dataset.original = originalText;
        
        let scrambled = '';
        for (let i = 0; i < originalText.length; i++) {
            if (Math.random() > 0.95 && originalText[i] !== ' ') {
                scrambled += chars[Math.floor(Math.random() * chars.length)];
            } else {
                scrambled += originalText[i];
            }
        }
        element.innerText = scrambled;
    }

    setInterval(() => {
        scrambleElements.forEach(scramble);
    }, 150);

    // Form logic
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // The steganographic clue is "PATH_ID: P11" encoded in Base64
        // Looking up P11 in symbolic_api.json reveals the standard pattern function: instantiate
        const targetAnswer = 'instantiate';
        const userAnswer = input.value.trim().toLowerCase();
        
        if (userAnswer === targetAnswer) {
            errorMsg.classList.add('hidden');
            successPanel.classList.remove('hidden');
            input.disabled = true;
            input.style.borderBottomColor = 'var(--text-color)';
        } else {
            errorMsg.classList.remove('hidden');
            input.value = '';
            
            // Brief visual glitch on error
            document.body.style.backgroundColor = '#220000';
            setTimeout(() => {
                document.body.style.backgroundColor = 'var(--bg-color)';
            }, 100);
        }
    });
});
