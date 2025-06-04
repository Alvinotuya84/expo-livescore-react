import { RefreshControlProps, ScrollView, StyleProp, ViewProps, ViewStyle } from 'react-native';

interface VStackProps extends ViewProps {
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
  refreshControl?: React.ReactElement<RefreshControlProps>;
}

export function VStack({ style, children, refreshControl, ...props }: VStackProps) {
  return (
    <ScrollView
      style={[{ flex: 1 }, style]}
      contentContainerStyle={{ padding: 16 }}
      refreshControl={refreshControl}
      {...props}
    >
      {children}
    </ScrollView>
  );
} 