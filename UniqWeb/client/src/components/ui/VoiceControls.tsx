import { useState } from 'react';
import { Card } from './card';
import { Button } from './button';
import { Switch } from './switch';
import { Slider } from './slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Volume2, VolumeX, Mic, MicOff } from 'lucide-react';
import { useVoice } from '../../lib/stores/useVoice';

export function VoiceControls() {
  const { 
    voiceSettings, 
    accessibilitySettings,
    updateVoiceSettings, 
    updateAccessibilitySettings 
  } = useVoice();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'en-US', name: 'English (US)' },
    { code: 'en-GB', name: 'English (UK)' },
    { code: 'es-ES', name: 'Spanish' },
    { code: 'fr-FR', name: 'French' },
    { code: 'de-DE', name: 'German' },
    { code: 'it-IT', name: 'Italian' },
    { code: 'pt-BR', name: 'Portuguese' },
    { code: 'zh-CN', name: 'Chinese' },
    { code: 'ja-JP', name: 'Japanese' },
    { code: 'ko-KR', name: 'Korean' }
  ];

  if (!isOpen) {
    return (
      <div className="fixed top-4 right-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(true)}
          className="bg-gray-900/90 border-gray-700 text-white hover:bg-gray-800"
        >
          {voiceSettings.enabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <Card className="w-80 p-4 bg-gray-900/95 border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-white">Voice & Accessibility</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </Button>
        </div>

        <div className="space-y-4">
          {/* Voice Settings */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-300">Voice Settings</h4>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Enable Voice</span>
              <Switch
                checked={voiceSettings.enabled}
                onCheckedChange={(checked) => 
                  updateVoiceSettings({ enabled: checked })
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-400">Language</label>
              <Select
                value={voiceSettings.language}
                onValueChange={(value) => 
                  updateVoiceSettings({ language: value })
                }
              >
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  {languages.map((lang) => (
                    <SelectItem 
                      key={lang.code} 
                      value={lang.code}
                      className="text-white focus:bg-gray-700"
                    >
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm text-gray-400">Speech Rate</label>
                <span className="text-sm text-gray-300">{voiceSettings.rate}x</span>
              </div>
              <Slider
                value={[voiceSettings.rate]}
                onValueChange={([value]) => 
                  updateVoiceSettings({ rate: value })
                }
                min={0.5}
                max={2}
                step={0.1}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm text-gray-400">Pitch</label>
                <span className="text-sm text-gray-300">{voiceSettings.pitch}x</span>
              </div>
              <Slider
                value={[voiceSettings.pitch]}
                onValueChange={([value]) => 
                  updateVoiceSettings({ pitch: value })
                }
                min={0.5}
                max={2}
                step={0.1}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm text-gray-400">Volume</label>
                <span className="text-sm text-gray-300">{Math.round(voiceSettings.volume * 100)}%</span>
              </div>
              <Slider
                value={[voiceSettings.volume]}
                onValueChange={([value]) => 
                  updateVoiceSettings({ volume: value })
                }
                min={0}
                max={1}
                step={0.1}
                className="w-full"
              />
            </div>
          </div>

          {/* Accessibility Settings */}
          <div className="space-y-3 border-t border-gray-700 pt-4">
            <h4 className="text-sm font-medium text-gray-300">Accessibility</h4>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">High Contrast</span>
              <Switch
                checked={accessibilitySettings.highContrast}
                onCheckedChange={(checked) => 
                  updateAccessibilitySettings({ highContrast: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Large Text</span>
              <Switch
                checked={accessibilitySettings.largeText}
                onCheckedChange={(checked) => 
                  updateAccessibilitySettings({ largeText: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Screen Reader Mode</span>
              <Switch
                checked={accessibilitySettings.screenReaderMode}
                onCheckedChange={(checked) => 
                  updateAccessibilitySettings({ screenReaderMode: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Keyboard Navigation</span>
              <Switch
                checked={accessibilitySettings.keyboardNavigation}
                onCheckedChange={(checked) => 
                  updateAccessibilitySettings({ keyboardNavigation: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Reduced Motion</span>
              <Switch
                checked={accessibilitySettings.reducedMotion}
                onCheckedChange={(checked) => 
                  updateAccessibilitySettings({ reducedMotion: checked })
                }
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
