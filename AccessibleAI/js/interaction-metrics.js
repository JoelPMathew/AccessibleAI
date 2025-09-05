/**
 * Interaction & Metrics Tracking System
 * Tracks user interactions, task completion, and performance metrics
 */

class InteractionMetrics {
    constructor() {
        this.metrics = {
            sessions: [],
            currentSession: null,
            totalSessions: 0,
            totalPlayTime: 0,
            tasksCompleted: 0,
            totalInteractions: 0,
            averageTaskTime: 0,
            successRate: 0,
            errorCount: 0,
            retryCount: 0
        };
        
        this.currentTask = null;
        this.taskStartTime = null;
        this.interactionLog = [];
        this.errorLog = [];
        this.retryLog = [];
        
        this.init();
    }
    
    init() {
        this.loadMetrics();
        this.startNewSession();
        this.setupEventListeners();
        console.log('Interaction Metrics initialized');
    }
    
    setupEventListeners() {
        // Listen for task events
        document.addEventListener('taskStarted', (event) => {
            this.startTaskTracking(event.detail);
        });
        
        document.addEventListener('taskCompleted', (event) => {
            this.completeTaskTracking(event.detail);
        });
        
        document.addEventListener('taskStepCompleted', (event) => {
            this.recordStepCompletion(event.detail);
        });
        
        // Listen for interaction events
        document.addEventListener('objectClicked', (event) => {
            this.recordInteraction('click', event.detail);
        });
        
        document.addEventListener('objectHighlighted', (event) => {
            this.recordInteraction('highlight', event.detail);
        });
        
        document.addEventListener('adaptiveInput', (event) => {
            this.recordInteraction('input', event.detail);
        });
        
        // Listen for error events
        document.addEventListener('taskError', (event) => {
            this.recordError(event.detail);
        });
        
        document.addEventListener('retryAttempt', (event) => {
            this.recordRetry(event.detail);
        });
        
        // Listen for navigation events
        document.addEventListener('navigation', (event) => {
            this.recordNavigation(event.detail);
        });
    }
    
    startNewSession() {
        const session = {
            id: this.generateSessionId(),
            startTime: Date.now(),
            endTime: null,
            duration: 0,
            tasksCompleted: 0,
            interactions: 0,
            errors: 0,
            retries: 0,
            scenarios: [],
            totalPoints: 0,
            badgesEarned: []
        };
        
        this.currentSession = session;
        this.metrics.sessions.push(session);
        this.metrics.totalSessions++;
        
        console.log('New session started:', session.id);
    }
    
    endCurrentSession() {
        if (this.currentSession) {
            this.currentSession.endTime = Date.now();
            this.currentSession.duration = this.currentSession.endTime - this.currentSession.startTime;
            this.metrics.totalPlayTime += this.currentSession.duration;
            
            // Calculate session statistics
            this.calculateSessionStats();
            
            console.log('Session ended:', this.currentSession.id);
            this.currentSession = null;
        }
    }
    
    startTaskTracking(task) {
        this.currentTask = {
            id: this.generateTaskId(),
            name: task.name,
            scenario: task.scenario || 'unknown',
            startTime: Date.now(),
            endTime: null,
            duration: 0,
            stepsCompleted: 0,
            totalSteps: task.steps ? task.steps.length : 0,
            interactions: 0,
            errors: 0,
            retries: 0,
            success: false,
            difficulty: task.difficulty || 'medium',
            assistanceLevel: task.assistanceLevel || 'moderate'
        };
        
        this.taskStartTime = Date.now();
        this.interactionLog = [];
        this.errorLog = [];
        this.retryLog = [];
        
        console.log('Task tracking started:', this.currentTask.name);
    }
    
    completeTaskTracking(task) {
        if (this.currentTask) {
            this.currentTask.endTime = Date.now();
            this.currentTask.duration = this.currentTask.endTime - this.currentTask.startTime;
            this.currentTask.success = true;
            
            // Update metrics
            this.metrics.tasksCompleted++;
            this.metrics.totalInteractions += this.currentTask.interactions;
            this.metrics.errorCount += this.currentTask.errors;
            this.metrics.retryCount += this.currentTask.retries;
            
            // Update current session
            if (this.currentSession) {
                this.currentSession.tasksCompleted++;
                this.currentSession.interactions += this.currentTask.interactions;
                this.currentSession.errors += this.currentTask.errors;
                this.currentSession.retries += this.currentTask.retries;
                
                // Add to session scenarios if not already present
                if (!this.currentSession.scenarios.includes(this.currentTask.scenario)) {
                    this.currentSession.scenarios.push(this.currentTask.scenario);
                }
            }
            
            // Calculate points and badges
            this.calculateTaskRewards();
            
            // Update averages
            this.updateAverages();
            
            console.log('Task completed:', this.currentTask.name, 'Duration:', this.currentTask.duration);
            
            // Emit task completion event
            this.emitEvent('taskMetricsCompleted', {
                task: this.currentTask,
                metrics: this.getCurrentMetrics()
            });
            
            this.currentTask = null;
        }
    }
    
    recordStepCompletion(step) {
        if (this.currentTask) {
            this.currentTask.stepsCompleted++;
            this.recordInteraction('step_completion', {
                step: step.name,
                task: this.currentTask.name,
                timestamp: Date.now()
            });
        }
    }
    
    recordInteraction(type, details) {
        const interaction = {
            type: type,
            details: details,
            timestamp: Date.now(),
            task: this.currentTask ? this.currentTask.name : null,
            session: this.currentSession ? this.currentSession.id : null
        };
        
        this.interactionLog.push(interaction);
        
        if (this.currentTask) {
            this.currentTask.interactions++;
        }
        
        if (this.currentSession) {
            this.currentSession.interactions++;
        }
        
        this.metrics.totalInteractions++;
        
        // Emit interaction event
        this.emitEvent('interactionRecorded', interaction);
    }
    
    recordError(error) {
        const errorRecord = {
            type: error.type || 'unknown',
            message: error.message || 'Unknown error',
            task: this.currentTask ? this.currentTask.name : null,
            session: this.currentSession ? this.currentSession.id : null,
            timestamp: Date.now(),
            context: error.context || {}
        };
        
        this.errorLog.push(errorRecord);
        
        if (this.currentTask) {
            this.currentTask.errors++;
        }
        
        if (this.currentSession) {
            this.currentSession.errors++;
        }
        
        this.metrics.errorCount++;
        
        // Emit error event
        this.emitEvent('errorRecorded', errorRecord);
    }
    
    recordRetry(retry) {
        const retryRecord = {
            type: retry.type || 'task_retry',
            task: this.currentTask ? this.currentTask.name : null,
            session: this.currentSession ? this.currentSession.id : null,
            timestamp: Date.now(),
            reason: retry.reason || 'User initiated'
        };
        
        this.retryLog.push(retryRecord);
        
        if (this.currentTask) {
            this.currentTask.retries++;
        }
        
        if (this.currentSession) {
            this.currentSession.retries++;
        }
        
        this.metrics.retryCount++;
        
        // Emit retry event
        this.emitEvent('retryRecorded', retryRecord);
    }
    
    recordNavigation(navigation) {
        const navRecord = {
            from: navigation.from || 'unknown',
            to: navigation.to || 'unknown',
            method: navigation.method || 'click',
            duration: navigation.duration || 0,
            timestamp: Date.now(),
            task: this.currentTask ? this.currentTask.name : null,
            session: this.currentSession ? this.currentSession.id : null
        };
        
        this.recordInteraction('navigation', navRecord);
    }
    
    calculateTaskRewards() {
        if (!this.currentTask) return;
        
        const task = this.currentTask;
        let points = 0;
        const badges = [];
        
        // Base points for completion
        points += 100;
        
        // Speed bonus (faster completion = more points)
        const expectedTime = this.getExpectedTaskTime(task.difficulty);
        if (task.duration < expectedTime) {
            const speedBonus = Math.floor((expectedTime - task.duration) / 1000) * 10;
            points += speedBonus;
        }
        
        // Accuracy bonus (no errors = more points)
        if (task.errors === 0) {
            points += 50;
            badges.push('perfect_completion');
        }
        
        // Efficiency bonus (fewer interactions = more points)
        const expectedInteractions = this.getExpectedInteractions(task.difficulty);
        if (task.interactions < expectedInteractions) {
            const efficiencyBonus = Math.floor((expectedInteractions - task.interactions) / 10) * 5;
            points += efficiencyBonus;
        }
        
        // Difficulty multiplier
        const difficultyMultiplier = this.getDifficultyMultiplier(task.difficulty);
        points = Math.floor(points * difficultyMultiplier);
        
        // First completion bonus
        if (this.isFirstCompletion(task.name)) {
            points += 200;
            badges.push('first_completion');
        }
        
        // Perfect run bonus
        if (task.errors === 0 && task.retries === 0) {
            badges.push('perfect_run');
        }
        
        // Speed run bonus
        if (task.duration < expectedTime * 0.5) {
            badges.push('speed_run');
        }
        
        // Update task with rewards
        task.points = points;
        task.badges = badges;
        
        // Update session totals
        if (this.currentSession) {
            this.currentSession.totalPoints += points;
            this.currentSession.badgesEarned.push(...badges);
        }
        
        // Emit rewards event
        this.emitEvent('rewardsCalculated', {
            task: task,
            points: points,
            badges: badges
        });
    }
    
    calculateSessionStats() {
        if (!this.currentSession) return;
        
        const session = this.currentSession;
        
        // Calculate session averages
        session.averageTaskTime = session.tasksCompleted > 0 ? 
            session.duration / session.tasksCompleted : 0;
        
        session.averageInteractionsPerTask = session.tasksCompleted > 0 ? 
            session.interactions / session.tasksCompleted : 0;
        
        session.errorRate = session.tasksCompleted > 0 ? 
            session.errors / session.tasksCompleted : 0;
        
        session.retryRate = session.tasksCompleted > 0 ? 
            session.retries / session.tasksCompleted : 0;
        
        // Calculate session badges
        this.calculateSessionBadges(session);
    }
    
    calculateSessionBadges(session) {
        const badges = [];
        
        // Long session badge
        if (session.duration > 30 * 60 * 1000) { // 30 minutes
            badges.push('marathon_session');
        }
        
        // Productive session badge
        if (session.tasksCompleted >= 5) {
            badges.push('productive_session');
        }
        
        // Perfect session badge
        if (session.errors === 0 && session.retries === 0) {
            badges.push('perfect_session');
        }
        
        // Explorer badge
        if (session.scenarios.length >= 3) {
            badges.push('explorer');
        }
        
        // Add session badges
        session.badgesEarned.push(...badges);
        
        // Emit session badges event
        if (badges.length > 0) {
            this.emitEvent('sessionBadgesEarned', {
                session: session,
                badges: badges
            });
        }
    }
    
    updateAverages() {
        if (this.metrics.tasksCompleted > 0) {
            this.metrics.averageTaskTime = this.metrics.totalPlayTime / this.metrics.tasksCompleted;
            this.metrics.successRate = (this.metrics.tasksCompleted / (this.metrics.tasksCompleted + this.metrics.errorCount)) * 100;
        }
    }
    
    getExpectedTaskTime(difficulty) {
        const times = {
            'easy': 5 * 60 * 1000,    // 5 minutes
            'medium': 3 * 60 * 1000,  // 3 minutes
            'hard': 2 * 60 * 1000     // 2 minutes
        };
        return times[difficulty] || times['medium'];
    }
    
    getExpectedInteractions(difficulty) {
        const interactions = {
            'easy': 20,
            'medium': 15,
            'hard': 10
        };
        return interactions[difficulty] || interactions['medium'];
    }
    
    getDifficultyMultiplier(difficulty) {
        const multipliers = {
            'easy': 1.0,
            'medium': 1.5,
            'hard': 2.0
        };
        return multipliers[difficulty] || multipliers['medium'];
    }
    
    isFirstCompletion(taskName) {
        return !this.metrics.sessions.some(session => 
            session.tasksCompleted > 0 && 
            session.tasks.some(task => task.name === taskName && task.success)
        );
    }
    
    getCurrentMetrics() {
        return {
            ...this.metrics,
            currentSession: this.currentSession,
            currentTask: this.currentTask,
            recentInteractions: this.interactionLog.slice(-10),
            recentErrors: this.errorLog.slice(-5),
            recentRetries: this.retryLog.slice(-5)
        };
    }
    
    getTaskMetrics(taskName) {
        const taskSessions = this.metrics.sessions.filter(session => 
            session.tasks.some(task => task.name === taskName)
        );
        
        return {
            totalCompletions: taskSessions.length,
            averageTime: this.calculateAverageTaskTime(taskName),
            successRate: this.calculateTaskSuccessRate(taskName),
            totalPoints: this.calculateTotalTaskPoints(taskName),
            badges: this.getTaskBadges(taskName)
        };
    }
    
    getSessionMetrics(sessionId) {
        return this.metrics.sessions.find(session => session.id === sessionId);
    }
    
    getOverallStats() {
        return {
            totalSessions: this.metrics.totalSessions,
            totalPlayTime: this.metrics.totalPlayTime,
            totalTasksCompleted: this.metrics.tasksCompleted,
            totalInteractions: this.metrics.totalInteractions,
            totalPoints: this.calculateTotalPoints(),
            totalBadges: this.calculateTotalBadges(),
            averageSessionTime: this.metrics.totalSessions > 0 ? 
                this.metrics.totalPlayTime / this.metrics.totalSessions : 0,
            averageTaskTime: this.metrics.averageTaskTime,
            successRate: this.metrics.successRate,
            errorRate: this.metrics.errorCount / this.metrics.totalInteractions,
            retryRate: this.metrics.retryCount / this.metrics.totalInteractions
        };
    }
    
    calculateAverageTaskTime(taskName) {
        const taskTimes = this.metrics.sessions
            .flatMap(session => session.tasks)
            .filter(task => task.name === taskName && task.success)
            .map(task => task.duration);
        
        return taskTimes.length > 0 ? 
            taskTimes.reduce((sum, time) => sum + time, 0) / taskTimes.length : 0;
    }
    
    calculateTaskSuccessRate(taskName) {
        const taskAttempts = this.metrics.sessions
            .flatMap(session => session.tasks)
            .filter(task => task.name === taskName);
        
        const successfulAttempts = taskAttempts.filter(task => task.success);
        
        return taskAttempts.length > 0 ? 
            (successfulAttempts.length / taskAttempts.length) * 100 : 0;
    }
    
    calculateTotalTaskPoints(taskName) {
        return this.metrics.sessions
            .flatMap(session => session.tasks)
            .filter(task => task.name === taskName && task.success)
            .reduce((sum, task) => sum + (task.points || 0), 0);
    }
    
    getTaskBadges(taskName) {
        const taskBadges = this.metrics.sessions
            .flatMap(session => session.tasks)
            .filter(task => task.name === taskName && task.success)
            .flatMap(task => task.badges || []);
        
        return [...new Set(taskBadges)];
    }
    
    calculateTotalPoints() {
        return this.metrics.sessions.reduce((sum, session) => sum + session.totalPoints, 0);
    }
    
    calculateTotalBadges() {
        const allBadges = this.metrics.sessions.flatMap(session => session.badgesEarned);
        return [...new Set(allBadges)].length;
    }
    
    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    generateTaskId() {
        return 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    emitEvent(eventName, detail) {
        const event = new CustomEvent(eventName, { detail });
        document.dispatchEvent(event);
    }
    
    saveMetrics() {
        try {
            localStorage.setItem('interactionMetrics', JSON.stringify(this.metrics));
            console.log('Metrics saved successfully');
        } catch (error) {
            console.error('Failed to save metrics:', error);
        }
    }
    
    loadMetrics() {
        try {
            const saved = localStorage.getItem('interactionMetrics');
            if (saved) {
                this.metrics = { ...this.metrics, ...JSON.parse(saved) };
                console.log('Metrics loaded successfully');
            }
        } catch (error) {
            console.error('Failed to load metrics:', error);
        }
    }
    
    exportMetrics() {
        return {
            metrics: this.metrics,
            currentSession: this.currentSession,
            currentTask: this.currentTask,
            interactionLog: this.interactionLog,
            errorLog: this.errorLog,
            retryLog: this.retryLog,
            exportDate: new Date().toISOString()
        };
    }
    
    importMetrics(data) {
        try {
            if (data.metrics) {
                this.metrics = { ...this.metrics, ...data.metrics };
            }
            if (data.currentSession) {
                this.currentSession = data.currentSession;
            }
            if (data.currentTask) {
                this.currentTask = data.currentTask;
            }
            if (data.interactionLog) {
                this.interactionLog = data.interactionLog;
            }
            if (data.errorLog) {
                this.errorLog = data.errorLog;
            }
            if (data.retryLog) {
                this.retryLog = data.retryLog;
            }
            
            this.saveMetrics();
            console.log('Metrics imported successfully');
            return true;
        } catch (error) {
            console.error('Failed to import metrics:', error);
            return false;
        }
    }
    
    resetMetrics() {
        this.metrics = {
            sessions: [],
            currentSession: null,
            totalSessions: 0,
            totalPlayTime: 0,
            tasksCompleted: 0,
            totalInteractions: 0,
            averageTaskTime: 0,
            successRate: 0,
            errorCount: 0,
            retryCount: 0
        };
        
        this.currentTask = null;
        this.taskStartTime = null;
        this.interactionLog = [];
        this.errorLog = [];
        this.retryLog = [];
        
        this.saveMetrics();
        console.log('Metrics reset successfully');
    }
}

// Create global instance
window.InteractionMetrics = InteractionMetrics;
window.interactionMetrics = new InteractionMetrics();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InteractionMetrics;
}
