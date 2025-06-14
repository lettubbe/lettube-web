'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './page.module.css'
import Image from 'next/image'
import Lenis from 'lenis'
import Preloader from '@/components/Preloader'

export default function Home() {
  const heroContentRef = useRef<HTMLDivElement>(null)
  const sectionsRef = useRef<HTMLElement[]>([])
  const [isPreloading, setIsPreloading] = useState(true)
  const [showContent, setShowContent] = useState(false)

  const handleDownloadApp = () => {
    
    const downloadUrl = 'https://lettube-apks.s3.eu-north-1.amazonaws.com/07-14-25/lettubbe.apk'
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = 'lettubbe-app.apk'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  useEffect(() => {
    // Don't initialize anything until content is ready to show
    if (!showContent) return

    // Initialize Lenis for smooth scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      infinite: false,
    })

    const updateParallax = (time: number) => {
      const scrolled = lenis.scroll

      // Move hero content up as user scrolls
      if (heroContentRef.current) {
        heroContentRef.current.style.transform = `translateY(${-scrolled * 0.3}px)`
        heroContentRef.current.style.opacity = String(Math.max(0, 1 - scrolled / 1000))
      }

      // sliding effect for sections
      sectionsRef.current.forEach((section, index) => {
        if (section) {
          const rect = section.getBoundingClientRect()
          const windowHeight = window.innerHeight

          if (index === 0) {
            // White section; stays in place initially, then slides up when black section approaches
            const progress = Math.max(0, (windowHeight - rect.top) / windowHeight)
            if (progress > 0.5) {
              section.style.transform = `translateY(${-(progress - 0.5) * 200}px)`
            } else {
              section.style.transform = `translateY(0px)`
            }
          } else if (index === 1) {
            // Black section; slides down from top to cover white section, then slides up to reveal final section
            const sectionHeight = section.offsetHeight
            const scrollProgress = (windowHeight - rect.top) / (windowHeight + sectionHeight)

            if (scrollProgress < 0) {
              // Before section is visible
              section.style.transform = `translateY(0px)`
            } else if (scrollProgress < 0.5) {
              // Sliding down to cover white section
              section.style.transform = `translateY(${-scrollProgress * 100}px)`
            } else {
              // Sliding up to reveal final section
              const exitProgress = (scrollProgress - 0.5) * 2
              section.style.transform = `translateY(${-50 - exitProgress * 100}px)`
            }
          } else if (index === 2) {
            // Final section; starts hidden under black section, then gets revealed
            const blackSection = sectionsRef.current[1]
            if (blackSection) {
              const blackRect = blackSection.getBoundingClientRect()
              const revealProgress = Math.max(0, (windowHeight - blackRect.bottom) / windowHeight)
              section.style.transform = `translateY(${-revealProgress * 50}px)`
            }
          }
        }
      })

      lenis.raf(time)
    }

    // Start the animation loop
    const animate = (time: number) => {
      updateParallax(time)
      requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)

    // Intersection Observer for fadein animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add(styles.visible)
        }
      })
    }, observerOptions)

    // Observe all content sections
    const elementsToObserve = document.querySelectorAll(`.${styles.sectionContent}, .${styles.parallaxContent}, .${styles.finalContent}`)
    elementsToObserve.forEach(el => observer.observe(el))

    return () => {
      lenis.destroy()
      observer.disconnect()
    }
  }, [showContent])

  const addToRefs = (el: HTMLElement | null, index: number) => {
    if (el) {
      sectionsRef.current[index] = el
    }
  }

  const handleLoadingComplete = () => {
    setIsPreloading(false)
  }

  const handleContentShow = () => {
    setShowContent(true)
  }

  return (
    <>
      <Preloader onLoadingComplete={handleLoadingComplete} onContentShow={handleContentShow} />
      <main className={`${styles.main} ${!showContent ? styles.mainHidden : ''}`}>
        {/* Hero */}
        <header className={styles.hero}>
          <Image
            src="/images/lettubbe.svg"
            alt="Lettubbe logo background text"
            width={1440}
            height={960}
            className={styles.heroBackgroundText}
          />
          <h1 className={styles.heroHeader}>
            <span className={styles.heroHeaderLine1}>
              Your <span className={styles.voiceText}>voiCe</span>
            </span>
            <span className={styles.heroHeaderLine2}>
              Your <span className={styles.vibeText}>vibE</span>
            </span>
            <span className={styles.heroHeaderLine3}>
              Your <span className={styles.spaceText}>space</span>
            </span>
          </h1>
          <div className={styles.heroContent} ref={heroContentRef}>
            <div className={styles.heroImageWrapper}>
              <Image
                src="/images/mockUp1.png"
                alt="Lettubbe mobile app interface showing video streaming and community features"
                width={1200}
                height={800}
                priority
                className={styles.heroImage}
              />
            </div>
            <p className={styles.heroText}>
              Built for creators. Ruled by viewers.
            </p>
          </div>
        </header>

        {/* Section 2; White Background */}
        <section className={styles.sectionWhite} ref={(el) => addToRefs(el, 0)}>
          <div className={styles.sectionContent}>
            <div className={styles.textContent}>
              <h2 className={styles.featureTitle}>Because watching should feel like hanging out.</h2>
              <p className={styles.featureDescription}>
                It&apos;s not just another streaming app, it&apos;s a safe space to talk & create, share dreams and build inspiring communities.
              </p>
              <button className={styles.ctaButton} onClick={handleDownloadApp}>Download The Beta App</button>
            </div>

            <div className={styles.imageContent}>
              <Image
                src="/images/mockUp2.svg"
                alt="Lettubbe app feed view displaying creator content and community interactions"
                width={300}
                height={600}
                className={styles.showcaseImage}
              />
            </div>
          </div>
        </section>

        {/* Section 3; Black Background */}
        <section className={styles.sectionBlack} ref={(el) => addToRefs(el, 1)}>
          <Image
            src="/images/mockUp3.png"
            alt="Lettubbe app video player interface with live chat and viewer engagement features"
            width={1200}
            height={800}
            className={styles.fullSectionImage}
          />
        </section>

        {/* Section 4 - Final Section */}
        <section className={styles.sectionFinal} ref={(el) => addToRefs(el, 2)}>
          <div className={styles.finalContent}>
            <article className={styles.finalTextContent}>
              <h2 className={styles.finalTitle}>It starts with a spark.</h2>
              <p className={styles.finalParagraph}>
                Fuel your art, connect with an audience that craves your creativity. 
                Join conversations that inspire.
                Lettubbe - where artistry meets community.
              </p>
              {/* <p className={styles.finalSubtext}>You're already part of it.</p> */}
              <button className={styles.finalCtaButton} onClick={handleDownloadApp}>Download The Beta App</button>
            </article>
          </div>

          <aside className={styles.finalImageContainer}>
            <Image
              src="/images/mockUp4.svg"
              alt="Lettubbe app profile and creation tools interface for content creators"
              width={400}
              height={600}
              className={styles.finalImage}
            />
          </aside>
        </section>
      </main>
    </>
  )
}