<script>
	export let projects = [
		{
			name: 'OpenMoney',
			url: 'https://app.open.money',
			domains: ['FinTech', 'Invoicing', 'Billing', 'GST Filing', 'Payments'],
			description:
				'A comprehensive fintech product featuring invoicing, billing, GST filing, payment links, payouts, and integrations.',
			technologies: [
				'Angular 19',
				'TypeScript',
				'TailwindCSS',
				'Svelte',
				'NX Monorepo',
				'Angular Material',
				'RxJS',
				'd3.js'
			]
		},
		{
			name: 'OpenCapital',
			url: 'https://app.opencapital.co.in',
			domains: ['Lending', 'Loans', 'FinTech'],
			description:
				'Lending product offering business and personal loans with seamless UI and loan management.',
			technologies: [
				'Angular',
				'TypeScript',
				'TailwindCSS',
				'Svelte',
				'NX Monorepo',
				'Angular Material'
			]
		},
		{
			name: 'Static Websites for OpenCapital & OpenMoney',
			url: 'https://open.money',
			domains: ['Web', 'SEO', 'Localization'],
			description:
				'Static websites built with Next.js focused on localization and SEO to enhance product visibility.',
			technologies: ['Sveltekit', 'SEO']
		},
		{
			name: 'Bankonnect & Yes Bank White-label Products',
			url: 'https://app.bankonnect.co',
			domains: ['Banking', 'White-label Solutions'],
			description:
				'White-label fintech products for ICICI Bank and Yes Bank incorporating core OpenMoney fintech modules.',
			technologies: ['Angular 13', 'RxJS', 'TailwindCSS', 'SCSS', 'Nx']
		},
		{
			name: 'Document Managentme System (DMS)',
			url: 'https://www.ingredion.com',
			domains: ['Document Management', 'RBAC', 'Enterprise'],
			description:
				'RBAC-based document management system featuring storage, retrieval, access control, approval workflows, versioning, and advanced search.',
			technologies: ['Angular', 'Angular Material', 'RxJS', 'Node-RED', 'MongoDB']
		},
		{
			name: 'Aviva Affinity SRM',
			url: 'https://www.avivaindia.com',
			domains: ['Insurance', 'Lead Management', 'iOS App'],
			description:
				'iOS iPad app for managing leads, cases, and policies with RBAC for approvals, built with Cordova and Angular.',
			technologies: ['Angular', 'Angular Material', 'RxJS', 'Node-RED', 'Cordova', 'NodeJS']
		},
		{
			name: 'Apollo Insurance Sales App',
			url: 'https://tihsa.co.za',
			domains: ['Insurance', 'Sales', 'Web Application'],
			description:
				'Web application for vehicle and mortgage insurance sales with automated builds and branding, developed in an Agile environment.',
			technologies: ['Angular 8', 'Angular Material', 'RxJS', 'Node-RED', 'MongoDB']
		},
		{
			name: 'Quality Trace & Track (QTT)',
			url: 'https://www.ingredion.com',
			domains: ['Agriculture', 'Lab Testing', 'Sample Tracking'],
			description:
				'Product for plant and agro lab users to submit samples for testing and track tests with simplified micro manifest reading.',
			technologies: ['Angular', 'Angular Material', 'RxJS', 'Node-RED', 'MongoDB']
		}
	];
</script>

<!-- Projects Section -->
<section class="px-4 py-6 sm:px-6 lg:px-8" id="projects">
	<div class="mx-auto grid max-w-full grid-cols-1 gap-8 lg:grid-cols-4">
		<!-- Left: Title -->
		<div class="lg:col-span-2">
			<h2
				class="text-2xl font-bold text-slate-100 underline decoration-purple-400 decoration-4 underline-offset-8"
			>
				PROJECTS
			</h2>
		</div>

		<!-- Right: Project Items -->
		<div class="space-y-12 lg:col-span-3">
			{#each projects as proj (proj.name)}
				<div
					class="proj-card rounded-xl bg-slate-800/30 p-6 shadow-lg transition-shadow duration-300 hover:shadow-purple-500/30"
				>
					<!-- Project Name -->
					<h3 class="mb-2 text-xl font-semibold text-slate-100">
						<a
							href={proj.url}
							target="_blank"
							rel="noreferrer noopener"
							class="transition-colors duration-200 hover:text-purple-300"
							aria-label={`Visit project ${proj.name}`}>{proj.name}</a
						>
					</h3>

					<!-- Domains as badges -->
					<div class="mb-3 flex flex-wrap gap-2">
						{#each proj.domains as domain}
							<span
								class="rounded-full border border-orange-500/30 bg-orange-600/10 px-3 py-1 text-xs font-semibold text-orange-300"
								>{domain}</span
							>
						{/each}
					</div>

					<!-- Description -->
					<p class="mb-4 text-sm leading-relaxed text-slate-300">{proj.description}</p>

					<!-- Tech Stack -->
					<ul class="flex flex-wrap gap-2">
						{#each proj.technologies as tech}
							<li>
								<span
									class="rounded-full border border-purple-500/20 bg-purple-600/10 px-3 py-1 text-xs font-medium text-purple-300"
									>{tech}</span
								>
							</li>
						{/each}
					</ul>
				</div>
			{/each}
		</div>
	</div>
</section>
