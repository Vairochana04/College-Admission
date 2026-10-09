/* Tiny external store around the core state mirror (cc).
   React components subscribe with useCC() and call set() to change state. */
import { useSyncExternalStore } from 'react';
import { cc } from './core.js';

let version = 0;
const listeners = new Set();

export function set(patch) {
  Object.assign(cc, patch);
  version++;
  listeners.forEach((l) => l());
}

export function bump() {
  version++;
  listeners.forEach((l) => l());
}

export function subscribe(l) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function snapshot() {
  return version;
}

export function useCC() {
  useSyncExternalStore(subscribe, snapshot);
  return cc;
}

/* toast — the same one-liner the single-file build used */
let toastMsg = '';
let toastTimer = null;
export const toastListeners = new Set();
export function toast(msg) {
  toastMsg = msg;
  toastListeners.forEach((l) => l(msg));
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastMsg = '';
    toastListeners.forEach((l) => l(''));
  }, 3200);
}
export function currentToast() {
  return toastMsg;
}

export { cc };
