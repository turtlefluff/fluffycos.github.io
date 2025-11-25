document.addEventListener("DOMContentLoaded", () => {

const versionSelect = document.getElementById("version");
const autographContainer = document.getElementById("autographNameContainer");
const autographName = document.getElementById("autographName");
const countrySelect = document.getElementById("country");
const tipInput = document.getElementById("tip");
const totalPriceText = document.getElementById("totalPrice");

/* Price update */
function updatePrice() {
    let base = 25;
    let shipping = countrySelect.value === "canada" ? 5 :
                    countrySelect.value === "us" ? 10 : 12;
    let tip = parseFloat(tipInput.value) || 0;
    let total = base + shipping + tip;
    totalPriceText.textContent = `Total: $${total.toFixed(2)}`;
    return total;
}

versionSelect.addEventListener("change", () => {
    let isAuto = versionSelect.value === "auto";
    autographContainer.classList.toggle("hidden", !isAuto);
    if (!isAuto) autographName.value = "";
});

countrySelect.addEventListener("change", updatePrice);
tipInput.addEventListener("input", updatePrice);
updatePrice();

/* Backend validation */
function validateForm() {
    if (versionSelect.value === "auto" && autographName.value.trim() === "") {
        alert("Please enter a name for the autograph.");
        return false;
    }
    return true;
}

/* PayPal */
paypal.Buttons({
    createOrder: (data, actions) => {
        if (!validateForm()) return;

        return actions.order.create({
            purchase_units: [{
                amount: { value: updatePrice().toFixed(2) },
                description: `2026 Fluffycos Calendar - ${
                    versionSelect.value === "auto"
                    ? "Autographed | Name: " + autographName.value
                    : "Standard"
                }`
            }]
        });
    },

    onApprove: (data, actions) =>
        actions.order.capture().then(details => {
            window.location.href = "thankyou.html";
        })

}).render("#paypal-button-container");


/* Carousel */
const track = document.querySelector(".carousel-track");
const images = Array.from(track.children);
const thumbs = document.querySelectorAll(".thumb");
let index = 0;

function updateCarousel() {
    track.style.transform = `translateX(-${index * 100}%)`;
    thumbs.forEach(t => t.classList.remove("active"));
    thumbs[index].classList.add("active");
}

document.querySelector(".next").addEventListener("click", () => {
    index = (index + 1) % images.length;
    updateCarousel();
});

document.querySelector(".prev").addEventListener("click", () => {
    index = (index - 1 + images.length) % images.length;
    updateCarousel();
});

thumbs.forEach((thumb, i) => {
    thumb.addEventListener("click", () => {
        index = i;
        updateCarousel();
    });
});

let autoplay = setInterval(() => {
    index = (index + 1) % images.length;
    updateCarousel();
}, 4000);

track.addEventListener("mouseenter", () => clearInterval(autoplay));
track.addEventListener("mouseleave", () => {
    autoplay = setInterval(() => {
        index = (index + 1) % images.length;
        updateCarousel();
    }, 4000);
});

/* Description toggle  okay*/
const descToggle = document.querySelector(".desc-toggle");
const descContent = document.querySelector(".desc-content");

descToggle.addEventListener("click", () => {
    descContent.classList.toggle("open");
    descToggle.textContent =
        descContent.classList.contains("open")
        ? "📕 Hide Description"
        : "📖 Read Description";
});
});
