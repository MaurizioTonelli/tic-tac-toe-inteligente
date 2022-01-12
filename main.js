class Nodo {
  constructor(computadora, posicion) {
    this.computadora = computadora;
    this.posicion = posicion;
    this.evaluacion = this.computadora.evaluarPosicion(this.posicion);
  }

  obtenerHijos() {
    let hijos = [];
    let copiaPosicion = [...this.posicion];
    for (let i = 0; i < this.posicion.length; i++) {
      if (this.posicion[i] === "") {
        copiaPosicion[i] = this.obtenerSimboloSiguiente(this.posicion);
        let nodoHijo = new Nodo(this.computadora, copiaPosicion);
        hijos.push({ nodo: nodoHijo, indice: i });
        copiaPosicion = [...this.posicion];
      }
    }
    return hijos;
  }

  //Observa una posición y determina si el próximo jugador es una X o un O
  obtenerSimboloSiguiente(posicion) {
    let numeroDeX = posicion.filter((cuadro) => cuadro === "X").length;
    let numeroDeO = posicion.filter((cuadro) => cuadro === "O").length;
    if (numeroDeX - numeroDeO === 1) {
      return "O";
    } else {
      return "X";
    }
  }
}

class Computadora {
  constructor(cuadricula, pieza) {
    this.cuadricula = cuadricula;
    this.pieza = pieza;
    // Crea un nodo con la posición actual
    this.nodo = new Nodo(this, this.cuadricula.valores);
  }

  // Algoritmo que recorre el árbol de posiciones para determinar el valor (-1, 0, 1) de la siguiente jugada
  minimax(nodo, profundidad, jugadorMaximizador, indice = null) {
    let valor;
    let exploracion;
    let indiceElegido = null;
    if (
      (profundidad =
        0 || nodo.obtenerHijos().length == 0 || nodo.evaluacion !== 0)
    ) {
      return { valor: this.evaluarPosicion(nodo.posicion), indice };
    }
    if (jugadorMaximizador) {
      valor = -100000;
      for (let hijo of nodo.obtenerHijos()) {
        exploracion = this.minimax(
          hijo.nodo,
          profundidad - 1,
          false,
          hijo.indice
        );
        if (exploracion.valor > valor) {
          valor = exploracion.valor;
          indiceElegido = hijo.indice;
        }
      }
      return { valor, indice: indiceElegido };
    } else {
      valor = 100000;
      for (let hijo of nodo.obtenerHijos()) {
        exploracion = this.minimax(
          hijo.nodo,
          profundidad - 1,
          true,
          hijo.indice
        );
        if (exploracion.valor < valor) {
          valor = exploracion.valor;
          indiceElegido = hijo.indice;
        }
      }
      return { valor, indice: indiceElegido };
    }
  }

  // Utiliza el algoritmo minimax para obtener el índice de la cuadrícula donde se debe colocar la siguiente pieza para la mejor jugada
  obtenerMejorJugada() {
    // Actualiza la posición del nodo a la más actual
    this.nodo = new Nodo(this, this.cuadricula.valores);
    if (this.pieza == "O") {
      return this.minimax(this.nodo, 20, false).indice;
    } else {
      return this.minimax(this.nodo, 20, true).indice;
    }
  }

  //Evalua si cierta posición con formato ['','','','','','','','',''] es una victoria para 'O' (-1), para 'X' (1) o empate (0)
  evaluarPosicion(posicion) {
    if (this.cuadricula.obtenerGanadorDePosicion(posicion) === "X") {
      return 1;
    } else if (this.cuadricula.obtenerGanadorDePosicion(posicion) === "O") {
      return -1;
    } else {
      return 0;
    }
  }
}

// Mantiene el estado de los turnos del juego actual, implementa la lógica del juego y utiliza otras clases para decidir el término del juego y jugadas.
class Juego {
  constructor(controlador, turnoDeComputadora) {
    this.controlador = controlador;
    this.tablero = new Cuadricula(this);
    this.computadora = new Computadora(this.tablero, turnoDeComputadora);
    this.turnoDeComputadora = turnoDeComputadora;
    this.turnoActual = "X";
    this.ganador = null;
    if (this.turnoActual === this.turnoDeComputadora) {
      this.jugarTurno();
    }
  }

  cambiarTurnoActual() {
    this.turnoActual = this.turnoActual === "X" ? "O" : "X";
  }

  jugarTurno(indice = null) {
    //No permitir jugar más cuando ya haya un ganador
    if (this.ganador) return;
    //Si no es el turno del jugador, salir de la función cuando intente dar clic en un cuadro
    if (indice !== null && this.turnoActual === this.turnoDeComputadora) return;
    //Juega el turno del jugador
    if (this.turnoActual !== this.turnoDeComputadora) {
      this.tablero.dibujarJugada(indice);
      this.cambiarTurnoActual();
      if (this.verificarFinDeJuego()) return;
    }
    //Juega el turno de la computadora
    if (this.turnoActual === this.turnoDeComputadora) {
      let jugadaComputadora = this.computadora.obtenerMejorJugada();
      if (jugadaComputadora !== null) {
        this.tablero.dibujarJugada(jugadaComputadora);
      }
      this.cambiarTurnoActual();
      if (this.verificarFinDeJuego()) return;
    }
  }

  escribirGanadorEnDOM() {
    document.querySelector("#ganador").textContent =
      this.ganador + " ganó la ronda";
  }

  verificarFinDeJuego() {
    this.ganador = this.tablero.obtenerGanadorDePosicion();
    if (this.ganador) {
      this.controlador.actualizarPuntuacion();
      this.escribirGanadorEnDOM();
      return true;
    }
    return false;
  }
}

// Clase que mantiene los parámetros permanentes del juego, como la puntuación, y quien tiene el primer turno
class ControladorDeJuego {
  constructor() {
    // El jugador inicia primero por default
    this.juego = new Juego(this, "O");
    this.puntuacionJugador = 0;
    this.puntuacionComputadora = 0;
  }

  actualizarPuntuacion() {
    if (
      this.juego.ganador !== this.juego.turnoDeComputadora &&
      this.juego.ganador !== "Nadie"
    ) {
      this.puntuacionJugador++;
    } else if (
      this.juego.ganador === this.juego.turnoDeComputadora &&
      this.juego.ganador !== "Nadie"
    ) {
      this.puntuacionComputadora++;
    }
    document.querySelector("#puntuacion-jugador > p").textContent =
      this.puntuacionJugador;
    document.querySelector("#puntuacion-computadora > p").textContent =
      this.puntuacionComputadora;
  }

  // Reinicia el juego con un turno nuevo para la computadora
  reiniciarJuego(turnoDeComputadora = null) {
    this.juego = new Juego(this, turnoDeComputadora);
  }
}

//Define un cuadro de cierto indice dentro de la cuadrícula de Tic Tac Toe
class Cuadro {
  constructor(index) {
    this.index = index;
  }

  // Funcion auxiliar que crea un cuadro como elementos de HTML
  crearCuadro(clase, index) {
    let div = document.createElement("div");
    div.classList.add(clase);
    div.classList.add("cuadro");
    div.setAttribute("data-index", index.toString());
    return div;
  }

  // Devuelve un div con sus clases correspondientes al cuadro según su índice, ya que todos tienen diferentes bordes
  construir() {
    switch (this.index) {
      case 0:
        return this.crearCuadro("cuadro-superior-izquierdo", this.index);
      case 1:
        return this.crearCuadro("cuadro-superior-central", this.index);
      case 2:
        return this.crearCuadro("cuadro-superior-derecho", this.index);
      case 3:
        return this.crearCuadro("cuadro-central-izquierdo", this.index);
      case 4:
        return this.crearCuadro("cuadro-central", this.index);
      case 5:
        return this.crearCuadro("cuadro-central-derecho", this.index);
      case 6:
        return this.crearCuadro("cuadro-inferior-izquierdo", this.index);
      case 7:
        return this.crearCuadro("cuadro-inferior-central", this.index);
      case 8:
        return this.crearCuadro("cuadro-inferior-derecho", this.index);
    }
  }
}

// Define la cuadrícula completa del juego de Tic Tac Toe
class Cuadricula {
  constructor(juego) {
    this.tag = document.querySelector("#cuadricula");
    this.juego = juego;
    this.valores = ["", "", "", "", "", "", "", "", ""];
    this.dibujar();
  }

  // Función genérica que revisa 3 símbolos de una posicion dada para verificar si son iguales, y regresa uno si es que hay. Si no recibe posición, utiliza la actual del tablero
  verificarLineaDeCuadrosConMismoSimbolo(a, b, c, posicion) {
    let posicionAEvaluar = this.valores;
    if (posicion !== null) {
      posicionAEvaluar = posicion;
    }
    if (
      posicionAEvaluar[a] === posicionAEvaluar[b] &&
      posicionAEvaluar[a] === posicionAEvaluar[c] &&
      posicionAEvaluar[a] !== ""
    ) {
      //Regresa el símbolo que se repite en la línea
      return posicionAEvaluar[a];
    }
    return null;
  }
  // Función generica que obtiene una arreglo de índices de líneas [[a,b,c], ...] para verificar si tienen un símbolo igual
  obtenerGanadorDeLinea(arr, posicion) {
    // Obtiene las lineas de 3 elementos
    for (let elem of arr) {
      if (
        this.verificarLineaDeCuadrosConMismoSimbolo(...elem, posicion) !== null
      ) {
        return this.verificarLineaDeCuadrosConMismoSimbolo(...elem, posicion);
      }
    }
    return null;
  }

  // De acuerdo con una posición dada con el formato ['','','','','','','','',''], checa las lineas horizontales para corroborar si hay un ganador
  verificarFilasHorizontalesIguales(posicion) {
    return this.obtenerGanadorDeLinea(
      [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
      ],
      posicion
    );
  }

  // De acuerdo con una posición dada con el formato ['','','','','','','','',''], checa las lineas verticales para corroborar si hay un ganador
  verificarFilasVerticalesIguales(posicion) {
    return this.obtenerGanadorDeLinea(
      [
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
      ],
      posicion
    );
  }

  // De acuerdo con una posición dada con el formato ['','','','','','','','',''], checa las lineas diagonales para corroborar si hay un ganador
  verificarFilasDiagonalesIguales(posicion) {
    return this.obtenerGanadorDeLinea(
      [
        [0, 4, 8],
        [2, 4, 6],
      ],
      posicion
    );
  }

  // De acuerdo con una posición dada con el formato ['','','','','','','','',''], decide si existe un empate
  verificarEmpate(posicion) {
    let posicionAEvaluar = this.valores;
    if (posicion !== null) {
      posicionAEvaluar = posicion;
    }
    for (let cuadro of posicionAEvaluar) {
      if (cuadro === "") {
        return null;
      }
    }
    return "Nadie";
  }

  // De acuerdo con una posición dada con el formato ['','','','','','','','',''], decide quien es el ganador
  obtenerGanadorDePosicion(posicion = null) {
    if (this.verificarFilasHorizontalesIguales(posicion) !== null)
      return this.verificarFilasHorizontalesIguales(posicion);

    if (this.verificarFilasVerticalesIguales(posicion) !== null)
      return this.verificarFilasVerticalesIguales(posicion);

    if (this.verificarFilasDiagonalesIguales(posicion) !== null)
      return this.verificarFilasDiagonalesIguales(posicion);

    return this.verificarEmpate(posicion);
  }

  //Obtiene el cuadro del HTML que tenga el indice correspondiente
  obtenerCuadroConIndice(indice) {
    return document.querySelector(`[data-index='${indice}']`);
  }
  //Función auxiliar que dibuja el símbolo 'O' o 'X' en un lugar de la cuadrícula
  dibujarJugada(indice) {
    this.obtenerCuadroConIndice(indice).textContent = this.juego.turnoActual;
    this.valores[parseInt(indice)] = this.juego.turnoActual;
  }

  AgregarEventoDeClickACuadro(cuadro) {
    cuadro.addEventListener("click", () => {
      if (this.valores[parseInt(cuadro.dataset.index)] === "") {
        this.juego.jugarTurno(parseInt(cuadro.dataset.index));
      }
    });
  }

  //Instancía cada cuadro de la cuadrícula de Tic Tac Toe
  construirCuadro(index) {
    let cuadro = new Cuadro(index).construir();
    this.AgregarEventoDeClickACuadro(cuadro);
    return cuadro;
  }
  // Dibuja la cuadrícula de Tic Tac Toe en el HTML
  dibujar() {
    this.tag.innerHTML = "";
    for (let i = 0; i < 9; i++) {
      const cuadro = this.construirCuadro(i);
      this.tag.appendChild(cuadro);
    }
  }
}

function jugarTicTacToe() {
  const juego = new ControladorDeJuego();
  document.querySelector("#reiniciar").addEventListener("click", () => {
    let turnoDeComputadora = document.querySelector("#primer-jugador").value;
    //Inicia un nuevo juego y asigna a la computadora el turno seleccionado
    juego.reiniciarJuego(turnoDeComputadora);
  });
}

//Punto de entrada de la aplicación
jugarTicTacToe();
