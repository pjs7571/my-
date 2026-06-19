const weaponImage = document.getElementById('weaponImage');
const weaponNameText = document.getElementById('weaponName');
const weaponLevelText = document.getElementById('weaponLevel');
const weaponGlow = document.getElementById('weaponGlow');
const rateSuccess = document.getElementById('rateSuccess');
const rateFail = document.getElementById('rateFail');
const rateDestroy = document.getElementById('rateDestroy');
const btnEnhance = document.getElementById('btnEnhance');
const btnSell = document.getElementById('btnSell');
const btnReset = document.getElementById('btnReset');
const logList = document.getElementById('logList');
const goldText = document.getElementById('goldText');
const enhanceCostText = document.getElementById('enhanceCostText');
const sellValueText = document.getElementById('sellValueText');
const effectContainer = document.getElementById('effectContainer');
const goldDisplayPanel = document.querySelector('.gold-display');

let currentLevel = 0;
let isDestroyed = false;
let userGold = 10000;

// 강화 확률 테이블
const enhanceData = [
    { pS: 100, pF: 0, pD: 0, color: '#1e90ff' },
    { pS: 90, pF: 10, pD: 0, color: '#279eff' },
    { pS: 80, pF: 20, pD: 0, color: '#33abff' },
    { pS: 70, pF: 30, pD: 0, color: '#52ff33' },
    { pS: 60, pF: 40, pD: 0, color: '#a1ff33' },
    { pS: 50, pF: 40, pD: 10, color: '#ffe633' },
    { pS: 40, pF: 50, pD: 10, color: '#ffb533' },
    { pS: 30, pF: 55, pD: 15, color: '#ff8333' },
    { pS: 25, pF: 55, pD: 20, color: '#ff4c33' },
    { pS: 20, pF: 55, pD: 25, color: '#ff3333' },
    { pS: 15, pF: 55, pD: 30, color: '#d333ff' },
    { pS: 10, pF: 50, pD: 40, color: '#a633ff' },
    { pS: 5, pF: 50, pD: 45, color: '#6633ff' },
    { pS: 3, pF: 47, pD: 50, color: '#ff3399' },
    { pS: 1, pF: 39, pD: 60, color: '#ff3366' },
];

function getWeaponData(level) {
    if (level < 4) return { name: "녹슨 단검", img: "stage1.png" };
    if (level < 8) return { name: "정예 기사의 장검", img: "stage2.png" };
    if (level < 12) return { name: "마력이 깃든 룬 블레이드", img: "stage3.png" };
    if (level < 15) return { name: "재앙을 부르는 마검", img: "stage4.png" };
    return { name: "신을 베는 창조주의 검", img: "stage5.png" };
}

function formatNumber(num) {
    return num.toLocaleString();
}

function getEnhanceCost(level) {
    return Math.floor(100 * Math.pow(1.5, level));
}

function getSellValue(level) {
    return Math.floor(500 * Math.pow(1.9, level));
}

function createFireParticles() {
    const rect = weaponImage.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    for (let i = 0; i < 40; i++) {
        const particle = document.createElement('div');
        particle.className = 'fire-particle';
        
        // Random trajectory
        const angle = Math.random() * Math.PI * 2;
        const velocity = 50 + Math.random() * 150;
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;
        
        particle.style.left = `${centerX}px`;
        particle.style.top = `${centerY}px`;
        particle.style.setProperty('--tx', `${tx}px`);
        particle.style.setProperty('--ty', `${ty}px`);
        
        // Random color tweaks for fire
        const hue = Math.random() * 40; // 0~40 (red to yellow)
        particle.style.background = `radial-gradient(circle, #fff, hsl(${hue}, 100%, 50%), transparent)`;
        
        effectContainer.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 1000);
    }
}

function animateGold() {
    goldDisplayPanel.style.transform = 'scale(1.2)';
    goldDisplayPanel.style.boxShadow = '0 0 30px rgba(255, 215, 0, 0.8)';
    setTimeout(() => {
        goldDisplayPanel.style.transform = 'scale(1)';
        goldDisplayPanel.style.boxShadow = '0 0 15px rgba(255, 215, 0, 0.2)';
    }, 300);
}

function updateUI() {
    goldText.innerText = formatNumber(userGold);
    weaponLevelText.innerText = `+${currentLevel}`;
    
    const wData = getWeaponData(currentLevel);
    weaponNameText.innerText = wData.name;
    weaponImage.src = wData.img;
    
    if (isDestroyed) {
        weaponImage.classList.add('anim-destroy');
        weaponLevelText.innerText = "파괴됨";
        btnEnhance.style.display = 'none';
        btnSell.style.display = 'none';
        btnReset.style.display = 'block';
        weaponGlow.style.background = 'transparent';
        weaponImage.style.transform = 'scale(1)';
        
        rateSuccess.innerText = '-';
        rateFail.innerText = '-';
        rateDestroy.innerText = '-';
        enhanceCostText.innerText = '-';
        sellValueText.innerText = '-';
        return;
    }

    const currentCost = getEnhanceCost(currentLevel);
    const currentValue = getSellValue(currentLevel);
    
    enhanceCostText.innerText = `-${formatNumber(currentCost)} G`;
    sellValueText.innerText = `+${formatNumber(currentValue)} G`;

    // 이미지 무기 커지는 효과 적용
    const scale = 1 + (currentLevel * 0.03);
    weaponImage.style.transform = `scale(${scale})`;

    if (currentLevel >= 15) {
        rateSuccess.innerText = 'MAX';
        rateFail.innerText = '-';
        rateDestroy.innerText = '-';
        btnEnhance.disabled = true;
        enhanceCostText.innerText = '-';
        weaponGlow.style.boxShadow = '0 0 100px #ff3366';
        return;
    }

    const data = enhanceData[currentLevel];
    rateSuccess.innerText = `${data.pS}%`;
    rateFail.innerText = `${data.pF}%`;
    rateDestroy.innerText = `${data.pD}%`;
    weaponGlow.style.background = data.color;
    weaponGlow.style.opacity = 0.2 + (currentLevel * 0.05);

    if (userGold < currentCost) {
        btnEnhance.disabled = true;
    } else {
        btnEnhance.disabled = false;
    }
}

function addLog(message, type) {
    const li = document.createElement('li');
    li.innerHTML = `<span class="log-${type}">${message}</span>`;
    logList.prepend(li);
    if(logList.children.length > 20) {
        logList.removeChild(logList.lastChild);
    }
}

function attemptEnhance() {
    if (isDestroyed || currentLevel >= 15) return;
    
    const cost = getEnhanceCost(currentLevel);
    if (userGold < cost) {
        alert("골드가 부족합니다!");
        return;
    }
    
    userGold -= cost;
    updateUI();
    
    btnEnhance.disabled = true;
    btnSell.disabled = true;
    
    weaponImage.classList.remove('anim-shake', 'anim-flash', 'anim-destroy');
    void weaponImage.offsetWidth; 
    weaponImage.classList.add('anim-shake');
    
    setTimeout(() => {
        const data = enhanceData[currentLevel];
        const chance = Math.random() * 100;
        
        if (chance <= data.pS) {
            currentLevel++;
            weaponImage.classList.remove('anim-shake');
            void weaponImage.offsetWidth;
            weaponImage.classList.add('anim-flash');
            createFireParticles(); // 화염 이펙트 발생
            addLog(`[+${currentLevel}] 강화 성공! 강력해진 기운이 느껴집니다.`, 'success');
        } else if (chance <= data.pS + data.pF) {
            if (currentLevel >= 7 && Math.random() < 0.5) {
                currentLevel--;
                addLog(`[+${currentLevel+1}] 강화 실패... 레벨이 하락했습니다.`, 'fail');
            } else {
                addLog(`[+${currentLevel}] 강화 실패. 무기는 유지되었습니다.`, 'fail');
            }
        } else {
            isDestroyed = true;
            addLog(`강한 기운을 버티지 못하고 무기가 산산조각 났습니다.`, 'destroy');
        }
        
        updateUI();
        if(!isDestroyed && currentLevel < 15) {
            btnEnhance.disabled = userGold < getEnhanceCost(currentLevel);
            btnSell.disabled = false;
        }
    }, 600);
}

function sellWeapon() {
    if (isDestroyed) return;
    const value = getSellValue(currentLevel);
    userGold += value;
    addLog(`[+${currentLevel}] 검을 판매하여 ${formatNumber(value)} G를 획득했습니다!`, 'gold');
    animateGold();
    
    // 리셋
    currentLevel = 0;
    updateUI();
}

function resetGame() {
    currentLevel = 0;
    isDestroyed = false;
    weaponImage.classList.remove('anim-destroy');
    btnEnhance.style.display = 'block';
    btnSell.style.display = 'block';
    btnReset.style.display = 'none';
    
    addLog(`새로운 평범한 검을 획득했습니다. 다시 시작합니다.`, 'info');
    updateUI();
}

btnEnhance.addEventListener('click', attemptEnhance);
btnSell.addEventListener('click', sellWeapon);
btnReset.addEventListener('click', resetGame);

updateUI();
