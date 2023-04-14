export type Post = {
  id: string;
  createdAt: string;
  createdAtParsed: number;
  updatedAt: string;
  content: string;
  contentFormatted: string;
  commentsCount: number;
  postLikesCount: number;
  spoiler: boolean;
  nsfw: boolean;
  topLevelCommentsCount: number;
  embed: {
    url: string;
    kind: string;
  } | null;
  uploads: string;
  userLink: string;
}

export type KTTPost = {
  id: string;
  createdAt: number;
  contentFormatted: string;
  userId: string;
}