/**
 * Analytics Dashboard System
 * Comprehensive analytics and reporting dashboard for performance tracking and accessibility compliance
 */

class AnalyticsDashboard {
    constructor(performanceTracking, accessibilityCompliance, userFeedback) {
        this.performanceTracking = performanceTracking;
        this.accessibilityCompliance = accessibilityCompliance;
        this.userFeedback = userFeedback;
        this.isOpen = false;
        this.dashboard = null;
        this.charts = {};
        this.currentView = 'overview';
        this.dateRange = 'week';
        
        this.init();
    }
    
    init() {
        this.createDashboardButton();
        this.setupEventListeners();
        console.log('Analytics Dashboard initialized');
    }
    
    createDashboardButton() {
        const button = document.createElement('button');
        button.id = 'analytics-dashboard-button';
        button.innerHTML = '📊 Analytics Dashboard';
        button.style.cssText = `
            position: fixed;
            top: 20px;
            right: 300px;
            z-index: 1000;
            background: linear-gradient(135deg, #e74c3c, #c0392b);
            color: white;
            border: none;
            border-radius: 12px;
            padding: 12px 20px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            box-shadow: 0 4px 20px rgba(231, 76, 60, 0.3);
            transition: all 0.3s ease;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;
        
        button.addEventListener('click', () => this.toggleDashboard());
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-2px)';
            button.style.boxShadow = '0 8px 25px rgba(231, 76, 60, 0.4)';
        });
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0)';
            button.style.boxShadow = '0 4px 20px rgba(231, 76, 60, 0.3)';
        });
        
        document.body.appendChild(button);
    }
    
    setupEventListeners() {
        // Listen for data updates
        document.addEventListener('trendAnalysisCompleted', () => {
            this.updateDashboard();
        });
        
        document.addEventListener('complianceChecked', () => {
            this.updateDashboard();
        });
        
        document.addEventListener('taskFeedbackCollected', () => {
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
        overlay.id = 'analytics-dashboard-overlay';
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
        
        const overlay = document.getElementById('analytics-dashboard-overlay');
        if (overlay) {
            overlay.remove();
        }
        
        this.isOpen = false;
    }
    
    createDashboard() {
        this.dashboard = document.createElement('div');
        this.dashboard.id = 'analytics-dashboard';
        this.dashboard.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 95%;
            max-width: 1400px;
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
        return `
            <div style="padding: 30px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
                    <h2 style="margin: 0; color: #2c3e50; font-size: 28px;">📊 Analytics Dashboard</h2>
                    <div style="display: flex; gap: 15px; align-items: center;">
                        <select id="date-range-select" style="padding: 8px 12px; border: 1px solid #ddd; border-radius: 6px;">
                            <option value="day">Last 24 Hours</option>
                            <option value="week" selected>Last 7 Days</option>
                            <option value="month">Last 30 Days</option>
                            <option value="all">All Time</option>
                        </select>
                        <button id="close-analytics-dashboard" style="
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
                </div>
                
                <!-- Navigation Tabs -->
                <div style="display: flex; gap: 10px; margin-bottom: 30px; border-bottom: 2px solid #ecf0f1;">
                    <button class="analytics-tab active" data-view="overview" style="
                        background: none;
                        border: none;
                        padding: 15px 25px;
                        cursor: pointer;
                        font-size: 16px;
                        font-weight: 600;
                        color: #e74c3c;
                        border-bottom: 3px solid #e74c3c;
                    ">Overview</button>
                    <button class="analytics-tab" data-view="performance" style="
                        background: none;
                        border: none;
                        padding: 15px 25px;
                        cursor: pointer;
                        font-size: 16px;
                        font-weight: 600;
                        color: #6c757d;
                        border-bottom: 3px solid transparent;
                    ">Performance</button>
                    <button class="analytics-tab" data-view="accessibility" style="
                        background: none;
                        border: none;
                        padding: 15px 25px;
                        cursor: pointer;
                        font-size: 16px;
                        font-weight: 600;
                        color: #6c757d;
                        border-bottom: 3px solid transparent;
                    ">Accessibility</button>
                    <button class="analytics-tab" data-view="feedback" style="
                        background: none;
                        border: none;
                        padding: 15px 25px;
                        cursor: pointer;
                        font-size: 16px;
                        font-weight: 600;
                        color: #6c757d;
                        border-bottom: 3px solid transparent;
                    ">User Feedback</button>
                    <button class="analytics-tab" data-view="trends" style="
                        background: none;
                        border: none;
                        padding: 15px 25px;
                        cursor: pointer;
                        font-size: 16px;
                        font-weight: 600;
                        color: #6c757d;
                        border-bottom: 3px solid transparent;
                    ">Trends</button>
                </div>
                
                <!-- Overview Tab -->
                <div id="overview-tab" class="analytics-content">
                    ${this.generateOverviewContent()}
                </div>
                
                <!-- Performance Tab -->
                <div id="performance-tab" class="analytics-content" style="display: none;">
                    ${this.generatePerformanceContent()}
                </div>
                
                <!-- Accessibility Tab -->
                <div id="accessibility-tab" class="analytics-content" style="display: none;">
                    ${this.generateAccessibilityContent()}
                </div>
                
                <!-- Feedback Tab -->
                <div id="feedback-tab" class="analytics-content" style="display: none;">
                    ${this.generateFeedbackContent()}
                </div>
                
                <!-- Trends Tab -->
                <div id="trends-tab" class="analytics-content" style="display: none;">
                    ${this.generateTrendsContent()}
                </div>
            </div>
        `;
    }
    
    generateOverviewContent() {
        const performanceSummary = this.performanceTracking?.getPerformanceSummary();
        const complianceSummary = this.accessibilityCompliance?.getComplianceSummary();
        const feedbackSummary = this.userFeedback?.getFeedbackSummary();
        
        return `
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 30px;">
                <!-- Performance Metrics -->
                <div style="background: linear-gradient(135deg, #3498db, #2980b9); color: white; padding: 25px; border-radius: 15px;">
                    <div style="font-size: 36px; margin-bottom: 10px;">📈</div>
                    <div style="font-size: 24px; font-weight: 700; margin-bottom: 5px;">Performance</div>
                    <div style="font-size: 16px; opacity: 0.9;">
                        Completion: ${performanceSummary?.performance?.completionRate?.toFixed(1) || 0}%<br>
                        Efficiency: ${performanceSummary?.performance?.efficiency?.toFixed(1) || 0} tasks/min
                    </div>
                </div>
                
                <!-- Accessibility Score -->
                <div style="background: linear-gradient(135deg, #27ae60, #2ecc71); color: white; padding: 25px; border-radius: 15px;">
                    <div style="font-size: 36px; margin-bottom: 10px;">♿</div>
                    <div style="font-size: 24px; font-weight: 700; margin-bottom: 5px;">Accessibility</div>
                    <div style="font-size: 16px; opacity: 0.9;">
                        Score: ${complianceSummary?.score?.toFixed(1) || 0}%<br>
                        Level: ${complianceSummary?.level || 'AA'}
                    </div>
                </div>
                
                <!-- User Feedback -->
                <div style="background: linear-gradient(135deg, #f39c12, #e67e22); color: white; padding: 25px; border-radius: 15px;">
                    <div style="font-size: 36px; margin-bottom: 10px;">💬</div>
                    <div style="font-size: 24px; font-weight: 700; margin-bottom: 5px;">Feedback</div>
                    <div style="font-size: 16px; opacity: 0.9;">
                        Total: ${feedbackSummary?.totalFeedback || 0}<br>
                        Avg Difficulty: ${feedbackSummary?.averageDifficulty?.toFixed(1) || 0}/5
                    </div>
                </div>
                
                <!-- Session Stats -->
                <div style="background: linear-gradient(135deg, #9b59b6, #8e44ad); color: white; padding: 25px; border-radius: 15px;">
                    <div style="font-size: 36px; margin-bottom: 10px;">⏱️</div>
                    <div style="font-size: 24px; font-weight: 700; margin-bottom: 5px;">Sessions</div>
                    <div style="font-size: 16px; opacity: 0.9;">
                        Duration: ${this.formatDuration(performanceSummary?.session?.duration || 0)}<br>
                        Tasks: ${performanceSummary?.performance?.taskCount || 0}
                    </div>
                </div>
            </div>
            
            <!-- Recent Activity -->
            <div style="background: #f8f9fa; padding: 25px; border-radius: 15px;">
                <h3 style="color: #2c3e50; margin-bottom: 20px;">Recent Activity</h3>
                <div id="recent-activity-chart" style="height: 300px; background: white; border-radius: 10px; padding: 20px;">
                    <canvas id="recent-activity-canvas" width="800" height="300"></canvas>
                </div>
            </div>
        `;
    }
    
    generatePerformanceContent() {
        return `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px;">
                <!-- Performance Trends -->
                <div style="background: #f8f9fa; padding: 25px; border-radius: 15px;">
                    <h3 style="color: #2c3e50; margin-bottom: 20px;">Performance Trends</h3>
                    <div id="performance-trends-chart" style="height: 250px;">
                        <canvas id="performance-trends-canvas" width="400" height="250"></canvas>
                    </div>
                </div>
                
                <!-- Task Completion -->
                <div style="background: #f8f9fa; padding: 25px; border-radius: 15px;">
                    <h3 style="color: #2c3e50; margin-bottom: 20px;">Task Completion</h3>
                    <div id="task-completion-chart" style="height: 250px;">
                        <canvas id="task-completion-canvas" width="400" height="250"></canvas>
                    </div>
                </div>
            </div>
            
            <!-- Performance Metrics Table -->
            <div style="background: #f8f9fa; padding: 25px; border-radius: 15px;">
                <h3 style="color: #2c3e50; margin-bottom: 20px;">Detailed Performance Metrics</h3>
                <div style="overflow-x: auto;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="background: #e9ecef;">
                                <th style="padding: 15px; text-align: left; border-bottom: 2px solid #dee2e6;">Metric</th>
                                <th style="padding: 15px; text-align: left; border-bottom: 2px solid #dee2e6;">Current</th>
                                <th style="padding: 15px; text-align: left; border-bottom: 2px solid #dee2e6;">Average</th>
                                <th style="padding: 15px; text-align: left; border-bottom: 2px solid #dee2e6;">Trend</th>
                            </tr>
                        </thead>
                        <tbody id="performance-metrics-table">
                            <!-- Performance metrics will be populated by JavaScript -->
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }
    
    generateAccessibilityContent() {
        const complianceSummary = this.accessibilityCompliance?.getComplianceSummary();
        
        return `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px;">
                <!-- Compliance Score -->
                <div style="background: #f8f9fa; padding: 25px; border-radius: 15px;">
                    <h3 style="color: #2c3e50; margin-bottom: 20px;">Compliance Score</h3>
                    <div style="text-align: center;">
                        <div style="font-size: 48px; font-weight: 700; color: #27ae60; margin-bottom: 10px;">
                            ${complianceSummary?.score?.toFixed(1) || 0}%
                        </div>
                        <div style="font-size: 18px; color: #6c757d; margin-bottom: 20px;">
                            WCAG ${complianceSummary?.level || 'AA'} Level
                        </div>
                        <div style="background: #e9ecef; height: 10px; border-radius: 5px; overflow: hidden;">
                            <div style="
                                background: linear-gradient(135deg, #27ae60, #2ecc71);
                                height: 100%;
                                width: ${complianceSummary?.score || 0}%;
                                transition: width 0.3s ease;
                            "></div>
                        </div>
                    </div>
                </div>
                
                <!-- Violations -->
                <div style="background: #f8f9fa; padding: 25px; border-radius: 15px;">
                    <h3 style="color: #2c3e50; margin-bottom: 20px;">Recent Violations</h3>
                    <div id="violations-list" style="max-height: 200px; overflow-y: auto;">
                        ${this.generateViolationsList()}
                    </div>
                </div>
            </div>
            
            <!-- Accessibility Metrics -->
            <div style="background: #f8f9fa; padding: 25px; border-radius: 15px;">
                <h3 style="color: #2c3e50; margin-bottom: 20px;">Accessibility Metrics</h3>
                <div id="accessibility-metrics-chart" style="height: 300px; background: white; border-radius: 10px; padding: 20px;">
                    <canvas id="accessibility-metrics-canvas" width="800" height="300"></canvas>
                </div>
            </div>
        `;
    }
    
    generateFeedbackContent() {
        const feedbackSummary = this.userFeedback?.getFeedbackSummary();
        
        return `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px;">
                <!-- Feedback Distribution -->
                <div style="background: #f8f9fa; padding: 25px; border-radius: 15px;">
                    <h3 style="color: #2c3e50; margin-bottom: 20px;">Feedback Distribution</h3>
                    <div id="feedback-distribution-chart" style="height: 250px;">
                        <canvas id="feedback-distribution-canvas" width="400" height="250"></canvas>
                    </div>
                </div>
                
                <!-- Difficulty Ratings -->
                <div style="background: #f8f9fa; padding: 25px; border-radius: 15px;">
                    <h3 style="color: #2c3e50; margin-bottom: 20px;">Difficulty Ratings</h3>
                    <div id="difficulty-ratings-chart" style="height: 250px;">
                        <canvas id="difficulty-ratings-canvas" width="400" height="250"></canvas>
                    </div>
                </div>
            </div>
            
            <!-- Feedback Summary -->
            <div style="background: #f8f9fa; padding: 25px; border-radius: 15px;">
                <h3 style="color: #2c3e50; margin-bottom: 20px;">Feedback Summary</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
                    <div style="background: white; padding: 20px; border-radius: 10px; text-align: center;">
                        <div style="font-size: 24px; font-weight: 700; color: #3498db; margin-bottom: 5px;">
                            ${feedbackSummary?.totalFeedback || 0}
                        </div>
                        <div style="color: #6c757d;">Total Feedback</div>
                    </div>
                    <div style="background: white; padding: 20px; border-radius: 10px; text-align: center;">
                        <div style="font-size: 24px; font-weight: 700; color: #f39c12; margin-bottom: 5px;">
                            ${feedbackSummary?.averageDifficulty?.toFixed(1) || 0}
                        </div>
                        <div style="color: #6c757d;">Avg Difficulty</div>
                    </div>
                    <div style="background: white; padding: 20px; border-radius: 10px; text-align: center;">
                        <div style="font-size: 24px; font-weight: 700; color: #27ae60; margin-bottom: 5px;">
                            ${feedbackSummary?.recentFeedback || 0}
                        </div>
                        <div style="color: #6c757d;">Recent Feedback</div>
                    </div>
                    <div style="background: white; padding: 20px; border-radius: 10px; text-align: center;">
                        <div style="font-size: 24px; font-weight: 700; color: #9b59b6; margin-bottom: 5px;">
                            ${Object.keys(feedbackSummary?.feedbackTypes || {}).length}
                        </div>
                        <div style="color: #6c757d;">Feedback Types</div>
                    </div>
                </div>
            </div>
        `;
    }
    
    generateTrendsContent() {
        return `
            <div style="background: #f8f9fa; padding: 25px; border-radius: 15px; margin-bottom: 30px;">
                <h3 style="color: #2c3e50; margin-bottom: 20px;">Performance Trends Over Time</h3>
                <div id="trends-chart" style="height: 400px; background: white; border-radius: 10px; padding: 20px;">
                    <canvas id="trends-canvas" width="800" height="400"></canvas>
                </div>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
                <!-- Behavioral Patterns -->
                <div style="background: #f8f9fa; padding: 25px; border-radius: 15px;">
                    <h3 style="color: #2c3e50; margin-bottom: 20px;">Behavioral Patterns</h3>
                    <div id="behavioral-patterns-chart" style="height: 250px;">
                        <canvas id="behavioral-patterns-canvas" width="400" height="250"></canvas>
                    </div>
                </div>
                
                <!-- Learning Progress -->
                <div style="background: #f8f9fa; padding: 25px; border-radius: 15px;">
                    <h3 style="color: #2c3e50; margin-bottom: 20px;">Learning Progress</h3>
                    <div id="learning-progress-chart" style="height: 250px;">
                        <canvas id="learning-progress-canvas" width="400" height="250"></canvas>
                    </div>
                </div>
            </div>
        `;
    }
    
    generateViolationsList() {
        const violations = this.accessibilityCompliance?.violations || [];
        
        if (violations.length === 0) {
            return '<div style="text-align: center; color: #6c757d; font-style: italic;">No recent violations</div>';
        }
        
        return violations.slice(-5).map(violation => `
            <div style="
                background: white;
                padding: 15px;
                border-radius: 8px;
                margin-bottom: 10px;
                border-left: 4px solid #e74c3c;
            ">
                <div style="font-weight: 600; color: #2c3e50; margin-bottom: 5px;">
                    ${violation.rule?.name || 'Unknown Rule'}
                </div>
                <div style="font-size: 14px; color: #6c757d;">
                    ${violation.violations?.join(', ') || 'No details available'}
                </div>
                <div style="font-size: 12px; color: #95a5a6; margin-top: 5px;">
                    ${new Date(violation.timestamp).toLocaleString()}
                </div>
            </div>
        `).join('');
    }
    
    setupDashboardEventListeners() {
        // Close button
        const closeBtn = document.getElementById('close-analytics-dashboard');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeDashboard());
        }
        
        // Tab navigation
        const tabs = document.querySelectorAll('.analytics-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const view = tab.dataset.view;
                this.switchView(view);
            });
        });
        
        // Date range selector
        const dateRangeSelect = document.getElementById('date-range-select');
        if (dateRangeSelect) {
            dateRangeSelect.addEventListener('change', (e) => {
                this.dateRange = e.target.value;
                this.updateDashboard();
            });
        }
    }
    
    switchView(view) {
        // Update tab styles
        document.querySelectorAll('.analytics-tab').forEach(tab => {
            tab.classList.remove('active');
            tab.style.color = '#6c757d';
            tab.style.borderBottomColor = 'transparent';
        });
        
        const activeTab = document.querySelector(`[data-view="${view}"]`);
        if (activeTab) {
            activeTab.classList.add('active');
            activeTab.style.color = '#e74c3c';
            activeTab.style.borderBottomColor = '#e74c3c';
        }
        
        // Show/hide content
        document.querySelectorAll('.analytics-content').forEach(content => {
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
            this.initializeOverviewCharts();
        } else if (this.currentView === 'performance') {
            this.initializePerformanceCharts();
        } else if (this.currentView === 'accessibility') {
            this.initializeAccessibilityCharts();
        } else if (this.currentView === 'feedback') {
            this.initializeFeedbackCharts();
        } else if (this.currentView === 'trends') {
            this.initializeTrendsCharts();
        }
    }
    
    initializeOverviewCharts() {
        this.drawRecentActivityChart();
    }
    
    initializePerformanceCharts() {
        this.drawPerformanceTrendsChart();
        this.drawTaskCompletionChart();
        this.populatePerformanceMetricsTable();
    }
    
    initializeAccessibilityCharts() {
        this.drawAccessibilityMetricsChart();
    }
    
    initializeFeedbackCharts() {
        this.drawFeedbackDistributionChart();
        this.drawDifficultyRatingsChart();
    }
    
    initializeTrendsCharts() {
        this.drawTrendsChart();
        this.drawBehavioralPatternsChart();
        this.drawLearningProgressChart();
    }
    
    // Chart Drawing Methods
    drawRecentActivityChart() {
        const canvas = document.getElementById('recent-activity-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const data = this.getRecentActivityData();
        
        this.drawLineChart(ctx, data, 'Recent Activity', 'Time', 'Activity');
    }
    
    drawPerformanceTrendsChart() {
        const canvas = document.getElementById('performance-trends-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const data = this.getPerformanceTrendsData();
        
        this.drawLineChart(ctx, data, 'Performance Trends', 'Sessions', 'Score');
    }
    
    drawTaskCompletionChart() {
        const canvas = document.getElementById('task-completion-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const data = this.getTaskCompletionData();
        
        this.drawBarChart(ctx, data, 'Task Completion');
    }
    
    drawAccessibilityMetricsChart() {
        const canvas = document.getElementById('accessibility-metrics-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const data = this.getAccessibilityMetricsData();
        
        this.drawBarChart(ctx, data, 'Accessibility Metrics');
    }
    
    drawFeedbackDistributionChart() {
        const canvas = document.getElementById('feedback-distribution-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const data = this.getFeedbackDistributionData();
        
        this.drawPieChart(ctx, data, 'Feedback Distribution');
    }
    
    drawDifficultyRatingsChart() {
        const canvas = document.getElementById('difficulty-ratings-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const data = this.getDifficultyRatingsData();
        
        this.drawBarChart(ctx, data, 'Difficulty Ratings');
    }
    
    drawTrendsChart() {
        const canvas = document.getElementById('trends-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const data = this.getTrendsData();
        
        this.drawMultiLineChart(ctx, data, 'Performance Trends Over Time');
    }
    
    drawBehavioralPatternsChart() {
        const canvas = document.getElementById('behavioral-patterns-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const data = this.getBehavioralPatternsData();
        
        this.drawBarChart(ctx, data, 'Behavioral Patterns');
    }
    
    drawLearningProgressChart() {
        const canvas = document.getElementById('learning-progress-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const data = this.getLearningProgressData();
        
        this.drawLineChart(ctx, data, 'Learning Progress', 'Sessions', 'Progress');
    }
    
    // Data Generation Methods
    getRecentActivityData() {
        // Generate sample data for recent activity
        const data = [];
        const now = Date.now();
        for (let i = 23; i >= 0; i--) {
            const time = new Date(now - i * 60 * 60 * 1000);
            data.push({
                x: time.getHours(),
                y: Math.random() * 100
            });
        }
        return data;
    }
    
    getPerformanceTrendsData() {
        // Generate sample data for performance trends
        const data = [];
        for (let i = 0; i < 10; i++) {
            data.push({
                x: i,
                y: 70 + Math.random() * 30
            });
        }
        return data;
    }
    
    getTaskCompletionData() {
        return [
            { label: 'Grocery', value: 85 },
            { label: 'Hospital', value: 72 },
            { label: 'Railway', value: 90 }
        ];
    }
    
    getAccessibilityMetricsData() {
        return [
            { label: 'WCAG AA', value: 95 },
            { label: 'Keyboard Nav', value: 88 },
            { label: 'Screen Reader', value: 92 },
            { label: 'Color Contrast', value: 96 }
        ];
    }
    
    getFeedbackDistributionData() {
        return [
            { label: 'Task Completion', value: 45 },
            { label: 'Session End', value: 30 },
            { label: 'Periodic', value: 25 }
        ];
    }
    
    getDifficultyRatingsData() {
        return [
            { label: 'Very Easy', value: 15 },
            { label: 'Easy', value: 25 },
            { label: 'Moderate', value: 35 },
            { label: 'Hard', value: 20 },
            { label: 'Very Hard', value: 5 }
        ];
    }
    
    getTrendsData() {
        return {
            completionRate: Array.from({ length: 10 }, (_, i) => ({ x: i, y: 70 + Math.random() * 30 })),
            efficiency: Array.from({ length: 10 }, (_, i) => ({ x: i, y: 60 + Math.random() * 40 })),
            satisfaction: Array.from({ length: 10 }, (_, i) => ({ x: i, y: 75 + Math.random() * 25 }))
        };
    }
    
    getBehavioralPatternsData() {
        return [
            { label: 'Click Interactions', value: 45 },
            { label: 'Keyboard Navigation', value: 30 },
            { label: 'Voice Commands', value: 15 },
            { label: 'Assistive Devices', value: 10 }
        ];
    }
    
    getLearningProgressData() {
        const data = [];
        for (let i = 0; i < 15; i++) {
            data.push({
                x: i,
                y: 20 + i * 5 + Math.random() * 10
            });
        }
        return data;
    }
    
    // Chart Drawing Utilities
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
        ctx.strokeStyle = '#e74c3c';
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
        ctx.fillStyle = '#e74c3c';
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
        const colors = ['#e74c3c', '#3498db', '#27ae60', '#f39c12', '#9b59b6'];
        
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
    
    drawPieChart(ctx, data, title) {
        if (!data || data.length === 0) return;
        
        const width = ctx.canvas.width;
        const height = ctx.canvas.height;
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) / 2 - 40;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Calculate total value
        const total = data.reduce((sum, item) => sum + item.value, 0);
        
        // Draw pie slices
        let currentAngle = 0;
        const colors = ['#e74c3c', '#3498db', '#27ae60', '#f39c12', '#9b59b6'];
        
        data.forEach((item, index) => {
            const sliceAngle = (item.value / total) * 2 * Math.PI;
            
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
            ctx.closePath();
            ctx.fillStyle = colors[index % colors.length];
            ctx.fill();
            
            // Draw label
            const labelAngle = currentAngle + sliceAngle / 2;
            const labelX = centerX + Math.cos(labelAngle) * (radius + 20);
            const labelY = centerY + Math.sin(labelAngle) * (radius + 20);
            
            ctx.fillStyle = '#2c3e50';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(item.label, labelX, labelY);
            
            currentAngle += sliceAngle;
        });
    }
    
    drawMultiLineChart(ctx, data, title) {
        if (!data || Object.keys(data).length === 0) return;
        
        const width = ctx.canvas.width;
        const height = ctx.canvas.height;
        const padding = 40;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Find min/max values across all datasets
        let xMin = Infinity, xMax = -Infinity, yMin = Infinity, yMax = -Infinity;
        Object.values(data).forEach(dataset => {
            dataset.forEach(point => {
                xMin = Math.min(xMin, point.x);
                xMax = Math.max(xMax, point.x);
                yMin = Math.min(yMin, point.y);
                yMax = Math.max(yMax, point.y);
            });
        });
        
        // Draw axes
        ctx.strokeStyle = '#dee2e6';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(padding, height - padding);
        ctx.lineTo(width - padding, height - padding);
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, height - padding);
        ctx.stroke();
        
        // Draw lines for each dataset
        const colors = ['#e74c3c', '#3498db', '#27ae60'];
        const labels = Object.keys(data);
        
        labels.forEach((label, index) => {
            const dataset = data[label];
            const color = colors[index % colors.length];
            
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.beginPath();
            
            dataset.forEach((point, pointIndex) => {
                const x = padding + (point.x - xMin) / (xMax - xMin) * (width - 2 * padding);
                const y = height - padding - (point.y - yMin) / (yMax - yMin) * (height - 2 * padding);
                
                if (pointIndex === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            });
            
            ctx.stroke();
        });
    }
    
    populatePerformanceMetricsTable() {
        const tableBody = document.getElementById('performance-metrics-table');
        if (!tableBody) return;
        
        const metrics = [
            { name: 'Completion Rate', current: '85%', average: '82%', trend: '↗️ Improving' },
            { name: 'Efficiency', current: '2.3 tasks/min', average: '2.1 tasks/min', trend: '↗️ Improving' },
            { name: 'Average Task Time', current: '3.2 min', average: '3.5 min', trend: '↗️ Improving' },
            { name: 'Interaction Success', current: '92%', average: '89%', trend: '↗️ Improving' }
        ];
        
        tableBody.innerHTML = metrics.map(metric => `
            <tr>
                <td style="padding: 15px; border-bottom: 1px solid #dee2e6; font-weight: 600;">${metric.name}</td>
                <td style="padding: 15px; border-bottom: 1px solid #dee2e6;">${metric.current}</td>
                <td style="padding: 15px; border-bottom: 1px solid #dee2e6;">${metric.average}</td>
                <td style="padding: 15px; border-bottom: 1px solid #dee2e6;">${metric.trend}</td>
            </tr>
        `).join('');
    }
    
    updateDashboard() {
        if (this.isOpen && this.dashboard) {
            // Refresh the dashboard content
            this.dashboard.innerHTML = this.generateDashboardHTML();
            this.setupDashboardEventListeners();
            this.initializeCharts();
        }
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
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnalyticsDashboard;
}
