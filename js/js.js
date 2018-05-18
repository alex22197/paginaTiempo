
var urlWeather="http://api.openweathermap.org/data/2.5/forecast?lat=40.5361528&lon=-3.6291320&units=metric&appid=14fe9989ca36d46bacd247989900d8d5&mode=xml";

document.addEventListener("DOMContentLoaded", function(event){
	controlador(urlWeather);
});

var x = document.getElementById("demo");

class Tiempo{
	constructor(dia,tiempo,grados,humedad,presion,viento){
		this.dia=dia;
		this.tiempo=tiempo;		
		this.grados=grados;
		this.humedad=humedad;
		this.presion=presion;
		this.viento=viento;
		
	}
}
function creaObjeto(data){
	return new Tiempo(cogeDia(data),recogeTiempo(data),recogeGrados(data),recogeHumedad(data),recogePresion(data),recogeViento(data));

}
//nombres variables
async function controlador(){
	var data=await getXML(urlWeather);
	var tiempo=await creaObjeto(data);
	pintaHtml(tiempo,data);
	
}



var getXML = function(url) {
	return new Promise(function(resolve, reject) {
		var xhr = new XMLHttpRequest();
		xhr.open('get', url, true);
		xhr.responseType = 'document';
		xhr.onload = function() {
			var status = xhr.status;
			if (status == 200) {
				resolve(xhr.response);
			} else {
				reject(status);
			}
		};
		xhr.send();
	});
};


function cogeDia(data) {
	var dias=data.getElementsByTagName("time");	
	var dia="";
	var diaSemana=["Domingo","Lunes","Martes","Miercoles","Jueves","Viernes","Sabado"];
	var diaMes=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
	var dayWeek="";
	var dayMonth="";
	var dayDate="";
	var comprueba="dsdsd";
	var fechas=[];
	for(var i=0; i<dias.length; i++){
		dia=dias[i].getAttribute("from");
		var fecha=new Date(dia).getUTCDay();
		dayWeek=diaSemana[fecha];
		var fecha2=new Date(dia).getUTCMonth();
		dayMonth=diaMes[fecha2];
		var fecha3=new Date(dia).getDate();
		dayDate=fecha3;
		if(dayWeek!=comprueba){
			comprueba=dayWeek;
			fechas[i]=[dayWeek,dayMonth,dayDate];

		}	
	}
	//nos elimina las posiciones del array que están vacias
	return fechas.filter(Boolean);
}

function recogeTiempo(data){
	var tiempo=data.getElementsByTagName("symbol");
	var tiempo2=[];
	var comprueba="";
	var dia="";
	var dias=data.getElementsByTagName("time");			
	for(var i=0; i<dias.length; i++){
		dia=dias[i].getAttribute("from");
		var fecha3=new Date(dia).getDate();
		if(fecha3!=comprueba){
			comprueba=fecha3;
			tiempo2[i]=tiempo[i].getAttribute("name");
		}
	}
	//nos elimina las posiciones del array que están vacias
	return tiempo2.filter(Boolean);
}

function recogeGrados(data){
	var dias=data.getElementsByTagName("time");
	var comprueba="dsdsd";	
	var min="";
	var max="";	
	var array=[];	
	for(var i=0; i<dias.length; i++){
		dia=dias[i].getAttribute("from");
		var fecha3=new Date(dia).getDate();
		var minima=parseInt(data.getElementsByTagName('temperature')[i].getAttribute('min'));
		var maxima=parseInt(data.getElementsByTagName('temperature')[i].getAttribute('max'));


				//si fecha3 es diferente de comprueba, quiere decir que hemos pasado a un dia nuevo
				if(fecha3!=comprueba){
					array[i]=[min,max];
					comprueba=fecha3;
					min=minima;
					max=maxima;
				}
				else{
					if(minima<min){
						min=minima;
					}
					if(maxima>max){
						max=maxima;
					}
					
				}
			}
			
			//con array.splice(elimino el primer elemento de array que en nuestro caso es "")
			array=array.splice(1);
			//nos elimina las posiciones del array que están vacias
			return array.filter(Boolean);
		}

		function recogeHumedad(data){
			var dias=data.getElementsByTagName("time");
			var humedad=data.getElementsByTagName('humidity');
			var comprueba="dsdsd";
			var array=[];
			for(var i=0; i<dias.length; i++){
				dia=dias[i].getAttribute("from");
				var fecha3=new Date(dia).getDate();		
				var hum=parseInt(humedad[i].getAttribute('value'));

				//si fecha3 es diferente de comprueba, quiere decir que hemos pasado a un dia nuevo
				if(fecha3!=comprueba){
					array[i]=[hum];
					comprueba=fecha3;
					
				}
				
			}
			//mirar que hace array.filter(Boolean)
			return array.filter(Boolean);
		}
		function recogePresion(data){
			var dias=data.getElementsByTagName("time");
			var presion=data.getElementsByTagName('pressure');
			var comprueba="dsdsd";	
			var array=[];
			for(var i=0; i<dias.length; i++){
				dia=dias[i].getAttribute("from");
				var fecha3=new Date(dia).getDate();
				var pres=parseInt(presion[i].getAttribute('value'));
				
				//si fecha3 es diferente de comprueba, quiere decir que hemos pasado a un dia nuevo
				if(fecha3!=comprueba){
					array[i]=[pres];
					comprueba=fecha3;
				}
				
			}
			return array.filter(Boolean);
		}

		function recogeViento(data){

			var dias=data.getElementsByTagName("time");
			var viento=data.getElementsByTagName('windSpeed');
			var comprueba="dsdsd";	
			var array=[];	
			for(var i=0; i<dias.length; i++){
				dia=dias[i].getAttribute("from");
				var fecha3=new Date(dia).getDate();
				var wind=parseFloat(viento[i].getAttribute('mps'));				
				//si fecha3 es diferente de comprueba, quiere decir que hemos pasado a un dia nuevo
				if(fecha3!=comprueba){
					array[i]=[wind];
					comprueba=fecha3;
					
				}
				

			}
			
			return array.filter(Boolean);
		}

		function pintaHtml(objetoTiempo,data){ 
			var dias=objetoTiempo.dia;
			var inputs=document.getElementsByClassName("inputs");
			for (var i = 0; i < 5; i++) {

				inputs[i].setAttribute("value",objetoTiempo.dia[i][0]+" "+ objetoTiempo.dia[i][2]+" de "+objetoTiempo.dia[i][1]);
				inputs[i].setAttribute("id", i);
			}
			var inputs=document.getElementsByClassName("inputs");
			for (var i = 0; i < inputs.length; i++) {
				inputs[i].addEventListener("click", 
					function(){
						if(true){
							generaDesplegable(objetoTiempo,this.id);
							recogeImagen(data,this.id);
						}

					});

			}

		}
		
		function generaDesplegable(objetoTiempo,id){
			var centigrados="ºC";
			var porcentaje="%";
			var hectopascal="hPa";
			var millasPorSegundo="mps";
			var borrar=document.getElementById('desplegable2');
			var tiempo=objetoTiempo.tiempo[id];
			var minima=objetoTiempo.grados[id][0];
			var maxima=objetoTiempo.grados[id][1];
			var humedad=objetoTiempo.humedad[id];
			var presion=objetoTiempo.presion[id];
			var viento=objetoTiempo.viento[id];
			var h2=document.createElement("h2");	
			h2.setAttribute('style', 'white-space: pre;');	
			h2.textContent="Predicción: "+ tiempo+"\r\n";			
			h2.textContent+="Temperatura mínima: "+ minima+centigrados+"\r\n";
			h2.textContent+="Temperatura máxima: "+ maxima +centigrados+ "\r\n"; 
			h2.textContent+="Humedad: "+humedad+ porcentaje+"\r\n";
			h2.textContent+="Presión: "+ presion + hectopascal+" \r\n";
			h2.textContent+="Viento: "+ viento+millasPorSegundo+" \r\n";			
			var div2=document.createElement('div');
			div2.setAttribute('id', 'desplegable2');

			div2.appendChild(h2);
			document.getElementById('desplegable').replaceChild(div2, borrar);
			return document.getElementById('desplegable').appendChild(div2);

		}
		function recogeImagen(data,id){
			var dias=data.getElementsByTagName("time");
			var comprueba="dsdsd";	
			for(var i=0; i<dias.length; i++){
				dia=dias[i].getAttribute("from");
				var fecha3=new Date(dia).getDate();
				var symbol=data.getElementsByTagName('symbol');
				var symbol2=symbol[id].getAttribute('var');

				//si fecha3 es diferente de comprueba, quiere decir que hemos pasado a un dia nuevo
				if(fecha3!=comprueba){
					var sustituido=document.getElementById('imagen2');
					var div2=document.createElement('div');
					div2.setAttribute('id', 'imagen2');
					var img=document.createElement('img');
					img.setAttribute('src', 'http://openweathermap.org/img/w/'+symbol2+'.png')
					img.setAttribute('id', 'imagen')
					div2.appendChild(img);	
					document.getElementById('imagen').replaceChild(div2, sustituido);
					document.getElementById('imagen').appendChild(div2);				
					comprueba=fecha3;
				}
				
			}
			
		}
		
	/*
	function getLocation() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(showPosition);
			
		} else { 
			x.innerHTML = "Geolocation is not supported by this browser.";
		}
	}

	function showPosition(position) {
		console.log(position.coords.latitude);
		var urlWeather="http://api.openweathermap.org/data/2.5/forecast?lat="+ position.coords.latitude +"&lon="+ position.coords.longitude + "&units=metric&appid=14fe9989ca36d46bacd247989900d8d5&mode=xml";
		getXML(urlWeather).then(function(data) {  
			var city=document.getElementById("city");
			var ciudad=data.city.name;
			city.innerHTML="<h1> Tiempo en " + ciudad +"</h1>";
			var tiempo=document.getElementById('tiempo');
			var dia=document.getElementById('dia');
			for (var i = 0; i < data.list.length; i++) {
				
				var tiempo2=data.list[i].weather[0].main;
				var dia2=data.list[i].dt_txt;
				tiempo.innerHTML+="<h3>"+ "Día: "+  dia2 + "==>"+tiempo2 +" </h3><br>";
				
			}

		});
 
	}

	*/