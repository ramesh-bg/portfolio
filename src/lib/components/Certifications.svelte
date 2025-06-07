<script>
	import { onMount } from 'svelte';

	export let certifications = [
		{
			title: 'Frontend Developer Certification',
			issuer: 'FreeCodeCamp',
			url: 'https://www.freecodecamp.org/certification',
			description:
				'Completed comprehensive frontend developer course covering HTML, CSS, JavaScript, and React.',
			technologies: ['HTML', 'CSS', 'JavaScript', 'React'],
			date: '2023'
		},
		{
			title: 'JavaScript Algorithms and Data Structures',
			issuer: 'FreeCodeCamp',
			url: 'https://www.freecodecamp.org/certification',
			description:
				'Mastered algorithms and data structures fundamentals using JavaScript with real coding challenges.',
			technologies: ['JavaScript', 'Algorithms', 'Data Structures'],
			date: '2022'
		},
		{
			title: 'AWS Certified Solutions Architect – Associate',
			issuer: 'Amazon Web Services',
			url: 'https://aws.amazon.com/certification/certified-solutions-architect-associate/',
			description:
				'Validated knowledge of AWS cloud architecture and design principles for scalable solutions.',
			technologies: ['AWS', 'Cloud Architecture', 'Solutions Design'],
			date: '2024'
		}
	];
</script>

<section class="px-4 py-6 sm:px-6 lg:px-8" id="certifications">
	<div class="mx-auto grid max-w-full grid-cols-1 gap-8 lg:grid-cols-4">
		<!-- Left: Title -->
		<div class="lg:col-span-2">
			<h2
				class="text-2xl font-bold text-slate-100 underline decoration-purple-400 decoration-4 underline-offset-8"
			>
				CERTIFICATIONS
			</h2>
		</div>

		<!-- Right: Certification Cards -->
		<div class="space-y-12 lg:col-span-3">
			{#each certifications as cert (cert.title)}
				<article
					class="cert-card rounded-xl bg-slate-800/30 p-6 shadow-lg transition-shadow duration-300 hover:shadow-purple-500/30"
				>
					<!-- Title and Issuer -->
					<header class="mb-2 flex items-center justify-between">
						<a
							href={cert.url}
							target="_blank"
							rel="noreferrer noopener"
							class="text-xl font-semibold text-slate-100 transition-colors duration-200 hover:text-purple-300"
							aria-label={`Certification: ${cert.title} by ${cert.issuer} (opens in new tab)`}
							>{cert.title}</a
						>
						<time
							class="ml-4 rounded bg-purple-700/20 px-2 py-1 text-xs font-medium whitespace-nowrap text-purple-300"
							datetime={cert.date}>{cert.date}</time
						>
					</header>

					<p class="mb-4 text-sm leading-relaxed text-slate-300">{cert.description}</p>

					<ul class="flex flex-wrap gap-2" aria-label="Technologies used">
						{#each cert.technologies as tech}
							<li>
								<span
									class="rounded-full border border-purple-500/20 bg-purple-600/10 px-3 py-1 text-xs font-medium text-purple-300"
									>{tech}</span
								>
							</li>
						{/each}
					</ul>
				</article>
			{/each}
		</div>
	</div>
</section>
