class Cuadro {
  constructor(index) {
    this.index = index;
  }

  crearCuadroConClase(clase) {
    let div = document.createElement("div");
    div.classList.add(clase);
    div.classList.add("cuadro");
    return div;
  }

  construir() {
    switch (this.index) {
      case 0:
        //ESQUINA SUPERIOR IZQUIERDA
        return this.crearCuadroConClase("cuadro-superior-izquierdo");
      case 1:
        //ESQUINA SUPERIOR CENTRAL
        return this.crearCuadroConClase("cuadro-superior-central");
      case 2:
        //ESQUINA SUPERIOR DERECHA
        return this.crearCuadroConClase("cuadro-superior-derecho");
      case 3:
        //ESQUINA CENTRAL IZQUIERDA
        return this.crearCuadroConClase("cuadro-central-izquierdo");
      case 4:
        //CUADRO CENTRAL
        return this.crearCuadroConClase("cuadro-central");
      case 5:
        //ESQUINA CENTRAL DERECHA
        return this.crearCuadroConClase("cuadro-central-derecho");
      case 6:
        //ESQUINA INFERIOR IZQUIERDA
        return this.crearCuadroConClase("cuadro-inferior-izquierdo");
      case 7:
        //ESQUINA INFERIOR CENTRAL
        return this.crearCuadroConClase("cuadro-inferior-central");
      case 8:
        //ESQUINA INFERIOR DERECHA
        return this.crearCuadroConClase("cuadro-inferior-derecho");
    }
  }
}

class Cuadricula {
  static tag = document.querySelector("#cuadricula");

  construirCuadro(index) {
    let cuadro = new Cuadro(index);
    return cuadro.construir();
  }

  dibujarCuadricula() {
    for (let i = 0; i < 9; i++) {
      const cuadro = this.construirCuadro(i);
      Cuadricula.tag.appendChild(cuadro);
    }
  }
}

function crearCuadricula() {
  const cuadricula = new Cuadricula();
  cuadricula.dibujarCuadricula();
}

crearCuadricula();
