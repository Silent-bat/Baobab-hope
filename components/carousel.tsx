"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface CarouselItem {
  id: number
  title: string
  description: string
  image: string
  cta?: {
    text: string
    href: string
  }
}

interface CarouselProps {
  items: CarouselItem[]
  autoPlay?: boolean
  interval?: number
}

export function Carousel({ items, autoPlay = true, interval = 5000 }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (!autoPlay) return

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length)
    }, interval)

    return () => clearInterval(timer)
  }, [autoPlay, interval, items.length])

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + items.length) % items.length)
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  return (
    <div className="relative w-full h-64 sm:h-80 lg:h-96 xl:h-[500px] overflow-hidden rounded-xl bg-gray-900">
      {/* Slides */}
      <div className="relative w-full h-full">
        {items.map((item, index) => (
          <div
            key={item.id}
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${
              index === currentIndex
                ? "opacity-100 translate-x-0"
                : index < currentIndex
                  ? "opacity-0 -translate-x-full"
                  : "opacity-0 translate-x-full"
            }`}
          >
            <Image
              src={item.image || "/images/projects/project-education.jpg"}
              alt={item.title}
              fill
              className="object-cover"
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white px-4 max-w-4xl">
                <h2
                  className={`text-xl sm:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold mb-3 sm:mb-4 transition-all duration-1000 delay-300 ${
                    index === currentIndex ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                >
                  {item.title}
                </h2>
                <p
                  className={`text-sm sm:text-base lg:text-lg xl:text-xl mb-4 sm:mb-6 transition-all duration-1000 delay-500 ${
                    index === currentIndex ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                >
                  {item.description}
                </p>
                {item.cta && (
                  <Button
                    asChild
                    size="lg"
                    className={`bg-red-600 hover:bg-red-700 transition-all duration-1000 delay-700 hover:scale-105 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base ${
                      index === currentIndex ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                    }`}
                  >
                    <a href={item.cta.href}>{item.cta.text}</a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 transition-all duration-300 hover:scale-110 w-8 h-8 sm:w-10 sm:h-10"
        onClick={goToPrevious}
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 transition-all duration-300 hover:scale-110 w-8 h-8 sm:w-10 sm:h-10"
        onClick={goToNext}
        aria-label="Next slide"
      >
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
      </Button>

      {/* Dots Indicator */}
      <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex space-x-1 sm:space-x-2">
        {items.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
              index === currentIndex ? "bg-white scale-125" : "bg-white/50 hover:bg-white/75"
            }`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
