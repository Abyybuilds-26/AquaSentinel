# 💧 AquaSentinal – Smart Water Usage Tracker

**A Smart Water Monitoring and Management System for Shared Living Spaces**

AquaSentinal is a software-based water monitoring prototype designed for PGs, hostels, apartments, and other shared residential spaces. It aims to help property owners monitor water consumption, identify abnormal usage, detect possible leaks and overflow conditions, and manage water resources more efficiently.

The prototype uses simulated IoT sensor readings to demonstrate real-time water monitoring and automated alert generation without requiring physical hardware.

---

## 🎯 Project Objective

The primary objective of AquaSentinal is to develop a smart water management solution that:

- Monitors water consumption and tank levels.
- Identifies abnormal water usage patterns.
- Detects possible leakage and overflow conditions.
- Generates automated alerts and notifications.
- Provides water usage analytics and reports.
- Displays monitored properties on an interactive map.

## ✨ Key Features

### 1. Role-Based Authentication
Three user roles are planned:

- **Owner:** Monitors water usage, manages alerts, and views property analytics.
- **Resident:** Views personal water consumption and usage statistics.
- **Admin:** Monitors multiple properties and their overall status.

### 2. Smart Dashboard
The owner dashboard provides an overview of:

- Today's water consumption.
- Current tank level.
- Water flow rate.
- Estimated water cost.
- Water saved.
- Active alerts.
- Seven-day water consumption trends.
- Sensor connection status.

### 3. IoT Sensor Simulation

Since the initial prototype does not require physical sensors, a sensor simulator generates sample water readings.

Available simulation scenarios include:

- Normal Operation
- Simulate Leak
- Simulate Overflow
- Simulate High Usage
- Simulate Low Tank Level
- Sensor Offline

These scenarios demonstrate how the application responds to different water-system conditions.

### 4. Automated Alert Management

The system is designed to identify abnormal conditions and generate corresponding alerts.

| Condition | Generated Alert |
|---|---|
| Continuous abnormal water flow | Leak Detected |
| Tank level ≥ 95% | Overflow |
| Unusually high consumption | High Usage |
| Tank level ≤ 20% | Low Tank |
| Sensor stops reporting | Sensor Offline |

Each alert includes its type, severity, message, timestamp, estimated water waste, and resolution status.

### 5. Notifications

In-app notifications inform property owners about detected water-related problems.

The notification system is designed to display alert information and update notification indicators when new alerts are generated.

### 6. Water Monitoring

The monitoring interface provides detailed information about:

- Tank level.
- Water flow rate.
- Leak sensor status.
- Overflow sensor status.
- Sensor connection status.

It also provides controls for testing different simulated sensor conditions.

### 7. Water Usage Analytics

The analytics module provides visual representations of water consumption, including:

- Daily water usage.
- Seven-day water usage.
- Hourly consumption.
- Average daily usage.
- Highest usage.
- Lowest usage.

### 8. Resident Dashboard

Residents can view their personal water consumption and compare it with the average consumption of the property.

The dashboard includes daily, weekly, and monthly usage information.

### 9. Interactive Property Mapping

AquaSentinal includes a geographical visualization of monitored properties using:

- Leaflet
- React-Leaflet
- OpenStreetMap

Each monitored property is represented by a map marker.

**Map marker indicators:**

| Marker | Property Status |
|---|---|
| 🟢 Green | Normal |
| 🟡 Yellow | Warning |
| 🔴 Red | Critical |
| ⚪ Gray | Offline |

Clicking a property marker displays its monitoring information, including tank level, daily water consumption, active alerts, and sensor status.

The map also connects property locations with alert conditions, helping administrators identify properties that require attention.

---

## 🏗️ System Architecture

The proposed system follows a frontend-backend-database architecture.

```text
                 USER
                   |
                   v
             React Frontend
                   |
                   v
               Express API
                   |
                   v
          PostgreSQL / Supabase
                   ^
                   |
            Sensor Simulator
                   |
          +--------+--------+
          |        |        |
        Flow     Level     Leak
        Data     Data     Status
                   |
                   v
              Alert Engine
                   |
                   v
              Notifications
                   |
                   v
               Dashboard
                   |
                   v
             Property Map
```

### Mapping Architecture

```text
          Properties Database
                   |
          Latitude + Longitude
                   |
                   v
              Map Component
                   |
          +--------+--------+
          |        |        |
        Normal  Warning  Critical
          |        |        |
          +--------+--------+
                   |
                   v
             Property Popup
                   |
                   v
             View Dashboard
```

---

## 🛠️ Technology Stack

| Component | Technology |
|---|---|
| Frontend |
