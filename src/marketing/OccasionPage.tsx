import Image from 'next/image';
import Link from 'next/link';
import {invitationTemplates} from '../templates/catalog';
import type {OccasionPageContent} from './occasionPages';
import {occasionPages, occasionSlugs} from './occasionPages';
import styles from './Marketing.module.css';

const formatCards = [
  {id: 'video', marker: '▶', title: 'Video invitation'},
  {id: 'animated', marker: '✦', title: 'Animated invite'},
  {id: 'photo', marker: '▧', title: 'Photo invitation'},
] as const;

export const OccasionPage = ({content}: {content: OccasionPageContent}) => {
  const templates = invitationTemplates.filter(
    (template) => template.category === content.category,
  );

  return (
    <div className={styles.occasionPage}>
      <header className={styles.occasionHeader}>
        <Link aria-label="Vowframe home" className={styles.brand} href="/">
          <span className={styles.brandMark}>V</span>
          <strong>Vowframe</strong>
        </Link>
        <Link className={styles.headerCta} href="/#invitation-maker">
          Create an invitation
        </Link>
      </header>

      <main className={styles.occasionMain}>
        <section className={styles.occasionHero}>
          <div className={styles.heroCopy}>
            <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
              <Link href="/">Vowframe</Link>
              <span aria-hidden="true">/</span>
              <span>{content.label}</span>
            </nav>
            <h1>{content.title}</h1>
            <p>{content.introduction}</p>
            <div className={styles.heroActions}>
              <Link className={styles.primaryCta} href="/#invitation-maker">
                Start creating
              </Link>
              <a className={styles.secondaryCta} href="#designs">
                Explore designs
              </a>
            </div>
            <div aria-label="Available invitation formats" className={styles.formatPills}>
              <span>30-second MP4</span>
              <span>Animated MP4 or GIF</span>
              <span>High-resolution PNG</span>
            </div>
          </div>

          <div className={styles.heroArtwork}>
            <Image
              alt={content.heroImageAlt}
              fill
              priority
              sizes="(max-width: 760px) 78vw, 430px"
              src={content.heroImage}
            />
          </div>
        </section>

        <section className={styles.formatSection}>
          <div className={styles.sectionHeader}>
            <span className={styles.kicker}>Choose how it is shared</span>
            <h2>One design, three invitation formats.</h2>
            <p className={styles.sectionLead}>{content.formatLead}</p>
          </div>
          <div className={styles.formatGrid}>
            {formatCards.map((format) => (
              <article className={styles.formatCard} key={format.id}>
                <span aria-hidden="true">{format.marker}</span>
                <h3>{format.title}</h3>
                <p>{content.formatNotes[format.id]}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.templateSection} id="designs">
          <div className={styles.sectionHeader}>
            <span className={styles.kicker}>Original Vowframe designs</span>
            <h2>{content.shortLabel} invitation templates with a point of view.</h2>
            <p className={styles.sectionLead}>{content.templateLead}</p>
          </div>
          <div className={styles.templateGrid}>
            {templates.map((template) => (
              <article
                className={styles.templateCard}
                key={`${template.id}-${template.version}`}
              >
                <Image
                  alt={`${template.name} ${content.shortLabel.toLowerCase()} invitation design`}
                  height={960}
                  sizes="(max-width: 520px) 100vw, (max-width: 1040px) 45vw, 260px"
                  src={template.coverSrc}
                  width={720}
                />
                <div className={styles.templateCardCopy}>
                  <span>
                    {template.categoryLabel} · Edition {template.version}
                  </span>
                  <h3>{template.name}</h3>
                  <p>{template.description}</p>
                  <Link href="/#invitation-maker">Use this direction →</Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.stepsSection}>
          <div className={styles.sectionHeader}>
            <span className={styles.kicker}>How it works</span>
            <h2>Make your {content.shortLabel.toLowerCase()} invitation in three steps.</h2>
          </div>
          <div className={styles.stepsGrid}>
            {content.steps.map((step, index) => (
              <article className={styles.stepCard} key={step.title}>
                <span aria-hidden="true">0{index + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.checklistSection}>
          <div className={styles.checklistPanel}>
            <div>
              <span className={styles.kicker}>Invitation checklist</span>
              <h2>{content.checklistTitle}</h2>
              <p>{content.checklistLead}</p>
            </div>
            <ul className={styles.checklist}>
              {content.checklist.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className={styles.faqSection}>
          <div className={styles.sectionHeader}>
            <span className={styles.kicker}>Common questions</span>
            <h2>{content.shortLabel} invitation FAQ</h2>
          </div>
          <div className={styles.faqList}>
            {content.faqs.map((faq) => (
              <details key={faq.question}>
                <summary>{faq.question}</summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <nav aria-label="Explore other invitation occasions" className={styles.relatedSection}>
          <h2>Explore another occasion</h2>
          <div className={styles.relatedLinks}>
            {occasionSlugs
              .filter((slug) => slug !== content.slug)
              .map((slug) => (
                <Link href={`/invitations/${slug}`} key={slug}>
                  {occasionPages[slug].label}
                </Link>
              ))}
          </div>
        </nav>
      </main>

      <footer className={styles.marketingFooter}>
        <span>© {new Date().getFullYear()} Vowframe Invitation Studio</span>
        <div className={styles.footerLinks}>
          <Link href="/">Invitation maker</Link>
          <Link href="/sitemap.xml">Sitemap</Link>
        </div>
      </footer>
    </div>
  );
};
