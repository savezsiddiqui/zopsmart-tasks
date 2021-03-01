import React, { useState } from 'react'
import axios from 'axios'
import { key, token } from '../config/config.json'

const Card = ({ name, cardId, getCards, setLoading, setError }) => {
  const [editUi, toggleEditUi] = useState(false)
  const [cardInput, setCardInput] = useState(name)
  const deleteCard = async () => {
    try {
      setLoading(true)
      await axios.delete(
        `https://api.trello.com/1/cards/${cardId}?key=${key}&token=${token}`
      )
      getCards()
    } catch (error) {
      setLoading(false)
      setError(error.message)
    }
  }

  const _onSubmit = async (e) => {
    try {
      e.preventDefault()
      await axios.put(
        `https://api.trello.com/1/cards/${cardId}?key=${key}&token=${token}`,
        { name: cardInput }
      )
      toggleEditUi(!editUi)
    } catch (error) {
      setError(error.message)
    }
  }

  return editUi ? (
    <div>
      <form onSubmit={(e) => _onSubmit(e)}>
        <textarea
          type="text"
          rows={3}
          cols={25}
          data-testid="edit-card-input"
          className="customInput"
          value={cardInput}
          onChange={(e) => setCardInput(e.target.value)}
        />
        <button type="submit" className="addCard__button">
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
          className="closeButton"
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
