
class Universo {

    constructor(
        data,
        { x = random(70, windowWidth - 70),                    //Coordenada en x del nodo
            y = random(70, windowHeight - 70),                   //Coordenada en y del nodo
            r = random(50, 100),                                //Radio del nodo
            c = random(["blue", "yellow", "green", "black"])      //Color del nodo
        }) {
        //Data es un parametro obligatorio
        this.data = data;
        //X Y R son opcionales (existen por y para el visualizador)
        this.x = x;
        this.y = y;
        this.r = r;
        this.c = c;
        //Las conexiones del universo se definen en el multiverso
        this.conexiones = [];
    }

    Print(col,sw,hov) {
        //Imprimir conexiones
        for (let j = 0; j < this.conexiones.length; j++) {
            stroke(col);
            strokeWeight(sw);
            line(this.x,
                this.y,
                this.conexiones[j].x,
                this.conexiones[j].y);
            if(!hov){
                strokeWeight(7);
                this.conexiones[j].Print(col,sw,false);
                
            }
        }
        //Imprimir nodos
        push();
        fill(this.c);
        stroke(col);
        strokeWeight(sw);
        circle(this.x, this.y, this.r);
        fill('white');
        textSize(this.r * 0.17333);
        stroke('black');
        strokeWeight(2);
        text(this.data, this.x - (this.r * 0.333), this.y + (this.r * 0.0314));
        //Image(this.data, this.x - (this.r * 0.333), this.y + (this.r * 0.0314))
        pop();
    }

    VerHover_Universo() {
        this.Hover();
        for (let j = 0; j < this.conexiones.length; j++) {
            this.conexiones[j].VerHover_Universo();
        }
    }
    
    Hover() {
        let d = dist(mouseX, mouseY, this.x, this.y);
        if (d < this.r / 2) {
            //Highlight de los caminos referentes al nodo
            //erase();
            this.Print('purple',7,true);
            //noErase()
        }
    }

    Keypressed(multiverso,key) {
        if(multiverso.viaje.size>0){
        switch(key){
            case (27):
                print("Tu viaje ha sido de " + multiverso.viaje.size + " franqucicias");
                delete (multiverso.viaje);
                multiverso.viaje = new ListaEnlazada();
                break;
        }
    }

        }
    


    ////////////////////////////////////////////////////////////

    VerClicked_Universo(multiverso) {
        this.Clicked(multiverso); 
        for (let j = 0; j < this.conexiones.length; j++) {
            this.conexiones[j].VerClicked_Universo(multiverso);
        }
    }

    Clicked(multiverso){
        let d = dist(mouseX,mouseY,this.x,this.y);
        if (d<this.r/2){
            //Añadir el universo tocado a la lista de recorrido
            if(multiverso.viaje.size==0){
                multiverso.viaje.PushBack(this);
            }
            else if (multiverso.viaje.size==1){
                if(multiverso.viaje.head.data!=this){
                    if(multiverso.viaje.head.data.conexiones.includes(this)){
                        multiverso.viaje.PushBack(this);
                    }
                    
                }
            }
            else{
                if(multiverso.viaje.tail.data!=this){
                    if(multiverso.viaje.tail.data.conexiones.includes(this)){
                        multiverso.viaje.PushBack(this);
                    }
                }
            }
            text(multiverso.viaje.Print(),50,20);
        }
    }
    
    VerKeypressed_Universo(multiverso,key) {
        this.Keypressed(multiverso,key);
        for (let j = 0; j < this.conexiones.length; j++) {
            this.conexiones[j].VerKeypressed_Universo(multiverso,key);
        }
    }
}

class Multiverso {

    //Solo es posible viajar a multiversos cercanos 
    //Puede conectarse con maximo 6 multiversos
    //Solo es posible viajar en una direccion (ida)

    constructor(max_conexiones) {
        //Parametro obligatorio
        this.independientes = [];
        //Atributos del multiverso    
        this.size=0;
        this.max=max_conexiones;
        //Variable usada para la simulacion de viaje
        this.viaje = new ListaEnlazada();
    }

    //paramsvis hace referencia a los parametros del visualizador
    CrearUniversoIndependiente(data, paramsvis) {
        this.independientes.push(new Universo(data, paramsvis));
        this.size++;
    }

    //Un universo dependiente puede depender de varios independientes
    CrearUniversoDependiente(conexiones, data, paramsvis) {
        let uni = new Universo(data, paramsvis);
        for (let i = 0; i < conexiones.length; i++) {
            if (conexiones[i].conexiones.length < this.max) {
                conexiones[i].conexiones.push(uni);
                this.size++;
            }
            else {
                throw "Maximo de conexiones permitidas =" + this.max;
            }
        }
    }

    CrearConexion(ini, fin) {
        if (ini != fin) {
            if (ini.conexiones.length < this.max && fin.conexiones.length < this.max) {
                ini.conexiones.push(fin);
            } else {
                throw "Maximo de conexiones permitidas =" + this.max;
            }
        } else {
            throw "Conexion no permtida";
        }
    }

    Print(col,sw,hov) {
        push();
        for (let i = 0; i < this.independientes.length; i++) {
            //Imprimir conexiones (recursivo)
            for (let j = 0; j < this.independientes[i].conexiones.length; j++) {
                stroke(col);
                strokeWeight(sw);
                line(this.independientes[i].x,
                    this.independientes[i].y,
                    this.independientes[i].conexiones[j].x,
                    this.independientes[i].conexiones[j].y);
                if(!hov){
                    this.independientes[i].conexiones[j].Print(col,sw,false);
                }

            }
            //Imprimir nodos
            push();
            fill(this.independientes[i].c);
            stroke(col);
            strokeWeight(sw);
            circle(this.independientes[i].x, this.independientes[i].y, this.independientes[i].r);
            stroke('black');
            strokeWeight(2);
            textSize(this.independientes[i].r * 0.17333);
            fill('white');
            text(this.independientes[i].data, this.independientes[i].x - (this.independientes[i].r * 0.333), this.independientes[i].y + (this.independientes[i].r * 0.0314));
            //new Image('media/ssbu.png', this.independientes[i].x - (this.independientes[i].r * 0.333), this.independientes[i].y + (this.independientes[i].r * 0.0314));
            //image(this.independientes[i].data, this.independientes[i].x - (this.independientes[i].r * 0.333), this.independientes[i].y + (this.independientes[i].r * 0.0314));
            pop();
        }
        pop();
    }

    VerClicked_Multiverso(multiverso){
        for(let i=0; i<this.independientes.length;i++){ 
            this.independientes[i].Clicked(multiverso);
            for(let j=0; j<this.independientes[i].conexiones.length;j++){
                this.independientes[i].conexiones[j].VerClicked_Universo(multiverso);
            }
    }
}

    VerHover_Multiverso() {
        for (let i = 0; i < this.independientes.length; i++) {
            this.independientes[i].Hover();
            for (let j = 0; j < this.independientes[i].conexiones.length; j++) {
                this.independientes[i].conexiones[j].VerHover_Universo();
            }
        }
    }

    VerKeypressed_Multiverso(multiverso,key) {
        for (let i = 0; i < this.independientes.length; i++) {
            this.independientes[i].Keypressed(multiverso,key);
            for (let j = 0; j < this.independientes[i].conexiones.length; j++) {
                this.independientes[i].conexiones[j].VerKeypressed_Universo(multiverso,key);
            }
        }
    }
}