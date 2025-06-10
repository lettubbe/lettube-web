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

  useEffect(() => {
    // Don't initialize anything until preloader is done
    if (isPreloading) return

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
  }, [isPreloading])

  const addToRefs = (el: HTMLElement | null, index: number) => {
    if (el) {
      sectionsRef.current[index] = el
    }
  }

  const handleLoadingComplete = () => {
    setIsPreloading(false)
  }

  return (
    <>
      <Preloader onLoadingComplete={handleLoadingComplete} />
      <main className={`${styles.main} ${isPreloading ? styles.mainHidden : ''}`}>
        {/* Hero */}
        <div className={styles.hero}>
          <Image
            src="/images/lettubbe.svg"
            alt="Lettubbe"
            width={1440}
            height={960}
            className={styles.heroBackgroundText}
          />
          <div className={styles.heroHeader}>
            <div className={styles.heroHeaderLine1}>
              Your <span className={styles.voiceText}>voiCe</span>
            </div>
            <div className={styles.heroHeaderLine2}>
              Your <span className={styles.vibeText}>vibE</span>
            </div>
            <div className={styles.heroHeaderLine3}>
              Your <span className={styles.spaceText}>space</span>
            </div>
          </div>
          <div className={styles.heroContent} ref={heroContentRef}>
            <div className={styles.heroImageWrapper}>
              <Image
                src="/images/mockUp1.svg"
                alt="Lettubbe app mockup"
                width={1200}
                height={800}
                priority
                className={styles.heroImage}
              />
            </div>
            <div className={styles.heroText}>
              Built for creators. Ruled by viewers.
            </div>
          </div>
        </div>

        {/* Section 2; White Background */}
        <section className={styles.sectionWhite} ref={(el) => addToRefs(el, 0)}>
          <div className={styles.sectionContent}>
            <div className={styles.textContent}>
              <h2 className={styles.featureTitle}>Because watching should feel like hanging out.</h2>
              <p className={styles.featureDescription}>
                It&apos;s not just another streaming app, it&apos;s a space to talk, react, and belong.
              </p>
              <button className={styles.ctaButton}>Try the beta app now</button>
            </div>

            <div className={styles.imageContent}>
              <Image
                src="/images/mockUp2.svg"
                alt="Feed View"
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
            src="/images/mockUp3.svg"
            alt="Mockup 3"
            width={1200}
            height={800}
            className={styles.fullSectionImage}
          />
        </section>

        {/* Section 4 - Final Section */}
        <section className={styles.sectionFinal} ref={(el) => addToRefs(el, 2)}>
          <div className={styles.finalContent}>
            <div className={styles.finalTextContent}>
              <h2 className={styles.finalTitle}>It starts with a spark.</h2>
              <p className={styles.finalParagraph}>
                A place between here and home,
                Woven from wonder and intention,
                Where presence matters more than polish,
                And every soul has space to rest,
                Still tender, still taking shape,
                Held together by grace and grit.
              </p>
              <p className={styles.finalSubtext}>You're already part of it.</p>
              <button className={styles.finalCtaButton}>Try the beta app now</button>
            </div>
          </div>

          <div className={styles.finalImageContainer}>
            <Image
              src="/images/mockUp4.svg"
              alt="Mockup 5"
              width={400}
              height={600}
              className={styles.finalImage}
            />
          </div>
        </section>
      </main>
    </>
  )
}