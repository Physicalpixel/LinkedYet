# LinkedYet? 🔗

**LinkedYet?** is a real-time, interactive network visualization tool designed to track and display growing connections as they happen. Built for events, workshops, or community building, it allows users to register their connections via a mobile-friendly interface and watch the collective network expand instantly on a live, force-directed graph.

## 🚀 Key Features

- **Live Network Graph**: Powered by **D3.js**, providing a smooth, interactive, and force-directed visualization of nodes (people) and edges (connections).
- **Real-Time Sync**: Uses **Firebase Firestore** listeners to update the graph across all connected devices the moment a new connection is registered.
- **Unique Avatars**: Automatically assigns unique, vibrant avatars to every participant from a curated set.
- **Mobile First**: Includes a generated QR code on the home screen so participants can quickly join and add connections from their phones.
- **Modern Tech Stack**: Built with **React**, **Vite**, and **Tailwind CSS v4** for high performance and a sleek, dark-mode aesthetic.

---

## 🛠️ Technical Stack

- **Frontend**: React 18 (Vite)
- **Styling**: Tailwind CSS v4 (with `@tailwindcss/postcss`)
- **Visualization**: D3.js (Force Simulation, Zoom, Drag & Drop)
- **Backend/Database**: Google Firebase Firestore
- **Icons/QR**: `qrcode.react`

---

## 📥 Getting Started

## 📖 How to Use

1. **The Landing Page**: Scan the QR code with your phone to join the network or click "Start Connecting" to enter.
2. **Add Connections**:
   - Navigate to the **"Add Connections"** tab.
   - Enter your name.
   - Enter the names of people you met (separated by commas, e.g., `Alice, Bob, Charlie`).
   - Click **"Register Connections"**.
3. **View the Live Graph**:
   - Navigate to the **"Live Network"** tab.
   - Watch as your node appears and connects to others in real-time.
   - **Interact**: Click and drag nodes to reorganize them. Use your mouse wheel or pinch-to-zoom to navigate the network.
4. **Resetting**: Use the **"Reset Data"** button in the bottom-left corner of the graph to clear the entire network and start fresh.

---
