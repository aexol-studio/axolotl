import { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

import { PrimaryButton } from '../primitives/PrimaryButton';
import { useAppTheme } from '../../theme';

type FormCtaVariant = 'top' | 'sticky';

type FormScaffoldProps = PropsWithChildren<{
  testID: string;
  ctaVariant: FormCtaVariant;
  ctaLabel: string;
  ctaTestID: string;
  onCtaPress: () => void;
  ctaDisabled?: boolean;
}>;

export function FormScaffold({
  children,
  testID,
  ctaVariant,
  ctaLabel,
  ctaTestID,
  onCtaPress,
  ctaDisabled,
}: FormScaffoldProps) {
  const { colors, spacing, shape } = useAppTheme();

  return (
    <KeyboardAwareScrollView
      testID={testID}
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      bottomOffset={spacing.md}
      keyboardShouldPersistTaps="handled"
    >
      <View style={[styles.content, { gap: spacing.md }]}>
        {ctaVariant === 'top' ? (
          <PrimaryButton testID={ctaTestID} label={ctaLabel} onPress={onCtaPress} disabled={ctaDisabled} />
        ) : null}

        <View
          style={[
            styles.fields,
            {
              gap: spacing.md,
              borderRadius: shape.radiusXl,
              borderColor: colors.border,
              backgroundColor: colors.surface,
              padding: spacing.md,
            },
          ]}
        >
          {children}
        </View>
      </View>

      {ctaVariant === 'sticky' ? (
        <View
          testID={`${testID}-sticky-footer`}
          style={[
            styles.stickyFooter,
            {
              paddingTop: spacing.sm,
              marginTop: spacing.sm,
            },
          ]}
        >
          <PrimaryButton testID={ctaTestID} label={ctaLabel} onPress={onCtaPress} disabled={ctaDisabled} />
        </View>
      ) : null}
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
  },
  fields: {
    flex: 1,
  },
  stickyFooter: {
    width: '100%',
  },
});
