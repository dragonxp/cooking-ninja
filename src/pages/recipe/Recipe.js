import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useTheme } from '../../hooks/useTheme'
import { projectFirestore } from '../../firebase/config'

//styles
import './Recipe.css'

export default function Recipe() {
	const [recipe, setRecipe] = useState(null)
	const [error, setError] = useState(null)
	const [isLoading, setIsLoading] = useState(false)
	const { mode } = useTheme()
	const { id } = useParams()

	useEffect(() => {
		setIsLoading(true)

		const unsub = projectFirestore.collection('recipes').doc(id).onSnapshot(doc => {
			setIsLoading(false)
			if (doc.exists) setRecipe(doc.data())
			else setError('Could not fetch that recipe')
		}, err => {
			setError(err.message)
			setIsLoading(false)
		})

		return () => unsub()
	}, [id])

	const handleUpdate = () => {
		projectFirestore.collection('recipes').doc(id).update({
			title: 'Something else Recipe'
		})
	}


	return (
		<div className={`recipe ${mode}`}>
			{error && <p className='error'>{error}</p>}
			{isLoading && <p className='loading'>Loading...</p>}
			{recipe && (
				<>
					<h2 className="page-title">{recipe.title}</h2>
					<p>Takes {recipe.cookingTime} to cook</p>
					<ul>
						{recipe.ingredients.map(ing => <li key={ing}>{ing}</li>)}
					</ul>
					<p className='method'>{recipe.method}</p>
					<button onClick={handleUpdate}>Update Title</button>
				</>
			)}
		</div>
	)
}