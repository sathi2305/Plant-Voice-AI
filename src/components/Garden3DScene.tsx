/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * PlantVoice 2.0 — 3D Interactive Botanical Sanctuary Scene (Three.js WebGL)
 * Features:
 * - 4 Visual Moods (Morning Calm, Rainy Day, Golden Evening, Moonlit Garden)
 * - 5 Growth Stages (First Hello, Little Moments Aura, New Beginnings, Bud of Wonder, In Full Bloom)
 * - 3 Hidden Discoveries (Visiting Butterfly, Pot Resonance, Starlight Firefly Wisp)
 * - Multi-harmonic global wind oscillation attuned to interaction vitality
 * - Camera Parallax & Focus/Wide view transitions
 * - Clean snapshot canvas capture support
 */

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GardenState, INITIAL_LEAVES, GARDEN_MOODS, DiscoveryId } from '../types';

interface Garden3DSceneProps {
  state: GardenState;
  onLeafTouch: (leafId: number) => void;
  onDiscovery: (id: DiscoveryId) => void;
  onContextLost?: () => void;
}

export const Garden3DScene: React.FC<Garden3DSceneProps> = ({
  state,
  onLeafTouch,
  onDiscovery,
  onContextLost,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const leavesMapRef = useRef<Map<number, { group: THREE.Group; mesh: THREE.Mesh; baseRot: THREE.Euler }>>(new Map());
  const hoveredObjectRef = useRef<string | null>(null);

  // Synchronized state ref for real-time animation loop
  const stateRef = useRef(state);
  stateRef.current = state;

  // Root pivot for global wind sway around soil level
  const plantPivotRef = useRef<THREE.Group | null>(null);
  const vitalityRef = useRef<number>(0.22);

  // Plant elements
  const flowerBudGroupRef = useRef<THREE.Group | null>(null);
  const flowerGroupRef = useRef<THREE.Group | null>(null);
  const stemMeshRef = useRef<THREE.Mesh | null>(null);
  const potMeshRef = useRef<THREE.Mesh | null>(null);
  const potResonanceRippleRef = useRef<THREE.Mesh | null>(null);

  // Discoveries
  const butterflyGroupRef = useRef<THREE.Group | null>(null);
  const butterflyWingsRef = useRef<{ left: THREE.Mesh; right: THREE.Mesh } | null>(null);
  const butterflyFlightRef = useRef<{ isFlying: boolean; progress: number } | null>(null);
  const starlightWispRef = useRef<THREE.Group | null>(null);

  // Particle systems
  const waterDropsRef = useRef<{ positions: Float32Array; velocities: Float32Array; system: THREE.Points; active: boolean } | null>(null);
  const rainyDayDropsRef = useRef<{ positions: Float32Array; velocities: Float32Array; system: THREE.Points } | null>(null);
  const ripplesRef = useRef<{ mesh: THREE.Mesh; scale: number; opacity: number }[]>([]);
  const sunParticlesRef = useRef<{ system: THREE.Points; count: number } | null>(null);
  const ambientMotesRef = useRef<THREE.Points | null>(null);
  const helloPulseRef = useRef<{ mesh: THREE.Mesh; progress: number; active: boolean } | null>(null);

  // Lights
  const sunLightRef = useRef<THREE.DirectionalLight | null>(null);
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);
  const plantSpotRef = useRef<THREE.SpotLight | null>(null);
  const moonStarsRef = useRef<THREE.Points | null>(null);

  // Interaction tracking & Camera
  const isDraggingRef = useRef(false);
  const pointerPosRef = useRef({ x: 0, y: 0 });
  const previousPointerRef = useRef({ x: 0, y: 0 });
  const cameraAngleRef = useRef({
    azimuth: 0,
    elevation: 0.18,
    targetAzimuth: 0,
    targetElevation: 0.18,
    currentRadius: 3.8,
  });

  // 1. Initial Scene Setup
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let animationFrameId: number;
    let renderer: THREE.WebGLRenderer;

    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        preserveDrawingBuffer: true, // Needed for clean PNG snapshot export!
        powerPreference: 'high-performance',
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;
      container.appendChild(renderer.domElement);
      rendererRef.current = renderer;
    } catch {
      if (onContextLost) onContextLost();
      return;
    }

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const initialMood = GARDEN_MOODS[stateRef.current.mood];
    scene.fog = new THREE.FogExp2(initialMood.fogColor, 0.045);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / container.clientHeight,
      0.1,
      50
    );
    camera.position.set(0, 1.3, 3.8);
    camera.lookAt(0, 0.75, 0);
    cameraRef.current = camera;

    // Lighting Setup
    const ambientLight = new THREE.AmbientLight(initialMood.ambientColor, initialMood.ambientIntensity);
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    const sunLight = new THREE.DirectionalLight(initialMood.sunColor, initialMood.sunIntensity);
    sunLight.position.set(3, 5, 2.5);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.bias = -0.001;
    scene.add(sunLight);
    sunLightRef.current = sunLight;

    // Fill Light
    const fillLight = new THREE.DirectionalLight(0x427a5b, 0.85);
    fillLight.position.set(-3, -1, -2);
    scene.add(fillLight);

    // Warm Plant Spot
    const plantSpot = new THREE.SpotLight(0xffeedd, 1.8, 10, Math.PI / 4, 0.4, 1);
    plantSpot.position.set(0, 4.5, 1.5);
    plantSpot.target.position.set(0, 0.6, 0);
    scene.add(plantSpot);
    scene.add(plantSpot.target);
    plantSpotRef.current = plantSpot;

    // BUILD PLANT ENVIRONMENT
    // 1. Ceramic Glazed Pot (Interactive for Discovery #2: Pot Resonance)
    const potGroup = new THREE.Group();
    const potMaterial = new THREE.MeshStandardMaterial({
      color: 0x22362b,
      roughness: 0.35,
      metalness: 0.15,
    });

    const potBodyGeom = new THREE.CylinderGeometry(0.55, 0.4, 0.75, 32);
    const potBody = new THREE.Mesh(potBodyGeom, potMaterial);
    potBody.position.y = 0.375;
    potBody.castShadow = true;
    potBody.receiveShadow = true;
    potBody.userData = { isPot: true, name: 'Ceramic Glazed Pot' };
    potGroup.add(potBody);
    potMeshRef.current = potBody;

    // Pot Rim
    const rimGeom = new THREE.TorusGeometry(0.56, 0.045, 16, 32);
    const potRim = new THREE.Mesh(rimGeom, potMaterial);
    potRim.rotation.x = Math.PI / 2;
    potRim.position.y = 0.74;
    potRim.castShadow = true;
    potRim.userData = { isPot: true };
    potGroup.add(potRim);

    // Pot Resonance Ripple Effect
    const potRippleGeom = new THREE.RingGeometry(0.58, 0.75, 32);
    const potRippleMat = new THREE.MeshBasicMaterial({
      color: 0x5eead4,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
    });
    const potResonanceRipple = new THREE.Mesh(potRippleGeom, potRippleMat);
    potResonanceRipple.rotation.x = -Math.PI / 2;
    potResonanceRipple.position.y = 0.745;
    potGroup.add(potResonanceRipple);
    potResonanceRippleRef.current = potResonanceRipple;

    // Dark Moist Soil Bed
    const soilGeom = new THREE.CylinderGeometry(0.52, 0.52, 0.08, 32);
    const soilMat = new THREE.MeshStandardMaterial({
      color: 0x17120e,
      roughness: 0.9,
      metalness: 0.05,
    });
    const soil = new THREE.Mesh(soilGeom, soilMat);
    soil.position.y = 0.71;
    soil.receiveShadow = true;
    potGroup.add(soil);

    // Pedestal Stone Base
    const stoneGeom = new THREE.CylinderGeometry(0.8, 0.85, 0.12, 32);
    const stoneMat = new THREE.MeshStandardMaterial({
      color: 0x111c16,
      roughness: 0.85,
    });
    const stone = new THREE.Mesh(stoneGeom, stoneMat);
    stone.position.y = 0.06;
    stone.receiveShadow = true;
    potGroup.add(stone);

    scene.add(potGroup);

    // 2. Plant Structure Root Group with Soil-Level Pivot
    const plantPivot = new THREE.Group();
    plantPivot.position.set(0, 0.72, 0);
    plantPivotRef.current = plantPivot;

    const plantBody = new THREE.Group();
    plantBody.position.set(0, -0.72, 0);
    plantPivot.add(plantBody);

    // Central Organic Stem
    const stemCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.72, 0),
      new THREE.Vector3(0.02, 0.95, -0.01),
      new THREE.Vector3(-0.03, 1.25, 0.02),
      new THREE.Vector3(0.01, 1.55, -0.02),
      new THREE.Vector3(0, 1.82, 0),
    ]);
    const stemGeom = new THREE.TubeGeometry(stemCurve, 32, 0.036, 12, false);
    const stemMat = new THREE.MeshStandardMaterial({
      color: 0x2e6b45,
      roughness: 0.5,
      metalness: 0.08,
    });
    const stem = new THREE.Mesh(stemGeom, stemMat);
    stem.castShadow = true;
    stem.receiveShadow = true;
    plantBody.add(stem);
    stemMeshRef.current = stem;

    // 3. Curved Leaf Geometry
    const createLeafShape = () => {
      const shape = new THREE.Shape();
      shape.moveTo(0, 0);
      shape.bezierCurveTo(0.18, 0.15, 0.28, 0.45, 0.18, 0.8);
      shape.bezierCurveTo(0.1, 0.98, 0.02, 1.12, 0, 1.25);
      shape.bezierCurveTo(-0.02, 1.12, -0.1, 0.98, -0.18, 0.8);
      shape.bezierCurveTo(-0.28, 0.45, -0.18, 0.15, 0, 0);
      return shape;
    };

    const leafShape = createLeafShape();
    const leafGeom = new THREE.ShapeGeometry(leafShape, 16);

    const pos = leafGeom.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      const x = pos.getX(i);
      const zCurvature = -Math.pow(y / 1.2, 1.8) * 0.25 - Math.abs(x) * 0.15;
      pos.setZ(i, zCurvature);
    }
    leafGeom.computeVertexNormals();

    const leavesMap = new Map();

    INITIAL_LEAVES.forEach((leafData) => {
      const leafGroup = new THREE.Group();
      const stemPoint = stemCurve.getPointAt(leafData.height);
      leafGroup.position.copy(stemPoint);

      leafGroup.rotation.y = leafData.angle;
      leafGroup.rotation.x = leafData.tilt;
      leafGroup.rotation.z = Math.sin(leafData.angle) * 0.15;

      const leafMaterial = new THREE.MeshStandardMaterial({
        color: 0x3d8559,
        roughness: 0.4,
        metalness: 0.08,
        side: THREE.DoubleSide,
        emissive: 0x0a2414,
        emissiveIntensity: 0.1,
      });

      const leafMesh = new THREE.Mesh(leafGeom, leafMaterial);
      leafMesh.castShadow = true;
      leafMesh.receiveShadow = true;
      leafMesh.scale.set(leafData.size * 0.72, leafData.size * 0.72, leafData.size * 0.72);
      leafMesh.userData = { leafId: leafData.id, leafData };

      // Central Leaf Midrib Vein
      const veinGeom = new THREE.CylinderGeometry(0.008, 0.003, 1.05 * leafData.size * 0.72, 8);
      const veinMat = new THREE.MeshStandardMaterial({ color: 0x59a977, roughness: 0.5 });
      const veinMesh = new THREE.Mesh(veinGeom, veinMat);
      veinMesh.position.set(0, (1.05 * leafData.size * 0.72) / 2, 0.01);
      leafMesh.add(veinMesh);

      leafGroup.add(leafMesh);
      leafGroup.visible = leafData.stageAvailable <= state.currentStage;

      plantBody.add(leafGroup);
      leavesMap.set(leafData.id, {
        group: leafGroup,
        mesh: leafMesh,
        baseRot: leafGroup.rotation.clone(),
      });
    });

    leavesMapRef.current = leavesMap;

    // 4. Stage 4 — Flower Bud at Crown
    const budGroup = new THREE.Group();
    budGroup.position.set(0, 1.83, 0);

    // Green Protective Sepals
    const sepalGeom = new THREE.ConeGeometry(0.045, 0.14, 6);
    const sepalMat = new THREE.MeshStandardMaterial({
      color: 0x489662,
      roughness: 0.5,
      emissive: 0x153820,
      emissiveIntensity: 0.3,
    });
    for (let s = 0; s < 4; s++) {
      const sepal = new THREE.Mesh(sepalGeom, sepalMat);
      sepal.rotation.y = (s / 4) * Math.PI * 2;
      sepal.rotation.z = 0.3;
      sepal.position.set(Math.sin((s / 4) * Math.PI * 2) * 0.02, 0.06, Math.cos((s / 4) * Math.PI * 2) * 0.02);
      budGroup.add(sepal);
    }
    // Bud Tip
    const budTipGeom = new THREE.SphereGeometry(0.04, 12, 12);
    const budTipMat = new THREE.MeshStandardMaterial({
      color: 0xf5d085,
      emissive: 0xdfa030,
      emissiveIntensity: 0.5,
    });
    const budTip = new THREE.Mesh(budTipGeom, budTipMat);
    budTip.position.y = 0.08;
    budGroup.add(budTip);

    budGroup.visible = state.currentStage === 4;
    plantBody.add(budGroup);
    flowerBudGroupRef.current = budGroup;

    // 5. Stage 5 — Blooming Crown Flower
    const flowerGroup = new THREE.Group();
    flowerGroup.position.set(0, 1.83, 0);

    const petalShape = new THREE.Shape();
    petalShape.moveTo(0, 0);
    petalShape.bezierCurveTo(0.08, 0.08, 0.12, 0.22, 0, 0.35);
    petalShape.bezierCurveTo(-0.12, 0.22, -0.08, 0.08, 0, 0);
    const petalGeom = new THREE.ShapeGeometry(petalShape, 12);
    const petalMat = new THREE.MeshStandardMaterial({
      color: 0xfff0de,
      roughness: 0.3,
      metalness: 0.1,
      side: THREE.DoubleSide,
      emissive: 0x4a3212,
      emissiveIntensity: 0.2,
    });

    const petalCount = 7;
    for (let p = 0; p < petalCount; p++) {
      const petalMesh = new THREE.Mesh(petalGeom, petalMat);
      const pAngle = (p / petalCount) * Math.PI * 2;
      petalMesh.rotation.y = pAngle;
      petalMesh.rotation.x = 0.65;
      petalMesh.castShadow = true;
      flowerGroup.add(petalMesh);
    }

    const coreGeom = new THREE.SphereGeometry(0.055, 16, 16);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xfbd065,
      roughness: 0.3,
      emissive: 0xffb703,
      emissiveIntensity: 0.8,
    });
    const coreMesh = new THREE.Mesh(coreGeom, coreMat);
    coreMesh.position.y = 0.04;
    flowerGroup.add(coreMesh);

    flowerGroup.visible = state.currentStage === 5;
    plantBody.add(flowerGroup);
    flowerGroupRef.current = flowerGroup;

    // Mount complete plant structure to scene
    scene.add(plantPivot);

    // 6. Discovery #1 — 3D Visiting Butterfly
    const butterflyGroup = new THREE.Group();
    butterflyGroup.position.set(0.65, 1.35, 0.35);
    butterflyGroup.userData = { isButterfly: true, name: 'Visiting Swallowtail' };

    const wingShape = new THREE.Shape();
    wingShape.moveTo(0, 0);
    wingShape.bezierCurveTo(0.08, 0.06, 0.14, 0.14, 0.12, 0.22);
    wingShape.bezierCurveTo(0.06, 0.24, 0.01, 0.15, 0, 0);
    const wingGeom = new THREE.ShapeGeometry(wingShape, 8);
    const wingMat = new THREE.MeshStandardMaterial({
      color: 0x34d399,
      emissive: 0x059669,
      emissiveIntensity: 0.6,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9,
    });

    const leftWing = new THREE.Mesh(wingGeom, wingMat);
    leftWing.userData = { isButterfly: true };
    const rightWing = new THREE.Mesh(wingGeom, wingMat);
    rightWing.scale.x = -1;
    rightWing.userData = { isButterfly: true };

    const butterflyBodyGeom = new THREE.CylinderGeometry(0.012, 0.008, 0.14, 8);
    const butterflyBodyMat = new THREE.MeshBasicMaterial({ color: 0x064e3b });
    const bBody = new THREE.Mesh(butterflyBodyGeom, butterflyBodyMat);
    bBody.rotation.x = Math.PI / 2;
    bBody.userData = { isButterfly: true };

    butterflyGroup.add(leftWing);
    butterflyGroup.add(rightWing);
    butterflyGroup.add(bBody);
    butterflyWingsRef.current = { left: leftWing, right: rightWing };
    butterflyFlightRef.current = { isFlying: false, progress: 0 };
    scene.add(butterflyGroup);
    butterflyGroupRef.current = butterflyGroup;

    // 7. Discovery #3 — Starlight Firefly Wisp
    const wispGroup = new THREE.Group();
    wispGroup.position.set(-0.45, 1.95, 0.25);
    wispGroup.userData = { isWisp: true, name: 'Starlight Firefly Wisp' };

    const wispSphereGeom = new THREE.SphereGeometry(0.045, 16, 16);
    const wispSphereMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      emissive: 0xfacc15,
      emissiveIntensity: 1.4,
    });
    const wispSphere = new THREE.Mesh(wispSphereGeom, wispSphereMat);
    wispSphere.userData = { isWisp: true };
    wispGroup.add(wispSphere);

    // Starlight glow halo ring
    const wispHaloGeom = new THREE.RingGeometry(0.05, 0.09, 16);
    const wispHaloMat = new THREE.MeshBasicMaterial({
      color: 0xfef08a,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.6,
    });
    const wispHalo = new THREE.Mesh(wispHaloGeom, wispHaloMat);
    wispHalo.userData = { isWisp: true };
    wispGroup.add(wispHalo);
    scene.add(wispGroup);
    starlightWispRef.current = wispGroup;

    // 8. Care Action Particle Systems (Water Droplets, Ripples, Sun Particles, Hello Ring)
    const waterCount = 80;
    const waterGeom = new THREE.BufferGeometry();
    const waterPositions = new Float32Array(waterCount * 3);
    const waterVelocities = new Float32Array(waterCount * 3);

    for (let i = 0; i < waterCount; i++) {
      waterPositions[i * 3] = (Math.random() - 0.5) * 0.8;
      waterPositions[i * 3 + 1] = 2.4 + Math.random() * 1.5;
      waterPositions[i * 3 + 2] = (Math.random() - 0.5) * 0.8;

      waterVelocities[i * 3] = 0;
      waterVelocities[i * 3 + 1] = -0.06 - Math.random() * 0.05;
      waterVelocities[i * 3 + 2] = 0;
    }
    waterGeom.setAttribute('position', new THREE.BufferAttribute(waterPositions, 3));

    const waterMat = new THREE.PointsMaterial({
      color: 0xa8e6ff,
      size: 0.045,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    const waterSystem = new THREE.Points(waterGeom, waterMat);
    scene.add(waterSystem);
    waterDropsRef.current = {
      positions: waterPositions,
      velocities: waterVelocities,
      system: waterSystem,
      active: false,
    };

    // Continuous Rain for "Rainy Day" Mood
    const rainCount = 140;
    const rainGeom = new THREE.BufferGeometry();
    const rainPositions = new Float32Array(rainCount * 3);
    const rainVelocities = new Float32Array(rainCount * 3);
    for (let r = 0; r < rainCount; r++) {
      rainPositions[r * 3] = (Math.random() - 0.5) * 5;
      rainPositions[r * 3 + 1] = Math.random() * 4.5;
      rainPositions[r * 3 + 2] = (Math.random() - 0.5) * 5;
      rainVelocities[r * 3 + 1] = -0.08 - Math.random() * 0.04;
    }
    rainGeom.setAttribute('position', new THREE.BufferAttribute(rainPositions, 3));
    const rainMat = new THREE.PointsMaterial({
      color: 0x93c5fd,
      size: 0.035,
      transparent: true,
      opacity: stateRef.current.mood === 'rainy' ? 0.75 : 0,
      blending: THREE.AdditiveBlending,
    });
    const rainSystem = new THREE.Points(rainGeom, rainMat);
    scene.add(rainSystem);
    rainyDayDropsRef.current = { positions: rainPositions, velocities: rainVelocities, system: rainSystem };

    // Soil ripples
    const ripples: { mesh: THREE.Mesh; scale: number; opacity: number }[] = [];
    const rippleGeom = new THREE.RingGeometry(0.04, 0.07, 32);
    for (let r = 0; r < 3; r++) {
      const ripMat = new THREE.MeshBasicMaterial({
        color: 0xa8e6ff,
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
      });
      const ripMesh = new THREE.Mesh(rippleGeom, ripMat);
      ripMesh.rotation.x = -Math.PI / 2;
      ripMesh.position.set(0, 0.72, 0);
      scene.add(ripMesh);
      ripples.push({ mesh: ripMesh, scale: 0.5, opacity: 0 });
    }
    ripplesRef.current = ripples;

    // Sunlight Golden Particles
    const sunCount = 120;
    const sunGeom = new THREE.BufferGeometry();
    const sunPos = new Float32Array(sunCount * 3);
    for (let s = 0; s < sunCount; s++) {
      sunPos[s * 3] = (Math.random() - 0.5) * 2.5;
      sunPos[s * 3 + 1] = 0.5 + Math.random() * 2.2;
      sunPos[s * 3 + 2] = (Math.random() - 0.5) * 2.5;
    }
    sunGeom.setAttribute('position', new THREE.BufferAttribute(sunPos, 3));
    const sunMat = new THREE.PointsMaterial({
      color: 0xffd275,
      size: 0.055,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    const sunSystem = new THREE.Points(sunGeom, sunMat);
    scene.add(sunSystem);
    sunParticlesRef.current = { system: sunSystem, count: sunCount };

    // Hello Energy Ring Pulse
    const helloTorusGeom = new THREE.TorusGeometry(0.38, 0.03, 16, 32);
    const helloTorusMat = new THREE.MeshBasicMaterial({
      color: 0x76e6a1,
      transparent: true,
      opacity: 0,
    });
    const helloRing = new THREE.Mesh(helloTorusGeom, helloTorusMat);
    helloRing.rotation.x = Math.PI / 2;
    helloRing.position.set(0, 0.72, 0);
    plantBody.add(helloRing);
    helloPulseRef.current = { mesh: helloRing, progress: 0, active: false };

    // Moonlit Stars
    const starCount = 100;
    const starGeom = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    for (let st = 0; st < starCount; st++) {
      starPos[st * 3] = (Math.random() - 0.5) * 8;
      starPos[st * 3 + 1] = 1.5 + Math.random() * 4;
      starPos[st * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    starGeom.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xe0e7ff,
      size: 0.04,
      transparent: true,
      opacity: stateRef.current.mood === 'moonlit' ? 0.7 : 0,
      blending: THREE.AdditiveBlending,
    });
    const starPoints = new THREE.Points(starGeom, starMat);
    scene.add(starPoints);
    moonStarsRef.current = starPoints;

    // Conservatory Ambient Dust Motes
    const moteCount = 90;
    const moteGeom = new THREE.BufferGeometry();
    const motePos = new Float32Array(moteCount * 3);
    for (let m = 0; m < moteCount; m++) {
      motePos[m * 3] = (Math.random() - 0.5) * 4.5;
      motePos[m * 3 + 1] = Math.random() * 3.5;
      motePos[m * 3 + 2] = (Math.random() - 0.5) * 4.5;
    }
    moteGeom.setAttribute('position', new THREE.BufferAttribute(motePos, 3));
    const moteMat = new THREE.PointsMaterial({
      color: 0xddeee2,
      size: 0.03,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
    });
    const motes = new THREE.Points(moteGeom, moteMat);
    scene.add(motes);
    ambientMotesRef.current = motes;

    // ANIMATION & RENDER LOOP
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      const curState = stateRef.current;

      // Camera view transition & smooth damping
      const ca = cameraAngleRef.current;
      const targetRadius = curState.cameraView === 'focus' ? 2.85 : 3.85;
      ca.currentRadius += (targetRadius - ca.currentRadius) * 0.05;

      // Add gentle pointer parallax when not dragging
      const parallaxAzimuth = !isDraggingRef.current ? pointerPosRef.current.x * 0.12 : 0;
      const parallaxElevation = !isDraggingRef.current ? pointerPosRef.current.y * 0.06 : 0;

      ca.azimuth += (ca.targetAzimuth + parallaxAzimuth - ca.azimuth) * 0.07;
      ca.elevation += (ca.targetElevation + parallaxElevation - ca.elevation) * 0.07;

      const lookTargetY = curState.cameraView === 'focus' ? 1.25 : 0.9;
      camera.position.x = Math.sin(ca.azimuth) * Math.cos(ca.elevation) * ca.currentRadius;
      camera.position.y = 0.8 + Math.sin(ca.elevation) * ca.currentRadius;
      camera.position.z = Math.cos(ca.azimuth) * Math.cos(ca.elevation) * ca.currentRadius;
      camera.lookAt(0, lookTargetY, 0);

      // --- INTERACTION-LEVEL DRIVEN GLOBAL WIND & LIVING VITALITY ---
      const careCount = curState.interactionCount;
      const careStage = curState.currentStage;

      let targetVitality = 0.2 + Math.min(0.85, (careCount / 9) * 0.55 + (careStage - 1) * 0.18);

      if (curState.isWatering) targetVitality += 0.35;
      if (curState.isSunlit) targetVitality += 0.45;
      if (curState.isSayingHello) targetVitality += 0.55;
      if (curState.touchedLeafId !== null) targetVitality += 0.25;
      if (curState.isCalmMoment) targetVitality = 0.18; // peaceful calm moment
      if (curState.reducedMotion) targetVitality = 0.08; // reduced motion setting

      vitalityRef.current += (targetVitality - vitalityRef.current) * 0.045;
      const vitality = vitalityRef.current;

      const windFreq = 0.65 + vitality * 0.48;
      const windAmp = 0.016 + vitality * 0.048;

      const primaryGust = Math.sin(elapsedTime * windFreq);
      const secondaryGust = Math.sin(elapsedTime * (windFreq * 1.7) + 1.35) * 0.38;
      const microTurbulence = Math.cos(elapsedTime * (windFreq * 2.85)) * 0.15;
      const totalWind = (primaryGust + secondaryGust + microTurbulence) * windAmp;

      const windAngle = 0.48;
      const windX = Math.cos(windAngle) * totalWind;
      const windZ = Math.sin(windAngle) * totalWind * 0.72;

      if (plantPivotRef.current) {
        plantPivotRef.current.rotation.z = -windX;
        plantPivotRef.current.rotation.x = windZ;
      }

      // Dynamic Living Foliage Sway with Stage 2+ Aura & Tap Personality
      leavesMapRef.current.forEach(({ group, baseRot, mesh }, leafId) => {
        const leafData = mesh.userData?.leafData || INITIAL_LEAVES.find((l) => l.id === leafId);
        const leafAngle = leafData?.angle || 0;
        const leafHeight = leafData?.height || 0.5;

        const heightMultiplier = 0.65 + leafHeight * 0.7;
        const windAlignment = Math.cos(leafAngle - windAngle);
        const aerodynamicDrag = totalWind * windAlignment * (0.45 + vitality * 0.45);

        const leafFreq = (1.15 + (leafId % 3) * 0.32) * (0.85 + vitality * 0.35);
        const localSway = Math.sin(elapsedTime * leafFreq + leafId) * (0.02 + vitality * 0.028);
        const localFlutter = Math.cos(elapsedTime * (leafFreq * 1.85) + leafId * 0.8) * (0.014 + vitality * 0.02);

        // Stage 2+ living aura glow: subtle breathing luminescence
        const mat = mesh.material as THREE.MeshStandardMaterial;
        if (curState.currentStage >= 2 && curState.touchedLeafId !== leafId) {
          const auraPulse = 0.12 + Math.sin(elapsedTime * 1.4 + leafId) * 0.06;
          mat.emissiveIntensity = auraPulse;
        }

        group.rotation.x = baseRot.x + (localSway + aerodynamicDrag) * heightMultiplier;
        group.rotation.z = baseRot.z + (localFlutter - windX * 0.35) * heightMultiplier;
      });

      // Flower Bud swaying (Stage 4)
      if (flowerBudGroupRef.current && flowerBudGroupRef.current.visible) {
        flowerBudGroupRef.current.rotation.z = -windX * 0.45;
        flowerBudGroupRef.current.rotation.x = windZ * 0.45;
      }

      // Flower Crown swaying (Stage 5)
      if (flowerGroupRef.current && flowerGroupRef.current.visible) {
        const tipInertiaLag = Math.sin(elapsedTime * windFreq - 0.35) * (0.015 + vitality * 0.03);
        flowerGroupRef.current.rotation.z = -windX * 0.5 + tipInertiaLag;
        flowerGroupRef.current.rotation.x = windZ * 0.5;

        const pulseSpeed = 1.1 + vitality * 0.8;
        const flowerPulse = 1 + Math.sin(elapsedTime * pulseSpeed) * (0.02 + vitality * 0.025);
        flowerGroupRef.current.scale.set(flowerPulse, flowerPulse, flowerPulse);
        flowerGroupRef.current.rotation.y = elapsedTime * (0.06 + vitality * 0.08);
      }

      // Butterfly Animation (Wing Flap & Spiral Flight Loop)
      if (butterflyGroupRef.current && butterflyWingsRef.current && butterflyFlightRef.current) {
        const flapSpeed = butterflyFlightRef.current.isFlying ? 28 : 9;
        const flapAngle = Math.sin(elapsedTime * flapSpeed) * 0.75;
        butterflyWingsRef.current.left.rotation.y = flapAngle;
        butterflyWingsRef.current.right.rotation.y = -flapAngle;

        if (butterflyFlightRef.current.isFlying) {
          butterflyFlightRef.current.progress += 0.012;
          const p = butterflyFlightRef.current.progress;
          const theta = p * Math.PI * 4;
          const flightRadius = 0.85 + Math.sin(p * Math.PI) * 0.4;
          const flightY = 1.35 + Math.sin(p * Math.PI) * 0.7;

          butterflyGroupRef.current.position.set(
            Math.cos(theta) * flightRadius,
            flightY,
            Math.sin(theta) * flightRadius
          );
          butterflyGroupRef.current.rotation.y = theta + Math.PI / 2;

          if (p >= 1.0) {
            butterflyFlightRef.current.isFlying = false;
            butterflyFlightRef.current.progress = 0;
            butterflyGroupRef.current.position.set(0.65, 1.35, 0.35);
            butterflyGroupRef.current.rotation.set(0, 0, 0);
          }
        }
      }

      // Starlight Wisp Floating
      if (starlightWispRef.current) {
        const wispBob = Math.sin(elapsedTime * 2.1) * 0.04;
        starlightWispRef.current.position.y = 1.95 + wispBob;
        starlightWispRef.current.rotation.z = elapsedTime * 0.5;
      }

      // Pot Resonance Ripple Decay
      if (potResonanceRippleRef.current && potResonanceRippleRef.current.material) {
        const pMat = potResonanceRippleRef.current.material as THREE.MeshBasicMaterial;
        if (pMat.opacity > 0) {
          potResonanceRippleRef.current.scale.x += 0.015;
          potResonanceRippleRef.current.scale.y += 0.015;
          pMat.opacity -= 0.015;
        }
      }

      // Continuous Rain for Rainy Day Mood
      if (rainyDayDropsRef.current) {
        const { positions, velocities, system } = rainyDayDropsRef.current;
        const rainMat = system.material as THREE.PointsMaterial;
        if (curState.mood !== 'rainy') {
          rainMat.opacity = 0;
        } else {
          const targetRainOpacity = 0.75;
          rainMat.opacity += (targetRainOpacity - rainMat.opacity) * 0.08;
        }

        if (rainMat.opacity > 0.01) {
          for (let r = 0; r < rainCount; r++) {
            positions[r * 3 + 1] += velocities[r * 3 + 1];
            if (positions[r * 3 + 1] < 0.05) {
              positions[r * 3 + 1] = 4.2;
            }
          }
          system.geometry.attributes.position.needsUpdate = true;
        }
      }

      // Water droplets animation (Care action)
      if (waterDropsRef.current && waterDropsRef.current.active && curState.isWatering) {
        const { positions, velocities, system } = waterDropsRef.current;
        for (let i = 0; i < waterCount; i++) {
          positions[i * 3 + 1] += velocities[i * 3 + 1];
          if (positions[i * 3 + 1] < 0.72) {
            positions[i * 3 + 1] = 2.2 + Math.random() * 0.8;
            positions[i * 3] = (Math.random() - 0.5) * 0.7;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 0.7;
          }
        }
        system.geometry.attributes.position.needsUpdate = true;
        const mat = system.material as THREE.PointsMaterial;
        mat.opacity = Math.min(0.85, mat.opacity + 0.05);

        // Soil ripples
        ripplesRef.current.forEach((rip, idx) => {
          rip.scale += 0.025;
          rip.opacity -= 0.015;
          if (rip.opacity <= 0) {
            rip.scale = 0.2 + idx * 0.3;
            rip.opacity = 0.6;
          }
          rip.mesh.scale.set(rip.scale, rip.scale, rip.scale);
          (rip.mesh.material as THREE.MeshBasicMaterial).opacity = rip.opacity;
        });
      } else if (waterDropsRef.current) {
        const mat = waterDropsRef.current.system.material as THREE.PointsMaterial;
        mat.opacity = 0;
        ripplesRef.current.forEach((rip) => {
          rip.opacity = 0;
          (rip.mesh.material as THREE.MeshBasicMaterial).opacity = 0;
        });
      }

      // Sunlight golden motes rise
      if (sunParticlesRef.current) {
        const { system, count } = sunParticlesRef.current;
        const posAttr = system.geometry.attributes.position;
        const array = posAttr.array as Float32Array;
        for (let s = 0; s < count; s++) {
          array[s * 3 + 1] += 0.008;
          array[s * 3] += Math.sin(elapsedTime * 2 + s) * 0.003;
          if (array[s * 3 + 1] > 2.8) {
            array[s * 3 + 1] = 0.6;
          }
        }
        posAttr.needsUpdate = true;
      }

      // Hello pulse ring traveling up the stem
      if (helloPulseRef.current && helloPulseRef.current.active) {
        const hp = helloPulseRef.current;
        hp.progress += 0.025;
        hp.mesh.position.y = 0.72 + hp.progress * 1.15;
        const ringScale = 0.3 + Math.sin(hp.progress * Math.PI) * 0.5;
        hp.mesh.scale.set(ringScale, ringScale, ringScale);
        (hp.mesh.material as THREE.MeshBasicMaterial).opacity = Math.sin(hp.progress * Math.PI) * 0.85;

        if (hp.progress >= 1.0) {
          hp.active = false;
          hp.progress = 0;
          (hp.mesh.material as THREE.MeshBasicMaterial).opacity = 0;
        }
      }

      // Conservatory ambient dust drift
      if (ambientMotesRef.current) {
        const motesArr = ambientMotesRef.current.geometry.attributes.position.array as Float32Array;
        const driftSpeed = 0.0012 * (0.75 + vitality * 0.65);
        for (let m = 0; m < moteCount; m++) {
          motesArr[m * 3] += Math.cos(windAngle) * driftSpeed + Math.sin(elapsedTime * 0.5 + m) * 0.0008;
          motesArr[m * 3 + 1] -= 0.002 * (0.8 + vitality * 0.4);
          motesArr[m * 3 + 2] += Math.sin(windAngle) * driftSpeed * 0.72;
          if (motesArr[m * 3] > 2.5) motesArr[m * 3] = -2.5;
          if (motesArr[m * 3 + 1] < 0) motesArr[m * 3 + 1] = 3.5;
          if (motesArr[m * 3 + 2] > 2.5) motesArr[m * 3 + 2] = -2.5;
        }
        ambientMotesRef.current.geometry.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (renderer) {
        renderer.dispose();
        if (renderer.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      }
    };
  }, []);

  // 2. React to Mood Changes (Lighting, Fog, Stars)
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const moodConfig = GARDEN_MOODS[state.mood];
    if (scene.fog) {
      (scene.fog as THREE.FogExp2).color.setHex(moodConfig.fogColor);
    }
    if (sunLightRef.current) {
      sunLightRef.current.color.setHex(moodConfig.sunColor);
      sunLightRef.current.intensity = moodConfig.sunIntensity;
    }
    if (ambientLightRef.current) {
      ambientLightRef.current.color.setHex(moodConfig.ambientColor);
      ambientLightRef.current.intensity = moodConfig.ambientIntensity;
    }
    if (moonStarsRef.current) {
      const starMat = moonStarsRef.current.material as THREE.PointsMaterial;
      starMat.opacity = state.mood === 'moonlit' ? 0.7 : 0;
    }
    if (rainyDayDropsRef.current && state.mood !== 'rainy') {
      const rainMat = rainyDayDropsRef.current.system.material as THREE.PointsMaterial;
      rainMat.opacity = 0;
    }
  }, [state.mood]);

  // 3. React to Stage and Foliage Updates (Stages 1-5)
  useEffect(() => {
    leavesMapRef.current.forEach(({ group }, leafId) => {
      const leafData = INITIAL_LEAVES.find((l) => l.id === leafId);
      if (leafData) {
        const shouldBeVisible = leafData.stageAvailable <= state.currentStage;
        if (group.visible !== shouldBeVisible) {
          group.visible = shouldBeVisible;
          if (shouldBeVisible) {
            group.scale.set(0.1, 0.1, 0.1);
            let popProgress = 0.1;
            const popInterval = setInterval(() => {
              popProgress += 0.15;
              if (popProgress >= 1.0) {
                group.scale.set(1, 1, 1);
                clearInterval(popInterval);
              } else {
                group.scale.set(popProgress, popProgress, popProgress);
              }
            }, 30);
          }
        }
      }
    });

    // Stage 4 Flower Bud
    if (flowerBudGroupRef.current) {
      const showBud = state.currentStage === 4;
      flowerBudGroupRef.current.visible = showBud;
    }

    // Stage 5 Full Flower
    if (flowerGroupRef.current) {
      const showFlower = state.currentStage === 5;
      if (flowerGroupRef.current.visible !== showFlower) {
        flowerGroupRef.current.visible = showFlower;
        if (showFlower) {
          flowerGroupRef.current.scale.set(0.01, 0.01, 0.01);
          let fScale = 0.01;
          const fInterval = setInterval(() => {
            fScale += 0.08;
            if (fScale >= 1) {
              flowerGroupRef.current?.scale.set(1, 1, 1);
              clearInterval(fInterval);
            } else {
              flowerGroupRef.current?.scale.set(fScale, fScale, fScale);
            }
          }, 30);
        }
      }
    }
  }, [state.currentStage]);

  // 4. Care Actions Responses
  useEffect(() => {
    if (state.isWatering && waterDropsRef.current) {
      waterDropsRef.current.active = true;
      leavesMapRef.current.forEach(({ group, baseRot }) => {
        group.rotation.x = baseRot.x + 0.12;
        setTimeout(() => {
          group.rotation.x = baseRot.x;
        }, 800);
      });
      const timer = setTimeout(() => {
        if (waterDropsRef.current) {
          waterDropsRef.current.active = false;
        }
      }, 2500);
      return () => {
        clearTimeout(timer);
        if (waterDropsRef.current) {
          waterDropsRef.current.active = false;
          (waterDropsRef.current.system.material as THREE.PointsMaterial).opacity = 0;
        }
      };
    } else if (!state.isWatering && waterDropsRef.current) {
      waterDropsRef.current.active = false;
      (waterDropsRef.current.system.material as THREE.PointsMaterial).opacity = 0;
      ripplesRef.current.forEach((rip) => {
        rip.opacity = 0;
        (rip.mesh.material as THREE.MeshBasicMaterial).opacity = 0;
      });
    }
  }, [state.isWatering]);

  useEffect(() => {
    if (state.isSunlit) {
      if (sunLightRef.current) {
        sunLightRef.current.color.setHex(0xffeaad);
        sunLightRef.current.intensity = 3.6;
      }
      if (plantSpotRef.current) {
        plantSpotRef.current.intensity = 2.8;
      }
      if (sunParticlesRef.current) {
        (sunParticlesRef.current.system.material as THREE.PointsMaterial).opacity = 0.85;
      }
      leavesMapRef.current.forEach(({ group, baseRot }) => {
        group.rotation.x = baseRot.x - 0.15;
      });

      const timer = setTimeout(() => {
        const moodConfig = GARDEN_MOODS[stateRef.current.mood];
        if (sunLightRef.current) {
          sunLightRef.current.color.setHex(moodConfig.sunColor);
          sunLightRef.current.intensity = moodConfig.sunIntensity;
        }
        if (plantSpotRef.current) {
          plantSpotRef.current.intensity = 1.8;
        }
        if (sunParticlesRef.current) {
          (sunParticlesRef.current.system.material as THREE.PointsMaterial).opacity = 0;
        }
        leavesMapRef.current.forEach(({ group, baseRot }) => {
          group.rotation.x = baseRot.x;
        });
      }, 2800);
      return () => clearTimeout(timer);
    }
  }, [state.isSunlit]);

  useEffect(() => {
    if (state.isSayingHello && helloPulseRef.current) {
      helloPulseRef.current.active = true;
      helloPulseRef.current.progress = 0;

      leavesMapRef.current.forEach(({ group, baseRot }, leafId) => {
        setTimeout(() => {
          group.rotation.y = baseRot.y + 0.15;
          setTimeout(() => {
            group.rotation.y = baseRot.y;
          }, 600);
        }, leafId * 70);
      });
    }
  }, [state.isSayingHello]);

  useEffect(() => {
    if (state.touchedLeafId !== null) {
      const leafItem = leavesMapRef.current.get(state.touchedLeafId);
      if (leafItem) {
        const { group, mesh, baseRot } = leafItem;
        const mat = mesh.material as THREE.MeshStandardMaterial;

        // Personality variation in animation
        const variation = state.leafTapCount % 3;
        mat.emissive.setHex(variation === 0 ? 0x56cc84 : variation === 1 ? 0xfcd34d : 0x38bdf8);
        mat.emissiveIntensity = 0.85;

        if (variation === 0) {
          group.rotation.x = baseRot.x + 0.22;
        } else if (variation === 1) {
          group.rotation.z = baseRot.z + 0.25;
        } else {
          group.rotation.y = baseRot.y + 0.3;
        }

        const timer = setTimeout(() => {
          mat.emissive.setHex(0x0a2414);
          mat.emissiveIntensity = 0.1;
          group.rotation.x = baseRot.x;
          group.rotation.y = baseRot.y;
          group.rotation.z = baseRot.z;
        }, 550);
        return () => clearTimeout(timer);
      }
    }
  }, [state.touchedLeafId, state.leafTapCount]);

  // Trigger Discovery Pot Resonance Animation from External
  useEffect(() => {
    if (state.isPotTapped && potResonanceRippleRef.current) {
      potResonanceRippleRef.current.scale.set(1, 1, 1);
      (potResonanceRippleRef.current.material as THREE.MeshBasicMaterial).opacity = 0.85;
    }
  }, [state.isPotTapped]);

  // Trigger Butterfly Flight
  useEffect(() => {
    if (state.isButterflyFlying && butterflyFlightRef.current) {
      butterflyFlightRef.current.isFlying = true;
      butterflyFlightRef.current.progress = 0;
    }
  }, [state.isButterflyFlying]);

  // 5. Pointer Event Handlers (Drag Orbit, Parallax, Raycast Clicks)
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;
    previousPointerRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const container = mountRef.current;
    if (!container || !rendererRef.current || !cameraRef.current || !sceneRef.current) return;

    const rect = container.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    pointerPosRef.current = { x: mouseX, y: mouseY };

    if (isDraggingRef.current) {
      const deltaX = e.clientX - previousPointerRef.current.x;
      const deltaY = e.clientY - previousPointerRef.current.y;
      previousPointerRef.current = { x: e.clientX, y: e.clientY };

      const ca = cameraAngleRef.current;
      ca.targetAzimuth -= deltaX * 0.007;
      ca.targetElevation = Math.max(-0.1, Math.min(0.55, ca.targetElevation + deltaY * 0.007));
      return;
    }

    // Raycast hover detection
    const mouse = new THREE.Vector2(mouseX, mouseY);
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, cameraRef.current);

    const interactiveMeshes: THREE.Mesh[] = [];
    leavesMapRef.current.forEach(({ mesh, group }) => {
      if (group.visible) interactiveMeshes.push(mesh);
    });

    if (potMeshRef.current) interactiveMeshes.push(potMeshRef.current);

    if (butterflyGroupRef.current && butterflyWingsRef.current) {
      interactiveMeshes.push(butterflyWingsRef.current.left, butterflyWingsRef.current.right);
    }

    if (starlightWispRef.current && starlightWispRef.current.children[0]) {
      interactiveMeshes.push(starlightWispRef.current.children[0] as THREE.Mesh);
    }

    const intersects = raycaster.intersectObjects(interactiveMeshes, false);

    if (intersects.length > 0) {
      const hitObj = intersects[0].object as THREE.Mesh;
      if (hitObj.userData?.leafId) {
        container.style.cursor = 'pointer';
        hoveredObjectRef.current = `leaf-${hitObj.userData.leafId}`;
      } else if (hitObj.userData?.isPot) {
        container.style.cursor = 'pointer';
        hoveredObjectRef.current = 'pot';
      } else if (hitObj.userData?.isButterfly) {
        container.style.cursor = 'pointer';
        hoveredObjectRef.current = 'butterfly';
      } else if (hitObj.userData?.isWisp) {
        container.style.cursor = 'pointer';
        hoveredObjectRef.current = 'wisp';
      }
    } else {
      hoveredObjectRef.current = null;
      container.style.cursor = 'grab';
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = false;
    const container = mountRef.current;
    if (!container || !cameraRef.current || !sceneRef.current) return;

    const rect = container.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, cameraRef.current);

    const interactiveMeshes: THREE.Mesh[] = [];
    leavesMapRef.current.forEach(({ mesh, group }) => {
      if (group.visible) interactiveMeshes.push(mesh);
    });

    if (potMeshRef.current) interactiveMeshes.push(potMeshRef.current);

    if (butterflyGroupRef.current && butterflyWingsRef.current) {
      interactiveMeshes.push(butterflyWingsRef.current.left, butterflyWingsRef.current.right);
    }

    if (starlightWispRef.current && starlightWispRef.current.children[0]) {
      interactiveMeshes.push(starlightWispRef.current.children[0] as THREE.Mesh);
    }

    const intersects = raycaster.intersectObjects(interactiveMeshes, false);
    if (intersects.length > 0) {
      const hitMesh = intersects[0].object as THREE.Mesh;
      if (hitMesh.userData?.leafId) {
        onLeafTouch(hitMesh.userData.leafId);
      } else if (hitMesh.userData?.isPot) {
        // Discovery #2: Pot Resonance
        if (potResonanceRippleRef.current) {
          potResonanceRippleRef.current.scale.set(1, 1, 1);
          (potResonanceRippleRef.current.material as THREE.MeshBasicMaterial).opacity = 0.85;
        }
        onDiscovery('pot-resonance');
      } else if (hitMesh.userData?.isButterfly) {
        // Discovery #1: Butterfly Flight
        if (butterflyFlightRef.current) {
          butterflyFlightRef.current.isFlying = true;
          butterflyFlightRef.current.progress = 0;
        }
        onDiscovery('butterfly');
      } else if (hitMesh.userData?.isWisp) {
        // Discovery #3: Starlight Wisp
        onDiscovery('starlight-wisp');
      }
    }
  };

  return (
    <div
      ref={mountRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className="relative w-full h-full select-none touch-none cursor-grab active:cursor-grabbing focus:outline-none"
      role="application"
      aria-label="Interactive 3D Virtual Plant Garden. Drag to orbit, tap leaves, pot, butterfly, or starlight wisp."
      tabIndex={0}
    />
  );
};
