/**
 * User Feedback Integration System
 * Collects subjective difficulty ratings and adjusts scenarios based on behavioral data
 */

class UserFeedbackSystem {
    constructor(userProfile, performanceTracking, adaptationEngine) {
        this.userProfile = userProfile;
        this.performanceTracking = performanceTracking;
        this.adaptationEngine = adaptationEngine;
        this.feedbackData = [];
        this.behavioralData = [];
        this.difficultyRatings = [];
        this.feedbackPrompts = [];
        this.isCollectingFeedback = true;
        
        this.init();
    }
    
    init() {
        this.setupFeedbackPrompts();
        this.setupEventListeners();
        this.startBehavioralDataCollection();
        console.log('User Feedback System initialized');
    }
    
    setupEventListeners() {
        // Listen for task completion to prompt for feedback
        document.addEventListener('taskCompleted', (event) => {
            this.promptTaskFeedback(event.detail);
        });
        
        // Listen for session events
        document.addEventListener('sessionStarted', (event) => {
            this.startSessionFeedback(event.detail);
        });
        
        document.addEventListener('sessionEnded', (event) => {
            this.endSessionFeedback(event.detail);
        });
        
        // Listen for difficulty changes
        document.addEventListener('difficultyChanged', (event) => {
            this.recordDifficultyChange(event.detail);
        });
        
        // Listen for user interactions
        document.addEventListener('interactionRecorded', (event) => {
            this.recordBehavioralData(event.detail);
        });
    }
    
    setupFeedbackPrompts() {
        this.feedbackPrompts = {
            taskCompletion: {
                title: 'How was that task?',
                questions: [
                    {
                        id: 'difficulty',
                        text: 'How difficult was this task?',
                        type: 'rating',
                        scale: { min: 1, max: 5, labels: ['Very Easy', 'Easy', 'Moderate', 'Hard', 'Very Hard'] }
                    },
                    {
                        id: 'frustration',
                        text: 'How frustrated did you feel?',
                        type: 'rating',
                        scale: { min: 1, max: 5, labels: ['Not at all', 'Slightly', 'Moderately', 'Very', 'Extremely'] }
                    },
                    {
                        id: 'satisfaction',
                        text: 'How satisfied are you with your performance?',
                        type: 'rating',
                        scale: { min: 1, max: 5, labels: ['Very Dissatisfied', 'Dissatisfied', 'Neutral', 'Satisfied', 'Very Satisfied'] }
                    },
                    {
                        id: 'assistance',
                        text: 'How helpful was the assistance provided?',
                        type: 'rating',
                        scale: { min: 1, max: 5, labels: ['Not helpful', 'Slightly helpful', 'Moderately helpful', 'Very helpful', 'Extremely helpful'] }
                    }
                ]
            },
            sessionEnd: {
                title: 'Session Feedback',
                questions: [
                    {
                        id: 'overall_difficulty',
                        text: 'How was the overall difficulty of this session?',
                        type: 'rating',
                        scale: { min: 1, max: 5, labels: ['Too Easy', 'Easy', 'Just Right', 'Hard', 'Too Hard'] }
                    },
                    {
                        id: 'enjoyment',
                        text: 'How much did you enjoy this session?',
                        type: 'rating',
                        scale: { min: 1, max: 5, labels: ['Not at all', 'Slightly', 'Moderately', 'Very much', 'Extremely'] }
                    },
                    {
                        id: 'learning',
                        text: 'How much did you learn from this session?',
                        type: 'rating',
                        scale: { min: 1, max: 5, labels: ['Nothing', 'A little', 'Some', 'A lot', 'A great deal'] }
                    },
                    {
                        id: 'recommendations',
                        text: 'What would you like to see improved?',
                        type: 'text',
                        placeholder: 'Please share your suggestions...'
                    }
                ]
            },
            periodic: {
                title: 'Quick Check-in',
                questions: [
                    {
                        id: 'current_difficulty',
                        text: 'How is the current difficulty level?',
                        type: 'rating',
                        scale: { min: 1, max: 5, labels: ['Too Easy', 'Easy', 'Just Right', 'Hard', 'Too Hard'] }
                    },
                    {
                        id: 'need_help',
                        text: 'Do you need any help right now?',
                        type: 'boolean'
                    }
                ]
            }
        };
    }
    
    startBehavioralDataCollection() {
        // Collect behavioral data every 30 seconds
        setInterval(() => {
            this.collectBehavioralData();
        }, 30000);
    }
    
    collectBehavioralData() {
        const behavioralData = {
            timestamp: Date.now(),
            sessionId: this.performanceTracking?.sessionData?.id,
            userProfile: this.userProfile.getProfile(),
            performance: this.getCurrentPerformanceMetrics(),
            interactions: this.getRecentInteractions(),
            errors: this.getRecentErrors(),
            adaptations: this.getCurrentAdaptations()
        };
        
        this.behavioralData.push(behavioralData);
        
        // Keep only last 1000 entries
        if (this.behavioralData.length > 1000) {
            this.behavioralData = this.behavioralData.slice(-1000);
        }
        
        // Analyze behavioral patterns
        this.analyzeBehavioralPatterns();
    }
    
    getCurrentPerformanceMetrics() {
        if (!this.performanceTracking?.sessionData) return null;
        
        return {
            completionRate: this.performanceTracking.sessionData.performanceMetrics.completionRate,
            efficiency: this.performanceTracking.sessionData.performanceMetrics.efficiency,
            averageTaskTime: this.performanceTracking.sessionData.performanceMetrics.averageTaskTime,
            interactionSuccessRate: this.performanceTracking.sessionData.performanceMetrics.interactionSuccessRate
        };
    }
    
    getRecentInteractions() {
        if (!this.performanceTracking?.sessionData) return [];
        
        const recentTime = Date.now() - 300000; // Last 5 minutes
        return this.performanceTracking.sessionData.interactionLog.filter(
            interaction => interaction.timestamp > recentTime
        );
    }
    
    getRecentErrors() {
        if (!this.performanceTracking?.sessionData) return [];
        
        const recentTime = Date.now() - 300000; // Last 5 minutes
        return this.performanceTracking.sessionData.interactionLog.filter(
            interaction => !interaction.success && interaction.timestamp > recentTime
        );
    }
    
    getCurrentAdaptations() {
        if (!this.adaptationEngine) return {};
        
        return this.adaptationEngine.getCurrentAdaptations();
    }
    
    // Feedback Collection
    promptTaskFeedback(taskData) {
        if (!this.isCollectingFeedback) return;
        
        const prompt = this.feedbackPrompts.taskCompletion;
        this.showFeedbackModal(prompt, (responses) => {
            this.processTaskFeedback(taskData, responses);
        });
    }
    
    startSessionFeedback(sessionData) {
        // Show initial session feedback prompt
        setTimeout(() => {
            this.promptPeriodicFeedback();
        }, 60000); // After 1 minute
    }
    
    endSessionFeedback(sessionData) {
        const prompt = this.feedbackPrompts.sessionEnd;
        this.showFeedbackModal(prompt, (responses) => {
            this.processSessionFeedback(sessionData, responses);
        });
    }
    
    promptPeriodicFeedback() {
        if (!this.isCollectingFeedback) return;
        
        const prompt = this.feedbackPrompts.periodic;
        this.showFeedbackModal(prompt, (responses) => {
            this.processPeriodicFeedback(responses);
        });
        
        // Schedule next periodic feedback
        setTimeout(() => {
            this.promptPeriodicFeedback();
        }, 300000); // Every 5 minutes
    }
    
    showFeedbackModal(prompt, callback) {
        const modal = document.createElement('div');
        modal.id = 'feedback-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;
        
        modal.innerHTML = this.generateFeedbackModalHTML(prompt, callback);
        document.body.appendChild(modal);
    }
    
    generateFeedbackModalHTML(prompt, callback) {
        return `
            <div style="
                background: white;
                border-radius: 20px;
                padding: 30px;
                max-width: 500px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            ">
                <h2 style="color: #2c3e50; margin-bottom: 20px; text-align: center;">${prompt.title}</h2>
                <form id="feedback-form">
                    ${prompt.questions.map(question => this.generateQuestionHTML(question)).join('')}
                    <div style="display: flex; gap: 15px; justify-content: center; margin-top: 30px;">
                        <button type="button" onclick="this.closest('#feedback-modal').remove()" style="
                            background: #6c757d;
                            color: white;
                            border: none;
                            padding: 12px 24px;
                            border-radius: 8px;
                            cursor: pointer;
                            font-size: 14px;
                        ">Skip</button>
                        <button type="submit" style="
                            background: #667eea;
                            color: white;
                            border: none;
                            padding: 12px 24px;
                            border-radius: 8px;
                            cursor: pointer;
                            font-size: 14px;
                        ">Submit</button>
                    </div>
                </form>
            </div>
        `;
    }
    
    generateQuestionHTML(question) {
        switch (question.type) {
            case 'rating':
                return `
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 10px; font-weight: 600; color: #2c3e50;">
                            ${question.text}
                        </label>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                            ${question.scale.labels.map((label, index) => `
                                <span style="font-size: 12px; color: #6c757d; text-align: center; flex: 1;">
                                    ${label}
                                </span>
                            `).join('')}
                        </div>
                        <input type="range" 
                               name="${question.id}" 
                               min="${question.scale.min}" 
                               max="${question.scale.max}" 
                               value="${Math.ceil((question.scale.max + question.scale.min) / 2)}"
                               style="width: 100%; height: 6px; border-radius: 3px; background: #e9ecef; outline: none;">
                        <div style="text-align: center; margin-top: 5px; font-size: 14px; color: #667eea; font-weight: 600;">
                            <span id="${question.id}-value">${Math.ceil((question.scale.max + question.scale.min) / 2)}</span>
                        </div>
                    </div>
                `;
            case 'boolean':
                return `
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 10px; font-weight: 600; color: #2c3e50;">
                            ${question.text}
                        </label>
                        <div style="display: flex; gap: 20px;">
                            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                                <input type="radio" name="${question.id}" value="true" style="margin: 0;">
                                <span>Yes</span>
                            </label>
                            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                                <input type="radio" name="${question.id}" value="false" style="margin: 0;">
                                <span>No</span>
                            </label>
                        </div>
                    </div>
                `;
            case 'text':
                return `
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 10px; font-weight: 600; color: #2c3e50;">
                            ${question.text}
                        </label>
                        <textarea name="${question.id}" 
                                  placeholder="${question.placeholder || ''}"
                                  style="width: 100%; height: 100px; padding: 10px; border: 1px solid #ddd; border-radius: 8px; resize: vertical; font-family: inherit;">
                        </textarea>
                    </div>
                `;
            default:
                return '';
        }
    }
    
    // Feedback Processing
    processTaskFeedback(taskData, responses) {
        const feedback = {
            type: 'task_completion',
            timestamp: Date.now(),
            taskId: taskData.task?.id,
            taskName: taskData.task?.name,
            responses: responses,
            behavioralData: this.getCurrentBehavioralData()
        };
        
        this.feedbackData.push(feedback);
        this.difficultyRatings.push({
            taskId: taskData.task?.id,
            difficulty: responses.difficulty,
            timestamp: Date.now()
        });
        
        // Analyze feedback and adjust if needed
        this.analyzeFeedbackAndAdjust(feedback);
        
        // Emit feedback event
        this.emitEvent('taskFeedbackCollected', { feedback });
    }
    
    processSessionFeedback(sessionData, responses) {
        const feedback = {
            type: 'session_end',
            timestamp: Date.now(),
            sessionId: sessionData.id,
            responses: responses,
            behavioralData: this.getCurrentBehavioralData()
        };
        
        this.feedbackData.push(feedback);
        
        // Analyze session feedback
        this.analyzeSessionFeedback(feedback);
        
        // Emit feedback event
        this.emitEvent('sessionFeedbackCollected', { feedback });
    }
    
    processPeriodicFeedback(responses) {
        const feedback = {
            type: 'periodic',
            timestamp: Date.now(),
            responses: responses,
            behavioralData: this.getCurrentBehavioralData()
        };
        
        this.feedbackData.push(feedback);
        
        // Check if immediate adjustment is needed
        if (responses.current_difficulty >= 4) {
            this.requestDifficultyAdjustment('decrease');
        } else if (responses.current_difficulty <= 2) {
            this.requestDifficultyAdjustment('increase');
        }
        
        if (responses.need_help === 'true') {
            this.requestAssistance();
        }
        
        // Emit feedback event
        this.emitEvent('periodicFeedbackCollected', { feedback });
    }
    
    getCurrentBehavioralData() {
        const recentTime = Date.now() - 300000; // Last 5 minutes
        return this.behavioralData.filter(data => data.timestamp > recentTime);
    }
    
    // Behavioral Analysis
    analyzeBehavioralPatterns() {
        if (this.behavioralData.length < 10) return;
        
        const recentData = this.behavioralData.slice(-20); // Last 20 data points
        
        // Analyze performance trends
        const performanceTrend = this.analyzePerformanceTrend(recentData);
        
        // Analyze interaction patterns
        const interactionPattern = this.analyzeInteractionPattern(recentData);
        
        // Analyze error patterns
        const errorPattern = this.analyzeErrorPattern(recentData);
        
        // Make adjustments based on patterns
        this.adjustBasedOnPatterns(performanceTrend, interactionPattern, errorPattern);
    }
    
    analyzePerformanceTrend(data) {
        const completionRates = data.map(d => d.performance?.completionRate || 0);
        const efficiencies = data.map(d => d.performance?.efficiency || 0);
        
        return {
            completionRate: this.calculateTrend(completionRates),
            efficiency: this.calculateTrend(efficiencies)
        };
    }
    
    analyzeInteractionPattern(data) {
        const interactionCounts = data.map(d => d.interactions?.length || 0);
        const successRates = data.map(d => {
            const interactions = d.interactions || [];
            const successful = interactions.filter(i => i.success).length;
            return interactions.length > 0 ? successful / interactions.length : 0;
        });
        
        return {
            count: this.calculateTrend(interactionCounts),
            successRate: this.calculateTrend(successRates)
        };
    }
    
    analyzeErrorPattern(data) {
        const errorCounts = data.map(d => d.errors?.length || 0);
        const errorTypes = {};
        
        data.forEach(d => {
            (d.errors || []).forEach(error => {
                errorTypes[error.type] = (errorTypes[error.type] || 0) + 1;
            });
        });
        
        return {
            count: this.calculateTrend(errorCounts),
            types: errorTypes
        };
    }
    
    calculateTrend(values) {
        if (values.length < 2) return 'stable';
        
        const first = values[0];
        const last = values[values.length - 1];
        const change = (last - first) / first;
        
        if (change > 0.1) return 'improving';
        if (change < -0.1) return 'declining';
        return 'stable';
    }
    
    adjustBasedOnPatterns(performanceTrend, interactionPattern, errorPattern) {
        // Adjust difficulty based on performance
        if (performanceTrend.completionRate === 'declining' && performanceTrend.efficiency === 'declining') {
            this.requestDifficultyAdjustment('decrease');
        } else if (performanceTrend.completionRate === 'improving' && performanceTrend.efficiency === 'improving') {
            this.requestDifficultyAdjustment('increase');
        }
        
        // Adjust assistance based on interaction patterns
        if (interactionPattern.successRate === 'declining') {
            this.requestAssistanceIncrease();
        }
        
        // Address specific error patterns
        if (errorPattern.count === 'improving') {
            this.requestAssistanceDecrease();
        }
    }
    
    // Feedback Analysis
    analyzeFeedbackAndAdjust(feedback) {
        const responses = feedback.responses;
        
        // Check difficulty rating
        if (responses.difficulty >= 4) {
            this.requestDifficultyAdjustment('decrease');
        } else if (responses.difficulty <= 2) {
            this.requestDifficultyAdjustment('increase');
        }
        
        // Check frustration level
        if (responses.frustration >= 4) {
            this.requestAssistanceIncrease();
        }
        
        // Check satisfaction level
        if (responses.satisfaction <= 2) {
            this.requestScenarioAdjustment();
        }
        
        // Check assistance rating
        if (responses.assistance <= 2) {
            this.requestAssistanceIncrease();
        } else if (responses.assistance >= 4) {
            this.requestAssistanceDecrease();
        }
    }
    
    analyzeSessionFeedback(feedback) {
        const responses = feedback.responses;
        
        // Check overall difficulty
        if (responses.overall_difficulty >= 4) {
            this.requestDifficultyAdjustment('decrease');
        } else if (responses.overall_difficulty <= 2) {
            this.requestDifficultyAdjustment('increase');
        }
        
        // Check enjoyment level
        if (responses.enjoyment <= 2) {
            this.requestScenarioAdjustment();
        }
        
        // Check learning level
        if (responses.learning <= 2) {
            this.requestLearningAdjustment();
        }
        
        // Process recommendations
        if (responses.recommendations) {
            this.processRecommendations(responses.recommendations);
        }
    }
    
    // Adjustment Requests
    requestDifficultyAdjustment(direction) {
        if (this.adaptationEngine) {
            const adaptation = {
                tasks: {
                    difficulty: direction === 'increase' ? 'hard' : 'easy'
                }
            };
            
            this.adaptationEngine.applyAdaptations(adaptation);
            
            this.emitEvent('difficultyAdjustmentRequested', { direction, adaptation });
        }
    }
    
    requestAssistanceIncrease() {
        if (this.adaptationEngine) {
            const adaptation = {
                assistance: {
                    level: 'extensive',
                    stepByStepGuidance: true,
                    visualInstructions: true,
                    contextualHelp: true
                }
            };
            
            this.adaptationEngine.applyAdaptations(adaptation);
            
            this.emitEvent('assistanceIncreaseRequested', { adaptation });
        }
    }
    
    requestAssistanceDecrease() {
        if (this.adaptationEngine) {
            const adaptation = {
                assistance: {
                    level: 'minimal',
                    stepByStepGuidance: false,
                    visualInstructions: false,
                    contextualHelp: false
                }
            };
            
            this.adaptationEngine.applyAdaptations(adaptation);
            
            this.emitEvent('assistanceDecreaseRequested', { adaptation });
        }
    }
    
    requestScenarioAdjustment() {
        // Request scenario adjustment based on feedback
        this.emitEvent('scenarioAdjustmentRequested', { 
            reason: 'user_feedback',
            feedback: this.feedbackData.slice(-5) // Last 5 feedback entries
        });
    }
    
    requestLearningAdjustment() {
        // Request learning adjustment based on feedback
        this.emitEvent('learningAdjustmentRequested', { 
            reason: 'learning_feedback',
            feedback: this.feedbackData.slice(-5) // Last 5 feedback entries
        });
    }
    
    requestAssistance() {
        // Request immediate assistance
        this.emitEvent('assistanceRequested', { 
            reason: 'user_request',
            timestamp: Date.now()
        });
    }
    
    processRecommendations(recommendations) {
        // Process user recommendations
        this.emitEvent('recommendationsProcessed', { 
            recommendations: recommendations,
            timestamp: Date.now()
        });
    }
    
    // Data Export
    exportFeedbackData() {
        return {
            feedbackData: this.feedbackData,
            behavioralData: this.behavioralData,
            difficultyRatings: this.difficultyRatings,
            exportDate: new Date().toISOString()
        };
    }
    
    getFeedbackSummary() {
        const recentFeedback = this.feedbackData.slice(-10);
        const recentRatings = this.difficultyRatings.slice(-10);
        
        return {
            totalFeedback: this.feedbackData.length,
            recentFeedback: recentFeedback.length,
            averageDifficulty: recentRatings.length > 0 ? 
                recentRatings.reduce((sum, r) => sum + r.difficulty, 0) / recentRatings.length : 0,
            feedbackTypes: this.getFeedbackTypeDistribution(),
            behavioralPatterns: this.getBehavioralPatternSummary()
        };
    }
    
    getFeedbackTypeDistribution() {
        const types = {};
        this.feedbackData.forEach(feedback => {
            types[feedback.type] = (types[feedback.type] || 0) + 1;
        });
        return types;
    }
    
    getBehavioralPatternSummary() {
        if (this.behavioralData.length < 10) return null;
        
        const recentData = this.behavioralData.slice(-20);
        return {
            averageCompletionRate: recentData.reduce((sum, d) => 
                sum + (d.performance?.completionRate || 0), 0) / recentData.length,
            averageEfficiency: recentData.reduce((sum, d) => 
                sum + (d.performance?.efficiency || 0), 0) / recentData.length,
            averageInteractions: recentData.reduce((sum, d) => 
                sum + (d.interactions?.length || 0), 0) / recentData.length
        };
    }
    
    // Utility Methods
    recordDifficultyChange(changeData) {
        this.difficultyRatings.push({
            taskId: changeData.taskId,
            difficulty: changeData.newDifficulty,
            timestamp: Date.now(),
            reason: changeData.reason || 'system_adjustment'
        });
    }
    
    recordBehavioralData(interactionData) {
        // This is called by the event listener
        // Additional behavioral data processing can be added here
    }
    
    setFeedbackCollection(enabled) {
        this.isCollectingFeedback = enabled;
    }
    
    emitEvent(eventName, detail) {
        const event = new CustomEvent(eventName, { detail });
        document.dispatchEvent(event);
    }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UserFeedbackSystem;
}
