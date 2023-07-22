<template>



  <div class="register">
    <h2>Register</h2>
    <form @submit.prevent="submitForm">
      <div>
        <label for="username">Username:</label>
        <input id="username" v-model="username" type="text" />
        <div v-if="errors.usernames" class="error">{{ errors.username }}</div>
      </div>
      <div>
        <label for="email">Email:</label>
        <input id="email" v-model="email" type="text" />
        <div v-if="errors.email" class="error">{{ errors.email }}</div>
      </div>
      <div>
        <label for="password">Password:</label>
        <input id="password" v-model="password" type="password" />
        <div v-if="errors.password" class="error">{{ errors.password }}</div>
      </div>
      <div>
        <button type="submit">Register</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import PocketBase from 'pocketbase'

const pb = new PocketBase(import.meta.env.VITE_API_URL );

    const username = ref('');
    const email = ref('');
    const password = ref('');
    const errors = reactive({
      username: '',
      email: '',
      password: '',
    });

    const submitForm = () => {
      // Reset previous errors
      errors.username = '';
      errors.email = '';
      errors.password = '';

      // Validate the form
      if (!username.value) {
        errors.username = 'Username is required.';
      }

      if (!email.value) {
        errors.email = 'Email is required.';
      }

      if (!password.value) {
        errors.password = 'Password is required.';
      }

      if (Object.values(errors).some(error => error !== '')) {
        return; // Don't submit if there are errors
      }

      // Submit register form
      fetch(import.meta.env.VITE_API_URL + '/api/collections/users/records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username.value,
          email: email.value,
          password: password.value,
          passwordConfirm: password.value,
        }),
      })
        .then(response => response.json())
        .then(async data => {
          if (data.code === 400) {
            // Set errors
            console.log(data);

            ['username', 'email', 'password'].forEach(field => {
              if (data.data[field]) {
                errors[field] = data.data[field].message;
              }
            });
          } else {

            // Login user
            const authData = await pb.collection('users').authWithPassword(
                username.value,
                password.value,
            );

            // validate login
            if(pb.authStore.isValid)
            {
              pb.authStore.exportToCookie({ httpOnly: false });
              // Redirect to dashboard
              window.location = '/dashboard';
            }
            else
            {
              // TODO: show error
              // reload page
             // window.location.reload();
            }
          }
        });
    };

    onMounted(async () => {
     // loadFromCookie(cookieHeader, key = 'pb_auth')
      console.log('loading from cookie')
      pb.authStore.loadFromCookie('pocketbase_auth')
      console.log(pb.authStore.isValid)

      // redirect to dashboard if logged in
      if (pb.authStore.isValid) {
        window.location = '/dashboard';
      }
    })
</script>

<style scoped>
.register {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
}

.register form div {
  margin-bottom: 15px;
}

.register form label {
  display: block;
  margin-bottom: 5px;
}

.register form input {
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 2px solid #78b087;
}

.register form .error {
  color: red;
  margin-top: 5px;
}

.register form button {
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  background-color: #78b087;
  color: white;
  cursor: pointer;
}
</style>
