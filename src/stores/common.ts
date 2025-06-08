import { writable, derived } from 'svelte/store';

export const currentSection = writable('intro');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const colorMap: any = {
	intro: 'text-teal-400',
	experience: 'text-teal-400',
	projects: 'text-purple-500',
	certifications: 'text-blue-400',
	academics: 'text-pink-400'
};

export const sectionColor = derived(
	currentSection,
	($section) => colorMap[$section] || 'text-teal-400'
);
