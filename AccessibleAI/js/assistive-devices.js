/**
 * Assistive Device Integration System
 * Supports VR controllers, motion capture sensors, smart mobility devices, and switch devices
 */

class AssistiveDeviceManager {
    constructor() {
        this.devices = new Map();
        this.inputMappings = new Map();
        this.currentProfile = 'default';
        this.isInitialized = false;
        this.eventListeners = new Map();
        
        // Device capabilities
        this.capabilities = {
            vrControllers: false,
            motionCapture: false,
            smartMobility: false,
            switchDevices: false,
            eyeTracking: false,
            voiceControl: false
        };
        
        // Input mapping profiles for different abilities
        this.profiles = {
            default: {
                name: 'Standard Controls',
                description: 'Standard keyboard and mouse controls',
                inputs: {
                    'move': ['w', 'a', 's', 'd', 'arrow'],
                    'interact': ['space', 'enter', 'click'],
                    'menu': ['escape', 'm'],
                    'voice': ['v']
                }
            },
            limitedArmMobility: {
                name: 'Limited Arm Mobility',
                description: 'Optimized for users with limited arm movement',
                inputs: {
                    'move': ['w', 'a', 's', 'd', 'arrow', 'voice'],
                    'interact': ['space', 'enter', 'voice', 'switch1'],
                    'menu': ['escape', 'm', 'voice'],
                    'voice': ['v', 'voice']
                },
                settings: {
                    'holdToActivate': true,
                    'dwellTime': 1000,
                    'voiceCommands': true
                }
            },
            switchDevice: {
                name: 'Switch Device',
                description: 'Single or dual switch input support',
                inputs: {
                    'move': ['switch1', 'switch2', 'voice'],
                    'interact': ['switch1', 'voice'],
                    'menu': ['switch2', 'voice'],
                    'voice': ['voice']
                },
                settings: {
                    'scanningMode': true,
                    'scanSpeed': 2000,
                    'voiceCommands': true,
                    'switchCount': 2
                }
            },
            wheelchair: {
                name: 'Wheelchair User',
                description: 'Optimized for wheelchair users',
                inputs: {
                    'move': ['w', 'a', 's', 'd', 'arrow', 'joystick'],
                    'interact': ['space', 'enter', 'joystick_button'],
                    'menu': ['escape', 'm'],
                    'voice': ['v']
                },
                settings: {
                    'wheelchairMode': true,
                    'rampDetection': true,
                    'accessiblePaths': true
                }
            },
            prosthetic: {
                name: 'Prosthetic User',
                description: 'Adapted for prosthetic limb users',
                inputs: {
                    'move': ['w', 'a', 's', 'd', 'arrow', 'gesture'],
                    'interact': ['space', 'enter', 'gesture'],
                    'menu': ['escape', 'm', 'gesture'],
                    'voice': ['v']
                },
                settings: {
                    'gestureRecognition': true,
                    'adaptiveSensitivity': true,
                    'voiceCommands': true
                }
            }
        };
        
        this.init();
    }
    
    async init() {
        try {
            await this.detectDevices();
            this.setupEventListeners();
            this.loadUserPreferences();
            this.isInitialized = true;
            console.log('Assistive Device Manager initialized');
        } catch (error) {
            console.error('Failed to initialize Assistive Device Manager:', error);
        }
    }
    
    async detectDevices() {
        // Detect VR controllers
        if (navigator.getGamepads) {
            const gamepads = navigator.getGamepads();
            for (let i = 0; i < gamepads.length; i++) {
                if (gamepads[i]) {
                    this.registerVRController(gamepads[i], i);
                }
            }
        }
        
        // Detect WebXR support
        if (navigator.xr) {
            try {
                const isSupported = await navigator.xr.isSessionSupported('immersive-vr');
                if (isSupported) {
                    this.capabilities.vrControllers = true;
                    this.setupWebXRSupport();
                }
            } catch (error) {
                console.log('WebXR not supported');
            }
        }
        
        // Detect motion capture capabilities
        this.detectMotionCapture();
        
        // Detect smart mobility devices
        this.detectSmartMobilityDevices();
        
        // Detect switch devices
        this.detectSwitchDevices();
        
        // Detect voice control
        this.detectVoiceControl();
    }
    
    registerVRController(gamepad, index) {
        const controller = {
            id: `vr-controller-${index}`,
            type: 'vr-controller',
            gamepad: gamepad,
            index: index,
            buttons: gamepad.buttons.map(btn => ({
                pressed: btn.pressed,
                touched: btn.touched,
                value: btn.value
            })),
            axes: [...gamepad.axes],
            haptic: gamepad.hapticActuators ? gamepad.hapticActuators[0] : null
        };
        
        this.devices.set(controller.id, controller);
        this.capabilities.vrControllers = true;
        
        console.log(`VR Controller ${index} detected:`, gamepad.id);
    }
    
    setupWebXRSupport() {
        // WebXR session management
        this.xrSession = null;
        this.xrReferenceSpace = null;
        
        // Add WebXR button to UI
        this.createWebXRButton();
    }
    
    createWebXRButton() {
        const button = document.createElement('button');
        button.id = 'xr-button';
        button.innerHTML = '🎮 Enter VR';
        button.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            z-index: 1000;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border: none;
            border-radius: 12px;
            padding: 12px 20px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
            transition: all 0.3s ease;
        `;
        
        button.addEventListener('click', () => this.enterVR());
        document.body.appendChild(button);
    }
    
    async enterVR() {
        try {
            if (!this.xrSession) {
                this.xrSession = await navigator.xr.requestSession('immersive-vr');
                this.xrReferenceSpace = await this.xrSession.requestReferenceSpace('local');
                
                // Set up VR event listeners
                this.setupVREventListeners();
                
                console.log('VR session started');
            }
        } catch (error) {
            console.error('Failed to start VR session:', error);
        }
    }
    
    setupVREventListeners() {
        if (!this.xrSession) return;
        
        this.xrSession.addEventListener('end', () => {
            this.xrSession = null;
            this.xrReferenceSpace = null;
            console.log('VR session ended');
        });
    }
    
    detectMotionCapture() {
        // Check for device motion API
        if (window.DeviceMotionEvent) {
            this.capabilities.motionCapture = true;
            this.setupMotionCapture();
        }
        
        // Check for MediaDevices API for camera-based motion capture
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            this.capabilities.motionCapture = true;
        }
    }
    
    setupMotionCapture() {
        // Device motion event listener
        window.addEventListener('devicemotion', (event) => {
            this.handleMotionData(event);
        });
        
        // Device orientation event listener
        window.addEventListener('deviceorientation', (event) => {
            this.handleOrientationData(event);
        });
    }
    
    handleMotionData(event) {
        const motionData = {
            acceleration: {
                x: event.acceleration.x,
                y: event.acceleration.y,
                z: event.acceleration.z
            },
            rotationRate: {
                alpha: event.rotationRate.alpha,
                beta: event.rotationRate.beta,
                gamma: event.rotationRate.gamma
            }
        };
        
        this.processMotionInput(motionData);
    }
    
    handleOrientationData(event) {
        const orientationData = {
            alpha: event.alpha,
            beta: event.beta,
            gamma: event.gamma
        };
        
        this.processOrientationInput(orientationData);
    }
    
    processMotionInput(motionData) {
        // Process motion data for gesture recognition
        const gesture = this.recognizeGesture(motionData);
        if (gesture) {
            this.triggerInput('gesture', gesture);
        }
    }
    
    processOrientationInput(orientationData) {
        // Process orientation data for head movement
        const headMovement = this.processHeadMovement(orientationData);
        if (headMovement) {
            this.triggerInput('head', headMovement);
        }
    }
    
    recognizeGesture(motionData) {
        // Simple gesture recognition based on motion patterns
        const { acceleration } = motionData;
        const magnitude = Math.sqrt(acceleration.x**2 + acceleration.y**2 + acceleration.z**2);
        
        if (magnitude > 15) {
            // High acceleration - potential gesture
            if (acceleration.y > 10) {
                return 'swipe_up';
            } else if (acceleration.y < -10) {
                return 'swipe_down';
            } else if (acceleration.x > 10) {
                return 'swipe_right';
            } else if (acceleration.x < -10) {
                return 'swipe_left';
            }
        }
        
        return null;
    }
    
    processHeadMovement(orientationData) {
        // Process head movement for navigation
        const { alpha, beta, gamma } = orientationData;
        
        // Convert to movement commands
        if (beta > 20) {
            return 'look_down';
        } else if (beta < -20) {
            return 'look_up';
        } else if (alpha > 20) {
            return 'look_left';
        } else if (alpha < -20) {
            return 'look_right';
        }
        
        return null;
    }
    
    detectSmartMobilityDevices() {
        // Check for wheelchair/walker specific APIs or devices
        // This would typically involve checking for specific device drivers
        // or custom APIs provided by mobility device manufacturers
        
        // For now, we'll simulate detection based on user preferences
        const mobilityType = localStorage.getItem('mobilityType');
        if (mobilityType && mobilityType !== 'none') {
            this.capabilities.smartMobility = true;
            this.setupSmartMobilityDevice(mobilityType);
        }
    }
    
    setupSmartMobilityDevice(type) {
        const device = {
            id: `smart-mobility-${type}`,
            type: 'smart-mobility',
            mobilityType: type,
            capabilities: this.getMobilityCapabilities(type)
        };
        
        this.devices.set(device.id, device);
        console.log(`Smart mobility device detected: ${type}`);
    }
    
    getMobilityCapabilities(type) {
        const capabilities = {
            wheelchair: {
                joystick: true,
                voiceControl: true,
                rampDetection: true,
                accessiblePaths: true
            },
            walker: {
                voiceControl: true,
                stableSurfaces: true,
                handrailSupport: true
            },
            prosthetic: {
                gestureRecognition: true,
                adaptiveSensitivity: true,
                voiceControl: true
            }
        };
        
        return capabilities[type] || {};
    }
    
    detectSwitchDevices() {
        // Check for switch device support
        // This would typically involve checking for specific switch device drivers
        // or custom APIs
        
        // For now, we'll provide keyboard-based switch simulation
        this.capabilities.switchDevices = true;
        this.setupSwitchDeviceSupport();
    }
    
    setupSwitchDeviceSupport() {
        // Map keyboard keys to switch inputs
        const switchMappings = {
            'switch1': 'Space',
            'switch2': 'Enter',
            'switch3': 'Shift',
            'switch4': 'Control'
        };
        
        Object.entries(switchMappings).forEach(([switchName, key]) => {
            this.inputMappings.set(switchName, key);
        });
        
        console.log('Switch device support enabled');
    }
    
    detectVoiceControl() {
        // Check for Web Speech API support
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            this.capabilities.voiceControl = true;
            this.setupVoiceControl();
        }
    }
    
    setupVoiceControl() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.voiceRecognition = new SpeechRecognition();
        
        this.voiceRecognition.continuous = true;
        this.voiceRecognition.interimResults = false;
        this.voiceRecognition.lang = 'en-US';
        
        this.voiceRecognition.onresult = (event) => {
            const command = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
            this.processVoiceCommand(command);
        };
        
        this.voiceRecognition.onerror = (event) => {
            console.error('Voice recognition error:', event.error);
        };
        
        console.log('Voice control enabled');
    }
    
    processVoiceCommand(command) {
        const voiceCommands = {
            'move forward': () => this.triggerInput('move', 'forward'),
            'move back': () => this.triggerInput('move', 'backward'),
            'move left': () => this.triggerInput('move', 'left'),
            'move right': () => this.triggerInput('move', 'right'),
            'interact': () => this.triggerInput('interact', 'primary'),
            'menu': () => this.triggerInput('menu', 'open'),
            'select': () => this.triggerInput('interact', 'select'),
            'cancel': () => this.triggerInput('interact', 'cancel'),
            'help': () => this.triggerInput('help', 'show')
        };
        
        const action = voiceCommands[command];
        if (action) {
            action();
            this.provideVoiceFeedback(`Command recognized: ${command}`);
        }
    }
    
    provideVoiceFeedback(message) {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(message);
            utterance.rate = 0.8;
            utterance.pitch = 1.0;
            speechSynthesis.speak(utterance);
        }
    }
    
    setupEventListeners() {
        // Keyboard event listeners
        document.addEventListener('keydown', (event) => {
            this.handleKeyboardInput(event);
        });
        
        // Gamepad event listeners
        window.addEventListener('gamepadconnected', (event) => {
            this.registerVRController(event.gamepad, event.gamepad.index);
        });
        
        window.addEventListener('gamepaddisconnected', (event) => {
            this.unregisterDevice(`vr-controller-${event.gamepad.index}`);
        });
        
        // Mouse event listeners
        document.addEventListener('click', (event) => {
            this.handleMouseInput(event);
        });
        
        // Touch event listeners for mobile
        document.addEventListener('touchstart', (event) => {
            this.handleTouchInput(event);
        });
    }
    
    handleKeyboardInput(event) {
        const key = event.key.toLowerCase();
        const action = this.mapKeyToAction(key);
        
        if (action) {
            this.triggerInput(action.type, action.value);
        }
    }
    
    handleMouseInput(event) {
        this.triggerInput('interact', 'click');
    }
    
    handleTouchInput(event) {
        event.preventDefault();
        this.triggerInput('interact', 'touch');
    }
    
    mapKeyToAction(key) {
        const profile = this.profiles[this.currentProfile];
        const inputs = profile.inputs;
        
        for (const [actionType, keys] of Object.entries(inputs)) {
            if (keys.includes(key)) {
                return { type: actionType, value: key };
            }
        }
        
        return null;
    }
    
    triggerInput(type, value) {
        // Emit custom event for input
        const event = new CustomEvent('assistiveInput', {
            detail: {
                type: type,
                value: value,
                profile: this.currentProfile,
                timestamp: Date.now()
            }
        });
        
        document.dispatchEvent(event);
        
        // Store in event listeners map
        if (!this.eventListeners.has(type)) {
            this.eventListeners.set(type, []);
        }
        this.eventListeners.get(type).push({ value, timestamp: Date.now() });
    }
    
    setProfile(profileName) {
        if (this.profiles[profileName]) {
            this.currentProfile = profileName;
            localStorage.setItem('assistiveProfile', profileName);
            console.log(`Switched to profile: ${profileName}`);
            
            // Update UI to reflect profile change
            this.updateProfileUI();
        }
    }
    
    updateProfileUI() {
        const profile = this.profiles[this.currentProfile];
        const profileIndicator = document.getElementById('profile-indicator');
        
        if (profileIndicator) {
            profileIndicator.textContent = profile.name;
            profileIndicator.title = profile.description;
        }
    }
    
    loadUserPreferences() {
        const savedProfile = localStorage.getItem('assistiveProfile');
        if (savedProfile && this.profiles[savedProfile]) {
            this.setProfile(savedProfile);
        }
    }
    
    getAvailableProfiles() {
        return Object.keys(this.profiles);
    }
    
    getProfileInfo(profileName) {
        return this.profiles[profileName];
    }
    
    getDeviceCapabilities() {
        return { ...this.capabilities };
    }
    
    getActiveDevices() {
        return Array.from(this.devices.values());
    }
    
    unregisterDevice(deviceId) {
        this.devices.delete(deviceId);
        console.log(`Device unregistered: ${deviceId}`);
    }
    
    // Method to start voice recognition
    startVoiceRecognition() {
        if (this.voiceRecognition && this.capabilities.voiceControl) {
            this.voiceRecognition.start();
            console.log('Voice recognition started');
        }
    }
    
    // Method to stop voice recognition
    stopVoiceRecognition() {
        if (this.voiceRecognition) {
            this.voiceRecognition.stop();
            console.log('Voice recognition stopped');
        }
    }
    
    // Method to provide haptic feedback
    provideHapticFeedback(intensity = 0.5, duration = 100) {
        const vrControllers = Array.from(this.devices.values()).filter(d => d.type === 'vr-controller');
        
        vrControllers.forEach(controller => {
            if (controller.haptic) {
                controller.haptic.pulse(intensity, duration);
            }
        });
    }
    
    // Method to get input statistics
    getInputStatistics() {
        const stats = {
            totalInputs: 0,
            inputsByType: {},
            inputsByDevice: {},
            recentInputs: []
        };
        
        this.eventListeners.forEach((inputs, type) => {
            stats.inputsByType[type] = inputs.length;
            stats.totalInputs += inputs.length;
            
            // Get recent inputs (last 10)
            const recent = inputs.slice(-10);
            stats.recentInputs.push(...recent.map(input => ({ type, ...input })));
        });
        
        return stats;
    }
}

// Create global instance
window.AssistiveDeviceManager = AssistiveDeviceManager;
window.assistiveDeviceManager = new AssistiveDeviceManager();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AssistiveDeviceManager;
}
