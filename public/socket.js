let ws = new WebSocket('ws://192.168.0.17:8484');


ws.onopen = () => console.log('open connection');

ws.onclose = () => console.log('close connection');