import React, { Component } from 'react'

export class AddToDo extends Component {
  state = {
    title: ''
  }

  onChange = (e) => this.setState({ [e.target.name]: e.target.value })

  onSubmit = (e) => {
    e.preventDefault()
    this.props.addToDoItem(this.state.title)
    this.setState({ title: '' })
  }

  render () {
    return (
      <form onSubmit={this.onSubmit} style={{ display: 'flex' }}>
        <input
          type='text'
          name='title'
          placeholder='Add to do item:'
          style={{ flex: '10', padding: '5px' }}
          value={this.state.value}
          onChange={this.onChange}
        />
        <input
          type='submit'
          value='Submit'
          className='btn'
          style={{ flex: '1' }}
        />
      </form>
    )
  }
}

export default AddToDo
