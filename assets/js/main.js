(function() {

    // --- SÜTI (COOKIE) BANNER ÉS ANALITIKA LOGIKA ---
  var cookieBanner = document.getElementById("cookie-banner");
  var acceptButton = document.getElementById("accept-cookies");
  var rejectButton = document.getElementById("reject-cookies");

  // Ide jön majd a Google Analytics kódod (GA4)
  function loadGoogleAnalytics() {
    console.log("Marketing sütik engedélyezve: Analytics betöltése...");
    // Ide fogod bemásolni a Google által adott <script> kódot dinamikusan
    // Pl: 
    // var script = document.createElement('script');
    // script.src = 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX';
    // document.head.appendChild(script);
    // ... és a többi config rész.
  }

  if (cookieBanner && acceptButton && rejectButton) {
    // Kinyerjük a mentett állapotot
    var cookieConsent = localStorage.getItem("klimamedCookieConsent");

    if (!cookieConsent) {
      // Ha még nem döntött, megmutatjuk a bannert
      setTimeout(function() {
        cookieBanner.classList.add("show");
      }, 1000);
    } else if (cookieConsent === "accepted") {
      // Ha korábban már elfogadta, azonnal betöltjük az Analytics-et!
      loadGoogleAnalytics();
    }

    // Ha az ELFOGADOM gombra nyom
    acceptButton.addEventListener("click", function() {
      localStorage.setItem("klimamedCookieConsent", "accepted");
      cookieBanner.classList.remove("show");
      // Mivel most fogadta el, rögtön betöltjük a követő kódot
      loadGoogleAnalytics();
    });

    // Ha az ELUTASÍTOM gombra nyom
    rejectButton.addEventListener("click", function() {
      // Eltároljuk, hogy elutasította (így legközelebb nem zavarjuk a bannerrel)
      localStorage.setItem("klimamedCookieConsent", "rejected");
      cookieBanner.classList.remove("show");
      console.log("Marketing sütik elutasítva. Analytics nem töltődik be.");
      // Fontos: Itt nem hívjuk meg a loadGoogleAnalytics() függvényt!
    });
  }



  // --- MOBIL MENÜ KEZELÉS ---
  var navToggle = document.querySelector('.nav-toggle');
  var navLinks = document.querySelector('.nav-links');
  
  if (navToggle && navLinks) {
    // Menü nyitása / zárása kattintásra
    navToggle.addEventListener('click', function() {
      navLinks.classList.toggle('is-open');
    });

    // Menü automatikus zárása görgetéskor
    window.addEventListener('scroll', function() {
      if (navLinks.classList.contains('is-open')) {
        navLinks.classList.remove('is-open');
      }
    }, { passive: true });
  }

  // --- FINOM BEÚSZÓ ANIMÁCIÓK SCROLLRA ---
  var els = document.querySelectorAll('.fade-in');
  if ('IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    els.forEach(function(el) { obs.observe(el); });
  } else {
    els.forEach(function(el) { el.classList.add('is-visible'); });
  }
  // --- IRÁNYÉRZÉKENY (DIRECTION-AWARE) STICKY LOGIKA ---
  var container = document.getElementById("smart-sticky-container");
  var card = document.getElementById("smart-sticky-card");

  if (container && card) {
    var lastScrollY = window.scrollY;
    var currentOffset = 0; 
    var headerHeight = 90;
    var ticking = false;

    // FONTOS: Létrehozunk egy ellenőrző logikát
    function isDesktop() {
      // Csak 900px felett engedélyezzük a sticky működést (ahol a CSS-ben 2 oszlopos a grid)
      return window.innerWidth > 900; 
    }

    function updateCardPosition() {
      // Ha mobilon vagyunk, ne mozogjon, állítsunk vissza mindent az eredetire
      if (!isDesktop()) {
        container.style.position = "";
        container.style.height = "";
        card.style.position = "";
        card.style.width = "";
        card.style.transform = "";
        ticking = false;
        return;
      }

      // ASZTALI NÉZET: Alkalmazzuk a pozíciókat, ha még nincsenek rajta
      if (container.style.position !== "relative") {
        container.style.position = "relative";
        container.style.height = "100%";
        card.style.position = "absolute";
        card.style.width = "100%";
        card.style.willChange = "transform"; 
      }

      var scrollY = window.scrollY;
      var scrollDelta = scrollY - lastScrollY;
      
      var containerRect = container.getBoundingClientRect();
      var cardHeight = card.offsetHeight;
      var windowHeight = window.innerHeight;

      // Kiszámoljuk, mennyi hely van a konténerben a kártya számára
      var maxOffset = Math.max(0, containerRect.height - cardHeight);

      if (scrollDelta > 0) {
        // LEFELÉ görgetés
        var distanceToBottom = (containerRect.top + currentOffset + cardHeight) - windowHeight;
        if (distanceToBottom < -20) {
          currentOffset += scrollDelta;
        }
      } else if (scrollDelta < 0) {
        // FELFELÉ görgetés
        var distanceToTop = containerRect.top + currentOffset;
        if (distanceToTop > headerHeight) {
          currentOffset += scrollDelta;
        }
      }

      // Ne csússzon ki a konténerből se alul, se felül
      currentOffset = Math.max(0, Math.min(currentOffset, maxOffset));

      // Mozgás alkalmazása
      card.style.transform = "translate3d(0, " + currentOffset + "px, 0)"; 
      
      lastScrollY = scrollY;
      ticking = false;
    }

    window.addEventListener("scroll", function() {
      if (!ticking) {
        window.requestAnimationFrame(updateCardPosition);
        ticking = true;
      }
    }, { passive: true }); 

    // Ha átméretezik az ablakot (pl. elforgatják a telefont), fusson le a check
    window.addEventListener("resize", function() {
      if (!ticking) {
        window.requestAnimationFrame(updateCardPosition);
        ticking = true;
      }
    });
  }
})();

