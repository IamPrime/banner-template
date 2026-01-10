# 🎨 Hybrid Seasonal/Weather Theme System

A dynamic theming system that intelligently switches between weather-based and seasonal themes while preserving your site's design integrity. Features a user-controlled toggle for enabling/disabling seasonal effects.

## 🌟 Overview

This system implements a hybrid pattern that prioritizes real-time weather data when available, gracefully falling back to calendar-based seasonal themes. It enhances your site with subtle visual effects and animations without disrupting the core Material Design theme. Users can toggle the seasonal themes on/off using a dedicated button in the header.

## ✨ Features

### �️ **User Controls**
- **Seasonal Toggle Button**: Located next to the light/dark mode switcher in the header
- **Persistent Settings**: User preference saved in localStorage
- **Smooth Transitions**: Effects appear/disappear gracefully when toggled
- **Non-Intrusive**: Original light/dark mode switcher preserved and unaffected

### �🌤️ **Smart Theme Detection**
- **Weather-First Approach**: Attempts to fetch real-time weather data using Open-Meteo API
- **Graceful Fallback**: Automatically switches to seasonal themes if weather data is unavailable
- **Location-Based**: Uses browser geolocation for accurate weather data
- **Fast Timeout**: 3-second timeout ensures quick fallback to seasonal themes
- **Intelligent Caching**: Weather data cached for 30 minutes to reduce API calls

### 🗓️ **Seasonal Themes (Calendar-Based)**
- **Spring** (March-May): Cherry blossom petals floating gently with spring pastels
- **Summer** (June-August): Clean default theme colors with subtle sun icon overlays
- **Fall** (September-November): Falling autumn leaves in warm orange and red tones
- **Winter** (December-February): Animated snowflakes with cool blue atmospheric effects

### 🌦️ **Weather Themes (Real-Time)**
- **Snow**: Animated snowflakes falling across the page
- **Rain**: Realistic raindrop animation effects
- **Drizzle**: Light precipitation effects
- **Fog**: Subtle atmospheric haze overlay
- **Clear/Sunny**: Falls back to appropriate seasonal theme
- **Cloudy**: Muted atmospheric styling

### 🖼️ **Dynamic Visual Effects**
- **Profile Image Overlays**: Contextual icons appear over profile images
  - ❄️ Snow icons for winter/snow weather
  - 🍂🍁 Fall leaves for autumn themes
  - 🌸🌺 Spring flowers for spring season
  - ☀️ Sun icon for summer/sunny weather
  - 🌧️ Rain icons for rainy conditions

### 🎨 **Design Preservation**
- **Material Theme Colors**: All original color schemes maintained (especially summer theme)
- **Layout Integrity**: No changes to navigation, typography, or structure
- **Responsive Design**: Optimized effects for all device sizes
- **Dark Mode Support**: Adapts seamlessly to light and dark themes
- **Performance Optimized**: Reduced effects on mobile devices (50% opacity)

## 📁 File Structure

```
docs/
├── overrides/
│   └── theme-manager.js          # Core theme management logic
├── stylesheets/
│   ├── theme-styles.css          # Visual effects and animations
│   └── extra.css                 # Existing styles (preserved)

mkdocs.yml                        # Updated configuration
```

## 🚀 Implementation Details

### Core Components

1. **ThemeManager Class** (`theme-manager.js`)
   - Handles location detection and weather API calls
   - Manages theme switching logic and caching
   - Provides developer utilities for testing
   - Controls seasonal theme toggle state and persistence

2. **Theme Styles** (`theme-styles.css`)
   - Defines visual effects for each theme
   - Implements animations and overlays
   - Ensures responsive behavior
   - Adapts to both light and dark modes

3. **Seasonal Toggle Button**
   - Integrated into Material Design header
   - Uses gear/settings icon for intuitive UX
   - Positioned next to existing theme toggles
   - State persisted in localStorage

4. **Configuration** (`mkdocs.yml`)
   - Includes new JavaScript and CSS files
   - Maintains existing theme configuration

### User Experience

#### **Seasonal Toggle Behavior**
- **Default State**: Enabled (seasonal themes active)
- **Toggle Location**: Header area, next to light/dark mode switches
- **Visual Feedback**: Icon color changes to indicate on/off state
- **Immediate Effect**: Themes activate/deactivate instantly when toggled
- **Persistence**: Setting remembered across browser sessions

#### **Automatic Fallback Chain**
```
User Toggles ON → Weather Detection → Weather Available?
├── YES → Apply Weather Theme (snow, rain, fog, etc.)
└── NO → Apply Seasonal Theme (spring, summer, fall, winter)

User Toggles OFF → Remove All Effects → Clean Material Theme
```

### API Integration

- **Weather Service**: [Open-Meteo API](https://open-meteo.com/)
- **No API Key Required**: Free and open weather service
- **Data Retrieved**: Temperature, weather codes, day/night status
- **Update Frequency**: Every 10 minutes with 30-minute cache
- **Privacy Friendly**: Location data not stored or transmitted

### Theme Detection Logic

```javascript
1. Page Load → Check Toggle State
   ├── DISABLED → Clean Theme (no effects)
   └── ENABLED → Try Weather Theme
       ├── Get User Location (3s timeout)
       ├── Fetch Weather Data (3s timeout)
       ├── SUCCESS → Apply Weather Theme
       └── FAILURE → Apply Seasonal Theme

2. User Toggles OFF → Clear All Effects
3. User Toggles ON → Restart Detection Process

2. Periodic Updates (every 10 minutes)
   ├── Check Cache Age (30 min expiry)
   ├── Refresh Weather Data
   └── Fallback to Seasonal if needed
```

## 🛠️ Developer Tools

Access these commands in the browser console for testing:

```javascript
// Test seasonal themes
forceSeasonalTheme("winter")     // Options: spring, summer, fall, winter
forceSeasonalTheme("spring")

// Test weather themes  
forceWeatherTheme("snow", true)  // Weather type, isDay
forceWeatherTheme("rain", false) // Night rain theme

// Control seasonal theme system
enableSeasonalThemes()           // Turn on seasonal themes (same as toggle)
disableSeasonalThemes()          // Turn off seasonal themes (same as toggle)

// Control functions
resetThemeToAuto()               // Return to automatic detection
getThemeStatus()                 // Check current theme status

// Control functions
resetThemeToAuto()               // Return to automatic detection
getThemeStatus()                 // Check current theme status
```

### Available Weather Types
- `snow`, `rain`, `drizzle`, `fog`, `cloudy`, `clear`

## 📱 Responsive Behavior

### Desktop
- Full animation effects
- Complete overlay systems
- All visual enhancements active

### Mobile/Tablet
- Reduced animation intensity (50% opacity)
- Smaller overlay icons
- Performance-optimized effects

## � Usage Examples

### Using the Seasonal Toggle Button
The seasonal toggle button is located in the header next to the light/dark mode switcher:

1. **Enabling Seasonal Themes**:
   - Click the gear ⚙️ icon in the header
   - Icon turns colored (accent color) when enabled
   - Effects begin immediately based on current season/weather

2. **Disabling Seasonal Themes**:
   - Click the gear ⚙️ icon again
   - Icon turns gray when disabled
   - All effects are removed instantly
   - Original Material theme remains

3. **Visual Feedback**:
   - **Enabled**: Icon shows in accent color with tooltip "Disable Seasonal Themes"
   - **Disabled**: Icon shows in muted color with tooltip "Enable Seasonal Themes"

### Automatic Mode (Default)
The system runs automatically when seasonal themes are enabled:
```javascript
// No setup required - works out of the box when toggle is ON
```

### Manual Testing
```javascript
// Test fall theme with leaves
forceSeasonalTheme("fall")

// Test snowy weather at night
forceWeatherTheme("snow", false)

// Check what theme is currently active
console.log(getThemeStatus())

// Return to automatic detection
resetThemeToAuto()
```

## �🌙 Dark Mode Adaptation

The system automatically adapts all effects for both light and dark themes:

- **Light Mode**: Brighter overlays and effects
- **Dark Mode**: Subtler effects with adjusted opacity
- **Automatic Switching**: Respects user's theme preference

## 🔧 Configuration Options

### Timeout Settings
```javascript
weatherFallbackTimeout: 3000     // 3 seconds for location/weather
weatherCacheTime: 30 * 60 * 1000 // 30 minutes cache duration
updateInterval: 10 * 60 * 1000    // 10 minutes update frequency
```

### Performance Settings
- Mobile effect reduction: 50% opacity
- Animation optimization for low-end devices
- Efficient DOM manipulation

## 🎯 Usage Examples

### Automatic Mode (Default)
The system runs automatically on page load:
```javascript
// No setup required - works out of the box
```

### Manual Testing
```javascript
// Test fall theme with leaves
forceSeasonalTheme("fall")

// Test snowy weather at night
forceWeatherTheme("snow", false)

// Check what theme is currently active
console.log(getThemeStatus())

// Return to automatic detection
resetThemeToAuto()
```

## 🚦 Error Handling

The system includes comprehensive error handling:

1. **Geolocation Errors**: Falls back to seasonal themes
2. **API Failures**: Graceful degradation to calendar-based themes
3. **Network Issues**: Uses cached data when possible
4. **Browser Compatibility**: Works without modern APIs

## 🔮 Future Enhancements

Potential improvements for future versions:

- **Custom Weather Providers**: Support for additional weather APIs
- **User Preferences**: Allow users to disable/customize effects
- **More Weather Types**: Support for additional weather conditions
- **Seasonal Adjustments**: Fine-tune seasonal date ranges
- **Animation Controls**: User-controlled animation intensity

## 🐛 Troubleshooting

### Common Issues

1. **No Location Permission**
   - Theme falls back to seasonal automatically
   - No user action required

2. **Weather API Unavailable**
   - System uses seasonal themes as backup
   - Retries weather detection every 10 minutes

3. **Effects Not Showing**
   - Check browser console for JavaScript errors
   - Verify CSS files are loaded correctly
   - Test with developer tools: `getThemeStatus()`

### Debug Commands
```javascript
// Check current status
getThemeStatus()

// Force a specific theme for testing
forceSeasonalTheme("winter")

// Reset to see automatic detection
resetThemeToAuto()
```

## 📜 License

This theme system is part of the Corolla project and follows the same licensing as the Banner project.

---

*Created with ❤️ by [IamPrime](https://github.com/IamPrime) for enhanced user experience while maintaining design integrity.*