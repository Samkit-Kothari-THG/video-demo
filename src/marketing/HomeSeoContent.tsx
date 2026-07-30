import Link from 'next/link';
import {occasionPages, occasionSlugs} from './occasionPages';
import styles from './Marketing.module.css';

const homeFaqs = [
  {
    question: 'What can I create with Vowframe?',
    answer:
      'Every original design can become a 30-second video invitation, a six-second animated loop, or a high-resolution photo invite.',
  },
  {
    question: 'Which occasions are supported?',
    answer:
      'The current collection includes invitations for weddings, engagements, birthdays, baby showers, and housewarmings, with two distinct design directions for each.',
  },
  {
    question: 'Can I use my own photo and wording?',
    answer:
      'Yes. You can edit the names, event line, date, venue, and host details, then choose whether to feature your own portrait or keep the invitation design-led.',
  },
  {
    question: 'How do I share a finished invitation?',
    answer:
      'Export video as MP4, an animated invite as MP4 or GIF, or a photo invitation as PNG. Each format is vertical and designed for phone-first sharing.',
  },
] as const;

export const HomeSeoContent = () => (
  <section
    aria-labelledby="invitation-maker-heading"
    className={styles.homeDiscovery}
  >
    <div className={styles.contentShell}>
      <div className={styles.sectionIntro}>
        <span className={styles.kicker}>Made for meaningful moments</span>
        <h2 id="invitation-maker-heading">
          One invitation maker, three ways to share.
        </h2>
        <p>
          Start with an original design and personalize the names, date, venue,
          portrait, and sound. Vowframe carries the same visual story across a
          cinematic video, a looping animated invite, and a polished photo card.
        </p>
      </div>

      <nav aria-label="Invitation occasions" className={styles.occasionGrid}>
        {occasionSlugs.map((slug, index) => {
          const occasion = occasionPages[slug];
          return (
            <Link
              className={styles.occasionCard}
              href={`/invitations/${slug}`}
              key={slug}
            >
              <span aria-hidden="true">0{index + 1}</span>
              <div>
                <strong>{occasion.shortLabel}</strong>
                <small>{occasion.description}</small>
              </div>
              <span aria-hidden="true">→</span>
            </Link>
          );
        })}
      </nav>

      <div className={styles.homeValueGrid}>
        <article>
          <span>01</span>
          <h3>Designed for the occasion</h3>
          <p>
            Each collection has its own fields, pacing, artwork, and language,
            so a wedding does not feel like a recoloured birthday template.
          </p>
        </article>
        <article>
          <span>02</span>
          <h3>Personal without starting from scratch</h3>
          <p>
            Add the story only you can provide. The design system handles
            layout, motion, readable type, and a consistent finish.
          </p>
        </article>
        <article>
          <span>03</span>
          <h3>Built for phone-first sharing</h3>
          <p>
            Preview the complete invitation in a vertical format before you
            export it for direct messages, social stories, or printing.
          </p>
        </article>
      </div>

      <section aria-labelledby="home-faq-heading" className={styles.homeFaq}>
        <div>
          <span className={styles.kicker}>Questions, answered</span>
          <h2 id="home-faq-heading">Before you begin.</h2>
        </div>
        <div className={styles.faqList}>
          {homeFaqs.map((faq) => (
            <details key={faq.question}>
              <summary>{faq.question}</summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </div>

    <footer className={styles.marketingFooter}>
      <span>© {new Date().getFullYear()} Vowframe Invitation Studio</span>
      <nav aria-label="Invitation guides" className={styles.footerLinks}>
        {occasionSlugs.map((slug) => (
          <Link href={`/invitations/${slug}`} key={slug}>
            {occasionPages[slug].label}
          </Link>
        ))}
      </nav>
    </footer>
  </section>
);
