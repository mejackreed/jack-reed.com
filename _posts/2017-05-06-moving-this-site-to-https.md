---
layout: post
title: Moving this site to HTTPS
---

I recently volunteered to write a blog post on why [IIIF](http://iiif.io) resources should be served over HTTPS rather than HTTP. Turns out I should probably be serving that same blog post over HTTPS. This is a quick post on my experience in moving my blog to HTTPS.

## What's wrong with GitHub Pages?

Previously, my blog was served using GitHub Pages from a custom domain. I've had a great experience with GitHub pages and it has been really easy to setup and use. Unfortunately, GitHub pages using custom domains [do not have an option for HTTPS](https://github.com/isaacs/github/issues/156). GitHub Pages does [offer HTTPS](https://help.github.com/articles/securing-your-github-pages-site-with-https/) for non custom domain sites, but that doesn't really help me here. I would like the flexibility to move my website from hosting providers without having to rely on their domain names.

## Researching HTTPS site hosting offerings

I looked into several options to see what was out there for hosting HTTPS sites. A few of my requirements included:

 - something easy to deploy
 - painless maintenance
 - HTTPS :)
 - custom domain

With the recent advent of [Let's Encrypt](https://letsencrypt.org/) I found there were quite a few more options available. I considered hosting static files on a server from [Dreamhost](https://www.dreamhost.com/). I purchased some domains from Dreamhost years ago and still have an active account. They have seamless integration with Let's Encrypt, but it seemed like the continuous deployment integrations with GitHub were slim to none.

Setting up and maintaining a server just to publish a blog seemed like even more overkill. Even though I found [some great guides from Digital Ocean](https://www.digitalocean.com/community/tags/let-s-encrypt?type=tutorials) on doing this. The Digital Ocean offerings at $5 / month for the small droplets are great, I just didn't want to have to maintain the server or packages on an on-going basis.

## Going with Netlify

I had heard about [Netlify](https://www.netlify.com/) from somewhere and it seemed to meet all of my requirements. It offers free hosting for custom domain sites, with simple integration for continuous deployment.

Literally.. it took 5 minutes while on a plane to setup.

I only had to make a [quick minor change](https://github.com/mejackreed/jack-reed.com/commit/e03db9d20aa19e9500d805e86537075d925e4d90) to my blog's code by adding a `Gemfile` and `Gemfile.lock`, previously assumed dependencies by GitHub Pages.

I then changed my DNS, and voila it was done.

The DNS changes took a bit to switch over, but after they were done I was able to enable HTTPS in the Netlify application.

![Enabling HTTPS]({{ site.baseurl }}/assets/enabling_https.png)

## Did anything break?

Yep, I had just a few things break. First, in one of my blog posts I was including [MathJax](https://www.mathjax.org) JavaScript using HTTP. This was a quick change to using an updated version hosted via HTTPS from Cloudfare. The only other thing that broke was an iFrame I was including from a HTTP url from GitHub pages. This was just another quick change since GitHub Pages using the github.io domain are also served over HTTPS.

All in all i was an easy and painless process.
