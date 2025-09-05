/**
 * Remote Monitoring & Feedback System
 * Allows therapists/caregivers to monitor sessions and provide real-time guidance
 */

class RemoteMonitoringSystem {
    constructor(userProfile, metricsSystem, adaptationEngine) {
        this.userProfile = userProfile;
        this.metrics = metricsSystem;
        this.adaptationEngine = adaptationEngine;
        this.isMonitoring = false;
        this.observers = [];
        this.sessionData = null;
        this.feedbackQueue = [];
        this.alertThresholds = {
            errorRate: 0.5,
            completionTime: 600000, // 10 minutes
            attentionLoss: 300000,  // 5 minutes
            frustration: 0.7
        };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setupWebSocket();
        console.log('Remote Monitoring System initialized');
    }
    
    setupEventListeners() {
        // Listen for session events
        document.addEventListener('sessionStarted', (event) => {
            this.startMonitoring(event.detail);
        });
        
        document.addEventListener('sessionEnded', (event) => {
            this.stopMonitoring(event.detail);
        });
        
        // Listen for task events
        document.addEventListener('taskStarted', (event) => {
            this.recordTaskStart(event.detail);
        });
        
        document.addEventListener('taskCompleted', (event) => {
            this.recordTaskCompletion(event.detail);
        });
        
        document.addEventListener('taskError', (event) => {
            this.recordTaskError(event.detail);
        });
        
        // Listen for interaction events
        document.addEventListener('interactionRecorded', (event) => {
            this.recordInteraction(event.detail);
        });
        
        // Listen for adaptation events
        document.addEventListener('adaptationsApplied', (event) => {
            this.recordAdaptation(event.detail);
        });
    }
    
    setupWebSocket() {
        // WebSocket connection for real-time communication
        this.ws = null;
        this.wsUrl = 'wss://your-monitoring-server.com/ws';
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        
        this.connectWebSocket();
    }
    
    connectWebSocket() {
        try {
            this.ws = new WebSocket(this.wsUrl);
            
            this.ws.onopen = () => {
                console.log('WebSocket connected');
                this.reconnectAttempts = 0;
                this.authenticate();
            };
            
            this.ws.onmessage = (event) => {
                this.handleRemoteMessage(JSON.parse(event.data));
            };
            
            this.ws.onclose = () => {
                console.log('WebSocket disconnected');
                this.attemptReconnect();
            };
            
            this.ws.onerror = (error) => {
                console.error('WebSocket error:', error);
            };
        } catch (error) {
            console.error('Failed to connect WebSocket:', error);
            this.attemptReconnect();
        }
    }
    
    attemptReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            const delay = Math.pow(2, this.reconnectAttempts) * 1000; // Exponential backoff
            
            setTimeout(() => {
                console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
                this.connectWebSocket();
            }, delay);
        }
    }
    
    authenticate() {
        const authData = {
            type: 'auth',
            userId: this.userProfile.getProfile().id,
            sessionId: this.generateSessionId(),
            timestamp: Date.now()
        };
        
        this.sendToServer(authData);
    }
    
    // Monitoring Control
    startMonitoring(sessionData) {
        this.isMonitoring = true;
        this.sessionData = {
            ...sessionData,
            startTime: Date.now(),
            events: [],
            metrics: {
                tasksCompleted: 0,
                errors: 0,
                interactions: 0,
                adaptations: 0
            }
        };
        
        // Notify observers
        this.notifyObservers('monitoringStarted', { session: this.sessionData });
        
        // Send session start to server
        this.sendToServer({
            type: 'session_start',
            session: this.sessionData,
            userProfile: this.userProfile.getProfile()
        });
        
        console.log('Remote monitoring started');
    }
    
    stopMonitoring(sessionData) {
        this.isMonitoring = false;
        
        if (this.sessionData) {
            this.sessionData.endTime = Date.now();
            this.sessionData.duration = this.sessionData.endTime - this.sessionData.startTime;
            
            // Generate session summary
            const summary = this.generateSessionSummary(this.sessionData);
            
            // Notify observers
            this.notifyObservers('monitoringStopped', { 
                session: this.sessionData, 
                summary: summary 
            });
            
            // Send session end to server
            this.sendToServer({
                type: 'session_end',
                session: this.sessionData,
                summary: summary
            });
        }
        
        console.log('Remote monitoring stopped');
    }
    
    // Event Recording
    recordTaskStart(taskData) {
        if (!this.isMonitoring) return;
        
        const event = {
            type: 'task_start',
            task: taskData,
            timestamp: Date.now()
        };
        
        this.sessionData.events.push(event);
        this.sendToServer(event);
    }
    
    recordTaskCompletion(taskData) {
        if (!this.isMonitoring) return;
        
        const event = {
            type: 'task_completion',
            task: taskData,
            timestamp: Date.now()
        };
        
        this.sessionData.events.push(event);
        this.sessionData.metrics.tasksCompleted++;
        
        this.sendToServer(event);
        this.checkForAlerts(event);
    }
    
    recordTaskError(errorData) {
        if (!this.isMonitoring) return;
        
        const event = {
            type: 'task_error',
            error: errorData,
            timestamp: Date.now()
        };
        
        this.sessionData.events.push(event);
        this.sessionData.metrics.errors++;
        
        this.sendToServer(event);
        this.checkForAlerts(event);
    }
    
    recordInteraction(interactionData) {
        if (!this.isMonitoring) return;
        
        const event = {
            type: 'interaction',
            interaction: interactionData,
            timestamp: Date.now()
        };
        
        this.sessionData.events.push(event);
        this.sessionData.metrics.interactions++;
        
        this.sendToServer(event);
    }
    
    recordAdaptation(adaptationData) {
        if (!this.isMonitoring) return;
        
        const event = {
            type: 'adaptation',
            adaptation: adaptationData,
            timestamp: Date.now()
        };
        
        this.sessionData.events.push(event);
        this.sessionData.metrics.adaptations++;
        
        this.sendToServer(event);
    }
    
    // Alert System
    checkForAlerts(event) {
        const alerts = [];
        
        // Check error rate
        if (this.sessionData.metrics.errors > 0) {
            const errorRate = this.sessionData.metrics.errors / this.sessionData.metrics.interactions;
            if (errorRate > this.alertThresholds.errorRate) {
                alerts.push({
                    type: 'high_error_rate',
                    severity: 'warning',
                    message: `High error rate detected: ${(errorRate * 100).toFixed(1)}%`,
                    data: { errorRate, threshold: this.alertThresholds.errorRate }
                });
            }
        }
        
        // Check completion time
        if (event.type === 'task_completion') {
            const completionTime = event.task.duration;
            if (completionTime > this.alertThresholds.completionTime) {
                alerts.push({
                    type: 'slow_completion',
                    severity: 'info',
                    message: `Task completed slowly: ${Math.round(completionTime / 1000)}s`,
                    data: { completionTime, threshold: this.alertThresholds.completionTime }
                });
            }
        }
        
        // Check for frustration indicators
        const frustrationLevel = this.calculateFrustrationLevel();
        if (frustrationLevel > this.alertThresholds.frustration) {
            alerts.push({
                type: 'high_frustration',
                severity: 'warning',
                message: `High frustration level detected: ${(frustrationLevel * 100).toFixed(1)}%`,
                data: { frustrationLevel, threshold: this.alertThresholds.frustration }
            });
        }
        
        // Send alerts
        alerts.forEach(alert => {
            this.sendAlert(alert);
        });
    }
    
    calculateFrustrationLevel() {
        if (!this.sessionData) return 0;
        
        const recentEvents = this.sessionData.events.slice(-20);
        const errorEvents = recentEvents.filter(e => e.type === 'task_error').length;
        const retryEvents = recentEvents.filter(e => e.type === 'retry').length;
        const totalEvents = recentEvents.length;
        
        if (totalEvents === 0) return 0;
        
        return (errorEvents + retryEvents) / totalEvents;
    }
    
    sendAlert(alert) {
        // Notify observers
        this.notifyObservers('alert', alert);
        
        // Send to server
        this.sendToServer({
            type: 'alert',
            alert: alert,
            session: this.sessionData,
            timestamp: Date.now()
        });
        
        // Show local notification
        this.showLocalAlert(alert);
    }
    
    showLocalAlert(alert) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${alert.severity === 'warning' ? '#f39c12' : '#3498db'};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.15);
            z-index: 10000;
            max-width: 300px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;
        
        notification.innerHTML = `
            <div style="font-weight: 600; margin-bottom: 5px;">${alert.type.replace(/_/g, ' ').toUpperCase()}</div>
            <div style="font-size: 14px;">${alert.message}</div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
    
    // Real-time Feedback
    handleRemoteMessage(message) {
        switch (message.type) {
            case 'feedback':
                this.handleFeedback(message.feedback);
                break;
            case 'guidance':
                this.handleGuidance(message.guidance);
                break;
            case 'adaptation':
                this.handleRemoteAdaptation(message.adaptation);
                break;
            case 'alert':
                this.handleRemoteAlert(message.alert);
                break;
            case 'session_control':
                this.handleSessionControl(message.control);
                break;
        }
    }
    
    handleFeedback(feedback) {
        this.feedbackQueue.push(feedback);
        
        // Show feedback to user
        this.showFeedback(feedback);
        
        // Emit feedback event
        this.emitEvent('remoteFeedback', { feedback });
    }
    
    handleGuidance(guidance) {
        // Apply guidance to the current session
        this.applyGuidance(guidance);
        
        // Emit guidance event
        this.emitEvent('remoteGuidance', { guidance });
    }
    
    handleRemoteAdaptation(adaptation) {
        // Apply remote adaptation
        if (this.adaptationEngine) {
            this.adaptationEngine.applyAdaptations(adaptation);
        }
        
        // Emit adaptation event
        this.emitEvent('remoteAdaptation', { adaptation });
    }
    
    handleRemoteAlert(alert) {
        // Show remote alert
        this.showLocalAlert(alert);
        
        // Emit alert event
        this.emitEvent('remoteAlert', { alert });
    }
    
    handleSessionControl(control) {
        switch (control.action) {
            case 'pause':
                this.pauseSession();
                break;
            case 'resume':
                this.resumeSession();
                break;
            case 'end':
                this.endSession();
                break;
            case 'adapt':
                this.applyRemoteAdaptation(control.adaptation);
                break;
        }
    }
    
    showFeedback(feedback) {
        const feedbackElement = document.createElement('div');
        feedbackElement.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            padding: 20px 30px;
            border-radius: 15px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            z-index: 10000;
            max-width: 500px;
            text-align: center;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;
        
        feedbackElement.innerHTML = `
            <div style="font-size: 18px; font-weight: 600; margin-bottom: 10px;">
                💬 Feedback from ${feedback.sender || 'Therapist'}
            </div>
            <div style="font-size: 16px; margin-bottom: 15px;">${feedback.message}</div>
            <div style="font-size: 14px; opacity: 0.8;">
                ${new Date(feedback.timestamp).toLocaleTimeString()}
            </div>
        `;
        
        document.body.appendChild(feedbackElement);
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            feedbackElement.remove();
        }, 10000);
    }
    
    applyGuidance(guidance) {
        // Apply guidance based on type
        switch (guidance.type) {
            case 'highlight':
                this.highlightObject(guidance.target);
                break;
            case 'navigate':
                this.navigateToObject(guidance.target);
                break;
            case 'instruction':
                this.showInstruction(guidance.message);
                break;
            case 'encouragement':
                this.showEncouragement(guidance.message);
                break;
        }
    }
    
    highlightObject(target) {
        const element = document.querySelector(target);
        if (element) {
            element.style.boxShadow = '0 0 20px #f39c12';
            element.style.border = '2px solid #f39c12';
            
            // Remove highlight after 5 seconds
            setTimeout(() => {
                element.style.boxShadow = '';
                element.style.border = '';
            }, 5000);
        }
    }
    
    navigateToObject(target) {
        const element = document.querySelector(target);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
    
    showInstruction(message) {
        const instruction = document.createElement('div');
        instruction.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 30px;
            border-radius: 15px;
            z-index: 10000;
            max-width: 600px;
            text-align: center;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;
        
        instruction.innerHTML = `
            <div style="font-size: 20px; font-weight: 600; margin-bottom: 15px;">
                📋 Instruction
            </div>
            <div style="font-size: 16px; line-height: 1.5;">${message}</div>
            <button onclick="this.parentElement.remove()" style="
                background: #3498db;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 8px;
                margin-top: 15px;
                cursor: pointer;
            ">Got it</button>
        `;
        
        document.body.appendChild(instruction);
    }
    
    showEncouragement(message) {
        const encouragement = document.createElement('div');
        encouragement.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #27ae60, #2ecc71);
            color: white;
            padding: 25px;
            border-radius: 15px;
            z-index: 10000;
            max-width: 400px;
            text-align: center;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            animation: encouragementPop 0.5s ease-out;
        `;
        
        encouragement.innerHTML = `
            <div style="font-size: 24px; margin-bottom: 10px;">🎉</div>
            <div style="font-size: 18px; font-weight: 600;">${message}</div>
        `;
        
        document.body.appendChild(encouragement);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            encouragement.remove();
        }, 3000);
    }
    
    // Session Control
    pauseSession() {
        this.isMonitoring = false;
        this.emitEvent('sessionPaused');
        console.log('Session paused by remote control');
    }
    
    resumeSession() {
        this.isMonitoring = true;
        this.emitEvent('sessionResumed');
        console.log('Session resumed by remote control');
    }
    
    endSession() {
        this.stopMonitoring(this.sessionData);
        this.emitEvent('sessionEndedRemotely');
        console.log('Session ended by remote control');
    }
    
    applyRemoteAdaptation(adaptation) {
        if (this.adaptationEngine) {
            this.adaptationEngine.applyAdaptations(adaptation);
        }
        console.log('Remote adaptation applied:', adaptation);
    }
    
    // Observer Pattern
    addObserver(observer) {
        this.observers.push(observer);
    }
    
    removeObserver(observer) {
        const index = this.observers.indexOf(observer);
        if (index > -1) {
            this.observers.splice(index, 1);
        }
    }
    
    notifyObservers(eventType, data) {
        this.observers.forEach(observer => {
            if (typeof observer[eventType] === 'function') {
                observer[eventType](data);
            }
        });
    }
    
    // Data Management
    generateSessionSummary(sessionData) {
        return {
            duration: sessionData.duration,
            tasksCompleted: sessionData.metrics.tasksCompleted,
            errors: sessionData.metrics.errors,
            interactions: sessionData.metrics.interactions,
            adaptations: sessionData.metrics.adaptations,
            successRate: sessionData.metrics.tasksCompleted / (sessionData.metrics.tasksCompleted + sessionData.metrics.errors),
            averageTaskTime: this.calculateAverageTaskTime(sessionData),
            frustrationLevel: this.calculateFrustrationLevel(),
            recommendations: this.generateRecommendations(sessionData)
        };
    }
    
    calculateAverageTaskTime(sessionData) {
        const taskEvents = sessionData.events.filter(e => e.type === 'task_completion');
        if (taskEvents.length === 0) return 0;
        
        const totalTime = taskEvents.reduce((sum, event) => sum + (event.task.duration || 0), 0);
        return totalTime / taskEvents.length;
    }
    
    generateRecommendations(sessionData) {
        const recommendations = [];
        const summary = this.generateSessionSummary(sessionData);
        
        if (summary.successRate < 0.5) {
            recommendations.push({
                type: 'difficulty',
                message: 'Consider reducing task difficulty',
                priority: 'high'
            });
        }
        
        if (summary.frustrationLevel > 0.5) {
            recommendations.push({
                type: 'support',
                message: 'User may need additional support or breaks',
                priority: 'high'
            });
        }
        
        if (summary.averageTaskTime > 300000) { // 5 minutes
            recommendations.push({
                type: 'time',
                message: 'Consider extending time limits or simplifying tasks',
                priority: 'medium'
            });
        }
        
        return recommendations;
    }
    
    // Communication
    sendToServer(data) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(data));
        } else {
            // Fallback to HTTP if WebSocket is not available
            this.sendViaHTTP(data);
        }
    }
    
    sendViaHTTP(data) {
        fetch('/api/monitoring', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).catch(error => {
            console.error('Failed to send data via HTTP:', error);
        });
    }
    
    // Utility Methods
    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    getCurrentSession() {
        return this.sessionData;
    }
    
    isCurrentlyMonitoring() {
        return this.isMonitoring;
    }
    
    getFeedbackQueue() {
        return [...this.feedbackQueue];
    }
    
    clearFeedbackQueue() {
        this.feedbackQueue = [];
    }
    
    exportSessionData() {
        return {
            session: this.sessionData,
            summary: this.sessionData ? this.generateSessionSummary(this.sessionData) : null,
            exportDate: new Date().toISOString()
        };
    }
    
    emitEvent(eventName, detail) {
        const event = new CustomEvent(eventName, { detail });
        document.dispatchEvent(event);
    }
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes encouragementPop {
        0% {
            transform: translate(-50%, -50%) scale(0.5);
            opacity: 0;
        }
        50% {
            transform: translate(-50%, -50%) scale(1.1);
            opacity: 1;
        }
        100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RemoteMonitoringSystem;
}
