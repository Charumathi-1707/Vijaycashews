require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Models
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const { Coupon } = require('../models/Cart');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Connected to MongoDB');
};

const seed = async () => {
  await connectDB();

  console.log('🌱 Seeding database...');

  // Clear existing data
  await Promise.all([
    User.deleteMany({}),
    Category.deleteMany({}),
    Product.deleteMany({}),
    Coupon.deleteMany({}),
  ]);
  console.log('🗑️  Cleared existing data');

  // ===== USERS =====
  const users = await User.create([
    {
      name: 'Super Admin',
      email: 'admin@shopease.com',
      password: 'admin123',
      role: 'admin',
      phone: '9876543210',
      isActive: true,
    },
    {
      name: 'Rajesh Kumar',
      email: 'delivery@shopease.com',
      password: 'delivery123',
      role: 'deliveryman',
      phone: '9876543211',
      vehicleType: 'bike',
      vehicleNumber: 'KA-01-AB-1234',
      isActive: true,
      totalDeliveries: 47,
    },
    {
      name: 'Priya Sharma',
      email: 'delivery2@shopease.com',
      password: 'delivery123',
      role: 'deliveryman',
      phone: '9876543215',
      vehicleType: 'scooter',
      vehicleNumber: 'MH-02-CD-5678',
      isActive: true,
      totalDeliveries: 23,
    },
    {
      name: 'Ananya Gupta',
      email: 'customer@shopease.com',
      password: 'customer123',
      role: 'customer',
      phone: '9876543212',
      isActive: true,
      addresses: [{
        label: 'Home',
        street: '42, MG Road',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560001',
        country: 'India',
        isDefault: true,
      }],
    },
    {
      name: 'Vikram Mehta',
      email: 'vikram@example.com',
      password: 'customer123',
      role: 'customer',
      phone: '9876543213',
      isActive: true,
    },
  ]);
  console.log('👥 Users created:', users.length);

  // ===== CATEGORIES =====
  const categoryData = [
    { name: 'Nuts & Dry Fruits', description: 'Premium quality nuts and dry fruits', sortOrder: 1 },
    { name: 'Spices & Masala', description: 'Authentic Indian spices and masala blends', sortOrder: 2 },
    { name: 'Organic Foods', description: 'Certified organic food products', sortOrder: 3 },
    { name: 'Snacks & Namkeen', description: 'Crispy snacks and traditional namkeen', sortOrder: 4 },
    { name: 'Pickles & Chutneys', description: 'Traditional homestyle pickles and chutneys', sortOrder: 5 },
    { name: 'Oils & Ghee', description: 'Pure edible oils and pure ghee', sortOrder: 6 },
    { name: 'Sweets & Mithai', description: 'Traditional Indian sweets and desserts', sortOrder: 7 },
    { name: 'Superfoods', description: 'Nutrient-dense superfoods for healthy living', sortOrder: 8 },
  ];

  const categories = await Category.create(
    categoryData.map(c => ({
      ...c,
      slug: c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      isActive: true,
    }))
  );
  console.log('📂 Categories created:', categories.length);

  const catMap = {};
  categories.forEach(c => catMap[c.name] = c._id);

  // ===== PRODUCTS =====
  const products = [
    {
      name: 'Premium Cashews W240',
      category: catMap['Nuts & Dry Fruits'],
      price: 899,
      discountPrice: 749,
      discountPercent: 17,
      stock: 150,
      description: 'Premium quality W240 grade cashews sourced directly from the best farms in Goa and Kerala. These large, whole cashews are carefully sorted, processed, and packed to maintain their natural goodness. Rich in healthy fats, proteins, and essential minerals.',
      shortDescription: 'Premium W240 grade whole cashews from Goa',
      brand: 'Vijay Cashews',
      sku: 'VCW240-500',
      isFeatured: true,
      tags: ['cashews', 'nuts', 'premium', 'healthy'],
      rating: 4.8,
      numReviews: 124,
      sold: 892,
      images: [{ url: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=600', publicId: 'sample1' }],
      variants: [
        { name: '250g', price: 399, stock: 60 },
        { name: '500g', price: 749, stock: 50 },
        { name: '1kg', price: 1399, stock: 40 },
      ],
    },
    {
      name: 'Organic Almonds',
      category: catMap['Nuts & Dry Fruits'],
      price: 699,
      discountPrice: 599,
      discountPercent: 14,
      stock: 200,
      description: 'Certified organic California almonds, rich in Vitamin E, magnesium, and heart-healthy fats. Perfect for snacking, smoothies, and cooking.',
      shortDescription: 'Certified organic California almonds',
      brand: 'OrganicWorld',
      isFeatured: true,
      tags: ['almonds', 'organic', 'nuts'],
      rating: 4.6,
      numReviews: 89,
      sold: 567,
      images: [{ url: 'https://images.unsplash.com/photo-1574570068774-bbf7c24b69b6?w=600', publicId: 'sample2' }],
    },
    {
      name: 'Kashmiri Walnuts',
      category: catMap['Nuts & Dry Fruits'],
      price: 999,
      discountPrice: 849,
      discountPercent: 15,
      stock: 80,
      description: 'Finest Kashmiri walnuts known for their superior taste and nutritional value. Brain-shaped and brain-boosting, these walnuts are packed with Omega-3 fatty acids.',
      shortDescription: 'Premium Kashmiri walnuts with exceptional taste',
      brand: 'Kashmir Fresh',
      isFeatured: false,
      tags: ['walnuts', 'kashmir', 'omega3'],
      rating: 4.7,
      numReviews: 63,
      sold: 234,
      images: [{ url: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=600', publicId: 'sample3' }],
    },
    {
      name: 'Pure Turmeric Powder',
      category: catMap['Spices & Masala'],
      price: 199,
      discountPrice: 159,
      discountPercent: 20,
      stock: 300,
      description: 'Stone-ground pure turmeric powder with high curcumin content. No artificial colors or additives. Sourced from the best turmeric farms in Salem, Tamil Nadu.',
      shortDescription: 'High curcumin pure turmeric powder',
      brand: 'Spice Garden',
      isFeatured: true,
      tags: ['turmeric', 'spice', 'organic', 'healthy'],
      rating: 4.5,
      numReviews: 201,
      sold: 1203,
      images: [{ url: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=600', publicId: 'sample4' }],
    },
    {
      name: 'Garam Masala Blend',
      category: catMap['Spices & Masala'],
      price: 249,
      discountPrice: 0,
      discountPercent: 0,
      stock: 250,
      description: 'Aromatic whole spice blend, expertly crafted using traditional recipes. Contains cinnamon, cardamom, cloves, black pepper, cumin, and coriander.',
      shortDescription: 'Traditional aromatic whole spice blend',
      brand: 'Spice Garden',
      isFeatured: false,
      tags: ['garam masala', 'spices', 'blend'],
      rating: 4.4,
      numReviews: 88,
      sold: 445,
      images: [{ url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600', publicId: 'sample5' }],
    },
    {
      name: 'Organic Quinoa',
      category: catMap['Organic Foods'],
      price: 449,
      discountPrice: 379,
      discountPercent: 16,
      stock: 120,
      description: 'Certified organic white quinoa, a complete protein source with all 9 essential amino acids. Gluten-free, high in fiber, and incredibly versatile in the kitchen.',
      shortDescription: 'Certified organic complete protein quinoa',
      brand: 'OrganicWorld',
      isFeatured: true,
      tags: ['quinoa', 'organic', 'protein', 'superfood'],
      rating: 4.3,
      numReviews: 56,
      sold: 312,
      images: [{ url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600', publicId: 'sample6' }],
    },
    {
      name: 'Kacchi Ghani Mustard Oil',
      category: catMap['Oils & Ghee'],
      price: 349,
      discountPrice: 299,
      discountPercent: 14,
      stock: 180,
      description: 'Cold-pressed kacchi ghani mustard oil extracted using traditional wooden ghani method. Rich in omega-3, omega-6, and natural antioxidants.',
      shortDescription: 'Traditional cold-pressed mustard oil',
      brand: 'Pure Harvest',
      isFeatured: false,
      tags: ['mustard oil', 'cold pressed', 'cooking'],
      rating: 4.6,
      numReviews: 145,
      sold: 789,
      images: [{ url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600', publicId: 'sample7' }],
    },
    {
      name: 'A2 Desi Cow Ghee',
      category: catMap['Oils & Ghee'],
      price: 899,
      discountPrice: 799,
      discountPercent: 11,
      stock: 90,
      description: 'Pure A2 ghee made from the milk of indigenous Gir cows using traditional bilona method. Grainy texture, golden color, and distinctive nutty aroma.',
      shortDescription: 'Pure A2 Gir cow ghee, bilona method',
      brand: 'Desi Farms',
      isFeatured: true,
      tags: ['ghee', 'a2', 'desi cow', 'pure'],
      rating: 4.9,
      numReviews: 267,
      sold: 1567,
      images: [{ url: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600', publicId: 'sample8' }],
    },
    {
      name: 'Roasted Chana Dal',
      category: catMap['Snacks & Namkeen'],
      price: 149,
      discountPrice: 129,
      discountPercent: 13,
      stock: 400,
      description: 'Crunchy roasted chana dal snack, lightly salted and seasoned with natural spices. High in protein and fiber, perfect healthy snacking alternative.',
      shortDescription: 'Crunchy high-protein roasted chana dal',
      brand: 'Snack Hub',
      isFeatured: false,
      tags: ['chana', 'snacks', 'healthy', 'protein'],
      rating: 4.2,
      numReviews: 178,
      sold: 2341,
      images: [{ url: 'https://images.unsplash.com/photo-1610450949065-1f2841536c88?w=600', publicId: 'sample9' }],
    },
    {
      name: 'Mango Pickle (Aam ka Achar)',
      category: catMap['Pickles & Chutneys'],
      price: 249,
      discountPrice: 199,
      discountPercent: 20,
      stock: 160,
      description: 'Traditional homestyle raw mango pickle made with authentic spices and cold-pressed mustard oil. No preservatives, no artificial colors. Aged for 30 days for perfect flavor.',
      shortDescription: 'Traditional homestyle mango pickle, no preservatives',
      brand: 'Granny\'s Kitchen',
      isFeatured: true,
      tags: ['pickle', 'mango', 'traditional', 'homestyle'],
      rating: 4.7,
      numReviews: 234,
      sold: 1890,
      images: [{ url: 'https://images.unsplash.com/photo-1626200936600-6ff96b28bf60?w=600', publicId: 'sample10' }],
    },
    {
      name: 'Besan Ladoo',
      category: catMap['Sweets & Mithai'],
      price: 399,
      discountPrice: 349,
      discountPercent: 13,
      stock: 100,
      description: 'Handcrafted besan ladoos made with pure desi ghee and finest chickpea flour. Slow-roasted to perfection with cardamom and dry fruits. Fresh batch prepared weekly.',
      shortDescription: 'Handcrafted pure ghee besan ladoos',
      brand: 'Mithai Box',
      isFeatured: false,
      tags: ['ladoo', 'besan', 'sweets', 'ghee'],
      rating: 4.8,
      numReviews: 112,
      sold: 678,
      images: [{ url: 'https://images.unsplash.com/photo-1606471191009-63994c53433b?w=600', publicId: 'sample11' }],
    },
    {
      name: 'Chia Seeds',
      category: catMap['Superfoods'],
      price: 299,
      discountPrice: 249,
      discountPercent: 17,
      stock: 250,
      description: 'Organic black chia seeds loaded with omega-3 fatty acids, fiber, protein, and antioxidants. Perfect for smoothies, puddings, and baking. Boosts energy and promotes gut health.',
      shortDescription: 'Omega-3 rich organic chia seeds',
      brand: 'SuperNutrition',
      isFeatured: true,
      tags: ['chia', 'superfoods', 'omega3', 'organic'],
      rating: 4.5,
      numReviews: 189,
      sold: 934,
      images: [{ url: 'https://images.unsplash.com/photo-1514733670139-4d87a1941d55?w=600', publicId: 'sample12' }],
    },
  ];

  const createdProducts = await Product.create(
    products.map(p => ({
      ...p,
      slug: p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now() + Math.random().toString(36).slice(2, 5),
      isActive: true,
    }))
  );
  console.log('📦 Products created:', createdProducts.length);

  // ===== COUPONS =====
  await Coupon.create([
    {
      code: 'WELCOME20',
      description: '20% off for new customers',
      discountType: 'percentage',
      discountValue: 20,
      minOrderAmount: 300,
      maxDiscountAmount: 200,
      usageLimit: 100,
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      isActive: true,
    },
    {
      code: 'FLAT100',
      description: 'Flat ₹100 off on orders above ₹599',
      discountType: 'fixed',
      discountValue: 100,
      minOrderAmount: 599,
      usageLimit: 200,
      expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      isActive: true,
    },
    {
      code: 'NUTS15',
      description: '15% off on all nuts',
      discountType: 'percentage',
      discountValue: 15,
      minOrderAmount: 500,
      maxDiscountAmount: 150,
      isActive: true,
    },
    {
      code: 'SUMMER50',
      description: 'Flat ₹50 off — no minimum!',
      discountType: 'fixed',
      discountValue: 50,
      minOrderAmount: 0,
      usageLimit: 500,
      isActive: true,
    },
  ]);
  console.log('🎟️  Coupons created');

  console.log('\n✅ Seed complete!\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔐 Demo Login Credentials:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('👑 Admin:     admin@shopease.com     / admin123');
  console.log('🛒 Customer:  customer@shopease.com  / customer123');
  console.log('🚚 Delivery:  delivery@shopease.com  / delivery123');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🎟️  Coupon Codes: WELCOME20, FLAT100, NUTS15, SUMMER50');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  await mongoose.disconnect();
  process.exit(0);
};

seed().catch(err => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
