export type LegalBlock =
  | { type: 'h2'; text: string; id: string }
  | { type: 'h3'; text: string }
  | { type: 'p'; text: string }
  | { type: 'li'; text: string }
  | { type: 'ol'; text: string };

export interface LegalContent {
  meta: { title: string; description: string };
  title: string;
  lastUpdated: string;
  blocks: LegalBlock[];
}
