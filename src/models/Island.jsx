/* eslint-disable react/no-unknown-property */
import { useRef,useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import { useThree,useFrame } from "@react-three/fiber";

import islandScene from '../assets/3d/island.glb'
import { a } from '@react-spring/three'
import { useState } from "react";

const Island = ({isRotating,setIsRotating,setCurrentStage,...props}) => {

  const islandRef = useRef();

  const {gl,viewport } = useThree();
  const { nodes, materials } = useGLTF(islandScene);

  const lastX = useRef(0);
  const rotationSpeed = useRef(0);
  const dampingFactor = 0.95;


  const handlePointerDown = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsRotating(true);

    const clientX = e.touches ? e.touches[0].clientX : e.clientX ;//checking if it is touch screen or normal screen
    lastX.current = clientX;

  }
  const handlePointerUp = (e) => {
    e.stopPropagation();
    e.preventDefault();

    setIsRotating(false);
  }

  const handlePointerMove = (e) => {
    e.stopPropagation();
    e.preventDefault();

    if(isRotating) {
      const clientX = e.touches? e.touches[0].clientX : e.clientX ;//checking if it is touch screen or normal screen
      const delta = (clientX - lastX.current)/viewport.width; //kitna move kiya

      islandRef.current.rotation.y += delta * 0.01 * Math.PI
      lastX.current = clientX;//update the last X
      rotationSpeed.current = delta * 0.01 * Math.PI
    }
  }

  const handleKeyDown = (e) => {
    if(e.key === 'ArrowLeft')
    {
      if(!isRotating) setIsRotating(true);
      islandRef.current.rotation.y += 0.01 * Math.PI
    }else if(e.key === 'ArrowRight'){
      if(!isRotating) setIsRotating(true);
      islandRef.current.rotation.y -= 0.01 * Math.PI
    }

  }

  const handlekeyUp = (e) => {
    if(e.key === 'ArrowLeft' || e.key === 'ArrowRight'){
      setIsRotating(false);
    }
  }

  useFrame(() => {
    if(!isRotating){
      rotationSpeed.current *= dampingFactor

      if(Math.abs(rotationSpeed.current) < 0.001) {
        rotationSpeed.current = 0;
      }
      islandRef.current.rotation.y += rotationSpeed.current
    }else {
      const rotation = islandRef.current.rotation.y;

      /**
      * 
      Here's a breakdown:

      rotation % (2 * Math.PI): This part calculates the remainder when rotation is divided by 2 * Math.PI. This ensures that rotation is within the range of 0 to 2 * Math.PI.

      + 2 * Math.PI: This is added to the result from the previous step. This step is necessary to handle negative values of rotation and make sure that the result is always positive.

      % (2 * Math.PI): This part ensures that the final result is again within the range of 0 to 2 * Math.PI. This step is useful if the addition in the previous step caused the value to go beyond this range.

       */
      const normalizedRotation =((rotation % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);

      // Set the current stage based on the island's orientation
      switch (true) {
        case normalizedRotation >= 5.45 && normalizedRotation <= 5.85:
          setCurrentStage(4);
          break;
        case normalizedRotation >= 0.85 && normalizedRotation <= 1.3:
          setCurrentStage(3);
          break;
        case normalizedRotation >= 2.4 && normalizedRotation <= 2.6:
          setCurrentStage(2);
          break;
        case normalizedRotation >= 4.25 && normalizedRotation <= 4.75:
          setCurrentStage(1);
          break;
        default:
          setCurrentStage(null);
      }
    }
  })

  useEffect(() => {
    const canvas = gl.domElement; //we are adding the event listner to the canvas not the dom 
    canvas.addEventListener('pointerdown',handlePointerDown);
    canvas.addEventListener('pointerup',handlePointerUp);
    canvas.addEventListener('pointermove',handlePointerMove);
    document.addEventListener('keydown',handleKeyDown);
    document.addEventListener('keyup',handlekeyUp);

    return () => {
      canvas.removeEventListener('pointerdown',handlePointerDown);
      canvas.removeEventListener('pointerup',handlePointerUp);
      canvas.removeEventListener('pointermove',handlePointerMove);
      document.removeEventListener('keydown',handleKeyDown);
      document.removeEventListener('keyup',handlekeyUp);
    }

  },[gl,handlePointerUp,handlePointerDown,handlePointerMove])

  return (
    <a.group ref={islandRef} {...props}>
      <mesh
        geometry={nodes.polySurface944_tree_body_0.geometry}
        material={materials.PaletteMaterial001}
      />
      <mesh
        geometry={nodes.polySurface945_tree1_0.geometry}
        material={materials.PaletteMaterial001}
      />
      <mesh
        geometry={nodes.polySurface946_tree2_0.geometry}
        material={materials.PaletteMaterial001}
      />
      <mesh
        geometry={nodes.polySurface947_tree1_0.geometry}
        material={materials.PaletteMaterial001}
      />
      <mesh
        geometry={nodes.polySurface948_tree_body_0.geometry}
        material={materials.PaletteMaterial001}
      />
      <mesh
        geometry={nodes.polySurface949_tree_body_0.geometry}
        material={materials.PaletteMaterial001}
      />
      <mesh
        geometry={nodes.pCube11_rocks1_0.geometry}
        material={materials.PaletteMaterial001}
      />
    </a.group>
  );
}

export default Island;
