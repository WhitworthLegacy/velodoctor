import { NextResponse } from 'next/server';
import { FALLBACK_REVIEWS, normalizeReviews } from '@/lib/reviews';

const GOOGLE_PLACES_URL = 'https://maps.googleapis.com/maps/api/place/details/json';

export const revalidate = 3600;

type GooglePlaceReview = {
  author_name: string;
  rating: number;
  text?: string;
  relative_time_description?: string;
  profile_photo_url?: string;
};

type GooglePlaceResult = {
  name?: string;
  rating?: number;
  user_ratings_total?: number;
  reviews?: GooglePlaceReview[];
};

type GooglePlaceDetailsResponse = {
  status: string;
  result?: GooglePlaceResult;
  error_message?: string;
};

const cacheHeaders = {
  'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400',
};

export async function GET() {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) {
    return NextResponse.json(
      {
        source: 'fallback',
        reviews: FALLBACK_REVIEWS,
        averageRating: 5.0,
        totalRatings: FALLBACK_REVIEWS.length,
      },
      { headers: cacheHeaders }
    );
  }

  const url = new URL(GOOGLE_PLACES_URL);
  url.searchParams.set('place_id', placeId);
  url.searchParams.set('fields', 'name,rating,user_ratings_total,reviews');
  url.searchParams.set('language', 'fr');
  url.searchParams.set('key', apiKey);

  try {
    const response = await fetch(url.toString(), {
      next: { revalidate },
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          source: 'fallback',
          reviews: FALLBACK_REVIEWS,
          averageRating: 5.0,
          totalRatings: FALLBACK_REVIEWS.length,
        },
        { headers: cacheHeaders }
      );
    }

    const data: GooglePlaceDetailsResponse = await response.json();

    if (data.status !== 'OK') {
      return NextResponse.json(
        {
          source: 'fallback',
          reviews: FALLBACK_REVIEWS,
          averageRating: 5.0,
          totalRatings: FALLBACK_REVIEWS.length,
        },
        { headers: cacheHeaders }
      );
    }

    const place = data.result || {};
    const normalizedReviews = normalizeReviews(place.reviews || []);

    if (normalizedReviews.length === 0) {
      return NextResponse.json(
        {
          source: 'fallback',
          reviews: FALLBACK_REVIEWS,
          averageRating: 5.0,
          totalRatings: FALLBACK_REVIEWS.length,
        },
        { headers: cacheHeaders }
      );
    }

    return NextResponse.json(
      {
        source: 'google',
        reviews: normalizedReviews,
        averageRating: place.rating ?? null,
        totalRatings: place.user_ratings_total ?? null,
      },
      { headers: cacheHeaders }
    );
  } catch (error) {
    console.error('Google reviews API error:', error);
    return NextResponse.json(
      {
        source: 'fallback',
        reviews: FALLBACK_REVIEWS,
        averageRating: 5.0,
        totalRatings: FALLBACK_REVIEWS.length,
      },
      { headers: cacheHeaders }
    );
  }
}
