export type GameState = 'MENU' | 'PLAYING' | 'PAUSED' | 'CAUGHT' | 'VICTORY';

export type TeacherState = 
  | 'WRITING'        // 背对写板书 (Safe to eat)
  | 'ALERT_PAUSE'   // 停笔预警 (Warning! Stops writing, alert icon pops, ~1s)
  | 'TURNING'       // 转身中
  | 'INSPECTING'    // 正面视察 (Danger! Must NOT eat & MUST use Book Cover)
  | 'TURNING_BACK';  // 转回黑板

export type HeadmasterState = 
  | 'IDLE'          // 未出现
  | 'FOOTSTEPS'     // 远处沉重脚步声 嗒...嗒...嗒...
  | 'WARNING'       // 窗外人影浮现
  | 'PEEKING'       // 反光眼镜后门注视 (Danger! Strictly forbid eating)
  | 'LEAVING';      // 离开

export interface RollingItem {
  id: string;
  name: string;
  type: 'PEN' | 'ERASER' | 'RULER' | 'CHALK';
  x: number;          // 0% to 100% position on desk
  y: number;          // 0% to 100%
  speed: number;      // pixels or % per second
  active: boolean;
  saved: boolean;
  dropped: boolean;
}

export interface ClassmateNoiseEvent {
  id: string;
  text: string;
  icon: string;
  soundType: 'sneeze' | 'chair' | 'drop' | 'cough' | 'paper';
  decibelBoost: number;
  timestamp: number;
}

export interface TattleEvent {
  id: string;
  quote: string;
  student: string;
  startTime: number;
  duration: number;   // ms, e.g. 800ms (< 1s)
  deadline: number;
  status: 'ACTIVE' | 'DODGED' | 'CAUGHT';
}

export interface SnackConfig {
  id: string;
  name: string;
  pinyinName: string;
  tagline: string;
  icon: string;
  soundType: 'chips' | 'pocky' | 'spicy' | 'milktea' | 'gummy' | 'seeds';
  decibelPerBite: number;     // Decibel added per tap
  pointsPerBite: number;      // Score per tap
  biteCooldown: number;       // ms between allowed bites
  color: string;
  description: string;
  bagTexture: string;
}

export interface GameStats {
  snacksEaten: number;
  score: number;
  maxCombo: number;
  currentCombo: number;
  dodgedTeacherChecks: number;
  dodgedHeadmasterChecks: number;
  dodgedTattles: number;
  classmateNoisesWitnessed: number;
  itemsRescued: number;
  itemsDropped: number;
  peakDecibel: number;
  timeSurvived: number;       // seconds
  totalTime: number;          // default 80s or custom
  difficulty: 'NORMAL' | 'HARD' | 'HELL';
}

export interface Excuse {
  text: string;
  teacherResponse: string;
}
