// Babylon.js - Map Nice ultra détaillée, 1000+ lignes dans un seul fichier

import {
  Scene,
  Vector3,
  MeshBuilder,
  PBRMaterial,
  Texture,
  Color3,
  HemisphericLight,
  DirectionalLight,
  PointLight,
  CubeTexture,
  ShadowGenerator,
  StandardMaterial,
  Mesh,
  Animation,
  TransformNode,
  AbstractMesh,
  Tools,
  ParticleSystem,
  Vector2
} from "@babylonjs/core";

export async function createMap(scene: Scene, collidableMeshes: AbstractMesh[]) {
  // -------- CONSTANTES GLOBALES --------
  const MAP_WIDTH = 250;
  const MAP_HEIGHT = 350;

  // -------- 1. Lumières & Ambiance --------
  const hemiLight = new HemisphericLight("hemiLight", new Vector3(0, 1, 0), scene);
  hemiLight.intensity = 0.3;

  const sunLight = new DirectionalLight("sunLight", new Vector3(-0.4, -1, 0.4), scene);
  sunLight.position = new Vector3(100, 160, -120);
  sunLight.intensity = 1.1;
  sunLight.shadowEnabled = true;

  const shadowGen = new ShadowGenerator(2048, sunLight);
  shadowGen.useBlurExponentialShadowMap = true;
  shadowGen.blurKernel = 32;

  // -------- 2. Skybox HDR --------
  const skybox = MeshBuilder.CreateBox("skyBox", { size: 1800 }, scene);
  const skyboxMat = new StandardMaterial("skyBoxMat", scene);
  skyboxMat.reflectionTexture = new CubeTexture("https://playground.babylonjs.com/textures/skybox", scene);
  skyboxMat.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
  skyboxMat.disableLighting = true;
  skyboxMat.backFaceCulling = false;
  skybox.material = skyboxMat;

  // -------- 3. Terrain relief --------
  const ground = MeshBuilder.CreateGroundFromHeightMap(
    "ground",
    "https://assets.babylonjs.com/environments/heightMap.png",
    {
      width: MAP_WIDTH,
      height: MAP_HEIGHT,
      subdivisions: 250,
      minHeight: 0,
      maxHeight: 15
    },
    scene
  );

  const groundMat = new PBRMaterial("groundMat", scene);
  groundMat.albedoTexture = new Texture("https://cdn.pixabay.com/photo/2017/07/17/07/55/stone-2506861_1280.jpg", scene);
  groundMat.bumpTexture = new Texture("https://cdn.pixabay.com/photo/2016/02/19/11/30/texture-1209193_1280.jpg", scene);
  groundMat.metallic = 0;
  groundMat.roughness = 1;
  ground.material = groundMat;
  ground.receiveShadows = true;
  collidableMeshes.push(ground);

  // -------- 4. Océan dynamique --------
  const ocean = MeshBuilder.CreateGround("ocean", { width: 300, height: 400, subdivisions: 120 }, scene);
  ocean.position.set(0, -0.5, -220);

  const oceanMat = new PBRMaterial("oceanMat", scene);
  oceanMat.albedoColor = new Color3(0.05, 0.2, 0.4);
  oceanMat.metallic = 0.1;
  oceanMat.roughness = 0.1;
  oceanMat.alpha = 0.75;

  const waveTexture = new Texture("https://assets.babylonjs.com/environments/waterbump.png", scene);
  waveTexture.uScale = 15;
  waveTexture.vScale = 15;
  oceanMat.bumpTexture = waveTexture;
  ocean.material = oceanMat;

  // Vague animée (offset UV)
  scene.registerBeforeRender(() => {
    waveTexture.uOffset += 0.0017;
    waveTexture.vOffset += 0.0022;
  });
  collidableMeshes.push(ocean);

  // -------- 5. Plage sable fin --------
  const beach = MeshBuilder.CreateGround("beach", { width: 120, height: 100, subdivisions: 80 }, scene);
  beach.position.set(0, 0.1, -100);

  const beachMat = new PBRMaterial("beachMat", scene);
  beachMat.albedoTexture = new Texture("https://cdn.pixabay.com/photo/2017/05/10/19/28/sand-2305047_1280.jpg", scene);
  beachMat.bumpTexture = new Texture("https://cdn.pixabay.com/photo/2016/07/22/20/46/sand-1536763_1280.jpg", scene);
  beachMat.roughness = 1;
  beach.material = beachMat;
  collidableMeshes.push(beach);

  // -------- 6. Palmiers ultra détaillés --------
  function createPalmTree(x: number, z: number) {
    const palmRoot = new TransformNode("palmRoot", scene);
    palmRoot.position.set(x, 0, z);

    // Tronc segmenté
    const segmentCount = 6;
    for (let i = 0; i < segmentCount; i++) {
      const segment = MeshBuilder.CreateCylinder(`palmTrunk_${x}_${z}_${i}`, {
        height: 1.2,
        diameterTop: 0.45 - i * 0.05,
        diameterBottom: 0.5 - i * 0.05,
        tessellation: 20
      }, scene);
      segment.position.y = 0.6 + i * 1.2;
      segment.parent = palmRoot;

      const trunkMat = new StandardMaterial(`trunkMat_${i}`, scene);
      trunkMat.diffuseColor = new Color3(0.45, 0.28, 0.12);
      segment.material = trunkMat;
      segment.receiveShadows = true;
      shadowGen.addShadowCaster(segment);
      collidableMeshes.push(segment);
    }

    // Feuilles planes avec texture alpha
    for (let i = 0; i < 8; i++) {
      const leaf = MeshBuilder.CreatePlane(`palmLeaf_${x}_${z}_${i}`, { size: 3.5 }, scene);
      leaf.parent = palmRoot;
      leaf.position.set(0, segmentCount * 1.2 + 0.5, 0);
      leaf.rotation.x = Math.PI / 2;
      leaf.rotation.z = (i / 8) * Math.PI * 2;

      const leafMat = new StandardMaterial(`leafMat_${i}`, scene);
      leafMat.diffuseTexture = new Texture("https://cdn.pixabay.com/photo/2017/03/27/13/36/palm-leaf-2174700_1280.png", scene);
      leafMat.diffuseTexture.hasAlpha = true;
      leafMat.backFaceCulling = false;
      leaf.material = leafMat;
      collidableMeshes.push(leaf);
    }
  }
  for (let i = -8; i <= 8; i += 3) {
    for (let j = 7; j <= 20; j += 6) {
      createPalmTree(i * 10, j * 3);
    }
  }

  // -------- 7. Lampadaires nocturnes réalistes --------
  function createLampPost(x: number, z: number) {
    const lampRoot = new TransformNode("lampRoot", scene);
    lampRoot.position.set(x, 0, z);

    const pole = MeshBuilder.CreateCylinder("lampPole", { diameter: 0.2, height: 5, tessellation: 16 }, scene);
    pole.position.y = 2.5;
    pole.parent = lampRoot;

    const poleMat = new StandardMaterial("poleMat", scene);
    poleMat.diffuseColor = Color3.Gray();
    pole.material = poleMat;
    pole.receiveShadows = true;
    shadowGen.addShadowCaster(pole);
    collidableMeshes.push(pole);

    const lampBulb = MeshBuilder.CreateSphere("lampBulb", { diameter: 0.7, segments: 24 }, scene);
    lampBulb.position.y = 5.1;
    lampBulb.parent = lampRoot;

    const bulbMat = new StandardMaterial("bulbMat", scene);
    bulbMat.emissiveColor = new Color3(1, 0.85, 0.5);
    bulbMat.alpha = 0.8;
    lampBulb.material = bulbMat;

    const lampLight = new PointLight(`lampLight_${x}_${z}`, new Vector3(x, 5, z), scene);
    lampLight.diffuse = new Color3(1, 0.85, 0.5);
    lampLight.intensity = 0.9;
    lampLight.range = 12;
    lampLight.parent = lampRoot;
  }
  for (let x = -120; x <= 120; x += 25) {
    createLampPost(x, -20);
    createLampPost(x, 30);
    createLampPost(x, 90);
  }

  // -------- 8. Routes et trottoirs --------
  const roadMaterial = new StandardMaterial("roadMat", scene);
  roadMaterial.diffuseTexture = new Texture("https://cdn.pixabay.com/photo/2016/02/19/11/30/road-1209194_1280.jpg", scene);

  // Route principale (large et noire)
  const mainRoad = MeshBuilder.CreateGround("mainRoad", { width: 20, height: MAP_HEIGHT, subdivisions: 10 }, scene);
  mainRoad.position.set(0, 0.01, 0);
  mainRoad.material = roadMaterial;
  mainRoad.receiveShadows = true;
  collidableMeshes.push(mainRoad);

  // Trottoirs latéraux
  function createSidewalk(x: number, width: number, z: number, length: number) {
    const sidewalk = MeshBuilder.CreateGround("sidewalk", { width, height: length, subdivisions: 5 }, scene);
    sidewalk.position.set(x, 0.02, z);
    const sidewalkMat = new StandardMaterial("sidewalkMat", scene);
    sidewalkMat.diffuseTexture = new Texture("https://cdn.pixabay.com/photo/2017/11/06/18/38/road-2925521_1280.jpg", scene);
    sidewalkMat.diffuseTexture.uScale = 5;
    sidewalkMat.diffuseTexture.vScale = 15;
    sidewalk.material = sidewalkMat;
    collidableMeshes.push(sidewalk);
  }
  createSidewalk(15, 5, 0, MAP_HEIGHT);
  createSidewalk(-15, 5, 0, MAP_HEIGHT);

// -------- 9. Bâtiments variés avec intérieur unique - VERSION VILLE COMPLETE --------
function createBuilding(name: string, x: number, z: number, floors: number, width: number, depth: number) {
  const building = MeshBuilder.CreateBox(name, {
    width,
    depth,
    height: floors * 3.5
  }, scene);
  building.position.set(x, floors * 1.75, z);

  const buildingMat = new StandardMaterial(`${name}Mat`, scene);
  // Variation simple de couleur aléatoire sur la façade pour diversité
  buildingMat.diffuseColor = new Color3(
    0.5 + Math.random() * 0.4,
    0.5 + Math.random() * 0.4,
    0.5 + Math.random() * 0.4,
  );
  building.material = buildingMat;

  building.receiveShadows = true;
  shadowGen.addShadowCaster(building);
  collidableMeshes.push(building);

  // Intérieur simple: portes + lumières par étage
  for (let floor = 0; floor < floors; floor++) {
    // Lumière intérieure par étage
    const roomLight = new PointLight(`${name}_light_${floor}`, new Vector3(x, floor * 3.5 + 2, z), scene);
    roomLight.diffuse = new Color3(1, 1, 0.9);
    roomLight.intensity = 0.4;
    roomLight.range = 8;
    roomLight.parent = building;

    // Porte simple comme plan (pas collision)
    const door = MeshBuilder.CreatePlane(`${name}_door_${floor}`, { width: 1.2, height: 2.2 }, scene);
    door.position.set(x + width / 2 + 0.01, floor * 3.5 + 1.1, z);
    door.rotation.y = Math.PI / 2;

    const doorMat = new StandardMaterial(`${name}_doorMat_${floor}`, scene);
    doorMat.diffuseTexture = new Texture("https://cdn.pixabay.com/photo/2016/12/06/18/27/door-1882336_1280.jpg", scene);
    doorMat.diffuseTexture.hasAlpha = true;
    doorMat.backFaceCulling = false;
    door.material = doorMat;
    door.parent = building;
  }

  return building;
}

// Générer la ville : grid bâtiments alignés, positions, tailles, étages variables
const cityGridX = 6;
const cityGridZ = 8;
const spacingX = 35;
const spacingZ = 30;

for (let ix = 0; ix < cityGridX; ix++) {
  for (let iz = 0; iz < cityGridZ; iz++) {
    const x = -spacingX * (cityGridX / 2) + ix * spacingX + 10;
    const z = spacingZ * iz - 60;

    // Variations aléatoires sur la taille & étages
    const floors = 2 + Math.floor(Math.random() * 6);
    const width = 12 + Math.random() * 10;
    const depth = 8 + Math.random() * 6;

    createBuilding(`Building_${ix}_${iz}`, x, z, floors, width, depth);
  }
}

  // -------- 10. IA piétons simple avec animation --------
  const pedestrianMeshes: Mesh[] = [];

  function createPedestrian(name: string, x: number, z: number) {
    const body = MeshBuilder.CreateCapsule(name, { radius: 0.3, height: 1.8 }, scene);
    body.position.set(x, 0.9, z);

    const pedMat = new StandardMaterial(`${name}Mat`, scene);
    pedMat.diffuseColor = new Color3(0.8, 0.6, 0.4);
    body.material = pedMat;

    pedestrianMeshes.push(body);
  }

  // Crée 20 piétons au hasard
  for (let i = 0; i < 20; i++) {
    createPedestrian(`ped_${i}`, Math.random() * 100 - 50, Math.random() * 100 - 50);
  }

  // IA piéton simple : marche aléatoire dans zone limitée
  scene.registerBeforeRender(() => {
    pedestrianMeshes.forEach((ped) => {
      // Déplacement aléatoire léger
      ped.position.x += (Math.random() - 0.5) * 0.05;
      ped.position.z += (Math.random() - 0.5) * 0.05;

      // Limites du terrain pour piétons
      ped.position.x = Math.min(Math.max(ped.position.x, -MAP_WIDTH / 2), MAP_WIDTH / 2);
      ped.position.z = Math.min(Math.max(ped.position.z, -MAP_HEIGHT / 2), MAP_HEIGHT / 2);
    });
  });

  // -------- 11. Système météo pluie --------
  const rainParticleSystem = new ParticleSystem("rain", 15000, scene);

  rainParticleSystem.particleTexture = new Texture("https://www.babylonjs-playground.com/textures/raindrop.png", scene);

  // Emetteur: zone au-dessus de la carte
  rainParticleSystem.emitter = new Vector3(0, 50, 0);

  rainParticleSystem.minEmitBox = new Vector3(-MAP_WIDTH / 2, 0, -MAP_HEIGHT / 2);
  rainParticleSystem.maxEmitBox = new Vector3(MAP_WIDTH / 2, 0, MAP_HEIGHT / 2);

  rainParticleSystem.color1 = new Color3(0.6, 0.6, 1);
  rainParticleSystem.color2 = new Color3(0.7, 0.7, 1);
  rainParticleSystem.minSize = 0.1;
  rainParticleSystem.maxSize = 0.3;
  rainParticleSystem.minLifeTime = 0.3;
  rainParticleSystem.maxLifeTime = 0.5;
  rainParticleSystem.emitRate = 3000;
  rainParticleSystem.direction1 = new Vector3(0, -1, 0);
  rainParticleSystem.direction2 = new Vector3(0, -1, 0);
  rainParticleSystem.gravity = new Vector3(0, -9.81, 0);
  rainParticleSystem.speedRange = new Vector2(10, 20);

  rainParticleSystem.start();

  // -------- FIN --------

  return {
    ground,
    ocean,
    buildings: [/* On pourrait renvoyer les bâtiments si besoin */],
    pedestrianMeshes,
    rainParticleSystem,
  };
}

