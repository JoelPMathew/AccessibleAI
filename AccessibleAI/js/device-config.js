/**
 * Device Configuration Interface
 * Provides UI for configuring assistive devices and input mappings
 */

class DeviceConfigInterface {
    constructor(deviceManager) {
        this.deviceManager = deviceManager;
        this.isOpen = false;
        this.configPanel = null;
        this.currentSettings = {};
        
        this.init();
    }
    
    init() {
        this.createConfigButton();
        this.setupEventListeners();
    }
    
    createConfigButton() {
        const button = document.createElement('button');
        button.id = 'device-config-button';
        button.innerHTML = '⚙️ Device Settings';
        button.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
            background: linear-gradient(135deg, #4CAF50, #45a049);
            color: white;
            border: none;
            border-radius: 12px;
            padding: 12px 20px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            box-shadow: 0 4px 20px rgba(76, 175, 80, 0.3);
            transition: all 0.3s ease;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;
        
        button.addEventListener('click', () => this.toggleConfigPanel());
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-2px)';
            button.style.boxShadow = '0 8px 25px rgba(76, 175, 80, 0.4)';
        });
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0)';
            button.style.boxShadow = '0 4px 20px rgba(76, 175, 80, 0.3)';
        });
        
        document.body.appendChild(button);
    }
    
    toggleConfigPanel() {
        if (this.isOpen) {
            this.closeConfigPanel();
        } else {
            this.openConfigPanel();
        }
    }
    
    openConfigPanel() {
        this.createConfigPanel();
        this.isOpen = true;
        
        // Add overlay
        const overlay = document.createElement('div');
        overlay.id = 'config-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 999;
            backdrop-filter: blur(5px);
        `;
        overlay.addEventListener('click', () => this.closeConfigPanel());
        document.body.appendChild(overlay);
    }
    
    closeConfigPanel() {
        if (this.configPanel) {
            this.configPanel.remove();
            this.configPanel = null;
        }
        
        const overlay = document.getElementById('config-overlay');
        if (overlay) {
            overlay.remove();
        }
        
        this.isOpen = false;
    }
    
    createConfigPanel() {
        this.configPanel = document.createElement('div');
        this.configPanel.id = 'device-config-panel';
        this.configPanel.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 90%;
            max-width: 800px;
            max-height: 80vh;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            z-index: 1000;
            overflow-y: auto;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;
        
        this.configPanel.innerHTML = this.generateConfigHTML();
        document.body.appendChild(this.configPanel);
        
        this.setupConfigEventListeners();
    }
    
    generateConfigHTML() {
        const capabilities = this.deviceManager.getDeviceCapabilities();
        const activeDevices = this.deviceManager.getActiveDevices();
        const profiles = this.deviceManager.getAvailableProfiles();
        const currentProfile = this.deviceManager.currentProfile;
        
        return `
            <div style="padding: 30px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
                    <h2 style="margin: 0; color: #2c3e50; font-size: 24px;">🎮 Device Configuration</h2>
                    <button id="close-config" style="
                        background: #e74c3c;
                        color: white;
                        border: none;
                        border-radius: 50%;
                        width: 40px;
                        height: 40px;
                        font-size: 18px;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    ">×</button>
                </div>
                
                <!-- Profile Selection -->
                <div class="config-section">
                    <h3 style="color: #34495e; margin-bottom: 15px;">👤 Input Profile</h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                        ${profiles.map(profileName => {
                            const profile = this.deviceManager.getProfileInfo(profileName);
                            const isActive = profileName === currentProfile;
                            return `
                                <div class="profile-card" data-profile="${profileName}" style="
                                    padding: 20px;
                                    border: 2px solid ${isActive ? '#3498db' : '#ecf0f1'};
                                    border-radius: 12px;
                                    cursor: pointer;
                                    transition: all 0.3s ease;
                                    background: ${isActive ? '#f8f9fa' : 'white'};
                                ">
                                    <h4 style="margin: 0 0 8px 0; color: #2c3e50;">${profile.name}</h4>
                                    <p style="margin: 0; color: #7f8c8d; font-size: 14px;">${profile.description}</p>
                                    ${isActive ? '<div style="color: #27ae60; font-weight: 600; margin-top: 8px;">✓ Active</div>' : ''}
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
                
                <!-- Device Status -->
                <div class="config-section" style="margin-top: 30px;">
                    <h3 style="color: #34495e; margin-bottom: 15px;">🔌 Connected Devices</h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;">
                        ${Object.entries(capabilities).map(([capability, enabled]) => `
                            <div style="
                                padding: 15px;
                                border: 1px solid ${enabled ? '#27ae60' : '#e74c3c'};
                                border-radius: 8px;
                                background: ${enabled ? '#d5f4e6' : '#fadbd8'};
                            ">
                                <div style="display: flex; align-items: center; gap: 10px;">
                                    <span style="font-size: 20px;">${this.getCapabilityIcon(capability)}</span>
                                    <div>
                                        <div style="font-weight: 600; color: #2c3e50;">${this.getCapabilityName(capability)}</div>
                                        <div style="font-size: 12px; color: #7f8c8d;">${enabled ? 'Connected' : 'Not Available'}</div>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <!-- Active Devices -->
                ${activeDevices.length > 0 ? `
                    <div class="config-section" style="margin-top: 30px;">
                        <h3 style="color: #34495e; margin-bottom: 15px;">📱 Active Devices</h3>
                        <div style="display: grid; gap: 10px;">
                            ${activeDevices.map(device => `
                                <div style="
                                    padding: 15px;
                                    border: 1px solid #bdc3c7;
                                    border-radius: 8px;
                                    background: #f8f9fa;
                                ">
                                    <div style="display: flex; justify-content: space-between; align-items: center;">
                                        <div>
                                            <div style="font-weight: 600; color: #2c3e50;">${this.getDeviceDisplayName(device)}</div>
                                            <div style="font-size: 12px; color: #7f8c8d;">${device.id}</div>
                                        </div>
                                        <div style="color: #27ae60; font-size: 12px;">● Connected</div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
                
                <!-- Input Mapping -->
                <div class="config-section" style="margin-top: 30px;">
                    <h3 style="color: #34495e; margin-bottom: 15px;">⌨️ Input Mapping</h3>
                    <div id="input-mapping-container">
                        ${this.generateInputMappingHTML()}
                    </div>
                </div>
                
                <!-- Voice Control Settings -->
                ${capabilities.voiceControl ? `
                    <div class="config-section" style="margin-top: 30px;">
                        <h3 style="color: #34495e; margin-bottom: 15px;">🎤 Voice Control</h3>
                        <div style="display: flex; gap: 15px; align-items: center;">
                            <button id="start-voice" style="
                                background: #3498db;
                                color: white;
                                border: none;
                                padding: 10px 20px;
                                border-radius: 8px;
                                cursor: pointer;
                                font-weight: 600;
                            ">Start Voice Recognition</button>
                            <button id="stop-voice" style="
                                background: #e74c3c;
                                color: white;
                                border: none;
                                padding: 10px 20px;
                                border-radius: 8px;
                                cursor: pointer;
                                font-weight: 600;
                            ">Stop Voice Recognition</button>
                            <div id="voice-status" style="
                                padding: 8px 15px;
                                background: #ecf0f1;
                                border-radius: 8px;
                                font-size: 14px;
                                color: #7f8c8d;
                            ">Voice recognition stopped</div>
                        </div>
                    </div>
                ` : ''}
                
                <!-- Accessibility Settings -->
                <div class="config-section" style="margin-top: 30px;">
                    <h3 style="color: #34495e; margin-bottom: 15px;">♿ Accessibility Settings</h3>
                    <div style="display: grid; gap: 15px;">
                        <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                            <input type="checkbox" id="hold-to-activate" style="transform: scale(1.2);">
                            <span>Hold to activate (for limited mobility)</span>
                        </label>
                        <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                            <input type="checkbox" id="scanning-mode" style="transform: scale(1.2);">
                            <span>Scanning mode (for switch devices)</span>
                        </label>
                        <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                            <input type="checkbox" id="voice-feedback" style="transform: scale(1.2);">
                            <span>Voice feedback for interactions</span>
                        </label>
                        <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                            <input type="checkbox" id="haptic-feedback" style="transform: scale(1.2);">
                            <span>Haptic feedback (VR controllers)</span>
                        </label>
                    </div>
                </div>
                
                <!-- Test Input -->
                <div class="config-section" style="margin-top: 30px;">
                    <h3 style="color: #34495e; margin-bottom: 15px;">🧪 Test Input</h3>
                    <div style="
                        padding: 20px;
                        background: #f8f9fa;
                        border-radius: 8px;
                        border: 1px solid #dee2e6;
                    ">
                        <p style="margin: 0 0 15px 0; color: #6c757d;">Try different input methods to test your configuration:</p>
                        <div id="input-test-area" style="
                            min-height: 100px;
                            border: 2px dashed #dee2e6;
                            border-radius: 8px;
                            padding: 20px;
                            text-align: center;
                            color: #6c757d;
                        ">Click here or use your configured inputs to test...</div>
                    </div>
                </div>
                
                <!-- Save/Cancel Buttons -->
                <div style="display: flex; gap: 15px; justify-content: flex-end; margin-top: 30px;">
                    <button id="cancel-config" style="
                        background: #95a5a6;
                        color: white;
                        border: none;
                        padding: 12px 24px;
                        border-radius: 8px;
                        cursor: pointer;
                        font-weight: 600;
                    ">Cancel</button>
                    <button id="save-config" style="
                        background: #27ae60;
                        color: white;
                        border: none;
                        padding: 12px 24px;
                        border-radius: 8px;
                        cursor: pointer;
                        font-weight: 600;
                    ">Save Settings</button>
                </div>
            </div>
        `;
    }
    
    generateInputMappingHTML() {
        const currentProfile = this.deviceManager.getProfileInfo(this.deviceManager.currentProfile);
        const inputs = currentProfile.inputs;
        
        return Object.entries(inputs).map(([actionType, keys]) => `
            <div style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px;
                border: 1px solid #dee2e6;
                border-radius: 8px;
                margin-bottom: 10px;
                background: #f8f9fa;
            ">
                <div>
                    <div style="font-weight: 600; color: #2c3e50;">${this.getActionDisplayName(actionType)}</div>
                    <div style="font-size: 12px; color: #7f8c8d;">${this.getActionDescription(actionType)}</div>
                </div>
                <div style="display: flex; gap: 5px; flex-wrap: wrap;">
                    ${keys.map(key => `
                        <span style="
                            background: #3498db;
                            color: white;
                            padding: 4px 8px;
                            border-radius: 4px;
                            font-size: 12px;
                            font-weight: 600;
                        ">${key}</span>
                    `).join('')}
                </div>
            </div>
        `).join('');
    }
    
    getCapabilityIcon(capability) {
        const icons = {
            vrControllers: '🎮',
            motionCapture: '📱',
            smartMobility: '♿',
            switchDevices: '🔘',
            eyeTracking: '👁️',
            voiceControl: '🎤'
        };
        return icons[capability] || '❓';
    }
    
    getCapabilityName(capability) {
        const names = {
            vrControllers: 'VR Controllers',
            motionCapture: 'Motion Capture',
            smartMobility: 'Smart Mobility',
            switchDevices: 'Switch Devices',
            eyeTracking: 'Eye Tracking',
            voiceControl: 'Voice Control'
        };
        return names[capability] || capability;
    }
    
    getDeviceDisplayName(device) {
        const names = {
            'vr-controller': 'VR Controller',
            'smart-mobility': 'Smart Mobility Device',
            'switch-device': 'Switch Device'
        };
        return names[device.type] || device.type;
    }
    
    getActionDisplayName(actionType) {
        const names = {
            move: 'Movement',
            interact: 'Interaction',
            menu: 'Menu',
            voice: 'Voice Control'
        };
        return names[actionType] || actionType;
    }
    
    getActionDescription(actionType) {
        const descriptions = {
            move: 'Navigate through the environment',
            interact: 'Interact with objects and elements',
            menu: 'Open menus and settings',
            voice: 'Voice command activation'
        };
        return descriptions[actionType] || '';
    }
    
    setupConfigEventListeners() {
        // Close button
        const closeBtn = document.getElementById('close-config');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeConfigPanel());
        }
        
        // Cancel button
        const cancelBtn = document.getElementById('cancel-config');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.closeConfigPanel());
        }
        
        // Save button
        const saveBtn = document.getElementById('save-config');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveSettings());
        }
        
        // Profile selection
        const profileCards = document.querySelectorAll('.profile-card');
        profileCards.forEach(card => {
            card.addEventListener('click', () => {
                const profile = card.dataset.profile;
                this.deviceManager.setProfile(profile);
                this.updateProfileSelection();
            });
        });
        
        // Voice control buttons
        const startVoiceBtn = document.getElementById('start-voice');
        const stopVoiceBtn = document.getElementById('stop-voice');
        const voiceStatus = document.getElementById('voice-status');
        
        if (startVoiceBtn) {
            startVoiceBtn.addEventListener('click', () => {
                this.deviceManager.startVoiceRecognition();
                if (voiceStatus) {
                    voiceStatus.textContent = 'Voice recognition started';
                    voiceStatus.style.background = '#d5f4e6';
                    voiceStatus.style.color = '#27ae60';
                }
            });
        }
        
        if (stopVoiceBtn) {
            stopVoiceBtn.addEventListener('click', () => {
                this.deviceManager.stopVoiceRecognition();
                if (voiceStatus) {
                    voiceStatus.textContent = 'Voice recognition stopped';
                    voiceStatus.style.background = '#fadbd8';
                    voiceStatus.style.color = '#e74c3c';
                }
            });
        }
        
        // Input test area
        const testArea = document.getElementById('input-test-area');
        if (testArea) {
            testArea.addEventListener('click', () => {
                this.testInput('click');
            });
        }
        
        // Listen for assistive input events
        document.addEventListener('assistiveInput', (event) => {
            this.handleTestInput(event.detail);
        });
    }
    
    updateProfileSelection() {
        const profileCards = document.querySelectorAll('.profile-card');
        profileCards.forEach(card => {
            const profile = card.dataset.profile;
            const isActive = profile === this.deviceManager.currentProfile;
            
            card.style.borderColor = isActive ? '#3498db' : '#ecf0f1';
            card.style.background = isActive ? '#f8f9fa' : 'white';
            
            const activeIndicator = card.querySelector('div:last-child');
            if (activeIndicator) {
                activeIndicator.textContent = isActive ? '✓ Active' : '';
                activeIndicator.style.color = isActive ? '#27ae60' : '';
            }
        });
        
        // Update input mapping
        const mappingContainer = document.getElementById('input-mapping-container');
        if (mappingContainer) {
            mappingContainer.innerHTML = this.generateInputMappingHTML();
        }
    }
    
    testInput(inputType) {
        const testArea = document.getElementById('input-test-area');
        if (testArea) {
            const timestamp = new Date().toLocaleTimeString();
            testArea.innerHTML += `<div style="margin: 5px 0; padding: 5px; background: #e8f5e8; border-radius: 4px; font-size: 12px;">${timestamp}: ${inputType} input detected</div>`;
            testArea.scrollTop = testArea.scrollHeight;
        }
    }
    
    handleTestInput(inputDetail) {
        const testArea = document.getElementById('input-test-area');
        if (testArea) {
            const timestamp = new Date().toLocaleTimeString();
            testArea.innerHTML += `<div style="margin: 5px 0; padding: 5px; background: #e8f5e8; border-radius: 4px; font-size: 12px;">${timestamp}: ${inputDetail.type} - ${inputDetail.value} (${inputDetail.profile})</div>`;
            testArea.scrollTop = testArea.scrollHeight;
        }
    }
    
    saveSettings() {
        // Collect settings from form
        const settings = {
            profile: this.deviceManager.currentProfile,
            holdToActivate: document.getElementById('hold-to-activate')?.checked || false,
            scanningMode: document.getElementById('scanning-mode')?.checked || false,
            voiceFeedback: document.getElementById('voice-feedback')?.checked || false,
            hapticFeedback: document.getElementById('haptic-feedback')?.checked || false
        };
        
        // Save to localStorage
        localStorage.setItem('assistiveDeviceSettings', JSON.stringify(settings));
        
        // Apply settings
        this.applySettings(settings);
        
        // Show confirmation
        this.showNotification('Settings saved successfully!', 'success');
        
        // Close panel
        this.closeConfigPanel();
    }
    
    applySettings(settings) {
        // Apply settings to device manager
        if (settings.holdToActivate) {
            // Enable hold-to-activate mode
            console.log('Hold-to-activate mode enabled');
        }
        
        if (settings.scanningMode) {
            // Enable scanning mode
            console.log('Scanning mode enabled');
        }
        
        if (settings.voiceFeedback) {
            // Enable voice feedback
            console.log('Voice feedback enabled');
        }
        
        if (settings.hapticFeedback) {
            // Enable haptic feedback
            console.log('Haptic feedback enabled');
        }
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
            z-index: 1001;
            font-weight: 600;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
    
    setupEventListeners() {
        // Listen for device changes
        document.addEventListener('assistiveInput', (event) => {
            // Update UI based on input events
            this.updateDeviceStatus();
        });
    }
    
    updateDeviceStatus() {
        // Update device status indicators
        const capabilities = this.deviceManager.getDeviceCapabilities();
        const activeDevices = this.deviceManager.getActiveDevices();
        
        // This would update the device status display in real-time
        console.log('Device status updated:', { capabilities, activeDevices });
    }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DeviceConfigInterface;
}
