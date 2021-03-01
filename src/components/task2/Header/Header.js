import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const Header = ({ boards, setFilteredBoards, searchVisible = true }) => {
  const [searchUi, toggleSearchUi] = useState(false)
  return (
    <div>
      <div className="header">
        <div className="header__container">
          <div className="header__icons">
            <i className="fas fa-th"></i>
          </div>
          <div className="header__icons">
            <i className="fas fa-home"></i>
          </div>
          <Link to={'../boards'} className="header__icons d-sm">
            <i className="fa fa-trello"></i>
            <p className="header__p">Boards</p>
          </Link>
          {searchVisible && (
            <div className="header__icons">
              <i
                className="fas fa-search"
                onClick={() => toggleSearchUi(!searchUi)}
                data-testid="search-button"
              ></i>
            </div>
          )}
        </div>
        <div className="header__logo">
          <i className="fa fa-trello"></i>
          <p className="header__p">Trello</p>
        </div>
        <div className="header__container">
          <div className="header__icons">
            <i className="fas fa-plus"></i>
          </div>
          <div className="header__icons d-sm">
            <i className="fas fa-exclamation-circle"></i>
          </div>
          <div className="header__icons red">
            <i className="far fa-bell"></i>
          </div>
          <div className="header__icons--circle">SS</div>
        </div>
      </div>
      {searchUi && (
        <div className="search__wrapper">
          <input
            type="text"
            className="customInput"
            placeholder="filter boards"
            onChange={(e) => {
              const newFilteredBoards = boards.filter(({ name }) =>
                name.toLowerCase().includes(e.target.value.toLowerCase())
              )
              setFilteredBoards(newFilteredBoards)
            }}
          />
        </div>
      )}
    </div>
  )
}

export default Header
