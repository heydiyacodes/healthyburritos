import { useState, useEffect, useCallback } from "react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, AreaChart, Area
} from "recharts";
import {
  LayoutDashboard, BookOpen, Calendar, TrendingUp, Target,
  Repeat2, Droplets, Moon, Footprints, Dumbbell, Flame,
  Plus, X, Check, ShoppingCart, Search, ArrowRight,
  Sun, Pill, Clock, AlertCircle, ChevronDown, ChevronUp, Info
} from "lucide-react";

// ─── FONTS + BASE STYLES ────────────────────────────────────────────────────
(() => {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Outfit:wght@300;400;500;600&display=swap";
  document.head.appendChild(link);

  const s = document.createElement("style");
  s.textContent = `
    :root {
      --bg: #f5f2ed;
      --bg2: #ede8e0;
      --bg3: #e4ddd2;
      --surface: #faf8f5;
      --surface2: #f0ebe2;
      --border: rgba(100,85,65,0.12);
      --border2: rgba(100,85,65,0.22);
      --text: #2c2418;
      --text2: #6b5e4e;
      --text3: #9c8c7a;
      --olive: #6b7c3f;
      --olive2: #8a9f52;
      --olive3: #b5c47a;
      --olive-bg: rgba(107,124,63,0.1);
      --burgundy: #7c2d3f;
      --burgundy2: #a03a50;
      --burgundy-bg: rgba(124,45,63,0.1);
      --amber: #a0622a;
      --amber2: #c47c3a;
      --amber-bg: rgba(160,98,42,0.1);
      --stone: #8c7b6a;
      --stone2: #b0a090;
      --muted: rgba(100,85,65,0.06);
      --shadow: 0 2px 16px rgba(44,36,24,0.07);
      --shadow2: 0 4px 24px rgba(44,36,24,0.1);
      --radius: 14px;
      --radius-sm: 8px;
    }
    [data-theme="dark"] {
      --bg: #1a1712;
      --bg2: #221f18;
      --bg3: #2a261e;
      --surface: #242019;
      --surface2: #2e2920;
      --border: rgba(200,180,150,0.1);
      --border2: rgba(200,180,150,0.2);
      --text: #e8e0d0;
      --text2: #b8a890;
      --text3: #7a6a58;
      --olive: #8fa852;
      --olive2: #a8c266;
      --olive3: #c8d890;
      --olive-bg: rgba(143,168,82,0.12);
      --burgundy: #c04060;
      --burgundy2: #d85070;
      --burgundy-bg: rgba(192,64,96,0.12);
      --amber: #c8843a;
      --amber2: #e09a4a;
      --amber-bg: rgba(200,132,58,0.12);
      --stone: #9a8878;
      --stone2: #7a6858;
      --muted: rgba(200,180,150,0.06);
      --shadow: 0 2px 16px rgba(0,0,0,0.3);
      --shadow2: 0 4px 24px rgba(0,0,0,0.4);
    }
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Outfit', sans-serif; background: var(--bg); color: var(--text); transition: background 0.3s, color 0.3s; }
    h1,h2,h3 { font-family: 'Playfair Display', serif; }

    /* BG Texture — translucent leaf shapes */
    .bg-texture { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
    .bg-texture svg { width: 100%; height: 100%; opacity: 0.035; }
    [data-theme="dark"] .bg-texture svg { opacity: 0.025; }

    .app-shell { position: relative; z-index: 1; display: flex; min-height: 100vh; }
    .card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); box-shadow: var(--shadow); }
    .card-sm { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-sm); }

    .sidebar { width: 228px; padding: 24px 14px; border-right: 1px solid var(--border); position: fixed; top: 0; left: 0; bottom: 0; display: flex; flex-direction: column; background: var(--surface); z-index: 10; }
    .nav-item { display: flex; align-items: center; gap: 11px; padding: 10px 13px; border-radius: 10px; cursor: pointer; color: var(--text2); font-size: 14px; font-weight: 400; transition: all 0.18s; border: 1px solid transparent; margin-bottom: 2px; }
    .nav-item:hover { background: var(--muted); color: var(--text); }
    .nav-item.active { background: var(--olive-bg); color: var(--olive); border-color: rgba(107,124,63,0.2); font-weight: 500; }
    [data-theme="dark"] .nav-item.active { border-color: rgba(143,168,82,0.2); }

    .main { flex: 1; margin-left: 228px; padding: 32px 32px; max-width: 100%; }

    .topbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }

    .metric-chip { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 16px; transition: box-shadow 0.2s, transform 0.2s; }
    .metric-chip:hover { box-shadow: var(--shadow2); transform: translateY(-1px); }

    .progress-track { height: 5px; border-radius: 99px; background: var(--border2); overflow: hidden; }
    .progress-fill { height: 100%; border-radius: 99px; transition: width 0.9s cubic-bezier(.4,0,.2,1); }

    .tab-pill { padding: 7px 16px; border-radius: 99px; cursor: pointer; font-size: 13px; font-weight: 400; transition: all 0.18s; border: 1px solid transparent; font-family: 'Outfit', sans-serif; color: var(--text2); background: transparent; }
    .tab-pill.active { background: var(--olive-bg); color: var(--olive); border-color: rgba(107,124,63,0.2); font-weight: 500; }
    .tab-pill:not(.active):hover { background: var(--muted); color: var(--text); }

    .btn { font-family: 'Outfit', sans-serif; cursor: pointer; border-radius: 10px; font-size: 13px; font-weight: 500; display: inline-flex; align-items: center; gap: 6px; transition: all 0.18s; border: none; padding: 9px 18px; }
    .btn-primary { background: var(--olive); color: #fff; }
    .btn-primary:hover { background: var(--olive2); }
    .btn-ghost { background: var(--muted); color: var(--text2); border: 1px solid var(--border2); }
    .btn-ghost:hover { background: var(--border); color: var(--text); }
    .btn-danger { background: var(--burgundy-bg); color: var(--burgundy); border: 1px solid rgba(124,45,63,0.2); }
    .btn-danger:hover { background: var(--burgundy2); color: white; }

    .badge { display: inline-flex; align-items: center; gap: 4px; padding: 3px 9px; border-radius: 99px; font-size: 11px; font-weight: 500; }
    .badge-olive { background: var(--olive-bg); color: var(--olive); }
    .badge-burgundy { background: var(--burgundy-bg); color: var(--burgundy); }
    .badge-amber { background: var(--amber-bg); color: var(--amber); }
    .badge-stone { background: var(--muted); color: var(--text2); }

    .food-row { padding: 10px 12px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; transition: background 0.15s; }
    .food-row:hover { background: var(--muted); }

    .modal-backdrop { position: fixed; inset: 0; background: rgba(20,16,10,0.6); display: flex; align-items: center; justify-content: center; z-index: 100; backdrop-filter: blur(6px); }
    .modal { background: var(--surface); border: 1px solid var(--border); border-radius: 18px; padding: 28px; max-width: 500px; width: 92%; max-height: 84vh; overflow-y: auto; }

    .swap-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 18px; transition: border-color 0.2s, transform 0.2s; }
    .swap-card:hover { border-color: var(--border2); transform: translateY(-1px); box-shadow: var(--shadow); }

    .goal-card { border: 1.5px solid var(--border); border-radius: var(--radius); padding: 20px; cursor: pointer; transition: all 0.2s; background: var(--surface); }
    .goal-card.selected { border-color: var(--olive); background: var(--olive-bg); }
    .goal-card:hover:not(.selected) { border-color: var(--border2); }

    .supp-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 18px; transition: all 0.2s; }
    .supp-card:hover { box-shadow: var(--shadow); }
    .dose-ring { transition: stroke-dasharray 0.8s ease; }

    .meal-cell { border-radius: 10px; padding: 10px 12px; cursor: pointer; border: 1px solid var(--border); background: var(--muted); min-height: 60px; transition: all 0.2s; }
    .meal-cell:hover { border-color: var(--olive); background: var(--olive-bg); }

    input[type="search"], input[type="text"] { background: var(--bg2); border: 1px solid var(--border2); color: var(--text); border-radius: 10px; padding: 9px 12px 9px 36px; font-family: 'Outfit', sans-serif; font-size: 14px; outline: none; width: 100%; transition: border-color 0.2s; }
    input:focus { border-color: var(--olive); }
    input::placeholder { color: var(--text3); }

    .theme-toggle { width: 40px; height: 22px; border-radius: 99px; border: 1.5px solid var(--border2); background: var(--muted); cursor: pointer; position: relative; transition: background 0.25s; display: flex; align-items: center; padding: 2px; }
    .theme-toggle-thumb { width: 16px; height: 16px; border-radius: 50%; background: var(--olive); transition: transform 0.25s; }
    .theme-toggle-thumb.dark { transform: translateX(18px); }

    .animate-in { animation: fadeUp 0.35s cubic-bezier(.4,0,.2,1) both; }
    @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

    .chart-tooltip { background: var(--surface) !important; border: 1px solid var(--border2) !important; border-radius: 10px !important; font-family: 'Outfit', sans-serif !important; color: var(--text) !important; font-size: 12px !important; }

    @media (max-width: 768px) {
      .sidebar { display: none !important; }
      .main { margin-left: 0; padding: 20px 16px 90px; }
      .bottom-nav { display: flex !important; }
    }
    .bottom-nav { display: none; position: fixed; bottom: 0; left: 0; right: 0; background: var(--surface); border-top: 1px solid var(--border); padding: 10px 0 18px; z-index: 50; justify-content: space-around; }

    .score-arc { filter: none; }
    .divider { height: 1px; background: var(--border); margin: 16px 0; }
    .section-label { font-size: 11px; font-weight: 500; color: var(--text3); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 12px; }
  `;
  document.head.appendChild(s);
})();

// ─── MOCK DATA ───────────────────────────────────────────────────────────────
const USER = {
  name: "Arjun Mehta", age: 31, height: 175, weight: 78,
  goalWeight: 72, startWeight: 83, goal: "Weight Loss",
  cal: 1900, protein: 140, carbs: 200, fat: 60, fiber: 30,
  water: 10, sleep: 8, steps: 8000,
};

const FOOD_DB = [
  { id: 1, name: "Oats (1 cup cooked)", cal: 154, protein: 5, carbs: 27, fat: 3, fiber: 4 },
  { id: 2, name: "Banana (medium)", cal: 105, protein: 1, carbs: 27, fat: 0, fiber: 3 },
  { id: 3, name: "Boiled Eggs (2)", cal: 156, protein: 12, carbs: 1, fat: 11, fiber: 0 },
  { id: 4, name: "Chicken Breast (150g)", cal: 248, protein: 47, carbs: 0, fat: 5, fiber: 0 },
  { id: 5, name: "Moong Dal (1 cup)", cal: 212, protein: 14, carbs: 37, fat: 1, fiber: 15 },
  { id: 6, name: "Brown Rice (1 cup)", cal: 216, protein: 5, carbs: 45, fat: 2, fiber: 4 },
  { id: 7, name: "Whole Wheat Roti (2)", cal: 210, protein: 7, carbs: 42, fat: 2, fiber: 6 },
  { id: 8, name: "Green Salad (large)", cal: 45, protein: 3, carbs: 8, fat: 0, fiber: 4 },
  { id: 9, name: "Whey Protein Shake", cal: 130, protein: 25, carbs: 5, fat: 2, fiber: 1 },
  { id: 10, name: "Low-fat Curd (200g)", cal: 118, protein: 10, carbs: 9, fat: 4, fiber: 0 },
  { id: 11, name: "Apple (medium)", cal: 95, protein: 0, carbs: 25, fat: 0, fiber: 4 },
  { id: 12, name: "Almonds (30g)", cal: 174, protein: 6, carbs: 6, fat: 15, fiber: 3 },
  { id: 13, name: "Toned Milk (250ml)", cal: 122, protein: 8, carbs: 12, fat: 4, fiber: 0 },
  { id: 14, name: "Paneer (100g)", cal: 265, protein: 18, carbs: 2, fat: 20, fiber: 0 },
  { id: 15, name: "Tofu (150g)", cal: 120, protein: 13, carbs: 3, fat: 6, fiber: 1 },
  { id: 16, name: "Sweet Potato (medium)", cal: 130, protein: 3, carbs: 30, fat: 0, fiber: 4 },
  { id: 17, name: "Broccoli (1 cup)", cal: 55, protein: 4, carbs: 11, fat: 1, fiber: 5 },
  { id: 18, name: "Orange (medium)", cal: 62, protein: 1, carbs: 15, fat: 0, fiber: 3 },
  { id: 19, name: "Whole Wheat Bread (2 slices)", cal: 138, protein: 6, carbs: 26, fat: 2, fiber: 4 },
  { id: 20, name: "Peanut Butter (2 tbsp)", cal: 188, protein: 8, carbs: 7, fat: 16, fiber: 2 },
];

const TODAY_LOG_INIT = {
  Breakfast: [{ ...FOOD_DB[0] }, { ...FOOD_DB[1] }, { ...FOOD_DB[2] }],
  Lunch: [{ ...FOOD_DB[3] }, { ...FOOD_DB[5] }, { ...FOOD_DB[7] }],
  Dinner: [{ ...FOOD_DB[4] }, { ...FOOD_DB[6] }],
  Snacks: [{ ...FOOD_DB[11] }, { ...FOOD_DB[10] }],
};

const WEEKLY = {
  days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  cal: [1840, 2050, 1780, 1920, 1990, 2200, 1750],
  calGoal: [1900, 1900, 1900, 1900, 1900, 1900, 1900],
  weight: [78.4, 78.2, 78.0, 77.9, 77.8, 78.1, 77.8],
  workout: [45, 0, 55, 30, 60, 45, 0],
  water: [9, 7, 10, 8, 9, 6, 10],
};

const MEAL_PLAN = {
  "Weight Loss": [
    { B: { name: "Oats + Banana", cal: 259 }, L: { name: "Chicken + Brown Rice + Salad", cal: 509 }, D: { name: "Dal + 2 Roti", cal: 422 }, S: { name: "Apple + Almonds", cal: 269 } },
    { B: { name: "Eggs + Wheat Toast", cal: 294 }, L: { name: "Tofu Stir Fry + Rice", cal: 336 }, D: { name: "Paneer Sabzi + Roti", cal: 475 }, S: { name: "Protein Shake", cal: 130 } },
    { B: { name: "Poha + Orange", cal: 262 }, L: { name: "Moong Dal + Brown Rice", cal: 428 }, D: { name: "Grilled Chicken + Broccoli", cal: 303 }, S: { name: "Curd + Almonds", cal: 292 } },
    { B: { name: "Smoothie Bowl", cal: 310 }, L: { name: "Roti + Sabzi + Dal", cal: 540 }, D: { name: "Tofu Salad Bowl", cal: 245 }, S: { name: "Sweet Potato", cal: 130 } },
    { B: { name: "Eggs + Avocado Toast", cal: 320 }, L: { name: "Chicken Bowl + Rice", cal: 520 }, D: { name: "Dal Tadka + Roti", cal: 317 }, S: { name: "Banana + PB", cal: 293 } },
    { B: { name: "Overnight Oats", cal: 285 }, L: { name: "Paneer Wrap", cal: 430 }, D: { name: "Grilled Fish + Salad", cal: 280 }, S: { name: "Protein Shake", cal: 130 } },
    { B: { name: "Upma + Boiled Egg", cal: 290 }, L: { name: "Rajma + Rice", cal: 480 }, D: { name: "Dal Soup + Roti", cal: 317 }, S: { name: "Fruits", cal: 157 } },
  ],
  "Muscle Gain": [
    { B: { name: "Oats + 3 Eggs + Milk", cal: 510 }, L: { name: "Chicken 200g + Rice", cal: 670 }, D: { name: "Paneer + Dal + 3 Roti", cal: 740 }, S: { name: "PB Protein Shake", cal: 318 } },
    { B: { name: "5 Eggs + Toast", cal: 510 }, L: { name: "Tuna + Brown Rice", cal: 580 }, D: { name: "Mutton + Roti", cal: 720 }, S: { name: "Almonds + Curd", cal: 292 } },
    { B: { name: "Banana Oat Pancakes", cal: 490 }, L: { name: "Chicken 200g + Rice", cal: 632 }, D: { name: "Paneer Bhurji + 3 Roti", cal: 640 }, S: { name: "Protein Bar", cal: 250 } },
    { B: { name: "Greek Yogurt + Granola", cal: 420 }, L: { name: "Rajma + Rice + Curd", cal: 680 }, D: { name: "Grilled Chicken + Sweet Potato", cal: 540 }, S: { name: "Mass Gainer Shake", cal: 400 } },
    { B: { name: "3 Eggs + Avocado Toast", cal: 470 }, L: { name: "Paneer + Brown Rice + Dal", cal: 700 }, D: { name: "Fish Curry + 2 Roti", cal: 560 }, S: { name: "Milk + Almonds", cal: 296 } },
    { B: { name: "Egg White Omelette", cal: 380 }, L: { name: "Chicken + Pasta Bowl", cal: 720 }, D: { name: "Tofu Steak + Rice", cal: 540 }, S: { name: "Protein Shake", cal: 130 } },
    { B: { name: "Dalia + Boiled Eggs", cal: 430 }, L: { name: "Chole + Rice + Raita", cal: 690 }, D: { name: "Egg Curry + 3 Roti", cal: 610 }, S: { name: "PB Toast", cal: 326 } },
  ],
  "Maintenance": [
    { B: { name: "Upma + Curd", cal: 318 }, L: { name: "Dal + Rice + Salad", cal: 473 }, D: { name: "Paneer Sabzi + 2 Roti", cal: 475 }, S: { name: "Tea + Fruit", cal: 180 } },
    { B: { name: "Poha + Boiled Egg", cal: 296 }, L: { name: "Chicken + Roti + Salad", cal: 563 }, D: { name: "Moong Dal + Rice", cal: 428 }, S: { name: "Fruit Bowl", cal: 157 } },
    { B: { name: "Bread + PB + Banana", cal: 431 }, L: { name: "Chole + Rice + Raita", cal: 510 }, D: { name: "Tofu Stir Fry + Roti", cal: 450 }, S: { name: "Almonds + Milk", cal: 296 } },
    { B: { name: "Dalia + Milk", cal: 310 }, L: { name: "Rajma + 2 Roti", cal: 527 }, D: { name: "Chicken Soup + Bread", cal: 370 }, S: { name: "Apple + Curd", cal: 213 } },
    { B: { name: "Oats + Fruits", cal: 286 }, L: { name: "Paneer + Brown Rice", cal: 611 }, D: { name: "Dal Fry + 2 Roti", cal: 422 }, S: { name: "Protein Shake", cal: 130 } },
    { B: { name: "Idli + Sambar", cal: 285 }, L: { name: "Mixed Veg + Rice + Dal", cal: 480 }, D: { name: "Grilled Chicken + Salad", cal: 303 }, S: { name: "Banana + PB", cal: 293 } },
    { B: { name: "Eggs + Toast", cal: 356 }, L: { name: "Tofu + Brown Rice Bowl", cal: 396 }, D: { name: "Dal Makhani + 2 Roti", cal: 502 }, S: { name: "Almonds + Dates", cal: 220 } },
  ],
};

const SMART_SWAPS = [
  { cat: "Drinks", from: "Soda / Cold Drink (330ml)", to: "Sparkling Water + Lemon", fromCal: 140, toCal: 5, benefit: "Save 135 cal, zero sugar", why: "Eliminates 35g sugar with the same fizzy sensation", diff: "Easy" },
  { cat: "Drinks", from: "Packaged Juice (250ml)", to: "Whole Fruit (1 Orange)", fromCal: 110, toCal: 62, benefit: "+4g fiber, −48 cal", why: "Fiber slows sugar absorption significantly", diff: "Easy" },
  { cat: "Drinks", from: "Full-fat Coffee (large)", to: "Toned Milk Black Coffee", fromCal: 220, toCal: 95, benefit: "Save 125 cal", why: "Full flavour, fraction of the fat", diff: "Easy" },
  { cat: "Snacks", from: "Potato Chips (30g)", to: "Roasted Chickpeas (30g)", fromCal: 155, toCal: 120, benefit: "+5g protein, +4g fiber", why: "More satiating, less inflammatory fat", diff: "Easy" },
  { cat: "Snacks", from: "White Bread Toast + Butter", to: "Whole Wheat Toast + Avocado", fromCal: 210, toCal: 180, benefit: "+5g fiber, healthy fats", why: "Mono-unsaturated fats support heart health", diff: "Easy" },
  { cat: "Snacks", from: "Biscuits / Cookies (3 pcs)", to: "Apple + 10 Almonds", fromCal: 195, toCal: 174, benefit: "+7g fiber, no refined sugar", why: "Sustains energy without blood sugar spike", diff: "Easy" },
  { cat: "Meals", from: "White Rice (1 cup)", to: "Brown Rice or Cauliflower Rice", fromCal: 206, toCal: 152, benefit: "+3g fiber, lower GI", why: "Slower digestion, better blood sugar control", diff: "Moderate" },
  { cat: "Meals", from: "Maida Naan / White Roti", to: "Whole Wheat or Multigrain Roti", fromCal: 180, toCal: 130, benefit: "+4g fiber", why: "Refined flour spikes insulin; whole grain does not", diff: "Easy" },
  { cat: "Meals", from: "Fried Chicken (150g)", to: "Grilled / Baked Chicken", fromCal: 380, toCal: 248, benefit: "Save 132 cal, less sat fat", why: "Same protein, dramatically less unhealthy fat", diff: "Moderate" },
  { cat: "Meals", from: "Instant Noodles (1 pack)", to: "Oats Upma or Dalia", fromCal: 350, toCal: 220, benefit: "Save 130 cal, +6g fiber", why: "Instant noodles are ultra-processed with minimal nutrients", diff: "Moderate" },
  { cat: "Condiments", from: "Mayonnaise (2 tbsp)", to: "Hung Curd / Greek Yogurt Dip", fromCal: 188, toCal: 30, benefit: "Save 158 cal, +5g protein", why: "Creamy texture without the saturated fat load", diff: "Easy" },
  { cat: "Condiments", from: "Store-bought Ketchup (2 tbsp)", to: "Homemade Tomato Chutney", fromCal: 40, toCal: 15, benefit: "No added sugar / preservatives", why: "Ketchup has hidden sugar; fresh chutney does not", diff: "Moderate" },
];

const SUPPLEMENTS_INIT = [
  { id: 1, name: "Vitamin D3", dose: "2000 IU", unit: "capsule", freq: "Once daily", timing: "Morning with food", color: "var(--amber)", taken: true, notes: "Supports bone health & immunity", category: "Vitamins", dosesTaken: 1, dosesTotal: 1 },
  { id: 2, name: "Omega-3 Fish Oil", dose: "1000 mg", unit: "capsule", freq: "Twice daily", timing: "Morning & Evening", color: "var(--olive)", taken: false, notes: "Heart & brain health, reduces inflammation", category: "Essential Fatty Acids", dosesTaken: 1, dosesTotal: 2 },
  { id: 3, name: "Magnesium Glycinate", dose: "400 mg", unit: "tablet", freq: "Once daily", timing: "Before bedtime", color: "var(--burgundy)", taken: false, notes: "Improves sleep quality & muscle recovery", category: "Minerals", dosesTaken: 0, dosesTotal: 1 },
  { id: 4, name: "Whey Protein", dose: "30 g", unit: "scoop", freq: "Once daily", timing: "Post workout", color: "var(--stone)", taken: true, notes: "Muscle protein synthesis support", category: "Protein", dosesTaken: 1, dosesTotal: 1 },
  { id: 5, name: "Ashwagandha", dose: "600 mg", unit: "capsule", freq: "Once daily", timing: "Evening with milk", color: "var(--olive2)", taken: false, notes: "Adaptogen for stress and cortisol", category: "Adaptogens", dosesTaken: 0, dosesTotal: 1 },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const sum = (arr, k) => arr.reduce((a, b) => a + (b[k] || 0), 0);
const pct = (v, m) => Math.min(100, Math.round((v / m) * 100));
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

function totals(log) {
  const all = Object.values(log).flat();
  return { cal: sum(all, "cal"), protein: sum(all, "protein"), carbs: sum(all, "carbs"), fat: sum(all, "fat"), fiber: sum(all, "fiber") };
}

function dietScore(t) {
  const ps = clamp(Math.round((t.protein / USER.protein) * 100), 0, 100);
  const fs = clamp(Math.round((t.fiber / USER.fiber) * 100), 0, 100);
  const ss = clamp(100 - Math.round(((t.carbs * 0.3) / 50) * 100), 0, 100);
  const pr = 74;
  return { overall: Math.round(ps * 0.3 + fs * 0.25 + ss * 0.25 + pr * 0.2), ps, fs, ss, pr };
}

// ─── SVG BACKGROUND TEXTURE ─────────────────────────────────────────────────
function BgTexture() {
  // botanical / organic shapes — leaves and circles
  return (
    <div className="bg-texture">
      <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* large leaf shapes */}
        <ellipse cx="120" cy="180" rx="90" ry="200" transform="rotate(-30 120 180)" stroke="#6b7c3f" strokeWidth="1.5" />
        <ellipse cx="140" cy="180" rx="50" ry="160" transform="rotate(-30 140 180)" stroke="#6b7c3f" strokeWidth="1" />
        <line x1="120" y1="30" x2="120" y2="330" stroke="#6b7c3f" strokeWidth="1" transform="rotate(-30 120 180)" />

        <ellipse cx="1320" cy="280" rx="80" ry="180" transform="rotate(20 1320 280)" stroke="#7c2d3f" strokeWidth="1.5" />
        <ellipse cx="1340" cy="280" rx="44" ry="140" transform="rotate(20 1340 280)" stroke="#7c2d3f" strokeWidth="1" />

        <ellipse cx="700" cy="820" rx="110" ry="240" transform="rotate(5 700 820)" stroke="#a0622a" strokeWidth="1.5" />
        <ellipse cx="720" cy="820" rx="60" ry="190" transform="rotate(5 720 820)" stroke="#a0622a" strokeWidth="1" />
        <line x1="700" y1="590" x2="700" y2="900" stroke="#a0622a" strokeWidth="1" transform="rotate(5 700 820)" />

        <ellipse cx="1100" cy="700" rx="70" ry="160" transform="rotate(-15 1100 700)" stroke="#6b7c3f" strokeWidth="1.2" />
        <ellipse cx="200" cy="680" rx="60" ry="130" transform="rotate(25 200 680)" stroke="#7c2d3f" strokeWidth="1.2" />
        <ellipse cx="900" cy="120" rx="55" ry="120" transform="rotate(-10 900 120)" stroke="#a0622a" strokeWidth="1.2" />

        {/* small decorative circles */}
        <circle cx="400" cy="400" r="180" stroke="#6b7c3f" strokeWidth="0.8" />
        <circle cx="400" cy="400" r="120" stroke="#6b7c3f" strokeWidth="0.5" />
        <circle cx="1050" cy="450" r="130" stroke="#7c2d3f" strokeWidth="0.8" />
        <circle cx="250" cy="500" r="80" stroke="#a0622a" strokeWidth="0.8" />
      </svg>
    </div>
  );
}

// ─── REUSABLE UI ─────────────────────────────────────────────────────────────
function MacroBar({ label, value, max, color }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
        <span style={{ fontSize: 13, color: "var(--text2)" }}>{label}</span>
        <span style={{ fontSize: 13, color: "var(--text)", fontWeight: 500 }}>{value}g <span style={{ color: "var(--text3)", fontWeight: 400 }}>/ {max}g</span></span>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${pct(value, max)}%`, background: color }} />
      </div>
    </div>
  );
}

function ScoreGauge({ score }) {
  const r = 48, cx = 60, cy = 60;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color = score >= 75 ? "var(--olive)" : score >= 50 ? "var(--amber)" : "var(--burgundy)";
  const label = score >= 75 ? "Excellent" : score >= 50 ? "Moderate" : "Needs Work";
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <svg width="120" height="120" viewBox="0 0 120 120" className="score-arc">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--border2)" strokeWidth="9" />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="9"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          transform={`rotate(-90 ${cx} ${cy})`} className="dose-ring" />
        <text x={cx} y={cy - 4} textAnchor="middle" fill="var(--text)" fontSize="22" fontWeight="600" fontFamily="Playfair Display,serif">{score}</text>
        <text x={cx} y={cy + 14} textAnchor="middle" fill="var(--text3)" fontSize="11" fontFamily="Outfit,sans-serif">/ 100</text>
      </svg>
      <span style={{ fontSize: 12, fontWeight: 500, color }}>{label}</span>
    </div>
  );
}

function StatChip({ icon: Icon, label, value, color }) {
  return (
    <div className="metric-chip" style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ width: 38, height: 38, borderRadius: 10, background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon size={17} color={color} />
      </div>
      <div>
        <div style={{ fontSize: 11, color: "var(--text3)", fontWeight: 500, marginBottom: 2 }}>{label}</div>
        <div style={{ fontSize: 16, fontWeight: 600, color: "var(--text)" }}>{value}</div>
      </div>
    </div>
  );
}

// ─── PAGES ───────────────────────────────────────────────────────────────────

function Dashboard({ foodLog, waterCups, setWaterCups }) {
  const t = totals(foodLog);
  const sc = dietScore(t);
  const calPct = pct(t.cal, USER.cal);

  const swapHints = [
    { from: "White rice (Lunch)", to: "Brown rice", gain: "+4g fiber" },
    { from: "Low water intake today", to: "Add 3 more cups", gain: "Stay hydrated" },
    { from: "No evening workout logged", to: "20-min walk", gain: "−150 cal" },
  ];

  const chartData = WEEKLY.days.map((d, i) => ({ d, cal: WEEKLY.cal[i], goal: WEEKLY.calGoal[i] }));

  return (
    <div className="animate-in">
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "var(--text)", lineHeight: 1.2 }}>Good morning, {USER.name.split(" ")[0]}</h1>
        <p style={{ color: "var(--text3)", fontSize: 14, marginTop: 5 }}>Friday, April 10 · Here's your daily snapshot</p>
      </div>

      {/* Stat row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(155px,1fr))", gap: 12, marginBottom: 24 }}>
        <StatChip icon={Flame} label="Calories Today" value={`${t.cal} kcal`} color="var(--burgundy)" />
        <StatChip icon={Droplets} label="Hydration" value={`${waterCups}/${USER.water} cups`} color="var(--olive)" />
        <StatChip icon={Moon} label="Sleep" value="7.2 hrs" color="var(--stone)" />
        <StatChip icon={Footprints} label="Steps" value="6,840" color="var(--amber)" />
        <StatChip icon={Dumbbell} label="Workout" value="45 min" color="var(--olive2)" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
        {/* Calorie ring */}
        <div className="card" style={{ padding: 22 }}>
          <p className="section-label">Calorie Goal</p>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ position: "relative", flexShrink: 0 }}>
              <svg width="88" height="88" viewBox="0 0 88 88">
                <circle cx="44" cy="44" r="36" fill="none" stroke="var(--border2)" strokeWidth="8" />
                <circle cx="44" cy="44" r="36" fill="none" stroke="var(--burgundy)" strokeWidth="8"
                  strokeDasharray={`${(calPct / 100) * 2 * Math.PI * 36} ${2 * Math.PI * 36}`}
                  strokeLinecap="round" transform="rotate(-90 44 44)" className="dose-ring" />
                <text x="44" y="48" textAnchor="middle" fill="var(--text)" fontSize="15" fontWeight="600" fontFamily="Playfair Display,serif">{calPct}%</text>
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 26, fontWeight: 700, color: "var(--text)", fontFamily: "Playfair Display,serif" }}>{t.cal}</div>
              <div style={{ fontSize: 12, color: "var(--text3)", marginBottom: 6 }}>of {USER.cal} kcal goal</div>
              <span className="badge badge-olive">{USER.cal - t.cal} kcal remaining</span>
            </div>
          </div>
        </div>

        {/* Diet Score */}
        <div className="card" style={{ padding: 22 }}>
          <p className="section-label">Diet Quality Score</p>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <ScoreGauge score={sc.overall} />
            <div style={{ flex: 1 }}>
              {[["Protein", sc.ps, "var(--olive)"], ["Fiber", sc.fs, "var(--amber)"], ["Sugar Load", sc.ss, "var(--burgundy)"], ["Processing", sc.pr, "var(--stone)"]].map(([l, v, c]) => (
                <div key={l} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
                  <span style={{ fontSize: 12, color: "var(--text2)" }}>{l}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: v >= 75 ? "var(--olive)" : v >= 50 ? "var(--amber)" : "var(--burgundy)" }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Macros */}
      <div className="card" style={{ padding: 22, marginBottom: 20 }}>
        <p className="section-label">Macronutrients</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 32px" }}>
          <MacroBar label="Protein" value={t.protein} max={USER.protein} color="var(--olive)" />
          <MacroBar label="Carbohydrates" value={t.carbs} max={USER.carbs} color="var(--amber)" />
          <MacroBar label="Fat" value={t.fat} max={USER.fat} color="var(--burgundy)" />
          <MacroBar label="Fiber" value={t.fiber} max={USER.fiber} color="var(--stone)" />
        </div>
      </div>

      {/* Hydration */}
      <div className="card" style={{ padding: 22, marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <p className="section-label" style={{ marginBottom: 0 }}>Hydration Tracker</p>
          <span style={{ fontSize: 13, color: "var(--olive)", fontWeight: 600 }}>{waterCups}/{USER.water} cups</span>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
          {Array.from({ length: USER.water }).map((_, i) => (
            <div key={i} onClick={() => setWaterCups(i < waterCups ? i : i + 1)}
              style={{ width: 34, height: 34, borderRadius: 8, border: `1.5px solid ${i < waterCups ? "var(--olive)" : "var(--border2)"}`, background: i < waterCups ? "var(--olive-bg)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.15s" }}>
              <Droplets size={13} color={i < waterCups ? "var(--olive)" : "var(--text3)"} />
            </div>
          ))}
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${pct(waterCups, USER.water)}%`, background: "var(--olive)" }} />
        </div>
      </div>

      {/* 7-day calorie preview */}
      <div className="card" style={{ padding: 22, marginBottom: 20 }}>
        <p className="section-label">This Week — Calories</p>
        <ResponsiveContainer width="100%" height={130}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="calGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--olive)" stopOpacity={0.18} />
                <stop offset="95%" stopColor="var(--olive)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="d" tick={{ fill: "var(--text3)", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis hide domain={[1500, 2400]} />
            <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border2)", borderRadius: 10, fontFamily: "Outfit", fontSize: 12 }} />
            <Area type="monotone" dataKey="cal" stroke="var(--olive)" strokeWidth={2} fill="url(#calGrad)" name="Eaten" />
            <Line type="monotone" dataKey="goal" stroke="var(--burgundy)" strokeWidth={1.5} strokeDasharray="5 4" dot={false} name="Goal" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Smart swaps */}
      <p style={{ fontSize: 15, fontWeight: 600, color: "var(--text)", marginBottom: 12, fontFamily: "Playfair Display,serif" }}>Today's Swap Suggestions</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px,1fr))", gap: 12 }}>
        {swapHints.map((s, i) => (
          <div key={i} className="card" style={{ padding: "14px 16px" }}>
            <div style={{ fontSize: 12, color: "var(--text3)", marginBottom: 6 }}>{s.from}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <ArrowRight size={13} color="var(--olive)" />
              <span style={{ fontSize: 14, fontWeight: 500, color: "var(--text)" }}>{s.to}</span>
            </div>
            <span className="badge badge-olive">{s.gain}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FoodLog({ foodLog, setFoodLog }) {
  const [meal, setMeal] = useState("Breakfast");
  const [showAdd, setShowAdd] = useState(false);
  const [q, setQ] = useState("");
  const meals = ["Breakfast", "Lunch", "Dinner", "Snacks"];
  const t = totals(foodLog);
  const filtered = FOOD_DB.filter(f => f.name.toLowerCase().includes(q.toLowerCase()));

  const addFood = f => {
    setFoodLog(p => ({ ...p, [meal]: [...p[meal], { ...f }] }));
    setShowAdd(false); setQ("");
  };
  const removeFood = (m, i) => setFoodLog(p => ({ ...p, [m]: p[m].filter((_, j) => j !== i) }));
  const mT = items => ({ cal: sum(items, "cal"), p: sum(items, "protein"), c: sum(items, "carbs"), f: sum(items, "fat") });

  return (
    <div className="animate-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700 }}>Food Log</h2>
        <span style={{ fontSize: 13, color: "var(--text3)" }}>Friday, Apr 10</span>
      </div>

      {/* Daily totals bar */}
      <div className="card" style={{ padding: "14px 20px", marginBottom: 20, display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 8, textAlign: "center" }}>
        {[
          { l: "Calories", v: t.cal, u: "kcal", c: "var(--burgundy)", max: USER.cal },
          { l: "Protein", v: t.protein, u: "g", c: "var(--olive)", max: USER.protein },
          { l: "Carbs", v: t.carbs, u: "g", c: "var(--amber)", max: USER.carbs },
          { l: "Fat", v: t.fat, u: "g", c: "var(--stone)", max: USER.fat },
          { l: "Fiber", v: t.fiber, u: "g", c: "var(--olive2)", max: USER.fiber },
        ].map(m => (
          <div key={m.l}>
            <div style={{ fontSize: 11, color: "var(--text3)", marginBottom: 3 }}>{m.l}</div>
            <div style={{ fontSize: 17, fontWeight: 700, color: m.c, fontFamily: "Playfair Display,serif" }}>{m.v}<span style={{ fontSize: 10, color: "var(--text3)", fontFamily: "Outfit" }}>{m.u}</span></div>
            <div style={{ fontSize: 10, color: "var(--text3)" }}>/{m.max}</div>
            <div className="progress-track" style={{ marginTop: 5 }}>
              <div className="progress-fill" style={{ width: `${pct(m.v, m.max)}%`, background: m.c }} />
            </div>
          </div>
        ))}
      </div>

      {/* Meal tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {meals.map(m => <button key={m} className={`tab-pill ${meal === m ? "active" : ""}`} onClick={() => setMeal(m)}>{m}</button>)}
      </div>

      {/* Items */}
      <div className="card" style={{ padding: "8px 4px", marginBottom: 16 }}>
        <div style={{ padding: "0 12px 10px", display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border)", marginBottom: 4 }}>
          <span style={{ fontSize: 11, color: "var(--text3)", fontWeight: 500 }}>FOOD</span>
          <div style={{ display: "flex", gap: 22, fontSize: 11, color: "var(--text3)", fontWeight: 500 }}>
            <span>CAL</span><span>PRO</span><span>CARBS</span><span>FAT</span>
          </div>
        </div>
        {foodLog[meal].length === 0 && (
          <div style={{ textAlign: "center", padding: "28px 0", color: "var(--text3)", fontSize: 14 }}>Nothing logged yet for {meal}</div>
        )}
        {foodLog[meal].map((f, i) => (
          <div key={i} className="food-row">
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, color: "var(--text)", fontWeight: 500 }}>{f.name}</div>
              <div style={{ fontSize: 12, color: "var(--text3)" }}>1 serving</div>
            </div>
            <div style={{ display: "flex", gap: 20, fontSize: 13, fontWeight: 600, alignItems: "center" }}>
              <span style={{ color: "var(--burgundy)", minWidth: 36, textAlign: "right" }}>{f.cal}</span>
              <span style={{ color: "var(--olive)", minWidth: 28, textAlign: "right" }}>{f.protein}g</span>
              <span style={{ color: "var(--amber)", minWidth: 36, textAlign: "right" }}>{f.carbs}g</span>
              <span style={{ color: "var(--stone)", minWidth: 28, textAlign: "right" }}>{f.fat}g</span>
              <button onClick={() => removeFood(meal, i)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text3)", marginLeft: 4, padding: 2 }}><X size={13} /></button>
            </div>
          </div>
        ))}
        {foodLog[meal].length > 0 && (() => {
          const mt = mT(foodLog[meal]);
          return (
            <div style={{ padding: "10px 12px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", marginTop: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text3)" }}>MEAL TOTAL</span>
              <div style={{ display: "flex", gap: 20, fontSize: 12, fontWeight: 700 }}>
                <span style={{ color: "var(--burgundy)", minWidth: 36, textAlign: "right" }}>{mt.cal}</span>
                <span style={{ color: "var(--olive)", minWidth: 28, textAlign: "right" }}>{mt.p}g</span>
                <span style={{ color: "var(--amber)", minWidth: 36, textAlign: "right" }}>{mt.c}g</span>
                <span style={{ color: "var(--stone)", minWidth: 28, textAlign: "right" }}>{mt.f}g</span>
                <span style={{ minWidth: 20 }} />
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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700 }}>Add to {meal}</h3>
              <button onClick={() => setShowAdd(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text3)" }}><X size={18} /></button>
            </div>
            <div style={{ position: "relative", marginBottom: 16 }}>
              <Search size={13} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "var(--text3)" }} />
              <input type="search" value={q} onChange={e => setQ(e.target.value)} placeholder="Search foods…" />
            </div>
            <div style={{ maxHeight: 320, overflowY: "auto" }}>
              {filtered.slice(0, 12).map(f => (
                <div key={f.id} className="food-row" style={{ cursor: "pointer" }} onClick={() => addFood(f)}>
                  <div>
                    <div style={{ fontSize: 14, color: "var(--text)", fontWeight: 500 }}>{f.name}</div>
                    <div style={{ fontSize: 12, color: "var(--text3)" }}>{f.cal} kcal · P:{f.protein}g C:{f.carbs}g F:{f.fat}g</div>
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

function MealPlan({ goal }) {
  const plan = MEAL_PLAN[goal] || MEAL_PLAN["Weight Loss"];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const mKeys = { B: "Breakfast", L: "Lunch", D: "Dinner", S: "Snack" };
  const [selected, setSelected] = useState(null);
  const [showShop, setShowShop] = useState(false);

  const groceries = {
    Proteins: ["Chicken breast", "Eggs", "Paneer / Tofu", "Whey protein", "Moong dal", "Rajma"],
    Grains: ["Brown rice", "Oats", "Whole wheat flour", "Multigrain bread", "Dalia"],
    Produce: ["Banana", "Apple", "Orange", "Broccoli", "Sweet potato", "Tomatoes", "Spinach", "Lemon"],
    Dairy: ["Toned milk", "Low-fat curd", "Buttermilk"],
    Pantry: ["Almonds", "Peanut butter", "Olive oil", "Cumin", "Turmeric", "Ginger"],
  };

  return (
    <div className="animate-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700 }}>Meal Plan</h2>
        <button className="btn btn-ghost" onClick={() => setShowShop(true)}><ShoppingCart size={14} /> Shopping List</button>
      </div>
      <div style={{ marginBottom: 20 }}>
        <span className="badge badge-olive">Goal: {goal}</span>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 4px" }}>
          <thead>
            <tr>
              <th style={{ fontSize: 11, color: "var(--text3)", textAlign: "left", padding: "0 12px 10px", fontWeight: 500 }}>MEAL</th>
              {days.map(d => <th key={d} style={{ fontSize: 11, color: "var(--text3)", padding: "0 6px 10px", fontWeight: 500, textAlign: "center", minWidth: 118 }}>{d}</th>)}
            </tr>
          </thead>
          <tbody>
            {Object.entries(mKeys).map(([k, label]) => (
              <tr key={k}>
                <td style={{ padding: "4px 12px", fontSize: 12, fontWeight: 500, color: "var(--text2)", whiteSpace: "nowrap" }}>{label}</td>
                {plan.map((day, di) => (
                  <td key={di} style={{ padding: "4px 6px" }}>
                    <div className="meal-cell" onClick={() => setSelected({ di, k, data: day[k] })}>
                      <div style={{ fontSize: 12, color: "var(--text)", fontWeight: 500, lineHeight: 1.3 }}>{day[k]?.name}</div>
                      <div style={{ fontSize: 11, color: "var(--olive)", marginTop: 4, fontWeight: 600 }}>{day[k]?.cal} kcal</div>
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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700 }}>{mKeys[selected.k]} · {days[selected.di]}</h3>
              <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text3)" }}><X size={18} /></button>
            </div>
            <div className="card" style={{ padding: "14px 16px", marginBottom: 14 }}>
              <div style={{ fontSize: 17, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>{selected.data?.name}</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: "var(--olive)", fontFamily: "Playfair Display,serif" }}>{selected.data?.cal} <span style={{ fontSize: 13, color: "var(--text3)", fontFamily: "Outfit", fontWeight: 400 }}>kcal</span></div>
            </div>
            <p style={{ fontSize: 13, color: "var(--text3)" }}>Tap any meal cell to review details. Full ingredient breakdown can be expanded in future updates.</p>
          </div>
        </div>
      )}

      {showShop && (
        <div className="modal-backdrop" onClick={() => setShowShop(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700 }}>Weekly Shopping List</h3>
              <button onClick={() => setShowShop(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text3)" }}><X size={18} /></button>
            </div>
            {Object.entries(groceries).map(([cat, items]) => (
              <div key={cat} style={{ marginBottom: 16 }}>
                <div className="section-label">{cat}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {items.map(item => (
                    <span key={item} className="badge badge-stone">{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Trends() {
  const data = WEEKLY.days.map((d, i) => ({
    d, cal: WEEKLY.cal[i], goal: WEEKLY.calGoal[i],
    weight: WEEKLY.weight[i], workout: WEEKLY.workout[i], water: WEEKLY.water[i],
  }));

  const ttStyle = { background: "var(--surface)", border: "1px solid var(--border2)", borderRadius: 10, fontFamily: "Outfit", fontSize: 12, color: "var(--text)" };

  const insights = [
    { icon: "🎯", text: "Hit calorie goal 5/7 days this week" },
    { icon: "💪", text: "Average protein 98g/day — 12g below target" },
    { icon: "🔥", text: "Best streak: 4 consecutive workout days" },
    { icon: "💧", text: "Average water intake 8.4 cups — on track" },
  ];

  return (
    <div className="animate-in">
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>Weekly Trends</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>

        <div className="card" style={{ padding: 20 }}>
          <p className="section-label">Calorie Intake vs Goal</p>
          <ResponsiveContainer width="100%" height={155}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="d" tick={{ fill: "var(--text3)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "var(--text3)", fontSize: 11 }} axisLine={false} tickLine={false} domain={[1600, 2400]} />
              <Tooltip contentStyle={ttStyle} />
              <Line type="monotone" dataKey="cal" stroke="var(--burgundy)" strokeWidth={2.5} dot={{ fill: "var(--burgundy)", r: 3 }} name="Eaten" />
              <Line type="monotone" dataKey="goal" stroke="var(--olive)" strokeWidth={1.8} strokeDasharray="5 4" dot={false} name="Goal" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card" style={{ padding: 20 }}>
          <p className="section-label">Weight Tracking (kg)</p>
          <ResponsiveContainer width="100%" height={155}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="d" tick={{ fill: "var(--text3)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "var(--text3)", fontSize: 11 }} axisLine={false} tickLine={false} domain={[77, 79]} />
              <Tooltip contentStyle={ttStyle} />
              <Line type="monotone" dataKey="weight" stroke="var(--amber)" strokeWidth={2.5} dot={{ fill: "var(--amber)", r: 3 }} name="Weight (kg)" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card" style={{ padding: 20 }}>
          <p className="section-label">Workout Minutes</p>
          <ResponsiveContainer width="100%" height={155}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="d" tick={{ fill: "var(--text3)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "var(--text3)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={ttStyle} />
              <Bar dataKey="workout" fill="var(--olive)" radius={[6, 6, 0, 0]} name="Minutes" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card" style={{ padding: 20 }}>
          <p className="section-label">Water Intake (cups/day)</p>
          <ResponsiveContainer width="100%" height={155}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="d" tick={{ fill: "var(--text3)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "var(--text3)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={ttStyle} />
              <Bar dataKey="water" fill="var(--stone)" radius={[6, 6, 0, 0]} name="Cups" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px,1fr))", gap: 12 }}>
        {insights.map((ins, i) => (
          <div key={i} className="card" style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 20 }}>{ins.icon}</span>
            <span style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.4 }}>{ins.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Goals({ goal, setGoal }) {
  const goalDefs = [
    { id: "Weight Loss", icon: "◎", sub: "−0.5 kg/week", desc: "Calorie deficit of ~400 kcal/day", cal: 1900, p: 140, c: 185, f: 58 },
    { id: "Muscle Gain", icon: "◈", sub: "+0.25 kg/week", desc: "Calorie surplus of ~300 kcal/day", cal: 2500, p: 170, c: 300, f: 72 },
    { id: "Maintenance", icon: "◇", sub: "Hold steady", desc: "Eat at your TDEE", cal: 2200, p: 130, c: 250, f: 65 },
  ];
  const cur = goalDefs.find(g => g.id === goal);
  const lostW = USER.startWeight - USER.weight;
  const totalW = USER.startWeight - USER.goalWeight;
  const pp = Math.round((lostW / totalW) * 100);

  return (
    <div className="animate-in">
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Goals & Profile</h2>
      <p style={{ color: "var(--text3)", fontSize: 14, marginBottom: 24 }}>Your body, your targets</p>

      {/* Profile */}
      <div className="card" style={{ padding: 20, marginBottom: 24, display: "flex", gap: 20, alignItems: "center" }}>
        <div style={{ width: 60, height: 60, borderRadius: 14, background: "var(--olive-bg)", border: "1px solid var(--border2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>🧑</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: "var(--text)", fontFamily: "Playfair Display,serif" }}>{USER.name}</div>
          <div style={{ color: "var(--text3)", fontSize: 13, marginTop: 2 }}>Age {USER.age} · {USER.height} cm · {USER.weight} kg</div>
          <div style={{ marginTop: 8, display: "flex", gap: 6 }}>
            <span className="badge badge-olive">BMI {(USER.weight / ((USER.height / 100) ** 2)).toFixed(1)}</span>
            <span className="badge badge-stone">Mesomorph</span>
          </div>
        </div>
      </div>

      {/* Goal cards */}
      <p className="section-label">Select Your Goal</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px,1fr))", gap: 12, marginBottom: 28 }}>
        {goalDefs.map(g => (
          <div key={g.id} className={`goal-card ${goal === g.id ? "selected" : ""}`} onClick={() => setGoal(g.id)}>
            <div style={{ fontSize: 22, marginBottom: 10, color: "var(--olive)" }}>{g.icon}</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", fontFamily: "Playfair Display,serif", marginBottom: 4 }}>{g.id}</div>
            <div style={{ fontSize: 13, color: "var(--olive)", fontWeight: 500, marginBottom: 4 }}>{g.sub}</div>
            <div style={{ fontSize: 12, color: "var(--text3)" }}>{g.desc}</div>
          </div>
        ))}
      </div>

      {/* Targets */}
      {cur && (
        <div className="card" style={{ padding: 20, marginBottom: 24 }}>
          <p className="section-label">Daily Targets — {cur.id}</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, textAlign: "center" }}>
            {[
              { l: "Calories", v: cur.cal, u: "kcal", c: "var(--burgundy)" },
              { l: "Protein", v: cur.p, u: "g", c: "var(--olive)" },
              { l: "Carbs", v: cur.c, u: "g", c: "var(--amber)" },
              { l: "Fat", v: cur.f, u: "g", c: "var(--stone)" },
            ].map(m => (
              <div key={m.l} className="card-sm" style={{ padding: "14px 8px", background: "var(--muted)" }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: m.c, fontFamily: "Playfair Display,serif" }}>{m.v}<span style={{ fontSize: 10, fontFamily: "Outfit" }}>{m.u}</span></div>
                <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }}>{m.l}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 14, padding: "10px 14px", background: "var(--olive-bg)", borderRadius: 10, border: "1px solid rgba(107,124,63,0.18)", fontSize: 13, color: "var(--olive)" }}>
            Water 10 cups/day · Sleep 7–8 hrs · Steps 8,000+/day
          </div>
        </div>
      )}

      {/* Progress */}
      <div className="card" style={{ padding: 20 }}>
        <p className="section-label">Weight Progress</p>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
          <div><div style={{ fontSize: 11, color: "var(--text3)" }}>Start</div><div style={{ fontSize: 18, fontWeight: 700, color: "var(--burgundy)", fontFamily: "Playfair Display,serif" }}>{USER.startWeight}kg</div></div>
          <div style={{ textAlign: "center" }}><div style={{ fontSize: 11, color: "var(--text3)" }}>Current</div><div style={{ fontSize: 18, fontWeight: 700, color: "var(--text)", fontFamily: "Playfair Display,serif" }}>{USER.weight}kg</div></div>
          <div style={{ textAlign: "right" }}><div style={{ fontSize: 11, color: "var(--text3)" }}>Goal</div><div style={{ fontSize: 18, fontWeight: 700, color: "var(--olive)", fontFamily: "Playfair Display,serif" }}>{USER.goalWeight}kg</div></div>
        </div>
        <div className="progress-track" style={{ height: 8 }}>
          <div className="progress-fill" style={{ width: `${pp}%`, background: "linear-gradient(90deg, var(--olive), var(--olive2))" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
          <span style={{ fontSize: 12, color: "var(--text3)" }}>{lostW} kg lost so far</span>
          <span style={{ fontSize: 12, color: "var(--olive)", fontWeight: 600 }}>{pp}% to goal</span>
        </div>
      </div>
    </div>
  );
}

function Swaps() {
  const cats = ["All", "Drinks", "Snacks", "Meals", "Condiments"];
  const [active, setActive] = useState("All");
  const filtered = active === "All" ? SMART_SWAPS : SMART_SWAPS.filter(s => s.cat === active);
  const catColor = { Drinks: "var(--olive)", Snacks: "var(--amber)", Meals: "var(--burgundy)", Condiments: "var(--stone)" };

  return (
    <div className="animate-in">
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Smart Swaps Library</h2>
      <p style={{ color: "var(--text3)", fontSize: 14, marginBottom: 20 }}>Simple switches, lasting results</p>
      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        {cats.map(c => <button key={c} className={`tab-pill ${active === c ? "active" : ""}`} onClick={() => setActive(c)}>{c}</button>)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px,1fr))", gap: 14 }}>
        {filtered.map((s, i) => (
          <div key={i} className="swap-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <span className="badge" style={{ background: `${catColor[s.cat]}18`, color: catColor[s.cat] }}>{s.cat}</span>
              <span className="badge" style={{ background: s.diff === "Easy" ? "var(--olive-bg)" : "var(--amber-bg)", color: s.diff === "Easy" ? "var(--olive)" : "var(--amber)" }}>{s.diff}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={{ flex: 1, padding: "10px 12px", background: "var(--burgundy-bg)", borderRadius: 10, border: "1px solid rgba(124,45,63,0.12)" }}>
                <div style={{ fontSize: 11, color: "var(--burgundy)", marginBottom: 2, fontWeight: 600 }}>Instead of</div>
                <div style={{ fontSize: 13, color: "var(--text)", fontWeight: 500, lineHeight: 1.3 }}>{s.from}</div>
                <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 3 }}>{s.fromCal} kcal</div>
              </div>
              <ArrowRight size={16} color="var(--olive)" style={{ flexShrink: 0 }} />
              <div style={{ flex: 1, padding: "10px 12px", background: "var(--olive-bg)", borderRadius: 10, border: "1px solid rgba(107,124,63,0.15)" }}>
                <div style={{ fontSize: 11, color: "var(--olive)", marginBottom: 2, fontWeight: 600 }}>Try this</div>
                <div style={{ fontSize: 13, color: "var(--text)", fontWeight: 500, lineHeight: 1.3 }}>{s.to}</div>
                <div style={{ fontSize: 11, color: "var(--olive)", marginTop: 3 }}>{s.toCal} kcal</div>
              </div>
            </div>
            <div style={{ padding: "8px 12px", background: "var(--muted)", borderRadius: 8 }}>
              <div style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.4 }}>{s.why}</div>
            </div>
            <div style={{ marginTop: 10 }}>
              <span className="badge badge-olive">{s.benefit}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SUPPLEMENTS ─────────────────────────────────────────────────────────────
function Supplements() {
  const [supps, setSupps] = useState(SUPPLEMENTS_INIT);
  const [showAdd, setShowAdd] = useState(false);
  const [expand, setExpand] = useState(null);
  const [form, setForm] = useState({ name: "", dose: "", unit: "capsule", freq: "Once daily", timing: "Morning with food", category: "Vitamins", notes: "" });

  const toggleDose = (id) => {
    setSupps(prev => prev.map(s => {
      if (s.id !== id) return s;
      const next = s.dosesTaken < s.dosesTotal ? s.dosesTaken + 1 : 0;
      return { ...s, dosesTaken: next, taken: next === s.dosesTotal };
    }));
  };

  const addSupp = () => {
    if (!form.name) return;
    setSupps(prev => [...prev, { ...form, id: Date.now(), taken: false, dosesTaken: 0, dosesTotal: form.freq.includes("Twice") ? 2 : form.freq.includes("Three") ? 3 : 1, color: "var(--olive)" }]);
    setShowAdd(false);
    setForm({ name: "", dose: "", unit: "capsule", freq: "Once daily", timing: "Morning with food", category: "Vitamins", notes: "" });
  };

  const removeSupp = id => setSupps(prev => prev.filter(s => s.id !== id));

  const taken = supps.filter(s => s.taken).length;
  const total = supps.length;

  const catColors = { Vitamins: "var(--amber)", Minerals: "var(--burgundy)", "Essential Fatty Acids": "var(--olive)", Protein: "var(--stone)", Adaptogens: "var(--olive2)" };

  return (
    <div className="animate-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700 }}>Supplements</h2>
          <p style={{ color: "var(--text3)", fontSize: 14, marginTop: 4 }}>Daily dosage & health tracking</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}><Plus size={14} /> Add Supplement</button>
      </div>

      {/* Daily progress */}
      <div className="card" style={{ padding: 20, marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <p className="section-label" style={{ marginBottom: 0 }}>Today's Progress</p>
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--olive)" }}>{taken}/{total} completed</span>
        </div>
        <div className="progress-track" style={{ height: 8, marginBottom: 12 }}>
          <div className="progress-fill" style={{ width: `${pct(taken, total)}%`, background: "linear-gradient(90deg, var(--olive), var(--olive2))" }} />
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {supps.map(s => (
            <span key={s.id} className="badge" style={{ background: s.taken ? "var(--olive-bg)" : "var(--muted)", color: s.taken ? "var(--olive)" : "var(--text3)", gap: 5 }}>
              {s.taken && <Check size={10} />}{s.name}
            </span>
          ))}
        </div>
      </div>

      {/* Supplement cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px,1fr))", gap: 14 }}>
        {supps.map(s => {
          const dPct = pct(s.dosesTaken, s.dosesTotal);
          const r = 26, cx = 30, cy = 30;
          const circ = 2 * Math.PI * r;
          const dash = (dPct / 100) * circ;
          const color = catColors[s.category] || "var(--olive)";

          return (
            <div key={s.id} className="supp-card">
              <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                {/* Dose ring */}
                <div style={{ flexShrink: 0, cursor: "pointer" }} onClick={() => toggleDose(s.id)} title="Click to log dose">
                  <svg width="60" height="60" viewBox="0 0 60 60">
                    <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--border2)" strokeWidth="5" />
                    <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="5"
                      strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
                      transform={`rotate(-90 ${cx} ${cy})`} className="dose-ring" />
                    <text x={cx} y={cy + 4} textAnchor="middle" fill="var(--text)" fontSize="11" fontWeight="600" fontFamily="Outfit">{s.dosesTaken}/{s.dosesTotal}</text>
                  </svg>
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text)", fontFamily: "Playfair Display,serif" }}>{s.name}</div>
                      <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 2 }}>{s.dose} per {s.unit}</div>
                    </div>
                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      {s.taken && <span className="badge badge-olive"><Check size={10} /> Done</span>}
                      <button onClick={() => removeSupp(s.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text3)", padding: 2 }}><X size={13} /></button>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                    <span className="badge" style={{ background: `${color}18`, color }}>{s.category}</span>
                    <span className="badge badge-stone"><Clock size={9} /> {s.timing}</span>
                  </div>

                  <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
                    <button className="btn btn-primary" style={{ padding: "6px 14px", fontSize: 12 }} onClick={() => toggleDose(s.id)}>
                      {s.dosesTaken < s.dosesTotal ? "Log Dose" : "Undo"}
                    </button>
                    <button className="btn btn-ghost" style={{ padding: "6px 12px", fontSize: 12 }} onClick={() => setExpand(expand === s.id ? null : s.id)}>
                      {expand === s.id ? <ChevronUp size={12} /> : <ChevronDown size={12} />} Details
                    </button>
                  </div>

                  {expand === s.id && (
                    <div style={{ marginTop: 12, padding: "10px 12px", background: "var(--muted)", borderRadius: 8, borderLeft: "3px solid var(--olive)" }}>
                      <div style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.5, marginBottom: 6 }}>{s.notes || "No notes added."}</div>
                      <div style={{ fontSize: 11, color: "var(--text3)" }}><strong style={{ color: "var(--text2)" }}>Frequency:</strong> {s.freq} · <strong style={{ color: "var(--text2)" }}>Timing:</strong> {s.timing}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Disclaimer */}
      <div style={{ marginTop: 24, padding: "12px 16px", background: "var(--amber-bg)", border: "1px solid rgba(160,98,42,0.18)", borderRadius: 12, display: "flex", gap: 10, alignItems: "flex-start" }}>
        <AlertCircle size={15} color="var(--amber)" style={{ flexShrink: 0, marginTop: 1 }} />
        <p style={{ fontSize: 12, color: "var(--amber)", lineHeight: 1.5 }}>
          <strong>Disclaimer:</strong> Supplement information here is for personal tracking only. Always consult a healthcare provider or registered dietitian before starting any supplement regimen. Dosage needs vary by individual health status, age, and medication interactions.
        </p>
      </div>

      {/* Add supplement modal */}
      {showAdd && (
        <div className="modal-backdrop" onClick={() => setShowAdd(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700 }}>Add Supplement</h3>
              <button onClick={() => setShowAdd(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text3)" }}><X size={18} /></button>
            </div>
            {[
              { label: "Supplement Name", key: "name", type: "text", placeholder: "e.g. Vitamin C" },
              { label: "Dose", key: "dose", type: "text", placeholder: "e.g. 500 mg" },
              { label: "Timing / When to take", key: "timing", type: "text", placeholder: "e.g. Morning with food" },
              { label: "Notes / Benefits", key: "notes", type: "text", placeholder: "e.g. Immune support, antioxidant" },
            ].map(({ label, key, type, placeholder }) => (
              <div key={key} style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 12, color: "var(--text2)", fontWeight: 500, marginBottom: 5 }}>{label}</div>
                <input type={type} value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} placeholder={placeholder} style={{ paddingLeft: 12 }} />
              </div>
            ))}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 12, color: "var(--text2)", fontWeight: 500, marginBottom: 5 }}>Frequency</div>
                <select value={form.freq} onChange={e => setForm(p => ({ ...p, freq: e.target.value }))}
                  style={{ width: "100%", padding: "9px 12px", background: "var(--bg2)", border: "1px solid var(--border2)", color: "var(--text)", borderRadius: 10, fontFamily: "Outfit", fontSize: 14, outline: "none" }}>
                  {["Once daily", "Twice daily", "Three times daily", "Weekly"].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <div style={{ fontSize: 12, color: "var(--text2)", fontWeight: 500, marginBottom: 5 }}>Category</div>
                <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                  style={{ width: "100%", padding: "9px 12px", background: "var(--bg2)", border: "1px solid var(--border2)", color: "var(--text)", borderRadius: 10, fontFamily: "Outfit", fontSize: 14, outline: "none" }}>
                  {["Vitamins", "Minerals", "Essential Fatty Acids", "Protein", "Adaptogens", "Probiotics", "Herbs", "Other"].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            </div>
            <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center", padding: 11 }} onClick={addSupp}>Add Supplement</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("dashboard");
  const [foodLog, setFoodLog] = useState(TODAY_LOG_INIT);
  const [waterCups, setWaterCups] = useState(7);
  const [goal, setGoal] = useState(USER.goal);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
  }, [dark]);

  const nav = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { id: "foodlog", icon: BookOpen, label: "Food Log" },
    { id: "mealplan", icon: Calendar, label: "Meal Plan" },
    { id: "trends", icon: TrendingUp, label: "Trends" },
    { id: "goals", icon: Target, label: "Goals" },
    { id: "swaps", icon: Repeat2, label: "Swaps" },
    { id: "supps", icon: Pill, label: "Supplements" },
  ];

  const renderPage = () => {
    switch (page) {
      case "dashboard": return <Dashboard foodLog={foodLog} waterCups={waterCups} setWaterCups={setWaterCups} />;
      case "foodlog": return <FoodLog foodLog={foodLog} setFoodLog={setFoodLog} />;
      case "mealplan": return <MealPlan goal={goal} />;
      case "trends": return <Trends />;
      case "goals": return <Goals goal={goal} setGoal={setGoal} />;
      case "swaps": return <Swaps />;
      case "supps": return <Supplements />;
      default: return null;
    }
  };

  return (
    <div data-theme={dark ? "dark" : "light"}>
      <BgTexture />
      <div className="app-shell">
        {/* Sidebar */}
        <div className="sidebar">
          <div style={{ padding: "0 4px", marginBottom: 32 }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: "var(--olive)", fontFamily: "Playfair Display,serif", letterSpacing: "-0.01em" }}>NutriSense</div>
            <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }}>Smart Nutrition Platform</div>
          </div>

          <nav style={{ flex: 1 }}>
            {nav.map(({ id, icon: Icon, label }) => (
              <div key={id} className={`nav-item ${page === id ? "active" : ""}`} onClick={() => setPage(id)}>
                <Icon size={16} /> {label}
              </div>
            ))}
          </nav>

          {/* Theme toggle */}
          <div style={{ borderTop: "1px solid var(--border)", paddingTop: 16, marginTop: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 4px", marginBottom: 16 }}>
              <Sun size={14} color="var(--text3)" />
              <div className="theme-toggle" onClick={() => setDark(d => !d)}>
                <div className={`theme-toggle-thumb ${dark ? "dark" : ""}`} />
              </div>
              <Moon size={14} color="var(--text3)" />
            </div>
            <div style={{ padding: "0 4px" }}>
              <div style={{ fontSize: 12, color: "var(--text3)" }}>Signed in as</div>
              <div style={{ fontSize: 13, color: "var(--text2)", fontWeight: 500, marginTop: 1 }}>{USER.name}</div>
            </div>
          </div>
        </div>

        {/* Main */}
        <main className="main">
          {renderPage()}
        </main>

        {/* Mobile bottom nav */}
        <div className="bottom-nav">
          {nav.map(({ id, icon: Icon, label }) => (
            <div key={id} onClick={() => setPage(id)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, cursor: "pointer", padding: "2px 8px" }}>
              <Icon size={19} color={page === id ? "var(--olive)" : "var(--text3)"} />
              <span style={{ fontSize: 9, color: page === id ? "var(--olive)" : "var(--text3)", fontWeight: page === id ? 600 : 400 }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
