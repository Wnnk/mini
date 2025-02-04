export const test = () =>
  window.ipcRenderer.send("test", "Hello from renderer process");

export const invokeTest = async () => {
  const result = await window.ipcRenderer.invoke("invokeTest", Math.random());
  console.log(result);
};
