# Blog analytics

Production builds use GA4 `G-9W970VLJ6X`. Hugo server and development builds do not load tracking. `config` sends the single automatic page view; do not add another manual page_view.

All events carry `measurement_version=2`, `page_type`, and `content_group`. Regular pages in posts/weekly are articles; home, section, taxonomy, term and not_found remain separate. Articles also carry `article_id` (canonical relative path unless front matter supplies article_id), `article_title`, `published_date`, and `article_age_bucket` (0_6d, 7_29d, 30_89d, 90d_plus, future). Retain article_id if a URL changes. Age is calculated at visit time using the publication date in Asia/Shanghai.

| Event | Definition |
| --- | --- |
| article_impression | An article title link is at least 50% visible continuously for 1 second. Once per target path and placement per page load; homepage, article lists, and Pagefind results. |
| select_content | Click on a same-origin article link, with content_id, target_article_title, entry_point and content_type=article. |
| article_engaged | At least 30 seconds with the page visible and at least 25% of the body reached. Once per page load. |
| article_read_end | At least 30 seconds with the page visible and at least 90% of the body reached. Once per page load. |
| follow_click | Click RSS or Fediverse in the sidebar; this is intent, not a confirmed subscription. |
| page_not_found | Error template loaded, with missing_path. Does not repair the URL. |

Reading uses the visible bottom edge of the article body, clipped by both the card scroller and viewport. A short article may already be fully visible. Visible time is a proxy for engagement, not proof of attention or comprehension; background/suspended time does not count. Events use maximum depth and accumulated foreground time. Default GA scroll is not the completion metric. RSS reading and tracking blockers remain outside this coverage.

Custom events do not collect search text, link queries or fragments. Existing GA page_location/referrer behavior remains unchanged. Entry targets use content_id so they do not overwrite the source page's article_id/title.

In GA4, register event-scoped custom dimensions for page_type, article_id, article_title, published_date, article_age_bucket, measurement_version, entry_point, content_id, target_article_title, follow_method and missing_path before using these in custom reports. content_group already has a built-in dimension. Custom definitions and report changes are GA4 account configuration, not part of a code deployment. Event collection starts on deployment; historical events cannot be backfilled.

Validation: `node --test scripts/test-analytics.cjs`, then `hugo --minify`. Verify generated home/article/tag/404 templates and production analytics asset after deployment. GitHub Actions runs tests and builds/search-indexes before publishing Pages.
