import React from 'react';
import { Type, Sliders, Move, RotateCw } from 'lucide-react';

interface WatermarkSettings {
  text: string;
  transparency: number;
  fontSize: number;
  position: { x: number; y: number };
  angle: number;
}

interface WatermarkControlsProps {
  settings: WatermarkSettings;
  onChange: (newSettings: Partial<WatermarkSettings>) => void;
}

const WatermarkControls: React.FC<WatermarkControlsProps> = ({ settings, onChange }) => {
  const predefinedTexts = ['Sample', 'Confidential', 'Draft', 'Copyright'];

  return (
    <div className="space-y-4 mt-6">
      <div>
        <label className="flex items-center mb-2">
          <Type className="mr-2" />
          Watermark Text
        </label>
        <div className="flex space-x-2 mb-2">
          {predefinedTexts.map((text) => (
            <button
              key={text}
              onClick={() => onChange({ text })}
              className={`px-2 py-1 rounded ${
                settings.text === text ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
            >
              {text}
            </button>
          ))}
        </div>
        <input
          type="text"
          value={settings.text}
          onChange={(e) => onChange({ text: e.target.value })}
          className="w-full px-3 py-2 border rounded"
          placeholder="Custom text"
        />
      </div>

      <div>
        <label className="flex items-center mb-2">
          <Sliders className="mr-2" />
          Transparency
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={settings.transparency}
          onChange={(e) => onChange({ transparency: parseFloat(e.target.value) })}
          className="w-full"
        />
        <span className="text-sm text-gray-600">{(settings.transparency * 100).toFixed(0)}%</span>
      </div>

      <div>
        <label className="flex items-center mb-2">
          <Type className="mr-2" />
          Font Size
        </label>
        <input
          type="number"
          value={settings.fontSize}
          onChange={(e) => onChange({ fontSize: parseInt(e.target.value) })}
          className="w-full px-3 py-2 border rounded"
          min="8"
          max="72"
        />
      </div>

      <div>
        <label className="flex items-center mb-2">
          <Move className="mr-2" />
          Position
        </label>
        <div className="flex space-x-2">
          <input
            type="number"
            value={settings.position.x}
            onChange={(e) => onChange({ position: { ...settings.position, x: parseInt(e.target.value) } })}
            className="w-1/2 px-3 py-2 border rounded"
            placeholder="X"
            min="0"
            max="100"
          />
          <input
            type="number"
            value={settings.position.y}
            onChange={(e) => onChange({ position: { ...settings.position, y: parseInt(e.target.value) } })}
            className="w-1/2 px-3 py-2 border rounded"
            placeholder="Y"
            min="0"
            max="100"
          />
        </div>
        <span className="text-sm text-gray-600">X: {settings.position.x}%, Y: {settings.position.y}%</span>
      </div>

      <div>
        <label className="flex items-center mb-2">
          <RotateCw className="mr-2" />
          Angle
        </label>
        <input
          type="range"
          min="0"
          max="360"
          value={settings.angle}
          onChange={(e) => onChange({ angle: parseInt(e.target.value) })}
          className="w-full"
        />
        <span className="text-sm text-gray-600">{settings.angle}°</span>
      </div>
    </div>
  );
};

export default WatermarkControls;