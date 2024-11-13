document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    const colorPicker = document.getElementById('colorPicker');
    const brightnessSlider = document.getElementById('brightnessSlider');
    const brightnessValue = document.getElementById('brightnessValue');
    const lightingBackground = document.getElementById('lightingBackground');
    const fullscreenButton = document.getElementById('fullscreenButton');
    const presetColors = document.querySelectorAll('.preset-color');
    const controlPanel = document.getElementById('controlPanel');
    const toggleButton = document.getElementById('toggleButton');

    let hideTimeout;
    let isControlsVisible = true;

    // Update lighting function
    function updateLighting() {
        const color = colorPicker.value;
        const brightness = brightnessSlider.value;
        
        // Convert hex to RGB for brightness adjustment
        const r = parseInt(color.substr(1,2), 16);
        const g = parseInt(color.substr(3,2), 16);
        const b = parseInt(color.substr(5,2), 16);
        
        // Apply color brightness
        const factor = brightness / 100;
        const adjustedR = Math.round(r * factor);
        const adjustedG = Math.round(g * factor);
        const adjustedB = Math.round(b * factor);
        
        lightingBackground.style.backgroundColor = 
            `rgb(${adjustedR}, ${adjustedG}, ${adjustedB})`;
        
        brightnessValue.textContent = brightness;
    }

    // Controls visibility functions
    function showControls() {
        controlPanel.style.opacity = '1';
        controlPanel.style.visibility = 'visible';
        controlPanel.style.transform = 'scale(1)';
        toggleButton.style.opacity = '0';
        toggleButton.style.visibility = 'hidden';
        isControlsVisible = true;
        resetHideTimeout();
    }

    function hideControls() {
        if (!isControlsVisible) return;
        controlPanel.style.opacity = '0';
        controlPanel.style.visibility = 'hidden';
        controlPanel.style.transform = 'scale(0.95)';
        toggleButton.style.opacity = '1';
        toggleButton.style.visibility = 'visible';
        isControlsVisible = false;
    }

    function resetHideTimeout() {
        clearTimeout(hideTimeout);
        hideTimeout = setTimeout(hideControls, 5000); // Hide after 5 seconds of inactivity
    }

    // Fullscreen handling
    function toggleFullscreen() {
        const elem = document.documentElement;
        
        if (!document.fullscreenElement && !document.webkitFullscreenElement) {
            // Enter fullscreen
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            } else if (elem.webkitRequestFullscreen) { // iOS Safari
                elem.webkitRequestFullscreen();
            }
            fullscreenButton.textContent = '退出全屏';
        } else {
            // Exit fullscreen
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) { // iOS Safari
                document.webkitExitFullscreen();
            }
            fullscreenButton.textContent = '进入全屏';
        }
    }

    // Keyboard shortcuts
    function handleKeyboardShortcuts(e) {
        const step = 5;
        let newBrightness = parseInt(brightnessSlider.value);

        if (e.key === 'ArrowUp') {
            newBrightness = Math.min(100, newBrightness + step);
            e.preventDefault();
        } else if (e.key === 'ArrowDown') {
            newBrightness = Math.max(0, newBrightness - step);
            e.preventDefault();
        }

        if (newBrightness !== parseInt(brightnessSlider.value)) {
            brightnessSlider.value = newBrightness;
            updateLighting();
        }

        // Show controls when using keyboard shortcuts
        showControls();
    }

    // Event listeners
    colorPicker.addEventListener('input', () => {
        updateLighting();
        resetHideTimeout();
    });

    brightnessSlider.addEventListener('input', () => {
        updateLighting();
        resetHideTimeout();
    });

    fullscreenButton.addEventListener('click', () => {
        toggleFullscreen();
        resetHideTimeout();
    });

    toggleButton.addEventListener('click', showControls);

    // Reset hide timeout on any interaction with control panel
    controlPanel.addEventListener('mousemove', resetHideTimeout);
    controlPanel.addEventListener('touchstart', resetHideTimeout);
    controlPanel.addEventListener('click', resetHideTimeout);

    document.addEventListener('keydown', handleKeyboardShortcuts);

    // Handle fullscreen change events
    document.addEventListener('fullscreenchange', () => {
        fullscreenButton.textContent = document.fullscreenElement ? '退出全屏' : '进入全屏';
    });
    document.addEventListener('webkitfullscreenchange', () => {
        fullscreenButton.textContent = document.webkitFullscreenElement ? '退出全屏' : '进入全屏';
    });

    // Preset color buttons
    presetColors.forEach(button => {
        button.addEventListener('click', () => {
            const presetColor = button.dataset.color;
            colorPicker.value = presetColor;
            updateLighting();
            resetHideTimeout();
        });
    });

    // Initialize
    updateLighting();
    resetHideTimeout(); // Start the initial hide timeout
});
