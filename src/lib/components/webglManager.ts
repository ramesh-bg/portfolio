/* eslint-disable @typescript-eslint/no-unused-vars */
import * as THREE from 'three';

interface BeaconEntry {
	id: string;
	canvas: HTMLCanvasElement;
	renderer: THREE.WebGLRenderer;
	scene: THREE.Scene;
	camera: THREE.PerspectiveCamera;
	animationId: number;
	objects: {
		beacon?: THREE.Mesh;
		core?: THREE.Mesh;
		rings?: THREE.Mesh[];
		particles?: THREE.Points;
	};
}

interface SharedBackgroundData {
	scene: THREE.Scene;
	camera: THREE.PerspectiveCamera;
	nebulaSphere?: THREE.Mesh;
	starField?: THREE.Points;
	animateCallback?: () => void;
}

class WebGLManager {
	private static instance: WebGLManager;

	// SINGLE shared background renderer
	private bgRenderer?: THREE.WebGLRenderer;
	private bgAnimationId: number = 0;
	private bgContainer?: HTMLDivElement;
	private sharedBgData?: SharedBackgroundData;
	private bgInitialized = false;

	// Beacon renderers with context pooling
	private beaconEntries: Map<string, BeaconEntry> = new Map();
	private maxBeacons = 10; // Reduced to safer limit

	// Component tracking for better allocation
	private componentBeacons: Map<string, string[]> = new Map(); // componentName -> beaconIds[]

	private constructor() {
		console.log('🎮 WebGL Manager initialized with max', this.maxBeacons, 'beacons');
	}

	static getInstance(): WebGLManager {
		if (!WebGLManager.instance) {
			WebGLManager.instance = new WebGLManager();
		}
		return WebGLManager.instance;
	}

	// Background methods - ONLY ONE background for entire app
	initBackground(
		container: HTMLDivElement,
		scene: THREE.Scene,
		camera: THREE.PerspectiveCamera,
		animateCallback: () => void
	): THREE.WebGLRenderer {
		// If background is already initialized, just update the callback and return existing renderer
		if (this.bgInitialized && this.bgRenderer) {
			console.log('🔄 Background already exists, reusing...');
			this.sharedBgData = { scene, camera, animateCallback };
			return this.bgRenderer;
		}

		console.log('🌟 Creating NEW shared background');

		// Dispose existing background if any
		if (this.bgRenderer) {
			this.disposeBackground();
		}

		const width = window.innerWidth;
		const height = window.innerHeight;

		this.bgRenderer = new THREE.WebGLRenderer({
			antialias: true,
			alpha: true,
			powerPreference: 'high-performance',
			preserveDrawingBuffer: false,
			failIfMajorPerformanceCaveat: false
		});

		this.bgRenderer.setSize(width, height);
		this.bgRenderer.setClearColor(0x000000, 1);

		// Store container and scene data
		this.bgContainer = container;
		this.sharedBgData = { scene, camera, animateCallback };

		container.appendChild(this.bgRenderer.domElement);
		this.bgInitialized = true;

		// Add context event listeners
		this.bgRenderer.domElement.addEventListener(
			'webglcontextlost',
			(event) => {
				event.preventDefault();
				cancelAnimationFrame(this.bgAnimationId);
				console.log('🚨 Background WebGL context lost');
				this.bgInitialized = false;
			},
			false
		);

		this.bgRenderer.domElement.addEventListener(
			'webglcontextrestored',
			() => {
				console.log('✅ Background WebGL context restored');
				if (this.sharedBgData) {
					this.startBackgroundAnimation(
						this.sharedBgData.scene,
						this.sharedBgData.camera,
						this.sharedBgData.animateCallback!
					);
				}
				this.bgInitialized = true;
			},
			false
		);

		this.startBackgroundAnimation(scene, camera, animateCallback);
		return this.bgRenderer;
	}

	// Check if background is available for sharing
	isBackgroundAvailable(): boolean {
		return this.bgInitialized && !!this.bgRenderer;
	}

	private startBackgroundAnimation(
		scene: THREE.Scene,
		camera: THREE.PerspectiveCamera,
		animateCallback: () => void
	) {
		const animate = () => {
			if (this.sharedBgData) {
				this.sharedBgData.animateCallback?.();
			}
			if (this.bgRenderer && this.bgInitialized) {
				this.bgRenderer.render(scene, camera);
			}
			this.bgAnimationId = requestAnimationFrame(animate);
		};
		animate();
	}

	resizeBackground(camera: THREE.PerspectiveCamera) {
		if (this.bgRenderer && camera && this.bgInitialized) {
			const width = window.innerWidth;
			const height = window.innerHeight;

			camera.aspect = width / height;
			camera.updateProjectionMatrix();
			this.bgRenderer.setSize(width, height);
		}
	}

	// IMPROVED: Register component and allocate beacon slots
	registerComponent(componentName: string, requestedBeacons: number): number {
		const currentBeacons = this.beaconEntries.size;
		const availableSlots = this.maxBeacons - currentBeacons;
		const allocatedSlots = Math.min(requestedBeacons, availableSlots);

		this.componentBeacons.set(componentName, []);

		console.log(
			`📋 ${componentName} registered: requested ${requestedBeacons}, allocated ${allocatedSlots} (${availableSlots} available)`
		);

		return allocatedSlots;
	}

	// Beacon methods with component tracking
	createBeacon(
		id: string,
		canvas: HTMLCanvasElement,
		size: number,
		color: string,
		animateCallback: (entry: BeaconEntry) => void,
		componentName: string = 'unknown'
	): BeaconEntry | null {
		if (!canvas) return null;

		// Check beacon limit
		if (this.beaconEntries.size >= this.maxBeacons) {
			console.warn(
				`🚨 Maximum beacon limit (${this.maxBeacons}) reached. Cannot create beacon: ${id}`
			);
			return null;
		}

		// Dispose existing beacon with same ID
		if (this.beaconEntries.has(id)) {
			console.log(`🔄 Reusing beacon: ${id}`);
			this.disposeBeacon(id);
		}

		console.log(
			`✨ Creating beacon: ${id} (${this.beaconEntries.size + 1}/${this.maxBeacons}) for ${componentName}`
		);

		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
		camera.position.z = 3;

		const renderer = new THREE.WebGLRenderer({
			canvas,
			alpha: true,
			antialias: false,
			powerPreference: 'low-power',
			preserveDrawingBuffer: false,
			failIfMajorPerformanceCaveat: false
		});

		renderer.setSize(size, size);
		renderer.setClearColor(0x000000, 0);

		// Add context event listeners
		renderer.domElement.addEventListener(
			'webglcontextlost',
			(event) => {
				event.preventDefault();
				console.log(`🚨 Beacon ${id} context lost`);
			},
			false
		);

		renderer.domElement.addEventListener(
			'webglcontextrestored',
			() => {
				console.log(`✅ Beacon ${id} context restored`);
			},
			false
		);

		const entry: BeaconEntry = {
			id,
			canvas,
			renderer,
			scene,
			camera,
			animationId: 0,
			objects: {}
		};

		// Start animation with frame limiting
		let lastFrameTime = 0;
		const targetFPS = 30;
		const frameInterval = 1000 / targetFPS;

		const animate = (currentTime: number = 0) => {
			if (currentTime - lastFrameTime < frameInterval) {
				entry.animationId = requestAnimationFrame(animate);
				return;
			}
			lastFrameTime = currentTime;

			try {
				animateCallback(entry);
				renderer.render(scene, camera);
			} catch (error) {
				console.error(`Error animating beacon ${id}:`, error);
			}

			entry.animationId = requestAnimationFrame(animate);
		};

		entry.animationId = requestAnimationFrame(animate);
		this.beaconEntries.set(id, entry);

		// Track beacon by component
		const componentBeacons = this.componentBeacons.get(componentName) || [];
		componentBeacons.push(id);
		this.componentBeacons.set(componentName, componentBeacons);

		return entry;
	}

	getBeacon(id: string): BeaconEntry | undefined {
		return this.beaconEntries.get(id);
	}

	// Safe beacon disposal
	disposeBeacon(id: string) {
		const entry = this.beaconEntries.get(id);
		if (entry) {
			console.log(`🗑️ Disposing beacon: ${id}`);

			cancelAnimationFrame(entry.animationId);

			// Dispose all scene objects
			this.disposeSceneObjects(entry.scene);

			// Safe renderer disposal
			try {
				entry.renderer.dispose();
				entry.renderer.forceContextLoss();
			} catch (error) {
				console.warn(`Warning disposing renderer for ${id}:`, error);
			}

			this.beaconEntries.delete(id);

			// Remove from component tracking
			for (const [componentName, beacons] of this.componentBeacons.entries()) {
				const index = beacons.indexOf(id);
				if (index > -1) {
					beacons.splice(index, 1);
					this.componentBeacons.set(componentName, beacons);
					break;
				}
			}

			console.log(
				`✅ Beacon ${id} disposed. Remaining: ${this.beaconEntries.size}/${this.maxBeacons}`
			);
		}
	}

	// Dispose beacons by component
	disposeComponentBeacons(componentName: string) {
		const beacons = this.componentBeacons.get(componentName) || [];
		console.log(`🧹 Disposing ${beacons.length} beacons for component: ${componentName}`);

		beacons.forEach((beaconId) => this.disposeBeacon(beaconId));
		this.componentBeacons.delete(componentName);
	}

	// Helper to dispose scene objects properly
	private disposeSceneObjects(scene: THREE.Scene) {
		scene.traverse((child) => {
			if (child instanceof THREE.Mesh) {
				if (child.geometry) {
					child.geometry.dispose();
				}
				if (child.material) {
					if (Array.isArray(child.material)) {
						child.material.forEach((m) => m.dispose());
					} else {
						child.material.dispose();
					}
				}
			}
			if (child instanceof THREE.Points) {
				if (child.geometry) child.geometry.dispose();
				if (child.material) child.material.dispose();
			}
		});
	}

	disposeBackground() {
		if (this.bgAnimationId) {
			cancelAnimationFrame(this.bgAnimationId);
			this.bgAnimationId = 0;
		}

		if (this.bgRenderer) {
			console.log('🗑️ Disposing background renderer');

			// Dispose background scene objects if available
			if (this.sharedBgData?.scene) {
				this.disposeSceneObjects(this.sharedBgData.scene);
			}

			try {
				this.bgRenderer.dispose();
				this.bgRenderer.forceContextLoss();
			} catch (error) {
				console.warn('Warning disposing background renderer:', error);
			}

			this.bgRenderer = undefined;
			this.sharedBgData = undefined;
			this.bgInitialized = false;
			console.log('✅ Background disposed');
		}
	}

	// Dispose all contexts
	disposeAll() {
		console.log('🧹 Disposing all WebGL contexts...');

		// Dispose all beacons
		const beaconIds = Array.from(this.beaconEntries.keys());
		beaconIds.forEach((id) => this.disposeBeacon(id));

		// Dispose background
		this.disposeBackground();

		// Clear component tracking
		this.componentBeacons.clear();

		console.log('✅ All WebGL contexts disposed');
	}

	// Utility methods
	getStats() {
		const componentStats: Record<string, number> = {};
		for (const [componentName, beacons] of this.componentBeacons.entries()) {
			componentStats[componentName] = beacons.length;
		}

		return {
			backgroundRenderer: this.bgInitialized,
			beaconCount: this.beaconEntries.size,
			maxBeacons: this.maxBeacons,
			beaconIds: Array.from(this.beaconEntries.keys()),
			componentBreakdown: componentStats,
			isContextLost: this.isWebGLContextLost()
		};
	}

	hasBackgroundRenderer(): boolean {
		return this.bgInitialized && !!this.bgRenderer;
	}

	getBeaconCount(): number {
		return this.beaconEntries.size;
	}

	getAvailableSlots(): number {
		return this.maxBeacons - this.beaconEntries.size;
	}

	// Dispose beacons by pattern
	disposeBeaconsByPattern(pattern: string) {
		const idsToDispose: string[] = [];

		for (const id of this.beaconEntries.keys()) {
			if (id.includes(pattern)) {
				idsToDispose.push(id);
			}
		}

		console.log(`🎯 Disposing beacons matching pattern "${pattern}":`, idsToDispose);
		idsToDispose.forEach((id) => this.disposeBeacon(id));
	}

	// Check WebGL context state
	isWebGLContextLost(): boolean {
		if (this.bgRenderer) {
			try {
				const context = this.bgRenderer.getContext();
				return context ? context.isContextLost() : true;
			} catch {
				return true;
			}
		}
		return false;
	}

	// Set maximum beacon limit
	setMaxBeacons(max: number) {
		this.maxBeacons = Math.max(1, Math.min(max, 16));
		console.log(`⚙️ Max beacons set to: ${this.maxBeacons}`);
	}
}

export default WebGLManager.getInstance();
