<script lang="ts">
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';

	let introContainer: any;
	let skillsOrbit: HTMLDivElement;
	let contentSection: HTMLDivElement;
	let skillIcons: HTMLElement[] = [];
	let sunCenter: HTMLElement;
	let tooltip: HTMLDivElement;

	const skills = [
		{
			name: 'Angular',
			icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/angular/angular-original.svg',
			description: 'Modern web framework for building scalable applications'
		},
		{
			name: 'JavaScript',
			icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg',
			description: 'Dynamic programming language for web development'
		},
		{
			name: 'TypeScript',
			icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg',
			description: 'Strongly typed JavaScript superset'
		},
		{
			name: 'HTML5',
			icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg',
			description: 'Modern markup language for web structure'
		},
		{
			name: 'CSS3',
			icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg',
			description: 'Styling language for beautiful web designs'
		},
		{
			name: 'RxJS',
			icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/rxjs/rxjs-original.svg',
			description: 'Reactive programming library for handling async data'
		},
		{
			name: 'TailwindCSS',
			icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg',
			description: 'Utility-first CSS framework for rapid UI development'
		},
		{
			name: 'Svelte',
			icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/svelte/svelte-original.svg',
			description: 'Compile-time optimized web framework'
		}
	];

	let currentPositions: number[] = [];
	let rotationTimeline: gsap.core.Timeline;
	let isAnimating = false;
	const radius = 180;

	// Calculate circular positions
	function getCircularPosition(index: number) {
		const angle = (360 / skills.length) * index;
		const radian = (angle * Math.PI) / 180;
		return {
			x: Math.cos(radian) * radius,
			y: Math.sin(radian) * radius
		};
	}

	onMount(() => {
		// Initialize positions array
		currentPositions = skills.map((_, index) => index);

		// Initial entrance animations
		gsap.fromTo(
			contentSection,
			{ x: -50, opacity: 0 },
			{ x: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.3 }
		);

		gsap.fromTo(
			sunCenter,
			{ scale: 0, rotation: -180 },
			{ scale: 1, rotation: 0, duration: 1, ease: 'back.out(1.7)', delay: 0.5 }
		);

		gsap.fromTo(
			skillsOrbit,
			{ scale: 0, opacity: 0 },
			{ scale: 1, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.7 }
		);

		// Set initial positions for icons
		skillIcons.forEach((icon, index) => {
			const position = getCircularPosition(index);
			gsap.set(icon, {
				x: position.x,
				y: position.y,
				scale: 0,
				opacity: 0
			});
		});

		// Stagger skill icons entrance
		gsap.to(skillIcons, {
			scale: 1,
			opacity: 1,
			duration: 0.4,
			stagger: 0.1,
			delay: 1,
			ease: 'back.out(1.7)'
		});

		// Start the sequential movement animation (slower)
		setTimeout(() => {
			startSequentialMovement();
		}, 3000);

		// Setup skill icon interactions
		skillIcons.forEach((icon, index) => {
			const skill = skills[index];

			icon.addEventListener('mouseenter', (e) => {
				if (!isAnimating) {
					// Pause rotation
					rotationTimeline?.pause();

					// Scale up hovered icon
					gsap.to(icon, {
						scale: 1.4,
						duration: 0.3,
						ease: 'back.out(1.7)'
					});

					// Show tooltip
					showTooltip(e, skill);

					// Dim other icons
					skillIcons.forEach((otherIcon, otherIndex) => {
						if (otherIndex !== index) {
							gsap.to(otherIcon, {
								opacity: 0.4,
								duration: 0.2
							});
						}
					});
				}
			});

			icon.addEventListener('mouseleave', () => {
				if (!isAnimating) {
					// Resume rotation
					rotationTimeline?.resume();

					// Reset icon scale
					gsap.to(icon, {
						scale: 1,
						duration: 0.3,
						ease: 'power2.out'
					});

					// Hide tooltip
					hideTooltip();

					// Restore other icons opacity
					skillIcons.forEach((otherIcon) => {
						gsap.to(otherIcon, {
							opacity: 1,
							duration: 0.3
						});
					});
				}
			});
		});
	});

	function startSequentialMovement() {
		rotationTimeline = gsap.timeline({ repeat: -1 });

		// Create movement sequence (slower)
		rotationTimeline.add(() => {
			moveIconsOnePosition();
		});

		rotationTimeline.to({}, { duration: 4 }); // Increased wait time for slower rotation
	}

	function moveIconsOnePosition() {
		isAnimating = true;

		// Shift positions array (move each icon to next position)
		const lastPosition = currentPositions.pop()!;
		currentPositions.unshift(lastPosition);

		// Highlight the icon moving to top position
		const topIconIndex = currentPositions[0];
		highlightIcon(topIconIndex);

		// Move each icon to its new position (slower animation)
		skillIcons.forEach((icon, iconIndex) => {
			const newPositionIndex = currentPositions[iconIndex];
			const newPosition = getCircularPosition(newPositionIndex);

			gsap.to(icon, {
				x: newPosition.x,
				y: newPosition.y,
				duration: 2.5, // Increased duration for slower movement
				ease: 'power2.inOut',
				onComplete: () => {
					if (iconIndex === 0) {
						isAnimating = false;
					}
				}
			});
		});
	}

	function highlightIcon(iconIndex: number) {
		skillIcons.forEach((icon, index) => {
			if (index === iconIndex) {
				gsap.to(icon, {
					scale: 1.3,
					duration: 0.4,
					ease: 'power2.out'
				});
				gsap.to(icon.querySelector('img'), {
					filter: 'drop-shadow(0 0 15px #00f5ff) brightness(1.3)',
					duration: 0.4
				});
			} else {
				gsap.to(icon, {
					scale: 1,
					duration: 0.4,
					ease: 'power2.out'
				});
				gsap.to(icon.querySelector('img'), {
					filter: 'drop-shadow(0 0 5px rgba(0, 245, 255, 0.3)) brightness(1)',
					duration: 0.4
				});
			}
		});
	}

	function showTooltip(event: MouseEvent, skill: any) {
		const rect = skillsOrbit.getBoundingClientRect();
		tooltip.innerHTML = `
            <div class="tooltip-title">${skill.name}</div>
            <div class="tooltip-desc">${skill.description}</div>
        `;

		gsap.set(tooltip, {
			display: 'block',
			x: event.clientX - rect.left,
			y: event.clientY - rect.top - 80,
			opacity: 0,
			scale: 0.8
		});

		gsap.to(tooltip, {
			opacity: 1,
			scale: 1,
			duration: 0.2,
			ease: 'power2.out'
		});
	}

	function hideTooltip() {
		gsap.to(tooltip, {
			opacity: 0,
			scale: 0.8,
			duration: 0.2,
			ease: 'power2.in',
			onComplete: () => {
				gsap.set(tooltip, { display: 'none' });
			}
		});
	}
</script>

<section bind:this={introContainer} class="intro-section">
	<div class="intro-container">
		<!-- Left Side - Compact Content -->
		<div bind:this={contentSection} class="content-section">
			<div class="greeting">
				<h1 class="name-title">
					Hi, I'm <span class="highlight">Ramesh BG</span>
				</h1>
				<h2 class="role-title">Frontend Developer</h2>
			</div>

			<p class="role-summary">
				Crafting exceptional user experiences with modern web technologies. Passionate about clean
				code, scalable architecture, and innovative solutions.
			</p>

			<div class="contact-links">
				<a
					href="https://www.linkedin.com/in/rameshbg/"
					target="_blank"
					rel="noopener noreferrer"
					class="contact-link"
				>
					<svg class="contact-icon" viewBox="0 0 24 24" fill="currentColor">
						<path
							d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
						/>
					</svg>
					<span class="contact-text">LinkedIn</span>
				</a>

				<a href="tel:+917829112957" class="contact-link">
					<svg class="contact-icon" viewBox="0 0 24 24" fill="currentColor">
						<path
							d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"
						/>
					</svg>
					<span class="contact-text">+91 7829112957</span>
				</a>

				<a href="mailto:rameshbg11@gmail.com" class="contact-link">
					<svg class="contact-icon" viewBox="0 0 24 24" fill="currentColor">
						<path
							d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
						/>
					</svg>
					<span class="contact-text">rameshbg11@gmail.com</span>
				</a>

				<!-- Resume Link -->
				<a href="/resume-v2.pdf" target="_blank" rel="noopener noreferrer" class="contact-link">
					<svg class="contact-icon" viewBox="0 0 24 24" fill="currentColor">
						<path
							d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"
						/>
					</svg>
					<span class="contact-text">Resume</span>
				</a>
			</div>
		</div>

		<!-- Right Side - Individual Icon Movement -->
		<div class="skills-section">
			<div class="solar-system">
				<div bind:this={skillsOrbit} class="skills-orbit">
					{#each skills as skill, index}
						<div bind:this={skillIcons[index]} class="skill-planet">
							<img src={skill.icon} alt={skill.name} />
						</div>
					{/each}
				</div>

				<!-- Dev Center with Static Holographic Icon -->
				<div bind:this={sunCenter} class="dev-center">
					<div class="dev-glow"></div>
					<img
						src="https://user-gen-media-assets.s3.amazonaws.com/gpt4o_images/5733a92f-684f-47dc-8775-988b93cc5a74.png"
						alt="Holographic Dev Icon"
						class="dev-icon-img"
					/>
				</div>

				<!-- Tooltip -->
				<div bind:this={tooltip} class="skill-tooltip"></div>
			</div>
		</div>
	</div>
</section>

<style>
	.intro-section {
		min-height: 100vh;
		display: flex;
		align-items: center;
		padding: 2rem;
		position: relative;
		/* ADD NAVBAR SPACE - Critical Fix */
		padding-top: 6rem; /* Space for fixed navbar */
	}

	.intro-container {
		max-width: 1200px;
		margin: 0 auto;
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 3rem;
		align-items: center;
		width: 100%;
	}

	/* Left Side - Compact Content */
	.content-section {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.name-title {
		font-size: clamp(2rem, 4vw, 3rem);
		font-weight: bold;
		color: #e2e8f0;
		margin: 0;
		line-height: 1.2;
	}

	.highlight {
		color: #00f5ff;
		background: linear-gradient(45deg, #00f5ff, #3b82f6);
		background-clip: text;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.role-title {
		font-size: clamp(1.2rem, 2.5vw, 1.5rem);
		color: #94a3b8;
		margin: 0.5rem 0 0 0;
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 1px;
	}

	.role-summary {
		font-size: 1rem;
		line-height: 1.6;
		color: #cbd5e1;
		margin: 0;
		max-width: 400px;
	}

	.contact-links {
		display: flex;
		flex-direction: row;
		gap: 1rem;
		margin-top: 1rem;
		flex-wrap: wrap;
	}

	.contact-link {
		width: 48px;
		min-width: 48px;
		height: 48px;
		background: rgba(15, 23, 42, 0.6);
		border: 2px solid rgba(0, 245, 255, 0.3);
		border-radius: 24px;
		display: flex;
		align-items: center;
		color: #00f5ff;
		text-decoration: none;
		transition: all 0.4s ease;
		backdrop-filter: blur(10px);
		overflow: hidden;
		white-space: nowrap;
		padding-left: 12px;
		box-sizing: border-box;
	}

	.contact-link:hover {
		width: auto;
		padding-right: 16px;
		border-color: #00f5ff;
		box-shadow: 0 0 20px rgba(0, 245, 255, 0.5);
	}

	.contact-icon {
		flex-shrink: 0;
		width: 20px;
		height: 20px;
	}

	.contact-text {
		opacity: 0;
		max-width: 0;
		margin-left: 8px;
		font-size: 0.9rem;
		font-weight: 500;
		transition:
			opacity 0.4s ease,
			max-width 0.4s ease;
		white-space: nowrap;
		overflow: hidden;
		flex-shrink: 0;
	}

	.contact-link:hover .contact-text {
		opacity: 1;
		max-width: 200px;
	}

	/* Right Side - Individual Icon Movement */
	.skills-section {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 500px;
		position: relative;
	}

	.solar-system {
		position: relative;
		width: 400px;
		height: 400px;
	}

	.skills-orbit {
		position: absolute;
		width: 100%;
		height: 100%;
		border-radius: 50%;
		border: 1px solid rgba(0, 245, 255, 0.2);
		animation: orbit-glow 3s ease-in-out infinite alternate;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	@keyframes orbit-glow {
		from {
			box-shadow: 0 0 10px rgba(0, 245, 255, 0.2);
		}
		to {
			box-shadow: 0 0 30px rgba(0, 245, 255, 0.4);
		}
	}

	.skill-planet {
		position: absolute;
		width: 50px;
		height: 50px;
		background: rgba(15, 23, 42, 0.8);
		border: 2px solid rgba(59, 130, 246, 0.4);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		backdrop-filter: blur(10px);
		cursor: pointer;
		transition: border-color 0.3s ease;

		/* Center the icons initially */
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	.skill-planet:hover {
		border-color: #00f5ff;
	}

	.skill-planet img {
		width: 28px;
		height: 28px;
		object-fit: contain;
		pointer-events: none;
		filter: drop-shadow(0 0 5px rgba(0, 245, 255, 0.3));
		transition: filter 0.3s ease;
	}

	/* Dev Center with Static Holographic Icon */
	.dev-center {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 120px;
		height: 120px;
		background: radial-gradient(
			circle,
			rgba(0, 245, 255, 0.1) 0%,
			rgba(0, 245, 255, 0.05) 50%,
			transparent 100%
		);
		border: 2px solid rgba(0, 245, 255, 0.3);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow:
			0 0 40px rgba(0, 245, 255, 0.4),
			inset 0 0 20px rgba(0, 245, 255, 0.1);
		z-index: 10;
		backdrop-filter: blur(10px);
	}

	.dev-glow {
		position: absolute;
		width: 160px;
		height: 160px;
		background: radial-gradient(circle, rgba(0, 245, 255, 0.2) 0%, transparent 70%);
		border-radius: 50%;
		animation: dev-pulse 3s ease-in-out infinite alternate;
		pointer-events: none;
	}

	@keyframes dev-pulse {
		from {
			transform: scale(1);
			opacity: 0.4;
		}
		to {
			transform: scale(1.3);
			opacity: 0.1;
		}
	}

	.dev-icon-img {
		width: 70px;
		height: 70px;
		display: block;
		filter: drop-shadow(0 0 15px #00f5ff) drop-shadow(0 0 30px #0ff) brightness(1.2);
		border-radius: 8px;
		z-index: 2;
	}

	/* Tooltip */
	.skill-tooltip {
		position: absolute;
		background: rgba(15, 23, 42, 0.95);
		border: 1px solid #00f5ff;
		border-radius: 8px;
		padding: 0.75rem;
		min-width: 200px;
		box-shadow: 0 0 20px rgba(0, 245, 255, 0.3);
		backdrop-filter: blur(10px);
		z-index: 100;
		display: none;
		pointer-events: none;
	}

	:global(.tooltip-title) {
		font-size: 0.9rem;
		font-weight: bold;
		color: #00f5ff;
		margin-bottom: 0.25rem;
	}

	:global(.tooltip-desc) {
		font-size: 0.8rem;
		color: #cbd5e1;
		line-height: 1.4;
	}

	/* ENHANCED RESPONSIVE DESIGN - Key Fixes */
	@media (max-width: 1024px) {
		.intro-section {
			padding-top: 5rem; /* Reduce for tablet */
		}

		.intro-container {
			grid-template-columns: 1fr;
			gap: 2rem;
			text-align: center;
		}

		.solar-system {
			width: 350px;
			height: 350px;
		}

		.contact-links {
			justify-content: center;
		}
	}

	@media (max-width: 768px) {
		.intro-section {
			padding: 1rem;
			padding-top: 5rem; /* CRITICAL: Space for mobile navbar */
			min-height: calc(100vh - 80px); /* Account for navbar height */
		}

		.intro-container {
			gap: 1.5rem;
			padding-top: 1rem; /* Additional spacing on mobile */
		}

		.content-section {
			gap: 1rem; /* Tighter spacing on mobile */
		}

		.name-title {
			font-size: clamp(1.8rem, 6vw, 2.5rem); /* Smaller on mobile */
			margin-bottom: 0.5rem;
		}

		.role-title {
			font-size: clamp(1rem, 4vw, 1.3rem);
			margin: 0.3rem 0 0 0;
		}

		.role-summary {
			font-size: 0.9rem;
			line-height: 1.5;
			max-width: 100%; /* Full width on mobile */
		}

		.solar-system {
			width: 280px;
			height: 280px;
		}

		.skill-planet {
			width: 40px;
			height: 40px;
		}

		.skill-planet img {
			width: 22px;
			height: 22px;
		}

		.dev-center {
			width: 100px;
			height: 100px;
		}

		.dev-icon-img {
			width: 60px;
			height: 60px;
		}

		.contact-links {
			justify-content: center;
			gap: 0.8rem; /* Smaller gaps on mobile */
			margin-top: 1.5rem;
		}
	}

	/* EXTRA SMALL SCREENS - Additional fixes */
	@media (max-width: 480px) {
		.intro-section {
			padding: 0.5rem;
			padding-top: 4.5rem; /* Adjust for smaller navbar */
		}

		.intro-container {
			padding-top: 0.5rem;
		}

		.name-title {
			font-size: clamp(1.6rem, 8vw, 2.2rem);
		}

		.role-title {
			font-size: clamp(0.9rem, 5vw, 1.2rem);
		}

		.role-summary {
			font-size: 0.85rem;
		}

		.solar-system {
			width: 240px;
			height: 240px;
		}

		.contact-links {
			flex-direction: row; /* Keep horizontal on mobile */
			flex-wrap: wrap;
			gap: 0.6rem;
		}
	}

	/* LANDSCAPE MOBILE - Prevent overlap */
	@media (max-width: 768px) and (orientation: landscape) {
		.intro-section {
			padding-top: 4rem;
			min-height: 100vh;
		}

		.intro-container {
			grid-template-columns: 1fr 1fr; /* Side by side in landscape */
			gap: 2rem;
			align-items: center;
		}
	}
</style>
