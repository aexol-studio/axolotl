import { fireEvent, render, screen } from '@testing-library/react-native'

import { AppSlider } from './AppSlider'

describe('AppSlider', () => {
  it('renders slider with deterministic testIDs', () => {
    render(
      <AppSlider
        testID="home-density-slider"
        value={30}
        onValueChange={() => undefined}
      />,
    )

    expect(screen.getByTestId('home-density-slider')).toBeTruthy()
    expect(screen.getByTestId('home-density-slider-track-btn')).toBeTruthy()
    expect(screen.getByTestId('home-density-slider-thumb')).toBeTruthy()
    expect(screen.getByTestId('home-density-slider-progress-30%')).toBeTruthy()
  })

  it('increments and decrements based on step', () => {
    const onValueChange = jest.fn()

    render(
      <AppSlider
        testID="home-density-slider"
        value={50}
        step={10}
        onValueChange={onValueChange}
      />,
    )

    fireEvent.press(screen.getByTestId('home-density-slider-increment-btn'))
    fireEvent.press(screen.getByTestId('home-density-slider-decrement-btn'))

    expect(onValueChange).toHaveBeenNthCalledWith(1, 60)
    expect(onValueChange).toHaveBeenNthCalledWith(2, 40)
  })

  it('track press wraps to min when reaching max', () => {
    const onValueChange = jest.fn()

    render(
      <AppSlider
        testID="home-density-slider"
        value={100}
        min={0}
        max={100}
        step={10}
        onValueChange={onValueChange}
      />,
    )

    fireEvent.press(screen.getByTestId('home-density-slider-track-btn'))

    expect(onValueChange).toHaveBeenCalledWith(0)
  })
})
