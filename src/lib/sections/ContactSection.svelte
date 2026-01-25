<script context="module">
  import { cubicOut } from "svelte/easing";
</script>

<!--
  CONTACT SECTION
  Final section with Rinnegan theme and contact info
-->
<script lang="ts">
  import { onMount } from "svelte";
  import {
    eyeEvolution,
    currentSection,
    visitedSections,
    rinneganMerged,
  } from "$lib/stores";
  import SharinganEye from "$lib/components/SharinganEye.svelte";
  import { fade, fly } from "svelte/transition";
  import { tick } from "svelte";
  import dattebayoSound from "$lib/assets/dattebayo.mp3";
  import chakraSound from "$lib/assets/chakra-nature.mp3";
  import narutoFace from "$lib/assets/naruto-face.png";
  import rinneganSvg from "$lib/assets/Rinnegan_Sasuke.svg";
  import sasukeMangekyouSvg from "$lib/assets/Sasuke_Mangekyou.svg";

  // Custom Transition for Scroll Opening
  function scrollUnroll(
    node: HTMLElement,
    { delay = 0, duration = 400, easing = cubicOut },
  ) {
    return {
      delay,
      duration,
      easing,
      css: (t: number) => `
        transform: scaleY(${t});
        transform-origin: center;
        opacity: ${t};
      `,
    };
  }

  let sectionRef: HTMLElement;
  let isVisible = false;

  const contactInfo = {
    email: "rishabhshukla092@gmail.com",
    linkedin: "linkedin.com/in/rishabhbshukla",
    location: "Mumbai, India",
    subject: "Project Inquiry / Collaboration",
    body: "Hi Rishabh,\n\nI was impressed by your portfolio and would like to discuss a potential collaboration.\n\nBest regards,",
  };

  const resumeData = {
    name: "His full name is Rishabh Bipin Shukla.",
    summary:
      "Rishabh Bipin Shukla is a Junior AI/ML Engineer with hands-on experience in deploying production-ready NLP, Speech-to-Text (STT), and Large Language Model (LLM) solutions. He has a strong background in building Retrieval-Augmented Generation (RAG) pipelines and high-performance asynchronous FastAPI backends.",
    skills:
      "His technical skills include AI/ML & NLP (Llama 3, Mistral, Phi-3.5, RAG, Whisper, CNNs, RNNs, Embeddings), Frameworks & Libraries (FastAPI Async, PyTorch, Gemini API, Google Text-to-Speech), Backend & Deployment (Docker, REST APIs, AWS Lambda, SQL, Microservices), and Application Development (Flutter, Dart, GetX).",
    // Granular Experience
    freelance:
      "As a Freelance App Developer (Jan 2021 - Mar 2024), Rishabh delivered 15+ production-grade cross-platform mobile apps using Flutter and FastAPI. He deployed containerized backend microservices using Docker and built reactive UIs with GetX state management.",

    // Granular Education
    ssc: "In his 10th Standard (SSC) [2016-2017], Rishabh scored 83.00%! He showed early brilliance with 96/100 in Mathematics and 96/100 in Science.",
    hsc: "For his 12th Standard (HSC), he secured 60.92%. Notably, he scored 148/200 in Computer Science, marking the beginning of his ninja path in programming and technology.",
    bca: "Rishabh completed his Graduation (BCA) from K. P. B. Hinduja College (2019-2022) with a solid CGPA of 8.13/10.0. He built a strong foundation in CS and developed a passion for AI/ML and mobile development.",
    mca: "He is currently pursuing his Masters (MCA) at MET Institute of Computer Science (2024-2026 Expected). He holds a CGPA of 8.5/10.0 and is working on a Thesis: 'Deep Learning for Real-Time Music Visualization' focusing on audio pattern recognition.",

    // Fallbacks
    projects:
      "Some of his key Applied AI Projects include: 1) Deep Learning for Real-Time Music Visualization (MCA Thesis) - using CNNs. 2) Local Privacy-First Knowledge Engine (RAG) - built with Phi-3.5. 3) Charity Suno - Hybrid AI Study Assistant using Gemini API and Google TTS.",
  };

  function hasAny(text: string, keywords: string[]) {
    return keywords.some((k) => text.includes(k));
  }

  onMount(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          isVisible = true;
          eyeEvolution.set(5); // Rinnegan
          currentSection.set(4);
          visitedSections.update((v) => v.add(4));
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(sectionRef);

    return () => observer.disconnect();
  });

  // Chatbot Logic
  let isChatOpen = false;
  let inputValue = "";
  let isTyping = false;
  let chatBodyRef: HTMLElement;

  interface Message {
    id: number;
    text: string;
    sender: "user" | "naruto";
  }

  let messages: Message[] = [
    {
      id: 1,
      text: "Dattebayo! I'm Naruto Uzumaki! Are you here to uncover the secrets of Rishabh's ninja way? Ask me about his skills, missions, or experience!",
      sender: "naruto",
    },
  ];

  const narutoQuotes = [
    "I'm not gonna run away, I never go back on my word! That's my nindo: my ninja way!",
    "Hard work is worthless for those that don't believe in themselves.",
    "If you don't like your destiny, don't accept it. Instead, have the courage to change it the way you want it to be!",
    "I want to be with you. From now on, I want to spend all and every single one of my days until I die with you, and only you, Hinata.",
    "Hey, you're pretty cool! Make sure to check out Rishabh's projects!",
    "Believe it!",
    "Pass me the ramen!",
  ];

  function toggleChat() {
    isChatOpen = !isChatOpen;
    if (isChatOpen) {
      playSound(dattebayoSound);
      scrollToBottom();
    } else {
      playSound(chakraSound);
    }
  }

  function playSound(soundFile: string) {
    const audio = new Audio(soundFile);
    audio.play().catch((e) => console.log("Audio play failed:", e));
  }

  async function handleSendMessage() {
    if (!inputValue.trim()) return;

    const userText = inputValue.trim();
    const userMsg: Message = {
      id: Date.now(),
      text: userText,
      sender: "user",
    };

    messages = [...messages, userMsg];
    inputValue = "";
    scrollToBottom();

    // Simulate Naruto typing
    isTyping = true;

    // Resume Logic
    const lowerText = userText.toLowerCase().replace(/[^\w\s]/g, ""); // Remove punctuation
    let responseText = "";

    // --- 1. Greetings & Personal Status ---
    if (hasAny(lowerText, ["hello", "hi", "hey", "greetings", "konnichiwa"])) {
      responseText = "Dattebayo! Hello there! Ready to learn about Rishabh?";
    } else if (
      hasAny(lowerText, ["how are you", "how are u", "doing", "status"])
    ) {
      responseText =
        "I'm doing great, preparing for my next mission! Rishabh is also doing fantastic, coding up some S-rank jutsu!";
    }

    // --- 2. Time & Age Specific Logic ---
    // Extract numbers to check for years or ages
    const numbers = lowerText.match(/\d+/g);
    if (numbers && numbers.length > 0) {
      const num = parseInt(numbers[0]);

      // Age Logic (Born ~2000 based on Class of 2016 being 16)
      // 16 -> 2016 (SSC)
      // 18 -> 2018 (HSC)
      // 19-22 -> 2019-2022 (BCA)
      // 21-24 -> 2021-2024 (Freelance)

      if (lowerText.includes("age") || (num >= 15 && num <= 30)) {
        if (num === 16 || num === 17)
          responseText = "At age " + num + ", " + resumeData.ssc;
        else if (num === 18 || num === 19)
          responseText = "At age " + num + ", " + resumeData.hsc;
        else if (num >= 20 && num <= 22)
          responseText = "At age " + num + ", " + resumeData.bca;
        else if (num >= 23 && num <= 25)
          responseText =
            "At age " +
            num +
            ", " +
            resumeData.freelance +
            " He also started his MCA.";
        else if (num > 25)
          responseText =
            "That's in the future! But he'll probably be Hokage of the Tech World by then!";
      }

      // Year Logic
      if (num > 1990 && num < 2030) {
        if (num >= 2016 && num <= 2017)
          responseText = "In " + num + ", " + resumeData.ssc;
        else if (num >= 2017 && num <= 2019)
          responseText = "In " + num + ", " + resumeData.hsc;
        else if (num >= 2019 && num <= 2022)
          responseText = "In " + num + ", " + resumeData.bca;
        else if (num >= 2021 && num <= 2024)
          responseText = "In " + num + ", " + resumeData.freelance;
        else if (num >= 2024 && num <= 2026)
          responseText = "In " + num + ", " + resumeData.mca;
      }
    }

    // --- 3. Keyword Matching (Fallback if no specific time/greeting matched) ---
    if (!responseText) {
      // 1. MCA / Masters / Post Grad
      if (
        hasAny(lowerText, [
          "mca",
          "master",
          "post grad",
          "met institute",
          "thesis",
          "pg",
        ])
      ) {
        responseText = resumeData.mca;
      }
      // 2. BCA / Graduation / Bachelors
      else if (
        hasAny(lowerText, [
          "bca",
          "bachelors",
          "graduation",
          "undergrad",
          "degree",
          "hinduja",
          "college",
        ])
      ) {
        responseText = resumeData.bca;
      }
      // 3. HSC / 12th
      else if (
        hasAny(lowerText, [
          "hsc",
          "12th",
          "twelfth",
          "junior college",
          "higher secondary",
          "computer science mark",
        ])
      ) {
        responseText = resumeData.hsc;
      }
      // 4. SSC / 10th
      else if (
        hasAny(lowerText, [
          "ssc",
          "10th",
          "tenth",
          "matric",
          "metric",
          "school",
          "math",
          "science mark",
        ])
      ) {
        responseText = resumeData.ssc;
      }
      // 5. Work / Freelance
      else if (
        hasAny(lowerText, [
          "freelance",
          "work",
          "job",
          "experience",
          "company",
          "developer",
        ])
      ) {
        responseText = resumeData.freelance;
      }
      // 6. Skills
      else if (
        hasAny(lowerText, [
          "skill",
          "stack",
          "tech",
          "tool",
          "language",
          "framework",
        ])
      ) {
        responseText = resumeData.skills;
      }
      // 7. Projects
      else if (
        hasAny(lowerText, ["project", "app", "built", "created", "thesis"])
      ) {
        responseText = resumeData.projects;
      }
      // 8. General Education (fallback if specific degree not mentioned but "education" is)
      else if (
        hasAny(lowerText, [
          "education",
          "qualifi",
          "study",
          "studied",
          "score",
          "percent",
          "cgpa",
          "marks",
        ])
      ) {
        // If asking generically about marks/education without a specific level, give a summary
        responseText =
          "He has done his MCA (8.5 CGPA), BCA (8.13 CGPA), 12th (60.92%), and 10th (83%). Ask me specifically about any of them for more details!";
      }
      // 9. Name
      else if (hasAny(lowerText, ["name", "who are you", "who is rishabh"])) {
        responseText = resumeData.name;
      }
      // 10. Summary / About
      else if (
        hasAny(lowerText, [
          "summary",
          "about",
          "bio",
          "intro",
          "detail",
          "info",
        ])
      ) {
        responseText = resumeData.summary;
      }
      // 11. Contact
      else if (
        hasAny(lowerText, ["contact", "email", "mail", "reach", "social"])
      ) {
        responseText =
          "You can contact him directly via email at " +
          contactInfo.email +
          " or on LinkedIn!";
      }
    }

    setTimeout(async () => {
      let narutoMsg: Message;

      if (responseText) {
        // Found a relevant answer
        narutoMsg = {
          id: Date.now() + 1,
          text: "Dattebayo! " + responseText,
          // Removed manual "Here is what I know" to make custom responses flow better
          sender: "naruto",
        };
      } else {
        // Irrelevant question - Naruto Quote + Redirect
        const randomQuote =
          narutoQuotes[Math.floor(Math.random() * narutoQuotes.length)];
        narutoMsg = {
          id: Date.now() + 1,
          text:
            randomQuote +
            " ... But seriously, I think you should focus on asking relevant questions about Rishabh's skills, projects, or experience! That's the ninja way!",
          sender: "naruto",
        };
      }

      messages = [...messages, narutoMsg];
      isTyping = false;
      scrollToBottom();
    }, 1500);
  }

  async function scrollToBottom() {
    await tick();
    if (chatBodyRef) {
      chatBodyRef.scrollTop = chatBodyRef.scrollHeight;
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  }
</script>

<section id="contact" class="contact section" bind:this={sectionRef}>
  <div class="container">
    <div class="contact-content">
      <!-- Large Rinnegan Display -->
      <div
        id="rinnegan-merge-target"
        class="rinnegan-display"
        class:visible={isVisible}
        class:merging={$rinneganMerged}
      >
        <!-- Shockwave Effect Container -->
        {#if $rinneganMerged}
          <div class="godly-shockwave" out:fade={{ duration: 500 }}></div>
          <div class="godly-flash" out:fade={{ duration: 500 }}></div>
        {/if}

        <div class="rinnegan-container">
          <div class="ripple-container">
            <div class="ripple ripple-1"></div>
            <div class="ripple ripple-2"></div>
            <div class="ripple ripple-3"></div>
          </div>

          <!-- THE GODLY TRANSFORMATION -->
          <div class="eye-wrapper">
            {#if $rinneganMerged}
              <!-- Final Form: Rinnegan -->
              <div
                class="rinnegan-final"
                in:fade={{ duration: 800, delay: 200 }}
                out:fade={{ duration: 400 }}
              >
                <img src={rinneganSvg} alt="Rinnegan" class="rinnegan-svg" />
              </div>
            {:else}
              <!-- Initial Form: Sasuke Mangekyou Sharingan -->
              <div
                class="sasuke-initial"
                in:fade={{ duration: 400 }}
                out:fade={{ duration: 200 }}
              >
                <img
                  src={sasukeMangekyouSvg}
                  alt="Sasuke Mangekyou"
                  class="rinnegan-svg"
                />
              </div>
            {/if}
          </div>

          <div class="rinnegan-label">
            <span class="label-text"
              >{$rinneganMerged ? "Rinnegan" : "Mangekyou"}</span
            >
            <span class="label-sub">Visual Prowess</span>
          </div>
        </div>
      </div>

      <div class="contact-info" class:visible={isVisible}>
        <header class="section-header">
          <span class="section-label">Ultimate Technique</span>
          <h2>Let's <span class="text-gradient-rinnegan">Connect</span></h2>
          <p class="section-desc">Ready to collaborate on your next mission?</p>
        </header>

        <div class="contact-cards">
          <!-- Email -->
          <a
            href="mailto:{contactInfo.email}?subject={encodeURIComponent(
              contactInfo.subject,
            )}&body={encodeURIComponent(contactInfo.body)}"
            target="_blank"
            rel="noopener noreferrer"
            class="contact-card email"
          >
            <span class="card-icon">✉️</span>
            <div class="card-content">
              <span class="card-label">Email</span>
              <span class="card-value">{contactInfo.email}</span>
            </div>
            <span class="card-arrow">→</span>
          </a>

          <!-- LinkedIn -->
          <a
            href="https://{contactInfo.linkedin}"
            target="_blank"
            rel="noopener noreferrer"
            class="contact-card linkedin"
          >
            <span class="card-icon">💼</span>
            <div class="card-content">
              <span class="card-label">LinkedIn</span>
              <span class="card-value">{contactInfo.linkedin}</span>
            </div>
            <span class="card-arrow">→</span>
          </a>

          <!-- Location -->
          <div class="contact-card location">
            <span class="card-icon">📍</span>
            <div class="card-content">
              <span class="card-label">Location</span>
              <span class="card-value">{contactInfo.location}</span>
            </div>
          </div>

          <!-- Talk no Jutsu Button -->
          <button class="talk-no-jutsu-btn" on:click={toggleChat}>
            <span class="btn-icon">🍥</span>
            <span class="btn-text">Talk no Jutsu</span>
            <span class="btn-sub">Chat with Naruto</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="portfolio-footer">
      <p>Made by AI (to showcase Rishabh Shukla's Work)</p>
      <p class="footer-ninja">The path of the ninja never ends.</p>
      <div class="legal-disclaimer">
        <p>
          <strong>Disclaimer:</strong> This portfolio is a non-profit, educational
          project created solely to demonstrate technical skills. All characters,
          names, audio, and visual assets related to 'Naruto' are identifiers of
          and copyright to Masashi Kishimoto, Shueisha, Viz Media, and TV Tokyo.
          No copyright infringement is intended. This project is not affiliated with,
          endorsed by, or sponsored by the official copyright holders. Usage of these
          assets falls under 'Fair Use' for educational and transformative purposes.
        </p>
      </div>
    </footer>

    <!-- Uchiha Clan Symbol Footer -->
    <div class="uchiha-footer" aria-hidden="true">
      <div class="uchiha-fan">
        <div class="fan-top"></div>
        <div class="fan-bottom"></div>
        <div class="fan-handle"></div>
      </div>
      <!-- Uchiha name removed as requested -->
    </div>
  </div>

  <!-- Background effects -->
  <div class="rinnegan-bg" aria-hidden="true"></div>

  <!-- ChatModal -->
  {#if isChatOpen}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div
      class="chat-overlay"
      transition:fade={{ duration: 200 }}
      on:click|self={toggleChat}
      role="button"
      tabindex="0"
    >
      <div
        class="chat-modal"
        transition:scrollUnroll={{
          duration: 400,
          easing: cubicOut,
        }}
        role="dialog"
      >
        <header class="chat-header">
          <div class="naruto-avatar">
            <img src={narutoFace} alt="Naruto" />
          </div>
          <div class="header-info">
            <h3>Naruto Uzumaki</h3>
            <span class="status">Online • Konoha</span>
          </div>
          <button
            class="close-btn"
            on:click={toggleChat}
            aria-label="Close chat">×</button
          >
        </header>

        <div class="chat-body" bind:this={chatBodyRef}>
          {#each messages as msg (msg.id)}
            <div class="message {msg.sender}" in:fly={{ y: 20, duration: 300 }}>
              <div class="message-content">
                {msg.text}
              </div>
            </div>
          {/each}
          {#if isTyping}
            <div class="message naruto typing">
              <div class="typing-indicator">
                <span></span><span></span><span></span>
              </div>
            </div>
          {/if}
        </div>

        <footer class="chat-footer">
          <input
            type="text"
            placeholder="Type a message..."
            bind:value={inputValue}
            on:keydown={handleKeydown}
          />
          <button
            class="send-btn"
            on:click={handleSendMessage}
            disabled={!inputValue.trim()}
          >
            Send
          </button>
        </footer>
      </div>
    </div>
  {/if}
</section>

<style>
  .contact {
    position: relative;
    min-height: 100vh;
    display: flex;
    align-items: center;
    background: linear-gradient(180deg, var(--bg-primary) 0%, #0a0510 100%);
    overflow: hidden;
    padding-bottom: 4rem;
  }

  .container {
    width: 100%;
  }

  .contact-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: center;
  }

  @media (max-width: 900px) {
    .contact-content {
      grid-template-columns: 1fr;
      gap: 2rem;
    }
  }

  .rinnegan-display {
    display: flex;
    justify-content: center;
    opacity: 0;
    transform: scale(0.8);
    transition: all 1s cubic-bezier(0.16, 1, 0.3, 1);
    position: relative;
    z-index: 2;
  }

  .rinnegan-display.visible {
    opacity: 1;
    transform: scale(1);
  }

  .rinnegan-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    position: relative;
  }

  /* Ripple Effect */
  .ripple-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%); /* Center relative to container */
    width: 250px;
    height: 250px; /* Match SVG size */
    z-index: 0;
    pointer-events: none;
    margin-top: -35px; /* Offset for label gap to center on eye */
  }

  .ripple {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    border: 1px solid rgba(139, 92, 246, 0.4);
    box-shadow: 0 0 15px rgba(139, 92, 246, 0.2);
    opacity: 0;
    animation: rippleExpand 4s linear infinite;
  }

  .ripple-1 {
    animation-delay: 0s;
  }
  .ripple-2 {
    animation-delay: 1.3s;
  }
  .ripple-3 {
    animation-delay: 2.6s;
  }

  @keyframes rippleExpand {
    0% {
      width: 250px;
      height: 250px;
      opacity: 0.6;
      border-width: 2px;
    }
    100% {
      width: 500px;
      height: 500px;
      opacity: 0;
      border-width: 0px;
    }
  }

  .rinnegan-svg {
    width: 250px;
    height: 250px;
    filter: drop-shadow(0 0 30px rgba(139, 92, 246, 0.5));
    /* Float is handled by wrapper now to sync both eyes */
    display: block;
  }

  .eye-wrapper {
    position: relative;
    width: 250px;
    height: 250px;
    animation: rinneganFloat 6s ease-in-out infinite;
    z-index: 1;
  }

  .rinnegan-final,
  .sasuke-initial {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  /* Godly Shockwave & Flash */
  .godly-shockwave {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 10px;
    height: 10px;
    border-radius: 50%;
    border: 50px solid rgba(139, 92, 246, 0.8);
    z-index: 3;
    animation: shockwaveExplode 1s cubic-bezier(0, 0, 0.2, 1) forwards;
    pointer-events: none;
  }

  @keyframes shockwaveExplode {
    0% {
      width: 0;
      height: 0;
      opacity: 1;
      border-width: 50px;
    }
    100% {
      width: 1000px;
      height: 1000px;
      opacity: 0;
      border-width: 0;
    }
  }

  .godly-flash {
    position: absolute;
    inset: -500px;
    background: radial-gradient(
      circle,
      rgba(139, 92, 246, 0.8) 0%,
      transparent 70%
    );
    z-index: 4;
    opacity: 0;
    animation: divineFlash 0.5s ease-out forwards;
    pointer-events: none;
    mix-blend-mode: screen;
  }

  @keyframes divineFlash {
    0% {
      opacity: 0;
      transform: scale(0.5);
    }
    20% {
      opacity: 1;
      transform: scale(1);
    }
    100% {
      opacity: 0;
      transform: scale(1.5);
    }
  }

  @keyframes rinneganFloat {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  .rinnegan-label {
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .label-text {
    font-family: "Cinzel", serif;
    font-size: 1.5rem;
    font-weight: 700;
    color: #fff;
    text-transform: uppercase;
    letter-spacing: 0.2rem;
    background: linear-gradient(to right, #e9d5ff, #c084fc, #e9d5ff);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    text-shadow: 0 0 20px rgba(139, 92, 246, 0.5);
    animation: textShine 3s linear infinite;
  }

  .label-sub {
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.5);
    text-transform: uppercase;
    letter-spacing: 0.4rem;
    font-weight: 300;
  }

  @keyframes textShine {
    0% {
      background-position: 0% 50%;
      filter: brightness(100%);
    }
    50% {
      background-position: 100% 50%;
      filter: brightness(150%);
    }
    100% {
      background-position: 0% 50%;
      filter: brightness(100%);
    }
  }

  .contact-info.visible {
    opacity: 1;
    transform: translateX(0);
  }

  .section-header {
    margin-bottom: 2rem;
  }

  .section-label {
    display: inline-block;
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--rinnegan-purple);
    text-transform: uppercase;
    letter-spacing: 0.15em;
    margin-bottom: 0.75rem;
  }

  h2 {
    margin-bottom: 0.5rem;
  }

  .section-desc {
    color: var(--text-secondary);
  }

  .contact-cards {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .contact-card {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.25rem 1.5rem;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    text-decoration: none;
    color: inherit;
    transition: all 0.3s ease;
  }

  .contact-card:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: var(--rinnegan-purple);
    transform: translateX(5px);
  }

  .card-icon {
    font-size: 1.5rem;
    flex-shrink: 0;
  }

  .card-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .card-label {
    font-size: 0.8rem;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .card-value {
    font-size: 1rem;
    color: var(--text-primary);
    font-weight: 500;
  }

  .card-arrow {
    color: var(--rinnegan-purple);
    opacity: 0;
    transform: translateX(-10px);
    transition: all 0.3s ease;
  }

  .contact-card:hover .card-arrow {
    opacity: 1;
    transform: translateX(0);
  }

  .portfolio-footer {
    margin-top: 4rem;
    padding-top: 2rem;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    text-align: center;
  }

  .portfolio-footer p {
    color: var(--text-muted);
    font-size: 0.9rem;
    margin: 0.5rem 0;
  }

  .footer-ninja {
    font-style: italic;
    opacity: 0.6;
  }

  .legal-disclaimer {
    margin-top: 1.5rem;
    padding-top: 1rem;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    font-size: 0.7rem;
    color: var(--text-muted);
    opacity: 0.5;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
    line-height: 1.4;
  }

  .legal-disclaimer:hover {
    opacity: 0.8;
  }

  /* Background effect */
  .rinnegan-bg {
    position: absolute;
    inset: 0;
    background: radial-gradient(
        ellipse at 30% 50%,
        rgba(139, 92, 246, 0.08) 0%,
        transparent 50%
      ),
      radial-gradient(
        ellipse at 70% 70%,
        rgba(139, 92, 246, 0.05) 0%,
        transparent 40%
      );
    pointer-events: none;
    z-index: 0;
  }

  /* Mobile Responsive */
  @media (max-width: 768px) {
    .contact {
      min-height: auto;
      padding: 4rem 0;
    }

    .rinnegan-display {
      transform: scale(0.8);
    }

    .rinnegan-display.visible {
      transform: scale(0.8);
    }

    .rinnegan-svg {
      width: 200px;
      height: 200px;
    }

    .label-text {
      font-size: 1.2rem;
    }

    .contact-info.visible {
      transform: translateX(0);
    }

    .section-header {
      text-align: center;
    }

    .contact-card {
      padding: 1rem;
    }

    .card-value {
      font-size: 0.85rem;
      word-break: break-word;
    }

    .portfolio-footer {
      margin-top: 2rem;
    }
  }

  @media (max-width: 480px) {
    .rinnegan-display {
      transform: scale(0.8);
      margin: -1rem 0;
    }

    .rinnegan-display.visible {
      transform: scale(0.8);
    }

    .contact-card {
      gap: 0.75rem;
    }

    .card-icon {
      font-size: 1.25rem;
    }

    .card-value {
      font-size: 0.8rem;
    }

    .card-arrow {
      display: none;
    }
  }

  /* Talk no Jutsu Button */
  .talk-no-jutsu-btn {
    margin-top: 1rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1.5rem;
    background: linear-gradient(135deg, #ff5500 0%, #ff8800 100%);
    border: none;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    color: white;
    box-shadow: 0 4px 15px rgba(255, 85, 0, 0.3);
    width: 100%;
    position: relative;
    overflow: hidden;
  }

  .talk-no-jutsu-btn:hover {
    transform: translateY(-3px) scale(1.02);
    box-shadow: 0 8px 25px rgba(255, 85, 0, 0.5);
  }

  .talk-no-jutsu-btn:active {
    transform: translateY(1px);
  }

  .btn-icon {
    font-size: 1.8rem;
    animation: spin 10s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .btn-text {
    font-weight: 700;
    font-size: 1.1rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    flex: 1;
    text-align: left;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  }

  .btn-sub {
    font-size: 0.75rem;
    opacity: 0.9;
    font-weight: 500;
  }

  /* Chat Modal */
  .chat-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(5px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 1rem;
  }

  .chat-modal {
    width: 100%;
    max-width: 400px;
    height: 600px;
    max-height: 80vh;
    background: #1a1520;
    border-radius: 20px;
    border: 1px solid rgba(139, 92, 246, 0.3);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
  }

  .chat-header {
    padding: 1rem;
    background: rgba(255, 85, 0, 0.1);
    border-bottom: 1px solid rgba(255, 85, 0, 0.2);
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .naruto-avatar {
    width: 40px;
    height: 40px;
    background: #ff5500;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    border: 2px solid #fff;
  }

  .naruto-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .header-info h3 {
    margin: 0;
    font-size: 1rem;
    color: #fff;
  }

  .status {
    font-size: 0.75rem;
    color: #4ade80; /* Green for online */
  }

  .close-btn {
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.5);
    font-size: 1.5rem;
    margin-left: auto;
    cursor: pointer;
    line-height: 1;
  }

  .close-btn:hover {
    color: #fff;
  }

  .chat-body {
    flex: 1;
    overflow-y: auto;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    background: rgba(0, 0, 0, 0.2);
  }

  .message {
    max-width: 80%;
    padding: 0.8rem 1rem;
    border-radius: 12px;
    font-size: 0.95rem;
    line-height: 1.4;
  }

  .message.naruto {
    align-self: flex-start;
    background: rgba(255, 85, 0, 0.15);
    color: #ffdcb5;
    border-bottom-left-radius: 2px;
  }

  .message.user {
    align-self: flex-end;
    background: rgba(139, 92, 246, 0.3);
    color: #fff;
    border-bottom-right-radius: 2px;
  }

  .typing-indicator span {
    display: inline-block;
    width: 6px;
    height: 6px;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 50%;
    animation: typing 1.4s infinite both;
    margin: 0 2px;
  }

  .typing-indicator span:nth-child(2) {
    animation-delay: 0.2s;
  }
  .typing-indicator span:nth-child(3) {
    animation-delay: 0.4s;
  }

  @keyframes typing {
    0%,
    100% {
      transform: scale(0.2);
      opacity: 0.2;
    }
    50% {
      transform: scale(1);
      opacity: 1;
    }
  }

  .chat-footer {
    padding: 1rem;
    background: rgba(0, 0, 0, 0.3);
    display: flex;
    gap: 0.5rem;
  }

  .chat-footer input {
    flex: 1;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 0.75rem 1rem;
    color: #fff;
    outline: none;
    transition: border-color 0.3s;
  }

  .chat-footer input:focus {
    border-color: #ff5500;
  }

  .send-btn {
    background: #ff5500;
    color: white;
    border: none;
    padding: 0 1.25rem;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.3s;
  }

  .send-btn:hover:not(:disabled) {
    background: #ff7700;
  }

  .send-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
