import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { FormScaffold } from '../../components/forms';
import { AppInput } from '../../components/primitives/AppInput';
import { AppScreen } from '../../components/primitives/AppScreen';
import { AppText } from '../../components/primitives/AppText';
import { AppTypedError, normalizeError } from '../../lib/errors/normalizeError';
import { useToast } from '../../providers/ToastProvider';
import { useAppTheme } from '../../theme';

const isValidEmail = (value: string) => /\S+@\S+\.\S+/.test(value);

export function SignInScreen() {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const { colors, shape, spacing } = useAppTheme();
  const [email, setEmail] = useState('');
  const [ctaVariant, setCtaVariant] = useState<'top' | 'sticky'>('sticky');

  const handleSubmit = () => {
    try {
      if (!isValidEmail(email.trim())) {
        throw new AppTypedError('VALIDATION_ERROR', 'common.auth.invalidEmail');
      }

      showToast({
        title: t('common.auth.success'),
        variant: 'success',
      });
    } catch (error) {
      const normalized = normalizeError(error);
      showToast({
        title: t('common.toast.errorTitle'),
        message: t(normalized.message),
        variant: 'error',
      });
    }
  };

  return (
    <AppScreen>
      <View style={[styles.content, { gap: spacing.md }]}>
        <View
          style={[
            styles.hero,
            {
              borderRadius: shape.radiusXl,
              backgroundColor: colors.pastelLavender,
              borderColor: colors.border,
              padding: spacing.md,
              gap: spacing.xs,
            },
          ]}
        >
          <AppText variant="h2">{t('common.auth.signInTitle')}</AppText>
          <AppText variant="body">{t('common.auth.signInSubtitle')}</AppText>
        </View>

        <View style={[styles.variantControls, { gap: spacing.sm }]}>
          <Pressable
            testID="auth-cta-top-btn"
            accessibilityRole="button"
            onPress={() => setCtaVariant('top')}
            style={[
              styles.variantButton,
              {
                borderColor: colors.border,
                backgroundColor: ctaVariant === 'top' ? colors.pastelMint : colors.surface,
                borderRadius: shape.radiusLg,
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.sm,
              },
            ]}
          >
            <AppText variant="body">{t('common.auth.ctaTop', { selected: ctaVariant === 'top' ? '✓' : '' })}</AppText>
          </Pressable>
          <Pressable
            testID="auth-cta-sticky-btn"
            accessibilityRole="button"
            onPress={() => setCtaVariant('sticky')}
            style={[
              styles.variantButton,
              {
                borderColor: colors.border,
                backgroundColor: ctaVariant === 'sticky' ? colors.pastelMint : colors.surface,
                borderRadius: shape.radiusLg,
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.sm,
              },
            ]}
          >
            <AppText variant="body">
              {t('common.auth.ctaSticky', { selected: ctaVariant === 'sticky' ? '✓' : '' })}
            </AppText>
          </Pressable>
        </View>

        <FormScaffold
          testID="auth-form-scaffold"
          ctaVariant={ctaVariant}
          ctaLabel={t('common.auth.continue')}
          ctaTestID="auth-submit-btn"
          onCtaPress={handleSubmit}
          ctaDisabled={!email.trim()}
        >
          <AppInput
            testID="auth-email-input"
            style={styles.input}
            placeholder={t('common.auth.emailPlaceholder')}
            value={email}
            autoCapitalize="none"
            keyboardType="email-address"
            onChangeText={setEmail}
          />
        </FormScaffold>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    width: '100%',
  },
  variantControls: {
    width: '100%',
  },
  hero: {
    width: '100%',
    borderWidth: 1,
  },
  variantButton: {
    borderWidth: 1,
  },
  input: {},
});
