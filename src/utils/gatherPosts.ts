import Kitsu from "kitsu"
import type { KTTPost } from "../types/Post"
import { largestOffsetPreviouslyRequestedKey } from "./constants"
import { db } from "./db"

export const gatherPosts = async (api = new Kitsu()) => {
  // const allPosts: Map<String, Post> = new Map()
  const requestPostLimit = 20

  const getOffset = (retries = 0): Promise<number> => {
    console.log('Finding initial offset...')
    if (retries > 0) console.log('Retry #' + retries)

    return api.get('posts', {
      params: {
        fields: {
          posts: 'id'
        },
        page: {
          limit: 20
        }
      }
    })
      .then((posts: any) => {
        const lastOffsetString = new URL(posts.links.last).searchParams.get('page[offset]')
        const lastOffset = Number.parseInt(lastOffsetString ?? '0')
        console.log('Found offset: ' + lastOffset)

        return lastOffset
      })
      .catch((error: any) => {
        console.log('Error: ' + error)
        if (retries > 5) {
          console.log('Retried too many times, giving up...')
        } else {
          return getOffset(retries + 1)
        }

      })
  }

  const requestPosts = (offset: number, retries = 0): Promise<KTTPost[]> => {
    console.log('Requesting offset: ' + offset)
    if (retries > 0) console.log('Retry #' + retries)

    return api.get('posts', {
      params: {
        fields: {
          posts: 'id,createdAt,contentFormatted,user',
          users: 'id,slug'
        },
        include: 'user',
        page: {
          limit: requestPostLimit,
          offset,
        }
      }
    })
      .then((response: any) => {
        console.log('Writing largest previously requested offset to localStorage... ', offset)
        localStorage.setItem(largestOffsetPreviouslyRequestedKey, offset.toString())

        return response.data.map((rawPost: any): KTTPost => {
          const userId = rawPost?.user?.data?.slug ?? rawPost?.user?.data?.id

          if (!userId) console.warn("Couldn't get a userId! FUCK! ", rawPost.id, JSON.stringify(rawPost.user))

          return {
            id: rawPost.id,
            createdAt: Date.parse(rawPost.createdAt),
            contentFormatted: rawPost.contentFormatted,
            userId,
          }
        })
      })
      .catch((error: any) => {
        console.log('Error: ' + error)
        if (retries > 5) {
          console.log('Retried too many times, giving up...')
        } else {
          return requestPosts(offset, retries + 1)
        }

      })
  }

  const lastOffset = await getOffset() as number

  /**
   * If never previously requested, this will be null. In which case, we fallback
   * to saying that we last requested the lastOffset - postsInPast posts.
   */
  const postsInPast = 10_000
  const largestOffsetPreviouslyRequested = Number.parseInt(localStorage.getItem(largestOffsetPreviouslyRequestedKey) ?? `${lastOffset - postsInPast}`)

  const postsToBeRequested = lastOffset - largestOffsetPreviouslyRequested
  console.log('postsToBeRequested: ', postsToBeRequested)

  /**
   * MATH CHECK
   * 
   * lets say on reset, postsToBeRequested = 10_000
   * each request returns requestPostLimit posts
   * each batch returns batchSize * requestPostLimit = 16 * 20 = 320 posts
   */

  const batchSize = 16
  const postsRequestedPerBatch = batchSize * requestPostLimit
  const batchCount = Math.ceil(postsToBeRequested / postsRequestedPerBatch)

  for (let b = 0; b < batchCount; b++) {
    const promises = []

    for (let i = b * batchSize; i < b * batchSize + batchSize; i++) {
      const offset = largestOffsetPreviouslyRequested + i * requestPostLimit
      if (offset > lastOffset) break;
      promises.push(requestPosts(offset))
    }

    console.log('Requesting: ', promises.length)

    await Promise.all(promises).then(batchPosts => {
      console.log('Writing output... ' + batchPosts.length)
      return db.posts.bulkPut(batchPosts.flat())
    })

    console.log(`Finished batch: ${b + 1} / ${batchCount}`)

    // TESTING FOR ONE BATCH BREAK
    // break
  }
}