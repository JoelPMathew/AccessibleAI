/**
 * User Guidance & Cues System
 * Provides object highlighting, narration, text instructions, and adjustable difficulty
 */

class UserGuidanceSystem {
    constructor() {
        this.isActive = false;
        this.currentTask = null;
        this.taskQueue = [];
        this.difficultyLevel = 'medium';
        this.assistanceLevel = 'moderate';
        this.narrationEnabled = true;
        this.textInstructionsEnabled = true;
        this.highlightingEnabled = true;
        this.audioContext = null;
        this.speechSynthesis = window.speechSynthesis;
        this.currentHighlight = null;
        this.guidanceOverlay = null;
        this.taskProgress = 0;
        this.maxTaskProgress = 0;
        
        // Difficulty levels
        this.difficultyLevels = {
            'easy': {
                name: 'Easy',
                description: 'Maximum assistance with clear guidance',
                features: {
                    highlightDuration: 5000,
                    narrationSpeed: 0.7,
                    textSize: 'large',
                    stepByStep: true,
                    hints: true,
                    autoAdvance: true
                }
            },
            'medium': {
                name: 'Medium',
                description: 'Balanced assistance with moderate guidance',
                features: {
                    highlightDuration: 3000,
                    narrationSpeed: 0.8,
                    textSize: 'medium',
                    stepByStep: false,
                    hints: true,
                    autoAdvance: false
                }
            },
            'hard': {
                name: 'Hard',
                description: 'Minimal assistance for experienced users',
                features: {
                    highlightDuration: 1500,
                    narrationSpeed: 0.9,
                    textSize: 'small',
                    stepByStep: false,
                    hints: false,
                    autoAdvance: false
                }
            }
        };
        
        // Assistance levels
        this.assistanceLevels = {
            'minimal': {
                name: 'Minimal',
                description: 'Basic highlighting only',
                features: {
                    highlighting: true,
                    narration: false,
                    textInstructions: false,
                    hints: false,
                    progress: false
                }
            },
            'moderate': {
                name: 'Moderate',
                description: 'Highlighting with text instructions',
                features: {
                    highlighting: true,
                    narration: false,
                    textInstructions: true,
                    hints: true,
                    progress: true
                }
            },
            'full': {
                name: 'Full',
                description: 'Complete guidance with narration',
                features: {
                    highlighting: true,
                    narration: true,
                    textInstructions: true,
                    hints: true,
                    progress: true
                }
            }
        };
        
        this.init();
    }
    
    init() {
        this.setupAudioContext();
        this.createGuidanceOverlay();
        this.setupEventListeners();
        this.loadUserPreferences();
        console.log('User Guidance System initialized');
    }
    
    setupAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (error) {
            console.log('Audio context not available');
        }
    }
    
    createGuidanceOverlay() {
        this.guidanceOverlay = document.createElement('div');
        this.guidanceOverlay.id = 'guidance-overlay';
        this.guidanceOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1000;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;
        document.body.appendChild(this.guidanceOverlay);
    }
    
    setupEventListeners() {
        // Listen for task events
        document.addEventListener('taskStarted', (event) => {
            this.startTask(event.detail);
        });
        
        document.addEventListener('taskCompleted', (event) => {
            this.completeTask(event.detail);
        });
        
        document.addEventListener('taskStepCompleted', (event) => {
            this.completeTaskStep(event.detail);
        });
        
        // Listen for object interaction events
        document.addEventListener('objectHighlighted', (event) => {
            this.onObjectHighlighted(event.detail);
        });
        
        document.addEventListener('objectClicked', (event) => {
            this.onObjectClicked(event.detail);
        });
    }
    
    loadUserPreferences() {
        const preferences = localStorage.getItem('guidancePreferences');
        if (preferences) {
            try {
                const prefs = JSON.parse(preferences);
                this.difficultyLevel = prefs.difficultyLevel || 'medium';
                this.assistanceLevel = prefs.assistanceLevel || 'moderate';
                this.narrationEnabled = prefs.narrationEnabled !== false;
                this.textInstructionsEnabled = prefs.textInstructionsEnabled !== false;
                this.highlightingEnabled = prefs.highlightingEnabled !== false;
            } catch (error) {
                console.error('Failed to load guidance preferences:', error);
            }
        }
    }
    
    saveUserPreferences() {
        const preferences = {
            difficultyLevel: this.difficultyLevel,
            assistanceLevel: this.assistanceLevel,
            narrationEnabled: this.narrationEnabled,
            textInstructionsEnabled: this.textInstructionsEnabled,
            highlightingEnabled: this.highlightingEnabled
        };
        localStorage.setItem('guidancePreferences', JSON.stringify(preferences));
    }
    
    // Task Management
    startTask(task) {
        this.currentTask = task;
        this.taskQueue = task.steps || [];
        this.taskProgress = 0;
        this.maxTaskProgress = this.taskQueue.length;
        this.isActive = true;
        
        console.log('Starting task:', task.name);
        
        // Show task introduction
        this.showTaskIntroduction(task);
        
        // Start first step
        if (this.taskQueue.length > 0) {
            this.startTaskStep(this.taskQueue[0]);
        }
        
        // Emit task started event
        this.emitEvent('taskStarted', { task: task });
    }
    
    startTaskStep(step) {
        if (!this.isActive || !step) return;
        
        console.log('Starting task step:', step.name);
        
        // Highlight target object/area
        if (step.target && this.highlightingEnabled) {
            this.highlightObject(step.target, step);
        }
        
        // Show text instructions
        if (step.instructions && this.textInstructionsEnabled) {
            this.showTextInstructions(step.instructions, step);
        }
        
        // Play narration
        if (step.narration && this.narrationEnabled) {
            this.playNarration(step.narration, step);
        }
        
        // Show hints if enabled
        if (step.hints && this.shouldShowHints()) {
            this.showHints(step.hints, step);
        }
        
        // Set up auto-advance if enabled
        if (this.shouldAutoAdvance()) {
            this.setupAutoAdvance(step);
        }
        
        // Emit step started event
        this.emitEvent('taskStepStarted', { step: step });
    }
    
    completeTaskStep(step) {
        if (!this.isActive) return;
        
        console.log('Task step completed:', step.name);
        
        // Clear current highlighting
        this.clearHighlighting();
        
        // Update progress
        this.taskProgress++;
        this.updateProgress();
        
        // Move to next step
        const nextStepIndex = this.taskQueue.findIndex(s => s === step) + 1;
        if (nextStepIndex < this.taskQueue.length) {
            setTimeout(() => {
                this.startTaskStep(this.taskQueue[nextStepIndex]);
            }, 1000);
        } else {
            this.completeTask();
        }
        
        // Emit step completed event
        this.emitEvent('taskStepCompleted', { step: step });
    }
    
    completeTask() {
        if (!this.currentTask) return;
        
        console.log('Task completed:', this.currentTask.name);
        
        // Clear all guidance
        this.clearAllGuidance();
        
        // Show completion message
        this.showCompletionMessage();
        
        // Reset state
        this.currentTask = null;
        this.taskQueue = [];
        this.taskProgress = 0;
        this.maxTaskProgress = 0;
        this.isActive = false;
        
        // Emit task completed event
        this.emitEvent('taskCompleted', { task: this.currentTask });
    }
    
    // Object Highlighting
    highlightObject(target, step) {
        const element = this.findElement(target);
        if (!element) {
            console.warn('Target element not found:', target);
            return;
        }
        
        // Clear previous highlighting
        this.clearHighlighting();
        
        // Create highlight effect
        const highlight = this.createHighlight(element, step);
        this.currentHighlight = highlight;
        
        // Add highlight to overlay
        this.guidanceOverlay.appendChild(highlight);
        
        // Set up highlight animation
        this.animateHighlight(highlight, step);
        
        // Emit object highlighted event
        this.emitEvent('objectHighlighted', { element: element, step: step });
    }
    
    findElement(target) {
        if (typeof target === 'string') {
            return document.querySelector(target);
        } else if (target && target.nodeType) {
            return target;
        }
        return null;
    }
    
    createHighlight(element, step) {
        const rect = element.getBoundingClientRect();
        const highlight = document.createElement('div');
        highlight.className = 'guidance-highlight';
        highlight.style.cssText = `
            position: absolute;
            left: ${rect.left}px;
            top: ${rect.top}px;
            width: ${rect.width}px;
            height: ${rect.height}px;
            border: 3px solid #3498db;
            border-radius: 8px;
            background: rgba(52, 152, 219, 0.1);
            pointer-events: none;
            z-index: 1001;
            animation: guidancePulse 1s ease-in-out infinite;
        `;
        
        // Add step information
        if (step.name) {
            highlight.setAttribute('data-step-name', step.name);
        }
        
        return highlight;
    }
    
    animateHighlight(highlight, step) {
        const duration = this.getHighlightDuration();
        
        // Add pulsing animation
        highlight.style.animation = `guidancePulse 1s ease-in-out infinite`;
        
        // Auto-remove highlight after duration
        setTimeout(() => {
            if (highlight.parentNode) {
                this.fadeOutHighlight(highlight);
            }
        }, duration);
    }
    
    fadeOutHighlight(highlight) {
        highlight.style.transition = 'opacity 0.5s ease-out';
        highlight.style.opacity = '0';
        
        setTimeout(() => {
            if (highlight.parentNode) {
                highlight.parentNode.removeChild(highlight);
            }
        }, 500);
    }
    
    clearHighlighting() {
        if (this.currentHighlight && this.currentHighlight.parentNode) {
            this.fadeOutHighlight(this.currentHighlight);
        }
        this.currentHighlight = null;
    }
    
    // Text Instructions
    showTextInstructions(instructions, step) {
        const instructionElement = this.createTextInstruction(instructions, step);
        this.guidanceOverlay.appendChild(instructionElement);
        
        // Auto-remove after duration
        const duration = this.getTextDuration();
        setTimeout(() => {
            if (instructionElement.parentNode) {
                this.fadeOutElement(instructionElement);
            }
        }, duration);
    }
    
    createTextInstruction(instructions, step) {
        const instructionElement = document.createElement('div');
        instructionElement.className = 'guidance-instruction';
        instructionElement.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 20px 30px;
            border-radius: 12px;
            max-width: 600px;
            text-align: center;
            z-index: 1002;
            font-size: ${this.getTextSize()};
            font-weight: 600;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            backdrop-filter: blur(10px);
        `;
        
        instructionElement.innerHTML = `
            <div style="margin-bottom: 10px; font-size: 18px; color: #3498db;">📋 ${step.name || 'Instruction'}</div>
            <div>${instructions}</div>
        `;
        
        return instructionElement;
    }
    
    // Narration
    playNarration(text, step) {
        if (!this.speechSynthesis) return;
        
        // Stop any current speech
        this.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = this.getNarrationSpeed();
        utterance.pitch = 1.0;
        utterance.volume = 0.8;
        
        utterance.onstart = () => {
            console.log('Narration started:', text);
        };
        
        utterance.onend = () => {
            console.log('Narration completed');
        };
        
        utterance.onerror = (event) => {
            console.error('Narration error:', event.error);
        };
        
        this.speechSynthesis.speak(utterance);
    }
    
    // Hints
    showHints(hints, step) {
        const hintElement = this.createHintElement(hints, step);
        this.guidanceOverlay.appendChild(hintElement);
        
        // Auto-remove after duration
        setTimeout(() => {
            if (hintElement.parentNode) {
                this.fadeOutElement(hintElement);
            }
        }, 5000);
    }
    
    createHintElement(hints, step) {
        const hintElement = document.createElement('div');
        hintElement.className = 'guidance-hint';
        hintElement.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: rgba(52, 152, 219, 0.95);
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            max-width: 300px;
            z-index: 1002;
            font-size: 14px;
            box-shadow: 0 4px 20px rgba(52, 152, 219, 0.3);
        `;
        
        const hintText = Array.isArray(hints) ? hints.join('<br>') : hints;
        hintElement.innerHTML = `
            <div style="font-weight: 600; margin-bottom: 5px;">💡 Hint</div>
            <div>${hintText}</div>
        `;
        
        return hintElement;
    }
    
    // Progress Tracking
    updateProgress() {
        if (!this.shouldShowProgress()) return;
        
        const progressElement = this.getOrCreateProgressElement();
        const percentage = (this.taskProgress / this.maxTaskProgress) * 100;
        
        progressElement.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                <span style="font-weight: 600;">Task Progress</span>
                <span style="font-size: 14px;">${this.taskProgress}/${this.maxTaskProgress}</span>
            </div>
            <div style="background: rgba(255, 255, 255, 0.2); border-radius: 10px; height: 8px; overflow: hidden;">
                <div style="
                    background: linear-gradient(90deg, #3498db, #2ecc71);
                    height: 100%;
                    width: ${percentage}%;
                    transition: width 0.3s ease;
                "></div>
            </div>
        `;
    }
    
    getOrCreateProgressElement() {
        let progressElement = document.getElementById('guidance-progress');
        if (!progressElement) {
            progressElement = document.createElement('div');
            progressElement.id = 'guidance-progress';
            progressElement.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 15px 20px;
                border-radius: 8px;
                z-index: 1002;
                min-width: 200px;
                backdrop-filter: blur(10px);
            `;
            this.guidanceOverlay.appendChild(progressElement);
        }
        return progressElement;
    }
    
    // Task Introduction
    showTaskIntroduction(task) {
        const introElement = document.createElement('div');
        introElement.className = 'guidance-intro';
        introElement.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.95);
            color: white;
            padding: 40px;
            border-radius: 20px;
            max-width: 600px;
            text-align: center;
            z-index: 1003;
            font-size: 18px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(20px);
        `;
        
        introElement.innerHTML = `
            <div style="font-size: 24px; margin-bottom: 20px; color: #3498db;">🎯 ${task.name}</div>
            <div style="margin-bottom: 20px; line-height: 1.6;">${task.description || 'Complete the following steps to finish this task.'}</div>
            <div style="font-size: 14px; color: #bdc3c7;">Difficulty: ${this.getDifficultyName()} | Assistance: ${this.getAssistanceName()}</div>
        `;
        
        this.guidanceOverlay.appendChild(introElement);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            if (introElement.parentNode) {
                this.fadeOutElement(introElement);
            }
        }, 3000);
    }
    
    // Completion Message
    showCompletionMessage() {
        const completionElement = document.createElement('div');
        completionElement.className = 'guidance-completion';
        completionElement.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(46, 204, 113, 0.95);
            color: white;
            padding: 30px;
            border-radius: 15px;
            text-align: center;
            z-index: 1003;
            font-size: 20px;
            font-weight: 600;
            box-shadow: 0 10px 30px rgba(46, 204, 113, 0.3);
        `;
        
        completionElement.innerHTML = `
            <div style="font-size: 32px; margin-bottom: 10px;">✅</div>
            <div>Task Completed Successfully!</div>
        `;
        
        this.guidanceOverlay.appendChild(completionElement);
        
        // Auto-remove after 2 seconds
        setTimeout(() => {
            if (completionElement.parentNode) {
                this.fadeOutElement(completionElement);
            }
        }, 2000);
    }
    
    // Utility Methods
    fadeOutElement(element) {
        element.style.transition = 'opacity 0.5s ease-out';
        element.style.opacity = '0';
        
        setTimeout(() => {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
        }, 500);
    }
    
    clearAllGuidance() {
        this.clearHighlighting();
        this.guidanceOverlay.innerHTML = '';
    }
    
    emitEvent(eventName, detail) {
        const event = new CustomEvent(eventName, { detail });
        document.dispatchEvent(event);
    }
    
    // Configuration Methods
    setDifficultyLevel(level) {
        if (this.difficultyLevels[level]) {
            this.difficultyLevel = level;
            this.saveUserPreferences();
            console.log('Difficulty level set to:', level);
        }
    }
    
    setAssistanceLevel(level) {
        if (this.assistanceLevels[level]) {
            this.assistanceLevel = level;
            this.saveUserPreferences();
            console.log('Assistance level set to:', level);
        }
    }
    
    toggleNarration() {
        this.narrationEnabled = !this.narrationEnabled;
        this.saveUserPreferences();
        console.log('Narration enabled:', this.narrationEnabled);
    }
    
    toggleTextInstructions() {
        this.textInstructionsEnabled = !this.textInstructionsEnabled;
        this.saveUserPreferences();
        console.log('Text instructions enabled:', this.textInstructionsEnabled);
    }
    
    toggleHighlighting() {
        this.highlightingEnabled = !this.highlightingEnabled;
        this.saveUserPreferences();
        console.log('Highlighting enabled:', this.highlightingEnabled);
    }
    
    // Helper Methods
    getHighlightDuration() {
        return this.difficultyLevels[this.difficultyLevel].features.highlightDuration;
    }
    
    getNarrationSpeed() {
        return this.difficultyLevels[this.difficultyLevel].features.narrationSpeed;
    }
    
    getTextSize() {
        const sizeMap = {
            'small': '14px',
            'medium': '16px',
            'large': '18px'
        };
        return sizeMap[this.difficultyLevels[this.difficultyLevel].features.textSize];
    }
    
    getTextDuration() {
        return this.difficultyLevels[this.difficultyLevel].features.highlightDuration;
    }
    
    shouldShowHints() {
        return this.difficultyLevels[this.difficultyLevel].features.hints && 
               this.assistanceLevels[this.assistanceLevel].features.hints;
    }
    
    shouldShowProgress() {
        return this.assistanceLevels[this.assistanceLevel].features.progress;
    }
    
    shouldAutoAdvance() {
        return this.difficultyLevels[this.difficultyLevel].features.autoAdvance;
    }
    
    getDifficultyName() {
        return this.difficultyLevels[this.difficultyLevel].name;
    }
    
    getAssistanceName() {
        return this.assistanceLevels[this.assistanceLevel].name;
    }
    
    setupAutoAdvance(step) {
        const duration = this.getHighlightDuration();
        setTimeout(() => {
            if (this.isActive && this.currentTask) {
                this.completeTaskStep(step);
            }
        }, duration);
    }
    
    // Public API
    startGuidance(task) {
        this.startTask(task);
    }
    
    stopGuidance() {
        this.clearAllGuidance();
        this.isActive = false;
        this.currentTask = null;
        this.taskQueue = [];
        this.taskProgress = 0;
        this.maxTaskProgress = 0;
    }
    
    getStatus() {
        return {
            isActive: this.isActive,
            currentTask: this.currentTask,
            taskProgress: this.taskProgress,
            maxTaskProgress: this.maxTaskProgress,
            difficultyLevel: this.difficultyLevel,
            assistanceLevel: this.assistanceLevel,
            narrationEnabled: this.narrationEnabled,
            textInstructionsEnabled: this.textInstructionsEnabled,
            highlightingEnabled: this.highlightingEnabled
        };
    }
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes guidancePulse {
        0%, 100% { 
            border-color: #3498db;
            box-shadow: 0 0 0 0 rgba(52, 152, 219, 0.4);
        }
        50% { 
            border-color: #e74c3c;
            box-shadow: 0 0 0 10px rgba(231, 76, 60, 0.1);
        }
    }
    
    .guidance-highlight {
        transition: all 0.3s ease;
    }
    
    .guidance-instruction {
        animation: slideInDown 0.5s ease-out;
    }
    
    .guidance-hint {
        animation: slideInUp 0.5s ease-out;
    }
    
    .guidance-intro {
        animation: fadeInScale 0.5s ease-out;
    }
    
    .guidance-completion {
        animation: bounceIn 0.6s ease-out;
    }
    
    @keyframes slideInDown {
        from {
            transform: translateX(-50%) translateY(-100%);
            opacity: 0;
        }
        to {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
    }
    
    @keyframes slideInUp {
        from {
            transform: translateY(100%);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
    
    @keyframes fadeInScale {
        from {
            transform: translate(-50%, -50%) scale(0.8);
            opacity: 0;
        }
        to {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
        }
    }
    
    @keyframes bounceIn {
        0% {
            transform: translate(-50%, -50%) scale(0.3);
            opacity: 0;
        }
        50% {
            transform: translate(-50%, -50%) scale(1.05);
            opacity: 1;
        }
        70% {
            transform: translate(-50%, -50%) scale(0.9);
        }
        100% {
            transform: translate(-50%, -50%) scale(1);
        }
    }
`;
document.head.appendChild(style);

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UserGuidanceSystem;
}
