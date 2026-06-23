import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const TITLES = {
  '/': 'Meet The Owl',
  '/meet-owllocate': 'Meet The Owl | Meet Owllocate',
  '/owllocate-get-started': 'Meet The Owl | Getting Started with Owllocate',
  '/training-effectiveness': 'Meet The Owl | Measuring Training Effectiveness',
  '/needs-analysis': 'Meet The Owl | Data & AI for Needs Analysis',
  '/virtual-onboarding': 'Meet The Owl | Making Remote Onboarding Work',
}

export default function TitleManager() {
  const { pathname } = useLocation()

  useEffect(() => {
    document.title = TITLES[pathname] ?? 'Meet The Owl'
  }, [pathname])

  return null
}
