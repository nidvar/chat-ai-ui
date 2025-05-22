<script setup lang="ts">
    import {ref} from 'vue';
    import { useUserStore } from '../stores/user';
    import { useRouter } from 'vue-router';
    import axios from 'axios';

    const userStore = useUserStore();
    const router = useRouter();

    const name = ref('');
    const email = ref('');
    const error = ref('');

    const createUser = async function(){
        if(!name.value || !email.value){
            error.value = 'name and email required';
            return;
        }
        error.value = '';
        try{
            const result = await axios.post(import.meta.env.VITE_API_URL + '/register-user', {
                name: name.value,
                email: email.value,
            });
            userStore.setUser({
                userId: result.data.userId,
                name: result.data.name
            });
            router.push('/chat');
        }catch(err){
            console.log(err)
        }
    };

    const toChat = function(){
        router.push('/chat');
    }
</script>

<template>
    <div class="box home-login">
        <h1>Gemini AI Chat</h1>
        <div v-if="userStore.name == null">
            <p>Login or create new user</p>
            <form  @submit.prevent="createUser">
                <input 
                    type="text"
                    v-model="name"
                    placeholder="name"
                />
                <br /><br />
                <input 
                    type="text"
                    v-model="email"
                    placeholder="email"
                /><br /><br />
                <button type="submit">LOGIN / CREATE</button>
            </form>
            <p>{{ error }}</p>
        </div>
        <div v-else>
            <p>You are already logged in.</p>
            <button @click="toChat">GO TO CHAT ROOM</button>
        </div>
    </div>
</template>