export interface SiteConfig {
  name: string;
  tagline: string;
  description: string;
  school: string;
  foundedYear: string;
  mission: string;
  vision: string;
  email: string;
  phone: string;
  address: string;
  facebook: string;
  twitter: string;
  instagram: string;
  youtube: string;
  tiktok: string;
}

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  name: 'The Beacon',
  tagline: 'The Official Student Publication',
  description:
    "Harrow Hill High School's official student publication — informing, inspiring, and connecting our school community through quality journalism since 1985.",
  school: 'Harrow Hill High School',
  foundedYear: '1985',
  mission:
    'To provide Harrow Hill High School students with a credible, inclusive, and student-led platform for journalism — one that cultivates critical thinking, sharpens communication skills, and amplifies the voices that matter within our community.',
  vision:
    'A school community that is well-informed, civically engaged, and empowered by honest storytelling — where every student has access to quality journalism and the opportunity to contribute to it.',
  email: 'thebeacon@harrowhill.edu',
  phone: '(555) 743-9200',
  address: '12 Harrow Hill Drive, Eastfield, NY 10248',
  facebook: '',
  twitter: '',
  instagram: '',
  youtube: '',
  tiktok: '',
};
