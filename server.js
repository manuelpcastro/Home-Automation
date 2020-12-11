var http = require("http");
var url = require("url");
var fs = require("fs");
var path = require("path");
var socketio = require("socket.io");

var MongoClient = require('mongodb').MongoClient;
var MongoServer = require('mongodb').Server;
var mimeTypes = { "html": "text/html", "jpeg": "image/jpeg", "jpg": "image/jpeg", "png": "image/png", "js": "text/javascript", "css": "text/css", "swf": "application/x-shockwave-flash"};

var httpServer = http.createServer(
	function(request, response) {
		var uri = url.parse(request.url).pathname;
		if (uri=="/") uri = "/index.html";
		var fname = path.join(process.cwd(), uri);
		fs.exists(fname, function(exists) {
			if (exists) {
				fs.readFile(fname, function(err, data){
					if (!err) {
						var extension = path.extname(fname).split(".")[1];
						var mimeType = mimeTypes[extension];
						response.writeHead(200, mimeType);
						response.write(data);
						response.end();
					}
					else {
						response.writeHead(200, {"Content-Type": "text/plain"});
						response.write('Error de lectura en el fichero: '+uri);
						response.end();
					}
				});
			}
			else{
				console.log("Peticion invalida: "+uri);
				response.writeHead(200, {"Content-Type": "text/plain"});
				response.write('404 Not Found\n');
				response.end();
			}
		});
	}
);





MongoClient.connect("mongodb://localhost:27017/", function(err, db) {
	httpServer.listen(8080);
	var io = socketio.listen(httpServer);

	var dbo = db.db("practica4mpc");
	dbo.createCollection("sensor", function(err, collection){
    	io.sockets.on('connection',
		function(client) {

			client.on('update-sensor', function (data) {
				console.log("Actualizando sensor");
			
				//agente(data)

				var sensor = { sensor : data['sensor'] };
				collection.find(sensor).toArray(function(err, result){
					if(err) throw err;
					
					var newvalues = { $set: { valor: data['valor'] } };
					collection.findOneAndUpdate(sensor, newvalues, function(err, result){});
			
					collection.find().toArray(function(err, results){
						io.sockets.emit('actualizar', results);
					});

					if(data['valor'] >= result[0].maximo){
						io.sockets.emit("alerta", data);
					}
				});
			});	

			client.on('nuevo-sensor', function (data) {
				console.log("Nuevo sensor");
				collection.insert(data, {safe:true}, function(err,result) {});
				
				collection.find().toArray(function(err, results){
					io.sockets.emit('actualizar', results);
				});
			});

			client.on('obtener', function (data) {
				console.log("Devolviendo sensores");
				
				collection.find().toArray(function(err, results){
					console.log(results);
					io.sockets.emit('actualizar', results);
				});
			});

			client.on('cambiar', function (data) {
				console.log("Cambiando un aparato");			
		
					var sensor;
					var nuevovalor;
					//agente
					if(data.aparato == 'ac'){
						if(data.valor == 'on') nuevovalor =22;
						if(data.valor == 'off')nuevovalor= 30; 
					
						sensor = {sensor : 'temperatura'};	
					
					}
					
					if(data.aparato == 'persiana'){
						if(data.valor == 'on') nuevovalor = 0;
						if(data.valor == 'off')nuevovalor= 30; 
			
						sensor = {sensor : 'luz'};
					}

					
					var newvalues = { $set: {valor: nuevovalor} };
					collection.findOneAndUpdate(sensor, newvalues, function(err, result){});
				
					collection.find().toArray(function(err, results){
						io.sockets.emit('actualizar', results);
					});
			});
		});
    	});
	
	
	/*
	dbo.createCollection("historialsensor", function(err, collection){
    	io.sockets.on('connection',
		function(client) {
			client.on('historialsensor', function (data) {
				collection.insert(data, {safe:true}, function(err, result) {});
			});
			client.on('obtenerhistorial', function (data) {
				collection.find(data).toArray(function(err, results){
					client.emit('obtener', results);
				});
			});
		});
    	});*/

});

console.log("Servicio MongoDB iniciado");

