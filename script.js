/* ==========================================================
   CHRONICLES OF ELYSIUM - LÓGICA E INTERACTIVIDAD (JS)
   ================================================---------- */

document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTOS DOM ---
    const siteTitleDisplay = document.getElementById('site-title-display');
    const siteTitleTag = document.getElementById('site-title-tag');
    const textColorPicker = document.getElementById('textColorPicker');
    const textColorHex = document.getElementById('textColorHex');
    const bgColorPicker = document.getElementById('bgColorPicker');
    const bgColorHex = document.getElementById('bgColorHex');
    const overlayOpacity = document.getElementById('overlayOpacity');
    const opacityVal = document.getElementById('opacityVal');
    const bgImageInput = document.getElementById('bgImageInput');
    const bgUrlInput = document.getElementById('bgUrlInput');
    const applyBgUrl = document.getElementById('applyBgUrl');
    const resetBg = document.getElementById('resetBg');
    
    const vaultFileInput = document.getElementById('vaultFileInput');
    const vaultGrid = document.getElementById('vaultGrid');
    
    const chronicleForm = document.getElementById('chronicleForm');
    const chronicleTitle = document.getElementById('chronicleTitle');
    const chronicleCategory = document.getElementById('chronicleCategory');
    const chronicleText = document.getElementById('chronicleText');
    const chroniclesList = document.getElementById('chroniclesList');

    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');

    // --- ESTADO INICIAL DESDE LOCALSTORAGE ---
    loadSavedSettings();
    loadVaultFiles();
    loadChronicles();

    // --- MENÚ MÓVIL ---
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // --- NOMBRE ÉPICO EDITABLE ---
    siteTitleDisplay.addEventListener('blur', () => {
        const newTitle = siteTitleDisplay.textContent.trim() || 'Chronicles of Elysium';
        siteTitleDisplay.textContent = newTitle;
        siteTitleTag.textContent = newTitle;
        localStorage.setItem('elysium_title', newTitle);
    });

    // --- ALQUIMIA VISUAL (COLORES Y ESTILOS) ---
    textColorPicker.addEventListener('input', (e) => {
        const color = e.target.value;
        textColorHex.textContent = color;
        document.documentElement.style.setProperty('--text-color', color);
        localStorage.setItem('elysium_text_color', color);
    });

    bgColorPicker.addEventListener('input', (e) => {
        const color = e.target.value;
        bgColorHex.textContent = color;
        document.documentElement.style.setProperty('--bg-base', color);
        localStorage.setItem('elysium_bg_color', color);
    });

    overlayOpacity.addEventListener('input', (e) => {
        const val = e.target.value;
        opacityVal.textContent = val;
        const alpha = val / 100;
        document.documentElement.style.setProperty('--overlay-alpha', alpha);
        localStorage.setItem('elysium_overlay_opacity', val);
    });

    // --- FONDOS PERSONALIZADOS ---
    bgImageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const imageUrl = event.target.result;
                setCustomBackground(imageUrl);
                localStorage.setItem('elysium_bg_image', imageUrl);
            };
            reader.readAsDataURL(file);
        }
    });

    applyBgUrl.addEventListener('click', () => {
        const url = bgUrlInput.value.trim();
        if (url) {
            setCustomBackground(url);
            localStorage.setItem('elysium_bg_image', url);
            bgUrlInput.value = '';
        }
    });

    resetBg.addEventListener('click', () => {
        document.documentElement.style.setProperty('--custom-bg-image', 'none');
        localStorage.removeItem('elysium_bg_image');
        alert('Fondo restaurado al estado original.');
    });

    function setCustomBackground(url) {
        document.documentElement.style.setProperty('--custom-bg-image', `url('${url}')`);
    }

    function loadSavedSettings() {
        // Título
        const savedTitle = localStorage.getItem('elysium_title');
        if (savedTitle) {
            siteTitleDisplay.textContent = savedTitle;
            siteTitleTag.textContent = savedTitle;
        }

        // Color de letra
        const savedTextColor = localStorage.getItem('elysium_text_color');
        if (savedTextColor) {
            textColorPicker.value = savedTextColor;
            textColorHex.textContent = savedTextColor;
            document.documentElement.style.setProperty('--text-color', savedTextColor);
        }

        // Color de fondo
        const savedBgColor = localStorage.getItem('elysium_bg_color');
        if (savedBgColor) {
            bgColorPicker.value = savedBgColor;
            bgColorHex.textContent = savedBgColor;
            document.documentElement.style.setProperty('--bg-base', savedBgColor);
        }

        // Opacidad
        const savedOpacity = localStorage.getItem('elysium_overlay_opacity');
        if (savedOpacity) {
            overlayOpacity.value = savedOpacity;
            opacityVal.textContent = savedOpacity;
            document.documentElement.style.setProperty('--overlay-alpha', savedOpacity / 100);
        }

        // Imagen de fondo
        const savedBgImage = localStorage.getItem('elysium_bg_image');
        if (savedBgImage) {
            setCustomBackground(savedBgImage);
        }
    }

    // --- BÓVEDA DE ARCHIVOS (LOCALSTORAGE) ---
    vaultFileInput.addEventListener('change', (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        let vaultFiles = JSON.parse(localStorage.getItem('elysium_vault')) || [];

        let processed = 0;
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = function(event) {
                const fileData = {
                    id: Date.now() + Math.random(),
                    name: file.name,
                    size: formatFileSize(file.size),
                    type: file.type,
                    dataUrl: event.target.result
                };
                vaultFiles.push(fileData);
                processed++;
                if (processed === files.length) {
                    localStorage.setItem('elysium_vault', JSON.stringify(vaultFiles));
                    loadVaultFiles();
                }
            };
            reader.readAsDataURL(file);
        });
    });

    function loadVaultFiles() {
        const vaultFiles = JSON.parse(localStorage.getItem('elysium_vault')) || [];
        if (vaultFiles.length === 0) {
            vaultGrid.innerHTML = '<p class="empty-notice">La bóveda está actualmente silenciosa y vacía...</p>';
            return;
        }

        vaultGrid.innerHTML = '';
        vaultFiles.forEach(file => {
            const isImage = file.type.startsWith('image/');
            const item = document.createElement('div');
            item.className = 'vault-item';
            
            item.innerHTML = `
                ${isImage ? `<img src="${file.dataUrl}" class="vault-item-preview" alt="${file.name}">` : `<div class="vault-item-preview" style="display:flex;align-items:center;justify-content:center;font-size:2rem;">📄</div>`}
                <div class="vault-item-info">
                    <span class="vault-item-name" title="${file.name}">${file.name}</span>
                    <span class="vault-item-size">${file.size}</span>
                </div>
                <div class="vault-item-actions">
                    <a href="${file.dataUrl}" download="${file.name}" class="vault-btn">Descargar</a>
                    <button class="vault-btn delete" onclick="deleteVaultFile(${file.id})">Eliminar</button>
                </div>
            `;
            vaultGrid.appendChild(item);
        });
    }

    window.deleteVaultFile = function(id) {
        let vaultFiles = JSON.parse(localStorage.getItem('elysium_vault')) || [];
        vaultFiles = vaultFiles.filter(f => f.id !== id);
        localStorage.setItem('elysium_vault', JSON.stringify(vaultFiles));
        loadVaultFiles();
    };

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // --- FORMULARIO DE CRÓNICAS ---
    chronicleForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = chronicleTitle.value.trim();
        const category = chronicleCategory.value;
        const text = chronicleText.value.trim();

        if (!title || !text) return;

        const newChronicle = {
            id: Date.now(),
            title,
            category,
            text
        };

        let chronicles = JSON.parse(localStorage.getItem('elysium_chronicles')) || [];
        chronicles.unshift(newChronicle);
        localStorage.setItem('elysium_chronicles', JSON.stringify(chronicles));

        chronicleTitle.value = '';
        chronicleText.value = '';
        loadChronicles();
    });

    function loadChronicles() {
        const chronicles = JSON.parse(localStorage.getItem('elysium_chronicles')) || [];
        if (chronicles.length === 0) {
            chroniclesList.innerHTML = '<p class="empty-notice">Aún no se han inscrito crónicas en los anales...</p>';
            return;
        }

        chroniclesList.innerHTML = '';
        chronicles.forEach(c => {
            const card = document.createElement('div');
            card.className = 'chronicle-card';
            card.innerHTML = `
                <span class="chronicle-tag">${c.category}</span>
                <h5>${c.title}</h5>
                <p>${c.text}</p>
                <button class="chronicle-delete" onclick="deleteChronicle(${c.id})" title="Borrar crónica">🗑️</button>
            `;
            chroniclesList.appendChild(card);
        });
    }

    window.deleteChronicle = function(id) {
        let chronicles = JSON.parse(localStorage.getItem('elysium_chronicles')) || [];
        chronicles = chronicles.filter(c => c.id !== id);
        localStorage.setItem('elysium_chronicles', JSON.stringify(chronicles));
        loadChronicles();
    };
});
