// ==========================================
// ATHLET PRO — CORE ENGINE & STATE
// ==========================================

// Sound Synthesizer (Zero external audio files, pure Web Audio)
class SoundFx {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  beep(freq = 600, duration = 0.08, type = 'sine', volume = 0.12) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(volume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.warn('Audio error:', e);
    }
  }

  shortCountdownBeep() {
    this.beep(640, 0.07, 'sine', 0.1);
  }

  startFinishBeep() {
    this.beep(880, 0.22, 'triangle', 0.15);
  }

  fanfare() {
    if (!this.enabled) return;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.beep(freq, 0.2, 'sine', 0.14);
      }, idx * 110);
    });
  }
}

const sfx = new SoundFx();

// ==========================================
// VECTOR ICONS REGISTRY (NO EMOJIS)
// ==========================================
const ICONS = {
  play: `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 3 20 12 6 21 6 3"/></svg>`,
  pause: `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1.5"/><rect x="14" y="4" width="4" height="16" rx="1.5"/></svg>`,
  soundOn: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>`,
  soundOff: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>`,
  chevronRight: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`,
  info: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
  sun: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`,
  core: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="12" y1="3" x2="12" y2="21"/></svg>`,
  arms: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6.5 6.5 11 11"/><path d="m21 21-1-1a2 2 0 0 0-2.83 0l-.88.88a2 2 0 0 1-2.83 0l-4.24-4.24a2 2 0 0 1 0-2.83l.88-.88a2 2 0 0 0 0-2.83L10 9"/><path d="m3 3 1 1a2 2 0 0 0 2.83 0l.88-.88a2 2 0 0 1 2.83 0l4.24 4.24a2 2 0 0 1 0 2.83l-.88.88a2 2 0 0 0 0 2.83L14 15"/></svg>`,
  fullbody: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
  shield: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  check: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  clock: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  medal: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>`
};

const EXERCISE_VISUALS = {
  // Классические отжимания: горизонтальный упор, локти 45°, прямая линия тела
  pushups: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 20h20"/><circle cx="5" cy="11.5" r="1.8"/><path d="M6.8 13L14 15.5l6.5 4"/><path d="M7 13.5l2.5 3-2.5 3.5"/></svg>`,

  // Алмазные отжимания: сведение ладоней треугольником под грудью
  diamond_pushups: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 20h20"/><circle cx="12" cy="5.5" r="1.8"/><path d="M8 10h8"/><path d="M8 10l2 5.5 2 1.5"/><path d="M16 10l-2 5.5-2 1.5"/><polygon points="12 17 13.8 18.5 12 20 10.2 18.5"/><path d="M12 10v4"/></svg>`,

  // Обратные отжимания: опора сзади, локти 90° назад, корпус опускается вертикально
  dips_floor: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 20h20"/><path d="M3 14h4v6"/><circle cx="9" cy="7" r="1.8"/><path d="M9 9v6"/><path d="M8.5 10.5l-3.5 1.5v2"/><path d="M9 15h4.5l3.5 5"/></svg>`,

  // Широкие отжимания: широкая постановка ладоней шире плеч
  wide_pushups: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 20h20"/><circle cx="12" cy="6.5" r="1.8"/><path d="M7 11h10"/><path d="M7 11L3 15.5V20"/><path d="M17 11L21 15.5V20"/><path d="M12 11v6l-2.5 3"/><path d="M12 17l2.5 3"/></svg>`,

  // Пайк-отжимания: положение "домик" / уголок, таз вверх, опускание макушкой
  pike_pushups: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 20h20"/><path d="M5.5 20l2.5-6.5L13 6l6 14"/><circle cx="6" cy="16" r="1.8"/><path d="M8 13.5l-2 2.5"/></svg>`,

  // Скручивания на кор: подъем корпуса к согнутым коленям
  crunches: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 20h20"/><circle cx="5" cy="10.5" r="1.8"/><path d="M6.5 12c1.8 1.8 3.5 4.5 4.5 8H12"/><path d="M12 20l4-7 4.5 7"/><path d="M5.5 12.5l4-1.5"/></svg>`,

  // Классическая планка: предплечья на полу, идеальная горизонтальная линия
  plank: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 20h20"/><circle cx="4.5" cy="11.5" r="1.8"/><path d="M6.5 13L14 15l6.5 5"/><path d="M6.8 13.5v6.5H11"/></svg>`,

  // Диагональные скручивания: локоть к противоположному колену, выпрямление второй ноги
  bicycle_crunches: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 20h20"/><circle cx="4.5" cy="11" r="1.8"/><path d="M6 12.5c2 1.5 3.5 3.5 4.5 7"/><path d="M6.5 12l4-1"/><path d="M10.5 19.5l2-6.5-2.5-4"/><path d="M10.5 19.5l6-3.5 4.5 1"/></svg>`,

  // Подъемы ног лежа: спина прижата, прямые ноги поднимаются вверх
  leg_raises: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 20h20"/><circle cx="4.5" cy="16.5" r="1.8"/><path d="M6.5 18.5H12"/><path d="M12 18.5L16.5 6.5"/><path d="M18.5 9.5l-2-3-3 2"/></svg>`,

  // Скалолаз: упор лежа, динамическое подтягивание колена к груди
  mountain_climbers: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 20h20"/><circle cx="5" cy="8.5" r="1.8"/><path d="M7 10.5L14 13l6.5 7"/><path d="M6.5 10.5V20"/><path d="M14 13l-4 3 2 4"/></svg>`,

  // Джампинг Джек: прыжок со взмахом рук вверх и разведением ног
  jumping_jacks: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="4" r="1.8"/><path d="M12 6v7"/><path d="M3.5 4.5l8.5 3.5 8.5-3.5"/><path d="M5 21l7-8 7 8"/><path d="M8.5 22h7" stroke-dasharray="2 2"/></svg>`,

  // Мобилизация позвоночника: кобра / прогиб назад с опорой на руки
  morning_stretch: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 20h20"/><circle cx="7" cy="5.5" r="1.8"/><path d="M6.5 7.5c0 5 2.5 8.5 6 12.5H21"/><path d="M7 8.5v11.5"/></svg>`,

  // Бой с тенью: боксерская стойка, защита подбородка и прямой удар
  shadow_boxing: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="7.5" cy="4.5" r="1.8"/><path d="M7.5 6.5v7"/><path d="M7.5 13.5L4 20"/><path d="M7.5 13.5l4.5 6.5"/><path d="M7.5 8.5l-2.5 2.5 2.5 1"/><path d="M7.5 8.5h9"/><circle cx="17.5" cy="8.5" r="1.5" fill="currentColor"/><path d="M19.5 6.5h2.5M19.5 10.5h2.5"/></svg>`
};

// ==========================================
// EXERCISES DATABASE
// ==========================================
const EXERCISES = {
  // Руки и грудь
  pushups: {
    id: 'pushups',
    name: 'Классические отжимания',
    category: 'arms',
    muscles: 'Грудь • Трицепс • Плечи',
    tip: 'Корпус в одну прямую линию. Локти под углом 45 градусов, лопатки сведены в нижней точке.',
    proTip: 'Опускайтесь подконтрольно за 2 секунды, выполняйте подъем мощно за 1 секунду.',
    repsEquivalent: 15
  },
  diamond_pushups: {
    id: 'diamond_pushups',
    name: 'Алмазные отжимания',
    category: 'arms',
    muscles: 'Трицепс (акцент) • Внутренняя грудь',
    tip: 'Большие и указательные пальцы соединены треугольником прямо под центром груди.',
    proTip: 'Держите локти ближе к корпусу для максимальной изоляции трицепса.',
    repsEquivalent: 12
  },
  dips_floor: {
    id: 'dips_floor',
    name: 'Обратные отжимания от пола / опоры',
    category: 'arms',
    muscles: 'Трицепс • Передняя дельта',
    tip: 'Упор руками сзади корпуса пальцами вперед. Опускайтесь вертикально сгибая локти назад.',
    proTip: 'Не разводите локти в стороны — направляйте их строго назад.',
    repsEquivalent: 15
  },
  wide_pushups: {
    id: 'wide_pushups',
    name: 'Широкие отжимания',
    category: 'arms',
    muscles: 'Грудные мышцы (широкий хват) • Плечи',
    tip: 'Постановка ладоней шире плеч на 20-30 см. Сфокусируйтесь на сведении грудных мышц.',
    proTip: 'В верхней точке задержитесь на 0.5 секунды и мысленно сожмите грудь.',
    repsEquivalent: 12
  },
  pike_pushups: {
    id: 'pike_pushups',
    name: 'Пайк-отжимания (Уголок)',
    category: 'arms',
    muscles: 'Дельтовидные мышцы • Верх груди',
    tip: 'Таз поднят вверх углом. Опускайтесь макушкой к полу между ладонями по диагонали.',
    proTip: 'Базовый заменитель жима над головой с собственным весом.',
    repsEquivalent: 10
  },

  // Пресс и кор
  crunches: {
    id: 'crunches',
    name: 'Скручивания на кор',
    category: 'abs',
    muscles: 'Прямая мышца живота (верх)',
    tip: 'Поясница плотно прижата к полу. Не тяните шею руками, взгляд направлен вверх под углом 45°.',
    proTip: 'Делайте акцентированный выдох в верхней точке сокращения пресса.',
    repsEquivalent: 20
  },
  plank: {
    id: 'plank',
    name: 'Классическая планка',
    category: 'abs',
    muscles: 'Глубокий кор • Поперечная мышца • Спина',
    tip: 'Локти строго под плечами, ягодицы сжаты, таз в нейтральном положении, ровное дыхание.',
    proTip: 'Не задерживайте дыхание, создайте максимальное статическое напряжение кора.',
    repsEquivalent: 0
  },
  bicycle_crunches: {
    id: 'bicycle_crunches',
    name: 'Диагональные скручивания',
    category: 'abs',
    muscles: 'Косые мышцы • Нижний сегмент пресса',
    tip: 'Поочередно направляйте локоть к противоположному колену. Контролируйте темп.',
    proTip: 'Сохраняйте постоянное натяжение мышц, не бросайте плечи на пол.',
    repsEquivalent: 20
  },
  leg_raises: {
    id: 'leg_raises',
    name: 'Подъемы ног лежа',
    category: 'abs',
    muscles: 'Нижний сегмент пресса • Сгибатели бедра',
    tip: 'Руки вдоль тела или под крестцом. Медленно опускайте прямые ноги, контролируя поясницу.',
    proTip: 'Не касайтесь пятками пола в нижней точке — сохраняйте 5 см дистанции.',
    repsEquivalent: 15
  },
  mountain_climbers: {
    id: 'mountain_climbers',
    name: 'Скалолаз в упоре лежа',
    category: 'abs',
    muscles: 'Кор • Динамическая стабилизация • Плечи',
    tip: 'Из упора лежа подтягивайте колени к груди в четком циклическом темпе.',
    proTip: 'Держите таз на одном уровне, избегайте раскачивания корпуса.',
    repsEquivalent: 30
  },

  // Мобильность / Разминка
  jumping_jacks: {
    id: 'jumping_jacks',
    name: 'Джампинг Джек (Синхронные прыжки)',
    category: 'morning',
    muscles: 'Разминка • Кардиопульмональный тонус',
    tip: 'Мягкое приземление на переднюю часть стопы, синхронный мах руками над головой.',
    proTip: 'Оптимальное движение для разогрева суставов и разгона лимфотока.',
    repsEquivalent: 25
  },
  morning_stretch: {
    id: 'morning_stretch',
    name: 'Динамическая мобилизация позвоночника',
    category: 'morning',
    muscles: 'Позвоночный столб • Плечевой пояс • Задняя цепь',
    tip: 'Плавный контролируемый переход из вытяжения лежа в позицию треугольника.',
    proTip: 'Снимает постуральную скованность и нормализует тонус спины.',
    repsEquivalent: 0
  },
  shadow_boxing: {
    id: 'shadow_boxing',
    name: 'Серийный бой с тенью',
    category: 'morning',
    muscles: 'Плечевой пояс • Кор • Скорость реакции',
    tip: 'Легкие прямые и боковые движения с переносом центра тяжести и активной работой корпуса.',
    proTip: 'Разогревает ротаторную манжету плеча и активирует нервную систему.',
    repsEquivalent: 40
  }
};

// ==========================================
// WORKOUT PROGRAMS
// ==========================================
const WORKOUTS = [
  {
    id: 'morning_kick',
    title: 'Утренний комплекс',
    desc: 'Активация суставов, разгон лимфотока и подготовка нервной системы к рабочему дню.',
    timeMin: 6,
    iconType: 'sun',
    badgeClass: 'morning',
    tags: ['Мобильность', 'Тонус', 'Без пота'],
    exercises: [
      { id: 'jumping_jacks', duration: 30 },
      { id: 'morning_stretch', duration: 40 },
      { id: 'pushups', duration: 25 },
      { id: 'crunches', duration: 30 },
      { id: 'plank', duration: 30 }
    ]
  },
  {
    id: 'iron_abs',
    title: 'Кор и стабилизация',
    desc: 'Изолированная проработка прямой, косых мышц живота и глубокого мышечного корсета.',
    timeMin: 8,
    iconType: 'core',
    badgeClass: 'abs',
    tags: ['Кор', 'Плотность', 'Рельеф'],
    exercises: [
      { id: 'crunches', duration: 35 },
      { id: 'bicycle_crunches', duration: 35 },
      { id: 'leg_raises', duration: 30 },
      { id: 'mountain_climbers', duration: 30 },
      { id: 'plank', duration: 45 }
    ]
  },
  {
    id: 'arm_power',
    title: 'Сила: грудь и руки',
    desc: 'Акцент на трицепс, грудные мышцы и передние дельтовидные с весом тела.',
    timeMin: 9,
    iconType: 'arms',
    badgeClass: 'arms',
    tags: ['Грудь', 'Трицепс', 'Плечи'],
    exercises: [
      { id: 'pushups', duration: 35 },
      { id: 'diamond_pushups', duration: 30 },
      { id: 'dips_floor', duration: 35 },
      { id: 'pike_pushups', duration: 30 },
      { id: 'wide_pushups', duration: 30 }
    ]
  },
  {
    id: 'full_beast',
    title: 'Интенсивный фуллбоди',
    desc: 'Круговой функциональный комплекс на все мышечные группы и общую выносливость.',
    timeMin: 12,
    iconType: 'fullbody',
    badgeClass: 'full',
    tags: ['Все тело', 'Выносливость', 'Макс темп'],
    exercises: [
      { id: 'jumping_jacks', duration: 30 },
      { id: 'pushups', duration: 35 },
      { id: 'crunches', duration: 35 },
      { id: 'diamond_pushups', duration: 30 },
      { id: 'bicycle_crunches', duration: 35 },
      { id: 'dips_floor', duration: 30 },
      { id: 'mountain_climbers', duration: 30 },
      { id: 'plank', duration: 45 }
    ]
  },
  {
    id: 'streak_saver',
    title: 'Экспресс 3 минуты',
    desc: 'Короткий интенсивный сет для поддержания непрерывности тренировок.',
    timeMin: 3,
    iconType: 'shield',
    badgeClass: 'morning',
    tags: ['3 минуты', 'Экспресс', 'Базовый'],
    exercises: [
      { id: 'jumping_jacks', duration: 30 },
      { id: 'pushups', duration: 30 },
      { id: 'crunches', duration: 30 },
      { id: 'plank', duration: 30 }
    ]
  }
];

// ==========================================
// ATHLETIC PROGRESSION RANKS
// ==========================================
const RANKS = [
  { level: 1, xpReq: 0, title: 'Старт (Level 1)' },
  { level: 2, xpReq: 150, title: 'Атлет I' },
  { level: 3, xpReq: 350, title: 'Атлет II' },
  { level: 4, xpReq: 650, title: 'Прогресс' },
  { level: 5, xpReq: 1100, title: 'Интенсив' },
  { level: 6, xpReq: 1700, title: 'Мастер формы' },
  { level: 7, xpReq: 2500, title: 'Профи' },
  { level: 8, xpReq: 3500, title: 'Элита' }
];

// ==========================================
// STATE MANAGEMENT & LOCAL STORAGE
// ==========================================
const DEFAULT_STATE = {
  xp: 0,
  streak: 0,
  lastWorkoutDate: null,
  totalWorkouts: 0,
  totalMinutes: 0,
  totalPushups: 0,
  history: {}, // 'YYYY-MM-DD': count
  settings: {
    sound: true,
    vibration: true,
    restTime: 20
  }
};

class StateManager {
  constructor() {
    this.key = 'athlet_app_data_v1';
    this.data = this.load();
    this.checkStreakValidity();
  }

  load() {
    try {
      const saved = localStorage.getItem(this.key);
      if (saved) return { ...DEFAULT_STATE, ...JSON.parse(saved) };
    } catch (e) {
      console.warn('Storage read error:', e);
    }
    return { ...DEFAULT_STATE };
  }

  save() {
    try {
      localStorage.setItem(this.key, JSON.stringify(this.data));
    } catch (e) {
      console.warn('Storage save error:', e);
    }
  }

  getTodayStr() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  getYesterdayStr() {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  checkStreakValidity() {
    if (!this.data.lastWorkoutDate) return;
    const today = this.getTodayStr();
    const yesterday = this.getYesterdayStr();

    if (this.data.lastWorkoutDate !== today && this.data.lastWorkoutDate !== yesterday) {
      this.data.streak = 0;
      this.save();
    }
  }

  recordWorkout(workout, actualDurationSec) {
    const today = this.getTodayStr();
    
    // Streak logic
    if (this.data.lastWorkoutDate !== today) {
      if (this.data.lastWorkoutDate === this.getYesterdayStr()) {
        this.data.streak += 1;
      } else {
        this.data.streak = 1;
      }
      this.data.lastWorkoutDate = today;
    }

    // History log
    this.data.history[today] = (this.data.history[today] || 0) + 1;

    // Totals
    this.data.totalWorkouts += 1;
    const minutes = Math.max(1, Math.round(actualDurationSec / 60));
    this.data.totalMinutes += minutes;

    // Estimate pushups/reps
    let pushupReps = 0;
    workout.exercises.forEach(ex => {
      const dbEx = EXERCISES[ex.id];
      if (dbEx && dbEx.category === 'arms') {
        pushupReps += dbEx.repsEquivalent || 10;
      }
    });
    this.data.totalPushups += pushupReps;

    // XP calculation: 20 XP per minute + 50 XP completion bonus + streak bonus
    const xpGained = Math.round(minutes * 18) + 40 + (this.data.streak * 5);
    this.data.xp += xpGained;

    this.save();
    return { xpGained, streak: this.data.streak };
  }

  getCurrentRank() {
    let current = RANKS[0];
    let next = RANKS[1];
    for (let i = 0; i < RANKS.length; i++) {
      if (this.data.xp >= RANKS[i].xpReq) {
        current = RANKS[i];
        next = RANKS[i + 1] || null;
      } else {
        break;
      }
    }

    let progressPercent = 100;
    if (next) {
      const range = next.xpReq - current.xpReq;
      const currentProgress = this.data.xp - current.xpReq;
      progressPercent = Math.min(100, Math.max(0, Math.round((currentProgress / range) * 100)));
    }

    return { current, next, progressPercent };
  }

  resetAll() {
    this.data = { ...DEFAULT_STATE };
    this.save();
  }
}

const state = new StateManager();

// ==========================================
// ACTIVE WORKOUT PLAYER LOGIC
// ==========================================
class WorkoutPlayer {
  constructor() {
    this.workout = null;
    this.stepIndex = 0;
    this.isResting = false;
    this.isPaused = false;
    this.timer = null;
    this.secondsLeft = 0;
    this.currentExerciseTotalSeconds = 0;
    this.restDuration = state.data.settings.restTime || 20;
    this.totalSecondsElapsed = 0;

    // Elements
    this.modal = document.getElementById('workoutPlayerModal');
    this.titleEl = document.getElementById('playerWorkoutTitle');
    this.stepEl = document.getElementById('playerStepIndicator');
    this.stepSegmentsEl = document.getElementById('playerStepSegments');
    this.exNameEl = document.getElementById('playerExerciseName');
    this.exTipEl = document.getElementById('playerExerciseTip');
    this.musclesEl = document.getElementById('playerMusclesTag');
    this.avatarEl = document.getElementById('playerVisualAvatar');
    this.timerNumEl = document.getElementById('playerMainTimer');
    this.progressRing = document.getElementById('timerProgressRing');
    this.pausePlayBtn = document.getElementById('btnPausePlayExercise');

    this.restOverlay = document.getElementById('restOverlay');
    this.restTimerEl = document.getElementById('restTimerDisplay');
    this.nextExerciseNameEl = document.getElementById('nextExerciseName');

    // Ring circumference: 2 * PI * 88 ~= 552.92
    this.circumference = 2 * Math.PI * 88;
    if (this.progressRing) {
      this.progressRing.style.strokeDasharray = `${this.circumference} ${this.circumference}`;
      this.progressRing.style.strokeDashoffset = '0';
      this.progressRing.style.transition = 'stroke-dashoffset 1s linear, stroke 0.3s ease';
    }

    this.bindEvents();
  }

  bindEvents() {
    document.getElementById('btnExitWorkout').addEventListener('click', () => this.confirmExit());
    document.getElementById('btnPrevExercise').addEventListener('click', () => this.prevStep());
    document.getElementById('btnNextExercise').addEventListener('click', () => this.nextStep());
    this.pausePlayBtn.addEventListener('click', () => this.togglePausePlay());
    document.getElementById('btnSkipRest').addEventListener('click', () => this.finishRest());

    // Mute toggle inside player
    const muteBtn = document.getElementById('playerMuteToggle');
    muteBtn.addEventListener('click', () => {
      sfx.enabled = !sfx.enabled;
      muteBtn.innerHTML = sfx.enabled ? ICONS.soundOn : ICONS.soundOff;
    });
  }

  start(workout) {
    this.workout = workout;
    this.stepIndex = 0;
    this.isResting = false;
    this.isPaused = false;
    this.totalSecondsElapsed = 0;
    this.restDuration = parseInt(state.data.settings.restTime) || 20;

    this.titleEl.textContent = workout.title;
    this.modal.classList.add('active');
    sfx.startFinishBeep();

    // Render step segments
    if (this.stepSegmentsEl) {
      this.stepSegmentsEl.innerHTML = '';
      for (let i = 0; i < workout.exercises.length; i++) {
        const seg = document.createElement('div');
        seg.className = 'step-segment';
        this.stepSegmentsEl.appendChild(seg);
      }
    }

    this.loadCurrentStep();
  }

  loadCurrentStep() {
    clearInterval(this.timer);
    this.isResting = false;
    this.restOverlay.classList.add('hidden');

    const step = this.workout.exercises[this.stepIndex];
    const exData = EXERCISES[step.id];

    this.stepEl.textContent = `${this.stepIndex + 1} из ${this.workout.exercises.length}`;
    this.exNameEl.textContent = exData.name;
    this.exTipEl.textContent = exData.tip;
    this.musclesEl.textContent = exData.muscles.toUpperCase();
    
    // Vector visual representation
    this.avatarEl.innerHTML = EXERCISE_VISUALS[step.id] || ICONS.arms;

    // Update segments
    if (this.stepSegmentsEl) {
      const segs = this.stepSegmentsEl.querySelectorAll('.step-segment');
      segs.forEach((seg, idx) => {
        if (idx < this.stepIndex) {
          seg.className = 'step-segment completed';
        } else if (idx === this.stepIndex) {
          seg.className = 'step-segment active';
        } else {
          seg.className = 'step-segment';
        }
      });
    }

    this.secondsLeft = step.duration;
    this.currentExerciseTotalSeconds = step.duration;
    this.updateTimerDisplay();
    this.updateProgressRing(1, true);

    this.pausePlayBtn.innerHTML = ICONS.pause;
    this.isPaused = false;

    this.startCountdown();
  }

  startCountdown() {
    clearInterval(this.timer);
    this.timer = setInterval(() => {
      if (this.isPaused) return;

      this.totalSecondsElapsed++;
      this.secondsLeft--;

      if (this.isResting) {
        this.restTimerEl.textContent = this.secondsLeft;
        if (this.secondsLeft <= 3 && this.secondsLeft > 0) {
          sfx.shortCountdownBeep();
        }
        if (this.secondsLeft <= 0) {
          this.finishRest();
        }
      } else {
        this.updateTimerDisplay();
        const fraction = this.secondsLeft / this.currentExerciseTotalSeconds;
        this.updateProgressRing(fraction);

        if (this.secondsLeft <= 3 && this.secondsLeft > 0) {
          sfx.shortCountdownBeep();
        }

        if (this.secondsLeft <= 0) {
          sfx.startFinishBeep();
          this.triggerHaptic();
          this.handleStepCompleted();
        }
      }
    }, 1000);
  }

  updateTimerDisplay() {
    this.timerNumEl.textContent = this.secondsLeft;
  }

  updateProgressRing(fraction, immediate = false) {
    if (!this.progressRing) return;
    const offset = this.circumference - (fraction * this.circumference);
    if (immediate) {
      this.progressRing.style.transition = 'none';
      this.progressRing.style.strokeDashoffset = offset;
      void this.progressRing.getBoundingClientRect();
      this.progressRing.style.transition = 'stroke-dashoffset 1s linear, stroke 0.3s ease';
    } else {
      this.progressRing.style.transition = 'stroke-dashoffset 1s linear, stroke 0.3s ease';
      this.progressRing.style.strokeDashoffset = offset;
    }
  }

  handleStepCompleted() {
    clearInterval(this.timer);
    if (this.stepIndex < this.workout.exercises.length - 1) {
      this.startRest();
    } else {
      this.finishWorkout();
    }
  }

  startRest() {
    this.isResting = true;
    this.secondsLeft = this.restDuration;
    this.restTimerEl.textContent = this.secondsLeft;

    const nextStep = this.workout.exercises[this.stepIndex + 1];
    const nextExData = EXERCISES[nextStep.id];
    this.nextExerciseNameEl.textContent = nextExData ? nextExData.name : '';

    this.restOverlay.classList.remove('hidden');
    this.startCountdown();
  }

  finishRest() {
    clearInterval(this.timer);
    this.stepIndex++;
    this.loadCurrentStep();
  }

  togglePausePlay() {
    this.isPaused = !this.isPaused;
    this.pausePlayBtn.innerHTML = this.isPaused ? ICONS.play : ICONS.pause;
    if (this.isPaused) {
      if (this.progressRing) {
        const computedStyle = window.getComputedStyle(this.progressRing);
        const currentOffset = computedStyle.strokeDashoffset;
        this.progressRing.style.transition = 'none';
        this.progressRing.style.strokeDashoffset = currentOffset;
      }
    } else {
      if (this.progressRing) {
        this.progressRing.style.transition = 'stroke-dashoffset 1s linear, stroke 0.3s ease';
        const fraction = this.secondsLeft / this.currentExerciseTotalSeconds;
        const offset = this.circumference - (fraction * this.circumference);
        this.progressRing.style.strokeDashoffset = offset;
      }
    }
  }

  prevStep() {
    if (this.stepIndex > 0) {
      this.stepIndex--;
      this.loadCurrentStep();
    }
  }

  nextStep() {
    if (this.stepIndex < this.workout.exercises.length - 1) {
      this.stepIndex++;
      this.loadCurrentStep();
    } else {
      this.finishWorkout();
    }
  }

  confirmExit() {
    if (confirm('Прервать тренировку? Текущий подход не будет сохранен.')) {
      clearInterval(this.timer);
      this.modal.classList.remove('active');
    }
  }

  finishWorkout() {
    clearInterval(this.timer);
    this.modal.classList.remove('active');

    // Save to state
    const result = state.recordWorkout(this.workout, this.totalSecondsElapsed);

    // Show celebratory finish screen
    showFinishModal(this.workout, this.totalSecondsElapsed, result);
    sfx.fanfare();
    this.triggerHaptic();

    // Refresh UI
    renderHeaderStats();
    renderProgressScreen();
  }

  triggerHaptic() {
    if (state.data.settings.vibration && navigator.vibrate) {
      try { navigator.vibrate([80, 40, 80]); } catch (e) {}
    }
  }
}

const player = new WorkoutPlayer();

// ==========================================
// UI RENDERING FUNCTIONS
// ==========================================

function renderHeaderStats() {
  document.getElementById('streakCount').textContent = state.data.streak;
  document.getElementById('userXpCount').textContent = state.data.xp;

  const { current, progressPercent } = state.getCurrentRank();
  document.getElementById('userRankTitle').textContent = current.title;
  document.getElementById('userLevelNum').textContent = `Ур. ${current.level}`;
  document.getElementById('levelProgressFill').style.width = `${progressPercent}%`;

  // Update dynamic greeting based on hour
  const hour = new Date().getHours();
  let greet = 'Утренняя сессия';
  if (hour >= 12 && hour < 18) greet = 'Дневная сессия';
  else if (hour >= 18 && hour < 23) greet = 'Вечерняя сессия';
  else if (hour >= 23 || hour < 5) greet = 'Ночной тренинг';
  document.getElementById('greetingTitle').textContent = greet;
}

function renderWorkoutsList() {
  const container = document.getElementById('workoutsListContainer');
  container.innerHTML = '';

  WORKOUTS.forEach(w => {
    if (w.id === 'streak_saver') return; // Dedicated card

    const iconSvg = ICONS[w.iconType] || ICONS.arms;
    const card = document.createElement('div');
    card.className = 'workout-card';
    card.innerHTML = `
      <div class="workout-icon-box ${w.badgeClass}">
        ${iconSvg}
      </div>
      <div class="workout-info">
        <div class="workout-title-row">
          <span class="workout-title">${w.title}</span>
          <span class="workout-duration">
            ${ICONS.clock}
            ${w.timeMin} мин
          </span>
        </div>
        <p class="workout-desc">${w.desc}</p>
        <div class="workout-tags">
          ${w.tags.map(t => `<span class="w-tag">${t}</span>`).join('')}
        </div>
      </div>
      <div class="workout-arrow">
        ${ICONS.chevronRight}
      </div>
    `;
    card.addEventListener('click', () => player.start(w));
    container.appendChild(card);
  });
}

function renderProgressScreen() {
  document.getElementById('totalWorkoutsCount').textContent = state.data.totalWorkouts;
  document.getElementById('totalMinutesCount').textContent = state.data.totalMinutes;
  document.getElementById('totalPushupsCount').textContent = state.data.totalPushups;

  const { current } = state.getCurrentRank();
  document.getElementById('cardRankBadge').textContent = current.title;

  // Milestones list
  const milestonesContainer = document.getElementById('rankMilestonesList');
  milestonesContainer.innerHTML = '';
  RANKS.forEach(r => {
    const isUnlocked = state.data.xp >= r.xpReq;
    const item = document.createElement('div');
    item.className = `rank-item ${isUnlocked ? 'unlocked' : ''}`;
    item.innerHTML = `
      <div class="rank-item-icon">
        ${isUnlocked ? ICONS.check : ICONS.medal}
      </div>
      <div class="rank-item-info">
        <div class="rank-title-row">
          <span class="rank-title">${r.title}</span>
          <span class="rank-status-tag">${isUnlocked ? 'Достигнут' : 'В процессе'}</span>
        </div>
        <div class="rank-requirement">${r.xpReq === 0 ? 'Начальная ступень' : `Требуется ${r.xpReq} XP`}</div>
      </div>
    `;
    milestonesContainer.appendChild(item);
  });

  renderCalendar();
}

function renderCalendar() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  
  const monthNames = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];
  document.getElementById('calendarMonthYear').textContent = `${monthNames[month]} ${year}`;

  const grid = document.getElementById('calendarDaysGrid');
  grid.innerHTML = '';

  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sun
  const startOffset = (firstDayIndex + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < startOffset; i++) {
    const emptyCell = document.createElement('div');
    emptyCell.className = 'cal-day empty';
    grid.appendChild(emptyCell);
  }

  const todayStr = state.getTodayStr();

  for (let day = 1; day <= daysInMonth; day++) {
    const dStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const cell = document.createElement('div');
    cell.className = 'cal-day';
    cell.textContent = day;

    if (dStr === todayStr) {
      cell.classList.add('today');
    }
    if (state.data.history[dStr] && state.data.history[dStr] > 0) {
      cell.classList.add('done');
    }

    grid.appendChild(cell);
  }
}

function renderExerciseGuide(filter = 'all') {
  const container = document.getElementById('exerciseCardsContainer');
  container.innerHTML = '';

  Object.values(EXERCISES).forEach(ex => {
    if (filter !== 'all' && ex.category !== filter) return;

    const item = document.createElement('div');
    item.className = 'exercise-guide-item';
    const visual = EXERCISE_VISUALS[ex.id] || ICONS.arms;
    item.innerHTML = `
      <div class="guide-icon">
        ${visual}
      </div>
      <div class="guide-details">
        <div class="guide-name">${ex.name}</div>
        <div class="guide-target">${ex.muscles}</div>
      </div>
      <div class="guide-action">
        ${ICONS.chevronRight}
      </div>
    `;
    item.addEventListener('click', () => showExerciseDetailModal(ex));
    container.appendChild(item);
  });
}

function showExerciseDetailModal(ex) {
  document.getElementById('infoModalTitle').textContent = ex.name;
  document.getElementById('infoModalIcon').innerHTML = EXERCISE_VISUALS[ex.id] || ICONS.arms;
  document.getElementById('infoModalMuscles').textContent = ex.muscles;
  document.getElementById('infoModalInstructions').textContent = ex.tip;
  document.getElementById('infoModalProTip').textContent = ex.proTip;
  document.getElementById('exerciseInfoModal').classList.add('active');
}

function showFinishModal(workout, elapsedSeconds, result) {
  const modal = document.getElementById('finishModal');
  document.getElementById('rewardXp').textContent = `+${result.xpGained} XP`;
  document.getElementById('rewardStreak').textContent = `Серия: ${result.streak} дн`;

  const m = Math.floor(elapsedSeconds / 60);
  const s = elapsedSeconds % 60;
  document.getElementById('finishDuration').textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

  const estimatedKcal = Math.round((elapsedSeconds / 60) * 8.5);
  document.getElementById('finishCalories').textContent = `~${estimatedKcal} ккал`;
  document.getElementById('finishExercisesCount').textContent = workout.exercises.length;

  modal.classList.add('active');
}

// ==========================================
// APP INITIALIZATION & EVENT LISTENERS
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  // Navigation tabs switching
  const navButtons = document.querySelectorAll('.nav-item');
  const screens = document.querySelectorAll('.screen-section');

  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetScreenId = btn.getAttribute('data-screen');

      navButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      screens.forEach(s => {
        if (s.id === targetScreenId) {
          s.classList.add('active');
        } else {
          s.classList.remove('active');
        }
      });

      if (targetScreenId === 'screenProgress') {
        renderProgressScreen();
      }
    });
  });

  // Hero Quick Start
  document.getElementById('heroQuickStartBtn').addEventListener('click', () => {
    const quickWorkout = WORKOUTS.find(w => w.id === 'morning_kick') || WORKOUTS[0];
    player.start(quickWorkout);
  });

  // Streak saver quick button
  document.getElementById('btnStartStreakSaver').addEventListener('click', () => {
    const saver = WORKOUTS.find(w => w.id === 'streak_saver');
    if (saver) player.start(saver);
  });

  // Finish modal close
  document.getElementById('btnFinishConfirm').addEventListener('click', () => {
    document.getElementById('finishModal').classList.remove('active');
  });

  // Info modal close
  document.getElementById('btnInfoModalClose').addEventListener('click', () => {
    document.getElementById('exerciseInfoModal').classList.remove('active');
  });

  // Exercise filters
  const filterPills = document.querySelectorAll('#exerciseFilterPills .pill');
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      renderExerciseGuide(pill.getAttribute('data-filter'));
    });
  });

  // Settings
  const toggleSound = document.getElementById('toggleSound');
  const toggleVibration = document.getElementById('toggleVibration');
  const selectRestTime = document.getElementById('selectRestTime');

  toggleSound.checked = state.data.settings.sound;
  toggleVibration.checked = state.data.settings.vibration;
  selectRestTime.value = state.data.settings.restTime || 20;

  toggleSound.addEventListener('change', (e) => {
    state.data.settings.sound = e.target.checked;
    sfx.enabled = e.target.checked;
    state.save();
  });

  toggleVibration.addEventListener('change', (e) => {
    state.data.settings.vibration = e.target.checked;
    state.save();
  });

  selectRestTime.addEventListener('change', (e) => {
    state.data.settings.restTime = parseInt(e.target.value);
    state.save();
  });

  // Reset progress data
  document.getElementById('btnResetData').addEventListener('click', () => {
    if (confirm('Сбросить данные журнала, опыт и историю сессий?')) {
      state.resetAll();
      renderHeaderStats();
      renderProgressScreen();
      alert('Данные прогресса очищены.');
    }
  });

  // Service Worker Registration for iOS PWA offline
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch(err => {
        console.log('SW registration optional:', err);
      });
    });
  }

  // Initial renders
  renderHeaderStats();
  renderWorkoutsList();
  renderProgressScreen();
  renderExerciseGuide('all');
});
