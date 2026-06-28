class ColorGenerator {
    constructor() {
        this.currentColor = '#ffffff';
        this.history = JSON.parse(localStorage.getItem('colorHistory')) || [];
        this.colorNames = [
            'Crimson Red', 'Ocean Blue', 'Emerald Green', 'Sunshine Yellow',
            'Royal Purple', 'Coral Pink', 'Sky Blue', 'Forest Green',
            'Golden Yellow', 'Lavender', 'Turquoise', 'Salmon',
            'Midnight Blue', 'Lime Green', 'Magenta', 'Teal',
            'Peach', 'Indigo', 'Olive', 'Maroon'
        ];
        this.init();
    }

    init() {
        this.loadElements();
        this.setupEventListeners();
        this.loadHistory();
        this.generateQuickPalette();
        this.generateRandomColor();
    }

    loadElements() {
        this.colorDisplay = document.getElementById('colorDisplay');
        this.colorInfo = document.getElementById('colorInfo');
        this.colorName = document.getElementById('colorName');
        this.hexValue = document.getElementById('hexValue');
        this.rgbValue = document.getElementById('rgbValue');
        this.generateBtn = document.getElementById('generateBtn');
        this.copyHexBtn = document.getElementById('copyHexBtn');
        this.copyRgbBtn = document.getElementById('copyRgbBtn');
        this.saveColorBtn = document.getElementById('saveColorBtn');
        this.colorHistory = document.getElementById('colorHistory');
        this.quickPalette = document.getElementById('quickPalette');
        this.toast = document.getElementById('toast');
        this.loading = document.getElementById('loading');

        // Format displays
        this.formatHex = document.getElementById('formatHex');
        this.formatRgb = document.getElementById('formatRgb');
        this.formatHsl = document.getElementById('formatHsl');
        this.formatCmyk = document.getElementById('formatCmyk');

        // Checkboxes
        this.brightColors = document.getElementById('brightColors');
        this.pastelColors = document.getElementById('pastelColors');
        this.darkColors = document.getElementById('darkColors');
        this.namedColors = document.getElementById('namedColors');
    }

    setupEventListeners() {
        this.generateBtn.addEventListener('click', () => this.generateRandomColor());
        this.copyHexBtn.addEventListener('click', () => this.copyToClipboard(this.currentColor));
        this.copyRgbBtn.addEventListener('click', () => this.copyToClipboard(this.hexToRgb(this.currentColor)));
        this.saveColorBtn.addEventListener('click', () => this.saveToHistory());

        // Prevent multiple selections
        const checkboxes = [this.brightColors, this.pastelColors, this.darkColors];
        checkboxes.forEach(cb => {
            cb.addEventListener('change', (e) => {
                if (e.target.checked) {
                    checkboxes.filter(c => c !== e.target).forEach(c => c.checked = false);
                }
            });
        });
    }

    showLoading() {
        this.loading.classList.add('active');
    }

    hideLoading() {
        this.loading.classList.remove('active');
    }

    generateRandomHex() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    generateBrightColor() {
        const hue = Math.floor(Math.random() * 360);
        const saturation = 70 + Math.floor(Math.random() * 30);
        const lightness = 50 + Math.floor(Math.random() * 30);
        return this.hslToHex(hue, saturation, lightness);
    }

    generatePastelColor() {
        const hue = Math.floor(Math.random() * 360);
        const saturation = 30 + Math.floor(Math.random() * 30);
        const lightness = 70 + Math.floor(Math.random() * 20);
        return this.hslToHex(hue, saturation, lightness);
    }

    generateDarkColor() {
        const hue = Math.floor(Math.random() * 360);
        const saturation = 50 + Math.floor(Math.random() * 40);
        const lightness = 10 + Math.floor(Math.random() * 30);
        return this.hslToHex(hue, saturation, lightness);
    }

    hslToHex(h, s, l) {
        h /= 360;
        s /= 100;
        l /= 100;
        let r, g, b;

        if (s === 0) {
            r = g = b = l;
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            };

            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }

        const toHex = x => {
            const hex = Math.round(x * 255).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };

        return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
    }

    hexToRgb(hex) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgb(${r}, ${g}, ${b})`;
    }

    hexToHsl(hex) {
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        h = Math.round(h * 360);
        s = Math.round(s * 100);
        l = Math.round(l * 100);

        return `hsl(${h}, ${s}%, ${l}%)`;
    }

    hexToCmyk(hex) {
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;

        const k = 1 - Math.max(r, g, b);
        const c = (1 - r - k) / (1 - k) || 0;
        const m = (1 - g - k) / (1 - k) || 0;
        const y = (1 - b - k) / (1 - k) || 0;

        return `cmyk(${Math.round(c * 100)}%, ${Math.round(m * 100)}%, ${Math.round(y * 100)}%, ${Math.round(k * 100)}%)`;
    }

    getRandomColorName() {
        if (this.namedColors.checked) {
            return this.colorNames[Math.floor(Math.random() * this.colorNames.length)];
        }
        return 'Custom Color';
    }

    generateRandomColor() {
        this.showLoading();

        setTimeout(() => {
            let color;

            if (this.pastelColors.checked) {
                color = this.generatePastelColor();
            } else if (this.darkColors.checked) {
                color = this.generateDarkColor();
            } else if (this.brightColors.checked) {
                color = this.generateBrightColor();
            } else {
                color = this.generateRandomHex();
            }

            this.currentColor = color;
            this.updateDisplay(color);
            this.hideLoading();
        }, 300);
    }

    updateDisplay(color) {
        // Update background
        this.colorDisplay.style.background = color;

        // Update text color based on brightness
        const brightness = this.getColorBrightness(color);
        const textColor = brightness > 128 ? '#000000' : '#ffffff';
        this.colorInfo.style.color = textColor;
        this.colorInfo.style.background = brightness > 128 ?
            'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)';

        // Update color name and values
        this.colorName.textContent = this.getRandomColorName();
        this.hexValue.textContent = color;
        this.rgbValue.textContent = this.hexToRgb(color);

        // Update format displays
        this.formatHex.textContent = color;
        this.formatRgb.textContent = this.hexToRgb(color);
        this.formatHsl.textContent = this.hexToHsl(color);
        this.formatCmyk.textContent = this.hexToCmyk(color);
    }

    getColorBrightness(hex) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return (r * 299 + g * 587 + b * 114) / 1000;
    }

    copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            this.showToast('Color copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy: ', err);
            this.showToast('Failed to copy color');
        });
    }

    showToast(message) {
        this.toast.textContent = message;
        this.toast.classList.add('show');

        setTimeout(() => {
            this.toast.classList.remove('show');
        }, 2000);
    }

    saveToHistory() {
        if (this.history.length >= 10) {
            this.history.shift();
        }

        const colorData = {
            hex: this.currentColor,
            name: this.getRandomColorName(),
            timestamp: new Date().toLocaleTimeString()
        };

        this.history.push(colorData);
        this.saveHistory();
        this.loadHistory();
        this.showToast('Color saved to history!');
    }

    saveHistory() {
        localStorage.setItem('colorHistory', JSON.stringify(this.history));
    }

    loadHistory() {
        this.colorHistory.innerHTML = '';
        this.history.forEach((colorData, index) => {
            const colorDiv = document.createElement('div');
            colorDiv.className = 'history-color';
            colorDiv.style.background = colorData.hex;
            colorDiv.title = `${colorData.name}\n${colorData.hex}\n${colorData.timestamp}`;

            colorDiv.addEventListener('click', () => {
                this.currentColor = colorData.hex;
                this.updateDisplay(colorData.hex);
            });

            this.colorHistory.appendChild(colorDiv);
        });
    }

    generateQuickPalette() {
        const colors = [
            '#FF6B6B', '#4ECDC4', '#FFD166', '#06D6A0',
            '#118AB2', '#EF476F', '#FFD166', '#118AB2',
            '#073B4C', '#7209B7', '#3A86FF', '#FB5607'
        ];

        this.quickPalette.innerHTML = '';
        colors.forEach(color => {
            const colorDiv = document.createElement('div');
            colorDiv.className = 'palette-color';
            colorDiv.style.background = color;
            colorDiv.title = color;

            colorDiv.addEventListener('click', () => {
                this.currentColor = color;
                this.updateDisplay(color);
            });

            this.quickPalette.appendChild(colorDiv);
        });
    }
}

// Initialize the color generator
document.addEventListener('DOMContentLoaded', () => {
    new ColorGenerator();
});
