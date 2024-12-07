import { useAppStore } from "../store/app";
const appStore = useAppStore();
export const addListener = (type: string, listener: Function) => {
  appStore.listeners.push({ type, listener });
};

export const clearListeners = () => {
  for (const listener of appStore.listeners) {
    document.removeEventListener(listener.type, listener.listener as any);
  }
};
