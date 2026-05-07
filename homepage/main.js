gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
    initChatbot();
    initAnimations();
    initFuturisticEffects();
});

function initChatbot() {
    const fab = document.getElementById('chatbot-fab');
    const navAi = document.getElementById('nav-ai-chat');
    const win = document.getElementById('chatbot-window');
    const tooltip = document.getElementById('ai-tooltip');
    const input = document.getElementById('chat-input');
    const send = document.getElementById('chat-send');
    const msgs = document.getElementById('chat-messages');

    const toggleChat = (e) => {
        if(e) e.preventDefault();
        const isOpen = win.style.display === 'flex';
        win.style.display = isOpen ? 'none' : 'flex';
        if(tooltip) tooltip.style.display = 'none';
        
        if(!isOpen && msgs.children.length === 0) {
            appendMsg("환영합니다. 저는 당신의 학교 생활을 지원하는 AI 비서입니다. 미래 교육에 대해 무엇이든 물어보세요.", 'ai');
        }
    };

    if(fab) fab.addEventListener('click', toggleChat);
    if(navAi) navAi.addEventListener('click', toggleChat);

    send.onclick = () => {
        const val = input.value.trim();
        if(!val) return;
        appendMsg(val, 'user');
        input.value = '';
        setTimeout(() => appendMsg("현재 문의하신 내용은 데이터베이스를 통해 최적의 답변을 생성 중입니다. 잠시만 기다려 주세요!", 'ai'), 1000);
    };

    const appendMsg = (text, type) => {
        const div = document.createElement('div');
        div.style.padding = '12px 18px';
        div.style.borderRadius = '20px';
        div.style.fontSize = '14px';
        div.style.maxWidth = '85%';
        if(type === 'user') {
            div.style.background = '#00d2ff';
            div.style.color = '#000';
            div.style.alignSelf = 'flex-end';
        } else {
            div.style.background = '#161b22';
            div.style.border = '1px solid #30363d';
            div.style.color = '#fff';
            div.style.alignSelf = 'flex-start';
        }
        div.textContent = text;
        msgs.appendChild(div);
        msgs.scrollTop = msgs.scrollHeight;
    };
}

function initAnimations() {
    gsap.from(".reveal-text", { y: 60, opacity: 0, duration: 1.5, stagger: 0.3, ease: "expo.out" });
    
    gsap.utils.toArray(".eval-card").forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: { trigger: card, start: "top 85%" },
            y: 80, opacity: 0, duration: 1.2, delay: i * 0.1, ease: "power4.out"
        });
    });
}

function initFuturisticEffects() {
    const cards = document.querySelectorAll('.eval-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 15;
            const rotateY = (centerX - x) / 15;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)`;
        });
    });
}
