/* eslint-env jest */
/**
 * Jest setup: mocks de módulos nativos que no existen en el entorno de test.
 */
jest.mock('@react-native-community/geolocation', () => ({
  getCurrentPosition: jest.fn(success =>
    success({ coords: { latitude: 40.4168, longitude: -3.7038 }, timestamp: Date.now() }),
  ),
}));

jest.mock('react-native-safe-area-context', () =>
  require('react-native-safe-area-context/jest/mock').default,
);

jest.mock('@react-native-picker/picker', () => {
  const React = require('react');
  const { View } = require('react-native');

  const Picker = React.forwardRef((props, ref) =>
    React.createElement(View, { ref, testID: props.testID }),
  );
  Picker.Item = () => React.createElement(View);

  return { Picker, default: Picker };
});

jest.mock('react-native-sensors', () => require('react-native-sensors/mock'));

jest.mock('@react-native-async-storage/async-storage', () => {
  const store = {};
  return {
    __esModule: true,
    default: {
      getItem: jest.fn(async key => (key in store ? store[key] : null)),
      setItem: jest.fn(async (key, value) => {
        store[key] = String(value);
      }),
      removeItem: jest.fn(async key => {
        delete store[key];
      }),
      clear: jest.fn(async () => {
        Object.keys(store).forEach(k => delete store[k]);
      }),
    },
  };
});