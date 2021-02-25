import React, { useEffect, useState } from 'react'
import { token, key } from '../config/config.json'
import { useParams } from 'react-router-dom'
import List from '../List/List'
import axios from 'axios'
import '../task2.css'

const Board = () => {
  const { boardId } = useParams()
  const [board, setBoard] = useState({
    lists: null,
    name: ''
  })
  const [addListUi, toggleAddListUi] = useState(false)
  const [newListName, setNewListName] = useState('')
  const [boardEditUi, toggleBoardEditUi] = useState(false)

  const getLists = async () => {
    axios
      .all([
        axios.get(
          `https://api.trello.com/1/boards/${boardId}/lists?fields=name,idBoard&key=${key}&token=${token}`
        ),
        axios.get(
          `https://api.trello.com/1/boards/${boardId}?fields=name&key=${key}&token=${token}`
        )
      ])
      .then(
        axios.spread((resp1, resp2) => {
          setBoard({
            lists: resp1.data,
            name: resp2.data.name
          })
        })
      )
  }

  useEffect(() => {
    getLists()
  }, [])

  const _onSubmit = async (e) => {
    e.preventDefault()
    await axios.post(
      `https://api.trello.com/1/lists?key=${key}&token=${token}&name=${newListName}&idBoard=${boardId}`
    )
    setNewListName('')
    toggleAddListUi(!addListUi)
    getLists()
  }

  return (
    <div className="root">
      <div className="header">
        {boardEditUi ? (
          <form
            className="board-edit-form"
            onSubmit={async (e) => {
              e.preventDefault()
              await axios.put(
                `https://api.trello.com/1/boards/${boardId}?key=${key}&token=${token}`,
                { name: board.name }
              )
              toggleBoardEditUi(!boardEditUi)
            }}
          >
            <input
              type="text"
              data-testid="edit-board-input"
              className="custom-input"
              value={board.name}
              onChange={(e) =>
                setBoard({
                  lists: board.lists,
                  name: e.target.value
                })
              }
            />
            <div className="margin-start">
              <button type="submit" className="add-card-button">
                Update
              </button>
              <button
                className="cancel"
                onClick={() => toggleBoardEditUi(!boardEditUi)}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <h2
            className="text"
            data-testid="board-name"
            onClick={() => toggleBoardEditUi(!boardEditUi)}
          >
            {board.name}
          </h2>
        )}
      </div>
      <div className="list-container">
        {board.lists &&
          board.lists.map(({ id, name }) => (
            <List listId={id} name={name} key={id} getLists={getLists} />
          ))}
        <div className="add-list">
          {addListUi ? (
            <form onSubmit={(e) => _onSubmit(e)}>
              <textarea
                rows={3}
                cols={25}
                className="custom-input"
                placeholder="enter a title for this card"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
              />
              <div className="add-card-ui">
                <button className="add-card-button" type="submit">
                  Add Card
                </button>
                <button
                  className="cancel"
                  data-testid="cancel-button"
                  onClick={() => toggleAddListUi(!addListUi)}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <p
              className="text add-card"
              onClick={() => toggleAddListUi(!addListUi)}
            >
              + add a new list
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Board
