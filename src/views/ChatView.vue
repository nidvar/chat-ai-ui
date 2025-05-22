<script setup lang="ts">
import { onMounted, nextTick } from 'vue';
import { useUserStore } from '../stores/user';
import { useChatStore } from '../stores/chat';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const logout = function(){
    chatStore.clearHistory();
    userStore.logout();
    router.push('/');
}

const userStore = useUserStore();
const chatStore = useChatStore();

const userQuestion = ref('');

const noUser = ref('Please login');

const askQuestion = function(){
    chatStore.sendMessage(userQuestion.value);
    userQuestion.value = '';
    setTimeout(()=>{scrollToBottom();},200)
}

onMounted(()=>{
    chatStore.loadChatHistory().then(()=>{
        scrollToBottom();
        noUser.value = userStore.name || 'Please login';
    });
});

const scrollToBottom = function(){
    const scrollingElement = (document.scrollingElement || document.body);
    scrollingElement.scrollTop = scrollingElement.scrollHeight;
}

nextTick(()=>{
    scrollToBottom();
})

</script>
<template>
    <div class="chat">
        <h3>{{ noUser }}</h3>
        <div v-if="noUser != 'Please login'">
            <div v-for="message in chatStore.messages">
                <p v-if="message.role == 'user'" class="box user">
                    {{ message.content }}
                </p>
                <p v-else class="box ai">
                    {{ message.content }}
                </p>
            </div>
            <p v-if="chatStore.isLoading">.....Loading</p>
            <div class="question-box flex">
                <div class="ask">
                    <input type="text" v-model="userQuestion" class="chat-input"/>
                    <button @click="askQuestion">ASK</button>
                </div>
                <div class="logout">
                    <button @click="logout">LOGOUT</button>
                </div>
            </div>
        </div>
        <div v-else>
            <button v-if="noUser == 'Please login'" @click="logout">BACK</button>
        </div>
    </div>
</template>