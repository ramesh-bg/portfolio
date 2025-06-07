<script>
	export let projects = [
		{
			name: 'NeoBank App',
			url: 'https://neobank.app',
			domains: ['Banking', 'FinTech'],
			description: 'A modern banking web app with real-time fund transfers and spending analytics.',
			technologies: ['React', 'Node.js', 'MongoDB', 'Tailwind CSS']
		},
		{
			name: 'InvoicePro',
			url: 'https://invoicepro.com',
			domains: ['Accounting', 'Finance'],
			description: 'Invoice generator and tax calculator for freelancers and small businesses.',
			technologies: ['Vue.js', 'Firebase', 'Bootstrap']
		},
		{
			name: 'Fund Transfer Gateway',
			url: 'https://fundtransfer.io',
			domains: ['Fund Transfer', 'Payments'],
			description: 'Secure and fast UPI-based payment gateway with transaction history and alerts.',
			technologies: ['Angular', 'Express', 'PostgreSQL']
		}
	];
</script>

<!-- Projects Section -->
<section class="px-4 py-6 sm:px-6 lg:px-8" id="projects">
	<div class="mx-auto grid max-w-full grid-cols-1 gap-8 lg:grid-cols-4">
		<!-- Left: Title -->
		<div class="lg:col-span-2">
			<h2
				class="text-2xl font-bold text-slate-100 underline decoration-blue-400 decoration-4 underline-offset-8"
			>
				PROJECTS
			</h2>
		</div>

		<!-- Right: Project Items -->
		<div class="space-y-12 lg:col-span-3">
			{#each projects as proj (proj.name)}
				<div
					class="proj-card rounded-xl bg-slate-800/30 p-6 shadow-lg transition-shadow duration-300 hover:shadow-blue-500/30"
				>
					<!-- Project Name -->
					<h3 class="mb-2 text-xl font-semibold text-slate-100">
						<a
							href={proj.url}
							target="_blank"
							rel="noreferrer noopener"
							class="transition-colors duration-200 hover:text-blue-300"
							aria-label={`Visit project ${proj.name}`}>{proj.name}</a
						>
					</h3>

					<!-- Domains as badges -->
					<div class="mb-3 flex flex-wrap gap-2">
						{#each proj.domains as domain}
							<span
								class="rounded-full border border-yellow-500/30 bg-yellow-600/10 px-3 py-1 text-xs font-semibold text-yellow-300"
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
									class="rounded-full border border-blue-500/20 bg-blue-600/10 px-3 py-1 text-xs font-medium text-blue-300"
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
