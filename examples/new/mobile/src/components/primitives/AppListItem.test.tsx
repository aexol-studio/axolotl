import { render, screen } from '@testing-library/react-native';

import { AppListItem } from './AppListItem';
import { AppText } from './AppText';

describe('AppListItem', () => {
  it('renders list item shell', () => {
    render(
      <AppListItem testID="app-list-item-probe">
        <AppText>Row</AppText>
      </AppListItem>,
    );

    expect(screen.getByTestId('app-list-item-probe')).toBeTruthy();
    expect(screen.getByText('Row')).toBeTruthy();
  });
});
