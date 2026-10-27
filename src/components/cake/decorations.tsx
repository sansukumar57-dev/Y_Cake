"use client";

import * as THREE from "three";
import { useMemo } from "react";
import { seededRandom } from "@/lib/random";
import { hashString, type CakeLayout } from "./layout";
import { darkenHex } from "@/lib/colors";
import type { ResolvedDesign } from "@/lib/types";

type DecorProps = {
  layout: CakeLayout;
  scale: number;
  seed: number;
};

function Rose({
  position,
  rotation = 0,
  scale,
  tone = "rose",
}: {
  position: [number, number, number];
  rotation?: number;
  scale: number;
  tone?: "rose" | "blush";
}) {
  const petal = tone === "rose" ? "#C98B84" : "#DCAFA7";
  const petalLight = tone === "rose" ? "#D9A29B" : "#E8C4BD";
  const outer = Array.from({ length: 8 }, (_, index) => {
    const angle = (index / 8) * Math.PI * 2;
    return {
      angle,
      x: Math.cos(angle) * 0.14,
      z: Math.sin(angle) * 0.14,
    };
  });
  const inner = Array.from({ length: 5 }, (_, index) => {
    const angle = (index / 5) * Math.PI * 2 + 0.35;
    return {
      angle,
      x: Math.cos(angle) * 0.075,
      z: Math.sin(angle) * 0.075,
    };
  });

  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      <mesh position={[0.12, 0.015, 0.02]} rotation={[0, 0.4, 0.15]} scale={[1.3, 0.16, 0.5]}>
        <sphereGeometry args={[0.11, 12, 8]} />
        <meshStandardMaterial color="#7E8F70" roughness={0.8} />
      </mesh>
      <mesh position={[-0.1, 0.01, -0.04]} rotation={[0, -0.6, -0.1]} scale={[1.1, 0.14, 0.42]}>
        <sphereGeometry args={[0.11, 12, 8]} />
        <meshStandardMaterial color="#8B9B7C" roughness={0.8} />
      </mesh>
      {outer.map((petalItem, index) => (
        <mesh
          key={`outer-${index}`}
          position={[petalItem.x, 0.035 + index * 0.001, petalItem.z]}
          rotation={[0.24, -petalItem.angle, 0.06]}
          scale={[1.3, 0.26, 0.72]}
          castShadow
        >
          <sphereGeometry args={[0.105, 12, 8]} />
          <meshStandardMaterial
            color={index % 2 === 0 ? petal : petalLight}
            roughness={0.62}
          />
        </mesh>
      ))}
      {inner.map((petalItem, index) => (
        <mesh
          key={`inner-${index}`}
          position={[petalItem.x, 0.08, petalItem.z]}
          rotation={[0.4, -petalItem.angle, 0.05]}
          scale={[0.95, 0.22, 0.62]}
        >
          <sphereGeometry args={[0.08, 12, 8]} />
          <meshStandardMaterial
            color={index % 2 === 0 ? petalLight : "#E5B8B0"}
            roughness={0.58}
          />
        </mesh>
      ))}
      <mesh position={[0, 0.1, 0]} scale={[1, 0.6, 1]}>
        <sphereGeometry args={[0.045, 12, 8]} />
        <meshStandardMaterial color={darkenHex(petal, 0.08)} roughness={0.6} />
      </mesh>
    </group>
  );
}

function Roses({ layout, scale, seed }: DecorProps) {
  const count = layout.topRadius < 1 ? 3 : 4;
  const random = useMemo(() => seededRandom(seed + 11), [seed]);
  const positions = useMemo(
    () =>
      Array.from({ length: count }, (_, index) => {
        const angle =
          (index / count) * Math.PI * 2 + 1.2 + random() * 0.45;
        const radius = layout.topRadius * (0.48 + random() * 0.12);
        return {
          x: Math.cos(angle) * radius,
          z: Math.sin(angle) * radius,
          rotation: random() * Math.PI,
          size: scale * (0.82 + random() * 0.18),
          tone: index % 2 === 0 ? ("rose" as const) : ("blush" as const),
        };
      }),
    [count, layout.topRadius, random, scale],
  );

  return (
    <group>
      {positions.map((item, index) => (
        <Rose
          key={`rose-${index}`}
          position={[item.x, layout.topY + 0.02, item.z]}
          rotation={item.rotation}
          scale={item.size}
          tone={item.tone}
        />
      ))}
    </group>
  );
}

function Berries({ layout, scale, seed }: DecorProps) {
  const random = useMemo(() => seededRandom(seed + 29), [seed]);
  const berries = useMemo(
    () =>
      Array.from({ length: 13 }, (_, index) => {
        const angle =
          Math.PI * 0.45 + (index / 13) * Math.PI * 0.9 + random() * 0.18;
        const radius =
          layout.topRadius * (0.66 + random() * 0.18);
        return {
          x: Math.cos(angle) * radius,
          z: Math.sin(angle) * radius,
          y: layout.topY + 0.045 + random() * 0.035,
          size: scale * (0.75 + random() * 0.4),
          blue: index % 3 === 0,
        };
      }),
    [layout.topRadius, layout.topY, random, scale],
  );

  return (
    <group>
      {berries.map((berry, index) => (
        <mesh
          key={`berry-${index}`}
          position={[berry.x, berry.y, berry.z]}
          scale={berry.size}
          castShadow
        >
          <sphereGeometry args={[0.058, 14, 12]} />
          <meshStandardMaterial
            color={berry.blue ? "#3D4A66" : "#8C3440"}
            roughness={0.34}
            metalness={0.04}
          />
        </mesh>
      ))}
      <mesh
        position={[layout.topRadius * 0.2, layout.topY + 0.06, layout.topRadius * 0.58]}
        rotation={[0, 0.4, 0.2]}
        scale={[1.2, 0.18, 0.6]}
      >
        <sphereGeometry args={[0.1, 12, 8]} />
        <meshStandardMaterial color="#7E8F70" roughness={0.85} />
      </mesh>
    </group>
  );
}

function Macaron({
  position,
  rotation,
  color,
  scale,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  color: string;
  scale: number;
}) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh position={[0, 0, 0.035]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.105, 0.092, 0.042, 24]} />
        <meshStandardMaterial color={color} roughness={0.52} />
      </mesh>
      <mesh position={[0, 0, -0.035]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.105, 0.092, 0.042, 24]} />
        <meshStandardMaterial color={color} roughness={0.52} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.094, 0.094, 0.026, 24]} />
        <meshStandardMaterial color="#F6E8CE" roughness={0.6} />
      </mesh>
    </group>
  );
}

function Macarons({ layout, scale }: DecorProps) {
  const radius = layout.bottomRadius + 0.18;
  const y = 0.39 + 0.12;
  const items = [
    { angle: Math.PI / 2 - 0.95, color: "#E8BDB4" },
    { angle: Math.PI / 2 + 0.95, color: "#DCE0C4" },
    { angle: Math.PI / 2 + 1.45, color: "#C9BED3" },
  ];

  return (
    <group>
      {items.map((item, index) => (
        <Macaron
          key={`macaron-${index}`}
          position={[
            Math.cos(item.angle) * radius,
            y,
            Math.sin(item.angle) * radius,
          ]}
          rotation={[0, Math.PI / 2 - item.angle, 0.06 * (index - 1)]}
          color={item.color}
          scale={scale * 0.92}
        />
      ))}
    </group>
  );
}

function ChocolateShards({ layout, scale, seed }: DecorProps) {
  const random = useMemo(() => seededRandom(seed + 53), [seed]);
  const shards = useMemo(
    () =>
      Array.from({ length: 4 }, (_, index) => {
        const angle = -Math.PI / 2 + (index - 1.5) * 0.32 + random() * 0.12;
        const radius = layout.topRadius * (0.28 + random() * 0.18);
        return {
          x: Math.cos(angle) * radius,
          z: Math.sin(angle) * radius,
          height: scale * (0.42 + random() * 0.22),
          width: scale * (0.19 + random() * 0.08),
          rotation: random() * 0.5 - 0.25,
        };
      }),
    [layout.topRadius, random, scale],
  );

  return (
    <group>
      {shards.map((shard, index) => (
        <mesh
          key={`shard-${index}`}
          position={[
            shard.x,
            layout.topY + shard.height / 2,
            shard.z,
          ]}
          rotation={[0.08, shard.rotation, 0.12 * (index - 1.5)]}
          castShadow
        >
          <boxGeometry args={[shard.width, shard.height, 0.028]} />
          <meshStandardMaterial
            color={index % 2 === 0 ? "#3E2821" : "#52352A"}
            roughness={0.34}
            metalness={0.06}
          />
        </mesh>
      ))}
    </group>
  );
}

function GoldLeaf({ layout, scale, seed }: DecorProps) {
  const random = useMemo(() => seededRandom(seed + 71), [seed]);
  const flakes = useMemo(
    () =>
      Array.from({ length: 16 }, () => {
        const angle = random() * Math.PI * 2;
        const radius = layout.topRadius * (0.2 + random() * 0.62);
        return {
          x: Math.cos(angle) * radius,
          z: Math.sin(angle) * radius,
          rotation: random() * Math.PI,
          size: scale * (0.55 + random() * 0.7),
        };
      }),
    [layout.topRadius, random, scale],
  );

  return (
    <group>
      {flakes.map((flake, index) => (
        <mesh
          key={`gold-${index}`}
          position={[
            flake.x,
            layout.topY + 0.028 + (index % 4) * 0.004,
            flake.z,
          ]}
          rotation={[0.3, flake.rotation, 0.2]}
          scale={[flake.size, flake.size * 0.22, flake.size * 0.75]}
        >
          <tetrahedronGeometry args={[0.06, 0]} />
          <meshStandardMaterial
            color="#C9A45B"
            metalness={0.95}
            roughness={0.26}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

function Candles({ layout, scale }: DecorProps) {
  const height = scale * 0.56;
  const candles = [
    { x: -0.16 * scale, z: -0.08 * scale },
    { x: 0.01 * scale, z: -0.2 * scale },
    { x: 0.17 * scale, z: -0.06 * scale },
  ];

  return (
    <group>
      {candles.map((candle, index) => (
        <group
          key={`candle-${index}`}
          position={[candle.x, layout.topY, candle.z]}
        >
          <mesh position={[0, height / 2, 0]} castShadow>
            <cylinderGeometry args={[0.024, 0.026, height, 12]} />
            <meshStandardMaterial color="#F0E3C8" roughness={0.58} />
          </mesh>
          <mesh position={[0, height + 0.014, 0]}>
            <cylinderGeometry args={[0.004, 0.005, 0.032, 6]} />
            <meshStandardMaterial color="#3B2A20" roughness={0.8} />
          </mesh>
          <mesh
            position={[0, height + 0.055, 0]}
            scale={[1, 1.7, 1]}
          >
            <sphereGeometry args={[0.017, 8, 8]} />
            <meshStandardMaterial
              color="#F7B268"
              emissive="#F08A3C"
              emissiveIntensity={2.4}
              roughness={0.4}
            />
          </mesh>
        </group>
      ))}
      <pointLight
        position={[0, layout.topY + height + 0.18, 0]}
        intensity={0.5}
        distance={1.4}
        color="#FFB066"
      />
    </group>
  );
}

export function DecorationSet({
  resolved,
  layout,
}: {
  resolved: ResolvedDesign;
  layout: CakeLayout;
}) {
  const icons = new Set(resolved.decorations.map((decoration) => decoration.icon));
  const seed = hashString(JSON.stringify(resolved.config)) + layout.tiers.length * 97;
  const scale = Math.max(0.62, Math.min(1, layout.topRadius / 1.25));

  return (
    <group>
      {icons.has("macarons") ? (
        <Macarons layout={layout} scale={scale} seed={seed} />
      ) : null}
      {icons.has("chocolate") ? (
        <ChocolateShards layout={layout} scale={scale} seed={seed} />
      ) : null}
      {icons.has("candles") ? (
        <Candles layout={layout} scale={scale} seed={seed} />
      ) : null}
      {icons.has("roses") ? (
        <Roses layout={layout} scale={scale} seed={seed} />
      ) : null}
      {icons.has("berries") ? (
        <Berries layout={layout} scale={scale} seed={seed} />
      ) : null}
      {icons.has("gold") ? (
        <GoldLeaf layout={layout} scale={scale} seed={seed} />
      ) : null}
    </group>
  );
}
