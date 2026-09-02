import React from 'react';
import { TeacherState, HeadmasterState } from '../types';
import { AlertTriangle, Eye } from 'lucide-react';

interface ClassroomSceneProps {
  teacherState: TeacherState;
  headmasterState: HeadmasterState;
  isCaught: boolean;
}

export const ClassroomScene: React.FC<ClassroomSceneProps> = ({
  teacherState,
  headmasterState,
  isCaught,
}) => {
  return (
    <div className="relative w-full h-full overflow-hidden bg-stone-800 select-none">
      {/* 1. Classroom Sunlight & Wall Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-stone-700 via-stone-800 to-stone-900" />
      
      {/* Sunlight beam from left window */}
      <div 
        className="absolute top-0 left-0 w-96 h-full pointer-events-none opacity-20 bg-gradient-to-br from-amber-100 via-amber-200 to-transparent transform -skew-x-12" 
      />

      {/* Left Wall Furniture / Plant Shelf */}
      <div className="absolute left-3 top-12 w-28 h-64 border-r-2 border-stone-600/40 bg-stone-800/60 p-2 hidden sm:flex flex-col justify-between shadow-lg">
        <div className="flex flex-col items-center">
          {/* Potted Plant */}
          <div className="w-10 h-10 relative">
            <div className="absolute bottom-0 w-8 h-6 bg-stone-700 rounded-b-md border border-stone-600 mx-auto left-1" />
            <div className="absolute top-0 left-2 w-3 h-5 bg-emerald-600 rounded-full rotate-[-20deg]" />
            <div className="absolute top-0 left-4 w-3 h-6 bg-emerald-500 rounded-full rotate-[15deg]" />
            <div className="absolute top-1 left-3 w-3 h-5 bg-emerald-700 rounded-full" />
          </div>
          <div className="w-14 h-1.5 bg-stone-600 mt-1 rounded" />
        </div>
        {/* Books on shelf */}
        <div className="flex items-end justify-center gap-1">
          <div className="w-3 h-10 bg-amber-700/80 rounded-t-sm" />
          <div className="w-2.5 h-12 bg-sky-800/80 rounded-t-sm" />
          <div className="w-3.5 h-8 bg-rose-800/80 rounded-t-sm rotate-6" />
        </div>
      </div>

      {/* 2. Top-Right Rear Door / Inspector Window */}
      <div className="absolute right-4 top-3 sm:right-10 sm:top-5 w-24 sm:w-32 h-36 sm:h-48 bg-stone-900 border-4 border-stone-700/80 rounded-t-lg shadow-2xl overflow-hidden z-20">
        {/* Door frame label */}
        <div className="w-full bg-stone-800 py-0.5 text-center text-[10px] text-stone-400 font-mono border-b border-stone-700">
          后门观察窗
        </div>
        
        {/* Window glass pane */}
        <div className="relative w-full h-full bg-slate-950 flex items-center justify-center">
          {/* Glass glare line */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />

          {/* Headmaster States */}
          {headmasterState === 'IDLE' && (
            <div className="text-stone-700 text-[11px] font-sans">走廊静悄悄</div>
          )}

          {headmasterState === 'FOOTSTEPS' && (
            <div className="flex flex-col items-center animate-pulse">
              <span className="text-amber-400 text-xs font-bold font-mono">嗒...嗒...</span>
              <span className="text-[10px] text-stone-400">脚步声逼近!</span>
            </div>
          )}

          {(headmasterState === 'WARNING' || headmasterState === 'PEEKING') && (
            <div className="relative w-full h-full flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300">
              {/* Dark head silhouette */}
              <div className="w-16 h-20 bg-stone-950 rounded-t-full border-2 border-stone-800 relative flex flex-col items-center pt-5 shadow-2xl">
                {/* Glowing Glinting Glasses (反光眼镜) */}
                <div className="flex items-center gap-1 z-10">
                  <div className="w-4 h-3 bg-cyan-100 rounded-sm border border-cyan-400 shadow-[0_0_8px_#38bdf8] flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping opacity-75" />
                  </div>
                  <div className="w-2 h-0.5 bg-stone-700" />
                  <div className="w-4 h-3 bg-cyan-100 rounded-sm border border-cyan-400 shadow-[0_0_8px_#38bdf8] flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping opacity-75" />
                  </div>
                </div>
                {/* Hair line */}
                <div className="absolute top-0 w-14 h-4 bg-stone-900 rounded-t-full" />
              </div>
              
              {/* Alert Badge */}
              <div className="absolute bottom-1 bg-red-600/90 text-white text-[9px] px-1.5 py-0.5 rounded font-bold tracking-wider animate-bounce flex items-center gap-0.5">
                <Eye className="w-2.5 h-2.5" />
                主任注视中!
              </div>
            </div>
          )}

          {headmasterState === 'LEAVING' && (
            <div className="text-emerald-400 text-[10px] animate-pulse">主任走远了...</div>
          )}
        </div>
      </div>

      {/* 3. Center Blackboard (黑板 - 仿参考图写有导数与函数图象) */}
      <div className="absolute left-1/2 -translate-x-1/2 top-4 sm:top-6 w-[94%] max-w-4xl h-60 sm:h-80 bg-[#1e382b] border-[8px] sm:border-[12px] border-[#8a5d3b] rounded-lg shadow-[0_15px_30px_rgba(0,0,0,0.6)] overflow-hidden">
        {/* Chalk dust and blackboard texture */}
        <div className="absolute inset-0 bg-radial from-transparent via-[#1b3327] to-[#12241b] opacity-90" />
        
        {/* Chalk Content Drawing */}
        <div className="relative w-full h-full p-4 sm:p-6 text-stone-200 select-none pointer-events-none font-serif">
          {/* Main Title: 函数的导数 */}
          <div className="text-xl sm:text-3xl font-bold tracking-widest text-emerald-100/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] font-['Noto_Sans_SC']">
            函数的导数
          </div>

          <div className="grid grid-cols-2 gap-4 mt-2 sm:mt-4 text-xs sm:text-base">
            {/* Left Math block: Parabola */}
            <div className="flex flex-col gap-1">
              <div className="font-mono text-emerald-200/90 tracking-wide text-sm sm:text-lg">
                y = x²
              </div>
              <div className="font-mono text-emerald-200/90 tracking-wide text-sm sm:text-lg">
                y' = 2x
              </div>

              {/* Parabola Coordinate System (SVG) */}
              <svg className="w-32 sm:w-48 h-24 sm:h-32 text-emerald-100/80 stroke-current fill-none stroke-[1.5]">
                {/* Y Axis */}
                <line x1="60" y1="90" x2="60" y2="10" strokeDasharray="1 0" />
                <polyline points="56,16 60,8 64,16" />
                <text x="66" y="16" fill="currentColor" stroke="none" className="text-[10px] font-sans">y</text>
                
                {/* X Axis */}
                <line x1="10" y1="75" x2="110" y2="75" />
                <polyline points="104,71 112,75 104,79" />
                <text x="110" y="88" fill="currentColor" stroke="none" className="text-[10px] font-sans">x</text>
                <text x="48" y="88" fill="currentColor" stroke="none" className="text-[10px] font-sans">0</text>
                
                {/* Parabola Curve y = x^2 */}
                <path d="M 25,25 Q 60,85 95,25" strokeWidth="2" />
              </svg>
            </div>

            {/* Right Math block: Sine Wave */}
            <div className="flex flex-col gap-1 pl-4 sm:pl-8 border-l border-emerald-900/40">
              <div className="font-mono text-emerald-200/90 tracking-wide text-sm sm:text-lg">
                y = sin x
              </div>
              <div className="font-mono text-emerald-200/90 tracking-wide text-sm sm:text-lg">
                y' = cos x
              </div>

              {/* Sine Wave Curve (SVG) */}
              <svg className="w-32 sm:w-48 h-20 sm:h-28 text-emerald-100/80 stroke-current fill-none stroke-[1.5] mt-1">
                {/* Axis */}
                <line x1="5" y1="50" x2="115" y2="50" />
                <polyline points="110,47 116,50 110,53" />
                {/* Sine curve */}
                <path d="M 10,50 Q 30,15 55,50 T 100,50" strokeWidth="2" />
              </svg>
            </div>
          </div>

          {/* Chalk bottom eraser tray */}
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-stone-700/80 flex items-center justify-center gap-4">
            <div className="w-8 h-1.5 bg-yellow-100 rounded-sm" />
            <div className="w-10 h-1.5 bg-white rounded-sm" />
            <div className="w-6 h-1.5 bg-rose-200 rounded-sm" />
          </div>
        </div>
      </div>

      {/* 4. Teacher's Podium (讲台 - 下移协调比例) */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-2 sm:bottom-4 w-72 sm:w-96 h-12 bg-amber-900 border-t-4 border-amber-700 shadow-2xl rounded-t-sm z-10 flex justify-center items-start pt-1">
        <div className="w-20 h-3 bg-stone-800/80 rounded border border-stone-700/50" />
      </div>

      {/* 5. Teacher Character (老师角色 - 下移至讲台前) */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-2 sm:bottom-4 z-10 flex flex-col items-center">
        
        {/* Alert Icon Bubble over teacher's head */}
        {teacherState === 'ALERT_PAUSE' && (
          <div className="absolute -top-16 z-30 flex flex-col items-center animate-bounce">
            <div className="bg-red-600 text-white text-xs font-black px-3 py-1 rounded-full shadow-[0_0_15px_#dc2626] border-2 border-white flex items-center gap-1">
              <AlertTriangle className="w-4 h-4 text-yellow-300 animate-spin" />
              <span className="font-['Fredoka'] tracking-wider">! 停笔警觉 !</span>
            </div>
            <div className="w-2 h-2 bg-red-600 rotate-45 -mt-1" />
          </div>
        )}

        {isCaught && (
          <div className="absolute -top-20 z-30 flex flex-col items-center animate-pulse">
            <div className="bg-red-700 text-white text-sm font-black px-4 py-1.5 rounded-lg shadow-[0_0_25px_#ef4444] border-2 border-amber-300 flex items-center gap-1.5">
              <span>🚨</span>
              <span className="tracking-widest">抓现行了！</span>
            </div>
            <div className="w-3 h-3 bg-red-700 rotate-45 -mt-1.5" />
          </div>
        )}

        {/* Teacher Body Graphics */}
        <div className={`relative transition-transform duration-300 ${
          teacherState === 'ALERT_PAUSE' ? 'scale-105' : ''
        }`}>

          {/* BACK VIEW (老师背对写板书) */}
          {(teacherState === 'WRITING' || teacherState === 'ALERT_PAUSE') && (
            <div className="relative w-36 sm:w-44 h-56 sm:h-64 flex flex-col items-center">
              {/* Head with Long Dark Hair */}
              <div className="relative w-16 h-20 bg-stone-900 rounded-t-full rounded-b-lg shadow-md z-10">
                {/* Hair strands & highlight */}
                <div className="absolute inset-x-2 top-2 h-14 bg-stone-800 rounded-t-full" />
                <div className="absolute -bottom-3 inset-x-1 h-8 bg-stone-900 rounded-b-xl" />
                {/* White hair clip */}
                <div className="absolute top-6 right-1 w-2 h-4 bg-rose-300 rounded" />
              </div>

              {/* White Blouse / Shirt Back */}
              <div className="relative w-24 sm:w-28 h-20 bg-stone-100 border-x-2 border-stone-300 rounded-t-lg shadow-inner mt-[-6px] flex justify-center">
                {/* Wrinkle lines */}
                <div className="w-0.5 h-12 bg-stone-300 mt-2" />
                <div className="absolute left-3 top-4 w-4 h-6 border-b border-stone-300" />
                <div className="absolute right-3 top-4 w-4 h-6 border-b border-stone-300" />

                {/* Left Arm (holding eraser or resting) */}
                <div className="absolute -left-3 top-2 w-5 h-16 bg-stone-100 border border-stone-300 rounded-full rotate-6 shadow-sm" />

                {/* Right Arm: Writing Chalk Animation */}
                <div className={`absolute -right-3 top-1 w-6 h-18 bg-stone-100 border border-stone-300 rounded-full origin-top transition-transform ${
                  teacherState === 'WRITING' 
                    ? 'animate-[wiggle_1.2s_ease-in-out_infinite]' 
                    : 'rotate-[-35deg]'
                }`}>
                  {/* Hand holding chalk piece */}
                  <div className="absolute bottom-0 right-1 w-4 h-4 bg-amber-200 rounded-full flex items-center justify-end">
                    <div className="w-2 h-4 bg-white rounded-t-sm rotate-45 -mr-1" />
                  </div>
                </div>
              </div>

              {/* Dark Skirt (高腰半身裙) */}
              <div className="w-20 sm:w-24 h-16 bg-slate-900 border-t-4 border-slate-950 rounded-b-md shadow-md" />
            </div>
          )}

          {/* FRONT VIEW (老师转身视察正面 / 抓包) */}
          {(teacherState === 'TURNING' || teacherState === 'INSPECTING' || teacherState === 'TURNING_BACK' || isCaught) && (
            <div className={`relative w-36 sm:w-44 h-56 sm:h-64 flex flex-col items-center transition-transform duration-200 ${
              isCaught ? 'scale-110' : ''
            }`}>
              {/* Head & Face */}
              <div className="relative w-16 h-20 bg-amber-100 rounded-full border border-amber-200 shadow-md z-10 flex flex-col items-center pt-2">
                {/* Hair bang */}
                <div className="absolute -top-1 inset-x-0 h-6 bg-stone-900 rounded-t-full" />
                <div className="absolute top-2 -left-1 w-3 h-12 bg-stone-900 rounded-b-full" />
                <div className="absolute top-2 -right-1 w-3 h-12 bg-stone-900 rounded-b-full" />

                {/* Eyes & Glasses */}
                <div className="relative z-10 flex items-center gap-1.5 mt-3">
                  {/* Sharp Glasses */}
                  <div className={`w-4 h-3.5 bg-white/20 border-2 rounded-sm flex items-center justify-center transition-colors ${
                    isCaught ? 'border-red-600 bg-red-100/50' : 'border-stone-800'
                  }`}>
                    {/* Iris */}
                    <div className={`w-2 h-2 rounded-full ${
                      isCaught ? 'bg-red-600 animate-ping' : 'bg-stone-900'
                    }`} />
                  </div>
                  <div className="w-1.5 h-0.5 bg-stone-800" />
                  <div className={`w-4 h-3.5 bg-white/20 border-2 rounded-sm flex items-center justify-center transition-colors ${
                    isCaught ? 'border-red-600 bg-red-100/50' : 'border-stone-800'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${
                      isCaught ? 'bg-red-600 animate-ping' : 'bg-stone-900'
                    }`} />
                  </div>
                </div>

                {/* Eyebrows (Stern / Angled) */}
                <div className="absolute top-4 inset-x-2 flex justify-between z-20">
                  <div className="w-3.5 h-0.5 bg-stone-900 rotate-[15deg]" />
                  <div className="w-3.5 h-0.5 bg-stone-900 -rotate-[15deg]" />
                </div>

                {/* Mouth */}
                <div className="mt-3">
                  {isCaught ? (
                    <div className="w-4 h-3 bg-red-900 rounded-b-full border border-red-700" />
                  ) : (
                    <div className="w-3 h-0.5 bg-stone-700 rounded-full" />
                  )}
                </div>
              </div>

              {/* Front White Blouse with Collar and Tie */}
              <div className="relative w-24 sm:w-28 h-20 bg-stone-100 border-x-2 border-stone-300 rounded-t-lg shadow-md mt-[-6px] flex flex-col items-center">
                {/* Collar */}
                <div className="w-8 h-3 bg-stone-200 border-b border-stone-400 rounded-b-sm" />
                {/* Blue Tie */}
                <div className="w-2.5 h-10 bg-indigo-900 rounded-b-sm shadow" />

                {/* Arms on hips or pointing */}
                {isCaught ? (
                  /* Pointing stern finger directly at player! */
                  <div className="absolute -right-5 top-1 w-14 h-6 bg-stone-100 border border-stone-300 rounded-full rotate-[-10deg] flex items-center justify-end shadow-md">
                    <div className="w-6 h-4 bg-amber-200 rounded-full border border-amber-300 flex items-center pr-1">
                      <div className="w-3 h-1.5 bg-amber-300 rounded-full" />
                    </div>
                  </div>
                ) : (
                  /* Hands on hip inspection pose */
                  <>
                    <div className="absolute -left-3 top-2 w-5 h-14 bg-stone-100 border border-stone-300 rounded-full rotate-[20deg]" />
                    <div className="absolute -right-3 top-2 w-5 h-14 bg-stone-100 border border-stone-300 rounded-full -rotate-[20deg]" />
                  </>
                )}
              </div>

              {/* Dark Skirt */}
              <div className="w-20 sm:w-24 h-16 bg-slate-900 border-t-4 border-slate-950 rounded-b-md shadow-md" />
            </div>
          )}
        </div>
      </div>

      {/* 6. Caught Dramatic Red Spotlight & Speed Lines */}
      {isCaught && (
        <div className="absolute inset-0 pointer-events-none z-40 bg-red-900/30 backdrop-blur-[1px] animate-pulse flex items-center justify-center">
          <div className="w-full h-full bg-[radial-gradient(circle_at_center,transparent_30%,rgba(185,28,28,0.7)_100%)]" />
        </div>
      )}
    </div>
  );
};
