import React, { useContext } from 'react'
import { searchUsers } from 'api'

const POLL_INTERVAL = 10000

const UsersContext = React.createContext({
  users: [],
  usersById: {},
  updateUsers: () => { }
});

export class UsersProvider extends React.Component {
  state = {
    updating: false,
    queued: false,
    users: []
  }

  componentWillMount() {
    this.updateUsers()
    // const poll = () => this.updateUsers(false)
    // this.interval = setInterval(poll, POLL_INTERVAL)
  }

  componentWillUnmount() {
    this.umounted = true
    clearInterval(this.interval)
  }

  updateUsers = (queue = true) => {
    if (this.unmounted) return
    if (this.updating) {
      if (queue) this.setState({ queued: true })
      return
    }

    this.setState({ updating: true })

    return searchUsers()
      .then(users => {
        if (this.unmounted) return
        this.setState({ updating: false, users })
        if (this.state.queued) {
          this.setState({ queued: false })
          this.updateUsers(false)
        }
        return users
      })
  }

  render() {
    const { users } = this.state

    const usersById = {}
    users.forEach(user => {
      usersById[user.id] = user
    })

    return (
      <UsersContext.Provider value={{ updateUsers: this.updateUsers, users, usersById }}>
        {this.props.children}
      </UsersContext.Provider>
    )
  }
}

const useUsers = () => useContext(UsersContext);

export default useUsers