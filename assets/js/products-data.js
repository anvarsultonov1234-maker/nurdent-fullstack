/**
 * NurDent Products Database
 * Fully curated & categorized for NurDent Dental Store
 * Includes stock status architecture: 'in_stock' | 'out_of_stock' | 'on_order'
 */

const NURDENT_PRODUCTS = [
  {
    "id": "431",
    "category": "sets",
    "name_uz": "Stomatologik asboblar to‘plami (8 ta asbob + 1 lotok)",
    "name_ru": "Набор стоматологических инструментов (8 инструментов + 1 лоток)",
    "desc_uz": "Yuqori sifatli zanglamas tibbiy po‘latdan ishlangan professional asboblar to‘plami va qulay metall lotok. 134°C gacha avtoklavda sterilizatsiya qilinadi.",
    "desc_ru": "Профессиональный набор инструментов из высококачественной медицинской нержавеющей стали и удобный металлический лоток. Автоклавируется до 134°C.",
    "price": 270000,
    "price_display_uz": "270 000 so'm",
    "price_display_ru": "270 000 сум",
    "in_stock": true,
    "badge_uz": "Xit to‘plam",
    "badge_ru": "Хит набор",
    "images": [
      "assets/images/item_431_1.jpg"
    ],
    "status": "in_stock"
  },
  {
    "id": "429",
    "category": "surgery",
    "name_uz": "Stomatologik shiptsilar to‘plami (10 talik komplekt)",
    "name_ru": "Набор стоматологических хирургических щипцов (10 шт)",
    "desc_uz": "Tish sug‘urish va jarrohlik amaliyotlari uchun to‘liq 10 talik shiptsilar to‘plami. Ergonomik tutqich va mustahkam tutish yuzasi.",
    "desc_ru": "Полный комплект хирургических щипцов для удаления зубов из 10 предметов. Эргономичные ручки и надёжный захват.",
    "price": 2200000,
    "price_display_uz": "2 200 000 so'm",
    "price_display_ru": "2 200 000 сум",
    "in_stock": true,
    "badge_uz": "Komplekt",
    "badge_ru": "Комплект",
    "images": [
      "assets/images/item_429_1.jpg"
    ],
    "status": "in_stock"
  },
  {
    "id": "423",
    "category": "surgery",
    "name_uz": "Universal ortopedik va implantologik kalitlar to‘plami",
    "name_ru": "Универсальный набор ортопедических ключей",
    "desc_uz": "Implantologiya va ortopediya uchun universal kalitlar komplekti. Har xil tizimlar bilan ishlash uchun qulay va bardoshli.",
    "desc_ru": "Универсальный набор ключей для ортопедии и имплантологии. Подходит для различных систем, высокая прочность.",
    "price": 960000,
    "price_display_uz": "960 000 so'm",
    "price_display_ru": "960 000 сум",
    "in_stock": true,
    "badge_uz": "Tavsiya etiladi",
    "badge_ru": "Рекомендуем",
    "images": [
      "assets/images/item_423_1.jpg"
    ],
    "status": "in_stock"
  },
  {
    "id": "427",
    "category": "surgery",
    "name_uz": "Jarrohlik osteotomi",
    "name_ru": "Хирургический остеотом",
    "desc_uz": "Implantat o‘rnatish va suyak to‘qimasini kengaytirish uchun mo‘ljallangan yuqori aniqlikdagi jarrohlik osteotomi.",
    "desc_ru": "Высокоточный хирургический остеотом для расщепления костного гребня и установки имплантов.",
    "price": 1000000,
    "price_display_uz": "1 000 000 so'm",
    "price_display_ru": "1 000 000 сум",
    "in_stock": true,
    "badge_uz": "Premium",
    "badge_ru": "Премиум",
    "images": [
      "assets/images/item_427_1.jpg"
    ],
    "status": "in_stock"
  },
  {
    "id": "425",
    "category": "equipment",
    "name_uz": "Stomatologik Peskostruy (Qum purkagich)",
    "name_ru": "Стоматологический пескоструйный аппарат",
    "desc_uz": "Metall va keramika yuzalarni mikro-tozalash hamda yopishqoqlikni oshirish uchun ixcham va kuchli peskostruy apparati.",
    "desc_ru": "Компактный и мощный пескоструйный аппарат для микроабразивной обработки металла, керамики и композитов.",
    "price": 780000,
    "price_display_uz": "780 000 so'm",
    "price_display_ru": "780 000 сум",
    "in_stock": true,
    "badge_uz": "Mashhur",
    "badge_ru": "Популярный",
    "images": [
      "assets/images/item_425_1.jpg"
    ],
    "status": "in_stock"
  },
  {
    "id": "424",
    "category": "equipment",
    "name_uz": "Simsiz Polimerizatsiya lampasi",
    "name_ru": "Беспроводная фотополимеризационная лампа",
    "desc_uz": "Kuchli yorug‘lik oqimi va tezkor qotirish rejimlari bilan jihozlangan stomatologik polimerizatsiya lampasi (buyurtmaga).",
    "desc_ru": "Мощная фотополимеризационная лампа с несколькими режимами отверждения композитных материалов (на заказ).",
    "price": 750000,
    "price_display_uz": "750 000 so'm",
    "price_display_ru": "750 000 сум",
    "in_stock": true,
    "badge_uz": "Buyurtmaga",
    "badge_ru": "На заказ",
    "images": [
      "assets/images/item_424_1.jpg"
    ],
    "status": "in_stock"
  },
  {
    "id": "378",
    "category": "equipment",
    "name_uz": "NICEDEN Simsiz Endodontik Obturator",
    "name_ru": "Беспроводной обтуратор NICEDEN",
    "desc_uz": "Ildiz kanallarini gutta-percha bilan to‘ldirish uchun zamonaviy qurilma. Vertikal zichlash, atigi 3 soniyada tez qiziydi.",
    "desc_ru": "Современный инструмент для эндодонтического лечения. Вертикальная компакция гуттаперчи, нагрев за 3 секунды, эргономичный корпус.",
    "price": 610000,
    "price_display_uz": "610 000 so'm",
    "price_display_ru": "610 000 сум",
    "in_stock": true,
    "badge_uz": "Yangi",
    "badge_ru": "Новинка",
    "images": [
      "assets/images/item_378_1.jpg",
      "assets/images/item_378_2.jpg"
    ],
    "status": "in_stock"
  },
  {
    "id": "426",
    "category": "therapy",
    "name_uz": "Endodontik Plagger",
    "name_ru": "Эндодонтический плаггер",
    "desc_uz": "Gutta-perchani zichlash va kanal bo‘ylab aniq taqsimlash uchun professional ikki tomonlama plagger.",
    "desc_ru": "Профессиональный двухсторонний плаггер для точной конденсации и уплотнения гуттаперчи в каналах.",
    "price": 610000,
    "price_display_uz": "610 000 so'm",
    "price_display_ru": "610 000 сум",
    "in_stock": true,
    "badge_uz": "",
    "badge_ru": "",
    "images": [
      "assets/images/item_426_1.jpg"
    ],
    "status": "in_stock"
  },
  {
    "id": "376",
    "category": "sets",
    "name_uz": "Stomatologik fotokontraster to‘plami (6 ta shakl)",
    "name_ru": "Набор стоматологических контрастеров (6 форм)",
    "desc_uz": "Mukammal intraoral fotosuratlar olish uchun toza qora fon yaratuvchi 6 xil shakldagi mustahkam metall kontraster to‘plami.",
    "desc_ru": "Набор из 6 форм металлических контрастеров с матовым покрытием для идеальной интраоральной дентальной фотосъемки.",
    "price": 400000,
    "price_display_uz": "400 000 so'm",
    "price_display_ru": "400 000 сум",
    "in_stock": true,
    "badge_uz": "Foto to'plam",
    "badge_ru": "Фотонабор",
    "images": [
      "assets/images/item_376_1.jpg"
    ],
    "status": "in_stock"
  },
  {
    "id": "377",
    "category": "therapy",
    "name_uz": "Stomatologik fotokontraster C-4B (o‘lchov chizig‘i bilan)",
    "name_ru": "Стоматологический фотоконтрастер C-4B",
    "desc_uz": "Ichki og‘iz suratga olish uchun o‘lchov chizig‘iga ega professional fotokontraster. 134°C gacha avtoklavda sterilizatsiya qilinadi.",
    "desc_ru": "Профессиональный инструмент со встроенной линейкой для измерений. Матовое антибликовое покрытие, автоклавируемый.",
    "price": 80000,
    "price_display_uz": "80 000 so'm",
    "price_display_ru": "80 000 сум",
    "in_stock": true,
    "badge_uz": "",
    "badge_ru": "",
    "images": [
      "assets/images/item_377_1.jpg"
    ],
    "status": "in_stock"
  },
  {
    "id": "422",
    "category": "surgery",
    "name_uz": "Avtomatik Koronko-yechuvchi (Koronkosnimatel)",
    "name_ru": "Коронкосниматель автоматический",
    "desc_uz": "Sun’iy qoplamalar (koronkalar) va ko‘priksimon protezlarni xavfsiz va tez yechish uchun mo‘ljallangan mexanizm.",
    "desc_ru": "Надёжный инструмент для снятия коронок и мостовидных протезов без повреждения опорных зубов.",
    "price": 300000,
    "price_display_uz": "300 000 so'm",
    "price_display_ru": "300 000 сум",
    "in_stock": true,
    "badge_uz": "",
    "badge_ru": "",
    "images": [
      "assets/images/item_422_1.jpg"
    ],
    "status": "in_stock"
  },
  {
    "id": "417",
    "category": "surgery",
    "name_uz": "Lindeman Jarrohlik Frezasi (1721 / 2326)",
    "name_ru": "Хирургическая фреза Линдемана (1721 / 2326)",
    "desc_uz": "Suyak to‘qimasini kesish va shakllantirish uchun maxsus volfram-karbid Lindeman frezasi. Yuqori kesish unumdorligi.",
    "desc_ru": "Специальная твердосплавная фреза Линдемана для распила костной ткани и сепарации корней (на заказ).",
    "price": 280000,
    "price_display_uz": "280 000 so'm / dona",
    "price_display_ru": "280 000 сум / шт",
    "in_stock": true,
    "badge_uz": "Buyurtmaga",
    "badge_ru": "На заказ",
    "images": [
      "assets/images/item_417_1.jpg"
    ],
    "status": "in_stock"
  },
  {
    "id": "395",
    "category": "equipment",
    "name_uz": "NICEDEN Fiziodispenser Uchligi (20:1)",
    "name_ru": "Угловой наконечник для физиодиспенсера NICEDEN (20:1)",
    "desc_uz": "Implantologiya va jag‘ jarrohligi uchun mo‘ljallangan pasaytiruvchi burchakli наконечник. Tashqi va ichki sovitish tizimi.",
    "desc_ru": "Понижающий наконечник 20:1 для имплантации и хирургии. Внутреннее и внешнее охлаждение, высокая точность.",
    "price": 950000,
    "price_display_uz": "950 000 so'm (75$)",
    "price_display_ru": "950 000 сум (75$)",
    "in_stock": true,
    "badge_uz": "Original",
    "badge_ru": "Оригинал",
    "images": [
      "assets/images/item_395_1.jpg",
      "assets/images/item_395_2.jpg"
    ],
    "status": "in_stock"
  },
  {
    "id": "421",
    "category": "surgery",
    "name_uz": "Multi-Unit tizimi komponentlari (To‘g‘ri, 17°, 30°)",
    "name_ru": "Компоненты системы Multi-Unit (Прямой, 17°, 30°)",
    "desc_uz": "Multi unit abutmentlar, transfer, kolpachok, scan marker va ortopedik kalitlar to‘liq assortimenti.",
    "desc_ru": "Полный спектр абатментов Multi-Unit, трансферы, колпачки, скан-маркеры и ортопедические ключи.",
    "price": 70000,
    "price_display_uz": "70 000 so'mdan",
    "price_display_ru": "от 70 000 сум",
    "in_stock": true,
    "badge_uz": "Multi-Unit",
    "badge_ru": "Multi-Unit",
    "images": [
      "assets/images/item_421_1.jpg"
    ],
    "status": "in_stock"
  },
  {
    "id": "399",
    "category": "surgery",
    "name_uz": "Multi-Unit uchun Transferlar",
    "name_ru": "Трансферы для Multi-Unit",
    "desc_uz": "Multi-Unit tizimida aniq o‘lcham (otpechatka) olish uchun ochiq va yopiq usuldagi sifatli transferlar.",
    "desc_ru": "Трансферы для снятия высокоточных слепков в системе Multi-Unit открытым и закрытым методом.",
    "price": 65000,
    "price_display_uz": "65 000 so'm",
    "price_display_ru": "65 000 сум",
    "in_stock": true,
    "badge_uz": "",
    "badge_ru": "",
    "images": [
      "assets/images/item_399_1.jpg",
      "assets/images/item_399_2.jpg"
    ],
    "status": "in_stock"
  },
  {
    "id": "416",
    "category": "surgery",
    "name_uz": "Osstem Yo‘naltiruvchi Frezasi (Buyurtmaga)",
    "name_ru": "Направляющая фреза Osstem (На заказ)",
    "desc_uz": "Osstem implantatsiya tizimi uchun yo‘naltiruvchi aniq jarrohlik frezasi.",
    "desc_ru": "Оригинальная направляющая хирургическая фреза для системы Osstem (поставляется под заказ).",
    "price": 0,
    "price_display_uz": "Kelishilgan narxda",
    "price_display_ru": "По согласованию",
    "in_stock": false,
    "badge_uz": "Buyurtmaga",
    "badge_ru": "На заказ",
    "images": [
      "assets/images/item_416_1.jpg"
    ],
    "status": "on_order"
  },
  {
    "id": "418",
    "category": "therapy",
    "name_uz": "Restavratsiya uchun silikon cho‘tkalar to‘plami (5 dona)",
    "name_ru": "Набор силиконовых кисточек для реставрации (5 шт)",
    "desc_uz": "Kompozit restavratsiyasida tish anatomiyasini va fissuralarni modellashtirish uchun har xil shakldagi 5 ta silikon cho‘tka.",
    "desc_ru": "Набор из 5 силиконовых кистей с различными формами наконечников для высокохудожественного моделирования композитов.",
    "price": 120000,
    "price_display_uz": "120 000 so'm",
    "price_display_ru": "120 000 сум",
    "in_stock": true,
    "badge_uz": "Top to'plam",
    "badge_ru": "Топ набор",
    "images": [
      "assets/images/item_418_1.jpg",
      "assets/images/item_418_2.jpg"
    ],
    "status": "in_stock"
  },
  {
    "id": "409",
    "category": "therapy",
    "name_uz": "Kompozit va emal uchun Polirovochniy to‘plam (Premium)",
    "name_ru": "Полировочный набор для композитов (Премиум)",
    "desc_uz": "Plombani oxirgi bosqichda oynadek porlash holatiga keltirish uchun professional polirovkalar to‘plami.",
    "desc_ru": "Профессиональный полировочный набор для финишной полировки и придания зеркального блеска композитным пломбам.",
    "price": 110000,
    "price_display_uz": "110 000 so'm",
    "price_display_ru": "110 000 сум",
    "in_stock": true,
    "badge_uz": "",
    "badge_ru": "",
    "images": [
      "assets/images/item_409_1.jpg",
      "assets/images/item_409_2.jpg"
    ],
    "status": "in_stock"
  },
  {
    "id": "411",
    "category": "therapy",
    "name_uz": "Stomatologik Polirovochniy to‘plam",
    "name_ru": "Полировочный набор стоматологический",
    "desc_uz": "Har xil qattiqlikdagi polirovka kallaklari to‘plami. Kompozit va keramika yuzalariga ideal ishlov beradi.",
    "desc_ru": "Набор полировочных головок различной абразивности для качественной обработки композитов.",
    "price": 65000,
    "price_display_uz": "65 000 so'm",
    "price_display_ru": "65 000 сум",
    "in_stock": true,
    "badge_uz": "Hamyonbop",
    "badge_ru": "Выгодно",
    "images": [
      "assets/images/item_411_1.jpg",
      "assets/images/item_411_2.jpg"
    ],
    "status": "in_stock"
  },
  {
    "id": "403",
    "category": "therapy",
    "name_uz": "Frontal tishlar uchun kontur matritsalar to‘plami",
    "name_ru": "Матрицы для фронтальных зубов",
    "desc_uz": "Oldingi (frontal) tishlarni restavratsiya qilishda tabiiy anatomiya va kontakt nuqtasini hosil qilish uchun shaffof matritsalar.",
    "desc_ru": "Контурные матрицы для анатомической реставрации фронтальной группы зубов с созданием правильного контактного пункта.",
    "price": 110000,
    "price_display_uz": "110 000 so'm",
    "price_display_ru": "110 000 сум",
    "in_stock": true,
    "badge_uz": "",
    "badge_ru": "",
    "images": [
      "assets/images/item_403_1.jpg"
    ],
    "status": "in_stock"
  },
  {
    "id": "405",
    "category": "therapy",
    "name_uz": "Qulflanuvchi (Zamkoviy) matritsalar to‘plami",
    "name_ru": "Замковые матрицы",
    "desc_uz": "Qulay fiksatsiya qulfiga ega po‘lat matritsalar to‘plami. Yon tishlar oraliqlarini ishonchli tiklash imkonini beradi.",
    "desc_ru": "Набор замковых металлических матриц с надежной системой фиксации без дополнительных зажимов.",
    "price": 115000,
    "price_display_uz": "115 000 so'm",
    "price_display_ru": "115 000 сум",
    "in_stock": true,
    "badge_uz": "",
    "badge_ru": "",
    "images": [
      "assets/images/item_405_1.jpg"
    ],
    "status": "in_stock"
  },
  {
    "id": "404",
    "category": "therapy",
    "name_uz": "Sektsion kontur matritsalar",
    "name_ru": "Секционные контурные матрицы",
    "desc_uz": "II toifadagi bo‘shliqlarni plombalash uchun anatomik shaklga ega yupqa po‘lat sektsion matritsalar.",
    "desc_ru": "Анатомические тонкие металлические секционные матрицы для идеального восстановления полостей II класса.",
    "price": 85000,
    "price_display_uz": "85 000 so'm",
    "price_display_ru": "85 000 сум",
    "in_stock": true,
    "badge_uz": "",
    "badge_ru": "",
    "images": [
      "assets/images/item_404_1.jpg"
    ],
    "status": "in_stock"
  },
  {
    "id": "385",
    "category": "therapy",
    "name_uz": "NiTi Matritsa ushlagichlari (01, 02, 03 o‘lchamlar)",
    "name_ru": "Матрицедержатели NiTi (размеры 01, 02, 03)",
    "desc_uz": "Nikel-titan qotishmasidan tayyorlangan mustahkam, shaklini yo‘qotmaydigan matritsa qisqichlari (xalqalari).",
    "desc_ru": "Сверхпрочные никель-титановые разделительные кольца (матрицедержатели), сохраняющие упругость при многократной автоклавации.",
    "price": 190000,
    "price_display_uz": "190 000 so'm (15$)",
    "price_display_ru": "190 000 сум (15$)",
    "in_stock": true,
    "badge_uz": "NiTi",
    "badge_ru": "NiTi",
    "images": [
      "assets/images/item_385_1.jpg",
      "assets/images/item_385_2.jpg",
      "assets/images/item_385_3.jpg"
    ],
    "status": "in_stock"
  },
  {
    "id": "397",
    "category": "therapy",
    "name_uz": "Matritsa ushlagich (A va B turlari)",
    "name_ru": "Матрицедержатель двух видов (A, B)",
    "desc_uz": "Matritsa lentasini mahkamlash va bo‘shliq atrofida mahkam ushlab turish uchun standart matritsauslagich.",
    "desc_ru": "Универсальный инструмент для надёжной фиксации и натяжения матричной ленты в полости рта.",
    "price": 60000,
    "price_display_uz": "60 000 so'm",
    "price_display_ru": "60 000 сум",
    "in_stock": true,
    "badge_uz": "",
    "badge_ru": "",
    "images": [
      "assets/images/item_397_1.jpg",
      "assets/images/item_397_2.jpg"
    ],
    "status": "in_stock"
  },
  {
    "id": "413",
    "category": "therapy",
    "name_uz": "Stomatologik tishli pinset",
    "name_ru": "Зубчатый стоматологический пинцет",
    "desc_uz": "Yupqa tishchalari va nozik uchi bilan mayda narsalarni, vata valiklarini qulay va mustahkam ushlovchi pinset.",
    "desc_ru": "Анатомический пинцет с зубчиками на кончиках для надёжного и деликатного удержания материалов.",
    "price": 95000,
    "price_display_uz": "95 000 so'm",
    "price_display_ru": "95 000 сум",
    "in_stock": true,
    "badge_uz": "",
    "badge_ru": "",
    "images": [
      "assets/images/item_413_1.jpg",
      "assets/images/item_413_2.jpg"
    ],
    "status": "in_stock"
  },
  {
    "id": "393",
    "category": "surgery",
    "name_uz": "Jarrohlik skalpel ushlagichi (Scalpel holder)",
    "name_ru": "Скальпель держатель хирургический",
    "desc_uz": "Bir martalik almashtiriladigan skalpel tig‘lari uchun qulay o‘lchovli mustahkam metall ushlagich.",
    "desc_ru": "Эргономичная цельнометаллическая ручка-держатель для стандартных сменных хирургических лезвий.",
    "price": 100000,
    "price_display_uz": "100 000 so'm",
    "price_display_ru": "100 000 сум",
    "in_stock": true,
    "badge_uz": "",
    "badge_ru": "",
    "images": [
      "assets/images/item_393_1.jpg",
      "assets/images/item_393_2.jpg"
    ],
    "status": "in_stock"
  },
  {
    "id": "372",
    "category": "surgery",
    "name_uz": "Karpul Shpritsi (Aspiratsion)",
    "name_ru": "Карпульный шприц стоматологический",
    "desc_uz": "Karpul anesteziyasi uchun aspiratsion qayta ishlanadigan yuqori sifatli stomatologik shprits.",
    "desc_ru": "Аспирационный карпульный шприц из нержавеющей стали для точной и безболезненной местной анестезии.",
    "price": 100000,
    "price_display_uz": "100 000 so'm",
    "price_display_ru": "100 000 сум",
    "in_stock": true,
    "badge_uz": "",
    "badge_ru": "",
    "images": [
      "assets/images/item_372_1.jpg"
    ],
    "status": "in_stock"
  },
  {
    "id": "389",
    "category": "therapy",
    "name_uz": "Metall Endo Lineyka (Kanal o‘lchagich)",
    "name_ru": "Эндодонтическая металлическая линейка",
    "desc_uz": "Ildiz kanallarining ishchi uzunligini va fayllarni aniq o‘lchash uchun avtoklavlanadigan metall lineyka.",
    "desc_ru": "Прецизионная металлическая линейка для измерения рабочей длины корневых каналов и эндодонтических инструментов.",
    "price": 25000,
    "price_display_uz": "25 000 so'm",
    "price_display_ru": "25 000 сум",
    "in_stock": true,
    "badge_uz": "Hamyonbop",
    "badge_ru": "Эконом",
    "images": [
      "assets/images/item_389_1.jpg",
      "assets/images/item_389_2.jpg"
    ],
    "status": "in_stock"
  },
  {
    "id": "406",
    "category": "consumables",
    "name_uz": "Artikulyatsion qog‘oz (Kopirovka, 300 dona)",
    "name_ru": "Копировальная бумага артикуляционная (300 шт)",
    "desc_uz": "Okklyuziya va tishlarning tishlash kontaktlarini aniq tekshirish uchun ikki tomonlama artikulyatsion qog‘oz.",
    "desc_ru": "Двусторонняя артикуляционная бумага для контроля окклюзионных контактов и прикуса (упаковка 300 шт).",
    "price": 105000,
    "price_display_uz": "105 000 so'm",
    "price_display_ru": "105 000 сум",
    "in_stock": true,
    "badge_uz": "300 dona",
    "badge_ru": "300 шт",
    "images": [
      "assets/images/item_406_1.jpg"
    ],
    "status": "in_stock"
  },
  {
    "id": "407",
    "category": "consumables",
    "name_uz": "Endodontik yuvish ignasi (100 dona o‘ram)",
    "name_ru": "Эндодонтические иглы для ирригации (100 шт)",
    "desc_uz": "Ildiz kanallarini xavfsiz yuvish uchun yon tomondan teshikli maxsus endodontik ignalar to‘plami.",
    "desc_ru": "Эндодонтические иглы с боковым срезом для безопасной и эффективной ирригации каналов. В упаковке 100 шт.",
    "price": 170000,
    "price_display_uz": "170 000 so'm / o‘ram",
    "price_display_ru": "170 000 сум / уп",
    "in_stock": true,
    "badge_uz": "100 dona",
    "badge_ru": "100 шт",
    "images": [
      "assets/images/item_407_1.jpg",
      "assets/images/item_407_2.jpg"
    ],
    "status": "in_stock"
  },
  {
    "id": "428",
    "category": "consumables",
    "name_uz": "Bir martalik jarrohlik xalati",
    "name_ru": "Хирургический халат одноразовый",
    "desc_uz": "Steril jarrohlik va stomatologik amaliyotlar uchun zich, nafas oluvchi spunbond matodan tayyorlangan xalat.",
    "desc_ru": "Одноразовый защитный хирургический халат из гипоаллергенного спанбонда для чистых процедур.",
    "price": 30000,
    "price_display_uz": "30 000 so'm",
    "price_display_ru": "30 000 сум",
    "in_stock": true,
    "badge_uz": "",
    "badge_ru": "",
    "images": [
      "assets/images/item_428_1.jpg"
    ],
    "status": "in_stock"
  },
  {
    "id": "374",
    "category": "consumables",
    "name_uz": "Bir martalik tibbiy qalpoqcha (Sharlotka, 100 dona)",
    "name_ru": "Медицинские шапочки-шарлотка (100 шт)",
    "desc_uz": "Klinika va operatsiya xonalari uchun yumshoq, qisuvchi rezinaga ega bir martalik sharlotka qalpoqchalari.",
    "desc_ru": "Одноразовые защитные береты (шарлотки) из нетканого материала на мягкой резинке. Упаковка 100 шт.",
    "price": 80000,
    "price_display_uz": "80 000 so'm",
    "price_display_ru": "80 000 сум",
    "in_stock": true,
    "badge_uz": "100 dona",
    "badge_ru": "100 шт",
    "images": [
      "assets/images/item_374_1.jpg",
      "assets/images/item_374_2.jpg"
    ],
    "status": "in_stock"
  },
  {
    "id": "381",
    "category": "surgery",
    "name_uz": "Dentium Surgical Kit (Jarrohlik to‘plami)",
    "name_ru": "Хирургический набор Dentium Surgical Kit",
    "desc_uz": "Dentium implantatsiya tizimi uchun original jarrohlik to‘plami (buyurtmaga).",
    "desc_ru": "Оригинальный полный хирургический набор для работы с системой дентальных имплантов Dentium (под заказ).",
    "price": 0,
    "price_display_uz": "Kelishilgan narxda",
    "price_display_ru": "По согласованию",
    "in_stock": false,
    "badge_uz": "Buyurtmaga",
    "badge_ru": "На заказ",
    "images": [
      "assets/images/item_381_1.jpg",
      "assets/images/item_381_2.jpg"
    ],
    "status": "on_order"
  }
];
