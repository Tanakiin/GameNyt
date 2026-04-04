'use client'

import { useMemo, useState } from 'react'

type HoverScrubGalleryProps = {
  images: string[]
  title: string
  aspectClassName?: string
  roundedClassName?: string
}

export function HoverScrubGallery({
  images,
  title,
  aspectClassName = 'aspect-[16/9]',
  roundedClassName = 'rounded-2xl',
}: HoverScrubGalleryProps) {
  const uniqueImages = useMemo(() => Array.from(new Set(images.filter(Boolean))), [images])
  const [activeIndex, setActiveIndex] = useState(0)

  const activeImage = uniqueImages[activeIndex] ?? null

  function handlePointerMove(event: React.MouseEvent<HTMLDivElement>) {
    if (uniqueImages.length <= 1) return

    const rect = event.currentTarget.getBoundingClientRect()
    const x = Math.max(0, Math.min(event.clientX - rect.left, rect.width))
    const ratio = rect.width === 0 ? 0 : x / rect.width
    const nextIndex = Math.min(
      uniqueImages.length - 1,
      Math.floor(ratio * uniqueImages.length)
    )

    setActiveIndex(nextIndex)
  }

  function handlePointerLeave() {
    setActiveIndex(0)
  }

  return (
    <div
      className={`group relative overflow-hidden border border-white/10 bg-neutral-950 ${aspectClassName} ${roundedClassName}`}
      onMouseMove={handlePointerMove}
      onMouseLeave={handlePointerLeave}
    >
      {activeImage ? (
        <img
          src={activeImage}
          alt={title}
          className="h-full w-full object-cover transition duration-200"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-sm text-neutral-500">
          No image
        </div>
      )}

      {uniqueImages.length > 1 ? (
        <div className="pointer-events-none absolute inset-x-3 bottom-3 flex gap-1.5">
          {uniqueImages.map((_, index) => (
            <span
              key={index}
              className={`h-1.5 flex-1 rounded-full ${
                index === activeIndex ? 'bg-white/90' : 'bg-white/25'
              }`}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}