export const TITLE_BAR = {
    default: "flex items-center justify-between h-16 bg-background m-4 mt-8 gap-2 "
}

export const CARD_LAYOUTS = {
  summary: "p-4 flex flex-col",
  highlighted: "p-4 pl-8 pr-8 bg-primary border-none text-white relative overflow-hidden",
  header: "p-0 mb-2",
  title: "text-foreground uppercase",
  content: "p-0 flex-1 flex flex-col justify-between gap-4"
};

export const TABS_LAYOUT = {
    default: "bg-tabs-background dark:bg-background rounded-[12px] group-data-horizontal/tabs:h-auto inline-flex items-center",
    trigger: "data-active:bg-background data-active:text-primary rounded-[8px] px-4 h-9 hover:text-primary"
}

export const SIDEBAR_ITEM = {
    default: `
        pl-4
        p-6
        text-md
        dark:data-[active=true]:text-yellow-400
        data-[active=true]:bg-transparent
        dark:data-[active=true]:bg-transparent
        data-[active=true]:text-primary
        hover:border-r-4
        border-primary
        dark:border-yellow-400
        data-[active=true]:border-primary
        dark:data-[active=true]:border-yellow-400
        transition-all
        rounded-none
    `
}

export const BADGE = {
    default: 'text-xs px-2 py-0 rounded-sm font-medium',
    checked_mode: 'bg-slate-100 text-slate-400 hover:bg-slate-100'
}

export const PRIORITY = {
    high: 'bg-red-100 text-red-600 hover:bg-red-100',
    medium: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
    low: 'bg-emerald-100 text-emerald-600 hover:bg-emerald-100'
}

export const TEXT_SIZES = {
    card_title_default: 'text-3xl font-bold',
    title_secondary: 'text-md'
}

export const PROGRESS_BAR = {
    default: "bg-ring h-2 mb-2" //bg is fore the missing part
}

export const BUTTON_VARIANTS = {
  active: "bg-indigo-600 text-white hover:bg-indigo-700",
  inactive: "bg-indigo-500 text-white hover:bg-indigo-600",
};