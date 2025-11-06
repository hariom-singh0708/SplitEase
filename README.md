Here’s a clean, professional, and attractive **README.md** for your **SplitEase** app 👇

---

# 💸 SplitEase

**SplitEase** is a smart and intuitive **expense-splitting web app** built using the **MERN stack** (MongoDB, Express, React, Node.js).
It helps friends, families, and teams **track shared expenses**, **split bills fairly**, and **settle balances** — all in one place.

---

## 🚀 Features

* 🧾 **Add & Manage Expenses** – Log expenses for individuals or groups with ease.
* 👥 **Group Expense Tracking** – Create groups and manage shared costs transparently.
* 📊 **Fair Split Calculation** – Automatically calculates who owes whom and how much.
* 💰 **Take / Give Money** – Track personal transactions to keep everything balanced.
* 🧩 **Collapsible Group Cards** – Expandable group views with inline animations.
* 🖼️ **Member Avatars with Initials** – Clean, modern interface to visualize participants.
* 🔐 **Secure Authentication** – User sign-up, login, and logout using JWT.
* 🧭 **Floating Action Button (FAB)** – Quick access to add expenses or create groups.
* 🌙 **Responsive & Modern UI** – Built with React + Bootstrap for a smooth experience.

---

## 🛠️ Tech Stack

**Frontend:** React (Vite), Bootstrap, Axios
**Backend:** Node.js, Express.js
**Database:** MongoDB (Mongoose ODM)
**Authentication:** JSON Web Tokens (JWT)
**Deployment:** Render / Vercel / MongoDB Atlas

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/hariom-singh0708/SplitEase.git
cd splitease
```

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

Then start the server:

```bash
npm start
```

### 3️⃣ Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```

---

## 🧭 Folder Structure

```
SplitEase/
│
├── backend/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── server.js
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── services/
│   │   └── App.jsx
│   └── vite.config.js
│
└── README.md
```

---

## 🔒 Environment Variables

| Variable     | Description                   |
| ------------ | ----------------------------- |
| `PORT`       | Server running port           |
| `MONGO_URI`  | MongoDB connection string     |
| `JWT_SECRET` | Secret key for authentication |
| `NODE_ENV`   | development / production      |


## 🌍 Deployment

For production, set:

```
NODE_ENV=production
```

Then deploy:

* Frontend → Vercel / Netlify
* Backend → Render / Railway
* Database → MongoDB Atlas

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to open a PR or report a bug.

---

## 🧑‍💻 Author

Hariom Singh
📧 [hs285065@gmail.com]
💻 [GitHub Profile](https://github.com/hariom-singh0708)

---
