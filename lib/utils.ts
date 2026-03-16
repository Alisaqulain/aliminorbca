export function generatePNR(): string {
  return 'PNR' + Date.now().toString(36).toUpperCase().slice(-8) + Math.random().toString(36).slice(2, 6).toUpperCase()
}

export function generateTransactionId(): string {
  return 'TXN' + Date.now() + Math.random().toString(36).slice(2, 10).toUpperCase()
}

export function calculateDuration(dep: string, arr: string): string {
  const [dh, dm] = dep.split(':').map(Number)
  const [ah, am] = arr.split(':').map(Number)
  let h = ah - dh
  let m = am - dm
  if (m < 0) {
    m += 60
    h--
  }
  if (h < 0) h += 24
  return `${h}h ${m}m`
}
