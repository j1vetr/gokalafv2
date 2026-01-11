import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const hideLoadingOverlay = () => {
  const overlay = document.getElementById('loading-overlay');
  if (overlay) {
    overlay.classList.add('hidden');
    setTimeout(() => {
      overlay.remove();
    }, 500);
  }
};

createRoot(document.getElementById("root")!).render(<App />);

requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    hideLoadingOverlay();
  });
});
