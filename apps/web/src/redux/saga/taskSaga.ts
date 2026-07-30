import { call, put, takeLatest, takeEvery, all, fork, select } from 'redux-saga/effects'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { TaskRecord } from '@repo/types'
import { append, remove, modify, setTasks, upsertTask } from '@/redux/slices/taskSlice'
import {
  getTasks,
  getTaskById,
  postCreateTask,
  postSaveTask,
  deleteTask as deleteTaskApi,
} from '@/api/taskApi'
import type { RootState } from '@/redux/store'

// ─── Action Types ─────────────────────────────────────────────────────────────

export const TASK_FETCH_ALL_REQUESTED = 'task/fetchAllRequested'
export const TASK_FETCH_BY_ID_REQUESTED = 'task/fetchByIdRequested'
export const TASK_CREATE_REQUESTED = 'task/createRequested'
export const TASK_SAVE_REQUESTED = 'task/saveRequested'
export const TASK_DELETE_REQUESTED = 'task/deleteRequested'
export const TASK_REQUEST_FAILED = 'task/requestFailed'

// ─── Selector ─────────────────────────────────────────────────────────────────

function* getUserId(): Generator<any, string | undefined, any> {
  const userId: string | undefined = yield select((state: RootState) => state.user.id)
  return userId
}

// ─── Worker Sagas ─────────────────────────────────────────────────────────────

function* fetchAllTasksSaga() {
  try {
    const userId: string | undefined = yield call(getUserId)
    if (!userId) return // not authenticated yet
    const tasks: TaskRecord[] = yield call(getTasks, userId)
    yield put(setTasks(tasks))
  } catch (error) {
    yield put({ type: TASK_REQUEST_FAILED, payload: (error as Error).message })
  }
}

function* fetchTaskByIdSaga(action: PayloadAction<string | number>) {
  try {
    const userId: string | undefined = yield call(getUserId)
    if (!userId) return
    const task: TaskRecord = yield call(getTaskById, action.payload, userId)
    yield put(upsertTask(task))
  } catch (error) {
    yield put({ type: TASK_REQUEST_FAILED, payload: (error as Error).message })
  }
}

function* createTaskSaga(action: PayloadAction<TaskRecord>) {
  // Optimistic update — show the task in the UI immediately
  yield put(append(action.payload))
  try {
    const userId: string | undefined = yield call(getUserId)
    if (!userId) {
      // Roll back optimistic update if not authenticated
      yield put(remove({ id: action.payload.id }))
      return
    }
    // Call the API and replace the optimistic record with the server-confirmed one
    const confirmed: TaskRecord = yield call(postCreateTask, action.payload, userId)
    console.log('confirm', confirmed)
    // If the server returned a different id (e.g. from a UUID generated server-side),
    // remove the optimistic record and upsert the real one.
    if (confirmed.id !== action.payload.id) {
      yield put(remove({ id: action.payload.id }))
    }
    yield put(upsertTask(confirmed))
  } catch (error) {
    // Roll back on failure
    yield put(remove({ id: action.payload.id }))
    yield put({ type: TASK_REQUEST_FAILED, payload: (error as Error).message })
  }
}

function* saveTaskSaga(action: PayloadAction<TaskRecord>) {
  // Optimistically apply local changes so the UI stays snappy
  yield put(modify(action.payload))
  try {
    const userId: string | undefined = yield call(getUserId)
    if (!userId) return
    // Persist to Supabase and get the server-confirmed record (includes synced subtasks)
    const confirmed: TaskRecord = yield call(postSaveTask, action.payload, userId)
    // Replace the local record with the authoritative server copy
    yield put(upsertTask(confirmed))
  } catch (error) {
    yield put({ type: TASK_REQUEST_FAILED, payload: (error as Error).message })
  }
}

function* deleteTaskSaga(action: PayloadAction<TaskRecord>) {
  // Optimistically remove from UI immediately
  yield put(remove({ id: action.payload.id }))
  try {
    const userId: string | undefined = yield call(getUserId)
    if (!userId) {
      // Roll back if not authenticated
      yield put(append(action.payload))
      return
    }
    yield call(deleteTaskApi, action.payload.id, userId)
  } catch (error) {
    // Roll back on failure
    yield put(append(action.payload))
    yield put({ type: TASK_REQUEST_FAILED, payload: (error as Error).message })
  }
}

// ─── Watcher Sagas ────────────────────────────────────────────────────────────

function* watchFetchAllTasks() { yield takeLatest(TASK_FETCH_ALL_REQUESTED, fetchAllTasksSaga) }
function* watchFetchTaskById() { yield takeLatest(TASK_FETCH_BY_ID_REQUESTED, fetchTaskByIdSaga) }
// takeEvery so that creating multiple tasks in quick succession doesn't cancel prior creates
function* watchCreateTask() { yield takeEvery(TASK_CREATE_REQUESTED, createTaskSaga) }
function* watchSaveTask() { yield takeLatest(TASK_SAVE_REQUESTED, saveTaskSaga) }
function* watchDeleteTask() { yield takeEvery(TASK_DELETE_REQUESTED, deleteTaskSaga) }

// ─── Task Root Saga ───────────────────────────────────────────────────────────

export default function* taskRootSaga() {
  yield all([
    fork(watchFetchAllTasks),
    fork(watchFetchTaskById),
    fork(watchCreateTask),
    fork(watchSaveTask),
    fork(watchDeleteTask),
  ])
}
