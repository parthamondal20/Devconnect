import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Props:
 *  - images: [{ url, publicId? }, ...]
 *  - onImageClick: (url) => void
 *  - className: optional wrapper classes
 */
export default function ImageCarousel({ images = [], onImageClick, className = "" }) {
    const [index, setIndex] = useState(0);
    const containerRef = useRef(null);
    const touchStartX = useRef(null);
    const touchEndX = useRef(null);

    useEffect(() => {
        // reset index if images change length or new images loaded
        setIndex(0);
    }, [images.length]);

    const prev = useCallback(() => {
        setIndex((i) => (i <= 0 ? images.length - 1 : i - 1));
    }, [images.length]);

    const next = useCallback(() => {
        setIndex((i) => (i >= images.length - 1 ? 0 : i + 1));
    }, [images.length]);

    // keyboard navigation
    useEffect(() => {
        const onKey = (e) => {
            if (e.key === "ArrowLeft") prev();
            else if (e.key === "ArrowRight") next();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [prev, next]);

    // touch handlers for mobile swipe
    const onTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
    };
    const onTouchMove = (e) => {
        touchEndX.current = e.touches[0].clientX;
    };
    const onTouchEnd = () => {
        if (touchStartX.current == null || touchEndX.current == null) return;
        const diff = touchStartX.current - touchEndX.current;
        const threshold = 50; // minimum px for swipe
        if (diff > threshold) {
            next();
        } else if (diff < -threshold) {
            prev();
        }
        touchStartX.current = null;
        touchEndX.current = null;
    };

    if (!images || images.length === 0) return null;

    return (
        <div
            ref={containerRef}
            className={`relative w-full overflow-hidden rounded-xl ${className}`}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            aria-roledescription="carousel"
        >
            {/* Slides */}
            <div
                className="flex transition-transform duration-400 ease-out"
                style={{
                    transform: `translateX(-${index * 100}%)`,
                }}
            >
                {images.map((img, i) => (
                    <div
                        key={img.publicId || img.url || i}
                        className="flex-shrink-0 w-full max-h-[650px] md:max-h-[520px] lg:max-h-[600px] overflow-hidden"
                        onClick={() => onImageClick && onImageClick(img.url)}
                    >
                        <img
                            src={img.url}
                            alt={`slide-${i}`}
                            className="w-full h-full object-cover cursor-pointer"
                            draggable={false}
                        />
                    </div>
                ))}
            </div>

            {/* Left / Right Buttons */}
            {images.length > 1 && (
                <>
                    {index > 0 && <button
                        onClick={prev}
                        className="absolute left-2 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-white/90 dark:bg-black/60 hover:scale-105 shadow-sm"
                        aria-label="Previous slide"
                    >
                        <ChevronLeft size={18} />
                    </button>}

                    {index < images.length - 1 && <button
                        onClick={next}
                        className="absolute right-2 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-white/90 dark:bg-black/60 hover:scale-105 shadow-sm"
                        aria-label="Next slide"
                    >
                        <ChevronRight size={18} />
                    </button>}
                </>
            )}

            {/* Dots */}
            {images.length > 1 && (
                <div className="absolute left-1/2 -translate-x-1/2 bottom-3 z-30 flex gap-2">
                    {images.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setIndex(i)}
                            className={`w-2 h-2 rounded-full transition-transform ${i === index ? "scale-110" : "opacity-60"
                                } bg-white dark:bg-gray-200/90`}
                            aria-label={`Go to slide ${i + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
