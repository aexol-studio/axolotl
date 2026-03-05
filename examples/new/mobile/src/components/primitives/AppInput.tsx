import { TextInput, type TextInputProps } from 'react-native';

import { useAppTheme } from '../../theme';

type AppInputProps = TextInputProps & {
  testID: string;
};

export function AppInput({ style, testID, ...restProps }: AppInputProps) {
  const { colors, shape, spacing, textStyles } = useAppTheme();

  return (
    <TextInput
      testID={testID}
      style={[
        {
          minHeight: shape.inputHeight,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: shape.radiusSm,
          paddingHorizontal: spacing.md,
          color: colors.text,
          backgroundColor: colors.surface,
        },
        textStyles.body,
        style,
      ]}
      {...restProps}
    />
  );
}
