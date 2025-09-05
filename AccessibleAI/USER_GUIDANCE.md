# User Guidance & Cues System

## Overview

The User Guidance & Cues System provides comprehensive task guidance with object highlighting, narration, text instructions, and adjustable difficulty levels. This system enhances accessibility and user experience by providing clear, customizable guidance for completing tasks in VR scenarios.

## Features

### 🎯 Object Highlighting
- **Visual Highlighting**: Animated highlighting of target objects and areas
- **Pulsing Animation**: Eye-catching pulsing effect to draw attention
- **Customizable Duration**: Adjustable highlight duration based on difficulty level
- **Auto-removal**: Highlights automatically fade out after completion
- **Multiple Styles**: Different highlighting styles for different task types

### 📢 Narration System
- **Voice Instructions**: Spoken guidance for each task step
- **Web Speech API**: Uses browser's built-in text-to-speech
- **Adjustable Speed**: Narration speed adapts to difficulty level
- **Natural Language**: Clear, concise instructions in natural language
- **Audio Feedback**: Confirmation sounds for completed actions

### 📋 Text Instructions
- **Overlay Instructions**: Text instructions displayed on screen
- **Step-by-step Guidance**: Clear progression through task steps
- **Customizable Styling**: Text size and appearance adapt to difficulty
- **Auto-dismiss**: Instructions automatically fade after completion
- **Accessibility**: High contrast and readable fonts

### ⚡ Difficulty Levels

#### Easy Mode
- **Maximum Assistance**: Long highlight duration (5 seconds)
- **Slow Narration**: Slower speech rate (0.7x)
- **Large Text**: Larger instruction text
- **Step-by-step**: Detailed step-by-step guidance
- **Hints**: Additional hints and tips
- **Auto-advance**: Automatic progression through steps

#### Medium Mode
- **Balanced Assistance**: Moderate highlight duration (3 seconds)
- **Normal Narration**: Standard speech rate (0.8x)
- **Medium Text**: Standard instruction text
- **Guided Flow**: Structured guidance without hand-holding
- **Hints**: Helpful hints when needed
- **Manual Advance**: User controls progression

#### Hard Mode
- **Minimal Assistance**: Short highlight duration (1.5 seconds)
- **Fast Narration**: Faster speech rate (0.9x)
- **Small Text**: Compact instruction text
- **Independent**: Minimal guidance for experienced users
- **No Hints**: No additional hints provided
- **Manual Advance**: Full user control

### 🆘 Assistance Levels

#### Minimal Assistance
- **Basic Highlighting**: Object highlighting only
- **No Narration**: No voice instructions
- **No Text**: No text instructions
- **No Hints**: No additional guidance
- **No Progress**: No progress tracking

#### Moderate Assistance
- **Highlighting**: Object highlighting enabled
- **Text Instructions**: Text-based guidance
- **Hints**: Helpful hints and tips
- **Progress Tracking**: Visual progress indicators
- **No Narration**: No voice instructions

#### Full Assistance
- **Complete Guidance**: All features enabled
- **Highlighting**: Object highlighting
- **Narration**: Voice instructions
- **Text Instructions**: Text-based guidance
- **Hints**: Helpful hints and tips
- **Progress Tracking**: Visual progress indicators

## Task Management

### Task Structure
```javascript
const task = {
    name: 'Task Name',
    description: 'Task description',
    difficulty: 'medium',
    estimatedTime: '5-10 minutes',
    steps: [
        {
            name: 'Step Name',
            target: '#element-id',
            instructions: 'Step instructions',
            narration: 'Spoken instructions',
            hints: ['Hint 1', 'Hint 2'],
            successMessage: 'Success message',
            nextStepDelay: 2000
        }
    ]
};
```

### Step Properties
- **name**: Display name for the step
- **target**: CSS selector for the target element
- **instructions**: Text instructions for the step
- **narration**: Spoken instructions (optional)
- **hints**: Array of helpful hints (optional)
- **successMessage**: Message shown on completion (optional)
- **nextStepDelay**: Delay before next step (optional)

### Task Lifecycle
1. **Task Start**: Introduction and first step highlighting
2. **Step Execution**: User interacts with highlighted objects
3. **Step Completion**: Feedback and progression to next step
4. **Task Completion**: Final celebration and cleanup

## Configuration Interface

### Guidance Settings Panel
The guidance configuration interface provides:

- **Current Status**: Real-time system status display
- **Difficulty Selection**: Choose between Easy, Medium, Hard
- **Assistance Level**: Select Minimal, Moderate, or Full assistance
- **Feature Toggles**: Enable/disable specific features
- **Test Controls**: Test the guidance system
- **Quick Actions**: Reset, export, import settings

### Settings Persistence
All settings are automatically saved to localStorage and persist across sessions:
- Difficulty level preferences
- Assistance level preferences
- Feature toggle states
- Custom configurations

## Integration with VR Scenarios

### Automatic Integration
The guidance system automatically integrates with VR scenarios:

1. **Scenario Loading**: Guidance system initializes when scenario loads
2. **Task Detection**: Automatically detects available tasks for the scenario
3. **Object Highlighting**: Highlights interactive elements in VR space
4. **Progress Tracking**: Tracks completion of task steps
5. **Completion Celebration**: Shows celebration effects when tasks complete

### VR-Specific Features
- **3D Highlighting**: Highlights objects in 3D VR space
- **Spatial Audio**: Narration positioned in 3D space
- **Haptic Feedback**: Vibration feedback through VR controllers
- **Immersive Instructions**: Instructions integrated into VR environment

## API Reference

### UserGuidanceSystem Class

#### Constructor
```javascript
const guidanceSystem = new UserGuidanceSystem();
```

#### Methods

##### Task Management
```javascript
// Start a task
guidanceSystem.startGuidance(task);

// Stop current guidance
guidanceSystem.stopGuidance();

// Get current status
const status = guidanceSystem.getStatus();
```

##### Configuration
```javascript
// Set difficulty level
guidanceSystem.setDifficultyLevel('easy');

// Set assistance level
guidanceSystem.setAssistanceLevel('full');

// Toggle features
guidanceSystem.toggleNarration();
guidanceSystem.toggleTextInstructions();
guidanceSystem.toggleHighlighting();
```

##### Event Handling
```javascript
// Listen for task events
document.addEventListener('taskStarted', (event) => {
    console.log('Task started:', event.detail);
});

document.addEventListener('taskCompleted', (event) => {
    console.log('Task completed:', event.detail);
});

document.addEventListener('taskStepCompleted', (event) => {
    console.log('Step completed:', event.detail);
});
```

### TaskDefinitions Class

#### Methods
```javascript
// Get task for scenario
const task = taskDefinitions.getTask('grocery');

// Create custom task
const customTask = taskDefinitions.createCustomTask(
    'Custom Task',
    'Description',
    steps,
    'medium'
);

// Add task step
taskDefinitions.addTaskStep('grocery', newStep);

// Update task
taskDefinitions.updateTask('grocery', updates);
```

### GuidanceConfigInterface Class

#### Methods
```javascript
// Create configuration interface
const configInterface = new GuidanceConfigInterface(guidanceSystem);

// The interface automatically handles:
// - Settings panel creation
// - Event listeners
// - Settings persistence
// - Real-time updates
```

## Usage Examples

### Basic Setup
```javascript
// Initialize guidance system
const guidanceSystem = new UserGuidanceSystem();
const configInterface = new GuidanceConfigInterface(guidanceSystem);

// Start a task
const task = {
    name: 'Sample Task',
    description: 'Complete this sample task',
    steps: [
        {
            name: 'Click Button',
            target: '#my-button',
            instructions: 'Click the highlighted button',
            narration: 'Click the highlighted button to continue'
        }
    ]
};

guidanceSystem.startGuidance(task);
```

### Custom Task Creation
```javascript
// Create a custom task
const customTask = taskDefinitions.createCustomTask(
    'Shopping Task',
    'Navigate through the store and complete your shopping',
    [
        {
            name: 'Enter Store',
            target: '#entrance',
            instructions: 'Click the entrance door',
            narration: 'Welcome to the store. Click the entrance door to begin.',
            hints: ['Look for the blue door', 'The door is at the front']
        },
        {
            name: 'Find Products',
            target: '#products',
            instructions: 'Browse the product shelves',
            narration: 'Now look for the products you need on the shelves.',
            hints: ['Products are organized by category', 'Look for signs above each section']
        }
    ],
    'medium'
);

// Start the custom task
guidanceSystem.startGuidance(customTask);
```

### Event Handling
```javascript
// Listen for guidance events
document.addEventListener('taskStarted', (event) => {
    const { task } = event.detail;
    console.log(`Starting task: ${task.name}`);
    
    // Show task introduction
    showTaskIntroduction(task);
});

document.addEventListener('taskStepCompleted', (event) => {
    const { step } = event.detail;
    console.log(`Completed step: ${step.name}`);
    
    // Show step completion feedback
    showStepCompletion(step);
});

document.addEventListener('taskCompleted', (event) => {
    console.log('Task completed successfully!');
    
    // Show completion celebration
    showCompletionCelebration();
});
```

### Configuration Management
```javascript
// Set difficulty level
guidanceSystem.setDifficultyLevel('easy');

// Set assistance level
guidanceSystem.setAssistanceLevel('full');

// Toggle specific features
guidanceSystem.toggleNarration();
guidanceSystem.toggleTextInstructions();
guidanceSystem.toggleHighlighting();

// Get current status
const status = guidanceSystem.getStatus();
console.log('Current status:', status);
```

## Accessibility Features

### Visual Accessibility
- **High Contrast**: High contrast highlighting and text
- **Large Text**: Scalable text sizes for different abilities
- **Clear Indicators**: Obvious visual cues for task progression
- **Color Blind Support**: Color schemes that work for color blind users

### Audio Accessibility
- **Clear Narration**: Clear, well-paced voice instructions
- **Audio Cues**: Sound effects for task completion
- **Volume Control**: Adjustable audio levels
- **Speech Rate**: Configurable narration speed

### Motor Accessibility
- **Large Targets**: Highlighted areas are easy to click
- **Dwell Time**: Configurable dwell time for activation
- **Auto-advance**: Automatic progression for users with limited mobility
- **Alternative Input**: Works with assistive devices

### Cognitive Accessibility
- **Clear Instructions**: Simple, clear task instructions
- **Progress Indicators**: Visual progress tracking
- **Hints and Tips**: Helpful guidance when needed
- **Error Prevention**: Clear feedback for incorrect actions

## Browser Compatibility

### Supported Browsers
- **Chrome**: Full support for all features
- **Firefox**: Full support for most features
- **Safari**: Limited support for some features
- **Edge**: Full support for all features

### Required APIs
- **Web Speech API**: For voice narration
- **CSS Animations**: For highlighting effects
- **localStorage**: For settings persistence
- **Custom Events**: For event handling

### Fallback Support
The system gracefully degrades when APIs are not available:
- Narration falls back to text instructions
- Animations fall back to static highlighting
- Settings fall back to default values

## Performance Considerations

### Optimization Features
- **Efficient Highlighting**: Minimal DOM manipulation
- **Event Debouncing**: Prevents excessive event handling
- **Memory Management**: Automatic cleanup of completed tasks
- **Lazy Loading**: Components loaded only when needed

### Resource Usage
- **Minimal CPU**: Lightweight highlighting and animation
- **Low Memory**: Efficient object management
- **Fast Rendering**: Optimized for smooth performance
- **Battery Friendly**: Minimal impact on device battery

## Troubleshooting

### Common Issues

#### Narration Not Working
- Check if Web Speech API is supported
- Verify microphone permissions
- Check browser audio settings
- Try different browsers

#### Highlighting Not Visible
- Check if target elements exist
- Verify CSS selectors are correct
- Check for conflicting styles
- Ensure elements are visible

#### Settings Not Saving
- Check localStorage availability
- Verify browser permissions
- Clear browser cache
- Check for JavaScript errors

### Debug Mode
Enable debug mode for detailed logging:
```javascript
// Enable debug logging
guidanceSystem.debug = true;

// Check system status
console.log(guidanceSystem.getStatus());

// Monitor events
document.addEventListener('taskStarted', (event) => {
    console.log('Debug: Task started', event.detail);
});
```

## Future Enhancements

### Planned Features
- **Eye Tracking**: Support for eye-tracking devices
- **Gesture Recognition**: Hand gesture-based navigation
- **AI-Powered Hints**: Intelligent hint generation
- **Multi-language Support**: Internationalization
- **Custom Themes**: User-customizable visual themes

### Community Contributions
- **Plugin System**: Extensible plugin architecture
- **Custom Animations**: User-defined highlighting effects
- **Voice Commands**: Voice-controlled navigation
- **Accessibility Profiles**: Pre-configured accessibility settings

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Contributing

We welcome contributions from the community! Please see our CONTRIBUTING.md file for guidelines.

## Acknowledgments

- **Accessibility Community**: For feedback and testing
- **Web Standards Bodies**: For accessibility standards
- **Open Source Community**: For foundational technologies
- **VR Community**: For immersive experience insights
