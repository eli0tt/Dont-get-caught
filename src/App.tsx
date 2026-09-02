import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameState, TeacherState, HeadmasterState, RollingItem, SnackConfig, GameStats, Excuse, ClassmateNoiseEvent, TattleEvent } from './types';
import { SNACK_PRESETS } from './data/snacks';
import { FUNNY_EXCUSES } from './data/excuses';
import { sound } from './utils/audio';
import { ClassroomScene } from './components/ClassroomScene';
import { DeskView } from './components/DeskView';
import { GameHUD } from './components/GameHUD';
import { CaughtModal } from './components/CaughtModal';
import { VictoryModal } from './components/VictoryModal';
import { SnackSelectorModal } from './components/SnackSelectorModal';

const CLASSMATE_NOISE_PRESETS: Array<{ text: string; icon: string; soundType: 'sneeze' | 'chair' | 'drop' | 'cough' | 'paper'; decibelBoost: number }> = [
  { text: '后排同桌打了个轻声喷嚏', icon: '🤧', soundType: 'sneeze', decibelBoost: 12 },
  { text: '斜后方同学挪动椅子摩擦声', icon: '🪑', soundType: 'chair', decibelBoost: 15 },
  { text: '前排同学橡皮掉在桌上', icon: '💥', soundType: 'drop', decibelBoost: 16 },
  { text: '隔壁同学忍不住低声咳嗽', icon: '😷', soundType: 'cough', decibelBoost: 11 },
  { text: '后桌同学翻动草稿试卷纸', icon: '📄', soundType: 'paper', decibelBoost: 10 },
];

const TATTLE_QUOTES: string[] = [
  '老师！有人在底下吃东西！',
  '报告老师！张同学在偷吃零食！',
  '老师！我闻到了辣条薯片味！',
  '报告老师！他桌肚里藏了吃的！',
  '老师！后排有人一直在嚼东西！',
];

export default function App() {
  // Game States
  const [gameState, setGameState] = useState<GameState>('MENU');
  const [selectedSnack, setSelectedSnack] = useState<SnackConfig>(SNACK_PRESETS[0]);
  const [difficulty, setDifficulty] = useState<'NORMAL' | 'HARD' | 'HELL'>('NORMAL');

  // Teacher State Machine
  const [teacherState, setTeacherState] = useState<TeacherState>('WRITING');
  const [headmasterState, setHeadmasterState] = useState<HeadmasterState>('IDLE');

  // Player State
  const [isCovering, setIsCovering] = useState<boolean>(false);
  const [intakeCount, setIntakeCount] = useState<number>(0);
  const [combo, setCombo] = useState<number>(1);
  const [maxCombo, setMaxCombo] = useState<number>(1);
  const [decibel, setDecibel] = useState<number>(20);
  const [chewing, setChewing] = useState<boolean>(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(65);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Quick Time Event Item
  const [rollingItem, setRollingItem] = useState<RollingItem | null>(null);

  // Disturbance Events
  const [classmateNoise, setClassmateNoise] = useState<ClassmateNoiseEvent | null>(null);
  const [tattleEvent, setTattleEvent] = useState<TattleEvent | null>(null);

  // Caught & Summary Data
  const [caughtReason, setCaughtReason] = useState<string>('');
  const [excuse, setExcuse] = useState<Excuse>(FUNNY_EXCUSES[0]);
  const [stats, setStats] = useState<GameStats>({
    snacksEaten: 0,
    maxCombo: 1,
    currentCombo: 1,
    dodgedTeacherChecks: 0,
    dodgedHeadmasterChecks: 0,
    dodgedTattles: 0,
    classmateNoisesWitnessed: 0,
    itemsRescued: 0,
    itemsDropped: 0,
    peakDecibel: 20,
    timeSurvived: 0,
    totalTime: 65,
    difficulty: 'NORMAL',
  });

  // Refs for loop controls
  const lastEatTime = useRef<number>(0);
  const lastNoiseAlertTime = useRef<number>(0);
  const alertCauseRef = useRef<'NOISE' | 'PERIODIC'>('PERIODIC');
  const headmasterPatrolCountRef = useRef<number>(0);
  const teacherTimerRef = useRef<NodeJS.Timeout | null>(null);
  const headmasterTimeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const rollingItemTimerRef = useRef<NodeJS.Timeout | null>(null);
  const disturbanceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const tattleTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const dangerThreshold = difficulty === 'HELL' ? 75 : difficulty === 'HARD' ? 80 : 85;

  // Real-time state refs to avoid effect re-triggering and timer reset bugs
  const difficultyRef = useRef(difficulty);
  difficultyRef.current = difficulty;

  const isCoveringRef = useRef(isCovering);
  isCoveringRef.current = isCovering;

  const decibelRef = useRef(decibel);
  decibelRef.current = decibel;

  const dangerThresholdRef = useRef(dangerThreshold);
  dangerThresholdRef.current = dangerThreshold;

  const teacherStateRef = useRef(teacherState);
  teacherStateRef.current = teacherState;

  const headmasterStateRef = useRef(headmasterState);
  headmasterStateRef.current = headmasterState;

  const tattleEventRef = useRef(tattleEvent);
  tattleEventRef.current = tattleEvent;

  // Clear all pending headmaster timeouts
  const clearHeadmasterTimeouts = useCallback(() => {
    headmasterTimeoutsRef.current.forEach(t => clearTimeout(t));
    headmasterTimeoutsRef.current = [];
  }, []);

  // Trigger Caught Red-Handed (当场抓获)
  const triggerCaught = useCallback((reason: string) => {
    sound.playCaughtSting();
    setCaughtReason(reason);
    const randomExcuse = FUNNY_EXCUSES[Math.floor(Math.random() * FUNNY_EXCUSES.length)];
    setExcuse(randomExcuse);
    setGameState('CAUGHT');
  }, []);

  // Trigger Victory (下课铃响)
  const triggerVictory = useCallback(() => {
    sound.playSchoolBell();
    setGameState('VICTORY');
  }, []);

  // Start / Reset Game (高难度关卡时间设置略长一些：普通 65s，困难 85s，地狱 105s)
  const handleStartGame = (diff: 'NORMAL' | 'HARD' | 'HELL') => {
    clearHeadmasterTimeouts();
    if (teacherTimerRef.current) clearTimeout(teacherTimerRef.current);
    if (rollingItemTimerRef.current) clearTimeout(rollingItemTimerRef.current);
    if (disturbanceTimerRef.current) clearTimeout(disturbanceTimerRef.current);
    if (tattleTimeoutRef.current) clearTimeout(tattleTimeoutRef.current);

    setDifficulty(diff);
    setGameState('PLAYING');
    setIsPaused(false);
    setIsCovering(false);
    setIntakeCount(0);
    setCombo(1);
    setMaxCombo(1);
    setDecibel(20);
    const initialTime = diff === 'NORMAL' ? 65 : diff === 'HARD' ? 85 : 105;
    setTimeRemaining(initialTime);
    setTeacherState('WRITING');
    setHeadmasterState('IDLE');
    setRollingItem(null);
    setClassmateNoise(null);
    setTattleEvent(null);
    headmasterPatrolCountRef.current = 0;
    alertCauseRef.current = 'PERIODIC';
    lastNoiseAlertTime.current = 0;

    setStats({
      snacksEaten: 0,
      maxCombo: 1,
      currentCombo: 1,
      dodgedTeacherChecks: 0,
      dodgedHeadmasterChecks: 0,
      dodgedTattles: 0,
      classmateNoisesWitnessed: 0,
      itemsRescued: 0,
      itemsDropped: 0,
      peakDecibel: 20,
      timeSurvived: 0,
      totalTime: initialTime,
      difficulty: diff,
    });
  };

  // 1. EAT SNACK (按空格偷吃)
  const handleEatTap = useCallback(() => {
    if (gameState !== 'PLAYING' || isPaused) return;

    const now = Date.now();
    if (now - lastEatTime.current < selectedSnack.biteCooldown) return;
    lastEatTime.current = now;

    // If currently covering with book, eating automatically uncovers!
    if (isCoveringRef.current) {
      setIsCovering(false);
    }

    // Check if Teacher is inspecting OR Headmaster is peeking
    if (teacherStateRef.current === 'INSPECTING' || teacherStateRef.current === 'TURNING') {
      triggerCaught('在老师转过身正视全班时大口咀嚼！');
      return;
    }

    if (headmasterState === 'PEEKING') {
      triggerCaught('教导主任在后门观察窗盯住你时偷吃！');
      return;
    }

    // Play Sound & Crunch effect
    sound.playCrunch(selectedSnack.soundType);
    setChewing(true);
    setTimeout(() => setChewing(false), 200);

    // Increase Intake & Combo
    setIntakeCount(prev => {
      const newCount = prev + 1;
      setStats(s => ({ ...s, snacksEaten: newCount }));
      return newCount;
    });

    setCombo(prev => {
      const nextCombo = Math.min(5.0, prev + 0.1);
      setMaxCombo(mc => Math.max(mc, nextCombo));
      setStats(s => ({ ...s, currentCombo: nextCombo, maxCombo: Math.max(s.maxCombo, nextCombo) }));
      return nextCombo;
    });

    // Increase Decibel
    setDecibel(prev => {
      const nextDb = Math.min(100, prev + selectedSnack.decibelPerBite);
      setStats(s => ({ ...s, peakDecibel: Math.max(s.peakDecibel, nextDb) }));

      // Heartbeat sound if close to danger
      if (nextDb > dangerThreshold - 10) {
        sound.playHeartbeat();
      }

      // Check if decibel exceeds danger threshold -> Alert teacher to pause writing with a chance of turning
      if (nextDb >= dangerThreshold && teacherStateRef.current === 'WRITING') {
        const canTriggerNoiseAlert = now - lastNoiseAlertTime.current > 2200;
        if (canTriggerNoiseAlert) {
          lastNoiseAlertTime.current = now;
          alertCauseRef.current = 'NOISE';
          sound.playAlert();
          if (teacherTimerRef.current) clearTimeout(teacherTimerRef.current);
          setTeacherState('ALERT_PAUSE');
        }
      }

      return nextDb;
    });
  }, [gameState, isPaused, selectedSnack, headmasterState, dangerThreshold, triggerCaught]);

  // 2. TOGGLE BOOK COVER (B 键 课本掩护)
  const handleToggleCover = useCallback(() => {
    if (gameState !== 'PLAYING' || isPaused) return;
    sound.playBookCover();

    setIsCovering(prev => {
      const nextState = !prev;

      // If player is now covering (nextState is true), check if resolving an active tattle event
      if (nextState && tattleEventRef.current && tattleEventRef.current.status === 'ACTIVE') {
        sound.playTattleSuccess();
        const updated: TattleEvent = { ...tattleEventRef.current, status: 'DODGED' };
        setTattleEvent(updated);
        tattleEventRef.current = updated;
        setStats(s => ({ ...s, dodgedTattles: s.dodgedTattles + 1 }));

        // 同学打小报告，玩家举书掩护后，老师听到告状声立刻回头转身检查！
        if (teacherTimerRef.current) clearTimeout(teacherTimerRef.current);
        sound.playAlert();
        setTeacherState('TURNING');

        setTimeout(() => {
          setTattleEvent(null);
          tattleEventRef.current = null;
        }, 1800);
      }

      return nextState;
    });
  }, [gameState, isPaused]);

  // 3. RESCUE DESK ITEM (F 键 抢救杂物)
  const handleRescueItem = useCallback(() => {
    if (gameState !== 'PLAYING' || isPaused || !rollingItem || !rollingItem.active) return;
    sound.playRescue();
    setRollingItem(prev => (prev ? { ...prev, active: false, saved: true } : null));
    setStats(s => ({ ...s, itemsRescued: s.itemsRescued + 1 }));
  }, [gameState, isPaused, rollingItem]);

  // Keyboard Event Handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handleEatTap();
      } else if (e.code === 'KeyB') {
        e.preventDefault();
        handleToggleCover();
      } else if (e.code === 'KeyF') {
        e.preventDefault();
        handleRescueItem();
      } else if (e.code === 'Escape' && gameState === 'PLAYING') {
        setIsPaused(p => !p);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleEatTap, handleToggleCover, handleRescueItem, gameState]);

  // TEACHER BEHAVIOR STATE MACHINE LOOP
  useEffect(() => {
    if (gameState !== 'PLAYING' || isPaused) return;

    if (teacherState === 'WRITING') {
      // Occasional chalk scratch sound
      const chalkInterval = setInterval(() => {
        if (Math.random() > 0.4) sound.playChalk();
      }, 1400);

      // Randomly write before normal pause: HELL: 2.2~4.2s, HARD: 3.2~5.5s, NORMAL: 4.2~7.0s
      const writeDuration = difficulty === 'HELL' 
        ? (2200 + Math.random() * 2000) 
        : difficulty === 'HARD' 
        ? (3200 + Math.random() * 2300) 
        : (4200 + Math.random() * 2800);

      teacherTimerRef.current = setTimeout(() => {
        alertCauseRef.current = 'PERIODIC';
        sound.playAlert();
        setTeacherState('ALERT_PAUSE');
      }, writeDuration);

      return () => {
        clearInterval(chalkInterval);
        if (teacherTimerRef.current) clearTimeout(teacherTimerRef.current);
      };
    }

    if (teacherState === 'ALERT_PAUSE') {
      // Clean up any lingering tattle event if teacher is already pausing
      if (tattleEventRef.current && tattleEventRef.current.status === 'ACTIVE') {
        setTattleEvent(null);
        tattleEventRef.current = null;
      }
      setClassmateNoise(null);

      // Pause lasts about 0.9s ~ 1.1s so player has time to react
      teacherTimerRef.current = setTimeout(() => {
        let turnProbability = 0.60;
        const currentDb = decibelRef.current;
        const threshold = dangerThresholdRef.current;

        if (alertCauseRef.current === 'NOISE') {
          turnProbability = currentDb >= threshold 
            ? (difficulty === 'HELL' ? 0.95 : difficulty === 'HARD' ? 0.88 : 0.78) 
            : (difficulty === 'HELL' ? 0.75 : difficulty === 'HARD' ? 0.65 : 0.52);
        } else {
          turnProbability = difficulty === 'NORMAL' ? 0.60 : difficulty === 'HARD' ? 0.75 : 0.85;
        }

        const willTurn = Math.random() < turnProbability;
        alertCauseRef.current = 'PERIODIC';

        if (willTurn) {
          setTeacherState('TURNING');
        } else {
          setTeacherState('WRITING');
        }
      }, 1000);

      return () => {
        if (teacherTimerRef.current) clearTimeout(teacherTimerRef.current);
      };
    }

    if (teacherState === 'TURNING') {
      teacherTimerRef.current = setTimeout(() => {
        setTeacherState('INSPECTING');
      }, 260);

      return () => {
        if (teacherTimerRef.current) clearTimeout(teacherTimerRef.current);
      };
    }

    if (teacherState === 'INSPECTING') {
      // 1. 减少老师转身后检视的时间：从原先的1.9~3.3s精简为 1.0s ~ 1.5s，让玩家能更快恢复进食节奏！
      const inspectDuration = difficulty === 'HELL' 
        ? (1200 + Math.random() * 300) 
        : difficulty === 'HARD' 
        ? (1100 + Math.random() * 300) 
        : (950 + Math.random() * 300);
      
      const inspectCheckInterval = setInterval(() => {
        if (!isCoveringRef.current) {
          triggerCaught('老师扫视全班时，你未举起课本掩护！');
        }
      }, 100);

      teacherTimerRef.current = setTimeout(() => {
        clearInterval(inspectCheckInterval);
        setTeacherState('TURNING_BACK');
        setStats(s => ({ ...s, dodgedTeacherChecks: s.dodgedTeacherChecks + 1 }));
      }, inspectDuration);

      return () => {
        clearInterval(inspectCheckInterval);
        if (teacherTimerRef.current) clearTimeout(teacherTimerRef.current);
      };
    }

    if (teacherState === 'TURNING_BACK') {
      teacherTimerRef.current = setTimeout(() => {
        setTeacherState('WRITING');
      }, 280);

      return () => {
        if (teacherTimerRef.current) clearTimeout(teacherTimerRef.current);
      };
    }
  }, [gameState, isPaused, teacherState, difficulty, triggerCaught]);

  // HEADMASTER INSPECTION CHECK (主任后门窗户注视)
  useEffect(() => {
    if (gameState !== 'PLAYING' || isPaused || headmasterState !== 'PEEKING') return;

    const checkHeadmasterInterval = setInterval(() => {
      if (!isCoveringRef.current) {
        triggerCaught('教导主任在后门窗户巡视时，你未举起课本掩护！');
      }
    }, 100);

    return () => clearInterval(checkHeadmasterInterval);
  }, [gameState, isPaused, headmasterState, triggerCaught]);

  // HEADMASTER PATROL LOOP
  useEffect(() => {
    if (gameState !== 'PLAYING' || isPaused) {
      clearHeadmasterTimeouts();
      return;
    }

    const maxPatrols = difficulty === 'HELL' ? 3 : difficulty === 'HARD' ? 2 : 1;
    if (headmasterPatrolCountRef.current >= maxPatrols) {
      return;
    }

    const initialDelay = headmasterPatrolCountRef.current === 0 
      ? (difficulty === 'HELL' ? 14000 : difficulty === 'HARD' ? 18000 : 22000) + Math.random() * 8000 
      : (difficulty === 'HELL' ? 24000 : 32000) + Math.random() * 8000;

    const addTimeout = (fn: () => void, ms: number) => {
      const t = setTimeout(fn, ms);
      headmasterTimeoutsRef.current.push(t);
      return t;
    };

    addTimeout(() => {
      if (headmasterPatrolCountRef.current >= maxPatrols) return;
      headmasterPatrolCountRef.current += 1;

      setHeadmasterState('FOOTSTEPS');
      sound.playFootstep();
      addTimeout(() => sound.playFootstep(), 500);
      addTimeout(() => sound.playFootstep(), 1000);

      addTimeout(() => {
        setHeadmasterState('WARNING');
      }, 1500);

      addTimeout(() => {
        setHeadmasterState('PEEKING');
        sound.playAlert();

        addTimeout(() => {
          setHeadmasterState('LEAVING');
          setStats(s => ({ ...s, dodgedHeadmasterChecks: s.dodgedHeadmasterChecks + 1 }));

          addTimeout(() => {
            setHeadmasterState('IDLE');
          }, 1200);
        }, difficulty === 'HELL' ? 2000 : 1600);
      }, 2200);

    }, initialDelay);

    return () => {
      clearHeadmasterTimeouts();
    };
  }, [gameState, isPaused, difficulty, clearHeadmasterTimeouts]);

  // 2. 区分难度的干扰调度器：高难度干扰频率适度提高，小报告比例也更高
  useEffect(() => {
    if (gameState !== 'PLAYING' || isPaused) return;

    const scheduleNextDisturbance = () => {
      // 动态间隔：普通(18~28s), 困难(12~20s), 地狱(8~14s)
      const baseMin = difficulty === 'HELL' ? 8000 : difficulty === 'HARD' ? 12000 : 18000;
      const baseVar = difficulty === 'HELL' ? 6000 : difficulty === 'HARD' ? 8000 : 10000;
      const nextDelay = baseMin + Math.random() * baseVar;

      disturbanceTimerRef.current = setTimeout(() => {
        // Condition: ONLY trigger when teacher is facing blackboard ('WRITING') and headmaster is IDLE
        if (teacherStateRef.current !== 'WRITING' || headmasterStateRef.current !== 'IDLE') {
          // If teacher is inspecting/turning, retry after 2.5 seconds
          disturbanceTimerRef.current = setTimeout(scheduleNextDisturbance, 2500);
          return;
        }

        // Tattle chance scales with difficulty: Normal 35%, Hard 48%, Hell 60%
        const tattleProbability = difficulty === 'HELL' ? 0.60 : difficulty === 'HARD' ? 0.48 : 0.35;
        const isTattle = Math.random() < tattleProbability;

        if (isTattle) {
          // Trigger Tattle Quick Time Event (适当延长反应时限：普通 1650ms, 困难 1400ms, 地狱 1200ms)
          const quote = TATTLE_QUOTES[Math.floor(Math.random() * TATTLE_QUOTES.length)];
          const duration = difficulty === 'HELL' ? 1200 : difficulty === 'HARD' ? 1400 : 1650;

          const newTattle: TattleEvent = {
            id: String(Date.now()),
            student: '同桌同学',
            quote,
            startTime: Date.now(),
            duration,
            deadline: Date.now() + duration,
            status: 'ACTIVE',
          };

          setTattleEvent(newTattle);
          tattleEventRef.current = newTattle;
          sound.playTattleAlert();

          tattleTimeoutRef.current = setTimeout(() => {
            if (tattleEventRef.current && tattleEventRef.current.status === 'ACTIVE') {
              if (!isCoveringRef.current) {
                setTattleEvent(prev => prev ? { ...prev, status: 'CAUGHT' } : null);
                if (teacherTimerRef.current) clearTimeout(teacherTimerRef.current);
                sound.playAlert();
                setTeacherState('TURNING');
                triggerCaught('同学突然打小报告，老师立刻回头将正在偷吃的你当场抓获！');
              } else {
                // 已提前或及时举书掩护：老师听到报告立刻转身检查
                sound.playTattleSuccess();
                const dodged: TattleEvent = { ...tattleEventRef.current, status: 'DODGED' };
                setTattleEvent(dodged);
                tattleEventRef.current = dodged;
                setStats(s => ({ ...s, dodgedTattles: s.dodgedTattles + 1 }));

                if (teacherTimerRef.current) clearTimeout(teacherTimerRef.current);
                sound.playAlert();
                setTeacherState('TURNING');

                setTimeout(() => {
                  setTattleEvent(null);
                  tattleEventRef.current = null;
                }, 1800);
              }
            }
          }, duration);

        } else {
          // Trigger Random Ambient Noise Event
          const preset = CLASSMATE_NOISE_PRESETS[Math.floor(Math.random() * CLASSMATE_NOISE_PRESETS.length)];
          const noiseEvent: ClassmateNoiseEvent = {
            id: String(Date.now()),
            text: preset.text,
            icon: preset.icon,
            soundType: preset.soundType,
            decibelBoost: preset.decibelBoost,
            timestamp: Date.now(),
          };

          sound.playClassmateNoise(preset.soundType);
          setClassmateNoise(noiseEvent);
          setStats(s => ({ ...s, classmateNoisesWitnessed: s.classmateNoisesWitnessed + 1 }));

          setDecibel(prev => {
            const spiked = Math.min(100, prev + preset.decibelBoost);
            setStats(s => ({ ...s, peakDecibel: Math.max(s.peakDecibel, spiked) }));

            if (spiked >= dangerThresholdRef.current && teacherStateRef.current === 'WRITING') {
              const now = Date.now();
              if (now - lastNoiseAlertTime.current > 1800) {
                lastNoiseAlertTime.current = now;
                alertCauseRef.current = 'NOISE';
                sound.playAlert();
                if (teacherTimerRef.current) clearTimeout(teacherTimerRef.current);
                setTeacherState('ALERT_PAUSE');
              }
            }
            return spiked;
          });

          setTimeout(() => {
            setClassmateNoise(null);
          }, 2200);
        }

        // Schedule next disturbance
        scheduleNextDisturbance();
      }, nextDelay);
    };

    scheduleNextDisturbance();

    return () => {
      if (disturbanceTimerRef.current) clearTimeout(disturbanceTimerRef.current);
      if (tattleTimeoutRef.current) clearTimeout(tattleTimeoutRef.current);
    };
  }, [gameState, isPaused, difficulty, triggerCaught]);

  // ROLLING DESK ITEMS QTE LOOP (难度区分：高难度更频繁且滚动更快)
  useEffect(() => {
    if (gameState !== 'PLAYING' || isPaused) return;

    const scheduleNextItem = () => {
      const minDelay = difficulty === 'HELL' ? 6000 : difficulty === 'HARD' ? 9000 : 13000;
      const varDelay = difficulty === 'HELL' ? 4000 : difficulty === 'HARD' ? 5000 : 7000;
      const delay = minDelay + Math.random() * varDelay;

      rollingItemTimerRef.current = setTimeout(() => {
        const itemTypes: Array<'PEN' | 'ERASER' | 'RULER' | 'CHALK'> = ['PEN', 'ERASER', 'RULER', 'CHALK'];
        const chosenType = itemTypes[Math.floor(Math.random() * itemTypes.length)];
        const names = { PEN: '圆珠笔', ERASER: '大橡皮', RULER: '三角尺', CHALK: '粉笔头' };

        const newItem: RollingItem = {
          id: String(Date.now()),
          name: names[chosenType],
          type: chosenType,
          x: 42 + Math.random() * 20,
          y: 30,
          speed: difficulty === 'HELL' ? 56 : difficulty === 'HARD' ? 44 : 32,
          active: true,
          saved: false,
          dropped: false,
        };

        setRollingItem(newItem);
      }, delay);
    };

    scheduleNextItem();

    return () => {
      if (rollingItemTimerRef.current) clearTimeout(rollingItemTimerRef.current);
    };
  }, [gameState, isPaused, difficulty]);

  // 3. Rolling Item Physics Animation
  // 高难度设置：如果杂物掉在地上，在高难度 (HARD / HELL) 下，老师会立刻由于巨响直接转身（TURNING / INSPECTING）！
  useEffect(() => {
    if (gameState !== 'PLAYING' || isPaused || !rollingItem || !rollingItem.active) return;

    const interval = setInterval(() => {
      setRollingItem(curr => {
        if (!curr || !curr.active) return curr;
        const nextY = curr.y + (curr.speed * 0.06);
        const nextX = curr.x + (curr.speed * 0.03);

        if (nextY >= 85) {
          sound.playDropThud();
          const currDiff = difficultyRef.current;

          // 核心机制：所有难度下杂物坠地都会产生大额噪声 (+30 dB)
          setDecibel(d => {
            const spiked = Math.min(100, d + 30);
            setStats(s => ({ ...s, peakDecibel: Math.max(s.peakDecibel, spiked) }));
            return spiked;
          });

          // 高难度（HARD 或 HELL）杂物坠地不仅发生噪声，还会让老师立刻转身！
          if (currDiff === 'HARD' || currDiff === 'HELL') {
            sound.playAlert();
            if (teacherTimerRef.current) clearTimeout(teacherTimerRef.current);
            // 老师听到重物落地巨响，立刻回头转身！
            setTeacherState('TURNING');
          } else {
            // 普通难度则在噪声突破阈值时进入停笔预警
            if (decibelRef.current + 30 >= dangerThresholdRef.current && teacherStateRef.current === 'WRITING') {
              sound.playAlert();
              if (teacherTimerRef.current) clearTimeout(teacherTimerRef.current);
              setTeacherState('ALERT_PAUSE');
            }
          }

          setStats(s => ({ ...s, itemsDropped: s.itemsDropped + 1 }));
          return { ...curr, active: false, dropped: true };
        }

        return { ...curr, y: nextY, x: nextX };
      });
    }, 50);

    return () => clearInterval(interval);
  }, [gameState, isPaused, rollingItem]);

  // MAIN GAME LOOP: Decibel Decay & Countdown Clock
  useEffect(() => {
    if (gameState !== 'PLAYING' || isPaused) return;

    const loop = setInterval(() => {
      // 1. Natural Decibel Decay when not eating
      setDecibel(prev => {
        const decayRate = isCovering ? 5.5 : 3.5;
        return Math.max(18, prev - decayRate);
      });

      // 2. Countdown Timer
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(loop);
          triggerVictory();
          return 0;
        }
        return prev - 1;
      });

      // 3. Combo Decay if no eating for long
      setCombo(prev => {
        if (prev > 1.0) {
          return Math.max(1.0, prev - 0.04);
        }
        return 1.0;
      });

    }, 1000);

    return () => clearInterval(loop);
  }, [gameState, isPaused, isCovering, triggerVictory]);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-stone-950 flex flex-col items-center justify-center font-['Noto_Sans_SC']">
      
      {/* --- CLASSROOM SCENE (TOP HALF) --- */}
      <div className="relative w-full h-[55%] sm:h-[58%]">
        <ClassroomScene
          teacherState={teacherState}
          headmasterState={headmasterState}
          isCaught={gameState === 'CAUGHT'}
        />
      </div>

      {/* --- DESK VIEW (BOTTOM HALF) --- */}
      <div className="relative w-full h-[45%] sm:h-[42%]">
        <DeskView
          isCovering={isCovering}
          snack={selectedSnack}
          intakeCount={intakeCount}
          chewing={chewing}
          rollingItem={rollingItem}
          onRescueItem={handleRescueItem}
          onEatTap={handleEatTap}
          onCoverToggle={handleToggleCover}
        />
      </div>

      {/* --- GAME HUD OVERLAY --- */}
      {gameState === 'PLAYING' && (
        <GameHUD
          timeRemaining={timeRemaining}
          totalTime={stats.totalTime}
          intakeCount={intakeCount}
          combo={combo}
          decibel={decibel}
          dangerThreshold={dangerThreshold}
          snack={selectedSnack}
          isCovering={isCovering}
          isMuted={isMuted}
          isPaused={isPaused}
          onToggleMute={() => {
            const next = !isMuted;
            setIsMuted(next);
            sound.setMuted(next);
          }}
          onTogglePause={() => setIsPaused(p => !p)}
          onEatTap={handleEatTap}
          onCoverToggle={handleToggleCover}
          onRescueTap={handleRescueItem}
          hasRollingItem={!!(rollingItem && rollingItem.active)}
          classmateNoise={classmateNoise}
          tattleEvent={tattleEvent}
        />
      )}

      {/* --- PAUSE OVERLAY --- */}
      {isPaused && gameState === 'PLAYING' && (
        <div className="fixed inset-0 z-40 bg-stone-950/80 backdrop-blur-md flex flex-col items-center justify-center p-4">
          <div className="bg-stone-900 border-2 border-stone-700 rounded-2xl p-6 text-center max-w-xs w-full space-y-4 shadow-2xl">
            <h3 className="text-xl font-black text-amber-300">课堂暂停中</h3>
            <p className="text-xs text-stone-400">老师也在喝口水，休息一下吧</p>
            <button
              onClick={() => setIsPaused(false)}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-black rounded-xl cursor-pointer"
            >
              继续摸鱼
            </button>
          </div>
        </div>
      )}

      {/* --- MENU / SNACK SELECTOR MODAL --- */}
      {gameState === 'MENU' && (
        <SnackSelectorModal
          selectedSnack={selectedSnack}
          onSelectSnack={setSelectedSnack}
          onStartGame={handleStartGame}
        />
      )}

      {/* --- CAUGHT RED-HANDED MODAL --- */}
      {gameState === 'CAUGHT' && (
        <CaughtModal
          stats={stats}
          excuse={excuse}
          snack={selectedSnack}
          caughtReason={caughtReason}
          onRetry={() => handleStartGame(difficulty)}
          onChangeSnack={() => setGameState('MENU')}
        />
      )}

      {/* --- VICTORY DISMISSAL BELL MODAL --- */}
      {gameState === 'VICTORY' && (
        <VictoryModal
          stats={stats}
          snack={selectedSnack}
          onPlayAgain={() => handleStartGame(difficulty)}
          onChangeSnack={() => setGameState('MENU')}
        />
      )}

    </main>
  );
}
