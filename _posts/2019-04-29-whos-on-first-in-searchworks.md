---
layout: post
title: Who's on First in SearchWorks
tags:
 - wof
 - search
---

Over the past few days, I've worked on a basic implementation of [Who's on First](https://whosonfirst.org/) (WoF) data into Stanford Libraries catalogue, [SearchWorks](https://en.wikipedia.org/wiki/MARC_standards). This work has been part of an experimental effort to enhance discovery using linked data. While some may not consider WoF "Linked Data™", it has a rich and unique set of concordances and unique features which enable a rich set of applications. Other gazetteers often only contain center points or bounding box geometries for places, one of the unique characteristics of Who's on First is the data contains full geometry of locations.

It's also worth pointing out that I look at this from a narrow lens on linked data as a whole. I recognize that there are experts in this field with more substantial experience with linked data and reconciliation approaches. I'm curious to learn more about these and how they might apply to Who's on First, if you are interested to chat more about alternative approaches feel free to [connect with me on Twitter](https://twitter.com/mejackreed).

## Starting with strings
Our ILS team provides us binary [MARC](https://en.wikipedia.org/wiki/MARC_standards) records that are used in our indexing processes. These MARC records only contain strings that represent places using the Library of Congress Name Authority File (LCNAF) known labels.

So how do we get from

```
Tenderloin (San Francisco, Calif.)
```

to

[![Whos on First Tenderloin]({{ site.baseurl }}/assets/wof-tenderloin.jpg)](https://spelunker.whosonfirst.org/id/85865903)


The [Who's on First data](https://spelunker.whosonfirst.org/id/85865903/) already contains the LCNAF identifier:

```
'wof:concordances': {
  'gp:id': 23512024,
  'loc:id': 'n97044389',
  'qs:id': '953338',
  'qs_pg:id': '953338',
  'wd:id': 'Q7464'
},
``` 

So if we can get the LCNAF identifier for the string `Tenderloin (San Francisco, Calif.)` it should be easy enough to get the WoF id. Luckily, Library of Congress has a ["Known-label retrieval" service](http://id.loc.gov/techcenter/searching.html) that can be used to lookup known labels.

The known-label retrieval service will take known-label in the url (`http://id.loc.gov/authorities/label`) and then redirect to the authority record if it is found.

Example:

```
curl -I -L  'https://id.loc.gov/authorities/label/Tenderloin (San Francisco, Calif.)'

# Redirects to http://id.loc.gov/authorities/names/n97044389
```
While the service will work with content negotiation Accept headers, I found it easier to just parse the response header to retrieve the LCNAF URI.

Of the [top 10,000 geographic terms in SearchWorks](https://gist.github.com/mejackreed/8a98145447d8af892b6e0a0d61aa6b1e), I was able to retrieve 6,497 known label URI's.
Updating the data to get Who's on First identifiers
After we have the LCNAF URI's we can then lookup a Who's on First record where the concordances have been added. There is no formalized Who's on First search service, so the options are:
 - Searching a [download of the data](https://dist.whosonfirst.org/)
 - Using the GitHub search API to search the [whosonfirst-data GitHub organization](https://github.com/whosonfirst-data)
 - Using the [WoF Spelunker](https://spelunker.whosonfirst.org) data explorer

Due to time constraints I chose to use the WoF Spelunker to lookup WoF ids based on matched LCNAF identifiers.

```
https://spelunker.whosonfirst.org/search/?q=n97044389
```

I'm assuming here also that the first record returning here is the only match and return that WoF id as a match. Using this process, I matched 1084 records.

## Displaying the data in SearchWorks
Once we have the data, we can start to use it in our catalogue. Since our index records still only contain the text label, I stored the results in JSON keyed by the text label for quick lookup by the search application.

```
{
  "Tenderloin (San Francisco, Calif.)" : {
    "loc_id":"n97044389",
    "wof_id":"85865903"
  }
}
```

We can now start displaying information from Who's on First records on SearchWorks show pages.

![Who's on First in SearchWorks]({{ site.baseurl }}/assets/wof-sw.png)


We did something with Who's on First in a library catalogue! For fun I added a map of the area, and some metadata from WoF.

## Future work
This is just a beginning, but was a fun exploration on how library data might start to integrate with Who's on First. It also starts to tease at the idea of what could be possible by integrating  rich geographic data sources with library metadata. But by no means is this ready for primetime. A few things stuck out as next steps to take here.

**More LoC concordances** - with only around 10% total of our top [10,000 geographic names](https://gist.github.com/mejackreed/8a98145447d8af892b6e0a0d61aa6b1e) matching, it would be great to be able to add more Library of Congress ids to Who's on First. There are some complexities with the data here, there are many labels that aren't necessarily a place in our "Region" facet like "European Economic Community countries". Another issue here is that regions or continents are not represented in the same way as other places within Library of Congress identifiers.

**Alternate name search** - a nice enhancement to our search would be to index alternate names from WoF data. This would allow for searches in other languages or different terms to return more relevant results.

**Spatial search** - In addition to alternate name search, spatial search enhancements could also be added using WoF data. 

**Search service for WoF** - a more robust way to search Who's on First data could help resolve some of these data issues. This has been discussed before by those in the library community it would be nice to have this as a shared service with some enhancements meant for reconciliation over the Spelunker. 
