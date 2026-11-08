import { getCollection } from 'astro:content';
export const groups = ['开始使用', '功能指南', '扩展与集成', '支持'] as const;
export async function orderedDocs() {
  return (await getCollection('docs')).sort((a, b) => a.data.order - b.data.order);
}
