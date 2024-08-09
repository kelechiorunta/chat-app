'use client'
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Photo from './Photo';
import { FaArrowLeft, FaArrowRight, FaArrowCircleRight, FaArrowAltCircleLeft, FaFastBackward, FaFastForward } from 'react-icons/fa'
import Image from 'next/image';
import { photos } from '../../../public/photos/photos';
import { testimonials } from '../@bio/(.)proj/[...id]/page';

export default function ModalSlider({slides, children}) {

  const [slide, setSlide] = useState(0);
  const [photo, setPhoto] = useState(null)
  const [testimonial, setTestimonial] = useState(null)
  const [direction, setDirection] = useState(1); // 1 for forward, -1 for backward
  const [prevSlide, setPrevSlide] = useState(0); // Track the previous slide index

  const moveSlideForward = () => {
    setDirection(1);
    setPrevSlide(slide);
    setSlide((n) => (n + 1) % slides.length);
  };

  const moveSlideBackward = () => {
    setDirection(-1);
    setPrevSlide(slide);
    setSlide((n) => (n - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const timerId = setTimeout(() => {
      direction === 1 ? moveSlideForward() : moveSlideBackward();
    }, 10000); // Slide changes every 3 seconds

    setPhoto(photos.find((p)=>{return p.id == slide}))
    setTestimonial(testimonials.find((t)=>{return t.id == slide}))
    return () => {
      clearTimeout(timerId);
    };
  }, [slide, direction]);

  

//   const staggerVariant = {
//     hidden:{x: '100%', opacity: 0}, 
//     visible:{x: '0',  opacity:1, transition: {duration: 0.8}},
// }

  return (
    <div className='slideContainer overflow-hidden px-2 py-2 flex flex-col w-full items-center justify-start gap-x-2 bg-black text-white
            border border-b-amber-900 rounded-xl text-xl '>
      <div className='flex relative mx-auto w-full'>
        <nav className=' text-white flex justify-between z-20'>
        <button className='rounded p-4 h-max my-auto bg-gray-600' onClick={moveSlideForward}><FaFastBackward size={20} fill='white'/></button>
            
        <div className="rounded-xl xsm:max-[400px]:max-w-[300px] xsm:max-sm:min-h-[300px] w-[500px] h-[400px]" style={{ overflow: 'hidden', position: 'relative'}}>
            <AnimatePresence initial={false} custom={direction}>
            {slides && slides.map((slidepic, index) => (
                (index === slide || index === prevSlide) && (
                <motion.div
                className='rounded-xl w-full xsm:max-[400px]:max-w-[300px] xsm:max-sm:min-h-[300px] md:max-xl:h-[400px] xl:max-2xl:h-[400px]'
                    key={index}
                    initial={{ x: index === slide ? (direction === 1 ? '100%' : '-100%') : (direction === 1 ? '-100%' : '100%')}}
                    animate={{ x: index === slide ? 0 : (direction === 1 ? '-100%' : '100%') }}
                    exit={{ x: index === slide ? (direction === 1 ? '-100%' : '100%') : (direction === 1 ? '-100%' : '100%')}}
                    transition={{ duration: 0.5 }}
                    style={{ position: 'absolute', width:'100%' }}
                >
                    <Photo picture={photos && photos[slidepic.id - 1]} testimonial={testimonials && testimonials[slidepic.id -1]}/>
                </motion.div>
                )
            ))}
           </AnimatePresence> 
      </div>
      <button className='rounded h-max my-auto p-4 bg-gray-600'  onClick={moveSlideBackward}><FaFastForward size={20} fill='white'/></button>
      </nav>
    </div>
</div> 
  );
}