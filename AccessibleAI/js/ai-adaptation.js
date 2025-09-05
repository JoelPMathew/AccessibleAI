/**
 * AI-Driven Adaptation Engine
 * Adjusts environment complexity, object placement, and task difficulty dynamically
 */

class AIAdaptationEngine {
    constructor(userProfile, metricsSystem) {
        this.userProfile = userProfile;
        this.metrics = metricsSystem;
        this.adaptationRules = [];
        this.environmentState = {};
        this.adaptationHistory = [];
        this.performanceThresholds = {
            success: 0.8,
            failure: 0.3,
            improvement: 0.1,
            decline: -0.1
        };
        
        this.init();
    }
    
    init() {
        this.setupAdaptationRules();
        this.setupEventListeners();
        console.log('AI Adaptation Engine initialized');
    }
    
    setupEventListeners() {
        // Listen for task completion to trigger adaptation
        document.addEventListener('taskCompleted', (event) => {
            this.analyzeAndAdapt(event.detail);
        });
        
        // Listen for ability changes
        document.addEventListener('abilitiesUpdated', (event) => {
            this.adaptToProfile(this.userProfile.getProfile());
        });
        
        // Listen for performance metrics
        document.addEventListener('taskMetricsCompleted', (event) => {
            this.analyzePerformance(event.detail);
        });
    }
    
    setupAdaptationRules() {
        this.adaptationRules = [
            // Fine Motor Adaptations
            {
                condition: (profile) => profile.interactionAbilities.fineMotor <= 4,
                adaptations: {
                    objectSize: { multiplier: 1.5, min: 20, max: 100 },
                    clickTolerance: { multiplier: 2.0, min: 10, max: 50 },
                    dragSensitivity: { multiplier: 0.7, min: 0.5, max: 2.0 },
                    precisionRequired: false
                },
                priority: 'high'
            },
            
            // Gross Motor Adaptations
            {
                condition: (profile) => profile.interactionAbilities.grossMotor <= 4,
                adaptations: {
                    navigationSpeed: { multiplier: 0.8, min: 0.5, max: 1.5 },
                    movementTolerance: { multiplier: 1.5, min: 1.0, max: 3.0 },
                    largeMovements: true,
                    simplifiedNavigation: true
                },
                priority: 'high'
            },
            
            // Visual Adaptations
            {
                condition: (profile) => profile.interactionAbilities.visual <= 5,
                adaptations: {
                    contrast: 'high',
                    highlighting: true,
                    visualCues: true,
                    objectGlow: true,
                    colorCoding: true,
                    textSize: 'large'
                },
                priority: 'medium'
            },
            
            // Auditory Adaptations
            {
                condition: (profile) => profile.interactionAbilities.auditory <= 5,
                adaptations: {
                    audioNarration: true,
                    soundCues: true,
                    voiceGuidance: true,
                    audioFeedback: true,
                    speechRate: 'slow'
                },
                priority: 'medium'
            },
            
            // Cognitive Adaptations
            {
                condition: (profile) => profile.interactionAbilities.cognitive <= 5,
                adaptations: {
                    taskComplexity: 'low',
                    stepByStepGuidance: true,
                    visualInstructions: true,
                    repetition: true,
                    simplifiedInterface: true
                },
                priority: 'high'
            },
            
            // Attention Adaptations
            {
                condition: (profile) => profile.interactionAbilities.attention <= 4,
                adaptations: {
                    sessionLength: 'short',
                    frequentBreaks: true,
                    progressIndicators: true,
                    motivationRewards: true,
                    distractionReduction: true
                },
                priority: 'high'
            },
            
            // Memory Adaptations
            {
                condition: (profile) => profile.interactionAbilities.memory <= 5,
                adaptations: {
                    memoryAids: true,
                    visualReminders: true,
                    repetition: true,
                    simplifiedInstructions: true,
                    contextualHelp: true
                },
                priority: 'medium'
            },
            
            // Processing Speed Adaptations
            {
                condition: (profile) => profile.interactionAbilities.processing <= 5,
                adaptations: {
                    timeLimitExtension: true,
                    slowPace: true,
                    simplifiedChoices: true,
                    clearInstructions: true,
                    patienceMode: true
                },
                priority: 'medium'
            }
        ];
    }
    
    analyzeAndAdapt(taskData) {
        const profile = this.userProfile.getProfile();
        const performance = this.calculatePerformance(taskData);
        
        // Determine if adaptation is needed
        const needsAdaptation = this.shouldAdapt(performance, profile);
        
        if (needsAdaptation) {
            const adaptations = this.generateAdaptations(profile, performance);
            this.applyAdaptations(adaptations);
        }
        
        // Record adaptation attempt
        this.recordAdaptation({
            task: taskData.task,
            performance: performance,
            adaptations: needsAdaptation ? adaptations : [],
            timestamp: Date.now()
        });
    }
    
    calculatePerformance(taskData) {
        const task = taskData.task;
        const metrics = taskData.metrics;
        
        return {
            successRate: metrics.successRate || 0,
            completionTime: task.duration || 0,
            errorRate: task.errors / (task.interactions || 1),
            efficiency: task.stepsCompleted / (task.totalSteps || 1),
            difficulty: task.difficulty || 'medium',
            assistanceLevel: task.assistanceLevel || 'moderate'
        };
    }
    
    shouldAdapt(performance, profile) {
        // Check if performance is below threshold
        if (performance.successRate < this.performanceThresholds.failure) {
            return { type: 'reduce_difficulty', reason: 'low_success_rate' };
        }
        
        // Check if performance is above threshold and can be challenged
        if (performance.successRate > this.performanceThresholds.success) {
            return { type: 'increase_difficulty', reason: 'high_success_rate' };
        }
        
        // Check for specific ability-based adaptations
        const abilityAdaptations = this.checkAbilityAdaptations(profile);
        if (abilityAdaptations.length > 0) {
            return { type: 'ability_based', reason: 'ability_limitations', adaptations: abilityAdaptations };
        }
        
        return null;
    }
    
    checkAbilityAdaptations(profile) {
        const adaptations = [];
        
        this.adaptationRules.forEach(rule => {
            if (rule.condition(profile)) {
                adaptations.push({
                    rule: rule,
                    priority: rule.priority,
                    adaptations: rule.adaptations
                });
            }
        });
        
        return adaptations;
    }
    
    generateAdaptations(profile, performance) {
        const adaptations = {
            environment: {},
            objects: {},
            tasks: {},
            interface: {},
            assistance: {}
        };
        
        // Apply rule-based adaptations
        const abilityAdaptations = this.checkAbilityAdaptations(profile);
        abilityAdaptations.forEach(adaptation => {
            this.applyRuleAdaptations(adaptations, adaptation.adaptations);
        });
        
        // Apply performance-based adaptations
        this.applyPerformanceAdaptations(adaptations, performance);
        
        // Apply learning profile adaptations
        this.applyLearningProfileAdaptations(adaptations, profile.learningProfile);
        
        return adaptations;
    }
    
    applyRuleAdaptations(adaptations, ruleAdaptations) {
        Object.entries(ruleAdaptations).forEach(([key, value]) => {
            switch (key) {
                case 'objectSize':
                    adaptations.objects.size = value;
                    break;
                case 'clickTolerance':
                    adaptations.interface.clickTolerance = value;
                    break;
                case 'dragSensitivity':
                    adaptations.interface.dragSensitivity = value;
                    break;
                case 'precisionRequired':
                    adaptations.tasks.precisionRequired = value;
                    break;
                case 'navigationSpeed':
                    adaptations.environment.navigationSpeed = value;
                    break;
                case 'movementTolerance':
                    adaptations.environment.movementTolerance = value;
                    break;
                case 'largeMovements':
                    adaptations.tasks.largeMovements = value;
                    break;
                case 'simplifiedNavigation':
                    adaptations.interface.simplifiedNavigation = value;
                    break;
                case 'contrast':
                    adaptations.interface.contrast = value;
                    break;
                case 'highlighting':
                    adaptations.interface.highlighting = value;
                    break;
                case 'visualCues':
                    adaptations.interface.visualCues = value;
                    break;
                case 'objectGlow':
                    adaptations.objects.glow = value;
                    break;
                case 'colorCoding':
                    adaptations.interface.colorCoding = value;
                    break;
                case 'textSize':
                    adaptations.interface.textSize = value;
                    break;
                case 'audioNarration':
                    adaptations.assistance.audioNarration = value;
                    break;
                case 'soundCues':
                    adaptations.assistance.soundCues = value;
                    break;
                case 'voiceGuidance':
                    adaptations.assistance.voiceGuidance = value;
                    break;
                case 'audioFeedback':
                    adaptations.assistance.audioFeedback = value;
                    break;
                case 'speechRate':
                    adaptations.assistance.speechRate = value;
                    break;
                case 'taskComplexity':
                    adaptations.tasks.complexity = value;
                    break;
                case 'stepByStepGuidance':
                    adaptations.assistance.stepByStepGuidance = value;
                    break;
                case 'visualInstructions':
                    adaptations.assistance.visualInstructions = value;
                    break;
                case 'repetition':
                    adaptations.tasks.repetition = value;
                    break;
                case 'simplifiedInterface':
                    adaptations.interface.simplified = value;
                    break;
                case 'sessionLength':
                    adaptations.environment.sessionLength = value;
                    break;
                case 'frequentBreaks':
                    adaptations.environment.frequentBreaks = value;
                    break;
                case 'progressIndicators':
                    adaptations.interface.progressIndicators = value;
                    break;
                case 'motivationRewards':
                    adaptations.assistance.motivationRewards = value;
                    break;
                case 'distractionReduction':
                    adaptations.environment.distractionReduction = value;
                    break;
                case 'memoryAids':
                    adaptations.assistance.memoryAids = value;
                    break;
                case 'visualReminders':
                    adaptations.interface.visualReminders = value;
                    break;
                case 'simplifiedInstructions':
                    adaptations.assistance.simplifiedInstructions = value;
                    break;
                case 'contextualHelp':
                    adaptations.assistance.contextualHelp = value;
                    break;
                case 'timeLimitExtension':
                    adaptations.tasks.timeLimitExtension = value;
                    break;
                case 'slowPace':
                    adaptations.tasks.slowPace = value;
                    break;
                case 'simplifiedChoices':
                    adaptations.tasks.simplifiedChoices = value;
                    break;
                case 'clearInstructions':
                    adaptations.assistance.clearInstructions = value;
                    break;
                case 'patienceMode':
                    adaptations.tasks.patienceMode = value;
                    break;
            }
        });
    }
    
    applyPerformanceAdaptations(adaptations, performance) {
        // Adjust difficulty based on success rate
        if (performance.successRate < 0.5) {
            adaptations.tasks.difficulty = 'easy';
            adaptations.assistance.level = 'extensive';
        } else if (performance.successRate > 0.9) {
            adaptations.tasks.difficulty = 'hard';
            adaptations.assistance.level = 'minimal';
        }
        
        // Adjust time limits based on completion time
        if (performance.completionTime > 300000) { // 5 minutes
            adaptations.tasks.timeLimit = 'extended';
        }
        
        // Adjust error tolerance based on error rate
        if (performance.errorRate > 0.3) {
            adaptations.interface.errorTolerance = 'high';
            adaptations.assistance.errorRecovery = true;
        }
    }
    
    applyLearningProfileAdaptations(adaptations, learningProfile) {
        // Visual learners
        if (learningProfile.style === 'visual') {
            adaptations.interface.highlighting = true;
            adaptations.interface.visualCues = true;
            adaptations.assistance.visualInstructions = true;
        }
        
        // Auditory learners
        if (learningProfile.style === 'auditory') {
            adaptations.assistance.audioNarration = true;
            adaptations.assistance.voiceGuidance = true;
            adaptations.assistance.soundCues = true;
        }
        
        // Kinesthetic learners
        if (learningProfile.style === 'kinesthetic') {
            adaptations.tasks.handsOn = true;
            adaptations.interface.interactive = true;
            adaptations.assistance.tactileFeedback = true;
        }
        
        // Pace adaptations
        if (learningProfile.pace === 'slow') {
            adaptations.tasks.slowPace = true;
            adaptations.tasks.timeLimitExtension = true;
        } else if (learningProfile.pace === 'fast') {
            adaptations.tasks.fastPace = true;
            adaptations.tasks.timePressure = true;
        }
        
        // Complexity adaptations
        if (learningProfile.complexity === 'low') {
            adaptations.tasks.complexity = 'low';
            adaptations.interface.simplified = true;
        } else if (learningProfile.complexity === 'high') {
            adaptations.tasks.complexity = 'high';
            adaptations.tasks.multiStep = true;
        }
    }
    
    applyAdaptations(adaptations) {
        // Apply environment adaptations
        this.applyEnvironmentAdaptations(adaptations.environment);
        
        // Apply object adaptations
        this.applyObjectAdaptations(adaptations.objects);
        
        // Apply task adaptations
        this.applyTaskAdaptations(adaptations.tasks);
        
        // Apply interface adaptations
        this.applyInterfaceAdaptations(adaptations.interface);
        
        // Apply assistance adaptations
        this.applyAssistanceAdaptations(adaptations.assistance);
        
        // Emit adaptation applied event
        this.emitEvent('adaptationsApplied', { adaptations });
    }
    
    applyEnvironmentAdaptations(environmentAdaptations) {
        Object.entries(environmentAdaptations).forEach(([key, value]) => {
            this.environmentState[key] = value;
            
            // Apply specific environment changes
            switch (key) {
                case 'navigationSpeed':
                    this.setNavigationSpeed(value);
                    break;
                case 'movementTolerance':
                    this.setMovementTolerance(value);
                    break;
                case 'sessionLength':
                    this.setSessionLength(value);
                    break;
                case 'frequentBreaks':
                    this.setFrequentBreaks(value);
                    break;
                case 'distractionReduction':
                    this.setDistractionReduction(value);
                    break;
            }
        });
    }
    
    applyObjectAdaptations(objectAdaptations) {
        Object.entries(objectAdaptations).forEach(([key, value]) => {
            switch (key) {
                case 'size':
                    this.setObjectSize(value);
                    break;
                case 'glow':
                    this.setObjectGlow(value);
                    break;
            }
        });
    }
    
    applyTaskAdaptations(taskAdaptations) {
        Object.entries(taskAdaptations).forEach(([key, value]) => {
            switch (key) {
                case 'difficulty':
                    this.setTaskDifficulty(value);
                    break;
                case 'complexity':
                    this.setTaskComplexity(value);
                    break;
                case 'precisionRequired':
                    this.setPrecisionRequired(value);
                    break;
                case 'largeMovements':
                    this.setLargeMovements(value);
                    break;
                case 'repetition':
                    this.setRepetition(value);
                    break;
                case 'timeLimitExtension':
                    this.setTimeLimitExtension(value);
                    break;
                case 'slowPace':
                    this.setSlowPace(value);
                    break;
                case 'simplifiedChoices':
                    this.setSimplifiedChoices(value);
                    break;
                case 'patienceMode':
                    this.setPatienceMode(value);
                    break;
            }
        });
    }
    
    applyInterfaceAdaptations(interfaceAdaptations) {
        Object.entries(interfaceAdaptations).forEach(([key, value]) => {
            switch (key) {
                case 'clickTolerance':
                    this.setClickTolerance(value);
                    break;
                case 'dragSensitivity':
                    this.setDragSensitivity(value);
                    break;
                case 'contrast':
                    this.setContrast(value);
                    break;
                case 'highlighting':
                    this.setHighlighting(value);
                    break;
                case 'visualCues':
                    this.setVisualCues(value);
                    break;
                case 'colorCoding':
                    this.setColorCoding(value);
                    break;
                case 'textSize':
                    this.setTextSize(value);
                    break;
                case 'simplifiedNavigation':
                    this.setSimplifiedNavigation(value);
                    break;
                case 'simplified':
                    this.setSimplifiedInterface(value);
                    break;
                case 'progressIndicators':
                    this.setProgressIndicators(value);
                    break;
                case 'visualReminders':
                    this.setVisualReminders(value);
                    break;
            }
        });
    }
    
    applyAssistanceAdaptations(assistanceAdaptations) {
        Object.entries(assistanceAdaptations).forEach(([key, value]) => {
            switch (key) {
                case 'level':
                    this.setAssistanceLevel(value);
                    break;
                case 'audioNarration':
                    this.setAudioNarration(value);
                    break;
                case 'soundCues':
                    this.setSoundCues(value);
                    break;
                case 'voiceGuidance':
                    this.setVoiceGuidance(value);
                    break;
                case 'audioFeedback':
                    this.setAudioFeedback(value);
                    break;
                case 'speechRate':
                    this.setSpeechRate(value);
                    break;
                case 'stepByStepGuidance':
                    this.setStepByStepGuidance(value);
                    break;
                case 'visualInstructions':
                    this.setVisualInstructions(value);
                    break;
                case 'motivationRewards':
                    this.setMotivationRewards(value);
                    break;
                case 'memoryAids':
                    this.setMemoryAids(value);
                    break;
                case 'simplifiedInstructions':
                    this.setSimplifiedInstructions(value);
                    break;
                case 'contextualHelp':
                    this.setContextualHelp(value);
                    break;
                case 'clearInstructions':
                    this.setClearInstructions(value);
                    break;
            }
        });
    }
    
    // Specific adaptation methods
    setNavigationSpeed(speed) {
        // Apply navigation speed changes
        document.dispatchEvent(new CustomEvent('navigationSpeedChanged', { detail: { speed } }));
    }
    
    setMovementTolerance(tolerance) {
        // Apply movement tolerance changes
        document.dispatchEvent(new CustomEvent('movementToleranceChanged', { detail: { tolerance } }));
    }
    
    setObjectSize(size) {
        // Apply object size changes
        document.dispatchEvent(new CustomEvent('objectSizeChanged', { detail: { size } }));
    }
    
    setObjectGlow(glow) {
        // Apply object glow changes
        document.dispatchEvent(new CustomEvent('objectGlowChanged', { detail: { glow } }));
    }
    
    setTaskDifficulty(difficulty) {
        // Apply task difficulty changes
        document.dispatchEvent(new CustomEvent('taskDifficultyChanged', { detail: { difficulty } }));
    }
    
    setClickTolerance(tolerance) {
        // Apply click tolerance changes
        document.dispatchEvent(new CustomEvent('clickToleranceChanged', { detail: { tolerance } }));
    }
    
    setHighlighting(highlighting) {
        // Apply highlighting changes
        document.dispatchEvent(new CustomEvent('highlightingChanged', { detail: { highlighting } }));
    }
    
    setAudioNarration(narration) {
        // Apply audio narration changes
        document.dispatchEvent(new CustomEvent('audioNarrationChanged', { detail: { narration } }));
    }
    
    // Recommendation system
    recommendScenarios(weakSkills) {
        const recommendations = [];
        
        weakSkills.forEach(skill => {
            switch (skill.ability) {
                case 'fineMotor':
                    recommendations.push({
                        scenario: 'grocery',
                        difficulty: 'easy',
                        reason: 'Fine motor practice with precise object manipulation',
                        exercises: ['item_selection', 'precise_placement', 'detailed_interaction']
                    });
                    break;
                case 'grossMotor':
                    recommendations.push({
                        scenario: 'railway',
                        difficulty: 'medium',
                        reason: 'Gross motor practice with large movements and navigation',
                        exercises: ['navigation', 'large_movements', 'spatial_awareness']
                    });
                    break;
                case 'visual':
                    recommendations.push({
                        scenario: 'hospital',
                        difficulty: 'easy',
                        reason: 'Visual processing practice with complex environments',
                        exercises: ['visual_search', 'pattern_recognition', 'detail_observation']
                    });
                    break;
                case 'cognitive':
                    recommendations.push({
                        scenario: 'grocery',
                        difficulty: 'hard',
                        reason: 'Cognitive challenge with decision-making and problem-solving',
                        exercises: ['decision_making', 'problem_solving', 'logical_reasoning']
                    });
                    break;
            }
        });
        
        return recommendations;
    }
    
    // Performance analysis
    analyzePerformance(taskData) {
        const performance = this.calculatePerformance(taskData);
        const trends = this.analyzeTrends();
        
        return {
            current: performance,
            trends: trends,
            recommendations: this.generatePerformanceRecommendations(performance, trends)
        };
    }
    
    analyzeTrends() {
        const recentAdaptations = this.adaptationHistory.slice(-10);
        
        return {
            successRateTrend: this.calculateTrend(recentAdaptations, 'successRate'),
            completionTimeTrend: this.calculateTrend(recentAdaptations, 'completionTime'),
            errorRateTrend: this.calculateTrend(recentAdaptations, 'errorRate'),
            adaptationEffectiveness: this.calculateAdaptationEffectiveness()
        };
    }
    
    calculateTrend(data, metric) {
        if (data.length < 2) return 'stable';
        
        const values = data.map(d => d.performance[metric]).filter(v => v !== undefined);
        if (values.length < 2) return 'stable';
        
        const first = values[0];
        const last = values[values.length - 1];
        const change = (last - first) / first;
        
        if (change > 0.1) return 'improving';
        if (change < -0.1) return 'declining';
        return 'stable';
    }
    
    calculateAdaptationEffectiveness() {
        const recentAdaptations = this.adaptationHistory.slice(-20);
        const effectiveAdaptations = recentAdaptations.filter(a => a.success);
        
        return recentAdaptations.length > 0 ? 
            effectiveAdaptations.length / recentAdaptations.length : 0;
    }
    
    generatePerformanceRecommendations(performance, trends) {
        const recommendations = [];
        
        if (trends.successRateTrend === 'declining') {
            recommendations.push({
                type: 'difficulty',
                action: 'reduce_difficulty',
                reason: 'Success rate is declining',
                priority: 'high'
            });
        }
        
        if (trends.completionTimeTrend === 'declining') {
            recommendations.push({
                type: 'time',
                action: 'extend_time_limits',
                reason: 'Completion time is increasing',
                priority: 'medium'
            });
        }
        
        if (trends.adaptationEffectiveness < 0.5) {
            recommendations.push({
                type: 'adaptation',
                action: 'review_adaptations',
                reason: 'Current adaptations are not effective',
                priority: 'high'
            });
        }
        
        return recommendations;
    }
    
    // Record keeping
    recordAdaptation(adaptation) {
        this.adaptationHistory.push(adaptation);
        
        // Keep only last 100 adaptations
        if (this.adaptationHistory.length > 100) {
            this.adaptationHistory = this.adaptationHistory.slice(-100);
        }
        
        // Record in user profile
        this.userProfile.recordAdaptation('ai_adaptation', adaptation);
    }
    
    // Utility methods
    adaptToProfile(profile) {
        const adaptations = this.generateAdaptations(profile, {});
        this.applyAdaptations(adaptations);
    }
    
    getCurrentAdaptations() {
        return {
            environment: this.environmentState,
            history: this.adaptationHistory.slice(-10)
        };
    }
    
    exportAdaptationData() {
        return {
            rules: this.adaptationRules,
            history: this.adaptationHistory,
            environment: this.environmentState,
            exportDate: new Date().toISOString()
        };
    }
    
    emitEvent(eventName, detail) {
        const event = new CustomEvent(eventName, { detail });
        document.dispatchEvent(event);
    }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIAdaptationEngine;
}
