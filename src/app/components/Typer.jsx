'use client'
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

// const texts = ["Hello, World!", "Welcome to my website", "Enjoy your stay!"];

//import React from 'react'

export default function Typer({texts, time, speed}) {
    
        const [currentText, setCurrentText] = useState("");
        const [isDeleting, setIsDeleting] = useState(false);
        const [loopNum, setLoopNum] = useState(0);
        const [typingSpeed, setTypingSpeed] = useState(speed);
      
        useEffect(() => {
          const handleTyping = () => {
            const currentIndex = loopNum % texts.length;
            const fullText = texts[currentIndex];
      
            setCurrentText(
              isDeleting
                ? fullText.substring(0, currentText.length - 1)
                : fullText.substring(0, currentText.length + 1)
            );
      
            setTypingSpeed(isDeleting ? 150 : speed?speed:100);
      
            if (!isDeleting && currentText === fullText) {
              setTimeout(() => setIsDeleting(true), time?time:100);
            } else if (isDeleting && currentText === "") {
              setIsDeleting(false);
              setLoopNum(loopNum + 1);
            }
          };
      
          const typingTimer = setTimeout(handleTyping, typingSpeed);
          return () => clearTimeout(typingTimer);
        }, [currentText, isDeleting, loopNum, typingSpeed]);
      
        return (
          <div>
            {/* <h3>Read This:</h3> */}
          <div className='text-[16px] '
          style={{ display: 'inline', color: 'rgba(245,166,35,1)',  alignItems: 'center', height: '100%', width: '100%'}}>
            {/* <h1>Read This:</h1> */}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {currentText}
            </motion.span>
            <motion.span
            className='text-[16px]'
              initial={{ opacity: 1 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 1 }}
              style={{height: 'auto', display: 'inline-block'}}
            >
              {"|"}
            </motion.span>
          </div>
          </div>
        );
    }