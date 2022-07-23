import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { projectFirestore } from '../../firebase/config'

//styles
import './Create.css'

export default function Create() {
	const [title, setTitle] = useState('')
	const [cookingTime, setCookingTime] = useState('')
	const [method, setMethod] = useState('')
	const [ingredients, setIngredients] = useState([])
	const [newIngredient, setNewIngredient] = useState('')
	const ingredientInput = useRef(null)
	const navigate = useNavigate()



	const handleSubmit = async (e) => {
		e.preventDefault()
		const doc = { title, ingredients, method, cookingTime: cookingTime + ' minutes'}

		try {
			await projectFirestore.collection('recipes').add(doc)
			navigate('/')
		} catch (error) {
			console.log(error)
		}
	}

	const handleAdd = (e) => {
		e.preventDefault()
		const ing = newIngredient.trim()

		if (ing && !ingredients.includes(ing)) {
			setIngredients(prevIngredients => [...prevIngredients, ing])
		}

		setNewIngredient('')
		ingredientInput.current.focus()
	}

	return (
		<div className='create'>
			<h2 className='page-title'>Add a new Recipe</h2>
			<form onSubmit={handleSubmit}>
				<label>
					<span>Recipe Title:</span>
					<input 
						type="text" 
						onChange={(e) => setTitle(e.target.value)}
						value={title}
						required
					/>
				</label>
				<label>
					<span>Cooking time (minutes)</span>
					<input 
						type="number" 
						onChange={(e) => setCookingTime(e.target.value)}
						value={cookingTime}
						required
					/>
				</label>

				<label>
					<span>Recipe Ingredients:</span>
					<div className="ingredients">
						<input 
							type="text"
							onChange={(e) => setNewIngredient(e.target.value)}
							value={newIngredient}
							ref={ingredientInput}
						/>
						<button className='btn' onClick={handleAdd}>Add</button>
					</div>
				</label>
				<p>Current Ingredients: {ingredients.map(i => <em key={i}>{i}, </em>)}</p>

				<label>
					<span>Recipe Method:</span>
					<textarea 
						onChange={(e) => setMethod(e.target.value)}
						value={method}
						required
					/>
				</label>
				<button className='btn'>Submit</button>
			</form>
		</div>
	)
}