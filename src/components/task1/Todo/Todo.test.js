import { fireEvent, render } from '@testing-library/react'
import renderer from 'react-test-renderer'
import Todo from './Todo'
import React from 'react'

test('should render App correctly', () => {
  const tree = renderer.create(<Todo />).toJSON()
  expect(tree).toMatchSnapshot()
})

test('should add todo', () => {
  const { getByPlaceholderText, getByText } = render(<Todo />)
  const input = getByPlaceholderText('add todo')
  fireEvent.change(input, { target: { value: 'test-todo-1' } })
  fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })
  expect(getByText('test-todo-1')).toBeInTheDocument()
})

test('should not add todo', () => {
  const tree = renderer.create(<Todo />).toJSON()
  const { getByPlaceholderText } = render(<Todo />)
  const input = getByPlaceholderText('add todo')
  fireEvent.change(input, { target: { value: '' } })
  fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })
  expect(tree).toMatchSnapshot()
})

test('should check todo', () => {
  const { getByPlaceholderText, getByText, getByTestId } = render(<Todo />)
  const input = getByPlaceholderText('add todo')
  fireEvent.change(input, { target: { value: 'test-todo-2' } })
  fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })
  fireEvent.click(getByText('test-todo-2'))
  expect(getByTestId('strike-through')).toBeInTheDocument()
})

test('should delete todo', () => {
  const { getByPlaceholderText, getByText, getAllByTestId } = render(<Todo />)
  const input = getByPlaceholderText('add todo')
  fireEvent.change(input, { target: { value: 'test-todo-3' } })
  fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })
  fireEvent.click(getAllByTestId('delete-button')[0])
  expect(() => getByText('test-todo-3')).toThrowError()
})

test('should edit todo', () => {
  const { getByPlaceholderText, getByText, getAllByTestId } = render(<Todo />)
  const input = getByPlaceholderText('add todo')
  fireEvent.change(input, { target: { value: 'test-todo-4' } })
  fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })
  fireEvent.click(getAllByTestId('edit-button')[0])
  const editInput = getAllByTestId('edit-input')[0]
  fireEvent.change(editInput, { target: { value: 'test-todo-4-edited' } })
  fireEvent.keyDown(editInput, { key: 'Enter', code: 'Enter' })
  expect(getByText('test-todo-4-edited')).toBeInTheDocument()
})

test('should not add edited todo', () => {
  const tree = renderer.create(<Todo />).toJSON()
  const { getByPlaceholderText, getAllByTestId } = render(<Todo />)
  const input = getByPlaceholderText('add todo')
  fireEvent.change(input, { target: { value: 'test-todo-5' } })
  fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })
  fireEvent.click(getAllByTestId('edit-button')[0])
  const editInput = getAllByTestId('edit-input')[0]
  fireEvent.change(editInput, { target: { value: '' } })
  fireEvent.keyDown(editInput, { key: 'Enter', code: 'Enter' })
  expect(tree).toMatchSnapshot()
})
