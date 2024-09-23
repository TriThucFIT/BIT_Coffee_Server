const categoryService = require("../services/Category.service");
const productService = require("../services/Product.service");
const variantService = require("../services/Variant.service");
const variantOptionService = require("../services/VariantOption.service");
const ProductVariantService = require("../services/ProductVariant.service");
const ProductCategoryService = require("../services/ProductCategory.service");
const orderService = require("../services/Order.service");
const paymentService = require("../services/Payment.service");
const customerService = require("../services/Customer.service");
const orderProductService = require("../services/OrderProduct.service");
const sequelize = require("../models").sequelize;

const categories = [
  // {
  //   id: "coffee",
  //   name: "Cà phê",
  //   icon: "https://stc-zmp.zadn.vn/templates/zaui-coffee/dummy/category-coffee.svg",
  //   description: "Cà phê ngon từ những hạt cà phê chất lượng nhất",
  // },
  // {
  //   id: "matcha",
  //   name: "Trà xanh",
  //   icon: "https://stc-zmp.zadn.vn/templates/zaui-coffee/dummy/category-matcha.svg",
  //   description: "Trà xanh ngon từ những lá trà xanh tươi mát",
  // },
  // {
  //   id: "food",
  //   name: "Đồ ăn vặt",
  //   icon: "https://stc-zmp.zadn.vn/templates/zaui-coffee/dummy/category-food.svg",
  //   description: "Đồ ăn vặt ngon từ những nguyên liệu tươi ngon",
  // },
  // {
  //   id: "milktea",
  //   name: "Trà sữa",
  //   icon: "https://stc-zmp.zadn.vn/templates/zaui-coffee/dummy/category-milktea.svg",
  //   description: "Trà sữa ngon từ những nguyên liệu tươi ngon",
  // },
  // {
  //   id: "drinks",
  //   name: "Giải khát",
  //   icon: "https://stc-zmp.zadn.vn/templates/zaui-coffee/dummy/category-drinks.svg",
  //   description: "Đồ uống giải khát ngon từ những nguyên liệu tươi ngon",
  // },
  // {
  //   id: "bread",
  //   name: "Bánh mỳ",
  //   icon: "https://stc-zmp.zadn.vn/templates/zaui-coffee/dummy/category-bread.svg",
  //   description: "Bánh mỳ ngon từ những nguyên liệu tươi ngon",
  // },
  // {
  //   id: "juice",
  //   name: "Nước ép",
  //   icon: "https://stc-zmp.zadn.vn/templates/zaui-coffee/dummy/category-juice.svg",
  //   description: "Nước ép ngon từ những nguyên liệu tươi ngon",
  // },
  { 
    id: "wangcha",
    name: "Wangcha",
    icon: "https://www.svgrepo.com/show/404896/bubble-tea.svg",
    description: "Trà sữa tự pha",
  },
  {
    id: "bot",
    name: "Bột",
    icon: "https://www.svgrepo.com/show/82177/flour.svg",
    description: "Bột pha trà sữa",
  },
  {
    id: "tra",
    name: "Trà",
    icon: "https://www.svgrepo.com/show/475109/cola.svg",
    description: "Các loại trà thơm ngon",
  },
  {
    id: "topping",
    name: "Topping",
    icon: "https://www.svgrepo.com/show/530622/milk-tea.svg",
    description: "Topping thơm và ngon",
  },
  {
    id: "spdonghop",
    name: "Sản phẩm đóng hộp",
    icon: "https://www.svgrepo.com/show/404925/canned-food.svg",
    description: "Các sản phẩm đóng hộp",
  }
];

const products = [
  // {
  //   id: 1,
  //   name: "Caramel Latte",
  //   price: 35000,
  //   image:
  //     "https://stc-zmp.zadn.vn/templates/zaui-coffee/dummy/product-square-1.webp",
  //   description:
  //     "There is a set of mock banners available <u>here</u> in three colours and in a range of standard banner sizes",
  //   categoryId: ["coffee", "drinks"],
  //   variantId: ["size", "topping"],
  // },
  // {
  //   id: 2,
  //   name: "Mocha Frappuccino",
  //   price: 45000,
  //   image:
  //     "https://stc-zmp.zadn.vn/templates/zaui-coffee/dummy/product-square-2.webp",
  //   description:
  //     "There is a set of mock banners available <u>here</u> in three colours and in a range of standard banner sizes",
  //   categoryId: ["coffee"],
  //   variantId: ["size", "topping"],
  // },
  // {
  //   id: 3,
  //   name: "Grilled Pork Banh Mi",
  //   price: 30000,
  //   image:
  //     "https://stc-zmp.zadn.vn/templates/zaui-coffee/dummy/product-square-3.webp",
  //   description:
  //     "There is a set of mock banners available <u>here</u> in three colours and in a range of standard banner sizes",
  //   categoryId: ["food", "bread"],
  //   variantId: ["size"],
  // },
  // {
  //   id: 4,
  //   name: "Pizza",
  //   price: 28000,
  //   image:
  //     "https://stc-zmp.zadn.vn/templates/zaui-coffee/dummy/product-square-4.webp",
  //   description:
  //     "There is a set of mock banners available <u>here</u> in three colours and in a range of standard banner sizes",
  //   categoryId: ["food"],
  //   variantId: ["size"],
  // },
  // {
  //   id: 5,
  //   name: "Vanilla Latte",
  //   price: 35000,
  //   image:
  //     "https://stc-zmp.zadn.vn/templates/zaui-coffee/dummy/product-square-5.webp",
  //   description:
  //     "There is a set of mock banners available <u>here</u> in three colours and in a range of standard banner sizes",
  //   categoryId: ["coffee", "matcha"],
  //   variantId: ["size", "topping"],
  // },
  // {
  //   id: 6,
  //   name: "Caramel Macchiato",
  //   price: 38000,
  //   image:
  //     "https://stc-zmp.zadn.vn/templates/zaui-coffee/dummy/product-square-6.webp",
  //   description:
  //     "There is a set of mock banners available <u>here</u> in three colours and in a range of standard banner sizes",
  //   categoryId: ["coffee", "milktea"],
  //   variantId: ["size", "topping"],
  // },
  // {
  //   id: 7,
  //   name: "Espresso",
  //   price: 32000,
  //   image:
  //     "https://stc-zmp.zadn.vn/templates/zaui-coffee/dummy/product-square-7.webp",
  //   description:
  //     "There is a set of mock banners available <u>here</u> in three colours and in a range of standard banner sizes",
  //   categoryId: ["coffee"],
  //   variantId: ["size", "topping"],
  // },
  // {
  //   id: 8,
  //   name: "Green Tea Latte",
  //   price: 25000,
  //   image:
  //     "https://stc-zmp.zadn.vn/templates/zaui-coffee/dummy/product-square-8.webp",
  //   description:
  //     "There is a set of mock banners available <u>here</u> in three colours and in a range of standard banner sizes",
  //   categoryId: ["matcha"],
  //   variantId: ["size", "topping"],
  // },
  // {
  //   id: 9,
  //   name: "Bộ 3 Blue Corner Coffee siêu HOT",
  //   image:
  //     "https://stc-zmp.zadn.vn/templates/zaui-coffee/dummy/product-rect-1.webp",
  //   price: 25000,
  //   sale: {
  //     type: "percent",
  //     percent: 0.2,
  //   },
  //   description:
  //     "There is a set of mock banners available <u>here</u> in three colours and in a range of standard banner sizes",
  //   categoryId: ["coffee", "milktea", "drinks"],
  //   variantId: ["size", "topping"],
  // },
  // {
  //   id: 10,
  //   name: "Combo Hi Tea Aroma",
  //   image:
  //     "https://stc-zmp.zadn.vn/templates/zaui-coffee/dummy/product-rect-2.webp",
  //   price: 57000,
  //   sale: {
  //     type: "fixed",
  //     amount: 7000,
  //   },
  //   description:
  //     "There is a set of mock banners available <u>here</u> in three colours and in a range of standard banner sizes",
  //   categoryId: ["coffee", "drinks"],
  //   variantId: ["size", "topping"],
  // },
  // {
  //   id: 11,
  //   name: "Milk Tea Combo",
  //   price: 55000,
  //   image:
  //     "https://stc-zmp.zadn.vn/templates/zaui-coffee/dummy/product-rect-3.webp",
  //   description:
  //     "There is a set of mock banners available <u>here</u> in three colours and in a range of standard banner sizes",
  //   categoryId: ["milktea"],
  //   variantId: ["size", "topping"],
  //   sale: {
  //     type: "percent",
  //     percent: 0.5,
  //   },
  // },
  {
    id: 111,
    name: "Bịch Trà Sữa Wangcha Vị Matcha pha trà sữa tiện lợi - Bột Hòa Tan Trà Sữa Matcha 6 gói và 6 gói Thạch 3Q ngọc trai 6 gói",
    price: 90000,
    image:
      "https://product.hstatic.net/200000538679/product/tra-sua-mat-cha_bich-_6-_goi_b29f613131314c0a99f959aea58a53e6_1024x1024.png",
    description: "Thương hiệu: Lê Trình | Tình trạng: Còn hàng <br>Thông tin sản phẩm đang cập nhật",
    categoryId: ["wangcha"],
    // variantId: ["size", "topping"],
  },
  {
    id: 112,
    name: "Bịch Trà Sữa Wangcha Vị Truyền thống pha trà sữa tiện lợi - Bột Hòa Tan Trà Sữa 3IN1 6 gói và 6 gói Thạch 3Q ngọc trai 6 gói",
    price: 90000,
    image:
      "https://product.hstatic.net/200000538679/product/tra-sua-truyen-thong-wang-cha-bich-6-goi_f0019f295f3f486cad4d5300fbab890f_1024x1024.png",
    description: "Thương hiệu: Lê Trình | Tình trạng: Còn hàng <br>Thông tin sản phẩm đang cập nhật",

    categoryId: ["wangcha"],
    // variantId: ["size", "topping"],
  },
  {
    id: 113,
    name: "Trà chanh trân châu tự pha dạng ly 700ml thơm ngon",
    price: 23000,
    image:
      "https://product.hstatic.net/200000538679/product/tra-chanh-tran-chau-tu-pha-wang-cha_d539f6c4ed6a413cb0b4161c35dc060b_1024x1024.png",
    description: "Thương hiệu: Lê Trình | Tình trạng: Còn hàng <br>Thông tin sản phẩm đang cập nhật",

    categoryId: ["wangcha"],
    // variantId: ["size"],
  },
  {
    id: 114,
    name: "Trà đào trân châu tự pha dạng ly 700ml, tiện lợi thơm ngon",
    price: 23000,
    image:
      "https://product.hstatic.net/200000538679/product/tra-dao-tran-chau-tu-pha-wang-cha_1ea799fa53f146929fd97cd0849bf37a_1024x1024.png",
    description: "Thương hiệu: Lê Trình | Tình trạng: Còn hàng <br>Thông tin sản phẩm đang cập nhật",

    categoryId: ["wangcha"],
    // variantId: ["size"],
  },
  {
    id: 115,
    name: "Trà Sữa Tiện Lợi 3IN1 Wangcha Vị Truyền Thống Hộp 400gr",
    price: 70000,
    image:
      "https://product.hstatic.net/200000538679/product/hop_tra_sua_wangcha_3in1_vi_truyen_thong_de73970ec33e43bd8182a03cf47b611a_1024x1024.jpg",
    description: "Thương hiệu: Lê Trình | Tình trạng: Còn hàng <br>Thông tin sản phẩm đang cập nhật",

    categoryId: ["wangcha"],
    // variantId: ["size", "topping"],
  },
  {
    id: 116,
    name: "Trà Sữa Tiện Lợi Wangcha Vị Matcha Hộp 400gr",
    price: 75000,
    image:
      "https://product.hstatic.net/200000538679/product/hop_tra_sua_wangcha_vi_matcha_ced4b938ab7d4155b9085849931e79bc_1024x1024.jpg",
    description: "Thương hiệu: Lê Trình | Tình trạng: Còn hàng <br>Thông tin sản phẩm đang cập nhật",

    categoryId: ["wangcha"],
    // variantId: ["size", "topping"],
  },
  {
    id: 117,
    name: "Trà Sữa Tiện Lợi WangCha Vị Socola Hộp 400gr",
    price: 75000,
    image:
      "https://product.hstatic.net/200000538679/product/hop_tra_sua_wangcha_vi_socola_dd01253ca0a34827849095472674bebe_1024x1024.jpg",
    description: "Thương hiệu: Lê Trình | Tình trạng: Còn hàng <br>Thông tin sản phẩm đang cập nhật",

    categoryId: ["wangcha"],
    // variantId: ["size", "topping"],
  },
  {
    id: 118,
    name: "Trà Sữa Tự Pha Wangcha 3IN1 Ly 100gr",
    price: 23000,
    image:
      "https://product.hstatic.net/200000538679/product/ly_tra_sua_wangcha_3in1_23f5b059f692424d9acf0c0c7e21055c_1024x1024.jpg",
    description: "Thương hiệu: Lê Trình | Tình trạng: Còn hàng <br>Thông tin sản phẩm đang cập nhật",

    categoryId: ["wangcha"],
    // variantId: ["size", "topping"],
  },
  {
    id: 119,
    name: "Bột Cacao Nguyên Chất Lê Trình",
    image:
      "https://product.hstatic.net/200000538679/product/bot_cacao_7630336b6e4d45f5aeb8d6b1f3ca4224_1024x1024.jpg",
    price: 100000,
    // sale: {
    //   type: "percent",
    //   percent: 0.2,
    // },
    description: "Thương hiệu: Lê Trình | Tình trạng: Còn hàng <br>Thông tin sản phẩm đang cập nhật",

    categoryId: ["bot"],
    // variantId: ["bot"],
  },
  {
    id: 1110,
    name: "Bột Frappe bịch 500g",
    image:
      "https://product.hstatic.net/200000538679/product/bot-frappe_a73b9688f8fe41bcac4a50d2055981d2_1024x1024.png",
    price: 100000,
    // sale: {
    //   type: "fixed",
    //   amount: 7000,
    // },
    description: "Thương hiệu: Lê Trình | Tình trạng: Còn hàng <br>Thông tin sản phẩm đang cập nhật",

    categoryId: ["bot"],
    // variantId: ["size", "topping"],
  },
  {
    id: 1111,
    name: "Bột Hòa Tan Trà Sữa Matcha Kingsun 3IN1",
    price: 160000,
    image:
      "https://product.hstatic.net/200000538679/product/bot_hoa_tan_tra_sua_matcha_king_ad5fb7170ef54a938fdbe1b212e53a22_1024x1024.jpg",
    description: "Thương hiệu: Lê Trình | Tình trạng: Còn hàng <br>Thông tin sản phẩm đang cập nhật",

    categoryId: ["bot"],
    // variantId: ["size", "topping"],
    // sale: {
    //   type: "percent",
    //   percent: 0.5,
    // },
  },
  {
    id: 1112,
    name: "Bột Pha Trà Sữa EuroDeli bịch 1kg",
    price: 93000,
    image:
      "https://product.hstatic.net/200000538679/product/bot-pha-tra-sua-eurodeli_48aa9b96e550435aa140c34f297168b9_1024x1024.jpg",
    description: "Thương hiệu: Lê Trình | Tình trạng: Còn hàng <br>Thông tin sản phẩm đang cập nhật",

    categoryId: ["bot"],
    // variantId: ["size", "topping"],
  },
  {
    id: 1113,
    name: "Bột Pha Trà Sữa Hòa Tan 3IN1 Kingsun 1kg",
    price: 135000,
    image:
      "https://product.hstatic.net/200000538679/product/bot_hoa_tan_tra_sua_3in1_king_b33ecd0248d044b6955e62231e1dedd1_1024x1024.jpg",
    description: "Thương hiệu: Lê Trình | Tình trạng: Còn hàng <br>Thông tin sản phẩm đang cập nhật",

    categoryId: ["bot"],
    // variantId: ["size", "topping"],
  },
  {
    id: 1114,
    name: "Bột Pha Trà Sữa SUPER LION Non Dairy Creamer",
    price: 1750000,
    image:
      "https://product.hstatic.net/200000538679/product/creamer_a5a7115d66d24c4da24b713d1270b05f_1024x1024.jpg",
    description: "Thương hiệu: Lê Trình | Tình trạng: Còn hàng <br>Thông tin sản phẩm đang cập nhật",

    categoryId: ["bot"],
    // variantId: ["size", "topping"],
  },
  {
    id: 1115,
    name: "Bột Pha Trà Sữa Thái Lan Kingsun",
    price: 67000,
    image:
      "https://product.hstatic.net/200000538679/product/bot_pha_tra_sua_074167229d4247a19dbd6ecf23ba433c_1024x1024.jpg",
    description: "Thương hiệu: Lê Trình | Tình trạng: Còn hàng <br>Thông tin sản phẩm đang cập nhật",

    categoryId: ["bot"],
    // variantId: ["size", "topping"],
  },
  {
    id: 1116,
    name: "Bột Trà Sữa Hương Khoai Môn 1kg",
    price: 145000,
    image:
      "https://product.hstatic.net/200000538679/product/bot_hoa_tan_tra_sua_khoai_mon_king_383f859ba6724051b26101f2f46eef05_1024x1024.jpg",
    description: "Thương hiệu: Lê Trình | Tình trạng: Còn hàng <br>Thông tin sản phẩm đang cập nhật",

    categoryId: ["bot"],
    // variantId: ["size", "topping"],
  },
  {
    id: 1117,
    name: "Trà Lài Xuân Yến - Tinh hoa trà Việt hộp 150g",
    price: 23000,
    image:
      "https://product.hstatic.net/200000538679/product/tra-lai-xuan-yen_5823441bc11440cd894f06b3daab571c_1024x1024.png",
    description: "Thương hiệu: Lê Trình | Tình trạng: Còn hàng <br>Thông tin sản phẩm đang cập nhật",

    categoryId: ["tra"],
    // variantId: ["size", "topping"],
  },
  {
    id: 1118,
    name: "Trà Móc Câu Xuân Yến - Trà thượng hạng hộp 150g",
    price: 23000,
    image:
      "https://product.hstatic.net/200000538679/product/tra-moc-cau-xuan-yen_7875ad4b7778401faf5ad06ed4f82642_1024x1024.png",
    description: "Thương hiệu: Lê Trình | Tình trạng: Còn hàng <br>Thông tin sản phẩm đang cập nhật",

    categoryId: ["tra"],
      // variantId: ["size", "topping"],
  },
  {
    id: 1119,
    name: "Đậu Đỏ King Sun Hộp 560g",
    price: 50000,
    image:
      "https://product.hstatic.net/200000538679/product/dau_do_04d28c6c22714d3fb3da46303ad82d83_1024x1024.jpg",
    description: "Thương hiệu: Lê Trình | Tình trạng: Còn hàng <br>Thông tin sản phẩm đang cập nhật",

    categoryId: ["topping", "spdonghop"],
    // variantId: ["size", "topping"],
  },
];

const variants = [
  {
    id: "size",
    label: "Kích cỡ",
    type: "single",
    default: "m",
    options: [
      {
        id: "s",
        label: "Nhỏ",
        priceChange: {
          type: "percent",
          percent: -0.2,
        },
      },
      {
        id: "m",
        label: "Vừa",
      },
      {
        id: "l",
        label: "To",
        priceChange: {
          type: "percent",
          percent: 0.2,
        },
      },
    ],
  },
  {
    id: "topping",
    label: "Topping",
    type: "multiple",
    default: ["t1", "t4"],
    options: [
      {
        id: "t1",
        label: "Trân châu",
        priceChange: {
          type: "fixed",
          amount: 5000,
        },
      },
      {
        id: "t2",
        label: "Bánh flan",
        priceChange: {
          type: "fixed",
          amount: 10000,
        },
      },
      {
        id: "t3",
        label: "Trang trí",
        priceChange: {
          type: "percent",
          percent: 0.15,
        },
      },
      {
        id: "t4",
        label: "Không lấy đá",
        priceChange: {
          type: "fixed",
          amount: -5000,
        },
      },
    ],
  },
];

const orders = [
  {
    id: "481034707442110021390829492_1724006525222",
    customer_id: "759280903754672029",
    shipping_address: "102/34/56 Quang Trung,Gò Vấp, HCM",
    total_amount: 1000000,
    shipping_fee: 10000,
    toal_products: 5,
    note: "Không giao vào buổi sáng",
    products: [
      {
        product_id: "3",
        quantity: 2,
      },
      {
        product_id: "1",
        quantity: 2,
      },
      {
        product_id: "7",
        quantity: 1,
      },
    ],
  },
  {
    id: "481034707442110021390829492_1724006525223",
    customer_id: "759280903754672026",
    shipping_address: "102/34/56 Quang Trung,Gò Vấp, HCM",
    total_amount: 50000,
    shipping_fee: 10000,
    toal_products: 3,
    note: "Giao hàng nhanh",
    products: [
      {
        product_id: "6",
        quantity: 2,
      },
      {
        product_id: "7",
        quantity: 1,
      },
    ],
  },
];

const payments = [
  {
    order_id: "481034707442110021390829492_1724006525222",
    payment_method: "ZALOPAY_SANDBOX",
    status: "success",
    amount: 1010000,
    description: "Thanh toán cho t-coffee",
  },
  {
    order_id: "481034707442110021390829492_1724006525223",
    payment_method: "ZALOPAY_SANDBOX",
    status: "success",
    amount: 51000,
    description: "Thanh toán cho t-coffee",
  },
];

const customers = [
  {
    id: "759280903754672026",
    name: "Trần thị đẹt",
    phone: "0909987654",
    address: "102/34/56 Quang Trung,Gò Vấp, HCM",
  },
  {
    id: "759280903754672029",
    name: "Nguyễn Văn Tèo",
    phone: "0877665544",
    address: "102/34/56 Quang Trung,Gò Vấp, HCM",
  },
  {
    id: "5896015425603615891",
    name: "Bùi Trí Thức",
    phone: "84963015348",
    address: "102/28 Phan Huy Ich,Tan Binh, HCM",
  },
  {
    id: "759280903754672031",
    name: "Nguyễn Văn A",
    phone: "0355676767",
    address: "102/34/56 Quang Trung,Gò Vấp, HCM",
  },
];

const insertDataToDB = async () => {
  try {
    for (const item of categories) {
      console.log("add caterogy : ", item.id);

      await categoryService.createCategory({
        id: item.id,
        name: item.name,
        icon: item.icon,
        description: item.description,
      });
    }

    // for (const item of variants) {
    //   console.log("add variant : ", item.id);

    //   await variantService.createVariant(item);
    // }

    for (const item of products) {
      console.log("add product : ", item.name);
      await productService.createProduct({
        name: item.name,
        price: item.price,
        image: item.image,
        description: item.description,
      });

      for (const categoryId of item.categoryId) {
        const category = await categoryService.getCategoryById(categoryId);
        const product = await productService.getProductByName(item.name);
        if (!category) {
          console.error(`Category ${categoryId} not found`);
          return;
        } else if (!product) {
          console.error(`Product ${item.name} not found`);
          return;
        }
        console.log("add product category : ", product.id, category.id);

        await ProductCategoryService.createProductCategory({
          product_id: product.id,
          category_id: category.id,
        });
      }

      // item.variantId.forEach(async (variantId) => {
      //   const variant = await variantService.getVariantById(variantId);
      //   const product = await productService.getProductByName(item.name);
      //   if (!variant) {
      //     console.error(`Variant ${variantId} not found`);
      //     return;
      //   }
      //   console.log("add product variant : ", product.id, variant.id);

      //   await ProductVariantService.createProductVariant({
      //     product_id: product.id,
      //     variant_id: variant.id,
      //   });
      // });
    }

    // for (const item of variants) {
    //   const variant = await variantService.getVariantById(item.id);
    //   if (!variant) {
    //     console.error(`Variant ${item.id} not found`);
    //     return;
    //   }
    //   for (const option of item.options) {
    //     console.log("add variant option : ", option);
    //     console.log("Variant option :", item);

    //     await variantOptionService.createVariantOption({
    //       ...option,
    //       variant_id: variant.id,
    //     });
    //   }
    // }

    // insert customer
    // for (const item of customers) {
    //   console.log("add customer : ", item.name);

    //   await customerService.createCustomer(item);
    // }

    // insert order
    // for (const order of orders) {
    //   console.log("add order : ", order.id);

    //   let customer = await customerService.getCustomerById(order.customer_id);
    //   if (!customer) {
    //     throw new Error(`Customer ${order.customer_id} not found`);
    //   }

    //   const createOrder = await orderService.createOrder(order);

    //   order?.products.map(async (orderProduct) => {
    //     const product = await productService.getProductById(
    //       orderProduct.product_id
    //     );

    //     if (!product) {
    //       throw new Error(`Product ${orderProduct.product_id} not found`);
    //     }

    //     return await orderProductService.createOrderProduct({
    //       order_id: createOrder.id,
    //       product_id: orderProduct.product_id,
    //       quantity: orderProduct.quantity,
    //       price: product.price * orderProduct.quantity,
    //     });
    //   });
    // }

    // insert payment
    // for (const item of payments) {
    //   console.log("add payment : ", item.order_id);

    //   await paymentService.createPayment(item);
    // }

    console.log("Data inserted successfully");
  } catch (error) {
    console.error("Error inserting data: ", error);
  }
};

module.exports = insertDataToDB;
