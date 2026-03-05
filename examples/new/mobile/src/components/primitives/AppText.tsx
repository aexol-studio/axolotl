import { PropsWithChildren } from 'react';
import { Text, type TextStyle } from 'react-native';

import { useAppTheme } from '../../theme';

type AppTextVariant = 'h1' | 'h2' | 'h3' | 'body' | 'button';

type AppTextProps = PropsWithChildren<{
  variant?: AppTextVariant;
  style?: TextStyle;
  testID?: string;
}>;

export function AppText({ children, style, testID, variant = 'body' }: AppTextProps) {
  const { textStyles } = useAppTheme();
  return (
    <Text testID={testID} style={[textStyles[variant], style]}>
      {children}
    </Text>
  );
}
