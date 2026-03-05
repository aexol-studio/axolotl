import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useHomeGreeting } from '../../features/home/useHomeGreeting'
import { normalizeError } from '../../lib/errors/normalizeError'
import { changeLanguage } from '../../lib/i18n'
import { useToast } from '../../providers/ToastProvider'
import { useAppLanguage } from '../../stores/settingsStore'
import { useStateView } from '../../hooks/useStateView'
import {
  HomeButtonVariant,
  HomeStateMode,
  ListFailureMode,
  ListOrientation,
  ListRecoveryMode,
  ShowcaseCardVariant,
} from './types'

const demoItemKeys = [
  'common.home.demoItemTokens',
  'common.home.demoItemStateViews',
  'common.home.demoItemToastLayer',
] as const

const showcaseCards = [
  {
    id: 'tokenized-design-system',
    tagKey: 'common.home.showcaseCardTagDesign',
    titleKey: 'common.home.showcaseCardDesignTitle',
    descriptionKey: 'common.home.showcaseCardDesignDescription',
    ctaKey: 'common.home.showcaseCardDesignCta',
    metaKey: 'common.home.showcaseCardDesignMeta',
    tone: 'darkAi',
  },
  {
    id: 'keyboard-ready-forms',
    tagKey: 'common.home.showcaseCardTagForms',
    titleKey: 'common.home.showcaseCardFormsTitle',
    descriptionKey: 'common.home.showcaseCardFormsDescription',
    ctaKey: 'common.home.showcaseCardFormsCta',
    metaKey: 'common.home.showcaseCardFormsMeta',
    tone: 'travel',
  },
  {
    id: 'resilient-list-flow',
    tagKey: 'common.home.showcaseCardTagFlow',
    titleKey: 'common.home.showcaseCardFlowTitle',
    descriptionKey: 'common.home.showcaseCardFlowDescription',
    ctaKey: 'common.home.showcaseCardFlowCta',
    metaKey: 'common.home.showcaseCardFlowMeta',
    tone: 'pastelInvoice',
  },
] as const

export const useHomeScreenState = () => {
  const { t } = useTranslation()
  const language = useAppLanguage()
  const greeting = useHomeGreeting()
  const { showToast } = useToast()
  const [forcedMode, setForcedMode] = useState<HomeStateMode>('success')
  const [listFailureMode, setListFailureMode] =
    useState<ListFailureMode>('success')
  const [listRecoveryMode, setListRecoveryMode] =
    useState<ListRecoveryMode>('button')
  const [listOrientation, setListOrientation] =
    useState<ListOrientation>('vertical')
  const [isListRefreshing, setIsListRefreshing] = useState(false)
  const [buttonVariant, setButtonVariant] = useState<HomeButtonVariant>('soft')
  const [showcaseCardVariant, setShowcaseCardVariant] =
    useState<ShowcaseCardVariant>('elevated')
  const [listDensity, setListDensity] = useState(100)

  const nextLanguage = useMemo(
    () => (language === 'en' ? 'pl' : 'en'),
    [language],
  )

  const demoItems = useMemo(
    () => demoItemKeys.map((itemKey) => t(itemKey)),
    [t],
  )

  const stateMode = useStateView({
    mode: forcedMode,
    data: demoItems,
    isEmpty: (items) => !items || items.length === 0,
  })

  const handleToggleLanguage = async () => {
    try {
      await changeLanguage(nextLanguage)
      showToast({
        title: t('common.toast.languageChanged', {
          language: nextLanguage.toUpperCase(),
        }),
        variant: 'success',
      })
    } catch (error) {
      const normalized = normalizeError(error)
      showToast({
        title: t('common.toast.errorTitle'),
        message: t(normalized.message),
        variant: 'error',
      })
      setForcedMode('error')
    }
  }

  const forceError = () => {
    const normalized = normalizeError({ code: 'NETWORK_ERROR' })
    showToast({
      title: t('common.toast.errorTitle'),
      message: t(normalized.message),
      variant: 'error',
    })
    setForcedMode('error')
  }

  const handleListRefresh = async () => {
    setIsListRefreshing(true)
    await new Promise((resolve) => setTimeout(resolve, 160))
    setListFailureMode('success')
    setForcedMode('success')
    setIsListRefreshing(false)
  }

  const handleTriggerListFailure = (
    mode: Exclude<ListFailureMode, 'success'>,
  ) => {
    setListFailureMode(mode)
    setForcedMode('success')
  }

  const handleSetListRecoveryMode = (mode: ListRecoveryMode) => {
    setListRecoveryMode(mode)
  }

  const handleSetListOrientation = (orientation: ListOrientation) => {
    setListOrientation(orientation)
  }

  const homeListErrorMessage =
    listFailureMode === 'suspense'
      ? t('common.home.listSuspenseFailed')
      : t('common.home.listErrorMessage')

  return {
    greeting,
    nextLanguage,
    stateMode,
    demoItems,
    setForcedMode,
    handleToggleLanguage,
    forceError,
    listFailureMode,
    listRecoveryMode,
    listOrientation,
    isListRefreshing,
    handleListRefresh,
    handleTriggerListFailure,
    handleSetListRecoveryMode,
    handleSetListOrientation,
    homeListErrorMessage,
    showcaseCards,
    buttonVariant,
    setButtonVariant,
    showcaseCardVariant,
    setShowcaseCardVariant,
    listDensity,
    setListDensity,
  }
}
