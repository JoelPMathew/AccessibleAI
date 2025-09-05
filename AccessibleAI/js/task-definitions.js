/**
 * Task Definitions for VR Scenarios
 * Defines tasks with steps, highlighting, and instructions
 */

class TaskDefinitions {
    constructor() {
        this.tasks = {
            grocery: {
                name: 'Grocery Shopping',
                description: 'Navigate through the grocery store and complete your shopping list.',
                difficulty: 'medium',
                estimatedTime: '5-10 minutes',
                steps: [
                    {
                        name: 'Enter the Store',
                        target: '#entranceDoor',
                        instructions: 'Click on the entrance door to enter the grocery store.',
                        narration: 'Welcome to the grocery store. Click on the entrance door to begin your shopping experience.',
                        hints: ['Look for the blue entrance door', 'The door is located at the front of the store'],
                        successMessage: 'Great! You have entered the store.',
                        nextStepDelay: 2000
                    },
                    {
                        name: 'Visit the Fruits Section',
                        target: '#fruitsShelf',
                        instructions: 'Navigate to the fruits section to browse fresh fruits.',
                        narration: 'Now let\'s visit the fruits section. Look for the fruits shelf on your left.',
                        hints: ['The fruits section is on the left side', 'You can see apples, oranges, and other fruits'],
                        successMessage: 'Excellent! You found the fruits section.',
                        nextStepDelay: 2000
                    },
                    {
                        name: 'Check Out the Vegetables',
                        target: '#vegetablesShelf',
                        instructions: 'Move to the vegetables section to see fresh produce.',
                        narration: 'Next, let\'s check out the vegetables section on your right.',
                        hints: ['The vegetables section is on the right side', 'Look for carrots, cucumbers, and other vegetables'],
                        successMessage: 'Perfect! You found the vegetables section.',
                        nextStepDelay: 2000
                    },
                    {
                        name: 'Go to Checkout',
                        target: '#checkoutCounter',
                        instructions: 'Proceed to the checkout counter to complete your purchase.',
                        narration: 'Now it\'s time to checkout. Head to the checkout counter at the back of the store.',
                        hints: ['The checkout counter is at the back', 'Look for the brown counter'],
                        successMessage: 'Well done! You have completed your grocery shopping.',
                        nextStepDelay: 2000
                    }
                ]
            },
            hospital: {
                name: 'Hospital Navigation',
                description: 'Navigate through the hospital environment and locate key areas.',
                difficulty: 'medium',
                estimatedTime: '5-8 minutes',
                steps: [
                    {
                        name: 'Enter the Hospital',
                        target: '#entranceDoor',
                        instructions: 'Click on the entrance to enter the hospital.',
                        narration: 'Welcome to the hospital. Click on the entrance to begin your visit.',
                        hints: ['Look for the main entrance', 'The entrance is clearly marked'],
                        successMessage: 'You have entered the hospital.',
                        nextStepDelay: 2000
                    },
                    {
                        name: 'Find the Reception Desk',
                        target: '#receptionDesk',
                        instructions: 'Locate the reception desk for check-in.',
                        narration: 'First, you need to check in at the reception desk.',
                        hints: ['The reception desk is usually near the entrance', 'Look for a desk with staff'],
                        successMessage: 'Great! You found the reception desk.',
                        nextStepDelay: 2000
                    },
                    {
                        name: 'Navigate to the Ward',
                        target: '#wardArea',
                        instructions: 'Find your way to the patient ward area.',
                        narration: 'Now navigate to the patient ward area.',
                        hints: ['Follow the signs to the wards', 'The ward area is typically on upper floors'],
                        successMessage: 'Excellent! You found the ward area.',
                        nextStepDelay: 2000
                    },
                    {
                        name: 'Locate the Operating Theater',
                        target: '#operatingTheater',
                        instructions: 'Find the operating theater for surgical procedures.',
                        narration: 'Finally, locate the operating theater for surgical procedures.',
                        hints: ['The operating theater is usually on a specific floor', 'Look for signs indicating surgical areas'],
                        successMessage: 'Perfect! You have completed the hospital navigation.',
                        nextStepDelay: 2000
                    }
                ]
            },
            railway: {
                name: 'Railway Station Navigation',
                description: 'Navigate through the railway station and find your platform.',
                difficulty: 'easy',
                estimatedTime: '3-5 minutes',
                steps: [
                    {
                        name: 'Enter the Station',
                        target: '#stationEntrance',
                        instructions: 'Click on the station entrance to begin your journey.',
                        narration: 'Welcome to the railway station. Click on the entrance to start your journey.',
                        hints: ['Look for the main station entrance', 'The entrance is usually well-marked'],
                        successMessage: 'You have entered the railway station.',
                        nextStepDelay: 2000
                    },
                    {
                        name: 'Find the Ticket Counter',
                        target: '#ticketCounter',
                        instructions: 'Locate the ticket counter to purchase your ticket.',
                        narration: 'First, you need to buy a ticket. Find the ticket counter.',
                        hints: ['The ticket counter is usually near the entrance', 'Look for signs saying "Tickets"'],
                        successMessage: 'Great! You found the ticket counter.',
                        nextStepDelay: 2000
                    },
                    {
                        name: 'Check the Departure Board',
                        target: '#departureBoard',
                        instructions: 'Check the departure board for your train information.',
                        narration: 'Now check the departure board to see your train information.',
                        hints: ['The departure board shows train times and platforms', 'Look for a large display board'],
                        successMessage: 'Excellent! You checked the departure board.',
                        nextStepDelay: 2000
                    },
                    {
                        name: 'Go to Your Platform',
                        target: '#platform',
                        instructions: 'Navigate to your assigned platform to catch your train.',
                        narration: 'Finally, go to your assigned platform to catch your train.',
                        hints: ['Follow the signs to your platform number', 'Platforms are usually numbered'],
                        successMessage: 'Perfect! You have reached your platform.',
                        nextStepDelay: 2000
                    }
                ]
            }
        };
        
        this.currentScenario = null;
        this.currentTask = null;
    }
    
    getTask(scenarioId) {
        return this.tasks[scenarioId] || null;
    }
    
    getAllTasks() {
        return this.tasks;
    }
    
    getTaskNames() {
        return Object.keys(this.tasks);
    }
    
    createCustomTask(name, description, steps, difficulty = 'medium') {
        const task = {
            name,
            description,
            difficulty,
            estimatedTime: '5-10 minutes',
            steps: steps || []
        };
        
        this.tasks[name.toLowerCase().replace(/\s+/g, '_')] = task;
        return task;
    }
    
    updateTask(scenarioId, updates) {
        if (this.tasks[scenarioId]) {
            this.tasks[scenarioId] = { ...this.tasks[scenarioId], ...updates };
            return true;
        }
        return false;
    }
    
    addTaskStep(scenarioId, step) {
        if (this.tasks[scenarioId]) {
            if (!this.tasks[scenarioId].steps) {
                this.tasks[scenarioId].steps = [];
            }
            this.tasks[scenarioId].steps.push(step);
            return true;
        }
        return false;
    }
    
    removeTaskStep(scenarioId, stepIndex) {
        if (this.tasks[scenarioId] && this.tasks[scenarioId].steps) {
            if (stepIndex >= 0 && stepIndex < this.tasks[scenarioId].steps.length) {
                this.tasks[scenarioId].steps.splice(stepIndex, 1);
                return true;
            }
        }
        return false;
    }
    
    getTaskStep(scenarioId, stepIndex) {
        if (this.tasks[scenarioId] && this.tasks[scenarioId].steps) {
            return this.tasks[scenarioId].steps[stepIndex] || null;
        }
        return null;
    }
    
    updateTaskStep(scenarioId, stepIndex, updates) {
        if (this.tasks[scenarioId] && this.tasks[scenarioId].steps) {
            if (stepIndex >= 0 && stepIndex < this.tasks[scenarioId].steps.length) {
                this.tasks[scenarioId].steps[stepIndex] = { ...this.tasks[scenarioId].steps[stepIndex], ...updates };
                return true;
            }
        }
        return false;
    }
    
    validateTask(task) {
        if (!task || typeof task !== 'object') {
            return { valid: false, error: 'Task must be an object' };
        }
        
        if (!task.name || typeof task.name !== 'string') {
            return { valid: false, error: 'Task must have a name' };
        }
        
        if (!task.description || typeof task.description !== 'string') {
            return { valid: false, error: 'Task must have a description' };
        }
        
        if (!task.steps || !Array.isArray(task.steps)) {
            return { valid: false, error: 'Task must have steps array' };
        }
        
        for (let i = 0; i < task.steps.length; i++) {
            const step = task.steps[i];
            if (!step.name || typeof step.name !== 'string') {
                return { valid: false, error: `Step ${i + 1} must have a name` };
            }
            
            if (!step.target || typeof step.target !== 'string') {
                return { valid: false, error: `Step ${i + 1} must have a target` };
            }
            
            if (!step.instructions || typeof step.instructions !== 'string') {
                return { valid: false, error: `Step ${i + 1} must have instructions` };
            }
        }
        
        return { valid: true };
    }
    
    exportTasks() {
        return JSON.stringify(this.tasks, null, 2);
    }
    
    importTasks(tasksJson) {
        try {
            const importedTasks = JSON.parse(tasksJson);
            this.tasks = { ...this.tasks, ...importedTasks };
            return true;
        } catch (error) {
            console.error('Failed to import tasks:', error);
            return false;
        }
    }
    
    // Helper method to create a step
    createStep(name, target, instructions, options = {}) {
        return {
            name,
            target,
            instructions,
            narration: options.narration || instructions,
            hints: options.hints || [],
            successMessage: options.successMessage || 'Step completed successfully!',
            nextStepDelay: options.nextStepDelay || 1000,
            ...options
        };
    }
    
    // Helper method to create a task
    createTask(name, description, steps, options = {}) {
        return {
            name,
            description,
            difficulty: options.difficulty || 'medium',
            estimatedTime: options.estimatedTime || '5-10 minutes',
            steps: steps || [],
            ...options
        };
    }
    
    // Get tasks by difficulty
    getTasksByDifficulty(difficulty) {
        return Object.values(this.tasks).filter(task => task.difficulty === difficulty);
    }
    
    // Get task statistics
    getTaskStatistics() {
        const stats = {
            totalTasks: Object.keys(this.tasks).length,
            byDifficulty: {
                easy: 0,
                medium: 0,
                hard: 0
            },
            totalSteps: 0,
            averageSteps: 0
        };
        
        Object.values(this.tasks).forEach(task => {
            stats.byDifficulty[task.difficulty]++;
            stats.totalSteps += task.steps ? task.steps.length : 0;
        });
        
        stats.averageSteps = stats.totalTasks > 0 ? Math.round(stats.totalSteps / stats.totalTasks) : 0;
        
        return stats;
    }
}

// Create global instance
window.TaskDefinitions = TaskDefinitions;
window.taskDefinitions = new TaskDefinitions();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TaskDefinitions;
}
