/* eslint-disable react/prop-types */
import React, { Component } from 'react'
import TodoStyles from '../Todo.module.css'
class Card extends Component {
  constructor(props) {
    super(props)
    this.state = {
      editUi: false,
      text: this.props.text
    }
  }

  _onKeyDown = (e) => {
    if (e.key === 'Enter' && this.state.text.length > 0) {
      this.props.editFn(this.state.text)
      this.setState({
        editUi: !this.state.editUi
      })
    }
  }

  render() {
    return (
      <div className={TodoStyles.card}>
        <div className={TodoStyles['todo-wrapper']}>
          {this.state.editUi ? (
            <div className={TodoStyles.todo}>
              <input
                className={TodoStyles['custom-input']}
                data-testid="edit-input"
                value={this.state.text}
                onChange={(e) =>
                  this.setState({
                    text: e.target.value
                  })
                }
                onKeyDown={this._onKeyDown}
              />
            </div>
          ) : (
            <div
              className={TodoStyles.todo}
              onClick={() => this.props.checkFn()}
            >
              {this.props.checked ? (
                <i className={`far ${TodoStyles.far} fa-check-circle`}></i>
              ) : (
                <i className={`far ${TodoStyles.far} fa-circle`}></i>
              )}
              {this.props.checked ? (
                <p>
                  <strike data-testid="strike-through">
                    {this.props.text}
                  </strike>
                </p>
              ) : (
                <p>{this.props.text}</p>
              )}
            </div>
          )}

          <div className={TodoStyles.options}>
            <i
              className={`far ${TodoStyles.far} ${TodoStyles['fa-trash-alt']} fa-trash-alt`}
              data-testid="delete-button"
              onClick={() => this.props.delFn()}
            ></i>
            <i
              className={`fas ${TodoStyles.fas} ${TodoStyles['fa-pencil-alt']} fa-pencil-alt`}
              onClick={() =>
                this.setState({
                  editUi: !this.state.editUi
                })
              }
              data-testid="edit-button"
            ></i>
          </div>
        </div>
      </div>
    )
  }
}

export default Card
