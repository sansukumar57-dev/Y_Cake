"use client";

import * as THREE from "three";
import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { ResolvedDesign } from "@/lib/types";
import { darkenHex, lightenHex } from "@/lib/colors";
import {
  createDripGeometry,
  createRoundedCylinderGeometry,
  seededRandom,
} from "./geometry";
import { getCakeLayout, hashString, STAND_TOP } from "./layout";
import { DecorationSet } from "./decorations";

function CakeStand({ bottomRadius }: { bottomRadius: number }) {
  const plateRadius = bottomRadius + 0.3;

  return (
    <group>
      <mesh position={[0, 0.035, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.62, 0.68, 0.07, 48]} />
        <meshStandardMaterial color="#E9DECD" roughness={0.32} metalness={0.04} />
      </mesh>
      <mesh position={[0, 0.19, 0]} castShadow>
        <cylinderGeometry args={[0.09, 0.13, 0.26, 32]} />
        <meshStandardMaterial color="#EDE2D2" roughness={0.3} metalness={0.05} />
      </mesh>
      <mesh position={[0, 0.355, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[plateRadius, plateRadius - 0.04, 0.07, 64]} />
        <meshStandardMaterial color="#F3EADD" roughness={0.28} metalness={0.05} />
      </mesh>
      <mesh position={[0, STAND_TOP + 0.002, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[plateRadius - 0.03, 0.012, 8, 96]} />
        <meshStandardMaterial color="#B08D57" roughness={0.3} metalness={0.75} />
      </mesh>
      <mesh position={[0, 0.072, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.66, 0.01, 8, 64]} />
        <meshStandardMaterial color="#B08D57" roughness={0.35} metalness={0.65} />
      </mesh>
    </group>
  );
}

function Drips({
  radius,
  topY,
  color,
  seed,
  count,
}: {
  radius: number;
  topY: number;
  color: string;
  seed: number;
  count: number;
}) {
  const dripColor = darkenHex(color, 0.42);
  const geometries = useMemo(
    () => [
      createDripGeometry(0.16, 0.075),
      createDripGeometry(0.25, 0.085),
      createDripGeometry(0.36, 0.08),
    ],
    [],
  );
  const drips = useMemo(() => {
    const random = seededRandom(seed);
    return Array.from({ length: count }, (_, index) => {
      const angle = (index / count) * Math.PI * 2 + random() * 0.13;
      const variant = Math.floor(random() * geometries.length);
      return {
        angle,
        variant,
        length: [0.16, 0.25, 0.36][variant],
      };
    });
  }, [count, geometries.length, seed]);

  useEffect(() => {
    return () => {
      geometries.forEach((geometry) => geometry.dispose());
    };
  }, [geometries]);

  return (
    <group>
      {drips.map((drip, index) => (
        <mesh
          key={`drip-${index}`}
          geometry={geometries[drip.variant]}
          position={[
            Math.cos(drip.angle) * (radius - 0.002),
            topY - 0.005,
            Math.sin(drip.angle) * (radius - 0.002),
          ]}
          castShadow
        >
          <meshStandardMaterial color={dripColor} roughness={0.3} metalness={0.05} />
        </mesh>
      ))}
    </group>
  );
}

function Pearls({
  radius,
  topY,
  color,
  seed,
}: {
  radius: number;
  topY: number;
  color: string;
  seed: number;
}) {
  const count = Math.round(radius * 20);
  const pearls = useMemo(() => {
    const random = seededRandom(seed);
    return Array.from({ length: count }, (_, index) => {
      const angle = (index / count) * Math.PI * 2;
      return {
        x: Math.cos(angle) * (radius + 0.012),
        y: topY - 0.025 - random() * 0.008,
        z: Math.sin(angle) * (radius + 0.012),
        scale: 0.82 + random() * 0.22,
      };
    });
  }, [count, radius, seed, topY]);
  const pearlColor = lightenHex(color, 0.12);

  return (
    <group>
      {pearls.map((pearl, index) => (
        <mesh
          key={`pearl-${index}`}
          position={[pearl.x, pearl.y, pearl.z]}
          scale={pearl.scale}
          castShadow
        >
          <sphereGeometry args={[0.032, 10, 8]} />
          <meshStandardMaterial color={pearlColor} roughness={0.52} />
        </mesh>
      ))}
    </group>
  );
}

function CakeTier({
  radius,
  height,
  centerY,
  topY,
  color,
  finish,
  seed,
}: {
  radius: number;
  height: number;
  centerY: number;
  topY: number;
  color: string;
  finish: string;
  seed: number;
}) {
  const geometry = useMemo(
    () => createRoundedCylinderGeometry(radius, height),
    [height, radius],
  );
  const topColor = lightenHex(color, 0.04);

  useEffect(() => {
    return () => geometry.dispose();
  }, [geometry]);

  return (
    <group>
      <mesh
        geometry={geometry}
        position={[0, centerY, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color={color} roughness={0.66} metalness={0.015} />
      </mesh>
      <mesh position={[0, topY + 0.002, 0]} receiveShadow>
        <cylinderGeometry args={[radius - 0.045, radius - 0.045, 0.008, 64]} />
        <meshStandardMaterial color={topColor} roughness={0.7} />
      </mesh>
      {finish === "swirl" ? (
        <Pearls radius={radius} topY={topY} color={color} seed={seed} />
      ) : null}
      {finish === "drip" ? (
        <Drips
          radius={radius}
          topY={topY}
          color={color}
          seed={seed}
          count={Math.max(12, Math.round(radius * 12))}
        />
      ) : null}
    </group>
  );
}

function usePlaqueTexture(text: string) {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 900;
    canvas.height = 300;
    const context = canvas.getContext("2d");
    if (!context) {
      return null;
    }

    context.fillStyle = "#3A241B";
    context.fillRect(0, 0, canvas.width, canvas.height);

    const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "rgba(255,255,255,0.06)");
    gradient.addColorStop(1, "rgba(0,0,0,0.18)");
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.strokeStyle = "#B08D57";
    context.lineWidth = 3;
    context.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

    context.fillStyle = "#F0DCA8";
    context.textAlign = "center";
    context.textBaseline = "middle";
    let fontSize = 84;
    const fontFamily = "'Fraunces Variable', Georgia, serif";
    context.font = `italic ${fontSize}px ${fontFamily}`;
    while (
      context.measureText(text).width > canvas.width - 130 &&
      fontSize > 38
    ) {
      fontSize -= 4;
      context.font = `italic ${fontSize}px ${fontFamily}`;
    }
    context.fillText(text, canvas.width / 2, canvas.height / 2 + 4);

    const nextTexture = new THREE.CanvasTexture(canvas);
    nextTexture.colorSpace = THREE.SRGBColorSpace;
    nextTexture.anisotropy = 8;
    return nextTexture;
  }, [text]);

  useEffect(() => {
    return () => texture?.dispose();
  }, [texture]);

  return texture;
}

function InscriptionPlaque({
  text,
  bottomRadius,
}: {
  text: string;
  bottomRadius: number;
}) {
  const texture = usePlaqueTexture(text);

  return (
    <group
      position={[0, STAND_TOP + 0.155, bottomRadius + 0.04]}
      rotation={[-0.13, 0, 0]}
    >
      <mesh castShadow>
        <boxGeometry args={[0.88, 0.3, 0.045]} />
        <meshStandardMaterial color="#3A241B" roughness={0.38} metalness={0.04} />
      </mesh>
      {texture ? (
        <mesh position={[0, 0, 0.0235]}>
          <planeGeometry args={[0.82, 0.27]} />
          <meshStandardMaterial map={texture} roughness={0.42} />
        </mesh>
      ) : null}
    </group>
  );
}

function GentleFloat({ children }: { children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (group.current) {
      group.current.position.y =
        Math.sin(state.clock.elapsedTime * 0.55) * 0.004;
    }
  });

  return <group ref={group}>{children}</group>;
}

export function CakeModel({ resolved }: { resolved: ResolvedDesign }) {
  const layout = getCakeLayout(resolved.size.tiers);
  const seed = hashString(JSON.stringify(resolved.config));

  return (
    <group>
      <CakeStand bottomRadius={layout.bottomRadius} />
      <GentleFloat>
        {layout.tiers.map((tier, index) => {
          const designTier = resolved.tiers[index];
          return (
            <CakeTier
              key={`tier-${index}-${designTier?.colorHex ?? "ivory"}`}
              radius={tier.radius}
              height={tier.height}
              centerY={tier.centerY}
              topY={tier.topY}
              color={designTier?.colorHex ?? "#F3E9D8"}
              finish={resolved.finish.id}
              seed={seed + index * 31}
            />
          );
        })}
        <DecorationSet resolved={resolved} layout={layout} />
        {resolved.inscription ? (
          <InscriptionPlaque
            text={resolved.inscription}
            bottomRadius={layout.bottomRadius}
          />
        ) : null}
      </GentleFloat>
    </group>
  );
}
