const logContainer = document.getElementById("logContainer")
const container = document.querySelector('.scrollable-container');
const webSocket = new WebSocket('ws://localhost:5000');


// Connection opened
webSocket.addEventListener("open", (event) => {
    webSocket.send(JSON.stringify({action: 'subscribe', topic: 'log/updates'}));
});


webSocket.onmessage = (event) => {
    console.log(event.data);
    const data = JSON.parse(event.data);
    logContainer.innerHTML += data.logs.map(log => `${log}<br>`).join("");
}


function autoScroll() {
    if (container.scrollTop < container.scrollHeight - container.clientHeight) {
      container.scrollTop += 2; // Adjust scroll speed as needed
      setTimeout(autoScroll, 50); // Adjust interval as needed
    } else {
      setTimeout(autoScroll, 5000); // Wait before scrolling again
    }
  }
  
  autoScroll();