import { seedState } from './data/seed.js';

export const STORAGE_KEY = 'adc.community.v1';

const clone = (value) => JSON.parse(JSON.stringify(value));

export function createBrowserRepository(storage = window.localStorage) {
  return {
    load() {
      try {
        const value = storage.getItem(STORAGE_KEY);
        if (!value) return clone(seedState);
        const state = JSON.parse(value);
        return state.schemaVersion === seedState.schemaVersion ? state : clone(seedState);
      } catch {
        return clone(seedState);
      }
    },
    save(state) {
      storage.setItem(STORAGE_KEY, JSON.stringify(state));
      return state;
    },
    reset() {
      const state = clone(seedState);
      storage.setItem(STORAGE_KEY, JSON.stringify(state));
      return state;
    }
  };
}

export function createMemoryRepository(initialState = seedState) {
  let state = clone(initialState);
  return {
    load: () => clone(state),
    save(nextState) {
      state = clone(nextState);
      return clone(state);
    },
    reset() {
      state = clone(seedState);
      return clone(state);
    }
  };
}
