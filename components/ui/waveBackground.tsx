import color from "../../constants/color";
import React from "react";
import { View, Dimensions } from "react-native";
import Svg, { Path, G } from "react-native-svg";

export default function Wave() {
  const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

  const amplitude = screenHeight * 0.05;   // 5% chiều cao màn hình
  const layers = 3;
  const baseHeight = screenHeight * 0.15;  // 15% chiều cao màn hình
  const baseWidth = screenWidth;           // full chiều rộng màn hình
  const step = baseHeight / 2;

  const makeWavePath = (yShift: number) => {
    const A = { x: 0, y: yShift };
    const B = { x: baseWidth / 2, y: yShift };
    const C = { x: baseWidth, y: yShift };

    const A2 = { x: 0, y: A.y + step };
    const B2 = { x: baseWidth / 2, y: B.y + step };
    const C2 = { x: baseWidth, y: C.y + step };

    return `
      M ${A.x} ${A.y}
      Q ${baseWidth / 4} ${A.y - amplitude}, ${B.x} ${B.y}
      Q ${baseWidth * 3 / 4} ${B.y + amplitude}, ${C.x} ${C.y}
      L ${C2.x} ${C2.y}
      Q ${baseWidth * 3 / 4} ${B2.y + amplitude}, ${B2.x} ${B2.y}
      Q ${baseWidth / 4} ${A2.y - amplitude}, ${A2.x} ${A2.y}
      Z
    `;
  };

  const colors = [color.light_green, color.lime, color.dark_green];

  const totalHeight = layers * step;
  const viewportHeight = baseHeight * 2; // hoặc tuỳ chỉnh cho đẹp
  const centerOffsetY = (viewportHeight - totalHeight) / 2;

  return (
    <View style={{ width: "100%", height: viewportHeight }}>
      <Svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${baseWidth} ${viewportHeight}`}
        preserveAspectRatio="none"
      >
        <G transform={`translate(0, ${centerOffsetY})`}>
          {Array.from({ length: layers }).map((_, i) => (
            <Path key={i} d={makeWavePath(i * step)} fill={colors[i]} />
          ))}
        </G>
      </Svg>
    </View>
  );
}
