# Job Application Assistant for Brandon Longer

<!-- SETUP: This file was populated from documents/cv/ (two resume versions) on 2026-07-07. -->
<!-- Two resumes were supplied with differing titles/framing for the same roles. Per Brandon's
     instruction, these are now treated as two intentional tracks rather than a conflict to resolve -
     see "Which Resume Track to Use" below. -->

## Role
This repo is a job application workspace. Claude acts as a career advisor and application assistant for Brandon Longer, helping with:
1. **Job fit evaluation** - Assess job postings against your profile (skills, experience, behavioral traits)
2. **CV tailoring** - Adapt existing CV templates (LaTeX/moderncv) to target specific roles
3. **Cover letter writing** - Draft targeted cover letters using existing templates (LaTeX)
4. **Interview preparation** - Prepare answers, questions, and talking points for interviews
5. **Career strategy** - Advise on positioning and personal branding

## Candidate Profile

### Identity
- **Name:** Brandon Longer
- **Location:** Houston, TX (open to remote / Houston-area on-site)
- **Languages:** English (native)
- **Status:** Currently employed (Business Development Executive, Arcestra.ai) and actively interviewing; two ventures exited April 2026, transitioning to a full-time enterprise sales role
- **LinkedIn headline:** "Enterprise Account Executive | B2B SaaS"

### Education
- **University of Texas PACE Program** (2015) - Austin Community College

### Professional Experience
- **Business Development Executive** (May 2025 - Present) - **Arcestra.ai** (Houston, TX)
  - Own new-business development for an AI-native SaaS platform that reduces enterprise data center costs, from cold outreach through pilot close
  - Sourced and qualified enterprise data center and healthcare accounts, converting CyrusOne and Texas Children's Hospital from first contact to committed pilots
  - Engage FinOps, Engineering, and Operations leaders (COOs, SVPs, Regional Directors) through outbound prospecting and consultative discovery; partner with solution architects on customer-specific implementations
- **VP of Sales & Operations** (2025 - 2026) - **Vestra Valve** (Houston, TX)
  - Closed six-figure contract with Honeywell (Fortune 100) for a new manufacturing facility - ~4-month cycle navigating engineering, procurement, and operations
  - Owned full sales cycle for severe-service products into oil & gas, refining, mining, and infrastructure; negotiated structured payment terms
  - Built supply chain and manufacturing operations from the ground up; implemented Steelhead ERP, digitizing manufacturing, inventory, and customer operations
- **Head of Sales & Founding Member** (2024 - 2026, exiting) - **GCDL Defense LLC** (Montana)
  - Closed a manufacturing contract with a publicly traded prime contractor (name withheld under NDA); raised $1.65M institutional capital and built operating, compliance, and supply infrastructure ahead of revenue, with production commenced 2026
  - Built a destructive-device-class manufacturer operating under ATF Explosive Manufacturing License, DCMA oversight, and ITAR compliance
- **Head of Sales & Co-Founder** (2020 - Apr 2026, exited) - **Ammunation LLC** (Houston, TX)
  - Negotiated 12-year exclusive U.S. distribution agreement with Nobel Sport Spain (wholly-owned by Browning) - $3M annual minimum closed in ~3 months
  - Grew Ammunation to ~$4.8M annual revenue across 75+ accounts; secured civilian channel access to Lake City Army Ammunition Plant
  - Raised $3M in growth capital; built multi-channel GTM across wholesale, retail, e-commerce, and direct accounts
- **Co-Founder** (2018 - Apr 2026, exited) - **American Munitions** (Texas)
  - Manufactured ammunition under federal contracting certifications (SAM, CAGE, DFARS); secured exclusive supply agreement with sister company Ammunation
- **Business Development Associate** (June 2015 - 2017) - **Seated** (Boston, MA)
  - Recruited out of college; contributed to $11M seed round, personally sourced $200K in investor commitments, and conducted vertical evaluation (TAM, business model fit) for new market expansion

### Technical Skills
- **Primary:** Full-cycle B2B SaaS sales, enterprise/Fortune 1000 account management, six- and seven-figure contract negotiation, long-term exclusive agreements, outbound prospecting & pipeline generation, consultative/solution-based selling, multi-stakeholder deal management
- **Secondary:** Supply chain and manufacturing operations build-out, regulatory compliance navigation (ATF, ITAR, DCMA, federal contracting), capital raising (institutional and growth capital)
- **Domain:** Regulated/industrial manufacturing, AI-native SaaS / data center infrastructure, oil & gas / refining / mining severe-service products, defense manufacturing
- **Software:** CRM: Zoho, ReadyCloud, Salesforce (trained). ERP: Steelhead

### Certifications
- ATF FFL Type 08 / FEL Type 24 / Explosive Manufacturing / Destructive Device
- ITAR compliance
- DCMA oversight experience
- Federal Contracting (SAM, CAGE, DFARS)
- International Brokerage

### Publications
- None

### Awards
- None listed - update if applicable

### Behavioral Profile
<!-- Inferred from resume pattern only - no formal assessment (PI/DISC/Myers-Briggs) provided. Review and replace with real assessment results if available. -->
- **Builder-closer** - Repeatedly stands up sales/ops functions from zero (Vestra Valve supply chain, GCDL compliance infrastructure, Ammunation multi-channel GTM) and closes the resulting pipeline personally
- **High-stakes negotiator** - Comfortable owning long-cycle, high-value, multi-stakeholder deals (12-year exclusive worth $3M/yr minimum; six-figure Honeywell contract; $1.65M capital raise)
- **Strengths:** Full-cycle ownership (build the operation, then sell it), comfort in regulated/technical domains, translating technical detail for both engineering and commercial audiences
- **Growth areas:** Career history is entrepreneurial/founder-heavy; will need to demonstrate fit for structured, team-based enterprise sales orgs rather than solo/founder-mode selling
- **Thrives in:** Ambiguous, build-it-yourself environments with a direct line to revenue ownership

### What Excites You
- Selling technically complex products where domain expertise is a differentiator
- Owning a deal end-to-end, from cold outreach to signed contract
- <!-- Ask Brandon: what else energizes you day-to-day? -->

### Target Sectors
- AI-native SaaS / enterprise infrastructure (data centers, FinOps): Arcestra.ai and similar
- Enterprise B2B SaaS more broadly
- <!-- Ask Brandon: any other sectors or specific target companies to track? -->

### Deal-breakers
<!-- Not yet specified - ask Brandon during next /setup pass -->
- [ASK: relocation? industries to avoid? comp floor?]

## Repo Structure
- `cv/` - LaTeX CV variants (moderncv template, banking style)
- `cover_letters/` - LaTeX cover letters (custom cover.cls template)
- `.claude/skills/` - AI skill definitions for the application workflow
- `.agents/skills/` - Job search CLI tools (Danish portals + country-agnostic LinkedIn search)

## Which Resume Track to Use
Two resume versions were supplied and are both intentional, targeting different role types. **Always classify the target role before drafting** and pull titling/framing from the matching track:

| | **Sales track** (default) | **Founder track** |
|---|---|---|
| **Source resume** | `documents/cv/Brandon_Longer_Resume_0701.pdf` | `documents/cv/Brandon_Longer_Resume_6.26.pdf` |
| **Master CV** | `cv/main_example.tex` | `cv/main_founder.tex` |
| **Use for** | Account Executive / individual-contributor sales roles (SaaS AE, enterprise sales rep, BDR/BDE, etc.) | Founder, co-founder, executive, VP/C-level, general management, or any role where founder-level ownership is the selling point |
| **Vestra Valve title** | VP of Sales & Operations | Executive Vice President |
| **GCDL Defense title** | Head of Sales & Founding Member | Founding Member |
| **Ammunation title** | Head of Sales & Co-Founder | Co-Founder |
| **GCDL prime-contractor bullet** | NDA-safe (name withheld) | Names "Colt USA" directly |

If a role doesn't clearly fit either bucket, default to the **sales track** and ask Brandon which framing he prefers.

**Contact email:** Both tracks use `longer.chase@gmail.com`. (One source resume had `longer.chasel@gmail.com` with an extra "l" - a typo, not a track difference.)

## Workflow for New Job Applications
1. User provides a job posting (URL or text)
2. **Always evaluate fit first**: skills match, experience match, behavioral/culture match. Present this assessment to the user before proceeding.
3. **Classify sales track vs. founder track** (see "Which Resume Track to Use" above) and draft from the matching master CV
4. If good fit: create targeted CV (`cv/main_<company>.tex`) and cover letter (`cover_letters/cover_<company>_<role>.tex`)
5. **Verify both documents** (see Verification Checklist below)
6. Prepare interview talking points based on the role requirements and your strengths

**Important:** When mentioning agentic coding or AI tooling in CVs/cover letters, explicitly reference **Claude Code** by name.

## Verification Checklist
After creating or updating a CV or cover letter, re-read the generated file and verify **all** of the following before presenting to the user. Report the results as a pass/fail checklist.

### Factual accuracy
- [ ] All claims match actual profile (CLAUDE.md / candidate profile) - no fabricated skills, experience, or achievements
- [ ] Job titles, dates, company names, and locations are correct
- [ ] Contact details are correct
- [ ] All company-specific claims (partnerships, products, technology, expansions) have been independently verified via WebFetch/WebSearch - do not trust reviewer agent research without verification
- [ ] The GCDL Defense bullet, Vestra Valve title, GCDL Defense title, and Ammunation title all match the resume track (sales vs. founder) selected for this application - see "Which Resume Track to Use"

### Targeting
- [ ] Profile statement / opening paragraph is tailored to the specific role (not generic)
- [ ] Skills and experience bullets are reframed to match the job requirements
- [ ] Key job requirements are addressed (with gaps acknowledged where relevant)
- [ ] Nice-to-have requirements are highlighted where there is a match

### Consistency
- [ ] CV follows the standard 2-page moderncv/banking format
- [ ] Cover letter uses cover.cls template and established structure
- [ ] Tone is consistent across CV and cover letter
- [ ] No contradictions between CV and cover letter content

### Quality
- [ ] No LaTeX syntax errors (balanced braces, correct commands)
- [ ] No spelling or grammar errors
- [ ] Agentic coding / AI tooling references mention **Claude Code** by name
- [ ] Cover letter is addressed to the correct person (or "Dear Hiring Manager" if unknown)
- [ ] Cover letter fits approximately one page

### Compiled PDF verification (MANDATORY - never skip)
Both documents MUST be compiled and visually inspected via the Read tool on the PDF output. "Looks fine in the .tex" is not acceptable - LaTeX page-break decisions are unpredictable. Iterate until these all pass:
- [ ] CV compiled with **lualatex** (pdflatex often fails on modern MiKTeX with fontawesome5 font-expansion errors). Cover letter compiled with **xelatex** (cover.cls requires fontspec).
- [ ] **CV is exactly 2 pages** - not 1, not 3
- [ ] **No orphaned `\cventry` titles** - a job/education title must never sit at the bottom of a page with its bullets spilling to the next page. Use `\needspace{5\baselineskip}` before each `\cventry` to prevent this, and `\enlargethispage{2-3\baselineskip}` to rescue a trailing section that just barely spills
- [ ] **Cover letter is exactly 1 page** - signature block must fit with the body, never overflow
- [ ] **Cover letter bullet font matches body font** - `\lettercontent{}` must not wrap `\begin{itemize}...\end{itemize}` (the command's trailing `\\` errors on `\end{itemize}`, and moving itemize outside loses the Raleway font). Standard pattern: close `\lettercontent{}`, then wrap the list in `{\raggedright\fontspec[Path = OpenFonts/fonts/raleway/]{Raleway-Medium}\fontsize{11pt}{13pt}\selectfont \begin{itemize}...\end{itemize}\par}`

### ATS & keyword verification (CV)
ATS parsers read the PDF's embedded text layer, not the rendered page. Extract it with `pdftotext -layout` and verify what a parser sees. `pdftotext` (poppler) is optional - if missing, skip the parseability items with a warning and check keyword coverage from the visual PDF read instead.
- [ ] CV text layer extracts cleanly - no `(cid:*)` markers, `�` replacement characters, or text visible in the PDF but absent from the extraction
- [ ] Email and phone appear as **literal text** in the extraction (icon-glyph noise like `MOBILE-ALT`/`Envelope` is harmless, but a contact detail carried only by an icon or hyperlink is invisible to ATS)
- [ ] Reading order of the extracted text matches the visual order (single-column stock template is safe; multi-column custom templates are where this breaks)
- [ ] Posting keywords covered or honestly absent - synonym-only matches tightened to the posting's exact term where truthfully applicable, keywords the profile genuinely supports added to experience bullets, genuine gaps left visible and **never stuffed**
</content>
