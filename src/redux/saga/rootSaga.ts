import { all, fork } from 'redux-saga/effects'
import taskRootSaga from '@/redux/saga/taskSaga'
import userRootSaga from '@/redux/saga/userSaga'

// ─── Root Saga ────────────────────────────────────────────────────────────────

export default function* rootSaga() {
  yield all([
    fork(taskRootSaga),
    fork(userRootSaga),
  ])
}
