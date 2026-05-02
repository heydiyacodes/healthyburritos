import { useState } from 'react'
import { Leaf, ChevronRight, ChevronLeft, Check, User, Target, AlertCircle, Pill } from 'lucide-react'

const STEPS = ['welcome', 'basics', 'goals', 'health']

const GOALS = [
  { value: 'weight_loss', label: 'Weight Loss', desc: 'Burn fat, feel lighter', icon: '🔥' },
  { value: 'muscle_gain', label: 'Muscle Gain', desc: 'Build strength & mass', icon: '💪' },
  { value: 'maintenance', label: 'Maintenance', desc: 'Stay balanced & healthy', icon: '⚖️' },
]

const palette = {
  bg: '#f7f3ec',
  card: '#fffdf8',
  olive: '#5a6b3a',
  oliveLight: '#7a8f52',
  oliveMuted: '#a8b88a',
  cream: '#e8dfc8',
  creamDark: '#d4c8a8',
  brown: '#3d2e1a',
  brownMid: '#6b4f2e',
  brownLight: '#a08060',
  text: '#2c2318',
  textMuted: '#7a6a52',
  inputBg: '#f0ece2',
  inputBorder: '#c8b89a',
  error: '#b85c38',
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  .hb-modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(44, 35, 24, 0.55);
    backdrop-filter: blur(6px);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    font-family: 'DM Sans', sans-serif;
  }

  .hb-modal {
    background: ${palette.card};
    border-radius: 20px;
    width: 100%;
    max-width: 480px;
    overflow: hidden;
    box-shadow: 0 32px 80px rgba(44, 35, 24, 0.25), 0 0 0 1px rgba(168, 184, 138, 0.3);
    animation: modalIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  @keyframes modalIn {
    from { opacity: 0; transform: scale(0.92) translateY(16px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }

  .hb-header {
    background: linear-gradient(135deg, ${palette.olive} 0%, #3d5228 100%);
    padding: 1.75rem 2rem 1.5rem;
    position: relative;
    overflow: hidden;
  }

  .hb-header::before {
    content: '🌯';
    position: absolute;
    right: -10px;
    top: -10px;
    font-size: 90px;
    opacity: 0.08;
    transform: rotate(15deg);
  }

  .hb-header::after {
    content: '🥗';
    position: absolute;
    right: 60px;
    bottom: -20px;
    font-size: 70px;
    opacity: 0.06;
    transform: rotate(-10deg);
  }

  .hb-logo {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 0.75rem;
  }

  .hb-logo-text {
    color: #fff;
    font-family: 'Playfair Display', serif;
    font-size: 18px;
    font-weight: 600;
    letter-spacing: -0.3px;
  }

  .hb-header-title {
    color: rgba(255,255,255,0.95);
    font-family: 'Playfair Display', serif;
    font-size: 22px;
    font-weight: 400;
    font-style: italic;
    margin: 0 0 4px;
  }

  .hb-header-sub {
    color: rgba(255,255,255,0.6);
    font-size: 13px;
    font-weight: 300;
    margin: 0;
  }

  .hb-progress {
    display: flex;
    gap: 6px;
    margin-top: 1.25rem;
  }

  .hb-progress-dot {
    height: 3px;
    border-radius: 2px;
    background: rgba(255,255,255,0.25);
    flex: 1;
    transition: background 0.3s;
  }

  .hb-progress-dot.active {
    background: rgba(255,255,255,0.9);
  }

  .hb-body {
    padding: 1.75rem 2rem;
    min-height: 280px;
    display: flex;
    flex-direction: column;
  }

  .hb-step-title {
    display: flex;
    align-items: center;
    gap: 8px;
    color: ${palette.brown};
    font-size: 14px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    margin-bottom: 1.25rem;
  }

  .hb-field {
    margin-bottom: 1rem;
  }

  .hb-label {
    display: block;
    font-size: 12px;
    font-weight: 500;
    color: ${palette.textMuted};
    text-transform: uppercase;
    letter-spacing: 0.6px;
    margin-bottom: 6px;
  }

  .hb-input {
    width: 100%;
    background: ${palette.inputBg};
    border: 1px solid ${palette.inputBorder};
    border-radius: 10px;
    padding: 11px 14px;
    font-size: 14px;
    font-family: 'DM Sans', sans-serif;
    color: ${palette.text};
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    box-sizing: border-box;
    -webkit-appearance: none;
    appearance: none;
  }

  .hb-input:focus {
    border-color: ${palette.oliveLight};
    box-shadow: 0 0 0 3px rgba(122, 143, 82, 0.15);
  }

  .hb-input::placeholder {
    color: ${palette.brownLight};
    opacity: 0.7;
  }

  .hb-input.error {
    border-color: ${palette.error};
    box-shadow: 0 0 0 3px rgba(184, 92, 56, 0.12);
  }

  .hb-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .hb-textarea {
    resize: vertical;
    min-height: 80px;
  }

  .hb-goal-grid {
    display: grid;
    gap: 10px;
  }

  .hb-goal-card {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 13px 16px;
    border-radius: 12px;
    border: 1.5px solid ${palette.inputBorder};
    background: ${palette.inputBg};
    cursor: pointer;
    transition: all 0.2s;
  }

  .hb-goal-card:hover {
    border-color: ${palette.oliveMuted};
    background: #eee8d8;
  }

  .hb-goal-card.selected {
    border-color: ${palette.olive};
    background: rgba(90, 107, 58, 0.08);
  }

  .hb-goal-icon {
    font-size: 22px;
    line-height: 1;
    width: 36px;
    text-align: center;
  }

  .hb-goal-label {
    font-size: 14px;
    font-weight: 500;
    color: ${palette.text};
    margin: 0 0 2px;
  }

  .hb-goal-desc {
    font-size: 12px;
    color: ${palette.textMuted};
    margin: 0;
  }

  .hb-goal-check {
    margin-left: auto;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 1.5px solid ${palette.inputBorder};
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    flex-shrink: 0;
  }

  .hb-goal-card.selected .hb-goal-check {
    background: ${palette.olive};
    border-color: ${palette.olive};
  }

  .hb-welcome {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 0.5rem 0;
    flex: 1;
    justify-content: center;
  }

  .hb-welcome-emoji {
    font-size: 56px;
    margin-bottom: 1rem;
    animation: float 3s ease-in-out infinite;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-8px); }
  }

  .hb-welcome-title {
    font-family: 'Playfair Display', serif;
    font-size: 26px;
    color: ${palette.brown};
    margin: 0 0 10px;
    line-height: 1.3;
  }

  .hb-welcome-body {
    font-size: 14px;
    color: ${palette.textMuted};
    line-height: 1.7;
    max-width: 320px;
  }

  .hb-footer {
    padding: 0 2rem 1.75rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
  }

  .hb-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 11px 20px;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 500;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
  }

  .hb-btn-primary {
    background: ${palette.olive};
    color: #fff;
    flex: 1;
    justify-content: center;
  }

  .hb-btn-primary:hover {
    background: #3d5228;
    transform: translateY(-1px);
  }

  .hb-btn-primary:active {
    transform: translateY(0);
  }

  .hb-btn-ghost {
    background: transparent;
    color: ${palette.textMuted};
    padding: 11px 14px;
    border: 1px solid ${palette.inputBorder};
  }

  .hb-btn-ghost:hover {
    background: ${palette.inputBg};
    color: ${palette.text};
  }

  .hb-error-msg {
    font-size: 12px;
    color: ${palette.error};
    margin-top: 4px;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .hb-success {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    flex: 1;
    justify-content: center;
    gap: 12px;
  }

  .hb-success-ring {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: rgba(90, 107, 58, 0.12);
    display: flex;
    align-items: center;
    justify-content: center;
    animation: ringIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  @keyframes ringIn {
    from { transform: scale(0); opacity: 0; }
    to   { transform: scale(1); opacity: 1; }
  }

  .hb-hint {
    font-size: 11.5px;
    color: ${palette.brownLight};
    font-style: italic;
    text-align: center;
    margin-top: auto;
    padding-top: 0.75rem;
  }
`

export default function OnboardingModal({ onComplete }) {
  const [step, setStep] = useState(0)
  const [done, setDone] = useState(false)
  const [errors, setErrors] = useState({})

  const [form, setForm] = useState({
    name: '',
    age: '',
    weight: '',
    goal: '',
    allergies: '',
    medications: '',
  })

  const set = (key, val) => {
    setForm(f => ({ ...f, [key]: val }))
    setErrors(e => ({ ...e, [key]: '' }))
  }

  const validateStep = () => {
    const errs = {}
    if (step === 1) {
      if (!form.name.trim()) errs.name = 'Name is required'
      if (!form.age || form.age < 10 || form.age > 100) errs.age = 'Enter a valid age'
      if (!form.weight || form.weight < 20 || form.weight > 300) errs.weight = 'Enter a valid weight'
    }
    if (step === 2) {
      if (!form.goal) errs.goal = 'Please select a goal'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const next = () => {
    if (!validateStep()) return
    if (step < STEPS.length - 1) {
      setStep(s => s + 1)
    } else {
      const userData = {
        ...form,
        age: Number(form.age),
        weight: Number(form.weight),
        createdAt: new Date().toISOString(),
      }
      localStorage.setItem('hb_user', JSON.stringify(userData))
      setDone(true)
      setTimeout(() => onComplete?.(userData), 1200)
    }
  }

  const back = () => {
    setErrors({})
    setStep(s => s - 1)
  }

  const stepIndex = STEPS.indexOf(STEPS[step])

  return (
    <>
      <style>{css}</style>
      <div className="hb-modal-overlay">
        <div className="hb-modal">

          <div className="hb-header">
            <div className="hb-logo">
              <Leaf size={16} color="rgba(255,255,255,0.85)" />
              <span className="hb-logo-text">healthyburritos</span>
            </div>
            <p className="hb-header-title">
              {done ? 'You\'re all set!' : step === 0 ? 'Welcome aboard' : step === 1 ? 'Tell us about you' : step === 2 ? 'Set your goal' : 'Health details'}
            </p>
            <p className="hb-header-sub">Smart Nutrition Platform · Takes 60 seconds</p>
            <div className="hb-progress">
              {STEPS.map((_, i) => (
                <div key={i} className={`hb-progress-dot ${i <= stepIndex ? 'active' : ''}`} />
              ))}
            </div>
          </div>

          <div className="hb-body">
            {done ? (
              <div className="hb-success">
                <div className="hb-success-ring">
                  <Check size={28} color={palette.olive} strokeWidth={2.5} />
                </div>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: palette.brown, margin: 0 }}>
                  Welcome, {form.name.split(' ')[0]}!
                </p>
                <p style={{ fontSize: 13, color: palette.textMuted, margin: 0 }}>
                  Your profile is saved. Loading your dashboard…
                </p>
              </div>
            ) : step === 0 ? (
              <div className="hb-welcome">
                <div className="hb-welcome-emoji">🌯</div>
                <h2 className="hb-welcome-title">Your personal nutrition<br />companion</h2>
                <p className="hb-welcome-body">
                  Track meals, hit your macros, get smart food swaps, and discover daily burrito recipes — all tailored to you.
                </p>
              </div>
            ) : step === 1 ? (
              <>
                <div className="hb-step-title">
                  <User size={14} color={palette.olive} />
                  Basic info
                </div>

                <div className="hb-field">
                  <label className="hb-label">Full name</label>
                  <input
                    className={`hb-input ${errors.name ? 'error' : ''}`}
                    placeholder="Arjun Mehta"
                    value={form.name}
                    onChange={e => set('name', e.target.value)}
                  />
                  {errors.name && <p className="hb-error-msg"><AlertCircle size={11} />{errors.name}</p>}
                </div>

                <div className="hb-row">
                  <div className="hb-field">
                    <label className="hb-label">Age</label>
                    <input
                      className={`hb-input ${errors.age ? 'error' : ''}`}
                      type="number"
                      placeholder="25"
                      value={form.age}
                      onChange={e => set('age', e.target.value)}
                    />
                    {errors.age && <p className="hb-error-msg"><AlertCircle size={11} />{errors.age}</p>}
                  </div>
                  <div className="hb-field">
                    <label className="hb-label">Weight (kg)</label>
                    <input
                      className={`hb-input ${errors.weight ? 'error' : ''}`}
                      type="number"
                      placeholder="72"
                      value={form.weight}
                      onChange={e => set('weight', e.target.value)}
                    />
                    {errors.weight && <p className="hb-error-msg"><AlertCircle size={11} />{errors.weight}</p>}
                  </div>
                </div>
                <p className="hb-hint">Used only to personalise your calorie and macro targets.</p>
              </>
            ) : step === 2 ? (
              <>
                <div className="hb-step-title">
                  <Target size={14} color={palette.olive} />
                  Primary goal
                </div>
                <div className="hb-goal-grid">
                  {GOALS.map(g => (
                    <div
                      key={g.value}
                      className={`hb-goal-card ${form.goal === g.value ? 'selected' : ''}`}
                      onClick={() => set('goal', g.value)}
                    >
                      <span className="hb-goal-icon">{g.icon}</span>
                      <div>
                        <p className="hb-goal-label">{g.label}</p>
                        <p className="hb-goal-desc">{g.desc}</p>
                      </div>
                      <div className="hb-goal-check">
                        {form.goal === g.value && <Check size={11} color="#fff" strokeWidth={3} />}
                      </div>
                    </div>
                  ))}
                </div>
                {errors.goal && <p className="hb-error-msg" style={{ marginTop: 8 }}><AlertCircle size={11} />{errors.goal}</p>}
              </>
            ) : (
              <>
                <div className="hb-step-title">
                  <Pill size={14} color={palette.olive} />
                  Health details
                </div>

                <div className="hb-field">
                  <label className="hb-label">Allergies / intolerances</label>
                  <input
                    className="hb-input"
                    placeholder="e.g. peanuts, lactose, gluten (optional)"
                    value={form.allergies}
                    onChange={e => set('allergies', e.target.value)}
                  />
                </div>

                <div className="hb-field">
                  <label className="hb-label">Current medications</label>
                  <textarea
                    className={`hb-input hb-textarea`}
                    placeholder="e.g. Metformin 500mg, Vitamin D — or leave blank"
                    value={form.medications}
                    onChange={e => set('medications', e.target.value)}
                  />
                </div>
                <p className="hb-hint">This stays on your device only — never sent anywhere.</p>
              </>
            )}
          </div>

          {!done && (
            <div className="hb-footer">
              {step > 0 ? (
                <button className="hb-btn hb-btn-ghost" onClick={back}>
                  <ChevronLeft size={15} />
                  Back
                </button>
              ) : <div />}
              <button className="hb-btn hb-btn-primary" onClick={next}>
                {step === STEPS.length - 1 ? (
                  <><Check size={15} /> Save profile</>
                ) : (
                  <>{step === 0 ? 'Get started' : 'Continue'} <ChevronRight size={15} /></>
                )}
              </button>
            </div>
          )}

        </div>
      </div>
    </>
  )
}