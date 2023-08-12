import getConversations from "../actions/getConversations"
import getCurrentuser from "../actions/getCurrentUser";
import getUsers from "../actions/getUsers";
import Sidebar from "../components/sidebar/Sidebar"
import { ConversationList } from "./components/ConversationList"

export default async function ConversationsLayout({children}:{
    children:React.ReactNode
}){
    const conversations = await getConversations();
    const users = await getUsers();
    const currentUser = await getCurrentuser();
    return (
        <Sidebar>
            <div className="h-full">
                <ConversationList initialItems={conversations} users={users} currentUser={currentUser!} />
                {children}

            </div>
        </Sidebar>
    )

} 



