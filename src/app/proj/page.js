'use client'
import React from 'react'
import Photo from '@/app/components/Photo'
import { photos } from '../../../public/photos/photos'
import { testimonials } from '../@bio/(.)proj/page'
import ModalSlider from '../components/ModalSlider'


export default function page() {
    
  return (
    <div className='w-max m-auto z-50 '>
        <ModalSlider slides={photos} photos={photos} testimonials={testimonials}/>
    </div>
  )
}