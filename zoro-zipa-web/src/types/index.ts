/** Domain types shared with the Spring Boot API. */

export type ArtistStatus = 'PENDING' | 'VALIDATED' | 'SUSPENDED'

export interface Artist {
  id: number
  name: string
  portraitUrl: string
  bio: string
  journey: string
  style: string
  nationality: string
  status: ArtistStatus
}

export interface Artwork {
  id: number
  title: string
  description: string
  imageUrl: string
  images: string[]
  artistId: number
  artistName: string
  category: string
  technique: string
  dimensions: string
  year: number
  trending: boolean
  views: number
}

export interface Gallery {
  id: number
  name: string
  description: string
  imageUrl: string
  city: string
  address: string
  partner: boolean
}

export interface Exhibition {
  id: number
  title: string
  description: string
  posterUrl: string
  startDate: string
  endDate: string
  location: string
  galleryId: number
  galleryName: string
  artistIds: number[]
  artistNames: string[]
  current: boolean
}

export type ReservationStatus = 'CONFIRMED' | 'PENDING' | 'CANCELLED'

export interface Reservation {
  id: number
  exhibitionId: number
  exhibitionTitle: string
  visitDate: string
  timeSlot: string
  visitors: number
  fullName: string
  email: string
  phone: string
  status: ReservationStatus
  code: string
}

export interface ReservationRequest {
  exhibitionId: number
  visitDate: string
  timeSlot: string
  visitors: number
  fullName: string
  email: string
  phone: string
}

export type UserRole = 'ADMIN' | 'VISITOR' | 'GALLERY'

export interface User {
  id: number
  name: string
  email: string
  role: UserRole
  active: boolean
  createdAt: string
}

export interface MonthlyPoint {
  month: string
  value: number
}

export interface PopularArtwork {
  title: string
  views: number
}

export interface Stats {
  artists: number
  artworks: number
  exhibitions: number
  visitors: number
  reservations: number
  visitorsByMonth: MonthlyPoint[]
  reservationsByMonth: MonthlyPoint[]
  popularArtworks: PopularArtwork[]
}

export interface Exhibition {
  id: number
  title: string
  description: string
  imageUrl: string
  location: string
  dates: string
  active: boolean
}

export interface SoloShow {
  id: number
  title: string
  description: string
  imageUrl: string
  year: string
  featured: boolean
}

export interface Media {
  id: number
  title: string
  url: string
  type: string
  category: string
  description: string
}

export interface Product {
  id: number
  title: string
  description: string
  imageUrl: string
  price: number
  quantity: number
  category: string
  available: boolean
}

export interface Masterclass {
  id: number
  imageUrl: string
  content: string
  title: string
  displayOrder: number
}

export interface Performance {
  id: number
  title: string
  description: string
  imageUrl: string
  date: string
  location: string
  featured: boolean
}

export interface PurchaseOrder {
  id: number
  productId: number
  productTitle: string
  price: number
  quantity: number
  customerName: string
  customerEmail: string
  customerPhone: string
  status: string
  orderDate: string
}
