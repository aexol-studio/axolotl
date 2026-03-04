import { render, screen } from '@testing-library/react-native';

import { AppInput } from './AppInput';

describe('AppInput', () => {
  it('renders input with testID', () => {
    render(<AppInput testID="app-input-probe" value="email" onChangeText={() => undefined} />);

    expect(screen.getByTestId('app-input-probe')).toBeTruthy();
  });
});
