/**
 * Adaptive Suggestions System
 * Provides intelligent recommendations for next scenarios and skill-building exercises
 */

class AdaptiveSuggestions {
    constructor(metricsSystem, gamificationSystem) {
        this.metrics = metricsSystem;
        this.gamification = gamificationSystem;
        this.suggestions = [];
        this.userProfile = null;
        this.learningPath = [];
        
        this.init();
    }
    
    init() {
        this.loadUserProfile();
        this.generateSuggestions();
        this.setupEventListeners();
        console.log('Adaptive Suggestions initialized');
    }
    
    setupEventListeners() {
        // Listen for task completion to update suggestions
        document.addEventListener('taskMetricsCompleted', (event) => {
            this.updateSuggestions();
        });
        
        document.addEventListener('badgeAwarded', (event) => {
            this.updateSuggestions();
        });
        
        document.addEventListener('levelUp', (event) => {
            this.updateSuggestions();
        });
    }
    
    loadUserProfile() {
        this.userProfile = {
            skillLevel: this.calculateSkillLevel(),
            preferredDifficulty: this.getPreferredDifficulty(),
            strengths: this.identifyStrengths(),
            weaknesses: this.identifyWeaknesses(),
            interests: this.identifyInterests(),
            learningStyle: this.identifyLearningStyle(),
            timeAvailability: this.getTimeAvailability(),
            goals: this.getUserGoals()
        };
    }
    
    calculateSkillLevel() {
        const metrics = this.metrics.getOverallStats();
        const gamification = this.gamification.getStats();
        
        // Calculate skill level based on various factors
        let skillScore = 0;
        
        // Task completion factor
        skillScore += Math.min(metrics.totalTasksCompleted * 10, 100);
        
        // Success rate factor
        skillScore += metrics.successRate * 0.5;
        
        // Level factor
        skillScore += gamification.level * 20;
        
        // Badge factor
        skillScore += gamification.badges * 5;
        
        // Time efficiency factor
        if (metrics.averageTaskTime > 0) {
            const efficiencyScore = Math.max(0, 100 - (metrics.averageTaskTime / 60000)); // 100 - minutes
            skillScore += efficiencyScore * 0.3;
        }
        
        // Determine skill level
        if (skillScore < 200) return 'beginner';
        if (skillScore < 400) return 'intermediate';
        if (skillScore < 600) return 'advanced';
        return 'expert';
    }
    
    getPreferredDifficulty() {
        const sessions = this.metrics.metrics.sessions;
        const difficultyCounts = { easy: 0, medium: 0, hard: 0 };
        
        sessions.forEach(session => {
            session.tasks.forEach(task => {
                if (task.difficulty) {
                    difficultyCounts[task.difficulty]++;
                }
            });
        });
        
        const total = Object.values(difficultyCounts).reduce((sum, count) => sum + count, 0);
        if (total === 0) return 'medium';
        
        const easyRatio = difficultyCounts.easy / total;
        const hardRatio = difficultyCounts.hard / total;
        
        if (easyRatio > 0.6) return 'easy';
        if (hardRatio > 0.4) return 'hard';
        return 'medium';
    }
    
    identifyStrengths() {
        const strengths = [];
        const metrics = this.metrics.getOverallStats();
        
        // High success rate
        if (metrics.successRate > 80) {
            strengths.push('accuracy');
        }
        
        // Fast completion
        if (metrics.averageTaskTime < 180000) { // 3 minutes
            strengths.push('speed');
        }
        
        // Low error rate
        if (metrics.errorRate < 0.1) {
            strengths.push('precision');
        }
        
        // Consistent performance
        const recentSessions = this.metrics.metrics.sessions.slice(-5);
        const consistent = recentSessions.every(session => session.tasksCompleted > 0);
        if (consistent) {
            strengths.push('consistency');
        }
        
        // Multiple scenarios
        const uniqueScenarios = new Set();
        this.metrics.metrics.sessions.forEach(session => {
            session.scenarios.forEach(scenario => uniqueScenarios.add(scenario));
        });
        if (uniqueScenarios.size >= 3) {
            strengths.push('versatility');
        }
        
        return strengths;
    }
    
    identifyWeaknesses() {
        const weaknesses = [];
        const metrics = this.metrics.getOverallStats();
        
        // High error rate
        if (metrics.errorRate > 0.3) {
            weaknesses.push('accuracy');
        }
        
        // Slow completion
        if (metrics.averageTaskTime > 600000) { // 10 minutes
            weaknesses.push('speed');
        }
        
        // High retry rate
        if (metrics.retryRate > 0.2) {
            weaknesses.push('efficiency');
        }
        
        // Inconsistent performance
        const recentSessions = this.metrics.metrics.sessions.slice(-5);
        const inconsistent = recentSessions.some(session => session.tasksCompleted === 0);
        if (inconsistent) {
            weaknesses.push('consistency');
        }
        
        // Limited scenario exploration
        const uniqueScenarios = new Set();
        this.metrics.metrics.sessions.forEach(session => {
            session.scenarios.forEach(scenario => uniqueScenarios.add(scenario));
        });
        if (uniqueScenarios.size < 2) {
            weaknesses.push('exploration');
        }
        
        return weaknesses;
    }
    
    identifyInterests() {
        const interests = [];
        const sessions = this.metrics.metrics.sessions;
        
        // Count scenario preferences
        const scenarioCounts = {};
        sessions.forEach(session => {
            session.scenarios.forEach(scenario => {
                scenarioCounts[scenario] = (scenarioCounts[scenario] || 0) + 1;
            });
        });
        
        // Identify most played scenarios
        const sortedScenarios = Object.entries(scenarioCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 2);
        
        sortedScenarios.forEach(([scenario, count]) => {
            if (count > 1) {
                interests.push(scenario);
            }
        });
        
        return interests;
    }
    
    identifyLearningStyle() {
        const sessions = this.metrics.metrics.sessions;
        const metrics = this.metrics.getOverallStats();
        
        // Analyze learning patterns
        const patterns = {
            visual: 0,
            auditory: 0,
            kinesthetic: 0,
            analytical: 0
        };
        
        // Visual learners prefer guidance and highlighting
        if (this.hasFeature('highlighting')) {
            patterns.visual += 1;
        }
        
        // Auditory learners prefer narration
        if (this.hasFeature('narration')) {
            patterns.auditory += 1;
        }
        
        // Kinesthetic learners prefer hands-on interaction
        if (metrics.totalInteractions > metrics.totalTasksCompleted * 10) {
            patterns.kinesthetic += 1;
        }
        
        // Analytical learners prefer detailed instructions
        if (this.hasFeature('textInstructions')) {
            patterns.analytical += 1;
        }
        
        // Return dominant learning style
        const dominantStyle = Object.entries(patterns)
            .sort(([,a], [,b]) => b - a)[0][0];
        
        return dominantStyle;
    }
    
    hasFeature(feature) {
        // Check if user has enabled specific features
        const preferences = localStorage.getItem('guidancePreferences');
        if (preferences) {
            try {
                const prefs = JSON.parse(preferences);
                return prefs[feature] || false;
            } catch (error) {
                return false;
            }
        }
        return false;
    }
    
    getTimeAvailability() {
        const sessions = this.metrics.metrics.sessions;
        if (sessions.length === 0) return 'unknown';
        
        // Analyze session times
        const sessionTimes = sessions.map(session => {
            const date = new Date(session.startTime);
            return date.getHours();
        });
        
        const morningSessions = sessionTimes.filter(hour => hour >= 6 && hour < 12).length;
        const afternoonSessions = sessionTimes.filter(hour => hour >= 12 && hour < 18).length;
        const eveningSessions = sessionTimes.filter(hour => hour >= 18 && hour < 24).length;
        
        if (morningSessions > afternoonSessions && morningSessions > eveningSessions) {
            return 'morning';
        } else if (afternoonSessions > eveningSessions) {
            return 'afternoon';
        } else {
            return 'evening';
        }
    }
    
    getUserGoals() {
        // Infer goals from behavior patterns
        const goals = [];
        const metrics = this.metrics.getOverallStats();
        
        // Skill improvement goal
        if (metrics.totalTasksCompleted > 10) {
            goals.push('skill_improvement');
        }
        
        // Mastery goal
        if (this.gamification.level > 5) {
            goals.push('mastery');
        }
        
        // Exploration goal
        const uniqueScenarios = new Set();
        this.metrics.metrics.sessions.forEach(session => {
            session.scenarios.forEach(scenario => uniqueScenarios.add(scenario));
        });
        if (uniqueScenarios.size >= 2) {
            goals.push('exploration');
        }
        
        // Consistency goal
        const recentSessions = this.metrics.metrics.sessions.slice(-7);
        const activeDays = new Set();
        recentSessions.forEach(session => {
            const date = new Date(session.startTime).toDateString();
            activeDays.add(date);
        });
        if (activeDays.size >= 5) {
            goals.push('consistency');
        }
        
        return goals;
    }
    
    generateSuggestions() {
        this.suggestions = [];
        
        // Generate scenario suggestions
        this.generateScenarioSuggestions();
        
        // Generate skill-building suggestions
        this.generateSkillBuildingSuggestions();
        
        // Generate engagement suggestions
        this.generateEngagementSuggestions();
        
        // Generate learning path suggestions
        this.generateLearningPathSuggestions();
        
        // Sort suggestions by priority
        this.suggestions.sort((a, b) => b.priority - a.priority);
    }
    
    generateScenarioSuggestions() {
        const { skillLevel, weaknesses, interests } = this.userProfile;
        
        // Suggest scenarios based on skill level
        if (skillLevel === 'beginner') {
            this.addSuggestion({
                type: 'scenario',
                title: 'Start with Grocery Store',
                description: 'The grocery store scenario is perfect for beginners with its simple navigation and clear objectives.',
                priority: 90,
                scenario: 'grocery',
                difficulty: 'easy',
                reason: 'beginner_friendly'
            });
        }
        
        // Suggest scenarios based on weaknesses
        if (weaknesses.includes('exploration')) {
            this.addSuggestion({
                type: 'scenario',
                title: 'Try Hospital Environment',
                description: 'Explore the hospital scenario to develop your navigation skills in a more complex environment.',
                priority: 80,
                scenario: 'hospital',
                difficulty: 'medium',
                reason: 'exploration_skill'
            });
        }
        
        if (weaknesses.includes('speed')) {
            this.addSuggestion({
                type: 'scenario',
                title: 'Practice Railway Station',
                description: 'The railway station scenario will help you improve your speed and efficiency.',
                priority: 85,
                scenario: 'railway',
                difficulty: 'easy',
                reason: 'speed_improvement'
            });
        }
        
        // Suggest scenarios based on interests
        if (interests.includes('grocery')) {
            this.addSuggestion({
                type: 'scenario',
                title: 'Master Grocery Shopping',
                description: 'You seem to enjoy grocery shopping. Try the hard difficulty to challenge yourself.',
                priority: 75,
                scenario: 'grocery',
                difficulty: 'hard',
                reason: 'interest_based'
            });
        }
    }
    
    generateSkillBuildingSuggestions() {
        const { weaknesses, learningStyle } = this.userProfile;
        
        // Accuracy improvement
        if (weaknesses.includes('accuracy')) {
            this.addSuggestion({
                type: 'skill',
                title: 'Focus on Accuracy',
                description: 'Take your time with each interaction. Try using the guidance system to reduce errors.',
                priority: 85,
                skill: 'accuracy',
                exercises: ['slow_practice', 'guidance_enabled', 'error_review'],
                reason: 'accuracy_improvement'
            });
        }
        
        // Speed improvement
        if (weaknesses.includes('speed')) {
            this.addSuggestion({
                type: 'skill',
                title: 'Improve Your Speed',
                description: 'Practice with easier scenarios first, then gradually increase difficulty.',
                priority: 80,
                skill: 'speed',
                exercises: ['timed_practice', 'easy_scenarios', 'gradual_progression'],
                reason: 'speed_improvement'
            });
        }
        
        // Learning style adaptation
        if (learningStyle === 'visual') {
            this.addSuggestion({
                type: 'skill',
                title: 'Enable Visual Guidance',
                description: 'Turn on object highlighting and visual cues to match your learning style.',
                priority: 70,
                skill: 'visual_learning',
                exercises: ['highlighting', 'visual_cues', 'color_coding'],
                reason: 'learning_style'
            });
        }
    }
    
    generateEngagementSuggestions() {
        const gamification = this.gamification.getStats();
        const metrics = this.metrics.getOverallStats();
        
        // Badge collection
        if (gamification.badges < 5) {
            this.addSuggestion({
                type: 'engagement',
                title: 'Collect More Badges',
                description: 'Complete tasks without errors to earn the "Flawless" badge.',
                priority: 75,
                target: 'badges',
                goal: 5,
                reason: 'badge_collection'
            });
        }
        
        // Level progression
        if (gamification.level < 3) {
            this.addSuggestion({
                type: 'engagement',
                title: 'Reach Level 3',
                description: 'Complete more tasks to level up and unlock new features.',
                priority: 80,
                target: 'level',
                goal: 3,
                reason: 'level_progression'
            });
        }
        
        // Streak building
        if (metrics.totalSessions < 7) {
            this.addSuggestion({
                type: 'engagement',
                title: 'Build a 7-Day Streak',
                description: 'Practice every day for a week to build consistency and earn bonus points.',
                priority: 85,
                target: 'streak',
                goal: 7,
                reason: 'consistency_building'
            });
        }
    }
    
    generateLearningPathSuggestions() {
        const { skillLevel, goals } = this.userProfile;
        
        // Create personalized learning path
        const learningPath = [];
        
        if (skillLevel === 'beginner') {
            learningPath.push(
                { step: 1, scenario: 'grocery', difficulty: 'easy', description: 'Learn basic navigation' },
                { step: 2, scenario: 'railway', difficulty: 'easy', description: 'Practice with time pressure' },
                { step: 3, scenario: 'grocery', difficulty: 'medium', description: 'Increase complexity' },
                { step: 4, scenario: 'hospital', difficulty: 'medium', description: 'Master complex environments' }
            );
        } else if (skillLevel === 'intermediate') {
            learningPath.push(
                { step: 1, scenario: 'hospital', difficulty: 'medium', description: 'Refine complex navigation' },
                { step: 2, scenario: 'grocery', difficulty: 'hard', description: 'Master speed and accuracy' },
                { step: 3, scenario: 'railway', difficulty: 'hard', description: 'Perfect time management' },
                { step: 4, scenario: 'hospital', difficulty: 'hard', description: 'Achieve expert level' }
            );
        }
        
        this.learningPath = learningPath;
        
        // Add learning path suggestions
        learningPath.forEach((step, index) => {
            if (index === 0 || this.isStepCompleted(step)) {
                this.addSuggestion({
                    type: 'learning_path',
                    title: `Step ${step.step}: ${step.description}`,
                    description: `Complete ${step.scenario} scenario on ${step.difficulty} difficulty.`,
                    priority: 90 - (index * 10),
                    scenario: step.scenario,
                    difficulty: step.difficulty,
                    step: step.step,
                    reason: 'learning_path'
                });
            }
        });
    }
    
    isStepCompleted(step) {
        // Check if user has completed this step
        const sessions = this.metrics.metrics.sessions;
        return sessions.some(session => 
            session.scenarios.includes(step.scenario) && 
            session.tasks.some(task => task.difficulty === step.difficulty && task.success)
        );
    }
    
    addSuggestion(suggestion) {
        // Add unique ID and timestamp
        suggestion.id = this.generateSuggestionId();
        suggestion.timestamp = Date.now();
        suggestion.accepted = false;
        suggestion.dismissed = false;
        
        this.suggestions.push(suggestion);
    }
    
    generateSuggestionId() {
        return 'suggestion_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    getSuggestions(limit = 5) {
        return this.suggestions
            .filter(s => !s.dismissed)
            .slice(0, limit);
    }
    
    getNextScenario() {
        const scenarioSuggestions = this.suggestions
            .filter(s => s.type === 'scenario' && !s.dismissed)
            .sort((a, b) => b.priority - a.priority);
        
        return scenarioSuggestions[0] || null;
    }
    
    getSkillBuildingExercises() {
        const skillSuggestions = this.suggestions
            .filter(s => s.type === 'skill' && !s.dismissed)
            .sort((a, b) => b.priority - a.priority);
        
        return skillSuggestions;
    }
    
    getLearningPath() {
        return this.learningPath;
    }
    
    acceptSuggestion(suggestionId) {
        const suggestion = this.suggestions.find(s => s.id === suggestionId);
        if (suggestion) {
            suggestion.accepted = true;
            suggestion.acceptedAt = Date.now();
            
            // Emit suggestion accepted event
            this.emitEvent('suggestionAccepted', { suggestion });
            
            // Update suggestions based on acceptance
            this.updateSuggestions();
        }
    }
    
    dismissSuggestion(suggestionId) {
        const suggestion = this.suggestions.find(s => s.id === suggestionId);
        if (suggestion) {
            suggestion.dismissed = true;
            suggestion.dismissedAt = Date.now();
            
            // Emit suggestion dismissed event
            this.emitEvent('suggestionDismissed', { suggestion });
        }
    }
    
    updateSuggestions() {
        this.loadUserProfile();
        this.generateSuggestions();
        
        // Emit suggestions updated event
        this.emitEvent('suggestionsUpdated', { suggestions: this.suggestions });
    }
    
    getPersonalizedRecommendations() {
        const recommendations = {
            nextScenario: this.getNextScenario(),
            skillExercises: this.getSkillBuildingExercises(),
            learningPath: this.getLearningPath(),
            userProfile: this.userProfile,
            suggestions: this.getSuggestions()
        };
        
        return recommendations;
    }
    
    exportSuggestions() {
        return {
            suggestions: this.suggestions,
            userProfile: this.userProfile,
            learningPath: this.learningPath,
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
    module.exports = AdaptiveSuggestions;
}
