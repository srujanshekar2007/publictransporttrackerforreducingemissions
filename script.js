// Indian cities with distances and bus schedules (40 seats fixed, 12hr format)
const busData = {
    'Delhi-Mumbai': {
        distance: 1420,
        buses: [
            { time: '06:30 AM', duration: '22h' },
            { time: '09:00 AM', duration: '20h' },
            { time: '11:30 PM', duration: '19h' },
            { time: '02:15 AM', duration: '21h' }
        ]
    },
    'Delhi-Bangalore': {
        distance: 2150,
        buses: [
            { time: '05:45 AM', duration: '36h' },
            { time: '08:30 PM', duration: '34h' }
        ]
    },
    'Delhi-Chennai': {
        distance: 2200,
        buses: [
            { time: '07:00 AM', duration: '38h' },
            { time: '10:00 PM', duration: '36h' }
        ]
    },
    'Delhi-Kolkata': {
        distance: 1300,
        buses: [
            { time: '06:00 AM', duration: '20h' },
            { time: '04:30 PM', duration: '19h' },
            { time: '11:00 PM', duration: '18h' }
        ]
    },
    'Delhi-Hyderabad': {
        distance: 1600,
        buses: [
            { time: '08:00 AM', duration: '26h' },
            { time: '09:30 PM', duration: '24h' }
        ]
    },
    'Delhi-Pune': {
        distance: 1500,
        buses: [
            { time: '07:30 AM', duration: '24h' },
            { time: '05:00 PM', duration: '23h' }
        ]
    },
    'Delhi-Ahmedabad': {
        distance: 900,
        buses: [
            { time: '06:15 AM', duration: '15h' },
            { time: '03:00 PM', duration: '14h' },
            { time: '10:45 PM', duration: '13h' }
        ]
    },
    'Delhi-Jaipur': {
        distance: 270,
        buses: [
            { time: '05:00 AM', duration: '5h 30m' },
            { time: '09:00 AM', duration: '5h' },
            { time: '02:00 PM', duration: '5h 15m' },
            { time: '08:30 PM', duration: '5h' }
        ]
    },
    'Mumbai-Bangalore': {
        distance: 840,
        buses: [
            { time: '06:45 AM', duration: '14h' },
            { time: '09:30 PM', duration: '13h' }
        ]
    },
    'Mumbai-Pune': {
        distance: 150,
        buses: [
            { time: '05:30 AM', duration: '3h 30m' },
            { time: '08:00 AM', duration: '3h' },
            { time: '12:00 PM', duration: '3h 15m' },
            { time: '06:00 PM', duration: '3h' },
            { time: '10:30 PM', duration: '3h 30m' }
        ]
    }
};

// Emission factors (kg CO2 per km per passenger)
const EMISSION_FACTORS = {
    bus: 0.08,        // Per passenger for bus (40 passengers)
    car: 0.19         // Average car per passenger
};

// Initialize selectors
document.addEventListener('DOMContentLoaded', function() {
    const sourceSelect = document.getElementById('sourceCity');
    const destSelect = document.getElementById('destCity');
    const calculateBtn = document.getElementById('calculateBtn');

    sourceSelect.addEventListener('change', toggleCalculateBtn);
    destSelect.addEventListener('change', toggleCalculateBtn);
});

function toggleCalculateBtn() {
    const source = document.getElementById('sourceCity').value;
    const dest = document.getElementById('destCity').value;
    const btn = document.getElementById('calculateBtn');
    
    btn.disabled = !source || !dest || source === dest;
}

function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show target page
    document.getElementById(pageId).classList.add('active');
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Show calculation info modal
function showCalculationInfo() {
    document.getElementById('calcModal').classList.add('active');
}

// Close calculation info modal
function closeCalculationInfo() {
    document.getElementById('calcModal').classList.remove('active');
}

// Close modal when clicking outside
document.addEventListener('click', function(e) {
    const modal = document.getElementById('calcModal');
    if (e.target === modal) {
        closeCalculationInfo();
    }
});

function calculateJourney() {
    const source = document.getElementById('sourceCity').value;
    const dest = document.getElementById('destCity').value;
    
    if (!source || !dest || source === dest) return;
    
    const routeKey = source < dest ? `${source}-${dest}` : `${dest}-${source}`;
    const routeData = busData[routeKey] || {
        distance: 500,
        buses: [{ time: 'No buses', duration: 'N/A' }]
    };
    
    const { distance, buses } = routeData;
    
    // Calculate emissions (per passenger)
    const busCO2 = (distance * EMISSION_FACTORS.bus).toFixed(1);
    const carCO2 = (distance * EMISSION_FACTORS.car).toFixed(1);
    const savingsPercent = ((carCO2 - busCO2) / carCO2 * 100).toFixed(0);
    const treesSaved = Math.round((carCO2 - busCO2) / 20); // 1 tree absorbs ~20kg CO2/year
    const travelTime = Math.round(distance / 60); // hours
    
    // Update UI
    document.getElementById('routeTitle').textContent = `${source} → ${dest}`;
    document.getElementById('distanceDisplay').textContent = `${distance} km`;
    document.getElementById('publicCO2').textContent = `${busCO2} kg`;
    document.getElementById('privateCO2').textContent = `${carCO2} kg`;
    document.getElementById('savings').textContent = `${savingsPercent}%`;
    document.getElementById('treesSaved').textContent = `${treesSaved}`;
    document.getElementById('travelTime').textContent = `${travelTime}h`;
    
    // Populate bus schedule (40 seats fixed)
    const busScheduleEl = document.getElementById('busSchedule');
    busScheduleEl.innerHTML = '';
    
    buses.forEach(bus => {
        const busCard = document.createElement('div');
        busCard.className = 'bus-card';
        busCard.innerHTML = `
            <div class="bus-time">${bus.time}</div>
            <div class="bus-details">${bus.duration} | 40 seats</div>
        `;
        busScheduleEl.appendChild(busCard);
    });
    
    showPage('resultsPage');
}

// Prevent Enter key form submission
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && document.activeElement.tagName === 'SELECT') {
        e.preventDefault();
    }
    
    // Close modal with Escape key
    if (e.key === 'Escape') {
        closeCalculationInfo();
    }
});
