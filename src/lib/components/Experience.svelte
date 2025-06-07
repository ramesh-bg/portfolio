<script>
	import { onMount } from 'svelte';

	export let experiences = [
		{
			period: '2018 — 2019',
			roles: ['Lead Engineer', 'Senior Engineer', 'Engineer'],
			company: {
				name: 'Upstatement',
				url: 'https://upstatement.com'
			},
			description:
				'Build, style, and ship high-quality websites, design systems, mobile apps, and digital experiences for clients including Harvard Business School, Everytown for Gun Safety, Pratt Institute, and more. Lead engineering initiatives through collaboration and development of internal tools.',
			technologies: [
				'JavaScript',
				'TypeScript',
				'HTML & SCSS',
				'React',
				'Next.js',
				'React Native',
				'WordPress',
				'Contentful',
				'Node.js',
				'PHP'
			]
		},
		{
			period: '2016 — 2017',
			roles: ['Lead Engineer', 'Senior Engineer', 'Engineer'],
			company: {
				name: 'Upstatement',
				url: 'https://upstatement.com'
			},
			description:
				'Built and delivered scalable web and mobile experiences, focusing on performance and accessibility. Led dev teams and mentored junior developers.',
			technologies: [
				'JavaScript',
				'TypeScript',
				'HTML & SCSS',
				'React',
				'Next.js',
				'Node.js',
				'PHP'
			]
		}
	];

	onMount(async () => {
		const { gsap } = await import('gsap');
		const { ScrollTrigger } = await import('gsap/ScrollTrigger');
		gsap.registerPlugin(ScrollTrigger);

		gsap.utils.toArray('.exp-card').forEach((el) => {
			gsap.from(el, {
				opacity: 0,
				y: 50,
				duration: 0.8,
				ease: 'power2.out',
				scrollTrigger: {
					trigger: el,
					start: 'top 85%',
					toggleActions: 'play none none none'
				}
			});
		});
	});
</script>

<!-- Experience Section -->
<section class="px-4 py-6 sm:px-6 lg:px-8" id="experience">
	<div class="mx-auto grid max-w-full grid-cols-1 gap-8 lg:grid-cols-4">
		<!-- Left: Title -->
		<div class="lg:col-span-2">
			<h2
				class="text-2xl font-bold text-slate-100 underline decoration-teal-400 decoration-4 underline-offset-8"
			>
				EXPERIENCE
			</h2>
		</div>

		<!-- Right: Experience Items -->
		<div class="space-y-12 lg:col-span-3">
			{#each experiences as exp (exp.period)}
				<div
					class="exp-card rounded-xl bg-slate-800/30 p-6 shadow-lg transition-shadow duration-300 hover:shadow-teal-500/30"
				>
					<!-- Period -->
					<header class="mb-2 text-xs font-semibold tracking-wider text-teal-400 uppercase">
						{exp.period}
					</header>

					<!-- Title and Company -->
					<h3 class="mb-1 text-xl font-semibold text-slate-100">
						<a
							href={exp.company.url}
							target="_blank"
							rel="noreferrer noopener"
							class="transition-colors duration-200 hover:text-teal-300"
						>
							{exp.roles[0]} @ {exp.company.name}
						</a>
					</h3>

					<!-- Other Roles -->
					<div class="mb-3 space-y-1 text-sm text-slate-400">
						{#each exp.roles.slice(1) as role}
							<div>• {role}</div>
						{/each}
					</div>

					<!-- Description -->
					<p class="mb-4 text-sm leading-relaxed text-slate-300">{exp.description}</p>

					<!-- Tech Stack -->
					<ul class="flex flex-wrap gap-2">
						{#each exp.technologies as tech}
							<li>
								<span
									class="rounded-full border border-teal-500/20 bg-teal-600/10 px-3 py-1 text-xs font-medium text-teal-300"
								>
									{tech}
								</span>
							</li>
						{/each}
					</ul>
				</div>
			{/each}
		</div>
	</div>
</section>
