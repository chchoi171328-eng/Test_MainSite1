import { LucideIcon } from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
}

export interface PracticeArea {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface Attorney {
  id: string;
  name: string;
  role: string;
  imageUrl: string;
  specialties: string[];
  education?: string[];
  career?: string[];
}

export interface Stat {
  value: string;
  label: string;
}

// Content Types
export interface SuccessCase {
  id: number;
  title: string;
  category: string;
  result: string;
  description: string;
  judgmentUrl?: string; // Base64 string for judgment document (PDF/Image)
  judgmentFormat?: string; // 'pdf' | 'image' | etc
}

export interface LegalPost {
  id: number;
  title: string;
  category: string; // Added field
  date: string;
  summary: string;
  content: string; // Added field for full detail
}

export interface LegalForm {
  id: number;
  title: string;
  category: string;
  format: string;
  size: string;
  fileUrl?: string; // Base64 string for actual file storage
}

export interface LegalCase {
  id: number;
  title: string;
  court: string;
  caseNumber: string;
  summary: string;
  tags: string[];
  content: string; // Added field for full detail
}