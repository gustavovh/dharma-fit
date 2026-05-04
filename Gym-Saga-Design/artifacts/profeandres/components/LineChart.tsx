import React from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Path, Circle } from "react-native-svg";
import { useColors } from "@/hooks/useColors";

interface LineChartProps {
  data: { x: number; y: number }[];
  width: number;
  height: number;
  color?: string;
}

export function LineChart({ data, width, height, color }: LineChartProps) {
  const colors = useColors();
  if (!data || data.length === 0) return <View style={{ width, height, backgroundColor: colors.secondary, borderRadius: colors.radius }} />;

  const strokeColor = color || colors.primary;
  
  const minX = Math.min(...data.map(d => d.x));
  const maxX = Math.max(...data.map(d => d.x));
  const minY = Math.min(...data.map(d => d.y));
  const maxY = Math.max(...data.map(d => d.y));
  
  const rangeX = maxX - minX || 1;
  const rangeY = maxY - minY || 1;
  
  const padding = 10;
  const innerWidth = width - padding * 2;
  const innerHeight = height - padding * 2;

  const points = data.map(d => ({
    x: padding + ((d.x - minX) / rangeX) * innerWidth,
    y: padding + innerHeight - ((d.y - minY) / rangeY) * innerHeight,
  }));

  const path = `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(" ");

  return (
    <View style={{ width, height }}>
      <Svg width={width} height={height}>
        <Path d={path} fill="none" stroke={strokeColor} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
        {points.map((p, i) => (
          <Circle key={i} cx={p.x} cy={p.y} r={4} fill={colors.background} stroke={strokeColor} strokeWidth={2} />
        ))}
      </Svg>
    </View>
  );
}
