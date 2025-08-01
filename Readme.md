
### 🚚 CourierLab - Parcel Delivery System Backend API
CourierLab is a secure and modular backend API for a parcel delivery system, inspired by the dynamic logistics landscape in Bangladesh, which includes traditional giants like Sundarban Courier and SA Paribahan, alongside modern, tech-driven platforms like Pathao and RedX.
<br/>
<br/>
 Built using **Express.js** and **Mongoose**, this system supports robust **authentication**, **role-based authorization**, and **parcel tracking** with status history.

---

#### 🚀 Features
- 🔐 **Secure, Stateless Authentication:** Utilizes JSON Web Tokens (JWT) for secure API access, with password integrity ensured by Bcrypt hashing.
- 🎭 **Granular Role-Based Access:** A well-defined permission system separates capabilities for Admins, Senders, and Receivers, ensuring users only access what they need.
- 📦 **End-to-End Parcel Management:** A complete workflow allows senders to create requests, admins to manage dispatch, and receivers to confirm delivery. Parcels can be cancelled before dispatch.

- 📜 **Verifiable Tracking History:** Every significant change in a parcel's status is logged with a timestamp, creating an immutable history for tracking and auditing purposes.

- 🧾 **Unique & Searchable Tracking IDs:** Automatically generates a human-readable tracking ID (`TRK-YYYYMMDD-xxxxxx`) for every parcel, enabling easy public tracking.

- 🔎 **Powerful Querying Capabilities:** The API allows for filtering and searching parcels by their status, creation date, or associated user roles.

- 🛡️ **Administrative Controls:** Admins have high-level privileges, including the ability to manually update any parcel's status and block or unblock users from the system.

- 🧱 **Modular and Scalable by Design:** The project's architecture promotes separation of concerns, making it easy to maintain, debug, and extend with new features.


---

#### 🛠️ Core Technologies
This project is built on a foundation of reliable and widely-used open-source technologies.
- **Backend Runtime:** Node.js
- **Web Framework:** Express.js
- **Database:** MongoDB (with Mongoose ODM for elegant data modeling)
- **Security:** JSON Web Tokens (JWT) & Bcrypt
- **Code Quality:** Custom validation middleware & Mongoose schema validation

---
📁 Project Architecture

The codebase is organized into modules to ensure scalability and maintainability. This separation of concerns makes it simple to locate code and understand the data flow.

```
src
    ├── app.ts
    ├── app
    │   ├── config
    │   │   └── env.ts
    │   ├── errorHelpers
    │   │   ├── AppError.ts
    │   │   ├── error.types.ts
    │   │   └── handleAllErrorFunction.ts
    │   ├── interfaces
    │   │   └── index.d.ts
    │   ├── middlewares
    │   │   ├── autoRefreshToken.ts
    │   │   ├── checkAuth.ts
    │   │   ├── globalErrorHandler.ts
    │   │   ├── notFound.ts
    │   │   └── validateRequest.ts
    │   ├── modules
    │   │   ├── auth
    │   │   │   ├── auth.controller.ts
    │   │   │   ├── auth.route.ts
    │   │   │   └── auth.service.ts
    │   │   ├── parcel
    │   │   │   ├── parcel.controller.ts
    │   │   │   ├── parcel.interface.ts
    │   │   │   ├── parcel.model.ts
    │   │   │   ├── parcel.route.ts
    │   │   │   └── parcel.service.ts
    │   │   └── user
    │   │   │   ├── user.controller.ts
    │   │   │   ├── user.interface.ts
    │   │   │   ├── user.model.ts
    │   │   │   ├── user.route.ts
    │   │   │   ├── user.service.ts
    │   │   │   └── user.validation.ts
    │   ├── routes
    │   │   └── index.ts
    │   └── utils
    │   │   ├── catchAsync.ts
    │   │   ├── jwt.ts
    │   │   ├── parcel.ts
    │   │   ├── sendResponse.ts
    │   │   ├── setCookie.ts
    │   │   └── userToken.ts
    └── server.ts
├── env.example
├── eslint.config.mjs
├── package-lock.json
├── package.json
├── tsconfig.json
└── vercel.json
```
---

#### 📡 All API Endpoints

##### 🔐 Authentication
- `POST /api/v1/user/register` — Register as sender or receiver
- `POST /api/v1/auth/login` — Login to receive JWT token

##### 📤 Sender APIs Endpoints
- `POST /api/v1/parcel/create` — Create a new parcel delivery request
- `GET /api/v1/parcel/me` — View all parcels created by sender
- `PATCH /api/v1/parcel/cancel/:id` — Cancel a parcel (if not dispatched)

##### 📥 Receiver APIs Endpoints
- `GET /api/v1/parcel/incoming-parcels` — View parcels assigned to receiver
- `PATCH /api/v1/parcel/confirm-delivery/:id` — Confirm delivery of parcel
- `GET /api/v1/parcel/delivery-history` — View past delivered/received parcels

#### 🛠 Admin APIs Endpoints
- `GET /api/v1/user/all-parcels` — View all parcels in system
- `GET /api/v1/user/all-users` — View all users in system
- `PATCH /api/v1/user/update-parcel-status/:id` — Update parcel delivery status
- `PATCH api/v1/user/block/:id` — Block  a user
- `PATCH api/v1/user/unblock/:id` — Unblock a user

#### 📦 Parcel Status & Tracking
- `GET /api/parcels/:id` — Get full details and tracking history of a parcel
- `GET /api/parcels/track/:trackingId` — Track parcel by public tracking ID

---

#### 📦 Live Link


🔗 View the Source Code :  [Gir Repository](https://github.com/Sakebul-islam/courier-lab-backend)
<br/>
🌍 Test the Live API: [Courier Lab API](https://courier-lab-backend.vercel.app/)

