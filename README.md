# 🍔 FoodSnap - Smart Restaurant Recommender

FoodSnap is a full-stack restaurant recommendation system similar to Zomato, with an intelligent twist. It includes a feature where users can upload a food image, and the app analyzes it using Google Generative AI to identify the cuisine and return relevant nearby restaurants serving it. The backend is built with **Node.js**, **Express**, and **MongoDB**, and supports pagination and geo-location filtering using latitude and longitude.

---

## 🌟 Features

- 🔍 **Search Restaurants by Cuisine**
- 🧠 **AI Image Analysis**: Upload a food image and find matching restaurants.
- 🌍 **Location-Based Filtering**: Get results within a specific distance from your coordinates.
- 📄 **Pagination**: Results are paginated to improve performance and user experience.
- 💾 **Multer File Upload Support**
- 🔐 **Secure API Keys via `.env`**

---

## 📦 Tech Stack

- **Backend**: Node.js, Express
- **Database**: MongoDB (Mongoose ODM)
- **AI Integration**: Google Generative AI (Gemini)
- **File Upload**: Multer
- **Environment Management**: dotenv
- **Distance Calculation**: Haversine Formula
- **Frontend**: (You can connect your React, Vue, or other frontend here)

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/foodsnap.git
cd foodsnap
/models
  └── user.model.js          # Mongoose Schema
/uploads                     # Image uploads (temp storage)
index.js                     # Main server file
.env                         # Environment variables
🙌 Acknowledgements
Google Generative AI

Multer

Zomato Dataset

📬 Contact
For queries or suggestions:

📧 uyyuruhimasaitej@gmail.com

