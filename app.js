// ==========================================
// ATHLET APP — CORE ENGINE
// ==========================================

// Sound Synthesizer (Zero external audio files needed, works offline)
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

  beep(freq = 600, duration = 0.1, type = 'sine') {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.warn('Audio error:', e);
    }
  }

  shortCountdownBeep() {
    this.beep(550, 0.1, 'sine');
  }

  startFinishBeep() {
    this.beep(880, 0.35, 'triangle');
  }

  fanfare() {
    if (!this.enabled) return;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.beep(freq, 0.25, 'triangle');
      }, idx * 120);
    });
  }
}

const sfx = new SoundFx();

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
    icon: '💪',
    tip: 'Корпус в одну линию, не прогибай таз, локти под 45 градусов к телу.',
    proTip: 'Опускайся медленно (2 секунды), а выжимай мощно вверх — это дает максимальный рост мышц.',
    repsEquivalent: 15
  },
  diamond_pushups: {
    id: 'diamond_pushups',
    name: 'Алмазные отжимания',
    category: 'arms',
    muscles: 'Трицепс (акцент) • Внутренняя грудь',
    icon: '💎',
    tip: 'Большие и указательные пальцы соедини в форме алмаза прямо под грудью.',
    proTip: 'Трицепс формирует 60% объема руки! Это главное упражнение для мощных рук без железа.',
    repsEquivalent: 12
  },
  dips_floor: {
    id: 'dips_floor',
    name: 'Обратные отжимания от пола / стула',
    category: 'arms',
    muscles: 'Трицепс • Передняя дельта',
    icon: '🪑',
    tip: 'Сядь на пол или край дивана, руки за спиной пальцами вперед, опускайся сгибая локти.',
    proTip: 'Не разводи локти в стороны — направляй их строго назад.',
    repsEquivalent: 15
  },
  wide_pushups: {
    id: 'wide_pushups',
    name: 'Широкие отжимания',
    category: 'arms',
    muscles: 'Широкая грудь • Плечи',
    icon: '🦅',
    tip: 'Руки поставь значительно шире плеч. Сфокусируйся на сжатии мышц груди в верхней точке.',
    proTip: 'В верхней точке задержись на полсекунды и мысленно сожми грудные мышцы.',
    repsEquivalent: 12
  },
  pike_pushups: {
    id: 'pike_pushups',
    name: 'Пайк-отжимания («Домик»)',
    category: 'arms',
    muscles: 'Плечи (дельты) • Верх груди',
    icon: '🧗',
    tip: 'Таз поднят вверх углом (буква Л), опускайся макушкой к полу между ладонями.',
    proTip: 'Главный заменитель армейского жима штанги без какого-либо инвентаря!',
    repsEquivalent: 10
  },

  // Пресс и кор
  crunches: {
    id: 'crunches',
    name: 'Скручивания на пресс',
    category: 'abs',
    muscles: 'Прямая мышца живота (верх)',
    icon: '🍫',
    tip: 'Поясница плотно прижата к полу! Не тяни себя руками за шею, смотри в потолок.',
    proTip: 'Делай сильный выдох на подъеме — так пресс сокращается на 100%.',
    repsEquivalent: 20
  },
  plank: {
    id: 'plank',
    name: 'Классическая планка',
    category: 'abs',
    muscles: 'Весь кор • Поперечная мышца • Спина',
    icon: '📏',
    tip: 'Локти под плечами, ягодицы напряжены, таз подкручен вперед, дыши ровно.',
    proTip: 'Не задерживай дыхание! Напряги пресс так, будто ждешь легкого удара.',
    repsEquivalent: 0
  },
  bicycle_crunches: {
    id: 'bicycle_crunches',
    name: 'Велосипед на спине',
    category: 'abs',
    muscles: 'Косые мышцы • Нижний пресс',
    icon: '🚴',
    tip: 'Поочередно касайся правым локтем левого колена и наоборот. Не спеши!',
    proTip: 'Ученые из Сан-Диего признали велосипед упражнением №1 для рельефного пресса.',
    repsEquivalent: 20
  },
  leg_raises: {
    id: 'leg_raises',
    name: 'Подъемы ног лежа',
    category: 'abs',
    muscles: 'Нижний пресс (акцент)',
    icon: '📐',
    tip: 'Руки вдоль тела или чуть под ягодицы. Медленно опускай ноги, не отрывая поясницу.',
    proTip: 'Останавливай ноги в 5 см от пола — это удерживает постоянное жжение в прессе.',
    repsEquivalent: 15
  },
  mountain_climbers: {
    id: 'mountain_climbers',
    name: 'Скалолаз в планке',
    category: 'abs',
    muscles: 'Пресс • Кардио • Плечи',
    icon: '⚡',
    tip: 'Из упора лежа быстро подтягивай колени к груди по очереди в активном темпе.',
    proTip: 'Отлично сжигает подкожный жир над прессом, разгоняя метаболизм.',
    repsEquivalent: 30
  },

  // Утро / Разминка
  jumping_jacks: {
    id: 'jumping_jacks',
    name: 'Прыжки Джампинг Джек',
    category: 'morning',
    muscles: 'Разминка • Кардио • Лимфоток',
    icon: '⭐',
    tip: 'Мягко пружинь на носочках, синхронно разводя ноги и хлопая руками над головой.',
    proTip: 'Идеально пробуждает нервную систему и лимфу за первые 30 секунд.',
    repsEquivalent: 25
  },
  morning_stretch: {
    id: 'morning_stretch',
    name: 'Кобра + Собака мордой вниз',
    category: 'morning',
    muscles: 'Позвоночник • Плечи • Растяжка',
    icon: '🧘',
    tip: 'Плавный переход из вытяжения спины лежа в положение треугольника.',
    proTip: 'Снимает скованность после сна и выпрямляет осанку.',
    repsEquivalent: 0
  },
  shadow_boxing: {
    id: 'shadow_boxing',
    name: 'Бой с тенью (Удары руками)',
    category: 'morning',
    muscles: 'Плечи • Кор • Реакция',
    icon: '🥊',
    tip: 'Легкие прямые и боковые удары в воздух с постоянным смещением центра тяжести.',
    proTip: 'Разминает плечевые суставы и поднимает уровень энергии без утомления.',
    repsEquivalent: 40
  }
};

// ==========================================
// WORKOUT PROGRAMS
// ==========================================
const WORKOUTS = [
  {
    id: 'morning_kick',
    title: 'Утренний Запал',
    desc: 'Быстро проснуться, включить кровоток и зарядить энергией на весь день.',
    timeMin: 6,
    icon: '☀️',
    badgeClass: 'morning',
    tags: ['Утро', 'Легко', 'Без пота'],
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
    title: 'Стальной Пресс & Кубики',
    desc: 'Целевая прокачка верха, низа и косых мышц. Плоский и рельефный живот.',
    timeMin: 8,
    icon: '🍫',
    badgeClass: 'abs',
    tags: ['Пресс', 'Рельеф', 'Жиросжигание'],
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
    title: 'Руки, Плечи и Грудь',
    desc: 'Алмазный трицепс, широкая грудная клетка и круглые дельты своим весом.',
    timeMin: 9,
    icon: '💪',
    badgeClass: 'arms',
    tags: ['Руки', 'Грудь', 'Плечи'],
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
    title: 'Фуллбоди Спартанец',
    desc: 'Сбалансированный комплекс на руки, кор и выносливость.',
    timeMin: 12,
    icon: '🔥',
    badgeClass: 'full',
    tags: ['Все тело', 'Интенсивно', 'Макс XP'],
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
    title: 'Спасение Стрика',
    desc: 'Всего 3 минуты! Когда лень, устал или мало времени — чтобы огонь 🔥 не погас.',
    timeMin: 3,
    icon: '🛡️',
    badgeClass: 'morning',
    tags: ['3 минуты', 'Анти-лень', 'Стрик'],
    exercises: [
      { id: 'jumping_jacks', duration: 30 },
      { id: 'pushups', duration: 30 },
      { id: 'crunches', duration: 30 },
      { id: 'plank', duration: 30 }
    ]
  }
];

// ==========================================
// RPG LEVEL SYSTEM
// ==========================================
const RANKS = [
  { level: 1, xpReq: 0, title: 'Диванный Воин', icon: '🛋️' },
  { level: 2, xpReq: 150, title: 'Просыпающийся', icon: '⚡' },
  { level: 3, xpReq: 350, title: 'Фитнес-Энтузиаст', icon: '🏃' },
  { level: 4, xpReq: 650, title: 'Атлет Дома', icon: '💪' },
  { level: 5, xpReq: 1100, title: 'Рельефный Мастер', icon: '🍫' },
  { level: 6, xpReq: 1700, title: 'Спартанец', icon: '🛡️' },
  { level: 7, xpReq: 2500, title: 'Неудержимая Машина', icon: '🦾' },
  { level: 8, xpReq: 3500, title: 'Легенда Калистеники', icon: '👑' }
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

    // If last workout was neither today nor yesterday, streak broken
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

    // Ring circumference: 2 * PI * 80 ~= 502.65
    this.circumference = 2 * Math.PI * 80;
    if (this.progressRing) {
      this.progressRing.style.strokeDasharray = `${this.circumference} ${this.circumference}`;
      this.progressRing.style.strokeDashoffset = '0';
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
      muteBtn.textContent = sfx.enabled ? '🔊' : '🔇';
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
    this.musclesEl.textContent = exData.muscles;
    this.avatarEl.textContent = exData.icon;

    this.secondsLeft = step.duration;
    this.currentExerciseTotalSeconds = step.duration;
    this.updateTimerDisplay();
    this.updateProgressRing(1);

    this.pausePlayBtn.textContent = '⏸';
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

  updateProgressRing(fraction) {
    if (!this.progressRing) return;
    const offset = this.circumference - (fraction * this.circumference);
    this.progressRing.style.strokeDashoffset = offset;
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
    this.pausePlayBtn.textContent = this.isPaused ? '▶' : '⏸';
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
    if (confirm('Прервать тренировку? Прогресс за этот заход не сохранится.')) {
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
      try { navigator.vibrate([100, 50, 100]); } catch (e) {}
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

  const { current, next, progressPercent } = state.getCurrentRank();
  document.getElementById('userRankTitle').textContent = current.title;
  document.getElementById('userLevelNum').textContent = `Ур. ${current.level}`;
  document.getElementById('levelProgressFill').style.width = `${progressPercent}%`;

  // Update dynamic greeting based on hour
  const hour = new Date().getHours();
  let greet = 'Доброе утро';
  if (hour >= 12 && hour < 18) greet = 'Добрый день';
  else if (hour >= 18 && hour < 23) greet = 'Добрый вечер';
  else if (hour >= 23 || hour < 5) greet = 'Ночной атлет';
  document.getElementById('greetingTitle').textContent = `${greet}!`;
}

function renderWorkoutsList() {
  const container = document.getElementById('workoutsListContainer');
  container.innerHTML = '';

  WORKOUTS.forEach(w => {
    // Skip streak saver from standard list as it has its own dedicated card
    if (w.id === 'streak_saver') return;

    const card = document.createElement('div');
    card.className = 'workout-card';
    card.innerHTML = `
      <div class="workout-icon-box ${w.badgeClass}">${w.icon}</div>
      <div class="workout-info">
        <div class="workout-title-row">
          <span class="workout-title">${w.title}</span>
          <span class="workout-duration">⏱ ${w.timeMin} мин</span>
        </div>
        <p class="workout-desc">${w.desc}</p>
        <div class="workout-tags">
          ${w.tags.map(t => `<span class="w-tag">${t}</span>`).join('')}
        </div>
      </div>
      <div class="workout-arrow">›</div>
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
  document.getElementById('cardRankBadge').textContent = `${current.icon} ${current.title}`;

  // Milestones list
  const milestonesContainer = document.getElementById('rankMilestonesList');
  milestonesContainer.innerHTML = '';
  RANKS.forEach(r => {
    const isUnlocked = state.data.xp >= r.xpReq;
    const item = document.createElement('div');
    item.className = `rank-item ${isUnlocked ? 'unlocked' : ''}`;
    item.innerHTML = `
      <span class="rank-icon">${r.icon}</span>
      <div style="flex:1;">
        <div class="rank-title">${r.title} ${isUnlocked ? '✔' : ''}</div>
        <div class="rank-requirement">${r.xpReq === 0 ? 'Начальный ранг' : `Требуется ${r.xpReq} XP`}</div>
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
  // Convert to Mon=0, Sun=6
  const startOffset = (firstDayIndex + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Empty leading days
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
    item.innerHTML = `
      <div class="guide-icon">${ex.icon}</div>
      <div class="guide-details">
        <div class="guide-name">${ex.name}</div>
        <div class="guide-target">${ex.muscles}</div>
      </div>
      <div style="color: var(--text-muted); font-size: 18px;">ℹ️</div>
    `;
    item.addEventListener('click', () => showExerciseDetailModal(ex));
    container.appendChild(item);
  });
}

function showExerciseDetailModal(ex) {
  document.getElementById('infoModalTitle').textContent = ex.name;
  document.getElementById('infoModalIcon').textContent = ex.icon;
  document.getElementById('infoModalMuscles').textContent = ex.muscles;
  document.getElementById('infoModalInstructions').textContent = ex.tip;
  document.getElementById('infoModalProTip').textContent = ex.proTip;
  document.getElementById('exerciseInfoModal').classList.add('active');
}

function showFinishModal(workout, elapsedSeconds, result) {
  const modal = document.getElementById('finishModal');
  document.getElementById('rewardXp').textContent = `+${result.xpGained} XP`;
  document.getElementById('rewardStreak').textContent = `Серия: ${result.streak} 🔥`;

  const m = Math.floor(elapsedSeconds / 60);
  const s = elapsedSeconds % 60;
  document.getElementById('finishDuration').textContent = `${m}:${String(s).padStart(2, '0')}`;

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

  // Hero Quick Start (Launches Morning or Iron Abs)
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
    if (confirm('Сбросить весь прогресс, опыт и историю тренировок?')) {
      state.resetAll();
      renderHeaderStats();
      renderProgressScreen();
      alert('Прогресс сброшен к началу!');
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
