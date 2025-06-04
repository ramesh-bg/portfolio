<script>
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';

	onMount(() => {
		// Animate Ramesh BG on enter
		gsap.from('.ramesh-text', {
			duration: 0.6,
			opacity: 0,
			y: 20,
			ease: 'power3.out'
		});

		// Select all links with underline-link class
		const links = document.querySelectorAll('.underline-link');

		links.forEach((link) => {
			const underline = link.querySelector('.underline');

			link.addEventListener('mouseenter', () => {
				gsap.to(underline, {
					width: '100%',
					duration: 0.3,
					ease: 'power1.out'
				});
			});

			link.addEventListener('mouseleave', () => {
				gsap.to(underline, {
					width: '0%',
					duration: 0.3,
					ease: 'power1.out'
				});
			});
		});
	});
</script>

<nav
	class="m-5 grid min-h-[72px] grid-cols-2 items-center-safe justify-between border-b border-amber-50"
>
	<a class="ramesh-text text-3xl font-semibold" href="javascript.void(0)">
		{'{ '}Ramesh BG{' }'}
	</a>
	<div class="flex justify-end space-x-8">
		<a href="javascript.void(0)" class="underline-link">
			About
			<div class="underline"></div>
		</a>

		<a href="javascript.void(0)" class="underline-link">
			Experience
			<div class="underline"></div>
		</a>

		<a href="javascript.void(0)" class="underline-link">
			Projects
			<div class="underline"></div>
		</a>
	</div>
</nav>

<style>
	a {
		position: relative;
		text-decoration: none;
		color: inherit;
	}

	.underline {
		position: absolute;
		bottom: 0;
		left: 0;
		height: 2px;
		width: 0%;
		background-color: currentColor;
	}
</style>
