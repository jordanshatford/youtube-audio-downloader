import { writable } from 'svelte/store';
import { SessionService } from '@yd/client';
import { toast } from '$lib/components/ui/toast';

function createSessionStore() {
	const RE_ATTEMPT_INTERVAL = 10000;

	const { subscribe, set } = writable<string>('');

	async function setup() {
		try {
			const session = await SessionService.getSession();
			set(session.id);
		} catch (err) {
			toast.error('Failed to get session. Reattempting shortly.');
			console.error('Connection failed, could not connect to internal server. ', err);
			_reAttempt();
		}
	}

	async function _reAttempt() {
		setTimeout(() => {
			setup();
		}, RE_ATTEMPT_INTERVAL);
	}

	return {
		subscribe,
		setup,
		reset: () => set('')
	};
}

export const session = createSessionStore();
