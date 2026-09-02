import React, { useEffect, useState } from 'react';
import { SnackConfig, ClassmateNoiseEvent, TattleEvent } from '../types';
import { Volume2, VolumeX, Clock, Flame, Shield, Utensils, Hand, Pause, Play, AlertCircle, Megaphone, CheckCircle2 } from 'lucide-react';

interface GameHUDProps {
  timeRemaining: number;
  totalTime?: number;
  intakeCount: number;
  combo: number;
  decibel: number;
  dangerThreshold: number;
  snack: SnackConfig;
  isCovering: boolean;
  isMuted: boolean;
  isPaused: boolean;
  onToggleMute: () => void;
  onTogglePause: () => void;
  onEatTap: () => void;
  onCoverToggle: () => void;
  onRescueTap: () => void;
  hasRollingItem: boolean;
  classmateNoise: ClassmateNoiseEvent | null;
  tattleEvent: TattleEvent | null;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  timeRemaining,
  totalTime = 80,
  intakeCount,
  combo,
  decibel,
  dangerThreshold,
  snack,
  isCovering,
  isMuted,
  isPaused,
  onToggleMute,
  onTogglePause,
  onEatTap,
  onCoverToggle,
  onRescueTap,
  hasRollingItem,
  classmateNoise,
  tattleEvent,
}) => {
  // Smooth tattle countdown bar percentage
  const [tattleRemainingRatio, setTattleRemainingRatio] = useState<number>(1);

  useEffect(() => {
    if (!tattleEvent || tattleEvent.status !== 'ACTIVE') {
      setTattleRemainingRatio(1);
      return;
    }

    const interval = setInterval(() => {
      const remaining = Math.max(0, tattleEvent.deadline - Date.now());
      const ratio = remaining / tattleEvent.duration;
      setTattleRemainingRatio(ratio);
      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [tattleEvent]);

  // Format seconds to MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Determine decibel color for text and bar fill
  const getDecibelTextColor = () => {
    if (decibel >= dangerThreshold) return 'text-red-400 font-black animate-pulse';
    if (decibel >= dangerThreshold * 0.8) return 'text-orange-400 font-bold';
    if (decibel >= dangerThreshold * 0.55) return 'text-yellow-400 font-medium';
    return 'text-emerald-400';
  };

  const getDecibelBarGradient = () => {
    if (decibel >= dangerThreshold) {
      return 'bg-gradient-to-r from-red-600 via-rose-500 to-red-500 shadow-[0_0_12px_#ef4444] animate-pulse';
    }
    if (decibel >= dangerThreshold * 0.8) {
      return 'bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 shadow-[0_0_8px_#f97316]';
    }
    if (decibel >= dangerThreshold * 0.55) {
      return 'bg-gradient-to-r from-emerald-500 via-yellow-400 to-amber-500';
    }
    return 'bg-gradient-to-r from-emerald-600 to-emerald-400';
  };

  const timeProgressPercent = Math.max(0, Math.min(100, (1 - timeRemaining / (totalTime || 80)) * 100));

  return (
    <div className="absolute inset-0 pointer-events-none z-30 flex flex-col justify-between select-none p-2 sm:p-3">
      
      {/* ========================================================================= */}
      {/* 1. TOP HORIZONTAL HUD BAR (最顶部横向整合状态栏，绝不挡住画面与黑板内容) */}
      {/* ========================================================================= */}
      <div className="w-full flex flex-col items-center gap-1.5 pointer-events-auto">
        <div className="w-full max-w-5xl bg-stone-900/95 backdrop-blur-md border border-stone-700/80 rounded-2xl px-2.5 sm:px-4 py-1.5 sm:py-2 shadow-2xl flex items-center justify-between gap-2 sm:gap-4">
          
          {/* LEFT: TIME COUNTDOWN & CONTROLS */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Countdown Badge */}
            <div className="bg-stone-950/80 border border-stone-800 rounded-xl px-2.5 py-1 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 animate-[spin_12s_linear_infinite]" />
              <div className="flex flex-col">
                <span className="text-[9px] text-stone-400 font-bold leading-none hidden sm:inline">下课倒计时</span>
                <span className="text-sm sm:text-base font-black font-mono tracking-wider text-white">
                  {formatTime(timeRemaining)}
                </span>
              </div>
              {/* Mini vertical progress */}
              <div className="w-1 h-5 bg-stone-800 rounded-full overflow-hidden ml-0.5 hidden sm:block">
                <div 
                  className="w-full bg-amber-400 rounded-full transition-all duration-300"
                  style={{ height: `${timeProgressPercent}%` }}
                />
              </div>
            </div>

            {/* Audio & Pause Controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={onToggleMute}
                className="p-1.5 bg-stone-800/80 hover:bg-stone-700 text-stone-300 rounded-lg border border-stone-700 shadow-sm transition-colors cursor-pointer"
                title={isMuted ? '取消静音' : '静音'}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
              </button>
              <button
                onClick={onTogglePause}
                className="p-1.5 bg-stone-800/80 hover:bg-stone-700 text-stone-300 rounded-lg border border-stone-700 shadow-sm transition-colors cursor-pointer"
                title={isPaused ? '继续游戏' : '暂停'}
              >
                {isPaused ? <Play className="w-3.5 h-3.5 text-amber-400" /> : <Pause className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* CENTER: WIDE DYNAMIC DECIBEL PROGRESS BAR (分贝进度条) */}
          <div className="flex-1 max-w-sm sm:max-w-md mx-1 sm:mx-3 flex flex-col justify-center">
            <div className="flex items-center justify-between mb-0.5 text-[10px] sm:text-xs">
              <div className="flex items-center gap-1">
                <span className="font-bold text-stone-300 flex items-center gap-1">
                  <Volume2 className="w-3 h-3 text-stone-400" />
                  <span>咀嚼分贝</span>
                </span>
                {decibel >= dangerThreshold && (
                  <span className="bg-red-600 text-white text-[8px] sm:text-[9px] px-1 rounded font-black animate-pulse">
                    超标警报!
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-0.5 font-mono">
                <span className={`text-xs sm:text-sm font-black transition-colors ${getDecibelTextColor()}`}>
                  {Math.round(decibel)}
                </span>
                <span className="text-[9px] text-stone-400">dB / {dangerThreshold}dB</span>
              </div>
            </div>

            {/* Dynamic Length Bar Track */}
            <div className="relative w-full h-2.5 sm:h-3 bg-stone-950 rounded-full border border-stone-800 overflow-hidden">
              {/* Dynamic Filling Bar */}
              <div 
                className={`h-full rounded-full transition-all duration-100 ease-out ${getDecibelBarGradient()}`}
                style={{ width: `${Math.min(100, Math.max(0, decibel))}%` }}
              />

              {/* Danger Threshold Line Marker */}
              <div 
                className="absolute top-0 bottom-0 w-0.5 bg-red-400 z-10 shadow-[0_0_6px_#ef4444]"
                style={{ left: `${dangerThreshold}%` }}
                title={`警戒线 ${dangerThreshold}dB`}
              />
            </div>
          </div>

          {/* RIGHT: SNACK COUNT & COMBO MULTIPLIER (显眼整数连击 & 进食数) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Eye-catching Integer Combo Badge */}
            {combo >= 2 && (
              <div 
                className={`px-2.5 py-1 rounded-xl flex items-center gap-1.5 border shadow-lg transition-all duration-150 transform ${
                  combo >= 10
                    ? 'bg-gradient-to-r from-purple-950 via-pink-900 to-amber-950 border-amber-400 text-amber-100 shadow-[0_0_20px_rgba(245,158,11,0.7)] scale-105 animate-bounce'
                    : combo >= 5
                    ? 'bg-gradient-to-r from-red-950 via-rose-900 to-orange-950 border-rose-500 text-rose-100 shadow-[0_0_14px_rgba(244,63,94,0.6)] scale-100 animate-pulse'
                    : 'bg-stone-950/90 border-orange-500/80 text-orange-200 shadow-md'
                }`}
              >
                <Flame className={`w-4 h-4 fill-current ${
                  combo >= 10 ? 'text-amber-300 animate-spin' : combo >= 5 ? 'text-rose-400 animate-pulse' : 'text-orange-400'
                }`} />
                
                <div className="flex flex-col items-start leading-none">
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm sm:text-base font-black font-mono tracking-tight text-white drop-shadow">
                      {Math.round(combo)}
                    </span>
                    <span className="text-[11px] sm:text-xs font-black text-amber-300 font-sans tracking-wide">
                      连击!
                    </span>
                  </div>
                  <span className="text-[8px] sm:text-[9px] text-amber-200/90 font-mono mt-0.5 font-bold hidden sm:inline">
                    奖励+{(Math.round((combo - 1) * 20))}% · 噪响+{(Math.round((combo - 1) * 0.7))}dB
                  </span>
                </div>
              </div>
            )}

            {/* Snack Count Capsule */}
            <div className="bg-stone-950/80 border border-stone-800 rounded-xl px-2.5 py-1 flex items-center gap-1.5">
              <span className="text-base sm:text-lg filter drop-shadow">{snack.icon}</span>
              <div className="flex flex-col items-end">
                <div className="flex items-baseline gap-0.5">
                  <span className="text-xs sm:text-sm font-black text-amber-400 font-mono">
                    {intakeCount}
                  </span>
                  <span className="text-[9px] text-stone-400">口</span>
                </div>
                <span className="text-[8px] text-stone-400 leading-none hidden sm:inline">{snack.name}</span>
              </div>
            </div>
          </div>

        </div>

        {/* ------------------------------------------------------------- */}
        {/* DISTURBANCE A: CLASSMATE RANDOM NOISE NOTIFICATION BANNER    */}
        {/* ------------------------------------------------------------- */}
        {classmateNoise && (
          <div className="bg-amber-950/90 border border-amber-600/80 text-amber-200 px-3.5 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
            <span className="text-sm">{classmateNoise.icon}</span>
            <span>【班级动静】{classmateNoise.text}</span>
            <span className="bg-amber-500 text-stone-950 text-[10px] font-black px-1.5 py-0.2 rounded-full">
              +{classmateNoise.decibelBoost}dB
            </span>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* DISTURBANCE B: CLASSMATE TATTLING URGENT QUICK-TIME EVENT     */}
        {/* ------------------------------------------------------------- */}
        {tattleEvent && tattleEvent.status === 'ACTIVE' && (
          <div className="w-full max-w-md bg-gradient-to-r from-red-600 via-rose-600 to-red-600 text-white rounded-2xl p-2.5 sm:p-3 shadow-[0_0_30px_rgba(239,68,68,0.8)] border-2 border-yellow-300 flex flex-col gap-1.5 animate-bounce">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-black text-xs sm:text-sm">
                <Megaphone className="w-4 h-4 text-yellow-300 animate-spin" />
                <span className="text-yellow-200">【同学打小报告！】</span>
                <span className="text-white drop-shadow font-mono">“{tattleEvent.quote}”</span>
              </div>
              <span className="bg-yellow-400 text-red-950 text-[10px] font-black px-1.5 py-0.5 rounded font-mono">
                紧急翻书掩护 (按 B)
              </span>
            </div>

            {/* Rapidly depleting countdown meter (<1s) */}
            <div className="w-full h-2 bg-red-950 rounded-full overflow-hidden border border-yellow-300/60">
              <div 
                className="h-full bg-yellow-300 transition-all duration-75 ease-linear rounded-full"
                style={{ width: `${Math.max(0, tattleRemainingRatio * 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* TATTLE DODGED SUCCESS BANNER */}
        {tattleEvent && tattleEvent.status === 'DODGED' && (
          <div className="bg-emerald-900/90 border border-emerald-500 text-emerald-100 px-4 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1.5 animate-in fade-in zoom-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>【课本掩护成功】同学打小报告，老师立刻回头视察，发现你正认真读书！</span>
          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* 2. BOTTOM PROMPT BANNER & ACTION CONTROLS                                 */}
      {/* ========================================================================= */}
      <div className="flex flex-col items-center gap-2 pointer-events-auto pb-1">
        
        {/* Main Keyboard Instruction Capsule */}
        <div className="bg-stone-950/95 backdrop-blur-md border border-stone-700/80 px-4 sm:px-8 py-2 rounded-full shadow-2xl flex items-center gap-3 sm:gap-6 text-xs sm:text-sm font-bold text-stone-200">
          <div className="flex items-center gap-1.5">
            <span className="text-stone-400 text-xs">按</span>
            <kbd className="px-2 py-0.5 bg-amber-500 text-stone-950 rounded font-mono font-black text-xs sm:text-sm shadow">
              空格
            </kbd>
            <span className="text-amber-300 font-black tracking-wide">偷吃零食</span>
          </div>

          <span className="text-stone-700">|</span>

          <div className="flex items-center gap-1.5">
            <span className="text-stone-400 text-xs">按</span>
            <kbd className={`px-2 py-0.5 rounded font-mono font-black text-xs sm:text-sm shadow transition-colors ${
              isCovering ? 'bg-emerald-500 text-white animate-pulse' : 'bg-stone-700 text-stone-200'
            }`}>
              B
            </kbd>
            <span className={isCovering ? 'text-emerald-400' : 'text-stone-300'}>
              {isCovering ? '放下课本' : '课本掩护'}
            </span>
          </div>

          {hasRollingItem && (
            <>
              <span className="text-stone-700">|</span>
              <div className="flex items-center gap-1.5 text-rose-400 animate-bounce">
                <kbd className="px-2 py-0.5 bg-rose-600 text-white rounded font-mono font-black text-xs sm:text-sm shadow">
                  F
                </kbd>
                <span>抢救杂物！</span>
              </div>
            </>
          )}
        </div>

        {/* Mobile / Click Quick Action Buttons (Touch Friendly) */}
        <div className="flex items-center gap-3 sm:hidden pt-1">
          <button
            onClick={onEatTap}
            className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 active:scale-95 text-stone-950 font-black text-sm rounded-xl shadow-lg border border-amber-300 flex items-center gap-1.5 cursor-pointer"
          >
            <Utensils className="w-4 h-4" />
            <span>偷吃 (空格)</span>
          </button>

          <button
            onClick={onCoverToggle}
            className={`px-4 py-2.5 active:scale-95 font-bold text-sm rounded-xl shadow-lg border flex items-center gap-1.5 cursor-pointer ${
              isCovering 
                ? 'bg-emerald-600 text-white border-emerald-400' 
                : 'bg-stone-800 text-stone-200 border-stone-600'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>{isCovering ? '放下' : '掩护 (B)'}</span>
          </button>

          {hasRollingItem && (
            <button
              onClick={onRescueTap}
              className="px-4 py-2.5 bg-red-600 text-white active:scale-95 font-black text-sm rounded-xl shadow-lg border border-yellow-300 flex items-center gap-1 animate-bounce cursor-pointer"
            >
              <Hand className="w-4 h-4 text-yellow-300" />
              <span>抢救 (F)</span>
            </button>
          )}
        </div>
      </div>

    </div>
  );
};
