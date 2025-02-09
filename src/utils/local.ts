

export const getLocal = (key:string) => {
  if(!key) throw new Error('Key is empty');
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : null;
}

export const setLocal = (key:string, value:any) => {
  if(!key) throw new Error('Key is empty');
  if (!value) return;
  return localStorage.setItem(key, JSON.stringify(value));
}

export const removeLocal = (key:string) => {
  if(!key) throw new Error('Key is empty');
  return localStorage.removeItem(key);
}

export const clearLocal = () => {
  return localStorage.clear();
}