import { StyleSheet, View } from 'react-native'
import { useTranslation } from 'react-i18next'

import { AppScreen } from '../../components/primitives/AppScreen'
import { AppSlider } from '../../components/primitives/AppSlider'
import { AppText } from '../../components/primitives/AppText'
import { PrimaryButton } from '../../components/primitives/PrimaryButton'
import { useAppTheme } from '../../theme'
import { HomeControls } from './components/HomeControls'
import { HomeStateSection } from './components/HomeStateSection'
import { useHomeScreenState } from './useHomeScreenState'

export const HomeScreen = () => {
  const { t } = useTranslation()
  const { colors, spacing, shape, shadows } = useAppTheme()
  const {
    demoItems,
    forceError,
    greeting,
    handleToggleLanguage,
    nextLanguage,
    setForcedMode,
    stateMode,
    listFailureMode,
    listRecoveryMode,
    listOrientation,
    handleTriggerListFailure,
    handleSetListRecoveryMode,
    handleSetListOrientation,
    isListRefreshing,
    handleListRefresh,
    homeListErrorMessage,
    showcaseCards,
    buttonVariant,
    setButtonVariant,
    showcaseCardVariant,
    setShowcaseCardVariant,
    listDensity,
    setListDensity,
  } = useHomeScreenState()

  return (
    <AppScreen>
      <View style={[styles.content, { gap: spacing.lg }]}>
        <View
          style={[
            styles.hero,
            {
              borderRadius: shape.radiusXl,
              backgroundColor: colors.cardDarkStart,
              borderColor: colors.borderStrong,
              boxShadow: shadows.heroCard,
              padding: spacing.lg,
              gap: spacing.xs,
            },
          ]}
        >
          <AppText variant="h1" style={{ color: colors.textInverse }}>
            {t('common.home.title')}
          </AppText>
          <AppText variant="body" style={{ color: colors.textInverse }}>
            {greeting}
          </AppText>
        </View>

        <PrimaryButton
          testID="home-toggle-language-btn"
          label={t('common.actions.changeLanguage', {
            language: nextLanguage.toUpperCase(),
          })}
          variant={buttonVariant}
          onPress={() => {
            void handleToggleLanguage()
          }}
        />

        <AppSlider
          testID="home-density-slider"
          label={t('common.home.listDensityLabel')}
          valueLabel={t('common.home.listDensityValue', {
            value: String(listDensity),
          })}
          value={listDensity}
          min={80}
          max={140}
          step={10}
          onValueChange={setListDensity}
        />

        <View style={[styles.controls, { gap: spacing.sm }]}>
          <HomeControls
            t={t}
            listRecoveryMode={listRecoveryMode}
            listOrientation={listOrientation}
            setForcedMode={setForcedMode}
            forceError={forceError}
            handleTriggerListFailure={handleTriggerListFailure}
            handleSetListRecoveryMode={handleSetListRecoveryMode}
            handleSetListOrientation={handleSetListOrientation}
            handleListRefresh={handleListRefresh}
            buttonVariant={buttonVariant}
            setButtonVariant={setButtonVariant}
            showcaseCardVariant={showcaseCardVariant}
            setShowcaseCardVariant={setShowcaseCardVariant}
          />
        </View>

        <HomeStateSection
          t={t}
          stateMode={stateMode}
          setForcedMode={setForcedMode}
          listFailureMode={listFailureMode}
          listRecoveryMode={listRecoveryMode}
          listOrientation={listOrientation}
          homeListErrorMessage={homeListErrorMessage}
          isListRefreshing={isListRefreshing}
          handleListRefresh={handleListRefresh}
          demoItems={demoItems}
          showcaseCards={showcaseCards}
          showcaseCardVariant={showcaseCardVariant}
          listDensity={listDensity}
        />
      </View>
    </AppScreen>
  )
}

const styles = StyleSheet.create({
  content: {
    width: '100%',
  },
  controls: {
    width: '100%',
  },
  hero: {
    borderWidth: 1,
  },
})
