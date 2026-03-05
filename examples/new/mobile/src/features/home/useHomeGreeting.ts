import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export function useHomeGreeting() {
  const { t } = useTranslation();

  return useMemo(() => {
    const hour = new Date().getHours();

    if (hour < 12) {
      return t('common.greeting.morning');
    }

    if (hour < 18) {
      return t('common.greeting.day');
    }

    return t('common.greeting.evening');
  }, [t]);
}
