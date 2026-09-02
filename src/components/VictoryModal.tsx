import React, { useEffect } from 'react';
import { GameStats, SnackConfig } from '../types';
import { TITLES_BY_SCORE } from '../data/excuses';
import { Trophy, Award, Sparkles, Flame, Shield, Hand, RotateCcw, Share2, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

interface VictoryModalProps {
  stats: GameStats;
  snack: SnackConfig;
  onPlayAgain: () => void;
  onChangeSnack: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  stats,
  snack,
  onPlayAgain,
  onChangeSnack,
}) => {
  const [copied, setCopied] = React.useState(false);

  // Trigger celebration confetti
  useEffect(() => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      setTimeout(() => {
        confetti({
          particleCount: 60,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
        });
        confetti({
          particleCount: 60,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
        });
      }, 400);
    } catch {
      // ignore
    }
  }, []);

  // Determine Rank and Title based on snacks eaten
  const evaluation = TITLES_BY_SCORE.find(t => stats.snacksEaten >= t.minScore) || TITLES_BY_SCORE[TITLES_BY_SCORE.length - 1];

  const handleCopySummary = () => {
    const text = `🎒【课堂偷吃大作战 - 摸鱼通关成绩单】\n` +
      `零食：${snack.name}\n` +
      `吞咽数量：${stats.snacksEaten} 口\n` +
      `摸鱼评级：${evaluation.rank} 级\n` +
      `获得称号：${evaluation.title}\n` +
      `最高连击：x${stats.maxCombo.toFixed(1)}\n` +
      `躲过视察：${stats.dodgedTeacherChecks + stats.dodgedHeadmasterChecks} 次\n` +
      `抢救杂物：${stats.itemsRescued} 次！`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/85 backdrop-blur-md animate-in fade-in zoom-in duration-300">
      
      {/* Victory Certificate Container */}
      <div className="relative w-full max-w-lg bg-stone-900 border-4 border-amber-400 rounded-3xl shadow-[0_0_60px_rgba(245,158,11,0.5)] overflow-hidden flex flex-col">
        
        {/* Top Header: 下课铃响！摸鱼大获全胜 */}
        <div className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 py-3.5 px-6 text-center border-b-4 border-amber-600 relative">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-6 h-6 text-stone-950 animate-spin" />
            <h2 className="text-2xl sm:text-3xl font-black text-stone-950 tracking-widest font-['Noto_Sans_SC']">
              下 课 铃 响 ！
            </h2>
            <Sparkles className="w-6 h-6 text-stone-950 animate-spin" />
          </div>
          <div className="text-xs text-stone-900 font-bold mt-0.5">
            🔔 满载而归 · 课堂摸鱼大圆满 🔔
          </div>
        </div>

        <div className="p-5 sm:p-6 space-y-4">
          
          {/* Rank & Title Seal Badge */}
          <div className="bg-gradient-to-br from-stone-800 to-stone-900 border-2 border-amber-500/50 rounded-2xl p-4 flex items-center justify-between shadow-inner">
            <div className="space-y-1">
              <div className="text-xs text-amber-300 font-semibold flex items-center gap-1">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>荣誉称号</span>
              </div>
              <div className="text-base sm:text-xl font-black text-white">
                {evaluation.title}
              </div>
              <div className="text-[11px] text-stone-400 leading-tight">
                {evaluation.comment}
              </div>
            </div>

            {/* Glowing Rank Stamp (SSS ~ C) */}
            <div className={`w-16 sm:w-20 h-16 sm:h-20 rounded-2xl bg-gradient-to-br ${evaluation.badgeColor} flex flex-col items-center justify-center font-black shadow-lg border-2 border-white/50 shrink-0 transform rotate-6 animate-pulse`}>
              <span className="text-xs leading-none font-sans">GRADE</span>
              <span className="text-2xl sm:text-3xl font-['Fredoka']">{evaluation.rank}</span>
            </div>
          </div>

          {/* Detailed Report Card (摸鱼成绩单) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
            <div className="bg-stone-800/90 p-2.5 rounded-xl border border-stone-700">
              <div className="text-[10px] text-stone-400">吞咽总量</div>
              <div className="text-xl font-black text-amber-400 font-mono mt-0.5">
                {stats.snacksEaten} <span className="text-xs text-stone-400">口</span>
              </div>
            </div>

            <div className="bg-stone-800/90 p-2.5 rounded-xl border border-stone-700">
              <div className="text-[10px] text-stone-400">极限连击</div>
              <div className="text-xl font-black text-rose-400 font-mono mt-0.5">
                x{stats.maxCombo.toFixed(1)}
              </div>
            </div>

            <div className="bg-stone-800/90 p-2.5 rounded-xl border border-stone-700">
              <div className="text-[10px] text-stone-400">成功躲避</div>
              <div className="text-xl font-black text-emerald-400 font-mono mt-0.5">
                {stats.dodgedTeacherChecks + stats.dodgedHeadmasterChecks} <span className="text-xs text-stone-400">次</span>
              </div>
            </div>

            <div className="bg-stone-800/90 p-2.5 rounded-xl border border-stone-700">
              <div className="text-[10px] text-stone-400">抢救杂物</div>
              <div className="text-xl font-black text-sky-400 font-mono mt-0.5">
                {stats.itemsRescued} <span className="text-xs text-stone-400">次</span>
              </div>
            </div>
          </div>

          {/* Summary Comment */}
          <div className="bg-amber-950/40 border border-amber-600/40 rounded-xl p-3 text-xs text-amber-200/90 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400 shrink-0" />
            <span>你成功在老师讲授《函数的导数》期间隐蔽干饭，下节课继续保持！</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 pt-2">
            <button
              onClick={handleCopySummary}
              className="py-3 px-3 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-bold rounded-xl border border-stone-600 transition-colors flex items-center justify-center gap-1 cursor-pointer"
              title="复制成绩单"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              <span>{copied ? '已复制' : '成绩单'}</span>
            </button>

            <button
              onClick={onChangeSnack}
              className="flex-1 py-3 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs sm:text-sm font-bold rounded-xl border border-stone-600 transition-colors cursor-pointer text-center"
            >
              换种零食
            </button>

            <button
              onClick={onPlayAgain}
              className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 text-xs sm:text-sm font-black rounded-xl shadow-lg border border-amber-300 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>下节课继续！</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
