import React from 'react';
import { Layers, Sliders, Maximize2 } from 'lucide-react';
import { VariationConfig, VariationPreset, AspectRatioOption } from '../types/index.ts';
import { useLanguage } from '../context/LanguageContext';

interface VariationSettingsProps {
  config: VariationConfig;
  onChange: (val: VariationConfig) => void;
  aspectRatio: string;
  onAspectRatioChange: (val: AspectRatioOption) => void;
}

export const VariationSettings: React.FC<VariationSettingsProps> = ({
  config,
  onChange,
  aspectRatio,
  onAspectRatioChange,
}) => {
  const { t } = useLanguage();
  const presets: VariationPreset[] = [1, 3, 5, 10];
  const MAX_CUSTOM = 15;

  const handlePresetSelect = (p: VariationPreset) => {
    onChange({
      ...config,
      preset: p,
    });
  };

  const handleCustomCountChange = (val: number) => {
    const clamped = Math.max(1, Math.min(MAX_CUSTOM, isNaN(val) ? 1 : val));
    onChange({
      preset: 'custom',
      customCount: clamped,
    });
  };

  const activeCount = config.preset === 'custom' ? config.customCount : config.preset;

  const aspectRatios: Array<{ id: AspectRatioOption; label: string; subLabel: string }> = [
    { id: 'auto', label: t.aspectRatioAuto, subLabel: t.aspectRatioAutoSub },
    { id: '9:16', label: '9:16', subLabel: t.aspectRatioStorySub },
    { id: '1:1', label: '1:1', subLabel: t.aspectRatioSquareSub },
    { id: '4:5', label: '4:5', subLabel: t.aspectRatioPortraitSub },
    { id: '3:4', label: '3:4', subLabel: t.aspectRatioVerticalSub },
    { id: '16:9', label: '16:9', subLabel: t.aspectRatioCinematicSub },
    { id: '2:3', label: '2:3', subLabel: t.aspectRatioClassicSub },
  ];

  const currentRatioObj = aspectRatios.find(r => r.id === aspectRatio) || aspectRatios[0];

  return (
    <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
      {/* 1. Variation Count Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-400" />
            {t.variationTitle}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {t.variationSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs text-slate-400">{t.targetPromptsLabel}</span>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 font-mono">
            {activeCount} {activeCount === 1 ? t.promptsUnitSingular : t.promptsUnitPlural}
          </span>
        </div>
      </div>

      {/* Preset Buttons & Custom Input */}
      <div className="flex flex-wrap items-center gap-2.5">
        {presets.map((num) => {
          const isSelected = config.preset === num;
          return (
            <button
              key={num}
              type="button"
              onClick={() => handlePresetSelect(num)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold border transition ${
                isSelected
                  ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-md shadow-amber-950/30'
                  : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
              }`}
            >
              {num} {num === 1 ? t.variationUnitSingular : t.variationUnitPlural}
            </button>
          );
        })}

        {/* Custom Input */}
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition ${
            config.preset === 'custom'
              ? 'bg-amber-500/10 border-amber-500/60 text-amber-200'
              : 'bg-slate-950/60 border-slate-800 text-slate-400'
          }`}
        >
          <Sliders className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs font-medium">{t.customLabel}</span>
          <input
            type="number"
            min={1}
            max={MAX_CUSTOM}
            value={config.preset === 'custom' ? config.customCount : ''}
            placeholder="1-15"
            onFocus={() => handlePresetSelect('custom')}
            onChange={(e) => handleCustomCountChange(parseInt(e.target.value, 10))}
            className="w-16 bg-slate-900 border border-slate-700 focus:border-amber-400 rounded-lg px-2 py-1 text-xs text-white outline-none font-mono"
          />
          <span className="text-[11px] text-slate-500">({t.maxLabel} {MAX_CUSTOM})</span>
        </div>
      </div>

      {/* 2. Aspect Ratio Selector Section */}
      <div className="pt-3 border-t border-slate-800/80 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Maximize2 className="w-4 h-4 text-amber-400" />
              {t.aspectRatioTitle}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {t.aspectRatioSubtitle}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs text-slate-400">{t.aspectRatioActiveBadge}</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 font-mono">
              {currentRatioObj.label} {currentRatioObj.id !== 'auto' ? `(--ar ${currentRatioObj.id})` : ''}
            </span>
          </div>
        </div>

        {/* Aspect Ratio Options Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 items-stretch">
          {aspectRatios.map((item) => {
            const isSelected = aspectRatio === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onAspectRatioChange(item.id)}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition duration-150 h-full min-h-[60px] ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-md shadow-amber-950/30 font-semibold'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                }`}
              >
                <span className={`text-xs ${isSelected ? 'font-bold' : 'font-semibold'}`}>
                  {item.label}
                </span>
                <span className={`text-[10px] mt-0.5 truncate max-w-full ${
                  isSelected ? 'text-slate-900/80 font-medium' : 'text-slate-500'
                }`}>
                  {item.subLabel}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
