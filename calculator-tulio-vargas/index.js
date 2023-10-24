document.addEventListener('DOMContentLoaded', () => {
    cargarHistorial(); //recupera el historial del localStorage
});

const limpiarCampo = () => {
    document.calc.txt.value = '';
};

const mostrarOcultarHistorial = () => {
    const historial = document.getElementById('historial');
    if (historial.style.display === 'none') {
        historial.style.display = 'block';
    } else {
        historial.style.display = 'none';
    }
};

const borrarHistorial = () => {
    historialData = []; 
    guardarHistorial(); 
    mostrarHistorial(); 
};

let historial = document.getElementById('historial');
let historialData = [];

function cargarHistorial() {
    // recuperar el historial del localStorage
    const historialGuardado = localStorage.getItem('historialData');
    if (historialGuardado) {
        historialData = JSON.parse(historialGuardado);
        mostrarHistorial();
    }
}

function guardarHistorial() {
    // guardar el historial en el localStorage
    localStorage.setItem('historialData', JSON.stringify(historialData));
}

function mostrarHistorial() {
    // mostrar el historial en el DOM
    historial.innerHTML = ''; // limpiar el historial actual
    historialData.forEach(item => {
        const para = document.createElement('p');
        para.innerText = item.operacion;
        historial.appendChild(para);
    });
}

const calcul = (v) => {
    const result = eval(v);
    const data = { operacion: `${v} = ${result}` };
    historialData.push(data); 
    guardarHistorial(); 
    mostrarHistorial(); 
    return result;
}

const backspace = (b) => b.slice(0, b.length - 1);




















/*document.addEventListener('DOMContentLoaded', () => {
    console.log('La página ha cargado.')
});

const limpiarCampo = () => {
    document.calc.txt.value = ''
};

const mostrarOcultarHistorial = () => {
    const historial = document.getElementById('historial');
    if (historial.style.display === 'none') {
        historial.style.display = 'block'
    } else {
        historial.style.display = 'none'
    }
};

let historial = document.getElementById('historial');

const calcul = (v) => {
    const para = document.createElement('p')
    const data = `${v} = ${eval(v)}`;
    para.innerText = data
    historial.appendChild(para)
    return eval(v)
}

const backspace = (b) => b.slice(0, b.length - 1)*/