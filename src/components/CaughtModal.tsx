import React from 'react';
import { GameStats, Excuse, SnackConfig } from '../types';
import { RotateCcw, Shield, Flame, AlertOctagon, HelpCircle, Utensils, Hand } from 'lucide-react';

interface CaughtModalProps {
  stats: GameStats;
  excuse: Excuse;
  snack: SnackConfig;
  caughtReason: string;
  onRetry: () => void;
  onChangeSnack: () => void;
}

export const CaughtModal: React.FC<CaughtModalProps> = ({
  stats,
  excuse,
  snack,
  caughtReason,
  onRetry,
  onChangeSnack,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/85 backdrop-blur-md animate-in fade-in zoom-in duration-200">
      
      {/* Caught Container */}
      <div className="relative w-full max-w-lg bg-stone-900 border-4 border-red-600 rounded-3xl shadow-[0_0_50px_rgba(220,38,38,0.6)] overflow-hidden flex flex-col">
        
        {/* Top Comic Banner: 当场抓获！ */}
        <div className="bg-gradient-to-r from-red-700 via-rose-600 to-red-700 py-3.5 px-6 text-center border-b-4 border-red-800 relative">
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl animate-bounce">🚨</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-widest font-['Noto_Sans_SC'] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              当 场 抓 获 ！
            </h2>
            <span className="text-2xl animate-bounce">🚨</span>
          </div>
          <div className="text-xs text-red-200 font-bold mt-1">
            摸鱼失败 · 被请去办公室喝茶
          </div>
        </div>

        <div className="p-5 sm:p-6 space-y-4">
          
          {/* Reason Badge */}
          <div className="bg-red-950/80 border border-red-700/80 rounded-xl p-2.5 text-center text-xs sm:text-sm text-red-200 font-semibold flex items-center justify-center gap-2">
            <AlertOctagon className="w-4 h-4 text-red-400 shrink-0" />
            <span>{caughtReason}</span>
          </div>

          {/* Hilarious Survival Excuse Dialog (搞笑求生辩解词) */}
          <div className="bg-stone-950/90 border border-stone-700 rounded-2xl p-3.5 sm:p-4 space-y-2.5">
            {/* Player's Excuse */}
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-full bg-amber-500 text-stone-950 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                我
              </div>
              <div className="bg-stone-800/90 text-amber-200 text-xs sm:text-sm p-2.5 rounded-xl border border-stone-700 leading-relaxed">
                “{excuse.text}”
              </div>
            </div>

            {/* Teacher's Stern Response */}
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-full bg-rose-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                师
              </div>
              <div className="bg-rose-950/50 text-rose-200 text-xs sm:text-sm p-2.5 rounded-xl border border-rose-800/60 leading-relaxed font-serif">
                {excuse.teacherResponse}
              </div>
            </div>
          </div>

          {/* Round Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
            <div className="bg-stone-800/80 p-2.5 rounded-xl border border-stone-700">
              <div className="text-[10px] text-stone-400 flex items-center justify-center gap-1">
                <Utensils className="w-3 h-3 text-amber-400" />
                <span>零食进食</span>
              </div>
              <div className="text-lg font-black text-amber-400 font-mono mt-0.5">
                {stats.snacksEaten} <span className="text-xs text-stone-400">口</span>
              </div>
            </div>

            <div className="bg-stone-800/80 p-2.5 rounded-xl border border-stone-700">
              <div className="text-[10px] text-stone-400 flex items-center justify-center gap-1">
                <Flame className="w-3 h-3 text-rose-400" />
                <span>最高连击</span>
              </div>
              <div className="text-lg font-black text-rose-400 font-mono mt-0.5">
                x{stats.maxCombo.toFixed(1)}
              </div>
            </div>

            <div className="bg-stone-800/80 p-2.5 rounded-xl border border-stone-700">
              <div className="text-[10px] text-stone-400 flex items-center justify-center gap-1">
                <Shield className="w-3 h-3 text-emerald-400" />
                <span>躲过视察</span>
              </div>
              <div className="text-lg font-black text-emerald-400 font-mono mt-0.5">
                {stats.dodgedTeacherChecks + stats.dodgedHeadmasterChecks} <span className="text-xs text-stone-400">次</span>
              </div>
            </div>

            <div className="bg-stone-800/80 p-2.5 rounded-xl border border-stone-700">
              <div className="text-[10px] text-stone-400 flex items-center justify-center gap-1">
                <Hand className="w-3 h-3 text-sky-400" />
                <span>抢救杂物</span>
              </div>
              <div className="text-lg font-black text-sky-400 font-mono mt-0.5">
                {stats.itemsRescued} <span className="text-xs text-stone-400">次</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={onChangeSnack}
              className="flex-1 py-3 bg-stone-800 hover:bg-stone-700 text-stone-300 text-sm font-bold rounded-xl border border-stone-600 transition-colors cursor-pointer"
            >
              更换零食
            </button>
            <button
              onClick={onRetry}
              className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 text-sm font-black rounded-xl shadow-lg border border-amber-300 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>不服再来！</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
