import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppScreen } from '../../components/primitives/AppScreen';
import { AppText } from '../../components/primitives/AppText';
import { PrimaryButton } from '../../components/primitives/PrimaryButton';
import { useAppTheme } from '../../theme';
import { HomeControls } from './components/HomeControls';
import { HomeStateSection } from './components/HomeStateSection';
import { useHomeScreenState } from './useHomeScreenState';

export function HomeScreen() {
  const { t } = useTranslation();
  const { colors, spacing, shape, shadows } = useAppTheme();
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
  } = useHomeScreenState();

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
          label={t('common.actions.changeLanguage', { language: nextLanguage.toUpperCase() })}
          variant="soft"
          onPress={() => {
            void handleToggleLanguage();
          }}
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
        />
      </View>
    </AppScreen>
  );
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
});
