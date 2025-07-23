export function getUserData() {
  try {
    const raw = sessionStorage.getItem('user_data')
    if (!raw) return null

    const data = JSON.parse(raw)

    // Optional: validate expected structure
    if (data && data.id && data.email && data.name && data.role) {
      return data
    }

    return null
  } catch (error) {
    console.error('Failed to parse user_data from sessionStorage:', error)
    return null
  }
}
