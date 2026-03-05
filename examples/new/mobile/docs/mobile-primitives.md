# Mobile primitives (starter-oriented)

This document describes the custom mobile primitives built in `mobile/src/components`.

## Constraints

- Mobile-only scope (`examples/new/mobile`)
- No external slider/carousel libraries
- Slider built with Reanimated + React Native primitives
- Interactive elements expose `testID`
- User-facing strings come from i18n keys

## QC quick-check for primitives

Use during hardening/review waves:

1. Keep primitives prop-driven and starter-oriented (no product-specific business rules).
2. Verify every interactive primitive path has `testID` coverage.
3. Keep slider/carousel behavior internal (no third-party slider/carousel libs).
4. Keep labels/messages translatable (i18n keys/hook-driven strings).
5. Run validation matrix from `mobile/README.md` and report baseline vs introduced violations.

Baseline-vs-introduced classification requirement:

- **Introduced** violations in touched primitive files must be fixed before handoff.
- **Baseline** violations outside touched primitive scope should be reported as non-blocking follow-up.

## Components

### `PrimaryButton`

Location: `src/components/primitives/PrimaryButton.tsx`

Props:

- `label: string`
- `onPress: () => void`
- `testID: string`
- `disabled?: boolean`
- `size?: 'sm' | 'md' | 'lg'`
- `variant?: 'solid' | 'soft' | 'outline' | 'ghost' | 'danger'`

### `AppSlider`

Location: `src/components/primitives/AppSlider.tsx`

Custom step slider with animated fill.

Props:

- `testID: string`
- `value: number`
- `onValueChange: (next: number) => void`
- `min?: number`
- `max?: number`
- `step?: number`
- `label?: string`
- `valueLabel?: string`

Exposed testIDs:

- `${testID}`
- `${testID}-decrement-btn`
- `${testID}-track-btn`
- `${testID}-increment-btn`
- `${testID}-thumb`
- `${testID}-fill`

### `CardList` + wrappers

Locations:

- `src/components/lists/CardList.tsx`
- `src/components/lists/FlashCardList.tsx`
- `src/components/lists/StaticCardList.tsx`

Orientation contract:

- `orientation?: 'vertical' | 'horizontal'`
- `listTestID?: string` for explicit list id wiring

Strategy contract:

- `strategy='flash'` for heavier/reactive flows
- `strategy='scroll'` for smaller/static blocks

### `ShowcaseCard`

Location: `src/components/showcase/ShowcaseCard.tsx`

Tone variants:

- `darkAi`
- `travel`
- `pastelInvoice`

Card variants:

- `elevated`
- `outlined`
- `compact`

Exposed testIDs:

- `${testID}`
- `${testID}-hero`
- `${testID}-tag`
- `${testID}-meta`
- `${testID}-cta`

## Home screen integration

Location: `src/screens/home/**`

Integrated controls:

- Button variant toggle controls
- Card variant toggle controls
- Density slider control
- Existing list orientation + recovery controls preserved

## Feature flow modules (starter-oriented)

### Todo flow

Location: `src/screens/todo/**`

Reusable blocks:

- `TodoSectionCard`
- `TodoComposer`
- `TodoFilterBar`
- `TodoListSection`
- `TodoListItem`

Supports starter interaction cycle:

- add
- toggle complete
- filter (`all|active|completed`)
- remove
- clear completed

### Onboarding flow

Location: `src/screens/onboarding/OnboardingScreen.tsx`

Contract:

- parent paging via native `ScrollView` with `pagingEnabled`
- progress bar from active page
- `skip/next/finish` actions with testIDs

### Spotlight/coachmark

Location: `src/features/spotlight/**`

Modules:

- `SpotlightProvider`
- `SpotlightTarget`
- `SpotlightOverlay`

Behavior:

- fullscreen dim + optional blur layer
- highlighted target rectangle by measured coordinates
- step text and `back/next/finish` controls
- persistent completion flag via onboarding store
