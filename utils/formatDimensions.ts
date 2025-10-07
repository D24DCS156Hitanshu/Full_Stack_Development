export const formatDimensions = (width: number, height: number, depth: number) => {
  const inchesToFeetAndInches = (inches: number) => {
    const feet = Math.floor(inches / 12)
    const remainingInches = inches % 12
    if (feet === 0) return `${remainingInches}"`
    if (remainingInches === 0) return `${feet}'`
    return `${feet}' ${remainingInches}"`
  }
  return `${inchesToFeetAndInches(width)} × ${inchesToFeetAndInches(height)} × ${inchesToFeetAndInches(depth)}`
}
