import { LinearGradient as ExpoLinearGradient } from 'expo-linear-gradient';
import { ColorValue, StyleProp, ViewStyle } from 'react-native';

interface LinearGradientProps {
  colors: [ColorValue, ColorValue, ...ColorValue[]];
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

export function LinearGradient({ colors, style, children }: LinearGradientProps) {
  return (
    <ExpoLinearGradient
      colors={colors}
      style={style}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    >
      {children}
    </ExpoLinearGradient>
  );
} 