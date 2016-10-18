---
layout: post
title: Rounding strategies used in IIIF
---

<script type="text/javascript"
    src="http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML">
</script>

## TL:DR
Make sure you are rounding the same way across your stack (I think).

While developing [Leaflet-IIIF](https://github.com/mejackreed/Leaflet-IIIF) I've noticed differences in the way that IIIF clients and image servers implement calculating aspect ratios. This post serves as a collection of information gathered in hopes that it can help the community steer in a collective direction.

## What's this rounding about?

The [IIIF Image API](http://iiif.io/api/image/2.1/) is a super cool, powerful way to serve out images. A primary use of this API is serving tiled images in a standardized way so that multiple clients can use them.

## A tiled image example
Here's an example of a IIIF image that is being served out from the Stanford University Library.
{% include leaflet_iiif.html param="https://stacks.stanford.edu/image/iiif/hg676jb4964%2F0380_796-44/info.json" %}

To create this tiled image view, Leaflet-IIIF requests images from the image server at Stanford and then stitches them all back together. The client figures out which images it needs to request to create an optimal experience for the end user.

Requested image: `https://stacks.stanford.edu/image/iiif/hg676jb4964%2F0380_796-44/0,0,5426,3820/679,/0/default.jpg`

This request is asking for an image that is the [full size](http://iiif.io/api/image/2.1/#size) and is scaled to `679` pixels wide. That `679` pixel width is calculated in Leaflet-IIIF and used to request a [canonical url](http://iiif.io/api/image/2.1/#canonical-uri-syntax) of an image. 

Now this is all good so far, and the image seems to load fine but lets look closer.

![The Black Line]({{ site.baseurl }}/assets/black_line.jpg)

There is a black line located at the bottom of the image. This black line exists because the image server is expecting to return an image of a different size than the size requested (or thought it was requested). The server then seems to fill the negative space with black pixels.

The [returned image](https://stacks.stanford.edu/image/iiif/hg676jb4964%2F0380_796-44/0,0,5426,3820/679,/0/default.jpg) comes back as `679` pixels wide and `479` tall. The original dimensions of the image are `5426 x 3820`. Requesting a scaled image of `679` pixels wide could return an image of either `478` or `479` pixels depending on how the server calculates the aspect ratio.

\begin{equation}
  h_2 = \frac{(w_2 * h_1)}{w_1}
\end{equation}

\begin{equation}
 478.02801326944342 = \frac{(679 * 3820)}{5426}
\end{equation}

The image server is expecting to return an image that is appropriately scaled to the aspect ratio using a specific rounding strategy. Since an image server is only going to return an image with integer pixel dimensions it now must make a decision. Do I discard the remainder? Do I round up to the next integer? Do I round to the nearest integer? In this example the image server always rounds up to the next integer. These strategies can be consolidated to the following and are available in most standard math libraries.

Strategy | Description | Example
-------- | ----------- | -------
ceil | always round up to the next integer | `Math.ceil(10.001) -> 11`
floor | always round down to the previous integer | `Math.floor(10.88) -> 10`
round | round to the closest integer | `Math.round(10.4) -> 10`, `Math.round(10.6) -> 11`

## Problems these differences can present

Two separate IIIF server implementations have the potential to return a different sized image with the same request. The underlying image processing tools may also be using a different rounding implementation than the server that is returning the tile. These inconsistencies have the potential to cause unintended artifacts in the image viewing experience.

## Comparisons of implementations

A non-exhaustive comparison of IIIF rounding implementations:

Software | Rounding method | Example
-------- | --------------- | ---------------
[Image API Implementation Notes](http://iiif.io/api/image/2.1/#a-implementation-notes) | floor | `The algorithm below is shown as Python code and assumes integer inputs and integer arithmetic throughout (ie. remainder discarded on division)`
[go-iiif](https://github.com/thisisaaronland/go-iiif) | floor | `/0,0,3897,4096/245,/0/default.jpg` returns `245 x 257`
[riiif](https://github.com/curationexperts/riiif) | round | `0,0,4264,3248/333,/0/default.jpg` returns `333 x 254` [(see ImageMagick)](http://www.imagemagick.org/Usage/resize/)
kakadu | ceil | [proof](https://gist.github.com/jpstroop/75370e438cdce8f34817c475e6eb5969) thanks [@jpstroop](https://twitter.com/jpstroop) |
openjpeg | ceil | [proof](https://gist.github.com/jpstroop/75370e438cdce8f34817c475e6eb5969) thanks [@jpstroop](https://twitter.com/jpstroop) |
[loris](https://github.com/loris-imageserver/loris) | ceil | [code reference](https://github.com/loris-imageserver/loris/blob/36c9ccd386b55c3f27216ba93580b51583f83725/loris/transforms.py#L189)
[leaflet-iiif](https://github.com/mejackreed/Leaflet-IIIF) | ceil | [code reference](https://github.com/mejackreed/Leaflet-IIIF/blob/master/leaflet-iiif.js#L54)
[openseadragon](https://github.com/openseadragon/openseadragon) | ceil | [code reference](https://github.com/openseadragon/openseadragon/blob/master/src/iiiftilesource.js#L343)
[iiif_s3](https://github.com/cmoa/iiif_s3) | ceil | [code reference](https://github.com/cmoa/iiif_s3/blob/master/lib/iiif_s3/builder.rb#L186-L190)

See something wrong here? [Submit a PR](https://github.com/mejackreed/jack-reed.com/blob/master/_posts/2016-10-14-rounding-strategies-used-in-iiif.md)

## What should we do?

I'm not exactly sure what we should do. I would assume that at varying levels of the IIIF rounding methodologies are implemented for good reasons. Hopefully for performance reasons at the low levels. What prompted me to start looking into this was [a pull request](https://github.com/mejackreed/Leaflet-IIIF/pull/49) in Leaflet-IIIF aiming to resolve some of the artifacts. This PR prompted a discussion about the canonical uri syntax and what a client can expect back from a IIIF image service. It is counterintuitive that a canonical uri can return images at different sizes.

The community could work to standardize on a particular rounding method. Though the coordination and software changes/upgrades might not be worth the effort. ¯\\_(ツ)_/¯

Hopefully this serves as a resource for others who run into this problem or want to discuss further. Relevant previous discussions:
 - [iiif.io](https://github.com/IIIF/iiif.io/issues?utf8=%E2%9C%93&q=is%3Aissue%20rounding%20)
 - [iiif-discuss](https://groups.google.com/forum/#!searchin/iiif-discuss/rounding%7Csort:relevance)
