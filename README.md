*♿ Immersive Accessibility Simulator*

An interactive VR/AR web application built with A-Frame
 to simulate real-world environments (hospital rooms, grocery stores, public spaces, etc.) for people with physical disabilities.

This app provides adaptive, inclusive, and safe practice environments that promote independence, confidence, and social participation.

📌 Problem Statement (DSMN 4)

People with physical disabilities often face barriers in:

Accessing public spaces

Attending social events

Performing daily activities

Current accessibility solutions are frequently inadequate, resulting in reduced independence, confidence, and well-being.

👉 Our solution creates immersive, realistic environments that simulate daily challenges and enable safe training, rehabilitation, and empowerment.

🎯 Goals

🏙 Realistic VR Scenarios → Practice daily tasks in immersive environments

🧭 Adaptive Navigation → Wheelchair-friendly, gaze-based, and WASD controls

🛡 Safe Practice → Simulations without real-world risks

📊 Progress Tracking → Task completion, interaction metrics, and skill growth

🌍 Social Inclusion → Foster independence, equity, and empowerment

🏗 Features

✨ Core

🌍 Scenario Library (Hospital, Grocery Store, Social Events, etc.)

🎮 Immersive VR/AR Environments (A-Frame + WebXR)

🧭 Accessible Navigation (keyboard, cursor, or gaze interaction)

📊 Tracking & Personalization

Progress Metrics (time, completion, errors)

Adaptive AI Personalization (future integration)

⚙ Assistive Integration

Wheelchairs, prosthetics, smart mobility aids

Wearable sensors for motion tracking (future scope)

🎲 Engagement

Gamification (points, badges, challenges)

Scenario difficulty levels

📂 Project Structure
project-root/
│── index.html              # Dashboard (landing page)
│── scenarios/
│   ├── hospital.html       # Hospital room scenario
│   ├── grocery.html        # Grocery store scenario
│   └── ...other scenarios
│── assets/                 # Models, textures, sounds
│── css/
│   └── style.css           # Custom styling
│── js/
│   └── app.js              # Navigation + logic
│── README.md               # Documentation

⚙️ Tech Stack

🕶 A-Frame – VR/AR Web Framework

🌐 HTML5 / CSS3 / JavaScript

🖼 3D Models – GLTF/GLB for realistic assets

♿ Accessibility Standards – ADA, WCAG compliance

🤖 (Planned) AI/ML for adaptive difficulty

🚀 Getting Started

Clone the repo

git clone https://github.com/yourusername/immersive-accessibility-simulator.git
cd immersive-accessibility-simulator


Open the app

Open index.html in a modern browser (Chrome, Firefox).

Use the dashboard to pick a scenario.

Navigation Controls

WASD keys → Move around

Mouse / Cursor → Look and interact

VR Headset (WebXR) → Fully immersive mode

🔮 Future Roadmap

 Multiplayer VR for collaboration

 Wearable sensor integration (motion tracking)

 Expanded scenario library (transport, office, events)

 Therapist/caregiver remote monitoring dashboard

 Mobile AR/WebXR compatibility
