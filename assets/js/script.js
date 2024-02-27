window.onload = function () {
//Respuesta
    function cambioResultado(respuesta) {
        if (respuesta === "-" || respuesta === "-, 0 cm" || respuesta === "- lb, 0 kg") {
            return "Sin datos";
        }
        else {
            return respuesta;
        }
    }
// Click
    $(document).ready(function () {
        $('button').on('click', function () {
            const idSuperHero = $('#input').val();
            let dataPoints = [];
            if (!(/^[0-9]+$/.test(idSuperHero))) {
                alert('Por favor, ingrese solo números.');
                return;
            }
            
 // ID     
            else if ((idSuperHero) > 732 || (idSuperHero) == 0) {
                alert("El ID proporcionado no tiene resultados. Por favor, ingrese un ID válido del 1 al 732.");
                return;
            }
 
            $('h2').show();
            $('.card').show();
//Ajax            
            $.ajax({
                type: "GET",
                url: `https://www.superheroapi.com/api.php/4905856019427443/${idSuperHero}`,
                dataType: "json",
                success: function (datos) {
                  let datosGrafico = datos.powerstats;
                    console.log("Success valor de datos obtenidos: ", datos);
                    console.log("Success valor de datosGrafico obtenidos: ", datosGrafico);
                    let encontrarDatos = false;
                 
                    for (let resultado in datosGrafico) {
                        //Creamos la variable numero para transformar a numero los datos
                        //entregados en las powerstats
                        let numero = parseInt(datosGrafico[resultado]);
                        //Creamos la logica para verificar si el dato entregado es 
                        //es un numero valido.
                        if (!isNaN(numero)) {
                            //Aqui indicamos si se encontraron datos, que se cree el grafico
                            encontrarDatos = true; 
                            dataPoints.push({
                                label: resultado,
                                y: numero
                            });
                        }
                    }
// Datos     
                    if (!encontrarDatos) {
                        dataPoints.push({
                            label: "Dato no disponible",
                            y: 1
                        });
                    }
//Canvas
                    let options = {
                        title: { text: `Estadísticas de Poder para ${datos.name}` },
                        data: [
                            {
                                type: "pie",
                                dataPoints: dataPoints
                            }
                        ]
                    };
                  
                    $("#chartContainer").CanvasJSChart(options);
                    $('.imagen').html(`<img src="${datos.image.url}" class="img-fluid rounded-start">`)
                    $('.card-title').text(`Nombre: ${datos.name}`)
                    $('.card-text').html(`
                        <p>-Conexiones: ${cambioResultado(datos.connections["group-affiliation"])}</p>
                        <p>-Publicado por: ${cambioResultado(datos.biography.publisher)}</p>
                        <p>-Ocupación: ${cambioResultado(datos.work.occupation)}</p>
                        <p>-Primera aparición: ${cambioResultado(datos.biography["first-appearance"])}</p>
                        <p>-Altura: ${cambioResultado(datos.appearance.height.join(', '))}</p>
                        <p>-Peso: ${cambioResultado(datos.appearance.weight.join(', '))}</p>
                        <p>-Alianzas: ${cambioResultado(datos.biography.aliases.join(', '))}</p>
                    `);
                },
//Error de conección
                error: function (error) {
                    console.log("error: ", error.status);
                    alert(`Intenta de nuevo ${this.url}: error ` + error.status);
                }
            });
        });
    });
};
