<script>
	import Experience from '$lib/components/Experience.svelte';
	import Intro from '$lib/components/Intro.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
</script>

<div class="layout-bg flex min-h-screen flex-col">
	<div class="sticky top-0 z-10 bg-black">
		<Navbar />
	</div>
	<main class="z-1 flex max-w-full flex-grow flex-col space-y-16 p-6 sm:p-10">
		<Intro />
		<Experience />
	</main>
</div>
