import { cubicInOut } from 'svelte/easing';
import { TransitionConfig } from 'svelte/transition';

export default function fade(node: HTMLElement, options?: TransitionConfig) {
	const { delay = 0, duration = 400, easing = cubicInOut } = options || {};

	const originalOpacity = +getComputedStyle(node).opacity;

	return {
		delay,
		duration,
		easing,
		tick: (t: number) => {
			node.style.opacity = `${t * originalOpacity}`;
		}
	};
}
