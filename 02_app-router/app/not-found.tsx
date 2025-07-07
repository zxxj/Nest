import Link from 'next/link'
import React from 'react'

export default function NotFound() {
	return (
		<div>
			<h2>自定义NotFound</h2>
			<Link href='/'>返回首页</Link>
		</div>
	)
}
