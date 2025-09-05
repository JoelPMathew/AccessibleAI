/**
 * Gamification System
 * Handles points, badges, rewards, and engagement features
 */

class GamificationSystem {
    constructor(metricsSystem) {
        this.metrics = metricsSystem;
        this.points = 0;
        this.level = 1;
        this.badges = [];
        this.achievements = [];
        this.streaks = {
            daily: 0,
            weekly: 0,
            monthly: 0
        };
        this.rewards = [];
        this.leaderboard = [];
        
        // Badge definitions
        this.badgeDefinitions = {
            // Task completion badges
            'first_completion': {
                name: 'First Steps',
                description: 'Complete your first task',
                icon: '🌟',
                points: 100,
                rarity: 'common'
            },
            'perfect_completion': {
                name: 'Flawless',
                description: 'Complete a task without any errors',
                icon: '✨',
                points: 200,
                rarity: 'rare'
            },
            'speed_run': {
                name: 'Speed Demon',
                description: 'Complete a task in record time',
                icon: '⚡',
                points: 150,
                rarity: 'rare'
            },
            'perfect_run': {
                name: 'Perfectionist',
                description: 'Complete a task without errors or retries',
                icon: '💎',
                points: 300,
                rarity: 'epic'
            },
            
            // Session badges
            'marathon_session': {
                name: 'Marathon Runner',
                description: 'Play for more than 30 minutes in one session',
                icon: '🏃',
                points: 250,
                rarity: 'rare'
            },
            'productive_session': {
                name: 'Productive',
                description: 'Complete 5 or more tasks in one session',
                icon: '📈',
                points: 200,
                rarity: 'rare'
            },
            'perfect_session': {
                name: 'Flawless Session',
                description: 'Complete a session without any errors',
                icon: '🎯',
                points: 400,
                rarity: 'epic'
            },
            'explorer': {
                name: 'Explorer',
                description: 'Try 3 or more different scenarios in one session',
                icon: '🗺️',
                points: 300,
                rarity: 'rare'
            },
            
            // Skill badges
            'quick_learner': {
                name: 'Quick Learner',
                description: 'Complete 10 tasks successfully',
                icon: '🧠',
                points: 500,
                rarity: 'epic'
            },
            'persistent': {
                name: 'Persistent',
                description: 'Complete 50 tasks successfully',
                icon: '💪',
                points: 1000,
                rarity: 'legendary'
            },
            'master': {
                name: 'Master',
                description: 'Complete 100 tasks successfully',
                icon: '👑',
                points: 2000,
                rarity: 'legendary'
            },
            
            // Special badges
            'early_bird': {
                name: 'Early Bird',
                description: 'Complete a task before 9 AM',
                icon: '🌅',
                points: 100,
                rarity: 'common'
            },
            'night_owl': {
                name: 'Night Owl',
                description: 'Complete a task after 10 PM',
                icon: '🦉',
                points: 100,
                rarity: 'common'
            },
            'weekend_warrior': {
                name: 'Weekend Warrior',
                description: 'Complete tasks on both weekend days',
                icon: '⚔️',
                points: 200,
                rarity: 'rare'
            },
            'consistency': {
                name: 'Consistency',
                description: 'Complete tasks for 7 consecutive days',
                icon: '📅',
                points: 500,
                rarity: 'epic'
            }
        };
        
        // Achievement definitions
        this.achievementDefinitions = {
            'first_week': {
                name: 'First Week',
                description: 'Complete your first week of practice',
                icon: '📅',
                points: 1000,
                requirements: {
                    daysActive: 7,
                    tasksCompleted: 10
                }
            },
            'monthly_champion': {
                name: 'Monthly Champion',
                description: 'Complete 100 tasks in a month',
                icon: '🏆',
                points: 2000,
                requirements: {
                    tasksCompleted: 100,
                    timeFrame: 'month'
                }
            },
            'skill_master': {
                name: 'Skill Master',
                description: 'Master all difficulty levels',
                icon: '🎓',
                points: 1500,
                requirements: {
                    easyTasks: 10,
                    mediumTasks: 10,
                    hardTasks: 10
                }
            },
            'social_butterfly': {
                name: 'Social Butterfly',
                description: 'Share your progress 5 times',
                icon: '🦋',
                points: 500,
                requirements: {
                    shares: 5
                }
            }
        };
        
        this.init();
    }
    
    init() {
        this.loadGamificationData();
        this.setupEventListeners();
        this.calculateLevel();
        console.log('Gamification system initialized');
    }
    
    setupEventListeners() {
        // Listen for metrics events
        document.addEventListener('rewardsCalculated', (event) => {
            this.processRewards(event.detail);
        });
        
        document.addEventListener('sessionBadgesEarned', (event) => {
            this.processSessionBadges(event.detail);
        });
        
        document.addEventListener('taskMetricsCompleted', (event) => {
            this.checkAchievements(event.detail);
        });
        
        // Listen for daily reset
        this.setupDailyReset();
    }
    
    setupDailyReset() {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        
        const timeUntilReset = tomorrow.getTime() - now.getTime();
        
        setTimeout(() => {
            this.resetDailyStreak();
            this.setupDailyReset(); // Set up next reset
        }, timeUntilReset);
    }
    
    processRewards(rewards) {
        const { points, badges } = rewards;
        
        // Add points
        this.addPoints(points);
        
        // Process badges
        badges.forEach(badgeId => {
            this.awardBadge(badgeId);
        });
        
        // Check for level up
        const newLevel = this.calculateLevel();
        if (newLevel > this.level) {
            this.levelUp(newLevel);
        }
        
        // Update leaderboard
        this.updateLeaderboard();
        
        // Emit rewards processed event
        this.emitEvent('rewardsProcessed', {
            points: points,
            badges: badges,
            totalPoints: this.points,
            level: this.level
        });
    }
    
    processSessionBadges(sessionBadges) {
        const { badges } = sessionBadges;
        
        badges.forEach(badgeId => {
            this.awardBadge(badgeId);
        });
    }
    
    addPoints(points) {
        this.points += points;
        this.saveGamificationData();
        
        // Emit points added event
        this.emitEvent('pointsAdded', {
            points: points,
            totalPoints: this.points
        });
    }
    
    awardBadge(badgeId) {
        if (this.badges.includes(badgeId)) {
            return; // Already have this badge
        }
        
        const badge = this.badgeDefinitions[badgeId];
        if (!badge) {
            console.warn('Unknown badge:', badgeId);
            return;
        }
        
        this.badges.push(badgeId);
        this.addPoints(badge.points);
        
        // Emit badge awarded event
        this.emitEvent('badgeAwarded', {
            badgeId: badgeId,
            badge: badge,
            totalBadges: this.badges.length
        });
        
        // Show badge notification
        this.showBadgeNotification(badge);
        
        console.log('Badge awarded:', badge.name);
    }
    
    showBadgeNotification(badge) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            padding: 30px;
            border-radius: 20px;
            z-index: 10000;
            text-align: center;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            animation: badgePop 0.6s ease-out;
            max-width: 400px;
        `;
        
        notification.innerHTML = `
            <div style="font-size: 48px; margin-bottom: 15px;">${badge.icon}</div>
            <div style="font-size: 24px; font-weight: 600; margin-bottom: 10px;">${badge.name}</div>
            <div style="font-size: 16px; margin-bottom: 15px; opacity: 0.9;">${badge.description}</div>
            <div style="font-size: 18px; font-weight: 600; color: #ffd700;">+${badge.points} points</div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
    
    calculateLevel() {
        const newLevel = Math.floor(this.points / 1000) + 1;
        return newLevel;
    }
    
    levelUp(newLevel) {
        const oldLevel = this.level;
        this.level = newLevel;
        
        // Award level up bonus
        const levelBonus = (newLevel - oldLevel) * 100;
        this.addPoints(levelBonus);
        
        // Emit level up event
        this.emitEvent('levelUp', {
            oldLevel: oldLevel,
            newLevel: newLevel,
            bonus: levelBonus
        });
        
        // Show level up notification
        this.showLevelUpNotification(oldLevel, newLevel, levelBonus);
        
        console.log(`Level up! ${oldLevel} → ${newLevel}`);
    }
    
    showLevelUpNotification(oldLevel, newLevel, bonus) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #f39c12, #e67e22);
            color: white;
            padding: 40px;
            border-radius: 20px;
            z-index: 10000;
            text-align: center;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            animation: levelUpPop 0.8s ease-out;
            max-width: 500px;
        `;
        
        notification.innerHTML = `
            <div style="font-size: 64px; margin-bottom: 20px;">🎉</div>
            <div style="font-size: 32px; font-weight: 600; margin-bottom: 10px;">Level Up!</div>
            <div style="font-size: 24px; margin-bottom: 15px;">${oldLevel} → ${newLevel}</div>
            <div style="font-size: 18px; font-weight: 600; color: #ffd700;">+${bonus} bonus points</div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 4 seconds
        setTimeout(() => {
            notification.remove();
        }, 4000);
    }
    
    checkAchievements(taskData) {
        const { task, metrics } = taskData;
        
        // Check each achievement
        Object.entries(this.achievementDefinitions).forEach(([achievementId, achievement]) => {
            if (this.achievements.includes(achievementId)) {
                return; // Already have this achievement
            }
            
            if (this.checkAchievementRequirements(achievement, metrics)) {
                this.awardAchievement(achievementId);
            }
        });
    }
    
    checkAchievementRequirements(achievement, metrics) {
        const { requirements } = achievement;
        
        // Check days active
        if (requirements.daysActive) {
            const daysActive = this.calculateDaysActive();
            if (daysActive < requirements.daysActive) {
                return false;
            }
        }
        
        // Check tasks completed
        if (requirements.tasksCompleted) {
            if (metrics.tasksCompleted < requirements.tasksCompleted) {
                return false;
            }
        }
        
        // Check time frame
        if (requirements.timeFrame === 'month') {
            const monthlyTasks = this.calculateMonthlyTasks();
            if (monthlyTasks < requirements.tasksCompleted) {
                return false;
            }
        }
        
        // Check difficulty levels
        if (requirements.easyTasks || requirements.mediumTasks || requirements.hardTasks) {
            const difficultyCounts = this.calculateDifficultyCounts();
            if (requirements.easyTasks && difficultyCounts.easy < requirements.easyTasks) {
                return false;
            }
            if (requirements.mediumTasks && difficultyCounts.medium < requirements.mediumTasks) {
                return false;
            }
            if (requirements.hardTasks && difficultyCounts.hard < requirements.hardTasks) {
                return false;
            }
        }
        
        // Check shares
        if (requirements.shares) {
            const shares = this.getShareCount();
            if (shares < requirements.shares) {
                return false;
            }
        }
        
        return true;
    }
    
    awardAchievement(achievementId) {
        if (this.achievements.includes(achievementId)) {
            return;
        }
        
        const achievement = this.achievementDefinitions[achievementId];
        if (!achievement) {
            console.warn('Unknown achievement:', achievementId);
            return;
        }
        
        this.achievements.push(achievementId);
        this.addPoints(achievement.points);
        
        // Emit achievement awarded event
        this.emitEvent('achievementAwarded', {
            achievementId: achievementId,
            achievement: achievement,
            totalAchievements: this.achievements.length
        });
        
        // Show achievement notification
        this.showAchievementNotification(achievement);
        
        console.log('Achievement awarded:', achievement.name);
    }
    
    showAchievementNotification(achievement) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #9b59b6, #8e44ad);
            color: white;
            padding: 40px;
            border-radius: 20px;
            z-index: 10000;
            text-align: center;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            animation: achievementPop 0.8s ease-out;
            max-width: 500px;
        `;
        
        notification.innerHTML = `
            <div style="font-size: 64px; margin-bottom: 20px;">🏆</div>
            <div style="font-size: 28px; font-weight: 600; margin-bottom: 10px;">Achievement Unlocked!</div>
            <div style="font-size: 24px; margin-bottom: 15px;">${achievement.name}</div>
            <div style="font-size: 16px; margin-bottom: 15px; opacity: 0.9;">${achievement.description}</div>
            <div style="font-size: 18px; font-weight: 600; color: #ffd700;">+${achievement.points} points</div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
    
    calculateDaysActive() {
        const sessions = this.metrics.metrics.sessions;
        const uniqueDays = new Set();
        
        sessions.forEach(session => {
            const date = new Date(session.startTime);
            const dayKey = date.toDateString();
            uniqueDays.add(dayKey);
        });
        
        return uniqueDays.size;
    }
    
    calculateMonthlyTasks() {
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        
        return this.metrics.metrics.sessions
            .filter(session => session.startTime >= monthStart.getTime())
            .reduce((sum, session) => sum + session.tasksCompleted, 0);
    }
    
    calculateDifficultyCounts() {
        const counts = { easy: 0, medium: 0, hard: 0 };
        
        this.metrics.metrics.sessions.forEach(session => {
            session.tasks.forEach(task => {
                if (task.success && task.difficulty) {
                    counts[task.difficulty]++;
                }
            });
        });
        
        return counts;
    }
    
    getShareCount() {
        return parseInt(localStorage.getItem('shareCount') || '0');
    }
    
    incrementShareCount() {
        const current = this.getShareCount();
        localStorage.setItem('shareCount', (current + 1).toString());
    }
    
    resetDailyStreak() {
        this.streaks.daily = 0;
        this.saveGamificationData();
    }
    
    updateStreaks() {
        const now = new Date();
        const today = now.toDateString();
        const lastActive = localStorage.getItem('lastActiveDate');
        
        if (lastActive !== today) {
            // New day
            if (lastActive && this.isConsecutiveDay(lastActive, today)) {
                this.streaks.daily++;
            } else {
                this.streaks.daily = 1;
            }
            
            localStorage.setItem('lastActiveDate', today);
            this.saveGamificationData();
        }
    }
    
    isConsecutiveDay(lastDate, currentDate) {
        const last = new Date(lastDate);
        const current = new Date(currentDate);
        const diffTime = current - last;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays === 1;
    }
    
    updateLeaderboard() {
        // This would typically sync with a server
        // For now, we'll maintain a local leaderboard
        const playerData = {
            id: this.getPlayerId(),
            name: this.getPlayerName(),
            points: this.points,
            level: this.level,
            badges: this.badges.length,
            lastActive: Date.now()
        };
        
        // Update local leaderboard
        const existingIndex = this.leaderboard.findIndex(p => p.id === playerData.id);
        if (existingIndex >= 0) {
            this.leaderboard[existingIndex] = playerData;
        } else {
            this.leaderboard.push(playerData);
        }
        
        // Sort by points
        this.leaderboard.sort((a, b) => b.points - a.points);
        
        // Keep only top 100
        this.leaderboard = this.leaderboard.slice(0, 100);
        
        this.saveGamificationData();
    }
    
    getPlayerId() {
        let playerId = localStorage.getItem('playerId');
        if (!playerId) {
            playerId = 'player_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('playerId', playerId);
        }
        return playerId;
    }
    
    getPlayerName() {
        return localStorage.getItem('playerName') || 'Anonymous Player';
    }
    
    setPlayerName(name) {
        localStorage.setItem('playerName', name);
    }
    
    getGamificationData() {
        return {
            points: this.points,
            level: this.level,
            badges: this.badges,
            achievements: this.achievements,
            streaks: this.streaks,
            leaderboard: this.leaderboard
        };
    }
    
    saveGamificationData() {
        try {
            const data = this.getGamificationData();
            localStorage.setItem('gamificationData', JSON.stringify(data));
        } catch (error) {
            console.error('Failed to save gamification data:', error);
        }
    }
    
    loadGamificationData() {
        try {
            const saved = localStorage.getItem('gamificationData');
            if (saved) {
                const data = JSON.parse(saved);
                this.points = data.points || 0;
                this.level = data.level || 1;
                this.badges = data.badges || [];
                this.achievements = data.achievements || [];
                this.streaks = data.streaks || { daily: 0, weekly: 0, monthly: 0 };
                this.leaderboard = data.leaderboard || [];
            }
        } catch (error) {
            console.error('Failed to load gamification data:', error);
        }
    }
    
    emitEvent(eventName, detail) {
        const event = new CustomEvent(eventName, { detail });
        document.dispatchEvent(event);
    }
    
    // Public API methods
    getStats() {
        return {
            points: this.points,
            level: this.level,
            badges: this.badges.length,
            achievements: this.achievements.length,
            streaks: this.streaks,
            leaderboard: this.leaderboard.slice(0, 10)
        };
    }
    
    getBadgeInfo(badgeId) {
        return this.badgeDefinitions[badgeId];
    }
    
    getAchievementInfo(achievementId) {
        return this.achievementDefinitions[achievementId];
    }
    
    shareProgress() {
        this.incrementShareCount();
        this.emitEvent('progressShared', {
            points: this.points,
            level: this.level,
            badges: this.badges.length
        });
    }
    
    resetProgress() {
        this.points = 0;
        this.level = 1;
        this.badges = [];
        this.achievements = [];
        this.streaks = { daily: 0, weekly: 0, monthly: 0 };
        this.leaderboard = [];
        this.saveGamificationData();
        
        console.log('Gamification progress reset');
    }
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes badgePop {
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
    
    @keyframes levelUpPop {
        0% {
            transform: translate(-50%, -50%) scale(0.3);
            opacity: 0;
        }
        50% {
            transform: translate(-50%, -50%) scale(1.2);
            opacity: 1;
        }
        100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
        }
    }
    
    @keyframes achievementPop {
        0% {
            transform: translate(-50%, -50%) scale(0.2);
            opacity: 0;
        }
        50% {
            transform: translate(-50%, -50%) scale(1.3);
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
    module.exports = GamificationSystem;
}
