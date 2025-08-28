import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { KeyboardControls, Loader } from "@react-three/drei";
import { NavigationHub } from "./components/3d/NavigationHub";
import { DomainSpace } from "./components/3d/DomainSpace";
import { ChatInterface } from "./components/ui/ChatInterface";
import { VoiceControls } from "./components/ui/VoiceControls";
import { ProgressTracker } from "./components/ui/ProgressTracker";
import { AccessibilityControls } from "./components/ui/AccessibilityControls";
import { ImpactVisualizer } from "./components/ui/ImpactVisualizer";
import { QuickActions } from "./components/ui/QuickActions";
import { AdvancedSettings } from "./components/ui/AdvancedSettings";
import { AvatarQuickPicker } from "./components/ui/AvatarQuickPicker";
import { useAvatars } from "./lib/stores/useAvatars";
import { useAudio } from "./lib/stores/useAudio";
import { useVoice } from "./lib/stores/useVoice";
import "@fontsource/inter";

// Define control keys for navigation
enum Controls {
  forward = 'forward',
  backward = 'backward',
  leftward = 'leftward',
  rightward = 'rightward',
  interact = 'interact',
  escape = 'escape'
}

const controls = [
  { name: Controls.forward, keys: ['KeyW', 'ArrowUp'] },
  { name: Controls.backward, keys: ['KeyS', 'ArrowDown'] },
  { name: Controls.leftward, keys: ['KeyA', 'ArrowLeft'] },
  { name: Controls.rightward, keys: ['KeyD', 'ArrowRight'] },
  { name: Controls.interact, keys: ['Space', 'Enter'] },
  { name: Controls.escape, keys: ['Escape'] }
];

function App() {
  const { activeAvatar, clearSelection } = useAvatars();
  const { accessibilitySettings } = useVoice();
  const [showCanvas, setShowCanvas] = useState(false);

  // Initialize audio
  useEffect(() => {
    const { playSuccess } = useAudio.getState();
    // Play welcome sound on load
    setTimeout(() => {
      playSuccess();
    }, 1000);
  }, []);

  // Show the canvas once everything is loaded
  useEffect(() => {
    setShowCanvas(true);
  }, []);

  // Handle keyboard shortcuts for accessibility
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Log keyboard events for debugging
      console.log('Key pressed:', event.key, event.code);
      
      if (event.key === 'Escape' && activeAvatar) {
        clearSelection();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [activeAvatar, clearSelection]);

  const canvasProps = {
    shadows: true,
    camera: {
      position: [0, 5, 10] as [number, number, number],
      fov: 60,
      near: 0.1,
      far: 1000
    },
    gl: {
      antialias: true,
      powerPreference: "default" as const
    },
    style: { 
      background: 'radial-gradient(circle at center, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)'
    }
  };

  return (
    <div 
      style={{ 
        width: '100vw', 
        height: '100vh', 
        position: 'relative', 
        overflow: 'hidden',
        fontFamily: 'Inter, sans-serif'
      }}
      className={accessibilitySettings.reducedMotion ? 'reduced-motion' : ''}
    >
      <AccessibilityControls />
      
      {showCanvas && (
        <KeyboardControls map={controls}>
          <Canvas {...canvasProps}>
            <Suspense fallback={null}>
              {!activeAvatar ? (
                <NavigationHub />
              ) : (
                <DomainSpace 
                  avatar={activeAvatar} 
                  onBack={clearSelection}
                />
              )}
            </Suspense>
          </Canvas>
          
          <Loader 
            containerStyles={{ 
              background: 'rgba(0, 0, 0, 0.9)',
              color: 'white'
            }}
            innerStyles={{ 
              background: '#3B82F6',
              color: 'white'
            }}
            barStyles={{ 
              background: '#60A5FA'
            }}
            dataStyles={{ 
              color: '#E5E7EB',
              fontSize: '14px'
            }}
          />
        </KeyboardControls>
      )}

      {/* UI Overlays */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="pointer-events-auto">
          {/* Welcome Message */}
          {!activeAvatar && (
            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Social Impact Hub
              </h1>
              <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8 px-4">
                Connect with AI specialists dedicated to creating positive change in education, healthcare, mental wellness, careers, and environmental sustainability
              </p>
              <div className="text-sm text-gray-400 space-y-1">
                <p>🎮 Use WASD or arrow keys to explore</p>
                <p>🖱️ Click on avatars to start conversations</p>
                <p>🎤 Voice controls available in settings</p>
              </div>
            </div>
          )}

          {/* Quick avatar picker */}
          {!activeAvatar && (
            <AvatarQuickPicker />
          )}

          {/* Chat Interface */}
          <div className="absolute top-4 left-4">
            <ChatInterface />
          </div>

          {/* Control Panels */}
          <VoiceControls />
          <ProgressTracker />
          <ImpactVisualizer />
          <QuickActions />
          <AdvancedSettings />
          
          {/* Help Instructions */}
          {!activeAvatar && (
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
              <div className="bg-gray-900/80 rounded-lg px-6 py-3 backdrop-blur-sm">
                <p className="text-gray-300 text-sm text-center">
                  Explore the hub and click on any AI specialist to begin your journey toward positive impact
                </p>
              </div>
            </div>
          )}
          
          {/* Back instruction when in domain space */}
          {activeAvatar && (
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
              <div className="bg-gray-900/80 rounded-lg px-6 py-3 backdrop-blur-sm">
                <p className="text-gray-300 text-sm text-center">
                  Press ESC or click the Back button to return to the main hub
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
