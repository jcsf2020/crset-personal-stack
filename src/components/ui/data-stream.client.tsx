'use client'
import dynamic from 'next/dynamic'

export const DataStream = dynamic(() => import('./data-stream'), { ssr: false })
export default DataStream
