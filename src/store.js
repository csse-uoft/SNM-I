import { createStore, applyMiddleware } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import thunkMiddleware from 'redux-thunk'
import { rootReducer } from './store/reducers.js'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web

const persistConfig = {
  key: 'root',
  storage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export default function configureStore(preloadedState) {
  let store = createStore(
    persistedReducer,
    preloadedState,
    applyMiddleware(thunkMiddleware)
  )
  let persistor = persistStore(store)
  return { store, persistor }
}
