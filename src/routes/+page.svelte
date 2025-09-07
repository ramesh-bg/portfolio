<script lang="ts">
	import Experience from '$lib/components/Experience.svelte';
	import Intro from '$lib/components/Intro.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import { onMount, onDestroy } from 'svelte';
	import * as THREE from 'three';

	let container: HTMLDivElement;

	let renderer: THREE.WebGLRenderer | undefined;
	let scene: THREE.Scene;
	let camera: THREE.PerspectiveCamera;
	let animationId: number;

	// Mouse positions for parallax
	let mouseX = 0;
	let mouseY = 0;
	let targetRotationX = 0;
	let targetRotationY = 0;

	// Scene objects
	let stars: THREE.Points;
	let glitteringStars: THREE.Points[] = [];

	function createStarField() {
		const starGeometry = new THREE.BufferGeometry();
		const starCount = 3000;
		const positions = new Float32Array(starCount * 3);
		const colors = new Float32Array(starCount * 3);
		const sizes = new Float32Array(starCount);

		for (let i = 0; i < starCount; i++) {
			positions[i * 3] = (Math.random() - 0.5) * 4000;
			positions[i * 3 + 1] = (Math.random() - 0.5) * 4000;
			positions[i * 3 + 2] = (Math.random() - 0.5) * 2000;

			// Create varied star types with different colors and sizes
			const starType = Math.random();

			if (starType < 0.7) {
				// Regular white/warm stars (70%)
				const warmth = Math.random();
				colors[i * 3] = 0.9 + warmth * 0.1; // R
				colors[i * 3 + 1] = 0.8 + warmth * 0.2; // G
				colors[i * 3 + 2] = 0.7 + warmth * 0.1; // B
				sizes[i] = Math.random() * 3 + 0.5; // Small to medium
			} else if (starType < 0.85) {
				// Blue giant stars (15%)
				colors[i * 3] = 0.4 + Math.random() * 0.3; // R
				colors[i * 3 + 1] = 0.6 + Math.random() * 0.3; // G
				colors[i * 3 + 2] = 1.0; // B
				sizes[i] = Math.random() * 6 + 2; // Medium to large
			} else if (starType < 0.95) {
				// Red giant stars (10%)
				colors[i * 3] = 1.0; // R
				colors[i * 3 + 1] = 0.3 + Math.random() * 0.4; // G
				colors[i * 3 + 2] = 0.1 + Math.random() * 0.3; // B
				sizes[i] = Math.random() * 8 + 3; // Large
			} else {
				// Bright white supergiants (5%)
				colors[i * 3] = 1.0; // R
				colors[i * 3 + 1] = 1.0; // G
				colors[i * 3 + 2] = 1.0; // B
				sizes[i] = Math.random() * 12 + 4; // Very large
			}
		}

		starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
		starGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
		starGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

		const starMaterial = new THREE.PointsMaterial({
			size: 2,
			sizeAttenuation: true,
			transparent: true,
			opacity: 0.9,
			vertexColors: true,
			blending: THREE.AdditiveBlending
		});

		const stars = new THREE.Points(starGeometry, starMaterial);
		scene.add(stars);
		return stars;
	}

	function createGlitteringStars() {
		for (let i = 0; i < 80; i++) {
			const starGeometry = new THREE.BufferGeometry();
			const position = new Float32Array([
				(Math.random() - 0.5) * 3000,
				(Math.random() - 0.5) * 3000,
				(Math.random() - 0.5) * 1000
			]);
			starGeometry.setAttribute('position', new THREE.BufferAttribute(position, 3));

			// Create different types of shiny stars
			const starType = Math.random();
			let color, size;

			if (starType < 0.3) {
				// Bright white pulsing stars
				color = 0xffffff;
				size = Math.random() * 8 + 4;
			} else if (starType < 0.5) {
				// Blue-white hot stars
				color = 0x88ddff;
				size = Math.random() * 6 + 3;
			} else if (starType < 0.65) {
				// Golden yellow stars
				color = 0xffdd88;
				size = Math.random() * 7 + 3;
			} else if (starType < 0.8) {
				// Pink/magenta nebula-like stars
				color = 0xff88dd;
				size = Math.random() * 5 + 2;
			} else {
				// Cyan-blue bright stars
				color = 0x88ffff;
				size = Math.random() * 9 + 4;
			}

			const starMaterial = new THREE.PointsMaterial({
				color: color,
				size: size,
				transparent: true,
				opacity: Math.random() * 0.6 + 0.4,
				blending: THREE.AdditiveBlending
			});

			const star = new THREE.Points(starGeometry, starMaterial);
			glitteringStars.push(star);
			scene.add(star);
		}
	}

	function animateGlitteringStars() {
		glitteringStars.forEach((star, index) => {
			const time = Date.now() * 0.001 + index;
			const material = star.material as THREE.PointsMaterial;

			// Create more dramatic pulsing effects
			const pulseSpeed = 1.5 + Math.sin(index) * 0.5;
			const baseOpacity = 0.4 + Math.sin(index * 0.1) * 0.2;
			const baseSizeMultiplier = 0.8 + Math.cos(index * 0.15) * 0.3;

			material.opacity = baseOpacity + Math.sin(time * pulseSpeed) * 0.6;

			// Make some stars pulse size more dramatically
			const originalSize = 2 + Math.random() * 6;
			material.size =
				originalSize * baseSizeMultiplier * (1 + Math.sin(time * pulseSpeed * 0.8) * 0.4);

			// Add subtle color shifting for some stars
			if (index % 7 === 0) {
				const hueShift = Math.sin(time * 0.5) * 0.1;
				const currentColor = material.color;
				material.color.setHSL(
					(currentColor.getHSL({ h: 0, s: 0, l: 0 }).h + hueShift) % 1,
					0.8,
					0.7
				);
			}
		});
	}

	function onMouseMove(event: MouseEvent) {
		mouseX = (event.clientX - window.innerWidth / 2) / window.innerWidth;
		mouseY = (event.clientY - window.innerHeight / 2) / window.innerHeight;

		targetRotationX = mouseY * 0.1;
		targetRotationY = mouseX * 0.1;
	}

	// Space blast particle effect
	function triggerBlast(x: number, y: number) {
		const blastCount = 80;
		const geometry = new THREE.BufferGeometry();
		const positions = new Float32Array(blastCount * 3);
		const velocities: THREE.Vector3[] = [];

		for (let i = 0; i < blastCount; i++) {
			positions[i * 3] = 0;
			positions[i * 3 + 1] = 0;
			positions[i * 3 + 2] = 0;

			const angle = Math.random() * 2 * Math.PI;
			const speed = Math.random() * 100 + 50;
			velocities.push(
				new THREE.Vector3(
					Math.cos(angle) * speed,
					Math.sin(angle) * speed,
					(Math.random() - 0.5) * speed * 0.5
				)
			);
		}

		geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

		const material = new THREE.PointsMaterial({
			color: 0x00f5ff,
			size: 8,
			transparent: true,
			opacity: 1,
			blending: THREE.AdditiveBlending
		});

		const particles = new THREE.Points(geometry, material);

		// Convert screen coordinates to 3D world coordinates
		const ndcX = (x / window.innerWidth) * 2 - 1;
		const ndcY = -(y / window.innerHeight) * 2 + 1;

		const vector = new THREE.Vector3(ndcX, ndcY, 0.5).unproject(camera);
		particles.position.copy(camera.position);
		const dir = vector.sub(camera.position).normalize();
		const dist = -camera.position.z / dir.z;
		const pos = camera.position.clone().add(dir.multiplyScalar(dist));
		particles.position.copy(pos);

		scene.add(particles);

		let life = 1.0;

		function animateBlast() {
			if (life <= 0) {
				scene.remove(particles);
				geometry.dispose();
				material.dispose();
				return;
			}

			life -= 0.015;

			const posArr = geometry.attributes.position.array as Float32Array;

			for (let i = 0; i < blastCount; i++) {
				posArr[i * 3] += velocities[i].x * 0.016;
				posArr[i * 3 + 1] += velocities[i].y * 0.016;
				posArr[i * 3 + 2] += velocities[i].z * 0.016;

				velocities[i].multiplyScalar(0.98);
			}

			geometry.attributes.position.needsUpdate = true;
			material.opacity = life;

			requestAnimationFrame(animateBlast);
		}

		animateBlast();
	}

	// Function to check if clicked element is UI element
	function isUIElement(element: Element): boolean {
		// Check if clicked on interactive elements
		const uiSelectors = [
			'a',
			'button',
			'input',
			'select',
			'textarea',
			'.nav-item',
			'.contact-link',
			'.skill-planet'
		];

		return uiSelectors.some((selector) => {
			return element.matches(selector) || element.closest(selector);
		});
	}

	onMount(() => {
		const width = window.innerWidth;
		const height = window.innerHeight;

		scene = new THREE.Scene();

		// Create Azure Depths radial gradient background
		const canvas = document.createElement('canvas');
		canvas.width = 2048;
		canvas.height = 2048;
		const context = canvas.getContext('2d');

		if (context) {
			// Enable high-quality rendering
			context.imageSmoothingEnabled = true;
			context.imageSmoothingQuality = 'high';

			// Create radial gradient with deep space darkness
			const gradient = context.createRadialGradient(
				1024,
				2048, // Center at 50% width, 100% height (bottom center)
				0, // Inner radius
				1024,
				2048, // Same center
				1280 // Outer radius (125% of 1024)
			);
			gradient.addColorStop(0, '#000000');
			gradient.addColorStop(1, '#000102');

			context.fillStyle = gradient;
			context.fillRect(0, 0, 2048, 2048);
		}

		const texture = new THREE.CanvasTexture(canvas);
		texture.minFilter = THREE.LinearFilter;
		texture.magFilter = THREE.LinearFilter;
		texture.generateMipmaps = false;
		scene.background = texture;

		camera = new THREE.PerspectiveCamera(75, width / height, 1, 5000);
		camera.position.z = 1000;

		renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
		renderer.setSize(width, height);
		container.appendChild(renderer.domElement);

		// Add click event listener with proper UI element detection
		document.addEventListener(
			'click',
			(event) => {
				const target = event.target as Element;

				// Only trigger blast if not clicking on UI elements
				if (!isUIElement(target)) {
					triggerBlast(event.clientX, event.clientY);
				}
			},
			true
		); // Use capture phase

		// Create scene elements
		stars = createStarField();
		createGlitteringStars();

		function animate() {
			// Smooth camera rotation based on mouse position
			camera.rotation.x += (targetRotationX - camera.rotation.x) * 0.05;
			camera.rotation.y += (targetRotationY - camera.rotation.y) * 0.05;

			// Animate background stars
			stars.rotation.y += 0.0002;
			stars.rotation.x += 0.0001;

			// Animate glittering stars
			animateGlitteringStars();

			// Parallax effect on star field
			stars.position.x = mouseX * 50;
			stars.position.y = -mouseY * 50;

			renderer?.render(scene, camera);
			animationId = requestAnimationFrame(animate);
		}
		animate();

		window.addEventListener('mousemove', onMouseMove);
		window.addEventListener('resize', onWindowResize);

		function onWindowResize() {
			const width = window.innerWidth;
			const height = window.innerHeight;

			camera.aspect = width / height;
			camera.updateProjectionMatrix();
			renderer?.setSize(width, height);
		}

		return () => {
			window.removeEventListener('mousemove', onMouseMove);
			window.removeEventListener('resize', onWindowResize);
			animationId && cancelAnimationFrame(animationId);
			renderer?.dispose();
			if (renderer?.domElement) {
				container.removeChild(renderer.domElement);
			}
		};
	});

	onDestroy(() => {
		animationId && cancelAnimationFrame(animationId);
		renderer?.dispose();
	});
</script>

<!-- Background Scene -->
<div bind:this={container} class="scene-container"></div>

<!-- Navbar (separate layer with pointer events) -->
<div class="navbar-layer">
	<Navbar />
	<Intro />
	<Experience />
</div>

<slot />

<style>
	.scene-container {
		position: fixed;
		inset: 0;
		z-index: 0;
		width: 100vw;
		height: 100vh;
		pointer-events: none; /* Background doesn't interfere with interactions */
		overflow: hidden;
	}

	.navbar-layer {
		position: relative;
		z-index: 1000; /* Ensure navbar is above the scene */
		pointer-events: auto; /* Enable all interactions */
	}
</style>
