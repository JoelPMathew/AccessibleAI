/**
 * Performance Tracking System
 * Tracks movement paths, task completion time, interactions, and historical data
 */

class PerformanceTracking {
    constructor(userProfile, metricsSystem) {
        this.userProfile = userProfile;
        this.metrics = metricsSystem;
        this.sessionData = null;
        this.movementPaths = [];
        this.interactionLog = [];
        this.taskTimings = [];
        this.historicalData = [];
        this.trendAnalysis = null;
        
        this.init();
    }
    
    init() {
        this.loadHistoricalData();
        this.setupEventListeners();
        console.log('Performance Tracking initialized');
    }
    
    setupEventListeners() {
        // Listen for session events
        document.addEventListener('sessionStarted', (event) => {
            this.startSessionTracking(event.detail);
        });
        
        document.addEventListener('sessionEnded', (event) => {
            this.endSessionTracking(event.detail);
        });
        
        // Listen for movement events
        document.addEventListener('movement', (event) => {
            this.recordMovement(event.detail);
        });
        
        document.addEventListener('navigation', (event) => {
            this.recordNavigation(event.detail);
        });
        
        // Listen for interaction events
        document.addEventListener('interactionRecorded', (event) => {
            this.recordInteraction(event.detail);
        });
        
        // Listen for task events
        document.addEventListener('taskStarted', (event) => {
            this.recordTaskStart(event.detail);
        });
        
        document.addEventListener('taskCompleted', (event) => {
            this.recordTaskCompletion(event.detail);
        });
        
        document.addEventListener('taskStepCompleted', (event) => {
            this.recordTaskStep(event.detail);
        });
    }
    
    // Session Tracking
    startSessionTracking(sessionData) {
        this.sessionData = {
            id: this.generateSessionId(),
            startTime: Date.now(),
            endTime: null,
            duration: 0,
            userProfile: this.userProfile.getProfile(),
            movementPaths: [],
            interactionLog: [],
            taskTimings: [],
            performanceMetrics: {
                totalDistance: 0,
                averageSpeed: 0,
                interactionCount: 0,
                taskCount: 0,
                completionRate: 0,
                efficiency: 0
            },
            accessibilityMetrics: {
                keyboardNavigation: 0,
                screenReaderUsage: 0,
                voiceCommands: 0,
                assistiveDevices: 0,
                highContrast: false,
                largeText: false
            }
        };
        
        console.log('Performance tracking started for session:', this.sessionData.id);
    }
    
    endSessionTracking(sessionData) {
        if (this.sessionData) {
            this.sessionData.endTime = Date.now();
            this.sessionData.duration = this.sessionData.endTime - this.sessionData.startTime;
            
            // Calculate final metrics
            this.calculateSessionMetrics();
            
            // Store in historical data
            this.storeHistoricalData();
            
            // Perform trend analysis
            this.performTrendAnalysis();
            
            console.log('Performance tracking ended for session:', this.sessionData.id);
        }
    }
    
    // Movement Tracking
    recordMovement(movementData) {
        if (!this.sessionData) return;
        
        const movement = {
            timestamp: Date.now(),
            position: movementData.position || { x: 0, y: 0, z: 0 },
            rotation: movementData.rotation || { x: 0, y: 0, z: 0 },
            velocity: movementData.velocity || { x: 0, y: 0, z: 0 },
            method: movementData.method || 'unknown',
            duration: movementData.duration || 0,
            distance: movementData.distance || 0
        };
        
        this.sessionData.movementPaths.push(movement);
        this.movementPaths.push(movement);
        
        // Calculate movement metrics
        this.updateMovementMetrics();
    }
    
    recordNavigation(navigationData) {
        if (!this.sessionData) return;
        
        const navigation = {
            timestamp: Date.now(),
            from: navigationData.from || 'unknown',
            to: navigationData.to || 'unknown',
            method: navigationData.method || 'click',
            duration: navigationData.duration || 0,
            distance: navigationData.distance || 0,
            success: navigationData.success || true
        };
        
        this.sessionData.movementPaths.push(navigation);
        this.movementPaths.push(navigation);
        
        // Update navigation metrics
        this.updateNavigationMetrics();
    }
    
    updateMovementMetrics() {
        if (this.sessionData.movementPaths.length < 2) return;
        
        // Calculate total distance
        let totalDistance = 0;
        for (let i = 1; i < this.sessionData.movementPaths.length; i++) {
            const prev = this.sessionData.movementPaths[i - 1];
            const curr = this.sessionData.movementPaths[i];
            
            if (prev.position && curr.position) {
                const distance = this.calculateDistance(prev.position, curr.position);
                totalDistance += distance;
            }
        }
        
        this.sessionData.performanceMetrics.totalDistance = totalDistance;
        
        // Calculate average speed
        const sessionDuration = this.sessionData.duration || (Date.now() - this.sessionData.startTime);
        this.sessionData.performanceMetrics.averageSpeed = totalDistance / (sessionDuration / 1000);
    }
    
    updateNavigationMetrics() {
        const navigationEvents = this.sessionData.movementPaths.filter(m => m.method !== 'unknown');
        const successfulNavigations = navigationEvents.filter(n => n.success);
        
        this.sessionData.performanceMetrics.navigationSuccessRate = 
            navigationEvents.length > 0 ? successfulNavigations.length / navigationEvents.length : 0;
    }
    
    calculateDistance(pos1, pos2) {
        const dx = pos2.x - pos1.x;
        const dy = pos2.y - pos1.y;
        const dz = pos2.z - pos1.z;
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }
    
    // Interaction Tracking
    recordInteraction(interactionData) {
        if (!this.sessionData) return;
        
        const interaction = {
            timestamp: Date.now(),
            type: interactionData.type || 'unknown',
            target: interactionData.target || null,
            position: interactionData.position || null,
            success: interactionData.success || true,
            duration: interactionData.duration || 0,
            attempts: interactionData.attempts || 1,
            method: interactionData.method || 'click'
        };
        
        this.sessionData.interactionLog.push(interaction);
        this.interactionLog.push(interaction);
        
        // Update interaction metrics
        this.updateInteractionMetrics();
    }
    
    updateInteractionMetrics() {
        this.sessionData.performanceMetrics.interactionCount = this.sessionData.interactionLog.length;
        
        // Calculate interaction success rate
        const successfulInteractions = this.sessionData.interactionLog.filter(i => i.success);
        this.sessionData.performanceMetrics.interactionSuccessRate = 
            this.sessionData.interactionLog.length > 0 ? 
            successfulInteractions.length / this.sessionData.interactionLog.length : 0;
        
        // Calculate average interaction time
        const totalInteractionTime = this.sessionData.interactionLog.reduce((sum, i) => sum + i.duration, 0);
        this.sessionData.performanceMetrics.averageInteractionTime = 
            this.sessionData.interactionLog.length > 0 ? 
            totalInteractionTime / this.sessionData.interactionLog.length : 0;
    }
    
    // Task Tracking
    recordTaskStart(taskData) {
        if (!this.sessionData) return;
        
        const task = {
            id: this.generateTaskId(),
            name: taskData.name || 'Unknown Task',
            startTime: Date.now(),
            endTime: null,
            duration: 0,
            steps: [],
            interactions: 0,
            errors: 0,
            success: false,
            difficulty: taskData.difficulty || 'medium',
            assistanceLevel: taskData.assistanceLevel || 'moderate'
        };
        
        this.sessionData.taskTimings.push(task);
        this.taskTimings.push(task);
        
        console.log('Task tracking started:', task.name);
    }
    
    recordTaskCompletion(taskData) {
        if (!this.sessionData) return;
        
        const task = this.sessionData.taskTimings[this.sessionData.taskTimings.length - 1];
        if (task) {
            task.endTime = Date.now();
            task.duration = task.endTime - task.startTime;
            task.success = true;
            
            // Update task metrics
            this.updateTaskMetrics();
        }
    }
    
    recordTaskStep(stepData) {
        if (!this.sessionData) return;
        
        const task = this.sessionData.taskTimings[this.sessionData.taskTimings.length - 1];
        if (task) {
            const step = {
                name: stepData.step?.name || 'Unknown Step',
                startTime: Date.now(),
                endTime: null,
                duration: 0,
                success: true
            };
            
            task.steps.push(step);
        }
    }
    
    updateTaskMetrics() {
        this.sessionData.performanceMetrics.taskCount = this.sessionData.taskTimings.length;
        
        // Calculate completion rate
        const completedTasks = this.sessionData.taskTimings.filter(t => t.success);
        this.sessionData.performanceMetrics.completionRate = 
            this.sessionData.taskTimings.length > 0 ? 
            completedTasks.length / this.sessionData.taskTimings.length : 0;
        
        // Calculate average task time
        const totalTaskTime = this.sessionData.taskTimings.reduce((sum, t) => sum + t.duration, 0);
        this.sessionData.performanceMetrics.averageTaskTime = 
            this.sessionData.taskTimings.length > 0 ? 
            totalTaskTime / this.sessionData.taskTimings.length : 0;
        
        // Calculate efficiency (tasks per minute)
        const sessionDuration = this.sessionData.duration || (Date.now() - this.sessionData.startTime);
        this.sessionData.performanceMetrics.efficiency = 
            (completedTasks.length / (sessionDuration / 60000)) || 0;
    }
    
    // Accessibility Tracking
    recordAccessibilityEvent(eventType, data) {
        if (!this.sessionData) return;
        
        const event = {
            timestamp: Date.now(),
            type: eventType,
            data: data
        };
        
        // Update accessibility metrics
        switch (eventType) {
            case 'keyboard_navigation':
                this.sessionData.accessibilityMetrics.keyboardNavigation++;
                break;
            case 'screen_reader':
                this.sessionData.accessibilityMetrics.screenReaderUsage++;
                break;
            case 'voice_command':
                this.sessionData.accessibilityMetrics.voiceCommands++;
                break;
            case 'assistive_device':
                this.sessionData.accessibilityMetrics.assistiveDevices++;
                break;
            case 'high_contrast':
                this.sessionData.accessibilityMetrics.highContrast = data.enabled;
                break;
            case 'large_text':
                this.sessionData.accessibilityMetrics.largeText = data.enabled;
                break;
        }
        
        // Store event for compliance logging
        if (!this.sessionData.accessibilityEvents) {
            this.sessionData.accessibilityEvents = [];
        }
        this.sessionData.accessibilityEvents.push(event);
    }
    
    // Historical Data Management
    storeHistoricalData() {
        if (!this.sessionData) return;
        
        const historicalEntry = {
            sessionId: this.sessionData.id,
            timestamp: this.sessionData.startTime,
            duration: this.sessionData.duration,
            userProfile: this.sessionData.userProfile,
            performanceMetrics: this.sessionData.performanceMetrics,
            accessibilityMetrics: this.sessionData.accessibilityMetrics,
            movementPaths: this.sessionData.movementPaths,
            interactionLog: this.sessionData.interactionLog,
            taskTimings: this.sessionData.taskTimings
        };
        
        this.historicalData.push(historicalEntry);
        
        // Keep only last 100 sessions
        if (this.historicalData.length > 100) {
            this.historicalData = this.historicalData.slice(-100);
        }
        
        this.saveHistoricalData();
    }
    
    loadHistoricalData() {
        try {
            const saved = localStorage.getItem('performanceHistoricalData');
            if (saved) {
                this.historicalData = JSON.parse(saved);
                console.log('Historical data loaded:', this.historicalData.length, 'sessions');
            }
        } catch (error) {
            console.error('Failed to load historical data:', error);
        }
    }
    
    saveHistoricalData() {
        try {
            localStorage.setItem('performanceHistoricalData', JSON.stringify(this.historicalData));
            console.log('Historical data saved');
        } catch (error) {
            console.error('Failed to save historical data:', error);
        }
    }
    
    // Trend Analysis
    performTrendAnalysis() {
        if (this.historicalData.length < 2) return;
        
        const recentSessions = this.historicalData.slice(-10); // Last 10 sessions
        
        this.trendAnalysis = {
            performance: this.analyzePerformanceTrend(recentSessions),
            accessibility: this.analyzeAccessibilityTrend(recentSessions),
            movement: this.analyzeMovementTrend(recentSessions),
            interactions: this.analyzeInteractionTrend(recentSessions),
            tasks: this.analyzeTaskTrend(recentSessions)
        };
        
        // Emit trend analysis event
        this.emitEvent('trendAnalysisCompleted', { analysis: this.trendAnalysis });
    }
    
    analyzePerformanceTrend(sessions) {
        const metrics = ['completionRate', 'efficiency', 'averageTaskTime', 'interactionSuccessRate'];
        const trends = {};
        
        metrics.forEach(metric => {
            const values = sessions.map(s => s.performanceMetrics[metric] || 0);
            trends[metric] = this.calculateTrend(values);
        });
        
        return trends;
    }
    
    analyzeAccessibilityTrend(sessions) {
        const metrics = ['keyboardNavigation', 'screenReaderUsage', 'voiceCommands', 'assistiveDevices'];
        const trends = {};
        
        metrics.forEach(metric => {
            const values = sessions.map(s => s.accessibilityMetrics[metric] || 0);
            trends[metric] = this.calculateTrend(values);
        });
        
        return trends;
    }
    
    analyzeMovementTrend(sessions) {
        const totalDistances = sessions.map(s => s.performanceMetrics.totalDistance || 0);
        const averageSpeeds = sessions.map(s => s.performanceMetrics.averageSpeed || 0);
        
        return {
            totalDistance: this.calculateTrend(totalDistances),
            averageSpeed: this.calculateTrend(averageSpeeds)
        };
    }
    
    analyzeInteractionTrend(sessions) {
        const interactionCounts = sessions.map(s => s.performanceMetrics.interactionCount || 0);
        const successRates = sessions.map(s => s.performanceMetrics.interactionSuccessRate || 0);
        
        return {
            count: this.calculateTrend(interactionCounts),
            successRate: this.calculateTrend(successRates)
        };
    }
    
    analyzeTaskTrend(sessions) {
        const taskCounts = sessions.map(s => s.performanceMetrics.taskCount || 0);
        const completionRates = sessions.map(s => s.performanceMetrics.completionRate || 0);
        
        return {
            count: this.calculateTrend(taskCounts),
            completionRate: this.calculateTrend(completionRates)
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
    
    // Data Export
    exportPerformanceData() {
        return {
            currentSession: this.sessionData,
            historicalData: this.historicalData,
            trendAnalysis: this.trendAnalysis,
            exportDate: new Date().toISOString()
        };
    }
    
    exportSessionData(sessionId) {
        const session = this.historicalData.find(s => s.sessionId === sessionId);
        return session || null;
    }
    
    // Analytics
    getPerformanceSummary() {
        if (!this.sessionData) return null;
        
        return {
            session: {
                id: this.sessionData.id,
                duration: this.sessionData.duration,
                startTime: this.sessionData.startTime,
                endTime: this.sessionData.endTime
            },
            performance: this.sessionData.performanceMetrics,
            accessibility: this.sessionData.accessibilityMetrics,
            trends: this.trendAnalysis
        };
    }
    
    getHistoricalSummary() {
        if (this.historicalData.length === 0) return null;
        
        const totalSessions = this.historicalData.length;
        const totalDuration = this.historicalData.reduce((sum, s) => sum + s.duration, 0);
        const averageCompletionRate = this.historicalData.reduce((sum, s) => 
            sum + s.performanceMetrics.completionRate, 0) / totalSessions;
        
        return {
            totalSessions,
            totalDuration,
            averageCompletionRate,
            recentTrends: this.trendAnalysis
        };
    }
    
    // Utility Methods
    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    generateTaskId() {
        return 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    calculateSessionMetrics() {
        // This method is called when session ends to calculate final metrics
        this.updateMovementMetrics();
        this.updateInteractionMetrics();
        this.updateTaskMetrics();
    }
    
    emitEvent(eventName, detail) {
        const event = new CustomEvent(eventName, { detail });
        document.dispatchEvent(event);
    }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceTracking;
}
