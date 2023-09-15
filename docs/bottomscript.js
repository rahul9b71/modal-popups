(function () {

  console.log("bottomscript.js is loaded!");

  var _waitUntilScrollToX = function (selector, x, callback) {
    var headerTopItem = document.querySelector(selector || ".home-header-cntnr");
    var topPosition = Math.abs(
      headerTopItem ? headerTopItem.getBoundingClientRect().top : 0
    );

    if (topPosition > x) {
      return callback();
    }
    setTimeout(function () {
      _waitUntilScrollToX(selector, x, callback);
    }, 500);
  };

  var _loadStyle = function (src) {
    return new Promise(function (resolve, reject) {
      let link = document.createElement("link");
      link.href = src;
      link.rel = "stylesheet";

      link.onload = () => resolve(link);
      link.onerror = () => reject(new Error(`Style load error for ${src}`));

      document.head.append(link);
    });
  };

  var initPopup = function ({
    triggerCondition = "time",
    delay = "0",
    scrollHeight = "100",
    scrollHeightId = ".home-header-cntnr",
    modalId,
    imageSrc,
    autoClick = false,
    ctaLink,
    triggerOnUrlChange = false,
    showOnlyOncePerSession = false,
    noStickyOnUrlChange = true,
    closeButtonStyle = "",
    onCloseSrc,
    onCloseViewLink,
    imageClickeable = false,
    onCloseLink,
    position = "middle",
    ctaColor = "#ec5b24",
    bgColor = "#fcded3",
    ctaLabel = "DOWNLOAD NOW",
    viewLink,
    animationClass = "hithere",
    firstPopup,
    desktopWidth = 1024
  }) {
    if (document.getElementById(modalId)) {
      return;
    }

    const currentHref = window.location.href;
    const screenWidth = window.innerWidth;

    console.log("firstPopup:", firstPopup);
    console.log(
      "CommonModal",
      modalId,
      `triggerCondition=${triggerCondition}`,
      `delay=${delay}`,
      `scrollHeight=${scrollHeight}`,
      `triggerOnUrlChange=${triggerOnUrlChange}`,
      `showOnlyOncePerSession=${showOnlyOncePerSession}`,
      `currentHref=${currentHref}`,
    );

    if (noStickyOnUrlChange) {
      const checkForSticky = setInterval(function () {
        if (currentHref !== window.location.href) {
          document.getElementById(modalId + "_onclose")?.remove()
          clearInterval(checkForSticky);
        } else {
        }
      }, 500);
    }

    _loadStyle(styleUrl);

    var positionClassExit = "";
    var positionClass = "";
    if (position === "bottom") {
      positionClass = "popup-outer-bottom";
      positionClassExit = "slide-out-bottom";
    } else if (position === "top") {
      positionClass = "popup-outer-top";
      positionClassExit = "slide-out-top";
    }

    if (screenWidth >= desktopWidth) {
      positionClass = "desktop-popup";
    }

    var template = `<section id="${modalId}" class="ixi-growth-popup"><div class="popup-outer ${positionClass}">
        <div class="ixigo-popup-box ${animationClass}" style="background:${bgColor};">
            <img class="bx bx-x close" src="https://rocket.ixigo.com/modal/close${
              closeButtonStyle ? "-" + closeButtonStyle : ""
            }.svg" loading="lazy">
            <img class="popup-main-img" src="${imageSrc}" draggable="false" loading="lazy" onclick="if(${imageClickeable}){location.href='${ctaLink}'}">
    <div style="" class="trackerCTA">
    <a id="${modalId}-cta" style="background-color:${ctaColor}" class="ixi-growth-button" href="${ctaLink}" target="_blank"><span class="" contenteditable="true">${ctaLabel}</span></a>
    </div><img id="pixelTracker"/>
    </div>
  </div></section>
  `;
    var templateOnClose = `<div onclick="location.href='${onCloseLink}'" id="${modalId}_onclose" class="ixi-growth-fix">
    <img class="bx bx-x closeInternal" src="https://rocket.ixigo.com/modal/close${
      closeButtonStyle ? "-" + closeButtonStyle : ""
    }.svg" loading="lazy">
    <img class="fix-img" src="${onCloseSrc}"/>
    <img id="pixelTrackerView"/>
    </div>`;

    var div = document.createElement("div");
    div.innerHTML = template.trim();

    var closeHandler = function () {
      var modalItem = document.getElementById(modalId);
      if (positionClassExit) {
        if (modalItem){
          modalItem.classList.add("fade-out");
          modalItem.querySelector(".ixigo-popup-box")
          .classList.add(positionClassExit);
          setTimeout(() => {
            modalItem.classList.remove("show");
            modalItem.remove();
          }, 500);
        }     
      } else {
        if (modalItem){
          document.getElementById(modalId).classList.remove("show");
          document.getElementById(modalId).remove();
        }
      }

      if (onCloseSrc && onCloseLink && currentHref === window.location.href) {
        if(window.location.pathname.includes("/cheap-flights/")){
          setTimeout(function(){
            console.log("cheap flights search modal opened")
            var searchBoxEl = document.querySelector("#content > div > div.flex-wrapper > div > div:nth-child(2) > div > div");
            if(searchBoxEl){
              searchBoxEl.click();
            }
          },2000)
        }
        var divOnClose = document.createElement("div");
        divOnClose.innerHTML = templateOnClose.trim();
        var closeInside = divOnClose.firstChild.querySelector(`.closeInternal`);
        closeInside.addEventListener("click", (e) => {
          e.stopPropagation();
          document.getElementById(modalId + "_onclose").remove();
        });

        document.body.appendChild(divOnClose.firstChild);
        if (onCloseViewLink) {
          document.getElementById("pixelTrackerView").src = onCloseViewLink;
        }
      }
    };

    var closeBtn = div.firstChild.querySelector(`#${modalId} .close`);
    closeBtn.addEventListener("click", closeHandler);

    var outher = div.firstChild.querySelector(`#${modalId} .popup-outer`);
    outher.addEventListener("click", closeHandler);

    var popup = div.firstChild.querySelector(`#${modalId} .ixigo-popup-box`);
    popup.addEventListener("click", (e) => {
      e.stopPropagation();
    });

    var triggerModal = function () {
      if (!triggerOnUrlChange && currentHref !== window.location.href) {
        console.log(`NO POPUP - ${modalId}`);
        return;
      }
      console.log(`YES POPUP - ${modalId}`, "autoclick", autoClick);

      if (document.getElementById(modalId)) {
        return;
      }
      document.body.appendChild(div.firstChild);
      setTimeout(() => {
        if (
          showOnlyOncePerSession &&
          sessionStorage.getItem("popup_" + modalId)
        ) {
          return;
        }
        /*history.pushState(`modalShow_${modalId}`, "", location.pathname);
        window.addEventListener("popstate", (e) => {
          e.stopPropagation();
          e.preventDefault();
          closeHandler();
          console.log("onpopstate closeHandler...");
          history.replaceState("", "", location.pathname);
          window.onpopstate = () => {};
        });*/
        document.getElementById(`${modalId}`).classList.add("show");
        if (viewLink) {
          document.getElementById("pixelTracker").src = viewLink;
        }
        sessionStorage.setItem("popup_" + modalId, true);
        if (autoClick) {
          setTimeout(() => {
            console.log("autoclick redirection", ctaLink);
            document.getElementById(`${modalId}-cta`).click();
          }, 200);
        }
      }, 50);
    };

    if (triggerCondition === "time") {
      // alert(${animationClass})
      setTimeout(() => {
        if (firstPopup == 'NO') {
          //triggerModal();
          closeHandler();
        } else {
          triggerModal();
        }
      }, parseInt(delay));
    } else if (triggerCondition === "scroll") {
      _waitUntilScrollToX(scrollHeightId, parseInt(scrollHeight), function () {
        triggerModal();
      });
    }
  };

  window.initPopup = initPopup;
})();
