import { CollectionItem } from '../types';
import collectionsData from '../data/collections.json';
import configData from '../data/config.json';

// Type-safe exports from JSON data
export const collections: CollectionItem[] = collectionsData.collections as CollectionItem[];
export const contactInfo = configData.contact;
export const featuredResources = configData.featuredResources;
