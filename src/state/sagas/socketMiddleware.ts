/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { io } from 'socket.io-client'

let socket

const wsMiddleware = (store) => (next) => (action) => {
  switch (action.type) {
    case 'WS_JOIN_SESSION': {
      socket = io({ transports: ['websocket'] })
      socket.on(`votes/${action.payload.sessionId}`, (vote) => {
        next({ type: 'WS_UPDATE_TRACK', payload: vote })
      })
      socket.on(`tracks/${action.payload.sessionId}`, (track) => {
        next({ type: 'WS_ADD_TRACK', payload: track })
      })
      break
    }
    default:
      next(action)
  }
}

export default wsMiddleware
