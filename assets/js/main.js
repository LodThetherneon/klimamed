(function() {


  var cookieBanner = document.getElementById("cookie-banner");
  var acceptButton = document.getElementById("accept-cookies");
  var rejectButton = document.getElementById("reject-cookies");

  function updateGoogleConsent(status) {
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    
    gtag('consent', 'update', {
      'analytics_storage': status,
      'ad_storage': status,
      'ad_user_data': status,
      'ad_personalization': status
    });
  }

  if (cookieBanner && acceptButton && rejectButton) {

    var cookieConsent = localStorage.getItem("klimamedCookieConsent");

    if (!cookieConsent) {
      // Ha még nem döntött, 1 másodperc múlva beúszik a banner
      setTimeout(function() {
        cookieBanner.classList.add("show");
      }, 1000);
    } else if (cookieConsent === "accepted") {
      // Ha korábban már elfogadta, azonnal engedélyezzük az mérést a Google-nek
      updateGoogleConsent('granted');
    } 

    acceptButton.addEventListener("click", function() {
      localStorage.setItem("klimamedCookieConsent", "accepted");
      cookieBanner.classList.remove("show");
      console.log("Sütik elfogadva: Analitika engedélyezése...");
      // Közöljük a Google-lel, hogy mostantól mérhet
      updateGoogleConsent('granted');
    });

 
    rejectButton.addEventListener("click", function() {
      localStorage.setItem("klimamedCookieConsent", "rejected");
      cookieBanner.classList.remove("show");
      console.log("Sütik elutasítva: Analitika tiltva marad.");
      // Biztosítjuk, hogy a tiltás érvényben maradjon
      updateGoogleConsent('denied');
    });
  }
  var navToggle = document.querySelector('.nav-toggle');
  var navLinks = document.querySelector('.nav-links');
  
  if (navToggle && navLinks) {
 
    navToggle.addEventListener('click', function() {
      navLinks.classList.toggle('is-open');
    });


    window.addEventListener('scroll', function() {
      if (navLinks.classList.contains('is-open')) {
        navLinks.classList.remove('is-open');
      }
    }, { passive: true });
  }


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
  
  var container = document.getElementById("smart-sticky-container");
  var card = document.getElementById("smart-sticky-card");

  if (container && card) {
    var lastScrollY = window.scrollY;
    var currentOffset = 0; 
    var headerHeight = 90;
    var ticking = false;

    function isDesktop() {
    
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

