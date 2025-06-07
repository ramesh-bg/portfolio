<script>
	import { onMount } from 'svelte';

	export let experiences = [
		{
			period: 'Jan 2021 — Present',
			roles: ['Lead Software Engineer'],
			company: {
				name: 'Open Financial Technologies',
				url: 'https://open.money'
			},
			description:
				'Led a team to develop fintech products including invoicing, billing, GST filing, integrations, payment links, and payouts. Rewrote the product using NX Monorepo architecture, building shareable libraries and migrating to latest versions. Developed lending products and static websites focused on localization and SEO. Mentored juniors and maintained repo hygiene with linting and hooks.',
			technologies: [
				'Angular 19',
				'TypeScript',
				'TailwindCSS',
				'Svelte',
				'NX Monorepo',
				'Angular Material',
				'RxJS',
				'd3.js',
				'SCSS'
			]
		},
		{
			period: 'Oct 2017 — Jan 2021',
			roles: ['Software Engineer'],
			company: {
				name: 'Neutrinos',
				url: 'https://www.neutrinos.com'
			},
			description:
				'Developed products like OV2-Webforms for production plant data, Document Management System with RBAC, iOS iPad app for policy management, insurance sales application, and quality trace & track systems. Worked on Angular, Node-RED, MongoDB, and Agile processes.',
			technologies: [
				'Angular',
				'Angular Material',
				'RxJS',
				'Node-RED',
				'MongoDB',
				'Jasmine',
				'Karma',
				'NodeJS',
				'TDD'
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
