import React from 'react'
import Header from './Header'
import {
  render,
  fireEvent,
  getByPlaceholderText,
  getByTestId
} from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

describe('test for header', () => {
  test('should toggle search bar', () => {
    const container = render(
      <MemoryRouter>
        <Header
          boards={[
            {
              id: '603252917084f754f3511cc3',
              name: 'To Do',
              idBoard: '603252917084f754f3511cc2'
            }
          ]}
          setFilteredBoards={() => true}
        />
      </MemoryRouter>
    ).container

    const searchButton = getByTestId(container, 'search-button')
    fireEvent.click(searchButton)
    expect(getByPlaceholderText(container, 'filter boards')).toBeInTheDocument()
  })
})
