AquaSentinal — MVP + Mapping Feature

1. What are we building?

AquaSentinal – Smart Water Usage Tracker is a software prototype for monitoring water usage in PGs, hostels, apartments, and other shared housing.

The first version is software-only. Instead of connecting real IoT sensors, the prototype uses a sensor simulator to generate realistic water readings.

The main demo flow is:

Login → Dashboard → Monitor Water → Simulate Problem → Detect Alert → Show Notification → Resolve Alert

A future hardware version can replace the simulator with ESP32-based flow, level, leak, and overflow sensors.

2. MVP Meaning

MVP = Minimum Viable Product.

It does NOT mean building every possible feature.

It means building the smallest working version that proves the main idea.

For AquaSentinal, the MVP should answer:

Can our software monitor simulated water data, identify abnormal conditions, show the problem clearly, and help a PG/hostel owner understand what is happening?

If yes, the core idea has been demonstrated.

3. AquaSentinal MVP

A. Login

Create three demo roles:

Owner

Resident

Admin

For the first prototype, demo accounts are enough.

B. Owner Dashboard

The owner should immediately see:

Today's water consumption

Current tank level

Current flow rate

Estimated cost

Water saved

Active alerts

Also show:

7-day water usage chart

Recent alerts

Sensor status

Example:

Today's Usage       1,240 L
Tank Level             72%
Flow Rate            4.2 L/min
Active Alerts             2

4. Core MVP Feature — Sensor Simulation

Because we are not using physical hardware yet, create a Sensor Simulator.

The owner can click:

Normal
Simulate Leak
Simulate Overflow
Simulate High Usage
Simulate Low Tank
Sensor Offline

For example:

Simulate Leak

The system generates:

Flow rate: 8.5 L/min
Leak: Detected
Tank level: decreasing

Then the backend creates:

LEAK ALERT
Continuous abnormal flow detected.
Estimated water waste: 185 L

The dashboard updates automatically.

This makes the prototype behave like an IoT system even though the physical sensor is not connected yet.

5. Alerts

The MVP should automatically generate alerts for:

Situation

Alert

Continuous abnormal flow

Leak

Tank ≥ 95%

Overflow

Unusually high consumption

High Usage

Tank ≤ 20%

Low Tank

Sensor stops reporting

Sensor Offline

Each alert should contain:

Alert type

Severity

Message

Time

Estimated water waste

Status

Resolve button

6. Notifications

When an alert is generated:

🔴 Possible Leak Detected

Continuous abnormal flow detected.

Estimated waste:
185 L

The owner receives an in-app notification.

The notification badge should update automatically.

7. Monitoring Page

The monitoring page gives a more detailed view of the current water system.

Display:

Tank Level
██████████████░░░░ 72%

Flow Rate
4.2 L/min

Leak Sensor
NORMAL

Overflow Sensor
NORMAL

Connection
ONLINE

The simulator controls should be available on this page.

8. Analytics

The MVP only needs basic analytics.

Include:

Daily water usage

7-day usage

Hourly usage

Average daily usage

Highest usage

Lowest usage

Use charts.

Do not build advanced predictive analytics in the first version.

9. Resident Dashboard

The resident should see:

Personal water usage

Daily usage

Weekly usage

Monthly usage

PG average

Example:

Your usage       38 L
PG average       42 L

Weekly average   41 L/day

This is informational and should not shame or rank residents.

10. Mapping Feature

Why add mapping?

The mapping feature gives the system a geographical view of monitored properties.

Instead of only seeing:

Green Valley PG
Water usage: 1,240 L

the owner/admin can see where the monitored property is located on a map.

For the MVP, mapping should be kept simple.

11. MVP Map Page

Create:

/map

The page should contain an interactive map.

Each monitored property appears as a marker.

Example:

                 MAP

        📍 PG A
              \
               \
                📍 PG B

      📍 PG C

Clicking a marker opens:

Green Valley PG

Tank Level: 72%
Today's Usage: 1,240 L
Active Alerts: 2
Sensor Status: Online

[View Dashboard]

12. Map Marker States

Use marker status to make the map useful.

Green

Normal property.

🟢 Green Valley PG

Yellow

Warning condition.

🟡 Sunrise Hostel
High water usage

Red

Critical condition.

🔴 Royal PG
Possible leakage

Gray

Sensor/property offline.

⚪ City View PG
Sensor offline

The map therefore becomes a quick way to identify where attention may be required.

13. Map MVP Data

Add these fields to the properties table:

latitude
longitude

Example:

Green Valley PG
latitude: 12.9141
longitude: 74.8560

The values are only demo coordinates for the prototype unless actual property coordinates are intentionally provided.

14. Map Database Structure

Update the properties table:

properties

id
name
address
city
latitude
longitude
owner_id
tank_capacity
water_tariff
created_at
updated_at

The map does not need a separate database table for basic property markers.

The map obtains locations from:

properties
     ↓
latitude + longitude
     ↓
Map

15. Map + Alert Integration

This is where the mapping feature becomes useful.

Suppose:

Green Valley PG
Status: Normal

The marker is green.

Then the simulator detects:

Leak detected

The property status changes:

Green → Red

The map marker becomes red.

Clicking it shows:

🔴 Green Valley PG

Possible Leak

Water wasted:
185 L

Detected:
2:15 AM

[View Alert]
[Open Dashboard]

This connects the map directly to the water-monitoring system.

16. Map for Admin

The admin can see all monitored properties.

Example:

Properties: 125
Normal: 103
Warnings: 14
Critical: 8
Offline: 0

The map shows all properties.

This is an MVP visualization, not a claim that the prototype represents actual city-wide infrastructure.

17. Recommended MVP Pages

Do NOT build every page from the beginning.

Build these first:

/
Landing

/login
Login

/owner/dashboard
Owner Dashboard

/owner/monitoring
Water Monitoring + Simulator

/owner/alerts
Alerts

/owner/analytics
Analytics

/map
Property Map

/resident/dashboard
Resident Dashboard

These pages are enough to demonstrate the main concept.

18. Features to Leave for Later

These are useful but should NOT delay the MVP:

Real ESP32 hardware

Real-time GPS hardware

SMS alerts

WhatsApp alerts

Machine-learning prediction

Automatic water-demand forecasting

Advanced leak prediction

City-wide deployment

Advanced GIS layers

Satellite/weather data

Complex billing/payment system

Mobile application

Multi-property enterprise management

Build them only after the basic prototype works.

19. MVP Architecture

                  USER
                   ↓
              React Frontend
                   ↓
              Express API
                   ↓
             PostgreSQL/Supabase
                   ↑
                   │
          Sensor Simulator
                   │
          ┌────────┼────────┐
          ↓        ↓        ↓
       Flow      Level     Leak
       Data      Data     Status
                   │
                   ↓
             Alert Engine
                   ↓
            Notifications
                   ↓
              Dashboard
                   │
                   ↓
                 Map

20. Map Architecture

Properties Table
       │
       ├── name
       ├── latitude
       ├── longitude
       └── status
              │
              ↓
        Map Component
              │
       ┌──────┼──────┐
       ↓      ↓      ↓
      🟢     🟡     🔴
    Normal  Warning Critical
       │      │      │
       └──────┼──────┘
              ↓
        Property Popup
              ↓
        View Dashboard

21. Final MVP Demo

For your presentation, demonstrate this sequence:

Step 1

Login as the owner.

Step 2

Show the dashboard.

Explain:

"This dashboard gives the property owner a quick overview of current water consumption, tank level, flow rate and active alerts."

Step 3

Open Monitoring.

Show the simulated sensor readings.

Step 4

Click:

Simulate Leak

Step 5

Show that:

Flow changes

Leak status changes

Alert is created

Notification appears

Dashboard updates

Step 6

Open the Map.

Show that the property's marker has changed from:

🟢 Normal

to:

🔴 Critical

Step 7

Click the marker.

Show:

Green Valley PG
Possible Leak
Estimated Waste: 185 L

[View Alert]

Step 8

Open Analytics.

Show how the incident appears in the usage data.

Step 9

Resolve the alert.

The property returns to:

🟢 Normal

This gives you a complete story:

Monitor → Detect → Alert → Locate → Investigate → Resolve

22. Final MVP Definition

The AquaSentinal MVP consists of:

Role-based login

Owner dashboard

Water monitoring

Simulated IoT sensor data

Leak detection

Overflow detection

High-usage detection

Low-tank detection

Sensor-offline detection

Automatic alerts

Notifications

Basic analytics

Resident usage dashboard

Interactive property map

Map-based alert status

Property popup with monitoring information

The map is not a separate unrelated feature. Its purpose is to connect water-monitoring events with the physical location of the monitored property.

The complete MVP story is:

Water data → Detection → Alert → Location → Action.

23. Technology for Mapping

For the prototype, use:

Leaflet + OpenStreetMap

This avoids requiring a paid map platform for the basic prototype.

Frontend:

React
+
React-Leaflet
+
OpenStreetMap

Database:

properties
 ├── latitude
 └── longitude

Later, if the project grows, you can consider more advanced mapping/GIS functionality.