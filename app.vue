<template>
  <div id="app">
    <Head>
      <Link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&family=Open+Sans:wght@400;700&display=swap"
      />
    </Head>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style>
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

#app > :last-child {
  margin-top: auto;
}
</style>
