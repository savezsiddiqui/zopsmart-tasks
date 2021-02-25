import React from 'react'
import List from './List'
import {
  act,
  render,
  getByText,
  fireEvent,
  getByPlaceholderText,
  getByTestId
} from '@testing-library/react'
import axios from 'axios'

let container = null

beforeEach(async () => {
  jest.spyOn(axios, 'get').mockImplementation(() =>
    Promise.resolve({
      data: [
        {
          id: '602a07d73395341b2019186b',
          name: 'Test Card'
        }
      ]
    })
  )
  await act(() => {
    container = render(
      <List
        name="test-list"
        listId="603252917084f754f3511cc3"
        getLists={() => true}
      />
    ).container
  })
})

afterEach(() => {
  container = null
})

test('should render', async () => {
  expect(getByText(container, 'Test Card')).toBeInTheDocument()
})

test('should add card', () => {
  const spy = jest
    .spyOn(axios, 'post')
    .mockImplementation(() => Promise.resolve(true))

  const addCardUi = getByText(container, '+ add another card')
  fireEvent.click(addCardUi)
  const addCardInput = getByPlaceholderText(
    container,
    'enter a title for this card'
  )
  fireEvent.change(addCardInput, { target: { value: 'new Card' } })
  const addCardButton = getByText(container, 'Add Card')
  fireEvent.click(addCardButton)

  expect(spy).toHaveBeenCalledTimes(1)
})

test('should archive list', () => {
  const spy = jest
    .spyOn(axios, 'put')
    .mockImplementation(() => Promise.resolve(true))

  const archiveListButton = getByTestId(container, 'archive-list-button')
  fireEvent.click(archiveListButton)

  expect(spy).toHaveBeenCalledTimes(1)
})

test('should toggle addCard Ui', () => {
  const addCardUi = getByText(container, '+ add another card')
  fireEvent.click(addCardUi)
  const cancelButton = getByTestId(container, 'cancel-button')
  fireEvent.click(cancelButton)
  expect(() => {
    getByPlaceholderText(container, 'enter a title for this card')
  }).toThrow()
})

test('should edit list', () => {
  const spy = jest
    .spyOn(axios, 'put')
    .mockImplementation(() => Promise.resolve(true))

  const listName = getByTestId(container, 'list-name')
  fireEvent.click(listName)
  const listEditInput = getByTestId(container, 'list-edit-input')
  fireEvent.change(listEditInput, { target: { value: 'New List Name' } })
  fireEvent.click(getByText(container, 'Update'))

  expect(spy).toHaveBeenCalledTimes(1)
})

test('should toggle list edit input', () => {
  const listName = getByTestId(container, 'list-name')
  fireEvent.click(listName)
  const listEditInput = getByTestId(container, 'list-edit-input')
  fireEvent.change(listEditInput, { target: { value: 'New List Name' } })
  fireEvent.click(getByText(container, 'Cancel'))
  expect(() => {
    getByTestId(container, 'list-edit-input')
  }).toThrow()
})
