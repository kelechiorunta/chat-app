// components/Modal.js
// 'use client'
import { FaTimes } from 'react-icons/fa';
import Link from 'next/link';
import Router from 'next/navigation';
// import { useRouter } from 'next/router';

const Modal = ({ isOpen, onClose, title, children, footer }) => {
  // const router = useRouter();
  if (!isOpen) return null;

  return (
    <div className={`scaleIn fixed inset-0 m-auto flex items-center justify-center w-full bg-black bg-opacity-50 z-20 min-h-[520px]`}>
      <div className="bg-slate-900 min-h-[520px] text-white p-4 m-auto rounded shadow-lg w-auto transition-all z-50 xsm:max-[400px]:w-[350px] xsm:max-[400px]:mx-auto xsm:max-md:w-[90%] xsm:max-md:mx-auto xsm:max-lg:max-w-2/5 xsm:max-2xl:max-w-2/5">
    {/* //   className="bg-white m-auto max-w-lg mx-4 rounded-lg shadow-lg"> */}
        <div className="flex w-full justify-between items-center p-4 border-b border-gray-500">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button onClick={()=>{onClose()}} className="text-gray-500 hover:text-gray-700">
            <FaTimes />
          </button>
        </div>
        <div className="p-4 w-full">
          {children}
        </div>
        <div className="p-4 border-t border-gray-500">
          {footer}
        </div>
      </div>
    </div>
  );
};

// export default function Modal({ isOpen, onClose, children }) {
  
//     // const router = useRouter()
//     // const [isShow, setShow] = useState(show)
//     // const timerContext = useContext(SlideContext)
//     // const modalContextParams = useContext(ModalContext)

//     // const { isOpen, setOpen } = modalContextParams
    
//     // console.log(modalContextParams)

//     // const { timingId } = timerContext

//     // if (isOpen===false)  {
//     //     // router.refresh()
//     //      return null//children;
//     //  }

//   return (
//     <div className="fixed w-full mx-auto mt-1/2 inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//       <div className="bg-slate-900 w-full mt-[3.25%] m-auto text-white p-4 rounded shadow-lg transition-all z-50 md:w-4/5">
//         <button className="absolute top-2 right-2" >
//           <Link href='/' >&times;</Link>
//         </button>
//         <div style={{zIndex: '50'}} className='w-full z-50'>
//             {children}
//         </div>
//       </div>
//     </div>
//   );
// }

export default Modal;
