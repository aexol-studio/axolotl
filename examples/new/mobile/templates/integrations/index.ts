export { mixpanelTemplateManifest } from './mixpanel/manifest';
export { oneSignalTemplateManifest } from './onesignal/manifest';
export { sentryTemplateManifest } from './sentry/manifest';
export { realtimeTemplateManifest } from './realtime/manifest';

const TEMPLATE_RUNTIME_FLAG = process.env.EXPO_PUBLIC_ENABLE_STARTER_TEMPLATES === 'true';

export function areTemplateBlueprintsEnabled() {
  return TEMPLATE_RUNTIME_FLAG;
}
