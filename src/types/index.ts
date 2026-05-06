/**
 * Core type definitions for the Carpets Inter Vietnam website.
 * This is the single source of truth for all data structures.
 * When modifying, ensure JSON data files are updated accordingly.
 */

/** A product within a collection */
export interface Product {
  code: string
  name: string
  highlights: string[]
  colors?: string[]
  image?: string
}

/** A downloadable resource link */
export interface ResourceLink {
  label: string
  type: 'brochure' | 'spec' | 'guide' | 'portfolio'
  url: string
}

/** Metadata for tracking content updates */
export interface ContentMetadata {
  lastUpdated: string
  sourceVerified: boolean
  sourceUrl?: string
}

/** A carpet collection */
export interface CollectionItem {
  id: string
  name: string
  tagline: string
  summary: string
  detail: string
  heroImage: string
  gallery: string[]
  accent: string
  quickFacts: string[]
  applications: string[]
  products: Product[]
  resources: ResourceLink[]
  metadata: ContentMetadata
}

/** Company / showroom contact info (Vietnam) */
export interface ContactInfo {
  company: string
  hotline: string
  email: string
  address: string
  hours: string
  mapUrl?: string
  facebook?: string
  zalo?: string
}

/** Website global configuration */
export interface SiteConfig {
  siteName: string
  tagline: string
  description: string
  contact: ContactInfo
  featuredResources: ResourceLink[]
}
