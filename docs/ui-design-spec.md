📐 UI Design Specification — George's Site

🎮 Design Philosophy

Create a personal website that feels like navigating a PS2/Xbox-era game menu system. The interface should feel like software, not a webpage — with depth, interactivity, and retro-futuristic styling.

⸻

🎨 Visual Design System

## Color Palette

```
Background:     #0A0A0A (near black)
Panel Base:     #111111 (charcoal)
Panel Accent:   #1A1A1A (dark gray)
Text Primary:   #FFFFFF (white)
Text Secondary: #B0B0B0 (light gray)
Accent Green:   #8CFF8C (neon green - active/hover)
Accent Blue:    #00B4D8 (electric blue - links)
Accent Red:     #FF1744 (warning red - status indicators)
```

## Typography

```
Headers:  Orbitron (Google Fonts) - 700 weight
Body:     JetBrains Mono - 400 weight
Accents:  Eurostile or similar (fallback to Orbitron)
Sizes:    
  - Menu Items: 24px
  - Headers: 32px
  - Body: 16px
  - Small: 14px
```

## Depth & Effects

- **Panel Shadows**: Multiple layered box-shadows for depth
  ```css
  box-shadow: 
    0 0 20px rgba(0,0,0,0.8),
    inset 0 1px 0 rgba(255,255,255,0.1),
    inset 0 -1px 0 rgba(0,0,0,0.5);
  ```

- **Gloss Effect**: Subtle gradient overlay
  ```css
  background: linear-gradient(
    to bottom,
    rgba(255,255,255,0.05) 0%,
    transparent 50%,
    rgba(0,0,0,0.2) 100%
  );
  ```

- **Active Glow**: For selected menu items
  ```css
  box-shadow: 
    0 0 30px rgba(140,255,140,0.4),
    inset 0 0 20px rgba(140,255,140,0.2);
  ```

⸻

🏗️ Layout Structure

## Screen Layout

```
┌─────────────────────────────────────────────────┐
│                  FRAME BEZEL                    │
│  ┌───────────────────────────────────────────┐  │
│  │            GEORGE WING                     │  │
│  ├───────────────────────────────────────────┤  │
│  │                                           │  │
│  │  ┌─────────┐  ┌─────────────────────┐   │  │
│  │  │  MENU   │  │                     │   │  │
│  │  │         │  │   CONTENT PANEL     │   │  │
│  │  │ > About │  │                     │   │  │
│  │  │ Projects│  │                     │   │  │
│  │  │   Now   │  │                     │   │  │
│  │  │ Contact │  │                     │   │  │
│  │  └─────────┘  └─────────────────────┘   │  │
│  │                                           │  │
│  ├───────────────────────────────────────────┤  │
│  │      [GH] [X] [Email]    v0.2.0          │  │
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

## Component Specifications

### 1. Frame Bezel
- 8px border around entire viewport
- Dark metallic gradient
- Subtle inner shadow for depth
- Contains entire interface

### 2. Menu Navigation
- **Width**: 25% of viewport (min 200px)
- **Style**: Dark panel with bevel
- **Items**: 
  - Large clickable areas (60px height)
  - Inactive: Dark gray text
  - Hover: Slight glow, text brightens
  - Active: Green background glow, black text
- **Transition**: 200ms ease for all state changes

### 3. Content Panel
- **Width**: 75% of viewport
- **Style**: Glassy panel with depth
- **Entry Animation**: Slide in from right (300ms)
- **Exit Animation**: Fade out (150ms)
- **Content Padding**: 40px

### 4. Link Dock
- **Position**: Fixed bottom
- **Height**: 60px
- **Icons**: 32x32px with 16px spacing
- **Hover**: Scale(1.1) + glow effect
- **Click**: Brief pulse animation

⸻

🎯 Interaction Design

## Menu Navigation Flow

1. **Default State**: First menu item (About) is active
2. **Hover**: Cursor becomes pointer, item glows subtly
3. **Click**: 
   - Active indicator slides to new position
   - Old content fades out (150ms)
   - New content slides in (300ms)
   - URL updates (no page reload)

## Keyboard Navigation

- `↑/↓` or `W/S`: Navigate menu
- `Enter` or `Space`: Select item
- `Tab`: Cycle through link dock
- `Esc`: Return to main menu (if in submenu)

## Mobile Adaptation

- Menu becomes horizontal tab bar at top
- Content takes full width below
- Link dock remains at bottom
- Touch-friendly tap targets (min 44px)

⸻

🔧 Implementation Guidelines

## CSS Architecture

```scss
// Base panel mixin
@mixin game-panel {
  background: linear-gradient(135deg, #1a1a1a 0%, #111111 100%);
  border: 1px solid #333;
  border-radius: 4px;
  box-shadow: 
    0 4px 20px rgba(0,0,0,0.6),
    inset 0 1px 0 rgba(255,255,255,0.1);
}

// Active state
@mixin active-glow($color) {
  box-shadow: 
    0 0 30px rgba($color, 0.4),
    inset 0 0 20px rgba($color, 0.2);
  border-color: rgba($color, 0.5);
}
```

## Animation Timing

- **Hover effects**: 150ms ease-out
- **Menu transitions**: 200ms ease-in-out
- **Panel slides**: 300ms cubic-bezier(0.4, 0, 0.2, 1)
- **Glow pulses**: 1s ease-in-out (infinite)

## Performance Considerations

- Use `transform` and `opacity` for animations (GPU accelerated)
- Lazy load content panels
- Preload next likely navigation target
- Consider `will-change` for frequently animated elements

⸻

🎯 Component States

## Menu Item States

| State | Background | Text | Border | Shadow |
|-------|------------|------|--------|--------|
| Default | #1A1A1A | #B0B0B0 | #333 | None |
| Hover | #222 | #FFF | #444 | Subtle glow |
| Active | #8CFF8C | #000 | #8CFF8C | Green glow |
| Disabled | #111 | #666 | #222 | None |

## Panel States

| State | Opacity | Transform | Transition |
|-------|---------|-----------|------------|
| Enter | 0→1 | translateX(20px)→0 | 300ms ease-out |
| Exit | 1→0 | 0→translateX(-10px) | 150ms ease-in |
| Idle | 1 | none | none |

⸻

🔮 Advanced Features (Future)

1. **Parallax Background**: Subtle grid or particle system
2. **Sound Design**: Menu bleeps and clicks (optional toggle)
3. **3D Tilt**: Panels respond to mouse position
4. **Loading States**: Retro progress bars or spinners
5. **Easter Eggs**: Konami code, hidden menus
6. **Themes**: Different color schemes (Matrix green, Tron blue, etc.)