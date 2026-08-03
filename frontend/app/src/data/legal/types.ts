export interface LegalTable {
  headers: string[];
  rows: string[][];
}

export interface LegalSection {
  heading?: string;
  paragraphs?: string[];
  items?: string[];
  table?: LegalTable;
  highlight?: string;
}

export interface LegalDocument {
  title: string;
  description?: string;
  sections: LegalSection[];
}