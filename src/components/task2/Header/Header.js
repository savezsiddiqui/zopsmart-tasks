import React, { useState } from 'react'

const Header = ({ boards, setFilteredBoards }) => {
  const [searchUi, toggleSearchUi] = useState(false)
  return (
    <div>
      <div className="header">
        <div className="header-container">
          <div className="header__icons">
            <i className="fas fa-th"></i>
          </div>
          <div className="header__icons">
            <i className="fas fa-home"></i>
          </div>
          <div className="header__icons d-sm">
            <i className="fa fa-trello"></i>
            <p className="header__p">Boards</p>
          </div>
          <div className="header__icons">
            <i
              className="fas fa-search"
              onClick={() => toggleSearchUi(!searchUi)}
              data-testid="search-button"
            ></i>
          </div>
        </div>
        <div className="header-logo">
          <i className="fa fa-trello"></i>
          <p className="header__p">Trello</p>
        </div>
        <div className="header-container">
          <div className="header__icons">
            <i className="fas fa-plus"></i>
          </div>
          <div className="header__icons d-sm">
            <i className="fas fa-exclamation-circle"></i>
          </div>
          <div className="header__icons red">
            <i className="far fa-bell"></i>
          </div>
          <div className="header__icons__circle">SS</div>
        </div>
      </div>
      {searchUi && (
        <div className="search-wrapper">
          <input
            type="text"
            className="custom-input"
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
