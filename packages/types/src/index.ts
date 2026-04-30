// Common API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

// User/App context
export interface UserContext {
  id: string;
  email: string;
  orgId?: string;
}

// App-specific types

// 1. Lighthouse Batch Scanner
export interface LighthouseAuditRequest {
  urls: string[];
  device?: 'mobile' | 'desktop';
  categories?: ('performance' | 'accessibility' | 'best-practices' | 'seo' | 'pwa')[];
}

export interface LighthouseAuditResult {
  url: string;
  score: number;
  categories: {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
    pwa?: number;
  };
  metrics: {
    lcp?: number;
    fcp?: number;
    cls?: number;
    ttfb?: number;
    inp?: number;
    tbt?: number;
  };
  reportUrl?: string;
  auditedAt: string;
}

export interface BatchAuditJob {
  id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  totalUrls: number;
  completedUrls: number;
  results?: LighthouseAuditResult[];
  pdfUrl?: string;
  createdAt: string;
  completedAt?: string;
}

// 2. Local SEO Audit Kit
export interface GMBProfile {
  name?: string;
  address?: string;
  phone?: string;
  website?: string;
  rating?: number;
  reviewCount?: number;
  categories?: string[];
  hours?: Record<string, string>;
  photos?: string[];
  attributes?: Record<string, boolean>;
}

export interface CitationSource {
  name: string;
  url: string;
  napConsistency: 'consistent' | 'inconsistent' | 'missing';
  da?: number;
}

export interface CitationReport {
  totalCitations: number;
  consistent: number;
  inconsistent: number;
  missing: number;
  sources: CitationSource[];
}

export interface SchemaValidationResult {
  type: string;
  valid: boolean;
  errors?: string[];
  warnings?: string[];
  structuredData?: unknown;
}

export interface LocalSEOAudit {
  id: string;
  businessName: string;
  gmbProfile?: GMBProfile;
  citations?: CitationReport;
  schemaValidations?: SchemaValidationResult[];
  score: number;
  createdAt: string;
}

// 3. Lead Form Builder
export interface FormField {
  id: string;
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'file';
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
  validation?: {
    pattern?: string;
    minLength?: number;
    maxLength?: number;
  };
}

export interface FormDesign {
  theme: 'light' | 'dark' | 'custom';
  primaryColor?: string;
  borderRadius?: 'none' | 'small' | 'medium' | 'large';
  buttonStyle?: 'filled' | 'outline' | 'ghost';
}

export interface FormIntegration {
  type: 'zapier' | 'webhook' | 'crm';
  config: Record<string, string>;
}

export interface LeadForm {
  id: string;
  name: string;
  fields: FormField[];
  design: FormDesign;
  integrations: FormIntegration[];
  recaptchaEnabled: boolean;
  submissions: number;
  embedCode?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FormSubmission {
  id: string;
  formId: string;
  data: Record<string, unknown>;
  ip?: string;
  userAgent?: string;
  submittedAt: string;
}

// 4. Service Area Map Generator
export interface ServiceArea {
  id: string;
  name: string;
  center: {
    lat: number;
    lng: number;
  };
  radius: number;
  zipCodes?: string[];
  cities?: string[];
  polygon?: {
    lat: number;
    lng: number;
  }[];
}

export interface MapStyle {
  theme: 'default' | 'minimal' | 'dark' | 'custom';
  primaryColor?: string;
  markerStyle?: 'pin' | 'dot' | 'custom';
  showLabels?: boolean;
}

export interface ServiceAreaMap {
  id: string;
  businessName: string;
  businessAddress?: string;
  areas: ServiceArea[];
  style: MapStyle;
  embedCode: string;
  embedUrl: string;
  createdAt: string;
  updatedAt: string;
}

// 5. Cold Outreach Sequencer
export interface Prospect {
  id: string;
  name?: string;
  email: string;
  company?: string;
  website?: string;
  industry?: string;
  location?: string;
  source: 'csv' | 'manual' | 'api';
  tags?: string[];
  status: 'new' | 'contacted' | 'responded' | 'booked' | 'lost';
  customFields?: Record<string, string>;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  variables: string[];
  tone?: 'professional' | 'casual' | 'friendly' | 'formal';
}

export interface SequenceStep {
  id: string;
  stepNumber: number;
  delayDays: number;
  templateId: string;
  condition?: 'opened' | 'replied' | 'clicked' | 'no_reply';
}

export interface OutreachSequence {
  id: string;
  name: string;
  description?: string;
  steps: SequenceStep[];
  prospects: Prospect[];
  status: 'draft' | 'active' | 'paused' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface SequenceActivity {
  id: string;
  sequenceId: string;
  prospectId: string;
  stepNumber: number;
  action: 'sent' | 'opened' | 'clicked' | 'replied' | 'bounced' | 'unsubscribed';
  timestamp: string;
  metadata?: Record<string, unknown>;
}

// 6. Core Web Vitals Monitor
export interface CWVSnapshot {
  id: string;
  url: string;
  lcp: number;
  fcp: number;
  cls: number;
  inp: number;
  ttfb: number;
  score: 'good' | 'needs-improvement' | 'poor';
  collectedAt: string;
}

export interface CWVThresholds {
  lcp: { good: number; poor: number };
  cls: { good: number; poor: number };
  inp: { good: number; poor: number };
}

export interface RegressionAlert {
  id: string;
  url: string;
  metric: 'lcp' | 'cls' | 'inp' | 'fcp' | 'ttfb';
  previousValue: number;
  currentValue: number;
  change: number;
  severity: 'warning' | 'critical';
  acknowledged: boolean;
  createdAt: string;
}

export interface MonitorConfig {
  id: string;
  url: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  alertThreshold: number;
  notificationEmail?: string;
  slackWebhook?: string;
  lastChecked?: string;
  isActive: boolean;
  createdAt: string;
}
