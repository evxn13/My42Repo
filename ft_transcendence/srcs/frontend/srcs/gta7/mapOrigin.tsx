import {
  Scene,
  Vector3,
  MeshBuilder,
  StandardMaterial,
  Texture,
  Color3,
  AbstractMesh,
} from "@babylonjs/core";

export function createMap(scene: Scene, collidableMeshes: AbstractMesh[]) {
  // --- Utilitaire pour récupérer la hauteur y d'un mesh à (x,z) ---
  function getHeightAtPosition(mesh: AbstractMesh, x: number, z: number): number {
    const positions = mesh.getVerticesData("positions");
    if (!positions) return 0;

    let closestY = 0;
    let minDist = Infinity;
    for (let i = 0; i < positions.length; i += 3) {
      const vx = positions[i];
      const vy = positions[i + 1];
      const vz = positions[i + 2];
      const dist = Math.sqrt((vx - x) ** 2 + (vz - z) ** 2);
      if (dist < minDist) {
        minDist = dist;
        closestY = vy;
      }
    }
    return closestY;
  }

  // --- Sol route asphaltée agrandi ---
  const groundSize = 140;
  const ground = MeshBuilder.CreateGround("ground", { width: groundSize, height: groundSize }, scene);
  const groundMat = new StandardMaterial("groundMat", scene);
  groundMat.diffuseTexture = new Texture(
    "https://cdn.pixabay.com/photo/2016/03/09/09/17/asphalt-1245752_1280.jpg",
    scene
  );
  groundMat.diffuseTexture.uScale = 14;
  groundMat.diffuseTexture.vScale = 14;
  ground.material = groundMat;

  // --- Trottoirs ---
  const sidewalkMat = new StandardMaterial("sidewalkMat", scene);
  sidewalkMat.diffuseTexture = new Texture(
    "https://cdn.pixabay.com/photo/2017/07/16/11/40/pavement-2508126_1280.jpg",
    scene
  );
  sidewalkMat.diffuseTexture.uScale = 7;
  sidewalkMat.diffuseTexture.vScale = 7;

  const sidewalkWidth = 6;

  const sidewalk1 = MeshBuilder.CreateGround("sidewalk1", { width: sidewalkWidth, height: groundSize }, scene);
  sidewalk1.position.x = -groundSize / 2 + sidewalkWidth / 2;
  sidewalk1.material = sidewalkMat;

  const sidewalk2 = MeshBuilder.CreateGround("sidewalk2", { width: sidewalkWidth, height: groundSize }, scene);
  sidewalk2.position.x = groundSize / 2 - sidewalkWidth / 2;
  sidewalk2.material = sidewalkMat;

  // --- Route centrale rapprochée de la ville ---
  const roadWidth = 40;
  const road = MeshBuilder.CreateGround("road", { width: roadWidth, height: groundSize }, scene);
  road.position.x = 0;
  const roadMat = new StandardMaterial("roadMat", scene);
  roadMat.diffuseTexture = new Texture(
    "https://cdn.pixabay.com/photo/2017/06/02/21/30/road-2362078_1280.jpg",
    scene
  );
  roadMat.diffuseTexture.uScale = 7;
  roadMat.diffuseTexture.vScale = 14;
  road.material = roadMat;

  // --- Marquages au sol ---
  for (let z = -groundSize / 2; z <= groundSize / 2; z += 5) {
    const line = MeshBuilder.CreateBox(`line_${z}`, { width: 0.5, height: 0.01, depth: 2 }, scene);
    line.position = new Vector3(0, 0.01, z);
    const lineMat = new StandardMaterial(`lineMat_${z}`, scene);
    lineMat.diffuseColor = Color3.White();
    line.material = lineMat;
  }

  // --- Arbres ---
  const createTree = (pos: Vector3) => {
    const trunk = MeshBuilder.CreateCylinder("trunk", { diameter: 0.3, height: 2 }, scene);
    trunk.position = new Vector3(pos.x, 1, pos.z);
    const trunkMat = new StandardMaterial("trunkMat", scene);
    trunkMat.diffuseColor = new Color3(0.55, 0.27, 0.07);
    trunk.material = trunkMat;

    const leaves = MeshBuilder.CreateSphere("leaves", { diameter: 2 }, scene);
    leaves.position = new Vector3(pos.x, 3, pos.z);
    const leavesMat = new StandardMaterial("leavesMat", scene);
    leavesMat.diffuseColor = new Color3(0.1, 0.5, 0.1);
    leaves.material = leavesMat;
  };

  // --- Lampadaires ---
  const createLamp = (pos: Vector3) => {
    const pole = MeshBuilder.CreateCylinder("pole", { diameter: 0.1, height: 3 }, scene);
    pole.position = new Vector3(pos.x, 1.5, pos.z);
    const poleMat = new StandardMaterial("poleMat", scene);
    poleMat.diffuseColor = Color3.Black();
    pole.material = poleMat;

    const lamp = MeshBuilder.CreateSphere("lamp", { diameter: 0.3 }, scene);
    lamp.position = new Vector3(pos.x, 3, pos.z);
    const lampMat = new StandardMaterial("lampMat", scene);
    lampMat.emissiveColor = new Color3(1, 1, 0.6);
    lamp.material = lampMat;
  };

  // --- Bâtiments style Nice ---
  const facadeTexture =
    "https://i.imgur.com/LZ3ZWnT.jpg";
  const shutterTexture =
    "https://i.imgur.com/0OVq9wt.png";

  const createNiceBuilding = (
    scene: Scene,
    pos: Vector3,
    width: number,
    depth: number,
    height: number,
    floors: number,
    name: string
  ) => {
    const building = MeshBuilder.CreateBox(name, { width, height, depth }, scene);
    building.position = new Vector3(pos.x, height / 2, pos.z);
    const mat = new StandardMaterial(`${name}_mat`, scene);
    mat.diffuseTexture = new Texture(facadeTexture, scene);
    mat.diffuseTexture.uScale = width / 2;
    mat.diffuseTexture.vScale = height / 4;
    building.material = mat;
    collidableMeshes.push(building);

    // Volets
    const windowRows = floors;
    const windowCols = Math.floor(width);

    for (let r = 0; r < windowRows; r++) {
      for (let c = 0; c < windowCols; c++) {
        const shutter = MeshBuilder.CreatePlane(
          `${name}_shutter_${r}_${c}`,
          { size: 0.5 },
          scene
        );
        shutter.position = new Vector3(
          pos.x - width / 2 + 0.75 + c,
          1 + r * 3,
          pos.z - depth / 2 - 0.26
        );
        shutter.rotation.y = Math.PI;
        const shutterMat = new StandardMaterial(`${name}_shutterMat_${r}_${c}`, scene);
        shutterMat.diffuseTexture = new Texture(shutterTexture, scene);
        shutterMat.diffuseTexture.hasAlpha = true;
        shutter.material = shutterMat;
      }
    }

    return building;
  };

  // Ville avec bâtiments
  createNiceBuilding(scene, new Vector3(-15, 0, 10), 8, 8, 12, 4, "building1");
  createNiceBuilding(scene, new Vector3(-5, 0, 10), 6, 8, 9, 3, "building2");
  createNiceBuilding(scene, new Vector3(10, 0, 12), 10, 8, 15, 5, "building3");
  createNiceBuilding(scene, new Vector3(18, 0, 8), 7, 8, 10, 3, "building4");

  // Arbres et lampadaires bordant la ville
  for (let i = -60; i <= 60; i += 10) {
    createTree(new Vector3(-67, 0, i));
    createTree(new Vector3(67, 0, i));
    createLamp(new Vector3(-63, 0, i));
    createLamp(new Vector3(63, 0, i));
  }

  // --- Colline (relief réaliste) un peu plus loin de la ville ---
  const hillSubdivisions = 50;
  const hillSize = 80;
  const hill = MeshBuilder.CreateGround(
    "hill",
    {
      width: hillSize,
      height: hillSize,
      subdivisions: hillSubdivisions,
      updatable: false,
    },
    scene
  );

  hill.position = new Vector3(0, 0, 70);

  // Correction importante : vérifier que positions n'est PAS NULL avant de manipuler
  const hillPositions = hill.getVerticesData("positions");
  if (hillPositions) {
    for (let i = 0; i < hillPositions.length; i += 3) {
      const x = hillPositions[i];
      const z = hillPositions[i + 2];
      hillPositions[i + 1] =
        3 *
          Math.sin((x / hillSize) * Math.PI * 2) *
          Math.cos((z / hillSize) * Math.PI * 2) +
        2 * Math.sin((x / 5) * Math.PI) * Math.cos((z / 5) * Math.PI);
    }
    hill.updateVerticesData("positions", hillPositions);
  } else {
    console.warn("positions data null for hill mesh");
  }

  const hillMat = new StandardMaterial("hillMat", scene);
  hillMat.diffuseTexture = new Texture(
    "https://cdn.pixabay.com/photo/2017/03/21/23/56/grass-2161757_1280.jpg",
    scene
  );
  hillMat.diffuseTexture.uScale = 10;
  hillMat.diffuseTexture.vScale = 10;
  hill.material = hillMat;

  collidableMeshes.push(hill);

  // --- Plage (en dessous du niveau ville) ---
  const beachWidth = 140;
  const beachHeight = 80;
  const beach = MeshBuilder.CreateGround("beach", { width: beachWidth, height: beachHeight }, scene);
  beach.position = new Vector3(0, -2, -40); // plus bas en Y et devant la ville
  const beachMat = new StandardMaterial("beachMat", scene);
  beachMat.diffuseTexture = new Texture(
    "https://cdn.pixabay.com/photo/2018/01/06/18/23/sand-3065499_1280.jpg",
    scene
  );
  beachMat.diffuseTexture.uScale = 10;
  beachMat.diffuseTexture.vScale = 10;
  beach.material = beachMat;

  collidableMeshes.push(beach);

  // --- Escaliers entre ville et plage ---
  const startZ = -5; // position proche ville, devant la plage
  const stepWidth = 8;
  const stepDepth = 3;
  const stepHeight = 0.3;
  const stepsCount = 12;

  const startY = 0;

  for (let i = 0; i < stepsCount; i++) {
    const step = MeshBuilder.CreateBox(`step_${i}`, {
      width: stepWidth,
      height: stepHeight,
      depth: stepDepth,
    }, scene);

    step.position.x = 0;
    step.position.z = startZ - i * stepDepth;
    step.position.y = startY - i * stepHeight;

    const stepMat = new StandardMaterial(`stepMat_${i}`, scene);
    stepMat.diffuseColor = new Color3(0.8, 0.7, 0.5);
    step.material = stepMat;

    collidableMeshes.push(step);
  }
}

