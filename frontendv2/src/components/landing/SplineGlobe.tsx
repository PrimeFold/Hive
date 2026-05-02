import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Background Spline 3D globe (purple), slowly auto-rotating.
 * Sized to its container; pointer events disabled so it stays decorative.
 */
export function SplineGlobe({ className = "" }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const getSize = () => ({
      w: container.clientWidth || window.innerWidth,
      h: container.clientHeight || window.innerHeight,
    });

    let { w, h } = getSize();

    const camera = new THREE.OrthographicCamera(
      w / -2,
      w / 2,
      h / 2,
      h / -2,
      -50000,
      10000,
    );
    camera.position.set(0, 0, 0);
    camera.quaternion.setFromEuler(new THREE.Euler(0, 0, 0));

    const scene = new THREE.Scene();
    scene.background = null;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    renderer.setClearAlpha(0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    container.appendChild(renderer.domElement);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";

    let splineRoot: THREE.Object3D | null = null;
    let cancelled = false;
    import("@splinetool/loader").then(({ default: SplineLoader }) => {
      if (cancelled) return;
      const loader = new SplineLoader();
      loader.load(
        "https://prod.spline.design/Yoc36xAQHXb1cJdl/scene.splinecode",
        (splineScene: THREE.Object3D) => {
          if (cancelled) return;
          splineRoot = splineScene;
          scene.add(splineScene);
        },
      );
    });

    let raf = 0;
    const animate = () => {
      // very slow spin
      if (splineRoot) splineRoot.rotation.y += 0.0015;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    const onResize = () => {
      ({ w, h } = getSize());
      camera.left = w / -2;
      camera.right = w / 2;
      camera.top = h / 2;
      camera.bottom = h / -2;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const ro = new ResizeObserver(onResize);
    ro.observe(container);
    window.addEventListener("resize", onResize);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        const material = mesh.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(material)) material.forEach((m) => m.dispose());
        else if (material) material.dispose();
      });
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden
      className={`pointer-events-none select-none ${className}`}
    />
  );
}
