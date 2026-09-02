import React, { useState } from 'react';
import { SnackConfig } from '../types';
import { SNACK_PRESETS } from '../data/snacks';
import { Play, Volume2, Shield, AlertTriangle, Sparkles, HelpCircle, Check } from 'lucide-react';

interface SnackSelectorModalProps {
  selectedSnack: SnackConfig;
  onSelectSnack: (snack: SnackConfig) => void;
  onStartGame: (difficulty: 'NORMAL' | 'HARD' | 'HELL') => void;
}

export const SnackSelectorModal: React.FC<SnackSelectorModalProps> = ({
  selectedSnack,
  onSelectSnack,
  onStartGame,
}) => {
  const [showRules, setShowRules] = useState(false);
  const [difficulty, setDifficulty] = useState<'NORMAL' | 'HARD' | 'HELL'>('NORMAL');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/90 backdrop-blur-lg animate-in fade-in zoom-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-xl bg-stone-900 border-2 border-stone-700 rounded-3xl shadow-2xl overflow-hidden my-auto flex flex-col">
        
        {/* Top Header */}
        <div className="bg-gradient-to-r from-stone-800 via-stone-750 to-stone-800 p-4 sm:p-5 border-b border-stone-700 text-center relative">
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl">🎒</span>
            <h1 className="text-2xl sm:text-3xl font-black text-amber-300 tracking-wider font-['Noto_Sans_SC']">
              课上偷吃大作战
            </h1>
            <span className="text-2xl">🥔</span>
          </div>
          <p className="text-xs text-stone-400 mt-1">
            数学课偷吃挑战 · 避开老师视线 · 争当摸鱼仙尊
          </p>

          <button
            onClick={() => setShowRules(!showRules)}
            className="absolute right-4 top-4 text-xs bg-stone-800 hover:bg-stone-700 text-amber-400 px-2.5 py-1 rounded-lg border border-stone-600 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{showRules ? '返回选单' : '玩法秘籍'}</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-4">
          
          {showRules ? (
            /* Gameplay Rules / Tutorial */
            <div className="space-y-3 bg-stone-950/80 p-4 rounded-2xl border border-stone-800 text-xs sm:text-sm text-stone-300">
              <h3 className="text-sm sm:text-base font-bold text-amber-400 border-b border-stone-800 pb-1.5 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>高三课堂偷吃生存法则</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="bg-stone-900 p-2.5 rounded-xl border border-stone-800 space-y-1">
                  <div className="font-bold text-amber-300 flex items-center gap-1">
                    <span className="px-1.5 py-0.5 bg-amber-500 text-stone-950 rounded text-[10px] font-black">1</span>
                    <span>敲击进食与分贝</span>
                  </div>
                  <p className="text-[11px] text-stone-400 leading-relaxed">
                    狂按 <b className="text-white">空格键</b>（或点击屏幕）大口吃零食！敲得越快分贝越高，切忌突破<b className="text-red-400">警戒红线</b>！
                  </p>
                </div>

                <div className="bg-stone-900 p-2.5 rounded-xl border border-stone-800 space-y-1">
                  <div className="font-bold text-emerald-300 flex items-center gap-1">
                    <span className="px-1.5 py-0.5 bg-emerald-500 text-white rounded text-[10px] font-black">2</span>
                    <span>停笔预警与课本掩护</span>
                  </div>
                  <p className="text-[11px] text-stone-400 leading-relaxed">
                    老师停笔并弹出 <b className="text-yellow-400">! 警告</b> 时立刻停吃！老师转身时必须按 <b className="text-white">B 键</b> 举起课本防御！
                  </p>
                </div>

                <div className="bg-stone-900 p-2.5 rounded-xl border border-stone-800 space-y-1">
                  <div className="font-bold text-rose-300 flex items-center gap-1">
                    <span className="px-1.5 py-0.5 bg-rose-500 text-white rounded text-[10px] font-black">3</span>
                    <span>桌面杂物滚落 (QTE)</span>
                  </div>
                  <p className="text-[11px] text-stone-400 leading-relaxed">
                    圆珠笔、大橡皮掉落时，按 <b className="text-white">F 键</b> 或点击抢救，否则落地巨响将直接惊动老师！
                  </p>
                </div>

                <div className="bg-stone-900 p-2.5 rounded-xl border border-stone-800 space-y-1">
                  <div className="font-bold text-cyan-300 flex items-center gap-1">
                    <span className="px-1.5 py-0.5 bg-cyan-500 text-stone-950 rounded text-[10px] font-black">4</span>
                    <span>后门主任反光视察</span>
                  </div>
                  <p className="text-[11px] text-stone-400 leading-relaxed">
                    听到后门沉重脚步声时，注意后门窗户上的<b className="text-cyan-300">反光眼镜</b>，注视期间严禁进食！
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Snack Picker & Stats */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-bold text-stone-300">
                  🎒 第一步：选择本节课携带的零食
                </span>
                <span className="text-[11px] text-amber-400 font-mono">
                  当前已选：{selectedSnack.name}
                </span>
              </div>

              {/* Snack Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {SNACK_PRESETS.map((snack) => {
                  const isSelected = snack.id === selectedSnack.id;
                  return (
                    <div
                      key={snack.id}
                      onClick={() => onSelectSnack(snack)}
                      className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-amber-950/60 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.4)] scale-102'
                          : 'bg-stone-800/80 border-stone-700 hover:border-stone-500 hover:bg-stone-800'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <span className="text-3xl filter drop-shadow">{snack.icon}</span>
                        {isSelected && (
                          <div className="w-5 h-5 bg-amber-500 text-stone-950 rounded-full flex items-center justify-center shadow">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        )}
                      </div>

                      <div className="mt-2">
                        <div className="font-bold text-xs sm:text-sm text-stone-100 line-clamp-1">
                          {snack.name}
                        </div>
                        <div className="text-[10px] text-stone-400 line-clamp-1 mt-0.5">
                          {snack.tagline}
                        </div>
                      </div>

                      {/* Bite & Decibel stats tag */}
                      <div className="flex items-center justify-between text-[9px] text-stone-300 font-mono mt-2 pt-1.5 border-t border-stone-700/60">
                        <span>音量: {snack.decibelPerBite}dB</span>
                        <span className="text-amber-400 font-bold">+{snack.pointsPerBite}分</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Class Difficulty Selector */}
              <div className="pt-2 border-t border-stone-800">
                <div className="text-xs text-stone-400 font-bold mb-2">
                  ⏰ 第二步：选择课堂监考难度 (高难度时长更长，挑战更大)
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setDifficulty('NORMAL')}
                    className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                      difficulty === 'NORMAL'
                        ? 'bg-emerald-950/70 border-emerald-400 text-emerald-300 shadow'
                        : 'bg-stone-800 border-stone-700 text-stone-400'
                    }`}
                  >
                    <span>🌱 普通自习</span>
                    <span className="text-[10px] font-mono opacity-80">65秒 · 容易</span>
                  </button>

                  <button
                    onClick={() => setDifficulty('HARD')}
                    className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                      difficulty === 'HARD'
                        ? 'bg-amber-950/70 border-amber-400 text-amber-300 shadow'
                        : 'bg-stone-800 border-stone-700 text-stone-400'
                    }`}
                  >
                    <span>🔥 数学导数</span>
                    <span className="text-[10px] font-mono opacity-80">85秒 · 掉落即转身</span>
                  </button>

                  <button
                    onClick={() => setDifficulty('HELL')}
                    className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                      difficulty === 'HELL'
                        ? 'bg-red-950/70 border-red-500 text-red-300 shadow'
                        : 'bg-stone-800 border-stone-700 text-stone-400'
                    }`}
                  >
                    <span>💀 主任巡堂</span>
                    <span className="text-[10px] font-mono opacity-80">105秒 · 极高干扰</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Start Game Button */}
          <div className="pt-2">
            <button
              onClick={() => onStartGame(difficulty)}
              className="w-full py-4 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 active:scale-98 text-stone-950 font-black text-base sm:text-lg rounded-2xl shadow-[0_0_25px_rgba(245,158,11,0.5)] border-2 border-amber-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-5 h-5 fill-stone-950" />
              <span>上课铃响，开始摸鱼！</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
