export type Review = {
  authorName: string;
  rating: number;
  text: string;
  relativeTimeDescription?: string;
  profilePhotoUrl?: string;
  badge?: string;
};

const DEFAULT_TEXT_BY_AUTHOR: Record<string, string> = {
  'Rebecca Abouzeid': 'Service au top, je recommande.',
};

export const FALLBACK_REVIEWS: Review[] = [
  {
    authorName: 'Yves Dupont',
    rating: 5,
    text: 'De vrais professionnels et super sympas 🙂 Je vous les recommande sans problème.',
    relativeTimeDescription: 'Il y a 2 mois',
    badge: '3 avis · 5 photos',
  },
  {
    authorName: 'Tuấn Phan',
    rating: 5,
    text: 'Le service rapide et bien fait en plus ils sont respectueux et souriant très sympathique',
    relativeTimeDescription: 'Il y a 3 mois',
    badge: '3 avis',
  },
  {
    authorName: 'Malick Mbaye',
    rating: 5,
    text: 'Professionnelle, travail rapide et efficace',
    relativeTimeDescription: 'Il y a 2 semaines',
    badge: '13 avis',
  },
  {
    authorName: 'Manguel Bah',
    rating: 5,
    text: 'Très bonne mécanicien de trottinette',
    relativeTimeDescription: 'Il y a 2 mois',
    badge: '1 avis',
  },
  {
    authorName: 'Ahmed Hamaideh',
    rating: 5,
    text: 'Top',
    relativeTimeDescription: 'Il y a 4 heures',
  },
  {
    authorName: 'Mounae Haouas',
    rating: 5,
    text: "Trotinette remis a neuf👌Les deux roues sont en plus meilleur que ceux que j'avais avant, increvable donc niquel …",
    relativeTimeDescription: 'Il y a 21 heures',
    badge: '10 avis · 1 photo',
  },
  {
    authorName: 'Rebecca Abouzeid',
    rating: 5,
    text: '',
    relativeTimeDescription: 'Il y a 1 mois',
    badge: 'Local Guide · 9 avis · 11 photos',
  },
];

type NormalizableReview = {
  author_name?: string;
  authorName?: string;
  rating?: number;
  text?: string;
  relative_time_description?: string;
  relativeTimeDescription?: string;
  profile_photo_url?: string;
  profilePhotoUrl?: string;
  badge?: string;
};

export function normalizeReviews(input: NormalizableReview[] = []): Review[] {
  return input.map((review) => {
    const authorName = review.authorName || review.author_name || 'Client vérifié';
    const rawText = (review.text || '').trim();
    const text = rawText || DEFAULT_TEXT_BY_AUTHOR[authorName] || 'Service au top, je recommande.';

    return {
      authorName,
      rating: review.rating ?? 5,
      text,
      relativeTimeDescription:
        review.relativeTimeDescription || review.relative_time_description,
      profilePhotoUrl: review.profilePhotoUrl || review.profile_photo_url,
      badge: review.badge,
    };
  });
}
