---
layout: post
title: The case for serving your IIIF content over HTTPS
tags:
 - iiif
 - https
---

<div class="message">
  TLDR: IIIF content hosted over HTTP is not fully usable by HTTPS hosted webpages.
</div>

<em>
In writing this blog post, I realized that I can't fully understand what all of the barriers are for IIIF adopters in moving to HTTPS. To that end, I would like to know more about this so we can focus the community to provide more useful resources. Would you mind completing this short (4 questions, 3 are multiple choice) survey about your HTTPS adoption?
</em>

[https://goo.gl/forms/6pvcGUG67yFzPTDD3](https://goo.gl/forms/6pvcGUG67yFzPTDD3)


> Interoperability is a characteristic of a product or system, whose interfaces are completely understood, to work with other products or systems, present or future, in either implementation or access, without any restrictions.

<cite>Definition 
of 
Interoperability [^fn-interop-definition]</cite>

[^fn-interop-definition]: [http://interoperability-definition.info/en](http://interoperability-definition.info/en)

For several years there have been pushes from organizations to migrate websites to use <abbr title="Hyper Text Transfer Protocol Secure">HTTPS</abbr>[^fn-eff-https][^fn-cio-https][^fn-chrome-https][^fn-eff-encrypt]. This serves as an informational post for <abbr>IIIF</abbr> content users and providers on why serving <abbr>IIIF</abbr> content over <abbr>HTTPS</abbr> is just as important and how to do it.

There are many reasons why as a <abbr title="International Image Interoperability Framework">IIIF</abbr> content provider you would want to serve your content only using <abbr>HTTPS</abbr>, the best reason first:

<div class="message">
  By serving your content over HTTPS exclusively, your image resources gain interoperability.
</div>

[^fn-eff-https]: [https://www.eff.org/pages/https](https://www.eff.org/pages/https)
[^fn-cio-https]: [https://https.cio.gov](https://https.cio.gov)
[^fn-chrome-https]: [https://security.googleblog.com/2016/09/moving-towards-more-secure-web.html](https://security.googleblog.com/2016/09/moving-towards-more-secure-web.html)
[^fn-eff-encrypt]: [https://www.eff.org/encrypt-the-web](https://www.eff.org/encrypt-the-web)


But don't worry, this is not a problem exclusive to <abbr>IIIF</abbr> but a larger issue with content on the Web and the way browsers handle security. 

# What is HTTPS?

 Hyper Text Transfer Protocol Secure (<abbr title="Hyper Text Transfer Protocol Secure">HTTPS</abbr>) is the secure version of <abbr>HTTP</abbr>, a protocol that is used to transfer information on the World Wide Web. <abbr>HTTPS</abbr> provides a layer of encryption using SSL/TLS. While originally adopted on secure websites (e.g. financial institutions), it is now the preferred[^fn-web-https] way to serve content on the Web.

# Why and how does your content become more interoperable with HTTPS?

<div class="message">
  TLDR: IIIF content hosted over HTTP is not fully usable by HTTPS hosted webpages.
</div>

Your gain in interoperability is not something to do with how the [IIIF specifications](http://iiif.io/technical-details/) are written, but in how web browsers implement security policies. For the purpose of this discussion I will talk primarily about the [IIIF Image API](http://iiif.io/api/image/2.1/) and the [IIIF Presentation API](http://iiif.io/api/presentation/2.1/) but other <abbr>IIIF</abbr> specifications are also implicated.

As websites move to <abbr>HTTPS</abbr> only, content hosted over <abbr>HTTP</abbr> starts to become unusable.

The problem boils down to something called [mixed content](https://developer.mozilla.org/en-US/docs/Web/Security/Mixed_content)[^fn-mixed_content]. Mixed content describes a scenario when a user visits a site hosted over <abbr>HTTPS</abbr> and that page then requests content hosted over <abbr>HTTP</abbr>. Browsers specifically block mixed active content[^fn-mixed_active_content] which causes problems for most browser-based <abbr>IIIF</abbr> clients. Browser security models prohibit displaying secure content (a web page hosted on <abbr>HTTPS</abbr>) with some types of insecure content (<abbr>IIIF</abbr> content hosted over <abbr>HTTP</abbr>).

[^fn-mixed_content]: For more information on mixed content and the browser security model please see: [https://developer.mozilla.org/en-US/docs/Web/Security/Mixed_content](https://developer.mozilla.org/en-US/docs/Web/Security/Mixed_content) and Preventing Mixed Content [https://developers.google.com/web/fundamentals/security/prevent-mixed-content/fixing-mixed-content](https://developers.google.com/web/fundamentals/security/prevent-mixed-content/fixing-mixed-content)


## How do browsers use IIIF?

IIIF clients implemented in browsers usually request <abbr title="JavaScript Object Notation">JSON</abbr> or <abbr title="JavaScript Object Notation for Linked Data">JSON-LD</abbr> as a precursor for requesting images. These <abbr>JSON</abbr> responses give information to the client in how to display images.

![IIIF request/response cycle]({{ site.baseurl }}/assets/iiif_request_response.png)

This request/response cycle becomes problematic when the webpage requesting <abbr>HTTP</abbr> resources is hosted over <abbr>HTTPS</abbr>. Browser content security specifically blocks mixed active content[^fn-mixed_active_content] which includes the <abbr>JSON</abbr> responses needed for <abbr>IIIF</abbr> clients usually requested as an `XMLHttpRequest`. For many browser-based <abbr>IIIF</abbr> clients hosted over <abbr>HTTPS</abbr>, these security restrictions essentially makes <abbr>HTTP</abbr> resources unusable. :(

[^fn-mixed_active_content]:[Mixed active content](https://developer.mozilla.org/en-US/docs/Web/Security/Mixed_content#Mixed_active_content)

## Additional considerations

At the moment, only mixed active content is blocked by the browser's security model. Mixed passive/display content is not blocked, and this includes `<img>` resources. This means that a browser-based <abbr>IIIF</abbr> client that displays content using `<img>` element tags should be ok.

## So what should I do?
Host all of your content over <abbr>HTTPS</abbr>. No exceptions.

# Why else should I host my content over HTTPS?

Not only is it important for interoperability, there are other <em>really</em> good reasons to serve everything over <abbr>HTTPS</abbr> by default[^fn-why-https][^fn-why-always-https][^fn-why-everything][^fn-web-https].

## Trust

By serving content over <abbr>HTTPS</abbr> you can guarantee to your users that they are receiving the content that they requested and nothing else. This provides proof to the user/browser that you are talking to the server that was requested. Internet Service Providers can inject content into pages[^fn-verizon][^fn-comcast], using <abbr>HTTPS</abbr> prevents them from being able to do this. Serving content over <abbr>HTTPS</abbr> using a trusted certificate, can also prevent man-in-the-middle (MITM) attacks[^fn-mitm].

[^fn-verizon]:[https://www.eff.org/deeplinks/2014/11/verizon-x-uidh](https://www.eff.org/deeplinks/2014/11/verizon-x-uidh)
[^fn-comcast]:[https://gizmodo.com/comcast-appears-to-be-injecting-browser-pop-ups-to-upse-1752633484](https://gizmodo.com/comcast-appears-to-be-injecting-browser-pop-ups-to-upse-1752633484)
[^fn-mitm]:[http://ieeexplore.ieee.org/document/4768661/](http://ieeexplore.ieee.org/document/4768661/)


## Privacy

By using <abbr>HTTPS</abbr>, all of the traffic between a user and the server is encrypted. This encryption layer gives your users a level of privacy ensuring that traffic between your server and your users is not broadcast to bad actors. This guarantees that only the server and browser can read the data that is transmitted between them.

## Search engine optimization

Google started using <abbr>HTTPS</abbr> as a "ranking signal" for its search results[^fn-google-ranking] back in 2014. This "signal" seems to rank <abbr>HTTPS</abbr> websites as delivering high-quality content. By serving your content in a secured way you can increase your ranking in search results.

[^fn-google-ranking]:[https://webmasters.googleblog.com/2014/08/https-as-ranking-signal.html](https://webmasters.googleblog.com/2014/08/https-as-ranking-signal.html)


## Browsers will start marking HTTP as insecure

Google Chrome has decided that it will eventually start marking <abbr>HTTP</abbr> webpages as insecure.
![Chrome eventual treatment of all HTTP pages]({{ site.baseurl }}/assets/chrome_http.png)[^fn-chrome-https]

Chrome has already started to remove functionality like Geolocation-API from <abbr>HTTP</abbr> hosted sites[^fn_chrome_geolocation] and more things will be coming.

[^fn_chrome_geolocation]:[https://developers.google.com/web/updates/2016/04/geolocation-on-secure-contexts-only](https://developers.google.com/web/updates/2016/04/geolocation-on-secure-contexts-only)

A great resource from Google on "Mythbusting HTTPS".

[![Mythbusting HTTPS](http://img.youtube.com/vi/e6DUrH56g14/0.jpg)](http://www.youtube.com/watch?v=e6DUrH56g14)

[^fn-why-https]: [https://developers.google.com/web/fundamentals/security/encrypt-in-transit/why-https](https://developers.google.com/web/fundamentals/security/encrypt-in-transit/why-https)
[^fn-why-always-https]: [http://mashable.com/2011/05/31/https-web-security](http://mashable.com/2011/05/31/https-web-security)
[^fn-why-everything]:[https://https.cio.gov/everything/](https://https.cio.gov/everything/)
[^fn-web-https]:[https://www.w3.org/2001/tag/doc/web-https](https://www.w3.org/2001/tag/doc/web-https)


# How do I host my IIIF content using HTTPS?

I hope you are convinced now that all of your <abbr>IIIF</abbr> content should be hosted over <abbr>HTTPS</abbr>. Often times, the largest hurdle here is organizational buy-in. Yet the technical considerations are not trivial at all. Migrating legacy services from <abbr>HTTP</abbr> to <abbr>HTTPS</abbr> can take a bit of time and is really specific to the technical infrastructure. Some good news here is that as more and more websites move to <abbr>HTTPS</abbr> there are more resources than ever to get started. I won't try and cover how to

## Implementing HTTPS, first things first getting a trusted certificate

The first thing you need to implement <abbr>HTTPS</abbr> is a trusted certificate. Traditionally these are purchased through a [trusted certificate provider](https://en.wikipedia.org/wiki/Certificate_authority#Providers) and can vary in cost. Often times large organizations have the ability to purchase these through a central IT department that controls <abbr title="Domain Name Servers">DNS</abbr>.

### Some cheap/free options

I wanted to outline a few cheap/free options for obtaining these certificates. [sslmate](https://sslmate.com) is an options that provides certificates for $15.95 / year for single hosts, and you can obtain a Wildcard SSL for $149.95 / year[^fn_sslmate_pricing].

A new option is now available, that allows you to obtain certificates for free!

> Let’s Encrypt is a free, automated, and open certificate authority (CA), run for the public’s benefit. It is a service provided by the Internet Security Research Group (ISRG).

Many [hosting providers](https://community.letsencrypt.org/t/web-hosting-who-support-lets-encrypt/6920) have integration with the service to make installation easier. If you run your own servers, I would recommend taking a look at [Digital Ocean's technical tutorials](https://www.digitalocean.com/community/tutorials?q=lets+encrypt) on installing Let's Encrypt certificates[^fn_do_lets_encrypt]. There are tutorials for many different popular applications, languages and platforms.

Setting up Let's Encrypt seems like it could be complicated, but the [EFF](https://www.eff.org/) has made it even easier with a new software project [Certbot](https://certbot.eff.org/). Certbot "Automatically enable HTTPS on your website with EFF's Certbot, deploying Let's Encrypt certificates"[^fn-certbot]. This can take out some of the headache of having to renew your certificate.

[^fn_sslmate_pricing]:[https://sslmate.com/pricing](https://sslmate.com/pricing)
[^fn_do_lets_encrypt]:[https://www.digitalocean.com/community/tutorials?q=lets+encrypt](https://www.digitalocean.com/community/tutorials?q=lets+encrypt)
[^fn-certbot]:[https://certbot.eff.org](https://certbot.eff.org)

I chose to host this blog over <abbr>HTTPS</abbr> using [netlify](https://www.netlify.com/) and it was straightforward to setup. You can read about [my experience in this post](/2017/05/06/moving-this-site-to-https.html).

## Moving all services to HTTPS

Because <abbr>IIIF</abbr> relies on potentially many different services you may need to be intentional on when and how you move your services. Because of the mixed active content problem, one likely needs to migrate Image API services first, before moving Presentation API services.

# IIIF community specific problems

In writing this blog post, I realized that I can't imagine what all of the barriers are for IIIF adopters in moving to HTTPS. To that end, I would like to know more about this so we can focus the community to provide more useful resources. Would you mind completing this short (4 questions, 3 are multiple choice) survey about your HTTPS adoption?

[https://goo.gl/forms/6pvcGUG67yFzPTDD3](https://goo.gl/forms/6pvcGUG67yFzPTDD3)

Thanks and I look forward to continuing the conversation!

Special thanks to [Mark Matienzo](https://twitter.com/anarchivist) for reviewing this post for me before I published and [Sheila Rabun](https://connect.clir.org/people/sheila-rabun) for helping with the survey.
