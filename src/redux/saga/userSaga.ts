import { call, put, takeLatest, all, fork } from 'redux-saga/effects'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { UpdateUserPayload } from '@/shared/types/user'
import { UserSchema } from '@/shared/types/user'
import { NotificationSettingsSchema } from '@/shared/types/setting'
import { setUser, updateUser } from '@/redux/slices/userSlice'
import { updateLanguageSettings } from '../slices/languageSlice'
import { updateNotificationSettings } from '../slices/notifySlice'
import { fetchUser as fetchUserApi, updateUser as updateUserApi } from '@/api/userApi'

// ─── Action Types ─────────────────────────────────────────────────────────────

export const USER_FETCH_REQUESTED = 'user/fetchRequested'
export const USER_UPDATE_REQUESTED = 'user/updateRequested'
export const USER_REQUEST_FAILED = 'user/requestFailed'

// ─── Worker Sagas ─────────────────────────────────────────────────────────────

function* fetchUserSaga(action: PayloadAction<string | number>) {
  try {
    const user: UpdateUserPayload = yield call(fetchUserApi, action.payload)
    console.log('user', UserSchema.parse(user))
    yield put(setUser(UserSchema.parse(user)))
    console.log('notify', updateNotificationSettings(NotificationSettingsSchema.parse(user)))
    yield put(updateNotificationSettings(NotificationSettingsSchema.parse(user)))
    console.log('language', user.languageDisplay)
    yield put(updateLanguageSettings(user.languageDisplay))
  } catch (error) {
    console.error('🔴 fetchUserSaga error:', error)
    yield put({ type: USER_REQUEST_FAILED, payload: (error as Error).message })
  }
}

function* updateUserSaga(action: PayloadAction<UpdateUserPayload>) {
  try {
    const { emailNotifications, languageDisplay, browserNotifications, ...user } = action.payload
    yield call(updateUserApi, action.payload)
    yield put(updateUser(user))
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
