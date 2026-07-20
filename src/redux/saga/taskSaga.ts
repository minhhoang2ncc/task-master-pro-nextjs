import { call, put, takeLatest, all, fork } from 'redux-saga/effects'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { TaskRecord } from '@/shared/type'
import { append, remove, modify, setTasks, upsertTask } from '@/redux/slices/taskSlice'
import {
  getTasks,
  getTaskById,
  postCreateTask,
  postSaveTask,
  deleteTask as deleteTaskApi,
} from '@/api/taskApi'

// ─── Action Types ─────────────────────────────────────────────────────────────

export const TASK_FETCH_ALL_REQUESTED = 'task/fetchAllRequested'
export const TASK_FETCH_BY_ID_REQUESTED = 'task/fetchByIdRequested'
export const TASK_CREATE_REQUESTED = 'task/createRequested'
export const TASK_SAVE_REQUESTED = 'task/saveRequested'
export const TASK_DELETE_REQUESTED = 'task/deleteRequested'
export const TASK_REQUEST_FAILED = 'task/requestFailed'

// ─── Worker Sagas ─────────────────────────────────────────────────────────────

function* fetchAllTasksSaga() {
  try {
    const tasks: TaskRecord[] = yield call(getTasks)
    yield put(setTasks(tasks))
  } catch (error) {
    yield put({ type: TASK_REQUEST_FAILED, payload: (error as Error).message })
  }
}

function* fetchTaskByIdSaga(action: PayloadAction<string | number>) {
  try {
    const task: TaskRecord = yield call(getTaskById, action.payload)
    yield put(upsertTask(task))
  } catch (error) {
    yield put({ type: TASK_REQUEST_FAILED, payload: (error as Error).message })
  }
}

function* createTaskSaga(action: PayloadAction<TaskRecord>) {
  yield put(append(action.payload))
  try {
    yield call(postCreateTask, action.payload)
  } catch (error) {
    yield put(remove({ id: action.payload.id }))
    yield put({ type: TASK_REQUEST_FAILED, payload: (error as Error).message })
  }
}

function* saveTaskSaga(action: PayloadAction<TaskRecord>) {
  try {
    const { subtasks, ...taskBody } = action.payload
    console.log("Subtasks: ", subtasks)
    console.log("Task: ", taskBody)
    const data: TaskRecord = yield call(postSaveTask, action.payload)
    console.log(data)
    yield put(modify(action.payload))
  } catch (error) {
    yield put({ type: TASK_REQUEST_FAILED, payload: (error as Error).message })
  }
}

function* deleteTaskSaga(action: PayloadAction<TaskRecord>) {
  try {
    yield call(deleteTaskApi, action.payload.id)
    yield put(remove({ id: action.payload.id }))

  } catch (error) {
    yield put(append(action.payload))
    yield put({ type: TASK_REQUEST_FAILED, payload: (error as Error).message })
  }
}

// ─── Watcher Sagas ────────────────────────────────────────────────────────────

function* watchFetchAllTasks() { yield takeLatest(TASK_FETCH_ALL_REQUESTED, fetchAllTasksSaga) }
function* watchFetchTaskById() { yield takeLatest(TASK_FETCH_BY_ID_REQUESTED, fetchTaskByIdSaga) }
function* watchCreateTask() { yield takeLatest(TASK_CREATE_REQUESTED, createTaskSaga) }
function* watchSaveTask() { yield takeLatest(TASK_SAVE_REQUESTED, saveTaskSaga) }
function* watchDeleteTask() { yield takeLatest(TASK_DELETE_REQUESTED, deleteTaskSaga) }

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
