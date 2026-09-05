import { useMemo, useState } from 'react'
import {
  Activity,
  ArrowRight,
  BarChart3,
  Bell,
  CheckCircle2,
  CircleDollarSign,
  Leaf,
  MapPinned,
  Package,
  Search,
  ShoppingCart,
  Sparkles,
  Sprout,
  Tractor,
  Truck,
  UserCheck,
  Users,
} from 'lucide-react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

type Role = 'farmer' | 'buyer' | 'admin' | 'overview'
type Locale = 'en' | 'hi' | 'pa'

type ProduceItem = {
  id: number
  crop: string
  quantity: number
  grade: string
  location: string
  price: number
  harvestDate: string
  seller: string
  sellability: number
}

type OrderRequest = {
  buyerName: string
  buyerType: string
  crop: string
  quantity: string
  location: string
  requiredBy: string
  deliveryPreference: string
  consentData: boolean
  consentAI: boolean
  consentCommercial: boolean
  notes: string
}

const cropOptions = ['Tomato', 'Potato', 'Onion', 'Wheat', 'Rice', 'Apple']

const demandDataMap: Record<string, { label: string; current: number; predicted: number }[]> = {
  Tomato: [
    { label: 'Mon', current: 10100, predicted: 11800 },
    { label: 'Tue', current: 10800, predicted: 12350 },
    { label: 'Wed', current: 11600, predicted: 12900 },
    { label: 'Thu', current: 12700, predicted: 14100 },
    { label: 'Fri', current: 13600, predicted: 15100 },
    { label: 'Sat', current: 14200, predicted: 16100 },
    { label: 'Sun', current: 13800, predicted: 15900 },
  ],
  Potato: [
    { label: 'Mon', current: 8700, predicted: 9800 },
    { label: 'Tue', current: 9100, predicted: 10150 },
    { label: 'Wed', current: 9700, predicted: 10650 },
    { label: 'Thu', current: 10200, predicted: 11300 },
    { label: 'Fri', current: 10900, predicted: 12000 },
    { label: 'Sat', current: 11200, predicted: 12450 },
    { label: 'Sun', current: 11900, predicted: 12600 },
  ],
  Onion: [
    { label: 'Mon', current: 9800, predicted: 11650 },
    { label: 'Tue', current: 10300, predicted: 12000 },
    { label: 'Wed', current: 11000, predicted: 12900 },
    { label: 'Thu', current: 11800, predicted: 13450 },
    { label: 'Fri', current: 12250, predicted: 13800 },
    { label: 'Sat', current: 12900, predicted: 14450 },
    { label: 'Sun', current: 13100, predicted: 15000 },
  ],
  Wheat: [
    { label: 'Mon', current: 12600, predicted: 13200 },
    { label: 'Tue', current: 12150, predicted: 12980 },
    { label: 'Wed', current: 11800, predicted: 12440 },
    { label: 'Thu', current: 12200, predicted: 12900 },
    { label: 'Fri', current: 12850, predicted: 13600 },
    { label: 'Sat', current: 13250, predicted: 14100 },
    { label: 'Sun', current: 13750, predicted: 14650 },
  ],
  Rice: [
    { label: 'Mon', current: 14800, predicted: 15550 },
    { label: 'Tue', current: 15200, predicted: 15950 },
    { label: 'Wed', current: 15650, predicted: 16400 },
    { label: 'Thu', current: 16100, predicted: 16950 },
    { label: 'Fri', current: 16900, predicted: 17600 },
    { label: 'Sat', current: 17350, predicted: 18100 },
    { label: 'Sun', current: 17800, predicted: 18700 },
  ],
  Apple: [
    { label: 'Mon', current: 6500, predicted: 7600 },
    { label: 'Tue', current: 6800, predicted: 7700 },
    { label: 'Wed', current: 7100, predicted: 8150 },
    { label: 'Thu', current: 7550, predicted: 8600 },
    { label: 'Fri', current: 7800, predicted: 9000 },
    { label: 'Sat', current: 8200, predicted: 9600 },
    { label: 'Sun', current: 8600, predicted: 10100 },
  ],
}

const regionDemand = [
  { region: 'Punjab', demand: 86, value: 'High demand' },
  { region: 'Haryana', demand: 66, value: 'Medium demand' },
  { region: 'Delhi', demand: 94, value: 'Very High demand' },
  { region: 'Uttar Pradesh', demand: 78, value: 'High demand' },
  { region: 'Maharashtra', demand: 72, value: 'High demand' },
  { region: 'Himachal', demand: 62, value: 'Medium demand' },
]

const buyerMatches = [
  { name: 'Farmer A', quantity: 500, distance: 18, score: 94 },
  { name: 'Farmer B', quantity: 300, distance: 25, score: 91 },
  { name: 'Farmer C', quantity: 200, distance: 32, score: 87 },
]

const aggregatedOrder = [
  { name: 'Farmer A', value: 400 },
  { name: 'Farmer B', value: 350 },
  { name: 'Farmer C', value: 250 },
]

const adminMetrics = [
  { label: 'Total Farmers', value: '3,420' },
  { label: 'Total Buyers', value: '1,280' },
  { label: 'Total Produce', value: '64,200 kg' },
  { label: 'Active Orders', value: '482' },
  { label: 'Successful Matches', value: '94%' },
  { label: 'Avg Farmer Price', value: '₹21.4/kg' },
  { label: 'Avg Consumer Price', value: '₹27.6/kg' },
  { label: 'Logistics Savings', value: '₹1.8L' },
  { label: 'Waste Reduction', value: '15%' },
  { label: 'Transactions', value: '9,540' },
]

const initialNotifications = [
  'Demand for tomatoes in Chandigarh increased by 13%.',
  'Buyer ABC Restaurant needs 500 kg tomatoes.',
  'Your produce has an 86/100 Sellability Score.',
  'AI recommends listing tomatoes at ₹22–24/kg.',
  'Your order has been matched with 3 farmers.',
  'Optimized route saved ₹890 in logistics costs.',
]

const initialMarketplace: ProduceItem[] = [
  { id: 1, crop: 'Tomato', quantity: 1200, grade: 'A', location: 'Ludhiana, Punjab', price: 22, harvestDate: '18 Sep 2026', seller: 'Raj Kumar', sellability: 86 },
  { id: 2, crop: 'Potato', quantity: 900, grade: 'A', location: 'Jaipur, Rajasthan', price: 19, harvestDate: '15 Sep 2026', seller: 'Satish Yadav', sellability: 82 },
  { id: 3, crop: 'Onion', quantity: 1500, grade: 'A', location: 'Hisar, Haryana', price: 18, harvestDate: '11 Sep 2026', seller: 'Baldev Singh', sellability: 80 },
  { id: 4, crop: 'Apple', quantity: 700, grade: 'A', location: 'Shimla, HP', price: 54, harvestDate: '20 Sep 2026', seller: 'Pawan Sharma', sellability: 88 },
]

const copy: Record<Locale, Record<string, string>> = {
  en: {
    brand: 'FarmFlow AI',
    tagline: 'From what farmers grow to what markets need.',
    overview: 'Overview',
    farmer: 'Farmer',
    buyer: 'Buyer',
    admin: 'Admin',
    demo: 'Demo',
    connectedAs: 'Connected as',
    startDemo: 'Start SIH Demo',
    notifications: 'Notifications',
    live: 'Live',
    aiRouteSummary: 'AI route summary',
    optimized: 'Optimized',
    traceability: 'Traceability timeline',
    logistics: 'Smart logistics route',
    loginTitle: 'Select a role',
    loginHint: 'AI-powered direct agri supply chain designed to reduce intermediaries and improve price transparency.',
    buyerPortal: 'Buyer portal',
    farmerPortal: 'Farmer / FPO',
    adminPortal: 'Admin console',
    aiDemand: 'AI demand forecasting',
    aiPrice: 'AI price recommendation',
    aiSellability: 'AI sellability score',
    addProduce: 'Add Produce',
    placeOrder: 'Place Order',
    orderForm: 'Place purchase order',
    consent: 'Consent',
    submitOrder: 'Submit order request',
    aiAssistant: 'AI assistant',
    aiReady: 'AI model ready',
    buyerRequirement: 'Buyer requirement',
    orderHistory: 'Recent orders',
    viewAll: 'View all',
  },
  hi: {
    brand: 'फार्मफ्लो एआई',
    tagline: 'कृषक जो उगाते हैं, बाजार को वही चाहिए।',
    overview: 'अवलोकन',
    farmer: 'कृषक',
    buyer: 'खरीदार',
    admin: 'प्रशासन',
    demo: 'डेमो',
    connectedAs: 'के रूप में जुड़ा',
    startDemo: 'SIH डेमो शुरू करें',
    notifications: 'सूचनाएँ',
    live: 'लाइव',
    aiRouteSummary: 'एआई मार्ग सारांश',
    optimized: 'अनुकूलित',
    traceability: 'ट्रेसबिलिटी टाइमलाइन',
    logistics: 'स्मार्ट लॉजिस्टिक्स रूट',
    loginTitle: 'भूमिका चुनें',
    loginHint: 'एआई आधारित कृषि आपूर्ति श्रृंखला, मध्यस्थों को कम करके मूल्य पारदर्शिता बढ़ाती है।',
    buyerPortal: 'खरीदार पोर्टल',
    farmerPortal: 'कृषक / FPO',
    adminPortal: 'प्रशासन कंसोल',
    aiDemand: 'एआई मांग पूर्वानुमान',
    aiPrice: 'एआई मूल्य अनुशंसा',
    aiSellability: 'एआई बेचने की क्षमता',
    addProduce: 'उत्पाद जोड़ें',
    placeOrder: 'ऑर्डर दें',
    orderForm: 'खरीद ऑर्डर दर्ज करें',
    consent: 'सहमति',
    submitOrder: 'ऑर्डर अनुरोध जमा करें',
    aiAssistant: 'एआई सहायक',
    aiReady: 'एआई मॉडल तैयार',
    buyerRequirement: 'खरीदार आवश्यकता',
    orderHistory: 'हाल के ऑर्डर',
    viewAll: 'सभी देखें',
  },
  pa: {
    brand: 'ਫਾਰਮਫਲੋ AI',
    tagline: 'ਕਿਸਾਨ ਜੋ ਉਗਾਉਂਦਾ ਹੈ, ਬਾਜ਼ਾਰ ਨੂੰ ਉਹੀ ਚਾਹੀਦਾ ਹੈ।',
    overview: 'ਓਵਰਵਿਊ',
    farmer: 'ਕਿਸਾਨ',
    buyer: 'ਖਰੀਦਾਰ',
    admin: 'ਐਡਮਿਨ',
    demo: 'ਡੈਮੋ',
    connectedAs: 'ਇਸ ਤੌਰ ਤੇ ਜੁੜਿਆ',
    startDemo: 'SIH ਡੈਮੋ ਸ਼ੁਰੂ ਕਰੋ',
    notifications: 'ਨੋਟੀਫਿਕੇਸ਼ਨ',
    live: 'ਲਾਈਵ',
    aiRouteSummary: 'AI ਰੂਟ ਸੰਖੇਪ',
    optimized: 'ਓਪਟੀਮਾਈਜ਼ਡ',
    traceability: 'ਟ੍ਰੇਸਬਿਲਿਟੀ ਟਾਈਮਲਾਈਨ',
    logistics: 'ਸਮਾਰਟ ਲੌਜਿਸਟਿਕਸ ਰੂਟ',
    loginTitle: 'ਰੋਲ ਚੁਣੋ',
    loginHint: 'AI-ਸਮਰਥਿਤ ਖੇਤੀਬਾੜੀ ਸਪਲਾਈ ਚੇਨ, ਵਿਚਕਾਰਲੇ ਵਿਆਪਾਰ ਨੂੰ ਘਟਾ ਕੇ ਕੀਮਤ ਦੀ ਪਾਰਦਰਸ਼ਤਾ ਬੁੰਨਦੀ ਹੈ।',
    buyerPortal: 'ਖਰੀਦਾਰ ਪੋਰਟਲ',
    farmerPortal: 'ਕਿਸਾਨ / FPO',
    adminPortal: 'ਐਡਮਿਨ ਕੰਸੋਲ',
    aiDemand: 'AI ਮੰਗ ਪੂਰਵ ਅਨੁਮਾਨ',
    aiPrice: 'AI ਕੀਮਤ ਸਲਾਹ',
    aiSellability: 'AI ਵੇਚਣਯੋਗਤਾ',
    addProduce: 'ਉਤਪਾਦ ਜੋੜੋ',
    placeOrder: 'ਆਰਡਰ ਦਿਓ',
    orderForm: 'ਖਰੀਦ ਆਰਡਰ ਦਿਓ',
    consent: 'ਸਹਿਮਤੀ',
    submitOrder: 'ਆਰਡਰ ਬੇਨਤੀ ਜਮ੍ਹਾ ਕਰੋ',
    aiAssistant: 'AI ਸਹਾਇਕ',
    aiReady: 'AI ਮਾਡਲ ਤਿਆਰ',
    buyerRequirement: 'ਖਰੀਦਾਰ ਲੋੜ',
    orderHistory: 'ਤਾਜ਼ਾ ਆਰਡਰ',
    viewAll: 'ਸਾਰੇ ਵੇਖੋ',
  },
}

function App() {
  const [locale, setLocale] = useState<Locale>('en')
  const [role, setRole] = useState<Role>('overview')
  const [authenticated, setAuthenticated] = useState(false)
  const [selectedCrop, setSelectedCrop] = useState('Tomato')
  const [marketData, setMarketData] = useState<ProduceItem[]>(initialMarketplace)
  const [notifications, setNotifications] = useState(initialNotifications)
  const [orderStatus, setOrderStatus] = useState('')
  const [orderHistory, setOrderHistory] = useState<any[]>([])
  const [produceForm, setProduceForm] = useState({
    crop: 'Tomato',
    quantity: '1200',
    unit: 'kg',
    quality: 'A',
    harvestDate: '2026-09-18',
    location: 'Ludhiana, Punjab',
    minPrice: '20',
    availableFrom: '2026-09-18',
    shelfLife: '5',
  })
  const [orderForm, setOrderForm] = useState<OrderRequest>({
    buyerName: 'ABC Foods',
    buyerType: 'Retailer',
    crop: 'Tomato',
    quantity: '1000',
    location: 'Chandigarh',
    requiredBy: '2026-09-19',
    deliveryPreference: 'Cold chain',
    consentData: true,
    consentAI: true,
    consentCommercial: true,
    notes: 'Need reliable small-size produce and traceability proof.',
  })
  const [aiSummary, setAiSummary] = useState({
    demand: 16100,
    growth: 13.4,
    sellability: 86,
    buyers: 7,
    recommended: '₹22–24/kg',
    confidence: 87,
  })

  const t = (key: string) => copy[locale][key] ?? key
  const currentDemand = useMemo(() => demandDataMap[selectedCrop], [selectedCrop])

  const handleLogin = (selectedRole: Role) => {
    setRole(selectedRole)
    setAuthenticated(true)
    setNotifications((prev) => [
      `Welcome ${selectedRole === 'farmer' ? 'Raj' : selectedRole === 'buyer' ? 'ABC Restaurant' : 'Admin'} to FarmFlow AI.`,
      ...prev,
    ])
  }

  const handleStartDemo = () => {
    setAuthenticated(true)
    setRole('farmer')
    setSelectedCrop('Tomato')
    setProduceForm({
      crop: 'Tomato',
      quantity: '1200',
      unit: 'kg',
      quality: 'A',
      harvestDate: '2026-09-18',
      location: 'Ludhiana, Punjab',
      minPrice: '20',
      availableFrom: '2026-09-18',
      shelfLife: '5',
    })
    setAiSummary({
      demand: 16100,
      growth: 13.4,
      sellability: 86,
      buyers: 7,
      recommended: '₹22–24/kg',
      confidence: 87,
    })
    setNotifications([
      'AI predicts a strong tomato demand window across Chandigarh markets.',
      'Buyer ABC Restaurant requires 1,000 kg tomatoes by 19 September.',
      'Three nearby farmers are matched for the aggregated shipment.',
      'Optimized route saved ₹890 in logistics costs.',
      ...initialNotifications,
    ])
  }

  const handleProduceSubmit = () => {
    const demand = 14200 + Number(produceForm.quantity) / 12
    const growth = 11 + Number(produceForm.quantity) / 150
    const score = 80 + Math.min(15, Number(produceForm.quantity) / 200)
    const buyerCount = 4 + Math.round(Number(produceForm.quantity) / 300)
    setAiSummary({
      demand: Math.round(demand),
      growth: Number(growth.toFixed(1)),
      sellability: Math.round(score),
      buyers: buyerCount,
      recommended: `₹${Math.round((Number(produceForm.minPrice) + 2) * 10) / 10}–₹${Math.round((Number(produceForm.minPrice) + 4) * 10) / 10}/kg`,
      confidence: 87,
    })
    setMarketData((prev) => [
      {
        id: Date.now(),
        crop: produceForm.crop,
        quantity: Number(produceForm.quantity),
        grade: produceForm.quality,
        location: produceForm.location,
        price: Number(produceForm.minPrice) + 2,
        harvestDate: produceForm.harvestDate,
        seller: 'Raj Kumar',
        sellability: Math.round(score),
      },
      ...prev,
    ])
    setNotifications((prev) => [
      `AI recommends listing ${produceForm.crop} at ${`₹${Math.round((Number(produceForm.minPrice) + 2) * 10) / 10}–₹${Math.round((Number(produceForm.minPrice) + 4) * 10) / 10}/kg`}.`,
      ...prev,
    ])
  }

  const submitOrder = async (payload: OrderRequest) => {
    const response = await fetch('http://127.0.0.1:8000/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        buyer_name: payload.buyerName,
        buyer_type: payload.buyerType,
        crop: payload.crop,
        quantity: Number(payload.quantity),
        grade: 'A',
        location: payload.location,
        required_by: payload.requiredBy,
        delivery_preference: payload.deliveryPreference,
        consent_data: payload.consentData,
        consent_ai: payload.consentAI,
        consent_commercial: payload.consentCommercial,
        notes: payload.notes,
      }),
    })

    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.detail || 'Order submission failed')
    }

    return data
  }

  const handlePlaceOrder = async (payloadOverride?: Partial<OrderRequest>) => {
    const finalPayload = { ...orderForm, ...payloadOverride }
    setOrderStatus('Submitting order to backend...')

    try {
      const data = await submitOrder(finalPayload)
      setOrderHistory((prev) => [{
        order_id: data.order_id,
        crop: finalPayload.crop,
        quantity: finalPayload.quantity,
        location: finalPayload.location,
        status: data.status,
        buyer_name: finalPayload.buyerName,
      }, ...prev])
      setOrderStatus(`Order ${data.order_id} confirmed. Backend received your request.`)
      setNotifications((prev) => [
        `${finalPayload.crop} order for ${finalPayload.quantity} kg placed successfully and synced to backend.`,
        ...prev,
      ])
      setRole('buyer')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      setOrderStatus(`Order could not be submitted: ${message}`)
    }
  }

  const renderLogin = () => (
    <div className="min-h-screen bg-[#071311] text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 py-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl space-y-8">
          <div className="inline-flex items-center gap-3 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200">
            <Sprout className="h-4 w-4" />
            {t('brand')}
          </div>
          <div className="space-y-4">
            <h1 className="text-5xl font-black tracking-tight text-white md:text-6xl">
              {t('tagline')}
            </h1>
            <p className="max-w-lg text-lg text-slate-300">{t('loginHint')}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: 'Farmer earnings', value: '+32%' },
              { label: 'Consumer saving', value: '-18%' },
              { label: 'Logistics savings', value: '-23%' },
            ].map((metric) => (
              <div key={metric.label} className="rounded-2xl border border-slate-700 bg-slate-900/70 p-4">
                <div className="text-2xl font-bold text-emerald-300">{metric.value}</div>
                <div className="text-xs uppercase tracking-wide text-slate-400">{metric.label}</div>
              </div>
            ))}
          </div>

          <div className="rounded-3xl border border-slate-700 bg-slate-900/70 p-5 text-sm text-slate-200">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-slate-400">Prototype AI model</span>
              <span className="rounded-full bg-emerald-500/15 px-2 py-1 text-xs font-semibold text-emerald-300">AI DEMO PREDICTION</span>
            </div>
            <div className="flex items-end gap-3">
              <div>
                <div className="text-3xl font-black text-white">{aiSummary.demand.toLocaleString()} kg</div>
                <div className="text-slate-400">Tomato demand forecast</div>
              </div>
              <div className="rounded-xl bg-emerald-500/15 px-3 py-2 text-sm font-semibold text-emerald-300">+{aiSummary.growth}%</div>
            </div>
          </div>
        </div>

        <div className="w-full max-w-lg rounded-[28px] border border-slate-700 bg-slate-900/80 p-6 shadow-2xl shadow-emerald-900/20">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Demo Access</p>
              <h2 className="mt-2 text-2xl font-bold text-white">{t('loginTitle')}</h2>
            </div>
            <button
              onClick={handleStartDemo}
              className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
            >
              ▶ {t('startDemo')}
            </button>
          </div>

          <div className="space-y-4">
            {[
              { role: 'farmer', email: 'farmer@demo.com', label: 'Farmer / FPO' },
              { role: 'buyer', email: 'buyer@demo.com', label: 'Buyer' },
              { role: 'admin', email: 'admin@demo.com', label: 'Admin' },
            ].map((item) => (
              <button
                key={item.role}
                onClick={() => handleLogin(item.role as Role)}
                className="flex w-full items-center justify-between rounded-2xl border border-slate-700 bg-slate-800/80 p-4 text-left transition hover:border-emerald-500 hover:bg-slate-800"
              >
                <div>
                  <p className="text-lg font-bold text-white">{item.label}</p>
                  <p className="text-sm text-slate-400">{item.email}</p>
                </div>
                <div className="rounded-full border border-emerald-500/40 bg-emerald-500/10 p-2 text-emerald-300">
                  <ArrowRight className="h-4 w-4" />
                </div>
              </button>
            ))}
          </div>

          <div className="mt-7 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-100">
            <div className="mb-2 flex items-center gap-2 font-semibold">
              <Sparkles className="h-4 w-4" />
              Simulated Demo Data
            </div>
            This prototype uses illustrative numbers for demo validation and should not be treated as official government statistics.
          </div>
        </div>
      </div>
    </div>
  )

  const renderFarmerDashboard = () => (
    <div className="space-y-6">
      <div className="rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-slate-900/80 p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-emerald-300">Farmer dashboard</p>
            <h2 className="mt-2 text-3xl font-bold text-white">Good Morning, Raj 👨‍🌾</h2>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
            <Leaf className="h-5 w-5 text-emerald-300" />
            1,200 kg available produce
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {[
            { label: 'Total produce listed', value: '1,200 kg', icon: <Package className="h-4 w-4" /> },
            { label: 'Active orders', value: '3', icon: <ShoppingCart className="h-4 w-4" /> },
            { label: 'Expected earnings', value: '₹26,400', icon: <CircleDollarSign className="h-4 w-4" /> },
            { label: 'Average selling price', value: '₹22.8/kg', icon: <BarChart3 className="h-4 w-4" /> },
            { label: 'AI demand score', value: '86/100', icon: <Activity className="h-4 w-4" /> },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border border-slate-700 bg-slate-800/80 p-4">
              <div className="mb-2 flex items-center gap-2 text-emerald-300">{item.icon}</div>
              <div className="text-2xl font-bold text-white">{item.value}</div>
              <div className="text-xs uppercase tracking-wide text-slate-400">{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-700 bg-slate-900/80 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white">AI Demand Forecasting</h3>
              <span className="rounded-full bg-blue-500/10 px-2 py-1 text-xs font-semibold text-blue-300">AI DEMO PREDICTION</span>
            </div>
            <div className="mb-4 flex flex-wrap gap-2">
              {cropOptions.map((crop) => (
                <button
                  key={crop}
                  onClick={() => setSelectedCrop(crop)}
                  className={`rounded-full px-3 py-1.5 text-sm ${selectedCrop === crop ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-200'}`}
                >
                  {crop}
                </button>
              ))}
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl bg-slate-800 p-4">
                <div className="text-sm text-slate-400">Current Demand</div>
                <div className="mt-2 text-3xl font-bold text-white">{currentDemand?.[5].current.toLocaleString()} kg</div>
              </div>
              <div className="rounded-2xl bg-slate-800 p-4">
                <div className="text-sm text-slate-400">Predicted Demand</div>
                <div className="mt-2 text-3xl font-bold text-emerald-300">{aiSummary.demand.toLocaleString()} kg</div>
              </div>
              <div className="rounded-2xl bg-slate-800 p-4">
                <div className="text-sm text-slate-400">Demand Growth</div>
                <div className="mt-2 text-3xl font-bold text-cyan-300">+{aiSummary.growth}%</div>
              </div>
            </div>
            <div className="mt-6 h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={currentDemand}>
                  <defs>
                    <linearGradient id="demandFill" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="5%" stopColor="#34d399" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#34d399" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="label" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip />
                  <Area type="monotone" dataKey="current" stroke="#22c55e" fill="url(#demandFill)" strokeWidth={2} />
                  <Area type="monotone" dataKey="predicted" stroke="#22d3ee" fill="url(#demandFill)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-700 bg-slate-900/80 p-6">
            <h3 className="text-xl font-semibold text-white">Add Produce</h3>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <input className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-white" value={produceForm.crop} onChange={(e) => setProduceForm({ ...produceForm, crop: e.target.value })} />
              <input className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-white" value={produceForm.quantity} onChange={(e) => setProduceForm({ ...produceForm, quantity: e.target.value })} />
              <select className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-white" value={produceForm.unit} onChange={(e) => setProduceForm({ ...produceForm, unit: e.target.value })}>
                <option>kg</option>
                <option>quintal</option>
                <option>crate</option>
              </select>
              <select className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-white" value={produceForm.quality} onChange={(e) => setProduceForm({ ...produceForm, quality: e.target.value })}>
                <option>A</option>
                <option>B</option>
                <option>C</option>
              </select>
              <input type="date" className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-white" value={produceForm.harvestDate} onChange={(e) => setProduceForm({ ...produceForm, harvestDate: e.target.value })} />
              <input className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-white" value={produceForm.location} onChange={(e) => setProduceForm({ ...produceForm, location: e.target.value })} />
              <input className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-white" value={produceForm.minPrice} onChange={(e) => setProduceForm({ ...produceForm, minPrice: e.target.value })} />
              <input type="date" className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-white" value={produceForm.availableFrom} onChange={(e) => setProduceForm({ ...produceForm, availableFrom: e.target.value })} />
              <input className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-white" value={produceForm.shelfLife} onChange={(e) => setProduceForm({ ...produceForm, shelfLife: e.target.value })} />
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <button onClick={handleProduceSubmit} className="rounded-xl bg-emerald-500 px-4 py-2 font-semibold text-slate-950 transition hover:bg-emerald-400">List Produce</button>
              <button className="rounded-xl border border-slate-600 px-4 py-2 text-slate-200">Voice Input</button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-700 bg-slate-900/80 p-6">
            <h3 className="text-xl font-semibold text-white">AI Price Recommendation</h3>
            <div className="mt-4 space-y-4 text-sm text-slate-300">
              <div className="rounded-2xl bg-slate-800 p-3">
                <div className="text-slate-400">Current Market Price</div>
                <div className="mt-1 text-2xl font-bold text-white">₹20/kg</div>
              </div>
              <div className="rounded-2xl bg-slate-800 p-3">
                <div className="text-slate-400">AI recommended listing price</div>
                <div className="mt-1 text-2xl font-bold text-emerald-300">₹22–24/kg</div>
              </div>
              <div className="rounded-2xl bg-slate-800 p-3">
                <div className="text-slate-400">Expected buyer price</div>
                <div className="mt-1 text-2xl font-bold text-cyan-300">₹27/kg</div>
              </div>
              <div className="rounded-2xl bg-emerald-500/10 p-3 text-emerald-200">
                Farmer benefit: +18%
              </div>
            </div>
            <p className="mt-4 text-sm text-slate-300">
              Demand is expected to increase by 13.4% in the next 7 days while regional supply remains moderate. The recommended listing range is ₹22–24/kg.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-700 bg-slate-900/80 p-6">
            <h3 className="text-xl font-semibold text-white">AI Sellability Score</h3>
            <div className="mt-4 flex items-center justify-center">
              <div
                className="gauge-ring flex h-40 w-40 items-center justify-center rounded-full"
                style={{
                  background: 'conic-gradient(#22c55e 0 86%, rgba(148,163,184,0.2) 86% 100%)',
                }}
              >
                <div className="text-center">
                  <div className="text-3xl font-black text-white">{aiSummary.sellability}</div>
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-400">/100</div>
                </div>
              </div>
            </div>
            <div className="mt-5 grid gap-2 text-sm text-slate-300">
              <div className="flex justify-between"><span>Demand</span><span>92%</span></div>
              <div className="flex justify-between"><span>Price</span><span>84%</span></div>
              <div className="flex justify-between"><span>Buyer Match</span><span>91%</span></div>
              <div className="flex justify-between"><span>Shelf Life</span><span>72%</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderBuyerDashboard = () => (
    <div className="space-y-6">
      <div className="rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 to-slate-900/80 p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Buyer dashboard</p>
            <h2 className="mt-2 text-3xl font-bold text-white">Fresh produce demand, matched instantly</h2>
          </div>
          <div className="rounded-full border border-cyan-500/40 bg-cyan-500/10 px-3 py-1.5 text-sm font-semibold text-cyan-300">Restaurant / Retail / Institutional</div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            { label: 'Nearby Produce', value: '24 listings', icon: MapPinned },
            { label: 'Recommended Suppliers', value: '7 active', icon: Users },
            { label: 'Current Prices', value: '₹18–₹54/kg', icon: CircleDollarSign },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border border-slate-700 bg-slate-800/80 p-4">
              <item.icon className="mb-2 h-5 w-5 text-cyan-300" />
              <div className="text-2xl font-bold text-white">{item.value}</div>
              <div className="text-xs uppercase tracking-wide text-slate-400">{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-slate-700 bg-slate-900/80 p-6">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">Marketplace</h3>
            <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-300">
              <Search className="h-4 w-4" />
              Search produce
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {marketData.map((item) => (
              <div key={item.id} className="rounded-2xl border border-slate-700 bg-slate-800/80 p-4">
                <div className="mb-4 flex items-center justify-between">
                  <div className="text-lg font-bold text-white">{item.crop}</div>
                  <div className="rounded-full bg-emerald-500/15 px-2 py-1 text-xs font-semibold text-emerald-300">{item.sellability}/100</div>
                </div>
                <div className="space-y-2 text-sm text-slate-300">
                  <div className="flex justify-between"><span>Farmer/FPO</span><span>{item.seller}</span></div>
                  <div className="flex justify-between"><span>Location</span><span>{item.location}</span></div>
                  <div className="flex justify-between"><span>Quantity</span><span>{item.quantity} kg</span></div>
                  <div className="flex justify-between"><span>Price</span><span>₹{item.price}/kg</span></div>
                  <div className="flex justify-between"><span>Grade</span><span>{item.grade}</span></div>
                  <div className="flex justify-between"><span>Harvest Date</span><span>{item.harvestDate}</span></div>
                </div>
                <button onClick={() => handlePlaceOrder({ crop: item.crop, quantity: String(item.quantity), location: item.location, buyerName: 'ABC Foods', buyerType: 'Retailer', requiredBy: '2026-09-19', deliveryPreference: 'Cold chain', consentData: true, consentAI: true, consentCommercial: true, notes: 'Need direct supplier with traceability.' })} className="mt-4 w-full rounded-xl bg-cyan-500 px-3 py-2 font-semibold text-slate-950 transition hover:bg-cyan-400">Place Order</button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-700 bg-slate-900/80 p-6">
            <h3 className="text-xl font-semibold text-white">Farmer-Buyer Matching</h3>
            <div className="mt-4 rounded-2xl bg-slate-800 p-4 text-sm text-slate-300">
              <div className="text-slate-400">Buyer requirement</div>
              <div className="mt-2 text-lg font-bold text-white">Tomatoes • 1,000 kg • Grade A • Chandigarh</div>
              <div className="mt-2">Required by: 19 September</div>
            </div>
            <div className="mt-5 space-y-3">
              {buyerMatches.map((match) => (
                <div key={match.name} className="rounded-2xl border border-slate-700 bg-slate-800 p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">{match.name}</span>
                    <span className="rounded-full bg-emerald-500/15 px-2 py-1 text-xs text-emerald-300">Match Score: {match.score}%</span>
                  </div>
                  <div className="mt-2 flex justify-between text-sm text-slate-300">
                    <span>{match.quantity} kg</span>
                    <span>{match.distance} km away</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-700 bg-slate-900/80 p-6">
            <h3 className="text-xl font-semibold text-white">Order Aggregation</h3>
            <div className="mt-5 flex items-center justify-center">
              <div className="flex flex-col items-center gap-2 text-sm text-slate-300">
                <div className="rounded-full border border-slate-600 bg-slate-800 px-3 py-1">Multiple Farmers</div>
                <ArrowRight className="h-4 w-4 text-slate-500" />
                <div className="rounded-full border border-slate-600 bg-slate-800 px-3 py-1">Order Aggregation Engine</div>
                <ArrowRight className="h-4 w-4 text-slate-500" />
                <div className="rounded-full border border-emerald-500 bg-emerald-500/10 px-3 py-1 text-emerald-300">1 Consolidated Shipment</div>
                <ArrowRight className="h-4 w-4 text-slate-500" />
                <div className="rounded-full border border-slate-600 bg-slate-800 px-3 py-1">Buyer</div>
              </div>
            </div>
            <div className="mt-5">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={aggregatedOrder} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} innerRadius={40} label>
                    {aggregatedOrder.map((entry, index) => (
                      <Cell key={entry.name} fill={['#34d399', '#22d3ee', '#c084fc'][index % 3]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-slate-700 bg-slate-900/80 p-6">
          <h3 className="text-xl font-semibold text-white">{t('orderForm')}</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <input value={orderForm.buyerName} onChange={(e) => setOrderForm({ ...orderForm, buyerName: e.target.value })} className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-white" placeholder="Buyer name" />
            <select value={orderForm.buyerType} onChange={(e) => setOrderForm({ ...orderForm, buyerType: e.target.value })} className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-white">
              <option>Retailer</option>
              <option>Restaurant</option>
              <option>Institution</option>
              <option>Wholesale Buyer</option>
            </select>
            <input value={orderForm.crop} onChange={(e) => setOrderForm({ ...orderForm, crop: e.target.value })} className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-white" placeholder="Crop" />
            <input value={orderForm.quantity} onChange={(e) => setOrderForm({ ...orderForm, quantity: e.target.value })} className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-white" placeholder="Quantity" />
            <input value={orderForm.location} onChange={(e) => setOrderForm({ ...orderForm, location: e.target.value })} className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-white" placeholder="Delivery location" />
            <input type="date" value={orderForm.requiredBy} onChange={(e) => setOrderForm({ ...orderForm, requiredBy: e.target.value })} className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-white" />
            <select value={orderForm.deliveryPreference} onChange={(e) => setOrderForm({ ...orderForm, deliveryPreference: e.target.value })} className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-white md:col-span-2">
              <option>Cold chain</option>
              <option>Standard transport</option>
              <option>Direct farm pickup</option>
            </select>
            <textarea value={orderForm.notes} onChange={(e) => setOrderForm({ ...orderForm, notes: e.target.value })} className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-white md:col-span-2" placeholder="Additional notes" rows={3} />
          </div>

          <div className="mt-5 space-y-3 text-sm text-slate-200">
            <label className="flex items-center gap-3"><input type="checkbox" checked={orderForm.consentData} onChange={(e) => setOrderForm({ ...orderForm, consentData: e.target.checked })} /> I consent to sharing my supplier and delivery data.</label>
            <label className="flex items-center gap-3"><input type="checkbox" checked={orderForm.consentAI} onChange={(e) => setOrderForm({ ...orderForm, consentAI: e.target.checked })} /> I agree to AI-assisted demand and route optimization.</label>
            <label className="flex items-center gap-3"><input type="checkbox" checked={orderForm.consentCommercial} onChange={(e) => setOrderForm({ ...orderForm, consentCommercial: e.target.checked })} /> I consent to commercial matching and communication.</label>
          </div>

          <button onClick={() => handlePlaceOrder()} className="mt-5 w-full rounded-xl bg-cyan-500 px-4 py-3 font-semibold text-slate-950 hover:bg-cyan-400">{t('submitOrder')}</button>
          {orderStatus && <div className="mt-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-200">{orderStatus}</div>}
        </div>

        <div className="rounded-3xl border border-slate-700 bg-slate-900/80 p-6">
          <h3 className="text-xl font-semibold text-white">{t('aiAssistant')}</h3>
          <div className="mt-4 rounded-2xl bg-gradient-to-br from-violet-500/15 to-cyan-500/10 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-400">{t('aiReady')}</div>
                <div className="mt-1 text-2xl font-bold text-white">{aiSummary.confidence}% confidence</div>
              </div>
              <Sparkles className="h-8 w-8 text-violet-300" />
            </div>
          </div>

          <div className="mt-5 space-y-4 text-sm text-slate-300">
            <div className="rounded-2xl bg-slate-800 p-3">
              <div className="text-slate-400">Predicted demand</div>
              <div className="mt-1 text-xl font-bold text-white">{aiSummary.demand.toLocaleString()} kg</div>
            </div>
            <div className="rounded-2xl bg-slate-800 p-3">
              <div className="text-slate-400">Price guidance</div>
              <div className="mt-1 text-xl font-bold text-emerald-300">{aiSummary.recommended}</div>
            </div>
            <div className="rounded-2xl bg-slate-800 p-3">
              <div className="text-slate-400">Buyer match likelihood</div>
              <div className="mt-1 text-xl font-bold text-cyan-300">{Math.min(98, aiSummary.sellability + 7)}%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderAdminDashboard = () => (
    <div className="space-y-6">
      <div className="rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-slate-900/80 p-6">
        <p className="text-sm uppercase tracking-[0.2em] text-amber-300">Admin dashboard</p>
        <h2 className="mt-2 text-3xl font-bold text-white">Regional trade intelligence</h2>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {adminMetrics.map((item) => (
            <div key={item.label} className="rounded-2xl border border-slate-700 bg-slate-800/80 p-4">
              <div className="text-2xl font-bold text-white">{item.value}</div>
              <div className="mt-1 text-xs uppercase tracking-wide text-slate-400">{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-slate-700 bg-slate-900/80 p-6">
          <h3 className="text-xl font-semibold text-white">Orders over time</h3>
          <div className="mt-6 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[{ month: 'Jan', orders: 210 }, { month: 'Feb', orders: 240 }, { month: 'Mar', orders: 290 }, { month: 'Apr', orders: 360 }, { month: 'May', orders: 440 }, { month: 'Jun', orders: 520 }]}> 
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="orders" fill="#34d399" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-700 bg-slate-900/80 p-6">
          <h3 className="text-xl font-semibold text-white">Regional demand map</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {cropOptions.map((crop) => (
              <button key={crop} onClick={() => setSelectedCrop(crop)} className={`rounded-full px-3 py-1.5 text-sm ${selectedCrop === crop ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-200'}`}>
                {crop}
              </button>
            ))}
          </div>
          <div className="mt-6 grid gap-3">
            {regionDemand.map((entry) => (
              <div key={entry.region} className="rounded-2xl border border-slate-700 bg-slate-800/80 p-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">{entry.region}</span>
                  <span className="text-xs uppercase tracking-wide text-amber-300">{entry.value}</span>
                </div>
                <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-700">
                  <div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-emerald-400" style={{ width: `${entry.demand}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-3xl border border-slate-700 bg-slate-900/80 p-6">
          <h3 className="text-xl font-semibold text-white">Projected impact from prototype simulation</h3>
          <div className="mt-5 space-y-4">
            {[
              ['Farmer Income', '+32% projected'],
              ['Consumer Price', '-18% projected'],
              ['Logistics Cost', '-23% projected'],
              ['Vehicle Utilization', '68% → 91%'],
              ['Food Waste', '-15% projected'],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between rounded-2xl border border-slate-700 bg-slate-800/80 px-4 py-3">
                <span className="text-slate-300">{label}</span>
                <span className="font-semibold text-emerald-300">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-700 bg-slate-900/80 p-6">
          <h3 className="text-xl font-semibold text-white">Price Transparency Engine</h3>
          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-700">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-800 text-slate-200">
                <tr>
                  <th className="p-3">Channel</th>
                  <th className="p-3">Traditional supply chain</th>
                  <th className="p-3">FarmFlow AI</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Farmer', '₹14/kg', '₹22/kg'],
                  ['Collector', '₹17/kg', '₹3/kg logistics'],
                  ['Wholesaler', '₹21/kg', '₹1/kg platform'],
                  ['Distributor', '₹25/kg', 'Consumer: ₹26/kg'],
                  ['Retailer', '₹32/kg', ''],
                  ['Consumer', '₹40/kg', '₹26/kg'],
                ].map(([channel, traditional, farmFlow]) => (
                  <tr key={channel} className="border-t border-slate-700">
                    <td className="p-3 font-semibold text-white">{channel}</td>
                    <td className="p-3">{traditional}</td>
                    <td className="p-3">{farmFlow}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-200">
            Farmer Gain: +₹8/kg • Consumer Saving: ₹14/kg • Intermediaries Reduced: 4+
          </div>
        </div>
      </div>
    </div>
  )

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-700 bg-slate-900/80 p-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-emerald-300">SIH Demo Mode</p>
            <h2 className="mt-2 text-3xl font-bold text-white">Complete direct-to-market flow</h2>
          </div>
          <button onClick={handleStartDemo} className="rounded-full bg-emerald-500 px-4 py-2 font-semibold text-slate-950">▶ Start SIH Demo</button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {[
            'Farmer adds 1,200 kg tomatoes',
            'AI predicts high demand',
            'Buyer requires 1,000 kg',
            'Three farmers matched',
            'Optimized route saved ₹890',
          ].map((step) => (
            <div key={step} className="rounded-2xl border border-slate-700 bg-slate-800/80 p-4 text-sm text-slate-200">{step}</div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-slate-700 bg-slate-900/80 p-6">
          <h3 className="text-xl font-semibold text-white">Key Impact</h3>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {[
              { label: 'Traditional farmer price', value: '₹14/kg' },
              { label: 'FarmFlow price', value: '₹22/kg' },
              { label: 'Traditional revenue', value: '₹16,800' },
              { label: 'FarmFlow revenue', value: '₹26,400' },
              { label: 'Additional revenue', value: '₹9,600' },
              { label: 'Consumer saving', value: '₹13/kg' },
            ].map((metric) => (
              <div key={metric.label} className="rounded-2xl border border-slate-700 bg-slate-800/80 p-4">
                <div className="text-sm text-slate-400">{metric.label}</div>
                <div className="mt-2 text-2xl font-bold text-white">{metric.value}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-700 bg-slate-900/80 p-6">
          <h3 className="text-xl font-semibold text-white">Logistics dashboard</h3>
          <div className="mt-5 space-y-4 text-sm text-slate-300">
            <div className="rounded-2xl bg-slate-800 p-3"><span className="text-slate-400">Vehicle capacity</span><div className="mt-1 text-2xl font-bold text-white">1,200 kg</div></div>
            <div className="rounded-2xl bg-slate-800 p-3"><span className="text-slate-400">Load</span><div className="mt-1 text-2xl font-bold text-white">1,000 kg</div></div>
            <div className="rounded-2xl bg-slate-800 p-3"><span className="text-slate-400">Utilization</span><div className="mt-1 text-2xl font-bold text-emerald-300">83%</div></div>
            <div className="rounded-2xl bg-slate-800 p-3"><span className="text-slate-400">Optimized route</span><div className="mt-1 text-2xl font-bold text-cyan-300">74 km • 2h 15m</div></div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#071311] text-white">
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 lg:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 via-green-400 to-cyan-500 text-slate-950 shadow-lg shadow-emerald-500/30">
              <Tractor className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xl font-black tracking-tight text-white">{t('brand')}</div>
              <div className="text-[10px] uppercase tracking-[0.3em] text-slate-400">{t('tagline')}</div>
            </div>
          </div>

          <nav className="hidden items-center gap-2 md:flex">
            {[
              ['Overview', 'overview'],
              ['Farmer', 'farmer'],
              ['Buyer', 'buyer'],
              ['Admin', 'admin'],
            ].map(([label, value]) => (
              <button
                key={value}
                onClick={() => setRole(value as Role)}
                className={`rounded-full px-3 py-2 text-sm font-medium ${role === value ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-200'}`}
              >
                {t(label.toLowerCase()) || label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="flex gap-2 rounded-full border border-slate-700 bg-slate-900 p-1">
              {(['en', 'hi', 'pa'] as Locale[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLocale(lang)}
                  className={`rounded-full px-2 py-1 text-xs font-semibold ${locale === lang ? 'bg-emerald-500 text-slate-950' : 'text-slate-300'}`}
                >
                  {lang === 'en' ? 'EN' : lang === 'hi' ? 'हिं' : 'ਪੰ'}
                </button>
              ))}
            </div>
            <button onClick={handleStartDemo} className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950">▶ {t('demo')}</button>
          </div>
        </div>
      </header>

      {!authenticated ? (
        renderLogin()
      ) : (
        <main className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-400">{t('connectedAs')}</p>
              <h1 className="mt-2 text-3xl font-black text-white">
                {role === 'farmer' ? t('farmerPortal') : role === 'buyer' ? t('buyerPortal') : role === 'admin' ? t('adminPortal') : 'Smart Agriculture Flow'}
              </h1>
            </div>

            <div className="flex flex-wrap gap-3">
              {[{
                label: 'Notifications', value: `${notifications.length}`,
                icon: Bell,
              }, {
                label: 'Nearby buyers', value: '7',
                icon: UserCheck,
              }, {
                label: 'Active route', value: '74 km',
                icon: Truck,
              }].map((item) => (
                <div key={item.label} className="rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3">
                  <div className="flex items-center gap-2 text-slate-300">
                    <item.icon className="h-4 w-4 text-emerald-300" />
                    {item.label}
                  </div>
                  <div className="mt-1 text-xl font-bold text-white">{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-3xl border border-slate-700 bg-slate-900/80 p-5">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">{t('notifications')}</h3>
                <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-semibold text-emerald-300">{t('live')}</span>
              </div>
              <div className="space-y-3">
                {notifications.slice(0, 5).map((note, index) => (
                  <div key={`${note}-${index}`} className="flex items-start gap-3 rounded-2xl border border-slate-700 bg-slate-800/80 p-3 text-sm text-slate-200">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-300" />
                    <span>{note}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-700 bg-slate-900/80 p-5">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">{t('aiRouteSummary')}</h3>
                <span className="rounded-full bg-cyan-500/10 px-2 py-1 text-xs font-semibold text-cyan-300">{t('optimized')}</span>
              </div>
              <div className="space-y-4">
                {[
                  ['Traditional route', '92 km'],
                  ['Optimized route', '74 km'],
                  ['Traditional logistics cost', '₹2,740'],
                  ['Optimized logistics cost', '₹1,850'],
                  ['Savings', '₹890'],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between border-b border-slate-700 pb-2 text-sm text-slate-300 last:border-none last:pb-0">
                    <span>{label}</span>
                    <span className="font-semibold text-white">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {role === 'farmer' && renderFarmerDashboard()}
          {role === 'buyer' && renderBuyerDashboard()}
          {role === 'admin' && renderAdminDashboard()}
          {role === 'overview' && renderOverview()}

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-slate-700 bg-slate-900/80 p-6">
              <h3 className="text-xl font-semibold text-white">{t('traceability')}</h3>
              <div className="relative mt-6 space-y-6 border-l border-slate-700 pl-5">
                {[
                  ['Farm', 'Raj Kumar • Ludhiana, Punjab'],
                  ['Harvest', '18 September 2026 • Quality Grade A'],
                  ['Quality Check', 'Visual + moisture verification complete'],
                  ['Pickup', 'Pickup slot scheduled at 08:30 AM'],
                  ['Transportation', 'Route optimized to Chandigarh'],
                  ['Buyer', 'ABC Restaurant • Delivery status in transit'],
                ].map(([label, detail]) => (
                  <div key={label} className="timeline-item relative">
                    <div className="text-sm uppercase tracking-wide text-emerald-300">{label}</div>
                    <div className="mt-1 text-white">{detail}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-700 bg-slate-900/80 p-6">
              <h3 className="text-xl font-semibold text-white">{t('logistics')}</h3>
              <div className="map-grid mt-6 rounded-3xl border border-dashed border-slate-700 bg-slate-950/60 p-4">
                <div className="relative flex h-64 items-center justify-center overflow-hidden rounded-2xl bg-slate-950">
                  <div className="absolute h-32 w-32 rounded-full border border-emerald-500/40 bg-emerald-500/10" />
                  <div className="absolute left-[18%] top-[20%] h-3 w-3 rounded-full bg-emerald-400" />
                  <div className="absolute left-[40%] top-[38%] h-3 w-3 rounded-full bg-cyan-400" />
                  <div className="absolute left-[62%] top-[58%] h-3 w-3 rounded-full bg-violet-400" />
                  <div className="absolute left-[76%] top-[30%] h-3 w-3 rounded-full bg-amber-400" />
                  <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 220" preserveAspectRatio="none">
                    <path d="M 75 77 C 120 40, 160 60, 170 100 S 270 140, 300 120 S 350 75, 350 100" fill="none" stroke="#34d399" strokeWidth="4" strokeDasharray="8 10" />
                  </svg>
                  <div className="absolute rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-sm font-semibold text-emerald-300">Optimized Distance: 74 km</div>
                </div>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 text-sm text-slate-300">
                <div className="rounded-2xl border border-slate-700 bg-slate-800 p-3">Estimated time: 2h 15m</div>
                <div className="rounded-2xl border border-slate-700 bg-slate-800 p-3">Transport cost: ₹1,850</div>
                <div className="rounded-2xl border border-slate-700 bg-slate-800 p-3">Vehicle utilization: 92%</div>
                <div className="rounded-2xl border border-slate-700 bg-slate-800 p-3">Savings: ₹890</div>
              </div>
            </div>
          </div>

          {orderHistory.length > 0 && (
            <div className="mt-6 rounded-3xl border border-slate-700 bg-slate-900/80 p-6">
              <h3 className="text-xl font-semibold text-white">{t('orderHistory')}</h3>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {orderHistory.slice(0, 3).map((item) => (
                  <div key={item.order_id} className="rounded-2xl border border-slate-700 bg-slate-800 p-4 text-sm text-slate-200">
                    <div className="text-xs uppercase tracking-wide text-cyan-300">{item.order_id}</div>
                    <div className="mt-2 text-lg font-bold text-white">{item.crop}</div>
                    <div className="mt-1">{item.quantity} kg</div>
                    <div className="mt-1">{item.location}</div>
                    <div className="mt-2 text-emerald-300">{item.status}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      )}
    </div>
  )
}

export default App
