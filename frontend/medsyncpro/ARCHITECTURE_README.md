# MedSyncPro Frontend Architecture Guide

This document explains how the MedSyncPro Next.js frontend is structured, how we separate client-side code from server-side code to protect business logic, and exactly how the real-time notification system works.

---

## 1. Client-Side vs. Server-Side Separation

In modern Next.js (the "App Router" paradigm), we have a strict boundary between what runs in the user's browser (Client-Side) and what runs on our Node.js server (Server-Side).

### Why Do We Separate Them?
- **Security (Hiding Business Logic):** We don't want the user's browser (and thus, the user) to see how we talk to the backend, what our internal API routes look like, or how we manage authentication tokens. Server-side code is entirely hidden from the browser.
- **Performance:** Server Components send pre-rendered HTML to the browser instead of large JavaScript bundles, making the app load faster.
- **Interactivity:** Client Components (`"use client"`) are used only when we need user interaction (buttons, forms, `useState`, `useEffect`).

### How It Works in MedSyncPro:

#### Server Actions (The "Hidden" Logic)
Located in `action/` (e.g., `Finddoctoraction.js`, `notificationAction.js`).
- These are asynchronous functions that run **strictly on the Next.js server**.
- When a client component calls one of these functions, Next.js secretly converts it into a secure `POST` request.
- **How it hides logic:** The browser only sees "I asked the server to run action XYZ and got this JSON back." It *never* sees that the server action used `api-client.js` to attach an HTTP-Only cookie and contacted the Java backend at `http://localhost:8080/api/...`.

#### The Proxy / Middleware (`proxy.js` & `api/.../route.js`)
Next.js acts as a middleman between the browser and the Spring Boot backend.
- When the browser makes a direct fetch to `/api/...`, it hits a Next.js Route Handler.
- Next.js reads the secure HttpOnly cookie containing the user's JWT token, attaches it as a `Bearer` token header, and forwards the request to Spring Boot.
- The browser *never* handles the raw JWT token, keeping the authentication flow secure (blind to malicious scripts).

---

## 2. Directory Structure Explained

- **`app/`**: The core of the Next.js App Router. Every folder represents a URL route.
  - `page.jsx`: The UI for that specific route (e.g., `app/patient/doctors/page.jsx` maps to `/patient/doctors`).
  - `context/`: React Context providers (like `AuthContext.jsx` and `NotificationContext.jsx`). These are `"use client"` files that wrap the application to provide global state.
- **`action/`**: Contains Next.js Server Actions. This is where hidden server-side logic and database/backend API calls live.
- **`lib/`**: Reusable utility functions.
  - `api-client.js`: Used exclusively by Server Actions to make authenticated requests to the backend.
  - `config.js`: Shared configuration variables.
- **`components/`**: Reusable UI pieces (buttons, inputs, layouts) that do not belong to a single specific route.

---

## 3. The Real-Time Notification Flow

Here is the exact step-by-step flow of how a real-time notification reaches the frontend UI:

### Step 1: Initialization (`NotificationContext.jsx`)
When a user logs in, the `NotificationProvider` (a global client-side wrapper) mounts. The `useEffect` hook triggers the initialization sequence:
1. It calls `fetchNotificationsAction()` (a Server Action) to get the historical list of past notifications.
2. It calls `connectSSE()` to open a persistent real-time connection.

### Step 2: The SSE (Server-Sent Events) Connection
Instead of asking the server "Do I have new notifications?" every 5 seconds (which is slow and heavy), we use an `EventSource`.

1. The client opens an `EventSource` connection to `${config.basePath}/api/notifications/stream`.
2. **Crucial Security Step:** Notice that this URL points to Next.js (`localhost:3000`), NOT Spring Boot (`localhost:8080`).
3. Next.js receives the request, securely reads the user's HttpOnly session cookie, and opens its own proxied SSE connection directly to the Spring Boot backend (`/api/notifications/stream`).

### Step 3: Listening for Events
The connection remains open indefinitely. In `NotificationContext.jsx`, we define an Event Listener:
```javascript
eventSource.addEventListener("notification", (event) => {
    // This code runs instantly whenever the server pushes a message
})
```

### Step 4: The Backend Pushes a Message
When something happens in the system (e.g., an appointment is approved), the Java Spring Boot server pushes a text-based payload through the open SSE stream.

### Step 5: Showing the UI Notification
1. The Next.js proxy instantly forwards that payload to the browser.
2. The browser's `addEventListener` catches it.
3. The payload is parsed using `JSON.parse(event.data)`.
4. We call `toast.info(data.title, ...)` which triggers the Sonner library to slide a beautiful notification pop-up onto the screen.
5. In the background, `fetchNotifications()` is called again to refresh the bell icon's unread counter and update the dropdown list of notifications.
