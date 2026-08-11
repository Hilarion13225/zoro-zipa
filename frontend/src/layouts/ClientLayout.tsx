import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { ZoroAssistant } from '../components/ZoroAssistant'
import { QuickSearch } from '../components/QuickSearch'

/** Public site shell: navbar, page content, footer and the Zoro AI assistant. */
export function ClientLayout() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/*
          Plain CSS fade-in (see index.css `.page-fade`) instead of
          framer-motion's AnimatePresence: a JS-driven exit animation that
          never resolves can leave content stuck at opacity:0 permanently.
          A CSS keyframe animation always runs to completion.
        */}
        <div key={pathname} className="page-fade">
          <Outlet />
        </div>
      </main>
      <Footer />
      <ZoroAssistant />
      <QuickSearch />
    </div>
  )
}