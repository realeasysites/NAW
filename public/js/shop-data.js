/* ============================================================
   NAPPI AUTOWORKS SHOP — edit products here. No backend needed.

   To make a product buyable:
   1. In Stripe: Product catalog → add the product → Create payment link.
      (For sizes: Payment link → "Add custom field" → Dropdown → S, M, L, XL...)
   2. Paste the link (https://buy.stripe.com/...) into stripeLink below.
   Leave stripeLink empty ("") and the card shows "Coming soon"
   (or, while SHOP_PREVIEW is true, a "Buy now" button that tells
   shoppers checkout opens soon).

   SHOP_PREVIEW: true = pitch/preview mode. Set to false at launch.

   To add a product: copy one block, change the fields, save.
   ============================================================ */
window.SHOP_PREVIEW = true;

window.SHOP_PRODUCTS = [
  {
    name: "Leather Patch Snapback",
    price: 32,
    image: "/images/shop-hat.jpg",
    altImage: "/images/merch-hat-kid.jpg",
    description: "Black flat-bill snapback with a leather Nappi Autoworks patch and square-body truck outline.",
    sizes: ["Adult", "Youth"],
    stripeLink: ""
  },
  {
    name: "Shop Logo Tee",
    price: 28,
    image: "/images/shop-tee-black.jpg",
    description: "Black tee with the Est. 2021 Nappi Autoworks badge on the chest.",
    sizes: ["S", "M", "L", "XL", "2XL"],
    stripeLink: ""
  },
  {
    name: "Shop Logo Hoodie",
    price: 55,
    image: "/images/shop-hoodie-charcoal.jpg",
    description: "Heavyweight charcoal hoodie for Maine garage winters, badge on the chest.",
    sizes: ["S", "M", "L", "XL", "2XL"],
    stripeLink: ""
  },
  {
    name: "Die-Cut Logo Sticker",
    price: 5,
    image: "/images/shop-sticker.jpg",
    description: "Weatherproof vinyl badge sticker for the toolbox, tailgate or race trailer.",
    sizes: [],
    stripeLink: ""
  }
];
