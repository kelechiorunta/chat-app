'use client';
import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import {motion} from 'framer-motion'
import './ball.scss'

export default function Ball() {
  const [ball, setBall] = useState([]);
  const elementRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      elementRef.current,
      { y: -500, opacity: 0, rotationX: 0, rotationY:0,   },
      { y: 0, opacity: 1, rotationX:360, rotationY:360, duration: 8, ease: "bounce" }
    );
  }, []);

  useEffect(() => {
    const circles = document.querySelectorAll('.circle');
    const circlesX = document.querySelectorAll('.circleX');
    const circlesY = document.querySelectorAll('.circleY');
    const container = document.querySelector('.mycontainer')
    // container.style.setProperty('animation', `animX 1s linear infinite`)
    let y=0;
    circlesX.forEach((circle, index) => {
        y++
      circle.style.setProperty('transform', `rotateX(${y * 30}deg)`);
      //circle.style.setProperty('transform-style', `preserve-3d`);
      circle.style.setProperty('border', `none`);
      circle.style.setProperty('animation', `animY ${y}s ease 1s alternate infinite`)
    });
    let n = 0
    circlesY.forEach((circle, index) => {
        n++
         circle.style.setProperty('transform', `rotateY(${n * 30}deg)`);
        //circle.style.setProperty('transform-style', `preserve-3d`);
        circle.style.setProperty('border', `none`);
          circle.style.setProperty('animation', `animX ${n}s ease 1s alternate infinite`)
      });
    setBall(circles);
  }, []);

  return (
    <div id="parent" ref={elementRef} className="rounded-full mx-auto w-max bg-white min-h-screen relative flex justify-center items-center">
      <motion.div
      initial='hidden'
      animate='visible'
      variants={{
        hidden:{x:-100, opacity:0},
        visible:{x:0, opacity:1, staggerChildren: 2.5, transition:{ duration:4}}
      }}
      
       className='relative w-auto flex justify-center items-center min-h-screen'>
            <motion.div variants={{
                hidden:{x:-100, opacity:0, rotationY:0},
                animate:{x:100, opacity:0, rotationY:360, transition:{stagger:0.5}}
            }}className="circle circleX absolute w-[150px] h-[150px] bg-red-500 hidden rounded-full"></motion.div>
            <motion.div variants={{
                hidden:{x:-100, opacity:1, rotationX:0},
                animate:{x:0, opacity:1, rotationX:360, transition:{stagger:0.5}}
            }}className="circle circleX absolute w-[150px] h-[150px] bg-blue-500 rounded-full"></motion.div>
            <motion.div variants={{
                hidden:{x:-100, opacity:1, rotationX:0},
                animate:{x:0, opacity:1, rotationX:360, transition:{stagger:0.5}}
            }}className="circle circleX absolute w-[150px] h-[150px] bg-green-500 rounded-full"></motion.div>
            <motion.div variants={{
                hidden:{x:-100, opacity:1, rotationX:0},
                animate:{x:0, opacity:1, rotationX:360, transition:{stagger:0.5}}
            }}className="circle circleX absolute w-[150px] h-[150px] bg-yellow-500 rounded-full"></motion.div>
            <motion.div variants={{
                hidden:{x:-100, opacity:1, rotationX:0},
                animate:{x:0, opacity:1, rotationX:360, transition:{stagger:0.5}}
            }}className="circle circleX absolute w-[150px] h-[150px] bg-purple-500 rounded-full"></motion.div>
            <motion.div variants={{
                hidden:{x:-100, opacity:1, rotationX:0},
                animate:{x:0, opacity:1, rotationX:360, transition:{stagger:0.5}}
            }}className="circle circleX absolute w-[150px] h-[150px] bg-pink-500 rounded-full"></motion.div>
            <motion.div variants={{
                hidden:{x:-100, opacity:1, rotationX:0},
                animate:{x:0, opacity:1, rotationX:360, transition:{stagger:0.5}}
            }}className="circle circleX absolute w-[150px] h-[150px] bg-orange-500 rounded-full"></motion.div>
            <motion.div variants={{
                hidden:{x:-100, opacity:1, rotationX:0},
                animate:{x:0, opacity:1, rotationX:360, transition:{stagger:0.5}}
            }}className="circle circleX absolute w-[150px] h-[150px] bg-teal-500 rounded-full"></motion.div>
            <motion.div variants={{
                hidden:{x:-100, opacity:1, rotationX:0},
                animate:{x:0, opacity:1, rotationX:360, transition:{stagger:0.5}}
            }}className="circle circleX absolute w-[150px] h-[150px] bg-indigo-500 rounded-full"></motion.div>
            <motion.div variants={{
                hidden:{x:-100, opacity:1, rotationX:0},
                animate:{x:0, opacity:1, rotationX:360, transition:{stagger:0.5}}
            }}className="circle circleX absolute w-[150px] h-[150px] bg-lime-500 rounded-full"></motion.div>
            <motion.div variants={{
                hidden:{x:-100, opacity:1, rotationX:0},
                animate:{x:0, opacity:1, rotationX:360, transition:{stagger:0.5}}
            }}className="circle circleX absolute w-[150px] h-[150px] bg-emerald-500 rounded-full"></motion.div>
            <motion.div variants={{
                hidden:{x:-100, opacity:1, rotationX:0},
                animate:{x:0, opacity:1, rotationX:360, transition:{stagger:0.5}}
            }}className="circle circleX absolute w-[150px] h-[150px] bg-cyan-500 rounded-full"></motion.div>

            <motion.div variants={{
                hidden:{x:-100, opacity:1, rotationX:0},
                animate:{x:0, opacity:1, rotationX:360, transition:{stagger:0.5}}
            }}className="circle circleY absolute w-[150px] h-[150px] bg-red-500 hidden rounded-full"></motion.div>
            <motion.div variants={{
                hidden:{x:-100, opacity:1, rotationX:0},
                animate:{x:0, opacity:1, rotationX:360, transition:{stagger:0.5}}
            }}className="circle circleY absolute w-[150px] h-[150px] bg-blue-500 rounded-full"></motion.div>
            <motion.div variants={{
                hidden:{x:-100, opacity:1, rotationX:0},
                animate:{x:0, opacity:1, rotationX:360, transition:{stagger:0.5}}
            }}className="circle circleY absolute w-[150px] h-[150px] bg-green-500 rounded-full"></motion.div>
            <motion.div variants={{
                hidden:{x:-100, opacity:1, rotationX:0},
                animate:{x:0, opacity:1, rotationX:360, transition:{stagger:0.5}}
            }}className="circle circleY absolute w-[150px] h-[150px] bg-yellow-500 rounded-full"></motion.div>
            <motion.div variants={{
                hidden:{x:-100, opacity:1, rotationX:0},
                animate:{x:0, opacity:1, rotationX:360, transition:{stagger:0.5}}
            }}className="circle circleY absolute w-[150px] h-[150px] bg-purple-500 rounded-full"></motion.div>
            <motion.div variants={{
                hidden:{x:-100, opacity:1, rotationX:0},
                animate:{x:0, opacity:1, rotationX:360, transition:{stagger:0.5}}
            }}className="circle circleY absolute w-[150px] h-[150px] bg-pink-500 rounded-full"></motion.div>
            <motion.div variants={{
                hidden:{x:-100, opacity:1, rotationX:0},
                animate:{x:0, opacity:1, rotationX:360, transition:{stagger:0.5}}
            }}className="circle circleY absolute w-[150px] h-[150px] bg-orange-500 rounded-full"></motion.div>
            <motion.div variants={{
                hidden:{x:-100, opacity:1, rotationX:0},
                animate:{x:0, opacity:1, rotationX:360, transition:{stagger:0.5}}
            }}className="circle circleY absolute w-[150px] h-[150px] bg-teal-500 rounded-full"></motion.div>
            <motion.div variants={{
                hidden:{x:-100, opacity:1, rotationX:0},
                animate:{x:0, opacity:1, rotationX:360, transition:{stagger:0.5}}
            }}className="circle circleY absolute w-[150px] h-[150px] bg-indigo-500 rounded-full"></motion.div>
            <motion.div variants={{
                hidden:{x:-100, opacity:1, rotationX:0},
                animate:{x:0, opacity:1, rotationX:360, transition:{stagger:0.5}}
            }}className="circle circleY absolute w-[150px] h-[150px] bg-lime-500 rounded-full"></motion.div>
            <motion.div variants={{
                hidden:{x:-100, opacity:1, rotationX:0},
                animate:{x:0, opacity:1, rotationX:360, transition:{stagger:0.5}}
            }}className="circle circleY absolute w-[150px] h-[150px] bg-emerald-500 rounded-full"></motion.div>
            <motion.div variants={{
                hidden:{x:-100, opacity:1, rotationX:0},
                animate:{x:0, opacity:1, rotationX:360, transition:{stagger:0.5}}
            }}className="circle circleY absolute w-[150px] h-[150px] bg-cyan-500 rounded-full"></motion.div>
      </motion.div>
      {/* <h1 className='text-black'>CONNECTZ</h1> */}
    </div>
  );
}
