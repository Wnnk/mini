import Konva from "konva";
import { useAppStore } from "../../store/app";
import { watch } from "vue";

export const useDownload = (stage: Konva.Stage, layer: Konva.Layer) => {
  const appStore = useAppStore();
  if (!appStore.tool) return;

  const creatHref = (dataUrl: string, filename: string) => {
    const link = document.createElement("a");
    link.download = filename;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    appStore.download = "";
  };

  const download = (downloadType: string) => {
    if (downloadType === "png") {
      stage.toDataURL({
        x: 0,
        y: 0,
        width: stage.width(),
        height: stage.height(),
        quality: 0.9,
        callback: (dataUrl) => {
          const filename = `${Date.now()}.png`;
          creatHref(dataUrl, filename);
        },
      });
    } else if (downloadType === "jpg") {
      stage.toDataURL({
        x: 0,
        y: 0,
        width: stage.width(),
        height: stage.height(),
        quality: 0.3,
        callback: (dataUrl) => {
          const filename = `${Date.now()}.jpg`;
          creatHref(dataUrl, filename);
        },
      });
    } else if (downloadType === "json") {
      const json = stage.toJSON();
      const filename = `${Date.now()}.json`;
      const blob = new Blob([json], { type: "text/json;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      creatHref(url, filename);
      URL.revokeObjectURL(url);
    }
  };

  watch(
    () => appStore.download,
    () => {
      if (appStore.download) {
        download(appStore.download);
      }
    }
  );
};
