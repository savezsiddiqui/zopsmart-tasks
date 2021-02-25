import React, { useState } from 'react'
import axios from 'axios'
import { key, token } from '../config/config.json'

const Card = ({ name, cardId, getCards }) => {
  const [editUi, toggleEditUi] = useState(false)
  const [cardInput, setCardInput] = useState(name)
  const deleteCard = async () => {
    await axios.delete(
      `https://api.trello.com/1/cards/${cardId}?key=${key}&token=${token}`
    )
    getCards()
  }

  const _onSubmit = async (e) => {
    e.preventDefault()
    await axios.put(
      `https://api.trello.com/1/cards/${cardId}?key=${key}&token=${token}`,
      { name: cardInput }
    )
    toggleEditUi(!editUi)
  }

  return editUi ? (
    <div>
      <form onSubmit={(e) => _onSubmit(e)}>
        <textarea
          type="text"
          rows={3}
          cols={25}
          data-testid="edit-card-input"
          className="custom-input"
          value={cardInput}
          onChange={(e) => setCardInput(e.target.value)}
        />
        <button type="submit" className="add-card-button">
          Update
        </button>
        <button className="cancel" onClick={() => toggleEditUi(!editUi)}>
          Cancel
        </button>
      </form>
    </div>
  ) : (
    <div className="card" key={cardId}>
      <div onClick={() => toggleEditUi(!editUi)}>
        <p className="text">{cardInput}</p>
      </div>
      <div>
        <button
          className="close-button"
          data-testid="delete-card-button"
          onClick={() => deleteCard()}
        >
          <i className="far fa-trash-alt"></i>
        </button>
      </div>
    </div>
  )
}

export default Card
