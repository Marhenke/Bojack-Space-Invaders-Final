
let Bojack_posX = 50
let Bojack_velocidad = 10
let vidas = 3
let Gamestate = 0
let Gamestate_inicio = 1
let Gamestate_Game = 2
let Gamestate_Ganaste = 3
let Gamestate_Perdiste = 4
let Gamestate_Instrucciones = 5

let cuantos_invaders
let Invaders1 
let Invaders2 
let Invaders3  
let Invaders4 
let invaders

let Fires = []
let Shots = []

let imagen_inicio
let imagen_instrucciones
let imagen_juego
let imagen_ganaste
let imagen_perdiste
let imagen_bojack
let imagen_diane
let imagen_pc
let imagen_peanutbutter
let imagen_todd

let musica_intro
let musica_outro

let val_min = 20
let val_max = 28


function preload()
{
    invaders = loadJSON("Invaders.JSON")
    imagen_inicio = loadImage('Inicio.jpg')
    imagen_instrucciones = loadImage('instrucciones.jpg')
    imagen_juego =  loadImage('Juego.jpg')
    imagen_ganaste = loadImage('Ganar.jpg')
    imagen_perdiste = loadImage('Perder.jpg')
    imagen_bojack = loadImage('Bojack.png')
    imagen_diane = loadImage('Diane.png')
    imagen_pc = loadImage('PC.png')
    imagen_peanutbutter = loadImage('peanutbutter.png')
    imagen_todd = loadImage('Todd.png')
    musica_intro = loadSound('Intro.mp3')
    musica_outro = loadSound('Outro.mp3')
}

function setup() 
{
    createCanvas(1400, 700)
    Gamestate = Gamestate_inicio
}

function draw() 
{
    if(Gamestate == Gamestate_inicio)
    {
        image(imagen_inicio, 0, 0, windowWidth, windowHeight)
        inicializar()
    }
    else if (Gamestate == Gamestate_Instrucciones)
    {
        background(imagen_instrucciones)
    }
    else if(Gamestate == Gamestate_Game)
    {
    background(imagen_juego)
    fill(255)
    textSize(20)
    text("Vidas "+ vidas, 50, 50)

    let cambioDir = false
    fill(0)
    image(imagen_bojack, Bojack_posX, height-150,150,150)   //Se dibuja a Bojack
    
    if(keyIsDown(LEFT_ARROW) && Bojack_posX >0)
    {
        Bojack_posX-= Bojack_velocidad                  //Mueve a Bojack hacia la izquierda
        
    }
    else if(keyIsDown(RIGHT_ARROW) && Bojack_posX < windowWidth)
    {
        Bojack_posX+= Bojack_velocidad                  //Mueve a Bojack hacia la derecha
        
    }
    
    draw_invaders()
    move_invaders()

    
    //Me fijo si alguno de los Invaders llega al borde 
    for(let i = 0; i < Invaders1.length; i++)
    {
        if(Invaders1[i].x < 0 || Invaders1[i].x > windowWidth)
        {
            cambioDir = true
        }
    }
    for(let i = 0; i < Invaders2.length; i++)
    {
        if(Invaders2[i].x < 0 || Invaders2[i].x > windowWidth)
        {
            cambioDir = true
        }
    }
    for(let i = 0; i < Invaders3.length; i++)
    {
        if(Invaders3[i].x < 0 || Invaders3[i].x > windowWidth)
        {
            cambioDir = true
        }
    }
    for(let i = 0; i < Invaders4.length; i++)
    {
        if(Invaders4[i].x < 0 || Invaders4[i].x > windowWidth)
        {
            cambioDir = true
        }
    }
    
    //Si alguno de los invaders llego al borde hago que cambien de dir
    if(cambioDir)
    {
        for(let i = 0; i < Invaders1.length; i++)
        {
            Invaders1[i].direccion = Invaders1[i].direccion*(-1)
            Invaders1[i].y +=3

            Invaders2[i].direccion = Invaders2[i].direccion*(-1)
            Invaders2[i].y +=3

            Invaders3[i].direccion = Invaders3[i].direccion*(-1)
            Invaders3[i].y +=3

            Invaders4[i].direccion = Invaders4[i].direccion*(-1)
            Invaders4[i].y +=3
        }  
        
    }

    //Con el random hago que se creen los disparos 
    let r=random(0, 100)
    if(r < val_max && r >val_min)
    {
        create_shot()
    }

    val_min -= 0,1
    val_max += 0,1

    draw_shots()
    move_shots()

    //Me fijo si algun disparo coliciono con Bojack, de ser asi, resto una vida y saco al disparo de la lista
    for(let i = 0; i < Shots.length; i++)
    {
        if(hit_shots(Shots[i]))
        {
            vidas--
            Shots.splice(i,1)
        }
    }


    draw_fire()
    move_fire()

    //Me fijo si algun fire de Bojack colicion con algun invader, de ser asi, muere el invader y se resta el contador de invaders 
    for(let i = 0; i < Fires.length; i++)
    {
        for(j = 0; j < Invaders1.length; j++)
        {
            if(hit_fire(Fires[i], Invaders1[j]))
            {
                Invaders1[j].vivo = false
                cuantos_invaders--
                Fires[i].le_pego = true
            }
        }
        for(j = 0; j < Invaders2.length; j++)
        {
            if(hit_fire(Fires[i], Invaders2[j]))
            {
                Invaders2[j].vivo = false
                cuantos_invaders--
                Fires[i].le_pego = true
            }
        }
        for(j = 0; j < Invaders3.length; j++)
        {
            if(hit_fire(Fires[i], Invaders3[j]))
            {
                Invaders3[j].vivo = false
                cuantos_invaders--
                Fires[i].le_pego = true
            }
        }
        for(j = 0; j < Invaders4.length; j++)
        {
            if(hit_fire(Fires[i], Invaders4[j]))
            {
                Invaders4[j].vivo = false
                cuantos_invaders-- 
                Fires[i].le_pego = true
            }
        }
    }

    //Me fijo si alguno de los disparos le pego a Bojack y lo saco de la lista
    for(let i = 0; i < Fires.length; i++)
    {
        if(Fires[i].le_pego == true)
        {
            Fires.splice(i,1)
        }
    }

    //Si las vidas llegan a 0 Perdiste
    if(vidas == 0)
    {
        musica_intro.stop()
        musica_outro.play()
        Gamestate = Gamestate_Perdiste
    }
    //Si todos los Invaders murieron ganaste!
    else if(cuantos_invaders == 0)
    {
        musica_intro.stop()
        musica_outro.play()
        cambiar_gamestate_ganar()
    }
    }
    
    //Dibuja la pantalla de ganar
    else if(Gamestate == Gamestate_Ganaste)
    {
        image(imagen_ganaste, 0, 0, width, height)
    }
    //Dibuja la pantalla de perder
    else if (Gamestate == Gamestate_Perdiste)
    {
        image(imagen_perdiste, 0, 0, width, height)
    }
}

//Inicializa los valores para empezar a jugar
function inicializar()  
{
    Invaders1 = invaders.Invaders1
    Invaders2 = invaders.Invaders2
    Invaders3 = invaders.Invaders3
    Invaders4 = invaders.Invaders4

   for(let i = 0; i < Invaders1.length; i++)
   {
       Invaders1[i].vivo = true
       Invaders2[i].vivo = true
       Invaders3[i].vivo = true
       Invaders4[i].vivo = true
   }
   for(let i = 0; i < Invaders1.length; i++)
   {
       Invaders1[i].y = 40
       Invaders2[i].y = 130
       Invaders3[i].y = 220
       Invaders4[i].y = 310
   }

   Fires = []
   vidas = 3

    cuantos_invaders = Invaders1.length + Invaders2.length + Invaders3.length + Invaders4.length
}

//Cambia a gamestate ganador 
function cambiar_gamestate_ganar()
{
    Gamestate = Gamestate_Ganaste
}

//Se fija que invaders estan vivos y los dibuja
function draw_invaders()
{
    for(let i = 0; i < Invaders1.length; i++)
    {
        if(Invaders1[i].vivo == true)
        {
            image(imagen_diane, Invaders1[i].x, Invaders1[i].y, 40, 80)
        }
    }
    for(let j = 0; j < Invaders2.length; j++)
    {
        if(Invaders2[j].vivo == true)
        {
            image(imagen_pc, Invaders2[j].x, Invaders2[j].y, 40, 80)
        }
    }
    for(let k = 0; k < Invaders3.length; k++)
    {
        if(Invaders3[k].vivo == true)
        {
            image(imagen_peanutbutter, Invaders3[k].x, Invaders3[k].y, 40 ,80)
        }
    }
    for(let l = 0; l < Invaders4.length; l++)
    {
        if(Invaders4[l].vivo == true)
        {
            image(imagen_todd, Invaders4[l].x, Invaders4[l].y, 40, 80)
        }
    }
}

//Mueve los invaders
function move_invaders()
{
    for(let i = 0; i < Invaders1.length; i++)
    {
        Invaders1[i].x = Invaders1[i].x + Invaders1[i].direccion
        Invaders2[i].x = Invaders2[i].x + Invaders2[i].direccion
        Invaders3[i].x = Invaders3[i].x + Invaders3[i].direccion
        Invaders4[i].x = Invaders4[i].x + Invaders4[i].direccion
    }
}

//Dibuja los disparos de Bojack
function draw_fire()
{
    noStroke()
    fill(255,0,0)
    for(let i = 0; i < Fires.length; i++)
    {
        rect(Fires[i].x, Fires[i].y, 5, 10)
    }
}

//Mueve los disparos de Bojack
function move_fire()
{
    for(let i = 0; i < Fires.length; i++)
    {
        Fires[i].y = Fires[i].y - 5
    }
}

//Se fija si un fire coliciona con un invader y devuelve true o false
function hit_fire(fire, invader)
{
    if(invader.vivo)
    {
        let d = dist(fire.x, fire.y, invader.x, invader.y)
        if(d<30)
        {
            return true
        }
        else
        {
            return false
        }
    }
}

//Crea un disparo que nace en algun invader random (siempre y cuando este este vivo)
function create_shot()
{
    let fila = round(random(1, 5))
    if(fila == 1)
    {
        let columna = round(random(0, Invaders1.length-1))
        if(Invaders1[columna].vivo)
        {
            let shot = {x : Invaders1[columna].x, y : Invaders1[columna].y, colicion : false}
            Shots.push(shot)
        }
    }
    else if(fila == 2)
    {
        let columna = round(random(0, Invaders2.length-1))
        if(Invaders2[columna].vivo)
        {
            let shot = {x : Invaders2[columna].x, y : Invaders2[columna].y, colicion: false}
            Shots.push(shot)
        }
    }
    else if(fila == 3)
    {
        let columna = round(random(0, Invaders3.length-1))
        if(Invaders3[columna].vivo)
        {
            let shot = {x : Invaders3[columna].x, y : Invaders3[columna].y, colicion: false}
            Shots.push(shot)
        }
    }
    else if(fila == 4)
    {
        let columna = round(random(0, Invaders4.length-1))
        if(Invaders4[columna].vivo)
        {
            let shot = {x : Invaders4[columna].x, y : Invaders4[columna].y, colicion: false}
            Shots.push(shot)
        }
    }
}

//Dibuja los disparos de los invaders
function draw_shots()
{
    noStroke()
    fill(0,255,0)
    for(let i = 0; i < Shots.length; i++)
    {
        rect(Shots[i].x, Shots[i].y, 5, 10)
    }
}

//Dibuja los disparos de los invaders
function move_shots()
{
    for(let i = 0; i < Shots.length; i++)
    {
        Shots[i].y = Shots[i].y + 5
    }
}

//Se fija si alguno de los disparos de los invaders coliciona con Bojack y devuelve true o false
function hit_shots(shot)
{
    let d = dist(shot.x, shot.y, Bojack_posX, height - 75)
    if (d < 70)
    {
        return true
    }
    else 
    {
        return false
    }
}

//Crea un fire cada vez que la tecla UP_ARROW es precionada
function keyPressed()
{
    if(keyCode == UP_ARROW)
    {
        let fire = {x : Bojack_posX + 90, y : height-150, le_pego: false}
        Fires.push(fire)
    }
}

function mouseClicked()
{
    if(Gamestate == Gamestate_inicio && mouseX > 800 && mouseX < 1000 && mouseY > 450)
    {
        Gamestate = Gamestate_Game
        musica_intro.play() 
    }
    else if(Gamestate == Gamestate_inicio && mouseX > 300 && mouseX < 550 && mouseY > 450)
    {
        Gamestate = Gamestate_Instrucciones
    }
    else if(Gamestate == Gamestate_Instrucciones)
    {
        Gamestate = Gamestate_inicio
    }
    else if (Gamestate == Gamestate_Ganaste)
    {
        if(mouseX > 540 && mouseX < 610 && mouseY > 500 && mouseY < 570)
        {
            musica_outro.stop()
            inicializar()
            Gamestate = Gamestate_Game
            musica_intro.play() 
        }
        else if (mouseX > 780 && mouseX < 850 && mouseY > 500 && mouseY < 570)
        {
            musica_outro.stop()
            Gamestate = Gamestate_inicio
        }
    }
    else if (Gamestate == Gamestate_Perdiste)
    {
        if(mouseX > 540 && mouseX < 610 && mouseY > 500 && mouseY < 570)
        {
            musica_outro.stop()
            inicializar()
            Gamestate = Gamestate_Game
            musica_intro.play() 
        }
        else if (mouseX > 780 && mouseX < 850 && mouseY > 500 && mouseY < 570)
        {
            musica_outro.stop()
            Gamestate = Gamestate_inicio
        }
    }
}