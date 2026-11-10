

// 1. Add your Unsplash Access Key here
const ACCESS_KEY = "mgoU8L60qeo6nG7BkNQc2Vi1CFgOrq6tgWk98hWAkZI";

// HTML elements
const form = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const imageGrid = document.querySelector("#image-grid");
const statusMessage = document.querySelector("#status");
const resultsTitle = document.querySelector("#results-title");
const resultsCount = document.querySelector("#results-count");
const loadMoreButton = document.querySelector("#load-more");

const lightbox = document.querySelector("#lightbox");
const lightboxImage = document.querySelector("#lightbox-image");
const lightboxCaption = document.querySelector("#lightbox-caption");
const closeLightboxButton = document.querySelector("#close-lightbox");

// Application state
let currentQuery = "";
let currentPage = 1;
let totalPages = 0;
let debounceTimer;
let requestController;

console.log("PixelFind JavaScript loaded");

// Check required HTML elements
if (
  !form ||
  !searchInput ||
  !imageGrid ||
  !statusMessage ||
  !resultsTitle ||
  !resultsCount ||
  !loadMoreButton ||
  !lightbox ||
  !lightboxImage ||
  !lightboxCaption ||
  !closeLightboxButton
) {
  console.error("Some required HTML elements are missing.");
}

// ==========================================
// 1. Search Unsplash images
// ==========================================

async function searchImages(query, page = 1) {
  query = query.trim();

  if (!query) {
    statusMessage.textContent = "Please enter a keyword.";
    return;
  }

  if (
    !ACCESS_KEY ||
    ACCESS_KEY === "YOUR_UNSPLASH_ACCESS_KEY"
  ) {
    statusMessage.textContent =
      "Add your Unsplash Access Key in js/script.js.";
    return;
  }

  // Cancel the previous request
  if (requestController) {
    requestController.abort();
  }

  const controller = new AbortController();
  requestController = controller;

  statusMessage.textContent = "Searching for images...";
  loadMoreButton.hidden = true;

  if (page === 1) {
    imageGrid.replaceChildren();
  }

  try {
    const url = new URL(
      "https://api.unsplash.com/search/photos"
    );

    url.search = new URLSearchParams({
      query,
      page: String(page),
      per_page: "12",
      content_filter: "high"
    });

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Client-ID ${ACCESS_KEY}`
      },
      signal: controller.signal
    });

    console.log("Unsplash response:", response.status);

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error(
          "Invalid Access Key. Check your Unsplash key."
        );
      }

      if (response.status === 403) {
        throw new Error(
          "Access forbidden. Check your Unsplash application permissions."
        );
      }

      if (response.status === 429) {
        throw new Error(
          "API rate limit reached. Please try again later."
        );
      }

      throw new Error(
        `Image search failed: HTTP ${response.status}`
      );
    }

    const data = await response.json();

    // Ignore outdated search results
    if (
      controller !== requestController ||
      query !== currentQuery
    ) {
      return;
    }

    currentPage = page;
    totalPages = data.total_pages;

    resultsTitle.textContent = `Results for "${query}"`;
    resultsCount.textContent =
      `${data.total.toLocaleString()} images found`;

    if (data.results.length === 0 && page === 1) {
      statusMessage.textContent =
        "No images found. Try another keyword.";
      return;
    }

    renderImages(data.results);

    statusMessage.textContent = "";
    loadMoreButton.hidden = currentPage >= totalPages;

  } catch (error) {
    if (error.name === "AbortError") {
      return;
    }

    console.error("Search error:", error);

    statusMessage.textContent =
      error.message || "Something went wrong.";
  }
}

// ==========================================
// 2. Render image cards
// ==========================================

function renderImages(images) {
  const fragment = document.createDocumentFragment();

  images.forEach((photo) => {
    const card = document.createElement("article");
    card.className = "image-card";

    // Image preview button
    const previewButton = document.createElement("button");
    previewButton.type = "button";
    previewButton.className = "image-preview";
    previewButton.setAttribute(
      "aria-label",
      `Preview photo by ${photo.user.name}`
    );

    const image = document.createElement("img");
    image.src = photo.urls.small;
    image.alt =
      photo.alt_description ||
      photo.description ||
      "Unsplash photograph";
    image.loading = "lazy";

    previewButton.appendChild(image);
    previewButton.addEventListener("click", () => {
      openLightbox(photo);
    });

    // Image information
    const info = document.createElement("div");
    info.className = "image-info";

    const photographer = document.createElement("p");
    photographer.textContent = `Photo by ${photo.user.name}`;

    // Source link
    const creditLink = document.createElement("a");
    creditLink.href =
      `${photo.links.html}?utm_source=pixelfind&utm_medium=referral`;
    creditLink.target = "_blank";
    creditLink.rel = "noopener noreferrer";
    creditLink.textContent = "View source";

    // Download button
    const downloadButton = document.createElement("button");
    downloadButton.type = "button";
    downloadButton.className = "download-button";
    downloadButton.textContent = "↓ Download";

    downloadButton.addEventListener("click", () => {
      downloadImage(photo, downloadButton);
    });

    info.append(photographer, creditLink, downloadButton);
    card.append(previewButton, info);
    fragment.appendChild(card);
  });

  imageGrid.appendChild(fragment);
}

// ==========================================
// 3. Download an image
// ==========================================

async function downloadImage(photo, button) {
  if (
    !ACCESS_KEY ||
    ACCESS_KEY === "YOUR_UNSPLASH_ACCESS_KEY"
  ) {
    statusMessage.textContent =
      "Add your Unsplash Access Key first.";
    return;
  }

  button.disabled = true;
  button.textContent = "Preparing...";

  try {
    // Notify Unsplash of the download action as required
    const trackingResponse = await fetch(
      photo.links.download_location,
      {
        headers: {
          Authorization: `Client-ID ${ACCESS_KEY}`
        }
      }
    );

    if (!trackingResponse.ok) {
      throw new Error(
        `Download preparation failed: HTTP ${trackingResponse.status}`
      );
    }

    const trackingData = await trackingResponse.json();
    const downloadUrl = trackingData.url;

    // Request the image file
    const imageResponse = await fetch(downloadUrl);

    if (!imageResponse.ok) {
      throw new Error("Unable to retrieve the image file.");
    }

    const blob = await imageResponse.blob();
    const blobUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = `pixelfind-${photo.id}.jpg`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    // Keep the temporary URL alive briefly for the download
    setTimeout(() => {
      URL.revokeObjectURL(blobUrl);
    }, 1000);

    statusMessage.textContent = "Download started!";

  } catch (error) {
    console.error("Download error:", error);

    // Fallback: open the original photo page
    statusMessage.textContent =
      "Direct download failed. Opening the photo source instead.";

    window.open(
      photo.links.html,
      "_blank",
      "noopener,noreferrer"
    );

  } finally {
    button.disabled = false;
    button.textContent = "↓ Download";
  }
}

// ==========================================
// 4. Open lightbox
// ==========================================

function openLightbox(photo) {
  lightboxImage.src = photo.urls.regular;
  lightboxImage.alt =
    photo.alt_description || "Selected photograph";

  lightboxCaption.textContent =
    `Photo by ${photo.user.name} on Unsplash`;

  lightbox.hidden = false;
  closeLightboxButton.focus();
}

// ==========================================
// 5. Close lightbox
// ==========================================

function closeLightbox() {
  lightbox.hidden = true;
  lightboxImage.src = "";
}

closeLightboxButton.addEventListener(
  "click",
  closeLightbox
);

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !lightbox.hidden) {
    closeLightbox();
  }
});

// ==========================================
// 6. Search form
// ==========================================

form.addEventListener("submit", (event) => {
  event.preventDefault();

  clearTimeout(debounceTimer);

  const query = searchInput.value.trim();

  if (!query) {
    statusMessage.textContent =
      "Please enter a search keyword.";
    return;
  }

  currentQuery = query;
  currentPage = 1;

  searchImages(query, 1);
});

// ==========================================
// 7. Debounced search while typing
// ==========================================

searchInput.addEventListener("input", () => {
  clearTimeout(debounceTimer);

  const query = searchInput.value.trim();

  if (!query) {
    if (requestController) {
      requestController.abort();
    }

    currentQuery = "";
    currentPage = 1;
    totalPages = 0;

    imageGrid.replaceChildren();
    resultsTitle.textContent = "Explore images";
    resultsCount.textContent =
      "Search for something you love.";
    statusMessage.textContent = "";
    loadMoreButton.hidden = true;

    return;
  }

  debounceTimer = setTimeout(() => {
    currentQuery = query;
    currentPage = 1;

    searchImages(query, 1);
  }, 500);
});

// ==========================================
// 8. Suggested searches
// ==========================================

document.querySelectorAll("[data-query]").forEach((button) => {
  button.addEventListener("click", () => {
    clearTimeout(debounceTimer);

    const query = button.dataset.query;

    searchInput.value = query;
    currentQuery = query;
    currentPage = 1;

    searchImages(query, 1);
  });
});

// ==========================================
// 9. Load more images
// ==========================================

loadMoreButton.addEventListener("click", () => {
  if (currentPage < totalPages && currentQuery) {
    searchImages(currentQuery, currentPage + 1);
  }
});
