$(function () {
  const $categoryDropdown = $(".category-dropdown");
  const $categoryButton = $(".category-button");
  const $categoryMenu = $(".category-menu");
  const $mobileMenuButton = $(".mobile-menu-button");
  const $primaryNavigation = $("#primary-navigation");
  const $bannerSlides = $(".main-banner-slide");
  const $bannerDots = $(".banner-dots button");
  let currentBanner = 0;
  let bannerTimer;

  function showBanner(index) {
    if (!$bannerSlides.length) {
      return;
    }

    currentBanner = (index + $bannerSlides.length) % $bannerSlides.length;

    $bannerSlides
      .removeClass("is-active")
      .filter(`[data-banner-slide="${currentBanner}"]`)
      .addClass("is-active");

    $bannerDots
      .removeClass("is-active")
      .removeAttr("aria-current")
      .filter(`[data-banner-dot="${currentBanner}"]`)
      .addClass("is-active")
      .attr("aria-current", "true");
  }

  function startBannerTimer() {
    window.clearInterval(bannerTimer);
    bannerTimer = window.setInterval(function () {
      showBanner(currentBanner + 1);
    }, 5000);
  }

  $(".banner-arrow-prev").on("click", function () {
    showBanner(currentBanner - 1);
    startBannerTimer();
  });

  $(".banner-arrow-next").on("click", function () {
    showBanner(currentBanner + 1);
    startBannerTimer();
  });

  $bannerDots.on("click", function () {
    showBanner(Number($(this).data("banner-dot")));
    startBannerTimer();
  });

  $(".main-banner").on("mouseenter focusin", function () {
    window.clearInterval(bannerTimer);
  }).on("mouseleave focusout", function () {
    startBannerTimer();
  });

  startBannerTimer();

  let tripleBannerIndex = 0;
  const tripleBannerMaxIndex = 3;

  function updateTripleBanner() {
    $(".triple-banner-track").css("transform", `translateX(-${tripleBannerIndex * 435}px)`);
  }

  $(".triple-banner-prev").on("click", function () {
    tripleBannerIndex = tripleBannerIndex === 0 ? tripleBannerMaxIndex : tripleBannerIndex - 1;
    updateTripleBanner();
  });

  $(".triple-banner-next").on("click", function () {
    tripleBannerIndex = tripleBannerIndex === tripleBannerMaxIndex ? 0 : tripleBannerIndex + 1;
    updateTripleBanner();
  });

  $(".scroll-top-button").on("click", function () {
    $("html, body").stop(true).animate({ scrollTop: 0 }, 500);
  });

  $(".options-tab").on("click", function () {
    const isActive = !$(this).hasClass("is-active");
    $(this).toggleClass("is-active", isActive).attr("aria-pressed", isActive);
  });

  const saleProducts = Array.from({ length: 10 }, function (_, index) {
    return {
      id: index + 1,
      brand: "Cocoon",
      name: "COMBO Cocoon Tẩy da chết cà phê Đak Lak (200ml)...",
      salePrice: "139,000₫",
      originalPrice: "305,000₫",
      rating: 5
    };
  });

  const $saleGrid = $(".sale-product-grid");

  $.each(saleProducts, function (_, product) {
    const productKey = `sale-${product.id}`;
    const $card = $("<article>", { class: "sale-product-card", "data-product-key": productKey });
    const $image = $("<div>", { class: "sale-product-image", "aria-label": `Ảnh ${product.name}` });
    const $info = $("<div>", { class: "sale-product-info" });
    const $rating = $("<div>", { class: "sale-product-rating", "aria-label": `${product.rating} trên 5 sao` });

    for (let star = 0; star < product.rating; star += 1) {
      $rating.append($("<i>", { class: "bi bi-star-fill", "aria-hidden": "true" }));
    }

    const $price = $("<div>", { class: "sale-product-price" })
      .append($("<strong>", { text: product.salePrice }))
      .append($("<del>", { text: product.originalPrice }));

    const $addButton = $("<button>", {
      class: "sale-add-cart",
      type: "button",
      "data-product-id": product.id,
      "aria-label": `Thêm ${product.name} vào giỏ hàng`
    }).append($("<i>", { class: "bi bi-basket2-fill", "aria-hidden": "true" }));
    const $favoriteButton = createFavoriteButton(product.name, "sale-favorite-button", productKey);

    $info
      .append($("<p>", { class: "sale-product-brand", text: product.brand }))
      .append($("<h3>", { class: "sale-product-name", text: product.name }))
      .append($rating)
      .append($price)
      .append($favoriteButton)
      .append($addButton);

    $card.append($image, $info);
    $saleGrid.append($card);
  });

  let cartCount = 0;
  let cartItems = [];
  let favoriteProducts = [];

  function createFavoriteButton(productName, extraClass, productKey) {
    return $("<button>", {
      class: `product-favorite-button ${extraClass || ""}`,
      type: "button",
      "data-product-key": productKey || "",
      "aria-pressed": "false",
      "aria-label": `Thêm ${productName} vào yêu thích`
    }).append($("<img>", {
      src: "assets/Icon/icon thêm vào yêu thích.png",
      alt: "",
      "aria-hidden": "true"
    }));
  }

  function createStoreProductCard(product, config) {
    const options = $.extend({
      cardClass: "sale-product-card",
      imageClass: "sale-product-image",
      infoClass: "sale-product-info",
      brandClass: "sale-product-brand",
      nameClass: "sale-product-name",
      ratingClass: "sale-product-rating",
      priceClass: "sale-product-price",
      addClass: "sale-add-cart",
      favoriteClass: "sale-favorite-button",
      actionsClass: ""
    }, config || {});
    const productKey = product.id || getFavoriteKey(product.name);
    const $card = $("<article>", { class: options.cardClass, "data-product-key": productKey });
    const $image = $("<div>", { class: options.imageClass, "aria-label": `Ảnh ${product.name}` });
    const $info = $("<div>", { class: options.infoClass });
    const $rating = $("<div>", { class: options.ratingClass, "aria-label": `${product.rating} trên 5 sao` });

    for (let star = 0; star < product.rating; star += 1) {
      $rating.append($("<i>", { class: "bi bi-star-fill", "aria-hidden": "true" }));
    }

    const $price = $("<div>", { class: options.priceClass })
      .append($("<strong>", { text: product.salePrice }))
      .append($("<del>", { text: product.originalPrice }));
    const $favoriteButton = createFavoriteButton(product.name, options.favoriteClass, productKey);
    const $addButton = $("<button>", {
      class: options.addClass,
      type: "button",
      "data-product-id": productKey,
      "aria-label": `Thêm ${product.name} vào giỏ hàng`
    }).append($("<i>", { class: "bi bi-basket2-fill", "aria-hidden": "true" }));
    const actionNodes = options.actionsClass
      ? $("<div>", { class: options.actionsClass }).append($favoriteButton, $addButton)
      : [$favoriteButton, $addButton];

    $info
      .append($("<p>", { class: options.brandClass, text: product.brand }))
      .append($("<h3>", { class: options.nameClass, text: product.name }))
      .append($rating)
      .append($price)
      .append(actionNodes);

    $card.append($image, $info);
    return $card;
  }

  function parsePriceValue(priceText) {
    return Number(String(priceText || "").replace(/[^\d]/g, "")) || 139000;
  }

  function formatVnd(value) {
    return `${Number(value || 0).toLocaleString("vi-VN")}đ`;
  }

  function getCartTotals(shippingOverride) {
    const hasItems = cartItems.length > 0;
    const subtotal = cartItems.reduce(function (total, item) {
      return total + item.price * item.quantity;
    }, 0);
    const shipping = hasItems ? (Number(shippingOverride) || 15000) : 0;
    const discount = hasItems ? 15000 : 0;
    const total = Math.max(0, subtotal + shipping - discount);

    return { hasItems, subtotal, shipping, discount, total };
  }

  function getProductFromCardButton($button) {
    const $card = $button.closest("article");
    const name = $.trim($card.find("h3").first().text()) || "COMBO Cocoon Tẩy da chết cà phê Đak Lak (200ml)...";
    const priceText = $.trim($card.find("strong").first().text()) || "139.000đ";

    return {
      key: $card.data("product-key") || $button.data("product-id") || getFavoriteKey(name),
      brand: $.trim($card.find("p").first().text()) || "COCOON",
      name,
      price: parsePriceValue(priceText)
    };
  }

  function getDetailProduct() {
    const name = $.trim($("#product-detail-title").text()) || "COMBO Cocoon Tẩy da chết cà phê Đak Lak (200ml)...";

    return {
      key: getFavoriteKey(name),
      brand: $.trim($(".product-detail-brand").text()) || "Cocoon",
      name,
      price: parsePriceValue($(".product-detail-price strong").text())
    };
  }

  function updateCartCount() {
    cartCount = cartItems.reduce(function (total, item) {
      return total + item.quantity;
    }, 0);

    $("#cart-count").text(cartCount);
  }

  function renderCartPage() {
    const $cartItems = $("[data-cart-items]");
    const totals = getCartTotals();

    $cartItems.empty();
    $("[data-cart-page-empty]").prop("hidden", totals.hasItems);
    $("[data-cart-page-count]").text(cartCount);
    $("[data-cart-selected-count]").text(cartCount);
    $("[data-cart-subtotal]").text(formatVnd(totals.subtotal));
    $("[data-cart-shipping]").text(formatVnd(totals.shipping));
    $("[data-cart-discount]").text(totals.hasItems ? `-${formatVnd(totals.discount)}` : "0đ");
    $("[data-cart-total]").text(formatVnd(totals.total));

    $.each(cartItems, function (_, item) {
      const $item = $("<article>", { class: "cart-item", "data-cart-key": item.key });

      $item
        .append($("<div>", { class: "cart-item-image" }))
        .append(
          $("<div>", { class: "cart-item-info" })
            .append($("<h3>", { text: item.name }))
            .append(
              $("<div>", { class: "cart-item-meta" })
                .append($("<span>").append("Đơn giá: ").append($("<strong>", { text: formatVnd(item.price) })))
            )
            .append($("<button>", { class: "cart-item-remove", type: "button", "aria-label": "Xóa sản phẩm" })
              .append($("<i>", { class: "bi bi-trash-fill", "aria-hidden": "true" })))
        )
        .append(
          $("<div>", { class: "cart-item-quantity" })
            .append($("<button>", { type: "button", "data-cart-minus": "", text: "−" }))
            .append($("<span>", { text: item.quantity }))
            .append($("<button>", { type: "button", "data-cart-plus": "", text: "+" }))
        )
        .append($("<div>", { class: "cart-item-price" }).append("Tạm tính").append($("<strong>", { text: formatVnd(item.price * item.quantity) })))
        .append($("<input>", { class: "cart-item-check", type: "checkbox", checked: true, "aria-label": "Chọn sản phẩm" }));

      $cartItems.append($item);
    });

    $("[data-cart-select-all]").prop("checked", totals.hasItems);
  }

  function renderCheckoutPage() {
    const selectedShipping = $('input[name="checkout-delivery"]:checked').val();
    const totals = getCartTotals(selectedShipping);
    const $preview = $("[data-checkout-cart-preview]");

    $preview.empty();

    if (!cartItems.length) {
      $preview.append($("<p>", { class: "cart-page-empty", text: "Giỏ hàng của bạn đang trống." }));
    } else {
      const firstItem = cartItems[0];

      $preview.append(
        $("<article>", { class: "checkout-cart-item" })
          .append($("<div>", { class: "checkout-cart-image" }))
          .append(
            $("<div>", { class: "checkout-cart-info" })
              .append($("<h3>", { text: firstItem.name }))
              .append($("<p>", { text: `Số lượng: ${String(cartCount).padStart(2, "0")}` }))
              .append($("<p>").append("Thành tiền: ").append($("<strong>", { text: formatVnd(totals.subtotal) })))
          )
      );
    }

    $("[data-checkout-cart-count]").text(cartCount);
    $("[data-checkout-cart-total]").text(formatVnd(totals.subtotal));
    $("[data-checkout-selected-count]").text(String(cartCount).padStart(2, "0"));
    $("[data-checkout-subtotal]").text(formatVnd(totals.subtotal));
    $("[data-checkout-shipping]").text(formatVnd(totals.shipping));
    $("[data-checkout-discount]").text(totals.hasItems ? `-${formatVnd(totals.discount)}` : "0đ");
    $("[data-checkout-total]").text(formatVnd(totals.total));
  }

  function addCartProduct(product, quantity) {
    const amount = Math.max(1, Number(quantity) || 1);
    const existing = cartItems.find(function (item) {
      return item.key === product.key;
    });

    if (existing) {
      existing.quantity += amount;
    } else {
      cartItems.push({
        ...product,
        quantity: amount
      });
    }

    updateCartCount();
    renderCartPage();
  }

  function getFavoriteKey(productName) {
    return String(productName || "").trim().toLowerCase();
  }

  function getProductFromFavoriteButton($button) {
    if ($button.hasClass("product-detail-favorite-button")) {
      const detailProduct = getDetailProduct();

      return {
        key: detailProduct.key,
        brand: detailProduct.brand,
        name: detailProduct.name,
        salePrice: formatVnd(detailProduct.price),
        originalPrice: $.trim($(".product-detail-price del").first().text()) || "305,000đ",
        rating: 5
      };
    }

    const $card = $button.closest("article");

    if (!$card.length) {
      const detailProduct = getDetailProduct();

      return {
        key: detailProduct.key,
        brand: detailProduct.brand,
        name: detailProduct.name,
        salePrice: formatVnd(detailProduct.price),
        originalPrice: $.trim($(".product-detail-price del").first().text()) || "305,000đ",
        rating: 5
      };
    }

    const productName = $.trim($card.find("h3").first().text());
    const brand = $.trim($card.find("p").first().text()) || "COCOON";
    const salePrice = $.trim($card.find("strong").first().text()) || "139,000₫";
    const originalPrice = $.trim($card.find("del").first().text()) || "305,000₫";
    const rating = Math.max($card.find(".bi-star-fill").length, 5);

    return {
      key: $button.data("product-key") || $card.data("product-key") || getFavoriteKey(productName),
      brand,
      name: productName,
      salePrice,
      originalPrice,
      rating
    };
  }

  function updateFavoriteCount() {
    const favoriteCount = favoriteProducts.length;

    $("[data-favorite-count]").text(favoriteCount);
    $("[data-favorites-empty]").prop("hidden", favoriteCount > 0);
    $(".account-favorites-actions").toggleClass("is-hidden", favoriteCount === 0);
  }

  function syncFavoriteButtons(productKey, isFavorite) {
    $(".product-favorite-button").each(function () {
      const $button = $(this);
      const buttonProduct = getProductFromFavoriteButton($button);

      if (buttonProduct.key === productKey) {
        $button
          .toggleClass("is-favorite", isFavorite)
          .attr("aria-pressed", isFavorite ? "true" : "false");
      }
    });
  }

  function createAccountFavoriteCard(product) {
    const $card = $("<article>", { class: "account-favorite-card", "data-favorite-key": product.key });
    const $check = $("<label>", { class: "account-favorite-check" })
      .append($("<input>", { type: "checkbox", "aria-label": "Chọn sản phẩm yêu thích" }));
    const $image = $("<div>", { class: "account-favorite-image", "aria-label": `Ảnh ${product.name}` });
    const $info = $("<div>", { class: "account-favorite-info" });
    const $rating = $("<div>", { class: "account-favorite-rating", "aria-label": `${product.rating} trên 5 sao` });

    for (let star = 0; star < product.rating; star += 1) {
      $rating.append($("<i>", { class: "bi bi-star-fill", "aria-hidden": "true" }));
    }

    $info
      .append($("<p>", { text: product.brand }))
      .append($("<h3>", { text: product.name }))
      .append($rating)
      .append(
        $("<div>", { class: "account-favorite-price" })
          .append($("<strong>", { text: product.salePrice }))
          .append($("<del>", { text: product.originalPrice }))
      );

    const $removeButton = $("<button>", {
      class: "account-favorite-remove",
      type: "button",
      "aria-label": "Bỏ sản phẩm khỏi yêu thích"
    }).append($("<i>", { class: "bi bi-heart-fill", "aria-hidden": "true" }));

    return $card.append($check, $image, $info, $removeButton);
  }

  function renderFavoriteProducts() {
    const $favoriteGrid = $(".account-favorites-grid");

    $favoriteGrid.empty();

    $.each(favoriteProducts, function (_, product) {
      $favoriteGrid.append(createAccountFavoriteCard(product));
    });

    updateFavoriteCount();
  }

  updateCartCount();
  renderFavoriteProducts();

  $saleGrid.on("click", ".sale-add-cart", function () {
    addCartProduct(getProductFromCardButton($(this)), 1);

    $(this).addClass("is-added");
    window.setTimeout(() => $(this).removeClass("is-added"), 300);
  });

  const topProducts = Array.from({ length: 12 }, function (_, index) {
    return {
      id: `top-${index + 1}`,
      brand: "Cocoon",
      name: "COMBO Cocoon Tẩy da chết cà phê Đak Lak (200ml) (IP07) + ...",
      salePrice: "139,000₫",
      originalPrice: "305,000₫",
      rating: 5
    };
  });

  const $topProductGrid = $(".top-product-grid");
  let topProductStart = 0;

  function renderTopProducts() {
    $topProductGrid.empty();

    for (let offset = 0; offset < 6; offset += 1) {
      const product = topProducts[(topProductStart + offset) % topProducts.length];
      $topProductGrid.append(createStoreProductCard(product, {
        cardClass: "top-product-card",
        imageClass: "top-product-image",
        infoClass: "top-product-info",
        brandClass: "top-product-brand",
        nameClass: "top-product-name",
        ratingClass: "top-product-rating",
        priceClass: "top-product-price",
        addClass: "top-add-cart",
        favoriteClass: "top-favorite-button"
      }));
    }
  }

  renderTopProducts();

  $(".top-product-prev").on("click", function () {
    topProductStart = (topProductStart - 3 + topProducts.length) % topProducts.length;
    renderTopProducts();
  });

  $(".top-product-next").on("click", function () {
    topProductStart = (topProductStart + 3) % topProducts.length;
    renderTopProducts();
  });

  $(".top-sale-tabs button").on("click", function () {
    const tabIndex = $(this).index();
    $(".top-sale-tabs button").removeClass("is-active").removeAttr("aria-current");
    $(this).addClass("is-active").attr("aria-current", "true");
    topProductStart = (tabIndex * 2) % topProducts.length;
    renderTopProducts();
  });

  $topProductGrid.on("click", ".top-add-cart", function () {
    addCartProduct(getProductFromCardButton($(this)), 1);

    $(this).addClass("is-added");
    window.setTimeout(() => $(this).removeClass("is-added"), 300);
  });

  const beautyCategories = ["makeup", "skincare", "bodycare"];
  const beautyProducts = Array.from({ length: 45 }, function (_, index) {
    return {
      id: `beauty-${index + 1}`,
      category: beautyCategories[Math.floor(index / 15)],
      brand: "Cocoon",
      name: "COMBO Cocoon Tẩy da chết cà phê Đak Lak (200ml)...",
      salePrice: "139,000đ",
      originalPrice: "305,000đ",
      rating: 5
    };
  });

  const $beautyProductGrid = $(".beauty-product-grid");

  function renderBeautyProducts(category) {
    const products = beautyProducts.filter((product) => product.category === category).slice(0, 15);
    $beautyProductGrid.empty();

    $.each(products, function (_, product) {
      $beautyProductGrid.append(createStoreProductCard(product));
    });
  }

  renderBeautyProducts("makeup");

  $(".beauty-showcase-tabs > button").on("click", function () {
    $(".beauty-showcase-tabs > button")
      .removeClass("is-active")
      .attr("aria-selected", "false");

    $(this).addClass("is-active").attr("aria-selected", "true");
    renderBeautyProducts($(this).data("beauty-category"));
  });

  $beautyProductGrid.on("click", ".sale-add-cart", function () {
    addCartProduct(getProductFromCardButton($(this)), 1);

    $(this).addClass("is-added");
    window.setTimeout(() => $(this).removeClass("is-added"), 300);
  });

  let saleRemainingSeconds = (10 * 60 * 60) + (10 * 60) + 10;

  function updateSaleCountdown() {
    const hours = Math.floor(saleRemainingSeconds / 3600);
    const minutes = Math.floor((saleRemainingSeconds % 3600) / 60);
    const seconds = saleRemainingSeconds % 60;

    $("#sale-hours").text(String(hours).padStart(2, "0"));
    $("#sale-minutes").text(String(minutes).padStart(2, "0"));
    $("#sale-seconds").text(String(seconds).padStart(2, "0"));

    if (saleRemainingSeconds > 0) {
      saleRemainingSeconds -= 1;
    }
  }

  updateSaleCountdown();
  window.setInterval(updateSaleCountdown, 1000);

  const megaMenuPanels = {
    makeup: [
      {
        title: "MẶT",
        left: 30,
        items: ["Kem nền - BB Cream", "Cushion - Phấn nước", "Phấn nền - Phấn phủ", "Che khuyết điểm", "Má hồng", "Kem lót", "Tạo khối", "Xịt khóa nền"]
      },
      {
        title: "MẮT - CHÂN MÀY",
        left: 249,
        items: ["Chì kẻ mày", "Mascara", "Kẻ mắt - Eyeliner", "Phấn mắt"]
      },
      {
        title: "MÔI",
        left: 444,
        items: ["Son môi", "Son dưỡng"]
      },
      {
        title: "PHỤ KIỆN TRANG ĐIỂM",
        left: 639,
        items: ["Dụng cụ trang điểm khác", "Bông mút trang điểm", "Cọ trang điểm"]
      }
    ],
    skincare: [
      {
        title: "LÀM SẠCH",
        left: 30,
        items: ["Tẩy trang", "Sữa rửa mặt", "Tẩy tế bào chết", "Nước hoa hồng / Toner", "Xịt khoáng", "Kem lót", "Tạo khối", "Xịt khóa nền"]
      },
      {
        title: "DƯỠNG DA",
        left: 249,
        items: ["Serum / Tinh chất", "Kem dưỡng ẩm", "Kem dưỡng trắng", "Kem chống lão hóa", "Mặt nạ dưỡng da", "Dầu dưỡng da"]
      },
      {
        title: "ĐẶC TRỊ",
        left: 444,
        items: ["Trị mụn", "Trị thâm", "Trị nám", "Se khít lỗ chân lông", "Phục hồi da", "Dưỡng mắt"]
      },
      {
        title: "CHỐNG NẮNG",
        left: 639,
        items: ["Kem chống nắng", "Chống nắng dạng gel", "Chống nắng dạng xịt", "Chống nắng nâng tone"]
      }
    ],
    bodycare: [
      {
        title: "LÀM SẠCH CƠ THỂ",
        left: 30,
        items: ["Sữa tắm", "Xà phòng tắm", "Tẩy tế bào chết body", "Muối tắm", "Dung dịch vệ sinh", "Kem lót", "Tạo khối", "Xịt khóa nền"]
      },
      {
        title: "DƯỠNG THỂ",
        left: 239,
        items: ["Sữa dưỡng thể", "Kem dưỡng body", "Dầu dưỡng thể", "Dưỡng trắng body", "Dưỡng da tay", "Dưỡng da chân"]
      },
      {
        title: "KHỬ MÙI",
        left: 428,
        items: ["Lăn khử mùi", "Xịt khử mùi", "Sáp khử mùi", "Nước hoa body mist"]
      },
      {
        title: "CHĂM SÓC KHÁC",
        left: 627,
        items: ["Kem chống nắng body", "Kem tẩy lông", "Dao cạo", "Sản phẩm massage"]
      }
    ],
    haircare: [
      {
        title: "LÀM SẠCH TÓC",
        left: 30,
        items: ["Dầu gội", "Dầu xả", "Dầu gội khô", "Tẩy tế bào chết da đầu"]
      },
      {
        title: "DƯỠNG TÓC",
        left: 253,
        items: ["Kem ủ tóc", "Serum dưỡng tóc", "Dầu dưỡng tóc", "Xịt dưỡng tóc", "Mặt nạ tóc"]
      },
      {
        title: "TẠO KIỂU",
        left: 434,
        items: ["Sáp vuốt tóc", "Gel vuốt tóc", "Gôm xịt tóc", "Xịt giữ nếp", "Keo tạo kiểu"]
      },
      {
        title: "ĐẶC TRỊ TÓC",
        left: 588,
        items: ["Trị gàu", "Trị rụng tóc", "Kích thích mọc tóc", "Phục hồi tóc hư tổn", "Chăm sóc da đầu"]
      }
    ],
    tools: [
      {
        title: "CỌ TRANG ĐIỂM",
        left: 30,
        items: ["Cọ nền", "Cọ phấn phủ", "Cọ má hồng", "Cọ mắt", "Cọ môi", "Bộ cọ trang điểm"]
      },
      {
        title: "DỤNG CỤ TRANG ĐIỂM",
        left: 223,
        items: ["Bông mút trang điểm", "Bông phấn", "Kẹp mi", "Nhíp", "Gương trang điểm", "Hộp đựng mỹ phẩm"]
      },
      {
        title: "DỤNG CỤ CHĂM SÓC DA",
        left: 463,
        items: ["Máy rửa mặt", "Cây lăn mặt", "Dụng cụ nặn mụn", "Bông tẩy trang", "Mặt nạ giấy nén"]
      },
      {
        title: "DỤNG CỤ LÀM TÓC",
        left: 718,
        items: ["Lược", "Máy sấy tóc", "Máy uốn tóc", "Máy duỗi tóc", "Kẹp tóc"]
      }
    ],
    accessories: [
      {
        title: "PHỤ KIỆN LÀM ĐẸP",
        left: 30,
        items: ["Bông tẩy trang", "Tăm bông", "Khăn mặt", "Băng đô rửa mặt", "Gương mini", "Túi đựng mỹ phẩm"]
      },
      {
        title: "PHỤ KIỆN TÓC",
        left: 267,
        items: ["Kẹp tóc", "Dây buộc tóc", "Băng đô", "Lược chải tóc", "Kẹp càng cua", "Mũ trùm tóc"]
      },
      {
        title: "PHỤ KIỆN CƠ THỂ",
        left: 492,
        items: ["Bông tắm", "Găng tay tẩy tế bào chết", "Đá chà gót chân", "Miếng dán giữ nhiệt", "Bàn chải cơ thể"]
      },
      {
        title: "TIỆN ÍCH DU LỊCH",
        left: 760,
        items: ["Chai chiết mỹ phẩm", "Hộp đựng lens", "Túi zip mỹ phẩm", "Bộ chiết du lịch", "Hộp đựng trang sức"]
      }
    ],
    men: [
      {
        title: "CHĂM SÓC DA NAM",
        left: 30,
        items: ["Sữa rửa mặt nam", "Kem dưỡng da nam", "Kem chống nắng nam", "Trị mụn nam", "Toner nam"]
      },
      {
        title: "CHĂM SÓC RÂU",
        left: 248,
        items: ["Dao cạo râu", "Bọt cạo râu", "Gel cạo râu", "Dưỡng sau cạo râu", "Máy cạo râu"]
      },
      {
        title: "CHĂM SÓC TÓC NAM",
        left: 441,
        items: ["Dầu gội nam", "Sáp vuốt tóc", "Gel vuốt tóc", "Gôm xịt tóc", "Dầu dưỡng tóc nam"]
      },
      {
        title: "CƠ THỂ & MÙI HƯƠNG",
        left: 670,
        items: ["Sữa tắm nam", "Lăn khử mùi nam", "Nước hoa nam", "Body mist nam"]
      }
    ],
    brands: [
      {
        title: "THƯƠNG HIỆU NỔI BẬT",
        left: 30,
        items: ["Maybelline", "L’Oréal", "3CE", "Romand", "Innisfree", "Some By Mi", "La Roche-Posay", "Cocoon"]
      },
      {
        title: "THƯƠNG HIỆU HÀN QUỐC",
        left: 268,
        items: ["Laneige", "Innisfree", "The Face Shop", "Etude", "Skin1004", "Cosrx", "Beauty of Joseon"]
      },
      {
        title: "THƯƠNG HIỆU ÂU - MỸ",
        left: 530,
        items: ["L’Oréal", "Maybelline", "CeraVe", "La Roche-Posay", "Bioderma", "Eucerin", "Neutrogena"]
      },
      {
        title: "THƯƠNG HIỆU VIỆT NAM",
        left: 768,
        items: ["Cocoon", "Lemonade", "Cỏ Mềm", "Thorakao", "Herbario", "Skinlosophy"]
      }
    ]
  };

  const mobileCategoryLabels = {
    makeup: "Trang điểm",
    skincare: "Chăm sóc da",
    bodycare: "Chăm sóc cơ thể",
    haircare: "Chăm sóc tóc",
    tools: "Tools & Brushes",
    accessories: "Phụ kiện",
    men: "Dành cho nam",
    brands: "Tất cả thương hiệu"
  };

  const $mobileCategoryAccordion = $("<div>", {
    class: "mobile-category-accordion",
    "aria-label": "Danh mục sản phẩm trên điện thoại"
  });
  const $mobileMenuOverlay = $("<button>", {
    class: "mobile-menu-overlay",
    type: "button",
    "aria-label": "Đóng menu"
  });
  const $mobileMenuHeader = $("<div>", { class: "mobile-drawer-header" })
    .append(
      $("<button>", {
        class: "mobile-drawer-close",
        type: "button",
        "aria-label": "Quay lại"
      }).append($("<i>", { class: "bi bi-chevron-left", "aria-hidden": "true" }))
    )
    .append($("<strong>", { text: "Menu" }))
    .append($("<span>", { "aria-hidden": "true" }));
  const $mobileAccountPanel = $("<div>", {
    class: "mobile-drawer-account",
    role: "group",
    "aria-label": "Tài khoản"
  })
    .append($("<i>", { class: "bi bi-person-circle", "aria-hidden": "true" }))
    .append(
      $("<span>")
        .append($("<small>", { text: "TÀI KHOẢN" }))
        .append(
          $("<strong>")
            .append($("<button>", { type: "button", "data-mobile-auth": "login", text: "Đăng nhập" }))
            .append($("<span>", { text: " / " }))
            .append($("<button>", { type: "button", "data-mobile-auth": "register", text: "Đăng ký" }))
        )
    );
  const $mobileCategoryMaster = $("<button>", {
    class: "mobile-category-master",
    type: "button",
    "aria-expanded": "false"
  })
    .append($("<span>", { text: "Danh mục sản phẩm" }))
    .append($("<span>", { class: "mobile-accordion-icon", text: "+", "aria-hidden": "true" }));
  const $mobileCategoryBody = $("<div>", {
    class: "mobile-category-body",
    hidden: true
  });

  $.each(mobileCategoryLabels, function (panelName, label) {
    const panelId = `mobile-category-panel-${panelName}`;
    const $section = $("<section>", { class: "mobile-category-section" });
    const $row = $("<div>", { class: "mobile-category-row" });
    const $link = $("<button>", {
      class: "mobile-category-link",
      type: "button",
      "data-mobile-category-link": panelName,
      text: label
    });
    const $toggle = $("<button>", {
      class: "mobile-category-toggle",
      type: "button",
      "aria-expanded": "false",
      "aria-controls": panelId,
      "aria-label": `Mở ${label}`
    })
      .append($("<span>", { class: "mobile-accordion-icon", text: "+", "aria-hidden": "true" }));
    const $panel = $("<div>", {
      id: panelId,
      class: "mobile-category-panel",
      hidden: true
    });

    $.each(megaMenuPanels[panelName] || [], function (columnIndex, column) {
      const $group = $("<div>", { class: "mobile-category-group" });
      $group.append($("<h3>", { text: column.title }));

      $.each(column.items, function (itemIndex, item) {
        $group.append($("<a>", {
          href: `#${panelName}`,
          "data-mobile-subcategory": `${columnIndex}-${itemIndex}`,
          text: item
        }));
      });

      $panel.append($group);
    });

    $row.append($link, $toggle);
    $section.append($row, $panel);
    $mobileCategoryBody.append($section);
  });

  $mobileCategoryAccordion.append($mobileCategoryMaster, $mobileCategoryBody);
  const $mobileDrawerLinks = $("<nav>", {
    class: "mobile-drawer-links",
    "aria-label": "Liên kết hỗ trợ"
  });

  [
    ["Hotline: 1900 1900", "tel:19001900"],
    ["Tra cứu đơn hàng", "#order-lookup"],
    ["Hệ thống cửa hàng", "#stores"],
    ["Beauty Tips", "#beauty-tips"]
  ].forEach(function (link) {
    $mobileDrawerLinks.append(
      $("<a>", { href: link[1] })
        .append($("<span>", { text: link[0] }))
        .append($("<i>", { class: "bi bi-chevron-right", "aria-hidden": "true" }))
    );
  });

  $(".category-container").append(
    $mobileMenuHeader,
    $mobileAccountPanel,
    $mobileCategoryAccordion,
    $mobileDrawerLinks
  );
  $mobileMenuOverlay.insertBefore($primaryNavigation);

  function setMobileDrawer(open) {
    $primaryNavigation.toggleClass("is-open", open);
    if (window.matchMedia("(max-width: 767.98px)").matches) {
      $primaryNavigation.attr("aria-hidden", open ? "false" : "true");
    } else {
      $primaryNavigation.removeAttr("aria-hidden");
    }
    $mobileMenuOverlay.toggleClass("is-open", open);
    $("body").toggleClass("mobile-menu-open", open);
    $mobileMenuButton
      .attr("aria-expanded", open)
      .attr("aria-label", open ? "Đóng menu" : "Mở menu")
      .find("i")
      .toggleClass("bi-list", !open)
      .toggleClass("bi-x-lg", open);

    if (open && $mobileCategoryMaster.attr("aria-expanded") !== "true") {
      $mobileCategoryMaster.attr("aria-expanded", "true").find(".mobile-accordion-icon").text("−");
      $mobileCategoryBody.prop("hidden", false).show();
    }
  }

  $mobileMenuOverlay.add($mobileMenuHeader.find(".mobile-drawer-close")).on("click", function () {
    setMobileDrawer(false);
  });

  $mobileDrawerLinks.on("click", "a", function () {
    setMobileDrawer(false);
  });

  function setMobileAccordionPanel($button, open) {
    const panelId = $button.attr("aria-controls");
    const $panel = panelId ? $(`#${panelId}`) : $button.next(".mobile-category-body");
    const $section = $button.closest(".mobile-category-section");

    $button
      .attr("aria-expanded", open)
      .find(".mobile-accordion-icon")
      .text(open ? "−" : "+");

    $section.toggleClass("is-open", open);
    $panel.stop(true, true);

    if (open) {
      $panel
        .prop("hidden", false)
        .attr("aria-hidden", "false")
        .css("display", "block");
    } else {
      $panel
        .prop("hidden", true)
        .attr("aria-hidden", "true")
        .css("display", "none");
    }
  }

  $mobileCategoryAccordion.on("click", ".mobile-category-master", function () {
    setMobileAccordionPanel($(this), $(this).attr("aria-expanded") !== "true");
  });

  $mobileCategoryAccordion.on("click", ".mobile-category-link", function () {
    const categoryKey = $(this).data("mobile-category-link");
    setMobileDrawer(false);
    openListingPage(categoryKey);
  });

  $mobileCategoryAccordion.on("click", ".mobile-category-toggle", function () {
    const $currentButton = $(this);
    const shouldOpen = $currentButton.attr("aria-expanded") !== "true";

    $mobileCategoryAccordion.find(".mobile-category-toggle").each(function () {
      const $button = $(this);
      if (!$button.is($currentButton)) {
        setMobileAccordionPanel($button, false);
      }
    });

    setMobileAccordionPanel($currentButton, shouldOpen);
  });

  const $megaMenuContent = $(".mega-menu-content");

  $.each(megaMenuPanels, function (panelName, columns) {
    const $panel = $("<div>", {
      class: `mega-menu-panel${panelName === "makeup" ? " is-active" : ""}`,
      "data-menu-panel": panelName
    });

    $.each(columns, function (columnIndex, column) {
      const headingId = `${panelName}-column-${columnIndex}`;
      const $column = $("<section>", {
        class: "mega-menu-column",
        "aria-labelledby": headingId
      }).css("--column-left", `${column.left}px`);

      $column.append($("<h2>", { id: headingId, text: column.title }));

      $.each(column.items, function (itemIndex, item) {
        $column.append($("<a>", {
          href: `#${panelName}-${columnIndex}-${itemIndex}`,
          text: item
        }));
      });

      $panel.append($column);
    });

    $megaMenuContent.append($panel);
  });

  function activateMegaMenu(panelName) {
    $(".mega-menu-tab")
      .removeClass("is-active")
      .removeAttr("aria-current")
      .filter(`[data-menu-target="${panelName}"]`)
      .addClass("is-active")
      .attr("aria-current", "page");

    $(".mega-menu-panel")
      .removeClass("is-active")
      .filter(`[data-menu-panel="${panelName}"]`)
      .addClass("is-active");
  }

  $(".mega-menu-tab").on("mouseenter focusin click", function (event) {
    if (event.type === "click") {
      event.preventDefault();
    }

    activateMegaMenu($(this).data("menu-target"));
  });

  $(".category-links a").on("mouseenter focusin", function () {
    if (!window.matchMedia("(min-width: 992px)").matches) {
      return;
    }

    const panelName = ($(this).attr("href") || "").replace("#", "");

    if ($(`.mega-menu-panel[data-menu-panel="${panelName}"]`).length) {
      $categoryMenu.addClass("is-content-only");
      activateMegaMenu(panelName);
      setCategoryMenu(true);
    } else {
      setCategoryMenu(false);
    }
  });

  $(".category-nav").on("mouseleave", function () {
    if (window.matchMedia("(min-width: 992px)").matches) {
      setCategoryMenu(false);
    }
  });

  function setCategoryMenu(open) {
    $categoryMenu.stop(true, true)[open ? "slideDown" : "slideUp"](160);
    $categoryButton.attr("aria-expanded", open);
  }

  $categoryButton.on("mouseenter focusin", function () {
    if (window.matchMedia("(min-width: 992px)").matches) {
      $categoryMenu.removeClass("is-content-only");
      setCategoryMenu(true);
    }
  });

  $categoryDropdown.on("mouseleave focusout", function (event) {
    if (!$.contains(this, event.relatedTarget)) {
      setCategoryMenu(false);
    }
  });

  $categoryButton.on("click", function () {
    const wasContentOnly = $categoryMenu.hasClass("is-content-only");
    const wasOpen = $(this).attr("aria-expanded") === "true";

    $categoryMenu.removeClass("is-content-only");
    setCategoryMenu(!wasOpen || wasContentOnly);
  });

  $(document).on("click", function (event) {
    if (!$(event.target).closest(".category-dropdown, .category-links").length) {
      setCategoryMenu(false);
    }
  });

  $(document).on("keydown", function (event) {
    if (event.key === "Escape" && $categoryButton.attr("aria-expanded") === "true") {
      setCategoryMenu(false);
      $categoryButton.trigger("focus");
    }
  });

  $mobileMenuButton.on("click", function () {
    const isOpen = !$primaryNavigation.hasClass("is-open");
    setMobileDrawer(isOpen);
  });

  $(document).on("keydown", function (event) {
    if (event.key === "Escape" && $primaryNavigation.hasClass("is-open")) {
      setMobileDrawer(false);
      $mobileMenuButton.trigger("focus");
    }
  });

  $(".search-form").on("submit", function (event) {
    event.preventDefault();
    const $input = $(this).find("input");
    const $message = $(this).find(".search-message");
    const keyword = $.trim($input.val());

    if (!keyword) {
      $message.text("Vui lòng nhập từ khóa tìm kiếm.").stop(true, true).fadeIn(150);
      $input.trigger("focus");
      return;
    }

    $message.text(`Đang tìm kiếm: ${keyword}`).stop(true, true).fadeIn(150).delay(1200).fadeOut(200);
  });

  $("#site-search").on("input", function () {
    if ($.trim($(this).val())) {
      $(this).siblings(".search-message").stop(true, true).fadeOut(100);
    }
  });

  $(".newsletter-form").on("submit", function (event) {
    event.preventDefault();

    const $email = $(this).find("input[type='email']");
    const $status = $(this).find(".newsletter-status");
    const email = $.trim($email.val());

    if (!email) {
      $status.text("Vui lòng nhập email của bạn.");
      $email.trigger("focus");
      return;
    }

    if (!$email[0].checkValidity()) {
      $status.text("Email chưa đúng định dạng.");
      $email.trigger("focus");
      return;
    }

    $status.text("Đăng ký nhận bản tin thành công.");
    $email.val("");
  });

  $("#newsletter-email").on("input", function () {
    $(this).siblings(".newsletter-status").text("");
  });

  const $homeMain = $(".home-main");
  const $blogPageMain = $(".blog-page-main");
  const $listingMain = $(".listing-main");
  const $listingProductGrid = $(".listing-product-grid");
  const $productDetailMain = $(".product-detail-main");
  const $relatedProductsGrid = $(".related-products-grid");
  const $cartRelatedGrid = $("[data-cart-related-grid]");
  const $authMain = $(".auth-main");
  const $accountMain = $(".account-main");
  const $lookupMain = $(".lookup-main");
  const $cartMain = $(".cart-main");
  const $checkoutMain = $(".checkout-main");
  const $authSection = $(".auth-section");
  const $floatingTools = $(".floating-tools");

  const listingCategoryConfig = {
    makeup: {
      label: "Trang điểm",
      productName: "COMBO trang điểm lâu trôi dành cho mọi phong cách...",
      brand: "Cocoon"
    },
    skincare: {
      label: "Chăm sóc da",
      productName: "Bộ chăm sóc da dưỡng ẩm và phục hồi chuyên sâu...",
      brand: "CeraVe"
    },
    bodycare: {
      label: "Chăm sóc cơ thể",
      productName: "Bộ chăm sóc cơ thể làm sạch và dưỡng ẩm mềm mịn...",
      brand: "Cocoon"
    },
    haircare: {
      label: "Chăm sóc tóc",
      productName: "Bộ gội xả dưỡng tóc chắc khỏe và suôn mượt...",
      brand: "Tsubaki"
    },
    tools: {
      label: "Tools & Brushes",
      productName: "Bộ cọ trang điểm mềm mịn đa năng chuyên nghiệp...",
      brand: "Beauty Glow"
    },
    accessories: {
      label: "Phụ kiện",
      productName: "Bộ phụ kiện làm đẹp tiện lợi dành cho mọi ngày...",
      brand: "Beauty Glow"
    },
    men: {
      label: "Dành cho nam",
      productName: "Bộ chăm sóc da và cơ thể dành riêng cho nam giới...",
      brand: "Simple"
    },
    brands: {
      label: "Tất cả thương hiệu",
      productName: "Sản phẩm chính hãng được yêu thích tại Beauty Glow...",
      brand: "Cocoon"
    }
  };

  let currentListingCategory = "makeup";

  const listingProducts = Array.from({ length: 20 }, function (_, index) {
    return {
      id: `listing-${index + 1}`,
      brand: "Cocoon",
      name: "COMBO Cocoon Tẩy da chết cà phê Đak Lak (200ml)...",
      salePrice: "139,000đ",
      originalPrice: "305,000đ",
      rating: 5
    };
  });

  let listingLimit = 20;

  function renderListingProducts() {
    const category = listingCategoryConfig[currentListingCategory] || listingCategoryConfig.makeup;
    $listingProductGrid.empty();

    $.each(listingProducts.slice(0, listingLimit), function (_, product) {
      const categoryProduct = Object.assign({}, product, {
        id: `${currentListingCategory}-${product.id}`,
        brand: category.brand,
        name: category.productName
      });

      $listingProductGrid.append(createStoreProductCard(categoryProduct, {
        cardClass: "listing-product-card",
        imageClass: "listing-product-image",
        infoClass: "listing-product-info",
        brandClass: "listing-product-brand",
        nameClass: "listing-product-name",
        ratingClass: "listing-product-rating",
        priceClass: "listing-product-price",
        addClass: "listing-add-cart",
        favoriteClass: "listing-favorite-button",
        actionsClass: "listing-product-actions product-card-actions"
      }));
    });
  }

  function setListingCategory(categoryKey) {
    const nextKey = listingCategoryConfig[categoryKey] ? categoryKey : "makeup";
    const category = listingCategoryConfig[nextKey];
    currentListingCategory = nextKey;

    $(".listing-breadcrumb-container strong").text(category.label);
    $("#listing-title").html(`${category.label.toLocaleUpperCase("vi-VN")} <span>(100 Sản phẩm)</span>`);
    $(".listing-hero")
      .attr("href", `#${nextKey}-banner`)
      .attr("aria-label", `Banner danh mục ${category.label}`);
    $listingProductGrid.attr("aria-label", `Danh sách sản phẩm ${category.label}`);
    $("[data-detail-listing]").attr("href", `#${nextKey}`).text(category.label);

    $(".category-links a, .mega-menu-tab").removeClass("is-current-category");
    $(`.category-links a[href="#${nextKey}"], .mega-menu-tab[href="#${nextKey}"]`).addClass("is-current-category");

    const $filterGroups = $(".category-filter-group");
    $filterGroups.each(function () {
      $(this).find(".category-filter-toggle")
        .attr("aria-expanded", "false")
        .find("i")
        .removeClass("bi-chevron-down")
        .addClass("bi-chevron-right");
      $(this).find(".category-filter-sublist").prop("hidden", true);
    });

    const $activeFilter = $filterGroups.filter(`[data-filter-category="${nextKey}"]`);
    if ($activeFilter.length) {
      $activeFilter.find(".category-filter-toggle")
        .attr("aria-expanded", "true")
        .find("i")
        .removeClass("bi-chevron-right")
        .addClass("bi-chevron-down");
      $activeFilter.find(".category-filter-sublist").prop("hidden", false);
    }

    $(".listing-pagination button").removeClass("is-active").filter(function () {
      return $.trim($(this).text()) === "1";
    }).addClass("is-active");

    renderListingProducts();
  }

  renderListingProducts();

  const relatedProducts = listingProducts.slice(0, 5);

  function createRelatedProductCard(product) {
    return createStoreProductCard(product, {
      cardClass: "related-product-card",
      imageClass: "related-product-image",
      infoClass: "related-product-info",
      brandClass: "related-product-brand",
      nameClass: "related-product-name",
      ratingClass: "related-product-rating",
      priceClass: "related-product-price",
      addClass: "related-add-cart",
      favoriteClass: "related-favorite-button",
      actionsClass: "related-product-actions product-card-actions"
    });
  }

  $.each(relatedProducts, function (_, product) {
    $relatedProductsGrid.append(createRelatedProductCard(product));
    $cartRelatedGrid.append(createRelatedProductCard(product));
  });

  function setAuthMode(mode) {
    const isRegister = mode === "register";

    $authSection.toggleClass("is-register", isRegister);
    $(".auth-tabs [data-auth-tab]")
      .removeClass("is-active")
      .attr("aria-selected", "false")
      .filter(`[data-auth-tab="${mode}"]`)
      .addClass("is-active")
      .attr("aria-selected", "true");

    $(".auth-form").removeClass("is-active");
    $(`.auth-form[data-auth-form="${mode}"]`).addClass("is-active");

    $("[data-auth-breadcrumb-current]").text(isRegister ? "Đăng ký" : "Đăng nhập");
    $(".auth-login-note").prop("hidden", isRegister);
    $(".auth-register-note").prop("hidden", !isRegister);
    $(".auth-status").removeClass("is-success").text("");
  }

  function openAuthPage(mode) {
    $homeMain.prop("hidden", true);
    $blogPageMain.prop("hidden", true);
    $listingMain.prop("hidden", true);
    $productDetailMain.prop("hidden", true);
    $accountMain.prop("hidden", true);
    $lookupMain.prop("hidden", true);
    $cartMain.prop("hidden", true);
    $checkoutMain.prop("hidden", true);
    $authMain.prop("hidden", false);
    $floatingTools.prop("hidden", true);
    setAuthMode(mode || "login");
    $("html, body").stop(true, true).scrollTop(0);
  }

  function openListingPage(categoryKey) {
    setListingCategory(categoryKey || currentListingCategory);
    $homeMain.prop("hidden", true);
    $blogPageMain.prop("hidden", true);
    $authMain.prop("hidden", true);
    $accountMain.prop("hidden", true);
    $productDetailMain.prop("hidden", true);
    $lookupMain.prop("hidden", true);
    $cartMain.prop("hidden", true);
    $checkoutMain.prop("hidden", true);
    $listingMain.prop("hidden", false);
    $floatingTools.prop("hidden", false);
    setCategoryMenu(false);
    $("html, body").stop(true, true).scrollTop(0);
  }

  function openHomePage() {
    $authMain.prop("hidden", true);
    $accountMain.prop("hidden", true);
    $blogPageMain.prop("hidden", true);
    $listingMain.prop("hidden", true);
    $productDetailMain.prop("hidden", true);
    $lookupMain.prop("hidden", true);
    $cartMain.prop("hidden", true);
    $checkoutMain.prop("hidden", true);
    $homeMain.prop("hidden", false);
    $floatingTools.prop("hidden", false);
    $("html, body").stop(true, true).scrollTop(0);
  }

  $(".account-button").on("click", function (event) {
    if (getCurrentAccount()) {
      hideAuthToast();
      openAccountPage();
      return;
    }

    const selectedMode = $(event.target).closest("[data-auth-choice]").data("auth-choice");
    openAuthPage(selectedMode || $(this).data("auth-open") || "login");
  });

  $(document).on("click", "[data-mobile-auth]", function () {
    setMobileDrawer(false);
    openAuthPage($(this).data("mobile-auth") || "login");
  });

  function openProductDetailPage() {
    $homeMain.prop("hidden", true);
    $blogPageMain.prop("hidden", true);
    $listingMain.prop("hidden", true);
    $authMain.prop("hidden", true);
    $accountMain.prop("hidden", true);
    $lookupMain.prop("hidden", true);
    $cartMain.prop("hidden", true);
    $checkoutMain.prop("hidden", true);
    $productDetailMain.prop("hidden", false);
    $floatingTools.prop("hidden", false);
    setCategoryMenu(false);
    $("html, body").stop(true, true).scrollTop(0);
  }

  function openLookupPage() {
    $homeMain.prop("hidden", true);
    $blogPageMain.prop("hidden", true);
    $listingMain.prop("hidden", true);
    $productDetailMain.prop("hidden", true);
    $authMain.prop("hidden", true);
    $accountMain.prop("hidden", true);
    $cartMain.prop("hidden", true);
    $checkoutMain.prop("hidden", true);
    $lookupMain.prop("hidden", false);
    $floatingTools.prop("hidden", true);
    setCategoryMenu(false);
    $("html, body").stop(true, true).scrollTop(0);
  }

  function openCartPage() {
    $homeMain.prop("hidden", true);
    $blogPageMain.prop("hidden", true);
    $listingMain.prop("hidden", true);
    $productDetailMain.prop("hidden", true);
    $authMain.prop("hidden", true);
    $accountMain.prop("hidden", true);
    $lookupMain.prop("hidden", true);
    $checkoutMain.prop("hidden", true);
    $cartMain.prop("hidden", false);
    $floatingTools.prop("hidden", true);
    setCategoryMenu(false);
    renderCartPage();
    $("html, body").stop(true, true).scrollTop(0);
  }

  function openCheckoutPage() {
    $homeMain.prop("hidden", true);
    $blogPageMain.prop("hidden", true);
    $listingMain.prop("hidden", true);
    $productDetailMain.prop("hidden", true);
    $authMain.prop("hidden", true);
    $accountMain.prop("hidden", true);
    $lookupMain.prop("hidden", true);
    $cartMain.prop("hidden", true);
    $checkoutMain.prop("hidden", false);
    $floatingTools.prop("hidden", true);
    setCategoryMenu(false);
    renderCheckoutPage();
    $("html, body").stop(true, true).scrollTop(0);
  }

  function openBlogPage() {
    $homeMain.prop("hidden", true);
    $listingMain.prop("hidden", true);
    $productDetailMain.prop("hidden", true);
    $authMain.prop("hidden", true);
    $accountMain.prop("hidden", true);
    $lookupMain.prop("hidden", true);
    $cartMain.prop("hidden", true);
    $checkoutMain.prop("hidden", true);
    $blogPageMain.prop("hidden", false);
    $floatingTools.prop("hidden", true);
    setCategoryMenu(false);
    $("html, body").stop(true, true).scrollTop(0);
  }

  $("[data-auth-home], [data-account-home], [data-lookup-home], [data-cart-home], [data-checkout-home], [data-blog-home], .brand-logo").on("click", function (event) {
    if (!$authMain.prop("hidden") || !$accountMain.prop("hidden") || !$listingMain.prop("hidden") || !$productDetailMain.prop("hidden") || !$lookupMain.prop("hidden") || !$cartMain.prop("hidden") || !$checkoutMain.prop("hidden") || !$blogPageMain.prop("hidden")) {
      event.preventDefault();
      openHomePage();
    }
  });

  $(document).on("click", ".blog-view-all, a[href=\"#beauty-tips\"]", function (event) {
    event.preventDefault();
    openBlogPage();
  });

  $(".blog-page-category-row").on("click", "button", function () {
    $(this).addClass("is-active").siblings("button").removeClass("is-active");
  });

  $(".cart-button").on("click", function () {
    openCartPage();
  });

  $(".cart-checkout-button").on("click", function () {
    openCheckoutPage();
  });

  $('input[name="checkout-delivery"]').on("change", function () {
    renderCheckoutPage();
  });

  $('a[href="#order-lookup"]').on("click", function (event) {
    event.preventDefault();
    openLookupPage();
  });

  $('.lookup-radio-group input[name="lookup-method"]').on("change", function () {
    const isPhone = $(this).val() === "phone";

    $("[data-lookup-contact]")
      .attr("type", isPhone ? "tel" : "email")
      .attr("placeholder", isPhone ? "Nhập số điện thoại nhận hàng" : "Nhập email của bạn")
      .val("");
    $(".lookup-status").text("");
  });

  $(".lookup-form").on("submit", function (event) {
    event.preventDefault();

    const orderCode = $.trim($(this).find('input[type="text"]').val());
    const contact = $.trim($("[data-lookup-contact]").val());

    if (!orderCode || !contact) {
      $(".lookup-status").text("Vui lòng nhập đầy đủ thông tin tra cứu.");
      return;
    }

    $(".lookup-status").text("Không tìm thấy đơn hàng phù hợp trong dữ liệu mẫu.");
  });

  $("[data-listing-home], [data-detail-home]").on("click", function (event) {
    event.preventDefault();
    openHomePage();
  });

  $("[data-detail-listing]").on("click", function (event) {
    event.preventDefault();
    openListingPage(currentListingCategory);
  });

  const listingCategorySelector = Object.keys(listingCategoryConfig)
    .map((categoryKey) => `a[href="#${categoryKey}"]`)
    .join(", ");

  $(document).on("click", listingCategorySelector, function (event) {
    event.preventDefault();
    const categoryKey = String($(this).attr("href") || "").replace("#", "");
    openListingPage(categoryKey);

    if (window.matchMedia("(max-width: 991.98px)").matches) {
      setMobileDrawer(false);
      setCategoryMenu(false);
    }

    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, "", `#${categoryKey}`);
    }
  });

  const initialListingCategory = String(window.location.hash || "").replace("#", "");
  if (listingCategoryConfig[initialListingCategory]) {
    openListingPage(initialListingCategory);
  }

  $listingProductGrid.on("click", ".listing-add-cart", function (event) {
    event.stopPropagation();
    addCartProduct(getProductFromCardButton($(this)), 1);

    $(this).addClass("is-added");
    window.setTimeout(() => $(this).removeClass("is-added"), 300);
  });

  $(document).on("click", [
    ".sale-product-image",
    ".sale-product-name",
    ".top-product-image",
    ".top-product-name",
    ".listing-product-image",
    ".listing-product-name",
    ".related-product-image",
    ".related-product-name"
  ].join(", "), function () {
    openProductDetailPage();
  });

  $(".product-thumbnails button").on("click", function () {
    $(".product-thumbnails button").removeClass("is-active");
    $(this).addClass("is-active");
  });

  $(".product-qty-minus").on("click", function () {
    const $input = $(".product-quantity input");
    const value = Math.max(1, (Number($input.val()) || 1) - 1);
    $input.val(value);
  });

  $(".product-qty-plus").on("click", function () {
    const $input = $(".product-quantity input");
    const value = Math.min(99, (Number($input.val()) || 1) + 1);
    $input.val(value);
  });

  $(".product-quantity input").on("input", function () {
    const value = $(this).val().replace(/\D/g, "");
    $(this).val(value);
  }).on("blur", function () {
    const value = Math.max(1, Math.min(99, Number($(this).val()) || 1));
    $(this).val(value);
  });

  $(".product-add-cart, .product-buy-now").on("click", function () {
    const quantity = Math.max(1, Number($(".product-quantity input").val()) || 1);
    addCartProduct(getDetailProduct(), quantity);
  });

  $relatedProductsGrid.on("click", ".related-add-cart", function () {
    addCartProduct(getProductFromCardButton($(this)), 1);

    $(this).addClass("is-added");
    window.setTimeout(() => $(this).removeClass("is-added"), 300);
  });

  $cartRelatedGrid.on("click", ".related-add-cart", function () {
    addCartProduct(getProductFromCardButton($(this)), 1);

    $(this).addClass("is-added");
    window.setTimeout(() => $(this).removeClass("is-added"), 300);
  });

  $("[data-cart-items]").on("click", "[data-cart-minus], [data-cart-plus]", function () {
    const key = $(this).closest(".cart-item").data("cart-key");
    const item = cartItems.find(function (cartItem) {
      return cartItem.key === key;
    });

    if (!item) {
      return;
    }

    if ($(this).is("[data-cart-plus]")) {
      item.quantity += 1;
    } else {
      item.quantity -= 1;
    }

    if (item.quantity <= 0) {
      cartItems = cartItems.filter(function (cartItem) {
        return cartItem.key !== key;
      });
    }

    updateCartCount();
    renderCartPage();
  });

  $("[data-cart-items]").on("click", ".cart-item-remove", function () {
    const key = $(this).closest(".cart-item").data("cart-key");

    cartItems = cartItems.filter(function (cartItem) {
      return cartItem.key !== key;
    });

    updateCartCount();
    renderCartPage();
  });

  $("[data-cart-clear]").on("click", function () {
    cartItems = [];
    updateCartCount();
    renderCartPage();
  });

  $("[data-cart-select-all]").on("change", function () {
    $(".cart-item-check").prop("checked", $(this).prop("checked"));
  });

  $(document).on("click", ".product-favorite-button", function (event) {
    event.stopPropagation();
    const $button = $(this);
    const product = getProductFromFavoriteButton($button);

    if (!product.key) {
      return;
    }

    $button.addClass("is-pressed");
    window.setTimeout(function () {
      $button.removeClass("is-pressed");
    }, 260);

    const favoriteIndex = favoriteProducts.findIndex(function (favoriteProduct) {
      return favoriteProduct.key === product.key;
    });
    const isFavorite = favoriteIndex === -1;

    if (isFavorite) {
      favoriteProducts.push(product);
    } else {
      favoriteProducts.splice(favoriteIndex, 1);
    }

    syncFavoriteButtons(product.key, isFavorite);
    renderFavoriteProducts();
  });

  $(".review-filter-box").on("click", "button", function () {
    const selectedText = $(this).text();

    $(this).addClass("is-active").siblings("button").removeClass("is-active");
    $(".review-filter-toggle span").text(selectedText);

    if (window.matchMedia("(max-width: 767.98px)").matches) {
      $(".review-filter-toggle")
        .attr("aria-expanded", "false")
        .find("i")
        .addClass("bi-chevron-down")
        .removeClass("bi-chevron-up");
      $(".review-filter-box").removeClass("is-open");
    }
  });

  $(".review-filter-toggle").on("click", function () {
    const isOpen = $(this).attr("aria-expanded") === "true";

    $(this)
      .attr("aria-expanded", !isOpen)
      .find("i")
      .toggleClass("bi-chevron-down", isOpen)
      .toggleClass("bi-chevron-up", !isOpen);

    $(".review-filter-box").toggleClass("is-open", !isOpen);
  });

  $(".review-input").on("submit", function (event) {
    event.preventDefault();
    $(this).find("input").val("");
  });

  $(".product-description-tabs button").on("click", function () {
    const tabName = $(this).data("detail-tab");

    $(".product-description").removeClass("is-expanded");
    $(".product-description-more")
      .contents()
      .first()[0].textContent = "Xem thêm";
    $(".product-description-more i").addClass("bi-chevron-down").removeClass("bi-chevron-up");

    $(".product-description-tabs button")
      .removeClass("is-active")
      .attr("aria-selected", "false");

    $(this).addClass("is-active").attr("aria-selected", "true");

    $(".product-description-panel").removeClass("is-active").prop("hidden", true);
    $(`.product-description-panel[data-detail-panel="${tabName}"]`)
      .addClass("is-active")
      .prop("hidden", false);

    updateDescriptionMoreButton();
  });

  $(".product-description-more").on("click", function () {
    const $description = $(".product-description");
    const isExpanded = $description.toggleClass("is-expanded").hasClass("is-expanded");

    $(this).contents().first()[0].textContent = isExpanded ? "Thu gọn" : "Xem thêm";
    $(this).find("i").toggleClass("bi-chevron-up", isExpanded).toggleClass("bi-chevron-down", !isExpanded);
  });

  function updateDescriptionMoreButton() {
    const $content = $(".product-description-content");
    const content = $content[0];
    const $activePanel = $(".product-description-panel.is-active");
    const shouldShow = content && (
      content.scrollHeight > content.clientHeight + 1 ||
      $activePanel.find("p").length > 2
    );

    $(".product-description-more").prop("hidden", !shouldShow);
  }

  updateDescriptionMoreButton();

  $(".listing-sort button").on("click", function () {
    $(".listing-sort button").removeClass("is-active");
    $(this).addClass("is-active");
  });

  $(".listing-pagination button").on("click", function () {
    const label = $.trim($(this).text());

    if (!label || $(this).find("i").length) {
      return;
    }

    $(".listing-pagination button").removeClass("is-active");
    $(this).addClass("is-active");
  });

  $(".listing-limit").on("click", function (event) {
    event.stopPropagation();
    const isOpen = $(this).attr("aria-expanded") === "true";
    $(this).attr("aria-expanded", !isOpen);
    $(".listing-limit-menu").prop("hidden", isOpen);
  });

  $(".listing-limit-menu button").on("click", function (event) {
    event.stopPropagation();
    listingLimit = Number($(this).data("listing-limit")) || 20;

    $(".listing-limit span").text(`Hiển thị ${listingLimit}`);
    $(".listing-limit").attr("aria-expanded", "false");
    $(".listing-limit-menu").prop("hidden", true);
    $(".listing-limit-menu button").removeClass("is-active");
    $(this).addClass("is-active");

    renderListingProducts();
  });

  $(document).on("click", function () {
    $(".listing-limit").attr("aria-expanded", "false");
    $(".listing-limit-menu").prop("hidden", true);
  });

  const $listingSidebar = $(".listing-sidebar");
  const $listingFilterOverlay = $(".listing-filter-overlay");

  function setListingFilterDrawer(open) {
    $listingSidebar.toggleClass("is-mobile-open", open);
    $listingFilterOverlay.toggleClass("is-open", open);
    $("body").toggleClass("listing-filter-opened", open);
    $(".listing-filter-open").attr("aria-expanded", open);

    if (open) {
      $listingSidebar.find(".filter-block").removeClass("is-open");
      $listingSidebar.find(".filter-title").attr("aria-expanded", "false");
      $listingSidebar.find(".filter-block > .filter-panel").prop("hidden", true);
    }
  }

  $(".listing-filter-open").on("click", function () {
    setListingFilterDrawer(true);
  });

  $(".listing-filter-close, .listing-filter-overlay, .listing-filter-apply").on("click", function () {
    setListingFilterDrawer(false);
  });

  $(".listing-filter-reset").on("click", function () {
    $listingSidebar.find('input[type="checkbox"]').prop("checked", false);
    $priceMinRange.val(0);
    $priceMaxRange.val(priceLimit);
    $priceMinInput.val("");
    $priceMaxInput.val("");
    updatePriceFilter();
  });

  $(document).on("keydown", function (event) {
    if (event.key === "Escape" && $listingSidebar.hasClass("is-mobile-open")) {
      setListingFilterDrawer(false);
      $(".listing-filter-open").trigger("focus");
    }
  });

  $(".listing-sidebar").on("click", "[data-filter-toggle]", function () {
    const $button = $(this);
    const $block = $button.closest(".filter-block");
    const $panel = $block.children(".filter-panel");
    const isOpen = !$block.hasClass("is-open");

    $block.toggleClass("is-open", isOpen);
    $button.attr("aria-expanded", isOpen);
    $button.find("i")
      .toggleClass("bi-chevron-down", isOpen && !$button.find("i").hasClass("bi-plus-lg"))
      .toggleClass("bi-chevron-right", !isOpen && !$button.find("i").hasClass("bi-plus-lg"));
    $panel.prop("hidden", !isOpen);
  });

  $(".listing-sidebar").on("click", ".category-filter-toggle", function () {
    const $button = $(this);
    const $sublist = $button.siblings(".category-filter-sublist");
    const isOpen = $button.attr("aria-expanded") !== "true";

    $button.attr("aria-expanded", isOpen);
    $button.find("i").toggleClass("bi-chevron-down", isOpen).toggleClass("bi-chevron-right", !isOpen);
    $sublist.prop("hidden", !isOpen);
  });

  const $priceMinRange = $(".price-range-min");
  const $priceMaxRange = $(".price-range-max");
  const $priceMinInput = $(".price-input-min");
  const $priceMaxInput = $(".price-input-max");
  const $priceMinLabel = $(".price-label-min");
  const $priceMaxLabel = $(".price-label-max");
  const $priceTrack = $(".price-slider-track");
  const priceLimit = 1000000;
  const minPriceGap = 10000;

  function normalizePrice(value, fallback) {
    const digits = String(value).replace(/\D/g, "");
    if (!digits) {
      return fallback;
    }

    const numeric = Number(digits);
    if (!Number.isFinite(numeric)) {
      return fallback;
    }
    return Math.max(0, Math.min(priceLimit, numeric));
  }

  function updatePriceFilter(source) {
    let minValue = normalizePrice($priceMinRange.val(), 0);
    let maxValue = normalizePrice($priceMaxRange.val(), priceLimit);

    if (source === "min" && minValue > maxValue - minPriceGap) {
      minValue = maxValue - minPriceGap;
    }

    if (source === "max" && maxValue < minValue + minPriceGap) {
      maxValue = minValue + minPriceGap;
    }

    minValue = Math.max(0, minValue);
    maxValue = Math.min(priceLimit, maxValue);

    $priceMinRange.val(minValue);
    $priceMaxRange.val(maxValue);
    $priceMinLabel.text(`${minValue.toLocaleString("en-US")}đ`);
    $priceMaxLabel.text(`${maxValue.toLocaleString("en-US")}đ`);

    $priceTrack.css({
      left: `${(minValue / priceLimit) * 100}%`,
      right: `${100 - (maxValue / priceLimit) * 100}%`
    });
  }

  $priceMinRange.on("input", function () {
    updatePriceFilter("min");
  });

  $priceMaxRange.on("input", function () {
    updatePriceFilter("max");
  });

  $(".price-inputs input").on("input", function () {
    const sanitized = $(this).val().replace(/\D/g, "");
    $(this).val(sanitized);
  });

  $priceMinInput.on("change blur", function () {
    const minValue = normalizePrice($(this).val(), 0);
    $priceMinRange.val(minValue);
    $(this).val($(this).val() ? minValue : "");
    updatePriceFilter("min");
  });

  $priceMaxInput.on("change blur", function () {
    const maxValue = normalizePrice($(this).val(), priceLimit);
    $priceMaxRange.val(maxValue || priceLimit);
    $(this).val($(this).val() ? maxValue : "");
    updatePriceFilter("max");
  });

  updatePriceFilter();

  $("[data-auth-tab]").on("click", function () {
    openAuthPage($(this).data("auth-tab"));
  });

  $(".auth-password-toggle").on("click", function () {
    const $button = $(this);
    const $input = $button.siblings("input");
    const isPassword = $input.attr("type") === "password";

    $input.attr("type", isPassword ? "text" : "password");
    $button.attr("aria-label", isPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu");
    $button.find("i").toggleClass("bi-eye", isPassword).toggleClass("bi-eye-slash", !isPassword);
  });

  $(".auth-form input").on("input", function () {
    $(this).closest(".auth-form").find(".auth-status").removeClass("is-success").text("");
  });

  let currentDemoAccount = null;

  function getStoredAccounts() {
    return [];
  }

  function saveStoredAccounts(accounts) {
    return accounts;
  }

  function setCurrentAccount(account) {
    currentDemoAccount = {
      ...account,
      name: account.name || account.fullName || account.email,
      email: account.email,
      phone: account.phone || ""
    };
  }

  function getCurrentAccount() {
    return currentDemoAccount;
  }

  function getShortAccountName(name) {
    const cleanName = $.trim(name || "");
    return cleanName ? cleanName.split(/\s+/).slice(-1)[0] : "bạn";
  }

  function renderAccountPage() {
    const account = getCurrentAccount();

    if (!account) {
      return;
    }

    const displayName = account.fullName || account.name || "cuongtran !!!";
    const username = account.username || account.email || account.name || "Chưa cập nhật";
    $("[data-account-name]").text(displayName);
    $("[data-account-username]").text(username);
    $("[data-account-fullname]").text(account.fullName || "Cần cập nhật");
    $("[data-account-email]").text(account.email || "Chưa cập nhật");
    $("[data-account-gender]").text(account.gender || "Cần cập nhật");
    $("[data-account-birthday]").text(account.birthday || "Cần cập nhật");
    $("[data-account-phone]").text(account.phone || "Cần cập nhật");
  }

  function setAccountView(view) {
    const currentView = view || "profile";
    const viewTitles = {
      profile: "Thông tin cá nhân",
      addresses: "Quản lý sổ địa chỉ",
      orders: "Đơn hàng của tôi",
      favorites: "Sản phẩm yêu thích"
    };

    $("[data-account-view]").prop("hidden", true);
    $(`[data-account-view="${currentView}"]`).prop("hidden", false);
    $("[data-account-view-button]")
      .removeClass("is-active")
      .filter(`[data-account-view-button="${currentView}"]`)
      .addClass("is-active");
    $(".account-breadcrumb-container strong").text(viewTitles[currentView] || viewTitles.profile);
  }

  function openAccountPage() {
    renderAccountPage();
    setAccountView("profile");
    $homeMain.prop("hidden", true);
    $blogPageMain.prop("hidden", true);
    $listingMain.prop("hidden", true);
    $productDetailMain.prop("hidden", true);
    $lookupMain.prop("hidden", true);
    $cartMain.prop("hidden", true);
    $checkoutMain.prop("hidden", true);
    $authMain.prop("hidden", true);
    $accountMain.prop("hidden", false);
    $floatingTools.prop("hidden", true);
    setCategoryMenu(false);
    $("html, body").stop(true, true).scrollTop(0);
  }

  function showAuthToast(message) {
    const $toast = $(".auth-toast");

    $toast.find("span").text(message);
    $toast.prop("hidden", false).addClass("is-visible");
    window.clearTimeout($toast.data("hideTimer"));
    $toast.data("hideTimer", window.setTimeout(function () {
      $toast.prop("hidden", true).removeClass("is-visible");
    }, 2200));
  }

  function hideAuthToast() {
    const $toast = $(".auth-toast");

    window.clearTimeout($toast.data("hideTimer"));
    $toast.prop("hidden", true).removeClass("is-visible");
  }

  function redirectAfterAuthSuccess() {
    let hasRedirected = false;

    function finishRedirect() {
      if (hasRedirected) {
        return;
      }

      hasRedirected = true;
      $(document).off("click.auth-success-redirect");
      hideAuthToast();
      openHomePage();
    }

    window.setTimeout(finishRedirect, 1600);
    window.setTimeout(function () {
      $(document).one("click.auth-success-redirect", finishRedirect);
    }, 0);
  }

  function updateAccountButton() {
    const currentUser = getCurrentAccount();

    if (currentUser && currentUser.name) {
      $(".account-button")
        .addClass("is-logged-in")
        .find(".account-button-label")
        .text(`Xin chào, ${getShortAccountName(currentUser.name)}`);
      return;
    }

    $(".account-button")
      .removeClass("is-logged-in")
      .find(".account-button-label")
      .html('<span data-auth-choice="login">Đăng nhập</span><span class="account-separator">/</span><span data-auth-choice="register">Đăng ký</span>');
  }

  $(".auth-form").on("submit", function (event) {
    event.preventDefault();

    const $form = $(this);
    const mode = $form.data("auth-form");
    const $status = $form.find(".auth-status");
    const $requiredInputs = $form.find("input[required]");
    let isValid = true;

    $requiredInputs.each(function () {
      if (!$.trim($(this).val()) || !this.checkValidity()) {
        isValid = false;
        $(this).trigger("focus");
        return false;
      }
      return true;
    });

    if (!isValid) {
      $status.removeClass("is-success").text("Vui lòng nhập đầy đủ thông tin hợp lệ.");
      return;
    }

    if (mode === "register") {
      const name = $.trim($("#register-name").val()) || "cuongtran";
      const phone = $.trim($("#register-phone").val()) || "1900 1900";
      const email = $.trim($("#register-email").val()).toLowerCase();
      const password = $("#register-password").val();
      const confirmPassword = $("#register-confirm-password").val();

      if (password !== confirmPassword) {
        $status.removeClass("is-success").text("Mật khẩu xác nhận chưa khớp.");
        $("#register-confirm-password").trigger("focus");
        return;
      }

      setCurrentAccount({
        name,
        fullName: name,
        username: email,
        phone,
        email
      });
      updateAccountButton();
      renderAccountPage();
      $status.addClass("is-success").text("Đăng ký thành công.");
      $form[0].reset();
      hideAuthToast();
      openHomePage();
      return;
    }

    const loginEmail = $.trim($("#login-email").val()).toLowerCase();
    const loginName = loginEmail.split("@")[0] || "cuongtran";

    setCurrentAccount({
      name: loginName,
      username: loginEmail,
      email: loginEmail,
      phone: ""
    });
    updateAccountButton();
    renderAccountPage();
    $status.addClass("is-success").text(`Đăng nhập thành công. Xin chào ${loginName}!`);
    $form[0].reset();
    hideAuthToast();
    openHomePage();
    return;

    try {
      const accounts = getStoredAccounts();

      if (mode === "register") {
        const name = $.trim($("#register-name").val());
        const phone = $.trim($("#register-phone").val());
        const email = $.trim($("#register-email").val()).toLowerCase();
        const password = $("#register-password").val();
        const confirmPassword = $("#register-confirm-password").val();

        if (password !== confirmPassword) {
          $status.removeClass("is-success").text("Mật khẩu xác nhận chưa khớp.");
          $("#register-confirm-password").trigger("focus");
          return;
        }

        if (accounts.some((account) => account.email === email)) {
          $status.removeClass("is-success").text("Email này đã được đăng ký. Vui lòng đăng nhập.");
          $("#register-email").trigger("focus");
          return;
        }

        const newAccount = {
          name,
          phone,
          email,
          password,
          createdAt: new Date().toISOString()
        };

        accounts.push(newAccount);
        saveStoredAccounts(accounts);
        setCurrentAccount(newAccount);
        updateAccountButton();
        renderAccountPage();
        showAuthToast("Đăng ký thành công");

        $status.addClass("is-success").text("Đăng ký thành công. Tài khoản đã được lưu.");
        $form[0].reset();
        return;
      }

      const email = $.trim($("#login-email").val()).toLowerCase();
      const password = $("#login-password").val();
      const account = accounts.find((item) => item.email === email && item.password === password);

      if (!account) {
        $status.removeClass("is-success").text("Email hoặc mật khẩu không đúng.");
        $("#login-email").trigger("focus");
        return;
      }

      setCurrentAccount(account);
      updateAccountButton();
      renderAccountPage();
      showAuthToast("Đăng nhập thành công");
      $status.addClass("is-success").text(`Đăng nhập thành công. Xin chào ${account.name}!`);
      $form[0].reset();
      return;
    } catch (error) {
      $status.removeClass("is-success").text("Trình duyệt không cho phép lưu tài khoản lúc này.");
      return;
    }

    if (mode === "register") {
      const password = $("#register-password").val();
      const confirmPassword = $("#register-confirm-password").val();

      if (password !== confirmPassword) {
        $status.removeClass("is-success").text("Mật khẩu xác nhận chưa khớp.");
        $("#register-confirm-password").trigger("focus");
        return;
      }
    }

    $status
      .addClass("is-success")
      .text(mode === "register" ? "Đăng ký thành công." : "Đăng nhập thành công.");

    try {
      currentDemoAccount = currentDemoAccount;
    } catch (error) {
      // The fake account flow still works when storage is unavailable.
    }
  });

  updateAccountButton();
  renderAccountPage();

  $(".account-edit-button").on("click", function () {
    const account = getCurrentAccount() || {};

    $("[data-profile-fullname-input]").val(account.fullName || "");
    $("[data-profile-gender-input]").val(account.gender || "");
    $("[data-profile-birthday-input]").val(account.birthday || "");
    $("[data-profile-phone-input]").val(account.phone || "");
    $("[data-account-profile-summary], .account-edit-button").prop("hidden", true);
    $("[data-account-profile-form]").prop("hidden", false);
  });

  $("[data-profile-edit-cancel]").on("click", function () {
    $("[data-account-profile-form]").prop("hidden", true);
    $("[data-account-profile-summary], .account-edit-button").prop("hidden", false);
  });

  $("[data-account-profile-form]").on("submit", function (event) {
    event.preventDefault();

    const account = getCurrentAccount();

    if (!account) {
      return;
    }

    account.fullName = $.trim($("[data-profile-fullname-input]").val());
    if (account.fullName) {
      account.name = account.fullName;
    }
    account.gender = $("[data-profile-gender-input]").val();
    account.birthday = $("[data-profile-birthday-input]").val();
    account.phone = $.trim($("[data-profile-phone-input]").val());
    setCurrentAccount(account);
    renderAccountPage();
    $("[data-account-profile-form]").prop("hidden", true);
    $("[data-account-profile-summary], .account-edit-button").prop("hidden", false);
  });

  $("[data-account-view-button]").on("click", function () {
    setAccountView($(this).data("account-view-button"));
  });

  function openAddressDrawer() {
    $("body").addClass("address-drawer-open");
    $("[data-address-drawer-overlay]").prop("hidden", false);
    window.requestAnimationFrame(function () {
      $("[data-address-drawer], [data-address-drawer-overlay]").addClass("is-open");
    });
    $("[data-address-drawer]").attr("aria-hidden", "false");
  }

  function closeAddressDrawer() {
    $("[data-address-drawer], [data-address-drawer-overlay]").removeClass("is-open");
    $("[data-address-drawer]").attr("aria-hidden", "true");
    $("body").removeClass("address-drawer-open");
    window.setTimeout(function () {
      if (!$("[data-address-drawer-overlay]").hasClass("is-open")) {
        $("[data-address-drawer-overlay]").prop("hidden", true);
      }
    }, 240);
  }

  let savedAddresses = [];

  function updateAddressView() {
    const $addressList = $("[data-address-list]");
    const hasAddress = savedAddresses.length > 0;

    $addressList.empty().prop("hidden", !hasAddress);
    $(".account-address-empty").prop("hidden", hasAddress);
    $(".account-address-header > button").prop("hidden", !hasAddress);

    $.each(savedAddresses, function (index, address) {
      const $card = $("<article>", { class: "account-address-card", "data-address-index": index });
      const $title = $("<h3>")
        .append(document.createTextNode(address.name))
        .append($("<span>", { text: address.phone }));
      const fullAddress = [address.detail, address.ward, address.district, address.city]
        .filter(Boolean)
        .join(", ");

      $card
        .append($title)
        .append($("<p>", { text: fullAddress }))
        .append($("<p>", {
          class: "account-address-old",
          text: "Địa chỉ cũ: 476, Lê Duẩn, Phường 4, Thành phố Sóc Trăng, Tỉnh Sóc Trăng"
        }))
        .append(
          $("<div>", { class: "account-address-actions" })
            .append($("<button>", { class: "account-address-edit", type: "button", text: "Sửa" }))
            .append(
              $("<button>", { class: "account-address-delete", type: "button", "aria-label": "Xóa địa chỉ" })
                .append($("<img>", { src: "assets/Icon/Trash Can.png", alt: "", "aria-hidden": "true" }))
            )
        )
        .append(
          $("<div>", { class: "account-address-tags" })
            .append($("<span>").append($("<i>", { class: "bi bi-house-door-fill", "aria-hidden": "true" })).append(document.createTextNode(address.type)))
            .append(address.isDefault ? $("<span>", { class: "is-default", text: "Mặc định" }) : $())
        );

      $addressList.append($card);
    });
  }

  function resetAddressForm() {
    $(".address-drawer-form")[0].reset();
    $("[data-address-city-label], [data-address-district-label], [data-address-ward-label]").text("");
    $("[data-address-city-toggle], [data-address-district-toggle], [data-address-ward-toggle]").removeClass("has-value");
    resetAddressDistrict();
    resetAddressWard();
    $(".address-type-options button").removeClass("is-selected").first().addClass("is-selected");
  }

  $("[data-address-drawer-open]").on("click", openAddressDrawer);
  $("[data-address-drawer-close], [data-address-drawer-overlay]").on("click", closeAddressDrawer);
  updateAddressView();

  $("[data-address-drawer-submit]").on("click", function () {
    const name = $.trim($("[data-address-name-input]").val()) || "Trần Tấn Cường";
    const phone = $.trim($("[data-address-phone-input]").val()) || "0912364122";
    const city = $.trim($("[data-address-city-label]").text()) || "Cần Thơ";
    const district = $.trim($("[data-address-district-label]").text());
    const ward = $.trim($("[data-address-ward-label]").text());
    const detail = $.trim($("[data-address-detail-input]").val()) || "476, Lê Duẩn";
    const type = $(".address-type-options button.is-selected").text() || "Nhà";

    savedAddresses = [{
      name,
      phone,
      city,
      district,
      ward,
      detail,
      type,
      isDefault: $(".address-switch input").prop("checked") || savedAddresses.length === 0
    }];

    updateAddressView();
    resetAddressForm();
    closeAddressDrawer();
  });

  $(".address-type-options").on("click", "button", function () {
    $(this).addClass("is-selected").siblings("button").removeClass("is-selected");
  });

  const addressData = {
    "Cần Thơ": {
      "Ninh Kiều": ["An Bình", "An Cư", "An Hòa", "Cái Khế", "Xuân Khánh"],
      "Bình Thủy": ["An Thới", "Bình Thủy", "Long Hòa", "Trà An", "Trà Nóc"],
      "Cái Răng": ["Ba Láng", "Hưng Phú", "Lê Bình", "Phú Thứ", "Thường Thạnh"],
      "Ô Môn": ["Châu Văn Liêm", "Long Hưng", "Phước Thới", "Thới An", "Trường Lạc"]
    },
    "Hồ Chí Minh": {
      "Quận 1": ["Bến Nghé", "Bến Thành", "Cầu Kho", "Cầu Ông Lãnh", "Đa Kao"],
      "Quận 3": ["Phường 1", "Phường 2", "Phường 4", "Phường 5", "Võ Thị Sáu"],
      "Quận 7": ["Bình Thuận", "Phú Mỹ", "Tân Hưng", "Tân Phong", "Tân Phú"],
      "Thủ Đức": ["Hiệp Bình Chánh", "Linh Chiểu", "Linh Trung", "Thảo Điền", "Trường Thọ"]
    },
    "Hà Nội": {
      "Ba Đình": ["Cống Vị", "Điện Biên", "Đội Cấn", "Kim Mã", "Ngọc Hà"],
      "Hoàn Kiếm": ["Chương Dương", "Cửa Đông", "Hàng Bạc", "Hàng Bông", "Tràng Tiền"],
      "Cầu Giấy": ["Dịch Vọng", "Dịch Vọng Hậu", "Mai Dịch", "Nghĩa Đô", "Yên Hòa"],
      "Đống Đa": ["Cát Linh", "Láng Hạ", "Ô Chợ Dừa", "Quang Trung", "Trung Liệt"]
    },
    "Đà Nẵng": {
      "Hải Châu": ["Bình Hiên", "Hải Châu I", "Hải Châu II", "Hòa Cường Bắc", "Thạch Thang"],
      "Thanh Khê": ["An Khê", "Chính Gián", "Tam Thuận", "Tân Chính", "Xuân Hà"],
      "Sơn Trà": ["An Hải Bắc", "An Hải Đông", "Mân Thái", "Nại Hiên Đông", "Phước Mỹ"],
      "Ngũ Hành Sơn": ["Hòa Hải", "Hòa Quý", "Khuê Mỹ", "Mỹ An"]
    }
  };

  function closeAddressSelectMenus() {
    $("[data-address-city-menu], [data-address-district-menu], [data-address-ward-menu]").prop("hidden", true);
  }

  function renderAddressOptions($menu, options, dataName) {
    $menu.empty();

    $.each(options, function (_, option) {
      $menu.append($("<button>", {
        type: "button",
        text: option
      }).attr(dataName, option));
    });
  }

  function resetAddressDistrict() {
    $("[data-address-district-label]").text("");
    $("[data-address-district-toggle]").removeClass("has-value").addClass("is-disabled").prop("disabled", true);
    $("[data-address-district-menu]").empty().prop("hidden", true);
  }

  function resetAddressWard() {
    $("[data-address-ward-label]").text("");
    $("[data-address-ward-toggle]").removeClass("has-value").addClass("is-disabled").prop("disabled", true);
    $("[data-address-ward-menu]").empty().prop("hidden", true);
  }

  function fillAddressForm(address) {
    $("[data-address-name-input]").val(address.name);
    $("[data-address-phone-input]").val(address.phone);
    $("[data-address-detail-input]").val(address.detail);

    $("[data-address-city-label]").text(address.city);
    $("[data-address-city-toggle]").addClass("has-value");

    renderAddressOptions($("[data-address-district-menu]"), Object.keys(addressData[address.city] || {}), "data-address-district-option");
    $("[data-address-district-toggle]").removeClass("is-disabled").prop("disabled", false);
    $("[data-address-district-label]").text(address.district).closest(".address-select-field").addClass("has-value");

    renderAddressOptions($("[data-address-ward-menu]"), (addressData[address.city] && addressData[address.city][address.district]) || [], "data-address-ward-option");
    $("[data-address-ward-toggle]").removeClass("is-disabled").prop("disabled", false);
    $("[data-address-ward-label]").text(address.ward).closest(".address-select-field").addClass("has-value");

    $(".address-type-options button")
      .removeClass("is-selected")
      .filter(function () {
        return $(this).text() === address.type;
      })
      .addClass("is-selected");
    $(".address-switch input").prop("checked", address.isDefault);
  }

  $("[data-address-city-toggle], [data-address-district-toggle], [data-address-ward-toggle]").on("click", function () {
    const $button = $(this);

    if ($button.prop("disabled")) {
      return;
    }

    const $menu = $button.siblings(".address-select-menu");
    const willOpen = $menu.prop("hidden");

    closeAddressSelectMenus();
    $menu.prop("hidden", !willOpen);
  });

  $("[data-address-city-menu]").on("click", "[data-address-city-option]", function () {
    const selectedCity = $(this).data("address-city-option");
    const districts = Object.keys(addressData[selectedCity] || {});

    $("[data-address-city-label]").text(selectedCity);
    $("[data-address-city-toggle]").addClass("has-value");
    resetAddressDistrict();
    renderAddressOptions($("[data-address-district-menu]"), districts, "data-address-district-option");
    $("[data-address-district-toggle]").removeClass("is-disabled").prop("disabled", false);
    resetAddressWard();
    closeAddressSelectMenus();
  });

  $("[data-address-district-menu]").on("click", "[data-address-district-option]", function () {
    const selectedCity = $("[data-address-city-label]").text();
    const selectedDistrict = $(this).data("address-district-option");
    const wards = (addressData[selectedCity] && addressData[selectedCity][selectedDistrict]) || [];

    $("[data-address-district-label]").text(selectedDistrict);
    $("[data-address-district-toggle]").addClass("has-value");
    resetAddressWard();
    renderAddressOptions($("[data-address-ward-menu]"), wards, "data-address-ward-option");
    $("[data-address-ward-toggle]").removeClass("is-disabled").prop("disabled", false);
    closeAddressSelectMenus();
  });

  $("[data-address-ward-menu]").on("click", "[data-address-ward-option]", function () {
    $("[data-address-ward-label]").text($(this).data("address-ward-option"));
    $("[data-address-ward-toggle]").addClass("has-value");
    closeAddressSelectMenus();
  });

  $("[data-address-list]").on("click", ".account-address-edit", function () {
    const addressIndex = Number($(this).closest(".account-address-card").data("address-index"));
    const address = savedAddresses[addressIndex];

    if (!address) {
      return;
    }

    resetAddressForm();
    fillAddressForm(address);
    openAddressDrawer();
  });

  $("[data-address-list]").on("click", ".account-address-delete", function () {
    const addressIndex = Number($(this).closest(".account-address-card").data("address-index"));

    savedAddresses.splice(addressIndex, 1);
    updateAddressView();
  });

  $(document).on("click", function (event) {
    if (!$(event.target).closest(".address-select-wrap").length) {
      closeAddressSelectMenus();
    }
  });

  $(document).on("keydown", function (event) {
    if (event.key === "Escape" && $("[data-address-drawer]").hasClass("is-open")) {
      closeAddressDrawer();
      return;
    }

    if (event.key === "Escape") {
      closeAddressSelectMenus();
    }
  });

  $(".account-order-tabs").on("click", "button", function () {
    $(this).addClass("is-active").siblings("button").removeClass("is-active");
  });

  $(".account-order-search").on("submit", function (event) {
    event.preventDefault();
  });

  $(".account-favorites-grid").on("click", ".account-favorite-remove", function () {
    const favoriteKey = $(this).closest(".account-favorite-card").data("favorite-key");

    favoriteProducts = favoriteProducts.filter(function (product) {
      return product.key !== favoriteKey;
    });

    syncFavoriteButtons(favoriteKey, false);
    renderFavoriteProducts();
  });

  $("[data-favorite-select-all]").on("change", function () {
    $(".account-favorite-check input").prop("checked", $(this).prop("checked"));
  });

  $(".account-favorites-add-selected").on("click", function () {
    const selectedKeys = $(".account-favorite-check input:checked").map(function () {
      return $(this).closest(".account-favorite-card").data("favorite-key");
    }).get();
    const productsToAdd = selectedKeys.length
      ? favoriteProducts.filter(function (product) {
        return selectedKeys.includes(product.key);
      })
      : favoriteProducts;

    if (!productsToAdd.length) {
      return;
    }

    $.each(productsToAdd, function (_, product) {
      addCartProduct({
        key: product.key,
        brand: product.brand,
        name: product.name,
        price: parsePriceValue(product.salePrice)
      }, 1);
    });

    $(this).addClass("is-added");
    window.setTimeout(() => $(this).removeClass("is-added"), 300);
  });

  const $accountOrderList = $(".account-order-list");
  while ($accountOrderList.children(".account-order-card").length < 5) {
    $accountOrderList.children(".account-order-card").first().clone().appendTo($accountOrderList);
  }

  $("[data-account-logout]").on("click", function () {
    try {
      currentDemoAccount = null;
    } catch (error) {
      // Ignore storage errors for this static demo.
    }

    updateAccountButton();
    hideAuthToast();
    openAuthPage("login");
  });

  $(".footer-mobile-toggle").on("click", function () {
    const $button = $(this);
    const $column = $button.closest(".footer-links-column");
    const isOpen = !$column.hasClass("is-open");

    $column.toggleClass("is-open", isOpen);
    $button.attr("aria-expanded", isOpen);
    $button.find("i")
      .toggleClass("bi-chevron-down", !isOpen)
      .toggleClass("bi-chevron-up", isOpen);
  });

  $(window).on("resize", function () {
    if (window.matchMedia("(min-width: 431px)").matches) {
      setListingFilterDrawer(false);
    }

    if (window.matchMedia("(min-width: 992px)").matches) {
      setMobileDrawer(false);
    } else {
      setCategoryMenu(false);
    }
  });
});

