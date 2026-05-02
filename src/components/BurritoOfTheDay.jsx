// src/components/BurritoOfTheDay.jsx
const RECIPES = [
  {
    name: "Rajma Burrito",
    tag: "High Protein · Vegetarian",
    kcal: 420,
    ingredients: ["1 cup cooked rajma", "1 large roti/wrap", "2 tbsp onion chopped",
      "1 tsp cumin", "2 tbsp curd", "Coriander, salt, chilli flakes"],
    steps: ["Mash rajma lightly with cumin and chilli.", "Warm roti. Spread curd.",
      "Add rajma, onion, coriander.", "Roll tight. Toast on tawa 1 min."]
  },
  {
    name: "Paneer Tikka Wrap",
    tag: "High Protein · Quick",
    kcal: 380,
    ingredients: ["100g paneer cubed", "1 wrap/roti", "1 tsp chaat masala",
      "2 tbsp hung curd", "Bell pepper strips", "Mint chutney"],
    steps: ["Mix paneer with curd + chaat masala.", "Sauté 3 min on high heat.",
      "Spread chutney on wrap.", "Add paneer + peppers. Roll and serve."]
  },
  {
    name: "Egg Bhurji Burrito",
    tag: "Quick · Budget",
    kcal: 310,
    ingredients: ["2 eggs", "1 roti/wrap", "1 small onion", "1 tomato",
      "Green chilli", "Turmeric, salt, coriander"],
    steps: ["Scramble eggs with onion, tomato, chilli.", "Season with turmeric + salt.",
      "Warm roti.", "Add bhurji, roll. Done in 8 min."]
  },
  {
    name: "Aloo Sabzi Wrap",
    tag: "Vegan · Comfort",
    kcal: 340,
    ingredients: ["1 medium potato boiled", "1 roti", "Jeera, mustard seeds",
      "Green chutney", "Onion rings", "Lemon juice"],
    steps: ["Mash potato with jeera + mustard tadka.", "Add lemon + salt.",
      "Spread chutney on roti.", "Add aloo mix + onion rings. Wrap."]
  },
  {
    name: "Chana Masala Burrito",
    tag: "High Fiber · Filling",
    kcal: 390,
    ingredients: ["1 cup canned/boiled chana", "1 wrap", "1 tsp amchur",
      "Tomato + onion chopped", "Coriander", "Green chilli"],
    steps: ["Sauté onion + tomato 3 min.", "Add chana + amchur + chilli.",
      "Cook 5 min till dry.", "Fill in wrap. Roll tight."]
  },
]

export default function BurritoOfTheDay() {
  const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000)
  const recipe = RECIPES[dayOfYear % RECIPES.length]

  return (
    <div style={{ background: '#fdf6ec', border: '0.5px solid #c8b89a',
      borderRadius: 12, padding: '1.25rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ fontSize: 11, color: '#7a6a52', margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: 1 }}>
            Today's Burrito Suggestion
          </p>
          <h2 style={{ margin: 0, fontSize: 20, color: '#3a2e1e' }}>{recipe.name}</h2>
          <span style={{ fontSize: 12, color: '#7a6a52' }}>{recipe.tag} · {recipe.kcal} kcal</span>
        </div>
        <div style={{ fontSize: 36 }}>🌯</div>
      </div>
      <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <p style={{ fontSize: 12, fontWeight: 500, color: '#5a4a32', margin: '0 0 6px' }}>Ingredients</p>
          <ul style={{ margin: 0, padding: '0 0 0 1rem', fontSize: 13, color: '#3a2e1e', lineHeight: 1.8 }}>
            {recipe.ingredients.map((i, idx) => <li key={idx}>{i}</li>)}
          </ul>
        </div>
        <div>
          <p style={{ fontSize: 12, fontWeight: 500, color: '#5a4a32', margin: '0 0 6px' }}>Steps</p>
          <ol style={{ margin: 0, padding: '0 0 0 1rem', fontSize: 13, color: '#3a2e1e', lineHeight: 1.8 }}>
            {recipe.steps.map((s, idx) => <li key={idx}>{s}</li>)}
          </ol>
        </div>
      </div>
    </div>
  )
}