import { useState, useEffect } from 'react'
import { Plus, Trash2, Utensils, Coffee, Sun, Moon, Apple, Flame, ChevronDown, ChevronUp } from 'lucide-react'

const MEALS = [
  { id: 'breakfast', label: 'Breakfast', icon: Coffee, color: '#c07840', bg: '#fdf0e0', border: '#e8c89a' },
  { id: 'lunch',     label: 'Lunch',     icon: Sun,    color: '#5a8a3a', bg: '#eef5e8', border: '#b8d4a0' },
  { id: 'dinner',    label: 'Dinner',    icon: Moon,   color: '#4a5a8a', bg: '#eceef8', border: '#b0b8d8' },
  { id: 'snack',     label: 'Snack',     icon: Apple,  color: '#8a5a7a', bg: '#f5eef4', border: '#d0b0c8' },
]

const palette = {
  bg: '#f7f3ec',
  card: '#fffdf8',
  olive: '#5a6b3a',
  oliveLight: '#7a8f52',
  cream: '#e8dfc8',
  creamDark: '#d4c8a8',
  brown: '#3d2e1a',
  textMuted: '#7a6a52',
  inputBg: '#f0ece2',
  inputBorder: '#c8b89a',
  error: '#b85c38',
}

const todayKey = () => {
  const d = new Date()
  return `hb_foodlog_${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

const todayLabel = () => new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  .fl-wrap {
    font-family: 'DM Sans', sans-serif;
    color: ${palette.brown};
    max-width: 860px;
    margin: 0 auto;
    padding: 2rem 1.5rem;
  }

  .fl-page-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-bottom: 1.75rem;
    flex-wrap: wrap;
    gap: 12px;
  }

  .fl-page-title {
    font-family: 'Playfair Display', serif;
    font-size: 28px;
    font-weight: 600;
    color: ${palette.brown};
    margin: 0 0 4px;
  }

  .fl-page-date {
    font-size: 13px;
    color: ${palette.textMuted};
    margin: 0;
  }

  .fl-total-pill {
    display: flex;
    align-items: center;
    gap: 6px;
    background: ${palette.olive};
    color: #fff;
    padding: 8px 16px;
    border-radius: 50px;
    font-size: 13px;
    font-weight: 500;
  }

  /* Add entry card */
  .fl-add-card {
    background: ${palette.card};
    border: 1px solid ${palette.creamDark};
    border-radius: 16px;
    padding: 1.25rem 1.5rem;
    margin-bottom: 1.75rem;
    box-shadow: 0 2px 12px rgba(90,107,58,0.06);
  }

  .fl-add-title {
    font-size: 12px;
    font-weight: 500;
    color: ${palette.textMuted};
    text-transform: uppercase;
    letter-spacing: 0.7px;
    margin: 0 0 1rem;
  }

  .fl-add-row {
    display: grid;
    grid-template-columns: 1fr 110px 140px auto;
    gap: 10px;
    align-items: flex-end;
  }

  @media (max-width: 600px) {
    .fl-add-row {
      grid-template-columns: 1fr 1fr;
      grid-template-rows: auto auto;
    }
    .fl-add-row .fl-add-btn-wrap {
      grid-column: 1 / -1;
    }
  }

  .fl-field label {
    display: block;
    font-size: 11px;
    font-weight: 500;
    color: ${palette.textMuted};
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 5px;
  }

  .fl-input {
    width: 100%;
    background: ${palette.inputBg};
    border: 1px solid ${palette.inputBorder};
    border-radius: 9px;
    padding: 10px 13px;
    font-size: 14px;
    font-family: 'DM Sans', sans-serif;
    color: ${palette.brown};
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    box-sizing: border-box;
    -webkit-appearance: none;
    appearance: none;
  }

  .fl-input:focus {
    border-color: ${palette.oliveLight};
    box-shadow: 0 0 0 3px rgba(122,143,82,0.15);
  }

  .fl-input::placeholder { color: #b0a080; }

  .fl-input.error { border-color: ${palette.error}; }

  .fl-select {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%237a6a52' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 10px center;
    padding-right: 30px;
    cursor: pointer;
  }

  .fl-add-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    width: 100%;
    padding: 10px 16px;
    background: ${palette.olive};
    color: #fff;
    border: none;
    border-radius: 9px;
    font-size: 14px;
    font-weight: 500;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: background 0.2s, transform 0.15s;
    white-space: nowrap;
  }

  .fl-add-btn:hover { background: #3d5228; transform: translateY(-1px); }
  .fl-add-btn:active { transform: translateY(0); }

  .fl-error { font-size: 11.5px; color: ${palette.error}; margin-top: 5px; }

  /* Meal sections */
  .fl-meals { display: flex; flex-direction: column; gap: 14px; }

  .fl-meal-card {
    background: ${palette.card};
    border: 1px solid ${palette.creamDark};
    border-radius: 14px;
    overflow: hidden;
    box-shadow: 0 1px 6px rgba(90,107,58,0.05);
  }

  .fl-meal-header {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0.9rem 1.25rem;
    cursor: pointer;
    user-select: none;
    transition: background 0.15s;
  }

  .fl-meal-header:hover { background: rgba(0,0,0,0.02); }

  .fl-meal-icon {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .fl-meal-name {
    font-weight: 500;
    font-size: 14px;
    color: ${palette.brown};
  }

  .fl-meal-count {
    font-size: 12px;
    color: ${palette.textMuted};
  }

  .fl-meal-kcal {
    margin-left: auto;
    font-size: 13px;
    font-weight: 500;
    color: ${palette.textMuted};
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .fl-meal-toggle { color: ${palette.textMuted}; margin-left: 6px; }

  .fl-meal-body { padding: 0 1.25rem; }

  .fl-divider {
    height: 1px;
    background: ${palette.cream};
    margin: 0;
  }

  .fl-entry {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 0;
    border-bottom: 1px solid ${palette.cream};
    animation: entryIn 0.2s ease;
  }

  @keyframes entryIn {
    from { opacity: 0; transform: translateY(-4px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .fl-entry:last-child { border-bottom: none; }

  .fl-entry-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .fl-entry-name {
    font-size: 14px;
    color: ${palette.brown};
    flex: 1;
  }

  .fl-entry-time {
    font-size: 11px;
    color: ${palette.textMuted};
    white-space: nowrap;
  }

  .fl-entry-kcal {
    font-size: 13px;
    font-weight: 500;
    color: ${palette.brown};
    min-width: 60px;
    text-align: right;
  }

  .fl-entry-del {
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    color: #c8b89a;
    border-radius: 6px;
    display: flex;
    align-items: center;
    transition: color 0.15s, background 0.15s;
  }

  .fl-entry-del:hover { color: ${palette.error}; background: rgba(184,92,56,0.08); }

  .fl-empty {
    padding: 14px 0;
    font-size: 13px;
    color: ${palette.textMuted};
    font-style: italic;
  }

  /* Summary bar */
  .fl-summary {
    background: ${palette.card};
    border: 1px solid ${palette.creamDark};
    border-radius: 14px;
    padding: 1rem 1.5rem;
    margin-top: 1.5rem;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
    box-shadow: 0 1px 6px rgba(90,107,58,0.05);
  }

  @media (max-width: 480px) {
    .fl-summary { grid-template-columns: 1fr 1fr; }
  }

  .fl-summary-item { text-align: center; }

  .fl-summary-val {
    font-family: 'Playfair Display', serif;
    font-size: 22px;
    font-weight: 600;
    color: ${palette.brown};
    display: block;
  }

  .fl-summary-label {
    font-size: 11px;
    color: ${palette.textMuted};
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .fl-summary-divider {
    width: 1px;
    background: ${palette.cream};
    align-self: stretch;
    display: none;
  }
`

const formatTime = (iso) => {
  const d = new Date(iso)
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
}

export default function FoodLog() {
  const [entries, setEntries] = useState([])
  const [collapsed, setCollapsed] = useState({})
  const [foodName, setFoodName] = useState('')
  const [calories, setCalories] = useState('')
  const [meal, setMeal] = useState('breakfast')
  const [errors, setErrors] = useState({})

  // Load from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(todayKey())
      if (raw) setEntries(JSON.parse(raw))
    } catch {}
  }, [])

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem(todayKey(), JSON.stringify(entries))
  }, [entries])

  const validate = () => {
    const errs = {}
    if (!foodName.trim()) errs.foodName = 'Enter a food name'
    const cal = Number(calories)
    if (!calories || isNaN(cal) || cal < 1 || cal > 5000) errs.calories = 'Enter valid calories (1–5000)'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleAdd = () => {
    if (!validate()) return
    const entry = {
      id: Date.now().toString(),
      name: foodName.trim(),
      calories: Number(calories),
      meal,
      addedAt: new Date().toISOString(),
    }
    setEntries(prev => [...prev, entry])
    setFoodName('')
    setCalories('')
    setErrors({})
    // Auto-expand the meal we just added to
    setCollapsed(prev => ({ ...prev, [meal]: false }))
  }

  const handleDelete = (id) => {
    setEntries(prev => prev.filter(e => e.id !== id))
  }

  const toggleMeal = (mealId) => {
    setCollapsed(prev => ({ ...prev, [mealId]: !prev[mealId] }))
  }

  const totalCal = entries.reduce((s, e) => s + e.calories, 0)
  const mealTotals = Object.fromEntries(
    MEALS.map(m => [m.id, entries.filter(e => e.meal === m.id).reduce((s, e) => s + e.calories, 0)])
  )
  const entriesByMeal = Object.fromEntries(
    MEALS.map(m => [m.id, entries.filter(e => e.meal === m.id)])
  )

  return (
    <>
      <style>{css}</style>
      <div className="fl-wrap">

        {/* Page header */}
        <div className="fl-page-header">
          <div>
            <h1 className="fl-page-title">Food Log</h1>
            <p className="fl-page-date">{todayLabel()}</p>
          </div>
          <div className="fl-total-pill">
            <Flame size={14} />
            {totalCal} kcal today
          </div>
        </div>

        {/* Add entry */}
        <div className="fl-add-card">
          <p className="fl-add-title">+ Log a meal or snack</p>
          <div className="fl-add-row">
            <div className="fl-field">
              <label>Food / drink</label>
              <input
                className={`fl-input ${errors.foodName ? 'error' : ''}`}
                placeholder="e.g. Rajma Burrito"
                value={foodName}
                onChange={e => { setFoodName(e.target.value); setErrors(ev => ({...ev, foodName:''})) }}
                onKeyDown={e => e.key === 'Enter' && handleAdd()}
              />
              {errors.foodName && <p className="fl-error">{errors.foodName}</p>}
            </div>

            <div className="fl-field">
              <label>Calories</label>
              <input
                className={`fl-input ${errors.calories ? 'error' : ''}`}
                type="number"
                placeholder="350"
                value={calories}
                onChange={e => { setCalories(e.target.value); setErrors(ev => ({...ev, calories:''})) }}
                onKeyDown={e => e.key === 'Enter' && handleAdd()}
              />
              {errors.calories && <p className="fl-error">{errors.calories}</p>}
            </div>

            <div className="fl-field">
              <label>Meal slot</label>
              <select
                className="fl-input fl-select"
                value={meal}
                onChange={e => setMeal(e.target.value)}
              >
                {MEALS.map(m => (
                  <option key={m.id} value={m.id}>{m.label}</option>
                ))}
              </select>
            </div>

            <div className="fl-field fl-add-btn-wrap">
              <label style={{ visibility: 'hidden' }}>Add</label>
              <button className="fl-add-btn" onClick={handleAdd}>
                <Plus size={15} />
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Meal sections */}
        <div className="fl-meals">
          {MEALS.map(m => {
            const MealIcon = m.icon
            const mealEntries = entriesByMeal[m.id]
            const isCollapsed = collapsed[m.id]
            const kcal = mealTotals[m.id]

            return (
              <div className="fl-meal-card" key={m.id}>
                <div className="fl-meal-header" onClick={() => toggleMeal(m.id)}>
                  <div className="fl-meal-icon" style={{ background: m.bg }}>
                    <MealIcon size={16} color={m.color} />
                  </div>
                  <div>
                    <div className="fl-meal-name">{m.label}</div>
                    <div className="fl-meal-count">
                      {mealEntries.length === 0 ? 'Nothing logged' : `${mealEntries.length} item${mealEntries.length > 1 ? 's' : ''}`}
                    </div>
                  </div>
                  <div className="fl-meal-kcal">
                    {kcal > 0 && <><Flame size={12} />{kcal} kcal</>}
                  </div>
                  <div className="fl-meal-toggle">
                    {isCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                  </div>
                </div>

                {!isCollapsed && (
                  <>
                    <div className="fl-divider" />
                    <div className="fl-meal-body">
                      {mealEntries.length === 0 ? (
                        <p className="fl-empty">No entries yet — add something above.</p>
                      ) : (
                        mealEntries.map(entry => (
                          <div className="fl-entry" key={entry.id}>
                            <div className="fl-entry-dot" style={{ background: m.color }} />
                            <span className="fl-entry-name">{entry.name}</span>
                            <span className="fl-entry-time">{formatTime(entry.addedAt)}</span>
                            <span className="fl-entry-kcal">{entry.calories} kcal</span>
                            <button
                              className="fl-entry-del"
                              onClick={() => handleDelete(entry.id)}
                              title="Remove entry"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>

        {/* Daily summary */}
        {entries.length > 0 && (
          <div className="fl-summary">
            <div className="fl-summary-item">
              <span className="fl-summary-val">{totalCal}</span>
              <span className="fl-summary-label">Total kcal</span>
            </div>
            <div className="fl-summary-item">
              <span className="fl-summary-val">{entries.length}</span>
              <span className="fl-summary-label">Items logged</span>
            </div>
            <div className="fl-summary-item">
              <span className="fl-summary-val">
                {MEALS.filter(m => entriesByMeal[m.id].length > 0).length}
              </span>
              <span className="fl-summary-label">Meals covered</span>
            </div>
            <div className="fl-summary-item">
              <span className="fl-summary-val">
                {Math.max(...Object.values(mealTotals))}
              </span>
              <span className="fl-summary-label">Biggest meal kcal</span>
            </div>
          </div>
        )}

      </div>
    </>
  )
}