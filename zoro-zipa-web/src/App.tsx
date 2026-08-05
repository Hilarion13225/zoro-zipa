import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ClientLayout } from './layouts/ClientLayout'
import { AdminLayout } from './layouts/AdminLayout'
import { HomePage } from './pages/client/HomePage'
import { ArtworkCatalogPage } from './pages/client/ArtworkCatalogPage'
import { ArtworkDetailPage } from './pages/client/ArtworkDetailPage'
import { ArtistProfilePage } from './pages/client/ArtistProfilePage'
import { ReservationPage } from './pages/client/ReservationPage'
import { FavoritesPage } from './pages/client/FavoritesPage'
import { AdminDashboard } from './pages/admin/AdminDashboard'
import { ArtworkManagement } from './pages/admin/ArtworkManagement'
import { ReservationManagement } from './pages/admin/ReservationManagement'
import { AnalyticsPage } from './pages/admin/AnalyticsPage'
import { ProfileManagement } from './pages/admin/ProfileManagement'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ClientLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/galerie" element={<ArtworkCatalogPage />} />
          <Route path="/oeuvres/:id" element={<ArtworkDetailPage />} />
          <Route path="/a-propos" element={<ArtistProfilePage />} />
          <Route path="/reservation" element={<ReservationPage />} />
          <Route path="/favoris" element={<FavoritesPage />} />
        </Route>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="profil" element={<ProfileManagement />} />
          <Route path="oeuvres" element={<ArtworkManagement />} />
          <Route path="commandes" element={<ReservationManagement />} />
          <Route path="analytics" element={<AnalyticsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
