import React, { useState } from 'react';
import { RollingItem, SnackConfig } from '../types';
import { Sparkles, Shield, Hand } from 'lucide-react';

interface DeskViewProps {
  isCovering: boolean;
  snack: SnackConfig;
  intakeCount: number;
  combo?: number;
  chewing: boolean;
  rollingItem: RollingItem | null;
  onRescueItem: () => void;
  onEatTap: () => void;
  onCoverToggle: () => void;
}

export const DeskView: React.FC<DeskViewProps> = ({
  isCovering,
  snack,
  combo = 1,
  chewing,
  rollingItem,
  onRescueItem,
}) => {
  return (
    <div className="relative w-full h-full select-none pointer-events-auto">
      {/* 1. Wooden Desk Texture */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#4a2e18] via-[#6d4423] to-[#8a572c] border-t-8 border-[#a46d3b] shadow-[0_-10px_25px_rgba(0,0,0,0.6)]">
        {/* Subtle wood grain lines */}
        <div className="absolute inset-0 opacity-15 bg-[repeating-linear-gradient(90deg,#000_0px,#000_2px,transparent_2px,transparent_60px)] pointer-events-none" />
      </div>

      {/* 2. Left Desk Items: Math Textbook, Pen, Bear Pencil Case */}
      <div className="absolute left-4 sm:left-12 bottom-6 sm:bottom-10 flex items-end gap-3 sm:gap-6 z-10">
        
        {/* Worn Math Notebook ("数学") when NOT covering */}
        {!isCovering && (
          <div className="relative w-28 sm:w-36 h-36 sm:h-48 bg-[#ded7c8] rounded-sm border border-[#b8ae9a] shadow-xl p-2.5 sm:p-3 flex flex-col justify-between transform -rotate-6 hover:rotate-0 transition-transform">
            {/* Book spine & tape */}
            <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-[#8b7355] border-r border-[#6b5840]" />
            
            {/* Cover Title: 数学 */}
            <div className="text-center pt-2">
              <div className="text-base sm:text-xl font-bold tracking-widest text-stone-800 font-serif border-b border-stone-400 pb-1">
                数 学
              </div>
              <div className="text-[9px] sm:text-[10px] text-stone-500 font-mono mt-1">
                必修 · 高等导数演练
              </div>
            </div>

            {/* Scribbled notes on cover */}
            <div className="space-y-1 text-[8px] sm:text-[9px] text-stone-600/80 font-mono">
              <div className="line-clamp-1">f'(x) = lim Δx→0</div>
              <div className="line-clamp-1">∫ e^x dx = e^x + C</div>
              <div className="text-[8px] text-amber-800 font-sans font-semibold">★ 重点复习</div>
            </div>

            {/* Bottom student name line */}
            <div className="border-t border-stone-300 pt-1 text-[8px] text-stone-500 flex justify-between">
              <span>高三(2)班</span>
              <span>张同学</span>
            </div>
          </div>
        )}

        {/* Pencil Case with Cute Bear Badge (小熊笔袋 - 还原参考图) */}
        <div className="relative w-24 sm:w-36 h-12 sm:h-16 bg-[#2c3e50] rounded-xl border-2 border-[#34495e] shadow-lg flex items-center justify-between px-2.5 sm:px-4 transform rotate-2">
          {/* Zipper Line */}
          <div className="absolute top-1.5 inset-x-2 h-0.5 bg-amber-400 rounded-full" />
          
          {/* Bear Patch (小熊布贴) */}
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#8d5b36] rounded-full border border-[#6d4323] relative flex flex-col items-center justify-center shadow-sm">
            {/* Bear Ears */}
            <div className="absolute -top-1 -left-1 w-3 h-3 bg-[#8d5b36] rounded-full" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#8d5b36] rounded-full" />
            {/* Snout */}
            <div className="w-4 h-3 bg-[#deb887] rounded-full flex items-center justify-center mt-1">
              <div className="w-1.5 h-1 bg-stone-900 rounded-full" />
            </div>
            {/* Eyes */}
            <div className="absolute top-2.5 inset-x-2 flex justify-between">
              <div className="w-1 h-1 bg-stone-900 rounded-full" />
              <div className="w-1 h-1 bg-stone-900 rounded-full" />
            </div>
          </div>

          {/* Zipper Pull Charm */}
          <div className="w-3 h-5 bg-amber-600 rounded-sm border border-amber-400 shadow-sm" />
        </div>

        {/* Small White Eraser on desk */}
        <div className="w-8 h-4 bg-stone-100 rounded-sm border border-stone-300 shadow-md transform rotate-12 flex items-center justify-center text-[7px] text-stone-600 font-bold">
          4B
        </div>
      </div>

      {/* 3. ROLLING ITEM QUICK TIME EVENT (桌面滚落杂物) */}
      {rollingItem && rollingItem.active && (
        <div 
          onClick={onRescueItem}
          className="absolute z-30 cursor-pointer group"
          style={{
            left: `${rollingItem.x}%`,
            top: `${rollingItem.y}%`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          {/* Urgent Rescue Indicator */}
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-red-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-lg border border-yellow-300 animate-bounce flex items-center gap-1">
            <Hand className="w-3 h-3 text-yellow-300" />
            <span>按 F / 点击抢救!</span>
          </div>

          {/* Rolling Graphic based on item type */}
          <div className="transition-transform duration-75 group-hover:scale-110">
            {rollingItem.type === 'PEN' && (
              <div className="w-20 sm:w-28 h-3.5 bg-gradient-to-r from-blue-600 via-sky-400 to-stone-200 rounded-full border border-stone-800 shadow-xl transform rotate-12 flex items-center justify-between px-1">
                <div className="w-3 h-1 bg-stone-900 rounded-sm" />
                <div className="w-1 h-1 bg-yellow-400 rounded-full" />
              </div>
            )}

            {rollingItem.type === 'ERASER' && (
              <div className="w-12 sm:w-16 h-7 bg-emerald-500 rounded-md border-2 border-emerald-700 shadow-xl flex items-center justify-center text-[9px] text-white font-black transform -rotate-12">
                SUPER 2B
              </div>
            )}

            {rollingItem.type === 'RULER' && (
              <div className="w-16 sm:w-24 h-10 bg-amber-200/90 border border-amber-600 shadow-xl transform rotate-45 flex items-center justify-center text-[8px] text-stone-800 font-mono">
                📐 60°
              </div>
            )}

            {rollingItem.type === 'CHALK' && (
              <div className="w-10 sm:w-14 h-3 bg-rose-200 rounded-full border border-rose-400 shadow-xl" />
            )}
          </div>
        </div>
      )}

      {/* 4. PLAYER HANDS & ACTIONS (中心/右侧玩家视角操作) */}
      <div className="absolute inset-x-0 bottom-0 h-full flex items-end justify-center pointer-events-none z-20">
        
        {/* MODE A: COVER WITH BOOK (B 键 举书防御姿态) */}
        {isCovering ? (
          <div className="relative w-full max-w-lg h-72 sm:h-96 flex flex-col items-center justify-end animate-in slide-in-from-bottom duration-150">
            
            {/* Huge Textbook held up in front of face as defensive shield */}
            <div className="relative w-80 sm:w-[28rem] h-64 sm:h-80 bg-[#e8e2d4] rounded-t-xl border-4 border-[#7a5a3a] shadow-[0_-15px_40px_rgba(0,0,0,0.8)] p-6 flex flex-col justify-between">
              
              {/* Top Warning / Protection Tag */}
              <div className="flex items-center justify-between border-b-2 border-[#7a5a3a]/40 pb-2">
                <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs sm:text-sm">
                  <Shield className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                  <span>课本绝对掩护中 (安全)</span>
                </div>
                <span className="text-[10px] text-stone-600 font-mono">按 B 键放下 / 抓紧摸鱼</span>
              </div>

              {/* Math Content on the Book to look like a model student! */}
              <div className="space-y-2 text-stone-800 font-serif">
                <h3 className="text-lg sm:text-2xl font-bold tracking-wider text-center text-stone-900 font-['Noto_Sans_SC']">
                  普通高中课程标准实验教科书 · 数学
                </h3>
                <div className="bg-stone-100 p-2 sm:p-3 rounded border border-stone-300 text-xs sm:text-sm font-mono leading-relaxed">
                  <p className="font-semibold text-stone-900">【定理 3.2】可导函数的单调性判定：</p>
                  <p className="text-stone-700">设函数 f(x) 在区间 (a,b) 内可导，若 f'(x) &gt; 0，则 f(x) 单调递增...</p>
                </div>
              </div>

              {/* Diligent Student Signature */}
              <div className="text-right text-[11px] text-stone-500 font-sans">
                认真听讲中 ✍️ 绝不偷吃
              </div>

              {/* Hands grasping book edges on both sides */}
              <div className="absolute -left-4 bottom-8 w-12 h-16 bg-[#eac59b] rounded-l-2xl border-2 border-[#c29668] shadow-md transform -rotate-12 flex items-center justify-center">
                <div className="w-3 h-10 bg-[#deb185] rounded-full" />
              </div>
              <div className="absolute -right-4 bottom-8 w-12 h-16 bg-[#eac59b] rounded-r-2xl border-2 border-[#c29668] shadow-md transform rotate-12 flex items-center justify-center">
                <div className="w-3 h-10 bg-[#deb185] rounded-full" />
              </div>
            </div>
          </div>
        ) : (
          /* MODE B: EATING SNACKS (偷吃姿态 - 还原参考图) */
          <div className="relative w-full max-w-xl h-64 sm:h-80 flex items-end justify-center">
            
            {/* Flying Crunch Crumbs & Sparkles when chewing */}
            {chewing && (
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex items-center gap-1.5 pointer-events-none animate-in zoom-in duration-100 z-30">
                <Sparkles className="w-5 h-5 text-amber-400 animate-spin" />
                <span className="text-amber-300 font-black text-sm sm:text-base drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] font-['Fredoka'] flex items-center gap-1">
                  <span>CRUNCH!</span>
                  <span className="text-yellow-300">+{Math.round(snack.pointsPerBite * (1 + (combo - 1) * 0.2))}分</span>
                  {combo >= 2 && (
                    <span className="bg-rose-600 text-white text-[11px] px-1.5 py-0.5 rounded-full font-sans font-black animate-bounce shadow">
                      {Math.round(combo)}连击!
                    </span>
                  )}
                </span>
                <Sparkles className="w-5 h-5 text-yellow-300 animate-ping" />
              </div>
            )}

            {/* Left Hand Holding Snack Bag */}
            <div className="absolute left-6 sm:left-16 bottom-0 w-28 sm:w-40 h-32 sm:h-44 z-20">
              {/* Hand wrist and sleeve */}
              <div className="absolute -bottom-4 left-0 w-20 h-28 bg-stone-900 rounded-t-xl rotate-12" />
              {/* Fingers wrapping bag */}
              <div className="absolute top-10 left-6 w-14 h-12 bg-[#eac59b] rounded-xl border border-[#c29668] rotate-[-10deg] shadow-md" />
            </div>

            {/* Snack Bag Graphic (例如 香脆薯片 / 包装袋 - 还原参考图) */}
            <div className={`relative w-44 sm:w-60 h-44 sm:h-56 rounded-2xl shadow-2xl p-3 flex flex-col justify-between border-4 ${snack.bagTexture} transform -rotate-3 transition-transform ${
              chewing ? 'scale-105 rotate-0' : ''
            }`}>
              {/* Bag open crinkled top */}
              <div className="w-full h-4 bg-amber-100/30 rounded-t-lg border-b-2 border-dashed border-amber-200/50 -mt-1 flex justify-center items-center">
                <div className="w-16 h-1 bg-amber-100/60 rounded-full" />
              </div>

              {/* Bag Brand Title & Visual */}
              <div className="text-center my-auto flex flex-col items-center">
                <div className="text-2xl sm:text-3xl filter drop-shadow-md">
                  {snack.icon}
                </div>
                <div className="bg-amber-100 text-stone-900 font-black px-3 py-0.5 rounded-lg text-sm sm:text-lg tracking-wider font-['Noto_Sans_SC'] shadow-md border border-amber-300 mt-1">
                  {snack.name}
                </div>
                <div className="text-[9px] sm:text-[11px] text-amber-100/90 font-mono mt-0.5 font-bold">
                  {snack.tagline}
                </div>
              </div>

              {/* Bag Bottom Seal */}
              <div className="w-full text-center text-[8px] sm:text-[9px] text-amber-200/80 font-mono border-t border-amber-400/40 pt-0.5">
                NET WT. 85g · 嘎嘣脆
              </div>
            </div>

            {/* Right Hand Pinching Snack Chip (右手捏薯片往嘴里送) */}
            <div className={`absolute right-4 sm:right-16 bottom-2 w-32 sm:w-44 h-36 sm:h-48 z-20 transition-all duration-100 ${
              chewing ? '-translate-y-6 -translate-x-2' : ''
            }`}>
              {/* Right Sleeve */}
              <div className="absolute -bottom-4 right-2 w-20 h-28 bg-stone-900 rounded-t-xl -rotate-12" />
              
              {/* Right Hand & Fingers */}
              <div className="absolute top-12 right-6 w-16 h-16 bg-[#eac59b] rounded-2xl border border-[#c29668] shadow-md transform rotate-12 flex items-start justify-start p-1">
                {/* Thumb & Index pinching chip */}
                <div className="w-6 h-4 bg-[#deb185] rounded-full -mt-2 -ml-1 border border-[#c29668]" />
                
                {/* Crisp Golden Potato Chip */}
                <div className={`w-8 sm:w-10 h-6 sm:h-8 bg-gradient-to-br from-amber-200 via-amber-400 to-yellow-500 rounded-full border border-amber-500 shadow-md transform -rotate-45 -mt-3 -ml-3 flex items-center justify-center ${
                  chewing ? 'scale-125' : ''
                }`}>
                  <div className="w-2 h-2 bg-amber-600/30 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
