<template>
  <div id="landing-page">

    <div class="hero">
      <h1>Connect Your Audience to All of Your Content with a Single Click</h1>
      <p>With Your Linktree Clone, you can create a personalized and easily customizable page, guiding your audience
        to your entire online world — articles, store, other social platforms, and more. All in one place.</p>
      <button>Get Started for Free</button>
    </div>

    <main>
      <section id="features">
        <h2 class="feature-headline">Why Choose Your Linktree Clone?</h2>
        <div class="feature">
          <img src="feature1.png" alt="Feature 1">
          <h3>Simple Yet Powerful</h3>
          <p>Create your link hub in minutes. No coding required. Our intuitive interface makes it easy to design,
            customize and update your linktree anytime you want.</p>
        </div>
        <div class="feature">
          <img src="feature2.png" alt="Feature 2">
          <h3>Customizable</h3>
          <p>Make your linktree as unique as you are. Choose from a variety of themes and styles, or even upload your
            own background image.</p>
        </div>
        <div class="feature">
          <img src="feature3.png" alt="Feature 3">
          <h3>Insightful Analytics</h3>
          <p>Understand your audience with our detailed analytics. Learn what content drives more clicks and optimize
            your linktree for better engagement.</p>
        </div>
      </section>
      <section id="cta">
        <h2>Ready to Simplify Your Online Presence?</h2>
        <p>Join the thousands of influencers, creators, businesses and more using Your Linktree Clone to connect their
          audience with their most important content.</p>
        <button>Get Started for Free</button>
      </section>
    </main>
  </div>
</template>

<script>

</script>

<style scoped>
#landing-page {

  background-color: #050505;
  color: #fafafa;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'Lato', sans-serif;
  padding: 20px;
  box-sizing: border-box;
  text-align: center;
}

#landing-page main {
  width: 75%;
}

#landing-page .hero {
  width: 75%;
  padding: 50px 0;
  background: url('hero-background.jpg') no-repeat center center;
  background-size: cover;
  color: #fafafa;
}

#landing-page h1 {
  font-size: 2.5em;
}

#landing-page p {
  font-size: 1.2em;
  line-height: 1.6em;
}

#features {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  padding: 50px 0;
}

.feature {
  width: 30%;
  margin: 20px;
}

.feature-headline {
  width: 100%;

  justify-content: center;
  flex-wrap: wrap;
  display: flex;
  text-align: center;
  margin-bottom: 50px;
}

#get-started {
  padding: 50px 0;
  background-color: #13201d;
  color: #fafafa;
}

#get-started button {
  font-size: 1.2em;
  padding: 15px 30px;
}

</style>