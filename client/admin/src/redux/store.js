import { configureStore } from '@reduxjs/toolkit'
import crudReducer from './crud-slice'

// Se cargan las situaciones donde va a haber comunicación entre componentes.
export const store = configureStore({
  reducer: {
    crud: crudReducer
  }
})

export default store
