export const optimizeImage = (src, { width, quality = 80 } = {}) => {
  // If the image is from an external source, return as is
  if (src.startsWith('http')) return src;
  
  // For local images, return the path as is in development
  if (process.env.NODE_ENV === 'development') return src;
  
  // In production, use Vercel's image optimization
  const params = new URLSearchParams();
  if (width) params.set('w', width);
  if (quality) params.set('q', quality);
  
  return `/_next/image?url=${encodeURIComponent(src)}&${params.toString()}`;
};

export const preloadImage = (src) => {
  if (typeof window === 'undefined') return;
  
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = src;
  
  // Add to the document head
  document.head.appendChild(link);
  
  // Clean up
  return () => {
    document.head.removeChild(link);
  };
};
