import "@testing-library/jest-dom";

// Minimal ResizeObserver polyfill for Jest/jsdom environment.
// Some Carbon components use ResizeObserver; jsdom doesn't implement it,
// so provide a no-op implementation sufficient for our tests.
// This follows common testing patterns and keeps behavior deterministic.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
if (typeof globalThis.ResizeObserver === "undefined") {
	// Basic class with required methods. Tests don't need real resize events.
	// Keep methods no-op to avoid side-effects.
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	class ResizeObserver {
		callback: any;
		constructor(callback: any) {
			this.callback = callback;
		}
		observe() {
			// no-op
		}
		unobserve() {
			// no-op
		}
		disconnect() {
			// no-op
		}
	}

	// @ts-ignore
	globalThis.ResizeObserver = ResizeObserver;
}
