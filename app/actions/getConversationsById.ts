import prisma from "@/app/libs/prismadb";

import getCurrentuser from "./getCurrentUser";
import ConversationId from "../conversations/[conversationId]/page";

const getConversationById = async( conversationId:string ) => {
    try {
        const currentUser = await getCurrentuser();

        if(!currentUser?.email){
            return null
        }

        const conversation = await prisma.conversation.findUnique({
            where:{
                id:conversationId
            },
            include:{
                users:true
            }
        });

        return conversation;


    } catch (error:any) {
      return null;  
    }
};

export default getConversationById;