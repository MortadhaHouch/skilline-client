import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useGLTF } from '@react-three/drei'
import { Suspense } from "react";
export default function Model() {
  return (
    <Canvas 
        style={{
            width:"400px",
            height:"400px",
            borderRadius:"10px",
            backgroundColor: "rgba(255, 255, 255, 0.03)",
            boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
        }}
        frameloop="always"
        shadows>
        <Suspense fallback={"loading"}>
            <primitive object={useGLTF("https://vazxmixjsiawhamtffed.supabase.co/storage/v1/object/public/models/scene.gltf")}/>
        </Suspense>
        <ambientLight intensity={0.5} />
        <directionalLight position={[0, 10, 5]} intensity={1} />
        <OrbitControls enableZoom={false} enableDamping={true}/>
    </Canvas>
  )
}
