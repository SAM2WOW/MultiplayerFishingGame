# Multiplayer Fishing Game

## Overview
This project is a multiplayer fishing game built using the Playroom kit and Phaser. It allows one player to act as the stream screen displaying a fishing pond, while other players use a controller interface that includes a QR code scanner to display scanned QR codes as text.

## Project Structure
```
multiplayer-fishing-game
├── docs
│   └── index.html          # Main entry point for the game
├── src
│   ├── assets
│   │   ├── images          # Directory for image assets (backgrounds, sprites, UI elements)
│   │   └── sounds          # Directory for sound assets (background music, sound effects)
│   ├── scenes
│   │   ├── StreamScene.js  # Scene for the fishing pond and stream screen
│   │   └── ControllerScene.js # Scene for the controller interface and QR code scanner
│   ├── components
│   │   ├── Pond.js         # Component for managing the fishing pond
│   │   └── QRScanner.js    # Component for QR code scanning functionality
│   ├── config
│   │   └── gameConfig.js   # Configuration settings for the Phaser game
│   └── main.js             # Main entry point for game logic
├── package.json             # npm configuration file with dependencies
└── README.md                # Project documentation
```

## Setup Instructions
1. Clone the repository:
   ```
   git clone <repository-url>
   cd multiplayer-fishing-game
   ```

2. Install the dependencies:
   ```
   npm install
   ```

3. Open `docs/index.html` in a web browser to start the game.

## Gameplay
- **Stream Screen**: One player acts as the host and displays the fishing pond. They can manage the pond and interact with fish.
- **Controller Interface**: Other players can join as controllers. They can scan QR codes using the integrated QR code scanner, and the scanned codes will be displayed as text on their screen.

## Technologies Used
- **Phaser**: A fast, robust, and versatile HTML5 game framework.
- **Playroom Kit**: A multiplayer framework that facilitates real-time interactions between players.
- **NippleJS**: A JavaScript library for creating virtual joysticks.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.