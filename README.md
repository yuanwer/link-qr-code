# Website QR Code Generator

This is a Chrome browser extension that converts the current webpage link into a QR code.

## Features

- Automatically generates QR code for the current webpage link
- Converts local URLs (e.g., localhost, 127.0.0.1) to LAN IP addresses

## Installation

1. Download this project to your local machine
2. Open Chrome browser and go to the extensions page (chrome://extensions/)
3. Enable "Developer mode"
4. Click "Load unpacked" and select the project folder

## How to Use

1. Click the extension icon in the Chrome toolbar
2. A pop-up window will display the QR code for the current webpage link
3. Scan the QR code with your mobile device to access the webpage

## Technical Implementation

- Uses Chrome extension API to get the current tab URL
- Utilizes WebRTC technology to obtain LAN IP address
- Uses qrcode.js library to generate QR codes

## License

This project is licensed under the MIT License
