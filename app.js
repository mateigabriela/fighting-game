const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d'); //obține un context de desenare pe care îl poți folosi pentru a desena pe <canvas>


canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height); //(X, Y, width ,height ) X,Y-pozitiile, coltul din stanga sus

const gravity = 0.2; // cat de repede cad obiectele, creste treptat
class Sprite {
    constructor({position, velocity}) { //facand argumetele un obiect, ordinea nu mai este importanta
        this.position = position; //salvam pozitia fiecarui element vizibil din joc
        this.velocity = velocity;
        this.height = 150
    }

    draw() {
        c.fillStyle='red';
        c.fillRect(this.position.x, this.position.y, 50, this.height); //punem pozitiile obiectului Sprite, folosind constructorul
    }

    update() { //metoda pe care o vom apela atuci cand obiectele vor incepe sa se miste
        this.draw();
        this.position.y += this.velocity.y;

        if(this.position.y + this.height + this.velocity.y >= canvas.height) // distanta de la baza dreptunghiului pana la sfarsitul zonei de canvas
        {
            this.velocity.y = 0; //facem asta pentru a se opri dreptunghiul inainte de terminarea canvasului si a nu ,,cadea" in continuare
        } else {
            this.velocity.y += gravity;
        }
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
    }
});

console.log(player);


function animate() {
    window.requestAnimationFrame(animate);
    c.fillStyle='black';
    c.fillRect(0,0,canvas.width, canvas.height);
    player.update();
    enamy.update();
};

animate()