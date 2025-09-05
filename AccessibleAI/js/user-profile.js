/**
 * User Profile & Abilities System
 * Stores and manages user mobility and interaction profiles
 */

class UserProfile {
    constructor() {
        this.profile = {
            id: null,
            name: '',
            mobilityType: 'none',
            interactionAbilities: {
                fineMotor: 5,      // 1-10 scale
                grossMotor: 5,     // 1-10 scale
                visual: 5,         // 1-10 scale
                auditory: 5,       // 1-10 scale
                cognitive: 5,       // 1-10 scale
                attention: 5,       // 1-10 scale
                memory: 5,          // 1-10 scale
                processing: 5       // 1-10 scale
            },
            physicalLimitations: {
                reach: { min: 0, max: 100 },      // Reach range in cm
                grip: { strength: 5, precision: 5 }, // 1-10 scale
                movement: { speed: 5, accuracy: 5 }, // 1-10 scale
                endurance: 5,                      // 1-10 scale
                balance: 5                         // 1-10 scale
            },
            sensoryPreferences: {
                visual: {
                    contrast: 'normal',           // low, normal, high
                    brightness: 'normal',         // low, normal, high
                    colorScheme: 'default',       // default, high-contrast, colorblind-friendly
                    fontSize: 'normal',           // small, normal, large, extra-large
                    animations: true,             // true/false
                    motionSensitivity: 'normal'   // low, normal, high
                },
                auditory: {
                    volume: 'normal',             // low, normal, high
                    narration: true,              // true/false
                    soundEffects: true,           // true/false
                    voiceGender: 'neutral',       // male, female, neutral
                    speechRate: 'normal'          // slow, normal, fast
                },
                haptic: {
                    enabled: true,                // true/false
                    intensity: 'normal',          // low, normal, high
                    vibration: true,              // true/false
                    temperature: false            // true/false
                }
            },
            learningProfile: {
                style: 'visual',                 // visual, auditory, kinesthetic, mixed
                pace: 'normal',                  // slow, normal, fast
                complexity: 'medium',             // low, medium, high
                guidance: 'moderate',             // minimal, moderate, extensive
                repetition: 'normal',             // low, normal, high
                challenge: 'medium'               // low, medium, high
            },
            medicalInfo: {
                conditions: [],                  // Array of medical conditions
                medications: [],                 // Array of medications
                assistiveDevices: [],            // Array of assistive devices
                restrictions: [],                // Array of activity restrictions
                emergencyContact: null           // Emergency contact info
            },
            preferences: {
                language: 'en',                  // Language code
                timezone: 'UTC',                 // Timezone
                units: 'metric',                 // metric, imperial
                theme: 'default',                // default, dark, high-contrast
                notifications: true,             // true/false
                dataSharing: false               // true/false
            },
            progress: {
                totalSessions: 0,
                totalPlayTime: 0,
                averageSessionTime: 0,
                skillImprovements: {},
                goals: [],
                achievements: [],
                lastUpdated: null
            },
            adaptationHistory: {
                environmentChanges: [],
                difficultyAdjustments: [],
                assistanceModifications: [],
                successRates: {}
            }
        };
        
        this.adaptationEngine = null;
        this.monitoringSystem = null;
        
        this.init();
    }
    
    init() {
        this.loadProfile();
        this.setupEventListeners();
        console.log('User Profile system initialized');
    }
    
    setupEventListeners() {
        // Listen for profile updates
        document.addEventListener('profileUpdated', (event) => {
            this.saveProfile();
        });
        
        // Listen for ability changes
        document.addEventListener('abilityChanged', (event) => {
            this.updateAbilities(event.detail);
        });
        
        // Listen for progress updates
        document.addEventListener('progressUpdated', (event) => {
            this.updateProgress(event.detail);
        });
    }
    
    // Profile Management
    createProfile(profileData) {
        this.profile = {
            ...this.profile,
            ...profileData,
            id: this.generateProfileId(),
            lastUpdated: Date.now()
        };
        
        this.saveProfile();
        this.emitEvent('profileCreated', { profile: this.profile });
        
        return this.profile;
    }
    
    updateProfile(updates) {
        this.profile = {
            ...this.profile,
            ...updates,
            lastUpdated: Date.now()
        };
        
        this.saveProfile();
        this.emitEvent('profileUpdated', { profile: this.profile });
        
        return this.profile;
    }
    
    getProfile() {
        return { ...this.profile };
    }
    
    // Abilities Management
    updateAbilities(abilityUpdates) {
        this.profile.interactionAbilities = {
            ...this.profile.interactionAbilities,
            ...abilityUpdates
        };
        
        this.profile.lastUpdated = Date.now();
        this.saveProfile();
        
        this.emitEvent('abilitiesUpdated', { 
            abilities: this.profile.interactionAbilities 
        });
        
        // Trigger adaptation if adaptation engine is available
        if (this.adaptationEngine) {
            this.adaptationEngine.adaptToProfile(this.profile);
        }
    }
    
    assessAbilities(sessionData) {
        // Analyze session data to assess current abilities
        const assessment = {
            fineMotor: this.assessFineMotor(sessionData),
            grossMotor: this.assessGrossMotor(sessionData),
            visual: this.assessVisual(sessionData),
            auditory: this.assessAuditory(sessionData),
            cognitive: this.assessCognitive(sessionData),
            attention: this.assessAttention(sessionData),
            memory: this.assessMemory(sessionData),
            processing: this.assessProcessing(sessionData)
        };
        
        // Update abilities with weighted average
        Object.keys(assessment).forEach(ability => {
            const current = this.profile.interactionAbilities[ability];
            const assessed = assessment[ability];
            const weight = 0.3; // 30% weight for new assessment
            
            this.profile.interactionAbilities[ability] = 
                Math.round(current * (1 - weight) + assessed * weight);
        });
        
        this.updateAbilities(this.profile.interactionAbilities);
        
        return assessment;
    }
    
    assessFineMotor(sessionData) {
        // Analyze precision of interactions
        const interactions = sessionData.interactions || [];
        const preciseInteractions = interactions.filter(i => 
            i.type === 'click' && i.accuracy > 0.8
        ).length;
        
        const totalInteractions = interactions.length;
        if (totalInteractions === 0) return this.profile.interactionAbilities.fineMotor;
        
        const precision = preciseInteractions / totalInteractions;
        return Math.min(10, Math.max(1, Math.round(precision * 10)));
    }
    
    assessGrossMotor(sessionData) {
        // Analyze movement patterns and reach
        const movements = sessionData.movements || [];
        const successfulMovements = movements.filter(m => m.success).length;
        
        const totalMovements = movements.length;
        if (totalMovements === 0) return this.profile.interactionAbilities.grossMotor;
        
        const successRate = successfulMovements / totalMovements;
        return Math.min(10, Math.max(1, Math.round(successRate * 10)));
    }
    
    assessVisual(sessionData) {
        // Analyze visual task completion
        const visualTasks = sessionData.tasks?.filter(t => 
            t.type === 'visual' || t.requiresVisual
        ) || [];
        
        const completedVisualTasks = visualTasks.filter(t => t.completed).length;
        const totalVisualTasks = visualTasks.length;
        
        if (totalVisualTasks === 0) return this.profile.interactionAbilities.visual;
        
        const completionRate = completedVisualTasks / totalVisualTasks;
        return Math.min(10, Math.max(1, Math.round(completionRate * 10)));
    }
    
    assessAuditory(sessionData) {
        // Analyze auditory task completion and response time
        const auditoryTasks = sessionData.tasks?.filter(t => 
            t.type === 'auditory' || t.requiresAuditory
        ) || [];
        
        const completedAuditoryTasks = auditoryTasks.filter(t => t.completed).length;
        const totalAuditoryTasks = auditoryTasks.length;
        
        if (totalAuditoryTasks === 0) return this.profile.interactionAbilities.auditory;
        
        const completionRate = completedAuditoryTasks / totalAuditoryTasks;
        return Math.min(10, Math.max(1, Math.round(completionRate * 10)));
    }
    
    assessCognitive(sessionData) {
        // Analyze problem-solving and decision-making
        const decisions = sessionData.decisions || [];
        const correctDecisions = decisions.filter(d => d.correct).length;
        
        const totalDecisions = decisions.length;
        if (totalDecisions === 0) return this.profile.interactionAbilities.cognitive;
        
        const accuracy = correctDecisions / totalDecisions;
        return Math.min(10, Math.max(1, Math.round(accuracy * 10)));
    }
    
    assessAttention(sessionData) {
        // Analyze focus and attention span
        const sessionDuration = sessionData.duration || 0;
        const focusedTime = sessionData.focusedTime || 0;
        
        if (sessionDuration === 0) return this.profile.interactionAbilities.attention;
        
        const attentionRatio = focusedTime / sessionDuration;
        return Math.min(10, Math.max(1, Math.round(attentionRatio * 10)));
    }
    
    assessMemory(sessionData) {
        // Analyze memory tasks and recall
        const memoryTasks = sessionData.tasks?.filter(t => 
            t.type === 'memory' || t.requiresMemory
        ) || [];
        
        const completedMemoryTasks = memoryTasks.filter(t => t.completed).length;
        const totalMemoryTasks = memoryTasks.length;
        
        if (totalMemoryTasks === 0) return this.profile.interactionAbilities.memory;
        
        const completionRate = completedMemoryTasks / totalMemoryTasks;
        return Math.min(10, Math.max(1, Math.round(completionRate * 10)));
    }
    
    assessProcessing(sessionData) {
        // Analyze processing speed and reaction time
        const reactions = sessionData.reactions || [];
        const averageReactionTime = reactions.reduce((sum, r) => sum + r.time, 0) / reactions.length;
        
        if (reactions.length === 0) return this.profile.interactionAbilities.processing;
        
        // Convert reaction time to ability score (faster = higher score)
        const maxReactionTime = 5000; // 5 seconds
        const normalizedTime = Math.min(averageReactionTime / maxReactionTime, 1);
        return Math.min(10, Math.max(1, Math.round((1 - normalizedTime) * 10)));
    }
    
    // Physical Limitations
    updatePhysicalLimitations(limitations) {
        this.profile.physicalLimitations = {
            ...this.profile.physicalLimitations,
            ...limitations
        };
        
        this.profile.lastUpdated = Date.now();
        this.saveProfile();
        
        this.emitEvent('physicalLimitationsUpdated', { 
            limitations: this.profile.physicalLimitations 
        });
    }
    
    // Sensory Preferences
    updateSensoryPreferences(preferences) {
        this.profile.sensoryPreferences = {
            ...this.profile.sensoryPreferences,
            ...preferences
        };
        
        this.profile.lastUpdated = Date.now();
        this.saveProfile();
        
        this.emitEvent('sensoryPreferencesUpdated', { 
            preferences: this.profile.sensoryPreferences 
        });
    }
    
    // Learning Profile
    updateLearningProfile(profile) {
        this.profile.learningProfile = {
            ...this.profile.learningProfile,
            ...profile
        };
        
        this.profile.lastUpdated = Date.now();
        this.saveProfile();
        
        this.emitEvent('learningProfileUpdated', { 
            profile: this.profile.learningProfile 
        });
    }
    
    // Medical Information
    updateMedicalInfo(medicalInfo) {
        this.profile.medicalInfo = {
            ...this.profile.medicalInfo,
            ...medicalInfo
        };
        
        this.profile.lastUpdated = Date.now();
        this.saveProfile();
        
        this.emitEvent('medicalInfoUpdated', { 
            medicalInfo: this.profile.medicalInfo 
        });
    }
    
    // Progress Tracking
    updateProgress(progressData) {
        this.profile.progress = {
            ...this.profile.progress,
            ...progressData,
            lastUpdated: Date.now()
        };
        
        this.saveProfile();
        
        this.emitEvent('progressUpdated', { 
            progress: this.profile.progress 
        });
    }
    
    // Adaptation History
    recordAdaptation(adaptationType, details) {
        const adaptation = {
            type: adaptationType,
            details: details,
            timestamp: Date.now(),
            success: details.success || false
        };
        
        this.profile.adaptationHistory[adaptationType].push(adaptation);
        
        // Keep only last 100 adaptations
        if (this.profile.adaptationHistory[adaptationType].length > 100) {
            this.profile.adaptationHistory[adaptationType] = 
                this.profile.adaptationHistory[adaptationType].slice(-100);
        }
        
        this.saveProfile();
        
        this.emitEvent('adaptationRecorded', { adaptation });
    }
    
    // Profile Analysis
    analyzeProfile() {
        const analysis = {
            strengths: this.identifyStrengths(),
            weaknesses: this.identifyWeaknesses(),
            recommendations: this.generateRecommendations(),
            riskFactors: this.identifyRiskFactors(),
            adaptationNeeds: this.identifyAdaptationNeeds()
        };
        
        return analysis;
    }
    
    identifyStrengths() {
        const abilities = this.profile.interactionAbilities;
        const strengths = [];
        
        Object.entries(abilities).forEach(([ability, score]) => {
            if (score >= 7) {
                strengths.push({
                    ability,
                    score,
                    level: score >= 9 ? 'excellent' : score >= 7 ? 'good' : 'average'
                });
            }
        });
        
        return strengths;
    }
    
    identifyWeaknesses() {
        const abilities = this.profile.interactionAbilities;
        const weaknesses = [];
        
        Object.entries(abilities).forEach(([ability, score]) => {
            if (score <= 4) {
                weaknesses.push({
                    ability,
                    score,
                    level: score <= 2 ? 'severe' : score <= 4 ? 'moderate' : 'mild'
                });
            }
        });
        
        return weaknesses;
    }
    
    generateRecommendations() {
        const recommendations = [];
        const weaknesses = this.identifyWeaknesses();
        
        weaknesses.forEach(weakness => {
            switch (weakness.ability) {
                case 'fineMotor':
                    recommendations.push({
                        type: 'exercise',
                        title: 'Fine Motor Skills Training',
                        description: 'Practice precision tasks and hand-eye coordination exercises',
                        priority: 'high',
                        exercises: ['precision_clicking', 'drag_and_drop', 'detailed_manipulation']
                    });
                    break;
                case 'grossMotor':
                    recommendations.push({
                        type: 'exercise',
                        title: 'Gross Motor Skills Training',
                        description: 'Practice large movement patterns and spatial navigation',
                        priority: 'high',
                        exercises: ['navigation', 'large_movements', 'spatial_awareness']
                    });
                    break;
                case 'visual':
                    recommendations.push({
                        type: 'accommodation',
                        title: 'Visual Support',
                        description: 'Increase visual contrast and highlighting',
                        priority: 'medium',
                        accommodations: ['high_contrast', 'highlighting', 'visual_cues']
                    });
                    break;
                case 'auditory':
                    recommendations.push({
                        type: 'accommodation',
                        title: 'Auditory Support',
                        description: 'Enable audio narration and sound cues',
                        priority: 'medium',
                        accommodations: ['narration', 'audio_cues', 'voice_guidance']
                    });
                    break;
                case 'cognitive':
                    recommendations.push({
                        type: 'exercise',
                        title: 'Cognitive Training',
                        description: 'Practice problem-solving and decision-making tasks',
                        priority: 'high',
                        exercises: ['problem_solving', 'decision_making', 'logical_reasoning']
                    });
                    break;
            }
        });
        
        return recommendations;
    }
    
    identifyRiskFactors() {
        const riskFactors = [];
        const abilities = this.profile.interactionAbilities;
        
        // Low attention span
        if (abilities.attention <= 3) {
            riskFactors.push({
                type: 'attention',
                severity: 'high',
                description: 'Very low attention span may affect task completion',
                mitigation: 'Break tasks into smaller chunks, use frequent breaks'
            });
        }
        
        // Poor balance
        if (this.profile.physicalLimitations.balance <= 3) {
            riskFactors.push({
                type: 'balance',
                severity: 'medium',
                description: 'Balance issues may affect VR experience',
                mitigation: 'Ensure seated position, use stability aids'
            });
        }
        
        // Severe fine motor issues
        if (abilities.fineMotor <= 2) {
            riskFactors.push({
                type: 'fine_motor',
                severity: 'high',
                description: 'Severe fine motor limitations may require alternative input methods',
                mitigation: 'Use voice control, switch devices, or simplified interactions'
            });
        }
        
        return riskFactors;
    }
    
    identifyAdaptationNeeds() {
        const needs = [];
        const abilities = this.profile.interactionAbilities;
        const limitations = this.profile.physicalLimitations;
        
        // Visual adaptations
        if (abilities.visual <= 5) {
            needs.push({
                type: 'visual',
                adaptations: ['high_contrast', 'large_text', 'highlighting', 'visual_cues']
            });
        }
        
        // Motor adaptations
        if (abilities.fineMotor <= 4 || abilities.grossMotor <= 4) {
            needs.push({
                type: 'motor',
                adaptations: ['voice_control', 'switch_devices', 'simplified_interactions', 'assistive_devices']
            });
        }
        
        // Cognitive adaptations
        if (abilities.cognitive <= 5) {
            needs.push({
                type: 'cognitive',
                adaptations: ['simplified_tasks', 'step_by_step_guidance', 'repetition', 'visual_instructions']
            });
        }
        
        // Attention adaptations
        if (abilities.attention <= 4) {
            needs.push({
                type: 'attention',
                adaptations: ['short_sessions', 'frequent_breaks', 'progress_indicators', 'motivation_rewards']
            });
        }
        
        return needs;
    }
    
    // Utility Methods
    generateProfileId() {
        return 'profile_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    saveProfile() {
        try {
            localStorage.setItem('userProfile', JSON.stringify(this.profile));
            console.log('User profile saved successfully');
        } catch (error) {
            console.error('Failed to save user profile:', error);
        }
    }
    
    loadProfile() {
        try {
            const saved = localStorage.getItem('userProfile');
            if (saved) {
                this.profile = { ...this.profile, ...JSON.parse(saved) };
                console.log('User profile loaded successfully');
            }
        } catch (error) {
            console.error('Failed to load user profile:', error);
        }
    }
    
    exportProfile() {
        return {
            profile: this.profile,
            analysis: this.analyzeProfile(),
            exportDate: new Date().toISOString()
        };
    }
    
    importProfile(data) {
        try {
            if (data.profile) {
                this.profile = { ...this.profile, ...data.profile };
                this.saveProfile();
                this.emitEvent('profileImported', { profile: this.profile });
                return true;
            }
        } catch (error) {
            console.error('Failed to import user profile:', error);
            return false;
        }
    }
    
    resetProfile() {
        this.profile = {
            ...this.profile,
            id: this.generateProfileId(),
            lastUpdated: Date.now()
        };
        
        this.saveProfile();
        this.emitEvent('profileReset', { profile: this.profile });
    }
    
    emitEvent(eventName, detail) {
        const event = new CustomEvent(eventName, { detail });
        document.dispatchEvent(event);
    }
}

// Create global instance
window.UserProfile = UserProfile;
window.userProfile = new UserProfile();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UserProfile;
}
