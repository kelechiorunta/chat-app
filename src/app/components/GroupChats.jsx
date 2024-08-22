import { FaCircle } from "react-icons/fa";
import BallObject from "./BallObject";
import Render from "./Render";

// components/GroupChats.js
const GroupChats = () => {
    return (
      <div className="w-full min-h-[520px]">
        {/* <h2 className="text-2xl mb-4">Create Group Chats</h2> */}
        <Render>
        {(count, increment, users_data) => (
          <div className="flex divide-y-2 gap-2 w-full h-full items-center">
            {/* <div>
              <h1>Count: {count}</h1>
              <button onClick={increment} className="mt-2 p-2 bg-blue-500 text-white rounded">
                Increment
              </button>
            </div> */}
            <ul className="w-full ">
              {console.log(users_data)}
                {users_data && users_data.map(user => {
                  return (
                    <div 
                    key={user.userId}
                    className="w-[100%] gap-2 flex border rounded-md shadow-md px-2 py-4 bg-gradient-to-b from-slate-500 via-slate-200 to-slate-500">
                      <img className='flex items-center justify-center rounded-full shadow-md w-[50px] h-[50px] bg-black text-white'
                      src={user.picture} 
                      alt={user.nickname[0]}/>
                      
                      
                      <div className="flex justify-between items-center space-x-2 w-full">
                        <div className="flex flex-col w-full">
                          <p className="uppercase">{user.nickname}</p>
                          <p className="flex items-center gap-x-2 italic text-[15px]"><FaCircle className={`w-3 h-3 ${(user.isOnline == true) ? 'text-green-500' : 'text-gray-400'}`} />{user.isOnline? 'Online' : 'Offline'}</p>
                          <p className="text-sm text-gray-900 dark:text-gray-400 xsm:max-sm:float-none xsm:max-sm:ml-0">{user && user.time? user?.time.toDate().toLocaleTimeString() : ''}</p>
                        </div>
                        
                        <div className="flex items-center gap-x-2 w-full ">
                          <button className="w-full p-2 text-white bg-gradient-to-t rounded-md shadow-xl from-blue-600 via-blue-400 to-blue-600">Join</button>
                          {/* <button className="w-full">Disconnected</button> */}
                        </div>
                      </div>
                      {/* <p></p> */}
                    </div>
                  )
                })}
            </ul>
          </div>
        )}
      </Render>
        
        {/* Add your group chats creation form or content here */}
      </div>
    );
  };
  
  export default GroupChats;
  