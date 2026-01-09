import { NextResponse } from 'next/server';

const GOOGLE_PLACES_URL = 'https://maps.googleapis.com/maps/api/place/details/json';

type GoogleReview = {
  author_name: string;
  rating: number;
  text: string;
  relative_time_description?: string;
  profile_photo_url?: string;
};

export async function GET() {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) {
    return NextResponse.json(
      { error: 'Missing Google Places configuration' },
      { status: 500 }
    );
  }

  const url = new URL(GOOGLE_PLACES_URL);
  url.searchParams.set('place_id', placeId);
  url.searchParams.set('fields', 'name,rating,user_ratings_total,reviews');
  url.searchParams.set('language', 'fr');
  url.searchParams.set('key', apiKey);

  try {
    const response = await fetch(url.toString(), {
      next: { revalidate: 21600 },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch Google reviews' },
        { status: 502 }
      );
    }

    const data = await response.json();

    if (data.status !== 'OK') {
      return NextResponse.json(
        { error: data.error_message || 'Google Places API error', status: data.status },
        { status: 502 }
      );
    }

    const place = data.result || {};
    const reviews = (place.reviews || []).map((review: GoogleReview) => ({
      authorName: review.author_name,
      rating: review.rating,
      text: review.text,
      relativeTime: review.relative_time_description,
      profilePhoto: review.profile_photo_url,
    }));

    return NextResponse.json({
      place: {
        name: place.name,
        rating: place.rating,
        totalRatings: place.user_ratings_total,
      },
      reviews,
    });
  } catch (error) {
    console.error('Google reviews API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Google reviews' },
      { status: 500 }
    );
  }
}
