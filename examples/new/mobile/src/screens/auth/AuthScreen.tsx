import { useEffect, useState } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { router } from 'expo-router'
import { useTranslation } from 'react-i18next'

import { FormScaffold } from '../../components/forms/FormScaffold'
import { AppInput } from '../../components/primitives/AppInput'
import { AppScreen } from '../../components/primitives/AppScreen'
import { AppText } from '../../components/primitives/AppText'
import { AppTypedError, normalizeError } from '../../lib/errors/normalizeError'
import { useToast } from '../../providers/ToastProvider'
import { useAppTheme } from '../../theme'
import { useAuthSession } from '../../features/auth/useAuthSession'
import { useAuthStore } from '../../stores/authStore'

type AuthMode = 'sign-in' | 'sign-up'

type AuthScreenProps = {
  mode: AuthMode
}

const isValidEmail = (value: string) => /\S+@\S+\.\S+/.test(value)

export const AuthScreen = ({ mode }: AuthScreenProps) => {
  const isSignIn = mode === 'sign-in'
  const { t } = useTranslation()
  const { showToast } = useToast()
  const { colors, shape, spacing } = useAppTheme()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [ctaVariant, setCtaVariant] = useState<'top' | 'sticky'>('sticky')
  const { loginMutation, registerMutation } = useAuthSession()
  const logoutReason = useAuthStore((state) => state.logoutReason)
  const setLogoutReason = useAuthStore((state) => state.setLogoutReason)

  const isSubmitting = loginMutation.isPending || registerMutation.isPending

  useEffect(() => {
    if (logoutReason !== 'invalidated') {
      return
    }

    showToast({
      title: t('common.toast.errorTitle'),
      message: t('common.auth.sessionExpired'),
      variant: 'error',
    })
    setLogoutReason(null)
  }, [logoutReason, setLogoutReason, showToast, t])

  const handleSubmit = () => {
    const execute = async () => {
      const normalizedEmail = email.trim()
      if (!isValidEmail(normalizedEmail)) {
        throw new AppTypedError('VALIDATION_ERROR', 'common.auth.invalidEmail')
      }

      if (password.trim().length < 6) {
        throw new AppTypedError(
          'VALIDATION_ERROR',
          'common.auth.invalidPasswordLength',
        )
      }

      if (isSignIn) {
        await loginMutation.mutateAsync({
          email: normalizedEmail,
          password,
        })
      } else {
        await registerMutation.mutateAsync({
          email: normalizedEmail,
          password,
        })
      }

      showToast({
        title: t(
          isSignIn
            ? 'common.auth.signInSuccess'
            : 'common.auth.registerSuccess',
        ),
        variant: 'success',
      })

      router.replace('./(tabs)')
    }

    void execute().catch((caughtError) => {
      const normalized = normalizeError(caughtError)
      showToast({
        title: t('common.toast.errorTitle'),
        message: t(normalized.message),
        variant: 'error',
      })
    })
  }

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
          <AppText variant="h2">
            {t(
              isSignIn ? 'common.auth.signInTitle' : 'common.auth.signUpTitle',
            )}
          </AppText>
          <AppText variant="body">
            {t(
              isSignIn
                ? 'common.auth.signInSubtitle'
                : 'common.auth.signUpSubtitle',
            )}
          </AppText>
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
                backgroundColor:
                  ctaVariant === 'top' ? colors.pastelMint : colors.surface,
                borderRadius: shape.radiusLg,
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.sm,
              },
            ]}
          >
            <AppText variant="body">
              {t('common.auth.ctaTop', {
                selected: ctaVariant === 'top' ? '✓' : '',
              })}
            </AppText>
          </Pressable>
          <Pressable
            testID="auth-cta-sticky-btn"
            accessibilityRole="button"
            onPress={() => setCtaVariant('sticky')}
            style={[
              styles.variantButton,
              {
                borderColor: colors.border,
                backgroundColor:
                  ctaVariant === 'sticky' ? colors.pastelMint : colors.surface,
                borderRadius: shape.radiusLg,
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.sm,
              },
            ]}
          >
            <AppText variant="body">
              {t('common.auth.ctaSticky', {
                selected: ctaVariant === 'sticky' ? '✓' : '',
              })}
            </AppText>
          </Pressable>
        </View>

        <FormScaffold
          testID="auth-form-scaffold"
          ctaVariant={ctaVariant}
          ctaLabel={t(
            isSignIn ? 'common.auth.signInAction' : 'common.auth.signUpAction',
          )}
          ctaTestID="auth-submit-btn"
          onCtaPress={handleSubmit}
          ctaDisabled={
            !email.trim() || password.trim().length < 6 || isSubmitting
          }
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

          <AppInput
            testID="auth-password-input"
            style={styles.input}
            placeholder={t('common.auth.passwordPlaceholder')}
            value={password}
            secureTextEntry
            autoCapitalize="none"
            onChangeText={setPassword}
          />
        </FormScaffold>

        <Pressable
          testID={isSignIn ? 'auth-go-sign-up-btn' : 'auth-go-sign-in-btn'}
          accessibilityRole="button"
          onPress={() => {
            router.replace(isSignIn ? './(auth)/sign-up' : './(auth)/sign-in')
          }}
          style={styles.switchModeButton}
        >
          <AppText variant="body" style={{ color: colors.textMuted }}>
            {t(
              isSignIn
                ? 'common.auth.switchToSignUp'
                : 'common.auth.switchToSignIn',
            )}
          </AppText>
        </Pressable>
      </View>
    </AppScreen>
  )
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
  switchModeButton: {
    alignSelf: 'flex-start',
  },
  input: {},
})
