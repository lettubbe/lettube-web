'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import styles from './Preloader.module.css'

interface PreloaderProps {
  onLoadingComplete?: () => void
}

export default function Preloader({ onLoadingComplete }: PreloaderProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    // Block scrolling while preloader is active
    document.body.style.overflow = 'hidden'

    // Check if all resources are loaded
    const handleLoad = () => {
      // Add a small delay for smoother transition
      setTimeout(() => {
        setIsExiting(true)
        // Wait for exit animation to complete before removing preloader
        setTimeout(() => {
          setIsLoading(false)
          document.body.style.overflow = '' // Re-enable scrolling
          if (onLoadingComplete) {
            onLoadingComplete()
          }
        }, 2500) // Slightly longer to ensure animation completes
      }, 800) // Minimum display time
    }

    // Check if document is already loaded
    if (document.readyState === 'complete') {
      handleLoad()
    } else {
      window.addEventListener('load', handleLoad)
    }

    return () => {
      window.removeEventListener('load', handleLoad)
      document.body.style.overflow = '' // Cleanup
    }
  }, [onLoadingComplete])

  if (!isLoading) return null

  return (
    <div className={`${styles.preloader} ${isExiting ? styles.preloaderExit : ''}`}>
      <div className={`${styles.preloaderLogo} ${isExiting ? styles.preloaderLogoExit : ''}`}>
        <Image
          src="/images/logo.svg"
          alt="Loading..."
          width={63}
          height={63}
          priority
        />
      </div>
    </div>
  )
}