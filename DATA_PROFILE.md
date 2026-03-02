# CSV Data Profile: arckeywords.csv

## Context

This is Google Search Console keyword data for **Arcadian Digital** (arcadiandigital.com.au), a Melbourne-based digital agency. The dataset captures daily search query performance metrics across their website pages.

---

## Dataset Overview

| Metric | Value |
|---|---|
| **Total rows** | 431,499 |
| **Date range** | 2025-02-01 to 2026-01-30 (364 days, ~12 months) |
| **Unique keywords** | 17,846 |
| **Unique page URLs** | 701 |
| **Unique page IDs** | 704 |

## Column Schema (14 columns)

| Column | Type | Description | Notable Values |
|---|---|---|---|
| `id` | int | Primary key / row identifier | 3,574,403 - 88,784,531 |
| `analytics_type` | string | Always `"page_query"` | Single value across all rows |
| `device` | string | Device type | Always `"NULL"` (not segmented) |
| `clicks` | int | Number of clicks | Range: 0-10, Sum: 1,593 |
| `impressions` | int | Number of impressions | Range: 1-2,088, Sum: 1,911,837 |
| `analytics_date` | date | Date of the search data | 2025-02-01 to 2026-01-30 |
| `ctr` | float | Click-through rate | Range: 0.0-1.0, Mean: 0.000962 |
| `position` | float | Average search position | Range: 1.0-601.0, Mean: 49.35 |
| `keyword` | string | Search query/keyword | 17,846 unique values |
| `page_id` | int | Internal page identifier | 704 unique values |
| `page_url` | string | Full URL of the landing page | 701 unique values |
| `page_date` | date | Page publish/update date | Various dates |
| `tracked_page` | string | Whether page is tracked | 0 (163,929), 1 (267,455) |
| `google_search_console_sites_id` | int | GSC property ID | 33 (nearly all rows) |

## Key Observations

### 1. Extremely Sparse Click Data
- Only **1,050 rows** (0.24%) have clicks > 0
- Total clicks across 431K rows: **1,593**
- Max clicks per row: **10**
- The vast majority of data is impression-only (users saw the listing but didn't click)

### 2. High Impression Volume
- Total impressions: **1,911,837**
- Average daily impressions: ~5,252
- Average impressions per row: 4.43
- Some keywords generate 2,000+ impressions in a single day

### 3. Top Keywords by Clicks (Brand + Service)

| Keyword | Total Clicks | Total Impressions | Effective CTR |
|---|---|---|---|
| arcadian digital (brand) | 934 | 16,581 | 5.6% |
| powercor outage map | 33 | 11,470 | 0.3% |
| ai agency melbourne | 32 | 3,227 | 1.0% |
| ai consultant melbourne | 31 | 398 | 7.8% |
| arcadian digital pty ltd | 30 | 441 | 6.8% |
| ai consulting melbourne | 29 | 2,180 | 1.3% |
| ai consultant | 24 | 9,225 | 0.3% |
| ai consulting | 21 | 16,297 | 0.1% |
| adrian randall | 20 | 162 | 12.3% |
| ai consulting for small businesses | 20 | 1,720 | 1.2% |

### 4. Top Keywords by Impressions (Competitive Terms)

| Keyword | Total Impressions | Total Clicks |
|---|---|---|
| digital agency melbourne | 33,020 | 4 |
| digital marketing agency melbourne | 32,631 | 3 |
| digital agency | 30,625 | 0 |
| google ads agency melbourne | 23,124 | 3 |
| lsi keywords | 22,788 | 0 |
| digital marketing services | 22,510 | 0 |
| digital marketing melbourne | 22,452 | 1 |
| google ads melbourne | 21,724 | 0 |
| web development melbourne | 19,602 | 10 |
| google ads management melbourne | 19,168 | 1 |

### 5. Top Pages by Data Volume

| Page URL | Rows | Description |
|---|---|---|
| /services/web-development | 24,791 | Web dev service page |
| /services/ai-consulting | 23,960 | AI consulting service |
| /services/ui-ux-design | 22,184 | UI/UX design service |
| /services/digital-marketing | 19,869 | Digital marketing service |
| /services/digital-marketing/ | 15,716 | Same page (trailing slash) |
| /services/ecommerce | 15,150 | Ecommerce service |
| /services/digital-marketing/google-ads-management | 15,128 | Google ads sub-page |
| / (homepage) | 14,448 | Main homepage |
| /services/web-applications | 10,695 | Web apps service |
| /blog/seo-pricing-australia | 9,039 | SEO pricing blog post |

### 6. Daily Volume Patterns

- Rows per day: ~900-1,400 (growing over time, suggesting more pages/keywords tracked)
- Daily clicks: 0-10 typically (very low)
- Daily impressions: 3,500-6,500
- Weekends tend to have slightly lower volumes

### 7. Data Quality Notes

- **Duplicate header row** at line 2 (rows 1 and 2 are both headers)
- `device` column is entirely `"NULL"` - no device segmentation available
- `analytics_type` is always `"page_query"` - single analytics type
- `tracked_page` has anomalous values: `"i"` (1 row) and `"33"` (114 rows)
- `google_search_console_sites_id` has 1 row with value `"0.52"` - data anomaly
- `position` values up to 601 (typical GSC range is 1-100+, 601 is an outlier)
- Some page URLs appear with and without trailing slashes (effective duplicates)

## Recommendations for Application Design

### Chart
- **Impressions over time** is the most informative trend (meaningful daily volume: 3,500-6,500/day)
- Clicks are too sparse for a standalone trend but work well as a secondary metric on a dual-axis chart

### Date Filtering
- Full range available: 2025-02-01 to 2026-01-30 (364 days)

### AI Insights (Claude API) - Data Strategy
With 431K rows, raw data cannot be sent to Claude. Recommended aggregation strategies:
1. **Daily totals** (364 rows max) - impressions, clicks, CTR by day
2. **Top keywords** - aggregate by keyword, send top 50-100
3. **Page-level rollups** - aggregate by page URL
4. **Summary statistics** - computed totals, averages, trends, top performers
