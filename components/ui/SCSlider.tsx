import color from "@constants/color";
import React, { useEffect } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");

// Kích thước cố định cho Slider
const SLIDER_HEIGHT = 40;
const TRACK_HEIGHT = 6;
const THUMB_SIZE = 24;
const PADDING_HORIZONTAL = 20;

// Tính toán chiều rộng track có thể kéo được
const TRACK_WIDTH = width - PADDING_HORIZONTAL * 2;
const MAX_TRANSLATE_X = TRACK_WIDTH - THUMB_SIZE;

interface SCSliderProps {
  value: number;
  onValueChange: (value: number) => void;
  minimumValue: number;
  maximumValue: number;
  step: number;
  style?: any;
}

export const SCSlider: React.FC<SCSliderProps> = ({
  value,
  onValueChange,
  minimumValue,
  maximumValue,
  step,
  style,
}) => {
  const range = maximumValue - minimumValue;
  
  // Tính toán vị trí X ban đầu
  const getInitialX = (val: number) => {
    const clampedValue = Math.min(maximumValue, Math.max(minimumValue, val));
    return ((clampedValue - minimumValue) / range) * MAX_TRANSLATE_X;
  };

  const translateX = useSharedValue(getInitialX(value));
  const context = useSharedValue({ startX: 0 });

  // Cập nhật vị trí khi prop 'value' thay đổi từ bên ngoài
  useEffect(() => {
    translateX.value = withSpring(getInitialX(value));
  }, [value, minimumValue, maximumValue]);

  // Sử dụng Gesture API mới
  const panGesture = Gesture.Pan()
    .onBegin(() => {
      context.value = { startX: translateX.value };
    })
    .onUpdate((event) => {
      // Tính toán vị trí mới dựa trên vị trí ban đầu + khoảng cách kéo
      let nextTranslateX = context.value.startX + event.translationX;

      // Giới hạn trong khoảng [0, MAX_TRANSLATE_X]
      nextTranslateX = Math.max(0, Math.min(MAX_TRANSLATE_X, nextTranslateX));
      translateX.value = nextTranslateX;

      // Tính toán giá trị mới
      const ratio = nextTranslateX / MAX_TRANSLATE_X;
      const rawValue = minimumValue + ratio * range;
      
      // Làm tròn theo 'step'
      const steppedValue = Math.round(rawValue / step) * step;

      // Chạy hàm callback
      runOnJS(onValueChange)(steppedValue);
    });

  const animatedThumbStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const animatedTrackStyle = useAnimatedStyle(() => {
    return {
      width: translateX.value + THUMB_SIZE / 2,
    };
  });

  return (
    <View style={[style, sliderStyles.container]}>
      <View style={sliderStyles.track}>
        {/* Track Fill */}
        <Animated.View style={[sliderStyles.trackFill, animatedTrackStyle]} />

        {/* Thumb */}
        <GestureDetector gesture={panGesture}>
          <Animated.View
            style={[sliderStyles.thumbContainer, animatedThumbStyle]}
          >
            <View style={sliderStyles.thumb} />
          </Animated.View>
        </GestureDetector>
      </View>
    </View>
  );
};

const sliderStyles = StyleSheet.create({
  container: {
    width: "100%",
    height: SLIDER_HEIGHT,
    justifyContent: "center",
    paddingHorizontal: PADDING_HORIZONTAL, 
  },
  track: {
    height: TRACK_HEIGHT,
    backgroundColor: color.light_gray,
    borderRadius: TRACK_HEIGHT / 2,
    position: "relative",
    width: TRACK_WIDTH,
  },
  trackFill: {
    position: "absolute",
    height: TRACK_HEIGHT,
    backgroundColor: color.dark_green,
    borderRadius: TRACK_HEIGHT / 2,
  },
  thumbContainer: {
    position: "absolute",
    top: -(THUMB_SIZE - TRACK_HEIGHT) / 2,
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: color.dark_green,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
});