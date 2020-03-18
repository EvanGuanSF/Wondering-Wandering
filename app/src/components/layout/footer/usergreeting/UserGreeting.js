import React, { useContext } from 'react'
import LoginContext from '../../../../context/LoginState'

export const UserGreeting = () => {
  const loginState = useContext(LoginContext)

  if (loginState.userName !== null && loginState.userName !== undefined && loginState.userName !== '') {
    return (
      <div className='col grow justify-content-center text-center' style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
        <p id='userGreeting' style={{ verticalAlign: 'middle' }}>Hello {loginState.userName}!</p>
      </div>
    )
  } else {
    return (
      <div className='col grow justify-content-center text-center' style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
        <p id='userGreeting' style={{ verticalAlign: 'middle' }} />
      </div>
    )
  }
  // return (
  //   <div className='col grow justify-content-center text-center' style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
  //     <p id='userGreeting' style={{ verticalAlign: 'middle' }} />
  //   </div>
  // )
}

export default UserGreeting
