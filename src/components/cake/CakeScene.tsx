"use client";

import { useEffect } from "react";
import * as THREE from "three";
import { Canvas, useThree } from "@react-three/fiber";
import { ContactShadows, OrbitControls } from "@react-three/drei";
import type { ResolvedDesign } from "@/lib/types";
import { CakeModel } from "./CakeModel";
import { registerCakeCapture } from "./capture";

const CAMERA_SETTINGS: Record<
  number,
  { position: [number, number, number]; targetY: number }
> = {
  1: { position: [4.4, 2.5, 5.1], targetY: 0.85 },
  2: { position: [4.7, 2.9, 5.5], targetY: 1.15 },
  3: { position: [5.0, 3.2, 5.9], targetY: 1.45 },
};

function CaptureBridge() {
  const { gl, scene, camera } = useThree();

  useEffect(() => {
    return registerCakeCapture(() => {
      const source = gl.domElement;
      if (!source || source.width === 0 || source.height === 0) {
        return null;
      }

      gl.render(scene, camera);

      const targetWidth = Math.min(720, source.width);
      const scale = targetWidth / source.width;
      const output = document.createElement("canvas");
      output.width = Math.max(1, Math.round(source.width * scale));
      output.height = Math.max(1, Math.round(source.height * scale));

      const context = output.getContext("2d");
      if (!context) {
        return null;
      }

      context.fillStyle = "#f8f2e9";
      context.fillRect(0, 0, output.width, output.height);
      context.drawImage(source, 0, 0, output.width, output.height);

      return output.toDataURL("image/jpeg", 0.82);
    });
  }, [camera, gl, scene]);

  return null;
}

function SceneLights() {
  return (
    <>
      <ambientLight intensity={0.34} />
      <hemisphereLight
        color="#fff8ef"
        groundColor="#d8c5b2"
        intensity={0.9}
      />
      <directionalLight
        castShadow
        position={[5, 8, 4]}
        intensity={2.6}
        color="#fff4e6"
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={22}
        shadow-camera-left={-7}
        shadow-camera-right={7}
        shadow-camera-top={7}
        shadow-camera-bottom={-7}
        shadow-bias={-0.0004}
      />
      <directionalLight
        position={[-5, 3, 3]}
        intensity={0.75}
        color="#ffe2d2"
      />
      <directionalLight
        position={[0, 5, -6]}
        intensity={1.15}
        color="#e7f0f4"
      />
    </>
  );
}

export default function CakeScene({
  resolved,
  autoRotate,
  enableZoom = false,
  onInteract,
  onReady,
}: {
  resolved: ResolvedDesign;
  autoRotate: boolean;
  enableZoom?: boolean;
  onInteract?: () => void;
  onReady?: () => void;
}) {
  const settings =
    CAMERA_SETTINGS[resolved.size.tiers] ?? CAMERA_SETTINGS[1];

  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      gl={{
        alpha: true,
        antialias: true,
        preserveDrawingBuffer: true,
        powerPreference: "high-performance",
      }}
      camera={{
        position: settings.position,
        fov: 34,
        near: 0.1,
        far: 100,
      }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.08;
        gl.outputColorSpace = THREE.SRGBColorSpace;
        onReady?.();
      }}
    >
      <SceneLights />
      <CakeModel resolved={resolved} />
      <ContactShadows
        position={[0, 0.002, 0]}
        opacity={0.3}
        scale={13}
        blur={2.8}
        far={4}
        resolution={512}
        color="#3d2a20"
        frames={1}
      />
      <OrbitControls
        makeDefault
        enablePan={false}
        enableZoom={enableZoom}
        minDistance={4.6}
        maxDistance={9.5}
        minPolarAngle={0.55}
        maxPolarAngle={1.52}
        target={[0, settings.targetY, 0]}
        autoRotate={autoRotate}
        autoRotateSpeed={0.55}
        enableDamping
        dampingFactor={0.075}
        onStart={onInteract}
      />
      <CaptureBridge />
    </Canvas>
  );
}
