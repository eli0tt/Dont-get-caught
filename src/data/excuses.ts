import { Excuse } from '../types';

export const FUNNY_EXCUSES: Excuse[] = [
  {
    text: '报告老师！我嘴里含的是高三数学公式记忆压缩片，正在顿悟求导切线！',
    teacherResponse: '“你那压缩片怎么还带着黄瓜味和嘎嘣脆的声效？站走廊去吃！”',
  },
  {
    text: '老师听我解释！这其实是草稿纸形状的威化饼干，我刚才在啃题目！',
    teacherResponse: '“草稿纸？草稿纸能吃出满嘴芝士碎屑吗？放学留下来背公式！”',
  },
  {
    text: '报告老师！我刚才是在做声波与空气动力学在课桌上的摩擦共振实验！',
    teacherResponse: '“共振得全班都闻到麻辣孜然味了是吧？没收！下课到我办公室！”',
  },
  {
    text: '老师，我的大脑思考函数极值过载，身体正在紧急自我注射碳水化合物！',
    teacherResponse: '“你那极值求到胃里去了？把你书桌洞里的存粮全部交出来！”',
  },
  {
    text: '天地良心啊老师！刚才后门有阵八级大风把薯片直接吹进了我的嘴里！',
    teacherResponse: '“风还顺便帮你把包装袋撕开了是吧？下周班会你来做深刻检讨！”',
  },
  {
    text: '报告老师，我刚才咬住的是我的大拇指！我在模仿罗丹的思想者！',
    teacherResponse: '“思想者手里还捏着两片波浪厚切薯片？你当我近视六百度看不见吗！”',
  },
  {
    text: '老师！同桌刚才硬塞我嘴里的，我是无辜的受害者啊！',
    teacherResponse: '“同桌在睡觉呢！你嚼得满脸陶醉还敢甩锅？去把全套导数题抄三遍！”',
  },
  {
    text: '报告老师，我嘴唇抽筋了，正在通过反复咬合进行肌肉康复训练！',
    teacherResponse: '“康复训练还伴随吞咽动作是吧？今天放学值日归你了！”',
  },
];

export const TITLES_BY_SCORE = [
  {
    minScore: 120,
    rank: 'SSS',
    title: '👑 课桌修仙·绝代摸鱼仙尊',
    badgeColor: 'from-amber-400 via-yellow-300 to-amber-500 text-amber-950',
    comment: '你在老师眼皮底下吃完了一整个小卖部，反侦察意识堪比王牌特工！',
  },
  {
    minScore: 90,
    rank: 'SS',
    title: '⚡ 隐匿食神·极限反侦察宗师',
    badgeColor: 'from-purple-400 via-pink-400 to-purple-500 text-purple-950',
    comment: '完美的课本掩护与听音辨位，教导主任从后门路过都对你肃然起敬！',
  },
  {
    minScore: 65,
    rank: 'S',
    title: '🎯 黄金摸鱼王·课上特工',
    badgeColor: 'from-blue-400 via-cyan-300 to-blue-500 text-blue-950',
    comment: '节奏大师！在粉笔摩擦声的掩护下进食如行云流水。',
  },
  {
    minScore: 40,
    rank: 'A',
    title: '🎒 资深课桌干饭达人',
    badgeColor: 'from-emerald-400 via-teal-300 to-emerald-500 text-emerald-950',
    comment: '身经百战，偶尔手忙脚乱，但总能化险为夷，摸鱼界的中流砥柱。',
  },
  {
    minScore: 20,
    rank: 'B',
    title: '🐤 课堂零食实习生',
    badgeColor: 'from-orange-400 via-amber-300 to-orange-500 text-orange-950',
    comment: '吃得提心吊胆，每次老师停笔都吓得一身冷汗，仍需多加历练！',
  },
  {
    minScore: 0,
    rank: 'C',
    title: '🐭 胆小如鼠·假装听课怪',
    badgeColor: 'from-stone-400 via-zinc-300 to-stone-500 text-stone-950',
    comment: '一节课下来就嚼了两口，甚至分不清函数图象和薯片包装！',
  },
];
