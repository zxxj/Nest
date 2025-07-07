import React, { use } from 'react'

const getData = async () => {
	await new Promise(resolve => setTimeout(resolve, 3000))

	return {
		message: "hello, setting!"
	}
}

// 如果想单独对setting页面实现一个loading效果的话,可以在setting文件夹下新建一个loading文件
export default function Setting() {
	const { message } = use(getData())
	
	return (
		<div>{ message }</div>
	)
}
