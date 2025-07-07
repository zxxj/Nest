
"use client"

import React from 'react'

export default function page() {

	const [error, setError] = React.useState(false)

	const handleGetError = () => {
		setError(true)
	}
	return (
		<div>
			{ error ? Error() :  <button onClick={handleGetError}>GetError</button>}
		</div>
	)
}
