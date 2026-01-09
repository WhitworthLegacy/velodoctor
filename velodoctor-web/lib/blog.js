const posts = [
  {
    slug: 'entretien-velo-electrique-bruxelles',
    title: "Entretien de vélo électrique à Bruxelles : le guide essentiel",
    description:
      "Conseils pratiques pour entretenir votre vélo électrique à Bruxelles : batterie, freins, pneus et bonnes habitudes.",
    excerpt:
      "Un entretien régulier prolonge la durée de vie de votre VAE. Voici les points clés à vérifier toute l'année.",
    date: '2026-01-12',
    readingTime: '5 min',
    content: [
      "Un vélo électrique bien entretenu roule plus longtemps, consomme moins d'énergie et évite les pannes surprises.",
      "Commencez par vérifier la pression des pneus chaque semaine : une pression trop basse fatigue la batterie.",
      "Nettoyez la transmission régulièrement et lubrifiez la chaîne pour préserver les composants.",
      "Contrôlez l'usure des plaquettes et testez le freinage avant chaque trajet.",
      "Enfin, stockez la batterie à l'abri de l'humidité et évitez les cycles complets trop fréquents.",
    ],
  },
  {
    slug: 'diagnostic-trottinette-electrique',
    title: "Diagnostic de trottinette électrique : quand consulter un pro",
    description:
      "Signes qui indiquent qu'un diagnostic est nécessaire pour votre trottinette électrique.",
    excerpt:
      "Perte d'autonomie, bruits suspects, freinage aléatoire : voici les signaux d'alerte.",
    date: '2026-01-05',
    readingTime: '4 min',
    content: [
      "Une baisse soudaine d'autonomie peut indiquer une batterie fatiguée ou un chargeur défectueux.",
      "Des bruits inhabituels sont souvent liés à un roulement usé ou à un moteur mal aligné.",
      "Si le freinage est irrégulier, un contrôle rapide évite les risques de chute.",
      "Un diagnostic professionnel clarifie l'origine du problème et propose un devis transparent.",
    ],
  },
  {
    slug: 'preparer-velo-hiver-bruxelles',
    title: "Préparer son vélo pour l'hiver à Bruxelles",
    description:
      "Les étapes pour protéger votre vélo et rouler en sécurité pendant l'hiver bruxellois.",
    excerpt:
      "Protection contre l'humidité, vérification des pneus et éclairage : tout ce qu'il faut anticiper.",
    date: '2025-12-20',
    readingTime: '6 min',
    content: [
      "L'hiver bruxellois exige une attention particulière à la corrosion et à l'adhérence.",
      "Nettoyez et séchez votre vélo après les sorties sous la pluie.",
      "Adaptez les pneus avec une bande de roulement plus accrocheuse pour les routes humides.",
      "Vérifiez que l'éclairage est suffisamment puissant pour les trajets à faible visibilité.",
      "Planifiez un contrôle complet en atelier pour éviter les surprises.",
    ],
  },
];

export const blogPosts = posts.sort((a, b) => (a.date < b.date ? 1 : -1));

export const getBlogPost = (slug) =>
  blogPosts.find((post) => post.slug === slug) || null;

