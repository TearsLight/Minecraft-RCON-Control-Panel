import { itemCategories, allItemEntries } from './itemData';
import { blockCategories, allBlocks } from './blockData';
/** 所有分类（物品 + 方块） */
export const allCategories = [...itemCategories, ...blockCategories];
/** 所有 ID 扁平列表（物品 + 方块），用于搜索和自动补全 */
export const allItems = [...allItemEntries, ...allBlocks];
export const totalCount = allItems.length;
//# sourceMappingURL=allData.js.map