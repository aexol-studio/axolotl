import { render, screen } from '@testing-library/react-native'
import { FlatList } from 'react-native'

import { CardList } from './CardList'
import { AppText } from '../primitives/AppText'

describe('CardList', () => {
  it('renders list card with items and generated item testIDs', () => {
    render(
      <CardList
        testID="home-card-list"
        title="Blocks"
        subtitle="Reusable"
        data={['A', 'B']}
        keyExtractor={(item) => item}
        renderItem={(item) => <AppText variant="body">{item}</AppText>}
      />,
    )

    expect(screen.getByTestId('home-card-list')).toBeTruthy()
    expect(screen.getByTestId('home-card-list-item-0')).toBeTruthy()
    expect(screen.getByTestId('home-card-list-item-1')).toBeTruthy()
    expect(screen.getByText('Blocks')).toBeTruthy()
  })

  it('supports horizontal orientation list variant', () => {
    render(
      <CardList
        testID="home-card-list"
        orientation="horizontal"
        data={['A', 'B']}
        keyExtractor={(item) => item}
        renderItem={(item) => <AppText variant="body">{item}</AppText>}
      />,
    )

    expect(screen.getByTestId('home-card-list-horizontal-list')).toBeTruthy()
  })

  it('supports explicit custom listTestID for strategy contract', () => {
    render(
      <CardList
        testID="home-card-list"
        listTestID="home-card-list-custom"
        data={['A', 'B']}
        keyExtractor={(item) => item}
        renderItem={(item) => <AppText variant="body">{item}</AppText>}
      />,
    )

    expect(screen.getByTestId('home-card-list-custom')).toBeTruthy()
  })

  it('supports styled ScrollView strategy for small hardcoded lists', () => {
    render(
      <CardList
        testID="home-card-list"
        strategy="scroll"
        data={['A', 'B']}
        keyExtractor={(item) => item}
        renderItem={(item) => <AppText variant="body">{item}</AppText>}
      />,
    )

    expect(screen.getByTestId('home-card-list-vertical-list')).toBeTruthy()
    expect(screen.getByTestId('home-card-list-item-0')).toBeTruthy()
    expect(screen.getByTestId('home-card-list-item-1')).toBeTruthy()
  })

  it('supports explicit FlashList strategy for heavier/reactive lists', () => {
    const view = render(
      <CardList
        testID="home-card-list"
        strategy="flash"
        data={['A', 'B']}
        keyExtractor={(item) => item}
        renderItem={(item) => <AppText variant="body">{item}</AppText>}
      />,
    )

    expect(screen.getByTestId('home-card-list-vertical-list')).toBeTruthy()
    expect(screen.getByTestId('home-card-list-item-0')).toBeTruthy()
    expect(screen.getByTestId('home-card-list-item-1')).toBeTruthy()
    expect(view.UNSAFE_getByType(FlatList)).toBeTruthy()
  })
})
