# ALL — Compliance & Regulatory Function Requirements Brief

> Deep-research output, 2026-08-06. Product-requirements-oriented; each section states what the law requires, what software must/can do, and where the traps are. Sources cited inline.
>
> ⚠️ Given the regulatory stakes, get an attorney/compliance-consultant pass on this brief before it drives engineering commitments — especially §9 (FOPA/centralized-registry architecture implications), the highest-consequence and most legally nuanced item.

---

## 1. Electronic A&D (Bound Book) — ATF Rulings 2016-1, 2016-2, 2016-3

**ATF Ruling 2016-1** (superseding 2013-5) authorizes importers, manufacturers, dealers, and collectors to keep acquisition & disposition records electronically **without an individual variance** — replacing the old case-by-case variance regime. ([FastBound](https://www.fastbound.com/atf-2016-1-compliant/), [Orchid Advisors](https://orchidadvisors.com/3-atf-rulings-affect-ad-record-keeping/))

Hard conditions a system must meet:
- **Required fields**: everything under 27 CFR 478.121, 478.122, 478.123, 478.125(e)/(f), and 27 CFR 479.131 — including manufacturer/importer of record.
- **Queryability**: lookup by serial number, acquisition date, manufacturer/importer name, purchaser name, purchaser address, and the 4473 transaction serial number.
- **Immutable audit trail**: corrections appended as **new entries** — never delete or overwrite an original entry ("edit = new row + link to old row," not UPDATE).
- **No dependency on paper/invoices**: the electronic system must be self-sufficient.
- **All-or-nothing**: if any A&D records are electronic, *all* A&D records (retail, gunsmithing, NFA) must be electronic — no hybrid bound book for one FFL.
- **On-premises access implied**: ATF inspectors must be able to access/print the records at the licensed premises during inspection (constrains cloud architecture — see §9).

**Companion rulings:** **2016-2** — electronic Form 4473 (see §2), replacing 2008-3. **2016-3** — manufacturer record consolidation, replacing 2010-8. ([FFL Boss 2016-2](https://www.fflboss.com/2017/01/30/atf-ruling-2016-1/), [FFL Boss 2016-3](https://www.fflboss.com/atf-ruling-2016-3/), [Williams Mullen — cloud A&D](https://www.williamsmullen.com/insights/news/legal-news/new-atf-ruling-allows-cloud-based-storage-acquisition-and-disposition))

**License discontinuance**: under 18 U.S.C. §923(g)(4) and 27 CFR §478.127, a discontinued FFL must forward all required records (A&D book + retained 4473s) to ATF within **30 days**, to the ATF Out-of-Business Records Center / National Tracing Center, 244 Needy Road, Martinsburg, WV 25405. NTC receives ~1.2M out-of-business records/month. ([ATF Form 5300.3A](https://www.atf.gov/rules-and-regulations/form-and-information-collection-notices/ffl-out-business-records-request%E2%80%94atf), [Cornell 27 CFR 478.127](https://www.law.cornell.edu/cfr/text/27/478.127))

**Product implications**: (a) append-only ledger data model; (b) built-in "going out of business" export producing an ATF-consumable dump within the 30-day window; (c) query/filter UI matching the exact ATF-mandated search fields — this is literally what an inspector will ask the system to do live.

---

## 2. Form 4473 — electronic execution, storage, and top violations

**Retention period**: as of the April 2022 final rule (ATF 2021R-05F, effective Aug 24, 2022), the old "20 years" retention was replaced with **retain until discontinuance of business** (indefinitely) for every 4473. ([gununiversity.com](https://gununiversity.com/how-long-do-ffl-keep-4473/)) NOTE: a May 2026 proposed rule would set fixed 20/30-year retention windows — make retention a configurable policy parameter (see architecture doc).

**Electronic storage (ATF Ruling 2022-1)**, superseding all prior variances:
- Paper 4473s older than 3 years scanned into electronic storage must have exact-image fidelity, all pages/supplemental forms, tamper-evidence, and storage on an **onsite** device.
- ATF physical access: **minimum 1 electronic access terminal per 500 Forms 4473 executed in the trailing 12 months** — a concrete provisioning requirement.
- Digital-native records must be non-alterable, readily retrievable, printable on demand. ([ATF Ruling 2022-1 PDF](https://www.atf.gov/firearms/docs/ruling/2022-01-electronic-storage-forms-4473pdf/download), [Orchid Advisors](https://orchidadvisors.com/atf-ruling-2022-1-authorizes-alternate-methods-for-digital-storage-of-forms-4473/))

**Electronic execution (ATF Ruling 2016-2)**:
- On-screen question text/wording must exactly match the current OMB-approved 4473.
- Digital signature acceptable via signature pad, mouse, touchscreen, etc., as long as legible, retained, and mirrors a printed signature.
- **Hardware-failure fallback is mandatory**: if the signature pad breaks, immediate fallback to ink signatures on a printed copy — software cannot silently proceed with a broken capture path. ([FFL Boss](https://fflboss.com/2017/01/31/atf-ruling-2016-2/), [Logbooks for Guns](https://www.logbooksforguns.com/blog/form-4473-electronic-processing-atf-ruling-2016-2))
- Active Federal Register docket (May 2026) proposing further 4473 revisions — track for schema drift. ([Federal Register 2026-09182](https://www.federalregister.gov/documents/2026/05/08/2026-09182/revising-firearms-transaction-record-form-4473))

**Top cited violations (FY2024)**: ATF ran 9,696 inspections against ~128,690 active FFLs; only 54% came back clean. **The 4473 is the single most-cited violation category — 7 of the top 10 inspection findings tie directly to it** (~100,000 violations), dominated by incomplete/missing personal-info fields (name, DOB, address, transposed serials). Revocations rose 88 → 157 → 195 from FY2022→FY2024. ([Orchid Advisors](https://orchidadvisors.com/2024-top-atf-form-4473-errors-published-2025/), [Bravo](https://www.bravostoresystems.com/post/paper-vs-digital-why-half-of-ffls-are-failing-atf-inspections-in-2026))

**Product implications**: field-level validation at data-entry time is the single highest-leverage compliance feature ALL can ship — it directly attacks the #1 violation category. Build the hardware-failure fallback UX explicitly; architect 4473 storage with per-500-forms terminal provisioning in mind.

---

## 3. NICS — E-Check, POC states, delay/default-proceed, API access (key constraint)

**Mechanics**: FFL initiates via phone, FBI E-Check web portal (nicsezcheckfbi.gov), or a POC state's own system. Response: Proceed / Delayed / Denied. On **Delayed**, transfer is unlawful until either a follow-up "Proceed" or **3 business days elapse** — at which point the dealer has *discretion*, not obligation, to complete the transfer ("default proceed" is optional). State law can override and forbid transfer even after the 3 days. ([eCFR 28 CFR Part 25](https://www.ecfr.gov/current/title-28/chapter-I/part-25/subpart-A))

**POC landscape** (verify against current FBI map before shipping — this list drifts):
- **Full POC**: CO, CT, FL, HI, IL, NJ, NV, OR, PA, TN, UT, VA, among others.
- **Partial POC** (state handles handguns, FBI long guns, or vice versa): CA, MD, WA among others.
- **Non-POC** (straight to FBI NICS): TX, most of the South/Midwest/mountain states. ([FBI NICS map](https://www.fbi.gov/file-repository/nics-participation-map.pdf), [e4473 NICS guide](https://www.e4473.com/nics-guide))

**Key product constraint — no public NICS API**: There is **no documented public FBI API for NICS**. Vendors advertising "NICS E-Check integration" are automating data entry into the E-Check *web portal* (form automation or private arrangements), not calling a published API. **Treat NICS submission as an unofficial/browser-automation integration, not an API contract** — resilient to UI changes, fallback to manual entry, no SLA. ([FastBound NICS](https://www.fastbound.com/ffl-bound-book-software-features/nics-e-check/), [Orchid NICS methods](https://orchidadvisors.com/firearm-point-of-sale-nics-submission-methods/))

**Product implications**: auto-populate E-Check fields from 4473 data (biggest error-reduction win) but do not promise real-time API reliability; manual fallback path; status-polling UI for Delayed transactions with a prominent 3-business-day countdown.

---

## 4. ATF eForms — coverage, wait times, API/batch access

**Forms covered**: Forms 1, 2, 3, 4, 5, 6, 6A, 9, 10, 20, 5300.11, and 5630.7 (SOT payment). ([ATF eForms Applications](https://www.atf.gov/firearms/forms/eforms-applications))

**Processing times (late 2025 / mid-2026)**:
- Form 4 (transfer): ~10-11 days average via eForms vs 57-85 days paper (Nov 2025); a May 2026 snapshot cites 18 days (trust) / 4 days (individual).
- Form 1 (making): ~59 days average.
- **Disruption**: eForms submissions were **halted entirely until Jan 1, 2026** while ATF reprogrammed for the new $0 NFA transfer tax under the "One Big Beautiful Bill" — this system has full-outage windows tied to legislative changes.
- Forward risk: staffing cuts expected to increase delays as $0-tax application volume rises. ([SlapEFT tracker](https://slapeft.com/processing-times), [National Gun Trusts](https://www.nationalguntrusts.com/blogs/nfa-gun-trust-atf-information-database-blog/atf-eforms-submissions-are-halted-until-january-1-2026), [Silencer Central](https://www.silencercentral.com/blog/nfa-wait-times/))

**API/batch access**: no public batch-submission API for eForms. **Treat eForms like NICS — any "integration" a competitor claims is likely browser automation.**

**Product implications**: don't roadmap a real-time eForms API integration as a v1 assumption. The realistic product is a **data-prep and pre-fill layer** (populate fields from ALL's records, catch validation errors pre-submission) with submission remaining a manual portal step, plus a status/wait-time dashboard.

---

## 5. State-level overlays — the multi-state compliance matrix

A multi-state platform effectively needs a per-state ruleset engine. Confirmed data points:

| State | System / Requirement |
|---|---|
| **California** | DROS Entry System (DES) — dealer submits every sale/transfer electronically to CA DOJ under Penal Code §28205; actively versioned (DES v9.1.0.0 released 7/30/2026). Partial POC. ([CA DOJ DES](https://des.doj.ca.gov/login.do)) |
| **Illinois** | FTIP — dealers enroll at initial licensing, at renewal, and every 3 years; every transfer requires **both** FOID validity check via FTIP **and** NICS; ISP Firearm Dealer Portal. (430 ILCS 68). ([ISP FTIP](https://isp.illinois.gov/Foid)) |
| **New York** | Dealers log every handgun/SBS/SBR/assault-weapon transaction and forward to NY State Police within 10 days of delivery. Separate ammunition-sale recordkeeping since Sept 2022. Statutory security-controls mandate. ([Giffords NY](https://giffords.org/lawcenter/state-laws/maintaining-records-of-gun-sales-in-new-york/), [NY ammo records](https://gunsafety.ny.gov/ammunition-registration)) |
| **Washington** | 10-day waiting period post-background-check-request. **Permit-to-purchase** law effective **May 1, 2027**. Partial POC. ([Johns Hopkins](https://publichealth.jhu.edu/center-for-gun-violence-solutions/2025/washington-passes-permit-to-purchase-law)) |
| **Oregon** | Measure 114 (2022) framework in force; 2025 72-hour-wait bill died in committee — monitor. Full POC. |
| **Colorado** | 3-business-day waiting period in effect. SB 25-3 adds **permit-to-purchase for semiautos with detachable magazines, effective August 2026**. Full POC. |

**Payment-processing overlay — MCC split, a genuine cross-state landmine**:
- **Mandating** states (must assign the firearms MCC): **California** (AB 1587 — acquirers assign to CA merchants from May 1, 2025; $10,000/violation penalty), **New York** (~May 2025), **Colorado**.
- **Banning** states (prohibit the firearms MCC): **Texas, Florida, Georgia, Tennessee, Iowa, Wyoming**, and others — 11 states total. ([PaymentsDive](https://www.paymentsdive.com/news/state-laws-gun-merchant-category-code-visa-mastercard-amex-discover/695118/), [Corepay](https://corepay.net/articles/californias-firearm-mcc-mandate-what-merchants-need-to-know/))

**Product implications**: this is an architecture requirement — a **state-configuration engine** keyed to the dealer's licensed premises address (not HQ) toggling: additional state background-check submission (CA DES, IL FTIP, NY reporting), state waiting-period countdown logic layered on/overriding the federal 3-day default-proceed, and per-state MCC selection in payments. A dealer operating in both CA (mandated MCC) and TX (banned MCC) cannot use one uniform payment configuration.

---

## 6. Interstate transfer / shipping rules

- FFL-to-FFL transfer permitted by mail or common carrier; a non-licensee cannot receive an interstate firearm shipment directly.
- **Handguns**: FedEx/UPS require **overnight/next-day service**.
- **Long guns**: USPS or common carrier; carrier must be told the package contains a firearm.
- **Ammunition**: **no USPS**; common carrier **ground only**, ORM-D/hazmat marking. **Firearms and ammunition cannot ship in the same package** — a hard packing-list validation rule.
- **Plain packaging mandate**: no exterior markings revealing firearm/ammo contents — federal, not just carrier policy. ([LegalClarity](https://legalclarity.org/how-to-legally-ship-a-firearm-to-an-ffl/), [Bravo shipping guide](https://www.bravostoresystems.com/compliance/firearms-shipping-compliance-ffl))

**Product implications**: hard validators — reject same-package firearm+ammo, flag handguns for overnight-only carrier options, strip product-identifying text from generated labels.

---

## 7. ITAR → EAR export jurisdiction shift (2020)

Effective **March 9, 2020**, most **non-automatic and semi-automatic firearms up to .50 cal**, plus specified ammo/parts/accessories, moved from ITAR USML Categories I–III to the EAR's Commerce Control List (Category 0), administered by BIS. **Fully automatic firearms remain under ITAR** (USML I(b)). ([Williams Mullen](https://www.williamsmullen.com/insights/news/legal-news/itar-ear-export-controls-firearms-five-important-points-you-need-know))

Export-facing manufacturers under EAR need ECCN classification, end-user/end-use screening, and license determinations; full-auto/NFA destructive-device manufacturers remain under ITAR/DDTC registration.

**Product implications**: for manufacturer/SOT customers who export, an ECCN/USML classification helper and EAR-vs-ITAR routing decision tool (fire-control mechanism + caliber) — misclassification is felony-exposure, not a minor miss.

---

## 8. FFL licensing process — licensing-as-a-service opportunity

- **New application**: ~60 days target from complete application; Investigating Officer interview + premises inspection, then FFLC review.
- **Renewal**: every 3 years (18 U.S.C. §923); Form 8 Part II auto-mailed ~90 days before expiration; Pay.gov payment. Fees: Type 01/02 = $90/3yr, Type 03/06 = $30/3yr, Type 07/08 = $150/3yr, Types 09/10/11 = $3,000/3yr.
- Inspections continue regardless of license cycle (18 U.S.C. §923(g), 27 CFR §478.23). ([ATF Apply for a License](https://www.atf.gov/firearms/tools-and-services-firearms-industry/apply-for-a-license), [FFLGuard renewal](https://www.fflguard.com/ffl-license-renewal/))

**Opportunity**: guided Form 7/Form 8 wizard with validation against common rejection reasons, 90-day renewal tracker, fee-tier lookup, inspection-readiness checklists mapped to top FY2024 violation categories. Natural extension of the core product.

---

## 9. Data/privacy constraints — FOPA 1986, no centralized registry, cloud A&D basis

This constraint shapes ALL's entire cloud architecture.

**FOPA 1986 (18 U.S.C. §926 as amended)**: prohibits ATF from using FFL-held records to create **any system of registration of firearms, firearms owners, or firearms transactions**. Appropriations riders (continuous since 1979) separately bar consolidating/centralizing FFL records. The only lawful federal centralized registry is the **NFRTR** (NFA items only). ([Congress.gov CRS IF12057](https://www.congress.gov/crs-product/IF12057))

**Architecture implications**:
- **No cross-dealer aggregation/search product for ordinary firearm transaction data** — a "search all dealers for serial X" feature operated as a centralized queryable index across unrelated FFLs risks functioning as the prohibited registry. This is why vendors market per-dealer "electronic bound books," not shared databases.
- ATF's 2016-1 cloud authorization is conditioned on the dealer maintaining **exclusive access and control** over their own records: strict per-FFL data partitioning demonstrable to an inspector as "this is Dealer X's bound book" — access controls, audit logs, and export tooling all reinforcing single-licensee custody.
- The **append-only edit trail** (§1) doubles as ATF integrity requirement and protection against anyone (including ALL) quietly altering historical data.
- **4473 data sensitivity**: PII + firearm serials stored indefinitely = target-rich breach dataset. State breach-notification law applies; encryption at rest, strict RBAC, and breach-response planning are non-optional.

---

## Cross-cutting product-requirement summary

| Requirement | Hard constraint | ALL must build |
|---|---|---|
| A&D records | Append-only, no deletion, ATF-defined search fields | Immutable ledger schema, ATF-format export |
| 4473 | Indefinite retention (fixed window proposed 2026), exact OMB wording, signature-hardware fallback | Field validation attacking top violation categories; terminal provisioning (1/500 forms) |
| NICS | 3-day delay/default-proceed is FFL's call, no public API | Auto-fill from 4473 into E-Check portal (automation, not API); manual-fallback UX; delay countdown |
| eForms | No batch API; full-system outage into 2026 | Pre-fill/validation layer, not a submission API integration |
| State overlays | CA DES, IL FTIP, NY reporting, WA/OR/CO waiting periods, MCC split | Per-state rules engine keyed to premises address |
| Shipping | No firearm+ammo in one package; handgun=overnight only | Hard packaging/carrier validators if logistics in scope |
| Export | Auto vs semi-auto = ITAR vs EAR fork | ECCN/USML classification helper for manufacturer customers |
| Licensing | 3-yr renewal cycle, fee tiers by type | Renewal deadline tracker, licensing wizard |
| Privacy/FOPA | No centralized cross-dealer registry; single-licensee custody | Strict per-FFL partitioning demonstrable to inspectors; no cross-dealer transaction search product |
