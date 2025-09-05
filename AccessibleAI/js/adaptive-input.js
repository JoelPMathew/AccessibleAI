/**
 * Adaptive Input Handler
 * Handles input mapping for different abilities and assistive devices
 */

class AdaptiveInputHandler {
    constructor(deviceManager) {
        this.deviceManager = deviceManager;
        this.currentInputMode = 'standard';
        this.inputBuffer = [];
        this.scanningMode = false;
        this.scanningIndex = 0;
        this.scanningInterval = null;
        this.dwellTime = 1000;
        this.holdThreshold = 500;
        this.holdTimers = new Map();
        
        this.setupInputHandlers();
        this.loadSettings();
    }
    
    setupInputHandlers() {
        // Listen for assistive input events
        document.addEventListener('assistiveInput', (event) => {
            this.handleAssistiveInput(event.detail);
        });
        
        // Listen for standard input events
        document.addEventListener('keydown', (event) => {
            this.handleStandardInput(event);
        });
        
        document.addEventListener('click', (event) => {
            this.handleStandardInput(event);
        });
        
        // Listen for touch events
        document.addEventListener('touchstart', (event) => {
            this.handleStandardInput(event);
        });
    }
    
    handleAssistiveInput(inputDetail) {
        const { type, value, profile } = inputDetail;
        
        // Process input based on current profile
        const profileInfo = this.deviceManager.getProfileInfo(profile);
        const settings = profileInfo.settings || {};
        
        // Apply profile-specific processing
        switch (profile) {
            case 'limitedArmMobility':
                this.handleLimitedArmMobilityInput(type, value, settings);
                break;
            case 'switchDevice':
                this.handleSwitchDeviceInput(type, value, settings);
                break;
            case 'wheelchair':
                this.handleWheelchairInput(type, value, settings);
                break;
            case 'prosthetic':
                this.handleProstheticInput(type, value, settings);
                break;
            default:
                this.handleStandardInput({ type, value });
        }
    }
    
    handleLimitedArmMobilityInput(type, value, settings) {
        // Implement hold-to-activate if enabled
        if (settings.holdToActivate) {
            this.handleHoldToActivate(type, value);
        } else {
            this.processInput(type, value);
        }
        
        // Implement dwell time if enabled
        if (settings.dwellTime) {
            this.handleDwellTime(type, value, settings.dwellTime);
        }
    }
    
    handleSwitchDeviceInput(type, value, settings) {
        if (settings.scanningMode) {
            this.handleScanningMode(type, value, settings);
        } else {
            this.processInput(type, value);
        }
    }
    
    handleWheelchairInput(type, value, settings) {
        // Handle wheelchair-specific inputs
        if (type === 'move' && value === 'joystick') {
            this.handleJoystickInput(value);
        } else {
            this.processInput(type, value);
        }
        
        // Enable accessible path highlighting
        if (settings.accessiblePaths) {
            this.highlightAccessiblePaths();
        }
    }
    
    handleProstheticInput(type, value, settings) {
        // Handle gesture recognition
        if (type === 'gesture') {
            this.handleGestureInput(value);
        } else {
            this.processInput(type, value);
        }
        
        // Apply adaptive sensitivity
        if (settings.adaptiveSensitivity) {
            this.applyAdaptiveSensitivity(type, value);
        }
    }
    
    handleHoldToActivate(type, value) {
        const inputKey = `${type}-${value}`;
        
        if (this.holdTimers.has(inputKey)) {
            // Input is being held, check if threshold is met
            const startTime = this.holdTimers.get(inputKey);
            const holdDuration = Date.now() - startTime;
            
            if (holdDuration >= this.holdThreshold) {
                this.processInput(type, value);
                this.holdTimers.delete(inputKey);
            }
        } else {
            // Start hold timer
            this.holdTimers.set(inputKey, Date.now());
        }
    }
    
    handleDwellTime(type, value, dwellTime) {
        // Clear existing timer for this input
        const inputKey = `${type}-${value}`;
        if (this.holdTimers.has(inputKey)) {
            clearTimeout(this.holdTimers.get(inputKey));
        }
        
        // Set new timer
        const timer = setTimeout(() => {
            this.processInput(type, value);
            this.holdTimers.delete(inputKey);
        }, dwellTime);
        
        this.holdTimers.set(inputKey, timer);
    }
    
    handleScanningMode(type, value, settings) {
        if (type === 'switch1') {
            // Start/stop scanning
            this.toggleScanningMode(settings);
        } else if (type === 'switch2') {
            // Select current item
            this.selectCurrentItem();
        }
    }
    
    toggleScanningMode(settings) {
        if (this.scanningMode) {
            this.stopScanning();
        } else {
            this.startScanning(settings);
        }
    }
    
    startScanning(settings) {
        this.scanningMode = true;
        this.scanningIndex = 0;
        this.scanningInterval = setInterval(() => {
            this.highlightNextItem();
        }, settings.scanSpeed || 2000);
        
        // Scanning mode started
    }
    
    stopScanning() {
        this.scanningMode = false;
        if (this.scanningInterval) {
            clearInterval(this.scanningInterval);
            this.scanningInterval = null;
        }
        
        // Clear all highlights
        this.clearHighlights();
        // Scanning mode stopped
    }
    
    highlightNextItem() {
        // Clear previous highlight
        this.clearHighlights();
        
        // Get all interactive elements
        const interactiveElements = this.getInteractiveElements();
        
        if (interactiveElements.length === 0) return;
        
        // Highlight current element
        const currentElement = interactiveElements[this.scanningIndex];
        this.highlightElement(currentElement);
        
        // Move to next element
        this.scanningIndex = (this.scanningIndex + 1) % interactiveElements.length;
    }
    
    getInteractiveElements() {
        // Get all clickable/interactive elements
        const selectors = [
            '.clickable-object',
            'button',
            'a',
            '[role="button"]',
            '[tabindex]'
        ];
        
        const elements = [];
        selectors.forEach(selector => {
            elements.push(...document.querySelectorAll(selector));
        });
        
        return elements.filter(el => el.offsetParent !== null); // Only visible elements
    }
    
    highlightElement(element) {
        element.style.outline = '3px solid #3498db';
        element.style.outlineOffset = '2px';
        element.style.backgroundColor = 'rgba(52, 152, 219, 0.1)';
        
        // Add highlight class for styling
        element.classList.add('scanning-highlight');
    }
    
    clearHighlights() {
        const highlightedElements = document.querySelectorAll('.scanning-highlight');
        highlightedElements.forEach(el => {
            el.style.outline = '';
            el.style.outlineOffset = '';
            el.style.backgroundColor = '';
            el.classList.remove('scanning-highlight');
        });
    }
    
    selectCurrentItem() {
        const highlightedElement = document.querySelector('.scanning-highlight');
        if (highlightedElement) {
            highlightedElement.click();
        }
    }
    
    handleJoystickInput(value) {
        // Handle joystick input for wheelchair users
        // This would typically come from a connected joystick device
        this.processInput('move', value);
    }
    
    handleGestureInput(value) {
        // Handle gesture recognition for prosthetic users
        const gestureMap = {
            'swipe_up': 'move_forward',
            'swipe_down': 'move_backward',
            'swipe_left': 'move_left',
            'swipe_right': 'move_right',
            'tap': 'interact',
            'double_tap': 'menu'
        };
        
        const mappedAction = gestureMap[value];
        if (mappedAction) {
            this.processInput('gesture', mappedAction);
        }
    }
    
    applyAdaptiveSensitivity(type, value) {
        // Adjust sensitivity based on user's input patterns
        // This would analyze input patterns and adjust thresholds
        // Adaptive sensitivity applied without logging
    }
    
    highlightAccessiblePaths() {
        // Highlight accessible paths for wheelchair users
        const accessibleElements = document.querySelectorAll('.accessibility-feature');
        accessibleElements.forEach(el => {
            el.style.outline = '2px solid #27ae60';
            el.style.outlineOffset = '1px';
        });
    }
    
    handleStandardInput(event) {
        let type, value;
        
        if (event.type === 'keydown') {
            type = this.mapKeyToAction(event.key);
            value = event.key;
        } else if (event.type === 'click') {
            type = 'interact';
            value = 'click';
        } else if (event.type === 'touchstart') {
            type = 'interact';
            value = 'touch';
        }
        
        if (type) {
            this.processInput(type, value);
        }
    }
    
    mapKeyToAction(key) {
        const keyMap = {
            'w': 'move',
            'a': 'move',
            's': 'move',
            'd': 'move',
            'ArrowUp': 'move',
            'ArrowDown': 'move',
            'ArrowLeft': 'move',
            'ArrowRight': 'move',
            ' ': 'interact',
            'Enter': 'interact',
            'Escape': 'menu',
            'm': 'menu'
        };
        
        return keyMap[key] || null;
    }
    
    processInput(type, value) {
        // Process the input and trigger appropriate actions
        
        // Add to input buffer for analysis
        this.inputBuffer.push({
            type,
            value,
            timestamp: Date.now()
        });
        
        // Keep buffer size manageable
        if (this.inputBuffer.length > 100) {
            this.inputBuffer = this.inputBuffer.slice(-50);
        }
        
        // Trigger input event
        this.triggerInputEvent(type, value);
        
        // Provide feedback
        this.provideInputFeedback(type, value);
    }
    
    triggerInputEvent(type, value) {
        const event = new CustomEvent('adaptiveInput', {
            detail: {
                type,
                value,
                timestamp: Date.now(),
                mode: this.currentInputMode
            }
        });
        
        document.dispatchEvent(event);
    }
    
    provideInputFeedback(type, value) {
        // Visual feedback
        this.showInputFeedback(type, value);
        
        // Audio feedback
        this.playInputSound(type, value);
        
        // Haptic feedback (if available)
        this.provideHapticFeedback(type, value);
    }
    
    showInputFeedback(type, value) {
        // Create visual feedback element
        const feedback = document.createElement('div');
        feedback.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(52, 152, 219, 0.9);
            color: white;
            padding: 10px 20px;
            border-radius: 8px;
            font-weight: 600;
            z-index: 1000;
            pointer-events: none;
            animation: fadeInOut 1s ease-in-out;
        `;
        
        feedback.textContent = `${type}: ${value}`;
        document.body.appendChild(feedback);
        
        // Remove after animation
        setTimeout(() => {
            feedback.remove();
        }, 1000);
    }
    
    playInputSound(type, value) {
        // Play different sounds for different input types
        const soundMap = {
            'move': 400,
            'interact': 600,
            'menu': 800,
            'gesture': 500
        };
        
        const frequency = soundMap[type] || 500;
        this.playTone(frequency, 0.1);
    }
    
    playTone(frequency, duration) {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + duration);
        } catch (error) {
            // Audio not available
        }
    }
    
    provideHapticFeedback(type, value) {
        // Provide haptic feedback through device manager
        if (this.deviceManager && this.deviceManager.provideHapticFeedback) {
            const intensity = this.getHapticIntensity(type);
            this.deviceManager.provideHapticFeedback(intensity, 100);
        }
    }
    
    getHapticIntensity(type) {
        const intensityMap = {
            'move': 0.3,
            'interact': 0.7,
            'menu': 0.5,
            'gesture': 0.6
        };
        
        return intensityMap[type] || 0.5;
    }
    
    loadSettings() {
        const settings = localStorage.getItem('assistiveDeviceSettings');
        if (settings) {
            try {
                const parsedSettings = JSON.parse(settings);
                this.applySettings(parsedSettings);
            } catch (error) {
                console.error('Failed to load settings:', error);
            }
        }
    }
    
    applySettings(settings) {
        if (settings.holdToActivate) {
            this.holdThreshold = 500;
        }
        
        if (settings.scanningMode) {
            this.scanningMode = true;
        }
        
        if (settings.dwellTime) {
            this.dwellTime = settings.dwellTime;
        }
    }
    
    getInputStatistics() {
        return {
            totalInputs: this.inputBuffer.length,
            inputTypes: this.getInputTypeCounts(),
            recentInputs: this.inputBuffer.slice(-10),
            scanningMode: this.scanningMode,
            currentMode: this.currentInputMode
        };
    }
    
    getInputTypeCounts() {
        const counts = {};
        this.inputBuffer.forEach(input => {
            counts[input.type] = (counts[input.type] || 0) + 1;
        });
        return counts;
    }
    
    resetInputBuffer() {
        this.inputBuffer = [];
    }
    
    setInputMode(mode) {
        this.currentInputMode = mode;
        // Input mode changed without logging
    }
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInOut {
        0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        50% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
        100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
    }
    
    .scanning-highlight {
        animation: scanningPulse 1s ease-in-out infinite;
    }
    
    @keyframes scanningPulse {
        0%, 100% { outline-color: #3498db; }
        50% { outline-color: #e74c3c; }
    }
`;
document.head.appendChild(style);

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdaptiveInputHandler;
}
