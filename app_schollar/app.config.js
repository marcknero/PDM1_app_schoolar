const appJson = require('./app.json');

function normalizeApiBaseUrl(value) {
  if (!value) {
    return 'http://localhost:3000/api';
  }

  const trimmed = value.trim().replace(/\/+$/, '');
  return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
}

/** @type {import('expo/config').ExpoConfig} */
module.exports = () => ({
  expo: {
    ...appJson.expo,
    android: {
      ...appJson.expo.android,
      package: 'com.marcosoliveira.appschollar',
    },
    extra: {
      ...appJson.expo.extra,
      apiBaseUrl: normalizeApiBaseUrl(
        process.env.EXPO_PUBLIC_API_BASE_URL || appJson.expo.extra?.apiBaseUrl
      ),
      eas: {
        projectId: 'bcfa24d7-1133-4b08-a764-fe8acd60fd05',
      },
    },
  },
});
