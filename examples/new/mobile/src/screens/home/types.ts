export type HomeStateMode = 'loading' | 'error' | 'empty' | 'success';

export type ListFailureMode = 'success' | 'error' | 'suspense';

export type ListRecoveryMode = 'button' | 'pull';

export type ListOrientation = 'vertical' | 'horizontal';

export type ShowcaseCardItem = {
  id: string;
  tagKey: string;
  titleKey: string;
  descriptionKey: string;
  ctaKey: string;
  tone: 'darkAi' | 'travel' | 'pastelInvoice';
  metaKey: string;
};
