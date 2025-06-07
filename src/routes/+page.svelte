<script>
	import Academics from '$lib/components/Academics.svelte';
	import Certifications from '$lib/components/Certifications.svelte';
	import Experience from '$lib/components/Experience.svelte';
	import Intro from '$lib/components/Intro.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import Projects from '$lib/components/Projects.svelte';
	import { onMount } from 'svelte';
	import { currentSection } from '../stores/common';

	// Shared section state

	onMount(() => {
		const sections = document.querySelectorAll('section');
		const options = {
			root: null,
			rootMargin: '0px',
			threshold: 0.4
		};

		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					console.log('here', entry.target.getAttribute('id'));
					// @ts-ignore
					currentSection.set(entry.target.getAttribute('id'));
				}
			});
		}, options);

		sections.forEach((sec) => observer.observe(sec));
	});
</script>

<div class="layout-bg flex min-h-screen flex-col">
	<div class="sticky top-0 z-10 bg-black">
		<Navbar />
	</div>
	<main class="z-1 flex max-w-full flex-grow flex-col space-y-16 p-6 sm:p-10">
		<Intro />
		<Experience />
		<Projects />
		<Certifications />
		<Academics />
	</main>
</div>
