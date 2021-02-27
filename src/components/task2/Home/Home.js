import React, { useState, useEffect } from 'react'
import { token, key } from '../config/config.json'
import { Link } from 'react-router-dom'
import Header from '../Header/Header'
import axios from 'axios'
import '../task2.css'

const Home = () => {
  const [boards, setBoards] = useState(null)
  const [boardUi, toggleBoardUi] = useState(false)
  const [newBoardName, setNewBoardName] = useState('')
  const [filteredBoards, setFilteredBoards] = useState(boards)
  const getBoards = async () => {
    const resp = await axios.get(
      `https://api.trello.com/1/members/me/boards?key=${key}&token=${token}`
    )
    setBoards(resp.data)
    setFilteredBoards(resp.data)
  }

  useEffect(() => {
    getBoards()
  }, [])

  return (
    <div className="root">
      <Header setFilteredBoards={setFilteredBoards} boards={boards} />
      <div className="board-container">
        {filteredBoards &&
          filteredBoards.map(({ name, id, prefs: { backgroundImage } }) => (
            <div
              className="board"
              style={{
                backgroundImage: `url(${backgroundImage})`
              }}
              key={id}
            >
              <Link to={`/board/${id}`} className="board-link">
                <p className="text">{name}</p>
              </Link>
              <div>
                <button
                  className="close-button"
                  data-testid="delete-board-button"
                  onClick={async () => {
                    const agree = confirm(
                      `board ${name} will be deleted. Are you Sure ?`
                    )
                    if (agree) {
                      await axios.delete(
                        `https://api.trello.com/1/boards/${id}?key=${key}&token=${token}`
                      )
                      getBoards()
                    }
                  }}
                >
                  <i className="far fa-trash-alt"></i>
                </button>
              </div>
            </div>
          ))}

        {boardUi ? (
          <form
            className="add-board-card"
            onSubmit={async (e) => {
              e.preventDefault()
              await axios.post(
                `https://api.trello.com/1/boards/?key=${key}&token=${token}&name=${newBoardName}`
              )
              setNewBoardName('')
              toggleBoardUi(!boardUi)
              getBoards()
            }}
          >
            <input
              type="text"
              data-testid="add-board-input"
              className="custom-input"
              value={newBoardName}
              onChange={(e) => setNewBoardName(e.target.value)}
            />
            <div>
              <button type="submit" className="add-card-button">
                Add Board
              </button>
              <button
                className="cancel"
                onClick={() => toggleBoardUi(!boardUi)}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="board">
            <p className="text" onClick={() => toggleBoardUi(!boardUi)}>
              + add board
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home
