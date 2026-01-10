class ThemeManager {
    constructor() {
        this.currentSeason = null;
        this.currentWeather = null;
        this.isWeatherEnabled = false;
        this.weatherFallbackTimeout = 3000; // 3 seconds timeout for weather API
        this.lastWeatherUpdate = null;
        this.weatherCacheTime = 30 * 60 * 1000; // 30 minutes cache
        this.seasonalThemesEnabled = localStorage.getItem('seasonal-themes') !== 'false'; // Default to enabled
        this.updateInterval = null; // Store interval reference
        this.toggleButtonCreated = false; // Track if toggle button exists
        
        this.init();
        
        // Only create toggle button once
        if (!this.toggleButtonCreated && !document.querySelector('.seasonal-toggle')) {
            this.createSeasonalToggle();
        }
    }

    async init() {
        // Wait briefly to let consent system load first
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Set up periodic updates regardless of seasonal themes setting
        if (!this.updateInterval) {
            this.updateInterval = setInterval(() => {
                this.updateTheme();
            }, 30 * 60 * 1000); // Check every 30 minutes
        }

        // Only apply themes if seasonal themes are enabled
        if (this.seasonalThemesEnabled) {
            // Get user's location and try weather-based theme first
            await this.tryWeatherTheme();
            
            // If weather fails, fall back to seasonal theme
            if (!this.isWeatherEnabled) {
                this.applySeasonal();
            }
        } else {
            // Clear any existing effects when disabled
            this.clearEffects();
            this.removeAllThemeClasses();
        }
    }

    async tryWeatherTheme() {
        try {
            const coords = await this.getUserLocation();
            if (coords) {
                const weather = await this.fetchWeatherData(coords.latitude, coords.longitude);
                if (weather) {
                    this.currentWeather = weather;
                    this.isWeatherEnabled = true;
                    this.lastWeatherUpdate = Date.now();
                    this.applyWeatherTheme(weather);
                    return true;
                }
            }
        } catch (error) {
            // console.log('Weather theme unavailable, using seasonal theme:', error.message);
        }
        return false;
    }

    async getUserLocation() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation not supported'));
                return;
            }

            // Check permissions before attempting geolocation
            if (navigator.permissions) {
                navigator.permissions.query({ name: 'geolocation' }).then(result => {
                    if (result.state === 'denied') {
                        reject(new Error('Geolocation permission denied'));
                        return;
                    }
                    this.performGeolocationRequest(resolve, reject);
                }).catch(error => {
                    // If permissions API fails, skip geolocation
                    reject(new Error('Permissions API unavailable'));
                });
            } else {
                // Fallback if permissions API not available
                this.performGeolocationRequest(resolve, reject);
            }
        });
    }

    performGeolocationRequest(resolve, reject) {
        const timeout = setTimeout(() => {
            reject(new Error('Location request timeout'));
        }, this.weatherFallbackTimeout);

        try {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    clearTimeout(timeout);
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                },
                (error) => {
                    clearTimeout(timeout);
                    reject(error);
                },
                { timeout: this.weatherFallbackTimeout - 500, enableHighAccuracy: false }
            );
        } catch (error) {
            clearTimeout(timeout);
            reject(new Error('Geolocation blocked by browser policy'));
        }
    }

    async fetchWeatherData(lat, lon) {
        try {
            const response = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,is_day&timezone=auto`,
                { signal: AbortSignal.timeout(this.weatherFallbackTimeout) }
            );
            
            if (!response.ok) throw new Error('Weather API request failed');
            
            const data = await response.json();
            return {
                temperature: data.current.temperature_2m,
                weatherCode: data.current.weather_code,
                isDay: data.current.is_day === 1,
                timestamp: Date.now()
            };
        } catch (error) {
            throw new Error(`Weather fetch failed: ${error.message}`);
        }
    }

    getCurrentSeason() {
        const now = new Date();
        const month = now.getMonth(); // 0-11
        
        if (month >= 2 && month <= 4) return 'spring'; // Mar, Apr, May
        if (month >= 5 && month <= 7) return 'summer'; // Jun, Jul, Aug
        if (month >= 8 && month <= 10) return 'fall'; // Sep, Oct, Nov
        return 'winter'; // Dec, Jan, Feb
    }

    applyWeatherTheme(weather) {
        this.removeAllThemeClasses();
        
        const weatherType = this.getWeatherType(weather.weatherCode);
        const timeOfDay = weather.isDay ? 'day' : 'night';
        
        document.body.classList.add(`weather-${weatherType}`);
        document.body.classList.add(`time-${timeOfDay}`);
        
        this.addWeatherEffects(weatherType, weather);
        // console.log(`Applied weather theme: ${weatherType} (${timeOfDay})`);
    }

    applySeasonal() {
        this.removeAllThemeClasses();
        
        this.currentSeason = this.getCurrentSeason();
        document.body.classList.add(`season-${this.currentSeason}`);
        
        this.addSeasonalEffects(this.currentSeason);
        // console.log(`Applied seasonal theme: ${this.currentSeason}`);
    }

    getWeatherType(weatherCode) {
        // WMO Weather interpretation codes
        if (weatherCode >= 71 && weatherCode <= 77) return 'snow';
        if (weatherCode >= 80 && weatherCode <= 82) return 'rain';
        if (weatherCode >= 61 && weatherCode <= 67) return 'rain';
        if (weatherCode >= 51 && weatherCode <= 57) return 'drizzle';
        if (weatherCode >= 45 && weatherCode <= 48) return 'fog';
        if (weatherCode >= 1 && weatherCode <= 3) return 'cloudy';
        if (weatherCode === 0) return 'clear';
        return 'default';
    }

    addWeatherEffects(weatherType, weather) {
        this.clearEffects();
        
        // console.log(`🎨 Adding weather effects for: ${weatherType}`);
        
        switch (weatherType) {
            case 'snow':
                this.createSnowEffect();
                break;
            case 'rain':
                this.createRainEffect();
                break;
            case 'fog':
                this.addFogEffect();
                break;
            default:
                // console.log(`🎨 No specific weather effects for ${weatherType}, using seasonal effects`);
                this.addSeasonalEffects(this.getCurrentSeason());
        }
    }

    addSeasonalEffects(season) {
        this.clearEffects();
        
        // console.log(`🎨 Adding seasonal effects for: ${season}`);
        
        switch (season) {
            case 'spring':
                this.createPetalEffect();
                break;
            case 'summer':
                this.addSummerGlow();
                break;
            case 'fall':
                this.createLeavesEffect();
                break;
            case 'winter':
                this.createSnowEffect();
                break;
        }
    }

    createSnowEffect() {
        // console.log('🎨 Creating snow effect...');
        const snowContainer = document.createElement('div');
        snowContainer.className = 'snow-container';
        snowContainer.innerHTML = `
            <style>
                .snow-container {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    z-index: -1;
                    overflow: hidden;
                }
                .snowflake {
                    position: absolute;
                    top: -10px;
                    color: #fff;
                    user-select: none;
                    pointer-events: none;
                    font-size: 20px;
                    animation: fall linear infinite;
                }
                @keyframes fall {
                    0% { transform: translateY(-100vh) rotate(0deg); }
                    100% { transform: translateY(100vh) rotate(360deg); }
                }
            </style>
        `;
        
        // Create snowflakes
        for (let i = 0; i < 50; i++) {
            const snowflake = document.createElement('div');
            snowflake.className = 'snowflake';
            snowflake.innerHTML = '❄';
            snowflake.style.left = Math.random() * 100 + '%';
            snowflake.style.animationDuration = (Math.random() * 3 + 2) + 's';
            snowflake.style.animationDelay = Math.random() * 2 + 's';
            snowflake.style.fontSize = (Math.random() * 10 + 10) + 'px';
            snowflake.style.opacity = Math.random() * 0.8 + 0.2;
            snowContainer.appendChild(snowflake);
        }
        
        document.body.appendChild(snowContainer);
        // console.log('🎨 Snow effect created - 50 snowflakes added to page');
    }

    createRainEffect() {
        const rainContainer = document.createElement('div');
        rainContainer.className = 'rain-container';
        rainContainer.innerHTML = `
            <style>
                .rain-container {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    z-index: -1;
                    overflow: hidden;
                }
                .raindrop {
                    position: absolute;
                    width: 2px;
                    height: 20px;
                    background: linear-gradient(transparent, #4fc3f7);
                    animation: rain linear infinite;
                }
                @keyframes rain {
                    0% { transform: translateY(-100vh); }
                    100% { transform: translateY(100vh); }
                }
            </style>
        `;
        
        for (let i = 0; i < 100; i++) {
            const drop = document.createElement('div');
            drop.className = 'raindrop';
            drop.style.left = Math.random() * 100 + '%';
            drop.style.animationDuration = (Math.random() * 0.5 + 0.5) + 's';
            drop.style.animationDelay = Math.random() * 2 + 's';
            rainContainer.appendChild(drop);
        }
        
        document.body.appendChild(rainContainer);
    }

    createLeavesEffect() {
        const leavesContainer = document.createElement('div');
        leavesContainer.className = 'leaves-container';
        leavesContainer.innerHTML = `
            <style>
                .leaves-container {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    z-index: -1;
                    overflow: hidden;
                }
                .leaf {
                    position: absolute;
                    top: -50px;
                    font-size: 25px;
                    animation: fall-leaf linear infinite;
                }
                @keyframes fall-leaf {
                    0% { 
                        transform: translateY(-100vh) rotate(0deg); 
                        opacity: 1;
                    }
                    100% { 
                        transform: translateY(100vh) rotate(720deg); 
                        opacity: 0;
                    }
                }
            </style>
        `;
        
        const leaves = ['🍂', '🍁', '🍃'];
        for (let i = 0; i < 30; i++) {
            const leaf = document.createElement('div');
            leaf.className = 'leaf';
            leaf.innerHTML = leaves[Math.floor(Math.random() * leaves.length)];
            leaf.style.left = Math.random() * 100 + '%';
            leaf.style.animationDuration = (Math.random() * 5 + 3) + 's';
            leaf.style.animationDelay = Math.random() * 3 + 's';
            leavesContainer.appendChild(leaf);
        }
        
        document.body.appendChild(leavesContainer);
    }

    createPetalEffect() {
        const petalContainer = document.createElement('div');
        petalContainer.className = 'petal-container';
        petalContainer.innerHTML = `
            <style>
                .petal-container {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    z-index: -1;
                    overflow: hidden;
                }
                .petal {
                    position: absolute;
                    top: -50px;
                    font-size: 20px;
                    animation: float-petal linear infinite;
                }
                @keyframes float-petal {
                    0% { 
                        transform: translateY(-100vh) translateX(0) rotate(0deg); 
                        opacity: 1;
                    }
                    50% { 
                        transform: translateY(50vh) translateX(50px) rotate(180deg); 
                    }
                    100% { 
                        transform: translateY(100vh) translateX(-50px) rotate(360deg); 
                        opacity: 0.3;
                    }
                }
            </style>
        `;
        
        const petals = ['🌸', '🌺', '🌷'];
        for (let i = 0; i < 20; i++) {
            const petal = document.createElement('div');
            petal.className = 'petal';
            petal.innerHTML = petals[Math.floor(Math.random() * petals.length)];
            petal.style.left = Math.random() * 100 + '%';
            petal.style.animationDuration = (Math.random() * 8 + 4) + 's';
            petal.style.animationDelay = Math.random() * 5 + 's';
            petalContainer.appendChild(petal);
        }
        
        document.body.appendChild(petalContainer);
    }

    addFogEffect() {
        const fogContainer = document.createElement('div');
        fogContainer.className = 'fog-container';
        fogContainer.innerHTML = `
            <style>
                .fog-container {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    z-index: -1;
                    background: linear-gradient(rgba(200,200,200,0.1), rgba(150,150,150,0.05));
                    animation: fog-move 10s ease-in-out infinite alternate;
                }
                @keyframes fog-move {
                    0% { opacity: 0.1; }
                    100% { opacity: 0.3; }
                }
            </style>
        `;
        document.body.appendChild(fogContainer);
    }

    addSummerGlow() {
        // Summer theme now uses default colors without filters
        // Just add the sun icon overlay, no color changes
    }

    clearEffects() {
        // Remove all weather/season effect containers
        const containers = document.querySelectorAll('.snow-container, .rain-container, .leaves-container, .petal-container, .fog-container');
        containers.forEach(container => container.remove());
        
        // Reset filters
        document.body.style.filter = '';
    }

    createSeasonalToggle() {
        // Wait for Material theme to load
        setTimeout(() => {
            // Double-check if toggle already exists (in case of race conditions)
            if (document.querySelector('.seasonal-toggle')) {
                this.toggleButtonCreated = true;
                return;
            }

            // Find the header actions area (look for palette toggles first)
            const headerActions = document.querySelector('.md-header__option') || 
                                 document.querySelector('[data-md-component="palette"]') ||
                                 document.querySelector('.md-header__source');
            
            if (headerActions) {
                const seasonalToggle = document.createElement('label');
                seasonalToggle.className = 'md-header__button md-icon seasonal-toggle';
                seasonalToggle.innerHTML = `
                    <input type="checkbox" ${this.seasonalThemesEnabled ? 'checked' : ''} style="display: none;">
                    <svg xmlns="http://www.w3.org/2000/svg" class="toggle-on" viewBox="0 0 90 90" style="width: 24px; height: 24px; display: ${this.seasonalThemesEnabled ? 'block' : 'none'};">
                        <title>Seasonal Themes Active</title>
                        <g>
                            <path d="M 64.903 70.097 H 25.097 C 11.236 70.097 0 58.861 0 45 v 0 c 0 -13.861 11.236 -25.097 25.097 -25.097 h 39.806 C 78.764 19.903 90 31.139 90 45 v 0 C 90 58.861 78.764 70.097 64.903 70.097 z" fill="#5767c9"/>
                            <path d="M 64.903 62.898 L 64.903 62.898 c 9.885 0 17.898 -8.013 17.898 -17.898 v 0 c 0 -9.885 -8.013 -17.898 -17.898 -17.898 h 0 c -9.885 0 -17.898 8.013 -17.898 17.898 v 0 C 47.005 54.885 55.018 62.898 64.903 62.898 z" fill="#f9f9f9"/>
                        </g>
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" class="toggle-off" viewBox="0 0 90 90" style="width: 24px; height: 24px; display: ${this.seasonalThemesEnabled ? 'none' : 'block'};">
                        <title>Seasonal Themes Inactive</title>
                        <g>
                            <path d="M 69.66 64.34 H 20.34 C 9.659 64.34 1 55.681 1 45 v 0 c 0 -10.681 8.659 -19.34 19.34 -19.34 H 69.66 C 80.341 25.66 89 34.319 89 45 v 0 C 89 55.681 80.341 64.34 69.66 64.34 z" fill="currentColor" opacity="0.3"/>
                            <path d="M 69.66 65.34 H 20.34 C 9.125 65.34 0 56.216 0 45 s 9.125 -20.34 20.34 -20.34 h 49.32 C 80.876 24.66 90 33.784 90 45 S 80.876 65.34 69.66 65.34 z M 20.34 26.66 C 10.228 26.66 2 34.887 2 45 c 0 10.112 8.228 18.34 18.34 18.34 h 49.32 C 79.772 63.34 88 55.112 88 45 c 0 -10.113 -8.228 -18.34 -18.34 -18.34 H 20.34 z" fill="currentColor" opacity="0.5"/>
                            <path d="M 20.34 57.5 L 20.34 57.5 c 6.904 0 12.5 -5.596 12.5 -12.5 v 0 c 0 -6.904 -5.596 -12.5 -12.5 -12.5 h 0 c -6.904 0 -12.5 5.596 -12.5 12.5 v 0 C 7.84 51.904 13.436 57.5 20.34 57.5 z" fill="currentColor" opacity="0.6"/>
                        </g>
                    </svg>
                `;
                
                seasonalToggle.addEventListener('click', (e) => {
                    e.preventDefault();
                    // console.log('🎨 Seasonal toggle clicked!');
                    this.toggleSeasonalThemes();
                });
                
                // Add tooltip
                seasonalToggle.title = this.seasonalThemesEnabled ? 'Disable Seasonal Themes' : 'Enable Seasonal Themes';
                
                // Insert after the header actions (so it appears next to the theme toggles)
                headerActions.parentNode.insertBefore(seasonalToggle, headerActions.nextSibling);
                
                this.updateSeasonalToggleIcon();
                this.toggleButtonCreated = true;
                // console.log('🎨 Seasonal toggle button created (once)');
            } else {
                // console.log('🎨 Could not find header actions area for toggle button');
                // Retry once after a longer delay if header not found
                if (!this.toggleButtonCreated) {
                    setTimeout(() => this.createSeasonalToggle(), 2000);
                }
            }
        }, 1000);
    }

    toggleSeasonalThemes() {
        this.seasonalThemesEnabled = !this.seasonalThemesEnabled;
        localStorage.setItem('seasonal-themes', this.seasonalThemesEnabled.toString());
        
        if (!this.seasonalThemesEnabled) {
            // Disable all seasonal effects
            this.clearEffects();
            this.removeAllThemeClasses();
            this.isWeatherEnabled = false;
            // console.log('🎨 Seasonal themes disabled');
        } else {
            // Re-enable seasonal themes
            // console.log('🎨 Seasonal themes enabled - restarting theme detection...');
            this.isWeatherEnabled = false; // Reset weather state
            this.currentWeather = null;
            this.lastWeatherUpdate = null;
            
            // Restart theme detection
            this.init();
        }
        
        this.updateSeasonalToggleIcon();
    }

    updateSeasonalToggleIcon() {
        const toggle = document.querySelector('.seasonal-toggle');
        if (toggle) {
            const checkbox = toggle.querySelector('input[type="checkbox"]');
            const toggleOn = toggle.querySelector('.toggle-on');
            const toggleOff = toggle.querySelector('.toggle-off');
            
            if (checkbox) {
                checkbox.checked = this.seasonalThemesEnabled;
            }
            
            // Show/hide appropriate icons and update tooltips
            if (this.seasonalThemesEnabled) {
                if (toggleOn) {
                    toggleOn.style.display = 'block';
                    toggleOn.querySelector('title').textContent = 'Seasonal Themes Active';
                }
                if (toggleOff) toggleOff.style.display = 'none';
                toggle.title = 'Disable Seasonal Themes';
            } else {
                if (toggleOn) toggleOn.style.display = 'none';
                if (toggleOff) {
                    toggleOff.style.display = 'block';
                    toggleOff.querySelector('title').textContent = 'Seasonal Themes Inactive';
                }
                toggle.title = 'Enable Seasonal Themes';
            }
        }
    }

    removeAllThemeClasses() {
        const themeClasses = [
            'season-spring', 'season-summer', 'season-fall', 'season-winter',
            'weather-snow', 'weather-rain', 'weather-drizzle', 'weather-fog', 
            'weather-cloudy', 'weather-clear', 'weather-default',
            'time-day', 'time-night'
        ];
        
        themeClasses.forEach(cls => document.body.classList.remove(cls));
    }

    async updateTheme() {
        // Only update themes if seasonal themes are enabled
        if (!this.seasonalThemesEnabled) {
            return;
        }

        if (this.isWeatherEnabled) {
            // Check if weather data is still fresh
            if (Date.now() - this.lastWeatherUpdate > this.weatherCacheTime) {
                // Try to refresh weather data
                const success = await this.tryWeatherTheme();
                if (!success) {
                    // Fall back to seasonal if weather fails
                    this.isWeatherEnabled = false;
                    this.applySeasonal();
                }
            }
        } else {
            // Periodically try to re-enable weather theme
            await this.tryWeatherTheme();
        }
    }

    // Developer utilities for testing
    forceSeasonalTheme(season) {
        if (!['spring', 'summer', 'fall', 'winter'].includes(season)) {
            console.error('Invalid season. Use: spring, summer, fall, winter');
            return;
        }
        this.isWeatherEnabled = false;
        this.currentSeason = season;
        this.removeAllThemeClasses();
        document.body.classList.add(`season-${season}`);
        this.addSeasonalEffects(season);
        console.log(`Forced seasonal theme: ${season}`);
    }

    forceWeatherTheme(weatherType, isDay = true) {
        const validWeather = ['snow', 'rain', 'drizzle', 'fog', 'cloudy', 'clear'];
        if (!validWeather.includes(weatherType)) {
            console.error('Invalid weather type. Use:', validWeather.join(', '));
            return;
        }
        this.isWeatherEnabled = true;
        this.removeAllThemeClasses();
        document.body.classList.add(`weather-${weatherType}`);
        document.body.classList.add(`time-${isDay ? 'day' : 'night'}`);
        this.addWeatherEffects(weatherType, { weatherCode: weatherType, isDay });
        console.log(`Forced weather theme: ${weatherType} (${isDay ? 'day' : 'night'})`);
    }

    resetToAuto() {
        this.isWeatherEnabled = false;
        this.clearEffects();
        this.removeAllThemeClasses();
        this.init();
        console.log('Reset to automatic theme detection');
    }

    getStatus() {
        return {
            isWeatherEnabled: this.isWeatherEnabled,
            currentSeason: this.currentSeason,
            currentWeather: this.currentWeather,
            lastWeatherUpdate: this.lastWeatherUpdate ? new Date(this.lastWeatherUpdate) : null,
            seasonalThemesEnabled: this.seasonalThemesEnabled
        };
    }

    // Animation control methods
    enableSeasonalThemes() {
        if (!this.seasonalThemesEnabled) {
            this.toggleSeasonalThemes();
        }
    }

    disableSeasonalThemes() {
        if (this.seasonalThemesEnabled) {
            this.toggleSeasonalThemes();
        }
    }
}

// Initialize theme manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Prevent multiple initializations
    if (window.themeManager) {
        // console.log('🎨 Theme Manager already initialized, skipping...');
        return;
    }

    window.themeManager = new ThemeManager();
    
    // Make developer functions available globally
    window.forceSeasonalTheme = (season) => window.themeManager.forceSeasonalTheme(season);
    window.forceWeatherTheme = (weather, isDay) => window.themeManager.forceWeatherTheme(weather, isDay);
    window.resetThemeToAuto = () => window.themeManager.resetToAuto();
    window.getThemeStatus = () => window.themeManager.getStatus();
    window.enableSeasonalThemes = () => window.themeManager.enableSeasonalThemes();
    window.disableSeasonalThemes = () => window.themeManager.disableSeasonalThemes();
    
    // Development help (uncomment for debugging):
    // console.log('🎨 Theme Manager loaded! Try these commands in the console:');
    // console.log('- forceSeasonalTheme("winter") - Test seasonal themes');
    // console.log('- forceWeatherTheme("snow", true) - Test weather themes');
    // console.log('- enableSeasonalThemes() / disableSeasonalThemes() - Control seasonal themes');
    // console.log('- resetThemeToAuto() - Return to automatic detection');
    // console.log('- getThemeStatus() - Check current theme status');
});
