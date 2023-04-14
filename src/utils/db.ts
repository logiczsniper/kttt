import type { KTTPost } from '@/types/Post';
import Dexie, { type Table } from 'dexie';

export class MyDexie extends Dexie {
  posts!: Table<KTTPost>;

  constructor() {
    super('kitsuPosts');
    this.version(1).stores({
      posts: 'id, contentFormatted, createdAtParsed'
    });
  }
}

export const db = new MyDexie();