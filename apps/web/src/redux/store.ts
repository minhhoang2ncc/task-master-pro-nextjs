import { combineReducers, configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'
import { rememberReducer, rememberEnhancer } from 'redux-remember'
import rootSaga from '@/redux/saga/rootSaga'

import taskReducer from './slices/taskSlice'
import userReducer from './slices/userSlice'
import notifyReducer from './slices/notifySlice'
import languageReducer from './slices/languageSlice'

const sagaMiddleware = createSagaMiddleware()

const reducers = {
  tasks: taskReducer,
  user: userReducer,
  notify: notifyReducer,
  language: languageReducer,
}

const rootReducer = combineReducers(reducers)

const rememberedKeys = ['tasks', 'user', 'notify', 'language']

const reducer = rememberReducer(rootReducer)

// Safe storage fallback for SSR
const safeStorage =
  typeof window !== 'undefined'
    ? window.localStorage
    : {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
      }

const store = configureStore({
  reducer,
  enhancers: (getDefaultEnhancers) =>
    getDefaultEnhancers().concat(
      rememberEnhancer(safeStorage, rememberedKeys)
    ),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(sagaMiddleware) as any,
})

if (typeof window !== 'undefined') {
  sagaMiddleware.run(rootSaga)
}

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
