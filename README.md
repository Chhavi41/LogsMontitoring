# Logs Monitoring

## Overview
Logs Monitoring is a real-time log-watching solution that allows users to subscribe to updates from a log file. The server continuously monitors a specified log file (`logs.txt`) and streams updates to connected WebSocket clients, ensuring that all subscribers receive real-time log data.

## Implementation Details
- The server is implemented using **Node.js** with the **WebSocket protocol** to enable real-time communication between clients and the server.
- The server reads from an append-only log file (`logs.txt`) and sends new log lines to all subscribed WebSocket clients.
- The client interface is a simple HTML page that connects to the WebSocket server and dynamically updates the log display.
- Automatic scrolling is implemented to ensure smooth log viewing.

## Tech Stack
- **Backend:** Node.js, WebSocket (ws)
- **Frontend:** HTML, CSS, JavaScript
- **File System Operations:** `fs` module in Node.js

## Dependencies
Ensure you have the following installed:
- Node.js (>= 16.x)
- NPM (Node Package Manager)
- WebSocket library (`ws`)

## Installation
1. **Clone the repository**
   ```sh
   git clone https://github.com/Chhavi41/LogsMontitoring.git
   cd LogsMontitoring
   ```

2. **Install dependencies**
   ```sh
   npm install
   ```

## Running the Project
### Start the WebSocket Server
```sh
node server.js
```

### Start Log Generator (for testing)
You can use the following command to continuously append logs to `logs.txt`:
```sh
while true; do echo "$(date) - Log Entry" >> logs.txt; sleep 1; done
```

### Run the Frontend
1. Open `index.html` in a web browser.
2. The webpage will connect to the WebSocket server and start displaying logs in real-time.


## Contributing
Feel free to open issues or submit pull requests for improvements and bug fixes.

## License
This project is open-source and available under the MIT License.

