import React from 'react'
import Card from './Card'
import {
  fireEvent,
  getByTestId,
  getByText,
  render
} from '@testing-library/react'
import axios from 'axios'

let container = null

beforeEach(() => {
  container = render(<Card name="test-card" id="1234" getCards={() => true} />)
    .container
})

afterEach(() => {
  container = null
})

test('should render', () => {
  expect(getByText(container, 'test-card')).toBeInTheDocument()
})

test('should delete', () => {
  const spy = jest
    .spyOn(axios, 'delete')
    .mockImplementation(() => Promise.resolve(true))

  const deleteButton = getByTestId(container, 'delete-card-button')
  fireEvent.click(deleteButton)
  expect(spy).toHaveBeenCalledTimes(1)
})

test('should edit card name', () => {
  const spy = jest
    .spyOn(axios, 'put')
    .mockImplementation(() => Promise.resolve(true))

  const card = getByText(container, 'test-card')
  fireEvent.click(card)
  const editCardInput = getByTestId(container, 'edit-card-input')
  fireEvent.change(editCardInput, { target: { value: 'card (edited)' } })
  fireEvent.click(getByText(container, 'Update'))

  expect(spy).toHaveBeenCalledTimes(1)
})

test('should toggle card edit ui', () => {
  const card = getByText(container, 'test-card')
  fireEvent.click(card)
  const editCardInput = getByTestId(container, 'edit-card-input')
  fireEvent.change(editCardInput, { target: { value: 'card (edited)' } })
  fireEvent.click(getByText(container, 'Cancel'))
  expect(() => {
    getByTestId(container, 'edit-card-input')
  }).toThrow()
})
