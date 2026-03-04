import '@testing-library/jest-native/extend-expect';
import { ReactNode } from 'react';
import { ScrollViewProps, StyleProp, ViewStyle } from 'react-native';

type KeyboardAwareScrollViewMockProps = {
  children?: ReactNode;
  testID?: string;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  bottomOffset?: number;
  keyboardShouldPersistTaps?: ScrollViewProps['keyboardShouldPersistTaps'];
};

jest.mock('expo-modules-core', () => ({
  EventEmitter: class EventEmitter {},
  NativeModule: class NativeModule {},
  SharedObject: class SharedObject {},
  requireNativeModule: () => ({}),
  requireOptionalNativeModule: () => null,
  registerWebModule: () => undefined,
  CodedError: class CodedError extends Error {
    code: string;

    constructor(code: string, message?: string) {
      super(message);
      this.code = code;
    }
  },
}), { virtual: true });

afterEach(() => {
  jest.clearAllMocks();
});

jest.mock('expo-router', () => {
  const mockReact = require('react');
  const { View } = require('react-native');

  const Stack = ({ children }: { children?: unknown }) =>
    mockReact.createElement(View, { testID: 'mock.stack' }, children);
  Stack.Screen = () => null;

  const Tabs = ({ children }: { children?: unknown }) =>
    mockReact.createElement(View, { testID: 'mock.tabs' }, children);
  Tabs.Screen = () => null;

  return { Stack, Tabs };
});

jest.mock('react-native-safe-area-context', () => {
  const mockReact = require('react');
  const { View } = require('react-native');
  return {
    SafeAreaProvider: ({ children }: { children?: unknown }) =>
      mockReact.createElement(View, { testID: 'safe-area-provider' }, children),
  };
});

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, params?: Record<string, string>) => {
      if (!params) {
        return key;
      }
      return Object.entries(params).reduce(
        (acc, [paramKey, value]) => acc.replace(`{{${paramKey}}}`, value),
        key,
      );
    },
  }),
  initReactI18next: {
    type: '3rdParty',
    init: () => undefined,
  },
}));

jest.mock('react-native-keyboard-controller', () => {
  const mockReact = require('react');
  const { ScrollView, View } = require('react-native');

  return {
    KeyboardProvider: ({ children }: { children?: unknown }) =>
      mockReact.createElement(View, { testID: 'keyboard-provider' }, children),
    KeyboardAwareScrollView: ({
      children,
      testID,
      style,
      contentContainerStyle,
      bottomOffset,
      keyboardShouldPersistTaps,
    }: KeyboardAwareScrollViewMockProps) =>
      mockReact.createElement(
        ScrollView,
        {
          testID,
          style,
          contentContainerStyle,
          bottomOffset,
          keyboardShouldPersistTaps,
        },
        children,
      ),
  };
});

jest.mock('@shopify/flash-list', () => {
  const { FlatList } = require('react-native');

  return {
    FlashList: FlatList,
  };
});
