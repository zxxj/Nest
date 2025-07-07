"use client"  // 错误组件必须是客户端组件
import { useEffect } from "react"


// 有时错误只是暂时的,只需要重试就可以解决问题,所以nextjs会在error.tsx导出的组件中传入reset函数,帮助尝试从错误中恢复.该函数会触发重新渲染错误边界里面的内容,如果成功,会替换展示重新渲染的内容
export default function Error({ error, reset }: { error: Error & { digest?: string}, reset: () => void}) {

	useEffect(() => {
		console.log(error)
	}, [error])

	return(
		<div>
			<h2>error</h2>
			<button onClick={() => reset()}>try again</button>
		</div>
	)
}

