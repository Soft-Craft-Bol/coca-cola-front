export interface CsvColumn<T> {
  label: string
  value: (row: T) => string | number | null | undefined
}

const escape = (value: unknown) => {
  const str = value == null ? '' : String(value)
  return /[",\n;]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str
}

export function toCsv<T>(rows: T[], columns: CsvColumn<T>[]) {
  const header = columns.map((c) => escape(c.label)).join(',')
  const body = rows.map((row) => columns.map((c) => escape(c.value(row))).join(','))
  return [header, ...body].join('\n')
}

export function downloadCsv<T>(filename: string, rows: T[], columns: CsvColumn<T>[]) {
  const blob = new Blob(['﻿' + toCsv(rows, columns)], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
