<script>
	// @ts-nocheck
	import { onMount } from 'svelte';
	import lottie from 'lottie-web';

	let container;
	let lottieContainer;
	let jobTitle;
	const text = "👋 Hi, I'm Ramesh";
	let animation;

	onMount(async () => {
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
			path: '/portfolio/lottie/developer.json'
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

		gsap.from('.contact-item', {
			opacity: 0,
			y: 20,
			duration: 1,
			stagger: 0.2,
			ease: 'power2.out',
			delay: 1.5
		});

		return () => animation?.destroy();
	});
	onMount(() => {
		if (window.lucide) {
			window.lucide.createIcons();
		}
	});
</script>

<!-- Load Lucide icons via CDN -->
<svelte:head>
	<script src="https://unpkg.com/lucide@latest"></script>
</svelte:head>

<section
	id="intro"
	class="bg-gradient-to-b from-slate-900 via-slate-950 to-black px-4 py-20 text-slate-100 sm:px-10"
>
	<div
		class="mx-auto flex max-w-7xl flex-col items-center justify-center gap-12 sm:flex-row sm:items-start"
	>
		<!-- Left Text -->
		<div class="max-w-lg space-y-8 text-center sm:text-left">
			<h1
				class="text-4xl font-bold tracking-tight text-white sm:text-5xl"
				bind:this={container}
				id="nameContent"
			>
				{#each [...text] as letter}
					<span>{letter}</span>
				{/each}
			</h1>

			<p bind:this={jobTitle} class="min-h-[2rem] text-2xl font-semibold text-teal-400"></p>

			<!-- Contact Info -->
			<div class="space-y-4 text-sm text-slate-300">
				<div class="contact-item flex items-center gap-3">
					<i data-lucide="mail" class="h-5 w-5 text-teal-400"></i>
					<a href="mailto:ramesh@example.com" class="transition hover:text-teal-300"
						>ramesh@example.com</a
					>
				</div>

				<div class="contact-item flex items-center gap-3">
					<i data-lucide="linkedin" class="h-5 w-5 text-teal-400"></i>
					<a
						href="https://linkedin.com/in/yourprofile"
						target="_blank"
						class="transition hover:text-teal-300">LinkedIn</a
					>
				</div>

				<!-- Resume Button -->
				<div class="contact-item pt-3">
					<a
						href="/portfolio/resume.pdf"
						target="_blank"
						class="inline-block rounded-full bg-gradient-to-r from-teal-500 via-teal-400 to-teal-300 px-6 py-2 text-sm font-bold text-slate-900 shadow-xl transition duration-300 hover:scale-105 hover:shadow-teal-400/40"
					>
						View Resume
					</a>
				</div>
			</div>
		</div>

		<!-- Lottie Animation -->
		<div
			bind:this={lottieContainer}
			class="w-full max-w-sm sm:ml-20"
			style="aspect-ratio: 1 / 1;"
		></div>
	</div>
</section>

<style>
	span {
		display: inline-block;
		white-space: pre;
	}
</style>
