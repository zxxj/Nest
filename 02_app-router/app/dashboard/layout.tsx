"use client"

import Link from 'next/link'
import React, { useState } from 'react'

export default function DashboardLayout( { children } : { children: React.ReactNode}) {

	const [count, setCount] = useState(0)

	return (
		<div>
			<div>
				<Link href='/dashboard/about'>About</Link>
				<br />
				<Link href='/dashboard/setting'>Setting</Link>
			</div>

			<h1>DashboardLayout count: {count}</h1>

			<button onClick={() => setCount(count + 1)}>increment</button>
			{children}
		</div>
	)
}
