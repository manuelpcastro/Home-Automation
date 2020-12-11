
socket = io.connect('http://localhost:8080');		

function crearSensor(){

	
	
	var datos = $("#sensor").serialize();
	var sensor = document.getElementById("idsensor").value;
  	var valor = document.getElementById("valor").value;
	var valor_aviso = document.getElementById("notificacion").value;


	var socket = io.connect('localhost:8080');
	socket.connect();
	console.log("Enviando info");
	socket.emit('nuevo-sensor', {'sensor':sensor, 'valor':valor, 'maximo':valor_aviso});

}


