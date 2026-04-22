import { Float, Text } from "@react-three/drei";

const items: { text: string; pos: [number, number, number]; color: string; size: number }[] = [
  { text: "E=mc²", pos: [-3.6, 1.8, -1], color: "#22d3ee", size: 0.32 },
  { text: "π", pos: [3.4, 2.0, -0.5], color: "#f0abfc", size: 0.55 },
  { text: "∫f(x)dx", pos: [-3.2, -1.9, -0.6], color: "#a78bfa", size: 0.3 },
  { text: "√", pos: [3.6, -1.6, -1], color: "#fde047", size: 0.5 },
  { text: "Σ", pos: [0, 2.6, -2], color: "#22d3ee", size: 0.45 },
  { text: "H₂O", pos: [-2.4, 0.2, 1.2], color: "#f0abfc", size: 0.26 },
  { text: "v=u+at", pos: [2.6, 0.4, 1], color: "#a78bfa", size: 0.26 },
];

export function FloatingFormulas() {
  return (
    <group>
      {items.map((it, i) => (
        <Float key={i} speed={1 + (i % 3) * 0.3} floatIntensity={1.4} rotationIntensity={0.4}>
          <Text
            position={it.pos}
            fontSize={it.size}
            color={it.color}
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.005}
            outlineColor={it.color}
            outlineOpacity={0.6}
          >
            {it.text}
          </Text>
        </Float>
      ))}
    </group>
  );
}
