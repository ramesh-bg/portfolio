<script lang="ts">
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';
	import * as THREE from 'three';
	import webglManager from './webglManager';

	let academicsContainer: HTMLElement | null = null;
	let backgroundContainer: HTMLDivElement | null = null;
	let cardElements: (HTMLElement | null)[] = [];
	let subjectElements: (HTMLElement | null)[] = [];
	let academicsBeacons: (HTMLCanvasElement | null)[] = [];

	// Three.js variables for cosmic background
	let bgScene: THREE.Scene;
	let bgCamera: THREE.PerspectiveCamera;
	let starField: THREE.Points;
	let nebulaSphere: THREE.Mesh;

	const academics = [
		{
			id: 1,
			period: 'July 2013 — May 2017',
			degree: 'Bachelor of Engineering in Computer Science',
			institution: 'Jain College of Engineering, Belagavi',
			highlights:
				'Focused on core computer science concepts, software development, and engineering fundamentals. Participated in technical events and academic projects.',
			subjects: ['Data Structures', 'Algorithms', 'Operating Systems', 'Web Development'],
			accentColor: '#10B981',
			current: false
		},
		{
			id: 2,
			period: 'July 2011 — June 2013',
			degree: 'Pre-University (PCMCS)',
			institution: 'JSS College, Dharwad',
			highlights:
				'Specialized in Physics, Chemistry, Mathematics, and Computer Science. Built a strong foundation in analytical thinking, problem-solving, and basic programming concepts.',
			subjects: ['Physics', 'Chemistry', 'Mathematics', 'Computer Science'],
			accentColor: '#3B82F6',
			current: false
		}
	];

	function createCosmicBackground() {
		if (!backgroundContainer) return;

		// Check if background already exists (shared)
		if (webglManager.isBackgroundAvailable()) {
			console.log('🔄 Academics: Reusing existing shared background...');
			return;
		}

		console.log('🌟 Academics: Creating new shared background...');

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

	function createAcademicBeacon(canvas: HTMLCanvasElement | null, color: string, index: number) {
		if (!canvas) return;

		const beaconId = `academic-beacon-${index}`;

		const entry = webglManager.createBeacon(
			beaconId,
			canvas,
			50,
			color,
			(entry) => {
				animateAcademicBeacon(entry, color);
			},
			'academics'
		);

		if (entry) {
			setupAcademicBeacon(entry, color);
		}
	}

	function setupAcademicBeacon(entry: any, color: string) {
		// Create academic beacon (book/graduation cap shape)
		const geometry = new THREE.ConeGeometry(0.3, 0.6, 6);
		const material = new THREE.MeshBasicMaterial({
			color: color,
			transparent: true,
			opacity: 0.8
		});

		const beacon = new THREE.Mesh(geometry, material);
		entry.scene.add(beacon);
		entry.objects.beacon = beacon;

		// Create knowledge particles
		const particleCount = 6;
		const particleGeometry = new THREE.BufferGeometry();
		const particlePositions = new Float32Array(particleCount * 3);

		for (let i = 0; i < particleCount; i++) {
			const angle = (i / particleCount) * Math.PI * 2;
			const radius = 0.8 + Math.random() * 0.3;

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

	function animateAcademicBeacon(entry: any, color: string) {
		const time = Date.now() * 0.001;

		if (entry.objects.beacon) {
			entry.objects.beacon.rotation.y += 0.015;
			entry.objects.beacon.rotation.z += 0.005;
			entry.objects.beacon.scale.setScalar(1 + Math.sin(time * 2) * 0.2);
		}

		if (entry.objects.particles) {
			entry.objects.particles.rotation.z += 0.02;
			const positions = entry.objects.particles.geometry.attributes.position.array;

			for (let i = 0; i < 6; i++) {
				const i3 = i * 3;
				positions[i3 + 1] += Math.sin(time * 1.5 + i * 0.5) * 0.008;
			}

			entry.objects.particles.geometry.attributes.position.needsUpdate = true;
		}
	}

	function animateElements() {
		gsap.fromTo(
			'.section-title',
			{ opacity: 0, y: 50, scale: 0.8 },
			{ opacity: 1, y: 0, scale: 1, duration: 1.2, ease: 'power3.out' }
		);

		cardElements.forEach((el, index) => {
			if (el) {
				gsap.fromTo(
					el,
					{ opacity: 0, x: -100, scale: 0.9 },
					{ opacity: 1, x: 0, scale: 1, duration: 1, delay: 0.3 + index * 0.2, ease: 'power3.out' }
				);
			}
		});

		setTimeout(() => {
			subjectElements.forEach((element, index) => {
				if (element) {
					gsap.fromTo(
						element,
						{ scale: 0, opacity: 0 },
						{ scale: 1, opacity: 1, duration: 0.6, delay: index * 0.05, ease: 'back.out(1.7)' }
					);
				}
			});

			academicsBeacons.forEach((canvas, index) => {
				if (canvas) {
					gsap.fromTo(
						canvas,
						{ scale: 0, opacity: 0 },
						{ scale: 1, opacity: 1, duration: 0.6, delay: index * 0.1, ease: 'back.out(1.7)' }
					);
				}
			});
		}, 1000);
	}

	function handleScroll() {
		if (!academicsContainer) return;
		const rect = academicsContainer.getBoundingClientRect();
		if (
			rect.top < window.innerHeight &&
			rect.bottom > 0 &&
			!academicsContainer.classList.contains('animated')
		) {
			academicsContainer.classList.add('animated');
			animateElements();
		}
	}

	function handleResize() {
		webglManager.resizeBackground(bgCamera);
	}

	onMount(() => {
		console.log('🚀 Academics component mounting...');

		// Register component and get allocated beacon slots
		const allocatedSlots = webglManager.registerComponent('academics', academics.length);

		createCosmicBackground();

		// Initialize academic beacons with allocated slots only
		for (let index = 0; index < allocatedSlots; index++) {
			const canvas = academicsBeacons[index];
			if (canvas && academics[index]) {
				createAcademicBeacon(canvas, academics[index].accentColor, index);
			}
		}

		window.addEventListener('scroll', handleScroll);
		window.addEventListener('resize', handleResize);
		handleScroll();

		console.log('📊 Academics WebGL Stats:', webglManager.getStats());

		return () => {
			console.log('🧹 Academics component unmounting...');
			window.removeEventListener('scroll', handleScroll);
			window.removeEventListener('resize', handleResize);

			// Clean up component beacons
			webglManager.disposeComponentBeacons('academics');

			console.log('📊 Final WebGL Stats:', webglManager.getStats());
		};
	});
</script>

<!-- Cosmic Background - Only show if not already available -->
{#if !webglManager.isBackgroundAvailable()}
	<div bind:this={backgroundContainer} class="cosmic-background"></div>
{/if}

<section bind:this={academicsContainer} class="academics-section">
	<div class="container">
		<h2 class="section-title">Academics</h2>

		<div class="academics-list">
			{#each academics as acad, index}
				<article
					bind:this={cardElements[index]}
					class="academy-card"
					style="--accent-color: {acad.accentColor}"
				>
					<!-- Timeline -->
					<div class="timeline-side">
						<div class="timeline-dot {acad.current ? 'active' : ''}">
							<div class="dot-pulse"></div>
						</div>
						{#if index < academics.length - 1}
							<div class="timeline-line"></div>
						{/if}
					</div>

					<!-- Main Content Card -->
					<div class="content-card">
						<div class="card-accent-border"></div>

						<!-- Academic Beacon -->
						<div class="academic-beacon-container">
							<canvas
								bind:this={academicsBeacons[index]}
								class="academic-beacon"
								width="50"
								height="50"
							></canvas>
						</div>

						<header class="academic-header">
							<div class="acad-period">{acad.period}</div>
							<h3 class="acad-degree">{acad.degree}</h3>
							<div class="acad-institution">{acad.institution}</div>
						</header>

						<p class="acad-highlights">{acad.highlights}</p>

						<div class="acad-subjects">
							<span class="subjects-label">Key Subjects:</span>
							<div class="subjects-grid">
								{#each acad.subjects as subject, subjectIndex}
									<div
										bind:this={subjectElements[index * acad.subjects.length + subjectIndex]}
										class="subject-tag"
										role="button"
										tabindex="0"
									>
										{subject}
									</div>
								{/each}
							</div>
						</div>
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

	.academics-section {
		padding: 5rem 2rem;
		min-height: 100vh;
		display: flex;
		align-items: center;
		position: relative;
	}

	.container {
		max-width: 1200px;
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

	.academics-list {
		display: flex;
		flex-direction: column;
		gap: 4rem;
		position: relative;
	}

	.academy-card {
		display: flex;
		align-items: flex-start;
		position: relative;
		width: 100%;
		max-width: 1000px;
		margin: 0 auto;
	}

	/* Timeline styling matching Experience */
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
		background: var(--accent-color);
		border: 4px solid rgba(15, 23, 42, 0.9);
		box-shadow:
			0 0 15px var(--accent-color),
			inset 0 0 10px rgba(255, 255, 255, 0.1);
		position: relative;
		z-index: 10;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.3s ease;
	}

	.dot-pulse {
		width: 6px;
		height: 6px;
		background: #000;
		border-radius: 50%;
		animation: pulse-dot 2s infinite;
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
		flex: 1;
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

	/* REDUCED CONTRAST HOVER EFFECTS */
	.content-card:hover {
		transform: translateY(-3px); /* Reduced from -5px */
		box-shadow:
			0 12px 40px rgba(0, 0, 0, 0.5),
			/* Reduced from 0.4 */ 0 0 15px rgba(var(--accent-color-rgb, 16, 185, 129), 0.3),
			/* Reduced glow */ inset 0 1px 0 rgba(255, 255, 255, 0.08);
		border-color: rgba(255, 255, 255, 0.15); /* Reduced from 0.2 */
	}

	.academic-beacon-container {
		position: absolute;
		top: -15px;
		right: -15px;
		z-index: 10;
	}

	.academic-beacon {
		width: 50px !important;
		height: 50px !important;
		border-radius: 50%;
		filter: drop-shadow(0 0 12px var(--accent-color)); /* Reduced glow */
	}

	.academic-header {
		margin-bottom: 1.5rem;
		padding-right: 1.5rem;
	}

	.acad-period {
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

	.acad-degree {
		font-size: 1.4rem;
		font-weight: 600;
		color: #e2e8f0;
		margin: 0 0 0.8rem 0;
		line-height: 1.3;
	}

	.acad-institution {
		font-size: 1.1rem;
		color: var(--accent-color);
		font-weight: 500;
		margin-bottom: 0.5rem;
		opacity: 0.9;
	}

	.acad-highlights {
		color: #cbd5e1;
		line-height: 1.7;
		margin-bottom: 2rem;
		font-size: 1rem;
	}

	.acad-subjects {
		margin-top: 1rem;
	}

	.subjects-label {
		font-size: 0.9rem;
		font-weight: 600;
		color: #94a3b8;
		margin-bottom: 0.8rem;
		display: block;
	}

	.subjects-grid {
		display: flex;
		flex-wrap: wrap;
		gap: 0.6rem;
	}

	.subject-tag {
		background: rgba(15, 23, 42, 0.6);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 8px;
		padding: 0.5rem 0.8rem;
		font-size: 0.85rem;
		font-weight: 500;
		color: #e2e8f0;
		cursor: pointer;
		transition: all 0.3s ease;
		position: relative;
		overflow: hidden;
	}

	/* SUBTLE INTERACTIVE EFFECTS */
	.subject-tag:hover {
		transform: translateY(-1px) scale(1.03); /* Reduced movement */
		border-color: rgba(var(--accent-color-rgb, 16, 185, 129), 0.4); /* Subtle color */
		box-shadow:
			0 4px 12px rgba(0, 0, 0, 0.2),
			0 0 8px rgba(var(--accent-color-rgb, 16, 185, 129), 0.2); /* Gentler glow */
		background: rgba(255, 255, 255, 0.03); /* Subtle background change */
	}

	.subject-tag:active {
		transform: translateY(0) scale(1.01);
	}

	/* Responsive Design */
	@media (max-width: 1024px) {
		.section-title {
			font-size: 2.4rem;
		}

		.content-card {
			padding: 1.8rem;
		}
	}

	@media (max-width: 768px) {
		.academics-section {
			padding: 3rem 1rem;
		}

		.section-title {
			font-size: 2.2rem;
			margin-bottom: 3rem;
		}

		.academy-card {
			flex-direction: column;
			align-items: center;
			gap: 1.5rem;
		}

		.timeline-side {
			flex-direction: row;
			width: auto;
			margin-right: 0;
			margin-bottom: 0;
		}

		.timeline-line {
			width: 60px;
			height: 3px;
			margin-top: 0;
			margin-left: 1rem;
		}

		.content-card {
			width: 100%;
			padding: 1.5rem;
		}

		.academic-header {
			padding-right: 1rem;
		}

		.acad-degree {
			font-size: 1.2rem;
		}

		.academic-beacon {
			width: 40px !important;
			height: 40px !important;
		}

		.academic-beacon-container {
			top: -10px;
			right: -10px;
		}
	}

	@media (max-width: 480px) {
		.content-card {
			padding: 1.25rem;
		}

		.subjects-grid {
			gap: 0.4rem;
		}

		.subject-tag {
			padding: 0.4rem 0.6rem;
			font-size: 0.8rem;
		}
	}
</style>
