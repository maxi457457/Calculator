class Calculadora {
    constructor(operacionAnteriorElemento, operacionActualElemento, historialElemento) {
        this.operacionAnteriorElemento = operacionAnteriorElemento
        this.operacionActualElemento = operacionActualElemento
        this.historialElemento = historialElemento;
        this.operacionesHistorialElemento = historialElemento.getElementsByTagName('div')[1];
        this.limpiar()
    }

    limpiar() {
        this.operacionActual = ''
        this.operacionAnterior = ''
    }

    agregarNumero(n) {
        // Evita que el usuario ingrese más de un caracter especial
        if (/[\/*+-.]$/.test(n) &&
            /[\/*+-]$/.test(this.operacionActual)) {
            this.operacionActual = this.operacionActual.substring(0, this.operacionActual.length - 1) + n
            return
        }

        // Chequea que no pueda ingresar mas de un punto decimal
        let temp = (this.operacionActual.toString() + n.toString()).split(/[\/*+-]/)

        let ultimoNumero = temp[temp.length - 1]

        if ((ultimoNumero.match(/\./g) || []).length > 1 && n == ".") {
            return
        }

        // Evita ingresar un número como 05 o 0000.5
        if (ultimoNumero[0] == "0" && this.operacionActual[this.operacionActual.length - 1] == "0" && n != "." && !this.operacionActual.includes(".")) {
            this.operacionActual = this.operacionActual.substring(0, this.operacionActual.length - 1) + n;
            return
        }

        this.operacionActual = this.operacionActual.toString() + n.toString()
    }
    calcular() {
        let cuenta
        cuenta = eval(this.operacionActual)
        this.sendOperationToServer({ operacion: this.operacionActual, resultado: cuenta });
        this.operacionActual = this.getDisplayNumber(cuenta)
        this.operacionAnterior = ''
    }

    calcularTemporal() {
        if (/[\/*+-]/.test(this.operacionActual) || /[\/*+-]$/.test(this.operacionActual)) {
            try {
                this.operacionAnterior = eval(this.operacionActual)
            } catch (error) {
                this.operacionAnterior = ""
            }
        }
    }

    // Funcion que formatea el numero ingresado. Limita el ingreso de ceros antes de un punto decimal, agrega comas.
    getDisplayNumber(number) {
        return number.toString()
    }

    actualizarPantalla() {
        this.operacionActualElemento.value = this.getDisplayNumber(this.operacionActual)
        this.operacionAnteriorElemento.innerText = this.operacionAnterior
        this.operacionActualElemento.scrollLeft = this.operacionActualElemento.scrollWidth
        this.operacionAnteriorElemento.scrollLeft = this.operacionAnteriorElemento.scrollWidth
    }

    sendOperationToServer(operationData) {
        fetch('/agregar-operacion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(operationData), // Enviar la operación y el resultado
        })
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(error => console.error(error));
    }

    borrarCaracter() {
        this.operacionActual = this.operacionActual.toString().slice(0, -1)
    }

    mostrarHistorial() {
        this.operacionesHistorialElemento.innerHTML = ''

        this.historial.map((item) => {
            const operacionContainer = document.createElement('div')
            operacionContainer.classList.add('operacion-container')
            const operacion = document.createElement('p')
            operacion.classList.add('operacion')
            const resultado = document.createElement('p')
            resultado.classList.add('resultado')
            operacion.innerText = `${item.operacion}`
            resultado.innerText = `${item.resultado}`
            operacionContainer.appendChild(operacion);
            operacionContainer.appendChild(resultado);
            this.operacionesHistorialElemento.appendChild(operacionContainer)
        })

        this.historialElemento.classList.add('active')
        this.operacionesHistorialElemento.scrollTop = this.operacionesHistorialElemento.scrollHeight
    }
    
    ocultarHistorial() {
        this.historialElemento.classList.remove('active')
    }

    async obtenerHistorial() {
        this.historial = []
        await fetch('/historial')
            .then(response => response.json())
            .then(data => {
                this.historial = data;
                this.mostrarHistorial();
            })
            .catch(error => console.error(error));
    }

}

const numeros = document.querySelectorAll('[data-numero]')
const operaciones = document.querySelectorAll('[data-operacion]')
const igual = document.querySelector('[data-igual]')
const clear = document.querySelector('[data-clear]')
const operacionAnteriorElemento = document.querySelector('[data-operacion-temporal]')
const operacionActualElemento = document.querySelector('[data-operacion-actual]')
const historialElemento = document.querySelector('.historial-container')
const historialBoton = document.querySelector('.history-logo')
const cerrarHistorialBoton = document.querySelector('.close-history-logo')

const calculadora = new Calculadora(operacionAnteriorElemento, operacionActualElemento, historialElemento)

numeros.forEach(boton => {
    boton.addEventListener('click', () => {
        calculadora.agregarNumero(boton.innerText)
        calculadora.calcularTemporal()
        calculadora.actualizarPantalla()
    })
})

operaciones.forEach(boton => {
    boton.addEventListener('click', () => {
        calculadora.agregarNumero(boton.innerText)
        calculadora.actualizarPantalla()
    })
})

igual.addEventListener('click', boton => {
    calculadora.calcular()
    calculadora.actualizarPantalla()
})

clear.addEventListener('click', boton => {
    calculadora.limpiar()
    calculadora.actualizarPantalla()
})

// Funcionamiento por teclado

window.addEventListener('keydown', (e) => {
    if (e.key == 'Enter') {
        calculadora.calcular()
    } else if (e.key == 'Backspace') {
        calculadora.borrarCaracter()
    } else if ((e.keyCode >= 48 && e.keyCode <= 57) || (e.key == "/" || e.key == "*" || e.key == "+" || e.key == "-" || e.key == ".")) {
        calculadora.agregarNumero(e.key)
    }
    calculadora.calcularTemporal()
    calculadora.actualizarPantalla();
})


historialBoton.addEventListener('click', () => {
    calculadora.obtenerHistorial()
})

cerrarHistorialBoton.addEventListener('click', () => {
    calculadora.ocultarHistorial()
})