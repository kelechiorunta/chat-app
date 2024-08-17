import React from 'react'
import './ball.scss'
import {motion} from 'framer-motion'
import { useRef, useEffect } from 'react';
import { gsap } from 'gsap/all';

export default function BallObject() {

    const elementRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      elementRef.current,
      { y: -500, opacity: 1,   },
      { y: 100, opacity: 1, duration: 8, ease: "bounce" }
    );
  }, []);

    const ballVariant = {
        // hidden:{x:-100, opacity:1, },
        // animate:{x:100, opacity:1, transition:{stagger:0.5}}
    }
  return (
    <div ref={elementRef} class="container">
    <motion.div
    initial='hidden'
    animate='visible'
    variants={{
      hidden:{y:-100, opacity:1},
      visible:{y:100, opacity:1, staggerChildren: 2.5, transition:{ duration:4}}
    }}
    class="parentball">
        <motion.div variants={ballVariant} class="ball shadow-md  rounded-full inset border-[#3b82f6] "></motion.div>
        <motion.div variants={ballVariant} class="ball shadow-md  rounded-full inset border-[#3b82f6] "></motion.div>
        <motion.div variants={ballVariant} class="ball shadow-md  rounded-full inset border-[#3b82f6] "></motion.div>
        <motion.div variants={ballVariant} class="ball shadow-md  rounded-full inset border-[#3b82f6] "></motion.div>
        <motion.div variants={ballVariant} class="ball shadow-md  rounded-full inset border-[#3b82f6] "></motion.div>
        <motion.div variants={ballVariant} class="ball shadow-md  rounded-full inset border-[#3b82f6] "></motion.div>
        <motion.div variants={ballVariant} class="ball shadow-md  rounded-full inset border-[#3b82f6] "></motion.div>
        <motion.div variants={ballVariant} class="ball shadow-md  rounded-full inset border-[#3b82f6] "></motion.div>
        <motion.div variants={ballVariant} class="ball shadow-md  rounded-full inset border-[#3b82f6] "></motion.div>
        <motion.div variants={ballVariant} class="ball shadow-md  rounded-full inset border-[#3b82f6] "></motion.div>
        <motion.div variants={ballVariant} class="ball shadow-md  rounded-full inset border-[#3b82f6] "></motion.div>
        <motion.div variants={ballVariant} class="ball shadow-md  rounded-full inset border-[#3b82f6] "></motion.div>
    </motion.div>
    </div>
  )
}
