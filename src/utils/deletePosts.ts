import { largestOffsetPreviouslyRequestedKey } from "./constants"
import { db } from "./db"

export const deletePosts = async () => {
  localStorage.removeItem(largestOffsetPreviouslyRequestedKey)
  return db.posts.clear()
}