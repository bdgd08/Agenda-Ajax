const   formularioContactos = document.querySelector('#contacto'),
        listadoContactos = document.querySelector('#listado-contacto tbody');

eventListeners();

function eventListeners() {
  formularioContactos.addEventListener('submit', leerFormulario);

  if(listadoContactos) {
       listadoContactos.addEventListener('click', eliminarContacto);
  }
}

function leerFormulario(e) {
  e.preventDefault();

  const nombre = document.querySelector('#nombre').value,
        empresa = document.querySelector('#empresa').value,
        telefono = document.querySelector('#telefono').value;
        accion = document.querySelector('#accion').value;

  if(nombre === '' || empresa === '' || telefono === '') {
    //2 parametros texto y clase
    mostrarNotificacion('Todos los Campos son Obligatorios', 'error');
  }
  else {
    //Pasa la validaciòn, crear llamado a Ajax
    const infoContacto = new FormData();
    infoContacto.append('nombre', nombre);
    infoContacto.append('empresa', empresa);
    infoContacto.append('telefono', telefono);
    infoContacto.append('accion', accion);

    if(accion == 'crear') {
      //Crearemos un nuevo contacto
      insertarBD(infoContacto);
    } else {
      //Editar el contacto
    }
  }
}

// Inserta en la base de datos via Ajax
function insertarBD(datos) {
  //Llamado Ajax

  //Crear el objeto
  const xhr = new XMLHttpRequest();

  //Abrir la conexiòn
  xhr.open('POST', 'inc/modelos/modelo-contactos.php', true);

  //Pasar los datos
  xhr.onload = function() {
    if(this.status === 200) {

      console.log(JSON.parse( xhr.responseText ));
      console.log(xhr.responseText);

      //Leemos la respuesta de php
      const respuesta = JSON.parse(xhr.responseText);

      //Inserta un nuevo elemento a la tabla
      // console.log(respuesta.datos);
      const nuevoContacto = document.createElement('tr');
      nuevoContacto.innerHTML = `
      <td>${respuesta.datos.nombre}</td>
      <td>${respuesta.datos.empresa}</td>
      <td>${respuesta.datos.telefono}</td>
      `;

      //Crear contenedor para los botones
      const contenedorAcciones = document.createElement('td');

      //Crear el icono de Editar
      const iconoEditar = document.createElement('i');
      iconoEditar.classList.add('fas', 'fa-pen-square');

      //Crear el enlace para editar
      const btnEditar = document.createElement('a');
      btnEditar.appendChild(iconoEditar);
      btnEditar.href = `editar.php?id=${respuesta.datos.id_insertado}`;
      btnEditar.classList.add('btn', 'btn-editar');

      //Agregar al padre
      contenedorAcciones.appendChild(btnEditar);

      //Crear el icono de eliminar
      const iconoEliminar = document.createElement('i');
      iconoEliminar.classList.add('fas', 'fa-trash-alt');

      //Crear el enlace para editar
      const btnEliminar = document.createElement('button');
      btnEliminar.appendChild(iconoEliminar);
      btnEliminar.setAttribute('data-id', respuesta.datos.id_insertado);
      btnEliminar.classList.add('btn', 'btn-borrar');

      //agregar al padre
      contenedorAcciones.appendChild(btnEliminar);

      //Agregar al tr;
      nuevoContacto.appendChild(contenedorAcciones);

      //agregarlo con los contactos
      listadoContactos.appendChild(nuevoContacto);

      //Resetear formulario
      document.querySelector('form').reset();

      //Mostrar la notificacion

      mostrarNotificacion('Contacto Creado Correctamente', 'correcto');




    }
  }

  //Enviar los datos
  xhr.send(datos)
}

//Eliminar el contacto

function eliminarContacto(e) {
  if(e.target.parentElement.classList.contains('btn-borrar')) {
    //tomar id
    const id = e.target.parentElement.getAttribute('data-id');

    //preguntar al usuario
    const respuesta = confirm('¿Estás Seguro (a) ?');

    if(respuesta) {
      //Llamado a Ajax
      //Crear el objeto
      const xhr = new XMLHttpRequest();


      //abrir la conexion}
      xhr.open('GET', `inc/modelos/modelo-contactos.php?id=${id}&accion=borrar`, true);

      //leer la respuesta
      xhr.onload = function() {
        if(this.status === 200) {
          const resultado = JSON.parse(xhr.responseText);

          if(resultado.respuesta == 'correcto') {
            //Eliminar registro del DOM
            console.log(e.target.parentElement.parentElement.parentElement);
            e.target.parentElement.parentElement.parentElement.remove();
            //Mostrar notificación
            mostrarNotificacion('Contacto eliminado', 'correcto');

          } else {
            //Mostrar una notificación
            mostrarNotificacion('Hubo un error...', 'error');
          }
        }
      }

      //enviar la peticion
      xhr.send();
    }
  }
}

function mostrarNotificacion(mensaje, clase) {
  const notificacion = document.createElement('div');
  notificacion.classList.add(clase, 'notificacion', 'sombra');
  notificacion.textContent = mensaje;

  //Formulario
  formularioContactos.insertBefore(notificacion, document.querySelector('form legend'));

  //OCultar y Mostrar notificaciòn
  setTimeout(() => {
    notificacion.classList.add('visible');

    setTimeout(() => {
      notificacion.classList.remove('visible');

      setTimeout(() => {
        notificacion.remove();
      }, 500);
      notificacion.remove();
    }, 3000);
  }, 100);
}
