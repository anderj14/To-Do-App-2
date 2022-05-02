console.log('suscribete')

// obtenemos el elemento
const formulario = document.getElementById('formulario')
const input = document.getElementById('input')
const listaTarea = document.getElementById('lista-tarea')
const template = document.getElementById('template').content
const fragment = document.createDocumentFragment()

// Aqui se coleccionan los objetos o los arrays
// La coleccion de objetos es mas rapido la obtencion
// se usa let porque se va a sobreescribir el objeto
/*
let tareas = {
    1640635276362: {
        id: 1640635276362,
        texto: 'tarea 1',
        estado: false,
    },
    1640635487551: {
        id: 1640635487551,
        texto: 'tarea 2',
        estado: false,
    }
}*/

let tareas = {}

document.addEventListener('DOMContentLoaded', () => {
    // pintamos el localStorage
    if(localStorage.getItem('tareas')){
        // si es verdadero pasamos todo, convirtiendolo a JSON
        tareas = JSON.parse(localStorage.getItem('tareas'))
    }
    pintarTareas()
})
// creamos el addEventLitener de lista-tarea y accedemos a ella
listaTarea.addEventListener('click', e => {
    btnAcccion(e)
})

//console.log(Date.now())

/*Los eventos dan funcionalidad a los elementos, en este caso se usa submit,
se pasa el evento, junto con presentDefault() */

// stopPropagation detiene las consecuencia de los eventos del contenedor padre
formulario.addEventListener('submit', e => {
    // presentDefault evita el comportamiento por defecto de hmtl, osea el get
    e.preventDefault()
    //console.log(e.target[0].value);
   // console.log(e.target.querySelector('input').value);
   // console.log(input.value)
   //Con cualquiera de estas se puede acceder al input

    setTarea(e)
})

// Aqui empujamos el texto y lo mandamos a la coleccion de objetos
const setTarea = e => {
    // aqui se valida el texto 
    // trim() nos permite limpiar, si el usuario no escribio nada
    if(input.value.trim() === ''){
        console.log('Esta vacio')
        return
        // con return sale de la funcion
    }

    // se contruye el objeto
    /* Aqui se crea una tarea 
    id: crea un decimal random
    texto: el texto en el input
    estado: siempre en falso */
    const tarea = {
        id: Date.now(),
        texto: input.value,
        estado: false,
    }
    // llamamos a tarea, el cual va a tener un id
    tareas[tarea.id] = tarea
    //console.log(tareas);
    // Con reset() se reinicia el formulario
    formulario.reset()
    // Con focus() hace que el input este siempre seleccionado
    input.focus()

    // pintamos las tareas
    pintarTareas()
}

// aqui se pintaran las tareas con funcion de flechas
const pintarTareas = () => {
    // respaldamos las tareas
    localStorage.setItem('tareas', JSON.stringify(tareas))



    // preguntamos si viene array vacio, y si lo hay agregamos el html
    if(Object.values(tareas).length === 0){
        listaTarea.innerHTML = `
            <div class="alert alert-dark text center">
                No hay tareas 😃
            </div>
        `
        return
    }

    listaTarea.innerHTML = ''
    // aqui recorremos las tareas, con forEach()
    Object.values(tareas).forEach(tarea => {
        /* cuando se usa template primero se hace primero
        el clon para cluego modificar el template, si se 
        clona al final al momento de modificarlo vamos a tener el mismo
        template pero modificado*/
        const clone = template.cloneNode(true);
        // luego se selecciona el elemento a modificar, que sera igual a tarea.texto
        clone.querySelector('p').textContent = tarea.texto
        // hacemos modificaciones con los botones
       
        if(tarea.estado){
            //aqui cambiamos el fondo del alert
            clone.querySelector('.alert').classList.replace('alert-warning', 'alert-primary')
            // cambiamos el boton a otro
            clone.querySelectorAll('.fas')[0].classList.replace('fa-check-circle', 'fa-undo-alt')
            // subrayamos el parrafo
            clone.querySelector('p').style.textDecoration = 'line-through'
        }

        // creamos id
        clone.querySelectorAll('.fas')[0].dataset.id = tarea.id
        clone.querySelectorAll('.fas')[1].dataset.id = tarea.id
        // aqui se utiliza el fragment, para que no pase el refload
        fragment.appendChild(clone)

        //el clone y fragment es bueno con forEach
    })

    listaTarea.appendChild(fragment);
}

// declaramos el btnAccion

const btnAcccion = e=> {
    // detectamos la etiqueta i
    //console.log(e.target.classList.contains('fa-check-circle'))
    if(e.target.classList.contains('fa-check-circle')) {
        //console.log(e.target.dataset.id);
        // hacemos que tarea en su id cambie a true
        tareas[e.target.dataset.id].estado = true
        // luego tenemos que pintar nuevamente las tareas
        pintarTareas()
        console.log(tareas);
    }
    // tema para eliminar el boton
    if(e.target.classList.contains('fa-minus-circle')) {
        // elimina los objetos que le pasemos como id
        delete tareas[e.target.dataset.id]
        // pintamos tareas
        pintarTareas()
        //console.log(tareas)

    }

    //volvemos al icono original
    
    if(e.target.classList.contains('fa-undo-alt')) {
        //console.log(e.target.dataset.id);
        // hacemos que tarea en su id cambie a false
        tareas[e.target.dataset.id].estado = false
        // luego tenemos que pintar nuevamente las tareas
        pintarTareas()
    }
    
    // si detecta mas addEventListener, fuera de aqui los tira fuera
    e.stopPropagation()
} 