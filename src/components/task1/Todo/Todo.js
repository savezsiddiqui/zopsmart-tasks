import Card from '../TodoCard/ToDoCard'
import React, { Component } from 'react'
import TodoStyles from '../Todo.module.css'

class Todo extends Component {
  constructor(props) {
    super(props)
    this.state = {
      todo: [],
      todoInput: ''
    }
  }

  componentDidMount() {
    const dataString = localStorage.getItem('todos')
    if (dataString !== null) {
      const todos = JSON.parse(dataString)
      this.setState({ todo: todos })
    }
  }

  _onChange = (e) => {
    this.setState({
      todoInput: e.target.value
    })
  }

  _onKeyDown = (e) => {
    if (e.key === 'Enter' && this.state.todoInput.length > 0) {
      const newTodos = [
        {
          text: this.state.todoInput,
          checked: false,
          id: new Date()
        },
        ...this.state.todo
      ]
      localStorage.setItem('todos', JSON.stringify(newTodos))
      this.setState({
        todo: newTodos,
        todoInput: ''
      })
    }
  }

  deleteTodo = (id) => {
    const newTodos = this.state.todo.filter((todo) => todo.id !== id)
    localStorage.setItem('todos', JSON.stringify(newTodos))

    this.setState({
      todo: newTodos
    })
  }

  editTodo = (text, id) => {
    const newTodos = this.state.todo.map((todo) =>
      todo.id === id ? { ...todo, text } : todo
    )
    localStorage.setItem('todos', JSON.stringify(newTodos))
    this.setState({
      todo: newTodos
    })
  }

  checkTodo = (id) => {
    const newTodos = this.state.todo.map((todo) =>
      todo.id === id
        ? {
            ...todo,
            checked: !todo.checked
          }
        : todo
    )

    localStorage.setItem('todos', JSON.stringify(newTodos))

    this.setState({
      todo: newTodos
    })
  }

  render() {
    const cardList = this.state.todo.map(({ text, checked, id }) => (
      <Card
        text={text}
        checked={checked}
        key={id}
        checkFn={() => this.checkTodo(id)}
        delFn={() => this.deleteTodo(id)}
        editFn={(text) => this.editTodo(text, id)}
      />
    ))

    return (
      <div className={TodoStyles.root}>
        <section className={TodoStyles['fixed-top']}>
          <h1 className={TodoStyles['display-4']}>TODO</h1>
          <input
            type="text"
            id="todo-input"
            className={TodoStyles['custom-input']}
            placeholder="add todo"
            onKeyDown={this._onKeyDown}
            onChange={this._onChange}
            value={this.state.todoInput}
          />
        </section>
        <section className={TodoStyles['todo-container']}>{cardList}</section>
      </div>
    )
  }
}

export default Todo
