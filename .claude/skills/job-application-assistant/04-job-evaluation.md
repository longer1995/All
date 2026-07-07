# Job Evaluation Framework

<!-- SETUP: Skill match areas and career goals personalized from documents/cv/ on 2026-07-07. -->

## Scoring Dimensions

Evaluate each job posting against these five dimensions:

### 1. Technical Skills Match (0-100)
How well do the required/preferred skills align with the candidate's capabilities?

| Score | Meaning |
|-------|---------|
| 80-100 | Core requirements are primary skills |
| 60-79 | Most requirements match, 1-2 gaps that are learnable |
| 40-59 | Partial match, significant upskilling needed |
| 0-39 | Fundamental mismatch |

**Strong match areas:** Full-cycle B2B SaaS/enterprise sales, outbound prospecting, consultative/solution selling, six- and seven-figure contract negotiation, multi-stakeholder deal management (engaging COOs/SVPs/Regional Directors), long-term exclusive agreement negotiation
**Moderate match areas:** Formal sales methodology (MEDDIC/Challenger/etc. - not confirmed), large sales-team collaboration/forecasting in a structured enterprise sales org, marketing/SDR-partnership motions
**Weak match areas:** Roles requiring deep prior SaaS-specific vertical tenure (most of Brandon's SaaS experience is from the current Arcestra.ai role, May 2025-present); pure inside-sales/high-volume transactional roles

### 2. Experience Match (0-100)
Does work history align with what they're looking for?

| Score | Meaning |
|-------|---------|
| 80-100 | Direct experience in the same domain and role type |
| 60-79 | Related experience, transferable skills clear |
| 40-59 | Adjacent experience, would need to make the case |
| 0-39 | Unrelated experience |

**Strong:** Enterprise/B2B new-business development, technical/regulated-product selling, founder-led GTM build-out, capital raising
**Moderate:** Mainstream SaaS account management (limited direct tenure - about 14 months at Arcestra.ai as of writing), team-based (non-founder) sales roles
**Entry-level:** N/A - eight years of experience, not an entry-level candidate

### 3. Behavioral/Culture Fit (0-100)
Does the role and company culture match the behavioral profile?

| Score | Meaning |
|-------|---------|
| 80-100 | Culture strongly matches behavioral preferences |
| 60-79 | Mixed signals but mostly compatible |
| 40-59 | Some friction areas |
| 0-39 | Significant culture mismatch |

**Red flags to research:** Heavily scripted/SDR-fed transactional sales motions with little deal ownership; department disorganization; poor chemistry with leadership. Check Glassdoor, LinkedIn, and news coverage for insider perspective.

### 4. Location & Logistics (Pass/Fail + Notes)
- Houston, TX or remote: PASS
- Requires relocation outside Houston: FLAG (discuss with Brandon - not yet confirmed as a deal-breaker)
- Frequent travel: FLAG (discuss with Brandon; prior roles included travel, e.g. Spain site visits, so likely tolerable but confirm)

### 5. Career Alignment & Motivation (0-100)
Does this role advance career goals and contain tasks that energize?

| Score | Meaning |
|-------|---------|
| 80-100 | Strongly aligned with career direction, clear growth path |
| 60-79 | Good role but only partially aligned with long-term goals |
| 40-59 | Decent job but doesn't build toward career goals |
| 0-39 | Dead end or backwards step |

**Career goals:**
- Transition from founder/head-of-sales roles into a full-time enterprise sales role at an established company (explicitly stated on both resumes)
- Continue selling technically complex products where domain credibility is a differentiator
- [ASK Brandon: target seniority (AE vs. senior AE vs. sales leadership), team size preference, comp structure preference]

**Motivation filter:** Evaluate not just whether Brandon *can* do the tasks, but whether the tasks will *energize* him. Consider:
- Tasks that energize (inferred): full-cycle deal ownership, technical/consultative selling, cross-functional work with engineering/solution teams
- Tasks that likely drain (inferred): high-volume low-touch transactional selling with no deal ownership
- Non-task factors: [ASK - leadership style, degree of autonomy, team structure preferences]

**Life situation alignment:** Consider personal constraints:
- **Security**: Recently exited two ventures (April 2026) and is explicitly seeking full-time stability - weight compensation predictability and role stability higher than upside-only comp
- **Flexibility**: [ASK - schedule constraints]
- **Professional development**: Interested in AI-native SaaS / enterprise infrastructure given current Arcestra.ai role - roles that build on this are likely higher priority

### 6. Salary Benchmark (Optional)

If the salary lookup tool is configured (`salary_data.json` exists), look up the company:
```
python salary_lookup.py "<Company Name>" --json
```

Not yet configured for Brandon - see `tools/README_SALARY_TOOL.md` if salary data becomes available. Skip this section until then.

## Output Format

Present the evaluation as:

```
## Job Fit Evaluation: [Role] at [Company]

| Dimension | Score | Notes |
|-----------|-------|-------|
| Technical Skills | XX/100 | [brief note] |
| Experience Match | XX/100 | [brief note] |
| Behavioral Fit | XX/100 | [brief note] |
| Location | PASS/FAIL | [brief note] |
| Career Alignment | XX/100 | [brief note] |

**Overall Score: XX/100** (weighted average of scored dimensions)

### Verdict: [Strong Fit / Good Fit / Moderate Fit / Weak Fit / Poor Fit]

### Key Strengths for This Role
- [bullet points]

### Gaps to Address
- [bullet points]

### Recommendation
[1-2 sentences: apply/skip/apply with caveats]

### Company Research Checklist
- [ ] Checked company website (mission, values, recent news)
- [ ] Checked review sites (Glassdoor, etc.)
- [ ] Checked LinkedIn for team size, recent hires, connections
- [ ] Checked media for restructuring, growth, or workplace issues
- [ ] Identified network contacts who may know the team/manager
```

## Weighting
- Technical Skills: 30%
- Experience Match: 25%
- Behavioral Fit: 15%
- Career Alignment: 30%

(Location is pass/fail, not weighted)

## Thresholds
- **Strong Fit** (75+): Definitely apply, tailor everything
- **Good Fit** (60-74): Apply, address gaps in cover letter
- **Moderate Fit** (45-59): Consider carefully, discuss with Brandon
- **Weak Fit** (30-44): Probably skip unless strategic reasons
- **Poor Fit** (<30): Skip

## Pre-Application: Call the Employer (Best Practice)

Before writing the application, consider whether Brandon should call the contact person listed in the posting. **Only call if there are substantive questions** - never call just to "be remembered."

### When to Suggest Calling
- The posting has unclear or ambiguous requirements
- It's unclear which competencies are essential vs. nice-to-have
- The role description is vague about day-to-day tasks
- There's a named contact person who invites questions

### Good Questions to Ask
- "What are the primary challenges in this role?"
- "How is time typically divided across the listed responsibilities?"
- "Which competencies are most critical for success in this position?"
- "What does success look like in the first 6-12 months?"

### Rules for the Call
- Prepare a 30-second "elevator pitch" about your background in case they ask
- The call's purpose is **gathering information**, not delivering a pitch
- Take notes - use what you learn to tailor the application
- Reference the conversation naturally in the cover letter ("After speaking with [name], I was especially drawn to...")
</content>
