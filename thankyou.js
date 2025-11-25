// Example: fill order summary dynamically (from query string or localStorage)
document.addEventListener("DOMContentLoaded", () => {
  // Simulate getting order data (replace with real method if available)
  const urlParams = new URLSearchParams(window.location.search);

  
  const autographName = urlParams.get("autographName") || "";
 
  const total = urlParams.get("total") || "25.00";

  document.getElementById("order-version").textContent = version === "auto" ? "Autographed" : "Standard";

  if (version === "auto" && autographName.trim() !== "") {
    document.getElementById("autograph-note").classList.remove("hidden");
    document.getElementById("order-autograph").textContent = autographName;
  }

  document.getElementById("order-country").textContent = country;
  document.getElementById("order-total").textContent = parseFloat(total).toFixed(2);
});
