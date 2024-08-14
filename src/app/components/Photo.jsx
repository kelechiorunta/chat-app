'use client'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { motion } from 'framer-motion'

export default function Photo({picture, testimonial}) {
  return (
    <div className='w-full mx-auto shadow-md rounded flex flex-col items-start p-8 xsm:max-[400px]:w-auto xsm:max-md:w-4/5 xsm:max-md:mx-auto xsm:max-md:-ml-2'>
        { (picture && testimonial)?
        <>
        <ul className='flex  justify-start items-start flex-wrap gap-x-2'>
          {picture && picture.pic.map((i, index)=> 
          <div className='overflow-hidden rounded-full border-4 border-gray-500 w-[100px] h-[100px] '>
          <Link href={`${testimonial && testimonial.links[index]}`}
             className='imageIn rotateIn w-[100px] h-[100px]' key={i}>
            <Image className={`rotateIn bg-center w-[100px] h-[100px] mx-auto bg-cover rounded-full shadow-md`}
              src={i}
              alt={`pic ${i}`}/>
          </Link>
          </div>)}
        </ul>
        <p className='text-left t<ext-[16px] flex flex-col py-4'>{testimonial && testimonial.topic} <motion.small>{testimonial && testimonial.message
         || <motion.ul 
          initial='hidden'
          animate='visible'
          variants={{visible: {
            opacity: 1,
            x: 0,
            transition: {
              staggerChildren: 0.2, // Staggering the children
            },
          }, hidden: { opacity: 0, x: '100%' },}}
           className='flex gap-2 flex-wrap'>
          {testimonial.icon.map(i=>{
          return (
          <motion.li
            variants={{
              visible: { opacity: 1, x: 0 },
              hidden: { opacity: 0, x: 20 },
            }}
            transition={{ duration: 2.5, stagger:0.5 }} // Duration for each child animation
            >
              <Link href={'/'}>{i}</Link>
           </motion.li>
           )})}</motion.ul>}</motion.small></p>
        <ul className='text-left text-[16px] flex flex-col'>LINKS {testimonial && testimonial.links.map(i=>{return <Link href={`${i}`}><small>{i}</small></Link> })}</ul>
        </>
        : <h1>Nothing</h1>
        }
         {/* || {testimonial && testimonial.videos.map(v=>{return <video className="h-[198px] object-cover " src={v} autoPlay loop playsInline muted></video>})}</ul> */}
    </div>
  )
}
