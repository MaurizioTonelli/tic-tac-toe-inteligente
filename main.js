class Juego {
  constructor() {
    this.tablero = new Cuadricula(this);
    this.puntuacionJugador = 0;
    this.puntuacionComputadora = 0;
    this.turnoActual = "X";
    this.ganador = null;
  }

  cambiarTurnoActual() {
    this.turnoActual = this.turnoActual === "X" ? "O" : "X";
  }

  jugarTurno() {
    this.cambiarTurnoActual();
    this.verificarFinDeJuego();
  }

  verificarFinDeJuego() {
    this.ganador =
      this.tablero.verificarEmpate() !== null
        ? this.tablero.verificarEmpate()
        : this.ganador;
    this.ganador =
      this.tablero.verificarFilasHorizontalesIguales() !== null
        ? this.tablero.verificarFilasHorizontalesIguales()
        : this.ganador;
    this.ganador =
      this.tablero.verificarFilasVerticalesIguales() !== null
        ? this.tablero.verificarFilasVerticalesIguales()
        : this.ganador;
    this.ganador =
      this.tablero.verificarFilasDiagonalesIguales() !== null
        ? this.tablero.verificarFilasDiagonalesIguales()
        : this.ganador;

    if (this.ganador) {
      this.actualizarPuntuacion();
      this.reiniciarJuego();
    }
  }

  actualizarPuntuacion() {
    alert(this.ganador + " Ganó el juego");
    if (this.ganador === "X") {
      this.puntuacionJugador++;
    } else if (this.ganador === "O") {
      this.puntuacionComputadora++;
    }
    document.querySelector("#puntuacion-jugador > p").textContent =
      this.puntuacionJugador;
    document.querySelector("#puntuacion-computadora > p").textContent =
      this.puntuacionComputadora;
  }

  reiniciarJuego() {
    this.ganador = null;
    this.turnoActual = "X";
    this.tablero = new Cuadricula(this);
  }
}

class Cuadro {
  constructor(index) {
    this.index = index;
  }

  crearCuadro(clase, index) {
    let div = document.createElement("div");
    div.classList.add(clase);
    div.classList.add("cuadro");
    div.setAttribute("data-index", index.toString());
    return div;
  }

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

class Cuadricula {
  constructor(juego) {
    this.tag = document.querySelector("#cuadricula");
    this.juego = juego;
    this.valores = ["", "", "", "", "", "", "", "", ""];
    this.dibujar();
  }

  verificarLineaDeCuadrosConMismoSimbolo(a, b, c) {
    if (
      this.valores[a] === this.valores[b] &&
      this.valores[a] === this.valores[c] &&
      this.valores[a] !== ""
    ) {
      //Regresa el símbolo que se repite en la línea
      return this.valores[a];
    }
    return null;
  }

  obtenerGanadorDeLinea(arr) {
    // Obtiene las lineas de 3 elementos
    for (let elem of arr) {
      if (this.verificarLineaDeCuadrosConMismoSimbolo(...elem) !== null) {
        return this.verificarLineaDeCuadrosConMismoSimbolo(...elem);
      }
    }
    return null;
  }

  verificarFilasHorizontalesIguales() {
    return this.obtenerGanadorDeLinea([
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
    ]);
  }

  verificarFilasVerticalesIguales() {
    return this.obtenerGanadorDeLinea([
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
    ]);
  }

  verificarFilasDiagonalesIguales() {
    return this.obtenerGanadorDeLinea([
      [0, 4, 8],
      [2, 4, 6],
    ]);
  }

  verificarEmpate() {
    for (let cuadro of this.valores) {
      if (cuadro === "") {
        return null;
      }
    }
    return "Nadie";
  }

  agregarEventosACuadro(cuadro) {
    cuadro.addEventListener("click", () => {
      if (cuadro.textContent === "" && !this.juego.ganador) {
        cuadro.textContent = this.juego.turnoActual;
        this.valores[parseInt(cuadro.dataset.index)] = this.juego.turnoActual;
        this.juego.jugarTurno();
      }
    });
  }

  construirCuadro(index) {
    let cuadro = new Cuadro(index).construir();
    this.agregarEventosACuadro(cuadro);
    return cuadro;
  }

  dibujar() {
    this.tag.innerHTML = "";
    for (let i = 0; i < 9; i++) {
      const cuadro = this.construirCuadro(i);
      this.tag.appendChild(cuadro);
    }
  }
}

function jugarTicTacToe() {
  const juego = new Juego();
}

jugarTicTacToe();
