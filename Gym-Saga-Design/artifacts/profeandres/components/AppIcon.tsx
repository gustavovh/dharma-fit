import React, { useEffect } from "react";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

import { useColors } from "@/hooks/useColors";

export type AppIconName = React.ComponentProps<typeof Ionicons>["name"];

interface AppIconProps {
  name: AppIconName;
  size?: number;
  color?: string;
  active?: boolean;
  glow?: boolean;
  highlight?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function AppIcon({
  name,
  size = 20,
  color,
  active = false,
  glow = false,
  highlight = false,
  style,
}: AppIconProps) {
  const colors = useColors();
  const scale = useSharedValue(active ? 1.08 : 1);

  useEffect(() => {
    scale.value = withTiming(active ? 1.08 : 1, { duration: 180 });
  }, [active]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const iconColor = color ?? (active ? colors.primary : colors.mutedForeground);
  const containerSize = size + 20;

  return (
    <Animated.View
      style={[
        styles.container,
        animatedStyle,
        {
          width: containerSize,
          height: containerSize,
          borderRadius: containerSize / 2,
          backgroundColor: highlight && active ? colors.secondary : "transparent",
          shadowColor: glow && active ? colors.primary : "transparent",
          shadowOpacity: glow && active ? 0.34 : 0,
          shadowRadius: glow && active ? 18 : 0,
          shadowOffset: { width: 0, height: 8 },
        },
        style,
      ]}
    >
      <Ionicons name={name} size={size} color={iconColor} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
});