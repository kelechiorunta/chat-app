import React from 'react'

export default function MyChatPage({params}) {
  // const { id } = params
  return (
    <div className='bg-green-500 text-white'>
      <h1>MyChatP</h1>
      <p>{params && params.id} is here</p>
    </div>
  )
}
