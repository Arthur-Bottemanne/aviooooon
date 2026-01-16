**1. Why choose this API?**

FastAPI was chosen for the following reasons:

**1.1 Simplicity and readability of the code**

FastAPI allows HTTP routes to be defined in a very clear and concise manner. This makes it easier to understand the code, maintain the project, and work as a team.


**2.1 Clear separation of responsibilities**

FastAPI encourages an architecture where:

main.py only manages routes and HTTP exchanges,

calculations (moon position, aircraft, alerts) are separated into independent modules.
This separation directly corresponds to the requirements of the specifications concerning modularity and separation of functionalities.


**3.1 Native JSON format adapted to the project**

The data produced by the project (azimuth, elevation, phase, aircraft positions) is naturally represented in JSON format, which is natively supported by FastAPI and easily usable on the frontend.

**4.1 Integrated automatic documentation**

astAPI automatically generates interactive documentation (Swagger UI). This facilitates:

manual testing during development,

understanding of endpoints by group members,

demonstration of the project during the defence.


**5.1 Lightweight and modern framework**
FastAPI is lighter than solutions such as Django and better suited to a limited-duration academic project. It allows you to focus on business logic (calculations, prediction) rather than configuration.


**2. Calculation solution: Skyfield Library**
For calculating the moon's position, we chose Skyfield rather than older libraries such as PyEphem:

-Accuracy: Its results correspond exactly to the data in the Astronomical Almanac of the Bureau of Ephemerides.

-Modernity: It does not depend on complex C libraries (such as libastro), which makes installation via requirements.txt very stable on any machine.

-Time management: It natively handles the complex time scales (UTC, TAI, TT) needed to accurately synchronise the position of celestial bodies.


**3. Data source: DE421.bsp ephemeris file**

The choice of the DE421 file (NASA/JPL Development Ephemeris) is justified by:

Industry standard: It is the reference model used by the Jet Propulsion Laboratory for current space missions.

Weight/Accuracy trade-off: At around 14 MB, it is light enough to be integrated into a web project while offering millimetre accuracy for the position of the Moon over a period covering 1900 to 2050.

Renaming and Storage: Storage in a /data folder avoids repeated downloads, thus optimising the API response time.