'use client'
import { useState } from 'react';
import Modal from '@/app/components/Modal';
import { Gi3dGlasses } from 'react-icons/gi'
import { FaCss3Alt, FaHtml5, FaJava, FaJs, FaNodeJs, FaPlus, FaReact } from 'react-icons/fa';
import Photo from '@/app/components/Photo'
import { photos } from '../../../../public/photos/photos';
import { useRouter } from 'next/navigation';

import { FaTruck, FaSuperpowers, FaUser } from 'react-icons/fa'
import ModalSlider from '@/app/components/ModalSlider';
import Typer from '@/app/components/Typer';

const comments = [`I am a willing and open-minded learner who loves to approach solutions with analytical thinking.`,
`I love inspirational quotes and messages from Christian messages, fellow colleagues as well as mentors.`,
`I am a good communicator, willing to share new ideas and projects with the public, and I am open to advice and recommendations.`]

export const testimonials = [{id:1, message: `Hello, I'm Kelechi. I am an experienced
                              frontend developer with four years of working experience at AppWorld Inc.
                              I am open to freelancing, remote jobs, and collaboration.`,
                              topic:'INTRODUCTION', videos:[], links:['https://www.linkedin.com/in/kelechiorunta1/'], client:'Olabode Ajayi', company:'Logistics Manager | Tolz', 
                              icon: <FaTruck size={50} fill='white'/>},
                              {id:2, message: `Some of my recent projects are on the links below`,
                              topic:'RECENT PROJECTS', videos:[], 
                              links:['https://cocheriderevamped-ui.vercel.app/', 
                              'https://laundry-app-hazel.vercel.app/', 
                              'https://rotating-cube-demo-app.vercel.app/',
                              'https://bally.vercel.app/'],
                               client:'Freedom Nuagbe', company:'Supply Chain Manager | PCMN',
                              icon: <FaSuperpowers size={50} fill='white'/>},
                              {id:3, message: ``,
                              topic:'TECH STACKS', links:[], videos:[]//['https://www.cerahq.com/home_hero.m4v',]
                              ,client:'Femi Olobayo', company:'Logistics Manager | Adcem Healthcare',
                              icon: [<FaUser size={50} fill='white'/>, 
                              <FaSuperpowers size={50} fill='white'/>, 
                              <FaTruck size={50} fill='white'/>,
                              <FaReact size={50} fill='white'/>,
                              <FaHtml5 size={50} fill='white'/>, 
                              <FaCss3Alt size={50} fill='white'/>,
                              <FaJs size={50} fill='white'/>,
                              <FaNodeJs size={50} fill='white'/>]},
                              {id:4, message: <Typer texts={comments}/>,
                              topic:'FEW FACTS ABOUT ME', videos:[], links:['https://www.linkedin.com/in/kelechiorunta1/'], client:'Olabode Ajayi', company:'Logistics Manager | Tolz', 
                              icon: <FaTruck size={50} fill='white'/>},]


const InterceptingPage = () => {
  const router = useRouter()

  const [isModalOpen, setIsModalOpen] = useState(true);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {setIsModalOpen(false); router.back()};

  return (
    <div className="flex items-center justify-center h-screen bg-transparent">
      {/* <button
        onClick={openModal}
        className="p-4 bg-blue-500 text-white rounded-lg flex items-center hover:bg-blue-600"
      >
        <FaPlus className="mr-2" />
        Open Modal
      </button> */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="ABOUT THE DEVELOPER"
        footer={
          <div className="flex justify-end">
            <button
              onClick={()=>{closeModal();}}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Close
            </button>
          </div>
        }
      >
        <>
        {/* <video className="h-[198px] object-cover " src='https://www.cerahq.com/home_hero.m4v' autoPlay loop playsInline muted></video> */}
        <ModalSlider slides={photos} photos={photos} testimonials={testimonials}/>
        </>
      </Modal>
    </div>
  );
};

export default InterceptingPage;
