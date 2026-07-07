# Search Queries for Job Scraper

<!-- Populated from documents/cv/ on 2026-07-07. Danish job boards from the stock template were
     dropped since Brandon is US-based (Houston, TX); LinkedIn + Google site-searches cover the
     US market. The .agents/skills/*-search CLI tools for Danish portals are still in the repo
     (harmless, unused) - run /add-portal if you want a dedicated Indeed/ZipRecruiter integration. -->

## Search Sites

Primary (US job market):
- **linkedin.com/jobs** - `.agents/skills/linkedin-search` CLI tool, country-agnostic, zero setup
- **indeed.com** - via Google `site:` search
- Company career pages directly, via Google `site:` search for target companies

## Query Categories

Queries are grouped by priority. Each query should be combined with location terms ("Houston", "Houston, TX", "Remote") where the site supports it.

### Priority 1: Enterprise / Strategic Account Executive (SaaS)

Brandon's strongest and most desired career direction - full-cycle enterprise SaaS sales.

```
site:linkedin.com/jobs "Enterprise Account Executive" SaaS Houston
site:linkedin.com/jobs "Strategic Account Executive" SaaS Remote
site:linkedin.com/jobs "Account Executive" "enterprise sales" Houston
```

### Priority 2: Technical / Solution Sales (regulated or complex products)

Matches Brandon's domain expertise selling technically complex, regulated products.

```
site:linkedin.com/jobs "Solution Sales" OR "Technical Sales" Houston OR Remote
site:linkedin.com/jobs "Account Executive" "data center" OR infrastructure Houston
site:linkedin.com/jobs "Business Development" industrial OR manufacturing Houston
```

### Priority 3: Adjacent Leadership Roles

Roles that build on the founder/head-of-sales pattern in his history.

```
site:linkedin.com/jobs "Director of Sales" SaaS Houston OR Remote
site:linkedin.com/jobs "VP Sales" OR "Head of Sales" startup Houston OR Remote
```

### Priority 4: Broader Enterprise Sales (wider net)

```
site:linkedin.com/jobs "Enterprise Account Executive" Texas
site:indeed.com "Enterprise Account Executive" Houston
site:linkedin.com/jobs "Account Executive" AI Houston OR Remote
```

## Location Filter

When evaluating results, verify the job location is within reasonable range of Houston, TX or fully remote. Define acceptable areas:
- Houston, TX and surrounding metro area
- Fully remote (US-based)
- Other Texas metros (Austin, Dallas, San Antonio) - borderline, confirm relocation appetite with Brandon
- Outside Texas, on-site required - too far unless Brandon says otherwise

## Date Filter

Only include jobs posted within the last 14 days, or with an application deadline that has not yet passed. If a posting date cannot be determined, include it but flag as "date unknown".

## Adapting Queries

If the user specifies a focus area, select queries from the matching category and also generate 2-3 custom queries for that focus. For example:
- "/scrape SaaS" -> Priority 1 queries + custom SaaS-focused queries
- "/scrape industrial" -> Priority 2 queries + custom industrial/regulated-product queries
</content>
