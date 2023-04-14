import { db } from "./db"

export const deleteOldPosts = async (monthsOld = 2) => {
  const msInMonth = 2.628e+9
  const msTotal = msInMonth * monthsOld
  return db.posts.where('createdAtParsed').below(Date.now() - msTotal).delete()
}