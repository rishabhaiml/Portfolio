<!--
  JUTSU CARD COMPONENT
  Reusable card for skills and projects with ninja-themed styling
-->
<script lang="ts">
  import { onMount } from 'svelte';
  
  export let title: string;
  export let description: string = '';
  export let icon: string = '🔥';
  export let variant: 'skill' | 'project' = 'skill';
  export let tags: string[] = [];
  export let link: string = '';
  
  let card: HTMLElement;
  let isHovered = false;
  let clones: { id: number; x: number; y: number }[] = [];
  let cloneId = 0;
  
  function handleMouseEnter(e: MouseEvent) {
    isHovered = true;
    
    // Shadow clone effect on hover
    if (variant === 'skill') {
      createClones();
    }
  }
  
  function handleMouseLeave() {
    isHovered = false;
    clones = [];
  }
  
  function createClones() {
    const offsets = [
      { x: -10, y: -5 },
      { x: 10, y: -5 }
    ];
    
    clones = offsets.map((offset, i) => ({
      id: cloneId++,
      x: offset.x,
      y: offset.y
    }));
    
    // Remove clones after animation
    setTimeout(() => {
      clones = [];
    }, 400);
  }
</script>

<article 
  bind:this={card}
  class="jutsu-card {variant}"
  class:hovered={isHovered}
  on:mouseenter={handleMouseEnter}
  on:mouseleave={handleMouseLeave}
>
  <!-- Shadow clones -->
  {#each clones as clone (clone.id)}
    <div 
      class="shadow-clone"
      style="transform: translate({clone.x}px, {clone.y}px);"
    >
      <div class="clone-content">
        <span class="icon">{icon}</span>
        <h3>{title}</h3>
      </div>
    </div>
  {/each}
  
  <!-- Main card content -->
  <div class="card-inner">
    <!-- Seal pattern background -->
    <div class="seal-pattern" aria-hidden="true">
      <svg viewBox="0 0 100 100" class="seal-svg">
        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" stroke-width="0.5" opacity="0.3" />
        <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" stroke-width="0.3" opacity="0.2" />
        <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" stroke-width="0.3" opacity="0.2" />
        <!-- Kanji-like symbols -->
        <text x="50" y="55" text-anchor="middle" font-size="12" fill="currentColor" opacity="0.1">忍</text>
      </svg>
    </div>
    
    <header class="card-header">
      <span class="icon">{icon}</span>
      <h3>{title}</h3>
    </header>
    
    {#if description}
      <p class="description">{description}</p>
    {/if}
    
    {#if tags.length > 0}
      <div class="tags">
        {#each tags as tag}
          <span class="tag">{tag}</span>
        {/each}
      </div>
    {/if}
    
    {#if link && variant === 'project'}
      <a href={link} class="card-link" target="_blank" rel="noopener noreferrer">
        View Project →
      </a>
    {/if}
  </div>
  
  <!-- Hover glow effect -->
  <div class="glow-effect" aria-hidden="true"></div>
</article>

<style>
  .jutsu-card {
    position: relative;
    border-radius: 16px;
    overflow: hidden;
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }
  
  .jutsu-card.skill {
    background: linear-gradient(145deg, rgba(230, 57, 70, 0.1) 0%, rgba(10, 10, 10, 0.95) 100%);
    border: 1px solid rgba(230, 57, 70, 0.2);
  }
  
  .jutsu-card.project {
    background: linear-gradient(145deg, rgba(139, 92, 246, 0.1) 0%, rgba(10, 10, 10, 0.95) 100%);
    border: 1px solid rgba(139, 92, 246, 0.2);
  }
  
  .jutsu-card:hover {
    transform: translateY(-5px);
  }
  
  .card-inner {
    position: relative;
    padding: 1.5rem;
    z-index: 2;
  }
  
  .seal-pattern {
    position: absolute;
    top: 50%;
    right: -20%;
    width: 150px;
    height: 150px;
    transform: translateY(-50%);
    opacity: 0;
    transition: opacity 0.4s ease;
    color: var(--sharingan-red);
  }
  
  .jutsu-card.project .seal-pattern {
    color: var(--rinnegan-purple);
  }
  
  .jutsu-card:hover .seal-pattern {
    opacity: 1;
    animation: sealSpin 10s linear infinite;
  }
  
  @keyframes sealSpin {
    from { transform: translateY(-50%) rotate(0deg); }
    to { transform: translateY(-50%) rotate(360deg); }
  }
  
  .seal-svg {
    width: 100%;
    height: 100%;
  }
  
  .card-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.75rem;
  }
  
  .icon {
    font-size: 1.5rem;
  }
  
  h3 {
    font-family: var(--font-heading);
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
  }
  
  .description {
    font-size: 0.9rem;
    color: var(--text-secondary);
    line-height: 1.5;
    margin-bottom: 1rem;
  }
  
  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }
  
  .tag {
    padding: 0.25rem 0.75rem;
    font-size: 0.75rem;
    font-weight: 500;
    border-radius: 100px;
    background: rgba(59, 130, 246, 0.15);
    color: var(--chakra-blue);
    border: 1px solid rgba(59, 130, 246, 0.3);
  }
  
  .card-link {
    display: inline-flex;
    align-items: center;
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--rinnegan-purple);
    transition: color 0.2s ease;
  }
  
  .card-link:hover {
    color: var(--chakra-blue);
  }
  
  .glow-effect {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0;
    transition: opacity 0.4s ease;
    pointer-events: none;
  }
  
  .skill .glow-effect {
    box-shadow: inset 0 0 40px rgba(230, 57, 70, 0.2);
  }
  
  .project .glow-effect {
    box-shadow: inset 0 0 40px rgba(139, 92, 246, 0.2);
  }
  
  .jutsu-card:hover .glow-effect {
    opacity: 1;
  }
  
  /* Shadow clone effect */
  .shadow-clone {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: inherit;
    border-radius: inherit;
    opacity: 0.4;
    pointer-events: none;
    animation: cloneFade 0.4s ease-out forwards;
    z-index: 1;
  }
  
  .clone-content {
    padding: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  
  @keyframes cloneFade {
    0% {
      opacity: 0.6;
      transform: scale(1);
    }
    100% {
      opacity: 0;
      transform: scale(1.05);
    }
  }
</style>
