import { createStore, applyMiddleware } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import thunkMiddleware from 'redux-thunk'
import { rootReducer } from './store/reducers.js'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import { logout } from './store/actions/authAction.js';


const persistConfig = {
  key: 'root',
  storage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer)
const authMiddleware = store => next => action => {
  const user = store.getState()['auth']['currentUser']
  if (action.type !== 'LOGGED_OUT' && user && new Date() > user.expired_at) {
    store.dispatch(logout(true))
  }
  return next(action);
}

export default function configureStore(preloadedState) {
  let store = createStore(
    persistedReducer,
    preloadedState,
    applyMiddleware(thunkMiddleware, authMiddleware)
  )
  let persistor = persistStore(store)
  return { store, persistor }
}
