import React, { useEffect, useRef, useState } from "react";
import {
  Engine,
  Scene,
  Vector3,
  FreeCamera,
  HemisphericLight,
  AbstractMesh,
  MeshBuilder,
  StandardMaterial,
  Color3,
  Sound,
  ParticleSystem,
  Texture,
} from "@babylonjs/core";
import { createMap } from "./map";

export default function GTA7() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Engine>();
  const sceneRef = useRef<Scene>();
  const cameraRef = useRef<FreeCamera>();
  const collidableMeshes = useRef<AbstractMesh[]>([]);
  const carRef = useRef<AbstractMesh | null>(null);
  const engineSoundRef = useRef<Sound | null>(null);
  const hornSoundRef = useRef<Sound | null>(null);
  const dustParticlesRef = useRef<ParticleSystem | null>(null);
  const miniMapRef = useRef<HTMLCanvasElement>(null);

  const CAMERA_HEIGHT = 2;
  const CAR_SPEED = 0.15;
  const CAR_ROT_SPEED = 0.03;

  const [inCar, setInCar] = useState(false);
  const [message, setMessage] = useState("");
  const [fadeOpacity, setFadeOpacity] = useState(0);
  const [speedDisplay, setSpeedDisplay] = useState(0);

  // Création voiture
  const createCar = (scene: Scene, pos: Vector3) => {
    const carBody = MeshBuilder.CreateBox(
      "carBody",
      { width: 2, height: 0.5, depth: 4 },
      scene
    );
    carBody.position = pos.add(new Vector3(0, 0.25, 0));
    const carMat = new StandardMaterial("carMat", scene);
    carMat.diffuseColor = new Color3(1, 0, 0);
    carBody.material = carMat;

    // Roues
    const wheelPositions = [
      new Vector3(-0.9, 0.1, 1.5),
      new Vector3(0.9, 0.1, 1.5),
      new Vector3(-0.9, 0.1, -1.5),
      new Vector3(0.9, 0.1, -1.5),
    ];

    wheelPositions.forEach((wheelPos, i) => {
      const wheel = MeshBuilder.CreateCylinder(
        `wheel${i}`,
        { diameter: 0.6, height: 0.3 },
        scene
      );
      wheel.rotation.z = Math.PI / 2;
      wheel.position = pos.add(wheelPos);
      const wheelMat = new StandardMaterial(`wheelMat${i}`, scene);
      wheelMat.diffuseColor = Color3.Black();
      wheel.material = wheelMat;
    });

    collidableMeshes.current.push(carBody);

    return { body: carBody };
  };

  // Collision simple AABB
  function isColliding(position: Vector3, mesh: AbstractMesh, padding = 0.5) {
    const bbox = mesh.getBoundingInfo().boundingBox;
    const min = bbox.minimum.add(mesh.position).subtract(
      new Vector3(padding, padding, padding)
    );
    const max = bbox.maximum.add(mesh.position).add(
      new Vector3(padding, padding, padding)
    );

    return (
      position.x >= min.x &&
      position.x <= max.x &&
      position.y >= min.y &&
      position.y <= max.y &&
      position.z >= min.z &&
      position.z <= max.z
    );
  }

  // Mise à jour mini carte
  const updateMiniMap = () => {
    if (!miniMapRef.current || !carRef.current || !sceneRef.current) return;
    const ctx = miniMapRef.current.getContext("2d");
    if (!ctx) return;

    const mapSize = 150;
    ctx.clearRect(0, 0, mapSize, mapSize);

    // Fond
    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.fillRect(0, 0, mapSize, mapSize);

    // Afficher obstacles (verts)
    collidableMeshes.current.forEach((mesh) => {
      if (mesh === carRef.current) return;
      const pos = mesh.position;
      // On mappe la position à la mini carte (zoom 0.1)
      const x = mapSize / 2 + pos.x * 0.1;
      const y = mapSize / 2 + pos.z * 0.1;
      ctx.fillStyle = "green";
      ctx.fillRect(x - 2, y - 2, 4, 4);
    });

    // Voiture (rouge)
    const carPos = carRef.current.position;
    const x = mapSize / 2 + carPos.x * 0.1;
    const y = mapSize / 2 + carPos.z * 0.1;
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fill();
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    const engine = new Engine(canvasRef.current, true);
    engineRef.current = engine;

    const scene = new Scene(engine);
    sceneRef.current = scene;

    const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
    light.intensity = 0.9;

    const camera = new FreeCamera("cam", new Vector3(0, 25, -40), scene);
    camera.attachControl(canvasRef.current, true);
    camera.speed = 0.4;
    cameraRef.current = camera;
    camera.setTarget(Vector3.Zero());

    collidableMeshes.current = [];

    createMap(scene, collidableMeshes.current, camera);

    const carMeshes = createCar(scene, new Vector3(0, 0, -10));
    carRef.current = carMeshes.body;

    engineSoundRef.current = new Sound(
      "engine",
      "/engine_loop.mp3",
      scene,
      null,
      { loop: true, volume: 0 }
    );
    engineSoundRef.current.play();

    hornSoundRef.current = new Sound(
      "horn",
      "/horn.mp3",
      scene,
      null,
      { loop: false, volume: 1 }
    );

    // Particules poussière
    const particleSystem = new ParticleSystem(
      "dust",
      1000,
      scene
    );
    particleSystem.particleTexture = new Texture(
      "https://assets.babylonjs.com/textures/flare.png",
      scene
    );
    particleSystem.emitter = new Vector3(0, 0.1, 0);
    particleSystem.minEmitBox = new Vector3(-0.5, 0, -0.5);
    particleSystem.maxEmitBox = new Vector3(0.5, 0, 0.5);
    particleSystem.color1 = new Color3(0.8, 0.7, 0.5);
    particleSystem.color2 = new Color3(0.6, 0.5, 0.3);
    particleSystem.minSize = 0.1;
    particleSystem.maxSize = 0.3;
    particleSystem.minLifeTime = 0.2;
    particleSystem.maxLifeTime = 0.5;
    particleSystem.emitRate = 300;
    particleSystem.blendMode = ParticleSystem.BLENDMODE_STANDARD;
    particleSystem.gravity = new Vector3(0, -9.81, 0);
    particleSystem.direction1 = new Vector3(-1, 1, -1);
    particleSystem.direction2 = new Vector3(1, 1, 1);
    particleSystem.minAngularSpeed = 0;
    particleSystem.maxAngularSpeed = Math.PI;
    particleSystem.minEmitPower = 0.5;
    particleSystem.maxEmitPower = 1.5;
    particleSystem.updateSpeed = 0.01;
    particleSystem.start();
    dustParticlesRef.current = particleSystem;

    const keysPressed: { [key: string]: boolean } = {};
    let fadeTarget = 0;
    let fadeSpeed = 0.05;

    let prevCarPos = carRef.current.position.clone();

    const onKeyDown = (e: KeyboardEvent) => {
      keysPressed[e.key.toLowerCase()] = true;

      if (e.key.toLowerCase() === "e" && carRef.current && cameraRef.current) {
        const dist = Vector3.Distance(
          cameraRef.current.position,
          carRef.current.position
        );
        if (dist < 3) {
          fadeTarget = 1;
          setFadeOpacity(1);
          setTimeout(() => {
            setInCar((prev) => {
              if (!prev) {
                // On entre dans la voiture
                cameraRef.current!.detachControl(canvasRef.current!);
                cameraRef.current!.position = carRef.current!.position.add(
                  new Vector3(0, 1.5, 0)
                );
                cameraRef.current!.rotation = new Vector3(0, 0, 0);
              } else {
                // On sort de la voiture
                cameraRef.current!.attachControl(canvasRef.current!, true);
                cameraRef.current!.position = carRef.current!.position.add(
                  new Vector3(0, CAMERA_HEIGHT, -6)
                );
              }
              return !prev;
            });
            fadeTarget = 0;
          }, 300);
          setTimeout(() => setFadeOpacity(0), 600);
        }
      }

      if (e.key.toLowerCase() === "h" && hornSoundRef.current) {
        hornSoundRef.current.play();
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      keysPressed[e.key.toLowerCase()] = false;
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    engine.runRenderLoop(() => {
      if (!cameraRef.current || !carRef.current) return;
      const camera = cameraRef.current;

      // Fade animation
      setFadeOpacity((current) => {
        if (current < fadeTarget) {
          return Math.min(current + fadeSpeed, fadeTarget);
        } else if (current > fadeTarget) {
          return Math.max(current - fadeSpeed, fadeTarget);
        }
        return current;
      });

      if (!inCar) {
        // Caméra libre
        const forwardVector = camera.getDirection(new Vector3(0, 0, 1));
        const rightVector = camera.getDirection(new Vector3(1, 0, 0));
        let moveVector = new Vector3(0, 0, 0);

        if (keysPressed["w"]) moveVector = moveVector.add(forwardVector);
        if (keysPressed["s"]) moveVector = moveVector.subtract(forwardVector);
        if (keysPressed["a"]) moveVector = moveVector.subtract(rightVector);
        if (keysPressed["d"]) moveVector = moveVector.add(rightVector);

        if (moveVector.length() > 0) {
          moveVector = moveVector.normalize().scale(0.3);
          const newPos = camera.position.add(moveVector);
          newPos.y = CAMERA_HEIGHT;

          const collision = collidableMeshes.current.some((mesh) =>
            isColliding(newPos, mesh)
          );
          if (!collision) {
            camera.position = newPos;
          }
        }
      } else {
        // Rotation voiture
        if (keysPressed["a"]) {
          carRef.current.rotation.y -= CAR_ROT_SPEED;
        }
        if (keysPressed["d"]) {
          carRef.current.rotation.y += CAR_ROT_SPEED;
        }

        // Calcul forward correct
        const forward = new Vector3(
          Math.sin(carRef.current.rotation.y),
          0,
          Math.cos(carRef.current.rotation.y)
        );

        let speed = 0;
        if (keysPressed["w"]) speed = CAR_SPEED;
        else if (keysPressed["s"]) speed = -CAR_SPEED;

        if (speed !== 0) {
          const newPos = carRef.current.position.add(forward.scale(speed));
          const collision = collidableMeshes.current.some((mesh) => {
            if (mesh === carRef.current) return false;
            return isColliding(newPos, mesh);
          });
          if (!collision) {
            carRef.current.position = newPos;
          }
        }

        // Caméra suit voiture (position et cible)
        camera.position = carRef.current.position.add(
          new Vector3(
            -Math.sin(carRef.current.rotation.y) * 6,
            CAMERA_HEIGHT,
            -Math.cos(carRef.current.rotation.y) * 6
          )
        );
        camera.setTarget(carRef.current.position);

        // Vitesse affichée en km/h simulée (v = distance/frame * facteur)
        const dist = Vector3.Distance(carRef.current.position, prevCarPos);
        const kmh = Math.round(dist * 1000 * 60 * 60 * 60); // approximé, ajuste si besoin
        setSpeedDisplay(kmh);
        prevCarPos = carRef.current.position.clone();

        // Son moteur volume selon vitesse
        if (engineSoundRef.current) {
          engineSoundRef.current.setVolume(Math.min(kmh / 200, 1));
        }

        // Particules poussière si vitesse > 0.01
        if (dustParticlesRef.current) {
          if (speed !== 0) {
            dustParticlesRef.current.emitter = carRef.current.position.add(
              new Vector3(0, 0.1, 0)
            );
            if (!dustParticlesRef.current.isStarted()) {
              dustParticlesRef.current.start();
            }
          } else {
            dustParticlesRef.current.stop();
          }
        }
      }

      updateMiniMap();

      scene.render();
    });

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      engine.dispose();
      engineSoundRef.current?.dispose();
      hornSoundRef.current?.dispose();
      dustParticlesRef.current?.dispose();
    };
  }, [inCar]);

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{ width: "100vw", height: "100vh", display: "block" }}
      />
      <canvas
        ref={miniMapRef}
        width={150}
        height={150}
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          border: "2px solid white",
          borderRadius: 8,
          backgroundColor: "rgba(0,0,0,0.7)",
          zIndex: 10,
        }}
      />
      {/* HUD vitesse */}
      <div
        style={{
          position: "absolute",
          bottom: 20,
          left: 20,
          color: "white",
          fontSize: 20,
          fontWeight: "bold",
          textShadow: "1px 1px 3px black",
          zIndex: 10,
        }}
      >
        Speed: {speedDisplay} km/h
      </div>
      {/* Fade écran */}
      <div
        style={{
          position: "absolute",
          pointerEvents: "none",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "black",
          opacity: fadeOpacity,
          transition: "opacity 0.3s ease",
          zIndex: 20,
        }}
      />
      {/* Message / Instructions */}
      <div
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          color: "white",
          fontSize: 16,
          fontWeight: "bold",
          textShadow: "1px 1px 3px black",
          zIndex: 10,
        }}
      >
        Press E near car to enter/exit. H for horn.
      </div>
    </>
  );
}
