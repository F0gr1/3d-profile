import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, Box, Sphere, Torus } from "@react-three/drei";
import * as THREE from "three";

// 回転するアバター球体
function Avatar() {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((state, delta) => {
    meshRef.current.rotation.x += delta * 0.5;
    meshRef.current.rotation.y += delta * 0.2;
  });

  return (
    <Sphere ref={meshRef} args={[1, 32, 32]} position={[0, 2, 0]}>
      <meshStandardMaterial color="#4f46e5" roughness={0.3} metalness={0.7} />
    </Sphere>
  );
}

// 浮遊するスキルボックス
function SkillBox({
  position,
  color,
  skill,
}: {
  position: [number, number, number];
  color: string;
  skill: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    meshRef.current.position.y =
      position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.2;
    meshRef.current.rotation.y += 0.01;
  });

  return (
    <group>
      <Box ref={meshRef} args={[0.8, 0.8, 0.8]} position={position}>
        <meshStandardMaterial color={color} />
      </Box>
      <Text
        position={[position[0], position[1] - 1, position[2]]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {skill}
      </Text>
    </group>
  );
}

// 装飾的なリング
function DecorativeRing() {
  const ringRef = useRef<THREE.Mesh>(null!);

  useFrame((state, delta) => {
    ringRef.current.rotation.z += delta * 0.3;
  });

  return (
    <Torus ref={ringRef} args={[3, 0.1, 16, 100]} position={[0, 0, -2]}>
      <meshStandardMaterial color="#10b981" wireframe />
    </Torus>
  );
}

// メインの3Dプロフィールコンポーネント
export default function Profile3D() {
  const skills = [
    {
      position: [-3, 1, 0] as [number, number, number],
      color: "#ef4444",
      skill: "React",
    },
    {
      position: [3, 1, 0] as [number, number, number],
      color: "#3b82f6",
      skill: "TypeScript",
    },
    {
      position: [-2, -1, 2] as [number, number, number],
      color: "#f59e0b",
      skill: "Three.js",
    },
    {
      position: [2, -1, 2] as [number, number, number],
      color: "#8b5cf6",
      skill: "Node.js",
    },
  ];

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <Canvas camera={{ position: [0, 0, 8], fov: 75 }}>
        {/* 照明設定 */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <spotLight
          position={[-10, -10, -10]}
          angle={0.15}
          penumbra={1}
          intensity={0.5}
        />

        {/* メインのプロフィール要素 */}
        <Avatar />

        {/* プロフィール名 */}
        <Text
          position={[0, 4, 0]}
          fontSize={1}
          color="white"
          anchorX="center"
          anchorY="middle"
          font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
        >
          石神　勇貴
        </Text>

        {/* 職業/タイトル */}
        <Text
          position={[0, 3.2, 0]}
          fontSize={0.4}
          color="#e5e7eb"
          anchorX="center"
          anchorY="middle"
        >
          フロントエンド開発者
        </Text>

        {/* スキルボックス */}
        {skills.map((skill, index) => (
          <SkillBox
            key={index}
            position={skill.position}
            color={skill.color}
            skill={skill.skill}
          />
        ))}

        {/* 装飾リング */}
        <DecorativeRing />

        {/* カメラコントロール */}
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          enableRotate={true}
          autoRotate={true}
          autoRotateSpeed={0.5}
        />
      </Canvas>

      {/* UI オーバーレイ */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          color: "white",
          fontFamily: "Arial, sans-serif",
          zIndex: 1000,
        }}
      >
        <h2 style={{ margin: "0 0 10px 0", fontSize: "24px" }}>
          3D プロフィール
        </h2>
        <p style={{ margin: "0", fontSize: "14px", opacity: 0.8 }}>
          マウスでドラッグして回転、スクロールでズーム
        </p>
      </div>

      {/* 連絡先情報 */}
      <div
        style={{
          position: "absolute",
          bottom: "20px",
          right: "20px",
          color: "white",
          fontFamily: "Arial, sans-serif",
          textAlign: "right",
          zIndex: 1000,
        }}
      >
        <p style={{ margin: "5px 0", fontSize: "14px" }}>
          📧 your.email@example.com
        </p>
        <p style={{ margin: "5px 0", fontSize: "14px" }}>
          🐙 github.com/yourusername
        </p>
        <p style={{ margin: "5px 0", fontSize: "14px" }}>
          💼 linkedin.com/in/yourprofile
        </p>
      </div>
    </div>
  );
}
