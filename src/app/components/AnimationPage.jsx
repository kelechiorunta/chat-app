'use client'
import React, { useEffect } from 'react'
import Ball from './Ball'
import {gsap, ScrollTrigger} from 'gsap/all'
import {motion, stagger} from 'framer-motion'
import Typer from './Typer'
import TyperConnectz from './TyperConnectz'
import BallObject from './BallObject'
import Link from 'next/link'
import { FaSignInAlt, FaUser } from 'react-icons/fa'

export default function AnimationPage() {
    useEffect(() => {
        // Staggering the parent element
        gsap.fromTo('.authenticate', 
            {x: -1000, opacity: 0}, 
            {x: 0, opacity: 1, duration: 1, delay:5,}
        );
    
        // Staggering the child elements
        gsap.fromTo('.authenticate > *', 
            {opacity: 0, y: 50}, 
            {opacity: 1, y: 0, stagger: 5.5, duration: 1}
        );
    }, []);
    

  return (
    <div className='flex flex-col gap-y-4 items-center w-full'>
        <motion.h1 
         initial='hidden'
         animate='visible'
         variants={{hidden:{opacity:0, y:-100},
            visible: {opacity:1, y:200}
            }}
        transition= {{staggerChildren:0.5,}}
        // repeat: Infinity, 
        className='flex gap-x-2 text-4xl mx-auto justify-center'>
            <motion.span 
            className='connect' 
            variants={{hidden:{opacity:0, y:-100},
            visible: {opacity:1, y:0, transition: {stagger:0.5, }}}
        } >C</motion.span>
             <motion.span 
             className='connect' 
             variants={{hidden:{opacity:0, y:-100},
            visible: {opacity:1, y:0, transition: {stagger:0.5}}}
        } >O</motion.span>
             <motion.span
             className='connect' 
             variants={{hidden:{opacity:0, y:-100},
            visible: {opacity:1, y:0, transition: {stagger:0.5}}}
        } >N</motion.span>
             <motion.span
             className='connect' 
             variants={{hidden:{opacity:0, y:-100},
            visible: {opacity:1, y:0, transition: {stagger:0.5}}}
        } >N</motion.span>
             <motion.span
             className='connect' 
             variants={{hidden:{opacity:0, y:-100},
            visible: {opacity:1, y:0, transition: {stagger:0.5}}}
        } >E</motion.span>
             <motion.span
             className='connect' 
             variants={{hidden:{opacity:0, y:-100},
            visible: {opacity:1, y:0, transition: {stagger:0.5}}}
        } >C</motion.span>
             <motion.span
             className='connect' 
             variants={{hidden:{opacity:0, y:-100},
            visible: {opacity:1, y:0, transition: {stagger:0.5}}}
        } >T</motion.span>
             <motion.span
             className='connect'  
             variants={{hidden:{opacity:0, y:-100},
            visible: {opacity:1, y:0, transition: {stagger:0.5}}}
        } >Z</motion.span>
        </motion.h1>
        <motion.div
        className='title mx-auto text-5xl text-center px-2 flex justify-center xsm:max-[400px]:text-4xl xsm:max-[400px]:text-center'
        initial='hidden'
        animate='visible'
        variants={{hidden:{opacity:0, x:-100}, visible:{opacity:1, x:0, transition:{staggerChildren:2.0, delay:5}}}}>
            Connect Your World
        </motion.div>
        <motion.div 
        className='mx-auto flex justify-center gap-2 text-xl '
        initial='hidden'
        animate='visible'
        variants={{hidden:{opacity:0, x:-100}, visible:{opacity:1, x:0, transition:{staggerChildren:2.0, delay:5}}}}>
        Connecting with <TyperConnectz texts={["Friends", "Destiny", "Partners"]}/></motion.div>
        {/* <Ball/> */}
        <BallObject/>
        <div className='authenticate mt-12 flex gap-3'>
            <Link
            className='px-3 py-2  bg-[#3b82f6] text-white flex gap-x-2 items-center text-xl rounded-md w-max max-w-[300px]'
            href={'/signup'}>
                <FaSignInAlt fill='white' size={20}/>
                SIGN UP
            </Link>
            <Link
            className='px-3 py-2 bg-[#3b82f6] text-white flex gap-x-2 items-center text-xl rounded w-max max-w-[300px]'
            href={'/login'}>
                <FaUser size={20} fill='white'/>
                LOGIN
            </Link>
        </div>
    </div>
  )
}
