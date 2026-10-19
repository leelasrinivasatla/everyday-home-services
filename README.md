# Everyday Home Services | Native Map-First Utility Platform

A production-grade, on-demand and subscription recurring home services Progressive Web Application (PWA). Built with real-world app ergonomics (modeled after Uber / DoorDash), featuring genuine Leaflet.js maps, browser GPS auto-detection, zero marketing landing page fluff, monochromatic SVG iconography, and authentic mobile app ergonomics.

---

## Demonstration Accounts & Real-Time Functionality

The platform includes two fully configured test accounts (plus an Operations HQ lead) to demonstrate the complete inter-connected real-time loop:

### Account 1: Customer (Homeowner)
- **Name**: Alexandre Tremblay
- **Email**: `alexandre@everydayhelp.com`
- **Password**: `customer123`
- **Active Property**: 85 King Ave, Oakville, ON
- **Live Functionality Demonstrated**:
  - **Live GPS Radar & En Route Tracking**: Real-time vehicle simulation showing Marcus Chen's Ford Transit van moving towards Alexandre's property with dynamically updating ETA.
  - **In-App VoIP Audio Call Simulator**: Tap "Call Technician" to initiate a realistic VoIP audio call directly to Marcus Chen in Van #4 with simulated carrier connection, live animated waveform bars, call ticker (`00:01`, `00:02`...), and mute/speakerphone toggles.
  - **Property Entry & Gate Sync**: Tap "Entry Note" to update gate code (`#4491`), yard pet alerts, and lockbox access instructions. These instructions immediately broadcast and sync to Marcus Chen's Stop #2 card in real time.
  - **Customizable Checkout with Test Card**: Select weekly, bi-weekly, monthly, or one-time dispatch with live recalculation of pricing and HST. Tap "Autofill Test Visa Card" to instantly populate test card details (`4242 4242 4242 4242`).
  - **Verified Proof Vault & Official Printable Certificate**: Inspect completed jobs with high-resolution photos, GPS geofence delta (&le; 4.8m), and vector signatures. Tap "Print / Save PDF" to open a formatted official certificate ready for export.

### Account 2: Partner Driver (Technician)
- **Name**: Marcus Chen
- **Vehicle**: 2022 Ford Transit Van (CVBA 842)
- **Email**: `marcus@everydayhelp.com`
- **Password**: `driver123`
- **Live Functionality Demonstrated**:
  - **Sequenced 10-Stop Corridor Route**: Daily route across Mississauga, Oakville, and Toronto West.
  - **Live On-Site Delivery Notes**: Alexandre's Stop #2 dynamically reflects the exact gate code (`#4491`) and property notes submitted by the customer.
  - **HTML5 Vector Signature Capture**: Complete with responsive touch/mouse coordinate scaling, stroke smoothing, and camera photo capture.
  - **Cross-Account State Sync**: Submitting a verified proof signature on Stop #2 instantly advances the customer's milestone tracker to "Service Completed & Signed" and archives the vector signature to the customer's permanent vault.

### Account 3: Operations HQ Lead (Administration)
- **Email**: `ops@everydayhelp.com`
- **Password**: `admin123`
- **Live Functionality Demonstrated**: Fleet KPIs, live stop progress tracking, 1-click partner applicant approvals (e.g., David Miller), and real-time webhook telemetry feed.

---

## System Architecture

### 1. Map-First Utility Engine (Real Leaflet.js & GPS)
- Genuine OpenStreetMap tiles with smooth zoom, pan, and interactive pin placement.
- 1-click location detection using browser Geolocation API (`navigator.geolocation`).
- Recenter on property or on technician with smooth map animation.

### 2. State Engine & LocalStorage Persistence
- All state changes (new bookings, driver signatures, entry notes, partner status) are automatically persisted to `localStorage` under `everyday_platform_state_v2`.
- Switching between customer, driver, and admin profiles maintains consistent platform state.
- A "Reset Data" option in the account menu allows restoring clean defaults at any time.

---

## Running Locally

```bash
cd ~/Desktop/everyday-home-services
python3 -m http.server 3080
```

Open **`http://localhost:3080/`** in your browser.
Test on mobile screen sizes (e.g., in Chrome/Safari Responsive Device Mode) to experience the true mobile app sliding drawer and map-first ergonomics.
