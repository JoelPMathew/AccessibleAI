/**
 * Profile Manager Interface
 * Provides UI for managing user profiles and abilities
 */

class ProfileManager {
    constructor(userProfile, adaptationEngine, monitoringSystem) {
        this.userProfile = userProfile;
        this.adaptationEngine = adaptationEngine;
        this.monitoringSystem = monitoringSystem;
        this.isOpen = false;
        this.manager = null;
        this.currentTab = 'abilities';
        
        this.init();
    }
    
    init() {
        this.createManagerButton();
        this.setupEventListeners();
        console.log('Profile Manager initialized');
    }
    
    createManagerButton() {
        const button = document.createElement('button');
        button.id = 'profile-manager-button';
        button.innerHTML = '👤 Profile Manager';
        button.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border: none;
            border-radius: 12px;
            padding: 12px 20px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
            transition: all 0.3s ease;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;
        
        button.addEventListener('click', () => this.toggleManager());
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-2px)';
            button.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.4)';
        });
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0)';
            button.style.boxShadow = '0 4px 20px rgba(102, 126, 234, 0.3)';
        });
        
        document.body.appendChild(button);
    }
    
    setupEventListeners() {
        // Listen for profile updates
        document.addEventListener('profileUpdated', () => {
            this.updateDisplay();
        });
        
        document.addEventListener('abilitiesUpdated', () => {
            this.updateDisplay();
        });
    }
    
    toggleManager() {
        if (this.isOpen) {
            this.closeManager();
        } else {
            this.openManager();
        }
    }
    
    openManager() {
        this.createManager();
        this.isOpen = true;
        
        // Add overlay
        const overlay = document.createElement('div');
        overlay.id = 'profile-manager-overlay';
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
        overlay.addEventListener('click', () => this.closeManager());
        document.body.appendChild(overlay);
    }
    
    closeManager() {
        if (this.manager) {
            this.manager.remove();
            this.manager = null;
        }
        
        const overlay = document.getElementById('profile-manager-overlay');
        if (overlay) {
            overlay.remove();
        }
        
        this.isOpen = false;
    }
    
    createManager() {
        this.manager = document.createElement('div');
        this.manager.id = 'profile-manager';
        this.manager.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 95%;
            max-width: 1000px;
            max-height: 90vh;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            z-index: 1000;
            overflow: hidden;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;
        
        this.manager.innerHTML = this.generateManagerHTML();
        document.body.appendChild(this.manager);
        
        this.setupManagerEventListeners();
        this.updateDisplay();
    }
    
    generateManagerHTML() {
        const profile = this.userProfile.getProfile();
        
        return `
            <div style="padding: 30px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
                    <h2 style="margin: 0; color: #2c3e50; font-size: 28px;">👤 Profile Manager</h2>
                    <button id="close-profile-manager" style="
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
                    <button class="profile-tab active" data-tab="abilities" style="
                        background: none;
                        border: none;
                        padding: 15px 25px;
                        cursor: pointer;
                        font-size: 16px;
                        font-weight: 600;
                        color: #667eea;
                        border-bottom: 3px solid #667eea;
                    ">Abilities</button>
                    <button class="profile-tab" data-tab="preferences" style="
                        background: none;
                        border: none;
                        padding: 15px 25px;
                        cursor: pointer;
                        font-size: 16px;
                        font-weight: 600;
                        color: #6c757d;
                        border-bottom: 3px solid transparent;
                    ">Preferences</button>
                    <button class="profile-tab" data-tab="medical" style="
                        background: none;
                        border: none;
                        padding: 15px 25px;
                        cursor: pointer;
                        font-size: 16px;
                        font-weight: 600;
                        color: #6c757d;
                        border-bottom: 3px solid transparent;
                    ">Medical Info</button>
                    <button class="profile-tab" data-tab="analysis" style="
                        background: none;
                        border: none;
                        padding: 15px 25px;
                        cursor: pointer;
                        font-size: 16px;
                        font-weight: 600;
                        color: #6c757d;
                        border-bottom: 3px solid transparent;
                    ">Analysis</button>
                </div>
                
                <!-- Abilities Tab -->
                <div id="abilities-tab" class="profile-content">
                    ${this.generateAbilitiesContent(profile)}
                </div>
                
                <!-- Preferences Tab -->
                <div id="preferences-tab" class="profile-content" style="display: none;">
                    ${this.generatePreferencesContent(profile)}
                </div>
                
                <!-- Medical Info Tab -->
                <div id="medical-tab" class="profile-content" style="display: none;">
                    ${this.generateMedicalContent(profile)}
                </div>
                
                <!-- Analysis Tab -->
                <div id="analysis-tab" class="profile-content" style="display: none;">
                    ${this.generateAnalysisContent(profile)}
                </div>
            </div>
        `;
    }
    
    generateAbilitiesContent(profile) {
        const abilities = profile.interactionAbilities;
        
        return `
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-bottom: 30px;">
                ${Object.entries(abilities).map(([ability, score]) => `
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 15px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                            <h3 style="margin: 0; color: #2c3e50; text-transform: capitalize;">${ability.replace(/([A-Z])/g, ' $1').trim()}</h3>
                            <span style="font-size: 24px; font-weight: 700; color: #667eea;">${score}/10</span>
                        </div>
                        <div style="background: #e9ecef; height: 10px; border-radius: 5px; overflow: hidden;">
                            <div style="
                                background: linear-gradient(135deg, #667eea, #764ba2);
                                height: 100%;
                                width: ${(score / 10) * 100}%;
                                transition: width 0.3s ease;
                            "></div>
                        </div>
                        <div style="margin-top: 10px;">
                            <input type="range" 
                                   min="1" 
                                   max="10" 
                                   value="${score}" 
                                   class="ability-slider" 
                                   data-ability="${ability}"
                                   style="width: 100%; height: 6px; border-radius: 3px; background: #e9ecef; outline: none;">
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div style="background: #f8f9fa; padding: 25px; border-radius: 15px;">
                <h3 style="color: #2c3e50; margin-bottom: 20px;">Physical Limitations</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
                    <div>
                        <label style="display: block; margin-bottom: 5px; font-weight: 600;">Reach Range (cm)</label>
                        <input type="range" 
                               min="0" 
                               max="200" 
                               value="${profile.physicalLimitations.reach.max}"
                               class="limitation-slider"
                               data-limitation="reach.max"
                               style="width: 100%;">
                        <div style="text-align: center; margin-top: 5px; font-size: 14px; color: #6c757d;">
                            ${profile.physicalLimitations.reach.min} - ${profile.physicalLimitations.reach.max} cm
                        </div>
                    </div>
                    <div>
                        <label style="display: block; margin-bottom: 5px; font-weight: 600;">Grip Strength</label>
                        <input type="range" 
                               min="1" 
                               max="10" 
                               value="${profile.physicalLimitations.grip.strength}"
                               class="limitation-slider"
                               data-limitation="grip.strength"
                               style="width: 100%;">
                        <div style="text-align: center; margin-top: 5px; font-size: 14px; color: #6c757d;">
                            ${profile.physicalLimitations.grip.strength}/10
                        </div>
                    </div>
                    <div>
                        <label style="display: block; margin-bottom: 5px; font-weight: 600;">Movement Speed</label>
                        <input type="range" 
                               min="1" 
                               max="10" 
                               value="${profile.physicalLimitations.movement.speed}"
                               class="limitation-slider"
                               data-limitation="movement.speed"
                               style="width: 100%;">
                        <div style="text-align: center; margin-top: 5px; font-size: 14px; color: #6c757d;">
                            ${profile.physicalLimitations.movement.speed}/10
                        </div>
                    </div>
                    <div>
                        <label style="display: block; margin-bottom: 5px; font-weight: 600;">Endurance</label>
                        <input type="range" 
                               min="1" 
                               max="10" 
                               value="${profile.physicalLimitations.endurance}"
                               class="limitation-slider"
                               data-limitation="endurance"
                               style="width: 100%;">
                        <div style="text-align: center; margin-top: 5px; font-size: 14px; color: #6c757d;">
                            ${profile.physicalLimitations.endurance}/10
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    generatePreferencesContent(profile) {
        const preferences = profile.sensoryPreferences;
        
        return `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px;">
                <!-- Visual Preferences -->
                <div style="background: #f8f9fa; padding: 25px; border-radius: 15px;">
                    <h3 style="color: #2c3e50; margin-bottom: 20px;">👁️ Visual Preferences</h3>
                    <div style="display: grid; gap: 15px;">
                        <div>
                            <label style="display: block; margin-bottom: 5px; font-weight: 600;">Contrast Level</label>
                            <select class="preference-select" data-preference="visual.contrast" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 5px;">
                                <option value="low" ${preferences.visual.contrast === 'low' ? 'selected' : ''}>Low</option>
                                <option value="normal" ${preferences.visual.contrast === 'normal' ? 'selected' : ''}>Normal</option>
                                <option value="high" ${preferences.visual.contrast === 'high' ? 'selected' : ''}>High</option>
                            </select>
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 5px; font-weight: 600;">Text Size</label>
                            <select class="preference-select" data-preference="visual.fontSize" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 5px;">
                                <option value="small" ${preferences.visual.fontSize === 'small' ? 'selected' : ''}>Small</option>
                                <option value="normal" ${preferences.visual.fontSize === 'normal' ? 'selected' : ''}>Normal</option>
                                <option value="large" ${preferences.visual.fontSize === 'large' ? 'selected' : ''}>Large</option>
                                <option value="extra-large" ${preferences.visual.fontSize === 'extra-large' ? 'selected' : ''}>Extra Large</option>
                            </select>
                        </div>
                        <div>
                            <label style="display: flex; align-items: center; gap: 10px;">
                                <input type="checkbox" 
                                       class="preference-checkbox" 
                                       data-preference="visual.animations"
                                       ${preferences.visual.animations ? 'checked' : ''}>
                                Enable Animations
                            </label>
                        </div>
                    </div>
                </div>
                
                <!-- Auditory Preferences -->
                <div style="background: #f8f9fa; padding: 25px; border-radius: 15px;">
                    <h3 style="color: #2c3e50; margin-bottom: 20px;">🔊 Auditory Preferences</h3>
                    <div style="display: grid; gap: 15px;">
                        <div>
                            <label style="display: block; margin-bottom: 5px; font-weight: 600;">Volume Level</label>
                            <select class="preference-select" data-preference="auditory.volume" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 5px;">
                                <option value="low" ${preferences.auditory.volume === 'low' ? 'selected' : ''}>Low</option>
                                <option value="normal" ${preferences.auditory.volume === 'normal' ? 'selected' : ''}>Normal</option>
                                <option value="high" ${preferences.auditory.volume === 'high' ? 'selected' : ''}>High</option>
                            </select>
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 5px; font-weight: 600;">Speech Rate</label>
                            <select class="preference-select" data-preference="auditory.speechRate" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 5px;">
                                <option value="slow" ${preferences.auditory.speechRate === 'slow' ? 'selected' : ''}>Slow</option>
                                <option value="normal" ${preferences.auditory.speechRate === 'normal' ? 'selected' : ''}>Normal</option>
                                <option value="fast" ${preferences.auditory.speechRate === 'fast' ? 'selected' : ''}>Fast</option>
                            </select>
                        </div>
                        <div>
                            <label style="display: flex; align-items: center; gap: 10px;">
                                <input type="checkbox" 
                                       class="preference-checkbox" 
                                       data-preference="auditory.narration"
                                       ${preferences.auditory.narration ? 'checked' : ''}>
                                Enable Narration
                            </label>
                        </div>
                        <div>
                            <label style="display: flex; align-items: center; gap: 10px;">
                                <input type="checkbox" 
                                       class="preference-checkbox" 
                                       data-preference="auditory.soundEffects"
                                       ${preferences.auditory.soundEffects ? 'checked' : ''}>
                                Enable Sound Effects
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Learning Profile -->
            <div style="background: #f8f9fa; padding: 25px; border-radius: 15px;">
                <h3 style="color: #2c3e50; margin-bottom: 20px;">🎓 Learning Profile</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
                    <div>
                        <label style="display: block; margin-bottom: 5px; font-weight: 600;">Learning Style</label>
                        <select class="preference-select" data-preference="learningProfile.style" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 5px;">
                            <option value="visual" ${profile.learningProfile.style === 'visual' ? 'selected' : ''}>Visual</option>
                            <option value="auditory" ${profile.learningProfile.style === 'auditory' ? 'selected' : ''}>Auditory</option>
                            <option value="kinesthetic" ${profile.learningProfile.style === 'kinesthetic' ? 'selected' : ''}>Kinesthetic</option>
                            <option value="mixed" ${profile.learningProfile.style === 'mixed' ? 'selected' : ''}>Mixed</option>
                        </select>
                    </div>
                    <div>
                        <label style="display: block; margin-bottom: 5px; font-weight: 600;">Learning Pace</label>
                        <select class="preference-select" data-preference="learningProfile.pace" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 5px;">
                            <option value="slow" ${profile.learningProfile.pace === 'slow' ? 'selected' : ''}>Slow</option>
                            <option value="normal" ${profile.learningProfile.pace === 'normal' ? 'selected' : ''}>Normal</option>
                            <option value="fast" ${profile.learningProfile.pace === 'fast' ? 'selected' : ''}>Fast</option>
                        </select>
                    </div>
                    <div>
                        <label style="display: block; margin-bottom: 5px; font-weight: 600;">Complexity Level</label>
                        <select class="preference-select" data-preference="learningProfile.complexity" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 5px;">
                            <option value="low" ${profile.learningProfile.complexity === 'low' ? 'selected' : ''}>Low</option>
                            <option value="medium" ${profile.learningProfile.complexity === 'medium' ? 'selected' : ''}>Medium</option>
                            <option value="high" ${profile.learningProfile.complexity === 'high' ? 'selected' : ''}>High</option>
                        </select>
                    </div>
                    <div>
                        <label style="display: block; margin-bottom: 5px; font-weight: 600;">Guidance Level</label>
                        <select class="preference-select" data-preference="learningProfile.guidance" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 5px;">
                            <option value="minimal" ${profile.learningProfile.guidance === 'minimal' ? 'selected' : ''}>Minimal</option>
                            <option value="moderate" ${profile.learningProfile.guidance === 'moderate' ? 'selected' : ''}>Moderate</option>
                            <option value="extensive" ${profile.learningProfile.guidance === 'extensive' ? 'selected' : ''}>Extensive</option>
                        </select>
                    </div>
                </div>
            </div>
        `;
    }
    
    generateMedicalContent(profile) {
        const medical = profile.medicalInfo;
        
        return `
            <div style="background: #f8f9fa; padding: 25px; border-radius: 15px; margin-bottom: 30px;">
                <h3 style="color: #2c3e50; margin-bottom: 20px;">🏥 Medical Information</h3>
                <div style="display: grid; gap: 20px;">
                    <div>
                        <label style="display: block; margin-bottom: 5px; font-weight: 600;">Medical Conditions</label>
                        <textarea class="medical-textarea" 
                                  data-medical="conditions" 
                                  placeholder="Enter medical conditions (one per line)"
                                  style="width: 100%; height: 100px; padding: 10px; border: 1px solid #ddd; border-radius: 5px; resize: vertical;">${medical.conditions.join('\n')}</textarea>
                    </div>
                    <div>
                        <label style="display: block; margin-bottom: 5px; font-weight: 600;">Medications</label>
                        <textarea class="medical-textarea" 
                                  data-medical="medications" 
                                  placeholder="Enter medications (one per line)"
                                  style="width: 100%; height: 100px; padding: 10px; border: 1px solid #ddd; border-radius: 5px; resize: vertical;">${medical.medications.join('\n')}</textarea>
                    </div>
                    <div>
                        <label style="display: block; margin-bottom: 5px; font-weight: 600;">Assistive Devices</label>
                        <textarea class="medical-textarea" 
                                  data-medical="assistiveDevices" 
                                  placeholder="Enter assistive devices (one per line)"
                                  style="width: 100%; height: 100px; padding: 10px; border: 1px solid #ddd; border-radius: 5px; resize: vertical;">${medical.assistiveDevices.join('\n')}</textarea>
                    </div>
                    <div>
                        <label style="display: block; margin-bottom: 5px; font-weight: 600;">Activity Restrictions</label>
                        <textarea class="medical-textarea" 
                                  data-medical="restrictions" 
                                  placeholder="Enter activity restrictions (one per line)"
                                  style="width: 100%; height: 100px; padding: 10px; border: 1px solid #ddd; border-radius: 5px; resize: vertical;">${medical.restrictions.join('\n')}</textarea>
                    </div>
                    <div>
                        <label style="display: block; margin-bottom: 5px; font-weight: 600;">Emergency Contact</label>
                        <input type="text" 
                               class="medical-input" 
                               data-medical="emergencyContact" 
                               placeholder="Emergency contact information"
                               value="${medical.emergencyContact || ''}"
                               style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
                    </div>
                </div>
            </div>
        `;
    }
    
    generateAnalysisContent(profile) {
        const analysis = this.userProfile.analyzeProfile();
        
        return `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px;">
                <!-- Strengths -->
                <div style="background: #d5f4e6; padding: 25px; border-radius: 15px; border-left: 4px solid #27ae60;">
                    <h3 style="color: #27ae60; margin-bottom: 20px;">💪 Strengths</h3>
                    ${analysis.strengths.length > 0 ? 
                        analysis.strengths.map(strength => `
                            <div style="margin-bottom: 15px; padding: 10px; background: white; border-radius: 8px;">
                                <div style="font-weight: 600; color: #2c3e50; text-transform: capitalize;">
                                    ${strength.ability.replace(/([A-Z])/g, ' $1').trim()}
                                </div>
                                <div style="font-size: 14px; color: #6c757d;">
                                    Score: ${strength.score}/10 (${strength.level})
                                </div>
                            </div>
                        `).join('') :
                        '<div style="color: #6c757d; font-style: italic;">No significant strengths identified</div>'
                    }
                </div>
                
                <!-- Weaknesses -->
                <div style="background: #fadbd8; padding: 25px; border-radius: 15px; border-left: 4px solid #e74c3c;">
                    <h3 style="color: #e74c3c; margin-bottom: 20px;">⚠️ Areas for Improvement</h3>
                    ${analysis.weaknesses.length > 0 ? 
                        analysis.weaknesses.map(weakness => `
                            <div style="margin-bottom: 15px; padding: 10px; background: white; border-radius: 8px;">
                                <div style="font-weight: 600; color: #2c3e50; text-transform: capitalize;">
                                    ${weakness.ability.replace(/([A-Z])/g, ' $1').trim()}
                                </div>
                                <div style="font-size: 14px; color: #6c757d;">
                                    Score: ${weakness.score}/10 (${weakness.level})
                                </div>
                            </div>
                        `).join('') :
                        '<div style="color: #6c757d; font-style: italic;">No significant weaknesses identified</div>'
                    }
                </div>
            </div>
            
            <!-- Recommendations -->
            <div style="background: #f8f9fa; padding: 25px; border-radius: 15px; margin-bottom: 30px;">
                <h3 style="color: #2c3e50; margin-bottom: 20px;">💡 Recommendations</h3>
                ${analysis.recommendations.length > 0 ? 
                    analysis.recommendations.map(rec => `
                        <div style="margin-bottom: 15px; padding: 15px; background: white; border-radius: 8px; border-left: 4px solid #3498db;">
                            <div style="font-weight: 600; color: #2c3e50; margin-bottom: 5px;">
                                ${rec.title}
                            </div>
                            <div style="color: #6c757d; margin-bottom: 10px;">
                                ${rec.description}
                            </div>
                            <div style="font-size: 12px; color: #95a5a6;">
                                Priority: ${rec.priority} | Type: ${rec.type}
                            </div>
                        </div>
                    `).join('') :
                    '<div style="color: #6c757d; font-style: italic;">No specific recommendations at this time</div>'
                }
            </div>
            
            <!-- Risk Factors -->
            <div style="background: #f8f9fa; padding: 25px; border-radius: 15px;">
                <h3 style="color: #2c3e50; margin-bottom: 20px;">🚨 Risk Factors</h3>
                ${analysis.riskFactors.length > 0 ? 
                    analysis.riskFactors.map(risk => `
                        <div style="margin-bottom: 15px; padding: 15px; background: white; border-radius: 8px; border-left: 4px solid #f39c12;">
                            <div style="font-weight: 600; color: #2c3e50; margin-bottom: 5px;">
                                ${risk.type.replace(/_/g, ' ').toUpperCase()}
                            </div>
                            <div style="color: #6c757d; margin-bottom: 10px;">
                                ${risk.description}
                            </div>
                            <div style="font-size: 12px; color: #95a5a6;">
                                Severity: ${risk.severity} | Mitigation: ${risk.mitigation}
                            </div>
                        </div>
                    `).join('') :
                    '<div style="color: #6c757d; font-style: italic;">No significant risk factors identified</div>'
                }
            </div>
        `;
    }
    
    setupManagerEventListeners() {
        // Close button
        const closeBtn = document.getElementById('close-profile-manager');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeManager());
        }
        
        // Tab navigation
        const tabs = document.querySelectorAll('.profile-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.dataset.tab;
                this.switchTab(tabName);
            });
        });
        
        // Ability sliders
        const abilitySliders = document.querySelectorAll('.ability-slider');
        abilitySliders.forEach(slider => {
            slider.addEventListener('input', (e) => {
                const ability = e.target.dataset.ability;
                const value = parseInt(e.target.value);
                this.updateAbility(ability, value);
            });
        });
        
        // Limitation sliders
        const limitationSliders = document.querySelectorAll('.limitation-slider');
        limitationSliders.forEach(slider => {
            slider.addEventListener('input', (e) => {
                const limitation = e.target.dataset.limitation;
                const value = parseInt(e.target.value);
                this.updateLimitation(limitation, value);
            });
        });
        
        // Preference selects
        const preferenceSelects = document.querySelectorAll('.preference-select');
        preferenceSelects.forEach(select => {
            select.addEventListener('change', (e) => {
                const preference = e.target.dataset.preference;
                const value = e.target.value;
                this.updatePreference(preference, value);
            });
        });
        
        // Preference checkboxes
        const preferenceCheckboxes = document.querySelectorAll('.preference-checkbox');
        preferenceCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const preference = e.target.dataset.preference;
                const value = e.target.checked;
                this.updatePreference(preference, value);
            });
        });
        
        // Medical inputs
        const medicalInputs = document.querySelectorAll('.medical-input, .medical-textarea');
        medicalInputs.forEach(input => {
            input.addEventListener('change', (e) => {
                const medical = e.target.dataset.medical;
                const value = e.target.value;
                this.updateMedicalInfo(medical, value);
            });
        });
    }
    
    switchTab(tabName) {
        // Update tab styles
        document.querySelectorAll('.profile-tab').forEach(tab => {
            tab.classList.remove('active');
            tab.style.color = '#6c757d';
            tab.style.borderBottomColor = 'transparent';
        });
        
        const activeTab = document.querySelector(`[data-tab="${tabName}"]`);
        if (activeTab) {
            activeTab.classList.add('active');
            activeTab.style.color = '#667eea';
            activeTab.style.borderBottomColor = '#667eea';
        }
        
        // Show/hide content
        document.querySelectorAll('.profile-content').forEach(content => {
            content.style.display = 'none';
        });
        
        const activeContent = document.getElementById(`${tabName}-tab`);
        if (activeContent) {
            activeContent.style.display = 'block';
        }
        
        this.currentTab = tabName;
    }
    
    updateAbility(ability, value) {
        this.userProfile.updateAbilities({ [ability]: value });
        this.updateDisplay();
    }
    
    updateLimitation(limitation, value) {
        const [category, property] = limitation.split('.');
        const updates = {};
        updates[category] = { ...this.userProfile.getProfile().physicalLimitations[category] };
        updates[category][property] = value;
        
        this.userProfile.updatePhysicalLimitations(updates);
        this.updateDisplay();
    }
    
    updatePreference(preference, value) {
        const [category, property] = preference.split('.');
        const updates = {};
        updates[category] = { ...this.userProfile.getProfile().sensoryPreferences[category] };
        updates[category][property] = value;
        
        this.userProfile.updateSensoryPreferences(updates);
    }
    
    updateMedicalInfo(medical, value) {
        const updates = { ...this.userProfile.getProfile().medicalInfo };
        
        if (medical === 'conditions' || medical === 'medications' || medical === 'assistiveDevices' || medical === 'restrictions') {
            updates[medical] = value.split('\n').filter(item => item.trim() !== '');
        } else {
            updates[medical] = value;
        }
        
        this.userProfile.updateMedicalInfo(updates);
    }
    
    updateDisplay() {
        if (this.isOpen && this.manager) {
            // Refresh the manager content
            this.manager.innerHTML = this.generateManagerHTML();
            this.setupManagerEventListeners();
        }
    }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProfileManager;
}
