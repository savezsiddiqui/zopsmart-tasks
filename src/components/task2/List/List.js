import React, { useState, useEffect } from 'react'
import { key, token } from '../config/config.json'
import Card from '../Card/Card'
import axios from 'axios'

const List = ({ name, listId, getLists }) => {
  const [cardlist, setCardlist] = useState(null)
  const [listName, setListName] = useState(name)
  const [cardName, setCardName] = useState('')
  const [listEditUi, toggleListEditUi] = useState(false)
  const [addCardVisibility, toggleAddCardVisibility] = useState(false)

  const getCards = async () => {
    const resp = await axios.get(
      `https://api.trello.com/1/lists/${listId}/cards?fields=name&key=${key}&token=${token}`
    )
    setCardlist(resp.data)
  }

  useEffect(() => {
    getCards()
  }, [])

  const _onSubmit = async (e) => {
    e.preventDefault()
    await axios.post(
      `https://api.trello.com/1/cards?key=${key}&token=${token}&idList=${listId}`,
      { name: cardName }
    )
    setCardName('')
    toggleAddCardVisibility(!addCardVisibility)
    getCards()
  }

  const archiveList = async (listId) => {
    await axios.put(
      `https://api.trello.com/1/lists/${listId}/closed?key=${key}&token=${token}`,
      { value: true }
    )
    getLists()
  }

  return (
    <div className="list" key={listId}>
      <div>
        {listEditUi ? (
          <form
            onSubmit={async (e) => {
              e.preventDefault()
              await axios.put(
                `https://api.trello.com/1/lists/${listId}?key=${key}&token=${token}`,
                { name: listName }
              )
              toggleListEditUi(!listEditUi)
            }}
          >
            <input
              type="text"
              className="custom-input"
              data-testid="list-edit-input"
              value={listName}
              onChange={(e) => setListName(e.target.value)}
            />
            <button type="submit" className="add-card-button">
              Update
            </button>
            <button
              className="cancel"
              onClick={() => toggleListEditUi(!listEditUi)}
            >
              Cancel
            </button>
          </form>
        ) : (
          <div>
            <button
              className="close-button"
              data-testid="archive-list-button"
              onClick={() => archiveList(listId)}
            >
              <i className="far fa-trash-alt"></i>
            </button>
            <p
              className="text list-title"
              data-testid="list-name"
              onClick={() => toggleListEditUi(!listEditUi)}
            >
              {listName}
            </p>
          </div>
        )}
      </div>

      <div className="card-container">
        {cardlist &&
          cardlist.map(({ id, name }) => (
            <Card
              key={id}
              name={name}
              cardId={id}
              refresh
              getCards={getCards}
            />
          ))}
      </div>
      {addCardVisibility ? (
        <form onSubmit={(e) => _onSubmit(e)}>
          <textarea
            rows={3}
            cols={25}
            className="custom-input"
            placeholder="enter a title for this card"
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
          />
          <div className="add-card-ui">
            <button className="add-card-button" type="submit">
              Add Card
            </button>
            <button
              className="cancel"
              data-testid="cancel-button"
              onClick={() => toggleAddCardVisibility(!addCardVisibility)}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          className="add-card"
          onClick={() => toggleAddCardVisibility(!addCardVisibility)}
        >
          + add another card
        </button>
      )}
    </div>
  )
}

export default List
