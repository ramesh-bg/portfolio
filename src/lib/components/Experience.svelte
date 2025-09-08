<script lang="ts">
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';
	import * as THREE from 'three';
	import webglManager from './webglManager';

	let experienceContainer: HTMLElement | null = null;
	let backgroundContainer: HTMLDivElement | null = null;
	let experienceCards: (HTMLElement | null)[] = [];
	let skillIcons: (HTMLElement | null)[] = [];
	let domainCanvases: (HTMLCanvasElement | null)[] = [];

	// Three.js variables for cosmic background
	let bgScene: THREE.Scene;
	let bgCamera: THREE.PerspectiveCamera;
	let starField: THREE.Points;
	let nebulaSphere: THREE.Mesh;

	const experiences = [
		{
			id: 1,
			period: 'Jan 2021 — Present',
			position: 'Lead Software Engineer',
			company: 'Open Financial Technologies',
			companyUrl: 'https://open.money/',
			companyLogo:
				'https://open-frontend-bucket.s3.amazonaws.com/logos/favicon/favicon-darkmode.svg',
			description:
				'Led a team to develop fintech products including invoicing, billing, GST filing, integrations, payment links, and payouts. Rewrote the product using NX Monorepo architecture, building shareable libraries and migrating to latest versions.',
			domains: ['Accounting', 'Payment Gateway', 'GST Management', 'Lending'],
			skills: [
				{
					name: 'Angular',
					icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/angular/angular-original.svg',
					description: 'A platform for building mobile and desktop web applications',
					link: 'https://angular.io/docs'
				},
				{
					name: 'TypeScript',
					icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg',
					description: 'JavaScript with syntax for types',
					link: 'https://www.typescriptlang.org/docs/'
				},
				{
					name: 'TailwindCSS',
					icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg',
					description: 'A utility-first CSS framework',
					link: 'https://tailwindcss.com/docs'
				},
				{
					name: 'Svelte',
					icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/svelte/svelte-original.svg',
					description: 'Cybernetically enhanced web apps',
					link: 'https://svelte.dev/docs'
				},
				{
					name: 'NX Monorepo',
					icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 262 163'%3E%3Cg fill='%23663399'%3E%3Cpath d='M130.55 0L262 81.5v81.5H130.55L0 81.5V0h130.55zm0 40.8L45.7 81.5l84.85 40.7L215.4 81.5L130.55 40.8z'/%3E%3C/g%3E%3C/svg%3E",
					description: 'Smart, fast and extensible build system',
					link: 'https://nx.dev/getting-started/intro'
				},
				{
					name: 'RxJS',
					icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/rxjs/rxjs-original.svg',
					description: 'Reactive Extensions Library for JavaScript',
					link: 'https://rxjs.dev/guide/overview'
				},
				{
					name: 'D3.js',
					icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/d3js/d3js-original.svg',
					description: 'Data-Driven Documents',
					link: 'https://d3js.org/'
				},
				{
					name: 'SCSS',
					icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/sass/sass-original.svg',
					description: 'Syntactically Awesome StyleSheets',
					link: 'https://sass-lang.com/documentation/'
				}
			],
			current: true,
			accentColor: '#663399'
		},
		{
			id: 2,
			period: 'Oct 2017 — Jan 2021',
			position: 'Software Engineer',
			company: 'Neutrinos',
			companyUrl: 'https://www.neutrinos.com/',
			companyLogo:
				"data:image/svg+xml,%3Csvg width='38' height='24' viewBox='0 0 38 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M28.145 0.0262295L19.0832 7.16066L9.54159 0.0262295H7.22283V23.9475H9.48829L18.5501 16.8131L28.0651 23.9475H30.3838V0.0262295H28.1184H28.145ZM28.0384 20.9574L11.4339 8.52459V11.4623L16.6578 15.3705L9.6482 20.8787V3.01639L26.2794 15.4492V12.5115L21.0555 8.60328L28.0651 3.09508V20.9574H28.0384ZM37.66 21.0623V24L32.2229 19.9344V16.9967L37.6866 21.0623H37.66ZM0 2.93771V0L5.43711 4.06557V7.00328L0 2.93771Z' fill='%233b82f6'/%3E%3C/svg%3E",
			description:
				'Developed products like OV2-Webforms for production plant data, Document Management System with RBAC, iOS iPad app for policy management, insurance sales application, and quality trace & track systems.',
			domains: ['Insurance', 'Claims', 'Underwriting', 'Banking'],
			skills: [
				{
					name: 'Angular',
					icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/angular/angular-original.svg',
					description: 'A platform for building mobile and desktop web applications',
					link: 'https://angular.io/docs'
				},
				{
					name: 'RxJS',
					icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/rxjs/rxjs-original.svg',
					description: 'Reactive Extensions Library for JavaScript',
					link: 'https://rxjs.dev/guide/overview'
				},
				{
					name: 'Node.js',
					icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg',
					description: "JavaScript runtime built on Chrome's V8 engine",
					link: 'https://nodejs.org/en/docs/'
				},
				{
					name: 'MongoDB',
					icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg',
					description: 'The most popular database for modern apps',
					link: 'https://docs.mongodb.com/'
				},
				{
					name: 'Jasmine',
					icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/jasmine/jasmine-original.svg',
					description: 'Behavior-driven development framework for testing',
					link: 'https://jasmine.github.io/'
				},
				{
					name: 'Karma',
					icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/karma/karma-original.svg',
					description: 'Test runner for JavaScript',
					link: 'https://karma-runner.github.io/latest/index.html'
				}
			],
			current: false,
			accentColor: '#3b82f6'
		}
	];

	function createCosmicBackground() {
		if (!backgroundContainer) return;

		// Check if background already exists
		if (webglManager.isBackgroundAvailable()) {
			console.log('🔄 Reusing existing background...');
			return;
		}

		bgScene = new THREE.Scene();
		bgCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
		bgCamera.position.set(0, 0, 0);

		createNebulaSphere();
		createStarField();

		webglManager.initBackground(backgroundContainer, bgScene, bgCamera, animateBackground);
	}

	function createNebulaSphere() {
		const geometry = new THREE.SphereGeometry(5000, 64, 64);

		const vertexShader = `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `;

		const fragmentShader = `
            uniform float time;
            varying vec2 vUv;

            float random(vec2 st) {
                return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
            }

            float noise(vec2 st) {
                vec2 i = floor(st);
                vec2 f = fract(st);
                float a = random(i);
                float b = random(i + vec2(1.0, 0.0));
                float c = random(i + vec2(0.0, 1.0));
                float d = random(i + vec2(1.0, 1.0));
                vec2 u = f * f * (3.0 - 2.0 * f);
                return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
            }

            void main() {
                vec2 uv = vUv;
                float t = time * 0.1;
                
                float n1 = noise(uv * 2.0 + t) * 0.5;
                float n2 = noise(uv * 4.0 - t * 0.5) * 0.3;
                
                vec3 color1 = vec3(0.02, 0.02, 0.1);
                vec3 color2 = vec3(0.1, 0.02, 0.2);
                vec3 color3 = vec3(0.0, 0.3, 0.6);
                
                vec3 finalColor = mix(color1, color2, n1 + 0.5);
                finalColor = mix(finalColor, color3, max(0.0, n2));
                finalColor *= (0.3 + n1 * 0.7);
                
                gl_FragColor = vec4(finalColor, 1.0);
            }
        `;

		const material = new THREE.ShaderMaterial({
			uniforms: {
				time: { value: 0 }
			},
			vertexShader,
			fragmentShader,
			side: THREE.BackSide
		});

		nebulaSphere = new THREE.Mesh(geometry, material);
		bgScene.add(nebulaSphere);
	}

	function createStarField() {
		const geometry = new THREE.BufferGeometry();
		const starCount = 2000;
		const positions = new Float32Array(starCount * 3);

		for (let i = 0; i < starCount; i++) {
			const theta = Math.random() * Math.PI * 2;
			const phi = Math.acos(1 - 2 * Math.random());
			const radius = 1000 + Math.random() * 3000;

			positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
			positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
			positions[i * 3 + 2] = radius * Math.cos(phi);
		}

		geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

		const material = new THREE.PointsMaterial({
			size: 2,
			transparent: true,
			opacity: 0.8,
			color: 0xffffff
		});

		starField = new THREE.Points(geometry, material);
		bgScene.add(starField);
	}

	function animateBackground() {
		const time = Date.now() * 0.001;

		if (nebulaSphere) {
			(nebulaSphere.material as THREE.ShaderMaterial).uniforms.time.value = time;
		}

		if (starField) {
			starField.rotation.y += 0.0002;
			starField.rotation.x += 0.0001;
		}
	}

	function createFlowingBeacon(canvas: HTMLCanvasElement | null, color: string, index: number) {
		if (!canvas) return;

		const beaconId = `experience-beacon-${index}`;

		const entry = webglManager.createBeacon(beaconId, canvas, 60, color, (entry) => {
			animateFlowingBeacon(entry, color);
		});

		if (entry) {
			setupFlowingBeacon(entry, color);
		}
	}

	function setupFlowingBeacon(entry: any, color: string) {
		// Create pulsing beacon
		const geometry = new THREE.SphereGeometry(0.3, 8, 8);
		const material = new THREE.MeshBasicMaterial({
			color: color,
			transparent: true,
			opacity: 0.8
		});

		const beacon = new THREE.Mesh(geometry, material);
		entry.scene.add(beacon);
		entry.objects.beacon = beacon;

		// Create flowing particles with reduced count
		const particleCount = 8; // Reduced for better performance
		const particleGeometry = new THREE.BufferGeometry();
		const particlePositions = new Float32Array(particleCount * 3);

		for (let i = 0; i < particleCount; i++) {
			const angle = (i / particleCount) * Math.PI * 2;
			const radius = 0.8 + Math.random() * 0.4;

			particlePositions[i * 3] = Math.cos(angle) * radius;
			particlePositions[i * 3 + 1] = Math.sin(angle) * radius;
			particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 0.2;
		}

		particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

		const particleMaterial = new THREE.PointsMaterial({
			color: color,
			size: 2,
			transparent: true,
			opacity: 0.6,
			blending: THREE.AdditiveBlending,
			sizeAttenuation: false
		});

		const particles = new THREE.Points(particleGeometry, particleMaterial);
		entry.scene.add(particles);
		entry.objects.particles = particles;
	}

	function animateFlowingBeacon(entry: any, color: string) {
		const time = Date.now() * 0.001;

		if (entry.objects.beacon) {
			entry.objects.beacon.scale.setScalar(1 + Math.sin(time * 3) * 0.3);
			entry.objects.beacon.material.opacity = 0.6 + Math.sin(time * 2) * 0.2;
		}

		if (entry.objects.particles) {
			entry.objects.particles.rotation.z += 0.02;
			const positions = entry.objects.particles.geometry.attributes.position.array;

			for (let i = 0; i < 8; i++) {
				// Match reduced particle count
				const i3 = i * 3;
				positions[i3 + 1] += Math.sin(time * 2 + i * 0.5) * 0.01;
			}

			entry.objects.particles.geometry.attributes.position.needsUpdate = true;
		}
	}

	function handleScroll() {
		if (!experienceContainer) return;

		const containerRect = experienceContainer.getBoundingClientRect();
		const isVisible = containerRect.top < window.innerHeight && containerRect.bottom > 0;

		if (isVisible && !experienceContainer.classList.contains('animated')) {
			experienceContainer.classList.add('animated');
			animateElements();
		}
	}

	function animateElements() {
		gsap.fromTo(
			'.section-title',
			{ opacity: 0, y: 50, scale: 0.8 },
			{ opacity: 1, y: 0, scale: 1, duration: 1.2, ease: 'power3.out' }
		);

		experienceCards.forEach((card, index) => {
			if (card) {
				gsap.fromTo(
					card,
					{ opacity: 0, x: -100, scale: 0.9 },
					{ opacity: 1, x: 0, scale: 1, duration: 1, delay: 0.3 + index * 0.2, ease: 'power3.out' }
				);
			}

			gsap.fromTo(
				`.domain-branch-${index}`,
				{ scaleX: 0, opacity: 0 },
				{
					scaleX: 1,
					opacity: 1,
					duration: 0.8,
					delay: 0.8 + index * 0.2,
					ease: 'power2.out',
					transformOrigin: 'left'
				}
			);
		});

		setTimeout(() => {
			skillIcons.forEach((icon, index) => {
				if (icon) {
					gsap.fromTo(
						icon,
						{ scale: 0, opacity: 0 },
						{ scale: 1, opacity: 1, duration: 0.6, delay: index * 0.05, ease: 'back.out(1.7)' }
					);
				}
			});

			domainCanvases.forEach((canvas, index) => {
				if (canvas) {
					gsap.fromTo(
						canvas,
						{ scale: 0, opacity: 0 },
						{ scale: 1, opacity: 1, duration: 0.6, delay: index * 0.1, ease: 'back.out(1.7)' }
					);
				}
			});
		}, 1200);
	}

	function handleResize() {
		webglManager.resizeBackground(bgCamera);
	}

	onMount(() => {
		console.log('🚀 Experience component mounting...');

		// Register component and get allocated beacon slots
		const totalDomains = experiences.reduce((sum, exp) => sum + exp.domains.length, 0);
		const allocatedSlots = webglManager.registerComponent('experience', totalDomains);

		createCosmicBackground();

		// Initialize domain beacons with allocated slots only
		let beaconIndex = 0;
		for (const canvas of domainCanvases) {
			if (canvas && beaconIndex < allocatedSlots) {
				const expIndex = Math.floor(beaconIndex / 4);
				const color = experiences[expIndex]?.accentColor || '#00f5ff';
				createFlowingBeacon(canvas, color, beaconIndex);
				beaconIndex++;
			}
		}

		window.addEventListener('scroll', handleScroll);
		window.addEventListener('resize', handleResize);
		handleScroll();

		// Log stats
		console.log('📊 Experience WebGL Stats:', webglManager.getStats());

		return () => {
			console.log('🧹 Experience component unmounting...');
			window.removeEventListener('scroll', handleScroll);
			window.removeEventListener('resize', handleResize);

			// Clean up component beacons
			webglManager.disposeComponentBeacons('experience');

			console.log('📊 Final WebGL Stats:', webglManager.getStats());
		};
	});
</script>

<!-- Cosmic Background -->
{#if backgroundContainer || webglManager.isBackgroundAvailable()}
	<div bind:this={backgroundContainer} class="cosmic-background"></div>
{/if}

<section bind:this={experienceContainer} class="experience-section">
	<div class="container">
		<h2 class="section-title">Experience</h2>

		<div class="experience-list">
			{#each experiences as exp, index}
				<article
					bind:this={experienceCards[index]}
					class="experience-item left-aligned"
					style="--accent-color: {exp.accentColor}"
				>
					<!-- Timeline -->
					<div class="timeline-side">
						<div class="timeline-dot {exp.current ? 'active' : ''}">
							<div class="dot-pulse"></div>
						</div>
						{#if index < experiences.length - 1}
							<div class="timeline-line"></div>
						{/if}
					</div>

					<!-- Main Content Card -->
					<div class="content-card">
						<div class="card-accent-border"></div>

						<header class="job-header">
							<div class="period">
								{exp.period}
							</div>
							<h3 class="position">{exp.position}</h3>
							<div class="company-info">
								<img src={exp.companyLogo} alt="{exp.company} logo" class="company-logo" />
								<a href={exp.companyUrl} target="_blank" rel="noopener noreferrer" class="company">
									{exp.company}
									<svg class="external-icon" viewBox="0 0 12 12" fill="none">
										<path
											d="M3.5 3.5H8.5V8.5"
											stroke="currentColor"
											stroke-width="1.5"
											stroke-linecap="round"
											stroke-linejoin="round"
										/>
										<path
											d="M8.5 3.5L3.5 8.5"
											stroke="currentColor"
											stroke-width="1.5"
											stroke-linecap="round"
											stroke-linejoin="round"
										/>
									</svg>
								</a>
							</div>
						</header>

						<p class="description">{exp.description}</p>

						<div class="skills-grid">
							{#each exp.skills as skill, skillIndex}
								<div
									bind:this={skillIcons[index * exp.skills.length + skillIndex]}
									class="skill-icon-wrapper"
									on:click={() => window.open(skill.link, '_blank')}
									title={skill.description}
									role="button"
									tabindex="0"
									on:keydown={(e) => e.key === 'Enter' && window.open(skill.link, '_blank')}
								>
									<img src={skill.icon} alt={skill.name} class="skill-icon" />
									<div class="skill-tooltip">
										<strong>{skill.name}</strong><br />
										<span class="tooltip-desc">{skill.description}</span>
									</div>
								</div>
							{/each}
						</div>
					</div>

					<!-- Domain Branches -->
					<div class="domain-branches">
						{#each exp.domains as domain, domainIndex}
							<div
								class="domain-branch domain-branch-{index}"
								style="--delay: {domainIndex * 0.2}s"
							>
								<div
									class="branch-line"
									style="background: linear-gradient(90deg, var(--accent-color), transparent);"
								></div>
								<div class="domain-beacon">
									<canvas
										bind:this={domainCanvases[index * 4 + domainIndex]}
										class="beacon-canvas"
										width="60"
										height="60"
									></canvas>
									<div
										class="domain-label"
										style="color: var(--accent-color); border-color: var(--accent-color);"
									>
										{domain}
									</div>
								</div>
							</div>
						{/each}
					</div>
				</article>
			{/each}
		</div>
	</div>
</section>

<style>
	.cosmic-background {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: -1;
		pointer-events: none;
	}

	.experience-section {
		padding: 5rem 2rem;
		min-height: 100vh;
		display: flex;
		align-items: center;
		position: relative;
	}

	.container {
		max-width: 1400px;
		margin: 0 auto;
		width: 100%;
	}

	.section-title {
		font-size: 2.8rem;
		font-weight: 300;
		color: #e0e6ed;
		margin-bottom: 4rem;
		text-align: center;
		letter-spacing: -0.02em;
		text-shadow:
			0 0 20px rgba(224, 230, 237, 0.3),
			0 0 40px rgba(0, 245, 255, 0.2);
	}

	.experience-list {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 4rem;
	}

	.experience-item {
		display: flex;
		align-items: flex-start;
		position: relative;
		width: 100%;
		max-width: 1200px;
	}

	.experience-item.left-aligned {
		justify-content: flex-start;
	}

	.timeline-side {
		flex-shrink: 0;
		width: 40px;
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-right: 2rem;
		position: relative;
	}

	.timeline-dot {
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background: rgba(224, 230, 237, 0.6);
		border: 4px solid rgba(15, 23, 42, 0.9);
		box-shadow:
			0 0 15px rgba(224, 230, 237, 0.3),
			inset 0 0 10px rgba(255, 255, 255, 0.1);
		position: relative;
		z-index: 10;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.3s ease;
	}

	.timeline-dot.active {
		background: var(--accent-color);
		border-color: rgba(0, 0, 0, 0.3);
		box-shadow:
			0 0 25px var(--accent-color),
			0 0 50px var(--accent-color),
			inset 0 0 15px rgba(255, 255, 255, 0.2);
	}

	.dot-pulse {
		width: 6px;
		height: 6px;
		background: #000;
		border-radius: 50%;
		animation: pulse-dot 2s infinite;
	}

	.timeline-dot:not(.active) .dot-pulse {
		background: var(--accent-color);
	}

	@keyframes pulse-dot {
		0%,
		100% {
			opacity: 1;
			transform: scale(1);
		}
		50% {
			opacity: 0.6;
			transform: scale(1.3);
		}
	}

	.timeline-line {
		width: 3px;
		height: 120px;
		background: linear-gradient(
			to bottom,
			var(--accent-color) 0%,
			rgba(0, 245, 255, 0.3) 50%,
			rgba(224, 230, 237, 0.2) 100%
		);
		margin-top: 1rem;
		border-radius: 2px;
		box-shadow: 0 0 10px rgba(0, 245, 255, 0.2);
	}

	.content-card {
		flex: 0 0 600px;
		background: rgba(15, 23, 42, 0.4);
		backdrop-filter: blur(20px);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 16px;
		padding: 2rem;
		box-shadow:
			0 8px 32px rgba(0, 0, 0, 0.3),
			0 0 1px rgba(255, 255, 255, 0.2),
			inset 0 1px 0 rgba(255, 255, 255, 0.05);
		transition: all 0.3s ease;
		position: relative;
		overflow: hidden;
	}

	.card-accent-border {
		position: absolute;
		top: 0;
		left: 0;
		width: 4px;
		height: 100%;
		background: var(--accent-color);
		opacity: 0.6;
	}

	.content-card:hover {
		transform: translateY(-5px);
		box-shadow:
			0 20px 60px rgba(0, 0, 0, 0.4),
			0 0 20px var(--accent-color),
			inset 0 1px 0 rgba(255, 255, 255, 0.1);
		border-color: rgba(255, 255, 255, 0.2);
	}

	.job-header {
		margin-bottom: 1.5rem;
	}

	.period {
		font-size: 0.875rem;
		color: var(--accent-color);
		font-weight: 600;
		margin-bottom: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		background: rgba(255, 255, 255, 0.05);
		padding: 0.4rem 0.8rem;
		border-radius: 20px;
		display: inline-block;
		border: 1px solid rgba(255, 255, 255, 0.1);
	}

	.position {
		font-size: 1.5rem;
		font-weight: 600;
		color: #e2e8f0;
		margin: 0 0 0.8rem 0;
		line-height: 1.3;
	}

	.company-info {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		flex-wrap: wrap;
	}

	.company-logo {
		width: 28px;
		height: 28px;
		border-radius: 6px;
		object-fit: contain;
		background: rgba(255, 255, 255, 0.05);
		padding: 4px;
		filter: brightness(1.1);
		flex-shrink: 0;
	}

	.company {
		color: var(--accent-color);
		text-decoration: none;
		font-weight: 500;
		font-size: 1.1rem;
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		transition: all 0.3s ease;
		flex-wrap: wrap;
	}

	.company:hover {
		text-shadow: 0 0 10px currentColor;
	}

	.external-icon {
		width: 14px;
		height: 14px;
		opacity: 0.7;
		transition: transform 0.3s ease;
		flex-shrink: 0;
	}

	.company:hover .external-icon {
		transform: translate(2px, -2px);
	}

	.description {
		color: #cbd5e1;
		line-height: 1.7;
		margin-bottom: 2rem;
		font-size: 1rem;
	}

	.skills-grid {
		display: flex;
		flex-wrap: wrap;
		gap: 0.8rem;
	}

	.skill-icon-wrapper {
		position: relative;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.skill-icon {
		width: 40px;
		height: 40px;
		border-radius: 8px;
		border: 2px solid rgba(255, 255, 255, 0.1);
		padding: 6px;
		background: rgba(15, 23, 42, 0.6);
		transition: all 0.3s ease;
		filter: drop-shadow(0 0 8px rgba(0, 245, 255, 0.2));
	}

	.skill-icon-wrapper:hover .skill-icon {
		transform: scale(1.1);
		border-color: var(--accent-color);
		box-shadow: 0 0 20px var(--accent-color);
		background: rgba(255, 255, 255, 0.05);
	}

	.skill-tooltip {
		position: absolute;
		bottom: 120%;
		left: 50%;
		transform: translateX(-50%);
		background: rgba(15, 23, 42, 0.95);
		color: #e2e8f0;
		padding: 0.75rem 1rem;
		border-radius: 8px;
		font-size: 0.8rem;
		white-space: normal;
		opacity: 0;
		pointer-events: none;
		transition: all 0.3s ease;
		z-index: 100;
		border: 1px solid rgba(255, 255, 255, 0.2);
		box-shadow: 0 8px 25px rgba(0, 0, 0, 0.6);
		max-width: 250px;
		text-align: center;
		backdrop-filter: blur(10px);
	}

	.skill-tooltip strong {
		color: var(--accent-color);
		font-weight: 600;
	}

	.tooltip-desc {
		font-size: 0.75rem;
		color: #94a3b8;
		margin-top: 0.25rem;
		display: block;
	}

	.skill-tooltip::after {
		content: '';
		position: absolute;
		top: 100%;
		left: 50%;
		transform: translateX(-50%);
		border: 6px solid transparent;
		border-top-color: rgba(15, 23, 42, 0.95);
	}

	.skill-icon-wrapper:hover .skill-tooltip {
		opacity: 1;
		transform: translateX(-50%) translateY(-5px);
	}

	/* Domain Branches */
	.domain-branches {
		flex: 1;
		margin-left: 2rem;
		display: flex;
		flex-direction: column;
		gap: 1.2rem;
		padding-top: 2rem;
		min-width: 300px;
	}

	.domain-branch {
		display: flex;
		align-items: center;
		animation-delay: var(--delay);
	}

	.branch-line {
		width: 120px;
		height: 2px;
		border-radius: 1px;
		box-shadow: 0 0 8px var(--accent-color);
		margin-right: 1rem;
		flex-shrink: 0;
	}

	.domain-beacon {
		display: flex;
		align-items: center;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.beacon-canvas {
		width: 60px !important;
		height: 60px !important;
		border-radius: 50%;
		filter: drop-shadow(0 0 15px var(--accent-color));
		flex-shrink: 0;
	}

	.domain-label {
		font-size: 0.9rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		padding: 0.5rem 1rem;
		border: 1px solid;
		border-radius: 15px;
		background: rgba(0, 0, 0, 0.3);
		backdrop-filter: blur(10px);
		white-space: nowrap;
		transition: all 0.3s ease;
		flex-shrink: 0;
		text-align: center;
		min-width: 120px;
	}

	.domain-label:hover {
		transform: scale(1.05);
		box-shadow: 0 0 20px var(--accent-color);
	}

	/* Responsive Design */
	@media (max-width: 1400px) {
		.container {
			max-width: 1200px;
		}

		.content-card {
			flex-basis: 550px;
		}

		.domain-branches {
			min-width: 280px;
		}
	}

	@media (max-width: 1200px) {
		.experience-item {
			flex-direction: column;
			align-items: center;
			gap: 2rem;
		}

		.content-card {
			flex: none;
			width: 100%;
			max-width: 800px;
		}

		.domain-branches {
			margin-left: 0;
			margin-top: 0;
			align-items: center;
			min-width: auto;
			width: 100%;
		}

		.branch-line {
			width: 100px;
		}
	}

	@media (max-width: 768px) {
		.experience-section {
			padding: 3rem 1rem;
		}

		.section-title {
			font-size: 2.2rem;
			margin-bottom: 3rem;
		}

		.timeline-side {
			margin-right: 1rem;
			width: 30px;
		}

		.content-card {
			padding: 1.5rem;
		}

		.position {
			font-size: 1.3rem;
		}

		.skills-grid {
			gap: 0.6rem;
		}

		.skill-icon {
			width: 36px;
			height: 36px;
		}

		.domain-branches {
			gap: 0.8rem;
		}

		.branch-line {
			width: 60px;
		}

		.beacon-canvas {
			width: 50px !important;
			height: 50px !important;
		}

		.domain-label {
			font-size: 0.8rem;
			padding: 0.4rem 0.8rem;
			min-width: 90px;
		}
	}
</style>
