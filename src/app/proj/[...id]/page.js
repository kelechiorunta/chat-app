import React from 'react'
import Photo from '@/app/components/Photo'
import { photos } from '../../../../public/photos/photos'
import Modal from '@/app/components/Modal'

export default function page({params}) {
    const {id} = params
    const photo = photos.find((p)=>{return p.id == id})
  return (
    <div className='w-full m-auto z-50'>
      {/* <Modal isOpen={true}> */}
        <Photo picture={photo}/>
      {/* </Modal>  */}
    </div>
  )
}
