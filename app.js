const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d'); //obține un context de desenare pe care îl poți folosi pentru a desena pe <canvas>


canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height); //(X, Y, width ,height ) X,Y-pozitiile, coltul din stanga sus

const gravity = 0.7; // cat de repede cad obiectele, creste treptat
class Sprite {
    constructor({position, velocity, color='red', offset}) { //facand argumetele un obiect, ordinea nu mai este importanta
        this.position = position; //salvam pozitia fiecarui element vizibil din joc
        this.velocity = velocity;
        this.width=50;
        this.height = 150;
        this.lastKey;
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset, //=offset: offset
            width: 100,
            height: 50
        };
        this.color=color;
        this.isAttacking;
        
    }

    draw() {
        c.fillStyle=this.color;
        c.fillRect(this.position.x, this.position.y, this.width, this.height); //punem pozitiile obiectului Sprite, folosind constructorul
        
        //attackBox
         if(this.isAttacking) { //facem vizibil attackBox ul doar atunci cand ataca
            c.fillStyle='green';
            c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height);
         }
    }

    update() { //metoda pe care o vom apela atuci cand obiectele vor incepe sa se miste
        this.draw();
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y;

        this.position.x += this.velocity.x; // cand apasa pe anumite butoane de la tastatura si vrem ca obictele sa se miste, crestem velocity si il adaum aici la pozitie pentru a-l misca
        this.position.y += this.velocity.y;
        if(this.position.y + this.height + this.velocity.y >= canvas.height) // distanta de la baza dreptunghiului pana la sfarsitul zonei de canvas
        {
            this.velocity.y = 0; //facem asta pentru a se opri dreptunghiul inainte de terminarea canvasului si a nu ,,cadea" in continuare
        } else {
            this.velocity.y += gravity;
        }
    }

    attack () {  //functia se apeleaza cand apasam tasta spatiu, chiar daca vom intra in aria enamy ului, nu va fi atacat, ci doar atunci cand suntem si in aria lui si apasam si tasta spatiu
        this.isAttacking = true;
        setTimeout(() => {
            this.isAttacking=false
        }, 100)
    }

}

const player = new Sprite({
   position: {
        x: 0,
        y:0
   },
   velocity: {
        x: 0,
        y: 10, //default, nu va fi in miscare
   },
   offset: {
    x: 0,
    y: 0
   }
});


const enamy = new Sprite({
    position: {
        x: 400,
        y: 100
    },
    velocity: {
        x:0,
        y:0
    },
    color: 'blue',
    offset: {
        x: -50,
        y: 0
       }
});

console.log(player);

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    }
};

function rectangularCollision({rectangle1, rectangle2}) {
    return (rectangle1.attackBox.position.x + rectangle1.attackBox.width > rectangle2.position.x && 
        rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y && //atunci cand sarim deasupra obiectului sa nu fim in zona de ,,atac"
        rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height);
}

function animate() {
    window.requestAnimationFrame(animate);
    c.fillStyle='black';
    c.fillRect(0,0,canvas.width, canvas.height);
    player.update();
    enamy.update();
    player.velocity.x=0; //pentru a se opri din miscare cand eliberam una din tastele 'a' sau 'd' 
    enamy.velocity.x=0;

    //miscarea pentru player
    if(keys.a.pressed && player.lastKey ==='a') {
        player.velocity.x=-5; // se misca cu 5px pe cadru
    } else if (keys.d.pressed && player.lastKey === 'd'){ 
        player.velocity.x=5;
    }


    //miscarea pentru enamy
    if(keys.ArrowLeft.pressed && enamy.lastKey ==='ArrowLeft') {
        enamy.velocity.x=-5;
    } else if (keys.ArrowRight.pressed && enamy.lastKey === 'ArrowRight'){ 
        enamy.velocity.x=5;
    }

    //detectam daca obcitele au fost ,,atacate" 
    if ( rectangularCollision({
        rectangle1: player,
        rectangle2: enamy
    }) &&
        player.isAttacking) { //conditie pentru atac 
            player.isAttacking=false;     
            console.log('attack player');
    }

    if ( rectangularCollision({
        rectangle1: enamy,
        rectangle2: player
    }) &&
        enamy.isAttacking) { //conditie pentru atac 
            enamy.isAttacking=false;     
            console.log('attack enamy');
    }
};

animate()

//miscam obictul atunci cand tinem tasta apasata
window.addEventListener('keydown',(event) => { //keydown se refera la momentul cand tasta este apasata
    switch(event.key) {
        //pentru player
        case 'd': //cand apasam pe d vrem ca obiectul sa se miste
            keys.d.pressed=true; //se misca la drepta
            player.lastKey = 'd';
        break;
        case 'a': 
            keys.a.pressed=true; //cand apasam tasta 'a' obeictul se misca la stanga
            player.lastKey = 'a';
        break;
        case 'w': 
            player.velocity.y = -20; //cand apasam tasta 'w' obeictul se misca in sus
        break;


        //pentru enamy
        case 'ArrowRight': //cand apasam pe d vrem ca obiectul sa se miste
            keys.ArrowRight.pressed=true; //se misca la drepta
            enamy.lastKey= 'ArrowRight'
        break;
        case 'ArrowLeft': 
            keys.ArrowLeft.pressed=true; //cand apasam tasta 'a' obeictul se misca la stanga
            enamy.lastKey = 'ArrowLeft';
        break;
        case 'ArrowUp': 
            enamy.velocity.y = -20; //cand apasam tasta 'w' obeictul se misca in sus
        break;

        case ' ': //cand apasam tasta spatiu, playerul o sa atace
            player.attack();
        break;
        case 'ArrowDown':
            enamy.attack();
        break;

    }
    // console.log(event.key); //ne afiseaza pe ce tasta apasam
})

//oprim din miscare obiectul atunci cand eliberam tasta
window.addEventListener('keyup',(event) =>{  //keyup se refera la momentul cand tasta nu mai este apasata
    //pentru player
    switch(event.key) {
        case 'd':
            keys.d.pressed=false;; //cand eliberam tasta 'd' obiectul se opreste din miscare
        break;
        case 'a':
            keys.a.pressed=false; //cand eliberam tasta 'a' obiectul se opreste din miscare
        break;
        case 'w':
            keys.w.pressed=false; //cand eliberam tasta 'a' obiectul se opreste din miscare
        break;
    }

    //pentru enamy
    switch(event.key) {
        //pentru player
        case 'ArrowRight':
            keys.ArrowRight.pressed=false;; //cand eliberam tasta 'd' obiectul se opreste din miscare
        break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed=false; //cand eliberam tasta 'a' obiectul se opreste din miscare
        break;
        // case 'ArrowUp':
        //     keys.ArrowUp.pressed=false; //cand eliberam tasta 'a' obiectul se opreste din miscare
        // break;
    // console.log(event.key); //ne afiseaza pe ce tasta apasam
}})