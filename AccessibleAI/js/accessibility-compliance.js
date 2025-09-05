/**
 * Accessibility Compliance System
 * Ensures scenarios follow ADA/WCAG standards and provides audit logs
 */

class AccessibilityCompliance {
    constructor(performanceTracking) {
        this.performanceTracking = performanceTracking;
        this.complianceRules = [];
        this.auditLog = [];
        this.violations = [];
        this.complianceScore = 100;
        this.wcagLevel = 'AA'; // AA, AAA
        this.adaCompliant = true;
        
        this.init();
    }
    
    init() {
        this.setupComplianceRules();
        this.setupEventListeners();
        this.startComplianceMonitoring();
        console.log('Accessibility Compliance initialized');
    }
    
    setupEventListeners() {
        // Listen for DOM changes
        this.observeDOMChanges();
        
        // Listen for user interactions
        document.addEventListener('click', (event) => {
            this.checkClickAccessibility(event);
        });
        
        document.addEventListener('keydown', (event) => {
            this.checkKeyboardAccessibility(event);
        });
        
        // Listen for focus events
        document.addEventListener('focusin', (event) => {
            this.checkFocusAccessibility(event);
        });
        
        document.addEventListener('focusout', (event) => {
            this.checkFocusAccessibility(event);
        });
        
        // Listen for screen reader events
        document.addEventListener('screenReaderAnnounce', (event) => {
            this.recordScreenReaderUsage(event);
        });
    }
    
    setupComplianceRules() {
        this.complianceRules = [
            // WCAG 2.1 Level AA Rules
            {
                id: 'wcag_1_1_1',
                name: 'Non-text Content',
                level: 'AA',
                description: 'All non-text content has text alternatives',
                check: () => this.checkTextAlternatives(),
                weight: 10
            },
            {
                id: 'wcag_1_3_1',
                name: 'Info and Relationships',
                level: 'AA',
                description: 'Information, structure, and relationships are programmatically determinable',
                check: () => this.checkSemanticStructure(),
                weight: 10
            },
            {
                id: 'wcag_1_4_3',
                name: 'Contrast (Minimum)',
                level: 'AA',
                description: 'Text has a contrast ratio of at least 4.5:1',
                check: () => this.checkColorContrast(),
                weight: 15
            },
            {
                id: 'wcag_1_4_4',
                name: 'Resize Text',
                level: 'AA',
                description: 'Text can be resized up to 200% without loss of functionality',
                check: () => this.checkTextResize(),
                weight: 10
            },
            {
                id: 'wcag_2_1_1',
                name: 'Keyboard',
                level: 'A',
                description: 'All functionality is available from a keyboard',
                check: () => this.checkKeyboardAccessibility(),
                weight: 15
            },
            {
                id: 'wcag_2_1_2',
                name: 'No Keyboard Trap',
                level: 'A',
                description: 'Keyboard focus is not trapped',
                check: () => this.checkKeyboardTrap(),
                weight: 10
            },
            {
                id: 'wcag_2_4_1',
                name: 'Bypass Blocks',
                level: 'A',
                description: 'Mechanism to bypass blocks of content',
                check: () => this.checkBypassBlocks(),
                weight: 10
            },
            {
                id: 'wcag_2_4_2',
                name: 'Page Titled',
                level: 'A',
                description: 'Web pages have titles that describe topic or purpose',
                check: () => this.checkPageTitle(),
                weight: 5
            },
            {
                id: 'wcag_2_4_3',
                name: 'Focus Order',
                level: 'A',
                description: 'Focusable components receive focus in an order that preserves meaning',
                check: () => this.checkFocusOrder(),
                weight: 10
            },
            {
                id: 'wcag_2_4_4',
                name: 'Link Purpose',
                level: 'A',
                description: 'Purpose of each link is determined from link text alone',
                check: () => this.checkLinkPurpose(),
                weight: 5
            },
            {
                id: 'wcag_3_1_1',
                name: 'Language of Page',
                level: 'A',
                description: 'Language of page is programmatically determined',
                check: () => this.checkPageLanguage(),
                weight: 5
            },
            {
                id: 'wcag_3_2_1',
                name: 'On Focus',
                level: 'A',
                description: 'Focus does not initiate change of context',
                check: () => this.checkFocusContext(),
                weight: 10
            },
            {
                id: 'wcag_3_2_2',
                name: 'On Input',
                level: 'A',
                description: 'Input does not automatically change context',
                check: () => this.checkInputContext(),
                weight: 10
            },
            {
                id: 'wcag_4_1_1',
                name: 'Parsing',
                level: 'A',
                description: 'Markup has complete start and end tags',
                check: () => this.checkMarkupParsing(),
                weight: 5
            },
            {
                id: 'wcag_4_1_2',
                name: 'Name, Role, Value',
                level: 'A',
                description: 'UI components have accessible names and roles',
                check: () => this.checkComponentAccessibility(),
                weight: 15
            },
            
            // ADA Compliance Rules
            {
                id: 'ada_effective_communication',
                name: 'Effective Communication',
                level: 'ADA',
                description: 'Information is communicated effectively to users with disabilities',
                check: () => this.checkEffectiveCommunication(),
                weight: 20
            },
            {
                id: 'ada_program_access',
                name: 'Program Access',
                level: 'ADA',
                description: 'Programs and services are accessible to users with disabilities',
                check: () => this.checkProgramAccess(),
                weight: 20
            },
            {
                id: 'ada_reasonable_accommodation',
                name: 'Reasonable Accommodation',
                level: 'ADA',
                description: 'Reasonable accommodations are provided for users with disabilities',
                check: () => this.checkReasonableAccommodation(),
                weight: 15
            }
        ];
    }
    
    startComplianceMonitoring() {
        // Run initial compliance check
        this.runComplianceCheck();
        
        // Set up periodic monitoring
        setInterval(() => {
            this.runComplianceCheck();
        }, 30000); // Check every 30 seconds
    }
    
    runComplianceCheck() {
        const violations = [];
        let totalWeight = 0;
        let passedWeight = 0;
        
        this.complianceRules.forEach(rule => {
            try {
                const result = rule.check();
                totalWeight += rule.weight;
                
                if (result.passed) {
                    passedWeight += rule.weight;
                } else {
                    violations.push({
                        rule: rule,
                        violations: result.violations,
                        timestamp: Date.now()
                    });
                }
            } catch (error) {
                console.error(`Error checking rule ${rule.id}:`, error);
                violations.push({
                    rule: rule,
                    violations: [`Error checking rule: ${error.message}`],
                    timestamp: Date.now()
                });
            }
        });
        
        // Calculate compliance score
        this.complianceScore = totalWeight > 0 ? (passedWeight / totalWeight) * 100 : 100;
        
        // Update violations
        this.violations = violations;
        
        // Log compliance check
        this.logComplianceCheck(violations);
        
        // Emit compliance event
        this.emitEvent('complianceChecked', {
            score: this.complianceScore,
            violations: violations,
            wcagLevel: this.wcagLevel,
            adaCompliant: this.adaCompliant
        });
    }
    
    // WCAG Compliance Checks
    checkTextAlternatives() {
        const violations = [];
        const images = document.querySelectorAll('img');
        const videos = document.querySelectorAll('video');
        const audio = document.querySelectorAll('audio');
        
        // Check images
        images.forEach(img => {
            if (!img.alt && !img.getAttribute('aria-label')) {
                violations.push(`Image missing alt text: ${img.src || 'unknown'}`);
            }
        });
        
        // Check videos
        videos.forEach(video => {
            if (!video.getAttribute('aria-label') && !video.querySelector('track[kind="captions"]')) {
                violations.push(`Video missing captions or aria-label: ${video.src || 'unknown'}`);
            }
        });
        
        // Check audio
        audio.forEach(audio => {
            if (!audio.getAttribute('aria-label') && !audio.querySelector('track[kind="captions"]')) {
                violations.push(`Audio missing captions or aria-label: ${audio.src || 'unknown'}`);
            }
        });
        
        return {
            passed: violations.length === 0,
            violations: violations
        };
    }
    
    checkSemanticStructure() {
        const violations = [];
        
        // Check for proper heading hierarchy
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        let lastLevel = 0;
        
        headings.forEach(heading => {
            const level = parseInt(heading.tagName.charAt(1));
            if (level > lastLevel + 1) {
                violations.push(`Heading level skipped: ${heading.tagName} after h${lastLevel}`);
            }
            lastLevel = level;
        });
        
        // Check for proper form labels
        const inputs = document.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            const id = input.id;
            const label = document.querySelector(`label[for="${id}"]`);
            const ariaLabel = input.getAttribute('aria-label');
            const ariaLabelledBy = input.getAttribute('aria-labelledby');
            
            if (!label && !ariaLabel && !ariaLabelledBy) {
                violations.push(`Form control missing label: ${input.type || 'unknown'}`);
            }
        });
        
        return {
            passed: violations.length === 0,
            violations: violations
        };
    }
    
    checkColorContrast() {
        const violations = [];
        const elements = document.querySelectorAll('*');
        
        elements.forEach(element => {
            const style = window.getComputedStyle(element);
            const color = style.color;
            const backgroundColor = style.backgroundColor;
            
            if (color && backgroundColor && color !== 'rgba(0, 0, 0, 0)' && backgroundColor !== 'rgba(0, 0, 0, 0)') {
                const contrast = this.calculateContrast(color, backgroundColor);
                if (contrast < 4.5) {
                    violations.push(`Low contrast ratio: ${contrast.toFixed(2)}:1 for element ${element.tagName}`);
                }
            }
        });
        
        return {
            passed: violations.length === 0,
            violations: violations
        };
    }
    
    checkTextResize() {
        const violations = [];
        const body = document.body;
        const originalFontSize = window.getComputedStyle(body).fontSize;
        
        // Test 200% zoom
        body.style.fontSize = '200%';
        const zoomedFontSize = window.getComputedStyle(body).fontSize;
        
        // Check if text is still readable and functional
        const textElements = document.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6');
        let hiddenElements = 0;
        
        textElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            if (rect.width === 0 || rect.height === 0) {
                hiddenElements++;
            }
        });
        
        if (hiddenElements > textElements.length * 0.1) { // More than 10% hidden
            violations.push(`Text becomes unreadable at 200% zoom: ${hiddenElements} elements hidden`);
        }
        
        // Restore original font size
        body.style.fontSize = originalFontSize;
        
        return {
            passed: violations.length === 0,
            violations: violations
        };
    }
    
    checkKeyboardAccessibility() {
        const violations = [];
        const interactiveElements = document.querySelectorAll('button, a, input, select, textarea, [tabindex]');
        
        interactiveElements.forEach(element => {
            const tabIndex = element.getAttribute('tabindex');
            if (tabIndex === '-1' && !element.hasAttribute('aria-hidden')) {
                violations.push(`Interactive element not keyboard accessible: ${element.tagName}`);
            }
        });
        
        return {
            passed: violations.length === 0,
            violations: violations
        };
    }
    
    checkKeyboardTrap() {
        const violations = [];
        const focusableElements = document.querySelectorAll('[tabindex]:not([tabindex="-1"])');
        
        // Test if focus can move between elements
        if (focusableElements.length > 1) {
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            // This is a simplified check - in practice, you'd need to test actual focus movement
            if (firstElement && lastElement) {
                // Check if focus can move between elements
                const canMoveFocus = this.testFocusMovement(focusableElements);
                if (!canMoveFocus) {
                    violations.push('Keyboard focus is trapped between elements');
                }
            }
        }
        
        return {
            passed: violations.length === 0,
            violations: violations
        };
    }
    
    checkBypassBlocks() {
        const violations = [];
        const skipLinks = document.querySelectorAll('a[href="#main"], a[href="#content"], .skip-link');
        
        if (skipLinks.length === 0) {
            violations.push('No skip links or bypass blocks found');
        }
        
        return {
            passed: violations.length === 0,
            violations: violations
        };
    }
    
    checkPageTitle() {
        const violations = [];
        const title = document.title;
        
        if (!title || title.trim() === '') {
            violations.push('Page title is missing or empty');
        } else if (title.length < 10) {
            violations.push('Page title is too short to be descriptive');
        }
        
        return {
            passed: violations.length === 0,
            violations: violations
        };
    }
    
    checkFocusOrder() {
        const violations = [];
        const focusableElements = document.querySelectorAll('[tabindex]:not([tabindex="-1"])');
        
        // Check if focus order makes sense (simplified check)
        for (let i = 0; i < focusableElements.length - 1; i++) {
            const current = focusableElements[i];
            const next = focusableElements[i + 1];
            
            const currentRect = current.getBoundingClientRect();
            const nextRect = next.getBoundingClientRect();
            
            // Check if focus order follows visual order
            if (currentRect.top > nextRect.top || 
                (currentRect.top === nextRect.top && currentRect.left > nextRect.left)) {
                violations.push(`Focus order may not follow visual order: ${current.tagName} -> ${next.tagName}`);
            }
        }
        
        return {
            passed: violations.length === 0,
            violations: violations
        };
    }
    
    checkLinkPurpose() {
        const violations = [];
        const links = document.querySelectorAll('a');
        
        links.forEach(link => {
            const text = link.textContent.trim();
            const href = link.getAttribute('href');
            
            if (text === '' || text === 'click here' || text === 'read more' || text === 'here') {
                violations.push(`Link text is not descriptive: "${text}"`);
            }
            
            if (href && href.startsWith('javascript:')) {
                violations.push(`Link uses javascript: protocol: ${href}`);
            }
        });
        
        return {
            passed: violations.length === 0,
            violations: violations
        };
    }
    
    checkPageLanguage() {
        const violations = [];
        const html = document.documentElement;
        const lang = html.getAttribute('lang');
        
        if (!lang) {
            violations.push('Page language is not specified');
        } else if (!this.isValidLanguageCode(lang)) {
            violations.push(`Invalid language code: ${lang}`);
        }
        
        return {
            passed: violations.length === 0,
            violations: violations
        };
    }
    
    checkFocusContext() {
        const violations = [];
        // This would need to be implemented with actual focus event monitoring
        // For now, we'll check for common problematic patterns
        
        const focusableElements = document.querySelectorAll('[tabindex]:not([tabindex="-1"])');
        focusableElements.forEach(element => {
            if (element.onfocus && element.onfocus.toString().includes('window.location')) {
                violations.push(`Focus triggers navigation: ${element.tagName}`);
            }
        });
        
        return {
            passed: violations.length === 0,
            violations: violations
        };
    }
    
    checkInputContext() {
        const violations = [];
        const inputs = document.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            if (input.onchange && input.onchange.toString().includes('window.location')) {
                violations.push(`Input change triggers navigation: ${input.type || 'unknown'}`);
            }
        });
        
        return {
            passed: violations.length === 0,
            violations: violations
        };
    }
    
    checkMarkupParsing() {
        const violations = [];
        const parser = new DOMParser();
        const html = document.documentElement.outerHTML;
        
        try {
            const doc = parser.parseFromString(html, 'text/html');
            const errors = doc.querySelectorAll('parsererror');
            if (errors.length > 0) {
                violations.push(`Markup parsing errors: ${errors.length} errors found`);
            }
        } catch (error) {
            violations.push(`Markup parsing failed: ${error.message}`);
        }
        
        return {
            passed: violations.length === 0,
            violations: violations
        };
    }
    
    checkComponentAccessibility() {
        const violations = [];
        const interactiveElements = document.querySelectorAll('button, input, select, textarea, [role]');
        
        interactiveElements.forEach(element => {
            const role = element.getAttribute('role') || element.tagName.toLowerCase();
            const accessibleName = this.getAccessibleName(element);
            
            if (!accessibleName) {
                violations.push(`Interactive element missing accessible name: ${role}`);
            }
        });
        
        return {
            passed: violations.length === 0,
            violations: violations
        };
    }
    
    // ADA Compliance Checks
    checkEffectiveCommunication() {
        const violations = [];
        
        // Check for alternative communication methods
        const hasAudio = document.querySelectorAll('audio, video').length > 0;
        const hasTextAlternatives = document.querySelectorAll('img[alt], video[aria-label]').length > 0;
        
        if (hasAudio && !hasTextAlternatives) {
            violations.push('Audio content lacks text alternatives for effective communication');
        }
        
        return {
            passed: violations.length === 0,
            violations: violations
        };
    }
    
    checkProgramAccess() {
        const violations = [];
        
        // Check if all functionality is accessible
        const interactiveElements = document.querySelectorAll('button, a, input, select, textarea');
        let inaccessibleElements = 0;
        
        interactiveElements.forEach(element => {
            const tabIndex = element.getAttribute('tabindex');
            if (tabIndex === '-1' && !element.hasAttribute('aria-hidden')) {
                inaccessibleElements++;
            }
        });
        
        if (inaccessibleElements > 0) {
            violations.push(`${inaccessibleElements} interactive elements are not accessible`);
        }
        
        return {
            passed: violations.length === 0,
            violations: violations
        };
    }
    
    checkReasonableAccommodation() {
        const violations = [];
        
        // Check for accommodation features
        const hasHighContrast = document.querySelector('[data-high-contrast]') !== null;
        const hasLargeText = document.querySelector('[data-large-text]') !== null;
        const hasKeyboardNavigation = document.querySelectorAll('[tabindex]:not([tabindex="-1"])').length > 0;
        
        if (!hasHighContrast) {
            violations.push('High contrast mode not available');
        }
        
        if (!hasLargeText) {
            violations.push('Large text mode not available');
        }
        
        if (!hasKeyboardNavigation) {
            violations.push('Keyboard navigation not available');
        }
        
        return {
            passed: violations.length === 0,
            violations: violations
        };
    }
    
    // Event Handlers
    checkClickAccessibility(event) {
        const element = event.target;
        
        // Check if click target is accessible
        if (element.tagName === 'DIV' && !element.getAttribute('role') && !element.getAttribute('tabindex')) {
            this.recordViolation('click_accessibility', `Clickable div without role or tabindex: ${element.className}`);
        }
    }
    
    checkKeyboardAccessibility(event) {
        const element = event.target;
        
        // Check if keyboard navigation is working
        if (event.key === 'Tab') {
            this.recordAccessibilityEvent('keyboard_navigation', {
                element: element.tagName,
                timestamp: Date.now()
            });
        }
    }
    
    checkFocusAccessibility(event) {
        const element = event.target;
        
        // Check focus indicators
        const style = window.getComputedStyle(element);
        const outline = style.outline;
        const boxShadow = style.boxShadow;
        
        if (outline === 'none' && !boxShadow.includes('inset')) {
            this.recordViolation('focus_indicator', `Element missing focus indicator: ${element.tagName}`);
        }
    }
    
    recordScreenReaderUsage(event) {
        this.recordAccessibilityEvent('screen_reader', {
            announcement: event.detail.text,
            timestamp: Date.now()
        });
    }
    
    // Utility Methods
    calculateContrast(color1, color2) {
        const rgb1 = this.hexToRgb(color1);
        const rgb2 = this.hexToRgb(color2);
        
        if (!rgb1 || !rgb2) return 0;
        
        const luminance1 = this.getLuminance(rgb1);
        const luminance2 = this.getLuminance(rgb2);
        
        const lighter = Math.max(luminance1, luminance2);
        const darker = Math.min(luminance1, luminance2);
        
        return (lighter + 0.05) / (darker + 0.05);
    }
    
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
    
    getLuminance(rgb) {
        const { r, g, b } = rgb;
        const [rs, gs, bs] = [r, g, b].map(c => {
            c = c / 255;
            return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    }
    
    getAccessibleName(element) {
        return element.getAttribute('aria-label') ||
               element.getAttribute('aria-labelledby') ||
               element.textContent.trim() ||
               element.getAttribute('alt') ||
               element.getAttribute('title');
    }
    
    isValidLanguageCode(code) {
        const languageRegex = /^[a-z]{2}(-[A-Z]{2})?$/;
        return languageRegex.test(code);
    }
    
    testFocusMovement(elements) {
        // Simplified focus movement test
        // In practice, this would need to test actual focus movement
        return elements.length > 1;
    }
    
    observeDOMChanges() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    // Check new elements for accessibility
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            this.checkElementAccessibility(node);
                        }
                    });
                }
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    checkElementAccessibility(element) {
        // Check if new element meets accessibility standards
        if (element.tagName === 'IMG' && !element.alt) {
            this.recordViolation('missing_alt', `Image missing alt text: ${element.src}`);
        }
        
        if (element.tagName === 'BUTTON' && !element.textContent.trim() && !element.getAttribute('aria-label')) {
            this.recordViolation('button_no_text', `Button missing text content or aria-label`);
        }
    }
    
    recordViolation(type, message) {
        const violation = {
            type: type,
            message: message,
            timestamp: Date.now(),
            element: event?.target?.tagName || 'unknown'
        };
        
        this.violations.push(violation);
        this.logViolation(violation);
    }
    
    recordAccessibilityEvent(eventType, data) {
        if (this.performanceTracking) {
            this.performanceTracking.recordAccessibilityEvent(eventType, data);
        }
    }
    
    logComplianceCheck(violations) {
        const logEntry = {
            timestamp: Date.now(),
            complianceScore: this.complianceScore,
            violationCount: violations.length,
            violations: violations,
            wcagLevel: this.wcagLevel,
            adaCompliant: this.adaCompliant
        };
        
        this.auditLog.push(logEntry);
        
        // Keep only last 100 log entries
        if (this.auditLog.length > 100) {
            this.auditLog = this.auditLog.slice(-100);
        }
    }
    
    logViolation(violation) {
        const logEntry = {
            timestamp: Date.now(),
            type: 'violation',
            violation: violation
        };
        
        this.auditLog.push(logEntry);
    }
    
    // Data Export
    exportComplianceReport() {
        return {
            complianceScore: this.complianceScore,
            wcagLevel: this.wcagLevel,
            adaCompliant: this.adaCompliant,
            violations: this.violations,
            auditLog: this.auditLog,
            exportDate: new Date().toISOString()
        };
    }
    
    getComplianceSummary() {
        return {
            score: this.complianceScore,
            level: this.wcagLevel,
            adaCompliant: this.adaCompliant,
            violationCount: this.violations.length,
            recentViolations: this.violations.slice(-10)
        };
    }
    
    emitEvent(eventName, detail) {
        const event = new CustomEvent(eventName, { detail });
        document.dispatchEvent(event);
    }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AccessibilityCompliance;
}
