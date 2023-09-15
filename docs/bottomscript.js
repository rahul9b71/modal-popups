// Wrap your JavaScript code in a self-executing anonymous function to avoid polluting the global namespace
(function () {

  console.log("bottomscript.js is loaded!"); // Add this line

  var _waitUntilScrollToX = function (selector, x, callback) {
    // Your existing _waitUntilScrollToX code here...
  };

  var _loadStyle = function (src) {
    // Your existing _loadStyle code here...
  };

  // Define the initPopup function
  var initPopup = function ({
    // Existing parameters...
  }) {
    // Check if a modal with the same ID already exists on the page
    if (document.getElementById(modalId)) {
      return;
    }

    const currentHref = window.location.href;

    // Check for sticky behavior on URL change
    if (noStickyOnUrlChange) {
      const checkForSticky = setInterval(function () {
        if (currentHref !== window.location.href) {
          document.getElementById(modalId + "_onclose")?.remove();
          clearInterval(checkForSticky);
        }
      }, 500);
    }

    _loadStyle(styleUrl);

    // Define classes for positioning the popup
    var positionClassExit = "";
    var positionClass = "";
    if (position === "bottom") {
      positionClass = "popup-outer-bottom";
      positionClassExit = "slide-out-bottom";
    } else if (position === "top") {
      positionClass = "popup-outer-top";
      positionClassExit = "slide-out-top";
    }

    // Define the HTML template for the popup
    var template = `
      <section id="${modalId}" class="ixi-growth-popup">
        <div class="popup-outer ${positionClass}">
          <div class="ixigo-popup-box ${animationClass}" style="background:${bgColor};">
            <!-- Existing popup content... -->
          </div>
        </div>
      </section>
    `;

    var templateOnClose = `
      <!-- HTML template for on close behavior... -->
    `;

    // Create a new div element for the popup
    var div = document.createElement("div");
    div.innerHTML = template.trim();

    // Define a close handler function
    var closeHandler = function () {
      // Close the modal and remove it from the DOM
      var modalItem = document.getElementById(modalId);
      if (positionClassExit) {
        if (modalItem) {
          modalItem.classList.add("fade-out");
          modalItem.querySelector(".ixigo-popup-box").classList.add(positionClassExit);
          setTimeout(() => {
            modalItem.classList.remove("show");
            modalItem.remove();
          }, 500);
        }
      } else {
        if (modalItem) {
          document.getElementById(modalId).classList.remove("show");
          document.getElementById(modalId).remove();
        }
      }

      // Handle on close behavior...
    };

    // Add event listeners for closing the modal
    var closeBtn = div.firstChild.querySelector(`#${modalId} .close`);
    closeBtn.addEventListener("click", closeHandler);

    var outher = div.firstChild.querySelector(`#${modalId} .popup-outer`);
    outher.addEventListener("click", closeHandler);

    var popup = div.firstChild.querySelector(`#${modalId} .ixigo-popup-box`);
    popup.addEventListener("click", (e) => {
      e.stopPropagation();
    });

    // Trigger the modal based on the specified conditions
    var triggerModal = function () {
      if (!triggerOnUrlChange && currentHref !== window.location.href) {
        return;
      }
      if (document.getElementById(modalId)) {
        return;
      }
      document.body.appendChild(div.firstChild);
      setTimeout(() => {
        if (showOnlyOncePerSession && sessionStorage.getItem("popup_" + modalId)) {
          return;
        }
        document.getElementById(`${modalId}`).classList.add("show");
        if (viewLink) {
          document.getElementById("pixelTracker").src = viewLink;
        }
        sessionStorage.setItem("popup_" + modalId, true);
        if (autoClick) {
          setTimeout(() => {
            document.getElementById(`${modalId}-cta`).click();
          }, 200);
        }
      }, 50);
    };

    if (triggerCondition === "time") {
      setTimeout(() => {
        if (firstPopup === 'NO') {
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

  // Export the initPopup function to make it accessible globally
  window.initPopup = initPopup;
})();
