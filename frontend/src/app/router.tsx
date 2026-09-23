import { createBrowserRouter } from 'react-router'
import { LoadingState } from '@/components/States/States'
import { AppLayout } from '@/layouts/AppLayout'
import type { RouteHandle } from '@/layouts/TopBar'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { RouteErrorPage } from '@/pages/RouteErrorPage'

const crumb = (label: string, to?: string): RouteHandle => ({ crumb: { label, to } })

// Pages are code-split per route; the shell, design system and error pages stay in the main chunk.
export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <RouteErrorPage />,
    // Shown while the first lazy route chunk loads on initial page load.
    hydrateFallbackElement: <LoadingState label="Loading SpidoSoft ERP…" />,
    children: [
      {
        index: true,
        handle: crumb('Dashboard'),
        lazy: () => import('@/pages/DashboardPage').then((m) => ({ Component: m.DashboardPage })),
      },
      {
        path: 'masters',
        handle: crumb('Masters'),
        children: [
          {
            path: 'items',
            handle: crumb('Item Master', '/masters/items'),
            children: [
              { index: true, lazy: () => import('@/pages/items/ItemListPage').then((m) => ({ Component: m.ItemListPage })) },
              {
                path: 'new',
                handle: crumb('New'),
                lazy: () => import('@/pages/items/ItemCreatePage').then((m) => ({ Component: m.ItemCreatePage })),
              },
              {
                // TBD — pending Spidosoft confirmation: :id is ItemMaster.ID; the identifying key is undecided (docs/10 C3).
                path: ':id',
                handle: crumb('Details'),
                lazy: () => import('@/pages/items/ItemDetailPage').then((m) => ({ Component: m.ItemDetailPage })),
              },
            ],
          },
          {
            path: 'customers',
            handle: crumb('Customer Master', '/masters/customers'),
            children: [
              { index: true, lazy: () => import('@/pages/customers/CustomerPages').then((m) => ({ Component: m.CustomerListPage })) },
              {
                path: 'new',
                handle: crumb('New'),
                lazy: () => import('@/pages/customers/CustomerPages').then((m) => ({ Component: m.CustomerFormPage })),
              },
              {
                path: ':id',
                handle: crumb('Details'),
                lazy: () => import('@/pages/customers/CustomerPages').then((m) => ({ Component: m.CustomerDetailPage })),
              },
            ],
          },
          {
            path: 'suppliers',
            handle: crumb('Supplier Master', '/masters/suppliers'),
            children: [
              { index: true, lazy: () => import('@/pages/suppliers/SupplierPages').then((m) => ({ Component: m.SupplierListPage })) },
              {
                path: 'new',
                handle: crumb('New'),
                lazy: () => import('@/pages/suppliers/SupplierPages').then((m) => ({ Component: m.SupplierFormPage })),
              },
              {
                path: ':id',
                handle: crumb('Details'),
                lazy: () => import('@/pages/suppliers/SupplierPages').then((m) => ({ Component: m.SupplierDetailPage })),
              },
            ],
          },
        ],
      },
      { path: '*', element: <NotFoundPage />, handle: crumb('Not found') },
    ],
  },
])
