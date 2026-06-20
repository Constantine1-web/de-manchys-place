import React, { useState } from 'react';
import { ShoppingCart, Plus, Minus, MapPin, X, MessageCircle, Beer, UtensilsCrossed, ChevronDown, ChevronUp } from 'lucide-react';

const MENU_ITEMS = [
  // FOOD
  {
    id: 1,
    name: "Afang Soup & Garri",
    description: "Authentic Akwa Ibom Afang soup packed with periwinkles, stock fish, and assorted meat.",
    price: 3500,
    image: "/images/afang.jpg",
    category: "food"
  },
  {
    id: 2,
    name: "Edikang Ikong",
    description: "Rich and nutritious Edikang Ikong soup with generous chunks of beef, tripe, and dried fish.",
    price: 4000,
    image: "/images/edikang.jpg",
    category: "food"
  },
  {
    id: 3,
    name: "Ekpang Nkukwo",
    description: "Traditional grated cocoyam delicacy wrapped in tender leaves and slow-cooked with fresh seafood.",
    price: 4500,
    image: "/images/ekpang.jpg",
    category: "food"
  },
  {
    id: 4,
    name: "Fisherman Soup",
    description: "Spicy and deeply flavored seafood broth featuring fresh catfish, prawns, and crabs.",
    price: 5500,
    image: "/images/fisherman.jpg",
    category: "food"
  },
  {
    id: 5,
    name: "Atama Soup & Fufu",
    description: "Delicious palm fruit soup infused with Atama leaves, periwinkles, and dried meat.",
    price: 3800,
    image: "/images/atama.jpg",
    category: "food"
  },
  {
    id: 6,
    name: "Afia Efere (White Soup)",
    description: "Flavorful Oron white soup made with uyayak pod, goat meat, and served with pounded yam.",
    price: 4200,
    image: "https://bigmamaspices.ng/wp-content/uploads/2023/09/A-Delicious-Afia-Efere-Soup-1024x576.jpeg",
    category: "food"
  },
  // DRINKS
  {
    id: "group_beer",
    name: "Chilled Beers",
    description: "Tap to view our selection of premium chilled beers.",
    image: "https://www.travelstart.com.ng/blog/wp-content/uploads/sites/2/2025/12/Star-Lager-Nigerian-Beer.jpg",
    category: "drinks",
    isGroup: true,
    subItems: [
      { id: 71, name: "Heineken", price: 1500 },
      { id: 72, name: "Guinness Stout", price: 1500 },
      { id: 73, name: "Star Lager", price: 1200 },
      { id: 74, name: "Trophy", price: 1200 }
    ]
  },
  {
    id: "group_soft",
    name: "Soft Drinks & Malts",
    description: "Tap to view sodas, Maltina, and juices.",
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=600&h=400",
    category: "drinks",
    isGroup: true,
    subItems: [
      { id: 81, name: "Coca-Cola", price: 500 },
      { id: 82, name: "Fanta", price: 500 },
      { id: 83, name: "Sprite", price: 500 },
      { id: 84, name: "Maltina", price: 700 },
      { id: 85, name: "Amstel Malta", price: 700 },
      { id: 86, name: "Chivita Juice", price: 1500 }
    ]
  },
  {
    id: "group_spirits",
    name: "Spirits & Hots",
    description: "Tap to view premium whiskey, brandy, vodka, and gin.",
    image: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?auto=format&fit=crop&q=80&w=600&h=400",
    category: "drinks",
    isGroup: true,
    subItems: [
      { id: 91, name: "Hennessy VS (Bottle)", price: 45000 },
      { id: 92, name: "Jameson (Bottle)", price: 25000 },
      { id: 93, name: "Gordon's Gin (Shot)", price: 1000 },
      { id: 94, name: "Origin Bitters (Bottle)", price: 3000 }
    ]
  }
];

const DELIVERY_FEE = 1000;
const WHATSAPP_NUMBER = "2348127743555";

export default function App() {
  const [cart, setCart] = useState({});
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState({});
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    address: '',
    phone: ''
  });

  const toggleGroup = (groupId) => {
    setExpandedGroups(prev => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  const getItemById = (id) => {
    for (const item of MENU_ITEMS) {
      if (item.id === id) return item;
      if (item.isGroup) {
        const found = item.subItems.find(sub => sub.id === id);
        if (found) return found;
      }
    }
    return null;
  };

  const updateQuantity = (id, delta) => {
    setCart(prev => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      const newCart = { ...prev, [id]: next };
      if (next === 0) delete newCart[id];
      return newCart;
    });
  };

  const cartTotalItems = Object.values(cart).reduce((a, b) => a + b, 0);
  
  const subtotal = Object.entries(cart).reduce((total, [id, qty]) => {
    const item = getItemById(parseInt(id));
    return total + (item ? item.price * qty : 0);
  }, 0);

  const formatPrice = (amount) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(amount);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerDetails(prev => ({ ...prev, [name]: value }));
  };

  const sendOrderToWhatsApp = (e) => {
    e.preventDefault();
    
    if (!customerDetails.name || !customerDetails.address || !customerDetails.phone) {
      alert("Please fill in all details to place your order.");
      return;
    }

    let orderText = `*NEW ORDER - De Manchy's Place* 🍽️\n\n`;
    
    orderText += `*Customer Details:*\n`;
    orderText += `👤 Name: ${customerDetails.name}\n`;
    orderText += `📍 Address: ${customerDetails.address}\n`;
    orderText += `📞 Phone: ${customerDetails.phone}\n\n`;
    
    orderText += `*Order Summary:*\n`;
    Object.entries(cart).forEach(([id, qty]) => {
      const item = getItemById(parseInt(id));
      if (item) {
        orderText += `▪️ ${qty}x ${item.name} - ${formatPrice(item.price * qty)}\n`;
      }
    });
    
    orderText += `\n*Subtotal:* ${formatPrice(subtotal)}\n`;
    orderText += `*Delivery Fee:* ${formatPrice(DELIVERY_FEE)}\n`;
    orderText += `*TOTAL TO PAY:* ${formatPrice(subtotal + DELIVERY_FEE)}\n\n`;
    
    orderText += `*Payment Details:*\n`;
    orderText += `Account: 7044732970\n`;
    orderText += `Bank: Moniepoint MFB\n\n`;
    
    orderText += `Thank you for your patronage! *Please attach a screenshot of your payment receipt to this message to confirm your order.*`;

    const encodedText = encodeURIComponent(orderText);
    window.location.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedText}`;
  };

  const foodItems = MENU_ITEMS.filter(item => item.category === "food");
  const drinkItems = MENU_ITEMS.filter(item => item.category === "drinks");

  return (
    <div className="min-h-screen bg-dark-bg bg-doodle pb-24 font-sans text-gray-100 selection:bg-coffee-600 selection:text-white">
      
      {/* Header */}
      <header className="sticky top-0 z-40 w-full bg-dark-surface/90 backdrop-blur-md border-b border-dark-border shadow-lg">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex flex-col space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-white">De Manchy's Place</h1>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <MapPin className="w-3.5 h-3.5 text-coffee-500" />
              <span>Four Lanes, Uyo</span>
            </div>
          </div>
          
          {/* Stylish Circled Logo on the right */}
          <div className="relative shrink-0">
            <div className="absolute inset-0 bg-coffee-500 rounded-full opacity-20 blur-md"></div>
            <div className="relative w-16 h-16 rounded-full border border-coffee-700/50 overflow-hidden bg-[#1a1a1a] shadow-lg flex items-center justify-center p-[2px]">
              <img 
                src="/images/logo.jpg" 
                alt="De Manchy's Logo" 
                className="w-full h-full object-cover rounded-full scale-125" 
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        
        {/* Food Section */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-6">
            <UtensilsCrossed className="w-6 h-6 text-coffee-500" />
            <h2 className="text-2xl font-bold text-white">Food Menu</h2>
          </div>
          <div className="grid gap-6">
            {foodItems.map((item) => (
              <div key={item.id} className="bg-dark-surface border border-dark-border rounded-2xl overflow-hidden shadow-xl flex flex-col sm:flex-row transition-transform hover:scale-[1.02] duration-300">
                <div className="sm:w-1/3 h-32 sm:h-auto relative shrink-0">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-surface/80 to-transparent sm:bg-gradient-to-r" />
                </div>
                
                <div className="p-5 flex flex-col justify-between flex-1 relative z-10">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                      <span className="text-coffee-400 font-bold ml-4 shrink-0">{formatPrice(item.price)}</span>
                    </div>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{item.description}</p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-3 bg-dark-bg rounded-lg p-1 border border-dark-border">
                      <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-coffee-600/30 transition-colors disabled:opacity-50"
                        disabled={!cart[item.id]}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-6 text-center font-medium text-white">
                        {cart[item.id] || 0}
                      </span>
                      <button 
                        onClick={() => updateQuantity(item.id, 1)}
                        className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-coffee-600/30 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {cart[item.id] > 0 && (
                      <span className="text-xs font-medium text-coffee-400">
                        {formatPrice(item.price * cart[item.id])}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Drinks Section */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <Beer className="w-6 h-6 text-coffee-500" />
            <h2 className="text-2xl font-bold text-white">Assorted Drinks</h2>
          </div>
          <div className="grid gap-6">
            {drinkItems.map((item) => (
              <div key={item.id} className="bg-dark-surface border border-dark-border rounded-2xl overflow-hidden shadow-xl flex flex-col transition-transform hover:scale-[1.02] duration-300">
                <div 
                  className="flex flex-col sm:flex-row cursor-pointer"
                  onClick={() => toggleGroup(item.id)}
                >
                  <div className="sm:w-1/3 h-32 sm:h-auto relative shrink-0">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-surface/80 to-transparent sm:bg-gradient-to-r" />
                  </div>
                  
                  <div className="p-5 flex flex-col justify-center flex-1 relative z-10">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                      <div className="p-1 bg-dark-bg rounded-full border border-dark-border">
                        {expandedGroups[item.id] ? (
                          <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm line-clamp-2">{item.description}</p>
                  </div>
                </div>

                {/* Dropdown / Accordion content */}
                {expandedGroups[item.id] && (
                  <div className="border-t border-dark-border bg-dark-bg/50 p-4">
                    <div className="space-y-4">
                      {item.subItems.map(subItem => (
                        <div key={subItem.id} className="flex flex-wrap items-center justify-between gap-4 border-b border-dark-border/50 pb-4 last:border-0 last:pb-0">
                          <div className="flex flex-col">
                            <span className="text-white text-sm font-semibold">{subItem.name}</span>
                            <span className="text-coffee-400 text-xs font-bold">{formatPrice(subItem.price)}</span>
                          </div>
                          
                          <div className="flex items-center justify-between mt-auto">
                            <div className="flex items-center gap-3 bg-dark-bg rounded-lg p-1 border border-dark-border">
                              <button 
                                onClick={(e) => { e.stopPropagation(); updateQuantity(subItem.id, -1); }}
                                className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-coffee-600/30 transition-colors disabled:opacity-50"
                                disabled={!cart[subItem.id]}
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="w-6 text-center font-medium text-white">
                                {cart[subItem.id] || 0}
                              </span>
                              <button 
                                onClick={(e) => { e.stopPropagation(); updateQuantity(subItem.id, 1); }}
                                className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-coffee-600/30 transition-colors"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                            
                            {cart[subItem.id] > 0 && (
                              <span className="text-xs font-medium text-coffee-400 ml-4">
                                {formatPrice(subItem.price * cart[subItem.id])}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Sticky Cart Bar */}
      {cartTotalItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 p-4 transform transition-transform duration-300 ease-in-out">
          <div className="max-w-3xl mx-auto bg-coffee-600 p-4 rounded-2xl shadow-2xl flex items-center justify-between backdrop-blur-xl bg-opacity-90 border border-coffee-500">
            <div className="flex items-center gap-4">
              <div className="relative">
                <ShoppingCart className="w-6 h-6 text-white" />
                <span className="absolute -top-2 -right-2 bg-white text-coffee-700 text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {cartTotalItems}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-coffee-200 text-xs">Total</span>
                <span className="text-white font-bold">{formatPrice(subtotal)}</span>
              </div>
            </div>
            
            <button 
              onClick={() => setIsCheckoutOpen(true)}
              className="bg-white text-coffee-700 font-semibold py-2 px-6 rounded-xl hover:bg-gray-100 transition-colors active:scale-95"
            >
              Checkout
            </button>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-0">
          <div className="bg-dark-surface w-full max-w-md rounded-2xl sm:rounded-xl border border-dark-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200">
            <div className="p-4 border-b border-dark-border flex items-center justify-between sticky top-0 bg-dark-surface z-10">
              <h2 className="text-lg font-bold text-white">Complete Order</h2>
              <button 
                onClick={() => setIsCheckoutOpen(false)}
                className="p-1 text-gray-400 hover:text-white rounded-full hover:bg-dark-bg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              {/* Order Summary */}
              <div className="bg-dark-bg rounded-xl p-4 border border-dark-border mb-6">
                <h3 className="text-sm font-semibold text-gray-300 mb-3">Order Summary</h3>
                <div className="space-y-2 mb-3">
                  {Object.entries(cart).map(([id, qty]) => {
                    const item = getItemById(parseInt(id));
                    if (!item) return null;
                    return (
                      <div key={id} className="flex justify-between text-sm text-gray-400">
                        <span>{qty}x {item.name}</span>
                        <span>{formatPrice(item.price * qty)}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="border-t border-dark-border pt-2 space-y-1 text-sm">
                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Delivery Fee</span>
                    <span>{formatPrice(DELIVERY_FEE)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-white pt-1">
                    <span>Total</span>
                    <span className="text-coffee-400">{formatPrice(subtotal + DELIVERY_FEE)}</span>
                  </div>
                </div>
              </div>

              <form id="checkout-form" onSubmit={sendOrderToWhatsApp} className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-300 mb-2">Delivery Details</h3>
                
                <div>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    required
                    value={customerDetails.name}
                    onChange={handleInputChange}
                    className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-coffee-500 focus:ring-1 focus:ring-coffee-500 transition-colors"
                    placeholder="Full Name"
                  />
                </div>
                
                <div>
                  <input 
                    type="tel" 
                    id="phone" 
                    name="phone" 
                    required
                    value={customerDetails.phone}
                    onChange={handleInputChange}
                    className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-coffee-500 focus:ring-1 focus:ring-coffee-500 transition-colors"
                    placeholder="Phone Number"
                  />
                </div>
                
                <div>
                  <textarea 
                    id="address" 
                    name="address" 
                    required
                    rows="2"
                    value={customerDetails.address}
                    onChange={handleInputChange}
                    className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-coffee-500 focus:ring-1 focus:ring-coffee-500 transition-colors resize-none"
                    placeholder="Delivery Address"
                  ></textarea>
                </div>
              </form>
            </div>
            
            <div className="p-6 bg-dark-surface border-t border-dark-border sticky bottom-0 z-10 space-y-4">
              <div className="bg-coffee-900/30 border border-coffee-800 rounded-xl p-4">
                <p className="text-sm text-gray-300 mb-2">
                  Please transfer the <strong className="text-white">Total Amount</strong> to the account below, and <strong className="text-white">attach your payment receipt</strong> on WhatsApp to confirm your order:
                </p>
                <div className="flex justify-between items-center bg-dark-bg p-3 rounded-lg border border-dark-border">
                  <div>
                    <p className="text-xs text-gray-400">Moniepoint MFB</p>
                    <p className="font-bold text-white tracking-wider">7044732970</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Amount Due</p>
                    <p className="font-bold text-coffee-400">{formatPrice(subtotal + DELIVERY_FEE)}</p>
                  </div>
                </div>
              </div>

              <button 
                type="submit"
                form="checkout-form"
                className="w-full bg-coffee-600 hover:bg-coffee-500 text-white font-semibold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                Send Order via WhatsApp
              </button>
              <p className="text-center text-xs text-gray-500">You will be redirected to WhatsApp. Don't forget to attach your payment receipt!</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
