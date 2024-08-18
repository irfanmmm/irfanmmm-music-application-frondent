import { configureStore } from '@reduxjs/toolkit'
import store from './reducer'

export default configureStore({
  reducer: {
    store
  },
})