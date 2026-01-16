// Variables globales
let qrcode = null;
let currentQRData = '';

// Elementos del DOM
const textInput = document.getElementById('text-input');
const generateBtn = document.getElementById('generate-btn');
const downloadBtn = document.getElementById('download-btn');
const sizeSelect = document.getElementById('size-select');
const colorPicker = document.getElementById('color-picker');
const bgColorPicker = document.getElementById('bg-color-picker');
const qrContainer = document.getElementById('qrcode');
const statusEl = document.getElementById('status');

// Funciones de utilidad
function showStatus(message, type = 'success') {
    statusEl.textContent = message;
    statusEl.className = `status ${type}`;
    setTimeout(() => {
        statusEl.textContent = '';
        statusEl.className = 'status';
    }, 3000);
}

function clearQR() {
    if (qrcode) {
        qrContainer.innerHTML = '';
        qrcode = null;
    }
}

function generateQR() {
    const text = textInput.value.trim();
    
    if (!text) {
        showStatus('Por favor ingresa algún texto o URL', 'error');
        return;
    }
    
    // Limpiar QR anterior
    clearQR();
    
    // Configuración del QR
    const size = parseInt(sizeSelect.value);
    const color = colorPicker.value;
    const bgColor = bgColorPicker.value;
    
    try {
        // Crear nuevo QR
        qrcode = new QRCode(qrContainer, {
            text: text,
            width: size,
            height: size,
            colorDark: color,
            colorLight: bgColor,
            correctLevel: QRCode.CorrectLevel.H
        });
        
        currentQRData = text;
        downloadBtn.disabled = false;
        showStatus('¡Código QR generado exitosamente!', 'success');
        
    } catch (error) {
        showStatus('Error al generar el código QR', 'error');
        console.error('Error:', error);
    }
}

function downloadQR() {
    if (!qrcode) return;
    
    try {
        // Obtener el canvas del QR
        const canvas = qrContainer.querySelector('canvas');
        if (!canvas) {
            showStatus('No se encontró el código QR', 'error');
            return;
        }
        
        // Crear enlace de descarga
        const link = document.createElement('a');
        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        link.download = `qr-code-${timestamp}.png`;
        link.href = canvas.toDataURL('image/png');
        
        // Disparar descarga
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showStatus('¡Código QR descargado!', 'success');
        
    } catch (error) {
        showStatus('Error al descargar el código QR', 'error');
        console.error('Error:', error);
    }
}

// Event listeners
generateBtn.addEventListener('click', generateQR);
downloadBtn.addEventListener('click', downloadQR);

// Generar QR al presionar Enter
textInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        generateQR();
    }
});

// Generar QR automáticamente al cambiar opciones
[sizeSelect, colorPicker, bgColorPicker].forEach(element => {
    element.addEventListener('change', () => {
        if (textInput.value.trim() && qrcode) {
            generateQR();
        }
    });
});

// Ejemplo al cargar la página
window.addEventListener('load', () => {
    textInput.value = 'https://github.com';
    generateQR();
});