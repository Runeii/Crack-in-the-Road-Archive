;(function(root, factory) {
  if (typeof exports === "object") {
    // CommonJS
    module.exports = factory()
  }
  else if (typeof define === "function" && define.amd) {
    // AMD
    define([], factory)
  }
  else {
    // Global Variables
    root.Pjax = factory()
  }
}(this, function() {
  "use strict";

  function newUid() {
    return (new Date().getTime())
  }

  var Pjax = function(options) {
      this.firstrun = true

      this.options = options
      this.options.elements = this.options.elements || "a[href], form[action]"
      this.options.selectors = this.options.selectors || ["title", ".js-Pjax"]
      this.options.switches = this.options.switches || {}
      this.options.switchesOptions = this.options.switchesOptions || {}
      this.options.history = this.options.history || true
      this.options.analytics = this.options.analytics || function(options) {
        // options.backward or options.foward can be true or undefined
        // by default, we do track back/foward hit
        // https://productforums.google.com/forum/#!topic/analytics/WVwMDjLhXYk
        if (window._gaq) {
          _gaq.push(["_trackPageview"])
        }
        if (window.ga) {
          ga("send", "pageview", {"page": options.url, "title": options.title})
        }
      }
      this.options.scrollTo = this.options.scrollTo || 0
      this.options.debug = this.options.debug || false

      this.maxUid = this.lastUid = newUid()

      // we can’t replace body.outerHTML or head.outerHTML
      // it create a bug where new body or new head are created in the dom
      // if you set head.outerHTML, a new body tag is appended, so the dom get 2 body
      // & it break the switchFallback which replace head & body
      if (!this.options.switches.head) {
        this.options.switches.head = this.switchElementsAlt
      }
      if (!this.options.switches.body) {
        this.options.switches.body = this.switchElementsAlt
      }

      this.log("Pjax options", this.options)

      if (typeof options.analytics !== "function") {
        options.analytics = function() {}
      }

      this.parseDOM(document)

      Pjax.on(window, "popstate", function(st) {
        if (st.state) {
          var opt = Pjax.clone(this.options)
          opt.url = st.state.url
          opt.title = st.state.title
          opt.history = false

          if (st.state.uid < this.lastUid) {
            opt.backward = true
          }
          else {
            opt.forward = true
          }
          this.lastUid = st.state.uid

          // @todo implement history cache here, based on uid
          this.loadUrl(st.state.url, opt)
        }
      }.bind(this))

    }

  // make internal methods public
  Pjax.isSupported = function() {
    // Borrowed wholesale from https://github.com/defunkt/jquery-pjax
    return window.history &&
      window.history.pushState &&
      window.history.replaceState &&
      // pushState isn’t reliable on iOS until 5.
      !navigator.userAgent.match(/((iPod|iPhone|iPad).+\bOS\s+[1-4]|WebApps\/.+CFNetwork)/)
  }

  Pjax.forEachEls = function(els, fn, context) {
    if (els instanceof HTMLCollection || els instanceof NodeList) {
      return Array.prototype.forEach.call(els, fn, context)
    }
    // assume simple dom element
    fn.call(context, els)
  }

  Pjax.on = function(els, events, listener, useCapture) {
    events = (typeof events === "string" ? events.split(" ") : events)

    events.forEach(function(e) {
      Pjax.forEachEls(els, function(el) {
        el.addEventListener(e, listener, useCapture)
      })
    }, this)
  }

  Pjax.off = function(els, events, listener, useCapture) {
    events = (typeof events === "string" ? events.split(" ") : events)

    events.forEach(function(e) {
      Pjax.forEachEls(els, function(el) {
        el.removeEventListener(e, listener, useCapture)
      })
    }, this)
  }

  Pjax.trigger = function(els, events) {
    events = (typeof events === "string" ? events.split(" ") : events)

    events.forEach(function(e) {
      var event
      if (document.createEvent) {
        event = document.createEvent("HTMLEvents")
        event.initEvent(e, true, true)
      }
      else {
        event = document.createEventObject()
        event.eventType = e
      }

      event.eventName = e

      if (document.createEvent) {
        Pjax.forEachEls(els, function(el) {
          el.dispatchEvent(event)
        })
      }
      else {
        Pjax.forEachEls(els, function(el) {
          el.fireEvent("on" + event.eventType, event)
        })
      }
    }, this)
  }

  Pjax.clone = function(obj) {
    if (null === obj || "object" != typeof obj) {
      return obj
    }
    var copy = obj.constructor()
    for (var attr in obj) {
      if (obj.hasOwnProperty(attr)) {
        copy[attr] = obj[attr]
      }
    }
    return copy
  }

  // Finds and executes scripts (used for newly added elements)
  // Needed since innerHTML does not run scripts
  Pjax.executeScripts = function(el) {
    // console.log("going to execute scripts for ", el)
    Pjax.forEachEls(el.querySelectorAll("script"), function(script) {
      if (!script.type || script.type.toLowerCase() === "text/javascript") {
        if (script.parentNode) {
          script.parentNode.removeChild(script)
        }
        Pjax.evalScript(script)
      }
    })
  }

  Pjax.evalScript = function(el) {
    // console.log("going to execute script", el)

    var code = (el.text || el.textContent || el.innerHTML || "")
      , head = document.querySelector("head") || document.documentElement
      , script = document.createElement("script")

    if (code.match("document.write")) {
      if (console && console.log) {
        console.log("Script contains document.write. Can’t be executed correctly. Code skipped ", el)
      }
      return false
    }

    script.type = "text/javascript"
    try {
      script.appendChild(document.createTextNode(code))
    }
    catch (e) {
      // old IEs have funky script nodes
      script.text = code
    }

    // execute
    head.insertBefore(script, head.firstChild)
    head.removeChild(script) // avoid pollution

    return true
  }

  Pjax.prototype = {
    log: function() {
        if (this.options.debug && console) {
          if (typeof console.log === "function") {
            console.log.apply(console, arguments);
          }
          // ie is weird
          else if (console.log) {
            console.log(arguments);
          }
        }
      }

  , getElements: function(el) {
      return el.querySelectorAll(this.options.elements)
    }

  , parseDOM: function(el) {
      Pjax.forEachEls(this.getElements(el), function(el) {
        switch (el.tagName.toLowerCase()) {
        case "a": this.attachLink(el)
          break
        case "form":
          // todo
          this.log("Pjax doesnt support <form> yet. TODO :)")
          break
        default:
          throw "Pjax can only be applied on <a> or <form> submit"
        }
      }, this)
    }

  , attachLink: function(el) {
      Pjax.on(el, "click", function(event) {
        //var el = event.currentTarget

        // Don’t break browser special behavior on links (like page in new window)
        if (event.which > 1 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
          return -1
        }

        // Ignore external links.
        if (el.protocol !== window.location.protocol || el.host !== window.location.host) {
          return -2
        }

        // Ignore anchors on the same page
        if (el.pathname === location.pathname && el.hash.length > 0) {
          return -3
        }

        // Ignore anchors on the same page
        if (el.hash && el.href.replace(el.hash, "") === location.href.replace(location.hash, "")) {
          return -4
        }

        // Ignore empty anchor "foo.html#"
        if (el.href === location.href + "#") {
          return -5
        }

        event.preventDefault()

        // don’t do "nothing" if user try to reload the page
        if (el.href === window.location.href) {
          window.location.reload()
          return -6
        }

        this.loadUrl(el.href, Pjax.clone(this.options))
      }.bind(this))

      Pjax.on(el, "keyup", function(event) {
        this.log("pjax todo")
        // todo handle a link hitted by keyboard (enter/space) when focus is on it
      }.bind(this))
    }

  , forEachSelectors: function(cb, context, DOMcontext) {
      DOMcontext = DOMcontext || document
      this.options.selectors.forEach(function(selector) {
        Pjax.forEachEls(DOMcontext.querySelectorAll(selector), cb, context)
      })
    }

  , switchSelectors: function(selectors, fromEl, toEl, options) {
      selectors.forEach(function(selector) {
        var newEls = fromEl.querySelectorAll(selector)
        var oldEls = toEl.querySelectorAll(selector)
        this.log("Pjax switch", selector, newEls, oldEls)
        if (newEls.length !== oldEls.length) {
          // Pjax.forEachEls(newEls, function(el) {
          //   this.log("newEl", el, el.outerHTML)
          // }, this)
          // Pjax.forEachEls(oldEls, function(el) {
          //   this.log("oldEl", el, el.outerHTML)
          // }, this)
          throw "DOM doesn’t look the same on new loaded page: ’" + selector + "’ - new " + newEls.length + ", old " + oldEls.length
        }

        Pjax.forEachEls(newEls, function(newEl, i) {
          var oldEl = oldEls[i]
          this.log("newEl", newEl, "oldEl", oldEl)
          if (this.options.switches[selector]) {
            this.options.switches[selector].bind(this)(oldEl, newEl, options, this.options.switchesOptions[selector])
          }
          else {
            Pjax.switches.outerHTML.bind(this)(oldEl, newEl, options)
          }
        }, this)
      }, this)
    }

    // too much problem with the code below
    // + it’s too dangerous
  // , switchFallback: function(fromEl, toEl) {
  //     this.switchSelectors(["head", "body"], fromEl, toEl)
  //     // execute script when DOM is like it should be
  //     Pjax.executeScripts(document.querySelector("head"))
  //     Pjax.executeScripts(document.querySelector("body"))
  //   }

  , latestChance: function(href) {
      window.location = href
    }

  , onSwitch: function() {
      Pjax.trigger(window, "resize scroll")
    }

  , loadContent: function(html, options) {
      var tmpEl = document.implementation.createHTMLDocument()

        // parse HTML attributes to copy them
        // since we are forced to use documentElement.innerHTML (outerHTML can't be used for <html>)
        , htmlRegex = /<html[^>]+>/gi
        , htmlAttribsRegex = /\s?[a-z:]+(?:\=(?:\'|\")[^\'\">]+(?:\'|\"))*/gi
        , matches = html.match(htmlRegex)
        if (matches.length) {
          matches = matches[0].match(htmlAttribsRegex)
          if (matches.length) {
            matches.shift()
            matches.forEach(function(htmlAttrib) {
              var attr = htmlAttrib.trim().split("=")
              tmpEl.documentElement.setAttribute(attr[0], attr[1].slice(1, -1))
            })
          }
        }

      tmpEl.documentElement.innerHTML = html
      this.log("load content", tmpEl.documentElement.attributes, tmpEl.documentElement.innerHTML.length)
      // try {
        this.switchSelectors(this.options.selectors, tmpEl, document, options)

        // FF bug: Won’t autofocus fields that are inserted via JS.
        // This behavior is incorrect. So if theres no current focus, autofocus
        // the last field.
        //
        // http://www.w3.org/html/wg/drafts/html/master/forms.html
        var autofocusEl = Array.prototype.slice.call(document.querySelectorAll("[autofocus]")).pop()
        if (autofocusEl && document.activeElement !== autofocusEl) {
          autofocusEl.focus();
        }

        // execute scripts when DOM have been completely updated
        this.options.selectors.forEach(function(selector) {
          Pjax.forEachEls(document.querySelectorAll(selector), function(el) {
            Pjax.executeScripts(el)
          })
        })
      // }
      // catch(e) {
      //   if (this.options.debug) {
      //     this.log("Pjax switch fail: ", e)
      //   }
      //   this.switchFallback(tmpEl, document)
      // }
    }

  , doRequest: function(location, callback) {
      var request = new XMLHttpRequest()

      request.onreadystatechange = function() {
        if (request.readyState === 4 && request.status === 200) {
          callback(request.responseText)
        }
        else if (request.readyState === 4 && (request.status === 404 || request.status === 500)){
          callback(false)
        }
      }

      request.open("GET", location + (!/[?&]/.test(location) ? "?" : "&") + (new Date().getTime()), true)
      request.setRequestHeader("X-Requested-With", "XMLHttpRequest")
      request.send(null)
    }

  , loadUrl: function(href, options) {
      this.log("load href", href, options)

      Pjax.trigger(document, "pjax:send", options);

      // Do the request
      this.doRequest(href, function(html) {

        // Fail if unable to load HTML via AJAX
        if (html === false) {
          Pjax.trigger(document,"pjax:complete pjax:error", options)

          return
        }

        // Clear out any focused controls before inserting new page contents.
        document.activeElement.blur()

        try {
          this.loadContent(html, options)
        }
        catch (e) {
          if (!this.options.debug) {
            if (console && console.error) {
              console.error("Pjax switch fail: ", e)
            }
            this.latestChance(href)
            return
          }
          else {
            throw e
          }
        }

        if (options.history) {

          if (this.firstrun) {
            this.lastUid = this.maxUid = newUid()
            this.firstrun = false
            window.history.replaceState({
                "url": window.location.href
              , "title": document.title
              , "uid": this.maxUid
              }
            , document.title)
          }

          // Update browser history
          this.lastUid = this.maxUid = newUid()
          window.history.pushState({
              "url": href
            , "title": options.title
            , "uid": this.maxUid
            }
          , options.title
          , href)
        }

        this.forEachSelectors(function(el) {
          this.parseDOM(el)
        }, this)

        // Fire Events
        Pjax.trigger(document,"pjax:complete pjax:success", options)

        options.analytics()

        // Scroll page to top on new page load
        if (options.scrollTo !== false) {
          if (options.scrollTo.length > 1) {
            window.scrollTo(options.scrollTo[0], options.scrollTo[1])
          }
          else {
            window.scrollTo(0, options.scrollTo)
          }
        }
      }.bind(this))
    }
  }

  Pjax.switches = {
    outerHTML: function(oldEl, newEl, options) {
      oldEl.outerHTML = newEl.outerHTML
      this.onSwitch()
    }

  , innerHTML: function(oldEl, newEl, options) {
      oldEl.innerHTML = newEl.innerHTML
      oldEl.className = newEl.className
      this.onSwitch()
    }

  , sideBySide: function(oldEl, newEl, options, switchOptions) {
      var elsToRemove = []
        , elsToAdd = []
        , fragToAppend = document.createDocumentFragment()
        // height transition are shitty on safari
        // so commented for now (until I found something ?)
        // , relevantHeight = 0
        , animationEventNames = "animationend webkitAnimationEnd MSAnimationEnd oanimationend"
        , animatedElsNumber = 0
        , sexyAnimationEnd = function(e) {
            if (e.target != e.currentTarget) {
              // end triggered by an animation on a child
              return
            }

            animatedElsNumber--
            if (animatedElsNumber <= 0 && elsToRemove) {
              elsToRemove.forEach(function(el) {
                // browsing quickly can make the el
                // already removed by last page update ?
                if (el.parentNode) {
                  el.parentNode.removeChild(el)
                }
              })

              elsToAdd.forEach(function(el) {
                el.className = el.className.replace(el.getAttribute("data-pjax-classes"), "")
                el.removeAttribute("data-pjax-classes")
                // Pjax.off(el, animationEventNames, sexyAnimationEnd, true)
              })

              elsToAdd = null // free memory
              elsToRemove = null // free memory

              // assume the height is now useless (avoid bug since there is overflow hidden on the parent)
              // oldEl.style.height = "auto"

              // this is to trigger some repaint (example: picturefill)
              this.onSwitch()
              //Pjax.trigger(window, "scroll")
            }
          }.bind(this)

      // Force height to be able to trigger css animation
      // here we get the relevant height
      // oldEl.parentNode.appendChild(newEl)
      // relevantHeight = newEl.getBoundingClientRect().height
      // oldEl.parentNode.removeChild(newEl)
      // oldEl.style.height = oldEl.getBoundingClientRect().height + "px"

      forEach.call(oldEl.childNodes, function(el) {
        elsToRemove.push(el)
        if (el.classList && !el.classList.contains("js-Pjax-remove")) {
          // for fast switch, clean element that just have been added, & not cleaned yet.
          if (el.hasAttribute("data-pjax-classes")) {
            el.className = el.className.replace(el.getAttribute("data-pjax-classes"), "")
            el.removeAttribute("data-pjax-classes")
          }
          el.classList.add("js-Pjax-remove")
          if (switchOptions.callbacks && switchOptions.callbacks.removeElement) {
            switchOptions.callbacks.removeElement(el)
          }
          el.className += " " + switchOptions.classNames.remove + " " + (options.backward ? switchOptions.classNames.backward  : switchOptions.classNames.forward)
          animatedElsNumber++
          Pjax.on(el, animationEventNames, sexyAnimationEnd, true)
        }
      })

      forEach.call(newEl.childNodes, function(el) {
        if (el.classList) {
          var addClasses = " js-Pjax-add " + switchOptions.classNames.add + " " + (options.backward ? switchOptions.classNames.forward : switchOptions.classNames.backward)
          if (switchOptions.callbacks && switchOptions.callbacks.addElement) {
            switchOptions.callbacks.addElement(el)
          }
          el.className += addClasses
          el.setAttribute("data-pjax-classes", addClasses)
          elsToAdd.push(el)
          fragToAppend.appendChild(el)
          animatedElsNumber++
          Pjax.on(el, animationEventNames, sexyAnimationEnd, true)
        }
      })

      // pass all className of the parent
      oldEl.className = newEl.className
      oldEl.appendChild(fragToAppend)

      // oldEl.style.height = relevantHeight + "px"
    }
  }

  if (Pjax.isSupported()) {
    return Pjax
  }
  // if there isn’t required browser functions, returning stupid api
  else {
    var stupidPjax = function() {}
    for (var key in Pjax.prototype) {
      if (Pjax.prototype.hasOwnProperty(key) && typeof Pjax.prototype[key] === "function") {
        stupidPjax[key] = stupidPjax
      }
    }

    return stupidPjax
  }

}));


/**
 * Implement infinite scrolling
 * - Inspired by: http://ravikiranj.net/drupal/201106/code/javascript/how-implement-infinite-scrolling-using-native-javascript-and-yui3
 */
 
(function() {
  var isIE = /msie/gi.test(navigator.userAgent); // http://pipwerks.com/2011/05/18/sniffing-internet-explorer-via-javascript/
  
  this.infiniteScroll = function(options) {
    var defaults = {
      callback: function() {},
      distance: 50
    }
    // Populate defaults
    for (var key in defaults) {
      if(typeof options[key] == 'undefined') options[key] = defaults[key];
    }  
    
    var scroller = {
      options: options,
      updateInitiated: false
    }
    
    window.onscroll = function(event) {
      handleScroll(scroller, event);
    }
    // For touch devices, try to detect scrolling by touching
    document.ontouchmove = function(event) {
      handleScroll(scroller, event);
    }
  }
  
  function getScrollPos() {
    // Handle scroll position in case of IE differently
    if (isIE) {
      return document.documentElement.scrollTop;
    } else {
      return window.pageYOffset;
    }
  }
  
  var prevScrollPos = getScrollPos();
  
  // Respond to scroll events
  function handleScroll(scroller, event) {
    if (scroller.updateInitiated) {
      return;
    }   
    var scrollPos = getScrollPos();
    if (scrollPos == prevScrollPos) {
      return; // nothing to do
    }
    
    // Find the pageHeight and clientHeight(the no. of pixels to scroll to make the scrollbar reach max pos)
    var pageHeight = document.documentElement.scrollHeight;
    var clientHeight = document.documentElement.clientHeight;
    
    // Check if scroll bar position is just 50px above the max, if yes, initiate an update
    if (pageHeight - (scrollPos + clientHeight) < scroller.options.distance) {
      scroller.updateInitiated = true;
  
      scroller.options.callback(function() {
        scroller.updateInitiated = false;
      });
    }
    
    prevScrollPos = scrollPos;  
  }
}());

/** @license
 *
 * SoundManager 2: JavaScript Sound for the Web
 * ----------------------------------------------
 * http://schillmania.com/projects/soundmanager2/
 *
 * Copyright (c) 2007, Scott Schiller. All rights reserved.
 * Code provided under the BSD License:
 * http://schillmania.com/projects/soundmanager2/license.txt
 *
 * V2.97a.20131201
 */
(function(g,k){function U(U,ka){function V(b){return c.preferFlash&&v&&!c.ignoreFlash&&c.flash[b]!==k&&c.flash[b]}function q(b){return function(c){var d=this._s;return!d||!d._a?null:b.call(this,c)}}this.setupOptions={url:U||null,flashVersion:8,debugMode:!0,debugFlash:!1,useConsole:!0,consoleOnly:!0,waitForWindowLoad:!1,bgColor:"#ffffff",useHighPerformance:!1,flashPollingInterval:null,html5PollingInterval:null,flashLoadTimeout:1E3,wmode:null,allowScriptAccess:"always",useFlashBlock:!1,useHTML5Audio:!0,
html5Test:/^(probably|maybe)$/i,preferFlash:!1,noSWFCache:!1,idPrefix:"sound"};this.defaultOptions={autoLoad:!1,autoPlay:!1,from:null,loops:1,onid3:null,onload:null,whileloading:null,onplay:null,onpause:null,onresume:null,whileplaying:null,onposition:null,onstop:null,onfailure:null,onfinish:null,multiShot:!0,multiShotEvents:!1,position:null,pan:0,stream:!0,to:null,type:null,usePolicyFile:!1,volume:100};this.flash9Options={isMovieStar:null,usePeakData:!1,useWaveformData:!1,useEQData:!1,onbufferchange:null,
ondataerror:null};this.movieStarOptions={bufferTime:3,serverURL:null,onconnect:null,duration:null};this.audioFormats={mp3:{type:['audio/mpeg; codecs\x3d"mp3"',"audio/mpeg","audio/mp3","audio/MPA","audio/mpa-robust"],required:!0},mp4:{related:["aac","m4a","m4b"],type:['audio/mp4; codecs\x3d"mp4a.40.2"',"audio/aac","audio/x-m4a","audio/MP4A-LATM","audio/mpeg4-generic"],required:!1},ogg:{type:["audio/ogg; codecs\x3dvorbis"],required:!1},opus:{type:["audio/ogg; codecs\x3dopus","audio/opus"],required:!1},
wav:{type:['audio/wav; codecs\x3d"1"',"audio/wav","audio/wave","audio/x-wav"],required:!1}};this.movieID="sm2-container";this.id=ka||"sm2movie";this.debugID="soundmanager-debug";this.debugURLParam=/([#?&])debug=1/i;this.versionNumber="V2.97a.20131201";this.altURL=this.movieURL=this.version=null;this.enabled=this.swfLoaded=!1;this.oMC=null;this.sounds={};this.soundIDs=[];this.didFlashBlock=this.muted=!1;this.filePattern=null;this.filePatterns={flash8:/\.mp3(\?.*)?$/i,flash9:/\.mp3(\?.*)?$/i};this.features=
{buffering:!1,peakData:!1,waveformData:!1,eqData:!1,movieStar:!1};this.sandbox={};this.html5={usingFlash:null};this.flash={};this.ignoreFlash=this.html5Only=!1;var Ja,c=this,Ka=null,l=null,W,s=navigator.userAgent,La=g.location.href.toString(),n=document,la,Ma,ma,m,x=[],K=!1,L=!1,p=!1,y=!1,na=!1,M,w,oa,X,pa,D,E,F,Na,qa,ra,Y,sa,Z,ta,G,ua,N,va,$,H,Oa,wa,Pa,xa,Qa,O=null,ya=null,P,za,I,aa,ba,r,Q=!1,Aa=!1,Ra,Sa,Ta,ca=0,R=null,da,Ua=[],S,u=null,Va,ea,T,z,fa,Ba,Wa,t,fb=Array.prototype.slice,A=!1,Ca,v,Da,
Xa,B,ga,Ya=0,ha=s.match(/(ipad|iphone|ipod)/i),Za=s.match(/android/i),C=s.match(/msie/i),gb=s.match(/webkit/i),ia=s.match(/safari/i)&&!s.match(/chrome/i),Ea=s.match(/opera/i),Fa=s.match(/(mobile|pre\/|xoom)/i)||ha||Za,$a=!La.match(/usehtml5audio/i)&&!La.match(/sm2\-ignorebadua/i)&&ia&&!s.match(/silk/i)&&s.match(/OS X 10_6_([3-7])/i),Ga=n.hasFocus!==k?n.hasFocus():null,ja=ia&&(n.hasFocus===k||!n.hasFocus()),ab=!ja,bb=/(mp3|mp4|mpa|m4a|m4b)/i,Ha=n.location?n.location.protocol.match(/http/i):null,cb=
!Ha?"http://":"",db=/^\s*audio\/(?:x-)?(?:mpeg4|aac|flv|mov|mp4||m4v|m4a|m4b|mp4v|3gp|3g2)\s*(?:$|;)/i,eb="mpeg4 aac flv mov mp4 m4v f4v m4a m4b mp4v 3gp 3g2".split(" "),hb=RegExp("\\.("+eb.join("|")+")(\\?.*)?$","i");this.mimePattern=/^\s*audio\/(?:x-)?(?:mp(?:eg|3))\s*(?:$|;)/i;this.useAltURL=!Ha;var Ia;try{Ia=Audio!==k&&(Ea&&opera!==k&&10>opera.version()?new Audio(null):new Audio).canPlayType!==k}catch(ib){Ia=!1}this.hasHTML5=Ia;this.setup=function(b){var e=!c.url;b!==k&&p&&u&&c.ok();oa(b);b&&
(e&&(N&&b.url!==k)&&c.beginDelayedInit(),!N&&(b.url!==k&&"complete"===n.readyState)&&setTimeout(G,1));return c};this.supported=this.ok=function(){return u?p&&!y:c.useHTML5Audio&&c.hasHTML5};this.getMovie=function(b){return W(b)||n[b]||g[b]};this.createSound=function(b,e){function d(){a=aa(a);c.sounds[a.id]=new Ja(a);c.soundIDs.push(a.id);return c.sounds[a.id]}var a,f=null;if(!p||!c.ok())return!1;e!==k&&(b={id:b,url:e});a=w(b);a.url=da(a.url);void 0===a.id&&(a.id=c.setupOptions.idPrefix+Ya++);if(r(a.id,
!0))return c.sounds[a.id];if(ea(a))f=d(),f._setup_html5(a);else{if(c.html5Only||c.html5.usingFlash&&a.url&&a.url.match(/data\:/i))return d();8<m&&null===a.isMovieStar&&(a.isMovieStar=!(!a.serverURL&&!(a.type&&a.type.match(db)||a.url&&a.url.match(hb))));a=ba(a,void 0);f=d();8===m?l._createSound(a.id,a.loops||1,a.usePolicyFile):(l._createSound(a.id,a.url,a.usePeakData,a.useWaveformData,a.useEQData,a.isMovieStar,a.isMovieStar?a.bufferTime:!1,a.loops||1,a.serverURL,a.duration||null,a.autoPlay,!0,a.autoLoad,
a.usePolicyFile),a.serverURL||(f.connected=!0,a.onconnect&&a.onconnect.apply(f)));!a.serverURL&&(a.autoLoad||a.autoPlay)&&f.load(a)}!a.serverURL&&a.autoPlay&&f.play();return f};this.destroySound=function(b,e){if(!r(b))return!1;var d=c.sounds[b],a;d._iO={};d.stop();d.unload();for(a=0;a<c.soundIDs.length;a++)if(c.soundIDs[a]===b){c.soundIDs.splice(a,1);break}e||d.destruct(!0);delete c.sounds[b];return!0};this.load=function(b,e){return!r(b)?!1:c.sounds[b].load(e)};this.unload=function(b){return!r(b)?
!1:c.sounds[b].unload()};this.onposition=this.onPosition=function(b,e,d,a){return!r(b)?!1:c.sounds[b].onposition(e,d,a)};this.clearOnPosition=function(b,e,d){return!r(b)?!1:c.sounds[b].clearOnPosition(e,d)};this.start=this.play=function(b,e){var d=null,a=e&&!(e instanceof Object);if(!p||!c.ok())return!1;if(r(b,a))a&&(e={url:e});else{if(!a)return!1;a&&(e={url:e});e&&e.url&&(e.id=b,d=c.createSound(e).play())}null===d&&(d=c.sounds[b].play(e));return d};this.setPosition=function(b,e){return!r(b)?!1:c.sounds[b].setPosition(e)};
this.stop=function(b){return!r(b)?!1:c.sounds[b].stop()};this.stopAll=function(){for(var b in c.sounds)c.sounds.hasOwnProperty(b)&&c.sounds[b].stop()};this.pause=function(b){return!r(b)?!1:c.sounds[b].pause()};this.pauseAll=function(){var b;for(b=c.soundIDs.length-1;0<=b;b--)c.sounds[c.soundIDs[b]].pause()};this.resume=function(b){return!r(b)?!1:c.sounds[b].resume()};this.resumeAll=function(){var b;for(b=c.soundIDs.length-1;0<=b;b--)c.sounds[c.soundIDs[b]].resume()};this.togglePause=function(b){return!r(b)?
!1:c.sounds[b].togglePause()};this.setPan=function(b,e){return!r(b)?!1:c.sounds[b].setPan(e)};this.setVolume=function(b,e){return!r(b)?!1:c.sounds[b].setVolume(e)};this.mute=function(b){var e=0;b instanceof String&&(b=null);if(b)return!r(b)?!1:c.sounds[b].mute();for(e=c.soundIDs.length-1;0<=e;e--)c.sounds[c.soundIDs[e]].mute();return c.muted=!0};this.muteAll=function(){c.mute()};this.unmute=function(b){b instanceof String&&(b=null);if(b)return!r(b)?!1:c.sounds[b].unmute();for(b=c.soundIDs.length-
1;0<=b;b--)c.sounds[c.soundIDs[b]].unmute();c.muted=!1;return!0};this.unmuteAll=function(){c.unmute()};this.toggleMute=function(b){return!r(b)?!1:c.sounds[b].toggleMute()};this.getMemoryUse=function(){var b=0;l&&8!==m&&(b=parseInt(l._getMemoryUse(),10));return b};this.disable=function(b){var e;b===k&&(b=!1);if(y)return!1;y=!0;for(e=c.soundIDs.length-1;0<=e;e--)Pa(c.sounds[c.soundIDs[e]]);M(b);t.remove(g,"load",E);return!0};this.canPlayMIME=function(b){var e;c.hasHTML5&&(e=T({type:b}));!e&&u&&(e=b&&
c.ok()?!!(8<m&&b.match(db)||b.match(c.mimePattern)):null);return e};this.canPlayURL=function(b){var e;c.hasHTML5&&(e=T({url:b}));!e&&u&&(e=b&&c.ok()?!!b.match(c.filePattern):null);return e};this.canPlayLink=function(b){return b.type!==k&&b.type&&c.canPlayMIME(b.type)?!0:c.canPlayURL(b.href)};this.getSoundById=function(b,e){return!b?null:c.sounds[b]};this.onready=function(b,c){if("function"===typeof b)c||(c=g),pa("onready",b,c),D();else throw P("needFunction","onready");return!0};this.ontimeout=function(b,
c){if("function"===typeof b)c||(c=g),pa("ontimeout",b,c),D({type:"ontimeout"});else throw P("needFunction","ontimeout");return!0};this._wD=this._writeDebug=function(b,c){return!0};this._debug=function(){};this.reboot=function(b,e){var d,a,f;for(d=c.soundIDs.length-1;0<=d;d--)c.sounds[c.soundIDs[d]].destruct();if(l)try{C&&(ya=l.innerHTML),O=l.parentNode.removeChild(l)}catch(k){}ya=O=u=l=null;c.enabled=N=p=Q=Aa=K=L=y=A=c.swfLoaded=!1;c.soundIDs=[];c.sounds={};Ya=0;if(b)x=[];else for(d in x)if(x.hasOwnProperty(d)){a=
0;for(f=x[d].length;a<f;a++)x[d][a].fired=!1}c.html5={usingFlash:null};c.flash={};c.html5Only=!1;c.ignoreFlash=!1;g.setTimeout(function(){ta();e||c.beginDelayedInit()},20);return c};this.reset=function(){return c.reboot(!0,!0)};this.getMoviePercent=function(){return l&&"PercentLoaded"in l?l.PercentLoaded():null};this.beginDelayedInit=function(){na=!0;G();setTimeout(function(){if(Aa)return!1;$();Z();return Aa=!0},20);F()};this.destruct=function(){c.disable(!0)};Ja=function(b){var e,d,a=this,f,h,J,
g,n,q,s=!1,p=[],u=0,x,y,v=null,z;d=e=null;this.sID=this.id=b.id;this.url=b.url;this._iO=this.instanceOptions=this.options=w(b);this.pan=this.options.pan;this.volume=this.options.volume;this.isHTML5=!1;this._a=null;z=this.url?!1:!0;this.id3={};this._debug=function(){};this.load=function(b){var e=null,d;b!==k?a._iO=w(b,a.options):(b=a.options,a._iO=b,v&&v!==a.url&&(a._iO.url=a.url,a.url=null));a._iO.url||(a._iO.url=a.url);a._iO.url=da(a._iO.url);d=a.instanceOptions=a._iO;if(!d.url&&!a.url)return a;
if(d.url===a.url&&0!==a.readyState&&2!==a.readyState)return 3===a.readyState&&d.onload&&ga(a,function(){d.onload.apply(a,[!!a.duration])}),a;a.loaded=!1;a.readyState=1;a.playState=0;a.id3={};if(ea(d))e=a._setup_html5(d),e._called_load||(a._html5_canplay=!1,a.url!==d.url&&(a._a.src=d.url,a.setPosition(0)),a._a.autobuffer="auto",a._a.preload="auto",a._a._called_load=!0);else{if(c.html5Only||a._iO.url&&a._iO.url.match(/data\:/i))return a;try{a.isHTML5=!1,a._iO=ba(aa(d)),d=a._iO,8===m?l._load(a.id,d.url,
d.stream,d.autoPlay,d.usePolicyFile):l._load(a.id,d.url,!!d.stream,!!d.autoPlay,d.loops||1,!!d.autoLoad,d.usePolicyFile)}catch(f){H({type:"SMSOUND_LOAD_JS_EXCEPTION",fatal:!0})}}a.url=d.url;return a};this.unload=function(){0!==a.readyState&&(a.isHTML5?(g(),a._a&&(a._a.pause(),v=fa(a._a))):8===m?l._unload(a.id,"about:blank"):l._unload(a.id),f());return a};this.destruct=function(b){a.isHTML5?(g(),a._a&&(a._a.pause(),fa(a._a),A||J(),a._a._s=null,a._a=null)):(a._iO.onfailure=null,l._destroySound(a.id));
b||c.destroySound(a.id,!0)};this.start=this.play=function(b,e){var d,f,h,g,J;f=!0;f=null;e=e===k?!0:e;b||(b={});a.url&&(a._iO.url=a.url);a._iO=w(a._iO,a.options);a._iO=w(b,a._iO);a._iO.url=da(a._iO.url);a.instanceOptions=a._iO;if(!a.isHTML5&&a._iO.serverURL&&!a.connected)return a.getAutoPlay()||a.setAutoPlay(!0),a;ea(a._iO)&&(a._setup_html5(a._iO),n());1===a.playState&&!a.paused&&(d=a._iO.multiShot,d||(a.isHTML5&&a.setPosition(a._iO.position),f=a));if(null!==f)return f;b.url&&b.url!==a.url&&(!a.readyState&&
!a.isHTML5&&8===m&&z?z=!1:a.load(a._iO));a.loaded||(0===a.readyState?(!a.isHTML5&&!c.html5Only?(a._iO.autoPlay=!0,a.load(a._iO)):a.isHTML5?a.load(a._iO):f=a,a.instanceOptions=a._iO):2===a.readyState&&(f=a));if(null!==f)return f;!a.isHTML5&&(9===m&&0<a.position&&a.position===a.duration)&&(b.position=0);if(a.paused&&0<=a.position&&(!a._iO.serverURL||0<a.position))a.resume();else{a._iO=w(b,a._iO);if(null!==a._iO.from&&null!==a._iO.to&&0===a.instanceCount&&0===a.playState&&!a._iO.serverURL){d=function(){a._iO=
w(b,a._iO);a.play(a._iO)};if(a.isHTML5&&!a._html5_canplay)a.load({_oncanplay:d}),f=!1;else if(!a.isHTML5&&!a.loaded&&(!a.readyState||2!==a.readyState))a.load({onload:d}),f=!1;if(null!==f)return f;a._iO=y()}(!a.instanceCount||a._iO.multiShotEvents||a.isHTML5&&a._iO.multiShot&&!A||!a.isHTML5&&8<m&&!a.getAutoPlay())&&a.instanceCount++;a._iO.onposition&&0===a.playState&&q(a);a.playState=1;a.paused=!1;a.position=a._iO.position!==k&&!isNaN(a._iO.position)?a._iO.position:0;a.isHTML5||(a._iO=ba(aa(a._iO)));
a._iO.onplay&&e&&(a._iO.onplay.apply(a),s=!0);a.setVolume(a._iO.volume,!0);a.setPan(a._iO.pan,!0);a.isHTML5?2>a.instanceCount?(n(),f=a._setup_html5(),a.setPosition(a._iO.position),f.play()):(h=new Audio(a._iO.url),g=function(){t.remove(h,"ended",g);a._onfinish(a);fa(h);h=null},J=function(){t.remove(h,"canplay",J);try{h.currentTime=a._iO.position/1E3}catch(b){}h.play()},t.add(h,"ended",g),void 0!==a._iO.volume&&(h.volume=Math.max(0,Math.min(1,a._iO.volume/100))),a.muted&&(h.muted=!0),a._iO.position?
t.add(h,"canplay",J):h.play()):(f=l._start(a.id,a._iO.loops||1,9===m?a.position:a.position/1E3,a._iO.multiShot||!1),9===m&&!f&&a._iO.onplayerror&&a._iO.onplayerror.apply(a))}return a};this.stop=function(b){var c=a._iO;1===a.playState&&(a._onbufferchange(0),a._resetOnPosition(0),a.paused=!1,a.isHTML5||(a.playState=0),x(),c.to&&a.clearOnPosition(c.to),a.isHTML5?a._a&&(b=a.position,a.setPosition(0),a.position=b,a._a.pause(),a.playState=0,a._onTimer(),g()):(l._stop(a.id,b),c.serverURL&&a.unload()),a.instanceCount=
0,a._iO={},c.onstop&&c.onstop.apply(a));return a};this.setAutoPlay=function(b){a._iO.autoPlay=b;a.isHTML5||(l._setAutoPlay(a.id,b),b&&!a.instanceCount&&1===a.readyState&&a.instanceCount++)};this.getAutoPlay=function(){return a._iO.autoPlay};this.setPosition=function(b){b===k&&(b=0);var c=a.isHTML5?Math.max(b,0):Math.min(a.duration||a._iO.duration,Math.max(b,0));a.position=c;b=a.position/1E3;a._resetOnPosition(a.position);a._iO.position=c;if(a.isHTML5){if(a._a){if(a._html5_canplay){if(a._a.currentTime!==
b)try{a._a.currentTime=b,(0===a.playState||a.paused)&&a._a.pause()}catch(e){}}else if(b)return a;a.paused&&a._onTimer(!0)}}else b=9===m?a.position:b,a.readyState&&2!==a.readyState&&l._setPosition(a.id,b,a.paused||!a.playState,a._iO.multiShot);return a};this.pause=function(b){if(a.paused||0===a.playState&&1!==a.readyState)return a;a.paused=!0;a.isHTML5?(a._setup_html5().pause(),g()):(b||b===k)&&l._pause(a.id,a._iO.multiShot);a._iO.onpause&&a._iO.onpause.apply(a);return a};this.resume=function(){var b=
a._iO;if(!a.paused)return a;a.paused=!1;a.playState=1;a.isHTML5?(a._setup_html5().play(),n()):(b.isMovieStar&&!b.serverURL&&a.setPosition(a.position),l._pause(a.id,b.multiShot));!s&&b.onplay?(b.onplay.apply(a),s=!0):b.onresume&&b.onresume.apply(a);return a};this.togglePause=function(){if(0===a.playState)return a.play({position:9===m&&!a.isHTML5?a.position:a.position/1E3}),a;a.paused?a.resume():a.pause();return a};this.setPan=function(b,c){b===k&&(b=0);c===k&&(c=!1);a.isHTML5||l._setPan(a.id,b);a._iO.pan=
b;c||(a.pan=b,a.options.pan=b);return a};this.setVolume=function(b,e){b===k&&(b=100);e===k&&(e=!1);a.isHTML5?a._a&&(c.muted&&!a.muted&&(a.muted=!0,a._a.muted=!0),a._a.volume=Math.max(0,Math.min(1,b/100))):l._setVolume(a.id,c.muted&&!a.muted||a.muted?0:b);a._iO.volume=b;e||(a.volume=b,a.options.volume=b);return a};this.mute=function(){a.muted=!0;a.isHTML5?a._a&&(a._a.muted=!0):l._setVolume(a.id,0);return a};this.unmute=function(){a.muted=!1;var b=a._iO.volume!==k;a.isHTML5?a._a&&(a._a.muted=!1):l._setVolume(a.id,
b?a._iO.volume:a.options.volume);return a};this.toggleMute=function(){return a.muted?a.unmute():a.mute()};this.onposition=this.onPosition=function(b,c,e){p.push({position:parseInt(b,10),method:c,scope:e!==k?e:a,fired:!1});return a};this.clearOnPosition=function(a,b){var c;a=parseInt(a,10);if(isNaN(a))return!1;for(c=0;c<p.length;c++)if(a===p[c].position&&(!b||b===p[c].method))p[c].fired&&u--,p.splice(c,1)};this._processOnPosition=function(){var b,c;b=p.length;if(!b||!a.playState||u>=b)return!1;for(b-=
1;0<=b;b--)c=p[b],!c.fired&&a.position>=c.position&&(c.fired=!0,u++,c.method.apply(c.scope,[c.position]));return!0};this._resetOnPosition=function(a){var b,c;b=p.length;if(!b)return!1;for(b-=1;0<=b;b--)c=p[b],c.fired&&a<=c.position&&(c.fired=!1,u--);return!0};y=function(){var b=a._iO,c=b.from,e=b.to,d,f;f=function(){a.clearOnPosition(e,f);a.stop()};d=function(){if(null!==e&&!isNaN(e))a.onPosition(e,f)};null!==c&&!isNaN(c)&&(b.position=c,b.multiShot=!1,d());return b};q=function(){var b,c=a._iO.onposition;
if(c)for(b in c)if(c.hasOwnProperty(b))a.onPosition(parseInt(b,10),c[b])};x=function(){var b,c=a._iO.onposition;if(c)for(b in c)c.hasOwnProperty(b)&&a.clearOnPosition(parseInt(b,10))};n=function(){a.isHTML5&&Ra(a)};g=function(){a.isHTML5&&Sa(a)};f=function(b){b||(p=[],u=0);s=!1;a._hasTimer=null;a._a=null;a._html5_canplay=!1;a.bytesLoaded=null;a.bytesTotal=null;a.duration=a._iO&&a._iO.duration?a._iO.duration:null;a.durationEstimate=null;a.buffered=[];a.eqData=[];a.eqData.left=[];a.eqData.right=[];
a.failures=0;a.isBuffering=!1;a.instanceOptions={};a.instanceCount=0;a.loaded=!1;a.metadata={};a.readyState=0;a.muted=!1;a.paused=!1;a.peakData={left:0,right:0};a.waveformData={left:[],right:[]};a.playState=0;a.position=null;a.id3={}};f();this._onTimer=function(b){var c,f=!1,h={};if(a._hasTimer||b){if(a._a&&(b||(0<a.playState||1===a.readyState)&&!a.paused))c=a._get_html5_duration(),c!==e&&(e=c,a.duration=c,f=!0),a.durationEstimate=a.duration,c=1E3*a._a.currentTime||0,c!==d&&(d=c,f=!0),(f||b)&&a._whileplaying(c,
h,h,h,h);return f}};this._get_html5_duration=function(){var b=a._iO;return(b=a._a&&a._a.duration?1E3*a._a.duration:b&&b.duration?b.duration:null)&&!isNaN(b)&&Infinity!==b?b:null};this._apply_loop=function(a,b){a.loop=1<b?"loop":""};this._setup_html5=function(b){b=w(a._iO,b);var c=A?Ka:a._a,e=decodeURI(b.url),d;A?e===decodeURI(Ca)&&(d=!0):e===decodeURI(v)&&(d=!0);if(c){if(c._s)if(A)c._s&&(c._s.playState&&!d)&&c._s.stop();else if(!A&&e===decodeURI(v))return a._apply_loop(c,b.loops),c;d||(v&&f(!1),c.src=
b.url,Ca=v=a.url=b.url,c._called_load=!1)}else b.autoLoad||b.autoPlay?(a._a=new Audio(b.url),a._a.load()):a._a=Ea&&10>opera.version()?new Audio(null):new Audio,c=a._a,c._called_load=!1,A&&(Ka=c);a.isHTML5=!0;a._a=c;c._s=a;h();a._apply_loop(c,b.loops);b.autoLoad||b.autoPlay?a.load():(c.autobuffer=!1,c.preload="auto");return c};h=function(){if(a._a._added_events)return!1;var b;a._a._added_events=!0;for(b in B)B.hasOwnProperty(b)&&a._a&&a._a.addEventListener(b,B[b],!1);return!0};J=function(){var b;a._a._added_events=
!1;for(b in B)B.hasOwnProperty(b)&&a._a&&a._a.removeEventListener(b,B[b],!1)};this._onload=function(b){var c=!!b||!a.isHTML5&&8===m&&a.duration;a.loaded=c;a.readyState=c?3:2;a._onbufferchange(0);a._iO.onload&&ga(a,function(){a._iO.onload.apply(a,[c])});return!0};this._onbufferchange=function(b){if(0===a.playState||b&&a.isBuffering||!b&&!a.isBuffering)return!1;a.isBuffering=1===b;a._iO.onbufferchange&&a._iO.onbufferchange.apply(a);return!0};this._onsuspend=function(){a._iO.onsuspend&&a._iO.onsuspend.apply(a);
return!0};this._onfailure=function(b,c,e){a.failures++;if(a._iO.onfailure&&1===a.failures)a._iO.onfailure(a,b,c,e)};this._onfinish=function(){var b=a._iO.onfinish;a._onbufferchange(0);a._resetOnPosition(0);a.instanceCount&&(a.instanceCount--,a.instanceCount||(x(),a.playState=0,a.paused=!1,a.instanceCount=0,a.instanceOptions={},a._iO={},g(),a.isHTML5&&(a.position=0)),(!a.instanceCount||a._iO.multiShotEvents)&&b&&ga(a,function(){b.apply(a)}))};this._whileloading=function(b,c,e,d){var f=a._iO;a.bytesLoaded=
b;a.bytesTotal=c;a.duration=Math.floor(e);a.bufferLength=d;a.durationEstimate=!a.isHTML5&&!f.isMovieStar?f.duration?a.duration>f.duration?a.duration:f.duration:parseInt(a.bytesTotal/a.bytesLoaded*a.duration,10):a.duration;a.isHTML5||(a.buffered=[{start:0,end:a.duration}]);(3!==a.readyState||a.isHTML5)&&f.whileloading&&f.whileloading.apply(a)};this._whileplaying=function(b,c,e,d,f){var h=a._iO;if(isNaN(b)||null===b)return!1;a.position=Math.max(0,b);a._processOnPosition();!a.isHTML5&&8<m&&(h.usePeakData&&
(c!==k&&c)&&(a.peakData={left:c.leftPeak,right:c.rightPeak}),h.useWaveformData&&(e!==k&&e)&&(a.waveformData={left:e.split(","),right:d.split(",")}),h.useEQData&&(f!==k&&f&&f.leftEQ)&&(b=f.leftEQ.split(","),a.eqData=b,a.eqData.left=b,f.rightEQ!==k&&f.rightEQ&&(a.eqData.right=f.rightEQ.split(","))));1===a.playState&&(!a.isHTML5&&(8===m&&!a.position&&a.isBuffering)&&a._onbufferchange(0),h.whileplaying&&h.whileplaying.apply(a));return!0};this._oncaptiondata=function(b){a.captiondata=b;a._iO.oncaptiondata&&
a._iO.oncaptiondata.apply(a,[b])};this._onmetadata=function(b,c){var e={},d,f;d=0;for(f=b.length;d<f;d++)e[b[d]]=c[d];a.metadata=e;a._iO.onmetadata&&a._iO.onmetadata.apply(a)};this._onid3=function(b,c){var e=[],d,f;d=0;for(f=b.length;d<f;d++)e[b[d]]=c[d];a.id3=w(a.id3,e);a._iO.onid3&&a._iO.onid3.apply(a)};this._onconnect=function(b){b=1===b;if(a.connected=b)a.failures=0,r(a.id)&&(a.getAutoPlay()?a.play(k,a.getAutoPlay()):a._iO.autoLoad&&a.load()),a._iO.onconnect&&a._iO.onconnect.apply(a,[b])};this._ondataerror=
function(b){0<a.playState&&a._iO.ondataerror&&a._iO.ondataerror.apply(a)}};va=function(){return n.body||n.getElementsByTagName("div")[0]};W=function(b){return n.getElementById(b)};w=function(b,e){var d=b||{},a,f;a=e===k?c.defaultOptions:e;for(f in a)a.hasOwnProperty(f)&&d[f]===k&&(d[f]="object"!==typeof a[f]||null===a[f]?a[f]:w(d[f],a[f]));return d};ga=function(b,c){!b.isHTML5&&8===m?g.setTimeout(c,0):c()};X={onready:1,ontimeout:1,defaultOptions:1,flash9Options:1,movieStarOptions:1};oa=function(b,
e){var d,a=!0,f=e!==k,h=c.setupOptions;for(d in b)if(b.hasOwnProperty(d))if("object"!==typeof b[d]||null===b[d]||b[d]instanceof Array||b[d]instanceof RegExp)f&&X[e]!==k?c[e][d]=b[d]:h[d]!==k?(c.setupOptions[d]=b[d],c[d]=b[d]):X[d]===k?a=!1:c[d]instanceof Function?c[d].apply(c,b[d]instanceof Array?b[d]:[b[d]]):c[d]=b[d];else if(X[d]===k)a=!1;else return oa(b[d],d);return a};t=function(){function b(a){a=fb.call(a);var b=a.length;d?(a[1]="on"+a[1],3<b&&a.pop()):3===b&&a.push(!1);return a}function c(b,
e){var k=b.shift(),g=[a[e]];if(d)k[g](b[0],b[1]);else k[g].apply(k,b)}var d=g.attachEvent,a={add:d?"attachEvent":"addEventListener",remove:d?"detachEvent":"removeEventListener"};return{add:function(){c(b(arguments),"add")},remove:function(){c(b(arguments),"remove")}}}();B={abort:q(function(){}),canplay:q(function(){var b=this._s,c;if(b._html5_canplay)return!0;b._html5_canplay=!0;b._onbufferchange(0);c=b._iO.position!==k&&!isNaN(b._iO.position)?b._iO.position/1E3:null;if(b.position&&this.currentTime!==
c)try{this.currentTime=c}catch(d){}b._iO._oncanplay&&b._iO._oncanplay()}),canplaythrough:q(function(){var b=this._s;b.loaded||(b._onbufferchange(0),b._whileloading(b.bytesLoaded,b.bytesTotal,b._get_html5_duration()),b._onload(!0))}),ended:q(function(){this._s._onfinish()}),error:q(function(){this._s._onload(!1)}),loadeddata:q(function(){var b=this._s;!b._loaded&&!ia&&(b.duration=b._get_html5_duration())}),loadedmetadata:q(function(){}),loadstart:q(function(){this._s._onbufferchange(1)}),play:q(function(){this._s._onbufferchange(0)}),
playing:q(function(){this._s._onbufferchange(0)}),progress:q(function(b){var c=this._s,d,a,f=0,f=b.target.buffered;d=b.loaded||0;var h=b.total||1;c.buffered=[];if(f&&f.length){d=0;for(a=f.length;d<a;d++)c.buffered.push({start:1E3*f.start(d),end:1E3*f.end(d)});f=1E3*(f.end(0)-f.start(0));d=Math.min(1,f/(1E3*b.target.duration))}isNaN(d)||(c._onbufferchange(0),c._whileloading(d,h,c._get_html5_duration()),d&&(h&&d===h)&&B.canplaythrough.call(this,b))}),ratechange:q(function(){}),suspend:q(function(b){var c=
this._s;B.progress.call(this,b);c._onsuspend()}),stalled:q(function(){}),timeupdate:q(function(){this._s._onTimer()}),waiting:q(function(){this._s._onbufferchange(1)})};ea=function(b){return!b||!b.type&&!b.url&&!b.serverURL?!1:b.serverURL||b.type&&V(b.type)?!1:b.type?T({type:b.type}):T({url:b.url})||c.html5Only||b.url.match(/data\:/i)};fa=function(b){var e;b&&(e=ia?"about:blank":c.html5.canPlayType("audio/wav")?"data:audio/wave;base64,/UklGRiYAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQIAAAD//w\x3d\x3d":
"about:blank",b.src=e,void 0!==b._called_unload&&(b._called_load=!1));A&&(Ca=null);return e};T=function(b){if(!c.useHTML5Audio||!c.hasHTML5)return!1;var e=b.url||null;b=b.type||null;var d=c.audioFormats,a;if(b&&c.html5[b]!==k)return c.html5[b]&&!V(b);if(!z){z=[];for(a in d)d.hasOwnProperty(a)&&(z.push(a),d[a].related&&(z=z.concat(d[a].related)));z=RegExp("\\.("+z.join("|")+")(\\?.*)?$","i")}a=e?e.toLowerCase().match(z):null;!a||!a.length?b&&(e=b.indexOf(";"),a=(-1!==e?b.substr(0,e):b).substr(6)):
a=a[1];a&&c.html5[a]!==k?e=c.html5[a]&&!V(a):(b="audio/"+a,e=c.html5.canPlayType({type:b}),e=(c.html5[a]=e)&&c.html5[b]&&!V(b));return e};Wa=function(){function b(a){var b,d=b=!1;if(!e||"function"!==typeof e.canPlayType)return b;if(a instanceof Array){g=0;for(b=a.length;g<b;g++)if(c.html5[a[g]]||e.canPlayType(a[g]).match(c.html5Test))d=!0,c.html5[a[g]]=!0,c.flash[a[g]]=!!a[g].match(bb);b=d}else a=e&&"function"===typeof e.canPlayType?e.canPlayType(a):!1,b=!(!a||!a.match(c.html5Test));return b}if(!c.useHTML5Audio||
!c.hasHTML5)return u=c.html5.usingFlash=!0,!1;var e=Audio!==k?Ea&&10>opera.version()?new Audio(null):new Audio:null,d,a,f={},h,g;h=c.audioFormats;for(d in h)if(h.hasOwnProperty(d)&&(a="audio/"+d,f[d]=b(h[d].type),f[a]=f[d],d.match(bb)?(c.flash[d]=!0,c.flash[a]=!0):(c.flash[d]=!1,c.flash[a]=!1),h[d]&&h[d].related))for(g=h[d].related.length-1;0<=g;g--)f["audio/"+h[d].related[g]]=f[d],c.html5[h[d].related[g]]=f[d],c.flash[h[d].related[g]]=f[d];f.canPlayType=e?b:null;c.html5=w(c.html5,f);c.html5.usingFlash=
Va();u=c.html5.usingFlash;return!0};sa={};P=function(){};aa=function(b){8===m&&(1<b.loops&&b.stream)&&(b.stream=!1);return b};ba=function(b,c){if(b&&!b.usePolicyFile&&(b.onid3||b.usePeakData||b.useWaveformData||b.useEQData))b.usePolicyFile=!0;return b};la=function(){return!1};Pa=function(b){for(var c in b)b.hasOwnProperty(c)&&"function"===typeof b[c]&&(b[c]=la)};xa=function(b){b===k&&(b=!1);(y||b)&&c.disable(b)};Qa=function(b){var e=null;if(b)if(b.match(/\.swf(\?.*)?$/i)){if(e=b.substr(b.toLowerCase().lastIndexOf(".swf?")+
4))return b}else b.lastIndexOf("/")!==b.length-1&&(b+="/");b=(b&&-1!==b.lastIndexOf("/")?b.substr(0,b.lastIndexOf("/")+1):"./")+c.movieURL;c.noSWFCache&&(b+="?ts\x3d"+(new Date).getTime());return b};ra=function(){m=parseInt(c.flashVersion,10);8!==m&&9!==m&&(c.flashVersion=m=8);var b=c.debugMode||c.debugFlash?"_debug.swf":".swf";c.useHTML5Audio&&(!c.html5Only&&c.audioFormats.mp4.required&&9>m)&&(c.flashVersion=m=9);c.version=c.versionNumber+(c.html5Only?" (HTML5-only mode)":9===m?" (AS3/Flash 9)":
" (AS2/Flash 8)");8<m?(c.defaultOptions=w(c.defaultOptions,c.flash9Options),c.features.buffering=!0,c.defaultOptions=w(c.defaultOptions,c.movieStarOptions),c.filePatterns.flash9=RegExp("\\.(mp3|"+eb.join("|")+")(\\?.*)?$","i"),c.features.movieStar=!0):c.features.movieStar=!1;c.filePattern=c.filePatterns[8!==m?"flash9":"flash8"];c.movieURL=(8===m?"soundmanager2.swf":"soundmanager2_flash9.swf").replace(".swf",b);c.features.peakData=c.features.waveformData=c.features.eqData=8<m};Oa=function(b,c){if(!l)return!1;
l._setPolling(b,c)};wa=function(){};r=this.getSoundById;I=function(){var b=[];c.debugMode&&b.push("sm2_debug");c.debugFlash&&b.push("flash_debug");c.useHighPerformance&&b.push("high_performance");return b.join(" ")};za=function(){P("fbHandler");var b=c.getMoviePercent(),e={type:"FLASHBLOCK"};if(c.html5Only)return!1;c.ok()?c.oMC&&(c.oMC.className=[I(),"movieContainer","swf_loaded"+(c.didFlashBlock?" swf_unblocked":"")].join(" ")):(u&&(c.oMC.className=I()+" movieContainer "+(null===b?"swf_timedout":
"swf_error")),c.didFlashBlock=!0,D({type:"ontimeout",ignoreInit:!0,error:e}),H(e))};pa=function(b,c,d){x[b]===k&&(x[b]=[]);x[b].push({method:c,scope:d||null,fired:!1})};D=function(b){b||(b={type:c.ok()?"onready":"ontimeout"});if(!p&&b&&!b.ignoreInit||"ontimeout"===b.type&&(c.ok()||y&&!b.ignoreInit))return!1;var e={success:b&&b.ignoreInit?c.ok():!y},d=b&&b.type?x[b.type]||[]:[],a=[],f,e=[e],h=u&&!c.ok();b.error&&(e[0].error=b.error);b=0;for(f=d.length;b<f;b++)!0!==d[b].fired&&a.push(d[b]);if(a.length){b=
0;for(f=a.length;b<f;b++)a[b].scope?a[b].method.apply(a[b].scope,e):a[b].method.apply(this,e),h||(a[b].fired=!0)}return!0};E=function(){g.setTimeout(function(){c.useFlashBlock&&za();D();"function"===typeof c.onload&&c.onload.apply(g);c.waitForWindowLoad&&t.add(g,"load",E)},1)};Da=function(){if(v!==k)return v;var b=!1,c=navigator,d=c.plugins,a,f=g.ActiveXObject;if(d&&d.length)(c=c.mimeTypes)&&(c["application/x-shockwave-flash"]&&c["application/x-shockwave-flash"].enabledPlugin&&c["application/x-shockwave-flash"].enabledPlugin.description)&&
(b=!0);else if(f!==k&&!s.match(/MSAppHost/i)){try{a=new f("ShockwaveFlash.ShockwaveFlash")}catch(h){a=null}b=!!a}return v=b};Va=function(){var b,e,d=c.audioFormats;if(ha&&s.match(/os (1|2|3_0|3_1)/i))c.hasHTML5=!1,c.html5Only=!0,c.oMC&&(c.oMC.style.display="none");else if(c.useHTML5Audio&&(!c.html5||!c.html5.canPlayType))c.hasHTML5=!1;if(c.useHTML5Audio&&c.hasHTML5)for(e in S=!0,d)if(d.hasOwnProperty(e)&&d[e].required)if(c.html5.canPlayType(d[e].type)){if(c.preferFlash&&(c.flash[e]||c.flash[d[e].type]))b=
!0}else S=!1,b=!0;c.ignoreFlash&&(b=!1,S=!0);c.html5Only=c.hasHTML5&&c.useHTML5Audio&&!b;return!c.html5Only};da=function(b){var e,d,a=0;if(b instanceof Array){e=0;for(d=b.length;e<d;e++)if(b[e]instanceof Object){if(c.canPlayMIME(b[e].type)){a=e;break}}else if(c.canPlayURL(b[e])){a=e;break}b[a].url&&(b[a]=b[a].url);b=b[a]}return b};Ra=function(b){b._hasTimer||(b._hasTimer=!0,!Fa&&c.html5PollingInterval&&(null===R&&0===ca&&(R=setInterval(Ta,c.html5PollingInterval)),ca++))};Sa=function(b){b._hasTimer&&
(b._hasTimer=!1,!Fa&&c.html5PollingInterval&&ca--)};Ta=function(){var b;if(null!==R&&!ca)return clearInterval(R),R=null,!1;for(b=c.soundIDs.length-1;0<=b;b--)c.sounds[c.soundIDs[b]].isHTML5&&c.sounds[c.soundIDs[b]]._hasTimer&&c.sounds[c.soundIDs[b]]._onTimer()};H=function(b){b=b!==k?b:{};"function"===typeof c.onerror&&c.onerror.apply(g,[{type:b.type!==k?b.type:null}]);b.fatal!==k&&b.fatal&&c.disable()};Xa=function(){if(!$a||!Da())return!1;var b=c.audioFormats,e,d;for(d in b)if(b.hasOwnProperty(d)&&
("mp3"===d||"mp4"===d))if(c.html5[d]=!1,b[d]&&b[d].related)for(e=b[d].related.length-1;0<=e;e--)c.html5[b[d].related[e]]=!1};this._setSandboxType=function(b){};this._externalInterfaceOK=function(b){if(c.swfLoaded)return!1;c.swfLoaded=!0;ja=!1;$a&&Xa();setTimeout(ma,C?100:1)};$=function(b,e){function d(a,b){return'\x3cparam name\x3d"'+a+'" value\x3d"'+b+'" /\x3e'}if(K&&L)return!1;if(c.html5Only)return ra(),c.oMC=W(c.movieID),ma(),L=K=!0,!1;var a=e||c.url,f=c.altURL||a,h=va(),g=I(),l=null,l=n.getElementsByTagName("html")[0],
m,p,q,l=l&&l.dir&&l.dir.match(/rtl/i);b=b===k?c.id:b;ra();c.url=Qa(Ha?a:f);e=c.url;c.wmode=!c.wmode&&c.useHighPerformance?"transparent":c.wmode;if(null!==c.wmode&&(s.match(/msie 8/i)||!C&&!c.useHighPerformance)&&navigator.platform.match(/win32|win64/i))Ua.push(sa.spcWmode),c.wmode=null;h={name:b,id:b,src:e,quality:"high",allowScriptAccess:c.allowScriptAccess,bgcolor:c.bgColor,pluginspage:cb+"www.macromedia.com/go/getflashplayer",title:"JS/Flash audio component (SoundManager 2)",type:"application/x-shockwave-flash",
wmode:c.wmode,hasPriority:"true"};c.debugFlash&&(h.FlashVars="debug\x3d1");c.wmode||delete h.wmode;if(C)a=n.createElement("div"),p=['\x3cobject id\x3d"'+b+'" data\x3d"'+e+'" type\x3d"'+h.type+'" title\x3d"'+h.title+'" classid\x3d"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase\x3d"'+cb+'download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version\x3d6,0,40,0"\x3e',d("movie",e),d("AllowScriptAccess",c.allowScriptAccess),d("quality",h.quality),c.wmode?d("wmode",c.wmode):"",d("bgcolor",
c.bgColor),d("hasPriority","true"),c.debugFlash?d("FlashVars",h.FlashVars):"","\x3c/object\x3e"].join("");else for(m in a=n.createElement("embed"),h)h.hasOwnProperty(m)&&a.setAttribute(m,h[m]);wa();g=I();if(h=va())if(c.oMC=W(c.movieID)||n.createElement("div"),c.oMC.id)q=c.oMC.className,c.oMC.className=(q?q+" ":"movieContainer")+(g?" "+g:""),c.oMC.appendChild(a),C&&(m=c.oMC.appendChild(n.createElement("div")),m.className="sm2-object-box",m.innerHTML=p),L=!0;else{c.oMC.id=c.movieID;c.oMC.className=
"movieContainer "+g;m=g=null;c.useFlashBlock||(c.useHighPerformance?g={position:"fixed",width:"8px",height:"8px",bottom:"0px",left:"0px",overflow:"hidden"}:(g={position:"absolute",width:"6px",height:"6px",top:"-9999px",left:"-9999px"},l&&(g.left=Math.abs(parseInt(g.left,10))+"px")));gb&&(c.oMC.style.zIndex=1E4);if(!c.debugFlash)for(q in g)g.hasOwnProperty(q)&&(c.oMC.style[q]=g[q]);try{C||c.oMC.appendChild(a),h.appendChild(c.oMC),C&&(m=c.oMC.appendChild(n.createElement("div")),m.className="sm2-object-box",
m.innerHTML=p),L=!0}catch(r){throw Error(P("domError")+" \n"+r.toString());}}return K=!0};Z=function(){if(c.html5Only)return $(),!1;if(l||!c.url)return!1;l=c.getMovie(c.id);l||(O?(C?c.oMC.innerHTML=ya:c.oMC.appendChild(O),O=null,K=!0):$(c.id,c.url),l=c.getMovie(c.id));"function"===typeof c.oninitmovie&&setTimeout(c.oninitmovie,1);return!0};F=function(){setTimeout(Na,1E3)};qa=function(){g.setTimeout(function(){c.setup({preferFlash:!1}).reboot();c.didFlashBlock=!0;c.beginDelayedInit()},1)};Na=function(){var b,
e=!1;if(!c.url||Q)return!1;Q=!0;t.remove(g,"load",F);if(v&&ja&&!Ga)return!1;p||(b=c.getMoviePercent(),0<b&&100>b&&(e=!0));setTimeout(function(){b=c.getMoviePercent();if(e)return Q=!1,g.setTimeout(F,1),!1;!p&&ab&&(null===b?c.useFlashBlock||0===c.flashLoadTimeout?c.useFlashBlock&&za():!c.useFlashBlock&&S?qa():D({type:"ontimeout",ignoreInit:!0,error:{type:"INIT_FLASHBLOCK"}}):0!==c.flashLoadTimeout&&(!c.useFlashBlock&&S?qa():xa(!0)))},c.flashLoadTimeout)};Y=function(){if(Ga||!ja)return t.remove(g,"focus",
Y),!0;Ga=ab=!0;Q=!1;F();t.remove(g,"focus",Y);return!0};M=function(b){if(p)return!1;if(c.html5Only)return p=!0,E(),!0;var e=!0,d;if(!c.useFlashBlock||!c.flashLoadTimeout||c.getMoviePercent())p=!0;d={type:!v&&u?"NO_FLASH":"INIT_TIMEOUT"};if(y||b)c.useFlashBlock&&c.oMC&&(c.oMC.className=I()+" "+(null===c.getMoviePercent()?"swf_timedout":"swf_error")),D({type:"ontimeout",error:d,ignoreInit:!0}),H(d),e=!1;y||(c.waitForWindowLoad&&!na?t.add(g,"load",E):E());return e};Ma=function(){var b,e=c.setupOptions;
for(b in e)e.hasOwnProperty(b)&&(c[b]===k?c[b]=e[b]:c[b]!==e[b]&&(c.setupOptions[b]=c[b]))};ma=function(){if(p)return!1;if(c.html5Only)return p||(t.remove(g,"load",c.beginDelayedInit),c.enabled=!0,M()),!0;Z();try{l._externalInterfaceTest(!1),Oa(!0,c.flashPollingInterval||(c.useHighPerformance?10:50)),c.debugMode||l._disableDebug(),c.enabled=!0,c.html5Only||t.add(g,"unload",la)}catch(b){return H({type:"JS_TO_FLASH_EXCEPTION",fatal:!0}),xa(!0),M(),!1}M();t.remove(g,"load",c.beginDelayedInit);return!0};
G=function(){if(N)return!1;N=!0;Ma();wa();!v&&c.hasHTML5&&c.setup({useHTML5Audio:!0,preferFlash:!1});Wa();!v&&u&&(Ua.push(sa.needFlash),c.setup({flashLoadTimeout:1}));n.removeEventListener&&n.removeEventListener("DOMContentLoaded",G,!1);Z();return!0};Ba=function(){"complete"===n.readyState&&(G(),n.detachEvent("onreadystatechange",Ba));return!0};ua=function(){na=!0;t.remove(g,"load",ua)};ta=function(){if(Fa&&(c.setupOptions.useHTML5Audio=!0,c.setupOptions.preferFlash=!1,ha||Za&&!s.match(/android\s2\.3/i)))ha&&
(c.ignoreFlash=!0),A=!0};ta();Da();t.add(g,"focus",Y);t.add(g,"load",F);t.add(g,"load",ua);n.addEventListener?n.addEventListener("DOMContentLoaded",G,!1):n.attachEvent?n.attachEvent("onreadystatechange",Ba):H({type:"NO_DOM2_EVENTS",fatal:!0})}var ka=null;if(void 0===g.SM2_DEFER||!SM2_DEFER)ka=new U;g.SoundManager=U;g.soundManager=ka})(window);

/*! Lazy Load 1.9.7 - MIT license - Copyright 2010-2015 Mika Tuupola */
!function(a,b,c,d){var e=a(b);a.fn.lazyload=function(f){function g(){var b=0;i.each(function(){var c=a(this);if(!j.skip_invisible||c.is(":visible"))if(a.abovethetop(this,j)||a.leftofbegin(this,j));else if(a.belowthefold(this,j)||a.rightoffold(this,j)){if(++b>j.failure_limit)return!1}else c.trigger("appear"),b=0})}var h,i=this,j={threshold:0,failure_limit:0,event:"scroll",effect:"show",container:b,data_attribute:"original",skip_invisible:!1,appear:null,load:null,placeholder:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC"};return f&&(d!==f.failurelimit&&(f.failure_limit=f.failurelimit,delete f.failurelimit),d!==f.effectspeed&&(f.effect_speed=f.effectspeed,delete f.effectspeed),a.extend(j,f)),h=j.container===d||j.container===b?e:a(j.container),0===j.event.indexOf("scroll")&&h.bind(j.event,function(){return g()}),this.each(function(){var b=this,c=a(b);b.loaded=!1,(c.attr("src")===d||c.attr("src")===!1)&&c.is("img")&&c.attr("src",j.placeholder),c.one("appear",function(){if(!this.loaded){if(j.appear){var d=i.length;j.appear.call(b,d,j)}a("<img />").bind("load",function(){var d=c.attr("data-"+j.data_attribute);c.hide(),c.is("img")?c.attr("src",d):c.css("background-image","url('"+d+"')"),c[j.effect](j.effect_speed),b.loaded=!0;var e=a.grep(i,function(a){return!a.loaded});if(i=a(e),j.load){var f=i.length;j.load.call(b,f,j)}}).attr("src",c.attr("data-"+j.data_attribute))}}),0!==j.event.indexOf("scroll")&&c.bind(j.event,function(){b.loaded||c.trigger("appear")})}),e.bind("resize",function(){g()}),/(?:iphone|ipod|ipad).*os 5/gi.test(navigator.appVersion)&&e.bind("pageshow",function(b){b.originalEvent&&b.originalEvent.persisted&&i.each(function(){a(this).trigger("appear")})}),a(c).ready(function(){g()}),this},a.belowthefold=function(c,f){var g;return g=f.container===d||f.container===b?(b.innerHeight?b.innerHeight:e.height())+e.scrollTop():a(f.container).offset().top+a(f.container).height(),g<=a(c).offset().top-f.threshold},a.rightoffold=function(c,f){var g;return g=f.container===d||f.container===b?e.width()+e.scrollLeft():a(f.container).offset().left+a(f.container).width(),g<=a(c).offset().left-f.threshold},a.abovethetop=function(c,f){var g;return g=f.container===d||f.container===b?e.scrollTop():a(f.container).offset().top,g>=a(c).offset().top+f.threshold+a(c).height()},a.leftofbegin=function(c,f){var g;return g=f.container===d||f.container===b?e.scrollLeft():a(f.container).offset().left,g>=a(c).offset().left+f.threshold+a(c).width()},a.inviewport=function(b,c){return!(a.rightoffold(b,c)||a.leftofbegin(b,c)||a.belowthefold(b,c)||a.abovethetop(b,c))},a.extend(a.expr[":"],{"below-the-fold":function(b){return a.belowthefold(b,{threshold:0})},"above-the-top":function(b){return!a.belowthefold(b,{threshold:0})},"right-of-screen":function(b){return a.rightoffold(b,{threshold:0})},"left-of-screen":function(b){return!a.rightoffold(b,{threshold:0})},"in-viewport":function(b){return a.inviewport(b,{threshold:0})},"above-the-fold":function(b){return!a.belowthefold(b,{threshold:0})},"right-of-fold":function(b){return a.rightoffold(b,{threshold:0})},"left-of-fold":function(b){return!a.rightoffold(b,{threshold:0})}})}(jQuery,window,document);