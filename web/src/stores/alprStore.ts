import { writable } from "svelte/store";

export interface ALPRPlate {
	plate: string;
	title: string;
	owner: string;
	isBolo: boolean;
	time: number;
}

function init() {
	const { subscribe, set, update } = writable<ALPRPlate[]>([]);

	return {
		subscribe,
		addScan: (scan: ALPRPlate) => update((state) => [scan, ...state].slice(0, 100)),
		clear: () => set([]),
	};
}

export const alprStore = init();
