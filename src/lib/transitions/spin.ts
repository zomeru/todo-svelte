import { cubicInOut } from 'svelte/easing';
import { TransitionConfig } from 'svelte/transition';

export default function spin(node: HTMLElement, options?: TransitionConfig & { spin?: number }) {
	const { delay = 0, duration = 400, easing = cubicInOut, spin = 1 } = options || {};

	const originalOpacity = +getComputedStyle(node).opacity;
	const originalTransform = getComputedStyle(node).transform.replace('none', '');
	return {
		delay,
		duration,
		easing,
		css: (t: number) => {
			return `
        opacity: ${t * originalOpacity};
        transform: ${originalTransform} scale(${t}) rotate(${t * 360 * spin}deg);
      `;
		}
	};
}
