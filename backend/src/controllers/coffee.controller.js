const Coffee = require('../models/Coffee.model');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const FALLBACK_COFFEES = [
  {
    _id: '664b9f1a23a1000000000001',
    name: 'Artisanal House Espresso',
    description: 'A rich, full-bodied espresso featuring velvety notes of dark Belgian chocolate, toasted hazelnut, and a sweet caramel finish. Expertly roasted in small batches.',
    shortDescription: 'Rich dark chocolate & toasted hazelnut espresso blend.',
    price: 249,
    category: 'Espresso',
    roastLevel: 'Dark Roast',
    origin: 'Ethiopia Yirgacheffe & Colombia Huila',
    flavorNotes: ['Dark Chocolate', 'Toasted Hazelnut', 'Caramel'],
    sizes: ['Small (250ml)', 'Medium (350ml)', 'Large (450ml)'],
    images: [
      'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=800'
    ],
    stock: 60,
    rating: 4.9,
    reviewCount: 38,
    featured: true,
    active: true,
  },
  {
    _id: '664b9f1a23a1000000000002',
    name: 'Caramel Macchiato Velvet',
    description: 'Freshly steamed whole milk with vanilla syrup, marked with espresso and drizzled with buttery homemade caramel sauce.',
    shortDescription: 'Steamed milk, rich espresso & buttery caramel drizzle.',
    price: 299,
    category: 'Latte',
    roastLevel: 'Medium Roast',
    origin: 'Guatemala Antigua Blend',
    flavorNotes: ['Butter Caramel', 'Vanilla Pod', 'Creamy Milk'],
    sizes: ['Small (250ml)', 'Medium (350ml)', 'Large (450ml)'],
    images: [
      'https://images.unsplash.com/photo-1485808191679-5f86510681a2?auto=format&fit=crop&q=80&w=800'
    ],
    stock: 45,
    rating: 4.8,
    reviewCount: 52,
    featured: true,
    active: true,
  },
  {
    _id: '664b9f1a23a1000000000003',
    name: 'Classic Creamy Cappuccino',
    description: 'Equal parts dark roast espresso, velvety steamed milk, and thick silky microfoam sprinkled with Dutch cocoa powder.',
    shortDescription: 'Traditional Italian style cappuccino with dense microfoam.',
    price: 269,
    category: 'Cappuccino',
    roastLevel: 'Dark Roast',
    origin: 'Brazil Sul de Minas',
    flavorNotes: ['Cocoa Dust', 'Warm Spice', 'Cream'],
    sizes: ['Small (250ml)', 'Medium (350ml)', 'Large (450ml)'],
    images: [
      'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&q=80&w=800'
    ],
    stock: 80,
    rating: 4.7,
    reviewCount: 29,
    featured: true,
    active: true,
  },
  {
    _id: '664b9f1a23a1000000000004',
    name: 'Nitro Vanilla Cold Brew',
    description: 'Slow-steeped for 20 hours in cold filtered water, infused with nitrogen for a cascading smooth draft texture and vanilla sweet cream.',
    shortDescription: 'Cascading nitro cold brew topped with Madagascar vanilla cream.',
    price: 329,
    category: 'Cold Brew',
    roastLevel: 'Medium Roast',
    origin: 'Single Origin Colombia Narino',
    flavorNotes: ['Vanilla Bean', 'Brown Sugar', 'Crisp Citrus'],
    sizes: ['Medium (350ml)', 'Large (450ml)'],
    images: [
      'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&q=80&w=800'
    ],
    stock: 30,
    rating: 4.9,
    reviewCount: 64,
    featured: true,
    active: true,
  },
  {
    _id: '664b9f1a23a1000000000005',
    name: 'Dark Mocha Supreme',
    description: 'Rich bittersweet Valrhona cocoa blended with a double shot of dark espresso and creamy warm milk, topped with whip.',
    shortDescription: 'Bittersweet dark chocolate meets signature espresso.',
    price: 319,
    category: 'Mocha',
    roastLevel: 'Dark Roast',
    origin: 'Sumatra Mandheling',
    flavorNotes: ['Bittersweet Cocoa', 'Fudge', 'Espresso Cream'],
    sizes: ['Small (250ml)', 'Medium (350ml)', 'Large (450ml)'],
    images: [
      'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?auto=format&fit=crop&q=80&w=800'
    ],
    stock: 40,
    rating: 4.8,
    reviewCount: 41,
    featured: false,
    active: true,
  },
  {
    _id: '664b9f1a23a1000000000006',
    name: 'Bold Americano Reserve',
    description: 'Double shot of single origin espresso diluted with hot crystal spring water, preserving a delicate layer of golden crema.',
    shortDescription: 'Clean, robust espresso diluted with pure hot spring water.',
    price: 219,
    category: 'Americano',
    roastLevel: 'Medium Roast',
    origin: 'Kenya AA Karogoto',
    flavorNotes: ['Black Cherry', 'Molasses', 'Bright Acidity'],
    sizes: ['Small (250ml)', 'Medium (350ml)', 'Large (450ml)'],
    images: [
      'https://images.unsplash.com/photo-1551033406-611cf9a28f67?auto=format&fit=crop&q=80&w=800'
    ],
    stock: 100,
    rating: 4.6,
    reviewCount: 22,
    featured: false,
    active: true,
  },
  {
    _id: '664b9f1a23a1000000000007',
    name: 'Matcha Green Tea Latte',
    description: 'Ceremonial grade Uji Japanese matcha whisked with steamed oat milk and a touch of organic agave nectar.',
    shortDescription: 'Ceremonial Uji matcha whisked with velvety oat milk.',
    price: 289,
    category: 'Tea',
    roastLevel: 'N/A',
    origin: 'Uji, Kyoto, Japan',
    flavorNotes: ['Umami Matcha', 'Sweet Grass', 'Oat Milk'],
    sizes: ['Small (250ml)', 'Medium (350ml)', 'Large (450ml)'],
    images: [
      'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&q=80&w=800'
    ],
    stock: 50,
    rating: 4.8,
    reviewCount: 31,
    featured: false,
    active: true,
  },
  {
    _id: '664b9f1a23a1000000000008',
    name: 'Flaky Almond Butter Croissant',
    description: 'Golden, multi-layered French butter croissant filled with rich almond frangipane cream and baked with toasted sliced almonds.',
    shortDescription: 'French butter pastry stuffed with almond cream.',
    price: 189,
    category: 'Pastries',
    roastLevel: 'N/A',
    origin: 'Parisian Recipe',
    flavorNotes: ['French Butter', 'Toasted Almond', 'Vanilla'],
    sizes: ['Standard Piece'],
    images: [
      'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=800'
    ],
    stock: 25,
    rating: 4.9,
    reviewCount: 47,
    featured: true,
    active: true,
  },
];

const getCoffees = asyncHandler(async (req, res) => {
  const { search, category, roastLevel, minPrice, maxPrice, sort, featured } = req.query;

  let coffees = [];

  try {
    let query = { active: true };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { origin: { $regex: search, $options: 'i' } },
      ];
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (roastLevel && roastLevel !== 'All') {
      query.roastLevel = roastLevel;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (featured === 'true') {
      query.featured = true;
    }

    let sortOption = {};
    if (sort === 'price-low') {
      sortOption.price = 1;
    } else if (sort === 'price-high') {
      sortOption.price = -1;
    } else if (sort === 'rating') {
      sortOption.rating = -1;
    } else if (sort === 'popular') {
      sortOption.reviewCount = -1;
    } else {
      sortOption.createdAt = -1;
    }

    coffees = await Coffee.find(query).sort(sortOption);
  } catch (err) {
    // If DB is offline, filter from fallback array
    coffees = FALLBACK_COFFEES.filter((c) => {
      if (featured === 'true' && !c.featured) return false;
      if (category && category !== 'All' && c.category !== category) return false;
      if (roastLevel && roastLevel !== 'All' && c.roastLevel !== roastLevel) return false;
      if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }

  if (!coffees || coffees.length === 0) {
    coffees = FALLBACK_COFFEES.filter((c) => {
      if (featured === 'true' && !c.featured) return false;
      if (category && category !== 'All' && c.category !== category) return false;
      if (roastLevel && roastLevel !== 'All' && c.roastLevel !== roastLevel) return false;
      if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }

  res.status(200).json({
    success: true,
    count: coffees.length,
    coffees,
  });
});

const getCoffeeById = asyncHandler(async (req, res) => {
  let coffee = null;

  try {
    coffee = await Coffee.findById(req.params.id);
  } catch (err) {
    coffee = FALLBACK_COFFEES.find((c) => c._id === req.params.id);
  }

  if (!coffee) {
    coffee = FALLBACK_COFFEES.find((c) => c._id === req.params.id) || FALLBACK_COFFEES[0];
  }

  res.status(200).json({
    success: true,
    coffee,
  });
});

const createCoffee = asyncHandler(async (req, res) => {
  const coffee = await Coffee.create(req.body);

  res.status(201).json({
    success: true,
    message: 'Coffee created successfully',
    coffee,
  });
});

const updateCoffee = asyncHandler(async (req, res) => {
  const coffee = await Coffee.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!coffee) throw new ApiError(404, 'Coffee product not found');

  res.status(200).json({
    success: true,
    message: 'Coffee updated successfully',
    coffee,
  });
});

const deleteCoffee = asyncHandler(async (req, res) => {
  const coffee = await Coffee.findByIdAndDelete(req.params.id);
  if (!coffee) throw new ApiError(404, 'Coffee product not found');

  res.status(200).json({
    success: true,
    message: 'Coffee deleted successfully',
  });
});

module.exports = {
  getCoffees,
  getCoffeeById,
  createCoffee,
  updateCoffee,
  deleteCoffee,
};
