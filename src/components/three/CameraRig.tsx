import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";

export function CameraRig() {
  const target = useRef({ x: 0, y: 0 });
  const { camera, gl } = useThree();

  useFrame(() => {
    const el = gl.domElement;
    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      target.current.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      target.current.y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    el.onpointermove = onMove;

    camera.position.x += (target.current.x * 0.6 - camera.position.x) * 0.04;
    camera.position.y += (-target.current.y * 0.4 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
  });

  return null;
}
