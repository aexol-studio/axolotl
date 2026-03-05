import { fireEvent, render, screen } from '@testing-library/react-native'

import { ShowcaseCard } from './ShowcaseCard'

describe('ShowcaseCard', () => {
  it('renders core sections with testIDs', () => {
    render(
      <ShowcaseCard
        testID="showcase-card"
        tag="Design"
        title="Title"
        description="Description"
        ctaLabel="Open"
        meta="Meta"
        onPress={() => undefined}
      />,
    )

    expect(screen.getByTestId('showcase-card')).toBeTruthy()
    expect(screen.getByTestId('showcase-card-hero')).toBeTruthy()
    expect(screen.getByTestId('showcase-card-tag')).toBeTruthy()
    expect(screen.getByTestId('showcase-card-meta')).toBeTruthy()
    expect(screen.getByTestId('showcase-card-cta')).toBeTruthy()
  })

  it('supports outlined and compact variants', () => {
    render(
      <>
        <ShowcaseCard
          testID="showcase-card-outlined"
          tag="Design"
          title="Title"
          description="Description"
          ctaLabel="Open"
          meta="Meta"
          variant="outlined"
          onPress={() => undefined}
        />
        <ShowcaseCard
          testID="showcase-card-compact"
          tag="Design"
          title="Title"
          description="Description"
          ctaLabel="Open"
          meta="Meta"
          variant="compact"
          onPress={() => undefined}
        />
      </>,
    )

    expect(screen.getByTestId('showcase-card-outlined')).toBeTruthy()
    expect(screen.getByTestId('showcase-card-compact')).toBeTruthy()
  })

  it('calls onPress when card is tapped', () => {
    const onPress = jest.fn()

    render(
      <ShowcaseCard
        testID="showcase-card"
        tag="Design"
        title="Title"
        description="Description"
        ctaLabel="Open"
        meta="Meta"
        onPress={onPress}
      />,
    )

    fireEvent.press(screen.getByTestId('showcase-card'))

    expect(onPress).toHaveBeenCalledTimes(1)
  })
})
