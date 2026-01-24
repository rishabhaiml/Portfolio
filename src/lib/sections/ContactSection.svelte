<script context="module">
  import { cubicOut } from "svelte/easing";
</script>

<!--
  CONTACT SECTION
  Final section with Rinnegan theme and contact info
-->
<script lang="ts">
  import { onMount } from "svelte";
  import { eyeEvolution, currentSection, visitedSections } from "$lib/stores";
  import SharinganEye from "$lib/components/SharinganEye.svelte";
  import { fade, fly, scale } from "svelte/transition";
  import { tick } from "svelte";

  let sectionRef: HTMLElement;
  let isVisible = false;

  const contactInfo = {
    email: "rishabhshukla092@gmail.com",
    linkedin: "linkedin.com/in/rishabhbshukla",
    location: "Mumbai, India",
    subject: "Project Inquiry / Collaboration",
    body: "Hi Rishabh,\n\nI was impressed by your portfolio and would like to discuss a potential collaboration.\n\nBest regards,",
  };

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
      text: "Dattebayo! I'm Naruto Uzumaki! What brings you here?",
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
      scrollToBottom();
    }
  }

  async function handleSendMessage() {
    if (!inputValue.trim()) return;

    const userMsg: Message = {
      id: Date.now(),
      text: inputValue,
      sender: "user",
    };

    messages = [...messages, userMsg];
    inputValue = "";
    scrollToBottom();

    // Simulate Naruto typing
    isTyping = true;
    setTimeout(async () => {
      const randomQuote =
        narutoQuotes[Math.floor(Math.random() * narutoQuotes.length)];
      const narutoMsg: Message = {
        id: Date.now() + 1,
        text: randomQuote,
        sender: "naruto",
      };
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
      >
        <SharinganEye
          variant="sasuke-rinne"
          forceMangekyou={true}
          size={200}
          showLabel={true}
        />
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
        transition:scale={{
          duration: 300,
          start: 0.8,
          opacity: 0,
          easing: cubicOut,
        }}
        role="dialog"
      >
        <header class="chat-header">
          <div class="naruto-avatar">
            <span class="avatar-icon">🦊</span>
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
  }

  .rinnegan-display.visible {
    opacity: 1;
    transform: scale(1);
    animation: rinneganPulse 3s ease-in-out infinite;
  }

  /* Rinne Sharingan animation - subtle rotation and pulse */
  @keyframes rinneganPulse {
    0%,
    100% {
      filter: drop-shadow(0 0 20px rgba(139, 92, 246, 0.5))
        drop-shadow(0 0 40px rgba(139, 92, 246, 0.3));
    }
    50% {
      filter: drop-shadow(0 0 30px rgba(139, 92, 246, 0.8))
        drop-shadow(0 0 60px rgba(139, 92, 246, 0.5));
    }
  }

  .rinnegan-display.visible :global(.eye-svg) {
    animation: rinneganRotate 20s linear infinite;
  }

  @keyframes rinneganRotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .contact-info {
    opacity: 0;
    transform: translateX(30px);
    transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s;
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
      transform: scale(0.6);
    }

    .rinnegan-display.visible {
      transform: scale(0.6);
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
      transform: scale(0.5);
      margin: -2rem 0;
    }

    .rinnegan-display.visible {
      transform: scale(0.5);
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
    font-size: 1.2rem;
    border: 2px solid #fff;
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
