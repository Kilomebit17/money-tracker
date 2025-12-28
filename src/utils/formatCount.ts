const countFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0,
})

export const formatCount = (value: number): string => countFormatter.format(value)

