import Link from 'next/link';
import Section from '@/components/Section';
import Card from '@/components/Card';
import { blogPosts } from '@/lib/blog';

export const metadata = {
  title: "Blog VeloDoctor - Conseils vélo & trottinette à Bruxelles",
  description:
    "Guides pratiques, entretien, diagnostics et conseils pour vélos et trottinettes électriques à Bruxelles.",
};

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-white">
      <Section spacing="default" background="surface">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-vdDark mb-4">
            Le blog VeloDoctor
          </h1>
          <p className="text-lg text-gray-600">
            Conseils d'entretien, diagnostics et actualités pour vélos et trottinettes électriques.
          </p>
        </div>
      </Section>

      <Section spacing="default" background="white">
        <div className="grid md:grid-cols-2 gap-6">
          {blogPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <Card className="h-full group" hover={true}>
                <p className="text-xs text-gray-500 mb-2">
                  {new Date(post.date).toLocaleDateString('fr-BE', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}{' '}
                  · {post.readingTime}
                </p>
                <h2 className="text-xl font-bold text-vdDark mb-3 group-hover:text-vdPrimary transition">
                  {post.title}
                </h2>
                <p className="text-gray-600">{post.excerpt}</p>
              </Card>
            </Link>
          ))}
        </div>
      </Section>
    </main>
  );
}
