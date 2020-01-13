---
layout: post
title: Sitemaps that scale
tags:
 - sitemaps
 - search
---

A few months back, at a [Blacklight-LD Working Meeting](https://wiki.lyrasis.org/display/LD4P2/Blacklight-LD+Working+Meeting+-+September+2019) a few of us were discussing issues with building sitemaps for catalog websites with millions of records. We want to be able to submit sitemaps to search engines so that our content is more discoverable, but generating sitemaps for millions of webpages can sometimes cause headaches.

A few of these headaches include:
 - Long running processes that create sitemaps can become stale rather quickly
 - How do we efficiently manage sitemaps when a record is removed, updated, or changed
 - Out of date sitemaps could lead to 404 errors causing SEO reduction

After a session brainstorming about this problem, a few of us split off to come up with a solution that works in [Blacklight](http://projectblacklight.org/). Thanks to everyone at the meeting who helped discuss the problems and work on a solution together.

The first group of us to work on the problem included myself and

 - [Michael Gibney](https://github.com/magibney)
 - [Andrea Gazzarini](https://github.com/agazzarini)
 - [Matthias Vandermaesen](https://github.com/netsensei)

## The solution

The [solution we devised](https://github.com/sul-dlss/SearchWorks/pull/2351) was originally first implemented within a Blacklight catalog application.

The solution relies on two things:
 - Partitioning your Solr documents in a semi-evenly distributed way
 - Using prefix queries in Solr efficiently query calculated parts of your index

Our solution takes advantage of Solr's ability to automatically create efficient partitions of the data by creating a hexadecimal hash of our unique id field using the [`SignatureUpdateProcessorFactory`]( https://lucene.apache.org/solr/guide/8_4/update-request-processors.html )

```xml
<updateRequestProcessorChain name="add_hashed_id">
  <processor class="solr.processor.SignatureUpdateProcessorFactory">
    <bool name="enabled">true</bool>
    <str name="signatureField">hashed_id_ssi</str>
    <bool name="overwriteDupes">false</bool>
    <str name="fields">id</str>
    <str name="signatureClass">solr.processor.Lookup3Signature</str>
  </processor>

  <processor class="solr.LogUpdateProcessorFactory" />
  <processor class="solr.RunUpdateProcessorFactory" />
</updateRequestProcessorChain>

<requestHandler name="/update" class="solr.UpdateRequestHandler">
  <lst name="defaults">
    <str name="update.chain">add_hashed_id</str>
  </lst>
</requestHandler>
```

Next, because we know the number of documents and roughly the number of documents that can be displayed in a sitemap urlset (50,000 max), we can determine how many prefix characters we want to query which will give us our urlset.

```text
numberOfDocuments / documentsPerUrlSet = numberUrlSetsNeeded

numberUrlSetsNeeded = 16^y
```

16 is used as our base here because we our hashes only use `0-9` `a-f` (hexadecimal positional system).

We can then calculate our exponent.

```text
numberUrlSetsNeeded = 16^y
y = log16(numberUrlSetsNeeded)
y = ln(numberUrlSetsNeeded) / ln(16)
```

Our exponent (y) here will give us the number of prefix characters we will need to build to create a urlset with less than our target `documentsPerUrlSet` per set. We then create a sitemapindex containing these sitemap urlsets. So if our exponent is `3` we will have something like this:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/siteindex.xsd"
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>http://127.0.0.1:3000/sitemap/000</loc>
  </sitemap>
  <sitemap>
    <loc>http://127.0.0.1:3000/sitemap/001</loc>
  </sitemap>
  <sitemap>
    <loc>http://127.0.0.1:3000/sitemap/002</loc>
  </sitemap>
  <sitemap>
    <loc>http://127.0.0.1:3000/sitemap/003</loc>
  </sitemap>
  ...
  <sitemap>
    <loc>http://127.0.0.1:3000/sitemap/af4</loc>
  </sitemap>
  <sitemap>
    <loc>http://127.0.0.1:3000/sitemap/af5</loc>
  </sitemap>
  <sitemap>
    <loc>http://127.0.0.1:3000/sitemap/af6</loc>
  </sitemap>
  ...
  <sitemap>
    <loc>http://127.0.0.1:3000/sitemap/ffd</loc>
  </sitemap>
  <sitemap>
    <loc>http://127.0.0.1:3000/sitemap/ffe</loc>
  </sitemap>
  <sitemap>
    <loc>http://127.0.0.1:3000/sitemap/fff</loc>
  </sitemap>
</sitemapindex>
```

## Putting this into production
This was all theoretical until [Charlie Morris](https://github.com/cdmo) put this into production for [Penn State Libraries' catalog](https://catalog.libraries.psu.edu/). And Charlie has reported this working fairly well so far without too many issues.

We decided then to pull all of this into gem so that we can use it in multiple applications. [Jessie Keck](https://github.com/jkeck), [Camille Villa](https://github.com/camillevilla), and myself did that a few days ago. We now have a gem that others can use in Blacklight and GeoBlacklight applications, [blacklight_dynamic_sitemap](https://github.com/sul-dlss/blacklight_dynamic_sitemap).

Thanks to everyone who worked on putting this solution together!

- [Michael Gibney](https://github.com/magibney)
- [Andrea Gazzarini](https://github.com/agazzarini)
- [Matthias Vandermaesen](https://github.com/netsensei)
- [Jessie Keck](https://github.com/jkeck)
- [Camille Villa](https://github.com/camillevilla)
- [Charlie Morris](https://github.com/cdmo)
