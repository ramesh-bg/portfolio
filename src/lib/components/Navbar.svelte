<script>
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';

	onMount(() => {
		gsap.from('.ramesh-text', {
			duration: 0.6,
			opacity: 0,
			y: 20,
			ease: 'power3.out'
		});

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

<nav class="border-b-[0.1px] border-amber-50 p-4">
	<div
		class="mx-auto flex min-h-[72px] max-w-full items-center justify-between px-4 sm:px-6 lg:px-8"
	>
		<button
			class="ramesh-text min-w-[150px] truncate
				text-left text-base leading-tight font-semibold sm:text-lg
				md:text-xl lg:text-2xl xl:text-3xl"
			aria-label="Ramesh BG"
		>
			{'{ '}Ramesh BG{' }'}
		</button>

		<ul class="hidden space-x-6 sm:flex md:space-x-8 lg:space-x-10">
			<li>
				<a
					class="underline-link relative inline-block py-3
						text-sm leading-snug font-medium sm:text-base
						md:text-lg lg:text-xl"
					href="/portfolio"
					tabindex="0"
				>
					About
					<div class="underline"></div>
				</a>
			</li>
			<li>
				<a
					class="underline-link relative inline-block py-3
						text-sm leading-snug font-medium sm:text-base
						md:text-lg lg:text-xl"
					href="/portfolio"
					tabindex="0"
				>
					Experience
					<div class="underline"></div>
				</a>
			</li>
			<li>
				<a
					class="underline-link relative inline-block py-3
						text-sm leading-snug font-medium sm:text-base
						md:text-lg lg:text-xl"
					href="/portfolio"
					tabindex="0"
				>
					Projects
					<div class="underline"></div>
				</a>
			</li>
		</ul>
	</div>
</nav>

<style>
	a {
		color: inherit;
		text-decoration: none;
		position: relative;
	}

	.underline {
		position: absolute;
		bottom: 0;
		left: 0;
		height: 2px;
		width: 0;
		background-color: currentColor;
		transition: width 0.3s ease;
	}

	.underline-link:hover .underline,
	.underline-link:focus .underline {
		width: 100%;
	}
</style>
