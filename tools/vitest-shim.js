// A minimal shim so modules that `import { vi } from 'vitest'` can run under Jest.
// Exports the same named export shape: `{ vi }`.
// `vi.spyOn` delegates to Jest's spyOn; `vi.fn` delegates to jest.fn.

const jestMock = (() => {
  try {
    // jest provides globals during test execution
    if (typeof globalThis.jest !== 'undefined') return globalThis.jest;
    // fall back to jest-mock package if available
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require('jest-mock');
  } catch (e) {
    return null;
  }
})();

const vi = {
  spyOn: (...args) => {
    if (jestMock && typeof jestMock.spyOn === 'function') return jestMock.spyOn(...args);
    throw new Error('vitest shim: jest.spyOn not available');
  },
  fn: (...args) => {
    if (jestMock && typeof jestMock.fn === 'function') return jestMock.fn(...args);
    throw new Error('vitest shim: jest.fn not available');
  },
  mock: (...args) => {
    if (typeof globalThis.jest === 'undefined' && jestMock && typeof jestMock.mock === 'function') return jestMock.mock(...args);
    // If running under Jest, use global jest.mock
    if (typeof globalThis.jest !== 'undefined' && typeof globalThis.jest.mock === 'function') return globalThis.jest.mock(...args);
    // noop fallback
    return undefined;
  },
  clearAllMocks: () => {
    if (typeof globalThis.jest !== 'undefined' && typeof globalThis.jest.clearAllMocks === 'function') return globalThis.jest.clearAllMocks();
  },
  resetAllMocks: () => {
    if (typeof globalThis.jest !== 'undefined' && typeof globalThis.jest.resetAllMocks === 'function') return globalThis.jest.resetAllMocks();
  },
  restoreAllMocks: () => {
    if (typeof globalThis.jest !== 'undefined' && typeof globalThis.jest.restoreAllMocks === 'function') return globalThis.jest.restoreAllMocks();
  },
};

module.exports = { vi };
