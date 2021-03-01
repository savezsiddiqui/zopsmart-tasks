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
    name: '',
    background: null
  })
  const [addListUi, toggleAddListUi] = useState(false)
  const [newListName, setNewListName] = useState('')
  const [boardEditUi, toggleBoardEditUi] = useState(false)
  const [isError, setError] = useState(null)
  const [isLoading, setLoading] = useState(true)

  const getLists = async () => {
    axios
      .all([
        axios.get(
          `https://api.trello.com/1/boards/${boardId}/lists?fields=name,idBoard&key=${key}&token=${token}`
        ),
        axios.get(
          `https://api.trello.com/1/boards/${boardId}?key=${key}&token=${token}`
        )
      ])
      .then(
        axios.spread((resp1, resp2) => {
          setBoard({
            lists: resp1.data,
            name: resp2.data.name,
            background: resp2.data.prefs.backgroundImage
          })
          setLoading(false)
        })
      )
      .catch((err) => {
        setLoading(false)
        setError(err.message)
      })
  }

  useEffect(() => {
    getLists()
  }, [])

  const _onSubmit = async (e) => {
    try {
      e.preventDefault()
      setLoading(true)
      await axios.post(
        `https://api.trello.com/1/lists?key=${key}&token=${token}&name=${newListName}&idBoard=${boardId}`
      )
      setNewListName('')
      toggleAddListUi(!addListUi)
      getLists()
    } catch (err) {
      setLoading(false)
      setError(err.message)
    }
  }

  if (isLoading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    )
  } else if (isError) {
    return (
      <div className="error">
        <div>
          <div className="alert"></div>
          <h3>{isError}</h3>
        </div>
      </div>
    )
  } else {
    return (
      <div
        className="root"
        style={
          board.background && { backgroundImage: `url(${board.background})` }
        }
      >
        <div className="header margin--start opacity-1">
          {boardEditUi ? (
            <form
              className="boardEditForm"
              onSubmit={async (e) => {
                try {
                  e.preventDefault()
                  await axios.put(
                    `https://api.trello.com/1/boards/${boardId}?key=${key}&token=${token}`,
                    { name: board.name }
                  )
                  toggleBoardEditUi(!boardEditUi)
                } catch (error) {
                  setError(error.message)
                }
              }}
            >
              <input
                type="text"
                data-testid="edit-board-input"
                className="customInput"
                value={board.name}
                onChange={(e) =>
                  setBoard({
                    lists: board.lists,
                    name: e.target.value
                  })
                }
              />
              <div className="margin--start">
                <button type="submit" className="addCard__button">
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
        <div className="list__container">
          {board.lists &&
            board.lists.map(({ id, name }) => (
              <List
                listId={id}
                name={name}
                key={id}
                getLists={getLists}
                isError
                setError={setError}
              />
            ))}
          <div className="addList">
            {addListUi ? (
              <form onSubmit={(e) => _onSubmit(e)}>
                <textarea
                  rows={3}
                  cols={25}
                  className="customInput"
                  placeholder="enter a title for this card"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                />
                <div className="addCard-ui">
                  <button className="addCard__button" type="submit">
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
                className="text addCard"
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
}

export default Board
