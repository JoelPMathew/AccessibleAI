# User Profile & AI Adaptation System

## Overview

The User Profile & AI Adaptation System provides comprehensive user profiling, ability assessment, AI-driven environment adaptation, and remote monitoring capabilities for VR accessibility scenarios. This system ensures that each user's experience is personalized based on their abilities, preferences, and progress.

## Core Components

### 1. User Profile System (`js/user-profile.js`)

**Purpose**: Stores and manages comprehensive user profiles including abilities, preferences, and medical information.

**Key Features**:
- **Comprehensive Profiling**: Detailed user profiles with abilities, limitations, preferences, and medical info
- **Ability Assessment**: Real-time assessment of user abilities based on session data
- **Profile Analysis**: AI-powered analysis to identify strengths, weaknesses, and recommendations
- **Data Persistence**: Local storage for profile data with export/import capabilities
- **Adaptive Learning**: Profiles evolve based on user performance and behavior

**Profile Structure**:
```javascript
{
    id: 'profile_id',
    name: 'User Name',
    mobilityType: 'none|wheelchair|walker|cane',
    interactionAbilities: {
        fineMotor: 1-10,      // Fine motor control
        grossMotor: 1-10,     // Gross motor control
        visual: 1-10,         // Visual processing
        auditory: 1-10,       // Auditory processing
        cognitive: 1-10,      // Cognitive abilities
        attention: 1-10,      // Attention span
        memory: 1-10,         // Memory capabilities
        processing: 1-10      // Processing speed
    },
    physicalLimitations: {
        reach: { min: 0, max: 200 },     // Reach range in cm
        grip: { strength: 1-10, precision: 1-10 },
        movement: { speed: 1-10, accuracy: 1-10 },
        endurance: 1-10,
        balance: 1-10
    },
    sensoryPreferences: {
        visual: { contrast, brightness, fontSize, animations },
        auditory: { volume, narration, soundEffects, speechRate },
        haptic: { enabled, intensity, vibration, temperature }
    },
    learningProfile: {
        style: 'visual|auditory|kinesthetic|mixed',
        pace: 'slow|normal|fast',
        complexity: 'low|medium|high',
        guidance: 'minimal|moderate|extensive'
    },
    medicalInfo: {
        conditions: [],
        medications: [],
        assistiveDevices: [],
        restrictions: [],
        emergencyContact: null
    }
}
```

**API Methods**:
```javascript
// Create/update profile
userProfile.createProfile(profileData);
userProfile.updateProfile(updates);

// Update abilities
userProfile.updateAbilities(abilityUpdates);

// Assess abilities from session data
userProfile.assessAbilities(sessionData);

// Analyze profile
const analysis = userProfile.analyzeProfile();

// Export/import profile
const exported = userProfile.exportProfile();
userProfile.importProfile(data);
```

### 2. AI Adaptation Engine (`js/ai-adaptation.js`)

**Purpose**: Provides AI-driven adaptation of environment complexity, object placement, and task difficulty.

**Key Features**:
- **Rule-Based Adaptation**: Comprehensive rules for adapting to different ability levels
- **Performance-Based Adaptation**: Dynamic adaptation based on user performance
- **Learning Profile Adaptation**: Adaptation based on individual learning styles
- **Real-time Adaptation**: Immediate adaptation during sessions
- **Adaptation History**: Tracking of adaptation effectiveness

**Adaptation Rules**:
- **Fine Motor Adaptations**: Object size, click tolerance, drag sensitivity
- **Gross Motor Adaptations**: Navigation speed, movement tolerance, large movements
- **Visual Adaptations**: Contrast, highlighting, visual cues, text size
- **Auditory Adaptations**: Narration, sound cues, voice guidance, speech rate
- **Cognitive Adaptations**: Task complexity, step-by-step guidance, simplified interface
- **Attention Adaptations**: Session length, frequent breaks, progress indicators
- **Memory Adaptations**: Memory aids, visual reminders, repetition
- **Processing Adaptations**: Time limits, pace, simplified choices

**API Methods**:
```javascript
// Analyze and adapt based on task completion
aiAdaptationEngine.analyzeAndAdapt(taskData);

// Adapt to specific profile
aiAdaptationEngine.adaptToProfile(profile);

// Get current adaptations
const adaptations = aiAdaptationEngine.getCurrentAdaptations();

// Recommend scenarios for weak skills
const recommendations = aiAdaptationEngine.recommendScenarios(weakSkills);
```

### 3. Remote Monitoring System (`js/remote-monitoring.js`)

**Purpose**: Enables therapists and caregivers to monitor sessions and provide real-time feedback.

**Key Features**:
- **Real-time Monitoring**: Live session monitoring with WebSocket communication
- **Alert System**: Automated alerts for high error rates, slow completion, frustration
- **Remote Feedback**: Real-time feedback and guidance from therapists
- **Session Control**: Remote pause, resume, and end session capabilities
- **Data Export**: Comprehensive session data export for analysis

**Monitoring Capabilities**:
- **Session Tracking**: Start/end times, duration, task completion
- **Performance Metrics**: Success rates, error counts, completion times
- **Interaction Logging**: All user interactions and events
- **Adaptation Tracking**: AI adaptation applications and effectiveness
- **Alert Generation**: Automated alerts for concerning patterns

**Remote Features**:
- **Live Feedback**: Real-time messages and guidance
- **Object Highlighting**: Remote highlighting of important objects
- **Navigation Assistance**: Remote navigation to specific areas
- **Instruction Display**: Remote display of instructions
- **Encouragement Messages**: Motivational messages and support

**API Methods**:
```javascript
// Start/stop monitoring
remoteMonitoringSystem.startMonitoring(sessionData);
remoteMonitoringSystem.stopMonitoring(sessionData);

// Check monitoring status
const isMonitoring = remoteMonitoringSystem.isCurrentlyMonitoring();

// Get current session
const session = remoteMonitoringSystem.getCurrentSession();

// Export session data
const data = remoteMonitoringSystem.exportSessionData();
```

### 4. Profile Manager Interface (`js/profile-manager.js`)

**Purpose**: Provides comprehensive UI for managing user profiles and abilities.

**Key Features**:
- **Profile Management**: Create, edit, and manage user profiles
- **Ability Assessment**: Visual ability assessment with sliders and controls
- **Preference Configuration**: Sensory and learning preference settings
- **Medical Information**: Medical conditions, medications, and restrictions
- **Profile Analysis**: Visual display of strengths, weaknesses, and recommendations
- **Real-time Updates**: Live updates as profile changes

**Interface Sections**:
- **Abilities Tab**: Visual ability assessment with sliders
- **Preferences Tab**: Sensory and learning preference configuration
- **Medical Tab**: Medical information and restrictions
- **Analysis Tab**: Profile analysis and recommendations

**API Methods**:
```javascript
// Open/close profile manager
profileManager.openManager();
profileManager.closeManager();

// Switch between tabs
profileManager.switchTab('abilities');

// Update display
profileManager.updateDisplay();
```

## Integration

### Main Application Integration

The system integrates seamlessly with the main VR accessibility application:

```javascript
// Initialize all systems
function initializeProfileSystems() {
    // Initialize user profile system
    window.userProfile = new UserProfile();
    
    // Initialize AI adaptation engine
    window.aiAdaptationEngine = new AIAdaptationEngine(window.userProfile, window.interactionMetrics);
    
    // Initialize remote monitoring system
    window.remoteMonitoringSystem = new RemoteMonitoringSystem(window.userProfile, window.interactionMetrics, window.aiAdaptationEngine);
    
    // Initialize profile manager
    window.profileManager = new ProfileManager(window.userProfile, window.aiAdaptationEngine, window.remoteMonitoringSystem);
}
```

### Event-Driven Architecture

The system uses custom events for communication:

```javascript
// Listen for profile updates
document.addEventListener('profileUpdated', function(event) {
    console.log('Profile updated:', event.detail.profile.id);
});

// Listen for adaptation events
document.addEventListener('adaptationsApplied', function(event) {
    console.log('Adaptations applied:', event.detail.adaptations);
});

// Listen for monitoring events
document.addEventListener('remoteFeedback', function(event) {
    console.log('Remote feedback:', event.detail.feedback.message);
});
```

## AI-Driven Adaptation

### Adaptation Rules

The AI adaptation engine uses a comprehensive set of rules to adapt the environment:

```javascript
// Example adaptation rule
{
    condition: (profile) => profile.interactionAbilities.fineMotor <= 4,
    adaptations: {
        objectSize: { multiplier: 1.5, min: 20, max: 100 },
        clickTolerance: { multiplier: 2.0, min: 10, max: 50 },
        dragSensitivity: { multiplier: 0.7, min: 0.5, max: 2.0 },
        precisionRequired: false
    },
    priority: 'high'
}
```

### Performance-Based Adaptation

The system adapts based on user performance:

- **High Success Rate**: Increase difficulty, reduce assistance
- **Low Success Rate**: Decrease difficulty, increase assistance
- **Slow Completion**: Extend time limits, simplify tasks
- **High Error Rate**: Increase error tolerance, add recovery assistance

### Learning Profile Adaptation

Adaptations are tailored to individual learning styles:

- **Visual Learners**: Enhanced highlighting, visual cues, color coding
- **Auditory Learners**: Audio narration, sound cues, voice guidance
- **Kinesthetic Learners**: Hands-on interactions, tactile feedback
- **Mixed Learners**: Combination of all adaptation types

## Remote Monitoring & Feedback

### WebSocket Communication

Real-time communication with monitoring servers:

```javascript
// WebSocket connection
const ws = new WebSocket('wss://monitoring-server.com/ws');

// Send session data
ws.send(JSON.stringify({
    type: 'session_data',
    session: sessionData,
    userProfile: userProfile
}));

// Receive remote feedback
ws.onmessage = (event) => {
    const message = JSON.parse(event.data);
    handleRemoteMessage(message);
};
```

### Alert System

Automated alerts for concerning patterns:

- **High Error Rate**: >50% error rate
- **Slow Completion**: >10 minutes per task
- **Attention Loss**: >5 minutes without interaction
- **High Frustration**: Multiple errors and retries

### Remote Control

Therapists can remotely control sessions:

- **Pause/Resume**: Pause or resume ongoing sessions
- **End Session**: End sessions remotely
- **Apply Adaptations**: Apply specific adaptations
- **Send Feedback**: Send real-time feedback and guidance

## Data Management

### Profile Storage

User profiles are stored in browser local storage:

```javascript
// Save profile
localStorage.setItem('userProfile', JSON.stringify(profile));

// Load profile
const profile = JSON.parse(localStorage.getItem('userProfile'));
```

### Data Export/Import

Comprehensive data export and import capabilities:

```javascript
// Export profile data
const profileData = userProfile.exportProfile();

// Import profile data
userProfile.importProfile(profileData);

// Export session data
const sessionData = remoteMonitoringSystem.exportSessionData();
```

### Privacy & Security

- **Local Storage**: All data stored locally by default
- **Optional Cloud Sync**: Cloud synchronization available with user consent
- **Data Encryption**: Sensitive data encrypted before transmission
- **Access Control**: Role-based access to monitoring features

## Usage Examples

### Basic Profile Management

```javascript
// Create a new profile
const profile = userProfile.createProfile({
    name: 'John Doe',
    mobilityType: 'wheelchair',
    interactionAbilities: {
        fineMotor: 6,
        grossMotor: 4,
        visual: 8,
        auditory: 7,
        cognitive: 8,
        attention: 6,
        memory: 7,
        processing: 6
    }
});

// Update abilities
userProfile.updateAbilities({
    fineMotor: 7,
    grossMotor: 5
});

// Analyze profile
const analysis = userProfile.analyzeProfile();
console.log('Strengths:', analysis.strengths);
console.log('Weaknesses:', analysis.weaknesses);
```

### AI Adaptation

```javascript
// Trigger adaptation based on task completion
const taskData = {
    task: { name: 'Grocery Shopping', difficulty: 'medium' },
    metrics: { successRate: 0.6, completionTime: 300000 }
};

aiAdaptationEngine.analyzeAndAdapt(taskData);

// Get current adaptations
const adaptations = aiAdaptationEngine.getCurrentAdaptations();
console.log('Active adaptations:', adaptations);
```

### Remote Monitoring

```javascript
// Start monitoring
remoteMonitoringSystem.startMonitoring({
    id: 'session_123',
    startTime: Date.now()
});

// Record task completion
remoteMonitoringSystem.recordTaskCompletion({
    name: 'Grocery Shopping',
    duration: 300000,
    success: true
});

// Stop monitoring
remoteMonitoringSystem.stopMonitoring({});
```

## Configuration

### Adaptation Rules

Adaptation rules can be customized:

```javascript
// Add custom adaptation rule
aiAdaptationEngine.adaptationRules.push({
    condition: (profile) => profile.medicalInfo.conditions.includes('epilepsy'),
    adaptations: {
        animations: false,
        flashing: false,
        highContrast: true
    },
    priority: 'critical'
});
```

### Alert Thresholds

Alert thresholds can be adjusted:

```javascript
// Update alert thresholds
remoteMonitoringSystem.alertThresholds = {
    errorRate: 0.4,        // 40% error rate
    completionTime: 480000, // 8 minutes
    attentionLoss: 240000,  // 4 minutes
    frustration: 0.6        // 60% frustration level
};
```

## Testing

### Demo Page

The `profile-demo.html` page provides comprehensive testing capabilities:

- **Profile Management**: Test profile creation and editing
- **Ability Assessment**: Test ability assessment and updates
- **AI Adaptation**: Test adaptation engine functionality
- **Remote Monitoring**: Test monitoring and feedback systems
- **Real-time Updates**: Test real-time UI updates

### Test Functions

```javascript
// Simulate ability change
simulateAbilityChange();

// Trigger adaptation
triggerAdaptation();

// Simulate task completion
simulateTaskCompletion();

// Toggle monitoring
toggleMonitoring();
```

## Performance Considerations

### Memory Management

- **Profile Cleanup**: Old profile data automatically cleaned up
- **Session Limits**: Session data limited to prevent memory issues
- **Adaptation History**: Adaptation history limited to last 100 entries

### Real-time Performance

- **Event Batching**: Multiple events batched for performance
- **Lazy Loading**: Profile data loaded on demand
- **Debounced Updates**: UI updates debounced to prevent excessive rendering

## Accessibility Features

### Screen Reader Support

- **ARIA Labels**: All interactive elements have proper ARIA labels
- **Semantic HTML**: Proper heading structure and semantic elements
- **Keyboard Navigation**: Full keyboard accessibility

### Visual Accessibility

- **High Contrast**: Support for high contrast mode
- **Scalable Text**: Responsive text sizing
- **Color Coding**: Color is not the only way to convey information

### Motor Accessibility

- **Large Touch Targets**: Minimum 44px touch targets
- **Keyboard Shortcuts**: Common actions have keyboard shortcuts
- **Voice Commands**: Integration with voice control systems

## Future Enhancements

### Planned Features

1. **Machine Learning**: Advanced ML-based adaptation algorithms
2. **Predictive Analytics**: Predict user needs and adapt proactively
3. **Multi-user Support**: Support for multiple users on same device
4. **Cloud Integration**: Cloud-based profile synchronization
5. **Advanced Monitoring**: More sophisticated monitoring and analytics
6. **Custom Adaptations**: User-defined adaptation rules
7. **Integration APIs**: APIs for third-party integration
8. **Mobile Support**: Native mobile application support

### Extensibility

The system is designed for easy extension:

- **Plugin Architecture**: Easy to add new features
- **Event System**: Extensible event-driven architecture
- **Modular Design**: Independent, reusable components
- **Configuration**: Highly configurable behavior

## Troubleshooting

### Common Issues

1. **Profile Not Saving**: Check local storage permissions
2. **Adaptations Not Applying**: Check adaptation engine initialization
3. **Monitoring Not Working**: Check WebSocket connection
4. **Performance Issues**: Monitor memory usage and data size

### Debug Mode

Enable debug mode for detailed logging:

```javascript
// Enable debug logging
localStorage.setItem('debugMode', 'true');

// Check system status
console.log('User Profile:', userProfile);
console.log('AI Adaptation Engine:', aiAdaptationEngine);
console.log('Remote Monitoring:', remoteMonitoringSystem);
```

## Support

For technical support or feature requests, please refer to the main project documentation or contact the development team.

---

*This system is part of the VR Accessibility Project and is designed to provide personalized, adaptive experiences that meet the unique needs of each user while enabling remote monitoring and support from therapists and caregivers.*
