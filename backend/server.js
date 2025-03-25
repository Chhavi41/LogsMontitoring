import fs from 'node:fs';
import { WebSocketServer } from 'ws';

const filepath = './logs.txt';
let fileSize = 0;
const PORT = 5000;
const CHUNK_SIZE = 1024;

// Start WebSocket Server
const server = new WebSocketServer({ port: PORT });
const subscribers = new Set(); // Track clients subscribed to "log/updates"


server.on('connection', (socket) => {
    console.log('connected');
    socket.on('message', (message) => {
        console.log(`Received:, ${message}`);
        const msg = JSON.parse(message.toString('utf-8'));
        if (msg.action === "subscribe" && msg.topic === "log/updates") {
            subscribers.add(socket);
            // console.log(subscribers);
        }
        readLastLines(10).then((lines) => {
            socket.send(JSON.stringify({ logs: lines }));
        }).catch((err) => console.error("Error reading last lines:", err));
    });
    socket.on('close', () => {
        subscribers.delete(socket); // Remove disconnected clients
        console.log("Client disconnected");
    });
})

const readLastLines = async (numLines = 10) => {
    return new Promise((resolve, reject) => {
        fs.stat(filepath, (err, stats) => {
            if (err) return reject(err);
            let fileSize = stats.size;
            let position = fileSize;
            let buffer = Buffer.alloc(CHUNK_SIZE);
            let lines = [];

            const readChunk = (fd) => {
                if (position <= 0 || lines.length >= numLines) {
                    fs.close(fd, () => {});
                    return resolve(lines.slice(-numLines)); // Reverse to keep correct order
                }

                let readSize = Math.min(CHUNK_SIZE, position);
                position -= readSize;
                
                fs.read(fd, buffer, 0, readSize, position, (err, bytesRead) => {
                    if (err) return reject(err);

                    let chunkLines = buffer.toString('utf-8', 0, bytesRead).split('\n');
                    lines = [...chunkLines, ...lines];

                    readChunk(fd); // Keep reading if needed
                });
            };

            fs.open(filepath, 'r', (err, fd) => {
                if (err) return reject(err);
                readChunk(fd);
            });
        });
    });
};




setInterval(() => {
    fs.stat(filepath, (err, stats) => {
        if (err) {
            console.log('Error occured:', err);
            return;
        }
        const currfilesize = stats.size;
        if (fileSize < stats.size) {
            readnewLines(fileSize, currfilesize).then((lines) => {
                const logUpdate = JSON.stringify({ logs: lines });
                for (const socket of subscribers) {
                    socket.send(logUpdate);
                }
                fileSize = stats.size;
            }).catch((err) => console.error("Error reading last lines:", err));
        }
    })
}, 500)


const readnewLines = (start, end) => {
    return new Promise((resolve, reject) => {
        fs.open(filepath, 'r', (err, fd) => {
            if (err) return reject(err);

            let bufferSize = end-start;
            let buffer = Buffer.alloc(bufferSize);

            fs.read(fd, buffer, 0, bufferSize, start, (err, bytesRead) => {
                if (err) return reject(err);
                fs.close(fd, () => {});

                let fileContent = buffer.toString('utf-8');
                let lines = fileContent.trim().split('\n');
                resolve(lines);
            });
        });
    });
}
