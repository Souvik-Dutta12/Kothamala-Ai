"use client";;
import React from "react";
import { motion } from "motion/react";

export const Spotlight = ({
  gradientFirst = `radial-gradient(
    70% 70% at 50% 30%,
    rgba(59,130,246,0.35) 0%,
    rgba(59,130,246,0.10) 50%,
    rgba(59,130,246,0) 90%
  )
  
  `,
  translateY = -350,
  width = 300,
  height = 1400,
  duration = 7,

} = {}) => {
  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      transition={{
        duration: 1.5,
      }}
      className="pointer-events-none absolute inset-0 h-full w-full">
      <motion.div
        
        transition={{
          duration,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
        className="absolute -top-40 left-50 w-screen h-screen z-40 pointer-events-none">
        <div
          style={{
            transform: `translateY(${translateY}px) rotate(-45deg)`,
            background: gradientFirst,
            width: `${width}px`,
            height: `${height}px`,
          }}
          className={`absolute top-0 left-0`} />

       
      </motion.div>
      <motion.div
       
        transition={{
          duration,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
        className="absolute top-0 right-0 w-screen h-screen z-40 pointer-events-none">
       

        
      </motion.div>
    </motion.div>
  );
};
