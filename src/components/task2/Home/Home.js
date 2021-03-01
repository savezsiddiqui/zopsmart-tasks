import React, { useState, useEffect } from 'react'
import { token, key } from '../config/config.json'
import { Link } from 'react-router-dom'
import Header from '../Header/Header'
import Sidebar from '../Sidebar/Sidebar'
import axios from 'axios'
import '../task2.css'

const Home = () => {
  const [boards, setBoards] = useState(null)
  const [boardUi, toggleBoardUi] = useState(false)
  const [newBoardName, setNewBoardName] = useState('')
  const [filteredBoards, setFilteredBoards] = useState(boards)
  const getBoards = async () => {
    try {
      const resp = await axios.get(
        `https://api.trello.com/1/members/me/boards?key=${key}&token=${token}`
      )
      setBoards(resp.data)
      setFilteredBoards(resp.data)
    } catch (err) {
      console.log(err.message)
    }
  }

  useEffect(() => {
    getBoards()
  }, [])

  return (
    <div className="root">
      <Header setFilteredBoards={setFilteredBoards} boards={boards} />
      <div className="flex__row">
        <Sidebar />
        <div className="board__container">
          {filteredBoards &&
            filteredBoards.map(({ name, id, prefs: { backgroundImage } }) => (
              <div
                className="board"
                style={{
                  backgroundImage: `url(${backgroundImage})`
                }}
                key={id}
              >
                <Link to={`/board/${id}`} className="board__link">
                  <p className="text">{name}</p>
                </Link>
                <div>
                  <button
                    className="closeButton"
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
              className="addBoard__card "
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
                className="customInput"
                value={newBoardName}
                onChange={(e) => setNewBoardName(e.target.value)}
              />
              <div>
                <button type="submit" className="addCard__button">
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
    </div>
  )
}

export default Home
