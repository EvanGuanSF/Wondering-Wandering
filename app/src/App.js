// NPM modules
import React, { Component } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import * as uuid from 'uuid'

// CSS
import './App.css'

// Views
import Navbar from './components/layout/navbar/Navbar'
import Footer from './components/layout/footer/Footer'
import Portfolio from './components/pages/portfolio/Portfolio'
import Guestbook from './components/pages/guestbook/Guestbook'
import Login from './components/pages/login/Login'
import Registration from './components/pages/registration/Registration'
// import ToDos from './components/ToDos'
// import AddToDo from './components/AddToDo'

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
    ],
    isShowingAboutMe: true
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

  setIsShowingAboutMe = (isShowing) => {
    this.setState({ isShowingAboutMe: isShowing })
  }

  render () {
    return (
      <div className='App'>
        <div className='container col-12' style={{ margin: '0 0 0 0', padding: '0 0 0 0', width: '100%' }}>
          <Router>
            <Navbar
              isShowingAboutMe={this.state.isShowingAboutMe}
              setIsShowingAboutMe={this.setIsShowingAboutMe}
            />

            <Route
              exact path='/'
              render={() => (
                <Portfolio
                  isShowingAboutMe={this.state.isShowingAboutMe}
                  setIsShowingAboutMe={this.setIsShowingAboutMe}
                >
                </Portfolio>
                )
              }
            >
            </Route>

            <Route
              exact path='/guestbook'
              component={Guestbook}
            >
            </Route>

            <Route
              exact path='/login'
              component={Login}
            >
            </Route>

            <Route
              exact path='/register'
              component={Registration}
            >
            </Route>

            <Footer />
          </Router>
        </div>
      </div>
    )
  }
}

export default App
