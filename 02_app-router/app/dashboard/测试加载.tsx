
import React from 'react'

const getData = async () => {
	await new Promise(resolve => setTimeout(resolve, 3000))

	return {
		message: "hello, dashboard!"
	}
	
}

export default async function Page() {

	const { message } = await getData()

	return (
		<div>{message}</div>
	)
}
