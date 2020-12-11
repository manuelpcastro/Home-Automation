


$(document).ready(function() {
	console.log("Solicitando sensores");
	var socket = io.connect('localhost:8080');
 	socket.emit('obtener',null);
});		

var socket = io.connect('localhost:8080');
socket.on('actualizar', function(data) {
	console.log("He recibido: " + data);
	actualizarSensores(data);
});

socket.on('aparato', function(data) {
	actualizarAparatos(data);
});

socket.on('alerta', function(data) {
	console.log("recibida alerta");
	alert("CUIDADO: " + data['sensor'] + " esta por encima del valor deseado ");
});




function actualizarSensores(sensores){
	var listContainer = document.getElementById('resultados');
	listContainer.innerHTML = '';
	var num = sensores.length;
	for(var i=0; i<num; i++) {
		var listElement = document.createElement('div');
		listElement.classname = "w3-content";
		listElement.style.textAlign = 'center';
		var contenido = "<h2 class='w3-row-padding w3-light-grey w3-padding-64 w3-container'>" + sensores[i]['sensor'].toUpperCase() + "</h2> <h2 class='w3-text-grey'> " + sensores[i]['valor'] + "</h2> <hr>";
       		listElement.innerHTML = contenido;
		listContainer.appendChild(listElement);
       	}
}

	

// Persiana o AC
function cambiar(objeto){

	var obj;
	var sensor;
	var cambio;

	if(objeto == 'AC'){		
		obj = document.getElementById('AC');
		sensor = 'ac';
	}
	if(objeto == 'persiana'){
		obj = document.getElementById('persiana');
		sensor = 'persiana';
	}

	var estado = obj.innerHTML;

	if(estado == 'ON'){
		console.log("Apagando...");
		obj.innerHTML = 'OFF';
		cambio = 'off';	
	}
	if(estado == 'OFF'){
		console.log("Encendiendo...");
		obj.innerHTML = 'ON';
		cambio = 'on';
	}
	var socket = io.connect('localhost:8080');
	socket.emit('cambiar', {aparato: sensor, valor: cambio});
}



    

