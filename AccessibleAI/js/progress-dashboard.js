/**
 * Progress Dashboard & Visualization System
 * Provides comprehensive dashboards showing improvement, completion, and skills gained
 */

class ProgressDashboard {
    constructor(metricsSystem, gamificationSystem) {
        this.metrics = metricsSystem;
        this.gamification = gamificationSystem;
        this.isOpen = false;
        this.dashboard = null;
        this.charts = {};
        this.currentView = 'overview';
        
        this.init();
    }
    
    init() {
        this.createDashboardButton();
        this.setupEventListeners();
        console.log('Progress Dashboard initialized');
    }
    
    createDashboardButton() {
        const button = document.createElement('button');
        button.id = 'progress-dashboard-button';
        button.innerHTML = '📊 Progress Dashboard';
        button.style.cssText = `
            position: fixed;
            top: 20px;
            right: 140px;
            z-index: 1000;
            background: linear-gradient(135deg, #9b59b6, #8e44ad);
            color: white;
            border: none;
            border-radius: 12px;
            padding: 12px 20px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            box-shadow: 0 4px 20px rgba(155, 89, 182, 0.3);
            transition: all 0.3s ease;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;
        
        button.addEventListener('click', () => this.toggleDashboard());
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-2px)';
            button.style.boxShadow = '0 8px 25px rgba(155, 89, 182, 0.4)';
        });
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0)';
            button.style.boxShadow = '0 4px 20px rgba(155, 89, 182, 0.3)';
        });
        
        document.body.appendChild(button);
    }
    
    setupEventListeners() {
        // Listen for metrics updates
        document.addEventListener('taskMetricsCompleted', () => {
            this.updateDashboard();
        });
        
        document.addEventListener('rewardsProcessed', () => {
            this.updateDashboard();
        });
        
        document.addEventListener('badgeAwarded', () => {
            this.updateDashboard();
        });
        
        document.addEventListener('levelUp', () => {
            this.updateDashboard();
        });
    }
    
    toggleDashboard() {
        if (this.isOpen) {
            this.closeDashboard();
        } else {
            this.openDashboard();
        }
    }
    
    openDashboard() {
        this.createDashboard();
        this.isOpen = true;
        
        // Add overlay
        const overlay = document.createElement('div');
        overlay.id = 'dashboard-overlay';
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
        overlay.addEventListener('click', () => this.closeDashboard());
        document.body.appendChild(overlay);
    }
    
    closeDashboard() {
        if (this.dashboard) {
            this.dashboard.remove();
            this.dashboard = null;
        }
        
        const overlay = document.getElementById('dashboard-overlay');
        if (overlay) {
            overlay.remove();
        }
        
        this.isOpen = false;
    }
    
    createDashboard() {
        this.dashboard = document.createElement('div');
        this.dashboard.id = 'progress-dashboard';
        this.dashboard.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 95%;
            max-width: 1200px;
            max-height: 90vh;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            z-index: 1000;
            overflow: hidden;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;
        
        this.dashboard.innerHTML = this.generateDashboardHTML();
        document.body.appendChild(this.dashboard);
        
        this.setupDashboardEventListeners();
        this.initializeCharts();
    }
    
    generateDashboardHTML() {
        const stats = this.gamification.getStats();
        const metrics = this.metrics.getOverallStats();
        
        return `
            <div style="padding: 30px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
                    <h2 style="margin: 0; color: #2c3e50; font-size: 28px;">📊 Progress Dashboard</h2>
                    <button id="close-dashboard" style="
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
                
                <!-- Navigation Tabs -->
                <div style="display: flex; gap: 10px; margin-bottom: 30px; border-bottom: 2px solid #ecf0f1;">
                    <button class="dashboard-tab active" data-view="overview" style="
                        background: none;
                        border: none;
                        padding: 15px 25px;
                        cursor: pointer;
                        font-size: 16px;
                        font-weight: 600;
                        color: #9b59b6;
                        border-bottom: 3px solid #9b59b6;
                    ">Overview</button>
                    <button class="dashboard-tab" data-view="progress" style="
                        background: none;
                        border: none;
                        padding: 15px 25px;
                        cursor: pointer;
                        font-size: 16px;
                        font-weight: 600;
                        color: #6c757d;
                        border-bottom: 3px solid transparent;
                    ">Progress</button>
                    <button class="dashboard-tab" data-view="achievements" style="
                        background: none;
                        border: none;
                        padding: 15px 25px;
                        cursor: pointer;
                        font-size: 16px;
                        font-weight: 600;
                        color: #6c757d;
                        border-bottom: 3px solid transparent;
                    ">Achievements</button>
                    <button class="dashboard-tab" data-view="analytics" style="
                        background: none;
                        border: none;
                        padding: 15px 25px;
                        cursor: pointer;
                        font-size: 16px;
                        font-weight: 600;
                        color: #6c757d;
                        border-bottom: 3px solid transparent;
                    ">Analytics</button>
                </div>
                
                <!-- Overview Tab -->
                <div id="overview-tab" class="dashboard-content">
                    ${this.generateOverviewContent(stats, metrics)}
                </div>
                
                <!-- Progress Tab -->
                <div id="progress-tab" class="dashboard-content" style="display: none;">
                    ${this.generateProgressContent()}
                </div>
                
                <!-- Achievements Tab -->
                <div id="achievements-tab" class="dashboard-content" style="display: none;">
                    ${this.generateAchievementsContent()}
                </div>
                
                <!-- Analytics Tab -->
                <div id="analytics-tab" class="dashboard-content" style="display: none;">
                    ${this.generateAnalyticsContent()}
                </div>
            </div>
        `;
    }
    
    generateOverviewContent(stats, metrics) {
        return `
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 30px;">
                <!-- Points Card -->
                <div style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 25px; border-radius: 15px; text-align: center;">
                    <div style="font-size: 36px; margin-bottom: 10px;">⭐</div>
                    <div style="font-size: 32px; font-weight: 700; margin-bottom: 5px;">${stats.points.toLocaleString()}</div>
                    <div style="font-size: 16px; opacity: 0.9;">Total Points</div>
                </div>
                
                <!-- Level Card -->
                <div style="background: linear-gradient(135deg, #f39c12, #e67e22); color: white; padding: 25px; border-radius: 15px; text-align: center;">
                    <div style="font-size: 36px; margin-bottom: 10px;">🏆</div>
                    <div style="font-size: 32px; font-weight: 700; margin-bottom: 5px;">Level ${stats.level}</div>
                    <div style="font-size: 16px; opacity: 0.9;">Current Level</div>
                </div>
                
                <!-- Badges Card -->
                <div style="background: linear-gradient(135deg, #27ae60, #2ecc71); color: white; padding: 25px; border-radius: 15px; text-align: center;">
                    <div style="font-size: 36px; margin-bottom: 10px;">🏅</div>
                    <div style="font-size: 32px; font-weight: 700; margin-bottom: 5px;">${stats.badges}</div>
                    <div style="font-size: 16px; opacity: 0.9;">Badges Earned</div>
                </div>
                
                <!-- Tasks Card -->
                <div style="background: linear-gradient(135deg, #9b59b6, #8e44ad); color: white; padding: 25px; border-radius: 15px; text-align: center;">
                    <div style="font-size: 36px; margin-bottom: 10px;">✅</div>
                    <div style="font-size: 32px; font-weight: 700; margin-bottom: 5px;">${metrics.totalTasksCompleted}</div>
                    <div style="font-size: 16px; opacity: 0.9;">Tasks Completed</div>
                </div>
            </div>
            
            <!-- Progress Chart -->
            <div style="background: #f8f9fa; padding: 25px; border-radius: 15px; margin-bottom: 30px;">
                <h3 style="color: #2c3e50; margin-bottom: 20px;">Progress Over Time</h3>
                <div id="progress-chart" style="height: 300px; background: white; border-radius: 10px; padding: 20px;">
                    <canvas id="progress-canvas" width="800" height="300"></canvas>
                </div>
            </div>
            
            <!-- Recent Activity -->
            <div style="background: #f8f9fa; padding: 25px; border-radius: 15px;">
                <h3 style="color: #2c3e50; margin-bottom: 20px;">Recent Activity</h3>
                <div id="recent-activity">
                    ${this.generateRecentActivity()}
                </div>
            </div>
        `;
    }
    
    generateProgressContent() {
        const metrics = this.metrics.getOverallStats();
        const taskMetrics = this.getTaskMetrics();
        
        return `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px;">
                <!-- Task Completion Chart -->
                <div style="background: #f8f9fa; padding: 25px; border-radius: 15px;">
                    <h3 style="color: #2c3e50; margin-bottom: 20px;">Task Completion</h3>
                    <div id="task-completion-chart" style="height: 250px;">
                        <canvas id="task-completion-canvas" width="400" height="250"></canvas>
                    </div>
                </div>
                
                <!-- Skill Development Chart -->
                <div style="background: #f8f9fa; padding: 25px; border-radius: 15px;">
                    <h3 style="color: #2c3e50; margin-bottom: 20px;">Skill Development</h3>
                    <div id="skill-development-chart" style="height: 250px;">
                        <canvas id="skill-development-canvas" width="400" height="250"></canvas>
                    </div>
                </div>
            </div>
            
            <!-- Task Performance Table -->
            <div style="background: #f8f9fa; padding: 25px; border-radius: 15px;">
                <h3 style="color: #2c3e50; margin-bottom: 20px;">Task Performance</h3>
                <div style="overflow-x: auto;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="background: #e9ecef;">
                                <th style="padding: 15px; text-align: left; border-bottom: 2px solid #dee2e6;">Task</th>
                                <th style="padding: 15px; text-align: left; border-bottom: 2px solid #dee2e6;">Completions</th>
                                <th style="padding: 15px; text-align: left; border-bottom: 2px solid #dee2e6;">Avg Time</th>
                                <th style="padding: 15px; text-align: left; border-bottom: 2px solid #dee2e6;">Success Rate</th>
                                <th style="padding: 15px; text-align: left; border-bottom: 2px solid #dee2e6;">Points</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.generateTaskPerformanceRows(taskMetrics)}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }
    
    generateAchievementsContent() {
        const badges = this.gamification.badges;
        const achievements = this.gamification.achievements;
        
        return `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px;">
                <!-- Badges Section -->
                <div style="background: #f8f9fa; padding: 25px; border-radius: 15px;">
                    <h3 style="color: #2c3e50; margin-bottom: 20px;">Badges Earned (${badges.length})</h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                        ${badges.map(badgeId => this.generateBadgeCard(badgeId)).join('')}
                    </div>
                </div>
                
                <!-- Achievements Section -->
                <div style="background: #f8f9fa; padding: 25px; border-radius: 15px;">
                    <h3 style="color: #2c3e50; margin-bottom: 20px;">Achievements (${achievements.length})</h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                        ${achievements.map(achievementId => this.generateAchievementCard(achievementId)).join('')}
                    </div>
                </div>
            </div>
            
            <!-- All Available Badges -->
            <div style="background: #f8f9fa; padding: 25px; border-radius: 15px;">
                <h3 style="color: #2c3e50; margin-bottom: 20px;">All Available Badges</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;">
                    ${Object.keys(this.gamification.badgeDefinitions).map(badgeId => 
                        this.generateBadgeCard(badgeId, badges.includes(badgeId))
                    ).join('')}
                </div>
            </div>
        `;
    }
    
    generateAnalyticsContent() {
        const metrics = this.metrics.getOverallStats();
        
        return `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px;">
                <!-- Session Analytics -->
                <div style="background: #f8f9fa; padding: 25px; border-radius: 15px;">
                    <h3 style="color: #2c3e50; margin-bottom: 20px;">Session Analytics</h3>
                    <div style="display: grid; gap: 15px;">
                        <div style="display: flex; justify-content: space-between; padding: 10px; background: white; border-radius: 8px;">
                            <span>Total Sessions</span>
                            <span style="font-weight: 600;">${metrics.totalSessions}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding: 10px; background: white; border-radius: 8px;">
                            <span>Total Play Time</span>
                            <span style="font-weight: 600;">${this.formatDuration(metrics.totalPlayTime)}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding: 10px; background: white; border-radius: 8px;">
                            <span>Average Session</span>
                            <span style="font-weight: 600;">${this.formatDuration(metrics.averageSessionTime)}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding: 10px; background: white; border-radius: 8px;">
                            <span>Success Rate</span>
                            <span style="font-weight: 600;">${metrics.successRate.toFixed(1)}%</span>
                        </div>
                    </div>
                </div>
                
                <!-- Interaction Analytics -->
                <div style="background: #f8f9fa; padding: 25px; border-radius: 15px;">
                    <h3 style="color: #2c3e50; margin-bottom: 20px;">Interaction Analytics</h3>
                    <div style="display: grid; gap: 15px;">
                        <div style="display: flex; justify-content: space-between; padding: 10px; background: white; border-radius: 8px;">
                            <span>Total Interactions</span>
                            <span style="font-weight: 600;">${metrics.totalInteractions}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding: 10px; background: white; border-radius: 8px;">
                            <span>Error Rate</span>
                            <span style="font-weight: 600;">${(metrics.errorRate * 100).toFixed(1)}%</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding: 10px; background: white; border-radius: 8px;">
                            <span>Retry Rate</span>
                            <span style="font-weight: 600;">${(metrics.retryRate * 100).toFixed(1)}%</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding: 10px; background: white; border-radius: 8px;">
                            <span>Avg Task Time</span>
                            <span style="font-weight: 600;">${this.formatDuration(metrics.averageTaskTime)}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Performance Trends -->
            <div style="background: #f8f9fa; padding: 25px; border-radius: 15px;">
                <h3 style="color: #2c3e50; margin-bottom: 20px;">Performance Trends</h3>
                <div id="performance-trends-chart" style="height: 300px; background: white; border-radius: 10px; padding: 20px;">
                    <canvas id="performance-trends-canvas" width="800" height="300"></canvas>
                </div>
            </div>
        `;
    }
    
    generateBadgeCard(badgeId, earned = false) {
        const badge = this.gamification.getBadgeInfo(badgeId);
        if (!badge) return '';
        
        return `
            <div style="
                background: ${earned ? 'linear-gradient(135deg, #27ae60, #2ecc71)' : '#e9ecef'};
                color: ${earned ? 'white' : '#6c757d'};
                padding: 20px;
                border-radius: 12px;
                text-align: center;
                opacity: ${earned ? '1' : '0.6'};
                position: relative;
            ">
                ${earned ? '<div style="position: absolute; top: 10px; right: 10px; font-size: 20px;">✓</div>' : ''}
                <div style="font-size: 32px; margin-bottom: 10px;">${badge.icon}</div>
                <div style="font-size: 16px; font-weight: 600; margin-bottom: 5px;">${badge.name}</div>
                <div style="font-size: 12px; opacity: 0.8;">${badge.description}</div>
                <div style="font-size: 14px; font-weight: 600; margin-top: 10px;">+${badge.points} pts</div>
            </div>
        `;
    }
    
    generateAchievementCard(achievementId) {
        const achievement = this.gamification.getAchievementInfo(achievementId);
        if (!achievement) return '';
        
        return `
            <div style="
                background: linear-gradient(135deg, #9b59b6, #8e44ad);
                color: white;
                padding: 20px;
                border-radius: 12px;
                text-align: center;
            ">
                <div style="font-size: 32px; margin-bottom: 10px;">${achievement.icon}</div>
                <div style="font-size: 16px; font-weight: 600; margin-bottom: 5px;">${achievement.name}</div>
                <div style="font-size: 12px; opacity: 0.8;">${achievement.description}</div>
                <div style="font-size: 14px; font-weight: 600; margin-top: 10px;">+${achievement.points} pts</div>
            </div>
        `;
    }
    
    generateRecentActivity() {
        const recentSessions = this.metrics.metrics.sessions.slice(-5).reverse();
        
        return recentSessions.map(session => `
            <div style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 15px;
                background: white;
                border-radius: 8px;
                margin-bottom: 10px;
                border-left: 4px solid #9b59b6;
            ">
                <div>
                    <div style="font-weight: 600; color: #2c3e50;">Session ${session.id.slice(-8)}</div>
                    <div style="font-size: 14px; color: #6c757d;">
                        ${session.tasksCompleted} tasks • ${this.formatDuration(session.duration)}
                    </div>
                </div>
                <div style="text-align: right;">
                    <div style="font-weight: 600; color: #27ae60;">+${session.totalPoints} pts</div>
                    <div style="font-size: 14px; color: #6c757d;">
                        ${new Date(session.startTime).toLocaleDateString()}
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    generateTaskPerformanceRows(taskMetrics) {
        return Object.entries(taskMetrics).map(([taskName, metrics]) => `
            <tr>
                <td style="padding: 15px; border-bottom: 1px solid #dee2e6; font-weight: 600;">${taskName}</td>
                <td style="padding: 15px; border-bottom: 1px solid #dee2e6;">${metrics.totalCompletions}</td>
                <td style="padding: 15px; border-bottom: 1px solid #dee2e6;">${this.formatDuration(metrics.averageTime)}</td>
                <td style="padding: 15px; border-bottom: 1px solid #dee2e6;">${metrics.successRate.toFixed(1)}%</td>
                <td style="padding: 15px; border-bottom: 1px solid #dee2e6;">${metrics.totalPoints}</td>
            </tr>
        `).join('');
    }
    
    getTaskMetrics() {
        const taskNames = ['grocery', 'hospital', 'railway'];
        const metrics = {};
        
        taskNames.forEach(taskName => {
            metrics[taskName] = this.metrics.getTaskMetrics(taskName);
        });
        
        return metrics;
    }
    
    setupDashboardEventListeners() {
        // Close button
        const closeBtn = document.getElementById('close-dashboard');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeDashboard());
        }
        
        // Tab navigation
        const tabs = document.querySelectorAll('.dashboard-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const view = tab.dataset.view;
                this.switchView(view);
            });
        });
    }
    
    switchView(view) {
        // Update tab styles
        document.querySelectorAll('.dashboard-tab').forEach(tab => {
            tab.classList.remove('active');
            tab.style.color = '#6c757d';
            tab.style.borderBottomColor = 'transparent';
        });
        
        const activeTab = document.querySelector(`[data-view="${view}"]`);
        if (activeTab) {
            activeTab.classList.add('active');
            activeTab.style.color = '#9b59b6';
            activeTab.style.borderBottomColor = '#9b59b6';
        }
        
        // Show/hide content
        document.querySelectorAll('.dashboard-content').forEach(content => {
            content.style.display = 'none';
        });
        
        const activeContent = document.getElementById(`${view}-tab`);
        if (activeContent) {
            activeContent.style.display = 'block';
        }
        
        this.currentView = view;
        
        // Initialize charts for the current view
        this.initializeCharts();
    }
    
    initializeCharts() {
        if (this.currentView === 'overview') {
            this.initializeProgressChart();
        } else if (this.currentView === 'progress') {
            this.initializeTaskCompletionChart();
            this.initializeSkillDevelopmentChart();
        } else if (this.currentView === 'analytics') {
            this.initializePerformanceTrendsChart();
        }
    }
    
    initializeProgressChart() {
        const canvas = document.getElementById('progress-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const sessions = this.metrics.metrics.sessions;
        
        // Simple line chart showing points over time
        const data = sessions.map((session, index) => ({
            x: index,
            y: session.totalPoints
        }));
        
        this.drawLineChart(ctx, data, 'Points Over Time', 'Sessions', 'Points');
    }
    
    initializeTaskCompletionChart() {
        const canvas = document.getElementById('task-completion-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const taskMetrics = this.getTaskMetrics();
        
        const data = Object.entries(taskMetrics).map(([taskName, metrics]) => ({
            label: taskName,
            value: metrics.totalCompletions
        }));
        
        this.drawBarChart(ctx, data, 'Task Completions');
    }
    
    initializeSkillDevelopmentChart() {
        const canvas = document.getElementById('skill-development-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const sessions = this.metrics.metrics.sessions;
        
        // Calculate skill progression (simplified)
        const skillData = sessions.map((session, index) => ({
            x: index,
            y: session.tasksCompleted
        }));
        
        this.drawLineChart(ctx, skillData, 'Skill Development', 'Sessions', 'Tasks Completed');
    }
    
    initializePerformanceTrendsChart() {
        const canvas = document.getElementById('performance-trends-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const sessions = this.metrics.metrics.sessions;
        
        // Calculate performance trends
        const performanceData = sessions.map((session, index) => ({
            x: index,
            y: session.tasksCompleted / (session.duration / 60000) // tasks per minute
        }));
        
        this.drawLineChart(ctx, performanceData, 'Performance Trends', 'Sessions', 'Tasks/Minute');
    }
    
    drawLineChart(ctx, data, title, xLabel, yLabel) {
        if (!data || data.length === 0) return;
        
        const width = ctx.canvas.width;
        const height = ctx.canvas.height;
        const padding = 40;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Find min/max values
        const xValues = data.map(d => d.x);
        const yValues = data.map(d => d.y);
        const xMin = Math.min(...xValues);
        const xMax = Math.max(...xValues);
        const yMin = Math.min(...yValues);
        const yMax = Math.max(...yValues);
        
        // Draw axes
        ctx.strokeStyle = '#dee2e6';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(padding, height - padding);
        ctx.lineTo(width - padding, height - padding);
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, height - padding);
        ctx.stroke();
        
        // Draw line
        ctx.strokeStyle = '#9b59b6';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        data.forEach((point, index) => {
            const x = padding + (point.x - xMin) / (xMax - xMin) * (width - 2 * padding);
            const y = height - padding - (point.y - yMin) / (yMax - yMin) * (height - 2 * padding);
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.stroke();
        
        // Draw points
        ctx.fillStyle = '#9b59b6';
        data.forEach(point => {
            const x = padding + (point.x - xMin) / (xMax - xMin) * (width - 2 * padding);
            const y = height - padding - (point.y - yMin) / (yMax - yMin) * (height - 2 * padding);
            
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, 2 * Math.PI);
            ctx.fill();
        });
    }
    
    drawBarChart(ctx, data, title) {
        if (!data || data.length === 0) return;
        
        const width = ctx.canvas.width;
        const height = ctx.canvas.height;
        const padding = 40;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Find max value
        const maxValue = Math.max(...data.map(d => d.value));
        
        // Draw bars
        const barWidth = (width - 2 * padding) / data.length;
        const colors = ['#9b59b6', '#3498db', '#e74c3c', '#f39c12', '#27ae60'];
        
        data.forEach((item, index) => {
            const barHeight = (item.value / maxValue) * (height - 2 * padding);
            const x = padding + index * barWidth;
            const y = height - padding - barHeight;
            
            ctx.fillStyle = colors[index % colors.length];
            ctx.fillRect(x, y, barWidth * 0.8, barHeight);
            
            // Draw label
            ctx.fillStyle = '#2c3e50';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(item.label, x + barWidth / 2, height - 10);
        });
    }
    
    formatDuration(milliseconds) {
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        
        if (hours > 0) {
            return `${hours}h ${minutes % 60}m`;
        } else if (minutes > 0) {
            return `${minutes}m ${seconds % 60}s`;
        } else {
            return `${seconds}s`;
        }
    }
    
    updateDashboard() {
        if (this.isOpen && this.dashboard) {
            // Refresh the dashboard content
            this.dashboard.innerHTML = this.generateDashboardHTML();
            this.setupDashboardEventListeners();
            this.initializeCharts();
        }
    }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProgressDashboard;
}
