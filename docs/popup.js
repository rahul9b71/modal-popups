function showPopup() {
    const popup = document.getElementById("popup");
    const ctaButton = document.getElementById("ctaButton");

    // Replace the image source and CTA link here
    const imageUrl = "your-image-url.png";
    const ctaLink = "https://example.com";

    // Set the image source and CTA link
    const popupImage = popup.querySelector(".popup-image");
    popupImage.src = imageUrl;

    // Set the CTA button link
    ctaButton.href = ctaLink;

    popup.style.display = "block";
}

function closePopup() {
    const popup = document.getElementById("popup");
    popup.style.display = "none";
}
