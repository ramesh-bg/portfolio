<script>
	// @ts-nocheck

	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import lottie from 'lottie-web';

	let container;
	let lottieContainer;
	let jobTitle;

	const text = "👋 Hi, I'm Ramesh";

	let animation;

	onMount(async () => {
		if (!container) return;

		const { gsap } = await import('gsap');
		const { TextPlugin } = await import('gsap/TextPlugin');
		gsap.registerPlugin(TextPlugin);

		const letters = container.querySelectorAll('#nameContent span');
		gsap.fromTo(
			letters,
			{ opacity: 0, y: 20 },
			{
				opacity: 1,
				y: 0,
				duration: 0.3,
				stagger: { each: 0.07, from: 'start' },
				ease: 'power2.out'
			}
		);

		animation = lottie.loadAnimation({
			container: lottieContainer,
			renderer: 'svg',
			loop: true,
			autoplay: true,
			path: '/portfolio/lottie/developer.json' // Replace with your actual JSON path
		});

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

		return () => animation?.destroy();
	});
</script>

<div
	class="mx-auto flex max-w-full flex-col items-center justify-center
	       space-y-12 sm:flex-row sm:items-start sm:space-y-0 sm:space-x-8
	       sm:p-10"
>
	<!-- Text container -->
	<div class="max-w-md text-center sm:text-left">
		<h2
			class="text-2xl leading-tight font-semibold sm:text-4xl"
			bind:this={container}
			id="nameContent"
		>
			{#each [...text] as letter}
				<span>{letter}</span>
			{/each}
		</h2>
		<p
			bind:this={jobTitle}
			class="mt-3 min-h-[1.5em] text-lg font-medium text-gray-700 sm:mt-5 sm:text-3xl"
		></p>
	</div>

	<!-- Lottie Animation container with left margin on desktop -->
	<div
		bind:this={lottieContainer}
		class="w-full max-w-sm sm:ml-40 sm:max-w-md"
		style="aspect-ratio: 1 / 1;"
	></div>
</div>

<style>
	span {
		display: inline-block;
		white-space: pre;
	}
</style>
