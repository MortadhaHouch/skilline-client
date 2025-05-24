import { useFrame } from "@react-three/fiber";
import { useAnimations } from "@react-three/drei";
import { useGLTF } from '@react-three/drei'
export default function Model() {
  const { animations, scene } = useGLTF("../../../public/assets/3d/robot_playground.glb");
  const { actions } = useAnimations(animations, scene);
  const firstAction = actions[Object.keys(actions)[0]]; // Try the first animation
  useFrame(() => {
    if (actions) {
      if (firstAction) firstAction.play();
    }
  });
  return (
    <primitive object={scene} scale={1.5} />
  )
}
useGLTF.preload("../../../public/assets/3d/robot_playground.glb")