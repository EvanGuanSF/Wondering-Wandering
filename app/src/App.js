import React, { Component } from 'react'
import './App.css'
import Navbar from './components/layout/navbar/Navbar'
import Footer from './components/layout/footer/Footer'
import Portfolio from './components/pages/portfolio/Portfolio'
// import ToDos from './components/ToDos'
// import AddToDo from './components/AddToDo'
import * as uuid from 'uuid'

class App extends Component {
  state = {
    todos: [
      {
        id: uuid.v4(),
        title: 'Do this first.',
        completed: true
      },
      {
        id: uuid.v4(),
        title: 'Do this next.',
        completed: false
      },
      {
        id: uuid.v4(),
        title: 'Do this last.',
        completed: false
      }
    ]
  }

  // Toggle a todo checklist item.
  toggleComplete = (id) => {
    console.log('Hello from: ' + id)

    this.setState({
      todos: this.state.todos.map((todo) => {
        if (todo.id === id) {
          todo.completed = !todo.completed
        }
        return todo
      })
    })
  }

  // Remove a todo checklist item.
  removeToDoItem = (id) => {
    console.log('Removing item: ' + id)
    this.setState({
      // Expand the todos in the state, and return any objects in the array where the id does not match the item
      // that we no longer want to be shown.
      todos: this.state.todos.filter(todo => todo.id !== id)
    })
  }

  // Add to do item to the list.
  addToDoItem = (title) => {
    console.log('Adding new item to the list: ' + title)

    const newToDoItem = {
      id: uuid.v4(),
      title: title,
      completed: false
    }

    this.setState({
      todos: [...this.state.todos, newToDoItem]
    })
  }

  render () {
    return (
      <div className='App'>
        <div className='container col-12' style={{ margin: '0 0 0 0', padding: '0 0 0 0', width: '100%' }}>
          <Navbar />
          <Portfolio />
          <Footer />
          {/* <AddToDo addToDoItem={this.addToDoItem} />
          <ToDos todos={this.state.todos} toggleComplete={this.toggleComplete} removeToDoItem={this.removeToDoItem} /> */}
        </div>
      </div>
    )
  }
}

export default App
