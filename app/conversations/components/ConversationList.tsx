"use client";
import { MdOutlineGroupAdd } from "react-icons/md";
import { FullConversationType } from "@/app/types";
import { Conversation, User } from "@prisma/client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import useConversation from "@/app/hooks/useConversation";
import clsx from "clsx";
import ConversationBox from "./ConversationBox";
import { GroupChatModal } from "@/app/components/GroupChatModal";
import { useSession } from "next-auth/react";
import { pusherClient } from "@/app/libs/pusher";
import { find } from "lodash";
import SettingsModal from "@/app/components/sidebar/SettingsModal";
import getCurrentuser from "@/app/actions/getCurrentUser";
import Avatar from "@/app/components/Avatar";

interface ConversationListProps {
  initialItems: FullConversationType[];
  users: User[];
  currentUser: User;
}
export const ConversationList: React.FC<ConversationListProps> = ({
  initialItems,
  users,
  currentUser,
}) => {
  const session = useSession();
  const [items, setItems] = useState(initialItems);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const [isOpenn, setIsOpen] = useState(false);

  const { isOpen, conversationId } = useConversation();

  const pusherKey = useMemo(() => {
    return session.data?.user?.email;
  }, [session.data?.user?.email]);

  useEffect(() => {
    if (!pusherKey) {
      return;
    }
    pusherClient.subscribe(pusherKey);

    const updateHandler = (conversation: FullConversationType) => {
      setItems((current) =>
        current.map((currentConversation) => {
          if (currentConversation.id === conversation.id) {
            return {
              ...currentConversation,
              messages: conversation.messages,
            };
          }

          return currentConversation;
        })
      );
    };

    const newHandler = (conversation: FullConversationType) => {
      setItems((current) => {
        if (find(current, { id: conversation.id })) {
          return current;
        }
        return [conversation, ...current];
      });
    };
    const removeHandler = (conversation: FullConversationType) => {
      setItems((current) => {
        return [...current.filter((convo) => convo.id !== conversation.id)];
      });

      if (conversationId === conversation.id) {
        router.push("/conversations");
      }
    };

    pusherClient.bind("conversation:new", newHandler);
    pusherClient.bind("conversation:update", updateHandler);
    pusherClient.bind("conversation:remove", removeHandler);

    return () => {
      pusherClient.unsubscribe(pusherKey);
      pusherClient.unbind("conversation:new", newHandler);
      pusherClient.unbind("conversation:update", updateHandler);
      pusherClient.unbind("conversation:remove", removeHandler);
    };
  }, [pusherKey, conversationId]);

  return (
    <>
      <GroupChatModal
        users={users}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <SettingsModal
        currentUser={currentUser}
        isOpen={isOpenn}
        onClose={() => setIsOpen(false)}
      />

      <aside
        className={clsx(
          `
    fixed
    inset-y-0
    pb-20
    lg:pb-0
    lg:left-20
    lg:w-80
    lg:block
    overflow-y-auto
    border-r
    border-gray-200
    `,
          isOpen ? "hidden" : "block w-full left-0"
        )}
      >
        <div className="px-5">
          <div className="flex justify-between mb-4 pt-4">
            
            
            <div
              onClick={() => setIsOpen(true)}
              className="cursor-pointer
                     hover:opacity-75
                       transition"
            >
              <Avatar user={currentUser} />
            </div>



            <div className="text-2xl font-bold pt-3.5 text-neutral-800">Messages </div>
            <div
              onClick={() => setIsModalOpen(true)}
              className="rounded-full 
                p-2
                bg-gray-100
                text-gray-600
                cursor-pointer
                hover:opacity-75
                transition"
            >
              <MdOutlineGroupAdd size={20} />
            </div>
          </div>
        <hr className="pb-4 border-gray-600 " />
          {items.map((item) => (
            <ConversationBox
              key={item.id}
              data={item}
              selected={conversationId === item.id}
            />
          ))}
        </div>
      </aside>
    </>
  );
};
