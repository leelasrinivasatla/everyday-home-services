/**
 * Everyday Home Services - Native Map-First Application Controller
 * Powered by Leaflet.js real maps, GPS auto-detection, and real-time dispatch tracking.
 */

(function () {
  'use strict';

  // ============================================================================
  // APPLICATION STATE
  // ============================================================================
  const STATE = {
    // Current authenticated persona
    currentUser: {
      id: 'usr_cust_1042',
      name: 'Alexandre Tremblay',
      email: 'alexandre@everydayhelp.com',
      role: 'customer',
      avatar: 'AT',
      activeOrder: true
    },

    // Selected location coordinates (Default: 85 King Ave, Oakville, ON)
    currentLocation: {
      address: '85 King Ave, Oakville, ON',
      lat: 43.4475,
      lng: -79.6677
    },

    // Driver technician position & route
    driver: {
      name: 'Marcus Chen',
      vehicle: '2022 Ford Transit (CVBA 842)',
      vanLat: 43.4560,
      vanLng: -79.6820,
      etaMinutes: 6,
      dutyOnline: true
    },

    // Subscription Plan in checkout
    selectedPlan: {
      id: 'basic_plus',
      name: 'Everyday Duo (2 Services: Salt + Bins)',
      price: 89.00
    },

    // 10 Stops for Marcus Chen's Active Route
    stops: [
      {
        id: 'SUB-1041',
        seq: 1,
        time: '8:30 AM',
        customer: 'David M.',
        address: '12 Pine St, Mississauga',
        lat: 43.5890,
        lng: -79.6441,
        serviceId: 'bin',
        serviceTitle: 'Bin Take-Out & Return',
        notes: 'Side gate latch is unlocked. Return blue bin to garage wall.',
        completed: true,
        proof: { photo: 'assets/bin_takeout.jpg', time: '8:42 AM', gpsDelta: '4.2m' }
      },
      {
        id: 'SUB-1042',
        seq: 2,
        time: '9:15 AM',
        customer: 'Alexandre T.',
        address: '85 King Ave, Oakville',
        lat: 43.4475,
        lng: -79.6677,
        serviceId: 'salt',
        serviceTitle: 'Water Softener Salt Delivery',
        notes: 'Basement side door unlocked. 2x 20kg bags into brine tank.',
        completed: false,
        proof: null
      },
      {
        id: 'SUB-1043',
        seq: 3,
        time: '10:00 AM',
        customer: 'Robert L.',
        address: '44 Cedar Rd, Oakville',
        lat: 43.4520,
        lng: -79.6730,
        serviceId: 'bulb',
        serviceTitle: 'Bulb Replacement & High Reach',
        notes: 'Coach lanterns dusk-to-dawn sensor bulb replacement.',
        completed: false,
        proof: null
      },
      {
        id: 'SUB-1044',
        seq: 4,
        time: '10:45 AM',
        customer: 'Elena R.',
        address: '19 Lake Dr, Mississauga',
        lat: 43.5650,
        lng: -79.5980,
        serviceId: 'junk',
        serviceTitle: 'Curbside Junk & Box Hauling',
        notes: '3 flattened IKEA moving cartons neatly bound at curbside.',
        completed: false,
        proof: null
      },
      {
        id: 'SUB-1045',
        seq: 5,
        time: '11:30 AM',
        customer: 'Marc B.',
        address: '142 Lakeshore Blvd, Toronto',
        lat: 43.6380,
        lng: -79.4620,
        serviceId: 'bin',
        serviceTitle: 'Bin Take-Out & Return',
        notes: 'Organic green bin + black garbage bin.',
        completed: false,
        proof: null
      },
      {
        id: 'SUB-1046',
        seq: 6,
        time: '1:00 PM',
        customer: 'Sarah H.',
        address: '123 Example St, Toronto',
        lat: 43.6426,
        lng: -79.3871,
        serviceId: 'salt',
        serviceTitle: 'Water Softener Salt Delivery',
        notes: 'Direct entry via garage. Top off salt tank.',
        completed: false,
        proof: null
      },
      {
        id: 'SUB-1047',
        seq: 7,
        time: '1:45 PM',
        customer: 'Patricia W.',
        address: '502 Bay St, Toronto',
        lat: 43.6540,
        lng: -79.3830,
        serviceId: 'bulb',
        serviceTitle: 'Bulb Replacement & High Reach',
        notes: 'Foyer pendant fixture replacement.',
        completed: false,
        proof: null
      },
      {
        id: 'SUB-1048',
        seq: 8,
        time: '2:30 PM',
        customer: 'Geoffrey V.',
        address: '92 Bloor St, Toronto',
        lat: 43.6690,
        lng: -79.3890,
        serviceId: 'bin',
        serviceTitle: 'Bin Take-Out & Return',
        notes: 'Laneway pickup. Please set wheel brakes.',
        completed: false,
        proof: null
      },
      {
        id: 'SUB-1049',
        seq: 9,
        time: '3:15 PM',
        customer: 'Chloe B.',
        address: '330 Eglinton Ave, Toronto',
        lat: 43.7020,
        lng: -79.4010,
        serviceId: 'salt',
        serviceTitle: 'Water Softener Salt Delivery',
        notes: 'Softener check & salt bridge inspection.',
        completed: false,
        proof: null
      },
      {
        id: 'SUB-1050',
        seq: 10,
        time: '4:00 PM',
        customer: 'Tariq A.',
        address: '78 Finch Ave, Toronto',
        lat: 43.7800,
        lng: -79.4160,
        serviceId: 'junk',
        serviceTitle: 'Curbside Junk & Box Hauling',
        notes: '2 broken patio chairs and cardboard bundle.',
        completed: false,
        proof: null
      }
    ],

    // Partner Applications Pipeline
    partners: [
      {
        id: 'PTR-801',
        name: 'Marcus Chen',
        vehicle: '2022 Ford Transit Van (CVBA 842)',
        capabilities: ['Curbside Bins', '20kg Salt Lift', '12ft Ladder', 'Cargo Haul'],
        bgCheck: 'PASSED (Checkr #89102)',
        status: 'APPROVED'
      },
      {
        id: 'PTR-802',
        name: 'David Miller',
        vehicle: '2023 Ram ProMaster 2500 (BXYA 109)',
        capabilities: ['Curbside Bins', '20kg Salt Lift', 'Cargo Haul'],
        bgCheck: 'PROCESSING (Checkr)',
        status: 'PENDING_REVIEW'
      }
    ],

    // Past Customer Bookings Vault
    bookings: [
      {
        id: 'SUB-0988',
        service: 'Water Softener Salt Delivery',
        date: 'Sep 29, 2026 • 10:26 AM',
        address: '85 King Ave, Oakville',
        contractor: 'Marcus Chen (Van #4)',
        photo: 'assets/salt_refill.jpg',
        hasSignature: true,
        gpsDelta: '5.8m',
        notes: 'Refilled tank with 2x 20kg bags. Checked brine valve floater.'
      },
      {
        id: 'SUB-0982',
        service: 'Bin Take-Out & Return',
        date: 'Sep 22, 2026 • 8:40 AM',
        address: '85 King Ave, Oakville',
        contractor: 'Marcus Chen (Van #4)',
        photo: 'assets/bin_takeout.jpg',
        hasSignature: false,
        gpsDelta: '3.1m',
        notes: 'Curbside placement completed for morning municipal collection.'
      }
    ],

    // Webhooks
    webhooks: [
      {
        id: 'WH-1042',
        time: '9:12 AM',
        jobId: 'SUB-1042',
        type: 'ETA_RADAR_UPDATE',
        payload: 'Van #4 within 2.4 km of 85 King Ave, Oakville. ETA: 6 mins.'
      },
      {
        id: 'WH-1041',
        time: '8:42 AM',
        jobId: 'SUB-1041',
        type: 'PROOF_VERIFIED',
        payload: 'Stop #1 (12 Pine St) marked complete with photo proof. Delta: 4.2m.'
      }
    ]
  };

  // ============================================================================
  // LOCALSTORAGE PERSISTENCE ENGINE
  // ============================================================================
  const STORAGE_KEY = 'everyday_platform_state_v2';

  function savePlatformState() {
    try {
      const payload = {
        currentUser: STATE.currentUser,
        currentLocation: STATE.currentLocation,
        stops: STATE.stops,
        bookings: STATE.bookings,
        partners: STATE.partners,
        webhooks: STATE.webhooks,
        selectedPlan: STATE.selectedPlan
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (err) {
      console.warn('LocalStorage save error:', err);
    }
  }

  function loadPlatformState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      if (data.currentUser) STATE.currentUser = data.currentUser;
      if (data.currentLocation) STATE.currentLocation = data.currentLocation;
      if (Array.isArray(data.stops) && data.stops.length) STATE.stops = data.stops;
      if (Array.isArray(data.bookings) && data.bookings.length) STATE.bookings = data.bookings;
      if (Array.isArray(data.partners) && data.partners.length) STATE.partners = data.partners;
      if (Array.isArray(data.webhooks) && data.webhooks.length) STATE.webhooks = data.webhooks;
      if (data.selectedPlan) STATE.selectedPlan = data.selectedPlan;
    } catch (err) {
      console.warn('LocalStorage load error:', err);
    }
  }

  // ============================================================================
  // LEAFLET REAL MAP VARIABLES
  // ============================================================================
  let leafletMap = null;
  let customerMarker = null;
  let driverMarker = null;
  let routePolyline = null;

  // ============================================================================
  // APPLICATION INIT
  // ============================================================================
  document.addEventListener('DOMContentLoaded', () => {
    loadPlatformState();
    initLeafletMap();
    setupLocationPickerAndGPS();
    setupMobileTabbar();
    setupServiceBooking();
    setupVoiceCallModal();
    setupPropertyEntryNotes();
    setupOfficialCertificateModal();
    setupDriverFieldTerminal();
    setupAdminConsole();
    setupAccountMenuAndRoles();
    setupAuthentication();
    startRealtimeVehicleEngine();
    renderVaultList();

    // Rehydrate active persona and order tracker state
    switchPersonaRole(STATE.currentUser.role || 'customer');
    syncHomeActiveTracker();
    if (STATE.currentUser.activeOrder) {
      const trackerCard = document.getElementById('activeJobTrackerCard');
      if (trackerCard) trackerCard.style.display = 'block';
    }
  });

  // ============================================================================
  // 1. REAL LEAFLET MAP INITIALIZATION
  // ============================================================================
  function initLeafletMap() {
    const mapElement = document.getElementById('realLeafletMap');
    if (!mapElement || typeof L === 'undefined') return;

    // Center on Oakville / Mississauga corridor
    leafletMap = L.map('realLeafletMap', {
      zoomControl: false,
      attributionControl: false
    }).setView([STATE.currentLocation.lat, STATE.currentLocation.lng], 13);

    // High quality OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    }).addTo(leafletMap);

    // Custom Customer Pin Icon (Clean Blue Circle with SVG Home)
    const customerIcon = L.divIcon({
      className: 'leaflet-customer-pin',
      html: `
        <div style="width: 32px; height: 32px; border-radius: 50%; background: #2563eb; border: 3px solid #ffffff; box-shadow: 0 4px 12px rgba(37,99,235,0.4); display: flex; align-items: center; justify-content: center;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    customerMarker = L.marker([STATE.currentLocation.lat, STATE.currentLocation.lng], { icon: customerIcon })
      .addTo(leafletMap)
      .bindPopup(`<strong>Your Service Location</strong><br>${STATE.currentLocation.address}`);

    // Custom Driver Pin Icon (Clean Emerald Truck with Pulse)
    const driverIcon = L.divIcon({
      className: 'leaflet-driver-pin',
      html: `
        <div style="position: relative; width: 36px; height: 36px; border-radius: 50%; background: #059669; border: 3px solid #ffffff; box-shadow: 0 4px 14px rgba(5,150,105,0.5); display: flex; align-items: center; justify-content: center;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18]
    });

    driverMarker = L.marker([STATE.driver.vanLat, STATE.driver.vanLng], { icon: driverIcon })
      .addTo(leafletMap)
      .bindPopup(`<strong>Technician En Route</strong><br>Marcus Chen &bull; Ford Transit Van`);

    // Route Polyline connecting Van to Customer Home
    routePolyline = L.polyline([
      [STATE.driver.vanLat, STATE.driver.vanLng],
      [43.4510, -79.6740],
      [STATE.currentLocation.lat, STATE.currentLocation.lng]
    ], {
      color: '#059669',
      weight: 5,
      dashArray: '8, 8',
      opacity: 0.8
    }).addTo(leafletMap);

    // Recenter buttons
    document.getElementById('btnRecenterHome')?.addEventListener('click', () => {
      leafletMap.setView([STATE.currentLocation.lat, STATE.currentLocation.lng], 14, { animate: true });
      customerMarker.openPopup();
    });

    document.getElementById('btnRecenterDriver')?.addEventListener('click', () => {
      leafletMap.setView([STATE.driver.vanLat, STATE.driver.vanLng], 14, { animate: true });
      driverMarker.openPopup();
    });

    // Map tap to select location manually
    leafletMap.on('click', (e) => {
      updateLocationCoordinates(e.latlng.lat, e.latlng.lng, `Selected Pin (${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(4)})`);
      showToast('Location Selected', 'Service location updated to tapped pin.');
    });

    // Filter Chips over map
    document.querySelectorAll('.map-filter-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.map-filter-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const filter = chip.getAttribute('data-filter');
        filterServiceCards(filter);
      });
    });
  }

  function filterServiceCards(cat) {
    document.querySelectorAll('.app-service-card').forEach(card => {
      const key = card.getAttribute('data-service-key');
      const catMap = { bin: 'curbside', salt: 'water', bulb: 'safety', junk: 'hauling' };
      if (cat === 'all' || catMap[key] === cat) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }

  function updateLocationCoordinates(lat, lng, address) {
    STATE.currentLocation.lat = lat;
    STATE.currentLocation.lng = lng;
    STATE.currentLocation.address = address;

    const locText = document.getElementById('activeLocationText');
    if (locText) locText.textContent = address;

    if (customerMarker && leafletMap) {
      customerMarker.setLatLng([lat, lng]);
      customerMarker.setPopupContent(`<strong>Service Location</strong><br>${address}`);
      leafletMap.setView([lat, lng], 14, { animate: true });
    }

    if (routePolyline) {
      routePolyline.setLatLngs([
        [STATE.driver.vanLat, STATE.driver.vanLng],
        [43.4510, -79.6740],
        [lat, lng]
      ]);
    }
  }

  // ============================================================================
  // 2. LOCATION PICKER & AUTO-DETECT GPS
  // ============================================================================
  function setupLocationPickerAndGPS() {
    const trigger = document.getElementById('locationSelectorTrigger');
    const btnGps = document.getElementById('btnGpsAutodetect');
    const btnModalGps = document.getElementById('btnModalAutoDetectGPS');
    const modal = document.getElementById('modalLocationPicker');
    const btnClose = document.getElementById('btnCloseLocationModal');

    trigger?.addEventListener('click', () => openModal('modalLocationPicker'));
    btnClose?.addEventListener('click', () => closeModal('modalLocationPicker'));

    modal?.addEventListener('click', (e) => {
      if (e.target === modal) closeModal('modalLocationPicker');
    });

    // 1-Click GPS Auto Detect
    const triggerAutoDetect = () => {
      if ('geolocation' in navigator) {
        showToast('Detecting GPS Location', 'Querying device satellite fix...');
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;
            updateLocationCoordinates(lat, lng, `Current GPS Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
            closeModal('modalLocationPicker');
            showToast('GPS Verified', `Location locked with ${pos.coords.accuracy.toFixed(0)}m accuracy.`);
          },
          (err) => {
            console.warn('Geolocation notice:', err.message);
            // Graceful fallback to verified Oakville location
            updateLocationCoordinates(43.4475, -79.6677, '85 King Ave, Oakville, ON');
            closeModal('modalLocationPicker');
            showToast('Default Corridor', 'Using primary Oakville service corridor.');
          },
          { enableHighAccuracy: true, timeout: 8000 }
        );
      } else {
        showToast('Geolocation Unavailable', 'Please select a neighborhood address manually.');
      }
    };

    btnGps?.addEventListener('click', triggerAutoDetect);
    btnModalGps?.addEventListener('click', triggerAutoDetect);

    // Presets Click
    document.querySelectorAll('.address-preset-item').forEach(item => {
      item.addEventListener('click', () => {
        document.querySelectorAll('.address-preset-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');

        const lat = parseFloat(item.getAttribute('data-lat'));
        const lng = parseFloat(item.getAttribute('data-lng'));
        const addr = item.getAttribute('data-addr');

        updateLocationCoordinates(lat, lng, addr);
        closeModal('modalLocationPicker');
        showToast('Address Updated', `Service location set to ${addr}.`);
      });
    });

    // Manual input search
    document.getElementById('btnApplyManualAddress')?.addEventListener('click', () => {
      const input = document.getElementById('inputManualSearchAddress');
      const text = input ? input.value.trim() : '';
      if (!text) return;

      updateLocationCoordinates(43.4475, -79.6677, text);
      closeModal('modalLocationPicker');
      showToast('Address Applied', `Set to ${text}.`);
    });
  }

  // ============================================================================
  // 3. SERVICE BOOKING & SANDBOX CHECKOUT
  // ============================================================================
  let selectedCadence = {
    id: 'weekly',
    label: 'Weekly',
    multiplier: 1.0
  };

  let inspectingBookingRecord = null;

  function setupServiceBooking() {
    const checkoutModal = document.getElementById('modalSandboxCheckout');
    const btnClose = document.getElementById('btnCloseCheckoutModal');
    const btnConfirm = document.getElementById('btnConfirmSandboxBooking');

    btnClose?.addEventListener('click', () => closeModal('modalSandboxCheckout'));
    checkoutModal?.addEventListener('click', (e) => {
      if (e.target === checkoutModal) closeModal('modalSandboxCheckout');
    });

    // "Book" button handlers
    document.querySelectorAll('[data-open-book]').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.getAttribute('data-open-book');
        const planMap = {
          bin: { id: 'basic', name: 'Essential Single (Bin Take-Out & Return)', price: 49.00 },
          salt: { id: 'basic_plus', name: 'Everyday Duo (Salt Delivery + Bins)', price: 89.00 },
          bulb: { id: 'basic_plus', name: 'Everyday Duo (Bulbs + Bins)', price: 89.00 },
          junk: { id: 'basic_plus', name: 'Everyday Duo (Junk Haul + Bins)', price: 89.00 },
          premium: { id: 'premium', name: 'Whole Home Elite (All 4 Services)', price: 149.00 }
        };
        STATE.selectedPlan = planMap[key] || planMap.salt;
        openSandboxCheckoutSheet();
      });
    });

    // Frequency Cadence Chips
    document.querySelectorAll('.btn-cadence-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.btn-cadence-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');

        selectedCadence.id = chip.getAttribute('data-cadence') || 'weekly';
        selectedCadence.label = chip.querySelector('strong')?.textContent || 'Weekly';
        selectedCadence.multiplier = parseFloat(chip.getAttribute('data-multiplier') || '1.0');

        updateCheckoutPricingDisplay();
      });
    });

    // Arrival Window Chips
    document.querySelectorAll('.arrival-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.arrival-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
      });
    });

    // Autofill Demo Card Button
    document.getElementById('btnFillDemoCard')?.addEventListener('click', () => {
      const cardNum = document.getElementById('inputCardNumber');
      const cardHolder = document.getElementById('inputCardHolder');
      const cardExp = document.getElementById('inputCardExpiry');
      const cardCvc = document.getElementById('inputCardCvc');

      if (cardNum) cardNum.value = '4242 4242 4242 4242';
      if (cardHolder) cardHolder.value = STATE.currentUser.name || 'Alexandre Tremblay';
      if (cardExp) cardExp.value = '12/28';
      if (cardCvc) cardCvc.value = '842';

      showToast('Demo Card Loaded', 'Visa test credentials autofilled for instant simulation.');
    });

    // Default first service date to tomorrow
    const dateInput = document.getElementById('inputServiceStartDate');
    if (dateInput && !dateInput.value) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      dateInput.value = tomorrow.toISOString().split('T')[0];
    }

    // Confirm Sandbox Booking
    btnConfirm?.addEventListener('click', () => {
      const plan = STATE.selectedPlan;
      const addr = document.getElementById('inputCheckoutAddressField')?.value || STATE.currentLocation.address;
      const gateCode = document.getElementById('inputGateAccessCheckout')?.value.trim();

      // Update state
      STATE.currentUser.activeOrder = true;

      // If customer provided gate code in checkout, sync to Stop #2
      if (gateCode) {
        const stop2 = STATE.stops.find(s => s.id === 'SUB-1042') || STATE.stops[1];
        if (stop2) {
          stop2.gateCode = gateCode;
          stop2.notes = `[Gate: ${gateCode}] ` + stop2.notes;
        }
      }

      // Add to bookings vault
      const newBooking = {
        id: `SUB-${Math.floor(1000 + Math.random() * 9000)}`,
        service: plan.name,
        date: `Today • ${selectedCadence.label} Dispatch`,
        address: addr,
        contractor: 'Marcus Chen (Van #4)',
        photo: 'assets/salt_refill.jpg',
        hasSignature: true,
        gpsDelta: '4.8m',
        notes: `Scheduled with ${selectedCadence.label} cadence. Marcus Chen en route.`
      };
      STATE.bookings.unshift(newBooking);

      savePlatformState();
      closeModal('modalSandboxCheckout');
      renderVaultList();

      // Show and update active tracker card
      const trackerCard = document.getElementById('activeJobTrackerCard');
      if (trackerCard) trackerCard.style.display = 'block';

      // Reset milestones
      const nodes = document.querySelectorAll('.job-milestones-row .milestone-node');
      nodes.forEach((n, idx) => {
        n.classList.remove('done', 'active');
        if (idx === 0) n.classList.add('done');
        if (idx === 1) n.classList.add('active');
      });

      const etaVal = document.getElementById('drawerEtaValue');
      if (etaVal) etaVal.textContent = '6 mins away';

      showToast('Subscription Active', `Booking confirmed for ${plan.name}. Marcus Chen en route.`);
    });
  }

  function updateCheckoutPricingDisplay() {
    const plan = STATE.selectedPlan;
    const price = plan.price * selectedCadence.multiplier;
    const hst = price * 0.13;
    const total = price + hst;

    const cadenceSuffix = selectedCadence.id === 'onetime' ? ' / dispatch' : ' / mo';
    const priceLabel = document.getElementById('checkoutPriceLabel');
    const hstLabel = document.getElementById('checkoutHstLabel');
    const totalLabel = document.getElementById('checkoutTotalLabel');

    if (priceLabel) priceLabel.textContent = `$${price.toFixed(2)}${cadenceSuffix}`;
    if (hstLabel) hstLabel.textContent = `$${hst.toFixed(2)}`;
    if (totalLabel) totalLabel.textContent = `$${total.toFixed(2)} CAD`;
  }

  function openSandboxCheckoutSheet() {
    const plan = STATE.selectedPlan;
    document.getElementById('checkoutPlanTitle').textContent = `Confirm ${plan.name}`;
    document.getElementById('checkoutPlanNameLabel').textContent = plan.name;
    updateCheckoutPricingDisplay();

    const addrField = document.getElementById('inputCheckoutAddressField');
    if (addrField) addrField.value = STATE.currentLocation.address;

    openModal('modalSandboxCheckout');
  }

  // ============================================================================
  // 4. VAULT DISPLAY & INSPECTION
  // ============================================================================
  function renderVaultList() {
    const list = document.getElementById('vaultCompactList');
    if (!list) return;

    list.innerHTML = '';

    STATE.bookings.forEach((b) => {
      const item = document.createElement('div');
      item.className = 'vault-mini-item';
      item.innerHTML = `
        <div class="vault-mini-left">
          <div class="vault-mini-thumb">
            <img src="${b.photo}" alt="${b.service}" loading="lazy">
          </div>
          <div>
            <div class="vault-mini-name">${b.service}</div>
            <div class="vault-mini-sub">${b.date} &bull; ${b.contractor}</div>
          </div>
        </div>
        <button class="btn-card-book">Inspect</button>
      `;

      item.addEventListener('click', () => openProofInspectModal(b));
      list.appendChild(item);
    });
  }

  function openProofInspectModal(booking) {
    inspectingBookingRecord = booking;
    document.getElementById('inspectProofServiceTitle').textContent = booking.service;
    document.getElementById('inspectProofPhotoImg').src = booking.photo;
    document.getElementById('inspectTechVal').textContent = booking.contractor;
    openModal('modalProofInspect');
  }

  document.getElementById('btnCloseInspectModal')?.addEventListener('click', () => closeModal('modalProofInspect'));

  // ============================================================================
  // REALTIME IN-APP VOIP VOICE CALL SIMULATOR
  // ============================================================================
  let callTimerInterval = null;
  let callSeconds = 0;
  let isCallMuted = false;
  let isCallSpeaker = false;

  function setupVoiceCallModal() {
    document.getElementById('btnCallTech')?.addEventListener('click', startVoiceCall);
    document.getElementById('btnCloseCallModal')?.addEventListener('click', endVoiceCall);
    document.getElementById('btnEndVoiceCall')?.addEventListener('click', endVoiceCall);

    document.getElementById('btnCallMute')?.addEventListener('click', () => {
      isCallMuted = !isCallMuted;
      const btn = document.getElementById('btnCallMute');
      if (btn) btn.classList.toggle('active', isCallMuted);
      showToast(isCallMuted ? 'Muted' : 'Live', isCallMuted ? 'Your microphone is muted.' : 'Technician Marcus Chen can hear you.');
    });

    document.getElementById('btnCallSpeaker')?.addEventListener('click', () => {
      isCallSpeaker = !isCallSpeaker;
      const btn = document.getElementById('btnCallSpeaker');
      if (btn) btn.classList.toggle('active', isCallSpeaker);
      showToast(isCallSpeaker ? 'Speaker On' : 'Earpiece Mode', isCallSpeaker ? 'Handset audio routed to device speaker.' : 'Standard earpiece audio.');
    });
  }

  function startVoiceCall() {
    openModal('modalVoiceCall');
    isCallMuted = false;
    isCallSpeaker = false;
    callSeconds = 0;

    const statusTxt = document.getElementById('callStatusText');
    const waveform = document.getElementById('callWaveformRow');
    const btnMute = document.getElementById('btnCallMute');
    const btnSpeaker = document.getElementById('btnCallSpeaker');

    if (btnMute) btnMute.classList.remove('active');
    if (btnSpeaker) btnSpeaker.classList.remove('active');
    if (waveform) waveform.style.display = 'none';
    if (statusTxt) statusTxt.textContent = 'Connecting direct line to Van #4...';

    clearInterval(callTimerInterval);

    // Simulate realistic carrier connection
    setTimeout(() => {
      if (!document.getElementById('modalVoiceCall')?.classList.contains('active')) return;

      if (waveform) waveform.style.display = 'flex';
      if (statusTxt) statusTxt.textContent = 'Call Connected • 00:01';
      callSeconds = 1;

      callTimerInterval = setInterval(() => {
        callSeconds++;
        const mins = String(Math.floor(callSeconds / 60)).padStart(2, '0');
        const secs = String(callSeconds % 60).padStart(2, '0');
        if (statusTxt) statusTxt.textContent = `Call Connected • ${mins}:${secs}`;
      }, 1000);
    }, 1400);
  }

  function endVoiceCall() {
    clearInterval(callTimerInterval);
    callTimerInterval = null;
    const waveform = document.getElementById('callWaveformRow');
    if (waveform) waveform.style.display = 'none';
    closeModal('modalVoiceCall');
    showToast('Call Ended', 'Direct voice line with Marcus Chen disconnected.');
  }

  // ============================================================================
  // PROPERTY ENTRY & GATE INSTRUCTIONS SYNC
  // ============================================================================
  function setupPropertyEntryNotes() {
    const btnOpen = document.getElementById('btnInstructionsTech');
    const btnClose = document.getElementById('btnCloseEntryNotesModal');
    const btnSave = document.getElementById('btnSaveEntryNotesToDriver');
    const modal = document.getElementById('modalEntryNotes');

    btnOpen?.addEventListener('click', () => {
      const stop2 = STATE.stops.find(s => s.id === 'SUB-1042') || STATE.stops[1];
      if (stop2) {
        const codeInput = document.getElementById('inputGateCodeField');
        const notesInput = document.getElementById('inputDetailedEntryNotes');
        if (codeInput && stop2.gateCode) codeInput.value = stop2.gateCode;
        if (notesInput && stop2.notes) notesInput.value = stop2.notes;
      }
      openModal('modalEntryNotes');
    });

    btnClose?.addEventListener('click', () => closeModal('modalEntryNotes'));
    modal?.addEventListener('click', (e) => {
      if (e.target === modal) closeModal('modalEntryNotes');
    });

    btnSave?.addEventListener('click', () => {
      const gateCode = document.getElementById('inputGateCodeField')?.value.trim() || '#4491';
      const rawNotes = document.getElementById('inputDetailedEntryNotes')?.value.trim() || 'Side gate latch is unlocked.';
      const petWarn = document.getElementById('chkPetWarning')?.checked;

      let finalNotes = rawNotes;
      if (gateCode && !finalNotes.includes(gateCode)) {
        finalNotes = `[Gate: ${gateCode}] ` + finalNotes;
      }
      if (petWarn && !finalNotes.includes('Pet Alert')) {
        finalNotes += ' [Pet Alert: Golden Retriever in fenced yard]';
      }

      const stop2 = STATE.stops.find(s => s.id === 'SUB-1042') || STATE.stops[1];
      if (stop2) {
        stop2.gateCode = gateCode;
        stop2.notes = finalNotes;
      }

      savePlatformState();
      renderDriverStopsFeed();

      closeModal('modalEntryNotes');
      showToast('Instructions Synced', 'Marcus Chen received your updated entry code & yard notes.');
    });
  }

  // ============================================================================
  // OFFICIAL SERVICE AUDIT CERTIFICATE
  // ============================================================================
  function setupOfficialCertificateModal() {
    const btnClose = document.getElementById('btnCloseCertModal');
    const btnPrint = document.getElementById('btnPrintOfficialCert');
    const btnShare = document.getElementById('btnCertShareLink');
    const modal = document.getElementById('modalOfficialCertificate');

    btnClose?.addEventListener('click', () => closeModal('modalOfficialCertificate'));
    modal?.addEventListener('click', (e) => {
      if (e.target === modal) closeModal('modalOfficialCertificate');
    });

    btnPrint?.addEventListener('click', () => {
      window.print();
    });

    btnShare?.addEventListener('click', () => {
      const url = `${window.location.origin}${window.location.pathname}?cert=CERT-2026-9041`;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(() => {
          showToast('Link Copied', 'Cryptographic audit certificate link copied to clipboard.');
        }).catch(() => {
          showToast('Audit Certificate', `Audit link: ${url}`);
        });
      } else {
        showToast('Audit Certificate', `Audit link: ${url}`);
      }
    });

    document.getElementById('btnDownloadServiceCertificate')?.addEventListener('click', () => {
      closeModal('modalProofInspect');
      openOfficialCertificateModal(inspectingBookingRecord);
    });
  }

  function openOfficialCertificateModal(bookingItem) {
    const item = bookingItem || STATE.bookings[0] || {
      service: 'Water Softener Salt Delivery',
      address: STATE.currentLocation.address,
      contractor: 'Marcus Chen • Van #4 (CVBA 842)',
      photo: 'assets/salt_refill.jpg'
    };

    const propElem = document.getElementById('certCustomerProperty');
    const servElem = document.getElementById('certServiceType');
    const contElem = document.getElementById('certContractorName');
    const photoElem = document.getElementById('certPhotoRecord');

    if (propElem) propElem.textContent = item.address || STATE.currentLocation.address;
    if (servElem) servElem.textContent = item.service || 'Water Softener Salt Delivery';
    if (contElem) contElem.textContent = item.contractor || 'Marcus Chen • Van #4 (CVBA 842)';
    if (photoElem && item.photo) photoElem.src = item.photo;

    renderCertificateSignature(item.signatureDataUrl);
    openModal('modalOfficialCertificate');
  }

  function renderCertificateSignature(dataUrl) {
    const canvas = document.getElementById('certSignatureCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (dataUrl && dataUrl.length > 100) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
      img.src = dataUrl;
    } else {
      // Elegant simulated vector signoff curve
      ctx.strokeStyle = '#059669';
      ctx.lineWidth = 2.4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(25, 55);
      ctx.bezierCurveTo(45, 20, 60, 25, 75, 55);
      ctx.bezierCurveTo(85, 40, 100, 35, 115, 55);
      ctx.bezierCurveTo(130, 25, 145, 60, 160, 45);
      ctx.bezierCurveTo(175, 30, 185, 45, 195, 50);
      ctx.stroke();

      ctx.font = '10px Inter, sans-serif';
      ctx.fillStyle = '#64748b';
      ctx.fillText('Digitally signed by Alexandre Tremblay', 20, 76);
    }
  }

  // ============================================================================
  // 5. DRIVER FIELD TERMINAL (MARCUS CHEN)
  // ============================================================================
  let activeDriverStop = null;
  let driverCanvasCtx = null;
  let isDriverSigning = false;

  function setupDriverFieldTerminal() {
    // Duty Toggle
    const dutyBtn = document.getElementById('driverDutyBtn');
    const dutyLbl = document.getElementById('driverDutyLabel');

    dutyBtn?.addEventListener('click', () => {
      STATE.driver.dutyOnline = !STATE.driver.dutyOnline;
      if (STATE.driver.dutyOnline) {
        dutyLbl.textContent = 'ONLINE • DISPATCH READY';
        dutyBtn.style.background = 'var(--emerald-soft)';
        showToast('Status Online', 'Dispatch radar active. Receiving live route stops.');
      } else {
        dutyLbl.textContent = 'OFF DUTY • PAUSED';
        dutyBtn.style.background = '#f1f5f9';
        showToast('Status Off Duty', 'Daily route dispatch paused.');
      }
    });

    // Signature Pad
    const canvas = document.getElementById('driverSignaturePad');
    if (canvas) {
      driverCanvasCtx = canvas.getContext('2d');
      const hint = document.getElementById('driverSigHint');

      const getCoord = (e) => {
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        return { 
          x: (clientX - rect.left) * scaleX, 
          y: (clientY - rect.top) * scaleY 
        };
      };

      const start = (e) => {
        isDriverSigning = true;
        const pos = getCoord(e);
        driverCanvasCtx.beginPath();
        driverCanvasCtx.moveTo(pos.x, pos.y);
        if (hint) hint.style.display = 'none';
      };

      const move = (e) => {
        if (!isDriverSigning) return;
        e.preventDefault();
        const pos = getCoord(e);
        driverCanvasCtx.lineWidth = 2.5;
        driverCanvasCtx.lineCap = 'round';
        driverCanvasCtx.lineJoin = 'round';
        driverCanvasCtx.strokeStyle = '#059669';
        driverCanvasCtx.lineTo(pos.x, pos.y);
        driverCanvasCtx.stroke();
      };

      const end = () => { isDriverSigning = false; };

      canvas.addEventListener('mousedown', start);
      canvas.addEventListener('mousemove', move);
      window.addEventListener('mouseup', end);

      canvas.addEventListener('touchstart', start, { passive: false });
      canvas.addEventListener('touchmove', move, { passive: false });
      window.addEventListener('touchend', end);

      document.getElementById('btnClearDriverSig')?.addEventListener('click', () => {
        driverCanvasCtx.clearRect(0, 0, canvas.width, canvas.height);
        if (hint) hint.style.display = 'block';
      });
    }

    document.getElementById('btnCloseDriverProofModal')?.addEventListener('click', () => closeModal('modalDriverProof'));

    // Submit Verified Proof
    document.getElementById('btnSubmitDriverProofVerified')?.addEventListener('click', () => {
      if (!activeDriverStop) return;

      const sigCanvas = document.getElementById('driverSignaturePad');
      const signatureDataUrl = sigCanvas ? sigCanvas.toDataURL() : '';

      activeDriverStop.completed = true;
      activeDriverStop.proof = {
        photo: document.getElementById('driverProofPhotoImg').src,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        gpsDelta: '4.8m',
        signatureDataUrl: signatureDataUrl
      };

      const newBooking = {
        id: activeDriverStop.id,
        service: activeDriverStop.serviceTitle,
        date: `Today • ${activeDriverStop.proof.time}`,
        address: activeDriverStop.address,
        contractor: 'Marcus Chen (Van #4)',
        photo: activeDriverStop.proof.photo,
        hasSignature: true,
        signatureDataUrl: signatureDataUrl,
        gpsDelta: '4.8m',
        notes: activeDriverStop.notes
      };

      STATE.bookings.unshift(newBooking);

      // If completing Alexandre's stop (SUB-1042), update customer milestone tracker in realtime!
      if (activeDriverStop.id === 'SUB-1042') {
        const etaVal = document.getElementById('drawerEtaValue');
        if (etaVal) etaVal.textContent = 'Service Completed & Signed';

        const nodes = document.querySelectorAll('.job-milestones-row .milestone-node');
        nodes.forEach(n => {
          n.classList.remove('active');
          n.classList.add('done');
        });

        const trackFill = document.querySelector('.milestones-track-progress');
        if (trackFill) trackFill.style.width = '100%';
      }

      STATE.webhooks.unshift({
        id: `WH-${Math.floor(1000 + Math.random() * 9000)}`,
        time: activeDriverStop.proof.time,
        jobId: activeDriverStop.id,
        type: 'PROOF_VERIFIED',
        payload: `Stop #${activeDriverStop.seq} (${activeDriverStop.customer} - ${activeDriverStop.address}) verified with vector signature & photo.`
      });

      savePlatformState();
      closeModal('modalDriverProof');
      renderDriverStopsFeed();
      renderVaultList();
      renderAdminDashboard();

      showToast('Stop Completed', `Stop #${activeDriverStop.seq} successfully verified & archived.`);
    });

    document.getElementById('btnSimulateNewAngle')?.addEventListener('click', () => {
      const photos = ['assets/salt_refill.jpg', 'assets/bin_takeout.jpg', 'assets/bulb_change.jpg', 'assets/junk_pickup.jpg'];
      const img = document.getElementById('driverProofPhotoImg');
      const next = photos.find(p => !img.src.includes(p)) || photos[0];
      img.src = next;
      showToast('Photo Captured', 'New on-site angle logged via terminal camera.');
    });

    document.getElementById('btnPendingExitToCustomer')?.addEventListener('click', () => {
      switchPersonaRole('customer');
    });
  }

  function renderDriverStopsFeed() {
    const feed = document.getElementById('driverStopsFeed');
    if (!feed) return;

    feed.innerHTML = '';
    let completed = 0;

    STATE.stops.forEach((stop) => {
      if (stop.completed) completed++;

      const isNext = !stop.completed && completed === (stop.seq - 1);

      const card = document.createElement('div');
      card.className = `driver-stop-card-item ${stop.completed ? 'completed-stop' : (isNext ? 'active-stop' : 'scheduled-stop')}`;
      
      const statusPill = stop.completed 
        ? `<span class="stop-badge-status completed"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Completed</span>`
        : (isNext 
            ? `<span class="stop-badge-status next"><span class="live-pulse-dot"></span> Next Stop</span>` 
            : `<span class="stop-badge-status scheduled">Scheduled</span>`);

      card.innerHTML = `
        <div class="stop-card-header">
          <div class="stop-seq-pill">
            <span class="stop-seq-num">#${stop.seq}</span>
            <span class="stop-time-tag">${stop.time}</span>
          </div>
          ${statusPill}
        </div>

        <div class="stop-main-body">
          <div class="stop-address-row">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2.3"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            <h3 class="stop-address-text">${stop.address}</h3>
          </div>
          
          <div class="stop-meta-row">
            <span class="stop-service-title">${stop.serviceTitle}</span>
            <span class="stop-meta-divider">&bull;</span>
            <span class="stop-customer-name">Customer: <strong>${stop.customer}</strong></span>
          </div>

          <div class="stop-notes-box">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            <span>${stop.notes}</span>
          </div>
        </div>

        <div class="stop-actions-row">
          <a class="btn-app-secondary btn-nav-link" href="https://maps.apple.com/?q=${encodeURIComponent(stop.address)}" target="_blank" rel="noopener">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3"><polygon points="3 11 22 2 13 21 11 13 3 11"></polygon></svg>
            <span>Navigation</span>
          </a>

          ${!stop.completed ? `
            <button class="btn-app-primary btn-trigger-proof" data-stop-id="${stop.id}">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
              <span>Capture Proof & Sign</span>
            </button>
          ` : `
            <div class="stop-verified-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
              <span>Verified & Archived (${stop.proof ? stop.proof.time : '8:42 AM'})</span>
            </div>
          `}
        </div>
      `;

      card.querySelector('.btn-trigger-proof')?.addEventListener('click', () => {
        activeDriverStop = stop;
        openDriverProofModal(stop);
      });

      feed.appendChild(card);
    });

    const completedLbl = document.getElementById('driverStopsCompletedLabel');
    if (completedLbl) completedLbl.textContent = `${completed} / 10`;
  }

  function openDriverProofModal(stop) {
    document.getElementById('driverProofStopTitle').textContent = `Complete Stop #${stop.seq}: ${stop.serviceTitle}`;
    const photos = { bin: 'assets/bin_takeout.jpg', salt: 'assets/salt_refill.jpg', bulb: 'assets/bulb_change.jpg', junk: 'assets/junk_pickup.jpg' };
    document.getElementById('driverProofPhotoImg').src = photos[stop.serviceId] || 'assets/salt_refill.jpg';

    if (driverCanvasCtx) {
      driverCanvasCtx.clearRect(0, 0, 460, 140);
      document.getElementById('driverSigHint').style.display = 'block';
    }

    openModal('modalDriverProof');
  }

  // ============================================================================
  // 6. OPERATIONS HQ & ADMIN CONSOLE
  // ============================================================================
  function setupAdminConsole() {
    const tabs = document.querySelectorAll('.admin-nav-btn');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const view = tab.getAttribute('data-admin-tab');
        document.querySelectorAll('.admin-panel').forEach(p => p.style.display = 'none');

        const map = { overview: 'adminPanelOverview', approvals: 'adminPanelApprovals', audit: 'adminPanelAudit', webhooks: 'adminPanelWebhooks' };
        const panel = document.getElementById(map[view]);
        if (panel) panel.style.display = 'block';
      });
    });

    document.getElementById('btnAdminExit')?.addEventListener('click', () => {
      switchPersonaRole('customer');
    });

    document.getElementById('btnAdminBroadcastWeather')?.addEventListener('click', () => {
      STATE.webhooks.unshift({
        id: `WH-${Math.floor(1000 + Math.random() * 9000)}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        jobId: 'BROADCAST',
        type: 'SMS_WEATHER_ALERT',
        payload: '15-min weather delay buffer broadcast to all 10 route customers.'
      });
      renderAdminDashboard();
      showToast('Broadcast Sent', 'Automated SMS notification dispatched to 10 route households.');
    });

    document.getElementById('btnAdminTriggerPing')?.addEventListener('click', () => {
      STATE.webhooks.unshift({
        id: `WH-${Math.floor(1000 + Math.random() * 9000)}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        jobId: 'TELEMETRY',
        type: 'GPS_BEACON_PING',
        payload: 'Marcus Chen Ford Transit GPS Beacon: 43.4560° N, -79.6820° W • 48 km/h.'
      });
      renderAdminDashboard();
      showToast('Telemetry Recorded', 'GPS satellite fix logged to webhook buffer.');
    });
  }

  function renderAdminDashboard() {
    renderAdminPartnersTable();
    renderAdminAuditTable();
    renderAdminWebhookList();

    const completed = STATE.stops.filter(s => s.completed).length;
    const pct = Math.round((completed / 10) * 100);

    const valEl = document.getElementById('adminRouteProgressVal');
    const subEl = document.getElementById('adminRouteProgressSub');
    const barEl = document.getElementById('adminProgressBarFill');
    const txtEl = document.getElementById('adminRouteProgressText');

    if (valEl) valEl.textContent = `${pct}%`;
    if (subEl) subEl.textContent = `${completed} of 10 stops completed`;
    if (barEl) barEl.style.width = `${pct}%`;
    if (txtEl) txtEl.textContent = `${completed} of 10 stops completed (${pct}%)`;
  }

  function renderAdminPartnersTable() {
    const tbody = document.getElementById('adminPartnerTbody');
    if (!tbody) return;

    tbody.innerHTML = '';
    let pending = 0;

    STATE.partners.forEach(p => {
      const isPending = p.status === 'PENDING_REVIEW';
      if (isPending) pending++;

      const capPills = p.capabilities.map(c => `<span class="table-cap-pill">${c}</span>`).join(' ');

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <div class="table-partner-cell">
            <strong class="partner-name">${p.name}</strong>
            <span class="partner-id font-mono-tag">${p.id}</span>
          </div>
        </td>
        <td>
          <div class="table-vehicle-cell">
            <span>${p.vehicle}</span>
          </div>
        </td>
        <td>
          <div class="table-caps-wrap">
            ${capPills}
          </div>
        </td>
        <td>
          <span class="table-bgcheck-tag ${isPending ? 'pending' : 'passed'}">${p.bgCheck}</span>
        </td>
        <td>
          <span class="${isPending ? 'status-badge-pending' : 'status-badge-verified'}">
            ${isPending ? 'Pending Review' : 'Verified & Approved'}
          </span>
        </td>
        <td>
          ${isPending ? `
            <button class="btn-app-primary btn-approve-ptr" data-ptr-id="${p.id}" style="padding: 6px 14px; font-size: 0.76rem;">
              Approve Partner
            </button>
          ` : `
            <span class="partner-active-route-tag">
              <span class="live-pulse-dot"></span> Active Route
            </span>
          `}
        </td>
      `;

      tr.querySelector('.btn-approve-ptr')?.addEventListener('click', () => {
        p.status = 'APPROVED';
        p.bgCheck = 'PASSED (Checkr #89190)';
        STATE.webhooks.unshift({
          id: `WH-${Math.floor(1000 + Math.random() * 9000)}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          jobId: p.id,
          type: 'PARTNER_APPROVED',
          payload: `${p.name} application approved by Operations HQ. Daily route unlocked.`
        });
        renderAdminDashboard();
        showToast('Partner Approved', `${p.name} has been approved and route terminal unlocked.`);
      });

      tbody.appendChild(tr);
    });

    const badge = document.getElementById('adminPendingCounter');
    if (badge) badge.textContent = pending;
  }

  function renderAdminAuditTable() {
    const tbody = document.getElementById('adminAuditTbody');
    if (!tbody) return;

    tbody.innerHTML = '';

    STATE.stops.filter(s => s.completed).forEach(s => {
      const tr = document.createElement('tr');
      const photoSrc = s.proof ? s.proof.photo : 'assets/bin_takeout.jpg';
      const gpsVal = s.proof ? s.proof.gpsDelta : '4.2m';
      
      tr.innerHTML = `
        <td><strong class="font-mono-tag">${s.id}</strong></td>
        <td>
          <div class="audit-service-cell">
            <span class="audit-svc-name">${s.serviceTitle}</span>
            <span class="audit-svc-sub">Weekly Schedule</span>
          </div>
        </td>
        <td>
          <div class="audit-address-cell">
            <strong>${s.customer}</strong>
            <span>${s.address}</span>
          </div>
        </td>
        <td><span class="audit-tech-tag">Marcus Chen (Van #4)</span></td>
        <td>
          <div class="table-proof-thumb" title="Click to inspect verified photo">
            <img src="${photoSrc}" alt="Proof">
          </div>
        </td>
        <td><span class="status-badge-verified">✓ Signed</span></td>
        <td><span class="status-badge-verified">&le; ${gpsVal}</span></td>
      `;

      tr.querySelector('.table-proof-thumb')?.addEventListener('click', () => {
        openProofInspectModal({
          service: s.serviceTitle,
          photo: photoSrc,
          contractor: 'Marcus Chen (Van #4)'
        });
      });

      tbody.appendChild(tr);
    });
  }

  function renderAdminWebhookList() {
    const feed = document.getElementById('adminWebhookList');
    if (!feed) return;

    feed.innerHTML = '';

    STATE.webhooks.slice(0, 8).forEach(w => {
      const row = document.createElement('div');
      row.className = 'webhook-item';
      row.innerHTML = `
        <div class="webhook-left">
          <span class="webhook-type-badge">${w.type}</span>
          <span class="webhook-payload">${w.payload}</span>
        </div>
        <span class="webhook-time font-mono-tag">${w.time}</span>
      `;
      feed.appendChild(row);
    });
  }

  // ============================================================================
  // 7. ACCOUNT MENU & SEAMLESS ROLE SWITCHING
  // ============================================================================
  function setupAccountMenuAndRoles() {
    const btnUser = document.getElementById('userMenuBtn');
    const modal = document.getElementById('modalAccountMenu');
    const btnClose = document.getElementById('btnCloseAccountModal');

    btnUser?.addEventListener('click', () => openModal('modalAccountMenu'));
    btnClose?.addEventListener('click', () => closeModal('modalAccountMenu'));
    modal?.addEventListener('click', (e) => {
      if (e.target === modal) closeModal('modalAccountMenu');
    });

    document.querySelectorAll('.portal-switch-item').forEach(item => {
      item.addEventListener('click', () => {
        const role = item.getAttribute('data-switch-role');
        switchPersonaRole(role);
        closeModal('modalAccountMenu');
      });
    });

    document.getElementById('btnSignOutFromModal')?.addEventListener('click', () => {
      closeModal('modalAccountMenu');
      openModal('modalAuthLogin');
      showToast('Signed Out', 'Account session ended. Please choose an account to sign in.');
    });
  }

  function switchPersonaRole(role) {
    const portalCust = document.getElementById('portalCustomerApp');
    const portalPtr = document.getElementById('portalPartnerTerminal');
    const portalAdm = document.getElementById('portalAdminHQ');

    [portalCust, portalPtr, portalAdm].forEach(p => { if (p) p.style.display = 'none'; });

    const avatarText = document.getElementById('topbarAvatarText');
    const accLarge = document.getElementById('accAvatarLarge');
    const accName = document.getElementById('accUserName');
    const accRole = document.getElementById('accUserRole');
    const accEmail = document.getElementById('accUserEmail');

    // Update active highlight in portal switch list
    document.querySelectorAll('.portal-switch-item').forEach(item => {
      item.classList.toggle('active', item.getAttribute('data-switch-role') === role);
    });

    if (role === 'customer') {
      portalCust.style.display = 'flex';
      avatarText.textContent = STATE.currentUser.avatar || 'AT';
      accLarge.textContent = STATE.currentUser.avatar || 'AT';
      accName.textContent = STATE.currentUser.name || 'Alexandre Tremblay';
      accRole.textContent = 'Homeowner Account';
      if (accEmail) accEmail.textContent = STATE.currentUser.email || 'alexandre@everydayhelp.com';
      if (leafletMap) leafletMap.invalidateSize();
      showToast('Customer View', 'Active on-demand utility app and live radar.');
    } else if (role === 'partner_approved') {
      portalPtr.style.display = 'block';
      document.getElementById('partnerPendingScreen').style.display = 'none';
      document.getElementById('partnerActiveScreen').style.display = 'block';
      avatarText.textContent = 'MC';
      accLarge.textContent = 'MC';
      accName.textContent = 'Marcus Chen';
      accRole.textContent = 'Active Partner Driver (Van #4)';
      if (accEmail) accEmail.textContent = 'marcus@everydayhelp.com';
      renderDriverStopsFeed();
      showToast('Driver Terminal', 'Marcus Chen 10-stop sequenced daily corridor route.');
    } else if (role === 'partner_pending') {
      portalPtr.style.display = 'block';
      document.getElementById('partnerPendingScreen').style.display = 'block';
      document.getElementById('partnerActiveScreen').style.display = 'none';
      avatarText.textContent = 'DM';
      accLarge.textContent = 'DM';
      accName.textContent = 'David Miller';
      accRole.textContent = 'Applicant (Pending Compliance)';
      if (accEmail) accEmail.textContent = 'david@everydayhelp.com';
      showToast('Driver Onboarding', 'Application under review.');
    } else if (role === 'admin') {
      portalAdm.style.display = 'block';
      avatarText.textContent = 'HQ';
      accLarge.textContent = 'HQ';
      accName.textContent = 'Operations HQ Lead';
      accRole.textContent = 'Logistics & Dispatch Administration';
      if (accEmail) accEmail.textContent = 'ops@everydayhelp.com';
      renderAdminDashboard();
      showToast('Operations HQ', 'Logistics command center and partner approvals.');
    }

    STATE.currentUser.role = role;
    syncAccountTabDetails();
    savePlatformState();
  }

  // ============================================================================
  // 7B. REALTIME AUTHENTICATION & DEMO ACCOUNTS
  // ============================================================================
  function setupAuthentication() {
    const modalAuth = document.getElementById('modalAuthLogin');
    const btnClose = document.getElementById('btnCloseAuthModal');
    const tabSignIn = document.getElementById('tabBtnSignIn');
    const tabSignUp = document.getElementById('tabBtnSignUp');
    const formSignIn = document.getElementById('formSignInAuth');
    const formSignUp = document.getElementById('formSignUpAuth');
    const btnForgot = document.getElementById('btnForgotPass');
    const btnOpenAuth = document.getElementById('btnOpenAuthModalFromMenu');
    const btnReset = document.getElementById('btnResetPlatformState');

    btnOpenAuth?.addEventListener('click', () => {
      closeModal('modalAccountMenu');
      openModal('modalAuthLogin');
    });

    btnClose?.addEventListener('click', () => closeModal('modalAuthLogin'));
    modalAuth?.addEventListener('click', (e) => {
      if (e.target === modalAuth) closeModal('modalAuthLogin');
    });

    // Tab switching
    tabSignIn?.addEventListener('click', () => {
      tabSignIn.classList.add('active');
      tabSignUp.classList.remove('active');
      formSignIn.style.display = 'block';
      formSignUp.style.display = 'none';
      document.getElementById('authModalHeaderTitle').textContent = 'Sign In to Everyday';
    });

    tabSignUp?.addEventListener('click', () => {
      tabSignUp.classList.add('active');
      tabSignIn.classList.remove('active');
      formSignUp.style.display = 'block';
      formSignIn.style.display = 'none';
      document.getElementById('authModalHeaderTitle').textContent = 'Create Everyday Account';
    });

    // 1-Click Demo Accounts Pills
    document.querySelectorAll('.btn-demo-account-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        const demoRole = btn.getAttribute('data-demo-role');
        if (demoRole === 'customer') {
          loginUserSession({
            id: 'usr_cust_1042',
            name: 'Alexandre Tremblay',
            email: 'alexandre@everydayhelp.com',
            role: 'customer',
            avatar: 'AT',
            activeOrder: true
          });
        } else if (demoRole === 'partner_approved') {
          loginUserSession({
            id: 'usr_drv_801',
            name: 'Marcus Chen',
            email: 'marcus@everydayhelp.com',
            role: 'partner_approved',
            avatar: 'MC',
            activeOrder: false
          });
        } else if (demoRole === 'admin') {
          loginUserSession({
            id: 'usr_adm_001',
            name: 'Operations HQ Lead',
            email: 'ops@everydayhelp.com',
            role: 'admin',
            avatar: 'HQ',
            activeOrder: false
          });
        }
        closeModal('modalAuthLogin');
        closeModal('modalAccountMenu');
      });
    });

    // Sign In Form Submission
    formSignIn?.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('inputAuthEmail')?.value.trim() || 'alexandre@everydayhelp.com';

      let user = {
        id: 'usr_cust_1042',
        name: 'Alexandre Tremblay',
        email: email,
        role: 'customer',
        avatar: 'AT',
        activeOrder: true
      };

      if (email.toLowerCase().includes('marcus') || email.toLowerCase().includes('driver')) {
        user = {
          id: 'usr_drv_801',
          name: 'Marcus Chen',
          email: email,
          role: 'partner_approved',
          avatar: 'MC',
          activeOrder: false
        };
      } else if (email.toLowerCase().includes('ops') || email.toLowerCase().includes('admin')) {
        user = {
          id: 'usr_adm_001',
          name: 'Operations HQ Lead',
          email: email,
          role: 'admin',
          avatar: 'HQ',
          activeOrder: false
        };
      } else if (email.toLowerCase().includes('david') || email.toLowerCase().includes('miller')) {
        user = {
          id: 'usr_drv_802',
          name: 'David Miller',
          email: email,
          role: 'partner_pending',
          avatar: 'DM',
          activeOrder: false
        };
      } else {
        const prefix = email.split('@')[0];
        const parts = prefix.split(/[._-]/);
        const capName = parts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
        const initials = parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : prefix.substring(0, 2).toUpperCase();
        user.name = capName || 'Everyday User';
        user.avatar = initials || 'EU';
      }

      loginUserSession(user);
      closeModal('modalAuthLogin');
    });

    // Sign Up Form Submission
    formSignUp?.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('inputSignUpName')?.value.trim() || 'Valued Member';
      const email = document.getElementById('inputSignUpEmail')?.value.trim() || 'user@example.com';
      const role = document.getElementById('inputSignUpRole')?.value || 'customer';

      const initials = name.split(' ').map(p => p[0]).join('').substring(0, 2).toUpperCase() || 'EM';

      const user = {
        id: 'usr_' + Date.now().toString().slice(-6),
        name: name,
        email: email,
        role: role,
        avatar: initials,
        activeOrder: false
      };

      loginUserSession(user);
      closeModal('modalAuthLogin');
      showToast('Account Created', `Welcome to Everyday, ${name}.`);
    });

    // Forgot password
    btnForgot?.addEventListener('click', () => {
      showToast('Password Recovery', 'A secure password reset link has been dispatched to your email.');
    });

    // Reset platform state
    btnReset?.addEventListener('click', () => {
      localStorage.removeItem(STORAGE_KEY);
      showToast('Restoring Prototype', 'Resetting test environment to clean defaults...');
      setTimeout(() => {
        window.location.reload();
      }, 500);
    });
  }

  function loginUserSession(user) {
    STATE.currentUser = user;
    savePlatformState();
    switchPersonaRole(user.role);
    showToast('Signed In', `Authenticated as ${user.name} (${user.email}).`);
  }

  // Mobile Bottom Tab Bar Navigation
  // Mobile & Desktop Tab Navigation Router
  function setupMobileTabbar() {
    const tabMap = {
      home: 'tabViewHome',
      services: 'tabViewServices',
      map: 'tabViewMap',
      vault: 'tabViewVault',
      account: 'tabViewAccount'
    };

    function activateCustomerTab(tabName) {
      // Synchronize bottom tabbar buttons
      document.querySelectorAll('.tab-item').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-tab-action') === tabName);
      });

      // Switch active screen
      document.querySelectorAll('.customer-tab-screen').forEach(screen => {
        screen.classList.remove('active');
      });

      const activeScreenId = tabMap[tabName] || 'tabViewHome';
      const activeScreen = document.getElementById(activeScreenId);
      if (activeScreen) {
        activeScreen.classList.add('active');
        activeScreen.scrollTop = 0;
      }

      // If switching to Map, invalidate leaflet map size so tiles render instantly
      if (tabName === 'map' && leafletMap) {
        setTimeout(() => {
          leafletMap.invalidateSize();
          leafletMap.setView([STATE.currentLocation.lat, STATE.currentLocation.lng], 13);
        }, 80);
      } else if (tabName === 'vault') {
        renderVaultList();
      } else if (tabName === 'account') {
        syncAccountTabDetails();
      } else if (tabName === 'home') {
        syncHomeActiveTracker();
      }
    }

    document.querySelectorAll('.tab-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const act = btn.getAttribute('data-tab-action');
        activateCustomerTab(act);
      });
    });

    // Home Active Tracker Banner click: jumps straight to Live Map & Track
    document.getElementById('homeActiveTrackerBanner')?.addEventListener('click', () => {
      activateCustomerTab('map');
    });

    document.getElementById('btnHomeBannerTrack')?.addEventListener('click', (e) => {
      e.stopPropagation();
      activateCustomerTab('map');
    });

    // Floating pill on map: "Browse All Services"
    document.getElementById('btnMapQuickBrowse')?.addEventListener('click', () => {
      activateCustomerTab('services');
    });

    // Topbar brand logo click navigates to Home
    document.getElementById('topbarBrandBtn')?.addEventListener('click', () => {
      activateCustomerTab('home');
    });

    // Topbar avatar click on mobile directly opens Account tab!
    document.getElementById('userMenuBtn')?.addEventListener('click', () => {
      activateCustomerTab('account');
    });

    // Quick search filter on Home tab
    const homeSearchInput = document.getElementById('homeHeroSearchInput');
    if (homeSearchInput) {
      homeSearchInput.addEventListener('input', (e) => {
        const q = e.target.value.toLowerCase().trim();
        const homeCards = document.querySelectorAll('#tabViewHome .app-service-card');
        homeCards.forEach(card => {
          const text = (card.innerText || '').toLowerCase();
          card.style.display = (!q || text.includes(q)) ? '' : 'none';
        });
      });
    }

    // Account tab buttons in Account screen
    document.getElementById('btnOpenAuthFromTab')?.addEventListener('click', () => {
      openModal('modalAuthLogin');
    });

    document.getElementById('btnResetStateFromTab')?.addEventListener('click', () => {
      localStorage.removeItem(STORAGE_KEY);
      showToast('Restoring Prototype', 'Resetting test environment to clean defaults...');
      setTimeout(() => {
        window.location.reload();
      }, 400);
    });

    document.getElementById('btnSignOutFromTab')?.addEventListener('click', () => {
      openModal('modalAuthLogin');
      showToast('Signed Out', 'Account session ended. Choose an account to sign in.');
    });

    // Category filter chips in Services catalog
    document.querySelectorAll('.catalog-filter-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.catalog-filter-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');

        const filter = chip.getAttribute('data-filter');
        document.querySelectorAll('.app-service-card').forEach(card => {
          const key = card.getAttribute('data-service-key');
          if (filter === 'all' || key === filter || (filter === 'curbside' && key === 'bin') || (filter === 'salt' && key === 'salt') || (filter === 'bulb' && key === 'bulb') || (filter === 'junk' && key === 'junk')) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  function syncAccountTabDetails() {
    const avatar = document.getElementById('tabAccAvatarLarge');
    const name = document.getElementById('tabAccUserName');
    const role = document.getElementById('tabAccUserRole');
    const email = document.getElementById('tabAccUserEmail');

    if (avatar) avatar.textContent = STATE.currentUser.avatar || 'AT';
    if (name) name.textContent = STATE.currentUser.name || 'Alexandre Tremblay';
    if (role) {
      const roleMap = {
        customer: 'Homeowner Account',
        partner_approved: 'Active Partner Driver (Van #4)',
        partner_pending: 'Applicant (Pending Compliance)',
        admin: 'Logistics & Dispatch Administration'
      };
      role.textContent = roleMap[STATE.currentUser.role] || 'Homeowner Account';
    }
    if (email) email.textContent = STATE.currentUser.email || 'alexandre@everydayhelp.com';

    // Sync active highlight in portal switch list
    document.querySelectorAll('.portal-switch-item').forEach(item => {
      item.classList.toggle('active', item.getAttribute('data-switch-role') === STATE.currentUser.role);
    });
  }

  function syncHomeActiveTracker() {
    const banner = document.getElementById('homeActiveTrackerBanner');
    if (!banner) return;
    if (STATE.currentUser.activeOrder) {
      banner.style.display = 'flex';
      const etaEl = document.getElementById('homeBannerEta');
      const jobTitleEl = document.getElementById('homeBannerJobTitle');
      if (etaEl) {
        const mins = Math.ceil(STATE.driver.etaMinutes || 6);
        etaEl.textContent = `Arriving in ${mins} mins`;
      }
      if (jobTitleEl) {
        jobTitleEl.textContent = `${STATE.currentUser.activeOrder.serviceName || 'Water Softener Salt Delivery'} • ${STATE.currentUser.activeOrder.status || 'Stop #2'}`;
      }
    } else {
      banner.style.display = 'none';
    }
  }

  // ============================================================================
  // 8. REALTIME SILENT ENGINE (VEHICLE GPS PROGRESSION)
  // ============================================================================
  function startRealtimeVehicleEngine() {
    setInterval(() => {
      if (!STATE.driver.dutyOnline) return;

      // Smooth step towards customer lat/lng
      const targetLat = STATE.currentLocation.lat;
      const targetLng = STATE.currentLocation.lng;

      const dLat = (targetLat - STATE.driver.vanLat) * 0.02;
      const dLng = (targetLng - STATE.driver.vanLng) * 0.02;

      STATE.driver.vanLat += dLat;
      STATE.driver.vanLng += dLng;

      if (driverMarker) {
        driverMarker.setLatLng([STATE.driver.vanLat, STATE.driver.vanLng]);
      }

      if (routePolyline) {
        routePolyline.setLatLngs([
          [STATE.driver.vanLat, STATE.driver.vanLng],
          [43.4510, -79.6740],
          [targetLat, targetLng]
        ]);
      }

      // Decrement ETA
      if (STATE.driver.etaMinutes > 2) {
        STATE.driver.etaMinutes -= 0.08;
        const etaText = document.getElementById('drawerEtaValue');
        if (etaText) etaText.textContent = `${Math.ceil(STATE.driver.etaMinutes)} mins away`;
        const homeEta = document.getElementById('homeBannerEta');
        if (homeEta) homeEta.textContent = `Arriving in ${Math.ceil(STATE.driver.etaMinutes)} mins`;
      }
    }, 2500);
  }

  // ============================================================================
  // 9. TOAST & MODAL HELPERS
  // ============================================================================
  function showToast(title, msg) {
    const wrap = document.getElementById('toastStackWrap');
    if (!wrap) return;

    const toast = document.createElement('div');
    toast.className = 'toast-card';
    toast.innerHTML = `<strong>${title}</strong><span>${msg}</span>`;

    wrap.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(8px)';
      toast.style.transition = 'all 0.25s ease';
      setTimeout(() => toast.remove(), 250);
    }, 3400);
  }

  function openModal(id) {
    const el = document.getElementById(id);
    if (el) {
      el.classList.add('active');
      el.setAttribute('aria-hidden', 'false');
    }
  }

  function closeModal(id) {
    const el = document.getElementById(id);
    if (el) {
      el.classList.remove('active');
      el.setAttribute('aria-hidden', 'true');
    }
  }

})();
