import { writable, derived } from "svelte/store"
import { DEFAULT_NOTIFICATION_TIMEOUT } from "../utils/constants"

function createNotificationsStore() {
    const _notifications = writable([])

    function send(title: string, message: string, type: string = "info", timeout: number) {
        _notifications.update(state => {
            return [...state, { id: id(), type, title, message, timeout }]
        })
    }

    const notifications = derived(_notifications, ($_notifications, set) => {
        set($_notifications)
        if ($_notifications.length > 0) {
            const timer = setTimeout(() => {
                _notifications.update(state => {
                    state.shift()
                    return state
                })
            }, $_notifications[0].timeout)
            return () => {
                clearTimeout(timer)
            }
        }
    })
    const { subscribe } = notifications

    function id() {
        return '_' + Math.random().toString(36).substr(2, 9)
    }

    return {
        subscribe,
        send,
        danger: (title: string, msg: string, timeout: number = DEFAULT_NOTIFICATION_TIMEOUT) => send(title, msg, "danger", timeout),
        warning: (title: string, msg: string, timeout: number = DEFAULT_NOTIFICATION_TIMEOUT) => send(title, msg, "warning", timeout),
        info: (title: string, msg: string, timeout: number = DEFAULT_NOTIFICATION_TIMEOUT) => send(title, msg, "info", timeout),
        success: (title: string, msg: string, timeout: number = DEFAULT_NOTIFICATION_TIMEOUT) => send(title, msg, "success", timeout),
    }
}

export const notifications = createNotificationsStore()
