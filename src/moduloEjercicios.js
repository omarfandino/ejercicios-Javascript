import basededatos from './basededatos.js';
const peliculas = basededatos.peliculas;

/**
* Devuelve el promedio de anios de estreno de todas las peliculas de la base de datos.
*/
export const promedioAnioEstreno = () => {
    // Ejemplo de como accedo a datos dentro de la base de datos
    const sumTotal = peliculas.reduce( (sumTotal, valorActual) => sumTotal + valorActual.anio, 0);
    const promedio = sumTotal / peliculas.length;
    return promedio;
};

/**
* Devuelve la lista de peliculas con promedio de critica mayor al numero que llega
* por parametro.
* @param {number} promedio
  */
export const pelicuasConCriticaPromedioMayorA = (promedio) => {
    const calificaciones = basededatos.calificaciones;

    const pelisPromMayor = [];
    peliculas.forEach( pelicula => {
        const calificacionesPelicula  = calificaciones.filter( calificacion => calificacion.pelicula === pelicula.id );
        const sumTotal = calificacionesPelicula.reduce( (sumTotal, valorActual) => sumTotal + valorActual.puntuacion, 0);
        const promedioCalificacion = sumTotal / calificacionesPelicula.length;
        if (promedioCalificacion > promedio) {
            pelisPromMayor.push({
                ...pelicula,
                promedio: promedioCalificacion
            });
        }
    });

    return pelisPromMayor;
};

/**
* Devuelve la lista de peliculas de un director
* @param {string} nombreDirector
*/
export const peliculasDeUnDirector = (nombreDirector) => {
    const directorEncontrado = basededatos.directores.find( director => director.nombre === nombreDirector );
    if (!directorEncontrado) {
        return 'Director NO encontrada!';
    }

    const pelicularDeDirector = peliculas.filter( pelicula => pelicula.directores.includes( directorEncontrado.id ) );

    return pelicularDeDirector;
};

/**
* Devuelve el promdedio de critica segun el id de la pelicula.
* @param {number} peliculaId
*/
export const promedioDeCriticaBypeliculaId = (peliculaId) => {
    const peliculaEncontrada = basededatos.peliculas.find( peliculas => peliculas.id === peliculaId );
    if (!peliculaEncontrada) {
        return 'Pelicula NO encontrada!';
    }

    const calificaciones = basededatos.calificaciones;
    const calificacionesPelicula  = calificaciones.filter( calificacion => calificacion.pelicula === peliculaEncontrada.id );
    const sumTotal = calificacionesPelicula.reduce( (sumTotal, valorActual) => sumTotal + valorActual.puntuacion, 0);
    const promedioCalificacion = sumTotal / calificacionesPelicula.length;

    return promedioCalificacion;
};

/**
 * Obtiene la lista de peliculas con alguna critica con
 * puntuacion excelente (critica >= 9).
 * En caso de no existir el criticas que cumplan, devolver un array vacio [].
 * Ejemplo del formato del resultado: 
 *  [
        {
            id: 1,
            nombre: 'Back to the Future',
            anio: 1985,
            direccionSetFilmacion: {
                calle: 'Av. Siempre viva',
                numero: 2043,
                pais: 'Colombia',
            },
            directores: [1],
            generos: [1, 2, 6]
        },
        {
            id: 2,
            nombre: 'Matrix',
            anio: 1999,
            direccionSetFilmacion: {
                calle: 'Av. Roca',
                numero: 3023,
                pais: 'Argentina'
            },
            directores: [2, 3],
            generos: [1, 2]
        },
    ],
 */
export const obtenerPeliculasConPuntuacionExcelente = () => {
    // Ejemplo de como accedo a datos dentro de la base de datos
    const calificaciones = basededatos.calificaciones;

    const pelisExcelente = [];
    peliculas.forEach( pelicula => {
        const calificacionesPelicula  = calificaciones.filter( calificacion => calificacion.pelicula === pelicula.id );
        const esExcelente = calificacionesPelicula.some( calificacion => calificacion.puntuacion >= 9 );
        if ( esExcelente ) {
            pelisExcelente.push(pelicula);
        }
    });

    return pelisExcelente;
};

/**
 * Devuelve informacion ampliada sobre una pelicula.
 * Si no existe la pelicula con dicho nombre, devolvemos undefined.
 * Ademas de devolver el objeto pelicula,
 * agregar la lista de criticas recibidas, junto con los datos del critico y su pais.
 * Tambien agrega informacion de los directores y generos a los que pertenece.
 * Ejemplo de formato del resultado para 'Indiana Jones y los cazadores del arca perdida':
 * {
            id: 3,
            nombre: 'Indiana Jones y los cazadores del arca perdida',
            anio: 2012,
            direccionSetFilmacion: {
                calle: 'Av. Roca',
                numero: 3023,
                pais: 'Camboya'
            },
            directores: [
                { id: 5, nombre: 'Steven Spielberg' },
                { id: 6, nombre: 'George Lucas' },
            ],
            generos: [
                { id: 2, nombre: 'Accion' },
                { id: 6, nombre: 'Aventura' },
            ],
            criticas: [
                { critico: 
                    { 
                        id: 3, 
                        nombre: 'Suzana Mendez',
                        edad: 33,
                        pais: 'Argentina'
                    }, 
                    puntuacion: 5 
                },
                { critico: 
                    { 
                        id: 2, 
                        nombre: 'Alina Robles',
                        edad: 21,
                        pais: 'Argentina'
                    }, 
                    puntuacion: 7
                },
            ]
        },
 * @param {string} nombrePelicula
 */
export const expandirInformacionPelicula = (nombrePelicula) => {
    let peliculaEncontrada = peliculas.find( pelicula => pelicula.nombre === nombrePelicula );
    if (!peliculaEncontrada) {
        return undefined;
    }

    for (const property in peliculaEncontrada) {
        if( Array.isArray(peliculaEncontrada[property]) ) {
            const expandirInfo = peliculaEncontrada[property];
            const infoExpandida = expandirInfo.map( idInfo => {
                const infoEncontrada = basededatos[property].find( element => element.id === idInfo );
                return infoEncontrada;
            });

            peliculaEncontrada = {
                ...peliculaEncontrada,
                [property]: infoExpandida
            };

        }
    }

    const calificaciones = basededatos.calificaciones;
    const criticos = basededatos.criticos;
    let calificacionesPelicula  = calificaciones.filter( calificacion => calificacion.pelicula === peliculaEncontrada.id );
    calificacionesPelicula = calificacionesPelicula.map( calificacion => {
        const infoCritico = criticos.find( critico => critico.id === calificacion.critico );

        const peliConInfo = {
            ...calificacion,
            critico: infoCritico
        };
        delete peliConInfo.pelicula;

        return peliConInfo;
    });

    peliculaEncontrada = {
        ...peliculaEncontrada,
        criticas: calificacionesPelicula
    }
    return peliculaEncontrada;
};
