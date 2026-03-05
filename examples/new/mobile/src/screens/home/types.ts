export type HomeStateMode = 'loading' | 'error' | 'empty' | 'success'

export type ListFailureMode = 'success' | 'error' | 'suspense'

export type ListRecoveryMode = 'button' | 'pull'

export type ListOrientation = 'vertical' | 'horizontal'

export type HomeButtonVariant =
  | 'solid'
  | 'soft'
  | 'outline'
  | 'ghost'
  | 'danger'

export type ShowcaseCardVariant = 'elevated' | 'outlined' | 'compact'

export type ShowcaseCardItem = {
  id: string
  tagKey: string
  titleKey: string
  descriptionKey: string
  ctaKey: string
  tone: 'darkAi' | 'travel' | 'pastelInvoice'
  metaKey: string
}
