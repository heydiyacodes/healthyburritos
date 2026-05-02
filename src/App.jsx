import { useState, useEffect, useCallback } from "react";
import OnboardingModal from './components/OnboardingModal';

import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, AreaChart, Area
} from "recharts";
import {
  LayoutDashboard, BookOpen, Calendar, TrendingUp, Target,
  Repeat2, Droplets, Moon, Footprints, Dumbbell, Flame,
  Plus, X, Check, ShoppingCart, Search, ArrowRight,
  Sun, Pill, Clock, AlertCircle, ChevronDown, ChevronUp, Pencil
} from "lucide-react";

// ─── FONTS + BASE STYLES ─────────────────────────────────────────────────────
(() => {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Outfit:wght@300;400;500;600&display=swap";
  document.head.appendChild(link);
  const s = document.createElement("style");
  s.textContent = `
    :root {
      --bg:#f5f2ed;--bg2:#ede8e0;--bg3:#e4ddd2;
      --surface:#faf8f5;--surface2:#f0ebe2;
      --border:rgba(100,85,65,0.12);--border2:rgba(100,85,65,0.22);
      --text:#2c2418;--text2:#6b5e4e;--text3:#9c8c7a;
      --olive:#6b7c3f;--olive2:#8a9f52;--olive3:#b5c47a;--olive-bg:rgba(107,124,63,0.1);
      --burgundy:#7c2d3f;--burgundy2:#a03a50;--burgundy-bg:rgba(124,45,63,0.1);
      --amber:#a0622a;--amber2:#c47c3a;--amber-bg:rgba(160,98,42,0.1);
      --stone:#8c7b6a;--stone2:#b0a090;--muted:rgba(100,85,65,0.06);
      --shadow:0 2px 16px rgba(44,36,24,0.07);--shadow2:0 4px 24px rgba(44,36,24,0.1);
      --radius:14px;--radius-sm:8px;
    }
    [data-theme="dark"] {
      --bg:#1a1712;--bg2:#221f18;--bg3:#2a261e;
      --surface:#242019;--surface2:#2e2920;
      --border:rgba(200,180,150,0.1);--border2:rgba(200,180,150,0.2);
      --text:#e8e0d0;--text2:#b8a890;--text3:#7a6a58;
      --olive:#8fa852;--olive2:#a8c266;--olive3:#c8d890;--olive-bg:rgba(143,168,82,0.12);
      --burgundy:#c04060;--burgundy2:#d85070;--burgundy-bg:rgba(192,64,96,0.12);
      --amber:#c8843a;--amber2:#e09a4a;--amber-bg:rgba(200,132,58,0.12);
      --stone:#9a8878;--stone2:#7a6858;--muted:rgba(200,180,150,0.06);
      --shadow:0 2px 16px rgba(0,0,0,0.3);--shadow2:0 4px 24px rgba(0,0,0,0.4);
    }
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Outfit',sans-serif;background:var(--bg);color:var(--text);transition:background .3s,color .3s}
    h1,h2,h3{font-family:'Playfair Display',serif}
    .app-shell{position:relative;z-index:1;display:flex;min-height:100vh}
    .card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow)}
    .card-sm{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-sm)}
    .sidebar{width:228px;padding:24px 14px;border-right:1px solid var(--border);position:fixed;top:0;left:0;bottom:0;display:flex;flex-direction:column;background:var(--surface);z-index:10}
    .nav-item{display:flex;align-items:center;gap:11px;padding:10px 13px;border-radius:10px;cursor:pointer;color:var(--text2);font-size:14px;font-weight:400;transition:all .18s;border:1px solid transparent;margin-bottom:2px}
    .nav-item:hover{background:var(--muted);color:var(--text)}
    .nav-item.active{background:var(--olive-bg);color:var(--olive);border-color:rgba(107,124,63,0.2);font-weight:500}
    .main{flex:1;margin-left:228px;padding:32px}
    .metric-chip{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:16px;transition:box-shadow .2s,transform .2s}
    .metric-chip:hover{box-shadow:var(--shadow2);transform:translateY(-1px)}
    .progress-track{height:5px;border-radius:99px;background:var(--border2);overflow:hidden}
    .progress-fill{height:100%;border-radius:99px;transition:width .9s cubic-bezier(.4,0,.2,1)}
    .tab-pill{padding:7px 16px;border-radius:99px;cursor:pointer;font-size:13px;font-weight:400;transition:all .18s;border:1px solid transparent;font-family:'Outfit',sans-serif;color:var(--text2);background:transparent}
    .tab-pill.active{background:var(--olive-bg);color:var(--olive);border-color:rgba(107,124,63,0.2);font-weight:500}
    .tab-pill:not(.active):hover{background:var(--muted);color:var(--text)}
    .btn{font-family:'Outfit',sans-serif;cursor:pointer;border-radius:10px;font-size:13px;font-weight:500;display:inline-flex;align-items:center;gap:6px;transition:all .18s;border:none;padding:9px 18px}
    .btn-primary{background:var(--olive);color:#fff}
    .btn-primary:hover{background:var(--olive2)}
    .btn-ghost{background:var(--muted);color:var(--text2);border:1px solid var(--border2)}
    .btn-ghost:hover{background:var(--border);color:var(--text)}
    .badge{display:inline-flex;align-items:center;gap:4px;padding:3px 9px;border-radius:99px;font-size:11px;font-weight:500}
    .badge-olive{background:var(--olive-bg);color:var(--olive)}
    .badge-burgundy{background:var(--burgundy-bg);color:var(--burgundy)}
    .badge-amber{background:var(--amber-bg);color:var(--amber)}
    .badge-stone{background:var(--muted);color:var(--text2)}
    .food-row{padding:10px 12px;border-radius:8px;display:flex;justify-content:space-between;align-items:center;transition:background .15s}
    .food-row:hover{background:var(--muted)}
    .modal-backdrop{position:fixed;inset:0;background:rgba(20,16,10,0.6);display:flex;align-items:center;justify-content:center;z-index:100;backdrop-filter:blur(6px)}
    .modal{background:var(--surface);border:1px solid var(--border);border-radius:18px;padding:28px;max-width:500px;width:92%;max-height:84vh;overflow-y:auto}
    .swap-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:18px;transition:border-color .2s,transform .2s}
    .swap-card:hover{border-color:var(--border2);transform:translateY(-1px);box-shadow:var(--shadow)}
    .goal-card{border:1.5px solid var(--border);border-radius:var(--radius);padding:20px;cursor:pointer;transition:all .2s;background:var(--surface)}
    .goal-card.selected{border-color:var(--olive);background:var(--olive-bg)}
    .goal-card:hover:not(.selected){border-color:var(--border2)}
    .supp-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:18px;transition:all .2s}
    .supp-card:hover{box-shadow:var(--shadow)}
    .dose-ring{transition:stroke-dasharray .8s ease}
    .meal-cell{border-radius:10px;padding:10px 12px;cursor:pointer;border:1px solid var(--border);background:var(--muted);min-height:60px;transition:all .2s}
    .meal-cell:hover{border-color:var(--olive);background:var(--olive-bg)}
    input[type="search"],input[type="text"],input[type="number"]{background:var(--bg2);border:1px solid var(--border2);color:var(--text);border-radius:10px;padding:9px 12px 9px 36px;font-family:'Outfit',sans-serif;font-size:14px;outline:none;width:100%;transition:border-color .2s}
    input:focus{border-color:var(--olive)}
    input::placeholder{color:var(--text3)}
    .theme-toggle{width:40px;height:22px;border-radius:99px;border:1.5px solid var(--border2);background:var(--muted);cursor:pointer;position:relative;transition:background .25s;display:flex;align-items:center;padding:2px}
    .theme-toggle-thumb{width:16px;height:16px;border-radius:50%;background:var(--olive);transition:transform .25s}
    .theme-toggle-thumb.dark{transform:translateX(18px)}
    .animate-in{animation:fadeUp .35s cubic-bezier(.4,0,.2,1) both}
    @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
    @media(max-width:768px){.sidebar{display:none!important}.main{margin-left:0;padding:20px 16px 90px}.bottom-nav{display:flex!important}}
    .bottom-nav{display:none;position:fixed;bottom:0;left:0;right:0;background:var(--surface);border-top:1px solid var(--border);padding:10px 0 18px;z-index:50;justify-content:space-around}
    .divider{height:1px;background:var(--border);margin:16px 0}
    .section-label{font-size:11px;font-weight:500;color:var(--text3);text-transform:uppercase;letter-spacing:.06em;margin-bottom:12px}
  `;
  document.head.appendChild(s);
})();

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const todayKey = () => {
  const d = new Date();
  return `hb_foodlog_${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
};

const todayLabel = () => new Date().toLocaleDateString('en-IN', {
  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
});

const greetingByHour = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

// Compute macro targets from user profile + goal
const computeTargets = (user) => {
  const w = Number(user.weight) || 70;
  const age = Number(user.age) || 25;
  const goal = user.goal || 'maintenance';

  // Mifflin-St Jeor BMR (assuming moderate activity ~1.55)
  const bmr = (10 * w) + (6.25 * 170) - (5 * age) + 5; // default male formula
  const tdee = Math.round(bmr * 1.55);

  let cal, protein, carbs, fat, fiber;
  if (goal === 'weight_loss') {
    cal = Math.max(1400, tdee - 400);
    protein = Math.round(w * 1.8);
    fat = Math.round(cal * 0.28 / 9);
    fiber = 30;
  } else if (goal === 'muscle_gain') {
    cal = tdee + 300;
    protein = Math.round(w * 2.2);
    fat = Math.round(cal * 0.28 / 9);
    fiber = 35;
  } else {
    cal = tdee;
    protein = Math.round(w * 1.6);
    fat = Math.round(cal * 0.28 / 9);
    fiber = 30;
  }
  carbs = Math.round((cal - protein * 4 - fat * 9) / 4);
  return { cal, protein, carbs: Math.max(carbs, 80), fat, fiber, water: 10 };
};

const sum = (arr, k) => arr.reduce((a, b) => a + (b[k] || 0), 0);
const pct = (v, m) => m === 0 ? 0 : Math.min(100, Math.round((v / m) * 100));
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

function totals(log) {
  const all = Object.values(log).flat();
  return { cal: sum(all, 'cal'), protein: sum(all, 'protein'), carbs: sum(all, 'carbs'), fat: sum(all, 'fat'), fiber: sum(all, 'fiber') };
}

function dietScore(t, targets) {
  const ps = clamp(Math.round((t.protein / targets.protein) * 100), 0, 100);
  const fs = clamp(Math.round((t.fiber / targets.fiber) * 100), 0, 100);
  const ss = clamp(100 - Math.round(((t.carbs * 0.3) / 50) * 100), 0, 100);
  const pr = 74;
  return { overall: Math.round(ps * 0.3 + fs * 0.25 + ss * 0.25 + pr * 0.2), ps, fs, ss, pr };
}

// ─── FOOD DATABASE ────────────────────────────────────────────────────────────
const FOOD_DB = [
  { id: 1,  name: "Oats (1 cup cooked)",           cal: 154, protein: 5,  carbs: 27, fat: 3,  fiber: 4 },
  { id: 2,  name: "Banana (medium)",                cal: 105, protein: 1,  carbs: 27, fat: 0,  fiber: 3 },
  { id: 3,  name: "Boiled Eggs (2)",                cal: 156, protein: 12, carbs: 1,  fat: 11, fiber: 0 },
  { id: 4,  name: "Chicken Breast (150g)",          cal: 248, protein: 47, carbs: 0,  fat: 5,  fiber: 0 },
  { id: 5,  name: "Moong Dal (1 cup)",              cal: 212, protein: 14, carbs: 37, fat: 1,  fiber: 15 },
  { id: 6,  name: "Brown Rice (1 cup)",             cal: 216, protein: 5,  carbs: 45, fat: 2,  fiber: 4 },
  { id: 7,  name: "Whole Wheat Roti (2)",           cal: 210, protein: 7,  carbs: 42, fat: 2,  fiber: 6 },
  { id: 8,  name: "Green Salad (large)",            cal: 45,  protein: 3,  carbs: 8,  fat: 0,  fiber: 4 },
  { id: 9,  name: "Whey Protein Shake",             cal: 130, protein: 25, carbs: 5,  fat: 2,  fiber: 1 },
  { id: 10, name: "Low-fat Curd (200g)",            cal: 118, protein: 10, carbs: 9,  fat: 4,  fiber: 0 },
  { id: 11, name: "Apple (medium)",                 cal: 95,  protein: 0,  carbs: 25, fat: 0,  fiber: 4 },
  { id: 12, name: "Almonds (30g)",                  cal: 174, protein: 6,  carbs: 6,  fat: 15, fiber: 3 },
  { id: 13, name: "Toned Milk (250ml)",             cal: 122, protein: 8,  carbs: 12, fat: 4,  fiber: 0 },
  { id: 14, name: "Paneer (100g)",                  cal: 265, protein: 18, carbs: 2,  fat: 20, fiber: 0 },
  { id: 15, name: "Tofu (150g)",                    cal: 120, protein: 13, carbs: 3,  fat: 6,  fiber: 1 },
  { id: 16, name: "Sweet Potato (medium)",          cal: 130, protein: 3,  carbs: 30, fat: 0,  fiber: 4 },
  { id: 17, name: "Broccoli (1 cup)",               cal: 55,  protein: 4,  carbs: 11, fat: 1,  fiber: 5 },
  { id: 18, name: "Orange (medium)",                cal: 62,  protein: 1,  carbs: 15, fat: 0,  fiber: 3 },
  { id: 19, name: "Whole Wheat Bread (2 slices)",   cal: 138, protein: 6,  carbs: 26, fat: 2,  fiber: 4 },
  { id: 20, name: "Peanut Butter (2 tbsp)",         cal: 188, protein: 8,  carbs: 7,  fat: 16, fiber: 2 },
  { id: 21, name: "Rajma (1 cup cooked)",           cal: 230, protein: 15, carbs: 40, fat: 1,  fiber: 13 },
  { id: 22, name: "Idli (2 pieces)",                cal: 130, protein: 4,  carbs: 26, fat: 1,  fiber: 1 },
  { id: 23, name: "Sambar (1 cup)",                 cal: 100, protein: 6,  carbs: 15, fat: 2,  fiber: 4 },
  { id: 24, name: "Upma (1 cup)",                   cal: 180, protein: 4,  carbs: 32, fat: 4,  fiber: 3 },
  { id: 25, name: "Dal Tadka (1 cup)",              cal: 190, protein: 11, carbs: 28, fat: 5,  fiber: 8 },
];

const SMART_SWAPS = [
  { cat:"Drinks",     from:"Soda / Cold Drink (330ml)",     to:"Sparkling Water + Lemon",         fromCal:140, toCal:5,   benefit:"Save 135 cal, zero sugar",        why:"Eliminates 35g sugar with the same fizzy sensation", diff:"Easy" },
  { cat:"Drinks",     from:"Packaged Juice (250ml)",         to:"Whole Fruit (1 Orange)",           fromCal:110, toCal:62,  benefit:"+4g fiber, −48 cal",             why:"Fiber slows sugar absorption significantly",          diff:"Easy" },
  { cat:"Drinks",     from:"Full-fat Coffee (large)",        to:"Toned Milk Black Coffee",          fromCal:220, toCal:95,  benefit:"Save 125 cal",                   why:"Full flavour, fraction of the fat",                   diff:"Easy" },
  { cat:"Snacks",     from:"Potato Chips (30g)",             to:"Roasted Chickpeas (30g)",          fromCal:155, toCal:120, benefit:"+5g protein, +4g fiber",         why:"More satiating, less inflammatory fat",               diff:"Easy" },
  { cat:"Snacks",     from:"Biscuits / Cookies (3 pcs)",     to:"Apple + 10 Almonds",               fromCal:195, toCal:174, benefit:"+7g fiber, no refined sugar",    why:"Sustains energy without blood sugar spike",           diff:"Easy" },
  { cat:"Meals",      from:"White Rice (1 cup)",             to:"Brown Rice or Cauliflower Rice",   fromCal:206, toCal:152, benefit:"+3g fiber, lower GI",            why:"Slower digestion, better blood sugar control",        diff:"Moderate" },
  { cat:"Meals",      from:"Maida Naan / White Roti",        to:"Whole Wheat or Multigrain Roti",   fromCal:180, toCal:130, benefit:"+4g fiber",                      why:"Refined flour spikes insulin; whole grain does not",  diff:"Easy" },
  { cat:"Meals",      from:"Fried Chicken (150g)",           to:"Grilled / Baked Chicken",          fromCal:380, toCal:248, benefit:"Save 132 cal, less sat fat",      why:"Same protein, dramatically less unhealthy fat",       diff:"Moderate" },
  { cat:"Condiments", from:"Mayonnaise (2 tbsp)",            to:"Hung Curd / Greek Yogurt Dip",     fromCal:188, toCal:30,  benefit:"Save 158 cal, +5g protein",      why:"Creamy texture without the saturated fat load",       diff:"Easy" },
  { cat:"Condiments", from:"Store-bought Ketchup (2 tbsp)", to:"Homemade Tomato Chutney",           fromCal:40,  toCal:15,  benefit:"No added sugar / preservatives", why:"Ketchup has hidden sugar; fresh chutney does not",    diff:"Moderate" },
];

const MEAL_PLAN = {
  weight_loss: [
    { B:{name:"Oats + Banana",cal:259},L:{name:"Chicken + Brown Rice + Salad",cal:509},D:{name:"Dal + 2 Roti",cal:422},S:{name:"Apple + Almonds",cal:269} },
    { B:{name:"Eggs + Wheat Toast",cal:294},L:{name:"Tofu Stir Fry + Rice",cal:336},D:{name:"Paneer Sabzi + Roti",cal:475},S:{name:"Protein Shake",cal:130} },
    { B:{name:"Poha + Orange",cal:262},L:{name:"Moong Dal + Brown Rice",cal:428},D:{name:"Grilled Chicken + Broccoli",cal:303},S:{name:"Curd + Almonds",cal:292} },
    { B:{name:"Smoothie Bowl",cal:310},L:{name:"Roti + Sabzi + Dal",cal:540},D:{name:"Tofu Salad Bowl",cal:245},S:{name:"Sweet Potato",cal:130} },
    { B:{name:"Eggs + Avocado Toast",cal:320},L:{name:"Chicken Bowl + Rice",cal:520},D:{name:"Dal Tadka + Roti",cal:317},S:{name:"Banana + PB",cal:293} },
    { B:{name:"Overnight Oats",cal:285},L:{name:"Paneer Wrap",cal:430},D:{name:"Grilled Fish + Salad",cal:280},S:{name:"Protein Shake",cal:130} },
    { B:{name:"Upma + Boiled Egg",cal:290},L:{name:"Rajma + Rice",cal:480},D:{name:"Dal Soup + Roti",cal:317},S:{name:"Fruits",cal:157} },
  ],
  muscle_gain: [
    { B:{name:"Oats + 3 Eggs + Milk",cal:510},L:{name:"Chicken 200g + Rice",cal:670},D:{name:"Paneer + Dal + 3 Roti",cal:740},S:{name:"PB Protein Shake",cal:318} },
    { B:{name:"5 Eggs + Toast",cal:510},L:{name:"Tuna + Brown Rice",cal:580},D:{name:"Mutton + Roti",cal:720},S:{name:"Almonds + Curd",cal:292} },
    { B:{name:"Banana Oat Pancakes",cal:490},L:{name:"Chicken 200g + Rice",cal:632},D:{name:"Paneer Bhurji + 3 Roti",cal:640},S:{name:"Protein Bar",cal:250} },
    { B:{name:"Greek Yogurt + Granola",cal:420},L:{name:"Rajma + Rice + Curd",cal:680},D:{name:"Grilled Chicken + Sweet Potato",cal:540},S:{name:"Mass Gainer Shake",cal:400} },
    { B:{name:"3 Eggs + Avocado Toast",cal:470},L:{name:"Paneer + Brown Rice + Dal",cal:700},D:{name:"Fish Curry + 2 Roti",cal:560},S:{name:"Milk + Almonds",cal:296} },
    { B:{name:"Egg White Omelette",cal:380},L:{name:"Chicken + Pasta Bowl",cal:720},D:{name:"Tofu Steak + Rice",cal:540},S:{name:"Protein Shake",cal:130} },
    { B:{name:"Dalia + Boiled Eggs",cal:430},L:{name:"Chole + Rice + Raita",cal:690},D:{name:"Egg Curry + 3 Roti",cal:610},S:{name:"PB Toast",cal:326} },
  ],
  maintenance: [
    { B:{name:"Upma + Curd",cal:318},L:{name:"Dal + Rice + Salad",cal:473},D:{name:"Paneer Sabzi + 2 Roti",cal:475},S:{name:"Tea + Fruit",cal:180} },
    { B:{name:"Poha + Boiled Egg",cal:296},L:{name:"Chicken + Roti + Salad",cal:563},D:{name:"Moong Dal + Rice",cal:428},S:{name:"Fruit Bowl",cal:157} },
    { B:{name:"Bread + PB + Banana",cal:431},L:{name:"Chole + Rice + Raita",cal:510},D:{name:"Tofu Stir Fry + Roti",cal:450},S:{name:"Almonds + Milk",cal:296} },
    { B:{name:"Dalia + Milk",cal:310},L:{name:"Rajma + 2 Roti",cal:527},D:{name:"Chicken Soup + Bread",cal:370},S:{name:"Apple + Curd",cal:213} },
    { B:{name:"Oats + Fruits",cal:286},L:{name:"Paneer + Brown Rice",cal:611},D:{name:"Dal Fry + 2 Roti",cal:422},S:{name:"Protein Shake",cal:130} },
    { B:{name:"Idli + Sambar",cal:285},L:{name:"Mixed Veg + Rice + Dal",cal:480},D:{name:"Grilled Chicken + Salad",cal:303},S:{name:"Banana + PB",cal:293} },
    { B:{name:"Eggs + Toast",cal:356},L:{name:"Tofu + Brown Rice Bowl",cal:396},D:{name:"Dal Makhani + 2 Roti",cal:502},S:{name:"Almonds + Dates",cal:220} },
  ],
};

const BURRITO_RECIPES = [
  { name:"Rajma Burrito", tag:"High Protein · Vegetarian", kcal:420, ingredients:["1 cup cooked rajma","1 large roti/wrap","2 tbsp onion chopped","1 tsp cumin","2 tbsp curd","Coriander, salt, chilli flakes"], steps:["Mash rajma lightly with cumin and chilli.","Warm roti. Spread curd.","Add rajma, onion, coriander.","Roll tight. Toast on tawa 1 min."] },
  { name:"Paneer Tikka Wrap", tag:"High Protein · Quick", kcal:380, ingredients:["100g paneer cubed","1 wrap/roti","1 tsp chaat masala","2 tbsp hung curd","Bell pepper strips","Mint chutney"], steps:["Mix paneer with curd + chaat masala.","Sauté 3 min on high heat.","Spread chutney on wrap.","Add paneer + peppers. Roll and serve."] },
  { name:"Egg Bhurji Burrito", tag:"Quick · Budget", kcal:310, ingredients:["2 eggs","1 roti/wrap","1 small onion","1 tomato","Green chilli","Turmeric, salt, coriander"], steps:["Scramble eggs with onion, tomato, chilli.","Season with turmeric + salt.","Warm roti.","Add bhurji, roll. Done in 8 min."] },
  { name:"Aloo Sabzi Wrap", tag:"Vegan · Comfort", kcal:340, ingredients:["1 medium potato boiled","1 roti","Jeera, mustard seeds","Green chutney","Onion rings","Lemon juice"], steps:["Mash potato with jeera + mustard tadka.","Add lemon + salt.","Spread chutney on roti.","Add aloo mix + onion rings. Wrap."] },
  { name:"Chana Masala Burrito", tag:"High Fiber · Filling", kcal:390, ingredients:["1 cup boiled chana","1 wrap","1 tsp amchur","Tomato + onion chopped","Coriander","Green chilli"], steps:["Sauté onion + tomato 3 min.","Add chana + amchur + chilli.","Cook 5 min till dry.","Fill in wrap. Roll tight."] },
  { name:"Palak Tofu Wrap", tag:"Iron Rich · Vegan", kcal:290, ingredients:["100g tofu crumbled","Handful spinach","1 roti","1 tsp garam masala","Garlic + onion","Lemon"], steps:["Sauté garlic + onion 2 min.","Add spinach till wilted.","Add tofu + garam masala.","Wrap in roti with lemon squeeze."] },
  { name:"Moong Dal Wrap", tag:"Light · Digestive", kcal:260, ingredients:["½ cup moong dal cooked","1 roti","Ginger + cumin","Fresh coriander","Green chutney","Sliced onion"], steps:["Cook moong dal with ginger + cumin till soft.","Season and mash lightly.","Spread chutney on roti.","Add dal + onion. Roll and eat."] },
];

// ─── REUSABLE UI ─────────────────────────────────────────────────────────────
function MacroBar({ label, value, max, color }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
        <span style={{ fontSize:13, color:"var(--text2)" }}>{label}</span>
        <span style={{ fontSize:13, color:"var(--text)", fontWeight:500 }}>{value}g <span style={{ color:"var(--text3)", fontWeight:400 }}>/ {max}g</span></span>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width:`${pct(value,max)}%`, background:color }} />
      </div>
    </div>
  );
}

function ScoreGauge({ score }) {
  const r=48, cx=60, cy=60, circ=2*Math.PI*r;
  const dash=(score/100)*circ;
  const color = score>=75?"var(--olive)":score>=50?"var(--amber)":"var(--burgundy)";
  const label = score>=75?"Excellent":score>=50?"Moderate":"Needs Work";
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
      <svg width="120" height="120" viewBox="0 0 120 120">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--border2)" strokeWidth="9" />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="9"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          transform={`rotate(-90 ${cx} ${cy})`} className="dose-ring" />
        <text x={cx} y={cy-4} textAnchor="middle" fill="var(--text)" fontSize="22" fontWeight="600" fontFamily="Playfair Display,serif">{score}</text>
        <text x={cx} y={cy+14} textAnchor="middle" fill="var(--text3)" fontSize="11" fontFamily="Outfit,sans-serif">/ 100</text>
      </svg>
      <span style={{ fontSize:12, fontWeight:500, color }}>{label}</span>
    </div>
  );
}

function StatChip({ icon: Icon, label, value, color }) {
  return (
    <div className="metric-chip" style={{ display:"flex", alignItems:"center", gap:12 }}>
      <div style={{ width:38, height:38, borderRadius:10, background:`${color}18`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
        <Icon size={17} color={color} />
      </div>
      <div>
        <div style={{ fontSize:11, color:"var(--text3)", fontWeight:500, marginBottom:2 }}>{label}</div>
        <div style={{ fontSize:16, fontWeight:600, color:"var(--text)" }}>{value}</div>
      </div>
    </div>
  );
}

// ─── BURRITO OF THE DAY ───────────────────────────────────────────────────────
function BurritoOfTheDay() {
  const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  const recipe = BURRITO_RECIPES[dayOfYear % BURRITO_RECIPES.length];
  return (
    <div style={{ background:"#fdf6ec", border:"0.5px solid #c8b89a", borderRadius:14, padding:"1.25rem 1.5rem", marginBottom:"1.5rem" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1rem" }}>
        <div>
          <p style={{ fontSize:11, color:"#7a6a52", margin:"0 0 2px", textTransform:"uppercase", letterSpacing:1 }}>Today's Burrito Suggestion</p>
          <h2 style={{ margin:0, fontSize:20, color:"#3a2e1e", fontFamily:"Playfair Display,serif" }}>{recipe.name}</h2>
          <span style={{ fontSize:12, color:"#7a6a52" }}>{recipe.tag} · {recipe.kcal} kcal</span>
        </div>
        <div style={{ fontSize:36 }}>🌯</div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        <div>
          <p style={{ fontSize:12, fontWeight:500, color:"#5a4a32", margin:"0 0 6px" }}>Ingredients</p>
          <ul style={{ margin:0, padding:"0 0 0 1rem", fontSize:13, color:"#3a2e1e", lineHeight:1.8 }}>
            {recipe.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
          </ul>
        </div>
        <div>
          <p style={{ fontSize:12, fontWeight:500, color:"#5a4a32", margin:"0 0 6px" }}>Steps</p>
          <ol style={{ margin:0, padding:"0 0 0 1rem", fontSize:13, color:"#3a2e1e", lineHeight:1.8 }}>
            {recipe.steps.map((st, i) => <li key={i}>{st}</li>)}
          </ol>
        </div>
      </div>
    </div>
  );
}

// ─── ACTIVITY INPUT BAR ────────────────────────────────────────────────────────
function ActivityBar({ activity, setActivity, storageKey }) {
  const save = (key, val) => {
    const next = { ...activity, [key]: val };
    setActivity(next);
    localStorage.setItem(storageKey, JSON.stringify(next));
  };
  return (
    <div className="card" style={{ padding:"14px 20px", marginBottom:20 }}>
      <p className="section-label" style={{ marginBottom:10 }}>Today's Activity — tap to update</p>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
        {[
          { key:"sleep", icon:Moon, label:"Sleep (hrs)", color:"var(--stone)", min:0, max:24, step:0.5, suffix:"hrs" },
          { key:"steps", icon:Footprints, label:"Steps", color:"var(--amber)", min:0, max:50000, step:500, suffix:"" },
          { key:"workout", icon:Dumbbell, label:"Workout (min)", color:"var(--olive2)", min:0, max:300, step:5, suffix:"min" },
        ].map(({ key, icon:Icon, label, color, min, max, step, suffix }) => (
          <div key={key} style={{ textAlign:"center" }}>
            <div style={{ fontSize:11, color:"var(--text3)", marginBottom:4 }}>{label}</div>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
              <button onClick={() => save(key, Math.max(min, (activity[key]||0) - step))}
                style={{ background:"var(--muted)", border:"1px solid var(--border2)", borderRadius:6, width:24, height:24, cursor:"pointer", color:"var(--text2)", fontSize:16, display:"flex", alignItems:"center", justifyContent:"center" }}>−</button>
              <span style={{ fontSize:18, fontWeight:700, color, fontFamily:"Playfair Display,serif", minWidth:48, textAlign:"center" }}>
                {activity[key] || 0}{suffix}
              </span>
              <button onClick={() => save(key, Math.min(max, (activity[key]||0) + step))}
                style={{ background:"var(--muted)", border:"1px solid var(--border2)", borderRadius:6, width:24, height:24, cursor:"pointer", color:"var(--text2)", fontSize:16, display:"flex", alignItems:"center", justifyContent:"center" }}>+</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── PAGES ───────────────────────────────────────────────────────────────────
function Dashboard({ user, targets, foodLog, waterCups, setWaterCups, activity, setActivity, activityKey }) {
  const t = totals(foodLog);
  const sc = dietScore(t, targets);
  const calPct = pct(t.cal, targets.cal);
  const remaining = Math.max(0, targets.cal - t.cal);

  // Build last 7 days chart from localStorage
  const chartData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const key = `hb_foodlog_${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    let cal = 0;
    try { const raw = localStorage.getItem(key); if (raw) { const log = JSON.parse(raw); cal = Object.values(log).flat().reduce((s, e) => s + (e.cal||0), 0); } } catch {}
    return { d: d.toLocaleDateString('en-IN', { weekday: 'short' }), cal, goal: targets.cal };
  });

  // Swap hints based on real food log
  const swapHints = [
    waterCups < 6 ? { from:"Low water intake today", to:"Add more cups", gain:"Stay hydrated" } : null,
    activity.workout === 0 ? { from:"No workout logged today", to:"20-min walk", gain:"−150 cal" } : null,
    t.protein < targets.protein * 0.6 ? { from:"Low protein today", to:"Add eggs or dal", gain:"+10g protein" } : null,
    { from:"White rice", to:"Brown rice", gain:"+4g fiber" },
  ].filter(Boolean).slice(0, 3);

  return (
    <div className="animate-in">
      <div style={{ marginBottom:28 }}>
        <h1 style={{ fontSize:28, fontWeight:700, color:"var(--text)", lineHeight:1.2 }}>
          {greetingByHour()}, {user.name.split(' ')[0]} 👋
        </h1>
        <p style={{ color:"var(--text3)", fontSize:14, marginTop:5 }}>{todayLabel()} · Here's your daily snapshot</p>
      </div>

      {/* Stat row */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(155px,1fr))", gap:12, marginBottom:20 }}>
        <StatChip icon={Flame}     label="Calories Today" value={`${t.cal} kcal`}            color="var(--burgundy)" />
        <StatChip icon={Droplets}  label="Hydration"      value={`${waterCups}/${targets.water} cups`} color="var(--olive)" />
        <StatChip icon={Moon}      label="Sleep"          value={`${activity.sleep || 0} hrs`} color="var(--stone)" />
        <StatChip icon={Footprints} label="Steps"         value={(activity.steps || 0).toLocaleString()} color="var(--amber)" />
        <StatChip icon={Dumbbell}  label="Workout"        value={`${activity.workout || 0} min`} color="var(--olive2)" />
      </div>

      <ActivityBar activity={activity} setActivity={setActivity} storageKey={activityKey} />

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:20 }}>
        {/* Calorie ring */}
        <div className="card" style={{ padding:22 }}>
          <p className="section-label">Calorie Goal</p>
          <div style={{ display:"flex", alignItems:"center", gap:20 }}>
            <svg width="88" height="88" viewBox="0 0 88 88" style={{ flexShrink:0 }}>
              <circle cx="44" cy="44" r="36" fill="none" stroke="var(--border2)" strokeWidth="8" />
              <circle cx="44" cy="44" r="36" fill="none" stroke="var(--burgundy)" strokeWidth="8"
                strokeDasharray={`${(calPct/100)*2*Math.PI*36} ${2*Math.PI*36}`}
                strokeLinecap="round" transform="rotate(-90 44 44)" className="dose-ring" />
              <text x="44" y="48" textAnchor="middle" fill="var(--text)" fontSize="15" fontWeight="600" fontFamily="Playfair Display,serif">{calPct}%</text>
            </svg>
            <div>
              <div style={{ fontSize:26, fontWeight:700, color:"var(--text)", fontFamily:"Playfair Display,serif" }}>{t.cal}</div>
              <div style={{ fontSize:12, color:"var(--text3)", marginBottom:6 }}>of {targets.cal} kcal goal</div>
              <span className="badge badge-olive">{remaining} kcal remaining</span>
            </div>
          </div>
        </div>

        {/* Diet Score */}
        <div className="card" style={{ padding:22 }}>
          <p className="section-label">Diet Quality Score</p>
          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
            <ScoreGauge score={sc.overall} />
            <div style={{ flex:1 }}>
              {[["Protein",sc.ps,"var(--olive)"],["Fiber",sc.fs,"var(--amber)"],["Sugar Load",sc.ss,"var(--burgundy)"],["Processing",sc.pr,"var(--stone)"]].map(([l,v,c]) => (
                <div key={l} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:7 }}>
                  <span style={{ fontSize:12, color:"var(--text2)" }}>{l}</span>
                  <span style={{ fontSize:12, fontWeight:600, color:v>=75?"var(--olive)":v>=50?"var(--amber)":"var(--burgundy)" }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Macros */}
      <div className="card" style={{ padding:22, marginBottom:20 }}>
        <p className="section-label">Macronutrients</p>
        {t.cal === 0 && <p style={{ fontSize:13, color:"var(--text3)", marginBottom:12, fontStyle:"italic" }}>Log your first meal to see macro tracking.</p>}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 32px" }}>
          <MacroBar label="Protein"       value={t.protein} max={targets.protein} color="var(--olive)" />
          <MacroBar label="Carbohydrates" value={t.carbs}   max={targets.carbs}   color="var(--amber)" />
          <MacroBar label="Fat"           value={t.fat}     max={targets.fat}     color="var(--burgundy)" />
          <MacroBar label="Fiber"         value={t.fiber}   max={targets.fiber}   color="var(--stone)" />
        </div>
      </div>

      {/* Hydration */}
      <div className="card" style={{ padding:22, marginBottom:20 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
          <p className="section-label" style={{ marginBottom:0 }}>Hydration Tracker</p>
          <span style={{ fontSize:13, color:"var(--olive)", fontWeight:600 }}>{waterCups}/{targets.water} cups</span>
        </div>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:12 }}>
          {Array.from({ length: targets.water }).map((_, i) => (
            <div key={i} onClick={() => {
              const next = i < waterCups ? i : i + 1;
              setWaterCups(next);
              localStorage.setItem('hb_water_' + todayKey(), next);
            }}
              style={{ width:34, height:34, borderRadius:8, border:`1.5px solid ${i<waterCups?"var(--olive)":"var(--border2)"}`, background:i<waterCups?"var(--olive-bg)":"transparent", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", transition:"all .15s" }}>
              <Droplets size={13} color={i<waterCups?"var(--olive)":"var(--text3)"} />
            </div>
          ))}
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width:`${pct(waterCups,targets.water)}%`, background:"var(--olive)" }} />
        </div>
      </div>

      {/* 7-day chart */}
      <div className="card" style={{ padding:22, marginBottom:20 }}>
        <p className="section-label">Last 7 Days — Calories</p>
        {chartData.every(d => d.cal === 0)
          ? <p style={{ fontSize:13, color:"var(--text3)", fontStyle:"italic", padding:"20px 0" }}>Start logging meals to see your weekly trend.</p>
          : <ResponsiveContainer width="100%" height={130}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="calGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--olive)" stopOpacity={0.18} />
                    <stop offset="95%" stopColor="var(--olive)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="d" tick={{ fill:"var(--text3)", fontSize:11 }} axisLine={false} tickLine={false} />
                <YAxis hide domain={[0, Math.max(targets.cal * 1.3, 500)]} />
                <Tooltip contentStyle={{ background:"var(--surface)", border:"1px solid var(--border2)", borderRadius:10, fontFamily:"Outfit", fontSize:12 }} />
                <Area type="monotone" dataKey="cal" stroke="var(--olive)" strokeWidth={2} fill="url(#calGrad)" name="Eaten" />
                <Line type="monotone" dataKey="goal" stroke="var(--burgundy)" strokeWidth={1.5} strokeDasharray="5 4" dot={false} name="Goal" />
              </AreaChart>
            </ResponsiveContainer>
        }
      </div>

      {/* Burrito of the day */}
      <BurritoOfTheDay />

      {/* Smart swap hints */}
      {swapHints.length > 0 && (
        <>
          <p style={{ fontSize:15, fontWeight:600, color:"var(--text)", marginBottom:12, fontFamily:"Playfair Display,serif" }}>Today's Swap Suggestions</p>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))", gap:12 }}>
            {swapHints.map((s, i) => (
              <div key={i} className="card" style={{ padding:"14px 16px" }}>
                <div style={{ fontSize:12, color:"var(--text3)", marginBottom:6 }}>{s.from}</div>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                  <ArrowRight size={13} color="var(--olive)" />
                  <span style={{ fontSize:14, fontWeight:500, color:"var(--text)" }}>{s.to}</span>
                </div>
                <span className="badge badge-olive">{s.gain}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function FoodLog({ targets, foodLog, setFoodLog }) {
  const [meal, setMeal] = useState("Breakfast");
  const [showAdd, setShowAdd] = useState(false);
  const [q, setQ] = useState("");
  const meals = ["Breakfast", "Lunch", "Dinner", "Snacks"];
  const t = totals(foodLog);
  const filtered = FOOD_DB.filter(f => f.name.toLowerCase().includes(q.toLowerCase()));

  const addFood = f => {
    const entry = { ...f, _id: Date.now() };
    setFoodLog(p => {
      const next = { ...p, [meal]: [...p[meal], entry] };
      localStorage.setItem(todayKey(), JSON.stringify(next));
      return next;
    });
    setShowAdd(false); setQ("");
  };

  const removeFood = (m, idx) => setFoodLog(p => {
    const next = { ...p, [m]: p[m].filter((_, j) => j !== idx) };
    localStorage.setItem(todayKey(), JSON.stringify(next));
    return next;
  });

  const mT = items => ({ cal:sum(items,"cal"), p:sum(items,"protein"), c:sum(items,"carbs"), f:sum(items,"fat") });

  return (
    <div className="animate-in">
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
        <h2 style={{ fontSize:24, fontWeight:700 }}>Food Log</h2>
        <span style={{ fontSize:13, color:"var(--text3)" }}>{todayLabel()}</span>
      </div>

      <div className="card" style={{ padding:"14px 20px", marginBottom:20, display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:8, textAlign:"center" }}>
        {[
          { l:"Calories", v:t.cal,     u:"kcal", c:"var(--burgundy)", max:targets.cal },
          { l:"Protein",  v:t.protein, u:"g",    c:"var(--olive)",    max:targets.protein },
          { l:"Carbs",    v:t.carbs,   u:"g",    c:"var(--amber)",    max:targets.carbs },
          { l:"Fat",      v:t.fat,     u:"g",    c:"var(--stone)",    max:targets.fat },
          { l:"Fiber",    v:t.fiber,   u:"g",    c:"var(--olive2)",   max:targets.fiber },
        ].map(m => (
          <div key={m.l}>
            <div style={{ fontSize:11, color:"var(--text3)", marginBottom:3 }}>{m.l}</div>
            <div style={{ fontSize:17, fontWeight:700, color:m.c, fontFamily:"Playfair Display,serif" }}>{m.v}<span style={{ fontSize:10, color:"var(--text3)", fontFamily:"Outfit" }}>{m.u}</span></div>
            <div style={{ fontSize:10, color:"var(--text3)" }}>/{m.max}</div>
            <div className="progress-track" style={{ marginTop:5 }}>
              <div className="progress-fill" style={{ width:`${pct(m.v,m.max)}%`, background:m.c }} />
            </div>
          </div>
        ))}
      </div>

      <div style={{ display:"flex", gap:8, marginBottom:20 }}>
        {meals.map(m => <button key={m} className={`tab-pill ${meal===m?"active":""}`} onClick={() => setMeal(m)}>{m}</button>)}
      </div>

      <div className="card" style={{ padding:"8px 4px", marginBottom:16 }}>
        <div style={{ padding:"0 12px 10px", display:"flex", justifyContent:"space-between", borderBottom:"1px solid var(--border)", marginBottom:4 }}>
          <span style={{ fontSize:11, color:"var(--text3)", fontWeight:500 }}>FOOD</span>
          <div style={{ display:"flex", gap:22, fontSize:11, color:"var(--text3)", fontWeight:500 }}>
            <span>CAL</span><span>PRO</span><span>CARBS</span><span>FAT</span>
          </div>
        </div>
        {foodLog[meal].length === 0 && (
          <div style={{ textAlign:"center", padding:"28px 0", color:"var(--text3)", fontSize:14 }}>Nothing logged yet for {meal}</div>
        )}
        {foodLog[meal].map((f, i) => (
          <div key={f._id || i} className="food-row">
            <div style={{ flex:1 }}>
              <div style={{ fontSize:14, color:"var(--text)", fontWeight:500 }}>{f.name}</div>
              <div style={{ fontSize:12, color:"var(--text3)" }}>1 serving</div>
            </div>
            <div style={{ display:"flex", gap:20, fontSize:13, fontWeight:600, alignItems:"center" }}>
              <span style={{ color:"var(--burgundy)", minWidth:36, textAlign:"right" }}>{f.cal}</span>
              <span style={{ color:"var(--olive)", minWidth:28, textAlign:"right" }}>{f.protein}g</span>
              <span style={{ color:"var(--amber)", minWidth:36, textAlign:"right" }}>{f.carbs}g</span>
              <span style={{ color:"var(--stone)", minWidth:28, textAlign:"right" }}>{f.fat}g</span>
              <button onClick={() => removeFood(meal, i)} style={{ background:"none", border:"none", cursor:"pointer", color:"var(--text3)", marginLeft:4, padding:2 }}><X size={13} /></button>
            </div>
          </div>
        ))}
        {foodLog[meal].length > 0 && (() => {
          const mt = mT(foodLog[meal]);
          return (
            <div style={{ padding:"10px 12px", borderTop:"1px solid var(--border)", display:"flex", justifyContent:"space-between", marginTop:4 }}>
              <span style={{ fontSize:11, fontWeight:600, color:"var(--text3)" }}>MEAL TOTAL</span>
              <div style={{ display:"flex", gap:20, fontSize:12, fontWeight:700 }}>
                <span style={{ color:"var(--burgundy)", minWidth:36, textAlign:"right" }}>{mt.cal}</span>
                <span style={{ color:"var(--olive)", minWidth:28, textAlign:"right" }}>{mt.p}g</span>
                <span style={{ color:"var(--amber)", minWidth:36, textAlign:"right" }}>{mt.c}g</span>
                <span style={{ color:"var(--stone)", minWidth:28, textAlign:"right" }}>{mt.f}g</span>
                <span style={{ minWidth:20 }} />
              </div>
            </div>
          );
        })()}
      </div>

      <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
        <Plus size={15} /> Add Food to {meal}
      </button>

      {showAdd && (
        <div className="modal-backdrop" onClick={() => setShowAdd(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
              <h3 style={{ fontSize:18, fontWeight:700 }}>Add to {meal}</h3>
              <button onClick={() => setShowAdd(false)} style={{ background:"none", border:"none", cursor:"pointer", color:"var(--text3)" }}><X size={18} /></button>
            </div>
            <div style={{ position:"relative", marginBottom:16 }}>
              <Search size={13} style={{ position:"absolute", left:11, top:"50%", transform:"translateY(-50%)", color:"var(--text3)" }} />
              <input type="search" value={q} onChange={e => setQ(e.target.value)} placeholder="Search foods…" />
            </div>
            <div style={{ maxHeight:320, overflowY:"auto" }}>
              {filtered.slice(0, 15).map(f => (
                <div key={f.id} className="food-row" style={{ cursor:"pointer" }} onClick={() => addFood(f)}>
                  <div>
                    <div style={{ fontSize:14, color:"var(--text)", fontWeight:500 }}>{f.name}</div>
                    <div style={{ fontSize:12, color:"var(--text3)" }}>{f.cal} kcal · P:{f.protein}g C:{f.carbs}g F:{f.fat}g</div>
                  </div>
                  <Plus size={15} color="var(--olive)" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MealPlan({ user }) {
  const goalKey = user.goal || 'maintenance';
  const plan = MEAL_PLAN[goalKey] || MEAL_PLAN.maintenance;
  const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  const mKeys = { B:"Breakfast", L:"Lunch", D:"Dinner", S:"Snack" };
  const [selected, setSelected] = useState(null);
  const [showShop, setShowShop] = useState(false);
  const goalLabel = { weight_loss:"Weight Loss", muscle_gain:"Muscle Gain", maintenance:"Maintenance" }[goalKey] || "Maintenance";

  const groceries = {
    Proteins: ["Chicken breast","Eggs","Paneer / Tofu","Whey protein","Moong dal","Rajma"],
    Grains: ["Brown rice","Oats","Whole wheat flour","Multigrain bread","Dalia"],
    Produce: ["Banana","Apple","Orange","Broccoli","Sweet potato","Tomatoes","Spinach","Lemon"],
    Dairy: ["Toned milk","Low-fat curd","Buttermilk"],
    Pantry: ["Almonds","Peanut butter","Olive oil","Cumin","Turmeric","Ginger"],
  };

  return (
    <div className="animate-in">
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
        <h2 style={{ fontSize:24, fontWeight:700 }}>Meal Plan</h2>
        <button className="btn btn-ghost" onClick={() => setShowShop(true)}><ShoppingCart size={14} /> Shopping List</button>
      </div>
      <div style={{ marginBottom:20 }}>
        <span className="badge badge-olive">Goal: {goalLabel}</span>
        <span style={{ fontSize:12, color:"var(--text3)", marginLeft:10 }}>Tailored for {user.name.split(" ")[0]}</span>
      </div>
      <div style={{ overflowX:"auto" }}>
        <table style={{ width:"100%", borderCollapse:"separate", borderSpacing:"0 4px" }}>
          <thead>
            <tr>
              <th style={{ fontSize:11, color:"var(--text3)", textAlign:"left", padding:"0 12px 10px", fontWeight:500 }}>MEAL</th>
              {days.map(d => <th key={d} style={{ fontSize:11, color:"var(--text3)", padding:"0 6px 10px", fontWeight:500, textAlign:"center", minWidth:118 }}>{d}</th>)}
            </tr>
          </thead>
          <tbody>
            {Object.entries(mKeys).map(([k, label]) => (
              <tr key={k}>
                <td style={{ padding:"4px 12px", fontSize:12, fontWeight:500, color:"var(--text2)", whiteSpace:"nowrap" }}>{label}</td>
                {plan.map((day, di) => (
                  <td key={di} style={{ padding:"4px 6px" }}>
                    <div className="meal-cell" onClick={() => setSelected({ di, k, data:day[k] })}>
                      <div style={{ fontSize:12, color:"var(--text)", fontWeight:500, lineHeight:1.3 }}>{day[k]?.name}</div>
                      <div style={{ fontSize:11, color:"var(--olive)", marginTop:4, fontWeight:600 }}>{day[k]?.cal} kcal</div>
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="modal-backdrop" onClick={() => setSelected(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
              <h3 style={{ fontSize:18, fontWeight:700 }}>{mKeys[selected.k]} · {days[selected.di]}</h3>
              <button onClick={() => setSelected(null)} style={{ background:"none", border:"none", cursor:"pointer", color:"var(--text3)" }}><X size={18} /></button>
            </div>
            <div className="card" style={{ padding:"14px 16px" }}>
              <div style={{ fontSize:17, fontWeight:700, color:"var(--text)", marginBottom:4 }}>{selected.data?.name}</div>
              <div style={{ fontSize:24, fontWeight:700, color:"var(--olive)", fontFamily:"Playfair Display,serif" }}>{selected.data?.cal} <span style={{ fontSize:13, color:"var(--text3)", fontFamily:"Outfit", fontWeight:400 }}>kcal</span></div>
            </div>
          </div>
        </div>
      )}

      {showShop && (
        <div className="modal-backdrop" onClick={() => setShowShop(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
              <h3 style={{ fontSize:18, fontWeight:700 }}>Weekly Shopping List</h3>
              <button onClick={() => setShowShop(false)} style={{ background:"none", border:"none", cursor:"pointer", color:"var(--text3)" }}><X size={18} /></button>
            </div>
            {Object.entries(groceries).map(([cat, items]) => (
              <div key={cat} style={{ marginBottom:16 }}>
                <div className="section-label">{cat}</div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                  {items.map(item => <span key={item} className="badge badge-stone">{item}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Trends({ targets }) {
  const data = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const key = `hb_foodlog_${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    const actKey = `hb_activity_${key.replace('hb_foodlog_','')}`;
    let cal = 0; let workout = 0; let water = 0;
    try { const raw = localStorage.getItem(key); if (raw) { cal = Object.values(JSON.parse(raw)).flat().reduce((s,e) => s+(e.cal||0), 0); } } catch {}
    try { const act = localStorage.getItem(actKey); if (act) { const a = JSON.parse(act); workout = a.workout||0; water = a.water||0; } } catch {}
    return { d: d.toLocaleDateString('en-IN',{weekday:'short'}), cal, goal: targets.cal, workout, water };
  });

  const ttStyle = { background:"var(--surface)", border:"1px solid var(--border2)", borderRadius:10, fontFamily:"Outfit", fontSize:12, color:"var(--text)" };
  const hasData = data.some(d => d.cal > 0);

  return (
    <div className="animate-in">
      <h2 style={{ fontSize:24, fontWeight:700, marginBottom:24 }}>Weekly Trends</h2>
      {!hasData && <div className="card" style={{ padding:40, textAlign:"center", color:"var(--text3)", marginBottom:20 }}>
        <div style={{ fontSize:32, marginBottom:12 }}>📊</div>
        <p style={{ fontSize:15 }}>No data yet — start logging meals and activity to see your trends here.</p>
      </div>}
      {hasData && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
          <div className="card" style={{ padding:20 }}>
            <p className="section-label">Calorie Intake vs Goal</p>
            <ResponsiveContainer width="100%" height={155}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="d" tick={{ fill:"var(--text3)", fontSize:11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill:"var(--text3)", fontSize:11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={ttStyle} />
                <Line type="monotone" dataKey="cal" stroke="var(--burgundy)" strokeWidth={2.5} dot={{ fill:"var(--burgundy)", r:3 }} name="Eaten" />
                <Line type="monotone" dataKey="goal" stroke="var(--olive)" strokeWidth={1.8} strokeDasharray="5 4" dot={false} name="Goal" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="card" style={{ padding:20 }}>
            <p className="section-label">Workout Minutes</p>
            <ResponsiveContainer width="100%" height={155}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="d" tick={{ fill:"var(--text3)", fontSize:11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill:"var(--text3)", fontSize:11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={ttStyle} />
                <Bar dataKey="workout" fill="var(--olive)" radius={[6,6,0,0]} name="Minutes" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="card" style={{ padding:20 }}>
            <p className="section-label">Water Intake (cups/day)</p>
            <ResponsiveContainer width="100%" height={155}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="d" tick={{ fill:"var(--text3)", fontSize:11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill:"var(--text3)", fontSize:11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={ttStyle} />
                <Bar dataKey="water" fill="var(--stone)" radius={[6,6,0,0]} name="Cups" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

function Goals({ user, setUser, targets }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...user });
  const goalDefs = [
    { id:"weight_loss",  label:"Weight Loss",  icon:"◎", sub:"−0.5 kg/week",  desc:"Calorie deficit of ~400 kcal/day" },
    { id:"muscle_gain",  label:"Muscle Gain",  icon:"◈", sub:"+0.25 kg/week", desc:"Calorie surplus of ~300 kcal/day" },
    { id:"maintenance",  label:"Maintenance",  icon:"◇", sub:"Hold steady",   desc:"Eat at your TDEE" },
  ];
  const curGoal = goalDefs.find(g => g.id === (user.goal || 'maintenance'));
  const bmi = (Number(user.weight) / ((170/100)**2)).toFixed(1);

  const saveEdits = () => {
    const updated = { ...user, ...form };
    localStorage.setItem('hb_user', JSON.stringify(updated));
    setUser(updated);
    setEditing(false);
  };

  const setGoal = (goalId) => {
    const updated = { ...user, goal: goalId };
    localStorage.setItem('hb_user', JSON.stringify(updated));
    setUser(updated);
  };

  return (
    <div className="animate-in">
      <h2 style={{ fontSize:24, fontWeight:700, marginBottom:8 }}>Goals & Profile</h2>
      <p style={{ color:"var(--text3)", fontSize:14, marginBottom:24 }}>Your body, your targets</p>

      {/* Profile card */}
      <div className="card" style={{ padding:20, marginBottom:24, display:"flex", gap:20, alignItems:"center" }}>
        <div style={{ width:60, height:60, borderRadius:14, background:"var(--olive-bg)", border:"1px solid var(--border2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, flexShrink:0 }}>🧑</div>
        <div style={{ flex:1 }}>
          {editing ? (
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10 }}>
              {[
                { label:"Name", key:"name", type:"text" },
                { label:"Age", key:"age", type:"number" },
                { label:"Weight (kg)", key:"weight", type:"number" },
              ].map(({ label, key, type }) => (
                <div key={key}>
                  <div style={{ fontSize:11, color:"var(--text3)", marginBottom:3 }}>{label}</div>
                  <input type={type} value={form[key] || ''} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                    style={{ paddingLeft:10, fontSize:13 }} />
                </div>
              ))}
              <div style={{ gridColumn:"1/-1", display:"flex", gap:8, marginTop:4 }}>
                <button className="btn btn-primary" style={{ padding:"6px 16px", fontSize:12 }} onClick={saveEdits}><Check size={13} /> Save</button>
                <button className="btn btn-ghost" style={{ padding:"6px 12px", fontSize:12 }} onClick={() => setEditing(false)}>Cancel</button>
              </div>
            </div>
          ) : (
            <>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ fontSize:20, fontWeight:700, color:"var(--text)", fontFamily:"Playfair Display,serif" }}>{user.name}</div>
                <button onClick={() => setEditing(true)} style={{ background:"none", border:"none", cursor:"pointer", color:"var(--text3)", padding:2 }}><Pencil size={13} /></button>
              </div>
              <div style={{ color:"var(--text3)", fontSize:13, marginTop:2 }}>Age {user.age} · {user.weight} kg</div>
              {user.allergies && <div style={{ color:"var(--text3)", fontSize:12, marginTop:2 }}>⚠️ Allergies: {user.allergies}</div>}
              {user.medications && <div style={{ color:"var(--text3)", fontSize:12, marginTop:2 }}>💊 Meds: {user.medications}</div>}
              <div style={{ marginTop:8, display:"flex", gap:6 }}>
                <span className="badge badge-olive">BMI {bmi}</span>
                <span className="badge badge-stone">{curGoal?.label || 'Maintenance'}</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Goal selection */}
      <p className="section-label">Select Your Goal</p>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(190px,1fr))", gap:12, marginBottom:28 }}>
        {goalDefs.map(g => (
          <div key={g.id} className={`goal-card ${(user.goal||'maintenance')===g.id?"selected":""}`} onClick={() => setGoal(g.id)}>
            <div style={{ fontSize:22, marginBottom:10, color:"var(--olive)" }}>{g.icon}</div>
            <div style={{ fontSize:16, fontWeight:700, color:"var(--text)", fontFamily:"Playfair Display,serif", marginBottom:4 }}>{g.label}</div>
            <div style={{ fontSize:13, color:"var(--olive)", fontWeight:500, marginBottom:4 }}>{g.sub}</div>
            <div style={{ fontSize:12, color:"var(--text3)" }}>{g.desc}</div>
          </div>
        ))}
      </div>

      {/* Computed targets */}
      <div className="card" style={{ padding:20 }}>
        <p className="section-label">Your Daily Targets (auto-computed)</p>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, textAlign:"center" }}>
          {[
            { l:"Calories", v:targets.cal,     u:"kcal", c:"var(--burgundy)" },
            { l:"Protein",  v:targets.protein, u:"g",    c:"var(--olive)" },
            { l:"Carbs",    v:targets.carbs,   u:"g",    c:"var(--amber)" },
            { l:"Fat",      v:targets.fat,     u:"g",    c:"var(--stone)" },
          ].map(m => (
            <div key={m.l} className="card-sm" style={{ padding:"14px 8px", background:"var(--muted)" }}>
              <div style={{ fontSize:20, fontWeight:700, color:m.c, fontFamily:"Playfair Display,serif" }}>{m.v}<span style={{ fontSize:10, fontFamily:"Outfit" }}>{m.u}</span></div>
              <div style={{ fontSize:11, color:"var(--text3)", marginTop:2 }}>{m.l}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop:14, padding:"10px 14px", background:"var(--olive-bg)", borderRadius:10, border:"1px solid rgba(107,124,63,0.18)", fontSize:13, color:"var(--olive)" }}>
          Water {targets.water} cups/day · Fiber target {targets.fiber}g/day
        </div>
      </div>
    </div>
  );
}

function Swaps() {
  const cats = ["All","Drinks","Snacks","Meals","Condiments"];
  const [active, setActive] = useState("All");
  const filtered = active==="All" ? SMART_SWAPS : SMART_SWAPS.filter(s => s.cat===active);
  const catColor = { Drinks:"var(--olive)", Snacks:"var(--amber)", Meals:"var(--burgundy)", Condiments:"var(--stone)" };
  return (
    <div className="animate-in">
      <h2 style={{ fontSize:24, fontWeight:700, marginBottom:8 }}>Smart Swaps Library</h2>
      <p style={{ color:"var(--text3)", fontSize:14, marginBottom:20 }}>Simple switches, lasting results</p>
      <div style={{ display:"flex", gap:8, marginBottom:24, flexWrap:"wrap" }}>
        {cats.map(c => <button key={c} className={`tab-pill ${active===c?"active":""}`} onClick={() => setActive(c)}>{c}</button>)}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))", gap:14 }}>
        {filtered.map((s, i) => (
          <div key={i} className="swap-card">
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
              <span className="badge" style={{ background:`${catColor[s.cat]}18`, color:catColor[s.cat] }}>{s.cat}</span>
              <span className="badge" style={{ background:s.diff==="Easy"?"var(--olive-bg)":"var(--amber-bg)", color:s.diff==="Easy"?"var(--olive)":"var(--amber)" }}>{s.diff}</span>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
              <div style={{ flex:1, padding:"10px 12px", background:"var(--burgundy-bg)", borderRadius:10, border:"1px solid rgba(124,45,63,0.12)" }}>
                <div style={{ fontSize:11, color:"var(--burgundy)", marginBottom:2, fontWeight:600 }}>Instead of</div>
                <div style={{ fontSize:13, color:"var(--text)", fontWeight:500, lineHeight:1.3 }}>{s.from}</div>
                <div style={{ fontSize:11, color:"var(--text3)", marginTop:3 }}>{s.fromCal} kcal</div>
              </div>
              <ArrowRight size={16} color="var(--olive)" style={{ flexShrink:0 }} />
              <div style={{ flex:1, padding:"10px 12px", background:"var(--olive-bg)", borderRadius:10, border:"1px solid rgba(107,124,63,0.15)" }}>
                <div style={{ fontSize:11, color:"var(--olive)", marginBottom:2, fontWeight:600 }}>Try this</div>
                <div style={{ fontSize:13, color:"var(--text)", fontWeight:500, lineHeight:1.3 }}>{s.to}</div>
                <div style={{ fontSize:11, color:"var(--olive)", marginTop:3 }}>{s.toCal} kcal</div>
              </div>
            </div>
            <div style={{ padding:"8px 12px", background:"var(--muted)", borderRadius:8 }}>
              <div style={{ fontSize:12, color:"var(--text2)", lineHeight:1.4 }}>{s.why}</div>
            </div>
            <div style={{ marginTop:10 }}>
              <span className="badge badge-olive">{s.benefit}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Supplements({ user }) {
  const storageKey = `hb_supplements_${user.name}`;
  const logKey = `hb_supp_log_${todayKey()}`;

  const [supps, setSupps] = useState(() => {
    try { const s = localStorage.getItem(storageKey); return s ? JSON.parse(s) : []; } catch { return []; }
  });
  const [takenToday, setTakenToday] = useState(() => {
    try { const s = localStorage.getItem(logKey); return s ? JSON.parse(s) : {}; } catch { return {}; }
  });
  const [showAdd, setShowAdd] = useState(false);
  const [expand, setExpand] = useState(null);
  const [form, setForm] = useState({ name:"", dose:"", freq:"Once daily", timing:"Morning with food", category:"Vitamins", notes:"" });

  const saveSupps = (next) => { setSupps(next); localStorage.setItem(storageKey, JSON.stringify(next)); };
  const saveLog = (next) => { setTakenToday(next); localStorage.setItem(logKey, JSON.stringify(next)); };

  const toggleTaken = (id) => {
    const next = { ...takenToday, [id]: !takenToday[id] };
    saveLog(next);
  };

  const addSupp = () => {
    if (!form.name) return;
    const newSupp = { ...form, id: Date.now().toString(), color:"var(--olive)" };
    saveSupps([...supps, newSupp]);
    setShowAdd(false);
    setForm({ name:"", dose:"", freq:"Once daily", timing:"Morning with food", category:"Vitamins", notes:"" });
  };

  const removeSupp = (id) => {
    saveSupps(supps.filter(s => s.id !== id));
    const next = { ...takenToday }; delete next[id]; saveLog(next);
  };

  const takenCount = supps.filter(s => takenToday[s.id]).length;
  const catColors = { Vitamins:"var(--amber)", Minerals:"var(--burgundy)", "Essential Fatty Acids":"var(--olive)", Protein:"var(--stone)", Adaptogens:"var(--olive2)" };

  return (
    <div className="animate-in">
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
        <div>
          <h2 style={{ fontSize:24, fontWeight:700 }}>Supplements</h2>
          <p style={{ color:"var(--text3)", fontSize:14, marginTop:4 }}>Daily dosage & health tracking</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}><Plus size={14} /> Add Supplement</button>
      </div>

      {supps.length === 0 ? (
        <div className="card" style={{ padding:40, textAlign:"center", color:"var(--text3)", marginBottom:20 }}>
          <div style={{ fontSize:32, marginBottom:12 }}>💊</div>
          <p style={{ fontSize:15, marginBottom:8 }}>No supplements added yet.</p>
          <p style={{ fontSize:13 }}>Click "Add Supplement" to start tracking your daily doses.</p>
        </div>
      ) : (
        <>
          <div className="card" style={{ padding:20, marginBottom:24 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
              <p className="section-label" style={{ marginBottom:0 }}>Today's Progress</p>
              <span style={{ fontSize:13, fontWeight:600, color:"var(--olive)" }}>{takenCount}/{supps.length} taken</span>
            </div>
            <div className="progress-track" style={{ height:8, marginBottom:12 }}>
              <div className="progress-fill" style={{ width:`${pct(takenCount,supps.length)}%`, background:"linear-gradient(90deg,var(--olive),var(--olive2))" }} />
            </div>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {supps.map(s => (
                <span key={s.id} className="badge" style={{ background:takenToday[s.id]?"var(--olive-bg)":"var(--muted)", color:takenToday[s.id]?"var(--olive)":"var(--text3)", gap:5 }}>
                  {takenToday[s.id] && <Check size={10} />}{s.name}
                </span>
              ))}
            </div>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:14 }}>
            {supps.map(s => {
              const taken = !!takenToday[s.id];
              const color = catColors[s.category] || "var(--olive)";
              return (
                <div key={s.id} className="supp-card">
                  <div style={{ display:"flex", alignItems:"flex-start", gap:14 }}>
                    <div style={{ width:52, height:52, borderRadius:"50%", border:`3px solid ${taken?color:"var(--border2)"}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"border-color .3s", background:taken?`${color}18`:"transparent" }}>
                      {taken ? <Check size={20} color={color} /> : <Pill size={20} color="var(--text3)" />}
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                        <div>
                          <div style={{ fontSize:15, fontWeight:600, color:"var(--text)", fontFamily:"Playfair Display,serif" }}>{s.name}</div>
                          <div style={{ fontSize:12, color:"var(--text3)", marginTop:2 }}>{s.dose}</div>
                        </div>
                        <button onClick={() => removeSupp(s.id)} style={{ background:"none", border:"none", cursor:"pointer", color:"var(--text3)", padding:2 }}><X size={13} /></button>
                      </div>
                      <div style={{ display:"flex", gap:8, marginTop:8, flexWrap:"wrap" }}>
                        <span className="badge" style={{ background:`${color}18`, color }}>{s.category}</span>
                        <span className="badge badge-stone"><Clock size={9} /> {s.timing}</span>
                      </div>
                      <div style={{ marginTop:10, display:"flex", gap:8 }}>
                        <button className="btn btn-primary" style={{ padding:"6px 14px", fontSize:12 }} onClick={() => toggleTaken(s.id)}>
                          {taken ? <><Check size={11} /> Taken</> : "Log Dose"}
                        </button>
                        <button className="btn btn-ghost" style={{ padding:"6px 12px", fontSize:12 }} onClick={() => setExpand(expand===s.id?null:s.id)}>
                          {expand===s.id ? <ChevronUp size={12} /> : <ChevronDown size={12} />} Details
                        </button>
                      </div>
                      {expand===s.id && (
                        <div style={{ marginTop:12, padding:"10px 12px", background:"var(--muted)", borderRadius:8, borderLeft:"3px solid var(--olive)" }}>
                          <div style={{ fontSize:12, color:"var(--text2)", lineHeight:1.5, marginBottom:6 }}>{s.notes || "No notes added."}</div>
                          <div style={{ fontSize:11, color:"var(--text3)" }}><strong style={{ color:"var(--text2)" }}>Frequency:</strong> {s.freq} · <strong style={{ color:"var(--text2)" }}>Timing:</strong> {s.timing}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      <div style={{ marginTop:24, padding:"12px 16px", background:"var(--amber-bg)", border:"1px solid rgba(160,98,42,0.18)", borderRadius:12, display:"flex", gap:10, alignItems:"flex-start" }}>
        <AlertCircle size={15} color="var(--amber)" style={{ flexShrink:0, marginTop:1 }} />
        <p style={{ fontSize:12, color:"var(--amber)", lineHeight:1.5 }}>
          <strong>Disclaimer:</strong> For personal tracking only. Always consult a healthcare provider before starting any supplement regimen.
        </p>
      </div>

      {showAdd && (
        <div className="modal-backdrop" onClick={() => setShowAdd(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
              <h3 style={{ fontSize:18, fontWeight:700 }}>Add Supplement</h3>
              <button onClick={() => setShowAdd(false)} style={{ background:"none", border:"none", cursor:"pointer", color:"var(--text3)" }}><X size={18} /></button>
            </div>
            {[
              { label:"Supplement Name *", key:"name",   placeholder:"e.g. Vitamin D3" },
              { label:"Dose",              key:"dose",   placeholder:"e.g. 2000 IU" },
              { label:"When to take",      key:"timing", placeholder:"e.g. Morning with food" },
              { label:"Notes / Benefits",  key:"notes",  placeholder:"e.g. Bone health, immunity" },
            ].map(({ label, key, placeholder }) => (
              <div key={key} style={{ marginBottom:14 }}>
                <div style={{ fontSize:12, color:"var(--text2)", fontWeight:500, marginBottom:5 }}>{label}</div>
                <input type="text" value={form[key]} onChange={e => setForm(p => ({ ...p, [key]:e.target.value }))} placeholder={placeholder} style={{ paddingLeft:12 }} />
              </div>
            ))}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
              {[
                { label:"Frequency", key:"freq", opts:["Once daily","Twice daily","Three times daily","Weekly"] },
                { label:"Category",  key:"category", opts:["Vitamins","Minerals","Essential Fatty Acids","Protein","Adaptogens","Probiotics","Herbs","Other"] },
              ].map(({ label, key, opts }) => (
                <div key={key}>
                  <div style={{ fontSize:12, color:"var(--text2)", fontWeight:500, marginBottom:5 }}>{label}</div>
                  <select value={form[key]} onChange={e => setForm(p => ({ ...p, [key]:e.target.value }))}
                    style={{ width:"100%", padding:"9px 12px", background:"var(--bg2)", border:"1px solid var(--border2)", color:"var(--text)", borderRadius:10, fontFamily:"Outfit", fontSize:14, outline:"none" }}>
                    {opts.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}
            </div>
            <button className="btn btn-primary" style={{ width:"100%", justifyContent:"center", padding:11 }} onClick={addSupp}>Add Supplement</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("dashboard");
  const [dark, setDark] = useState(false);

  // ── User (real, from localStorage) ──
  const [user, setUser] = useState(() => {
    try { const s = localStorage.getItem('hb_user'); return s ? JSON.parse(s) : null; } catch { return null; }
  });

  // ── Targets computed from real user ──
  const targets = user ? computeTargets(user) : computeTargets({ weight:70, age:25, goal:'maintenance' });

  // ── Food log (today only, real) ──
  const [foodLog, setFoodLog] = useState(() => {
    try {
      const raw = localStorage.getItem(todayKey());
      if (raw) {
        const parsed = JSON.parse(raw);
        // Ensure all 4 meal slots exist
        return { Breakfast:[], Lunch:[], Dinner:[], Snacks:[], ...parsed };
      }
    } catch {}
    return { Breakfast:[], Lunch:[], Dinner:[], Snacks:[] };
  });

  // ── Hydration (today) ──
  const [waterCups, setWaterCups] = useState(() => {
    try { const s = localStorage.getItem('hb_water_' + todayKey()); return s ? Number(s) : 0; } catch { return 0; }
  });

  // ── Activity (today) ──
  const activityKey = `hb_activity_${new Date().toISOString().split('T')[0]}`;
  const [activity, setActivity] = useState(() => {
    try { const s = localStorage.getItem(activityKey); return s ? JSON.parse(s) : { sleep:0, steps:0, workout:0 }; } catch { return { sleep:0, steps:0, workout:0 }; }
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
  }, [dark]);

  const nav = [
    { id:"dashboard", icon:LayoutDashboard, label:"Dashboard" },
    { id:"foodlog",   icon:BookOpen,        label:"Food Log" },
    { id:"mealplan",  icon:Calendar,        label:"Meal Plan" },
    { id:"trends",    icon:TrendingUp,      label:"Trends" },
    { id:"goals",     icon:Target,          label:"Goals" },
    { id:"swaps",     icon:Repeat2,         label:"Swaps" },
    { id:"supps",     icon:Pill,            label:"Supplements" },
  ];

  const renderPage = () => {
    switch (page) {
      case "dashboard": return <Dashboard user={user} targets={targets} foodLog={foodLog} waterCups={waterCups} setWaterCups={setWaterCups} activity={activity} setActivity={setActivity} activityKey={activityKey} />;
      case "foodlog":   return <FoodLog targets={targets} foodLog={foodLog} setFoodLog={setFoodLog} />;
      case "mealplan":  return <MealPlan user={user} />;
      case "trends":    return <Trends targets={targets} />;
      case "goals":     return <Goals user={user} setUser={setUser} targets={targets} />;
      case "swaps":     return <Swaps />;
      case "supps":     return <Supplements user={user} />;
      default: return null;
    }
  };

  if (!user) {
    return <OnboardingModal onComplete={(userData) => {
      localStorage.setItem('hb_user', JSON.stringify(userData));
      setUser(userData);
    }} />;
  }

  return (
    <div data-theme={dark?"dark":"light"}>
      {/* Burrito watermark */}
      <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0,
        backgroundImage:`url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80'><text y='50' font-size='28' opacity='0.04'>🌯</text></svg>")`,
        backgroundRepeat:"repeat" }} />

      <div className="app-shell">
        <div className="sidebar">
          <div style={{ padding:"0 4px", marginBottom:32 }}>
            <div style={{ fontSize:20, fontWeight:700, color:"var(--olive)", fontFamily:"Playfair Display,serif" }}>healthyburritos</div>
            <div style={{ fontSize:11, color:"var(--text3)", marginTop:2 }}>Smart Nutrition Platform</div>
          </div>
          <nav style={{ flex:1 }}>
            {nav.map(({ id, icon:Icon, label }) => (
              <div key={id} className={`nav-item ${page===id?"active":""}`} onClick={() => setPage(id)}>
                <Icon size={16} /> {label}
              </div>
            ))}
          </nav>
          <div style={{ borderTop:"1px solid var(--border)", paddingTop:16, marginTop:16 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, padding:"0 4px", marginBottom:16 }}>
              <Sun size={14} color="var(--text3)" />
              <div className="theme-toggle" onClick={() => setDark(d => !d)}>
                <div className={`theme-toggle-thumb ${dark?"dark":""}`} />
              </div>
              <Moon size={14} color="var(--text3)" />
            </div>
            <div style={{ padding:"0 4px" }}>
              <div style={{ fontSize:12, color:"var(--text3)" }}>Signed in as</div>
              <div style={{ fontSize:13, color:"var(--text2)", fontWeight:500, marginTop:1 }}>{user.name}</div>
              <button onClick={() => {
                if (window.confirm("Reset profile and start over?")) {
                  localStorage.clear();
                  setUser(null);
                }
              }} style={{ background:"none", border:"none", cursor:"pointer", fontSize:11, color:"var(--text3)", marginTop:6, padding:0, textDecoration:"underline" }}>
                Reset profile
              </button>
            </div>
          </div>
        </div>

        <main className="main">{renderPage()}</main>

        <div className="bottom-nav">
          {nav.map(({ id, icon:Icon, label }) => (
            <div key={id} onClick={() => setPage(id)} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:3, cursor:"pointer", padding:"2px 8px" }}>
              <Icon size={19} color={page===id?"var(--olive)":"var(--text3)"} />
              <span style={{ fontSize:9, color:page===id?"var(--olive)":"var(--text3)", fontWeight:page===id?600:400 }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}