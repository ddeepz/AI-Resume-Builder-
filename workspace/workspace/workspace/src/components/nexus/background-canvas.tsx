"use client";

import { useEffect, useRef } from "react";

export default function BackgroundCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseTarget = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let THREE: typeof import("three");
    let renderer: import("three").WebGLRenderer;
    let scene: import("three").Scene;
    let camera: import("three").PerspectiveCamera;
    let particles: import("three").Points;
    let shapes: import("three").Mesh[] = [];
    let animFrame = 0;
    let mounted = true;
    const mouse = { x: 0, y: 0 };

    (async () => {
      THREE = await import("three");

      if (!mounted) return;

      scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x101b35, 0.015);

      camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      camera.position.z = 50;

      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      const palette = [
        new THREE.Color(0xa5f3fc),
        new THREE.Color(0x22d3ee),
        new THREE.Color(0x60a5fa),
        new THREE.Color(0xc4b5fd),
        new THREE.Color(0xa78bfa),
      ];

      // Particles
      const count = 2000;
      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);

      for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 200;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 200;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 200;
        const c = palette[Math.floor(Math.random() * palette.length)];
        colors[i * 3] = c.r;
        colors[i * 3 + 1] = c.g;
        colors[i * 3 + 2] = c.b;
      }

      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

      const mat = new THREE.PointsMaterial({
        size: 0.8,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
      });

      particles = new THREE.Points(geo, mat);
      scene.add(particles);

      // Floating geometric shapes
      const shapeGeos = [
        new THREE.IcosahedronGeometry(2, 0),
        new THREE.TorusGeometry(2, 0.5, 16, 32),
        new THREE.OctahedronGeometry(2, 0),
        new THREE.TorusGeometry(1.5, 0.3, 8, 24),
      ];

      for (let i = 0; i < 6; i++) {
        const g = shapeGeos[i % shapeGeos.length];
        const m = new THREE.MeshBasicMaterial({
          color: palette[i % palette.length],
          transparent: true,
          opacity: 0.15,
          wireframe: true,
        });
        const shape = new THREE.Mesh(g, m);
        shape.position.x = (Math.random() - 0.5) * 80;
        shape.position.y = (Math.random() - 0.5) * 80;
        shape.position.z = (Math.random() - 0.5) * 60 - 20;
        shape.userData = {
          rotSpeed: {
            x: Math.random() * 0.01,
            y: Math.random() * 0.01,
            z: Math.random() * 0.005,
          },
          floatSpeed: Math.random() * 0.5 + 0.2,
          floatOffset: Math.random() * Math.PI * 2,
        };
        scene.add(shape);
        shapes.push(shape);
      }

      // Holographic waves
      const waveGeo = new THREE.PlaneGeometry(120, 120, 32, 32);
      const waveMat = new THREE.MeshBasicMaterial({
        color: 0x22d3ee,
        transparent: true,
        opacity: 0.03,
        wireframe: true,
      });
      const wave = new THREE.Mesh(waveGeo, waveMat);
      wave.rotation.x = -Math.PI / 2;
      wave.position.y = -30;
      scene.add(wave);

      const wave2 = new THREE.Mesh(waveGeo, waveMat.clone());
      wave2.rotation.x = Math.PI / 2;
      wave2.position.y = 30;
      (wave2.material as THREE.MeshBasicMaterial).opacity = 0.02;
      scene.add(wave2);

      animate();
    })();

    function animate() {
      animFrame = requestAnimationFrame(animate);
      if (!THREE || !renderer || !scene || !camera) return;

      mouse.x += (mouseTarget.current.x - mouse.x) * 0.05;
      mouse.y += (mouseTarget.current.y - mouse.y) * 0.05;

      particles.rotation.x = mouse.y * 0.1;
      particles.rotation.y = mouse.x * 0.1;
      particles.rotation.z += 0.0005;

      const time = Date.now() * 0.001;
      shapes.forEach((shape) => {
        shape.rotation.x += shape.userData.rotSpeed.x;
        shape.rotation.y += shape.userData.rotSpeed.y;
        shape.rotation.z += shape.userData.rotSpeed.z;
        shape.position.y +=
          Math.sin(time * shape.userData.floatSpeed + shape.userData.floatOffset) * 0.02;
      });

      camera.position.x += (mouse.x * 5 - camera.position.x) * 0.03;
      camera.position.y += (-mouse.y * 5 - camera.position.y) * 0.03;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    }

    const onMouseMove = (e: MouseEvent) => {
      mouseTarget.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseTarget.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const onResize = () => {
      if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("resize", onResize);

    return () => {
      mounted = false;
      cancelAnimationFrame(animFrame);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      if (renderer) renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="nx-bg-canvas" aria-hidden="true" />;
}
