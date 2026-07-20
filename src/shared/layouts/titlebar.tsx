import type { ReactNode } from "react"
import { TITLE_BAR } from "../styles/tailwind-classes"


export function TitleBar({ children } : { children : ReactNode}) {
    return (
        <div className={TITLE_BAR.default}>
            {children}
        </div>
    )
}