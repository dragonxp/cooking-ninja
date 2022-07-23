import { projectFirestore } from '../../firebase/config'
import { useEffect, useState } from 'react'

//styles
import './Home.css'

//components
import RecipeList from '../../components/RecipeList'

export default function Home() {
	const [data, setData] = useState(null)
	const [error, setError] = useState(null)
	const [isLoading, setIsLoading] = useState(false)

	console.log('test')

	useEffect(() => {
		setIsLoading(true)

		const unsub = projectFirestore.collection('recipes').onSnapshot(snapshot => {
			if (snapshot.empty) {
				setError('No recipes to load')
				setIsLoading(false)
			} else {
				let results = []
				snapshot.docs.forEach(doc => {
					results.push({ id: doc.id, ...doc.data() })
				})

				setData(results)
				setIsLoading(false)
			}
		}, (err) => {
			setError(err.message)
			setIsLoading(false)
		})

		return () => unsub()
	}, [])

	return (
		<div className='home'>
			{error && <p className='error'>{error}</p>}
			{isLoading && <p className='loading'>Loading...</p>}
			{data && <RecipeList recipes={data} />}
		</div>
	)
}