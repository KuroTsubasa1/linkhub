<template>
  <link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&family=Open+Sans:wght@400;700&display=swap" rel="stylesheet">

  <div  id="app">
    <NuxtLayout>
    <NuxtPage />
    </NuxtLayout>
  </div>

</template>

<style>
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: 'Lato', sans-serif;
  color: #fafafa;
  background-color: #050505;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Open Sans', sans-serif;
}

button {
  font-family: 'Lato', sans-serif;
  background-color: #78b087;
  color: #fafafa;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #a8c79e;
}

a {
  color: #78b087;
  text-decoration: none;
}

form {
  background-color: #13201d;
  padding: 20px;
  border-radius: 5px;
}

input[type="text"], input[type="url"], input[type="password"], input[type="email"] {
  font-family: 'Lato', sans-serif;
  color: #fafafa;
  background-color: #050505;
  border: 2px solid #78b087;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
}

img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}

ul {
  list-style: none;
  padding: 0;
}

.dashboard, .public-page {
  display: flex;
  flex-direction: column;
  align-items: center;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

#app > :last-child {
  margin-top: auto;
}
</style>
