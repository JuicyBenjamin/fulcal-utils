import type { CalendarApi } from 'npm:@fullcalendar/core@6.1.15'
import type FullCalendar from 'npm:@fullcalendar/react@6.1.15'
import {
  create,
  type UseBoundStore,
  type StoreApi
} from 'npm:zustand@5.0.0'

type TUseFullCalendar = {
  calendars: Record<string, FullCalendar>
  setCalendar: ({
    id,
    calendar,
  }: {
    id?: string
    calendar: FullCalendar
  }) => void
  getApi: (id?: string) => CalendarApi | undefined
  titles: Record<string, string>
  getTitle: (id?: string) => string | undefined
  setTitle: ({ title, id }: { title?: string; id?: string }) => void
}

const defaultId = 'default'

/**
  * useFullCalendar is a zustand hook that allows you to manage multiple FullCalendar instances.
  * the setCalendar should be used to store a reference to the FullCalendar instance. An Id can be provided to store multiple instances.
  * getApi can be used to get the CalendarApi of a specific instance.
  * setTitle can be used to store the title of a specific instance.
  * getTitle can be used to get the title of a specific instance. Will default to the FullCalendar title if not set.
*/
export const useFullCalendar: UseBoundStore<StoreApi<TUseFullCalendar>> = create<TUseFullCalendar>((set, get) => ({
  calendars: {},

  setCalendar: ({ id = defaultId, calendar }) =>
    set((state) => ({
      calendars: {
        ...state.calendars,
        [id]: calendar,
      },
    })),

  getApi: (id = defaultId) => {
    const calendarApi = get().calendars[id]?.getApi()
    if (calendarApi) {
      return calendarApi
    } else {
      return undefined
    }
  },
  titles: {},
  getTitle: (id = defaultId) => {
    const title = get().titles[id]
    if (title == null) {
      const calendarApi = get().calendars[id]?.getApi()
      if (calendarApi) {
        return calendarApi.view.title
      } else {
        return undefined
      }
    }
    return title
  },
  setTitle: ({ id = defaultId, title }) => set({ [id]: title }),
}))
