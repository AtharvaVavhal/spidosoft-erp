import type { ItemMaster } from '@/types/item'
import { ApiError } from '../http/apiError'
import { isEmptyMode, matches, mockCall, paginate } from '../mock/mockRuntime'
import type { ItemDataSource } from './itemDataSource'

/**
 * In-memory SAMPLE data for UI development only. Values are fictitious and use only confirmed
 * ItemMaster columns. Audit columns and FK ids are left null: their population rules and targets
 * are TBD (docs/10 §9-8, §9-9). Nothing here is persisted anywhere.
 */
type Seed = [code: string, name: string, type: string, subType: string, material: string, uom: string, hsn: string, gst: number, cost: number, price: number]

const SEEDS: Seed[] = [
  ['RM-1001', 'Aluminium Extrusion 6063 T6 — 40×40', 'Raw Material', 'Extrusion Profile', 'Aluminium 6063', 'KG', '76042100', 18, 312.5, 336],
  ['RM-1002', 'Aluminium Extrusion 6063 T6 — 25×50', 'Raw Material', 'Extrusion Profile', 'Aluminium 6063', 'KG', '76042100', 18, 305, 329],
  ['RM-1003', 'Aluminium Sheet 1100 H14 — 2 mm', 'Raw Material', 'Sheet', 'Aluminium 1100', 'KG', '76061190', 18, 288, 310],
  ['RM-1004', 'MS Plate IS 2062 E250 — 10 mm', 'Raw Material', 'Plate', 'Mild Steel', 'KG', '72085190', 18, 64.5, 71],
  ['RM-1005', 'SS 304 Sheet 2B — 1.5 mm', 'Raw Material', 'Sheet', 'Stainless Steel 304', 'KG', '72193500', 18, 238, 262],
  ['RM-1006', 'SS 316L Round Bar Ø25', 'Raw Material', 'Round Bar', 'Stainless Steel 316L', 'MTR', '72222011', 18, 1450, 1595],
  ['RM-1007', 'Copper Busbar 25×5 ETP', 'Raw Material', 'Busbar', 'Copper ETP', 'KG', '74071010', 18, 905, 968],
  ['RM-1008', 'EN8 Bright Bar Ø40', 'Raw Material', 'Round Bar', 'EN8', 'MTR', '72155090', 18, 610, 668],
  ['RM-1009', 'Brass Rod CZ121 Ø12', 'Raw Material', 'Rod', 'Brass CZ121', 'KG', '74072110', 18, 612, 655],
  ['RM-1010', 'GI Coil 0.8 mm Z120', 'Raw Material', 'Coil', 'Galvanised Iron', 'KG', '72104900', 18, 78, 84.5],
  ['FS-2001', 'Hex Bolt M8 × 25 Gr 8.8 Zinc', 'Bought-out', 'Fastener', 'Alloy Steel', 'NOS', '73181500', 18, 3.2, 4.1],
  ['FS-2002', 'Hex Bolt M10 × 40 Gr 8.8 Zinc', 'Bought-out', 'Fastener', 'Alloy Steel', 'NOS', '73181500', 18, 6.4, 7.9],
  ['FS-2003', 'Hex Bolt M12 × 50 SS304', 'Bought-out', 'Fastener', 'Stainless Steel 304', 'NOS', '73181500', 18, 21, 25.5],
  ['FS-2004', 'Hex Nut M12 SS304', 'Bought-out', 'Fastener', 'Stainless Steel 304', 'NOS', '73181600', 18, 6.8, 8.2],
  ['FS-2005', 'Plain Washer M12 SS304', 'Bought-out', 'Fastener', 'Stainless Steel 304', 'NOS', '73182200', 18, 2.1, 2.7],
  ['FS-2006', 'Socket Head Cap Screw M6 × 20', 'Bought-out', 'Fastener', 'Alloy Steel 12.9', 'NOS', '73181500', 18, 4.4, 5.6],
  ['FS-2007', 'Spring Washer M10 Zinc', 'Bought-out', 'Fastener', 'Spring Steel', 'NOS', '73182100', 18, 0.9, 1.2],
  ['FS-2008', 'Rivet Aluminium 4.8 × 12', 'Bought-out', 'Fastener', 'Aluminium', 'NOS', '76169990', 18, 0.6, 0.85],
  ['BR-3001', 'Ball Bearing 6205-2RS', 'Bought-out', 'Bearing', 'Chrome Steel', 'NOS', '84821011', 18, 118, 142],
  ['BR-3002', 'Ball Bearing 6305-ZZ', 'Bought-out', 'Bearing', 'Chrome Steel', 'NOS', '84821011', 18, 164, 196],
  ['BR-3003', 'Taper Roller Bearing 30206', 'Bought-out', 'Bearing', 'Chrome Steel', 'NOS', '84822011', 18, 342, 399],
  ['BR-3004', 'Pillow Block UCP 205', 'Bought-out', 'Bearing', 'Cast Iron', 'NOS', '84832000', 18, 385, 445],
  ['BR-3005', 'Needle Bearing NK 20/16', 'Bought-out', 'Bearing', 'Chrome Steel', 'NOS', '84824000', 18, 208, 244],
  ['HY-4001', 'Hydraulic Hose 1/2" 2SN — 1 m', 'Bought-out', 'Hydraulics', 'Rubber / Steel Braid', 'MTR', '40093100', 18, 410, 478],
  ['HY-4002', 'Hydraulic Fitting JIC 1/2" Straight', 'Bought-out', 'Hydraulics', 'Carbon Steel', 'NOS', '73072900', 18, 96, 115],
  ['HY-4003', 'Gear Pump 16 cc/rev', 'Bought-out', 'Hydraulics', 'Cast Iron', 'NOS', '84136010', 18, 7850, 8990],
  ['HY-4004', 'Directional Valve 4/3 CETOP 3', 'Bought-out', 'Hydraulics', 'Cast Iron', 'NOS', '84812000', 18, 5420, 6180],
  ['HY-4005', 'Hydraulic Oil ISO VG 68', 'Consumable', 'Lubricant', 'Mineral Oil', 'LTR', '27101980', 18, 148, 169],
  ['EL-5001', 'Induction Motor 2.2 kW 4P Foot', 'Bought-out', 'Electrical', 'Cast Iron', 'NOS', '85015210', 18, 14250, 15990],
  ['EL-5002', 'Contactor 3P 25 A 230 V Coil', 'Bought-out', 'Electrical', 'Thermoplastic', 'NOS', '85364900', 18, 1320, 1540],
  ['EL-5003', 'Proximity Sensor M18 PNP NO', 'Bought-out', 'Electrical', 'Nickel-plated Brass', 'NOS', '85365090', 18, 865, 995],
  ['EL-5004', 'Cable 4C × 2.5 sq mm Cu Armoured', 'Bought-out', 'Electrical', 'Copper / PVC', 'MTR', '85444999', 18, 212, 244],
  ['EL-5005', 'MCB 2P 16 A C-Curve', 'Bought-out', 'Electrical', 'Thermoplastic', 'NOS', '85362030', 18, 395, 452],
  ['SF-6001', 'Bracket Mounting — Machined', 'Semi-Finished', 'Machined Part', 'Mild Steel', 'NOS', '73269099', 18, 145, 0],
  ['SF-6002', 'Shaft Ø30 × 420 — Turned', 'Semi-Finished', 'Machined Part', 'EN8', 'NOS', '84834000', 18, 690, 0],
  ['SF-6003', 'Flange DN50 PN16 — Drilled', 'Semi-Finished', 'Machined Part', 'Carbon Steel', 'NOS', '73079190', 18, 540, 0],
  ['SF-6004', 'Base Frame Weldment 1200 × 800', 'Semi-Finished', 'Weldment', 'Mild Steel', 'NOS', '73089090', 18, 8600, 0],
  ['FG-7001', 'Conveyor Roller Ø89 × 600', 'Finished Good', 'Assembly', 'Mild Steel', 'NOS', '84313910', 18, 980, 1240],
  ['FG-7002', 'Gearbox Assembly Ratio 1:20', 'Finished Good', 'Assembly', 'Cast Iron', 'SET', '84834000', 18, 18400, 22900],
  ['FG-7003', 'Aluminium Window Frame 1200 × 1500', 'Finished Good', 'Assembly', 'Aluminium 6063', 'NOS', '76101000', 18, 6450, 7990],
  ['FG-7004', 'Control Panel 7.5 kW DOL', 'Finished Good', 'Assembly', 'CRCA', 'NOS', '85371000', 18, 21800, 26500],
  ['CN-8001', 'Cutting Disc 355 × 3 mm', 'Consumable', 'Abrasive', 'Aluminium Oxide', 'NOS', '68042290', 18, 142, 168],
  ['CN-8002', 'Welding Electrode E7018 Ø3.15', 'Consumable', 'Welding', 'Low-hydrogen', 'KG', '83111000', 18, 188, 214],
  ['CN-8003', 'MIG Wire ER70S-6 Ø1.2', 'Consumable', 'Welding', 'Copper-coated Steel', 'KG', '72292000', 18, 124, 146],
  ['CN-8004', 'Grease Lithium EP2', 'Consumable', 'Lubricant', 'Lithium Complex', 'KG', '34039900', 18, 265, 305],
  ['CN-8005', 'Cotton Waste', 'Consumable', 'Housekeeping', 'Cotton', 'KG', '52021000', 5, 58, 68],
  ['PK-9001', 'Corrugated Box 5-Ply 600 × 400 × 400', 'Consumable', 'Packaging', 'Kraft Paper', 'NOS', '48191010', 12, 74, 88],
  ['PK-9002', 'Stretch Film 23 µ × 500 mm', 'Consumable', 'Packaging', 'LLDPE', 'KG', '39201012', 18, 162, 186],
  ['PK-9003', 'Wooden Pallet 1200 × 1000', 'Consumable', 'Packaging', 'Pinewood', 'NOS', '44152000', 12, 640, 745],
  ['PK-9004', 'VCI Bag 600 × 900', 'Consumable', 'Packaging', 'LDPE', 'NOS', '39232100', 18, 18, 23],
]

function toItem(seed: Seed, index: number): ItemMaster {
  const [code, name, type, subType, material, uom, hsn, gst, cost, price] = seed
  return {
    ID: index + 1,
    ItemCode: code,
    ItemName: name,
    Material: material,
    ItemType: type,
    ItemSubType: subType,
    Color: null,
    UOM: uom,
    HSNCODE: hsn,
    GSTRate: gst,
    PurchaseCost: cost,
    SellingPrice: price === 0 ? null : price,
    Username: null,
    LoginBranch: null,
    SystEmentryDate: null,
    RawMaterial: null,
    SubCategoryId: null,
    ManufacturerId: null,
    ColourId: null,
    UnitId: null,
    UserId: null,
    BranchId: null,
    CategoryId: null,
    DrawingNo: null,
    Specification: null,
  }
}

const items: ItemMaster[] = SEEDS.map(toItem)

function notFound(id: number): ApiError {
  return new ApiError('NOT_FOUND', `Item ${id} was not found.`, { status: 404 })
}

export const mockItemDataSource: ItemDataSource = {
  search: ({ q, page, size }) =>
    mockCall(() => {
      const rows = isEmptyMode() ? [] : items.filter((item) => matches(q, item.ItemCode, item.ItemName))
      return paginate(rows, page, size)
    }),

  getById: (id) =>
    mockCall(() => {
      const found = items.find((item) => item.ID === id)
      if (!found) throw notFound(id)
      return { ...found }
    }),

  create: (input) =>
    mockCall(() => {
      const created: ItemMaster = {
        ...input,
        // Mock-only id assignment. Real identity/assignment of ID is TBD (docs/10 C15).
        ID: Math.max(0, ...items.map((i) => i.ID)) + 1,
        Username: null,
        LoginBranch: null,
        SystEmentryDate: null,
        UserId: null,
        BranchId: null,
      }
      items.unshift(created)
      return { ...created }
    }),

  update: (id, input) =>
    mockCall(() => {
      const index = items.findIndex((item) => item.ID === id)
      const current = items[index]
      if (index < 0 || !current) throw notFound(id)
      const updated: ItemMaster = { ...current, ...input }
      items[index] = updated
      return { ...updated }
    }),
}
