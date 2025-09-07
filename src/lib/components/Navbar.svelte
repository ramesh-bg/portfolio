<script>
	// @ts-nocheck

	import { onMount } from 'svelte';
	import { gsap } from 'gsap';

	/**
	 * @type {gsap.TweenTarget}
	 */
	let navbar;
	/**
	 * @type {gsap.TweenTarget}
	 */
	let logo;
	/**
	 * @type {gsap.TweenTarget}
	 */
	let navItems = [];
	/**
	 * @type {HTMLDivElement[]}
	 */
	let stars = [];

	// Mobile menu state
	let isMobileMenuOpen = false;
	let mobileMenu;
	let mobileMenuBtn;

	onMount(() => {
		// Create floating stars background
		createStars();

		// Initial navbar animation
		gsap.fromTo(
			navbar,
			{ y: -100, opacity: 0 },
			{ y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
		);

		// Logo animation
		gsap.fromTo(
			logo,
			{ scale: 0, rotation: -180 },
			{ scale: 1, rotation: 0, duration: 1.2, ease: 'back.out(1.7)', delay: 0.3 }
		);

		// Stagger nav items animation
		gsap.fromTo(
			navItems,
			{ x: 50, opacity: 0 },
			{ x: 0, opacity: 1, duration: 0.8, stagger: 0.1, delay: 0.6, ease: 'power2.out' }
		);

		// Animate stars
		animateStars();
	});

	function createStars() {
		const starContainer = document.querySelector('.stars-container');
		for (let i = 0; i < 50; i++) {
			const star = document.createElement('div');
			star.className = 'star';
			star.style.left = Math.random() * 100 + '%';
			star.style.top = Math.random() * 100 + '%';
			star.style.animationDelay = Math.random() * 3 + 's';
			// @ts-ignore
			starContainer.appendChild(star);
			stars.push(star);
		}
	}

	function animateStars() {
		stars.forEach((star) => {
			gsap.to(star, {
				opacity: Math.random() * 0.8 + 0.2,
				scale: Math.random() * 0.5 + 0.5,
				duration: Math.random() * 2 + 1,
				repeat: -1,
				yoyo: true,
				ease: 'power2.inOut'
			});
		});
	}

	// Mobile menu toggle
	function toggleMobileMenu() {
		isMobileMenuOpen = !isMobileMenuOpen;

		if (isMobileMenuOpen) {
			// Animate menu open
			gsap.to(mobileMenu, {
				height: 'auto',
				opacity: 1,
				duration: 0.4,
				ease: 'power2.out'
			});

			// Animate menu items
			gsap.fromTo(
				mobileMenu.querySelectorAll('.mobile-nav-item'),
				{ x: -50, opacity: 0 },
				{ x: 0, opacity: 1, duration: 0.3, stagger: 0.1, delay: 0.1, ease: 'power2.out' }
			);

			// Animate hamburger to X
			gsap.to(mobileMenuBtn.querySelectorAll('span'), {
				rotation: (index) => (index === 0 ? 45 : index === 1 ? 0 : -45),
				y: (index) => (index === 0 ? 8 : index === 1 ? 0 : -8),
				opacity: (index) => (index === 1 ? 0 : 1),
				duration: 0.3,
				ease: 'power2.out'
			});
		} else {
			// Animate menu close
			gsap.to(mobileMenu, {
				height: 0,
				opacity: 0,
				duration: 0.3,
				ease: 'power2.in'
			});

			// Reset hamburger
			gsap.to(mobileMenuBtn.querySelectorAll('span'), {
				rotation: 0,
				y: 0,
				opacity: 1,
				duration: 0.3,
				ease: 'power2.out'
			});
		}
	}

	// Close mobile menu when clicking on a link
	function closeMobileMenu() {
		if (isMobileMenuOpen) {
			toggleMobileMenu();
		}
	}

	// Simplified hover animations
	// @ts-ignore
	function handleNavHover(event) {
		const navItem = event.target.closest('.nav-item');

		gsap.to(navItem, {
			scale: 1.05,
			color: '#00f5ff',
			duration: 0.3,
			ease: 'power2.out'
		});

		// Simple glow effect
		gsap.to(navItem.querySelector('.nav-glow'), {
			opacity: 1,
			scale: 1.2,
			duration: 0.3,
			ease: 'power2.out'
		});
	}

	// @ts-ignore
	function handleNavLeave(event) {
		const navItem = event.target.closest('.nav-item');

		gsap.to(navItem, {
			scale: 1,
			color: '#e2e8f0',
			duration: 0.3,
			ease: 'power2.out'
		});

		gsap.to(navItem.querySelector('.nav-glow'), {
			opacity: 0,
			scale: 1,
			duration: 0.3,
			ease: 'power2.out'
		});
	}

	function handleLogoHover() {
		gsap.to(logo, {
			rotation: 360,
			scale: 1.1,
			duration: 0.6,
			ease: 'power2.out'
		});
	}

	function handleLogoLeave() {
		gsap.to(logo, {
			scale: 1,
			duration: 0.3,
			ease: 'power2.out'
		});
	}
</script>

<div class="stars-container"></div>

<nav bind:this={navbar} class="navbar">
	<div class="nav-container">
		<!-- Logo/Name Section -->
		<div class="logo-section">
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				bind:this={logo}
				class="logo"
				on:mouseenter={handleLogoHover}
				on:mouseleave={handleLogoLeave}
			>
				<span class="logo-text">Ramesh BG</span>
				<div class="logo-orbit"></div>
			</div>
		</div>

		<!-- Desktop Navigation Links -->
		<div class="nav-links">
			<a
				href="/"
				bind:this={navItems[0]}
				class="nav-item"
				on:mouseenter={handleNavHover}
				on:mouseleave={handleNavLeave}
			>
				<span class="nav-text">Home</span>
				<div class="nav-underline"></div>
				<div class="nav-glow"></div>
			</a>

			<a
				href="/about"
				bind:this={navItems[1]}
				class="nav-item"
				on:mouseenter={handleNavHover}
				on:mouseleave={handleNavLeave}
			>
				<span class="nav-text">About</span>
				<div class="nav-underline"></div>
				<div class="nav-glow"></div>
			</a>

			<a
				href="/experience"
				bind:this={navItems[2]}
				class="nav-item"
				on:mouseenter={handleNavHover}
				on:mouseleave={handleNavLeave}
			>
				<span class="nav-text">Experience</span>
				<div class="nav-underline"></div>
				<div class="nav-glow"></div>
			</a>

			<a
				href="/projects"
				bind:this={navItems[3]}
				class="nav-item"
				on:mouseenter={handleNavHover}
				on:mouseleave={handleNavLeave}
			>
				<span class="nav-text">Projects</span>
				<div class="nav-underline"></div>
				<div class="nav-glow"></div>
			</a>
		</div>

		<!-- Mobile Menu Button -->
		<div class="mobile-menu">
			<button bind:this={mobileMenuBtn} class="menu-btn" on:click={toggleMobileMenu}>
				<span></span>
				<span></span>
				<span></span>
			</button>
		</div>
	</div>

	<!-- Mobile Menu -->
	<div bind:this={mobileMenu} class="mobile-menu-items" class:open={isMobileMenuOpen}>
		<a href="/" class="mobile-nav-item" on:click={closeMobileMenu}>
			<span>Home</span>
		</a>
		<a href="/about" class="mobile-nav-item" on:click={closeMobileMenu}>
			<span>About</span>
		</a>
		<a href="/experience" class="mobile-nav-item" on:click={closeMobileMenu}>
			<span>Experience</span>
		</a>
		<a href="/projects" class="mobile-nav-item" on:click={closeMobileMenu}>
			<span>Projects</span>
		</a>
	</div>

	<!-- Navbar glow effect -->
	<div class="navbar-glow"></div>
</nav>

<style>
	:global(body) {
		margin: 0;
		background: radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%);
		min-height: 100vh;
		font-family: 'Space Mono', 'Courier New', monospace;
	}

	.stars-container {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		z-index: 1;
	}

	:global(.star) {
		position: absolute;
		width: 2px;
		height: 2px;
		background: #fff;
		border-radius: 50%;
		opacity: 0.8;
		animation: twinkle 2s infinite;
	}

	@keyframes twinkle {
		0%,
		100% {
			opacity: 0.3;
		}
		50% {
			opacity: 1;
		}
	}

	.navbar {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 1000;
		background: rgba(15, 23, 42, 0.8);
		backdrop-filter: blur(20px);
		border-bottom: 1px solid rgba(59, 130, 246, 0.3);
		padding: 1rem 2rem;
	}

	.navbar-glow {
		position: absolute;
		bottom: -1px;
		left: 0;
		right: 0;
		height: 1px;
		background: linear-gradient(90deg, transparent, #00f5ff, transparent);
		opacity: 0.6;
	}

	.nav-container {
		max-width: 1200px;
		margin: 0 auto;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.logo-section {
		display: flex;
		align-items: center;
	}

	.logo {
		position: relative;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.logo-text {
		font-size: 1.5rem;
		font-weight: bold;
		color: #00f5ff;
		text-shadow: 0 0 10px rgba(0, 245, 255, 0.5);
		letter-spacing: 2px;
		z-index: 2;
		position: relative;
	}

	.logo-orbit {
		position: absolute;
		width: 60px;
		height: 60px;
		border: 2px solid rgba(0, 245, 255, 0.3);
		border-radius: 50%;
		animation: rotate 20s linear infinite;
	}

	.logo-orbit::before {
		content: '';
		position: absolute;
		top: -3px;
		left: 50%;
		transform: translateX(-50%);
		width: 6px;
		height: 6px;
		background: #00f5ff;
		border-radius: 50%;
		box-shadow: 0 0 10px rgba(0, 245, 255, 0.8);
	}

	@keyframes rotate {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	.nav-links {
		display: flex;
		gap: 2rem;
		align-items: center;
	}

	.nav-item {
		position: relative;
		text-decoration: none;
		color: #e2e8f0;
		font-weight: 500;
		padding: 0.5rem 1rem;
		transition: all 0.3s ease;
		text-transform: uppercase;
		letter-spacing: 1px;
		font-size: 0.9rem;
		border-radius: 6px;
	}

	.nav-text {
		position: relative;
		z-index: 2;
	}

	/* Simple glow effect */
	.nav-glow {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: radial-gradient(circle, rgba(0, 245, 255, 0.2) 0%, transparent 70%);
		border-radius: 6px;
		opacity: 0;
		pointer-events: none;
	}

	.nav-underline {
		position: absolute;
		bottom: -2px;
		left: 50%;
		transform: translateX(-50%);
		width: 0;
		height: 2px;
		background: linear-gradient(90deg, #00f5ff, #3b82f6);
		transition: width 0.3s ease;
		border-radius: 1px;
	}

	.nav-item:hover .nav-underline {
		width: 80%;
	}

	.nav-item::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 245, 255, 0.05);
		border-radius: 6px;
		opacity: 0;
		transition: opacity 0.3s ease;
	}

	.nav-item:hover::before {
		opacity: 1;
	}

	.mobile-menu {
		display: none;
	}

	.menu-btn {
		background: none;
		border: none;
		cursor: pointer;
		padding: 0;
		width: 30px;
		height: 25px;
		position: relative;
		z-index: 1001;
	}

	.menu-btn span {
		display: block;
		width: 100%;
		height: 3px;
		background: #e2e8f0;
		margin: 5px 0;
		transition: all 0.3s ease;
		border-radius: 2px;
		transform-origin: center;
	}

	.menu-btn:hover span {
		background: #00f5ff;
		box-shadow: 0 0 5px rgba(0, 245, 255, 0.5);
	}

	/* Mobile Menu Items */
	.mobile-menu-items {
		position: absolute;
		top: 100%;
		left: 0;
		right: 0;
		background: rgba(15, 23, 42, 0.95);
		backdrop-filter: blur(20px);
		border-bottom: 1px solid rgba(59, 130, 246, 0.3);
		height: 0;
		opacity: 0;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		padding: 0;
	}

	.mobile-menu-items.open {
		padding: 1rem 2rem;
	}

	.mobile-nav-item {
		display: block;
		color: #e2e8f0;
		text-decoration: none;
		padding: 1rem 0;
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 1px;
		font-size: 0.9rem;
		border-bottom: 1px solid rgba(59, 130, 246, 0.1);
		transition: all 0.3s ease;
	}

	.mobile-nav-item:last-child {
		border-bottom: none;
	}

	.mobile-nav-item:hover {
		color: #00f5ff;
		padding-left: 1rem;
		background: rgba(0, 245, 255, 0.05);
		border-radius: 4px;
	}

	@media (max-width: 768px) {
		.navbar {
			padding: 1rem;
		}

		.nav-links {
			display: none;
		}

		.mobile-menu {
			display: block;
		}

		.logo-text {
			font-size: 1.2rem;
		}

		.logo-orbit {
			width: 45px;
			height: 45px;
		}
	}

	/* Scrollbar styling for webkit browsers */
	:global(::-webkit-scrollbar) {
		width: 8px;
	}

	:global(::-webkit-scrollbar-track) {
		background: rgba(15, 23, 42, 0.3);
	}

	:global(::-webkit-scrollbar-thumb) {
		background: rgba(0, 245, 255, 0.3);
		border-radius: 4px;
	}

	:global(::-webkit-scrollbar-thumb:hover) {
		background: rgba(0, 245, 255, 0.5);
	}
</style>
