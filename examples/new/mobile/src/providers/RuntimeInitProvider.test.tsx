import { render, screen, waitFor } from '@testing-library/react-native';
import { Text } from 'react-native';

import { RuntimeInitProvider } from './RuntimeInitProvider';

describe('RuntimeInitProvider', () => {
  it('runs startup init callback on mount', async () => {
    const runOnMount = jest.fn(async () => undefined);

    render(
      <RuntimeInitProvider runOnMount={runOnMount}>
        <Text>Runtime child</Text>
      </RuntimeInitProvider>,
    );

    expect(screen.getByText('Runtime child')).toBeTruthy();
    await waitFor(() => expect(runOnMount).toHaveBeenCalledTimes(1));
  });

  it('keeps rendering even when startup init fails', async () => {
    const runOnMount = jest.fn(async () => {
      throw new Error('startup failed');
    });

    render(
      <RuntimeInitProvider runOnMount={runOnMount}>
        <Text>Fail-safe child</Text>
      </RuntimeInitProvider>,
    );

    expect(screen.getByText('Fail-safe child')).toBeTruthy();
    await waitFor(() => expect(runOnMount).toHaveBeenCalledTimes(1));
  });
});
