export interface Setting {
  level: number
  questions: number
  choises: number
}
export interface Settings {
  levels: Setting[]
}
export const settings: Settings = {
  levels: [
    { level: 1, questions: 10, choises: 3 },
    { level: 2, questions: 15, choises: 6 },
    { level: 3, questions: 10, choises: 3 },
    { level: 4, questions: 10, choises: 6 },
    { level: 5, questions: 15, choises: 9 },
  ],
}
