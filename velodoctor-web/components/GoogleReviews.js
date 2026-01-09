'use client';

import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import Card from '@/components/Card';

export default function GoogleReviews({ fallbackReviews = [] }) {
  const [reviews, setReviews] = useState(fallbackReviews);
  const [placeMeta, setPlaceMeta] = useState(null);

  useEffect(() => {
    let isActive = true;

    const loadReviews = async () => {
      try {
        const response = await fetch('/api/google-reviews');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.error || 'Failed to fetch reviews');
        }

        if (isActive && Array.isArray(data.reviews) && data.reviews.length > 0) {
          setReviews(data.reviews);
          setPlaceMeta(data.place || null);
        }
      } catch (error) {
        console.error('Google reviews fetch error:', error);
      }
    };

    loadReviews();

    return () => {
      isActive = false;
    };
  }, []);

  const summaryText = placeMeta?.rating
    ? `${placeMeta.rating}/5 · Basé sur ${placeMeta.totalRatings || 'de nombreux'} avis Google`
    : 'Avis clients';

  return (
    <>
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-vdDark mb-3">
          Avis Google
        </h2>
        <div className="flex justify-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-5 h-5 fill-vdAccent text-vdAccent" />
          ))}
        </div>
        <p className="text-gray-600">{summaryText}</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {reviews.slice(0, 3).map((review, index) => (
          <ReviewCard key={`${review.authorName || 'review'}-${index}`} review={review} />
        ))}
      </div>
    </>
  );
}

function ReviewCard({ review }) {
  return (
    <Card className="h-full">
      <div className="flex gap-1 mb-3">
        {[...Array(review.rating || 5)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-vdAccent text-vdAccent" />
        ))}
      </div>
      <p className="text-gray-700 mb-4 leading-relaxed">
        "{review.text || 'Avis client VeloDoctor'}"
      </p>
      <div className="pt-4 border-t border-vdBorder">
        <p className="font-semibold text-vdDark">{review.authorName || 'Client vérifié'}</p>
        <p className="text-sm text-gray-500">{review.relativeTime || 'Avis Google'}</p>
      </div>
    </Card>
  );
}
