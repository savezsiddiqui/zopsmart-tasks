import React from 'react'
import Home from './Home'
import {
  act,
  fireEvent,
  getByPlaceholderText,
  getByTestId,
  getByText,
  render
} from '@testing-library/react'
import axios from 'axios'
import { MemoryRouter } from 'react-router-dom'

describe('tests for Home', () => {
  let container = null

  beforeEach(() => {
    jest.spyOn(axios, 'get').mockImplementation(() =>
      Promise.resolve({
        data: [
          {
            name: 'test-board',
            id: '603252917084f754f3511cc2',
            url: 'https://trello.com/b/KeWDhTQ5/test-board',
            prefs: {
              backgroundImage:
                'https://trello-backgrounds.s3.amazonaws.com/SharedBackground/128x192/971ccf50923a70ebe1cf88c8e5eff6f8/photo-1613667023109-4af33e671503.jpg'
            }
          }
        ]
      })
    )

    const RenderWithRouter = () => (
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    )

    act(() => {
      container = render(<RenderWithRouter />).container
    })
  })

  afterEach(() => {
    container = null
  })

  test('should render Home', () => {
    expect(getByText(container, 'test-board')).toBeInTheDocument()
  })

  test('should add new board', () => {
    const spy = jest
      .spyOn(axios, 'post')
      .mockImplementation(() => Promise.resolve(true))

    const addBoard = getByText(container, '+ add board')
    fireEvent.click(addBoard)
    const addBoardInput = getByTestId(container, 'add-board-input')
    fireEvent.change(addBoardInput, { target: { value: 'new Board' } })
    fireEvent.click(getByText(container, 'Add Board'))

    expect(spy).toHaveBeenCalledTimes(1)
  })

  test('should delete board', () => {
    const spy = jest
      .spyOn(axios, 'delete')
      .mockImplementation(() => Promise.resolve(true))

    window.confirm = jest.fn().mockImplementation(() => true)

    const deleteBoardButton = getByTestId(container, 'delete-board-button')
    fireEvent.click(deleteBoardButton)

    expect(spy).toHaveBeenCalledTimes(1)
  })

  test('should not delete board', () => {
    window.confirm = jest.fn().mockImplementation(() => false)

    const deleteBoardButton = getByTestId(container, 'delete-board-button')
    fireEvent.click(deleteBoardButton)
    expect(getByText(container, 'test-board')).toBeInTheDocument()
  })

  test('should toggle add board ui', () => {
    const addBoard = getByText(container, '+ add board')
    fireEvent.click(addBoard)
    fireEvent.click(getByText(container, 'Cancel'))
    expect(() => {
      getByTestId(container, 'add-board-input')
    }).toThrow()
  })

  test('should search', () => {
    const searchButton = getByTestId(container, 'search-button')
    fireEvent.click(searchButton)
    const searchBox = getByPlaceholderText(container, 'filter boards')
    fireEvent.change(searchBox, { target: { value: 'xxxxxxxxxx' } })
    expect(() => {
      getByText(container, 'test-board')
    }).toThrow()
  })
})
