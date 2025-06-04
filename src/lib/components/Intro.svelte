<script>
	// @ts-nocheck
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import lottie from 'lottie-web';
	// import { TextPlugin } from 'gsap/TextPlugin';

	// gsap.registerPlugin(TextPlugin);

	/** @type {HTMLHeadingElement} */
	let container;

	/** @type {HTMLDivElement} */
	let lottieContainer;

	/** @type {HTMLParagraphElement} */
	let jobTitle;

	const text = "👋 Hi, I'm Ramesh";

	// @ts-ignore
	let animation;

	onMount(async () => {
		if (!container) return;
		// gsap.registerPlugin(TextPlugin);

		const { gsap } = await import('gsap');
		const { TextPlugin } = await import('gsap/TextPlugin');
		gsap.registerPlugin(TextPlugin);

		// GSAP animation for letters in h2
		const letters = container.querySelectorAll('#nameContent span');
		gsap.fromTo(
			letters,
			{ opacity: 0, y: 20 },
			{
				opacity: 1,
				y: 0,
				duration: 0.3,
				stagger: {
					each: 0.07,
					from: 'start'
				},
				ease: 'power2.out'
			}
		);

		// Load Lottie animation
		animation = lottie.loadAnimation({
			container: lottieContainer,
			renderer: 'svg',
			loop: true,
			autoplay: true,
			path: '/lottie/developer.json' // <-- replace with your actual path or URL to JSON
		});

		// GSAP typing/backspacing animation for jobTitle <p>
		const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });

		tl.to(jobTitle, {
			duration: 2,
			text: 'Frontend Developer',
			ease: 'none',
			delay: 0.5
		})
			.to(jobTitle, {
				duration: 1.5,
				text: '',
				ease: 'none',
				delay: 1
			})
			.to(jobTitle, {
				duration: 2,
				text: 'Software Developer',
				ease: 'none'
			})
			.to(jobTitle, {
				duration: 1.5,
				text: '',
				ease: 'none',
				delay: 1
			});

		return () => {
			animation?.destroy();
		};
	});
</script>

<div class="flex w-full items-center justify-center space-x-[20%] p-10">
	<!-- Text with GSAP letter animation -->
	<div>
		<h2 class="h-10 text-5xl" bind:this={container} id="nameContent">
			{#each [...text] as letter}
				<span>{letter}</span>
			{/each}
			&nbsp;
		</h2>
		<p bind:this={jobTitle} class="mt-4.5 ml-20.5 text-2xl"></p>
	</div>

	<!-- Lottie Animation container -->
	<div bind:this={lottieContainer} style="width: 500px; height: 500px;"></div>
</div>

<style>
	span {
		display: inline-block;
		white-space: pre; /* preserve spaces */
	}
</style>
