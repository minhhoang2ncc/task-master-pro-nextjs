import { call, put, takeLatest, all, fork } from 'redux-saga/effects'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { User } from '@/shared/type'
import { setUser, updateUser } from '@/redux/slices/userSlice'
import { fetchUser as fetchUserApi, updateUser as updateUserApi } from '@/api/userApi'

// ─── Action Types ─────────────────────────────────────────────────────────────

export const USER_FETCH_REQUESTED = 'user/fetchRequested'
export const USER_UPDATE_REQUESTED = 'user/updateRequested'
export const USER_REQUEST_FAILED = 'user/requestFailed'

// ─── Worker Sagas ─────────────────────────────────────────────────────────────

function* fetchUserSaga(action: PayloadAction<string | number>) {
  try {
    const user: User = yield call(fetchUserApi, action.payload)
    yield put(setUser(user))
  } catch (error) {
    yield put({ type: USER_REQUEST_FAILED, payload: (error as Error).message })
  }
}

function* updateUserSaga(action: PayloadAction<Partial<User>>) {
  try {
    const updatedUser: User = yield call(updateUserApi, action.payload)
    console.log(updatedUser)
    yield put(updateUser(action.payload))
  } catch (error) {
    yield put({ type: USER_REQUEST_FAILED, payload: (error as Error).message })
  }
}

// ─── Watcher Sagas ────────────────────────────────────────────────────────────

function* watchFetchUser() { yield takeLatest(USER_FETCH_REQUESTED, fetchUserSaga) }
function* watchUpdateUser() { yield takeLatest(USER_UPDATE_REQUESTED, updateUserSaga) }

// ─── User Root Saga ───────────────────────────────────────────────────────────

export default function* userRootSaga() {
  yield all([
    fork(watchFetchUser),
    fork(watchUpdateUser),
  ])
}
