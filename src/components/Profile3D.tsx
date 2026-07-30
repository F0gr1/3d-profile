import { Box, OrbitControls, Sphere, Torus } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Component, type ReactNode, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { profileData, type ProfileData, type ProfileSkill } from "../data/profile";

type Vector3Tuple = [number, number, number];

const skillPositions: Vector3Tuple[] = [
  [-2.9, 0.9, 0.5],
  [2.9, 0.9, 0.35],
  [-2.1, -1.35, 1.35],
  [2.1, -1.35, 1.35],
  [-0.8, -2.45, -0.35],
  [0.8, -2.45, -0.35],
];

function canUseWebGL() {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return false;
  }

  try {
    const canvas = document.createElement("canvas");

    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")),
    );
  } catch {
    return false;
  }
}

function getReducedMotionPreference() {
  if (typeof window === "undefined" || !window.matchMedia) {
    return false;
  }

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function useWebGLAvailability() {
  const [isAvailable, setIsAvailable] = useState(canUseWebGL);

  return {
    isAvailable,
    markUnavailable: () => setIsAvailable(false),
  };
}

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    getReducedMotionPreference,
  );

  useEffect(() => {
    if (!window.matchMedia) {
      return undefined;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setPrefersReducedMotion(mediaQuery.matches);

    onChange();
    mediaQuery.addEventListener("change", onChange);

    return () => mediaQuery.removeEventListener("change", onChange);
  }, []);

  return prefersReducedMotion;
}

function Avatar({ reducedMotion }: { reducedMotion: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const mesh = meshRef.current;

    if (!mesh || reducedMotion) {
      return;
    }

    mesh.rotation.x += delta * 0.28;
    mesh.rotation.y += delta * 0.18;
    mesh.position.y = 1.25 + Math.sin(state.clock.elapsedTime * 0.8) * 0.06;
  });

  return (
    <group>
      <Sphere ref={meshRef} args={[1.05, 48, 48]} position={[0, 1.25, 0]}>
        <meshStandardMaterial color="#60a5fa" roughness={0.18} metalness={0.72} />
      </Sphere>
      <Sphere args={[0.35, 32, 32]} position={[0.72, 1.65, 0.4]}>
        <meshStandardMaterial color="#22d3ee" emissive="#0e7490" emissiveIntensity={0.45} />
      </Sphere>
    </group>
  );
}

function SkillBox({
  position,
  skill,
  reducedMotion,
}: {
  position: Vector3Tuple;
  skill: ProfileSkill;
  reducedMotion: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const mesh = meshRef.current;

    if (!mesh || reducedMotion) {
      return;
    }

    mesh.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.16;
    mesh.rotation.x += 0.004;
    mesh.rotation.y += 0.01;
  });

  return (
    <group>
      <Box ref={meshRef} args={[0.78, 0.78, 0.78]} position={position}>
        <meshStandardMaterial color={skill.color} roughness={0.28} metalness={0.42} />
      </Box>
    </group>
  );
}

function DecorativeRing({ reducedMotion }: { reducedMotion: boolean }) {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    const ring = ringRef.current;

    if (!ring || reducedMotion) {
      return;
    }

    ring.rotation.z += delta * 0.22;
    ring.rotation.x += delta * 0.06;
  });

  return (
    <Torus ref={ringRef} args={[3.25, 0.035, 16, 128]} position={[0, -0.2, -1.2]}>
      <meshStandardMaterial color="#38bdf8" emissive="#0f766e" emissiveIntensity={0.18} wireframe />
    </Torus>
  );
}

function ProfileScene({
  profile,
  reducedMotion,
  onContextLost,
}: {
  profile: ProfileData;
  reducedMotion: boolean;
  onContextLost: () => void;
}) {
  const sceneSkills = profile.skills.slice(0, skillPositions.length);

  return (
    <Canvas
      aria-hidden="true"
      camera={{ position: [0, 0.35, 7.5], fov: 54 }}
      className="profile-canvas"
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true }}
      onCreated={({ gl }) => {
        const handleContextLost = (event: Event) => {
          event.preventDefault();
          onContextLost();
        };

        gl.domElement.addEventListener("webglcontextlost", handleContextLost, { once: true });
      }}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 5, 4]} intensity={1.8} />
      <pointLight color="#38bdf8" position={[-4, 2.4, 3]} intensity={28} distance={10} />
      <pointLight color="#fb7185" position={[4, -2, 2]} intensity={18} distance={8} />

      <group position={[0, -0.25, 0]}>
        <DecorativeRing reducedMotion={reducedMotion} />
        <Avatar reducedMotion={reducedMotion} />

        {sceneSkills.map((skill, index) => (
          <SkillBox
            key={skill.name}
            position={skillPositions[index]}
            reducedMotion={reducedMotion}
            skill={skill}
          />
        ))}
      </group>

      <OrbitControls
        autoRotate={!reducedMotion}
        autoRotateSpeed={0.55}
        enableDamping={!reducedMotion}
        enablePan={false}
        enableZoom
        maxDistance={10}
        minDistance={5.4}
      />
    </Canvas>
  );
}

type SceneErrorBoundaryProps = {
  children: ReactNode;
  onError: () => void;
};

type SceneErrorBoundaryState = {
  hasError: boolean;
};

class SceneErrorBoundary extends Component<SceneErrorBoundaryProps, SceneErrorBoundaryState> {
  state: SceneErrorBoundaryState = { hasError: false };

  componentDidCatch() {
    this.setState({ hasError: true });
    this.props.onError();
  }

  render() {
    if (this.state.hasError) {
      return null;
    }

    return this.props.children;
  }
}

function WebGLFallback({ profile }: { profile: ProfileData }) {
  return (
    <div className="scene-fallback" role="status">
      <p className="scene-fallback__label">Static profile fallback</p>
      <h2>WebGL is not available in this environment.</h2>
      <p>
        The interactive canvas is optional. The same portfolio content remains available as readable HTML.
      </p>
      <div className="fallback-orbit" aria-hidden="true">
        {profile.skills.slice(0, 6).map((skill) => (
          <span key={skill.name} style={{ borderColor: skill.color }}>
            {skill.name}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Profile3D() {
  const { isAvailable: webGLAvailable, markUnavailable } = useWebGLAvailability();
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <main className="profile-page" aria-labelledby="profile-title">
      <section className="profile-hero" aria-label="Interactive 3D profile">
        <div className="scene-panel">
          <div className="scene-aurora scene-aurora--blue" aria-hidden="true" />
          <div className="scene-aurora scene-aurora--rose" aria-hidden="true" />
          {webGLAvailable ? (
            <SceneErrorBoundary onError={markUnavailable}>
              <ProfileScene
                onContextLost={markUnavailable}
                profile={profileData}
                reducedMotion={prefersReducedMotion}
              />
            </SceneErrorBoundary>
          ) : (
            <WebGLFallback profile={profileData} />
          )}
        </div>

        <div className="hero-copy">
          <p className="eyebrow">Interactive 3D Profile</p>
          <h1 id="profile-title">{profileData.name}</h1>
          <p className="hero-title">
            {profileData.handle} / {profileData.title}
          </p>
          <p className="hero-summary">{profileData.summary}</p>

          <div className="status-row" aria-live="polite">
            <span className={webGLAvailable ? "status-chip status-chip--ready" : "status-chip status-chip--fallback"}>
              {webGLAvailable ? "WebGL scene active" : "Static fallback active"}
            </span>
            <span className="status-chip">
              {prefersReducedMotion
                ? "Reduced motion mode: animations paused"
                : "Motion enabled with gentle rotation"}
            </span>
          </div>

          <div className="hero-actions" aria-label="Profile links">
            {profileData.links.map((link) => (
              <a key={link.href} href={link.href} rel="noreferrer" target="_blank">
                {link.label}
              </a>
            ))}
          </div>

          <p className="source-note">{profileData.sourceNote}</p>
        </div>

        <aside className="interaction-card" aria-label="How to use the 3D scene">
          <span>Drag to rotate</span>
          <span>Scroll to zoom</span>
          <span>Keyboard users can read the full DOM profile below</span>
        </aside>
      </section>

      <section className="profile-details" aria-label="Profile details">
        <article className="detail-card detail-card--wide">
          <p className="section-kicker">Build Focus</p>
          <h2>Small iterations, usable interfaces, simple architecture.</h2>
          <ul className="focus-list">
            {profileData.focus.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="detail-card">
          <p className="section-kicker">Tech Stack</p>
          <h2>Publicly listed skills</h2>
          <div className="skill-grid">
            {profileData.skills.map((skill) => (
              <span key={skill.name} className="skill-pill" style={{ borderColor: skill.color }}>
                {skill.name}
              </span>
            ))}
          </div>
        </article>

        <article className="detail-card detail-card--wide">
          <p className="section-kicker">Featured Builds</p>
          <h2>Public GitHub projects used as portfolio proof.</h2>
          <div className="project-grid">
            {profileData.projects.map((project) => (
              <a key={project.name} className="project-card" href={project.url} rel="noreferrer" target="_blank">
                <span>{project.name}</span>
                <p>{project.description}</p>
              </a>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}
