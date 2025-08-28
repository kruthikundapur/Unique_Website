import { useEffect } from 'react';
import { useVoice } from '../../lib/stores/useVoice';

export function AccessibilityControls() {
  const { accessibilitySettings } = useVoice();

  useEffect(() => {
    const root = document.documentElement;
    
    // Apply high contrast mode
    if (accessibilitySettings.highContrast) {
      root.style.filter = 'contrast(1.5) brightness(1.1)';
    } else {
      root.style.filter = 'none';
    }
    
    // Apply large text
    if (accessibilitySettings.largeText) {
      root.style.fontSize = '118%';
    } else {
      root.style.fontSize = '100%';
    }
    
    // Apply reduced motion
    if (accessibilitySettings.reducedMotion) {
      const style = document.createElement('style');
      style.textContent = `
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      `;
      document.head.appendChild(style);
      
      return () => {
        document.head.removeChild(style);
      };
    }
  }, [accessibilitySettings]);

  // Screen reader announcements
  useEffect(() => {
    if (accessibilitySettings.screenReaderMode) {
      const announceElement = document.createElement('div');
      announceElement.setAttribute('aria-live', 'polite');
      announceElement.setAttribute('aria-atomic', 'true');
      announceElement.className = 'sr-only';
      announceElement.id = 'accessibility-announcer';
      document.body.appendChild(announceElement);
      
      return () => {
        const element = document.getElementById('accessibility-announcer');
        if (element) {
          document.body.removeChild(element);
        }
      };
    }
  }, [accessibilitySettings.screenReaderMode]);

  // Keyboard navigation enhancement
  useEffect(() => {
    if (accessibilitySettings.keyboardNavigation) {
      const handleKeyNavigation = (event: KeyboardEvent) => {
        // Add custom keyboard shortcuts
        if (event.ctrlKey || event.metaKey) {
          switch (event.key) {
            case 'h':
              // Focus on help/instructions
              event.preventDefault();
              const helpButton = document.querySelector('[aria-label*="help"]') as HTMLElement;
              helpButton?.focus();
              break;
            case 'm':
              // Toggle voice/mute
              event.preventDefault();
              const voiceButton = document.querySelector('[aria-label*="voice"]') as HTMLElement;
              voiceButton?.click();
              break;
            case '/':
              // Focus on search/input
              event.preventDefault();
              const input = document.querySelector('input[type="text"]') as HTMLElement;
              input?.focus();
              break;
          }
        }
        
        // Escape key to close modals/panels
        if (event.key === 'Escape') {
          const closeButtons = document.querySelectorAll('[aria-label*="close"], [aria-label*="dismiss"]');
          const lastCloseButton = closeButtons[closeButtons.length - 1] as HTMLElement;
          lastCloseButton?.click();
        }
      };

      document.addEventListener('keydown', handleKeyNavigation);
      
      // Add visible focus indicators
      const style = document.createElement('style');
      style.textContent = `
        *:focus {
          outline: 2px solid #3B82F6 !important;
          outline-offset: 2px !important;
        }
        
        .focus-trap {
          position: relative;
        }
        
        .skip-link {
          position: absolute;
          top: -40px;
          left: 6px;
          background: #000;
          color: white;
          padding: 8px;
          text-decoration: none;
          z-index: 1000;
          border-radius: 4px;
        }
        
        .skip-link:focus {
          top: 6px;
        }
      `;
      document.head.appendChild(style);
      
      // Add skip link
      const skipLink = document.createElement('a');
      skipLink.href = '#main-content';
      skipLink.className = 'skip-link';
      skipLink.textContent = 'Skip to main content';
      document.body.insertBefore(skipLink, document.body.firstChild);
      
      return () => {
        document.removeEventListener('keydown', handleKeyNavigation);
        document.head.removeChild(style);
        skipLink.remove();
      };
    }
  }, [accessibilitySettings.keyboardNavigation]);

  return (
    <>
      {/* Screen reader only content */}
      <div className="sr-only">
        <h1>Social Impact Hub - AI-Powered Platform for Positive Change</h1>
        <p>
          Navigate through different social impact domains using Tab key. 
          Press Enter to interact with AI specialists. 
          Use Ctrl+H for help, Ctrl+M for voice settings, Ctrl+/ to focus input.
        </p>
      </div>
      
      {/* Focus trap for modals */}
      <div className="focus-trap" tabIndex={-1} />
      
      {/* Main content landmark */}
      <main id="main-content" className="sr-only">
        <h2>Interactive 3D Environment</h2>
        <p>Use arrow keys or WASD to navigate the 3D space. Click or press Enter on avatars to start conversations.</p>
      </main>
    </>
  );
}
