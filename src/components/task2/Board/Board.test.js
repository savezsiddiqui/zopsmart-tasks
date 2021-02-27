import React from 'react'
import Board from './Board'
import {
  act,
  render,
  getByText,
  fireEvent,
  getByPlaceholderText,
  getByTestId
} from '@testing-library/react'
import axios from 'axios'
import { MemoryRouter } from 'react-router-dom'

describe('test for Error', () => {
  let container = null
  test('should throw Error', async () => {
    jest.mock('react-router', () => ({
      useParams: jest
        .fn()
        .mockReturnValue({ boardId: '603252917084f754f3511cc2' })
    }))

    jest.spyOn(axios, 'get').mockImplementation(() => Promise.resolve(true))
    jest
      .spyOn(axios, 'all')
      .mockImplementation(() => Promise.reject(new Error('Error')))
    const RenderWithRouter = () => (
      <MemoryRouter>
        <Board />
      </MemoryRouter>
    )

    await act(() => {
      container = render(<RenderWithRouter />).container
    })

    expect(getByText(container, 'Error')).toBeInTheDocument()
  })
})

describe('tests for Board', () => {
  let container = null

  beforeEach(async () => {
    jest.mock('react-router', () => ({
      useParams: jest
        .fn()
        .mockReturnValue({ boardId: '603252917084f754f3511cc2' })
    }))

    jest.spyOn(axios, 'get').mockImplementation(() => Promise.resolve(true))

    jest.spyOn(axios, 'all').mockImplementation(() =>
      Promise.resolve([
        {
          data: [
            {
              id: '603252917084f754f3511cc3',
              name: 'To Do',
              idBoard: '603252917084f754f3511cc2'
            }
          ]
        },
        {
          data: {
            name: 'test-board',
            prefs: {
              backgroundImage:
                'https://trello-backgrounds.s3.amazonaws.com/SharedBackground/original/29087b574035655ae3f595833542a117/photo-1613667023109-4af33e671503'
            }
          }
        }
      ])
    )

    const RenderWithRouter = () => (
      <MemoryRouter>
        <Board />
      </MemoryRouter>
    )

    await act(() => {
      container = render(<RenderWithRouter />).container
    })
  })

  afterEach(() => {
    container = null
  })

  test('should render', async () => {
    expect(getByText(container, 'To Do')).toBeInTheDocument()
  })

  test('should add list', () => {
    const spy = jest
      .spyOn(axios, 'post')
      .mockImplementation(() => Promise.resolve(true))

    const addListUi = getByText(container, '+ add a new list')
    fireEvent.click(addListUi)
    const addListInput = getByPlaceholderText(
      container,
      'enter a title for this card'
    )
    fireEvent.change(addListInput, { target: { value: 'new List' } })
    const addListButton = getByText(container, 'Add Card')
    fireEvent.click(addListButton)

    expect(spy).toHaveBeenCalledTimes(1)
  })

  test('should not add list', () => {
    const spy = jest
      .spyOn(axios, 'post')
      .mockImplementation(() => Promise.reject(new Error('Error')))

    const addListUi = getByText(container, '+ add a new list')
    fireEvent.click(addListUi)
    const addListInput = getByPlaceholderText(
      container,
      'enter a title for this card'
    )
    fireEvent.change(addListInput, { target: { value: 'new List' } })
    const addListButton = getByText(container, 'Add Card')
    fireEvent.click(addListButton)

    expect(spy).toHaveBeenCalledTimes(1)
  })

  test('should toggle addList Ui', () => {
    const addListUi = getByText(container, '+ add a new list')
    fireEvent.click(addListUi)
    const cancelButton = getByTestId(container, 'cancel-button')
    fireEvent.click(cancelButton)
    expect(() => {
      getByPlaceholderText(container, 'enter a title for this card')
    }).toThrow()
  })

  test('should edit board-name', () => {
    const spy = jest
      .spyOn(axios, 'put')
      .mockImplementation(() => Promise.resolve(true))

    const boardName = getByTestId(container, 'board-name')
    fireEvent.click(boardName)
    const boardNameInput = getByTestId(container, 'edit-board-input')
    fireEvent.change(boardNameInput, {
      target: { value: 'board name (edited)' }
    })
    fireEvent.click(getByText(container, 'Update'))
    expect(spy).toHaveBeenCalledTimes(1)
  })

  test('should not edit board-name', () => {
    const spy = jest
      .spyOn(axios, 'put')
      .mockImplementation(() => Promise.reject(new Error('Error')))

    const boardName = getByTestId(container, 'board-name')
    fireEvent.click(boardName)
    const boardNameInput = getByTestId(container, 'edit-board-input')
    fireEvent.change(boardNameInput, {
      target: { value: 'board name (edited)' }
    })
    fireEvent.click(getByText(container, 'Update'))
    expect(spy).toHaveBeenCalledTimes(1)
  })

  test('should toggle board-name edit ui', () => {
    const boardName = getByTestId(container, 'board-name')
    fireEvent.click(boardName)
    fireEvent.click(getByText(container, 'Cancel'))
    expect(() => {
      getByTestId(container, 'edit-board-input')
    }).toThrow()
  })
})
