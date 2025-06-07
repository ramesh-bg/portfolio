<script>
	// @ts-nocheck

	import { onMount } from 'svelte';
	import { gsap } from 'gsap';
	import { sectionColor } from '../../stores/common';
	let isOpen = false;

	const NAVBAR_HEIGHT = 90; // adjust to your navbar's actual height in px

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

	function handleScrollWithOffset(event) {
		const href = event.currentTarget.getAttribute('href');

		if (href && href.startsWith('#')) {
			event.preventDefault();

			const id = href.slice(1);
			const target = document.getElementById(id);
			if (target) {
				const topPos = target.getBoundingClientRect().top + window.pageYOffset - NAVBAR_HEIGHT;

				window.scrollTo({
					top: topPos,
					behavior: 'smooth'
				});

				// Close mobile menu if open
				isOpen = false;
			}
		}
	}
</script>

<nav
	class="sticky top-0 z-50 w-full border-b border-slate-800 bg-gradient-to-r from-slate-900/70 via-black/70 to-slate-900/70 shadow-md backdrop-blur-sm"
>
	<div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
		<!-- Brand -->
		<a
			href="#about"
			class="ramesh-text block text-xl font-bold tracking-wide sm:text-2xl md:text-3xl {$sectionColor ||
				'text-teal-400'}"
			on:click={handleScrollWithOffset}
		>
			<span>{`{ `}</span>Ramesh BG<span>{` }`}</span>
		</a>

		<!-- Desktop Nav -->
		<ul class="hidden space-x-8 font-medium text-slate-200 sm:flex">
			{#each ['about', 'experience', 'projects', 'certifications', 'academics'] as item}
				<li>
					<a
						href={`#${item.toLowerCase()}`}
						class="underline-link relative inline-block capitalize transition duration-300 hover:text-teal-400"
						on:click={handleScrollWithOffset}
					>
						{item}
						<div class="underline"></div>
					</a>
				</li>
			{/each}
		</ul>

		<!-- Hamburger -->
		<button
			class="text-slate-300 focus:outline-none sm:hidden"
			on:click={() => (isOpen = !isOpen)}
			aria-label="Toggle menu"
		>
			<svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
				/>
			</svg>
		</button>
	</div>

	<!-- Mobile Nav -->
	{#if isOpen}
		<ul class="flex flex-col items-start space-y-3 px-6 pb-4 font-medium text-slate-200 sm:hidden">
			{#each ['about', 'experience', 'projects', 'certifications', 'academics'] as item}
				<li>
					<a
						href={`#${item.toLowerCase()}`}
						class="capitalize transition duration-300 hover:text-teal-400"
						on:click={handleScrollWithOffset}
					>
						{item}
					</a>
				</li>
			{/each}
		</ul>
	{/if}
</nav>

<style>
	.underline {
		position: absolute;
		bottom: -2px;
		left: 0;
		height: 2px;
		width: 0;
		background-color: currentColor;
		transition: width 0.3s ease;
	}

	a.underline-link:hover .underline,
	a.underline-link:focus .underline {
		width: 100%;
	}
</style>
