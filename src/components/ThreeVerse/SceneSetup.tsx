import * as THREE from "three";

interface SceneOptions {
  container: HTMLDivElement;
  isMobile: boolean;
}

export function createScene({ container, isMobile }: SceneOptions) {
  // Crea la scena
  const scene = new THREE.Scene();

  // Crea la camera
  const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);

  // Crea il renderer
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
  });

  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  // Stili del canvas
  renderer.domElement.style.display = "block";
  renderer.domElement.style.margin = "auto";
  renderer.domElement.style.position = "absolute";
  renderer.domElement.style.top = "0";
  renderer.domElement.style.left = "0";
  renderer.domElement.style.right = "0";
  renderer.domElement.style.bottom = "0";

  // Aggiungi il canvas al container
  container.appendChild(renderer.domElement);

  // Configura la funzione di resize
  const handleResize = () => {
    const width = container.clientWidth;
    const height = container.clientHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  };

  // Aggiungi l'event listener per il resize
  window.addEventListener("resize", handleResize);

  return {
    scene,
    camera,
    renderer,
    handleResize,
    cleanup: () => {
      window.removeEventListener("resize", handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    },
  };
}
