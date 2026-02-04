import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Props:
 * - images: [{ url, publicId? }, ...]
 * - onImageClick: (url) => void
 * - className: optional wrapper classes
 */
export default function ImageCarousel({ images = [], onImageClick, className = "" }) {
    const [index, setIndex] = useState(0);
    const scrollContainerRef = useRef(null);

    // Reset to first slide when images change
    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({ left: 0, behavior: 'instant' });
            setIndex(0);
        }
    }, [images.length]);

    // Handle scroll to update active index logic (Syncs scroll position with dots)
    const handleScroll = useCallback(() => {
        if (!scrollContainerRef.current) return;
        const { scrollLeft, clientWidth } = scrollContainerRef.current;
        // Calculate index based on scroll position
        const newIndex = Math.round(scrollLeft / clientWidth);

        if (newIndex !== index && newIndex >= 0 && newIndex < images.length) {
            setIndex(newIndex);
        }
    }, [index, images.length]);

    // Helper to scroll to specific index programmatically
    const scrollToIndex = (i) => {
        if (!scrollContainerRef.current) return;
        const width = scrollContainerRef.current.clientWidth;
        scrollContainerRef.current.scrollTo({
            left: width * i,
            behavior: 'smooth'
        });
    };

    const prev = (e) => {
        e?.stopPropagation();
        const newIndex = index === 0 ? images.length - 1 : index - 1;
        scrollToIndex(newIndex);
    };

    const next = (e) => {
        e?.stopPropagation();
        const newIndex = index === images.length - 1 ? 0 : index + 1;
        scrollToIndex(newIndex);
    };

    if (!images || images.length === 0) return null;

    return (
        <div
            className={`relative group w-full overflow-hidden bg-gray-100 dark:bg-gray-900 select-none ${className}`}
            role="region"
            aria-label="Image Carousel"
        >
            {/* Scrollable Container 
              - snap-x snap-mandatory: Defines the snap behavior
              - overflow-x-auto: Enables native scrolling (Touch friendly)
              - scrollbar-hide: Utility to hide scrollbars
            */}
            <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="flex w-full h-full overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-hide"
                style={{
                    scrollbarWidth: 'none', /* Firefox */
                    msOverflowStyle: 'none'  /* IE 10+ */
                }}
            >
                {/* Inline style to hide webkit scrollbar ensuring self-contained component */}
                <style>{`
                    .scrollbar-hide::-webkit-scrollbar {
                        display: none;
                    }
                `}</style>

                {images.map((img, i) => (
                    <div
                        key={img.publicId || img.url || i}
                        className="relative flex-shrink-0 w-full snap-center flex items-center justify-center bg-gray-50 dark:bg-gray-800/30"
                        style={{ maxHeight: '500px', minHeight: '300px' }}
                        onClick={() => onImageClick && onImageClick(img.url)}
                    >
                        <img
                            src={img.url}
                            alt={`Slide ${i + 1}`}
                            className="w-full h-full object-contain cursor-pointer select-none"
                            style={{ maxHeight: '500px' }}
                            draggable={false}
                            loading={i === 0 ? "eager" : "lazy"}
                        />
                    </div>
                ))}
            </div>

            {/* Controls (Only if > 1 image) */}
            {images.length > 1 && (
                <>
                    {/* Gradient Overlay for Dots Visibility */}
                    <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />

                    {/* Left Button - Hidden on mobile (touch devices), visible on sm+ */}
                    <button
                        onClick={prev}
                        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/30 backdrop-blur-md text-white border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-black/50 hover:scale-110 active:scale-95 hidden sm:flex items-center justify-center"
                        aria-label="Previous image"
                    >
                        <ChevronLeft size={20} />
                    </button>

                    {/* Right Button - Hidden on mobile, visible on sm+ */}
                    <button
                        onClick={next}
                        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/30 backdrop-blur-md text-white border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-black/50 hover:scale-110 active:scale-95 hidden sm:flex items-center justify-center"
                        aria-label="Next image"
                    >
                        <ChevronRight size={20} />
                    </button>

                    {/* Pagination Dots - Click scrolls to position */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                        {images.map((_, i) => (
                            <button
                                key={i}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    scrollToIndex(i);
                                }}
                                className={`h-2 rounded-full transition-all duration-300 shadow-sm ${i === index
                                    ? "w-6 bg-white"
                                    : "w-2 bg-white/50 hover:bg-white/80"
                                    }`}
                                aria-label={`Go to slide ${i + 1}`}
                                aria-current={i === index ? "true" : "false"}
                            />
                        ))}
                    </div>

                    {/* Image Counter */}
                    <div className="absolute top-4 right-4 z-20 px-2 py-1 rounded-md bg-black/50 backdrop-blur-sm text-white text-xs font-medium">
                        {index + 1} / {images.length}
                    </div>
                </>
            )}
        </div>
    );
}