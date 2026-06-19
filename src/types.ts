export interface ItemEntry {
  id: string;
  name: string;
}

export interface ItemCategory {
  key: string;
  label: string;
  icon: string;
  items: ItemEntry[];
}
