
### 📦 Parcel Delivery System Backend API
A secure, modular, and role-based backend API for a parcel delivery system inspired by services like Pathao Courier and Sundarban. Built using **Express.js** and **Mongoose**, this system supports robust **authentication**, **role-based authorization**, and **parcel tracking** with status history.

#### 🚀 Features
- 🔐 JWT-based authentication with secure password hashing (bcrypt)
- 🎭 Role-based access for **Admin**, **Sender**, and **Receiver**
- 📦 Full parcel lifecycle: create, cancel, dispatch, track, deliver
- 📜 Embedded parcel status logs with timestamps and history
- 🧱 Clean, modular architecture using Express and Mongoose
- 🧾 Unique parcel tracking ID generation (`TRK-YYYYMMDD-xxxxxx`)
- 🔎 Filter/search parcels by status, date, or role
- 🛑 Parcel and user blocking system
- 🧪 Full CRUD APIs with status codes and validations

---

#### 🧰 Tech Stack
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT, Bcrypt
- **Validation:** Custom middleware and Mongoose schema validations

---

#### 📡 All API Endpoints

##### 🔐 Authentication
- `POST /api/v1/user/register` — Register as sender or receiver
- `POST /api/v1/auth/login` — Login to receive JWT token

---

##### 📤 Sender APIs
- `POST /api/v1/parcel/create` — Create a new parcel delivery request
- `GET /api/v1/parcel/me` — View all parcels created by sender
- `PATCH /api/v1/parcel/cancel/:id` — Cancel a parcel (if not dispatched)

---

##### 📥 Receiver APIs
- `GET /api/v1/parcel/incoming-parcels` — View parcels assigned to receiver
- `PATCH /api/v1/parcel/confirm-delivery/:id` — Confirm delivery of parcel
- `GET /api/v1/parcel/delivery-history` — View past delivered/received parcels

---

#### 🛠 Admin APIs
- `GET /api/v1/user/all-parcels` — View all parcels in system
- `GET /api/v1/user/all-users` — View all users in system
- `PATCH /api/v1/user/update-parcel-status/:id` — Update parcel delivery status
- `PATCH api/v1/user/block/:id` — Block  a user
- `PATCH api/v1/user/unblock/:id` — Unblock a user

---

#### 📦 Parcel Status & Tracking
- `GET /api/parcels/:id` — Get full details and tracking history of a parcel
- `GET /api/parcels/track/:trackingId` — Track parcel by public tracking ID

---

#### 📦 Live Link

```bash
🔗 GitHub Repository 
🌍 Live Deployment Link 
```
