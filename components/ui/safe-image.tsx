"use client";

import Image from "next/image";
import { useState } from "react";

interface SafeImageProps extends Omit<React.ComponentProps<typeof Image>, "onError"> {
  fallbackClassName?: string;
}

/**
 * Imagen que muestra un placeholder si falla la carga (p. ej. URL externa o CORS).
 */
export function SafeImage({ src, alt, className, fallbackClassName, ...props }: SafeImageProps) {
  const [error, setError] = useState(false);

  if (error || !src) {
    const fillClass = props.fill ? "absolute inset-0 size-full" : "";
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-sage-100 to-cream-100 text-sage-500 ${fillClass} ${fallbackClassName ?? ""}`}
        aria-label={alt}
      >
        <span className="text-sm font-medium">Sin imagen</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      unoptimized
      {...props}
    />
  );
}
