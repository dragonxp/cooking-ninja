import { useState, useEffect } from "react"

export function useFetch(url, method = 'GET') {
	const [data, setData] = useState(null)
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState(null)
	const [options, setOptions] = useState(null)

	const postData = (data) => {
		setOptions({
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(data)
		})
	}

	useEffect(() => {
		const controller = new AbortController()

		const fetchData = async (options) => {
			setIsLoading(true)

			try {
				const response = await fetch(url, {...options, signal: controller.signal })
				if (!response.ok) throw new Error(response.statusText)
				const json = await response.json()
				setIsLoading(false)
				setData(json)
				setError(null)
			} catch (err) {
				if (err.name === 'AbortError') console.log('The fetch was aborted')
				else {
					setIsLoading(false)
					setError('Couldnot fetch the data')
				}
			}

		}

		if (method === 'GET') fetchData()
		if (method === 'POST' && options) fetchData(options)

		return () => controller.abort()
	}, [url, options, method])

	return { data, isLoading, error, postData }
}