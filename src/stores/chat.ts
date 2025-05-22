import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';
import { useUserStore } from './user';

interface ChatMessage {
    message:string;
    reply:string;
}

interface FormattedMessage {
    role: 'user' | 'ai';
    content: string;
}

export const useChatStore = defineStore('chat', function(){
    const messages = ref<{ role: string; content: string; }[]>([]);
    const isLoading = ref(false);
    const userStore = useUserStore();
    const loadChatHistory = async function(){
        if(!userStore.userId){
            return
        }
        try{
            const result = await axios.post(import.meta.env.VITE_API_URL + '/get-messages', {
                userId: userStore.userId
            });
            result.data.messages.forEach((item:any)=>{
                messages.value.push({role: 'user', content: item.message});
                messages.value.push({role: 'ai',content: item.reply});
            })
        }catch(err){
            console.log(err);
        }
    };
    const sendMessage = async function(message:string){
        if(!message.trim() || !userStore.userId){
            return
        };
        messages.value.push({ role: 'user', content: message });
        try{
            isLoading.value = true;
            const result = await axios.post(import.meta.env.VITE_API_URL + '/chat', {
                message: message,
                userId: userStore.userId
            });
            messages.value.push({ role: 'ai', content: result.data.reply});
            isLoading.value = false;
            setTimeout(()=>{
                const scrollingElement = (document.scrollingElement || document.body);
                scrollingElement.scrollTop = scrollingElement.scrollHeight;
            },200);

        }catch(err){
            console.log(err);
            messages.value.push({ role: 'ai', content: 'ERROR'});
            isLoading.value = false;
        }
    }

    const clearHistory = function(){
        messages.value = [];
    }


    return {messages, isLoading, loadChatHistory, sendMessage, clearHistory}
});