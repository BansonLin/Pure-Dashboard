# CLAUDE.md — 璞石集團營運儀表板（Pure-Dashboard）

給 Claude Code 的專案說明。完整背景與待裁決事項見 [`docs/PROJECT-BRIEF.md`](docs/PROJECT-BRIEF.md)（2026-07-03 撰寫，部分狀態已過時，以本檔「目前狀態」為準）。

## 範圍（先讀）

- 本 repo **只做營運儀表板**：集團總覽、六大事業體（BU）、財務、人力、風險。
- **3D 渲染工作台不在這裡**：已獨立為 `BansonLin/pure-render-studio`（https://pure-render-studio.vercel.app）。渲染相關需求請 Banson 到只選該 repo 的對話處理；本 repo 不新增任何 render 程式碼（歷史：PR #1 加入、PR #2 移除）。
- 兩站登入白名單、cookie、部署全部分開：本站 cookie `pure_session`，工作台 `render_session`。

## 使用者與溝通

- 使用者：Banson（璞石集團 CEO，非工程背景）。回覆以「Banson，」開頭，繁體中文（台灣用語），結論先行、比較用表格。
- 數字標【實際】（真實帳務已驗證）／【口述】（主管口頭、待核）／【示意】（假設，需附條件）。法律、稅務結論標「需專業人士最終確認」。
- 需要他在 Vercel／GitHub 介面操作時，給逐步、可照做的指示；**不要請他把金鑰貼進對話**。
- 合併 PR、改正式環境前先取得 Banson 明確同意（例如他回「合併」）。

## 指令

```bash
npm install
npm run dev            # 本機開發；無 RESEND_API_KEY 時登入連結印在終端機
npx tsc --noEmit -p .  # 型別檢查
npm run lint
npm run build          # 推送前必跑
```

## 技術棧

Next.js 14.2（App Router、全部頁面為 async server component）＋ TypeScript ＋ Tailwind（CSS 變數色票、`next-themes` 明暗主題）＋ Recharts ＋ zustand（僅 UI 狀態）＋ date-fns。登入：Email magic link（Resend）＋ jose JWT，`middleware.ts` fail-closed。

## 架構規則（改動前必讀）

1. **`lib/data/index.ts` 是唯一資料介面**。頁面只呼叫 `fetchXxx()`，拿「顯示就緒」的 view model。`app/`、`components/` **禁止直接 import `lib/mock`**；新程式碼也不要直接 import `lib/actuals`。既有例外：`BuMatrix`、`StopLossBoard` 直接引用 `lib/actuals/xinyi-stoploss`（止損倒數用伺服器時間），屬技術債，之後應改經資料層。接真資料只改資料層。
2. **widget 是純 props 元件**（`components/widgets/`），不自行取數。
3. **數字治理**（本專案核心）：
   - 每個數字要能辨識「口徑 × 稅基 × 可信度 × 截至日」，用 `components/widgets/SourceTag.tsx` 標示。
   - 可信度三類（`lib/terms.ts`）：`actual`【實際】／`verbal`【口述】／`mock`【示意】。**絕不把示意或口述數字標成實際**。
   - 業績口徑：簽約（主）／請款／收款；含稅 → 未稅一律 `toExclTax()`（÷1.05 四捨五入）。年度目標的含稅屬性仍待確認，達成率以同口徑計算並註記。
   - 合計一律由明細加總推導，不寫死。
4. **真值放 `lib/actuals/`**，每個檔案開頭註明來源檔名、分頁、截至日；未來真源格式的 parser 放 `lib/parsers/`（純函式、無 I/O）。
5. **報表基準日集中在 `lib/report-date.ts`**；日期一律用 `parseDateOnly()`，避免時區造成 hydration 錯誤。信義止損倒數例外，用伺服器當下時間（`lib/actuals/xinyi-stoploss.ts`）。
6. **顏色語意集中**：`lib/ui/severity.ts`（燈號）、`lib/ui/chart-colors.ts`（BU 識別色）；資料型別不放顏色。
7. **BU 接入狀態誠實呈現**：`lib/mock/entity-map.ts` 的 `dataStatus`（live／monitor／partial／none）。沒接資料的 BU 顯示「資料未接入」灰卡，不放假燈號。

## 必守規則

1. **財務資料敏感**：repo 必須維持 private。原始帳務檔（銀行現流表、合約管理表單、藍途 CSV、交換表）**不 commit**，只放驗證後的彙總數字並註明來源。
2. **不讀、不產生、不印出秘密值**：`AUTH_SECRET`、`RESEND_API_KEY` 由 Banson 在 Vercel 以 Secret 類型自行輸入。
3. **個資**：客戶真名、員工個資上線前要先決定顯示方式（真名／代號／分權限），未決定前用代號。
4. **不 force-push、不改寫 `main` 歷史**。功能用分支＋PR，合併前取得 Banson 同意。
5. 介面文字一律繁體中文；註解說明「為什麼」，不寫「做了什麼」。

## 目錄

| 路徑 | 內容 |
|---|---|
| `app/(dashboard)/page.tsx` | 集團總覽（KPI、BU 矩陣、營收趨勢、行動清單、信義止損卡） |
| `app/(dashboard)/bu/[buId]/` | BU 詳情（6 個 BU） |
| `app/(dashboard)/finance/`、`people/`、`risk/` | 財務、人力、風險 |
| `app/login`、`app/api/auth/*`、`middleware.ts` | 登入與全站上鎖 |
| `components/widgets/` | 純 props 元件（KpiCard、BuMatrix、StopLossBoard、SourceTag…） |
| `lib/data/index.ts` | ★ 唯一資料介面 |
| `lib/actuals/` | 【實際】真值：宜蘭簽約、現金水位、信義止損參數 |
| `lib/mock/` | 【示意】假資料與 BU↔法人對照（`entity-map.ts`） |
| `lib/parsers/` | 藍途損益 CSV、W2 交換表的欄位契約與 parser |
| `lib/terms.ts` | 口徑、稅基、可信度定義 |
| `lib/report-date.ts` | ★ 全站報表基準日 |

## 測試

無自動化測試。驗證方式：`tsc`＋`lint`＋`build`，再用 Playwright（`playwright-core`，Chromium 在 `/opt/pw-browsers`）對 `next start` 截圖：桌機 1440、手機 375、暗色模式。測試登入用本機測試 `AUTH_SECRET` 簽 `pure_session` JWT，**不要用正式金鑰**。`scripts/screenshot.js` 是舊版截圖腳本（需自行安裝 playwright）。

## 部署

- Vercel 專案 `pure-dashboard`（`prj_CJeD224Gc8gQINCyJ0xNmOXaHbzL`），正式網址 https://pure-dashboard-mu.vercel.app，`main` push 即部署（約 1–2 分鐘）。
- Vercel MCP 呼叫時**不要帶 teamId**（帶了會 403），預設 team 即可。
- 環境變數（名稱）：`AUTH_SECRET`、`ALLOWED_EMAILS`、`RESEND_API_KEY`、`EMAIL_FROM`、`APP_URL`。
- `EMAIL_FROM=onboarding@resend.dev` 只能寄給 Resend 帳號本人；同事要登入，需先在 Resend 驗證公司網域並改 `EMAIL_FROM`，再把 Email 加進 `ALLOWED_EMAILS`。

## 目前狀態（2026-10-11）

| 項目 | 狀態 |
|---|---|
| 登入 | 已上線（T0，magic link）；目前只有 Banson 能收信 |
| 口徑定義、BU↔法人對照 | 已完成（T1、T2） |
| 宜蘭簽約 | 【實際】校準至 2026-06-01（合約管理表單） |
| 現金水位 | 【實際】宜蘭法人 2026-05-31 |
| 信義止損板 | 已上線；**兩個檢核點 2026-08-20、09-20 都已過**，決議結果尚未回寫 |
| 好室、Wayhome、Homatch | 資料未接入（灰卡） |
| 璞域 | 部分接入 |
| 財務、風險頁 | 多數仍為【示意】 |
| 報表基準日 | 2026-06-01，**已超過四個月未更新** |

## 待辦（建議順序）

| 優先 | 事項 | 需要誰 |
|---|---|---|
| P0 | 回寫信義止損兩次檢核結論（續營／調整／止損），更新止損板 | Banson |
| P0 | 更新 6 月之後的宜蘭簽約與現金（合約管理表單、銀行現流表新版），基準日跟著更新 | 會計／Patty 提供檔案 |
| P0 | Resend 驗證公司網域，開放總經理與主管登入 | Banson（DNS）＋開發 |
| P1 | W2 交換表上線：會計每月填一次 → 資料層改讀表、基準日改讀交換表 `asOf` | 會計＋開發 |
| P1 | 藍途損益 CSV 接入 `fetchPnl()`，取代財務頁示意數字 | 會計匯出＋開發 |
| P1 | 確認年度目標含稅／未稅 | Patty |
| P2 | 寫入功能（風險狀態、行動打勾）→ 需資料庫 | Banson 裁決 |
| P2 | 自訂網域、專案真名顯示規則 | Banson 裁決 |
