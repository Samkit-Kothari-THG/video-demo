import type {InvitationCategory} from '../templates';

export const occasionSlugs = [
  'wedding',
  'engagement',
  'birthday',
  'baby-shower',
  'housewarming',
] as const;

export type OccasionSlug = (typeof occasionSlugs)[number];

export type OccasionPageContent = {
  slug: OccasionSlug;
  category: InvitationCategory;
  label: string;
  shortLabel: string;
  eyebrow: string;
  title: string;
  metaTitle: string;
  description: string;
  introduction: string;
  heroImage: string;
  heroImageAlt: string;
  formatLead: string;
  formatNotes: {
    video: string;
    animated: string;
    photo: string;
  };
  templateLead: string;
  steps: readonly {
    title: string;
    description: string;
  }[];
  checklistTitle: string;
  checklistLead: string;
  checklist: readonly string[];
  faqs: readonly {
    question: string;
    answer: string;
  }[];
};

export const occasionPages: Record<OccasionSlug, OccasionPageContent> = {
  wedding: {
    slug: 'wedding',
    category: 'wedding',
    label: 'Wedding invitations',
    shortLabel: 'Wedding',
    eyebrow: 'Wedding invitation maker',
    title: 'Create a wedding invitation that feels like your celebration.',
    metaTitle: 'Wedding Invitation Maker — Video, Animated & Photo',
    description:
      'Make a personalized wedding video invitation, animated card, or photo invite with your names, ceremony details, portrait, and music.',
    introduction:
      'Turn your names, date, venue, and favourite portrait into a polished invitation guests can watch or open on their phones. Every Vowframe wedding design adapts to video, a looping animated card, and a high-resolution photo invite.',
    heroImage: '/templates/wedding-noor.webp',
    heroImageAlt:
      'Noor at Midnight wedding invitation design with moonlit palace details',
    formatLead:
      'Choose the format around the way your guests will receive the news, without rebuilding the design.',
    formatNotes: {
      video:
        'Tell the story in a cinematic 30-second sequence with names, venue, portrait moments, and music.',
      animated:
        'Keep the essential details visible in a refined six-second loop for quick messaging.',
      photo:
        'Share or print a crisp vertical card with the full ceremony information in one frame.',
    },
    templateLead:
      'Choose between moonlit celebration and sunlit garden art, then personalize the same design in any format.',
    steps: [
      {
        title: 'Choose the wedding mood',
        description:
          'Start with a design that matches the ceremony—ornate and evening-led, or quiet, modern, and sunlit.',
      },
      {
        title: 'Add the details guests need',
        description:
          'Enter both names, the ceremony or reception, date and time, venue, and the hosting families.',
      },
      {
        title: 'Preview, export, and share',
        description:
          'Review every scene, refine the portrait and soundtrack, then export the format that fits your guest list.',
      },
    ],
    checklistTitle: 'What to include in a wedding invitation',
    checklistLead:
      'A clear invitation can still feel cinematic. Keep these practical details easy to find:',
    checklist: [
      'Both partners’ names and the celebration type',
      'The complete date, start time, venue, and city',
      'A host or family line where it matters to the ceremony',
      'One clear next step for RSVP or further event information',
    ],
    faqs: [
      {
        question: 'Can I make both a wedding video and a photo invitation?',
        answer:
          'Yes. The same wedding design supports video, animated, and photo formats, so the visual direction can stay consistent across different guest groups.',
      },
      {
        question: 'Can I add our own photo and music?',
        answer:
          'You can add a portrait and choose from the included soundtrack library. Music uploads are also supported when you confirm you have permission to use the track.',
      },
      {
        question: 'What size is the finished wedding invitation?',
        answer:
          'Vowframe creates vertical 1080 × 1920 invitations designed for phone viewing. Video exports as MP4, animated invites as MP4 or GIF, and photo invites as PNG.',
      },
    ],
  },
  engagement: {
    slug: 'engagement',
    category: 'engagement',
    label: 'Engagement invitations',
    shortLabel: 'Engagement',
    eyebrow: 'Engagement invitation maker',
    title: 'Announce the beginning beautifully.',
    metaTitle: 'Engagement Invitation Maker — Video, Animated & Photo',
    description:
      'Create a personalized engagement video invitation, animated card, or photo invite with your names, date, venue, portrait, and music.',
    introduction:
      'Make the engagement announcement feel personal from the first frame. Add your names, celebration details, portrait, and soundtrack to an original design, then share it as a cinematic video, animated loop, or polished photo card.',
    heroImage: '/templates/engagement-monsoon-v2.webp',
    heroImageAlt:
      'Monsoon Glass engagement invitation design with white roses and editorial light',
    formatLead:
      'Use one visual story across family groups, social posts, and direct messages.',
    formatNotes: {
      video:
        'Build anticipation with a 30-second name reveal, portrait moment, celebration details, and music.',
      animated:
        'Send a lightweight looping announcement that keeps the date and venue readable.',
      photo:
        'Share a high-resolution engagement card that is easy to save, forward, or print.',
    },
    templateLead:
      'Begin with warm marigold celebration or a rain-softened editorial look, then make every line your own.',
    steps: [
      {
        title: 'Pick the announcement style',
        description:
          'Choose a classic festive treatment or a modern, minimal design built around light and portraiture.',
      },
      {
        title: 'Personalize the story',
        description:
          'Add both names, the engagement date and time, venue, family line, and an optional couple portrait.',
      },
      {
        title: 'Choose how it travels',
        description:
          'Preview the result and export a video, seamless animated loop, or static invitation for your guests.',
      },
    ],
    checklistTitle: 'What to include in an engagement invitation',
    checklistLead:
      'Give guests a warm announcement and enough information to act without hunting for details.',
    checklist: [
      'The couple’s names and a clear engagement heading',
      'The celebration date, start time, venue, and city',
      'The names of hosts or families, if part of the occasion',
      'An RSVP contact or follow-up message where needed',
    ],
    faqs: [
      {
        question: 'How long is an engagement invitation video?',
        answer:
          'Vowframe video invitations are designed as focused 30-second stories—long enough for a reveal, portrait, and practical details without making guests search for the date or venue.',
      },
      {
        question: 'Do I have to use a couple photo?',
        answer:
          'No. You can feature a portrait, keep the design-led treatment, or decide after previewing the template.',
      },
      {
        question: 'Can I change the invitation wording?',
        answer:
          'Yes. Names, opening line, celebration label, date, venue, and host line are all editable before export.',
      },
    ],
  },
  birthday: {
    slug: 'birthday',
    category: 'birthday',
    label: 'Birthday invitations',
    shortLabel: 'Birthday',
    eyebrow: 'Birthday invitation maker',
    title: 'Set the mood before the party starts.',
    metaTitle: 'Birthday Invitation Maker — Video, Animated & Photo',
    description:
      'Create a personalized birthday video invitation, animated party invite, or photo card with your date, venue, theme, portrait, and music.',
    introduction:
      'Make the invitation feel as considered as the celebration. Vowframe turns the guest of honour, party details, photo, and soundtrack into a bold video, a shareable animated loop, or a crisp photo card.',
    heroImage: '/templates/birthday-disco-v2.webp',
    heroImageAlt:
      'Disco After Dark birthday invitation design with chrome and iridescent ribbons',
    formatLead:
      'Match the energy of the event and the attention span of the group chat.',
    formatNotes: {
      video:
        'Use movement, music, and kinetic type to introduce the guest of honour and party plan.',
      animated:
        'Send a lively six-second loop that repeats cleanly while keeping the details on screen.',
      photo:
        'Create a bold vertical card for quick forwarding, social stories, and printing.',
    },
    templateLead:
      'Go bright with tactile confetti or lean into chrome, midnight colour, and after-dark energy.',
    steps: [
      {
        title: 'Choose the party energy',
        description:
          'Pick playful colour for a joyful gathering or a polished night-time design for a milestone celebration.',
      },
      {
        title: 'Add the party plan',
        description:
          'Enter the guest of honour, milestone or theme, date, time, venue, and host details.',
      },
      {
        title: 'Make it move—or keep it still',
        description:
          'Add an optional photo and music, preview the design, and export the best format for the invite list.',
      },
    ],
    checklistTitle: 'What to include in a birthday invitation',
    checklistLead:
      'Let the personality lead, but make the practical information impossible to miss.',
    checklist: [
      'The guest of honour and milestone or party theme',
      'The date, arrival time, venue, and full location',
      'Dress code, age guidance, or surprise-party note if relevant',
      'An RSVP contact and response date',
    ],
    faqs: [
      {
        question: 'Can I make a birthday invitation for any age?',
        answer:
          'Yes. The editable milestone and event lines work for children’s parties, landmark birthdays, and relaxed gatherings without locking you into a specific age.',
      },
      {
        question: 'Can the birthday invitation include music?',
        answer:
          'Video invitations can use a soundtrack from the included library or an uploaded track you have permission to use. Animated and photo formats keep the focus on the visual card.',
      },
      {
        question: 'Which format is easiest to share?',
        answer:
          'Photo invites are the quickest to forward, animated loops add movement with a small footprint, and video is best when you want the announcement to feel like a short event trailer.',
      },
    ],
  },
  'baby-shower': {
    slug: 'baby-shower',
    category: 'baby-shower',
    label: 'Baby shower invitations',
    shortLabel: 'Baby shower',
    eyebrow: 'Baby shower invitation maker',
    title: 'Create a gentle welcome for a joyful gathering.',
    metaTitle: 'Baby Shower Invitation Maker — Video & Animated',
    description:
      'Create a personalized baby shower video invitation, animated invite, or photo card with parent names, date, venue, host details, and music.',
    introduction:
      'Bring the parents, date, venue, and warmth of the day into one thoughtfully paced invitation. Choose an heirloom or storybook design, personalize the wording, and share it as video, animation, or a photo card.',
    heroImage: '/templates/baby-meadow-v2.webp',
    heroImageAlt:
      'Storybook Meadow baby shower invitation with painterly foliage and woodland details',
    formatLead:
      'Keep the invitation soft and personal while making every guest detail easy to read.',
    formatNotes: {
      video:
        'Tell a 30-second welcome story with family names, gentle motion, an optional portrait, and music.',
      animated:
        'Share a calm looping card that works beautifully in direct messages and family groups.',
      photo:
        'Export a high-resolution keepsake card for messaging, printing, or adding to a gift table.',
    },
    templateLead:
      'Choose moonlit watercolour botanicals or a gender-neutral storybook meadow, with room for a portrait or design-led treatment.',
    steps: [
      {
        title: 'Choose the visual world',
        description:
          'Start with an heirloom moonlit palette or a modern meadow with soft, gender-neutral details.',
      },
      {
        title: 'Add the family details',
        description:
          'Enter the parent or family names, shower date and time, venue, host line, and your preferred wording.',
      },
      {
        title: 'Preview the welcome',
        description:
          'Decide whether to feature a portrait, check every detail, and export the format that suits your guests.',
      },
    ],
    checklistTitle: 'What to include in a baby shower invitation',
    checklistLead:
      'A lovely keepsake should also answer the questions guests will have before the day.',
    checklist: [
      'The parent-to-be or family names and the occasion',
      'The shower date, start time, venue, and city',
      'The host name and RSVP contact',
      'Registry, gifting, theme, or dress guidance only when useful',
    ],
    faqs: [
      {
        question: 'Can I make a gender-neutral baby shower invitation?',
        answer:
          'Yes. Vowframe includes design-led options with neutral palettes, and every text line can be adjusted to match the family’s language for the occasion.',
      },
      {
        question: 'Can I create the invitation without a photo?',
        answer:
          'Yes. Both baby shower design directions can work as fully illustrated invitations, so a portrait is optional.',
      },
      {
        question: 'Can I print the baby shower invitation?',
        answer:
          'The photo format exports as a high-resolution 1080 × 1920 PNG suitable for sharing and small-format printing. Check your printer’s crop and bleed requirements before a large print run.',
      },
    ],
  },
  housewarming: {
    slug: 'housewarming',
    category: 'housewarming',
    label: 'Housewarming invitations',
    shortLabel: 'Housewarming',
    eyebrow: 'Housewarming invitation maker',
    title: 'Open the new door with a warm invitation.',
    metaTitle: 'Housewarming Invitation Maker — Video & Photo',
    description:
      'Create a personalized housewarming or Griha Pravesh video invitation, animated invite, or photo card with your date, new address, and hosts.',
    introduction:
      'Turn a new address into a memorable welcome. Add the hosts, housewarming or Griha Pravesh details, date, time, and location, then share an architectural video, animated loop, or polished photo invitation.',
    heroImage: '/templates/house-modern-v2.webp',
    heroImageAlt:
      'Modern Threshold housewarming invitation with sandstone, jaali, and olive foliage',
    formatLead:
      'Give guests a sense of the home while keeping the date and address effortless to find.',
    formatNotes: {
      video:
        'Reveal the new home through a 30-second architectural story with hosts, address, and music.',
      animated:
        'Send a refined looping welcome that keeps the event details visible throughout.',
      photo:
        'Create a high-resolution card for messaging, neighbourhood groups, and printed keepsakes.',
    },
    templateLead:
      'Choose a handcrafted aangan in morning light or a modern sandstone threshold with quiet architectural detail.',
    steps: [
      {
        title: 'Choose the character of the home',
        description:
          'Begin with a festive, craft-led direction or a contemporary architectural design with restrained colour.',
      },
      {
        title: 'Add the welcome details',
        description:
          'Enter the hosts, housewarming or Griha Pravesh line, date and time, complete address, and closing note.',
      },
      {
        title: 'Check the address and share',
        description:
          'Preview every frame, verify the location carefully, and export the format your guests can open easily.',
      },
    ],
    checklistTitle: 'What to include in a housewarming invitation',
    checklistLead:
      'The new address is the star, so make the arrival details precise and easy to copy.',
    checklist: [
      'The hosts’ names and housewarming or Griha Pravesh heading',
      'The full date, start time, house or building, locality, and city',
      'Landmark, map link, parking, or access guidance when helpful',
      'An RSVP contact and any ceremony-specific arrival note',
    ],
    faqs: [
      {
        question: 'Can I use Vowframe for a Griha Pravesh invitation?',
        answer:
          'Yes. The occasion line is editable, so you can use “Griha Pravesh,” “Housewarming,” or wording that fits the ceremony and family.',
      },
      {
        question: 'Can the invitation show our complete address?',
        answer:
          'Yes. The housewarming template includes a dedicated address field designed for the house or building name, locality, and city. Always preview it at phone size before sharing.',
      },
      {
        question: 'Do I need a photo of the new home?',
        answer:
          'No. The housewarming designs are built around original architectural artwork, with an optional image treatment if you want to personalize further.',
      },
    ],
  },
};

export const getOccasionPage = (value: string) =>
  occasionPages[value as OccasionSlug];
