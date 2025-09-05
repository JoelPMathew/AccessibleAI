/**
 * Guidance Configuration Interface
 * Provides UI for configuring user guidance and cues
 */

class GuidanceConfigInterface {
    constructor(guidanceSystem) {
        this.guidanceSystem = guidanceSystem;
        this.isOpen = false;
        this.configPanel = null;
        
        this.init();
    }
    
    init() {
        this.createConfigButton();
        this.setupEventListeners();
    }
    
    createConfigButton() {
        const button = document.createElement('button');
        button.id = 'guidance-config-button';
        button.innerHTML = '🎯 Guidance Settings';
        button.style.cssText = `
            position: fixed;
            top: 20px;
            right: 80px;
            z-index: 1000;
            background: linear-gradient(135deg, #e67e22, #d35400);
            color: white;
            border: none;
            border-radius: 12px;
            padding: 12px 20px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            box-shadow: 0 4px 20px rgba(230, 126, 34, 0.3);
            transition: all 0.3s ease;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;
        
        button.addEventListener('click', () => this.toggleConfigPanel());
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-2px)';
            button.style.boxShadow = '0 8px 25px rgba(230, 126, 34, 0.4)';
        });
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0)';
            button.style.boxShadow = '0 4px 20px rgba(230, 126, 34, 0.3)';
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
        overlay.id = 'guidance-config-overlay';
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
        
        const overlay = document.getElementById('guidance-config-overlay');
        if (overlay) {
            overlay.remove();
        }
        
        this.isOpen = false;
    }
    
    createConfigPanel() {
        this.configPanel = document.createElement('div');
        this.configPanel.id = 'guidance-config-panel';
        this.configPanel.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 90%;
            max-width: 700px;
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
        const status = this.guidanceSystem.getStatus();
        const difficultyLevels = this.guidanceSystem.difficultyLevels;
        const assistanceLevels = this.guidanceSystem.assistanceLevels;
        
        return `
            <div style="padding: 30px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
                    <h2 style="margin: 0; color: #2c3e50; font-size: 24px;">🎯 Guidance Configuration</h2>
                    <button id="close-guidance-config" style="
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
                
                <!-- Current Status -->
                <div class="config-section" style="margin-bottom: 30px;">
                    <h3 style="color: #34495e; margin-bottom: 15px;">📊 Current Status</h3>
                    <div style="
                        background: #f8f9fa;
                        padding: 20px;
                        border-radius: 10px;
                        border: 1px solid #dee2e6;
                    ">
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                            <div>
                                <div style="font-weight: 600; color: #2c3e50;">Status</div>
                                <div style="color: ${status.isActive ? '#27ae60' : '#e74c3c'};">
                                    ${status.isActive ? '🟢 Active' : '🔴 Inactive'}
                                </div>
                            </div>
                            <div>
                                <div style="font-weight: 600; color: #2c3e50;">Current Task</div>
                                <div style="color: #6c757d;">
                                    ${status.currentTask ? status.currentTask.name : 'None'}
                                </div>
                            </div>
                            <div>
                                <div style="font-weight: 600; color: #2c3e50;">Progress</div>
                                <div style="color: #6c757d;">
                                    ${status.taskProgress}/${status.maxTaskProgress}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Difficulty Level -->
                <div class="config-section" style="margin-bottom: 30px;">
                    <h3 style="color: #34495e; margin-bottom: 15px;">⚡ Difficulty Level</h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                        ${Object.entries(difficultyLevels).map(([key, level]) => `
                            <div class="difficulty-card" data-difficulty="${key}" style="
                                padding: 20px;
                                border: 2px solid ${status.difficultyLevel === key ? '#3498db' : '#ecf0f1'};
                                border-radius: 12px;
                                cursor: pointer;
                                transition: all 0.3s ease;
                                background: ${status.difficultyLevel === key ? '#f8f9fa' : 'white'};
                            ">
                                <h4 style="margin: 0 0 8px 0; color: #2c3e50;">${level.name}</h4>
                                <p style="margin: 0; color: #7f8c8d; font-size: 14px;">${level.description}</p>
                                ${status.difficultyLevel === key ? '<div style="color: #27ae60; font-weight: 600; margin-top: 8px;">✓ Active</div>' : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <!-- Assistance Level -->
                <div class="config-section" style="margin-bottom: 30px;">
                    <h3 style="color: #34495e; margin-bottom: 15px;">🆘 Assistance Level</h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                        ${Object.entries(assistanceLevels).map(([key, level]) => `
                            <div class="assistance-card" data-assistance="${key}" style="
                                padding: 20px;
                                border: 2px solid ${status.assistanceLevel === key ? '#3498db' : '#ecf0f1'};
                                border-radius: 12px;
                                cursor: pointer;
                                transition: all 0.3s ease;
                                background: ${status.assistanceLevel === key ? '#f8f9fa' : 'white'};
                            ">
                                <h4 style="margin: 0 0 8px 0; color: #2c3e50;">${level.name}</h4>
                                <p style="margin: 0; color: #7f8c8d; font-size: 14px;">${level.description}</p>
                                ${status.assistanceLevel === key ? '<div style="color: #27ae60; font-weight: 600; margin-top: 8px;">✓ Active</div>' : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <!-- Feature Toggles -->
                <div class="config-section" style="margin-bottom: 30px;">
                    <h3 style="color: #34495e; margin-bottom: 15px;">🎛️ Feature Toggles</h3>
                    <div style="display: grid; gap: 15px;">
                        <label style="display: flex; align-items: center; gap: 15px; cursor: pointer; padding: 15px; background: #f8f9fa; border-radius: 10px;">
                            <input type="checkbox" id="highlighting-toggle" ${status.highlightingEnabled ? 'checked' : ''} style="transform: scale(1.2);">
                            <div>
                                <div style="font-weight: 600; color: #2c3e50;">Object Highlighting</div>
                                <div style="font-size: 14px; color: #6c757d;">Highlight objects and areas for tasks</div>
                            </div>
                        </label>
                        
                        <label style="display: flex; align-items: center; gap: 15px; cursor: pointer; padding: 15px; background: #f8f9fa; border-radius: 10px;">
                            <input type="checkbox" id="text-instructions-toggle" ${status.textInstructionsEnabled ? 'checked' : ''} style="transform: scale(1.2);">
                            <div>
                                <div style="font-weight: 600; color: #2c3e50;">Text Instructions</div>
                                <div style="font-size: 14px; color: #6c757d;">Show text-based instructions for tasks</div>
                            </div>
                        </label>
                        
                        <label style="display: flex; align-items: center; gap: 15px; cursor: pointer; padding: 15px; background: #f8f9fa; border-radius: 10px;">
                            <input type="checkbox" id="narration-toggle" ${status.narrationEnabled ? 'checked' : ''} style="transform: scale(1.2);">
                            <div>
                                <div style="font-weight: 600; color: #2c3e50;">Voice Narration</div>
                                <div style="font-size: 14px; color: #6c757d;">Play audio narration for instructions</div>
                            </div>
                        </label>
                    </div>
                </div>
                
                <!-- Test Guidance -->
                <div class="config-section" style="margin-bottom: 30px;">
                    <h3 style="color: #34495e; margin-bottom: 15px;">🧪 Test Guidance</h3>
                    <p style="color: #6c757d; margin-bottom: 20px;">Test the guidance system with a sample task to see how it works.</p>
                    <div style="display: flex; gap: 15px; flex-wrap: wrap;">
                        <button id="test-guidance" style="
                            background: #3498db;
                            color: white;
                            border: none;
                            padding: 12px 24px;
                            border-radius: 8px;
                            cursor: pointer;
                            font-weight: 600;
                        ">Test Sample Task</button>
                        <button id="stop-guidance" style="
                            background: #e74c3c;
                            color: white;
                            border: none;
                            padding: 12px 24px;
                            border-radius: 8px;
                            cursor: pointer;
                            font-weight: 600;
                        ">Stop Guidance</button>
                    </div>
                </div>
                
                <!-- Quick Actions -->
                <div class="config-section" style="margin-bottom: 30px;">
                    <h3 style="color: #34495e; margin-bottom: 15px;">⚡ Quick Actions</h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px;">
                        <button id="reset-to-defaults" style="
                            background: #95a5a6;
                            color: white;
                            border: none;
                            padding: 12px 20px;
                            border-radius: 8px;
                            cursor: pointer;
                            font-weight: 600;
                        ">Reset to Defaults</button>
                        <button id="export-settings" style="
                            background: #9b59b6;
                            color: white;
                            border: none;
                            padding: 12px 20px;
                            border-radius: 8px;
                            cursor: pointer;
                            font-weight: 600;
                        ">Export Settings</button>
                        <button id="import-settings" style="
                            background: #f39c12;
                            color: white;
                            border: none;
                            padding: 12px 20px;
                            border-radius: 8px;
                            cursor: pointer;
                            font-weight: 600;
                        ">Import Settings</button>
                    </div>
                </div>
                
                <!-- Save/Cancel Buttons -->
                <div style="display: flex; gap: 15px; justify-content: flex-end; margin-top: 30px;">
                    <button id="cancel-guidance-config" style="
                        background: #95a5a6;
                        color: white;
                        border: none;
                        padding: 12px 24px;
                        border-radius: 8px;
                        cursor: pointer;
                        font-weight: 600;
                    ">Cancel</button>
                    <button id="save-guidance-config" style="
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
    
    setupConfigEventListeners() {
        // Close button
        const closeBtn = document.getElementById('close-guidance-config');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeConfigPanel());
        }
        
        // Cancel button
        const cancelBtn = document.getElementById('cancel-guidance-config');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.closeConfigPanel());
        }
        
        // Save button
        const saveBtn = document.getElementById('save-guidance-config');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveSettings());
        }
        
        // Difficulty level selection
        const difficultyCards = document.querySelectorAll('.difficulty-card');
        difficultyCards.forEach(card => {
            card.addEventListener('click', () => {
                const difficulty = card.dataset.difficulty;
                this.guidanceSystem.setDifficultyLevel(difficulty);
                this.updateDifficultySelection();
            });
        });
        
        // Assistance level selection
        const assistanceCards = document.querySelectorAll('.assistance-card');
        assistanceCards.forEach(card => {
            card.addEventListener('click', () => {
                const assistance = card.dataset.assistance;
                this.guidanceSystem.setAssistanceLevel(assistance);
                this.updateAssistanceSelection();
            });
        });
        
        // Feature toggles
        const highlightingToggle = document.getElementById('highlighting-toggle');
        if (highlightingToggle) {
            highlightingToggle.addEventListener('change', () => {
                this.guidanceSystem.toggleHighlighting();
            });
        }
        
        const textInstructionsToggle = document.getElementById('text-instructions-toggle');
        if (textInstructionsToggle) {
            textInstructionsToggle.addEventListener('change', () => {
                this.guidanceSystem.toggleTextInstructions();
            });
        }
        
        const narrationToggle = document.getElementById('narration-toggle');
        if (narrationToggle) {
            narrationToggle.addEventListener('change', () => {
                this.guidanceSystem.toggleNarration();
            });
        }
        
        // Test guidance
        const testBtn = document.getElementById('test-guidance');
        if (testBtn) {
            testBtn.addEventListener('click', () => this.testGuidance());
        }
        
        const stopBtn = document.getElementById('stop-guidance');
        if (stopBtn) {
            stopBtn.addEventListener('click', () => this.stopGuidance());
        }
        
        // Quick actions
        const resetBtn = document.getElementById('reset-to-defaults');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetToDefaults());
        }
        
        const exportBtn = document.getElementById('export-settings');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportSettings());
        }
        
        const importBtn = document.getElementById('import-settings');
        if (importBtn) {
            importBtn.addEventListener('click', () => this.importSettings());
        }
    }
    
    updateDifficultySelection() {
        const difficultyCards = document.querySelectorAll('.difficulty-card');
        const currentLevel = this.guidanceSystem.difficultyLevel;
        
        difficultyCards.forEach(card => {
            const difficulty = card.dataset.difficulty;
            const isActive = difficulty === currentLevel;
            
            card.style.borderColor = isActive ? '#3498db' : '#ecf0f1';
            card.style.background = isActive ? '#f8f9fa' : 'white';
            
            const activeIndicator = card.querySelector('div:last-child');
            if (activeIndicator) {
                activeIndicator.textContent = isActive ? '✓ Active' : '';
                activeIndicator.style.color = isActive ? '#27ae60' : '';
            }
        });
    }
    
    updateAssistanceSelection() {
        const assistanceCards = document.querySelectorAll('.assistance-card');
        const currentLevel = this.guidanceSystem.assistanceLevel;
        
        assistanceCards.forEach(card => {
            const assistance = card.dataset.assistance;
            const isActive = assistance === currentLevel;
            
            card.style.borderColor = isActive ? '#3498db' : '#ecf0f1';
            card.style.background = isActive ? '#f8f9fa' : 'white';
            
            const activeIndicator = card.querySelector('div:last-child');
            if (activeIndicator) {
                activeIndicator.textContent = isActive ? '✓ Active' : '';
                activeIndicator.style.color = isActive ? '#27ae60' : '';
            }
        });
    }
    
    testGuidance() {
        const sampleTask = {
            name: 'Sample Task',
            description: 'This is a test task to demonstrate the guidance system.',
            steps: [
                {
                    name: 'Step 1',
                    target: 'body',
                    instructions: 'This is the first step. Look at the highlighted area.',
                    narration: 'This is the first step. Look at the highlighted area.',
                    hints: ['The highlighted area is the main content area', 'You can click anywhere to continue']
                },
                {
                    name: 'Step 2',
                    target: 'body',
                    instructions: 'This is the second step. Notice the different highlighting style.',
                    narration: 'This is the second step. Notice the different highlighting style.',
                    hints: ['The highlighting style has changed', 'This demonstrates visual feedback']
                },
                {
                    name: 'Step 3',
                    target: 'body',
                    instructions: 'This is the final step. The task is almost complete.',
                    narration: 'This is the final step. The task is almost complete.',
                    hints: ['This is the last step', 'You will see a completion message soon']
                }
            ]
        };
        
        this.guidanceSystem.startGuidance(sampleTask);
        this.showNotification('Test task started!', 'info');
    }
    
    stopGuidance() {
        this.guidanceSystem.stopGuidance();
        this.showNotification('Guidance stopped', 'info');
    }
    
    resetToDefaults() {
        this.guidanceSystem.setDifficultyLevel('medium');
        this.guidanceSystem.setAssistanceLevel('moderate');
        this.guidanceSystem.narrationEnabled = true;
        this.guidanceSystem.textInstructionsEnabled = true;
        this.guidanceSystem.highlightingEnabled = true;
        this.guidanceSystem.saveUserPreferences();
        
        this.updateDifficultySelection();
        this.updateAssistanceSelection();
        this.updateFeatureToggles();
        
        this.showNotification('Settings reset to defaults', 'success');
    }
    
    updateFeatureToggles() {
        const status = this.guidanceSystem.getStatus();
        
        const highlightingToggle = document.getElementById('highlighting-toggle');
        if (highlightingToggle) {
            highlightingToggle.checked = status.highlightingEnabled;
        }
        
        const textInstructionsToggle = document.getElementById('text-instructions-toggle');
        if (textInstructionsToggle) {
            textInstructionsToggle.checked = status.textInstructionsEnabled;
        }
        
        const narrationToggle = document.getElementById('narration-toggle');
        if (narrationToggle) {
            narrationToggle.checked = status.narrationEnabled;
        }
    }
    
    exportSettings() {
        const settings = {
            difficultyLevel: this.guidanceSystem.difficultyLevel,
            assistanceLevel: this.guidanceSystem.assistanceLevel,
            narrationEnabled: this.guidanceSystem.narrationEnabled,
            textInstructionsEnabled: this.guidanceSystem.textInstructionsEnabled,
            highlightingEnabled: this.guidanceSystem.highlightingEnabled
        };
        
        const dataStr = JSON.stringify(settings, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = 'guidance-settings.json';
        link.click();
        
        this.showNotification('Settings exported successfully', 'success');
    }
    
    importSettings() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const settings = JSON.parse(e.target.result);
                        this.applyImportedSettings(settings);
                        this.showNotification('Settings imported successfully', 'success');
                    } catch (error) {
                        this.showNotification('Failed to import settings', 'error');
                    }
                };
                reader.readAsText(file);
            }
        };
        
        input.click();
    }
    
    applyImportedSettings(settings) {
        if (settings.difficultyLevel) {
            this.guidanceSystem.setDifficultyLevel(settings.difficultyLevel);
        }
        if (settings.assistanceLevel) {
            this.guidanceSystem.setAssistanceLevel(settings.assistanceLevel);
        }
        if (typeof settings.narrationEnabled === 'boolean') {
            this.guidanceSystem.narrationEnabled = settings.narrationEnabled;
        }
        if (typeof settings.textInstructionsEnabled === 'boolean') {
            this.guidanceSystem.textInstructionsEnabled = settings.textInstructionsEnabled;
        }
        if (typeof settings.highlightingEnabled === 'boolean') {
            this.guidanceSystem.highlightingEnabled = settings.highlightingEnabled;
        }
        
        this.guidanceSystem.saveUserPreferences();
        this.updateDifficultySelection();
        this.updateAssistanceSelection();
        this.updateFeatureToggles();
    }
    
    saveSettings() {
        this.guidanceSystem.saveUserPreferences();
        this.showNotification('Settings saved successfully!', 'success');
        this.closeConfigPanel();
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
        // Listen for guidance events
        document.addEventListener('taskStarted', (event) => {
            this.updateStatus();
        });
        
        document.addEventListener('taskCompleted', (event) => {
            this.updateStatus();
        });
        
        document.addEventListener('taskStepCompleted', (event) => {
            this.updateStatus();
        });
    }
    
    updateStatus() {
        // Update status display if panel is open
        if (this.isOpen && this.configPanel) {
            // Refresh the panel content
            this.configPanel.innerHTML = this.generateConfigHTML();
            this.setupConfigEventListeners();
        }
    }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GuidanceConfigInterface;
}
