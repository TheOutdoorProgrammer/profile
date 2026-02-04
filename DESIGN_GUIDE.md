Here's a design proposal for Joey Stout's dark-themed modern personal portfolio, focusing on the requested elements and incorporating the unique blend of DevOps and outdoorsmanship.

---

## Joey Stout (TheOutdoorProgrammer) Portfolio Design

### 1. Color Palette & Typography

**Color Palette (Hex Codes):**

*   **Primary Background:** `#13181E` (Very Dark Charcoal Blue) - The deep, stable base.
*   **Secondary Background/Cards:** `#1A2129` (Slightly Lighter Dark Charcoal) - For sections, cards, and interactive elements.
*   **Text - Primary:** `#D1D5DA` (Light Grey Blue) - High contrast, easy to read on dark backgrounds.
*   **Text - Secondary/Muted:** `#A9B0B8` (Medium Grey Blue) - For subheadings, dates, and less critical information.
*   **Accent 1 (Tech/Interactive):** `#3CCAE0` (Vibrant Cyan) - Represents technology, links, active states, and highlights.
*   **Accent 2 (Outdoors/Warmth):** `#E09F3C` (Muted Amber) - Represents the outdoors, warmth, and complementary accents.
*   **Error/Alert (Optional):** `#E05D5D` (Soft Red)

**Typography:**

*   **Headings (H1, H2, H3):** **Inter** (Sans-serif) - Modern, clean, excellent readability, variable font for flexibility. Use bolder weights for impact.
*   **Body Text (P, LI):** **Roboto** (Sans-serif) - Highly legible, versatile, and common, ensuring good performance.
*   **Code Blocks/Monospace:** **Source Code Pro** (Monospace) - Clear, professional for any code snippets or terminal-like text.

**CSS Variable Setup (recommended for Jekyll):**

```css
:root {
    /* Colors */
    --color-bg-primary: #13181E;
    --color-bg-secondary: #1A2129;
    --color-text-primary: #D1D5DA;
    --color-text-secondary: #A9B0B8;
    --color-accent-cyan: #3CCAE0;
    --color-accent-amber: #E09F3C;
    --color-error: #E05D5D;

    /* Fonts */
    --font-heading: 'Inter', sans-serif;
    --font-body: 'Roboto', sans-serif;
    --font-code: 'Source Code Pro', monospace;

    /* Spacing */
    --spacing-xs: 0.5rem;
    --spacing-sm: 1rem;
    --spacing-md: 2rem;
    --spacing-lg: 4rem;
    --spacing-xl: 6rem;

    /* Border Radius */
    --border-radius-sm: 0.25rem;
    --border-radius-md: 0.5rem;
    --border-radius-lg: 1rem;
}

/* General Body Styles */
body {
    font-family: var(--font-body);
    color: var(--color-text-primary);
    background-color: var(--color-bg-primary);
    line-height: 1.6;
    margin: 0;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-heading);
    color: var(--color-text-primary);
    margin-top: var(--spacing-md);
    margin-bottom: var(--spacing-sm);
    line-height: 1.2;
}

a {
    color: var(--color-accent-cyan);
    text-decoration: none;
    transition: color 0.3s ease, border-color 0.3s ease;
}

a:hover {
    color: var(--color-accent-amber);
    text-decoration: underline;
}

/* Custom selection styling */
::selection {
    background: var(--color-accent-cyan);
    color: var(--color-bg-primary);
}
```

### 2. CSS Approach for Horizontal Scroll Carousels (Snap Scroll)

This approach ensures smooth, discrete scrolling for items in a carousel, ideal for video embeds or distinct posts.

```css
/* Base container for all carousels */
.carousel-container {
    padding: var(--spacing-sm) 0; /* Add some vertical padding */
    margin-bottom: var(--spacing-lg);
}

.carousel-title {
    font-size: 2rem; /* Mobile */
    text-align: center;
    margin-bottom: var(--spacing-md);
    color: var(--color-text-primary);
}

@media (min-width: 768px) {
    .carousel-title {
        font-size: 2.5rem; /* Desktop */
    }
}

/* The actual scrollable carousel track */
.carousel-track {
    display: flex;
    overflow-x: auto; /* Enables horizontal scrolling */
    scroll-snap-type: x mandatory; /* Snaps to items */
    scroll-behavior: smooth; /* Smooth scrolling effect */
    -webkit-overflow-scrolling: touch; /* Improves scrolling on iOS */
    padding: 0 var(--spacing-md); /* Padding at ends for better visual */
    gap: var(--spacing-md); /* Space between carousel items */
}

/* Hide scrollbar for aesthetic purposes (optional, but common) */
.carousel-track::-webkit-scrollbar {
    height: 8px; /* For webkit browsers */
}
.carousel-track::-webkit-scrollbar-thumb {
    background-color: var(--color-accent-cyan);
    border-radius: 4px;
}
.carousel-track::-webkit-scrollbar-track {
    background-color: var(--color-bg-secondary);
}

/* Individual item within the carousel */
.carousel-item {
    flex: 0 0 auto; /* Prevent items from shrinking */
    width: 90%; /* Mobile: Take up most of the screen width */
    max-width: 350px; /* Max width for consistency */
    scroll-snap-align: start; /* Snap to the start of each item */
    background-color: var(--color-bg-secondary);
    border-radius: var(--border-radius-md);
    overflow: hidden; /* Ensures content stays within bounds */
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3); /* Subtle shadow */
    transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
}

.carousel-item:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.5), 0 0 15px var(--color-accent-cyan);
}

.carousel-item-content {
    padding: var(--spacing-sm);
}

/* Responsive adjustments for larger screens */
@media (min-width: 768px) {
    .carousel-item {
        width: 45%; /* Tablet: Two items visible */
    }
}

@media (min-width: 1024px) {
    .carousel-item {
        width: 30%; /* Desktop: Three items visible */
        max-width: 400px;
    }
    .carousel-track {
        padding: 0 var(--spacing-lg); /* More padding on desktop */
    }
}
```

### 3. Card Design CSS

This card design is versatile for projects, blog posts, or even elements within carousels.

```css
.card {
    background-color: var(--color-bg-secondary);
    border-radius: var(--border-radius-md);
    padding: var(--spacing-md);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3); /* Soft, inward-glowing shadow for dark theme */
    display: flex;
    flex-direction: column;
    justify-content: space-between; /* Pushes footer/link to bottom */
    transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
    border: 1px solid transparent; /* For hover effect */
}

.card:hover {
    transform: translateY(-8px); /* Subtle lift effect */
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.5), 0 0 15px var(--color-accent-amber); /* Stronger shadow with accent glow */
    border-color: var(--color-accent-cyan); /* Subtle border highlight */
}

.card-image {
    width: 100%;
    height: 200px; /* Fixed height for consistency */
    object-fit: cover;
    border-radius: var(--border-radius-sm);
    margin-bottom: var(--spacing-sm);
}

.card-title {
    font-family: var(--font-heading);
    font-size: 1.5rem;
    color: var(--color-text-primary);
    margin-top: 0;
    margin-bottom: var(--spacing-xs);
}

.card-description {
    font-size: 0.95rem;
    color: var(--color-text-secondary);
    margin-bottom: var(--spacing-sm);
}

.card-tags {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-xs);
    margin-top: var(--spacing-sm);
    margin-bottom: var(--spacing-sm);
}

.card-tag {
    background-color: rgba(60, 202, 224, 0.15); /* Light accent cyan background */
    color: var(--color-accent-cyan);
    padding: 0.25rem 0.75rem;
    border-radius: var(--border-radius-sm);
    font-size: 0.8rem;
    font-family: var(--font-code); /* Code-like font for tags */
}

.card-link {
    display: inline-flex;
    align-items: center;
    font-family: var(--font-heading);
    color: var(--color-accent-cyan);
    margin-top: var(--spacing-sm);
}

.card-link svg {
    margin-left: var(--spacing-xs);
    width: 1em;
    height: 1em;
    transition: transform 0.3s ease;
}

.card-link:hover svg {
    transform: translateX(5px);
}
```

### 4. Hero Section HTML/CSS

This hero section features Joey's avatar, a concise bio, and a call to action.

**HTML:**

```html
<section id="hero" class="hero">
    <div class="container hero-content">
        <div class="hero-avatar-wrapper">
            <img src="/assets/images/joey-stout-avatar.jpg" alt="Joey Stout Avatar" class="hero-avatar">
            <div class="avatar-glow"></div>
        </div>
        <h1 class="hero-title">Joey Stout (<span class="code-name">TheOutdoorProgrammer</span>)</h1>
        <p class="hero-subtitle">DevOps Engineer & Outdoorsman</p>
        <p class="hero-bio">
            Leveraging code to automate the wilderness of infrastructure. When I'm not architecting cloud solutions or streamlining CI/CD pipelines, you'll find me tracking game, casting lines, or filming adventures for my YouTube channel. Passionate about building robust systems and exploring the great outdoors.
        </p>
        <div class="hero-actions">
            <a href="#projects" class="btn btn-primary">See My Work <i class="fas fa-arrow-down"></i></a>
            <a href="#contact" class="btn btn-secondary">Get in Touch <i class="fas fa-envelope"></i></a>
        </div>
    </div>
</section>
```

**CSS:**

```css
.hero {
    min-height: 80vh; /* Occupy most of the viewport height */
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    position: relative;
    overflow: hidden; /* For background flourishes */
    padding: var(--spacing-lg) var(--spacing-sm);
}

/* Creative flourish: subtle topographic map background overlay */
.hero::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('/assets/images/topo-map-pattern.svg'); /* Create a dark, subtle SVG pattern */
    background-size: 150px; /* Adjust size for subtlety */
    opacity: 0.05; /* Very subtle */
    pointer-events: none;
    z-index: 0;
}

.hero-content {
    max-width: 900px;
    z-index: 1; /* Ensure content is above the background flourish */
    position: relative;
}

.hero-avatar-wrapper {
    position: relative;
    display: inline-block; /* To center the glow with the avatar */
    margin-bottom: var(--spacing-md);
}

.hero-avatar {
    width: 180px; /* Mobile */
    height: 180px; /* Mobile */
    border-radius: 50%;
    object-fit: cover;
    border: 4px solid var(--color-accent-cyan);
    box-shadow: 0 0 20px rgba(60, 202, 224, 0.6); /* Strong initial glow */
    transition: transform 0.5s ease-in-out;
}

.hero-avatar:hover {
    transform: rotate(5deg) scale(1.05); /* Slight playful tilt on hover */
}

/* Avatar subtle pulsating glow */
.avatar-glow {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 180px; /* Same as avatar */
    height: 180px; /* Same as avatar */
    border-radius: 50%;
    background-color: var(--color-accent-cyan);
    box-shadow: 0 0 25px var(--color-accent-cyan);
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.4;
    animation: pulse-glow 2s infinite alternate ease-in-out;
    z-index: -1; /* Behind the avatar */
}

@keyframes pulse-glow {
    0% { transform: translate(-50%, -50%) scale(1); opacity: 0.4; }
    100% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.7; }
}

.hero-title {
    font-size: 2.8rem; /* Mobile */
    font-weight: 800;
    color: var(--color-text-primary);
    margin-bottom: var(--spacing-xs);
    text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.4);
}

.code-name {
    color: var(--color-accent-cyan);
    font-family: var(--font-code);
    font-size: 0.9em; /* Slightly smaller than title */
}

.hero-subtitle {
    font-size: 1.5rem; /* Mobile */
    color: var(--color-accent-amber);
    margin-top: 0;
    margin-bottom: var(--spacing-md);
    font-weight: 500;
}

.hero-bio {
    font-size: 1.1rem;
    color: var(--color-text-secondary);
    max-width: 700px;
    margin: 0 auto var(--spacing-lg);
}

.hero-actions {
    display: flex;
    flex-direction: column; /* Stack on mobile */
    gap: var(--spacing-sm);
    justify-content: center;
}

/* General button styles */
.btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.8rem 1.8rem;
    border-radius: var(--border-radius-md);
    font-family: var(--font-heading);
    font-weight: 600;
    font-size: 1.1rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    transition: all 0.3s ease-in-out;
    border: 2px solid transparent;
    cursor: pointer;
}

.btn-primary {
    background-color: var(--color-accent-cyan);
    color: var(--color-bg-primary);
    border-color: var(--color-accent-cyan);
}

.btn-primary:hover {
    background-color: transparent;
    color: var(--color-accent-cyan);
    box-shadow: 0 0 15px var(--color-accent-cyan);
}

.btn-secondary {
    background-color: transparent;
    color: var(--color-accent-amber);
    border-color: var(--color-accent-amber);
}

.btn-secondary:hover {
    background-color: var(--color-accent-amber);
    color: var(--color-bg-primary);
    box-shadow: 0 0 15px var(--color-accent-amber);
}

.btn i {
    margin-left: var(--spacing-xs);
}

/* Responsive adjustments */
@media (min-width: 768px) {
    .hero {
        min-height: 90vh;
    }
    .hero-avatar {
        width: 220px;
        height: 220px;
    }
    .avatar-glow {
        width: 220px;
        height: 220px;
    }
    .hero-title {
        font-size: 4rem;
    }
    .hero-subtitle {
        font-size: 1.8rem;
    }
    .hero-actions {
        flex-direction: row; /* Row on desktop */
    }
}
```

### 5. Section Layout Patterns

**General Container:**

```css
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 var(--spacing-sm); /* Mobile padding */
}

@media (min-width: 768px) {
    .container {
        padding: 0 var(--spacing-md); /* Desktop padding */
    }
}
```

**Standard Section Layout:**

```css
.section {
    padding: var(--spacing-lg) 0; /* Vertical spacing for sections */
    position: relative;
    overflow: hidden; /* To contain any absolute positioning flourishes */
}

.section-title {
    font-size: 2.5rem; /* Mobile */
    font-weight: 700;
    text-align: center;
    margin-bottom: var(--spacing-xl);
    position: relative;
    color: var(--color-text-primary);
}

/* Underline flourish for section titles */
.section-title::after {
    content: '';
    display: block;
    width: 60px;
    height: 4px;
    background: linear-gradient(90deg, var(--color-accent-cyan) 0%, var(--color-accent-amber) 100%);
    margin: var(--spacing-sm) auto 0;
    border-radius: 2px;
}

@media (min-width: 768px) {
    .section-title {
        font-size: 3.5rem; /* Desktop */
    }
}
```

**Grid Layout (for Projects, Blog Posts):**

```css
.grid {
    display: grid;
    gap: var(--spacing-md);
    grid-template-columns: 1fr; /* Mobile: Single column */
}

@media (min-width: 768px) {
    .grid {
        grid-template-columns: repeat(2, 1fr); /* Tablet: Two columns */
    }
}

@media (min-width: 1024px) {
    .grid {
        grid-template-columns: repeat(3, 1fr); /* Desktop: Three columns */
    }
}
```

**Specific Section Examples:**

**YouTube Carousel Section:**

```html
<section id="youtube" class="section">
    <div class="container">
        <h2 class="section-title carousel-title">My Wilderness Adventures</h2>
        <div class="carousel-track">
            <!-- Example YouTube Carousel Item -->
            <div class="carousel-item">
                <iframe class="carousel-video" width="100%" height="200" src="https://www.youtube.com/embed/VIDEO_ID_1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                <div class="carousel-item-content">
                    <h3 class="card-title">Fishing Trip: High Mountain Lake</h3>
                    <p class="card-description">Catching native trout in pristine alpine waters. A true test of patience and skill.</p>
                    <a href="https://youtube.com/watch?v=VIDEO_ID_1" target="_blank" rel="noopener noreferrer" class="card-link">Watch Now <i class="fas fa-external-link-alt"></i></a>
                </div>
            </div>
            <!-- More carousel-item divs -->
        </div>
    </div>
</section>
```

**BlueSky Posts Carousel Section:** (Similar structure to YouTube, just different content)

```html
<section id="bluesky" class="section">
    <div class="container">
        <h2 class="section-title carousel-title">Latest BlueSky Ramblings</h2>
        <div class="carousel-track">
            <!-- Example BlueSky Carousel Item -->
            <div class="carousel-item">
                <div class="carousel-item-content">
                    <p class="card-description">
                        Just deployed a new multi-region Kubernetes cluster with @SpaceliftIO! The automation is sweet. #DevOps #Kubernetes
                    </p>
                    <small class="card-tag">#DevOps</small>
                    <small class="card-tag">#Spacelift</small>
                    <a href="https://bsky.app/profile/theoutdoorprogrammer.bsky.social/post/POST_ID_1" target="_blank" rel="noopener noreferrer" class="card-link">View Post <i class="fas fa-arrow-up-right-from-square"></i></a>
                </div>
            </div>
            <!-- More carousel-item divs -->
        </div>
    </div>
</section>
```

**Projects Section:**

```html
<section id="projects" class="section">
    <div class="container">
        <h2 class="section-title">My DevOps & Outdoor Creations</h2>
        <div class="grid">
            <div class="card">
                <img src="/assets/images/project-cloud-automation.jpg" alt="Cloud Automation Project" class="card-image">
                <h3 class="card-title">Terraform AWS Landing Zone</h3>
                <p class="card-description">Modular Terraform configuration for rapidly deploying secure AWS landing zones with best practices.</p>
                <div class="card-tags">
                    <span class="card-tag">Terraform</span>
                    <span class="card-tag">AWS</span>
                    <span class="card-tag">DevOps</span>
                </div>
                <a href="#" class="card-link">View Project <i class="fas fa-arrow-right"></i>