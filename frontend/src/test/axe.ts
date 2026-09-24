import axe from 'axe-core'

/**
 * Runs axe-core (WCAG 2.0–2.2 A/AA rules) against rendered markup. jsdom has no layout or rendering, so
 * colour contrast cannot be measured here: it is checked from the locked tokens in
 * styles/designTokens.test.ts and in a real browser (docs/06 §3.3, accessibility re-check).
 */
export async function axeViolations(container: Element) {
  const result = await axe.run(container, {
    runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] },
    rules: { 'color-contrast': { enabled: false } },
  })
  return result.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`)
}
