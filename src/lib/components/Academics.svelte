<script>
	import { onMount } from 'svelte';
	export let academics = [
		{
			institution: 'Jain College of Engineering, Belagavi',
			degree: 'Bachelor of Engineering in Computer Science',
			period: 'July 2013 — May 2017',
			description:
				'Focused on core computer science concepts, software development, and engineering fundamentals. Participated in technical events and academic projects.',
			courses: ['Data Structures', 'Algorithms', 'Operating Systems', 'Web Development']
		},
		{
			institution: 'JSS College, Dharwad',
			degree: 'Pre-University',
			period: 'July 2011 — June 2013',
			description:
				'Specialized in Physics, Chemistry, Mathematics, and Computer Science (PCMCS). Built a strong foundation in analytical thinking, problem-solving, and basic programming concepts.',
			courses: ['Physics', 'Chemistry', 'Mathematics', 'Computer Science']
		}
	];

	onMount(async () => {
		const { gsap } = await import('gsap');
		const { ScrollTrigger } = await import('gsap/ScrollTrigger');
		gsap.registerPlugin(ScrollTrigger);

		gsap.utils.toArray('.academic-card').forEach((el) => {
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

<!-- Academics Section -->
<section class="px-4 py-6 sm:px-6 lg:px-8" id="academics">
	<div class="mx-auto grid max-w-full grid-cols-1 gap-8 lg:grid-cols-4">
		<!-- Left: Title -->
		<div class="lg:col-span-2">
			<h2
				class="text-2xl font-bold text-slate-100 underline decoration-pink-400 decoration-4 underline-offset-8"
			>
				ACADEMICS
			</h2>
		</div>

		<!-- Right: Academic Items -->
		<div class="space-y-12 lg:col-span-3">
			{#each academics as edu (edu.period)}
				<div
					class="academic-card rounded-xl bg-slate-800/30 p-6 shadow-lg transition-shadow duration-300 hover:shadow-pink-500/30"
				>
					<!-- Period -->
					<header class="mb-2 text-xs font-semibold tracking-wider text-pink-400 uppercase">
						{edu.period}
					</header>

					<!-- Degree and Institution -->
					<h3 class="mb-1 text-xl font-semibold text-slate-100">
						{edu.degree} @ {edu.institution}
					</h3>

					<!-- Description -->
					<p class="mb-4 text-sm leading-relaxed text-slate-300">{edu.description}</p>

					<!-- Courses -->
					<ul class="flex flex-wrap gap-2">
						{#each edu.courses as course}
							<li>
								<span
									class="rounded-full border border-pink-500/20 bg-pink-600/10 px-3 py-1 text-xs font-medium text-pink-300"
								>
									{course}
								</span>
							</li>
						{/each}
					</ul>
				</div>
			{/each}
		</div>
	</div>
</section>
