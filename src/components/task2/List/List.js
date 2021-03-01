import React, { useState, useEffect } from 'react'
import { key, token } from '../config/config.json'
import Card from '../Card/Card'
import axios from 'axios'

const List = ({ name, listId, getLists, setError }) => {
  const [cardlist, setCardlist] = useState(null)
  const [listName, setListName] = useState(name)
  const [cardName, setCardName] = useState('')
  const [listEditUi, toggleListEditUi] = useState(false)
  const [addCardVisibility, toggleAddCardVisibility] = useState(false)
  const [isLoading, setLoading] = useState(false)

  const getCards = async () => {
    try {
      const resp = await axios.get(
        `https://api.trello.com/1/lists/${listId}/cards?fields=name&key=${key}&token=${token}`
      )
      setCardlist(resp.data)
      setLoading(false)
    } catch (err) {
      setLoading(false)
      setError(err.message)
    }
  }

  useEffect(() => {
    getCards()
  }, [])

  const _onSubmit = async (e) => {
    try {
      setLoading(true)
      e.preventDefault()
      await axios.post(
        `https://api.trello.com/1/cards?key=${key}&token=${token}&idList=${listId}`,
        { name: cardName }
      )
      setCardName('')
      toggleAddCardVisibility(!addCardVisibility)
      getCards()
    } catch (err) {
      setLoading(false)
      setError(err.message)
    }
  }

  const archiveList = async (listId) => {
    try {
      setLoading(true)
      await axios.put(
        `https://api.trello.com/1/lists/${listId}/closed?key=${key}&token=${token}`,
        { value: true }
      )
      getLists()
    } catch (err) {
      setLoading(false)
      setError(err.message)
    }
  }
  if (isLoading) {
    return (
      <div className="list">
        <div className="loading__div">
          <div className="spinner"></div>
        </div>
      </div>
    )
  } else {
    return (
      <div className="list" key={listId}>
        <div>
          {listEditUi ? (
            <form
              onSubmit={async (e) => {
                try {
                  e.preventDefault()
                  await axios.put(
                    `https://api.trello.com/1/lists/${listId}?key=${key}&token=${token}`,
                    { name: listName }
                  )
                  toggleListEditUi(!listEditUi)
                } catch (error) {
                  setError(error.message)
                }
              }}
            >
              <input
                type="text"
                className="customInput"
                data-testid="list-edit-input"
                value={listName}
                onChange={(e) => setListName(e.target.value)}
              />
              <button type="submit" className="addCard__button">
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
                className="closeButton"
                data-testid="archive-list-button"
                onClick={() => archiveList(listId)}
              >
                <i className="far fa-trash-alt"></i>
              </button>
              <p
                className="text list__title"
                data-testid="list-name"
                onClick={() => toggleListEditUi(!listEditUi)}
              >
                {listName}
              </p>
            </div>
          )}
        </div>

        <div className="card__container">
          {cardlist &&
            cardlist.map(({ id, name }) => (
              <Card
                key={id}
                name={name}
                cardId={id}
                refresh
                getCards={getCards}
                setLoading={setLoading}
                setError={setError}
              />
            ))}
        </div>
        {addCardVisibility ? (
          <form onSubmit={(e) => _onSubmit(e)}>
            <textarea
              rows={3}
              cols={25}
              className="customInput"
              placeholder="enter a title for this card"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
            />
            <div className="addCard-ui">
              <button className="addCard__button" type="submit">
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
            className="addCard"
            onClick={() => toggleAddCardVisibility(!addCardVisibility)}
          >
            + add another card
          </button>
        )}
      </div>
    )
  }
}

export default List
