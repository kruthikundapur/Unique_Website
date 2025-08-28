import { useState } from 'react';
import { Card } from './card';
import { Button } from './button';
import { Switch } from './switch';
import { Slider } from './slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Badge } from './badge';
import { Separator } from './separator';
import { 
  Settings, 
  Palette, 
  Eye, 
  Zap, 
  Volume2, 
  Monitor,
  Gamepad2,
  Database,
  Download,
  Upload,
  RotateCcw
} from 'lucide-react';
import { useVoice } from '../../lib/stores/useVoice';
import { useProgress } from '../../lib/stores/useProgress';

interface GraphicsSettings {
  particleCount: number;
  visualEffects: boolean;
  holographicIntensity: number;
  backgroundComplexity: 'low' | 'medium' | 'high';
  frameRate: 30 | 60 | 120;
}

interface ThemeSettings {
  primaryColor: string;
  accentColor: string;
  backgroundStyle: 'gradient' | 'solid' | 'starfield' | 'nebula';
  glowEffects: boolean;
}

export function AdvancedSettings() {
  const { 
    voiceSettings, 
    accessibilitySettings,
    updateVoiceSettings, 
    updateAccessibilitySettings 
  } = useVoice();
  const { progress } = useProgress();
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'graphics' | 'theme' | 'performance' | 'data'>('graphics');
  
  const [graphicsSettings, setGraphicsSettings] = useState<GraphicsSettings>({
    particleCount: 300,
    visualEffects: true,
    holographicIntensity: 0.7,
    backgroundComplexity: 'medium',
    frameRate: 60
  });

  const [themeSettings, setThemeSettings] = useState<ThemeSettings>({
    primaryColor: '#3B82F6',
    accentColor: '#8B5CF6',
    backgroundStyle: 'gradient',
    glowEffects: true
  });

  const exportData = () => {
    const exportData = {
      progress,
      voiceSettings,
      accessibilitySettings,
      graphicsSettings,
      themeSettings,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `social-impact-hub-settings-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.voiceSettings) updateVoiceSettings(data.voiceSettings);
        if (data.accessibilitySettings) updateAccessibilitySettings(data.accessibilitySettings);
        if (data.graphicsSettings) setGraphicsSettings(data.graphicsSettings);
        if (data.themeSettings) setThemeSettings(data.themeSettings);
        alert('Settings imported successfully!');
      } catch (error) {
        alert('Invalid settings file');
      }
    };
    reader.readAsText(file);
  };

  const resetToDefaults = () => {
    if (confirm('Reset all settings to defaults? This cannot be undone.')) {
      updateVoiceSettings({
        enabled: true,
        language: 'en-US',
        rate: 1,
        pitch: 1,
        volume: 0.8
      });
      updateAccessibilitySettings({
        highContrast: false,
        largeText: false,
        screenReaderMode: false,
        keyboardNavigation: true,
        reducedMotion: false
      });
      setGraphicsSettings({
        particleCount: 300,
        visualEffects: true,
        holographicIntensity: 0.7,
        backgroundComplexity: 'medium',
        frameRate: 60
      });
      setThemeSettings({
        primaryColor: '#3B82F6',
        accentColor: '#8B5CF6',
        backgroundStyle: 'gradient',
        glowEffects: true
      });
    }
  };

  if (!isExpanded) {
    return (
      <div className="fixed top-4 right-96">
        <Button
          onClick={() => setIsExpanded(true)}
          variant="outline"
          size="sm"
          className="bg-gray-900/90 border-gray-700 text-white hover:bg-gray-800"
        >
          <Settings className="h-4 w-4 mr-2" />
          Advanced
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-96 z-50">
      <Card className="w-96 max-h-[80vh] overflow-y-auto bg-gray-900/95 border-gray-700 backdrop-blur-sm">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-xl text-white flex items-center">
              <Settings className="h-5 w-5 mr-2 text-blue-400" />
              Advanced Settings
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(false)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </Button>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-1 mb-4 p-1 bg-gray-800 rounded-lg">
            {[
              { id: 'graphics' as const, icon: Eye, label: 'Graphics' },
              { id: 'theme' as const, icon: Palette, label: 'Theme' },
              { id: 'performance' as const, icon: Zap, label: 'Performance' },
              { id: 'data' as const, icon: Database, label: 'Data' }
            ].map(({ id, icon: Icon, label }) => (
              <Button
                key={id}
                variant={activeTab === id ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab(id)}
                className={`flex-1 ${activeTab === id ? 'bg-blue-600 text-white' : 'text-gray-400'}`}
              >
                <Icon className="h-3 w-3 mr-1" />
                {label}
              </Button>
            ))}
          </div>

          {/* Graphics Settings */}
          {activeTab === 'graphics' && (
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Graphics & Visual Effects</h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Visual Effects</span>
                  <Switch
                    checked={graphicsSettings.visualEffects}
                    onCheckedChange={(checked) => 
                      setGraphicsSettings(prev => ({ ...prev, visualEffects: checked }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm text-gray-300">Particle Count</label>
                    <span className="text-sm text-gray-400">{graphicsSettings.particleCount}</span>
                  </div>
                  <Slider
                    value={[graphicsSettings.particleCount]}
                    onValueChange={([value]) => 
                      setGraphicsSettings(prev => ({ ...prev, particleCount: value }))
                    }
                    min={50}
                    max={1000}
                    step={50}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm text-gray-300">Holographic Intensity</label>
                    <span className="text-sm text-gray-400">{Math.round(graphicsSettings.holographicIntensity * 100)}%</span>
                  </div>
                  <Slider
                    value={[graphicsSettings.holographicIntensity]}
                    onValueChange={([value]) => 
                      setGraphicsSettings(prev => ({ ...prev, holographicIntensity: value }))
                    }
                    min={0}
                    max={1}
                    step={0.1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-300">Background Complexity</label>
                  <Select
                    value={graphicsSettings.backgroundComplexity}
                    onValueChange={(value: 'low' | 'medium' | 'high') => 
                      setGraphicsSettings(prev => ({ ...prev, backgroundComplexity: value }))
                    }
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem value="low" className="text-white focus:bg-gray-700">Low (Better Performance)</SelectItem>
                      <SelectItem value="medium" className="text-white focus:bg-gray-700">Medium (Balanced)</SelectItem>
                      <SelectItem value="high" className="text-white focus:bg-gray-700">High (Best Quality)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Theme Settings */}
          {activeTab === 'theme' && (
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Theme & Appearance</h4>
              
              <div className="space-y-3">
                <div className="space-y-2">
                  <label className="text-sm text-gray-300">Background Style</label>
                  <Select
                    value={themeSettings.backgroundStyle}
                    onValueChange={(value: 'gradient' | 'solid' | 'starfield' | 'nebula') => 
                      setThemeSettings(prev => ({ ...prev, backgroundStyle: value }))
                    }
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem value="gradient" className="text-white focus:bg-gray-700">Gradient</SelectItem>
                      <SelectItem value="solid" className="text-white focus:bg-gray-700">Solid Color</SelectItem>
                      <SelectItem value="starfield" className="text-white focus:bg-gray-700">Starfield</SelectItem>
                      <SelectItem value="nebula" className="text-white focus:bg-gray-700">Nebula</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Glow Effects</span>
                  <Switch
                    checked={themeSettings.glowEffects}
                    onCheckedChange={(checked) => 
                      setThemeSettings(prev => ({ ...prev, glowEffects: checked }))
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">Primary Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={themeSettings.primaryColor}
                        onChange={(e) => setThemeSettings(prev => ({ ...prev, primaryColor: e.target.value }))}
                        className="w-8 h-8 rounded border-gray-600"
                      />
                      <span className="text-xs text-gray-400">{themeSettings.primaryColor}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">Accent Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={themeSettings.accentColor}
                        onChange={(e) => setThemeSettings(prev => ({ ...prev, accentColor: e.target.value }))}
                        className="w-8 h-8 rounded border-gray-600"
                      />
                      <span className="text-xs text-gray-400">{themeSettings.accentColor}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Performance Settings */}
          {activeTab === 'performance' && (
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Performance Optimization</h4>
              
              <div className="space-y-3">
                <div className="space-y-2">
                  <label className="text-sm text-gray-300">Target Frame Rate</label>
                  <Select
                    value={graphicsSettings.frameRate.toString()}
                    onValueChange={(value) => 
                      setGraphicsSettings(prev => ({ ...prev, frameRate: parseInt(value) as 30 | 60 | 120 }))
                    }
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem value="30" className="text-white focus:bg-gray-700">30 FPS (Battery Saving)</SelectItem>
                      <SelectItem value="60" className="text-white focus:bg-gray-700">60 FPS (Standard)</SelectItem>
                      <SelectItem value="120" className="text-white focus:bg-gray-700">120 FPS (High Performance)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator className="bg-gray-700" />

                <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-lg p-3">
                  <h5 className="text-sm font-medium text-white mb-2 flex items-center">
                    <Monitor className="h-4 w-4 mr-2 text-blue-400" />
                    Performance Tips
                  </h5>
                  <ul className="text-xs text-gray-300 space-y-1">
                    <li>• Lower particle count for better performance</li>
                    <li>• Reduce visual effects on slower devices</li>
                    <li>• Use 30 FPS on mobile for battery saving</li>
                    <li>• Enable reduced motion for accessibility</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Data Management */}
          {activeTab === 'data' && (
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Data Management</h4>
              
              <div className="space-y-3">
                <div className="bg-gray-800 rounded-lg p-3">
                  <h5 className="text-sm font-medium text-white mb-2">Current Progress</h5>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-400">Conversations:</span>
                      <span className="text-white ml-2">{progress.totalInteractions}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Impact Score:</span>
                      <span className="text-white ml-2">{progress.impactScore}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Domains:</span>
                      <span className="text-white ml-2">{progress.domainsExplored.length}/5</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Achievements:</span>
                      <span className="text-white ml-2">{progress.achievements.length}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={exportData}
                    className="flex-1 bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    <Download className="h-3 w-3 mr-1" />
                    Export
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('import-file')?.click()}
                    className="flex-1 bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    <Upload className="h-3 w-3 mr-1" />
                    Import
                  </Button>
                  <input
                    id="import-file"
                    type="file"
                    accept=".json"
                    onChange={importData}
                    className="hidden"
                  />
                </div>

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={resetToDefaults}
                  className="w-full"
                >
                  <RotateCcw className="h-3 w-3 mr-1" />
                  Reset to Defaults
                </Button>
              </div>
            </div>
          )}

          {/* Apply Button */}
          <div className="mt-6 pt-4 border-t border-gray-700">
            <div className="flex gap-2">
              <Button 
                onClick={() => setIsExpanded(false)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                Apply Settings
              </Button>
            </div>
            <p className="text-xs text-gray-400 text-center mt-2">
              Some changes may require refreshing the page
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}