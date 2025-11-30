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
  Vector2,
  UniversalCamera
} from "@babylonjs/core";


export async function createMap(scene: Scene, collidableMeshes: AbstractMesh[], camera) {
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

function createCasino(scene: Scene, shadowGen: ShadowGenerator, collidableMeshes: AbstractMesh[], camera: UniversalCamera) {
  const posX = 0;
  const posZ = -210;

  // Taille augmentée
  const casinoWidth = 60;
  const casinoDepth = 50;
  const casinoHeight = 20;

  // Boîte décorative (pas de collisions ici)
  const casinoBody = MeshBuilder.CreateBox("casinoBody", {
    width: casinoWidth,
    depth: casinoDepth,
    height: casinoHeight,
  }, scene);
  casinoBody.position.set(posX, casinoHeight / 2, posZ);
  casinoBody.checkCollisions = false;

  const casinoMat = new StandardMaterial("casinoMat", scene);
  casinoMat.diffuseTexture = new Texture("https://upload.wikimedia.org/wikipedia/commons/6/6a/Nice_Ruhl_casino_facade.jpg", scene);
  casinoMat.specularColor = Color3.Black();
  casinoBody.material = casinoMat;

  shadowGen.addShadowCaster(casinoBody);

  // Murs internes (collisions actives sauf devant)
  const wallMat = new StandardMaterial("wallMat", scene);
  wallMat.diffuseColor = new Color3(0.6, 0.6, 0.6);

  const wallLeft = MeshBuilder.CreateBox("wallLeft", {
    width: 1,
    height: casinoHeight,
    depth: casinoDepth,
  }, scene);
  wallLeft.position.set(posX - casinoWidth / 2, casinoHeight / 2, posZ);
  wallLeft.material = wallMat;
  wallLeft.checkCollisions = true;
  collidableMeshes.push(wallLeft);

  const wallRight = wallLeft.clone("wallRight");
  wallRight.position.x = posX + casinoWidth / 2;
  collidableMeshes.push(wallRight);

  const wallBack = MeshBuilder.CreateBox("wallBack", {
    width: casinoWidth,
    height: casinoHeight,
    depth: 1,
  }, scene);
  wallBack.position.set(posX, casinoHeight / 2, posZ + casinoDepth / 2);
  wallBack.material = wallMat;
  wallBack.checkCollisions = true;
  collidableMeshes.push(wallBack);

  const ceiling = MeshBuilder.CreateBox("ceiling", {
    width: casinoWidth,
    height: 1,
    depth: casinoDepth,
  }, scene);
  ceiling.position.set(posX, casinoHeight + 0.5, posZ);
  ceiling.material = wallMat;
  ceiling.checkCollisions = false;

  // Colonnes
  for (let i = -2; i <= 2; i++) {
    const column = MeshBuilder.CreateCylinder(`casinoColumn_${i}`, {
      diameter: 1,
      height: 16,
      tessellation: 24,
    }, scene);
    column.position.set(posX + i * 8, 8, posZ + casinoDepth / 2 + 0.5);
    const colMat = new StandardMaterial("colMat", scene);
    colMat.diffuseColor = new Color3(0.95, 0.95, 0.95);
    column.material = colMat;
    shadowGen.addShadowCaster(column);
    collidableMeshes.push(column);
  }

  // Dôme
  const dome = MeshBuilder.CreateSphere("casinoDome", {
    diameter: 25,
    segments: 32,
    slice: 0.5,
  }, scene);
  dome.position.set(posX, casinoHeight + 8, posZ);
  const domeMat = new PBRMaterial("domeMat", scene);
  domeMat.albedoColor = new Color3(0.9, 0.9, 1);
  domeMat.roughness = 0.5;
  dome.material = domeMat;
  shadowGen.addShadowCaster(dome);
  collidableMeshes.push(dome);

  // Enseigne lumineuse
  const neonSign = MeshBuilder.CreatePlane("neonSign", { width: 24, height: 6 }, scene);
  neonSign.position.set(posX, casinoHeight + 2, posZ - casinoDepth / 2 - 0.1);
  const neonMat = new StandardMaterial("neonMat", scene);
  neonMat.emissiveTexture = new Texture("https://i.imgur.com/7m0v44I.png", scene);
  neonMat.emissiveColor = new Color3(1, 0.7, 0);
  neonMat.backFaceCulling = false;
  neonSign.material = neonMat;

  let neonIntensity = 1;
  let neonDir = -0.02;
  scene.registerBeforeRender(() => {
    neonIntensity += neonDir;
    if (neonIntensity < 0.4 || neonIntensity > 1) neonDir *= -1;
    neonMat.emissiveColor = new Color3(1, neonIntensity * 0.7, 0);
  });

  // Portes coulissantes
  const doorLeft = MeshBuilder.CreateBox("doorLeft", { width: 2, height: 8, depth: 0.2 }, scene);
  const doorRight = MeshBuilder.CreateBox("doorRight", { width: 2, height: 8, depth: 0.2 }, scene);
  doorLeft.position.set(posX - 2, 4, posZ - casinoDepth / 2 - 0.2);
  doorRight.position.set(posX + 2, 4, posZ - casinoDepth / 2 - 0.2);
  const doorMat = new StandardMaterial("doorMat", scene);
  doorMat.diffuseColor = new Color3(0.1, 0.1, 0.1);
  doorMat.alpha = 0.6;
  doorLeft.material = doorMat;
  doorRight.material = doorMat;
  doorLeft.checkCollisions = true;
  doorRight.checkCollisions = true;
  collidableMeshes.push(doorLeft, doorRight);

  let doorOpen = false;
  let doorT = 0;

  scene.onPointerObservable.add((pointerInfo) => {
    if (pointerInfo.type === BABYLON.PointerEventTypes.POINTERDOWN) {
      doorOpen = !doorOpen;
    }
  });

  scene.registerBeforeRender(() => {
    if (doorOpen && doorT < 1) doorT += 0.02;
    if (!doorOpen && doorT > 0) doorT -= 0.02;
    doorLeft.position.x = posX - 2 - doorT * 3;
    doorRight.position.x = posX + 2 + doorT * 3;
  });

  // Spot lumineux RGB
  const spot = new PointLight("casinoRGBSpot", new Vector3(posX, casinoHeight + 8, posZ), scene);
  spot.range = 60;
  spot.intensity = 2;

  scene.registerBeforeRender(() => {
    const t = performance.now() * 0.0004;
    spot.diffuse = Color3.FromHSV(t % 1, 1, 1);
  });

  // Entrée sans GUI
  const entrance = new Vector3(posX, 2, posZ - casinoDepth / 2 - 2);
  const interior = new Vector3(posX, 3, posZ);
  let canEnter = false;

  scene.registerBeforeRender(() => {
    const dist = Vector3.Distance(camera.position, entrance);
    canEnter = dist < 4;
  });

  window.addEventListener("keydown", (e) => {
    if (canEnter && (e.key === "e" || e.key === "E")) {
      camera.position.copyFrom(interior);
      camera.setTarget(new Vector3(posX, 3, posZ + 5));
    }
  });

  return casinoBody;
}

function setupCasinoInterior(scene: Scene, shadowGen: ShadowGenerator, collidableMeshes: AbstractMesh[], camera: UniversalCamera) {
  const posX = 0;
  const posZ = -210;
  const interiorY = 0;

  // Sol intérieur (carrelage)
  const floor = MeshBuilder.CreateGround("casinoFloor", { width: 40, height: 30 }, scene);
  floor.position.set(posX, interiorY, posZ);
  const floorMat = new StandardMaterial("floorMat", scene);
  floorMat.diffuseTexture = new Texture("https://i.imgur.com/R9d4H3k.jpg", scene); // carrelage
  floorMat.specularColor = Color3.Black();
  floor.material = floorMat;
  floor.checkCollisions = true;
  collidableMeshes.push(floor);

  // Tapis autour de la roulette
  const carpet = MeshBuilder.CreateDisc("carpet", { radius: 5, tessellation: 64 }, scene);
  carpet.rotation.x = Math.PI / 2;
  carpet.position.set(posX, interiorY + 0.01, posZ + 5);
  const carpetMat = new StandardMaterial("carpetMat", scene);
  carpetMat.diffuseColor = new Color3(0.1, 0.3, 0.1);
  carpet.material = carpetMat;

  // Table de roulette : plateau + roue
  const table = MeshBuilder.CreateTorus("rouletteTable", {
    diameter: 8,
    thickness: 0.5,
    tessellation: 64
  }, scene);
  table.position.set(posX, interiorY + 1, posZ + 5);
  const tableMat = new StandardMaterial("tableMat", scene);
  tableMat.diffuseColor = new Color3(0.2, 0, 0);
  table.material = tableMat;
  table.checkCollisions = true;
  collidableMeshes.push(table);

  // Bille
  const ball = MeshBuilder.CreateSphere("ball", { diameter: 0.2, segments: 16 }, scene);
  const ballMat = new StandardMaterial("ballMat", scene);
  ballMat.diffuseColor = new Color3(1, 1, 1);
  ball.material = ballMat;

  let ballAngle = 0;
  let spinSpeed = 0.03 + Math.random() * 0.01;
  let spinning = true;

  scene.registerBeforeRender(() => {
    if (spinning) {
      ballAngle += spinSpeed;
      ballAngle %= Math.PI * 2;
      const r = 3.5;
      const y = interiorY + 1.2;
      ball.position.set(
        posX + r * Math.cos(ballAngle),
        y,
        posZ + 5 + r * Math.sin(ballAngle)
      );
      spinSpeed *= 0.995;
      if (spinSpeed < 0.002) spinning = false;
    }
  });

  // Animation de spin au clic
  scene.onPointerObservable.add((pi) => {
    if (pi.type === BABYLON.PointerEventTypes.POINTERDOWN) {
      const pick = pi.pickInfo;
      if (pick && pick.hit && pick.pickedMesh === table) {
        spinning = true;
        spinSpeed = 0.05 + Math.random() * 0.01;
      }
    }
  });

  // Chaises autour de la table
  const chairHeight = 1.2;
  for (let i = 0; i < 6; i++) {
    const angle = i * Math.PI / 3;
    const chair = MeshBuilder.CreateBox(`chair_${i}`, {
      width: 1,
      depth: 1,
      height: 0.2
    }, scene);
    chair.position.set(
      posX + 4 * Math.cos(angle),
      interiorY + chairHeight,
      posZ + 5 + 4 * Math.sin(angle)
    );
    chair.rotation.y = -angle + Math.PI / 2;
    chair.checkCollisions = true;
    collidableMeshes.push(chair);
    const chairMat = new StandardMaterial(`chairMat_${i}`, scene);
    chairMat.diffuseTexture = new Texture("https://i.imgur.com/8fJXs4Q.jpg", scene);
    chair.material = chairMat;
  }

  // Tablettes / consoles craps au fond
  for (let i = -1; i <= 1; i++) {
    const counter = MeshBuilder.CreateBox(`counter_${i}`, {
      width: 3,
      depth: 1,
      height: 1
    }, scene);
    counter.position.set(posX + i * 7, interiorY + 0.5, posZ - 5);
    const cntMat = new StandardMaterial(`cntMat_${i}`, scene);
    cntMat.diffuseColor = new Color3(0.2, 0.2, 0.4);
    counter.material = cntMat;
    counter.checkCollisions = true;
    collidableMeshes.push(counter);
  }

  // Panneau lumineux au plafond
  const ceilingLight = MeshBuilder.CreateBox("ceilLight", {
    width: 20,
    height: 0.2,
    depth: 10
  }, scene);
  ceilingLight.position.set(posX, interiorY + 6, posZ + 5);
  const lightMat = new StandardMaterial("lightMat", scene);
  lightMat.emissiveColor = new Color3(1, 1, 0.8);
  ceilingLight.material = lightMat;

  const ceilingSpot = new SpotLight("ceilingSpot", new Vector3(posX, interiorY + 6, posZ + 5), new Vector3(0, -1, 0), Math.PI / 3, 2, scene);
  ceilingSpot.intensity = 3;
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

function addRouletteTableInside(scene: Scene, shadowGen: ShadowGenerator, collidableMeshes: AbstractMesh[]) {
  const tablePos = new Vector3(0, 1, -200); // Position fixe à l'intérieur du casino

  // Table de roulette (anneau)
  const table = MeshBuilder.CreateTorus("rouletteTable", {
    diameter: 8,
    thickness: 0.5,
    tessellation: 64
  }, scene);
  table.position.copyFrom(tablePos);
  const tableMat = new StandardMaterial("tableMat", scene);
  tableMat.diffuseColor = new Color3(0.2, 0, 0);
  table.material = tableMat;
  table.checkCollisions = true;
  collidableMeshes.push(table);
  shadowGen.addShadowCaster(table);

  // Axe central (roue fixe)
  const center = MeshBuilder.CreateCylinder("rouletteCenter", {
    height: 1,
    diameter: 2
  }, scene);
  center.position.copyFrom(tablePos).y += 0.5;
  const centerMat = new StandardMaterial("centerMat", scene);
  centerMat.diffuseColor = new Color3(0.8, 0.1, 0.1);
  center.material = centerMat;

  // Bille
  const ball = MeshBuilder.CreateSphere("rouletteBall", {
    diameter: 0.25,
    segments: 16
  }, scene);
  const ballMat = new StandardMaterial("ballMat", scene);
  ballMat.diffuseColor = new Color3(1, 1, 1);
  ball.material = ballMat;
  ball.position.copyFrom(tablePos).y += 0.7;

  let ballAngle = 0;
  let spinSpeed = 0.03 + Math.random() * 0.01;
  let spinning = true;

  scene.registerBeforeRender(() => {
    if (spinning) {
      ballAngle += spinSpeed;
      ballAngle %= Math.PI * 2;
      const radius = 3.5;
      ball.position.set(
        tablePos.x + radius * Math.cos(ballAngle),
        tablePos.y + 0.7,
        tablePos.z + radius * Math.sin(ballAngle)
      );
      spinSpeed *= 0.993;
      if (spinSpeed < 0.0015) spinning = false;
    }
  });

  // Relancer la bille au clic
  scene.onPointerObservable.add((pi) => {
    if (pi.type === BABYLON.PointerEventTypes.POINTERDOWN) {
      if (pi.pickInfo?.hit && pi.pickInfo.pickedMesh === table) {
        spinning = true;
        spinSpeed = 0.05 + Math.random() * 0.01;
      }
    }
  });

  // Tapis
  const carpet = MeshBuilder.CreateGround("rouletteCarpet", {
    width: 10,
    height: 10
  }, scene);
  carpet.position.copyFrom(tablePos).y -= 0.5;
  const carpetMat = new StandardMaterial("carpetMat", scene);
  carpetMat.diffuseColor = new Color3(0.05, 0.2, 0.05);
  carpet.material = carpetMat;
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

createCasino(scene, shadowGen, collidableMeshes, camera);
addRouletteTableInside(scene, shadowGen, collidableMeshes);
setupCasinoInterior()


  return {
    ground,
    ocean,
    buildings: [/* On pourrait renvoyer les bâtiments si besoin */],
    pedestrianMeshes,
    rainParticleSystem,
  };
}
