import React from 'react'
import Home from './components/task2/Home/Home'
import Board from './components/task2/Board/Board'
import Todo from './components/task1/Todo/Todo'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import './App.css'

const App = () => {
  return (
    <BrowserRouter>
      <div className="content">
        <Switch>
          <Route exact path="/">
            <Redirect to="/boards" />
          </Route>
          <Route exact path="/Todo">
            <Todo />
          </Route>
          <Route exact path="/boards">
            <Home />
          </Route>
          <Route exact path="/board/:boardId">
            <Board />
          </Route>
        </Switch>
      </div>
    </BrowserRouter>
  )
}

export default App
