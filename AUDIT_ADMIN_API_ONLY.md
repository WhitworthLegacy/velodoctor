## Audit Admin API-Only (Checklist)

### Scope Done (API-only)
- Planning: `velodoctor-admin/src/modules/planning/PlanningDashboard.jsx`
- Logistics: `velodoctor-admin/src/modules/logistics/LogisticsDashboard.jsx`
- CRM: `velodoctor-admin/src/modules/crm/PipelineBoard.jsx`
- Clients: `velodoctor-admin/src/modules/admin/ClientList.jsx`

### Still Using Direct Supabase (To Migrate)
- Inventory
  - `velodoctor-admin/src/modules/inventory/InventoryDashboard.jsx`
  - `velodoctor-admin/src/modules/inventory/InventoryForm.jsx`
  - `velodoctor-admin/src/modules/inventory/StockMovementModal.jsx`
- Workshop / Interventions
  - `velodoctor-admin/src/modules/workshop/WorkshopDashboard.jsx`
  - `velodoctor-admin/src/modules/workshop/InterventionDetail.jsx`
  - `velodoctor-admin/src/modules/workshop/VehicleSheet.jsx`
- Quotes
  - `velodoctor-admin/src/modules/workshop/QuoteForm.jsx`
  - `velodoctor-admin/src/modules/workshop/QuoteItemForm.jsx`
  - `velodoctor-admin/src/modules/workshop/QuoteItemsList.jsx`
  - `velodoctor-admin/src/modules/workshop/QuoteSection.jsx`

### Missing / TODO API Endpoints (velodoctor-web)
- `GET /api/admin/inventory-items`
- `POST/PATCH /api/admin/inventory-items/[id]`
- `GET /api/admin/stock-movements`
- `POST /api/admin/stock-movements`
- `GET /api/admin/quotes`
- `POST/PATCH /api/admin/quotes/[id]`
- `GET /api/admin/quote-items`
- `POST/PATCH /api/admin/quote-items/[id]`
- `GET /api/admin/vehicles`

### Notes
- Admin SPA should only use Supabase for auth (JWT). All data reads/writes must go through `velodoctor-web` APIs.
- Replace any `supabase.from(...)` usage in admin modules with `apiFetch(...)`.
