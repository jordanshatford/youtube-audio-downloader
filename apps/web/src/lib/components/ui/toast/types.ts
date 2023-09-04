import type { ComponentType } from 'svelte';

/**
 * The position of the toasts.
 *
 * The will also effect how the toasts stack on each other.
 */
export type ToastPosition =
	| 'top-left'
	| 'top-center'
	| 'top-right'
	| 'bottom-left'
	| 'bottom-center'
	| 'bottom-right';

/** The type of toast. */
export type ToastType = 'info' | 'success' | 'warning' | 'error' | 'promise';

/** Simple helper to define the internal functions. */
export type ToastFunction = (message: string, opts?: ToastFunctionOptions) => void;

export type ToastPromiseFunction<T> = (promise: Promise<T>, opts: ToastPromiseOptions) => void;

/**
 * The custom component to rendered.
 *
 * First index will be the component.\
 * Second index will be any props you wish to pass down to your component.
 */
export type ToastCustomComponent = [ComponentType, Record<string, unknown>];

/** Toast component props. */
export type ToastComponentOptions = Required<
	Omit<ToastFunctionOptions, 'component' | 'onMount' | 'onRemove'>
>;

export interface ToastAddOptions {
	id?: string;
	opts?: ToastFunctionOptions;
}

export interface ToastPromiseOptions extends Partial<ToastFunctionOptions> {
	/** The loading message of the promise. */
	loading: string;
	/** The text to be displayed if the promise is resolved. */
	success: string;
	/** The text to be displayed if the promise is rejected. */
	error: string;
	/** Function the run when the promise has started. */
	onStart?: () => void;
	/**
	 * Function to run when the promise has been resolved.
	 * @param data Any data returned back from the request.
	 */
	onSuccess?: <T = unknown>(data: T) => void;
	/**
	 * Function to run when the promise has been rejected.
	 * @param data Any data returned back from the request.
	 */
	onError?: <T = unknown>(data: T) => void;
	/** Function to run when the promise has ended, no matter the result. */
	onFinish?: () => void;
}

/** The toast animation properties. */
export interface ToastAnimation {
	/** The starting scale size. */
	start: number;
	/** The starting opacity. */
	opacity: number;
	/** How long it should take for the toast to be done with the animation. */
	duration: number;
}

export interface ToastLifeCycles {
	/** Run when the toast has been added to the store. */
	onMount?: () => void;
	/** Run when the toast has been removed from the store. */
	onRemove?: () => void;
}

export interface ToastFunctionOptions extends ToastLifeCycles {
	/** Allow the toast to be dismissed. */
	closable?: boolean;
	/**
	 * The duration of the toast in milliseconds.
	 *
	 * The duration used for a promise type will be the duration of the success or error toast.
	 */
	duration?: number;
	/** Never remove the toast. */
	infinite?: boolean;
}

export interface ToastComponent extends ToastComponentOptions {
	/** The unique ID of the toast. */
	id: string;
	/** The attention level of the toast. */
	type: ToastType;
	/** The message to display to the end user. */
	message: string;
}