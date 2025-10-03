# 🌤️ Weatherish - AI-Powered Weather Event Planner

[![NASA Space Apps Challenge 2025](https://img.shields.io/badge/NASA-Space%20Apps%20Challenge-blue)](https://www.spaceappschallenge.org/)
[![Built with React](https://img.shields.io/badge/Built%20with-React-61DAFB?logo=react)](https://reactjs.org/)
[![Powered by NASA Data](https://img.shields.io/badge/Powered%20by-NASA%20Data-red)](https://power.larc.nasa.gov/)

> Plan outdoor events with confidence using 25+ years of NASA Earth observation data
<img width="1887" height="875" alt="Screenshot 2025-10-03 150027" src="https://github.com/user-attachments/assets/7e203b28-03e4-4e8a-b74f-305269a23fba" />
<img width="1868" height="857" alt="Screenshot 2025-10-03 150204" src="https://github.com/user-attachments/assets/837868e3-797e-4cad-a700-93b894d2b1a2" />
<img width="1880" height="885" alt="image" src="https://github.com/user-attachments/assets/23b57e63-e77c-44ab-97ae-7525d5d2c384" />

---

## 🚀 Project Overview

**Weatherish** is an intelligent weather analysis platform that helps users plan outdoor events by providing data-driven insights into weather patterns and probabilities. Built for the NASA Space Apps Challenge 2025, it transforms complex climate data into actionable recommendations.

### The Problem We're Solving

Every year, outdoor events worth millions of dollars are disrupted by unexpected weather. From weddings to concerts, hiking trips to festivals—poor weather planning leads to:
- 💸 Financial losses
- 😞 Disappointed attendees  
- ⚠️ Safety risks
- 📉 Wasted resources

**Weatherish** empowers users to make informed decisions by analyzing historical weather patterns and providing probability-based forecasts.

---

## ✨ Key Features

### 🗺️ Interactive Location Selection
- **Pin-drop interface** on an interactive map
- Reverse geocoding for automatic location identification
- Support for any location worldwide

### 📅 Flexible Date Analysis
- Select specific dates or date ranges
- "Day of year" analysis (e.g., "every July 15th for the past 25 years")
- Multi-day event planning support

### 📊 Comprehensive Weather Parameters
- **Temperature** (min/max/average with custom thresholds)
- **Precipitation** (probability of rain/heavy rain)
- **Wind Speed** (calm vs. high wind likelihood)
- **Humidity** (comfort level analysis)
- **Air Quality** (safety considerations) {coming soon}

### 📈 Advanced Data Visualization
- Historical trend line charts
- Probability distribution graphs
- Threshold exceedance indicators
- Auto-generated text summaries

### 🤖 AI Weather Chatbot
- Natural language query support
- Context-aware responses based on your selection
- Conversational weather insights
- Data-backed recommendations {comming soon}

### 💾 Data Export
- Download complete analysis as **CSV** or **JSON**
- Includes metadata, units, and data source attribution
- Perfect for sharing with teams or stakeholders

---

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Leaflet.js** - Interactive maps
- **Recharts** - Data visualization
- **Lucide React** - Icons
- **shadcn-ui**


### Data Sources
- **NASA POWER API** - Primary meteorological data
- **GES DISC OPeNDAP** - Advanced climate datasets
- **Giovanni** - Time-series analysis
- **Worldview** - Satellite imagery

### AI Integration
- **Gemini 2.5** - Chatbot intelligence
- Custom weather analysis prompts

---

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ and npm/yarn
- API keys (see Configuration section)

### Quick Start
```bash
# Clone the repository
git clone https://github.com/Reginavincenza/Weatherish-by-CAELICA.git
cd weatherish

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Add your API keys to .env
# VITE_GEMINIAI_API_KEY=your_key_here
# VITE_NASA_API_KEY=your_key_here (optional)

# Start development server
npm run dev
```


**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

### Getting API Keys
OpenAI API: platform.openai.com
NASA API: api.nasa.gov (free tier available)
Mapbox: mapbox.com (optional, for enhanced maps)


### 🎯 How to Use
**1. Select Your Location**

- Click anywhere on the map to drop a pin
- Or search for a location using the search bar
- The app will display coordinates and location name

**2. Choose Your Date**

- Pick a specific date for your event
- Or select "Analyze by Day of Year" for historical patterns
- Set a date range for multi-day events

**3. Configure Weather Parameters**

- Check the weather variables you care about
- Set custom thresholds (e.g., "if temp > 35°C")
- Select your preferred units (Celsius/Fahrenheit, mm/inches) {not available now}

**4. Analyze & Visualize**

- Click "Analyze Weather" to fetch NASA data
- View interactive charts and statistics
- Read auto-generated summaries

**5. Chat with AI Assistant**

Ask questions like:
"Is it safe to hike here in July?"
"What's the probability of rain?"
"Compare this to last year"

**6. Export Your Data**

- Download CSV for spreadsheet analysis {not available now}
- Or JSON for programmatic use
- All exports include metadata and data sources

**Demo Live Link**
Project demo live link: https://weatherish.lovable.app/



### 👥 **Team CAELICA**
**Meet the team behind Weatherish:**

Tahera Toor - Designer, Backend Developer - @Reginavincenza
Tasmiah Abrar Farah - UI Designer, Frontend Developer - @github
Samia Rahman - Data Scientist - @github
Noor-E-Jannat - AI/ML Engineer - @github


### ** Acknowledgments**
NASA for providing open Earth observation data
Space Apps Challenge for inspiring this project
Anthropic for AI capabilities
Lovable for their Loveable designs
Leaflet.js community for mapping tools

