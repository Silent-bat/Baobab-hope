"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"
import { ChevronLeft, ChevronRight, Heart, ArrowRight } from "lucide-react"

export function HeroCarousel() {
  const { t } = useLanguage()
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      id: 1,
      title: t("home.hero.education.title"),
      subtitle: t("home.hero.education.subtitle"),
      description: t("home.hero.education.description"),
      image: "/images/hero-education.svg",
      cta: {
        primary: {
          text: t("home.hero.education.cta"),
          href: "/projects",
        },
        secondary: {
          text: t("home.hero.donate"),
          href: "/donate",
        },
      },
    },
    {
      id: 2,
      title: t("home.hero.environment.title"),
      subtitle: t("home.hero.environment.subtitle"),
      description: t("home.hero.environment.description"),
      image: "/images/hero-environment.svg",
      cta: {
        primary: {
          text: t("home.hero.environment.cta"),
          href: "/about",
        },
        secondary: {
          text: t("home.hero.donate"),
          href: "/donate",
        },
      },
    },
    {
      id: 3,
      title: t("home.hero.healthcare.title"),
      subtitle: t("home.hero.healthcare.subtitle"),
      description: t("home.hero.healthcare.description"),
      image: "/images/hero-healthcare.svg",
      cta: {
        primary: {
          text: t("home.hero.healthcare.cta"),
          href: "/projects",
        },
        secondary: {
          text: t("home.hero.donate"),
          href: "/donate",
        },
      },
    },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 6000)

    return () => clearInterval(timer)
  }, [slides.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  return (
    <section className="relative h-screen overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={slide.image || "/images/placeholder.svg"}
            alt={slide.title}
            fill
            className="object-cover"
            priority={index === 0}
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = "/images/placeholder.svg"
            }}
          />
          <div className="absolute inset-0 bg-black/50" />

          <div className="relative z-10 flex items-center justify-center h-full">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
              <div className="animate-fade-in-up">
                <div className="inline-block bg-red-600/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
                  {slide.subtitle}
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight font-poppins">
                  {slide.title}
                </h1>
                <p className="text-lg sm:text-xl lg:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto leading-relaxed">
                  {slide.description}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    asChild
                    size="lg"
                    className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-4 text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  >
                    <Link href={slide.cta.primary.href} className="flex items-center space-x-2">
                      <span>{slide.cta.primary.text}</span>
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="border-2 border-white text-white hover:bg-white hover:text-red-600 font-bold px-8 py-4 text-lg transition-all duration-300 hover:scale-105 bg-transparent"
                  >
                    <Link href={slide.cta.secondary.href} className="flex items-center space-x-2">
                      <Heart className="w-5 h-5" />
                      <span>{slide.cta.secondary.text}</span>
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? "bg-white scale-125" : "bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
