import { StyleSheet, View } from 'react-native';

import { AppText } from '../components/primitives/AppText';
import { PrimaryButton } from '../components/primitives/PrimaryButton';
import { useAppTheme } from '../theme';

type EmptyStateTemplateProps = {
  title: string;
  description: string;
  actionLabel: string;
  onActionPress: () => void;
  actionTestID: string;
};

export function EmptyStateTemplate({
  title,
  description,
  actionLabel,
  onActionPress,
  actionTestID,
}: EmptyStateTemplateProps) {
  const { spacing } = useAppTheme();

  return (
    <View style={[styles.card, { gap: spacing.sm }]}>
      <AppText variant="h3">{title}</AppText>
      <AppText variant="body">{description}</AppText>
      <PrimaryButton testID={actionTestID} label={actionLabel} onPress={onActionPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {},
});
