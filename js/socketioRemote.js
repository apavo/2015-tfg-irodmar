// Archivo que se encarga de la comunicacion con el servidor de señalozacion y llama a las funciones necesarias de webRTC
// del watcher

// instruments
var panelControl;
var intervalo = null;


// conexion de Socket.io al servidor de señalizacion
var socket = io.connect("10.10.48.82");

socket.emit('join remote');


socket.on('joined', function (){
	//console.log('This peer has joined');
	panelControl = new panelControl();
	leftJoystick();
	rightJoystick();
	mapa();
});



socket.on('message', function (message){
	//console.log('Received message:', message);
        if (message.type === 'offer') {
        	createPeerConnection(message);

	} else if (message.type === 'candidate') {
		var candidate = new RTCIceCandidate({sdpMLineIndex:message.label,
			candidate:message.candidate});
		PeerConnection.addIceCandidate(candidate);
	}
});


function sendMessage(message){
	//console.log('Enviando mensaje: ', message);
	socket.emit('message', message);
}

// Mensajes de log que envia el Servidor
socket.on('log', function (array){
	console.log.apply(console, array);
});