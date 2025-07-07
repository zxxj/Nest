import React, { use } from 'react'

const getData = async () => {
	await new Promise((resolve) => setTimeout(resolve, 3000))

	return {
		message: "hello, about!"
	}
}

export default function About() {

	// 实现loading效果也不一定非要使用async,也可以使用use函数
	const {message} = use(getData())

	return (
		<div>{message}</div>
	)
}
