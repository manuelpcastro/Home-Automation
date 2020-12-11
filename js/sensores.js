

$(document).ready(function() {
	console.log("Solicitando sensores");
	var socket = io.connect('localhost:8080');
 	socket.emit('obtener',null);
});	

var socket = io.connect('localhost:8080');

socket.on('actualizar', function(data) {
	actualizarSensores(data);
});



function actualizarSensores(sensores){
	var listContainer = document.getElementById('lista');
	listContainer.innerHTML = '';
	var num = sensores.length;
	for(var i=0; i<num; i++) {
		var listElement = document.createElement('div');
		listElement.classname = "w3-content";
		listElement.style.textAlign = 'center';
		var contenido = '<h2 class="w3-row-padding w3-light-grey w3-padding-64 w3-container">' + sensores[i]['sensor'].toUpperCase() + '</h2> <input id="' + sensores[i]['sensor'] + '" style="display:block;margin: 0 auto;font-size:40px;width:30%"  class="w3-input w3-padding-16 w3-border" type="number" value="' + sensores[i]['valor'] + '" required><br><input type="button" style="font-size:25px" onclick="cambiar(\'' + sensores[i]['sensor'] + '\')" class="w3-button w3-block w3-black w3-margin-bottom" value="Actualizar"><hr>';
       		listElement.innerHTML = contenido;
		listContainer.appendChild(listElement);
       	}
}


function cambiar(data){
	console.log(data);
	
	var sensor = data.toLowerCase();
	var formulario = '#'+sensor;
	var datos = $(sensor).serialize();
  	var valor = document.getElementById(sensor).value;
	if(valor == ''){ alert("VALOR VACIO"); return false;}
	//var date = new Date();
	console.log(valor);
	var socket = io.connect('localhost:8080');
	socket.emit('update-sensor', {'sensor': sensor, 'valor': valor});
	//socket.emit('historialsensor', {'sensor': sensor, 'valor': valor, 'fecha' : date});
}	    



