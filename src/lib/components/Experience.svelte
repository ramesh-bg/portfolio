<script>
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
			period: '2014 — 2015',
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
		}

		// Add more experience objects here as needed
	];
</script>

<div class="grid grid-cols-4">
	<div class="self-center">
		<button class="text-4xl font-semibold underline">EXPERIENCE</button>
	</div>

	<div class="col-span-3">
		<!-- Wrapping div to prevent overflow -->
		<div class="grid gap-y-6 overflow-x-hidden px-4">
			{#each experiences as exp (exp.period)}
				<div
					class="group relative grid max-w-full p-6 pb-1 transition-all sm:grid-cols-8 sm:gap-8 md:gap-4 lg:group-hover/list:opacity-50 lg:hover:!opacity-100"
				>
					<!-- Overlay div with no negative inset -->
					<div
						class="absolute inset-0 z-0 hidden rounded-md transition motion-reduce:transition-none lg:block lg:group-hover:bg-slate-800/50 lg:group-hover:shadow-[inset_0_1px_0_0_rgba(148,163,184,0.1)] lg:group-hover:drop-shadow-lg"
						aria-hidden="true"
					></div>

					<header
						class="z-10 mt-1 mb-2 text-xs font-semibold tracking-wide text-slate-500 uppercase sm:col-span-2"
						aria-label={exp.period}
					>
						{exp.period}
					</header>

					<div class="z-10 sm:col-span-6">
						<h3 class="leading-snug font-medium text-slate-200">
							<a
								class="group/link inline-flex items-baseline text-base leading-tight font-medium text-slate-200 hover:text-teal-300 focus-visible:text-teal-300"
								href={exp.company.url}
								target="_blank"
								rel="noreferrer noopener"
								aria-label={`Lead Engineer at ${exp.company.name} (opens in a new tab)`}
							>
								{exp.roles[0]} &middot; {exp.company.name}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="currentColor"
									class="ml-1 inline-block h-4 w-4 shrink-0 translate-y-px transition-transform group-hover/link:translate-x-1 group-hover/link:-translate-y-1 group-focus-visible/link:translate-x-1 group-focus-visible/link:-translate-y-1 motion-reduce:transition-none"
									aria-hidden="true"
								>
									<path
										fill-rule="evenodd"
										d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z"
										clip-rule="evenodd"
									></path>
								</svg>
							</a>
						</h3>

						<div class="mt-1 space-y-1 text-sm text-slate-500">
							{#each exp.roles.slice(1) as role}
								<div>{role}</div>
							{/each}
						</div>

						<p class="mt-2 text-sm leading-normal text-slate-300">{exp.description}</p>

						<ul class="my-4 flex flex-wrap gap-2" aria-label="Technologies used">
							{#each exp.technologies as tech}
								<li>
									<span
										class="rounded-full bg-teal-400/10 px-3 py-1 text-xs font-medium text-teal-300"
										>{tech}</span
									>
								</li>
							{/each}
						</ul>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
