/**
 * T6 藍途記帳〈損益餘額計算表〉CSV parser 介面。
 *
 * 未來真源：藍途記帳/損益餘額計算表_YYYYMMDD-YYYYMMDD.csv
 * 欄位契約（依 2026-07-01~13 匯出檔確認）：
 *   會計項目代碼, 會計項目名稱, 借方, 貸方, 淨變動
 *
 * 科目對應（fetchPnl() 接真時使用）：
 *   4101 工程收入、4104 提案收入 → revenue
 *   5900 工程成本               → cost
 *   6xxx（費用類）              → opex
 *
 * 本模組為純函式、無 I/O；接真時由資料層讀檔後餵入。
 */

export interface LantuRow {
  /** 會計項目代碼，如 "4101" */
  code: string;
  /** 會計項目名稱 */
  name: string;
  debit: number;
  credit: number;
  /** 淨變動 */
  net: number;
}

export interface LantuPnlSummary {
  revenue: number;
  cost: number;
  opex: number;
  /** 無法歸類的科目（防呆：出現時應人工檢視） */
  unmapped: LantuRow[];
}

/** 收入科目（貸方為正常方向） */
const REVENUE_CODES = new Set(["4101", "4104"]);
/** 直接成本科目 */
const COST_CODES = new Set(["5900"]);

function parseAmount(raw: string): number {
  const n = Number(raw.replaceAll(",", "").trim());
  return Number.isFinite(n) ? n : 0;
}

/** 解析藍途 CSV 全文（含表頭列）為結構化列 */
export function parseLantuCsv(text: string): LantuRow[] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  const rows: LantuRow[] = [];
  for (const line of lines.slice(1)) {
    // 簡單 CSV：欄位不含引號逗號（藍途匯出格式如此；若變更需升級 parser）
    const cols = line.split(",").map((c) => c.trim());
    if (cols.length < 5) continue;
    const [code, name, debit, credit, net] = cols;
    if (!/^\d{4}/.test(code)) continue;
    rows.push({
      code,
      name,
      debit: parseAmount(debit),
      credit: parseAmount(credit),
      net: parseAmount(net),
    });
  }
  return rows;
}

/** 依科目對應彙總為損益三要素 */
export function summarizeLantuPnl(rows: LantuRow[]): LantuPnlSummary {
  const out: LantuPnlSummary = { revenue: 0, cost: 0, opex: 0, unmapped: [] };
  for (const r of rows) {
    if (REVENUE_CODES.has(r.code)) {
      out.revenue += Math.abs(r.net);
    } else if (COST_CODES.has(r.code)) {
      out.cost += Math.abs(r.net);
    } else if (r.code.startsWith("6")) {
      out.opex += Math.abs(r.net);
    } else if (r.code.startsWith("4") || r.code.startsWith("5")) {
      // 其他收入/成本科目：先歸入對應大類，並列 unmapped 供人工確認
      if (r.code.startsWith("4")) out.revenue += Math.abs(r.net);
      else out.cost += Math.abs(r.net);
      out.unmapped.push(r);
    }
    // 1xxx–3xxx 資產負債權益科目不屬於損益，略過
  }
  return out;
}
