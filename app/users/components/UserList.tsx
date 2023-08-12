'use client'

import { User } from "@prisma/client"
import UserBox from "./UserBox"
import { data } from "autoprefixer"
import { useState } from "react";
import SettingsModal from "@/app/components/sidebar/SettingsModal";
import Avatar from "@/app/components/Avatar";

interface UserListProps{
    items:User[];
    currentUser:User
};

const UserList: React.FC<UserListProps> =  ({items,currentUser}) => {
    const [isOpenn, setIsOpen] = useState(false);
  return (
    <>
     <SettingsModal
        currentUser={currentUser}
        isOpen={isOpenn}
        onClose={() => setIsOpen(false)}
      />
    <aside className="fixed
    inset-y-0
    pb-20
    lg:pb-0
    lg:left-20
    lg:w-80
    lg:block
    overflow-y-auto
    border-r
    border-gray-200
    block
    w-full
    left-0"  >
        <div className="px-5">
            <div className="flex items-center justify-between mb-4 pt-4 " >
                <div className="text-2xl
                font-bold
                text-neutral-800 
                py-4  " >
                    People
                </div>
                <div
              onClick={() => setIsOpen(true)}
              className="cursor-pointer
                     hover:opacity-75
                       transition"
            >
              <Avatar user={currentUser} />
            </div>

            </div>

            <hr className="pb-2 mt-1 border-gray-600 " />

            {items.map((item) => (
                <UserBox key={item.id} data={item}/>
            ))}


        </div>

    </aside>
    </>
  )
}

export default UserList