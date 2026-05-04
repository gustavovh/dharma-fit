import React from "react";
import { View, Text, StyleSheet, Pressable, ViewStyle, TextStyle } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { useColors } from "@/hooks/useColors";
import * as Haptics from "expo-haptics";

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: "primary" | "secondary" | "ghost";
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
}

export function Button({ onPress, title, variant = "primary", style, textStyle, disabled }: ButtonProps) {
  const colors = useColors();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withTiming(0.95, { duration: 100 });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 100 });
  };

  const handlePress = () => {
    if (disabled) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const getBackgroundColor = () => {
    if (variant === "primary") return colors.primary;
    if (variant === "secondary") return colors.secondary;
    return "transparent";
  };

  const getTextColor = () => {
    if (variant === "primary") return colors.primaryForeground;
    if (variant === "secondary") return colors.secondaryForeground;
    return colors.primary;
  };

  return (
    <Animated.View style={[animatedStyle, style]}>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        disabled={disabled}
        style={[
          styles.button,
          { backgroundColor: getBackgroundColor(), borderRadius: colors.radius },
          disabled && styles.disabled
        ]}
      >
        <Text style={[styles.text, { color: getTextColor() }, textStyle]}>{title}</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
  },
  disabled: {
    opacity: 0.5,
  }
});
