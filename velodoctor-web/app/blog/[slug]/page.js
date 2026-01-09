import Link from 'next/link';
import { notFound } from 'next/navigation';
import Section from '@/components/Section';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { blogPosts, getBlogPost } from '@/lib/blog';

export async function generateMetadata({ params }) {
  const post = getBlogPost(params.slug);

  if (!post) {
    return {
      title: "Article non trouvé | VeloDoctor",
    };
  }

  return {
    title: `${post.title} | VeloDoctor`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
    },
  };
}

export default function BlogPostPage({ params }) {
  const post = getBlogPost(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white">
      <Section spacing="sm" background="white">
        <Link href="/blog" className="text-sm text-gray-600 hover:text-vdPrimary transition">
          ← Retour au blog
        </Link>
      </Section>

      <Section spacing="default" background="white">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm text-gray-500 mb-3">
            {new Date(post.date).toLocaleDateString('fr-BE', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })}{' '}
            · {post.readingTime}
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-vdDark mb-6">
            {post.title}
          </h1>
          <p className="text-lg text-gray-700 mb-8">{post.description}</p>

          <div className="space-y-6 text-gray-700 leading-relaxed">
            {post.content.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          <Card className="mt-10">
            <h2 className="text-xl font-bold text-vdDark mb-2">
              Besoin d'une intervention rapide ?
            </h2>
            <p className="text-gray-600 mb-4">
              Réservez un diagnostic à domicile ou en atelier à Bruxelles.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button href="/booking" variant="primary" size="md">
                Prendre rendez-vous
              </Button>
              <Button href="/contact" variant="secondary" size="md">
                Nous contacter
              </Button>
            </div>
          </Card>
        </div>
      </Section>

      <Section spacing="sm" background="surface">
        <div className="max-w-3xl mx-auto">
          <h3 className="text-lg font-bold text-vdDark mb-4">
            Autres articles
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {blogPosts
              .filter((entry) => entry.slug !== post.slug)
              .slice(0, 2)
              .map((entry) => (
                <Link key={entry.slug} href={`/blog/${entry.slug}`}>
                  <Card className="h-full group" hover={true}>
                    <p className="text-xs text-gray-500 mb-2">
                      {new Date(entry.date).toLocaleDateString('fr-BE', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                    <h4 className="text-base font-bold text-vdDark group-hover:text-vdPrimary transition">
                      {entry.title}
                    </h4>
                  </Card>
                </Link>
              ))}
          </div>
        </div>
      </Section>
    </main>
  );
}
