/**
 * Domain data sources are mock adapters until the backend contracts (Item, Customer, Supplier) are
 * implemented — blocked by docs/10 §10. Setting VITE_USE_MOCKS=false fails loudly instead of
 * silently calling endpoints that do not exist.
 */
export function assertMockMode(domain: string): void {
  if (import.meta.env.VITE_USE_MOCKS === 'false') {
    throw new Error(
      `No HTTP adapter exists for ${domain}: backend contracts are not implemented yet (docs/10 §10). ` +
        'Keep VITE_USE_MOCKS=true.',
    )
  }
}
