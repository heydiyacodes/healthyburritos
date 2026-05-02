import { useState, useEffect } from 'react'
import { Plus, Trash2, Check, Flame, Sun, Sunset, Moon, Pill, Trophy, ChevronDown, ChevronUp, X } from 'lucide-react'

// ── helpers ────────────────────────────────────────────────────────────────────

const todayStr = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

const suppListKey  = 'hb_supplements'
const logKey = (date) => `hb_supp_log_${date}`

const loadJSON = (key, fallback) => {
  try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : fallback }
  catch { return fallback }
}

const saveJSON = (key, val) => {
  try { localStorage.setItem(key, JSON.stringify(val)) } catch {}
}

// Count consecutive days where every supplement was taken
const calcStreak = (supplements) => {
  if (!supplements.length) return 0
  let streak = 0
  const d = new Date()
  // start from yesterday (today might still be in progress)
  d.setDate(d.getDate() - 1)
  for (let i = 0; i < 365; i++) {
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
    const log = loadJSON(logKey(key), {})
    const allTaken = supplements.every(s => log[s.id])
    if (allTaken) { streak++; d.setDate(d.getDate() - 1) }
    else break
  }
  return streak
}

// ── constants ─────────────────────────────────────────────────────────────────

const TIMINGS = [
  { id: 'morning',   label: 'Morning',   Icon: Sun,    color: '#c07840', bg: '#fdf0e0', border: '#e8c89a' },
  { id: 'afternoon', label: 'Afternoon', Icon: Sunset, color: '#5a8a3a', bg: '#eef5e8', border: '#b8d4a0' },
  { id: 'evening',   label: 'Evening',   Icon: Moon,   color: '#4a5a8a', bg: '#eceef8', border: '#b0b8d8' },
]

const palette = {
  bg:          '#f7f3ec',
  card:        '#fffdf8',
  olive:       '#5a6b3a',
  oliveLight:  '#7a8f52',
  oliveMuted:  '#a8b88a',
  cream:       '#e8dfc8',
  creamDark:   '#d4c8a8',
  brown:       '#3d2e1a',
  brownMid:    '#6b4f2e',
  textMuted:   '#7a6a52',
  inputBg:     '#f0ece2',
  inputBorder: '#c8b89a',
  error:       '#b85c38',
}

// ── styles ────────────────────────────────────────────────────────────────────

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  .sp-wrap {
    font-family: 'DM Sans', sans-serif;
    color: ${palette.brown};
    max-width: 860px;
    margin: 0 auto;
    padding: 2rem 1.5rem;
  }

  /* ── page header ── */
  .sp-page-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 1.75rem;
  }
  .sp-page-title {
    font-family: 'Playfair Display', serif;
    font-size: 28px;
    font-weight: 600;
    color: ${palette.brown};
    margin: 0 0 4px;
  }
  .sp-page-sub {
    font-size: 13px;
    color: ${palette.textMuted};
    margin: 0;
  }

  /* ── streak badge ── */
  .sp-streak {
    display: flex;
    align-items: center;
    gap: 8px;
    background: linear-gradient(135deg, #5a6b3a 0%, #3d5228 100%);
    color: #fff;
    padding: 10px 18px;
    border-radius: 50px;
    box-shadow: 0 4px 14px rgba(90,107,58,0.25);
  }
  .sp-streak-num {
    font-family: 'Playfair Display', serif;
    font-size: 20px;
    font-weight: 600;
    line-height: 1;
  }
  .sp-streak-label {
    font-size: 11px;
    opacity: 0.8;
    line-height: 1.3;
  }

  /* ── today's progress bar ── */
  .sp-progress-card {
    background: ${palette.card};
    border: 1px solid ${palette.creamDark};
    border-radius: 14px;
    padding: 1rem 1.5rem;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 16px;
    box-shadow: 0 1px 6px rgba(90,107,58,0.05);
  }
  .sp-progress-bar-wrap {
    flex: 1;
    height: 8px;
    background: ${palette.cream};
    border-radius: 99px;
    overflow: hidden;
  }
  .sp-progress-bar-fill {
    height: 100%;
    border-radius: 99px;
    background: linear-gradient(90deg, ${palette.oliveLight}, ${palette.olive});
    transition: width 0.5s cubic-bezier(0.34,1.56,0.64,1);
  }
  .sp-progress-text {
    font-size: 13px;
    font-weight: 500;
    color: ${palette.textMuted};
    white-space: nowrap;
  }
  .sp-progress-done {
    display: flex;
    align-items: center;
    gap: 5px;
    color: ${palette.olive};
    font-size: 13px;
    font-weight: 500;
  }

  /* ── add card ── */
  .sp-add-card {
    background: ${palette.card};
    border: 1px solid ${palette.creamDark};
    border-radius: 16px;
    padding: 1.25rem 1.5rem;
    margin-bottom: 1.75rem;
    box-shadow: 0 2px 12px rgba(90,107,58,0.06);
  }
  .sp-add-toggle {
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    user-select: none;
  }
  .sp-add-toggle-label {
    font-size: 13px;
    font-weight: 500;
    color: ${palette.olive};
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .sp-add-form {
    margin-top: 1.1rem;
    display: grid;
    grid-template-columns: 1fr 120px;
    gap: 10px;
  }
  @media (max-width: 500px) {
    .sp-add-form { grid-template-columns: 1fr; }
  }
  .sp-field label {
    display: block;
    font-size: 11px;
    font-weight: 500;
    color: ${palette.textMuted};
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 5px;
  }
  .sp-input {
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
  .sp-input:focus {
    border-color: ${palette.oliveLight};
    box-shadow: 0 0 0 3px rgba(122,143,82,0.15);
  }
  .sp-input::placeholder { color: #b0a080; }
  .sp-input.error { border-color: ${palette.error}; }
  .sp-select {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%237a6a52' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 10px center;
    padding-right: 30px;
    cursor: pointer;
  }
  .sp-add-bottom {
    display: flex;
    gap: 10px;
    margin-top: 10px;
    grid-column: 1 / -1;
  }
  .sp-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 10px 18px;
    border-radius: 9px;
    font-size: 14px;
    font-weight: 500;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
    white-space: nowrap;
  }
  .sp-btn-primary {
    background: ${palette.olive};
    color: #fff;
    flex: 1;
  }
  .sp-btn-primary:hover { background: #3d5228; transform: translateY(-1px); }
  .sp-btn-primary:active { transform: translateY(0); }
  .sp-btn-ghost {
    background: transparent;
    border: 1px solid ${palette.inputBorder};
    color: ${palette.textMuted};
  }
  .sp-btn-ghost:hover { background: ${palette.inputBg}; color: ${palette.brown}; }
  .sp-error { font-size: 11.5px; color: ${palette.error}; margin-top: 4px; }

  /* ── timing groups ── */
  .sp-timing-groups { display: flex; flex-direction: column; gap: 14px; }

  .sp-timing-card {
    background: ${palette.card};
    border: 1px solid ${palette.creamDark};
    border-radius: 14px;
    overflow: hidden;
    box-shadow: 0 1px 6px rgba(90,107,58,0.05);
  }
  .sp-timing-header {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0.85rem 1.25rem;
    cursor: pointer;
    user-select: none;
    transition: background 0.15s;
  }
  .sp-timing-header:hover { background: rgba(0,0,0,0.015); }
  .sp-timing-icon {
    width: 30px; height: 30px;
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .sp-timing-name { font-weight: 500; font-size: 14px; color: ${palette.brown}; }
  .sp-timing-count { font-size: 12px; color: ${palette.textMuted}; }
  .sp-timing-done-badge {
    margin-left: auto;
    font-size: 11px;
    font-weight: 500;
    padding: 3px 9px;
    border-radius: 99px;
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .sp-timing-chevron { color: ${palette.textMuted}; margin-left: 4px; }

  .sp-divider { height: 1px; background: ${palette.cream}; }

  .sp-timing-body { padding: 0 1.25rem; }

  .sp-supp-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 11px 0;
    border-bottom: 1px solid ${palette.cream};
    animation: rowIn 0.2s ease;
  }
  @keyframes rowIn {
    from { opacity: 0; transform: translateX(-6px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  .sp-supp-row:last-child { border-bottom: none; }

  /* custom checkbox */
  .sp-check {
    width: 22px; height: 22px;
    border-radius: 6px;
    border: 1.5px solid ${palette.inputBorder};
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    flex-shrink: 0;
    transition: all 0.2s;
    background: ${palette.inputBg};
  }
  .sp-check:hover { border-color: ${palette.oliveLight}; }
  .sp-check.checked {
    background: ${palette.olive};
    border-color: ${palette.olive};
  }
  .sp-check.checked svg { animation: checkPop 0.2s cubic-bezier(0.34,1.56,0.64,1); }
  @keyframes checkPop {
    from { transform: scale(0); }
    to   { transform: scale(1); }
  }

  .sp-supp-info { flex: 1; min-width: 0; }
  .sp-supp-name {
    font-size: 14px;
    color: ${palette.brown};
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .sp-supp-dose { font-size: 12px; color: ${palette.textMuted}; margin-top: 1px; }

  .sp-supp-del {
    background: none; border: none; cursor: pointer;
    padding: 5px; color: #c8b89a; border-radius: 6px;
    display: flex; align-items: center;
    transition: color 0.15s, background 0.15s;
    flex-shrink: 0;
  }
  .sp-supp-del:hover { color: ${palette.error}; background: rgba(184,92,56,0.08); }

  .sp-timing-empty {
    padding: 12px 0;
    font-size: 13px;
    color: ${palette.textMuted};
    font-style: italic;
  }

  /* ── empty state ── */
  .sp-empty-state {
    text-align: center;
    padding: 3rem 1rem;
    color: ${palette.textMuted};
  }
  .sp-empty-emoji { font-size: 48px; margin-bottom: 1rem; display: block;
    animation: float 3s ease-in-out infinite;
  }
  @keyframes float {
    0%,100% { transform: translateY(0); }
    50%      { transform: translateY(-8px); }
  }
  .sp-empty-title {
    font-family: 'Playfair Display', serif;
    font-size: 18px;
    color: ${palette.brownMid};
    margin: 0 0 8px;
  }
  .sp-empty-sub { font-size: 13px; }
`

// ── component ─────────────────────────────────────────────────────────────────

export default function Supplements() {
  const today = todayStr()

  const [supplements, setSupplements] = useState([])
  const [takenToday, setTakenToday]   = useState({})
  const [streak, setStreak]           = useState(0)
  const [showForm, setShowForm]       = useState(false)
  const [collapsed, setCollapsed]     = useState({})

  // form state
  const [name, setName]     = useState('')
  const [dose, setDose]     = useState('')
  const [timing, setTiming] = useState('morning')
  const [errors, setErrors] = useState({})

  // ── load ──
  useEffect(() => {
    const supps = loadJSON(suppListKey, [])
    const log   = loadJSON(logKey(today), {})
    setSupplements(supps)
    setTakenToday(log)
    setStreak(calcStreak(supps))
  }, [])

  // ── persist supplements list ──
  useEffect(() => {
    saveJSON(suppListKey, supplements)
    setStreak(calcStreak(supplements))
  }, [supplements])

  // ── persist today's log ──
  useEffect(() => {
    saveJSON(logKey(today), takenToday)
  }, [takenToday])

  // ── toggle taken ──
  const toggleTaken = (id) => {
    setTakenToday(prev => {
      const updated = { ...prev }
      if (updated[id]) delete updated[id]
      else updated[id] = true
      return updated
    })
  }

  // ── add supplement ──
  const validate = () => {
    const errs = {}
    if (!name.trim()) errs.name = 'Enter a supplement name'
    if (!dose.trim()) errs.dose = 'Enter the dose (e.g. 500mg)'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleAdd = () => {
    if (!validate()) return
    const supp = {
      id: Date.now().toString(),
      name: name.trim(),
      dose: dose.trim(),
      timing,
      addedAt: new Date().toISOString(),
    }
    setSupplements(prev => [...prev, supp])
    setName(''); setDose(''); setErrors({})
    setShowForm(false)
    // auto-expand its timing group
    setCollapsed(prev => ({ ...prev, [timing]: false }))
  }

  const handleDelete = (id) => {
    setSupplements(prev => prev.filter(s => s.id !== id))
    setTakenToday(prev => { const u = {...prev}; delete u[id]; return u })
  }

  const toggleCollapse = (tid) => setCollapsed(prev => ({ ...prev, [tid]: !prev[tid] }))

  // ── derived ──
  const totalCount = supplements.length
  const takenCount = supplements.filter(s => takenToday[s.id]).length
  const allDone    = totalCount > 0 && takenCount === totalCount
  const pct        = totalCount ? Math.round((takenCount / totalCount) * 100) : 0

  const byTiming = Object.fromEntries(
    TIMINGS.map(t => [t.id, supplements.filter(s => s.timing === t.id)])
  )

  // ── render ────────────────────────────────────────────────────────────────

  return (
    <>
      <style>{css}</style>
      <div className="sp-wrap">

        {/* page header */}
        <div className="sp-page-header">
          <div>
            <h1 className="sp-page-title">Supplements</h1>
            <p className="sp-page-sub">Track your daily stack — never miss a dose</p>
          </div>
          {streak > 0 && (
            <div className="sp-streak">
              <Trophy size={16} color="#f5d080" />
              <div>
                <div className="sp-streak-num">{streak}</div>
                <div className="sp-streak-label">day streak 🔥</div>
              </div>
            </div>
          )}
        </div>

        {/* today's progress */}
        {totalCount > 0 && (
          <div className="sp-progress-card">
            <Pill size={15} color={palette.olive} />
            <div className="sp-progress-bar-wrap">
              <div className="sp-progress-bar-fill" style={{ width: `${pct}%` }} />
            </div>
            {allDone ? (
              <div className="sp-progress-done">
                <Check size={14} strokeWidth={2.5} />
                All taken!
              </div>
            ) : (
              <span className="sp-progress-text">{takenCount}/{totalCount} taken</span>
            )}
          </div>
        )}

        {/* add form */}
        <div className="sp-add-card">
          <div className="sp-add-toggle" onClick={() => setShowForm(f => !f)}>
            <span className="sp-add-toggle-label">
              <Plus size={14} />
              Add a supplement
            </span>
            {showForm ? <ChevronUp size={15} color={palette.textMuted} /> : <ChevronDown size={15} color={palette.textMuted} />}
          </div>

          {showForm && (
            <>
              <div className="sp-add-form">
                <div className="sp-field">
                  <label>Supplement name</label>
                  <input
                    className={`sp-input ${errors.name ? 'error' : ''}`}
                    placeholder="e.g. Vitamin D3, Omega-3, Creatine"
                    value={name}
                    onChange={e => { setName(e.target.value); setErrors(v => ({...v, name:''})) }}
                    onKeyDown={e => e.key === 'Enter' && handleAdd()}
                  />
                  {errors.name && <p className="sp-error">{errors.name}</p>}
                </div>

                <div className="sp-field">
                  <label>Dose</label>
                  <input
                    className={`sp-input ${errors.dose ? 'error' : ''}`}
                    placeholder="500mg / 1 capsule"
                    value={dose}
                    onChange={e => { setDose(e.target.value); setErrors(v => ({...v, dose:''})) }}
                    onKeyDown={e => e.key === 'Enter' && handleAdd()}
                  />
                  {errors.dose && <p className="sp-error">{errors.dose}</p>}
                </div>

                <div className="sp-field" style={{ gridColumn: '1 / -1' }}>
                  <label>When to take</label>
                  <select
                    className="sp-input sp-select"
                    value={timing}
                    onChange={e => setTiming(e.target.value)}
                    style={{ maxWidth: 200 }}
                  >
                    {TIMINGS.map(t => (
                      <option key={t.id} value={t.id}>{t.label}</option>
                    ))}
                  </select>
                </div>

                <div className="sp-add-bottom">
                  <button className="sp-btn sp-btn-ghost" onClick={() => { setShowForm(false); setErrors({}) }}>
                    <X size={14} /> Cancel
                  </button>
                  <button className="sp-btn sp-btn-primary" onClick={handleAdd}>
                    <Plus size={14} /> Add supplement
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* supplement list grouped by timing */}
        {totalCount === 0 ? (
          <div className="sp-empty-state">
            <span className="sp-empty-emoji">💊</span>
            <p className="sp-empty-title">No supplements added yet</p>
            <p className="sp-empty-sub">Add your first one above to start tracking your daily stack.</p>
          </div>
        ) : (
          <div className="sp-timing-groups">
            {TIMINGS.map(t => {
              const { Icon } = t
              const group    = byTiming[t.id]
              const doneInGroup = group.filter(s => takenToday[s.id]).length
              const allGroupDone = group.length > 0 && doneInGroup === group.length
              const isCollapsed  = collapsed[t.id]

              return (
                <div className="sp-timing-card" key={t.id}>
                  <div className="sp-timing-header" onClick={() => toggleCollapse(t.id)}>
                    <div className="sp-timing-icon" style={{ background: t.bg }}>
                      <Icon size={15} color={t.color} />
                    </div>
                    <div>
                      <div className="sp-timing-name">{t.label}</div>
                      <div className="sp-timing-count">
                        {group.length === 0
                          ? 'Nothing added'
                          : `${group.length} supplement${group.length > 1 ? 's' : ''}`}
                      </div>
                    </div>

                    {group.length > 0 && (
                      <div
                        className="sp-timing-done-badge"
                        style={{
                          background: allGroupDone ? 'rgba(90,107,58,0.1)' : palette.cream,
                          color: allGroupDone ? palette.olive : palette.textMuted,
                        }}
                      >
                        {allGroupDone
                          ? <><Check size={11} strokeWidth={3} /> Done</>
                          : `${doneInGroup}/${group.length}`}
                      </div>
                    )}

                    <div className="sp-timing-chevron">
                      {isCollapsed ? <ChevronDown size={15} /> : <ChevronUp size={15} />}
                    </div>
                  </div>

                  {!isCollapsed && (
                    <>
                      <div className="sp-divider" />
                      <div className="sp-timing-body">
                        {group.length === 0 ? (
                          <p className="sp-timing-empty">No supplements here — add one above.</p>
                        ) : (
                          group.map(s => {
                            const taken = !!takenToday[s.id]
                            return (
                              <div className="sp-supp-row" key={s.id}>
                                <div
                                  className={`sp-check ${taken ? 'checked' : ''}`}
                                  onClick={() => toggleTaken(s.id)}
                                  title={taken ? 'Mark as not taken' : 'Mark as taken'}
                                >
                                  {taken && <Check size={13} color="#fff" strokeWidth={3} />}
                                </div>

                                <div className="sp-supp-info">
                                  <div
                                    className="sp-supp-name"
                                    style={{ textDecoration: taken ? 'line-through' : 'none', opacity: taken ? 0.5 : 1 }}
                                  >
                                    {s.name}
                                  </div>
                                  <div className="sp-supp-dose">{s.dose}</div>
                                </div>

                                <button
                                  className="sp-supp-del"
                                  onClick={() => handleDelete(s.id)}
                                  title="Remove supplement"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            )
                          })
                        )}
                      </div>
                    </>
                  )}
                </div>
              )
            })}
          </div>
        )}

      </div>
    </>
  )
}