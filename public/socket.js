let ws = new WebSocket('ws://192.168.0.17:8484/properties');


ws.onopen = () => console.log('open connection');

ws.onmessage = (msg) => console.log(msg);

ws.onclose = () => console.log('close connection');