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
// SuccessCase 타입은 파일 기반 전환으로 제거되었다 — lib/cases.ts의 CaseItem 사용
// (CASE_BOARD_BRIEF 작업 2-3, Supabase success_cases 테이블은 백업으로 보존)

export interface LegalPost {
  id: number;
  title: string;
  listTitle?: string; // 목록 카드 표시용 짧은 제목 (없으면 title 사용)
  category: string; // Added field
  date: string;
  summary: string;
  content: string; // Added field for full detail
  imageUrls?: string[]; // 게시글 이미지 URLs
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
  listTitle?: string; // 목록 카드 표시용 짧은 제목 (없으면 title 사용)
  court: string;
  caseNumber: string;
  summary: string;
  tags: string[];
  content: string; // Added field for full detail
  imageUrls?: string[]; // 게시글 이미지 URLs
}