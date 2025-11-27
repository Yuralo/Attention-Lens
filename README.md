# 🔍 Attention-Lens

<div align="center">

**A Modern Interactive Visualization Tool for Mechanistic Interpretability**

[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![React](https://img.shields.io/badge/React-18+-61DAFB.svg)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688.svg)](https://fastapi.tiangolo.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

*Explore the inner workings of transformer models through beautiful, interactive visualizations*

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Usage](#-usage) • [Documentation](#-documentation)

</div>

---

## ✨ Features

### 🎯 Core Visualizations

- **Token Predictions** - Interactive bar charts and detailed breakdowns of next-token probabilities
- **Attention Patterns** - Heatmap visualizations of multi-head attention mechanisms
- **Embedding Space** - 2D PCA projections of token embeddings with interactive scatter plots
- **Weight Analysis** - Singular value decomposition of attention head OV circuits

### 🚀 Advanced Interpretability

- **Interactive Token Sequence** - Hover over tokens to see model predictions and top-k alternatives
- **Eigenvalue Analysis** - Analyze attention matrix eigenvalue spectra to identify specialized vs. general heads
- **In-Context Learning Detection** - Automatically detect copying heads and induction heads
- **Logit Lens** - Track how predictions evolve through the model's computation

### 🎨 Modern UI/UX

- **Dark Theme** - Refined dark color palette optimized for readability
- **Responsive Design** - Works seamlessly across different screen sizes
- **Interactive Charts** - Built with Recharts for smooth, modern visualizations
- **Special Token Handling** - Proper display of newlines (↵), spaces (·), and tabs (→)

---

## 📋 Prerequisites

- **Python 3.8+**
- **Node.js 16+** and npm
- **Git**

---

## 🛠️ Installation

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Yuralo/Attention-Lens.git
cd Attention-Lens
```

### 2️⃣ Backend Setup

```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 3️⃣ Frontend Setup

```bash
cd frontend

# Install dependencies
npm install
```

### 4️⃣ Model Weights

Weight file is `one_layer_transformer.pth` is coming soon.

---

## 🚀 Usage

### Start the Backend Server

```bash
cd backend
source venv/bin/activate
uvicorn main:app --reload --port 4000
```

The API will be available at `http://localhost:4000`

### Start the Frontend Development Server

```bash
cd frontend
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
cd frontend
npm run build
```

---

## 📚 API Endpoints

### Basic Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/predict` | POST | Get next token predictions |
| `/attention` | POST | Get attention patterns |
| `/embeddings` | GET | Get PCA of embeddings |
| `/activations` | POST | Get internal activations |
| `/weights` | GET | Get singular value analysis |
| `/analogy` | POST | Perform vector arithmetic |

### Advanced Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/token-predictions` | POST | Per-token predictions with top-k |
| `/eigenvalues` | POST | Eigenvalue analysis of attention patterns |
| `/induction-score` | POST | Detect in-context learning behaviors |
| `/logit-lens` | POST | Track prediction evolution |

---

## 🏗️ Project Structure

```
Attention-Lens/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── model.py             # Transformer model definition
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/      # React visualization components
│   │   ├── api.js          # API client
│   │   ├── App.jsx         # Main application
│   │   └── index.css       # Custom styles
│   └── package.json        # Node dependencies
└── README.md
```

---

## 🎨 Visualization Components

### Token Prediction
Dual-view visualization with bar charts and interactive lists showing next-token probabilities.

### Attention Map
Interactive heatmap matrix with head selection and hover tooltips showing attention weights.

### Embedding Space
2D scatter plot of token embeddings using PCA, with color-coded clusters.

### Weight Analysis
Line charts showing singular value spectra for each attention head.

### Vector Arithmetic
Interactive equation builder for word analogies (e.g., "king" - "man" + "woman" = "queen").

### In-Context Learning
Automatic detection and visualization of copying heads and induction heads.

### Logit Lens
Compare predictions before and after attention to understand model computation.

---

## 🔧 Configuration

### Backend Port

To change the backend port, modify the `--port` parameter:

```bash
uvicorn main:app --reload --port YOUR_PORT
```

And update `frontend/src/api.js`:

```javascript
const API_URL = 'http://localhost:YOUR_PORT';
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
