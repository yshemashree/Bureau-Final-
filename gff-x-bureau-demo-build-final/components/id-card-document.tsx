'use client';

import { useState } from 'react';
import { getDocSampleImages, getFirstDocSampleImages, isAcceptedCountry } from '@/lib/document-sample-images';

interface IDCardProps {
  countryCode: string;
  scenario: 'success' | 'failure';
  side: 'FRONT' | 'BACK';
  className?: string;
  facePhotoUrl?: string;
  docTypeId?: string;
}

export function IDCardDocument({ countryCode, scenario, side, className = '', facePhotoUrl, docTypeId }: IDCardProps) {
  const [imgFailed, setImgFailed] = useState(false);

  // For the 5 accepted countries, always use real images regardless of docTypeId
  // For other countries with sample images, try docTypeId first then fallback
  let sampleImages = docTypeId ? getDocSampleImages(countryCode, docTypeId) : null;
  
  // Fallback: grab any available images for this country
  if (!sampleImages) {
    sampleImages = getFirstDocSampleImages(countryCode);
  }

  const imageUrl = sampleImages ? (side === 'FRONT' ? sampleImages.front : sampleImages.back) : null;

  // If we have a real document image, render it
  if (imageUrl && !imgFailed) {
    return (
      <div className={`relative w-full h-full overflow-hidden select-none bg-gray-100 ${className}`}>
        <img
          src={imageUrl}
          alt={`${countryCode} document ${side.toLowerCase()}`}
          className="w-full h-full object-cover"
          onError={() => setImgFailed(true)}
          crossOrigin="anonymous"
        />
      </div>
    );
  }

  // No image available — clean gray placeholder
  return (
    <div className={`relative w-full h-full overflow-hidden select-none bg-gray-100 flex items-center justify-center ${className}`}>
      <div className="text-center text-gray-400 text-sm px-4">
        <div className="mb-2">
          <svg className="w-12 h-12 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <p>Document preview</p>
        <p className="text-xs text-gray-300">not available</p>
      </div>
    </div>
  );
}
