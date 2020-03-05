import React, { Component } from 'react'
import ToDoItem from './ToDoItem'
import PropTypes from 'prop-types'

class ToDos extends Component {
  render () {
    return this.props.todos.map((todo) => (
      <ToDoItem key={todo.id} todo={todo} toggleComplete={this.props.toggleComplete} removeToDoItem={this.props.removeToDoItem} />
    ))
  }
}

// PropTypes
ToDos.propTypes = {
  todos: PropTypes.array.isRequired
}

export default ToDos
