// Settings Page JavaScript

// DOM elements
const languageBtns = document.querySelectorAll('.language-btn');
const supportBtn = document.getElementById('supportBtn');
const referralBtn = document.getElementById('referralBtn');
const referralModal = document.getElementById('referralModal');
const closeReferral = document.getElementById('closeReferral');
const settingsMessage = document.getElementById('settingsMessage');
const messageText = document.getElementById('messageText');

// Language data
const languages = {
    az: {
        name: 'AZƏRBAYCAN',
        flag: '🇦🇿',
        code: 'az'
    },
    ru: {
        name: 'РУССКИЙ',
        flag: '🇷🇺',
        code: 'ru'
    },
    en: {
        name: 'ENGLISH',
        flag: '🇺🇸',
        code: 'en'
    }
};

// Current language
let currentLanguage = 'az';

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    loadLanguageSettings();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Language buttons
    languageBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const lang = this.dataset.lang;
            selectLanguage(lang);
        });
    });
    
    // Support button
    supportBtn.addEventListener('click', openSupport);
    
    // Referral button
    referralBtn.addEventListener('click', openReferralModal);
    closeReferral.addEventListener('click', closeReferralModal);
    
    // Close modal on overlay click
    referralModal.addEventListener('click', function(e) {
        if (e.target === referralModal) {
            closeReferralModal();
        }
    });
    
    // Add click effects to all buttons
    document.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', function() {
            this.classList.add('btn-click');
            setTimeout(() => {
                this.classList.remove('btn-click');
            }, 200);
        });
    });
}

// Load language settings
function loadLanguageSettings() {
    const savedLanguage = localStorage.getItem('adsmanat_language') || 'az';
    selectLanguage(savedLanguage, false);
}

// Select language
function selectLanguage(lang, showMessage = true) {
    if (lang === currentLanguage) return;
    
    // Update active button
    languageBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.lang === lang) {
            btn.classList.add('active');
        }
    });
    
    // Show loading state
    const activeBtn = document.querySelector(`[data-lang="${lang}"]`);
    activeBtn.classList.add('loading');
    
    // Simulate language change delay
    setTimeout(() => {
        currentLanguage = lang;
        localStorage.setItem('adsmanat_language', lang);
        
        // Remove loading state
        activeBtn.classList.remove('loading');
        
        // Show success message
        if (showMessage) {
            showMessage('Dil dəyişdirildi!', 'success');
        }
        
        // Apply language changes
        applyLanguageChanges(lang);
        
    }, 1000);
}

// Apply language changes
function applyLanguageChanges(lang) {
    // Update page title
    const titles = {
        az: 'ADSMANAT - Ayarlar',
        ru: 'ADSMANAT - Настройки',
        en: 'ADSMANAT - Settings'
    };
    document.title = titles[lang] || titles.az;
    
    // Update text content based on language
    updateTextContent(lang);
    
    // Store language preference
    localStorage.setItem('adsmanat_language', lang);
}

// Update text content
function updateTextContent(lang) {
    const translations = {
        az: {
            settings: 'AYARLAR',
            language: 'Dil Seçimi',
            help: 'Yardım və Dəstək',
            helpBtn: 'YARDIM VƏ DƏSTƏK',
            referral: 'Referral',
            referralBtn: 'REFERRAL',
            appInfo: 'Tətbiq Məlumatları',
            version: 'Versiya',
            date: 'Tarix',
            developer: 'Developer',
            referralTitle: 'Referral',
            referralMessage: 'BU BÖLMƏ GƏLƏCƏKDƏ HAZIRLANACAQ',
            referralDesc: 'Referral sistemi tezliklə əlavə ediləcək. Yeniliklər üçün bizi izləməkdə qalın!',
            settingsUpdated: 'Ayarlar yeniləndi!',
            languageChanged: 'Dil dəyişdirildi!'
        },
        ru: {
            settings: 'НАСТРОЙКИ',
            language: 'Выбор языка',
            help: 'Помощь и поддержка',
            helpBtn: 'ПОМОЩЬ И ПОДДЕРЖКА',
            referral: 'Рефералы',
            referralBtn: 'РЕФЕРАЛЫ',
            appInfo: 'Информация о приложении',
            version: 'Версия',
            date: 'Дата',
            developer: 'Разработчик',
            referralTitle: 'Рефералы',
            referralMessage: 'ЭТОТ РАЗДЕЛ БУДЕТ ПОДГОТОВЛЕН В БУДУЩЕМ',
            referralDesc: 'Реферальная система будет добавлена в ближайшее время. Оставайтесь с нами для обновлений!',
            settingsUpdated: 'Настройки обновлены!',
            languageChanged: 'Язык изменен!'
        },
        en: {
            settings: 'SETTINGS',
            language: 'Language Selection',
            help: 'Help and Support',
            helpBtn: 'HELP AND SUPPORT',
            referral: 'Referral',
            referralBtn: 'REFERRAL',
            appInfo: 'App Information',
            version: 'Version',
            date: 'Date',
            developer: 'Developer',
            referralTitle: 'Referral',
            referralMessage: 'THIS SECTION WILL BE PREPARED IN THE FUTURE',
            referralDesc: 'Referral system will be added soon. Stay tuned for updates!',
            settingsUpdated: 'Settings updated!',
            languageChanged: 'Language changed!'
        }
    };
    
    const t = translations[lang] || translations.az;
    
    // Update main heading
    const mainHeading = document.querySelector('.settings-card h3');
    if (mainHeading) mainHeading.textContent = t.settings;
    
    // Update setting headers
    const settingHeaders = document.querySelectorAll('.setting-header h4');
    const headerTexts = [t.language, t.help, t.referral, t.appInfo];
    settingHeaders.forEach((header, index) => {
        if (headerTexts[index]) header.textContent = headerTexts[index];
    });
    
    // Update button texts
    const helpBtn = document.querySelector('.support-btn span');
    if (helpBtn) helpBtn.textContent = t.helpBtn;
    
    const referralBtnText = document.querySelector('.referral-btn span');
    if (referralBtnText) referralBtnText.textContent = t.referralBtn;
    
    // Update app info labels
    const infoLabels = document.querySelectorAll('.info-label');
    const labelTexts = [t.version, t.date, t.developer];
    infoLabels.forEach((label, index) => {
        if (labelTexts[index]) label.textContent = labelTexts[index];
    });
    
    // Update referral modal
    const referralTitle = document.querySelector('.referral-header h4');
    if (referralTitle) referralTitle.textContent = t.referralTitle;
    
    const referralMessage = document.querySelector('.referral-message h5');
    if (referralMessage) referralMessage.textContent = t.referralMessage;
    
    const referralDesc = document.querySelector('.referral-message p');
    if (referralDesc) referralDesc.textContent = t.referralDesc;
}

// Open support
function openSupport() {
    const supportUrl = 'https://t.me/c/2252090240/123';
    window.open(supportUrl, '_blank');
    
    // Track support click
    trackSupportClick();
}

// Track support click
function trackSupportClick() {
    const clickData = {
        timestamp: new Date().toISOString(),
        action: 'support_click',
        source: 'settings_page'
    };
    
    const clicks = JSON.parse(localStorage.getItem('adsmanat_support_clicks') || '[]');
    clicks.push(clickData);
    localStorage.setItem('adsmanat_support_clicks', JSON.stringify(clicks));
}

// Open referral modal
function openReferralModal() {
    referralModal.classList.add('show');
    addHapticFeedback();
}

// Close referral modal
function closeReferralModal() {
    referralModal.classList.remove('show');
}

// Show message
function showMessage(text, type = 'success') {
    messageText.textContent = text;
    settingsMessage.className = `settings-message ${type} show`;
    
    // Update icon based on type
    const icon = settingsMessage.querySelector('i');
    icon.className = type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle';
    
    setTimeout(() => {
        settingsMessage.classList.remove('show');
    }, 3000);
}

// Add haptic feedback
function addHapticFeedback() {
    if (navigator.vibrate) {
        navigator.vibrate(50);
    }
}

// Add haptic feedback to buttons
document.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', addHapticFeedback);
});

// Add keyboard support
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeReferralModal();
    }
});

// Add language change sound effect
function playLanguageChangeSound() {
    if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
        const audioContext = new (AudioContext || webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Play language change sound
        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
        oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
        oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    }
}

// Play sound when language changes
const originalSelectLanguage = selectLanguage;
selectLanguage = function(lang, showMessage = true) {
    originalSelectLanguage(lang, showMessage);
    if (showMessage) {
        setTimeout(() => {
            playLanguageChangeSound();
        }, 1000);
    }
};

// Add settings export/import functionality
function addSettingsExport() {
    const exportBtn = document.createElement('button');
    exportBtn.className = 'export-btn';
    exportBtn.innerHTML = '<i class="fas fa-download"></i> AYARLARI EXPORT ET';
    exportBtn.style.cssText = `
        background: linear-gradient(135deg, #00ffff 0%, #0080ff 100%);
        border: none;
        border-radius: 12px;
        padding: 12px 20px;
        color: #000000;
        font-weight: bold;
        cursor: pointer;
        margin-top: 15px;
        width: 100%;
        transition: all 0.3s ease;
    `;
    
    exportBtn.addEventListener('click', exportSettings);
    
    const appInfoGroup = document.querySelector('.setting-group:last-child');
    appInfoGroup.appendChild(exportBtn);
}

// Export settings
function exportSettings() {
    const settings = {
        language: currentLanguage,
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    };
    
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'adsmanat_settings.json';
    link.click();
    
    showMessage('Ayarlar export edildi!', 'success');
}

// Add settings import functionality
function addSettingsImport() {
    const importBtn = document.createElement('button');
    importBtn.className = 'import-btn';
    importBtn.innerHTML = '<i class="fas fa-upload"></i> AYARLARI IMPORT ET';
    importBtn.style.cssText = `
        background: linear-gradient(135deg, #ff00ff 0%, #cc00cc 100%);
        border: none;
        border-radius: 12px;
        padding: 12px 20px;
        color: #ffffff;
        font-weight: bold;
        cursor: pointer;
        margin-top: 10px;
        width: 100%;
        transition: all 0.3s ease;
    `;
    
    importBtn.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.addEventListener('change', importSettings);
        input.click();
    });
    
    const appInfoGroup = document.querySelector('.setting-group:last-child');
    appInfoGroup.appendChild(importBtn);
}

// Import settings
function importSettings(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const settings = JSON.parse(e.target.result);
            
            if (settings.language) {
                selectLanguage(settings.language);
                showMessage('Ayarlar import edildi!', 'success');
            } else {
                showMessage('Yanlış fayl formatı!', 'error');
            }
        } catch (error) {
            showMessage('Fayl oxuna bilmədi!', 'error');
        }
    };
    
    reader.readAsText(file);
}

// Initialize export/import functionality
document.addEventListener('DOMContentLoaded', function() {
    addSettingsExport();
    addSettingsImport();
});

// Add settings reset functionality
function addSettingsReset() {
    const resetBtn = document.createElement('button');
    resetBtn.className = 'reset-btn';
    resetBtn.innerHTML = '<i class="fas fa-undo"></i> AYARLARI SIFIRLA';
    resetBtn.style.cssText = `
        background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
        border: none;
        border-radius: 12px;
        padding: 12px 20px;
        color: #ffffff;
        font-weight: bold;
        cursor: pointer;
        margin-top: 10px;
        width: 100%;
        transition: all 0.3s ease;
    `;
    
    resetBtn.addEventListener('click', resetSettings);
    
    const appInfoGroup = document.querySelector('.setting-group:last-child');
    appInfoGroup.appendChild(resetBtn);
}

// Reset settings
function resetSettings() {
    if (confirm('Bütün ayarları sıfırlamaq istədiyinizə əminsiniz?')) {
        // Reset to default language
        selectLanguage('az');
        
        // Clear all settings
        localStorage.removeItem('adsmanat_language');
        
        showMessage('Ayarlar sıfırlandı!', 'success');
    }
}

// Initialize reset functionality
document.addEventListener('DOMContentLoaded', function() {
    addSettingsReset();
});

// Add settings backup functionality
function addSettingsBackup() {
    // Auto-backup settings every 24 hours
    const lastBackup = localStorage.getItem('adsmanat_last_backup');
    const now = new Date().getTime();
    const oneDay = 24 * 60 * 60 * 1000;
    
    if (!lastBackup || (now - parseInt(lastBackup)) > oneDay) {
        const settings = {
            language: currentLanguage,
            timestamp: new Date().toISOString(),
            version: '1.0.0'
        };
        
        localStorage.setItem('adsmanat_settings_backup', JSON.stringify(settings));
        localStorage.setItem('adsmanat_last_backup', now.toString());
    }
}

// Initialize auto-backup
document.addEventListener('DOMContentLoaded', function() {
    addSettingsBackup();
});