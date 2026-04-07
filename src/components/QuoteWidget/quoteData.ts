// ─────────────────────────────────────────────────────────────────────────────
// OWNER-EDITABLE: This is the only file you need to touch for pricing updates.
//
//   1. Replace prices with actual numbers (e.g. '$189–$249')
//   2. Adjust `features` bullet points per tier to match your service offerings
//   3. Update phone numbers or email if they ever change (CONTACT section below)
//   4. Replace image paths with your own product photos if desired
//
// No other files need to be touched for pricing updates.
// ─────────────────────────────────────────────────────────────────────────────

// ── Contact info ─────────────────────────────────────────────────────────────

export const CONTACT = {
  louisville: { label: 'Louisville',   display: '502-619-5198', href: 'tel:5026195198' },
  lexington:  { label: 'Lexington',    display: '859-436-2954', href: 'tel:8594362954' },
  nky:        { label: 'Northern KY',  display: '859-306-0782', href: 'tel:8593060782' },
} as const;

export const EMAIL = 'service@derbystronggaragedoors.com';

// ── Types ─────────────────────────────────────────────────────────────────────

export type ServiceKey = 'spring_repair' | 'cable_roller' | 'opener_repair' | 'opener_replace' | 'tuneup';

export interface Tier {
  label: 'Good' | 'Better' | 'Best';
  headline: string;
  price: string;          // main price, e.g. '$189'
  priceRange?: string;    // secondary range, e.g. '– $249'
  priceNote?: string;     // optional sub-note, e.g. 'per spring'
  financing?: string;     // optional financing line, e.g. 'As low as $12/mo'
  image: string;          // path to product image
  features: string[];
  cta: string;
  popular?: true;
}

export interface ServiceConfig {
  id: ServiceKey;
  label: string;
  subtitle: string;
  description: string;
  icon: string;
  qualifier: {
    question: string;
    pills: string[];
  };
  tiers: [Tier, Tier, Tier];
}

// ── SVG path icons (inline, no icon library needed) ──────────────────────────

const ICONS = {
  spring:  'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z',
  cable:   'M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z',
  opener:  'M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 4l5 2.18V11c0 3.5-2.33 6.79-5 7.93-2.67-1.14-5-4.43-5-7.93V7.18L12 5z',
  replace: 'M19 8l-4 4h3c0 3.31-2.69 6-6 6-1.01 0-1.97-.25-2.8-.7l-1.46 1.46C8.97 19.54 10.43 20 12 20c4.42 0 8-3.58 8-8h3l-4-4zM6 12c0-3.31 2.69-6 6-6 1.01 0 1.97.25 2.8.7l1.46-1.46C15.03 4.46 13.57 4 12 4c-4.42 0-8 3.58-8 8H1l4 4 4-4H6z',
  tuneup:  'M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z',
};

// ── Services ──────────────────────────────────────────────────────────────────

export const SERVICES: ServiceConfig[] = [
  {
    id: 'spring_repair',
    label: 'Spring Repair',
    subtitle: 'Most spring repairs completed same-day.',
    description: 'Loud bang, door won\'t open, or cable fell',
    icon: ICONS.spring,
    qualifier: {
      question: 'How wide is your garage door?',
      pills: ['Single car (8–9 ft)', 'Double car (14–18 ft)', 'Not sure'],
    },
    tiers: [
      {
        label: 'Good',
        headline: 'Standard Spring',
        price: '$189',
        priceRange: '– $249',
        image: '/images/spring-standard.svg',
        features: [
          'Single spring replacement',
          'Standard spring (5,000 cycle life)',
          '90-day parts warranty',
          'Safety test included',
        ],
        cta: 'Book Good',
      },
      {
        label: 'Better',
        headline: 'High-Cycle Spring',
        price: '$289',
        priceRange: '– $369',
        image: '/images/spring-highcycle.svg',
        features: [
          'Double spring replacement',
          'High-cycle spring (10,000+ cycles)',
          'Full door tune-up included',
          'Cable inspection',
          '1-year parts warranty',
        ],
        cta: 'Book Better',
        popular: true,
      },
      {
        label: 'Best',
        headline: 'Extended Life',
        price: '$399',
        priceRange: '– $499',
        image: '/images/spring-extended.svg',
        features: [
          'High-cycle springs (20,000+ cycles)',
          'New cables & end bearings',
          'Full hardware inspection',
          'Balance and safety test',
          '2-year parts & labor warranty',
        ],
        cta: 'Book Best',
      },
    ],
  },

  {
    id: 'cable_roller',
    label: 'Cable & Roller Repair',
    subtitle: 'Cable and roller issues often fixed same-hour.',
    description: 'Door off-track, snapped cable, or grinding noise',
    icon: ICONS.cable,
    qualifier: {
      question: "What's the main symptom?",
      pills: ['Off track', 'Frayed or broken cable', 'Noisy rollers', 'Moves unevenly'],
    },
    tiers: [
      {
        label: 'Good',
        headline: 'Single Cable',
        price: '$129',
        priceRange: '– $179',
        image: '/images/cable-single.svg',
        features: [
          'Single cable replacement',
          'Standard galvanized cable',
          '90-day parts warranty',
          'Safety check included',
        ],
        cta: 'Book Good',
      },
      {
        label: 'Better',
        headline: 'Both Cables + Rollers',
        price: '$249',
        priceRange: '– $329',
        image: '/images/cable-rollers.svg',
        features: [
          'Both cables replaced',
          'Nylon roller upgrade (12-pack)',
          'Track alignment check',
          'Door lubrication',
          '1-year parts warranty',
        ],
        cta: 'Book Better',
        popular: true,
      },
      {
        label: 'Best',
        headline: 'Full Cable System',
        price: '$349',
        priceRange: '– $449',
        image: '/images/cable-full.svg',
        features: [
          'Both cables + drums replaced',
          'Premium nylon rollers',
          'Full track realignment',
          'Spring tension check',
          '2-year parts & labor warranty',
        ],
        cta: 'Book Best',
      },
    ],
  },

  {
    id: 'opener_repair',
    label: 'Opener Repair',
    subtitle: 'Most opener issues diagnosed and fixed on the first visit.',
    description: 'Motor won\'t run, remote issues, or sensor problems',
    icon: ICONS.opener,
    qualifier: {
      question: "What's happening with your opener?",
      pills: ["Wall button won't work", 'Remote stopped working', "Hums but won't move", 'Sensor light blinking'],
    },
    tiers: [
      {
        label: 'Good',
        headline: 'Basic Repair',
        price: '$99',
        priceRange: '– $149',
        image: '/images/opener-basic.svg',
        features: [
          'Diagnostic & single repair',
          'Remote reprogramming if needed',
          'Safety sensor adjustment',
          '90-day labor warranty',
        ],
        cta: 'Book Good',
      },
      {
        label: 'Better',
        headline: 'Full Diagnostic',
        price: '$179',
        priceRange: '– $249',
        image: '/images/opener-diagnostic.svg',
        features: [
          'Complete opener diagnostic',
          'Logic board inspection',
          'New safety sensors if needed',
          'Remote & keypad programming',
          '1-year labor warranty',
        ],
        cta: 'Book Better',
        popular: true,
      },
      {
        label: 'Best',
        headline: 'Repair + Tune-Up',
        price: '$279',
        priceRange: '– $349',
        image: '/images/opener-tuneup.svg',
        features: [
          'Full opener repair',
          'Complete door tune-up',
          'All sensors & accessories',
          'Wi-Fi module setup (if compatible)',
          '2-year parts & labor warranty',
        ],
        cta: 'Book Best',
      },
    ],
  },

  {
    id: 'opener_replace',
    label: 'New Opener Install',
    subtitle: 'We install LiftMaster, Chamberlain, and Amarr openers.',
    description: 'Replace old or broken opener with a new model',
    icon: ICONS.replace,
    qualifier: {
      // NOTE: opener_replace uses the opener_guide screen instead of this qualifier.
      // This question is a fallback only.
      question: 'What size is your garage door?',
      pills: ['Single car (1 door)', 'Double car (2-car wide)', 'Not sure'],
    },
    tiers: [
      {
        label: 'Good',
        headline: 'Chamberlain Chain Drive',
        price: '$399',
        priceRange: '– $499',
        financing: 'As low as $35/mo',
        image: '/images/opener-chain.svg',
        features: [
          'Chamberlain 1/2 HP chain drive',
          '2 remotes + wall button',
          'Safety sensors included',
          'Professional installation',
          '1-year parts warranty',
        ],
        cta: 'Book Good',
      },
      {
        label: 'Better',
        headline: 'Chamberlain Belt Drive + WiFi',
        price: '$549',
        priceRange: '– $699',
        financing: 'As low as $49/mo',
        image: '/images/opener-belt.svg',
        features: [
          'Chamberlain 1.5 HP belt drive',
          'Built-in WiFi + myQ app',
          '2 remotes + wall button + keypad',
          'Battery backup',
          '2-year parts warranty',
        ],
        cta: 'Book Better',
        popular: true,
      },
      {
        label: 'Best',
        headline: 'Chamberlain Smart Belt Drive',
        price: '$749',
        priceRange: '– $899',
        financing: 'As low as $65/mo',
        image: '/images/opener-smart.svg',
        features: [
          'Chamberlain 1.5 HP smart belt drive',
          'Built-in WiFi & camera',
          'myQ app control',
          'Battery backup',
          'Full accessory package',
          '3-year parts warranty',
        ],
        cta: 'Book Best',
      },
    ],
  },

  {
    id: 'tuneup',
    label: 'Tune-Up & Maintenance',
    subtitle: "Regular maintenance extends your door's life by years.",
    description: 'Noisy, slow, or due for annual service',
    icon: ICONS.tuneup,
    qualifier: {
      question: 'When was your last service?',
      pills: ['Never / unknown', 'Over 2 years ago', 'Within the last year', 'Just making noise'],
    },
    tiers: [
      {
        label: 'Good',
        headline: 'Basic Tune-Up',
        price: '$79',
        priceRange: '– $99',
        image: '/images/tuneup-basic.svg',
        features: [
          'Lubricate all moving parts',
          'Tighten hardware',
          'Safety sensor test',
          'Visual inspection',
        ],
        cta: 'Book Good',
      },
      {
        label: 'Better',
        headline: 'Full Tune-Up',
        price: '$129',
        priceRange: '– $169',
        image: '/images/tuneup-full.svg',
        features: [
          'Everything in Basic',
          'Spring tension adjustment',
          'Balance & force test',
          'Weather seal inspection',
          'Written service report',
        ],
        cta: 'Book Better',
        popular: true,
      },
      {
        label: 'Best',
        headline: 'Premium Maintenance',
        price: '$199',
        priceRange: '– $269',
        image: '/images/tuneup-premium.svg',
        features: [
          'Everything in Full Tune-Up',
          'Roller replacement (nylon)',
          'Cable & drum inspection',
          'Opener performance test',
          '6-month follow-up included',
        ],
        cta: 'Book Best',
      },
    ],
  },
];
