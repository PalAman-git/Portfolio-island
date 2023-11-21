import Sky from "../models/Sky";
import { Canvas } from "@react-three/fiber";
import { Suspense,useState,useEffect,useRef } from "react";
import Loader from "../components/Loader";
import Island from "../models/Island";
import Bird from "../models/Bird";
import Plane from "../models/Plane";
import HomeInfo from "../components/HomeInfo";

import sakura from '../assets/sakura.mp3'
import { soundoff,soundon } from "../assets/icons";

const Home = () => {
  const audioRef = useRef(new Audio(sakura));
  audioRef.current.volume = 0.3;
  audioRef.current.loop = true

  const adjustIslandForScreenSize = () => {
    let screenScale = null;
    let screenPosition = [0, -6.5, -43];
    let rotation = [0.1, 4.7, 0];

    if (window.innerWidth < 768) {
      screenScale = [0.9, 0.9, 0.9];
    } else {
      screenScale = [1, 1, 1];
    }

    return [screenPosition, screenScale, rotation];
  };

  const adjustPlandForScreenSize = () => {
    let screenScale,
      screenPosition = null;

    if (window.innerWidth < 768) {
      screenScale = [1.5, 1.5, 1.5];
      screenPosition = [0, -1.5, 0];
    } else {
      screenScale = [3, 3, 3];
      screenPosition = [0, -4, -4];
    }

    return [screenPosition, screenScale];
  };

  const [currentStage, setCurrentStage] = useState(1);
  const [planePosition, planeScale] = adjustPlandForScreenSize();
  const [islandPosition, islandScale, islandRotation] =adjustIslandForScreenSize();
  const [isRotating, setIsRotating] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);

  
  const toggle = () => {
    if(isPlayingMusic)
    {
      setIsPlayingMusic(false);
    }else{
      setIsPlayingMusic(true);
    }
  }


  useEffect(() => {
    if(isPlayingMusic) audioRef.current.play();
     
    return () => {
      audioRef.current.pause();
    }

  },[isPlayingMusic])

  return (
    <section className="w-full h-screen">
      <div className="absolute top-28 left-0 right-0 z-10 flex justify-center items-center">
        {currentStage && <HomeInfo currentStage={currentStage} />}
      </div>

      <Canvas
        className={`w-full h-screen bg-transparent ${
          isRotating ? "cursor-grabbing" : "cursor-grab"
        }`}
        camera={{ near: 0.1, far: 1000 }}
      >
        <Suspense fallback={<Loader />}>
          <directionalLight position={[1, 1, 1]} intensity={2} />
          <ambientLight intensity={0.5} />
          <hemisphereLight skyColor="#b1e1ff" groundColor="#000000" />

          <Bird />
          <Sky isRotating={isRotating} />
          <Island
            position={islandPosition}
            scale={islandScale}
            rotation={islandRotation}
            isRotating={isRotating}
            setIsRotating={setIsRotating}
            setCurrentStage={setCurrentStage}
          />
          <Plane
            isRotating={isRotating}
            position={planePosition}
            scale={planeScale}
            rotation={[0, 20, 0]}
          />
        </Suspense>
      </Canvas>
      <div className="absolute bottom-2 left-2">
        <img src={isPlayingMusic ? soundon : soundoff} className="h-10 w-10 cursor-pointer" onClick={toggle}/>
      </div>
    </section>
  );
};
export default Home;
