import renderer from 'react-test-renderer'
import ToDoCard from './ToDoCard'
import React from 'react'

test('should render App correctly', () => {
  const tree = renderer
    .create(
      <ToDoCard
        text="random-todo"
        checked={false}
        checkFn={() => true}
        delFn={() => true}
        editFn={() => true}
      />
    )
    .toJSON()

  expect(tree).toMatchSnapshot()
})
