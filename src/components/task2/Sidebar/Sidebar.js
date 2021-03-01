import React from 'react'

const Sidebar = () => {
  return (
    <div className="sidebar d-sm">
      <div>
        <div>
          <i className="fa fa-trello p-1"></i>Boards
        </div>
        <div>
          <i className="fa fa-trello p-1"></i>Template
        </div>
        <div>
          <i className="fas fa-wave-square p-1"></i>Home
        </div>
      </div>
      <div className="sidebar__teams">
        <div>TEAMS</div>
        <div className="font--lg">+</div>
      </div>
      <div className="sidebar__workspace">
        <div className="flex__row">
          <i className="fas fa-user-friends p-1"></i>
          <div>
            Savez Siddiqui&apos;s <br />
            Workspace
          </div>
        </div>
        <i className="fas fa-chevron-down p-1"></i>
      </div>
      <div className="sidebar__bottom">
        <div>
          <i className="far fa-check-square p-1"></i>Getting started
        </div>
        <div>
          <i className="fa fa-trello p-1"></i>Boards
        </div>
        <div>
          <i className="far fa-heart p-1"></i>Highlights
        </div>
        <div>
          <i className="fas fa-table p-1"></i>Team Table
        </div>
        <div>
          <i className="fas fa-user-friends p-1"></i>Members
        </div>
        <div>
          <i className="fas fa-cog p-1"></i>Settings
        </div>
      </div>
    </div>
  )
}

export default Sidebar
