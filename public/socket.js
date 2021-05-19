let ws = new WebSocket('ws://192.168.0.17:8484/properties/temperature');

ws.onopen = () => console.log('open connection');

ws.onmessage = (msg) => console.log(msg.data);

ws.onclose = () => console.log('close connection');