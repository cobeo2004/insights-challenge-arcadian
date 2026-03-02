# LLM Insight Prompts for GSC Data Analysis

Curated prompts for the Insights Agent chat UI. Each prompt is designed to trigger the `analyzeSearchData` tool and produce actionable SEO insights from the Arcadian Digital GSC dataset (Feb 2025 – Jan 2026).

> **Tip:** Copy-paste any prompt below directly into the InsightsPanel chat. The agent will automatically call the tool with appropriate parameters.

---

## 1. Overview & Summary

### Full-Period Performance Snapshot

```
Analyze the full date range 2025-02-01 to 2026-01-30. Give me a high-level performance summary including total clicks, total impressions, and any notable patterns in the daily trend data. Highlight the best and worst performing days if visible.
```

### Monthly KPI Summary Table

```
Analyze each month individually from 2025-02-01 to 2026-01-30 and produce a month-by-month summary table with columns: Month, Clicks, Impressions, Est. Avg CTR, Est. Avg Position. Identify which months saw the strongest and weakest performance.
```

### Executive Dashboard Brief

```
Analyze 2025-02-01 to 2026-01-30 with topN set to 10. Write a concise executive summary (5-6 bullet points) covering overall traffic health, top keyword themes, top page performance, and one key recommendation. Keep it suitable for a non-technical stakeholder.
```

---

## 2. Trend Analysis

### Month-over-Month Growth (Recent)

```
Compare the two most recent months: analyze 2025-12-01 to 2025-12-31 and then 2026-01-01 to 2026-01-30. Report the percentage change in clicks and impressions. Identify which keywords or pages drove the biggest changes between the two months.
```

### Quarter-over-Quarter Comparison

```
Compare Q2 2025 (2025-04-01 to 2025-06-30) with Q3 2025 (2025-07-01 to 2025-09-30). Analyze both periods and highlight growth or decline in clicks, impressions, and keyword diversity. Were there seasonal patterns?
```

### Early vs Late Period Growth

```
Compare the first 3 months (2025-02-01 to 2025-04-30) with the last 3 months (2025-11-01 to 2026-01-30). Identify which keywords or pages are new in the recent period versus the early period. Has the site's search footprint grown?
```

### Seasonal Pattern Detection

```
Analyze these periods sequentially and identify seasonal trends:
- Summer: 2025-12-01 to 2026-01-30
- Autumn: 2025-03-01 to 2025-05-31
- Winter: 2025-06-01 to 2025-08-31
- Spring: 2025-09-01 to 2025-11-30
(Australian seasons). Are there clear seasonal patterns in traffic or keyword demand?
```

---

## 3. Keyword Analysis

### Top Keyword Deep Dive

```
Analyze 2025-02-01 to 2026-01-30 with topN set to 100. For the top 20 keywords by impressions, categorize them into themes (brand, service, location, informational). Which themes drive the most clicks vs impressions?
```

### High Impression / Low Click Keywords (Opportunities)

```
Analyze 2025-02-01 to 2026-01-30 with topN set to 100. Identify keywords that have high impressions but very low CTR (below 2%). These represent optimization opportunities. For each, suggest what might be causing low CTR and how to improve it.
```

### Brand vs Non-Brand Split

```
Analyze 2025-02-01 to 2026-01-30 with topN set to 100. Separate keywords into brand terms (containing "arcadian", "arcadian digital") and non-brand terms. What percentage of clicks and impressions come from brand vs non-brand? How does CTR differ between the two groups?
```

### Keyword Position Distribution

```
Analyze 2025-02-01 to 2026-01-30 with topN set to 100. Group the top keywords by average position ranges: 1-3 (top), 4-10 (first page), 11-20 (second page), 20+ (deep). How many keywords fall into each bucket? What's the click share for each group?
```

### Emerging Keywords (Recent Gains)

```
Compare keyword performance between 2025-02-01 to 2025-07-31 and 2025-08-01 to 2026-01-30, both with topN 100. Identify keywords that appear in the recent period but not in the earlier one, or that have significantly more impressions in the recent period. These are emerging opportunities.
```

---

## 4. Page Performance

### Top Pages Analysis

```
Analyze 2025-02-01 to 2026-01-30. For the top 20 pages by impressions, provide a breakdown: which pages drive the most clicks? Which have the best CTR? Which have the best average position? Identify any pages with high impressions but poor CTR.
```

### Underperforming Pages

```
Analyze 2025-02-01 to 2026-01-30 with topN set to 100. Look at the top pages and identify those with average position worse than 15 or CTR below 1%. These are underperforming pages. Suggest possible reasons and improvement strategies for each.
```

### Page-Level Trend (Blog vs Service Pages)

```
Analyze 2025-02-01 to 2026-01-30. From the top pages, separate them into likely categories: blog/content pages, service pages, and the homepage. Compare aggregate performance across these categories. Which category is driving growth?
```

### Page Cannibalization Check

```
Analyze 2025-02-01 to 2026-01-30 with topN set to 100. Look at the top keywords and the top pages. Are there cases where multiple pages from the site might be competing for the same keywords? Identify potential keyword cannibalization issues.
```

---

## 5. CTR & Position Optimization

### Low CTR at Good Positions

```
Analyze 2025-02-01 to 2026-01-30 with topN set to 100. Find keywords with average position between 1 and 5 but CTR below 5%. These are high-priority optimization targets — the site ranks well but isn't getting clicks. Suggest title tag and meta description improvements for each.
```

### Position Improvement Opportunities

```
Analyze 2025-02-01 to 2026-01-30 with topN set to 100. Identify keywords with average position between 5 and 15 that have significant impressions. These are "striking distance" keywords that could reach page 1 or top 3 with focused effort. Rank them by potential impact (impressions × position gap to top 3).
```

### CTR Benchmarking

```
Analyze 2025-02-01 to 2026-01-30 with topN set to 50. For the top keywords, compare their CTR against typical CTR benchmarks for their position range (e.g., position 1 ~28%, position 2 ~15%, position 3 ~11%). Which keywords are above or below expected CTR for their position?
```

---

## 6. Competitive & Content Insights

### Content Gap Identification

```
Analyze 2025-02-01 to 2026-01-30 with topN set to 100. Look at keywords where the site has impressions but average position is worse than 20. These represent topics Google associates with the site but where it ranks poorly. Group them by theme and suggest content that could be created to target these gaps.
```

### High-Value Keyword Clusters

```
Analyze 2025-02-01 to 2026-01-30 with topN set to 100. Cluster the top keywords into topical groups (e.g., web development, digital marketing, SEO, design, specific technologies). Which clusters have the most combined impressions and clicks? Which clusters are underserved with content?
```

### Local SEO Analysis

```
Analyze 2025-02-01 to 2026-01-30 with topN set to 100. Identify keywords with location modifiers (city names, "near me", "australia", state names). How much of the site's visibility comes from local intent queries? What local terms perform best?
```

---

## 7. Actionable Recommendations

### Quick Wins Report

```
Analyze 2025-02-01 to 2026-01-30 with topN set to 100. Generate a prioritized list of quick wins — actions that can improve traffic with minimal effort. Focus on:
1. Keywords at position 4-10 with high impressions (push to top 3)
2. Keywords at position 1-3 with CTR below expected (improve titles/descriptions)
3. Pages with high impressions but no clicks (fix indexing or relevance issues)
Rank each opportunity by estimated traffic impact.
```

### Content Strategy Roadmap

```
Analyze 2025-02-01 to 2026-01-30 with topN set to 100. Based on the keyword and page data, create a 3-month content strategy. Identify:
1. Existing content to update and optimize
2. New content topics based on keyword gaps
3. Keywords to target with each piece of content
4. Expected impact based on current impression volumes
```

### Monthly Performance Report (Latest Month)

```
Analyze 2026-01-01 to 2026-01-30 with topN set to 50. Create a structured monthly SEO report including:
- Traffic summary (clicks, impressions)
- Top 10 keywords with metrics
- Top 10 pages with metrics
- Notable changes or anomalies
- 3 specific action items for next month
Format it as a professional report suitable for a client.
```

### Technical SEO Signals

```
Analyze 2025-02-01 to 2026-01-30 with topN set to 50. From the page performance data, identify potential technical SEO issues:
- Pages with very low CTR across all keywords (possible indexing issues)
- Pages with inconsistent position data (possible crawl issues)
- URL patterns that perform notably better or worse
Suggest technical investigations based on the data signals.
```
