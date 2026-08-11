import { call, put, takeLatest, takeEvery, all, fork, select } from 'redux-saga/effects'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { ColumnConfig } from '@repo/types'
import { setCustomColumns, addColumn, removeColumn } from '@/redux/slices/columnsSlice'
import { getColumns, postCreateColumn, deleteColumn } from '@/api/columnApi'
import type { RootState } from '@/redux/store'

// ─── Action Types ─────────────────────────────────────────────────────────────

export const COLUMN_FETCH_REQUESTED = 'column/fetchRequested'
export const COLUMN_CREATE_REQUESTED = 'column/createRequested'
export const COLUMN_DELETE_REQUESTED = 'column/deleteRequested'
export const COLUMN_REQUEST_FAILED = 'column/requestFailed'

// ─── Selector ─────────────────────────────────────────────────────────────────

function* getUserId(): Generator<any, string | undefined, any> {
  return yield select((state: RootState) => state.user.id)
}

// ─── Worker Sagas ─────────────────────────────────────────────────────────────

function* fetchColumnsSaga() {
  try {
    const userId: string | undefined = yield call(getUserId)
    if (!userId) return

    const customCols: ColumnConfig[] = yield call(getColumns)
    yield put(setCustomColumns(customCols))
  } catch (error) {
    console.error('[columnSaga] fetch failed:', error)
    yield put({ type: COLUMN_REQUEST_FAILED, payload: (error as Error).message })
  }
}

function* createColumnSaga(action: PayloadAction<ColumnConfig>) {
  // Optimistic add already dispatched by the board page
  try {
    const userId: string | undefined = yield call(getUserId)
    if (!userId) {
      yield put(removeColumn({ id: action.payload.id }))
      return
    }

    const currentCols: ColumnConfig[] = yield select((s: RootState) => s.columns)
    const position = currentCols.length

    yield call(postCreateColumn, action.payload, position)
  } catch (error) {
    yield put(removeColumn({ id: action.payload.id }))
    console.error('[columnSaga] create failed:', error)
    yield put({ type: COLUMN_REQUEST_FAILED, payload: (error as Error).message })
  }
}

function* deleteColumnSaga(action: PayloadAction<ColumnConfig>) {
  // Optimistic remove — take a snapshot for rollback
  const snapshot = action.payload
  yield put(removeColumn({ id: snapshot.id })) //Redux

  try {
    const userId: string | undefined = yield call(getUserId)
    if (!userId) {
      yield put(addColumn(snapshot))
      return
    }

    yield call(deleteColumn, snapshot.id) //Db
  } catch (error) {
    // Roll back: restore the column
    yield put(addColumn(snapshot))
    console.error('[columnSaga] delete failed:', error)
    yield put({ type: COLUMN_REQUEST_FAILED, payload: (error as Error).message })
  }
}

// ─── Watcher Sagas ────────────────────────────────────────────────────────────

function* watchFetchColumns() { yield takeLatest(COLUMN_FETCH_REQUESTED, fetchColumnsSaga) }
function* watchCreateColumn() { yield takeEvery(COLUMN_CREATE_REQUESTED, createColumnSaga) }
function* watchDeleteColumn() { yield takeEvery(COLUMN_DELETE_REQUESTED, deleteColumnSaga) }

// ─── Column Root Saga ─────────────────────────────────────────────────────────

export default function* columnRootSaga() {
  yield all([
    fork(watchFetchColumns),
    fork(watchCreateColumn),
    fork(watchDeleteColumn),
  ])
}
