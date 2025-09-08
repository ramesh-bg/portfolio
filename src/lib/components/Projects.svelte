<script lang="ts">
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';
	import * as THREE from 'three';
	import webglManager from './webglManager';

	let projectsContainer: HTMLElement | null = null;
	let backgroundContainer: HTMLDivElement | null = null;
	let projectCards: (HTMLElement | null)[] = [];
	let techIcons: (HTMLElement | null)[] = [];
	let projectBeacons: (HTMLCanvasElement | null)[] = [];

	// Three.js variables for cosmic background
	let bgScene: THREE.Scene;
	let bgCamera: THREE.PerspectiveCamera;
	let starField: THREE.Points;
	let nebulaSphere: THREE.Mesh;

	const projects = [
		{
			id: 1,
			title: 'Open Money',
			subtitle: 'Financial Services Platform',
			category: 'FinTech',
			tags: ['Accounting', 'GST Filing', 'Billing', 'Payouts', 'Integrations'],
			description:
				'Developed a comprehensive fintech platform covering accounting, GST filing, billing, payouts, and third-party integrations, ensuring compliance and scalability. Features automated reconciliation, real-time analytics, and seamless API integration for enterprise workflows.',
			tech: ['Angular', 'TypeScript', 'Node.js', 'MongoDB', 'Redis', 'Docker'],
			impact: {
				scope: 'Enterprise-grade fintech platform',
				outcome: 'Streamlined financial operations for 500+ businesses'
			},
			accentColor: '#7C3AED'
		},
		{
			id: 2,
			title: 'Static Sites Portfolio',
			subtitle: 'Marketing & Product Websites',
			category: 'Web Development',
			tags: ['SEO', 'Performance', 'Accessibility', 'Cross-browser'],
			description:
				'Built responsive and SEO-optimized static websites for marketing and product landing pages, with a focus on performance, accessibility, and cross-browser compatibility. Achieved 95+ Lighthouse scores and sub-3s load times.',
			tech: ['Next.js', 'TypeScript', 'TailwindCSS', 'Vercel', 'Figma'],
			impact: {
				scope: 'Multi-brand marketing websites',
				outcome: 'Enhanced brand visibility and lead generation'
			},
			accentColor: '#EF4444'
		},
		{
			id: 3,
			title: 'Open Ecosystem Suite',
			subtitle: 'Open Money, Zwitch, Optotax, Open Capital',
			category: 'FinTech Ecosystem',
			tags: ['Monorepo', 'Modular Apps', 'Reusable Libraries', 'NX'],
			description:
				'Contributed to multiple fintech initiatives under the Open ecosystem, delivering modular applications with reusable libraries and optimized builds in a monorepo setup. Implemented micro-frontend architecture with shared component libraries.',
			tech: ['Angular', 'NX Monorepo', 'TypeScript', 'RxJS', 'Docker', 'Kubernetes'],
			impact: {
				scope: 'Multi-product ecosystem architecture',
				outcome: 'Unified development experience and faster feature delivery'
			},
			accentColor: '#9333EA'
		},
		{
			id: 4,
			title: 'Apollo Insurance Platform',
			subtitle: 'Insurance Sales & Servicing',
			category: 'Insurance',
			tags: ['Underwriting', 'Claims', 'Banking Integrations', 'Sales'],
			description:
				'Designed and implemented a sales and servicing platform for vehicle and mortgage insurance, enabling underwriting, claims processing, and banking integrations. Built with microservices architecture for scalability and reliability.',
			tech: ['Angular', 'RxJS', 'Node.js', 'MongoDB', 'Microservices'],
			impact: {
				scope: 'End-to-end insurance platform',
				outcome: 'Digitized insurance operations and improved customer experience'
			},
			accentColor: '#3B82F6'
		},
		{
			id: 5,
			title: 'Ingredion DMS',
			subtitle: 'Document Management System',
			category: 'Enterprise Solutions',
			tags: ['RBAC', 'Document Storage', 'Versioning', 'Workflows'],
			description:
				'Delivered an RBAC-based document management solution with secure storage, approvals, versioning, and advanced search, streamlining enterprise document workflows. Features audit trails, automated compliance, and enterprise-grade security.',
			tech: ['Angular', 'Node.js', 'PostgreSQL', 'Redis', 'S3', 'ElasticSearch'],
			impact: {
				scope: 'Enterprise document management',
				outcome: 'Improved document governance and compliance workflows'
			},
			accentColor: '#10B981'
		},
		{
			id: 6,
			title: 'Open Capital',
			subtitle: 'Lending & Repayment Platform',
			category: 'Lending',
			tags: ['Credit Disbursement', 'Repayments', 'Compliance', 'Real-time Tracking'],
			description:
				'Built a lending and repayment system to manage credit disbursements, repayments, and compliance workflows with real-time tracking and reporting. Includes risk assessment, automated approvals, and portfolio management.',
			tech: ['Angular', 'TypeScript', 'Express', 'PostgreSQL', 'ML Models'],
			impact: {
				scope: 'Complete lending lifecycle management',
				outcome: 'Automated lending processes and risk management'
			},
			accentColor: '#7C3AED'
		},
		{
			id: 7,
			title: 'Payment Gateway SDK',
			subtitle: 'JavaScript Integration Kit',
			category: 'Payment Solutions',
			tags: ['JavaScript SDK', 'Secure Transactions', 'Checkout Flows', 'APIs'],
			description:
				'Developed a JavaScript SDK to simplify web-based payment gateway integration, supporting seamless checkout flows and secure transaction handling. Features tokenization, fraud detection, and multi-payment method support.',
			tech: ['JavaScript', 'TypeScript', 'Webpack', 'Jest', 'Payment APIs'],
			impact: {
				scope: 'Developer-focused integration SDK',
				outcome: 'Simplified merchant integration and improved developer experience'
			},
			accentColor: '#FACC15'
		},
		{
			id: 8,
			title: 'Aviva SRM',
			subtitle: 'Lead Management System',
			category: 'CRM Solutions',
			tags: ['Lead Management', 'Sales Lifecycle', 'Customer Engagement', 'Analytics'],
			description:
				'Created a lead and sales relationship management system for the insurance sector, supporting claims tracking, customer engagement, and end-to-end sales lifecycle management. Features AI-powered lead scoring and automated workflows.',
			tech: ['Angular', 'Node.js', 'MongoDB', 'Redis', 'Analytics APIs'],
			impact: {
				scope: 'Sales and relationship management platform',
				outcome: 'Enhanced sales efficiency and customer relationship management'
			},
			accentColor: '#8B5CF6'
		}
	];

	function createCosmicBackground() {
		if (!backgroundContainer) return;

		// Check if background already exists (shared from Experience component)
		if (webglManager.isBackgroundAvailable()) {
			console.log('🔄 Projects: Reusing existing shared background...');
			return;
		}

		console.log('🌟 Projects: Creating new shared background...');

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

	function createProjectBeacon(canvas: HTMLCanvasElement | null, color: string, index: number) {
		if (!canvas) return;

		const beaconId = `project-beacon-${index}`;

		const entry = webglManager.createBeacon(beaconId, canvas, 80, color, (entry) => {
			animateProjectBeacon(entry, color);
		});

		if (entry) {
			setupProjectBeacon(entry, color);
		}
	}

	function setupProjectBeacon(entry: any, color: string) {
		// Create main project beacon (diamond-like crystal)
		const geometry = new THREE.OctahedronGeometry(0.6, 1);
		const material = new THREE.MeshBasicMaterial({
			color: color,
			wireframe: true,
			transparent: true,
			opacity: 0.8
		});

		const beacon = new THREE.Mesh(geometry, material);
		entry.scene.add(beacon);
		entry.objects.beacon = beacon;

		// Create inner glow core
		const coreGeometry = new THREE.SphereGeometry(0.4, 16, 16);
		const coreMaterial = new THREE.MeshBasicMaterial({
			color: color,
			transparent: true,
			opacity: 0.6
		});

		const core = new THREE.Mesh(coreGeometry, coreMaterial);
		entry.scene.add(core);
		entry.objects.core = core;

		// Create energy rings with reduced complexity
		const ringCount = 2; // Reduced from 3
		const rings: THREE.Mesh[] = [];

		for (let i = 0; i < ringCount; i++) {
			const ringGeometry = new THREE.TorusGeometry(1 + i * 0.3, 0.02, 6, 12); // Reduced segments
			const ringMaterial = new THREE.MeshBasicMaterial({
				color: color,
				transparent: true,
				opacity: 0.4 - i * 0.1
			});

			const ring = new THREE.Mesh(ringGeometry, ringMaterial);
			ring.rotation.x = Math.random() * Math.PI;
			ring.rotation.y = Math.random() * Math.PI;
			entry.scene.add(ring);
			rings.push(ring);
		}
		entry.objects.rings = rings;

		// Create orbiting particles with reduced count
		const particleCount = 12; // Reduced from 20
		const particleGeometry = new THREE.BufferGeometry();
		const particlePositions = new Float32Array(particleCount * 3);

		for (let i = 0; i < particleCount; i++) {
			const radius = 1.5 + Math.random() * 0.8;
			const theta = (i / particleCount) * Math.PI * 2;
			const phi = Math.random() * Math.PI;

			particlePositions[i * 3] = Math.cos(theta) * Math.sin(phi) * radius;
			particlePositions[i * 3 + 1] = Math.sin(theta) * Math.sin(phi) * radius;
			particlePositions[i * 3 + 2] = Math.cos(phi) * radius;
		}

		particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

		const particleMaterial = new THREE.PointsMaterial({
			color: color,
			size: 3, // Reduced from 4
			transparent: true,
			opacity: 0.7, // Reduced from 0.8
			blending: THREE.AdditiveBlending,
			sizeAttenuation: false
		});

		const particles = new THREE.Points(particleGeometry, particleMaterial);
		entry.scene.add(particles);
		entry.objects.particles = particles;
	}

	function animateProjectBeacon(entry: any, color: string) {
		const time = Date.now() * 0.001;

		// Beacon rotation
		if (entry.objects.beacon) {
			entry.objects.beacon.rotation.y += 0.01; // Slightly slower
			entry.objects.beacon.rotation.x += 0.007;
		}

		// Core pulsing
		if (entry.objects.core) {
			entry.objects.core.scale.setScalar(1 + Math.sin(time * 2.2) * 0.25); // Reduced intensity
			entry.objects.core.material.opacity = 0.4 + Math.sin(time * 1.8) * 0.25;
		}

		// Ring rotations
		if (entry.objects.rings) {
			entry.objects.rings.forEach((ring: THREE.Mesh, idx: number) => {
				ring.rotation.y += 0.004 + idx * 0.0015; // Slower rotation
				ring.rotation.x += 0.002 + idx * 0.0008;
				(ring.material as THREE.MeshBasicMaterial).opacity = 0.25 + Math.sin(time + idx) * 0.15;
			});
		}

		// Particle orbit
		if (entry.objects.particles) {
			entry.objects.particles.rotation.y += 0.008; // Slower
			entry.objects.particles.rotation.z += 0.004;
		}
	}

	function handleScroll() {
		if (!projectsContainer) return;

		const containerRect = projectsContainer.getBoundingClientRect();
		const isVisible = containerRect.top < window.innerHeight && containerRect.bottom > 0;

		if (isVisible && !projectsContainer.classList.contains('animated')) {
			projectsContainer.classList.add('animated');
			animateElements();
		}
	}

	function animateElements() {
		gsap.fromTo(
			'.section-title',
			{ opacity: 0, y: 50, scale: 0.8 },
			{ opacity: 1, y: 0, scale: 1, duration: 1.2, ease: 'power3.out' }
		);

		projectCards.forEach((card, index) => {
			if (card) {
				gsap.fromTo(
					card,
					{ opacity: 0, y: 100, scale: 0.8, rotationX: 10 },
					{
						opacity: 1,
						y: 0,
						scale: 1,
						rotationX: 0,
						duration: 1.2,
						delay: 0.1 + index * 0.1,
						ease: 'power3.out'
					}
				);
			}
		});

		setTimeout(() => {
			techIcons.forEach((icon, index) => {
				if (icon) {
					gsap.fromTo(
						icon,
						{ scale: 0, opacity: 0, rotation: 180 },
						{
							scale: 1,
							opacity: 1,
							rotation: 0,
							duration: 0.6,
							delay: index * 0.02,
							ease: 'back.out(1.7)'
						}
					);
				}
			});

			projectBeacons.forEach((canvas, index) => {
				if (canvas) {
					gsap.fromTo(
						canvas,
						{ scale: 0, opacity: 0 },
						{
							scale: 1,
							opacity: 1,
							duration: 1,
							delay: 0.3 + index * 0.1,
							ease: 'back.out(1.7)'
						}
					);
				}
			});
		}, 600);
	}

	function handleResize() {
		webglManager.resizeBackground(bgCamera);
	}

	onMount(() => {
		console.log('🚀 Projects component mounting...');

		// Register component and get allocated beacon slots
		const allocatedSlots = webglManager.registerComponent('projects', projects.length);

		createCosmicBackground();

		// Initialize project beacons with allocated slots only
		for (let index = 0; index < allocatedSlots; index++) {
			const canvas = projectBeacons[index];
			if (canvas && projects[index]) {
				createProjectBeacon(canvas, projects[index].accentColor, index);
			}
		}

		window.addEventListener('scroll', handleScroll);
		window.addEventListener('resize', handleResize);
		handleScroll();

		// Log stats
		console.log('📊 Projects WebGL Stats:', webglManager.getStats());

		return () => {
			console.log('🧹 Projects component unmounting...');
			window.removeEventListener('scroll', handleScroll);
			window.removeEventListener('resize', handleResize);

			// Clean up component beacons
			webglManager.disposeComponentBeacons('projects');

			console.log('📊 Final WebGL Stats:', webglManager.getStats());
		};
	});
</script>

<svelte:window on:resize={handleResize} />

<!-- Cosmic Background - Only show if not already available -->
{#if !webglManager.isBackgroundAvailable()}
	<div bind:this={backgroundContainer} class="cosmic-background"></div>
{/if}

<section bind:this={projectsContainer} class="projects-section">
	<div class="container">
		<h2 class="section-title">Projects</h2>
		<p class="section-subtitle">
			Delivering innovative solutions across fintech, insurance, and enterprise domains
		</p>

		<div class="projects-grid">
			{#each projects as project, index}
				<article
					bind:this={projectCards[index]}
					class="project-card"
					style="--accent-color: {project.accentColor}"
				>
					<!-- Project Beacon -->
					<div class="project-beacon-container">
						<canvas bind:this={projectBeacons[index]} class="project-beacon" width="80" height="80"
						></canvas>
					</div>

					<!-- Project Header -->
					<header class="project-header">
						<div class="project-category" style="color: {project.accentColor};">
							{project.category}
						</div>
						<h3 class="project-title">{project.title}</h3>
						<p class="project-subtitle">{project.subtitle}</p>
					</header>

					<!-- Project Tags -->
					<div class="project-tags">
						{#each project.tags as tag}
							<span
								class="project-tag"
								style="background-color: {project.accentColor}15; color: {project.accentColor}; border-color: {project.accentColor}30;"
							>
								{tag}
							</span>
						{/each}
					</div>

					<!-- Project Description -->
					<p class="project-description">{@html project.description}</p>

					<!-- Project Impact & Scope -->
					<div class="project-impact">
						<span class="impact-label">Project Impact & Scope:</span>
						<div class="impact-grid">
							<div class="impact-item">
								<span class="impact-key">Scope:</span>
								<span class="impact-value">{project.impact.scope}</span>
							</div>
							<div class="impact-item">
								<span class="impact-key">Outcome:</span>
								<span class="impact-value">{project.impact.outcome}</span>
							</div>
						</div>
					</div>

					<!-- Tech Stack -->
					<div class="tech-stack">
						<span class="tech-label">Tech Stack:</span>
						<div class="tech-icons">
							{#each project.tech as tech, techIndex}
								<div
									bind:this={techIcons[index * project.tech.length + techIndex]}
									class="tech-icon"
									title={tech}
								>
									<div class="tech-name">{tech}</div>
								</div>
							{/each}
						</div>
					</div>

					<!-- Project Accent Line -->
					<div
						class="project-accent-line"
						style="background: linear-gradient(90deg, {project.accentColor}, transparent);"
					></div>
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

	.projects-section {
		padding: 5rem 2rem;
		min-height: 100vh;
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
		margin-bottom: 1rem;
		text-align: center;
		letter-spacing: -0.02em;
		text-shadow:
			0 0 20px rgba(224, 230, 237, 0.3),
			0 0 40px rgba(0, 245, 255, 0.2);
	}

	.section-subtitle {
		font-size: 1.2rem;
		color: #94a3b8;
		text-align: center;
		margin-bottom: 4rem;
		font-weight: 300;
	}

	.projects-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 2rem;
		margin-top: 2rem;
	}

	.project-card {
		background: rgba(15, 23, 42, 0.4);
		backdrop-filter: blur(20px);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 24px;
		padding: 2rem;
		position: relative;
		overflow: hidden;
		transition: all 0.4s ease;
		box-shadow:
			0 8px 32px rgba(0, 0, 0, 0.3),
			0 0 1px rgba(255, 255, 255, 0.2),
			inset 0 1px 0 rgba(255, 255, 255, 0.05);
	}

	.project-card:hover {
		transform: translateY(-12px) scale(1.02);
		box-shadow:
			0 25px 80px rgba(0, 0, 0, 0.0001),
			0 0 16px var(--accent-color),
			inset 0 1px 0 rgba(255, 255, 255, 0.1) !important;
		border-color: rgba(255, 255, 255, 0.2);
	}

	.project-beacon-container {
		position: absolute;
		top: -30px;
		right: -30px;
		z-index: 10;
	}

	.project-beacon {
		width: 80px !important;
		height: 80px !important;
		border-radius: 50%;
		filter: drop-shadow(0 0 25px var(--accent-color));
	}

	.project-header {
		margin-bottom: 1.5rem;
	}

	.project-category {
		font-size: 0.85rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		margin-bottom: 0.75rem;
	}

	.project-title {
		font-size: 1.4rem;
		font-weight: 700;
		color: #e2e8f0;
		margin: 0 0 0.5rem 0;
		line-height: 1.3;
		padding-right: 2rem;
	}

	.project-subtitle {
		font-size: 0.9rem;
		color: #94a3b8;
		font-weight: 400;
		margin: 0;
		padding-right: 2rem;
	}

	.project-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-bottom: 1.2rem;
	}

	.project-tag {
		font-size: 0.7rem;
		font-weight: 500;
		padding: 0.3rem 0.6rem;
		border: 1px solid;
		border-radius: 10px;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		backdrop-filter: blur(5px);
		transition: all 0.3s ease;
	}

	.project-tag:hover {
		transform: scale(1.05);
		box-shadow: 0 0 15px var(--accent-color);
	}

	.project-description {
		color: #cbd5e1;
		line-height: 1.6;
		margin-bottom: 1.2rem;
		font-size: 0.85rem;
	}

	.project-impact {
		margin-bottom: 1.2rem;
	}

	.impact-label {
		font-size: 0.85rem;
		font-weight: 600;
		color: #94a3b8;
		margin-bottom: 0.6rem;
		display: block;
	}

	.impact-grid {
		display: grid;
		gap: 0.4rem;
	}

	.impact-item {
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
	}

	.impact-key {
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--accent-color);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.impact-value {
		font-size: 0.8rem;
		color: #cbd5e1;
		font-weight: 400;
		line-height: 1.3;
	}

	.tech-stack {
		margin-top: 1.2rem;
	}

	.tech-label {
		font-size: 0.85rem;
		font-weight: 600;
		color: #94a3b8;
		margin-bottom: 0.6rem;
		display: block;
	}

	.tech-icons {
		display: flex;
		flex-wrap: wrap;
		gap: 0.6rem;
	}

	.tech-icon {
		background: rgba(15, 23, 42, 0.6);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 8px;
		padding: 0.4rem 0.6rem;
		transition: all 0.3s ease;
		cursor: default;
	}

	.tech-icon:hover {
		transform: scale(1.05);
		border-color: var(--accent-color);
		box-shadow: 0 0 15px var(--accent-color);
		background: rgba(255, 255, 255, 0.05);
	}

	.tech-name {
		font-size: 0.75rem;
		font-weight: 500;
		color: #e2e8f0;
		white-space: nowrap;
	}

	.project-accent-line {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 4px;
		opacity: 0.7;
	}

	/* Responsive Design */
	@media (max-width: 1400px) {
		.projects-grid {
			grid-template-columns: repeat(3, 1fr);
			gap: 1.8rem;
		}

		.project-card {
			padding: 1.8rem;
		}
	}

	@media (max-width: 1200px) {
		.projects-grid {
			grid-template-columns: repeat(2, 1fr);
			gap: 1.5rem;
		}

		.project-card {
			padding: 2rem;
		}

		.project-title {
			font-size: 1.5rem;
		}

		.project-subtitle {
			font-size: 0.95rem;
		}
	}

	@media (max-width: 900px) {
		.projects-grid {
			grid-template-columns: repeat(2, 1fr);
			gap: 1.3rem;
		}

		.project-card {
			padding: 1.8rem;
		}

		.project-beacon {
			width: 70px !important;
			height: 70px !important;
		}

		.project-beacon-container {
			top: -25px;
			right: -25px;
		}
	}

	@media (max-width: 768px) {
		.projects-section {
			padding: 3rem 1rem;
		}

		.section-title {
			font-size: 2.2rem;
		}

		.section-subtitle {
			font-size: 1rem;
			margin-bottom: 3rem;
		}

		.projects-grid {
			grid-template-columns: 1fr;
			gap: 1.5rem;
		}

		.project-card {
			padding: 1.5rem;
		}

		.project-title {
			font-size: 1.3rem;
			padding-right: 1.5rem;
		}

		.project-subtitle {
			padding-right: 1.5rem;
			font-size: 0.9rem;
		}

		.project-beacon {
			width: 60px !important;
			height: 60px !important;
		}

		.project-beacon-container {
			top: -20px;
			right: -20px;
		}
	}

	@media (max-width: 480px) {
		.project-card {
			padding: 1.25rem;
		}

		.project-title {
			font-size: 1.2rem;
			padding-right: 1.2rem;
		}

		.project-subtitle {
			padding-right: 1.2rem;
			font-size: 0.85rem;
		}

		.project-beacon {
			width: 50px !important;
			height: 50px !important;
		}

		.project-beacon-container {
			top: -15px;
			right: -15px;
		}

		.tech-icons {
			gap: 0.4rem;
		}

		.tech-icon {
			padding: 0.3rem 0.5rem;
		}

		.tech-name {
			font-size: 0.7rem;
		}
	}
</style>
