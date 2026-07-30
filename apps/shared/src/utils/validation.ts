export const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
export const isNumeric = (value: string) => /^\d+$/.test(value)
