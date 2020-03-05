import React, { Component } from 'react'
import PropTypes from 'prop-types'

class ToDoItem extends Component {
    setStyle = () => {
      return {
        textDecoration: this.props.todo.completed ? 'line-through' : 'none',
        backgroundColor: this.props.todo.completed ? '#cba135' : '#f3efe0',
        padding: '5px',
        margin: '5px',
        borderBottom: '1px #ccc dotted'
      }
    }

    render () {
      const { id, title, completed } = this.props.todo
      return (
        <div style={this.setStyle()}>
          <p key={id}>
            <input type='checkbox' checked={completed} onChange={this.props.toggleComplete.bind(this, id)} /> {' '}
            {title}
            <button style={btnStyle} onClick={this.props.removeToDoItem.bind(this, id)}>x</button>
          </p>
        </div>
      )
    }
}

const btnStyle = {
  background: '#ff0000',
  color: '#ffffff',
  border: 'none',
  padding: '5px 9px',
  borderRadius: '50%',
  cursor: 'pointer',
  float: 'right'
}

// PropTypes
ToDoItem.propTypes = {
  todo: PropTypes.object.isRequired
}

export default ToDoItem
