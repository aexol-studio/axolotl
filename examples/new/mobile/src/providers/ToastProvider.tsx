import { PropsWithChildren, createContext, useCallback, useContext, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppText } from '../components/primitives/AppText';
import { useAppTheme } from '../theme';

type ToastVariant = 'error' | 'success' | 'info';

export type ToastPayload = {
  title: string;
  message?: string;
  variant?: ToastVariant;
};

type ToastApi = {
  showToast: (payload: ToastPayload) => void;
  hideToast: () => void;
};

const ToastContext = createContext<ToastApi>({
  showToast: () => undefined,
  hideToast: () => undefined,
});

const variantToBackground = {
  error: 'danger',
  success: 'success',
  info: 'info',
} as const;

export function ToastProvider({ children }: PropsWithChildren) {
  const { colors, layout, spacing, shape, textStyles } = useAppTheme();
  const [toast, setToast] = useState<ToastPayload | null>(null);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  const showToast = useCallback((payload: ToastPayload) => {
    setToast(payload);
  }, []);

  const value = useMemo(
    () => ({
      showToast,
      hideToast,
    }),
    [hideToast, showToast],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast ? (
        <View
          testID="toast-banner"
          pointerEvents="box-none"
          style={[
            styles.toastContainer,
            {
              padding: spacing.lg,
            },
          ]}
        >
          <View
            style={[
              styles.toast,
              {
                borderRadius: shape.radiusMd,
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.sm,
                backgroundColor: colors[variantToBackground[toast.variant ?? 'info']],
              },
            ]}
          >
            <AppText variant="h3" style={styles.toastTitle}>
              {toast.title}
            </AppText>
            {toast.message ? (
              <AppText variant="body" style={styles.toastMessage}>
                {toast.message}
              </AppText>
            ) : null}
            <Pressable
              testID="toast-dismiss-btn"
              accessibilityRole="button"
              onPress={hideToast}
              style={[
                styles.dismissButton,
                {
                  minHeight: shape.buttonHeight,
                  justifyContent: layout.justify.center,
                },
              ]}
            >
              <Text style={[textStyles.button, styles.dismissButtonLabel]}>×</Text>
            </Pressable>
          </View>
        </View>
      ) : null}
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  toast: {
    position: 'relative',
  },
  toastTitle: {
    color: '#f8fafc',
  },
  toastMessage: {
    color: '#f8fafc',
    lineHeight: 18,
  },
  dismissButton: {
    position: 'absolute',
    top: 4,
    right: 8,
    alignItems: 'center',
    minWidth: 32,
  },
  dismissButtonLabel: {
    color: '#f8fafc',
    fontSize: 22,
    lineHeight: 22,
  },
});
