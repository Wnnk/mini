import { onMounted, reactive, ref,onUnmounted } from 'vue';
import { useAppStore } from '../store/app';


export const useMousePosition = (canvas: HTMLElement | null) => {
  const appStore = useAppStore();

  const getMousePosition = (event: MouseEvent) => {
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor(event.clientX - rect.left);
    const y = Math.floor(event.clientY - rect.top);
    appStore.info = { x, y };

  };

  const mouseEnterCanvas = (event: MouseEvent) => {
    if (!canvas) return;
    canvas.addEventListener('mousemove', getMousePosition);
  };

  const mouseLeaveCanvas = (event: MouseEvent) => {
    if (!canvas) return;
    canvas.removeEventListener('mousemove', getMousePosition);
  };

  if (!canvas) return ;
  canvas.addEventListener('mouseenter', mouseEnterCanvas);
  canvas.addEventListener('mouseleave', mouseLeaveCanvas);


  onUnmounted(() => {
    if (!canvas) return;
    canvas.removeEventListener('mouseenter', mouseEnterCanvas);
    canvas.removeEventListener('mouseleave', mouseLeaveCanvas);
  });
  /* store更新无需返回值 */
  return ;
};