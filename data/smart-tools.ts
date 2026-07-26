import { FieldKey } from '../lib/content';

/**
 * 스마트 도구 목록 — 가이드 frontmatter의 tools, 세부 페이지 §9 자동 연결에 사용한다.
 * id는 가이드 frontmatter에서 참조하는 키이며, href는 /tools 페이지의 앵커다.
 */
export interface SmartTool {
  id: string;
  label: string;
  href: string;
  /** 이 도구를 기본 노출할 분야 (세부 페이지 §9 fallback) */
  fields: FieldKey[];
}

export const SMART_TOOLS: SmartTool[] = [
  {
    id: 'interest-calculator',
    label: '법정 이자 계산기',
    href: '/tools#interest-calculator',
    fields: ['civil', 'real-estate', 'construction', 'corporate', 'criminal-victim'],
  },
  {
    id: 'court-fee-calculator',
    label: '인지대·송달료 계산기',
    href: '/tools#cost-calculator',
    fields: ['civil', 'real-estate', 'construction'],
  },
  {
    id: 'child-support-calculator',
    label: '양육비 계산기',
    href: '/tools#child-support-calculator',
    fields: ['divorce'],
  },
  {
    id: 'inheritance-calculator',
    label: '상속지분 계산기',
    href: '/tools#inheritance-calculator',
    fields: ['inheritance'],
  },
  {
    id: 'wage-calculator',
    label: '체불임금 계산기',
    href: '/tools#wage-calculator',
    fields: ['corporate'],
  },
  {
    id: 'evidence-guide',
    label: '증거 수집 가이드',
    href: '/tools#evidence-guide',
    fields: [
      'criminal',
      'criminal-victim',
      'civil',
      'divorce',
      'inheritance',
      'real-estate',
      'construction',
      'corporate',
    ],
  },
  {
    id: 'court-finder',
    label: '관할법원 찾기',
    href: '/tools#court-finder',
    fields: ['criminal', 'civil', 'divorce', 'inheritance', 'real-estate'],
  },
];

export function getToolsForField(field: FieldKey, limit = 4): SmartTool[] {
  return SMART_TOOLS.filter((t) => t.fields.includes(field)).slice(0, limit);
}
