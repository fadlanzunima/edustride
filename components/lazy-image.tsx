"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * LazyImage Component
 *
 * A performance-optimized image component with:
 * - Lazy loading using IntersectionObserver
 * - Skeleton loading state
 * - Error handling
 * - Fade-in animation
 */
export function LazyImage({
  src,
  alt,
  className,
  containerClassName,
  priority = false,
  onLoad,
  onError,
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "50px", // Start loading 50px before it comes into view
        threshold: 0.01,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden", containerClassName)}
    >
      {!isLoaded && !hasError && <Skeleton className="absolute inset-0" />}

      {hasError ? (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <span className="text-muted-foreground text-sm">Failed to load</span>
        </div>
      ) : (
        isInView && (
          <img
            ref={imgRef}
            src={src}
            alt={alt}
            className={cn(
              "transition-opacity duration-300",
              isLoaded ? "opacity-100" : "opacity-0",
              className
            )}
            onLoad={handleLoad}
            onError={handleError}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
          />
        )
      )}
    </div>
  );
}
