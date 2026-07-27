export const TASK_DIALOG_ID = "inputDialog"
export const USER_DIALOG_ID = "userDialog"

export function openDialog(id: string) {
  const dialog = document.getElementById(id) as HTMLDialogElement | null
  dialog?.showModal()
}

export function closeDialog(id: string) {
  const dialog = document.getElementById(id) as HTMLDialogElement | null
  dialog?.close()
}

export const openTaskDialog = () => openDialog(TASK_DIALOG_ID)
export const openUserDialog = () => openDialog(USER_DIALOG_ID)
