import { Injectable, Input } from '@angular/core';
import * as CONFIG from './config/config';
import { PlayerPosition } from './interfaces/player-position';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  @Input() public width: number = CONFIG.playGroundWidth;
  @Input() public height: number = CONFIG.playGroundHeight;
  frameNumber: number = CONFIG.frameNumber;
  player: PlayerPosition = {
    x: CONFIG.playGroundWidth / 2,
    y: CONFIG.playGroundHeight / 2
  };
  
  playerIcon;
  playerStep;  
  food: PlayerPosition;
  foodCoordinates = [];
  moves: number = 0; 

  context: CanvasRenderingContext2D;
	imagePerson: HTMLImageElement = null;
	imageFood: HTMLImageElement = null;
  gameLoop =  null;

  loadAssets(canvasElement: HTMLCanvasElement): Promise<void>  {
		this.context = canvasElement.getContext('2d');
		canvasElement.width = this.width;
		canvasElement.height = this.height;
		return new Promise((resolve, reject) => {
      this.imagePerson = new Image();
      this.imageFood = new Image();
			this.imagePerson.src = CONFIG.imagePerson;
			this.imageFood.src = CONFIG.imageFood;
      this.imagePerson.onload = () => {
        resolve();
      };
		});
  }
  
  
  // sets all the requires values
  setValues(size){

    // step size for each move
    this.playerStep = Math.ceil(CONFIG.playGroundWidth/size);
    // sets the initial position of the person in the center.
    this.player.x = (size%2==0)? Math.ceil(this.playerStep * (Math.ceil(size/2))) : Math.ceil(this.playerStep * (Math.ceil(size/2) +1)) ;
    this.player.y = (size%2==0)? Math.ceil(this.playerStep * (Math.ceil(size/2))) : Math.ceil(this.playerStep * (Math.ceil(size/2) +1)) ;
    
    // size of the icon
    this.playerIcon = {
      width: (size%2==0)? Math.ceil(CONFIG.playGroundWidth/size): Math.ceil(CONFIG.playGroundWidth/size),
      height: Math.ceil(CONFIG.playGroundWidth/size),
    };
    
    // this creates random coordinates for the food icons
    this.createCoordinates(size);
  }


  startGameLoop(size) {
  
    this.setValues(size);
  
    this.gameLoop = setInterval(() => {
			this.suffleProperties();
			this.cleanGround();
			this.createPlayer();
      this.createFood();
      this.detectCollision();
		}, 10);
  }
  
  // creates player icon image
  createPlayer(): void {
    this.context.drawImage(
			this.imagePerson,
			this.player.x, this.player.y,
			this.playerIcon.width, this.playerIcon.height,
    );
	}

  // creates food icon images
	createFood(): void {
    this.foodCoordinates.forEach((coordinate)=>{
      this.context.drawImage(
        this.imageFood,
        coordinate[0], coordinate[1],
        this.playerIcon.width, this.playerIcon.height,
      );
    })
  }

  // creates random coordinates for food icons  
  createCoordinates(size): void {
    for(let i=0; i<size; i++){
      let goAhead = true;
      while(goAhead){
        // creating random coordinates using Math.random()
        let coordinate = [Math.ceil((Math.random()*(this.width/this.playerStep)) - 1)*this.playerStep, Math.ceil((Math.random()*(this.width/this.playerStep)) -1)*this.playerStep];  
        if(!this.coordinatesExists(coordinate) && (coordinate[0] != this.player.x && coordinate[1] != this.player.y)){
          this.foodCoordinates.push(coordinate);
          goAhead = false;
        }
      }
    }
  }

  moveUp(){
    if (this.player.y <= 0) {
      this.player.y = 0;
    } else {
      this.player.y -= this.playerStep;
    }
    this.moves++;
  }

  moveDown(){
    if (this.player.y + this.playerIcon.height === CONFIG.playGroundHeight ||
      this.player.y + this.playerIcon.height > CONFIG.playGroundHeight) {
      this.player.y = CONFIG.playGroundHeight - this.playerIcon.height;
    } else {
      this.player.y += this.playerStep;
    }
    this.moves++;
  }

  moveRight(){
    if (this.player.x + this.playerIcon.width === CONFIG.playGroundWidth ||
      this.player.x + this.playerIcon.width > CONFIG.playGroundWidth) {
      this.player.x = CONFIG.playGroundWidth - this.playerIcon.width;
    } else {
      this.player.x += this.playerStep;
    }
    this.moves++;
  }

  moveLeft(){
    if (this.player.x === 0 || this.player.x < 0 ) {
      this.player.x = 0;
    } else {
      this.player.x -= this.playerStep;
    }
    this.moves++;
  }

  // detects whenever the person hits the food icon
  detectCollision(){  
    this.foodCoordinates.forEach((coordinate)=>{
      if(this.player.x === coordinate[0] && this.player.y === coordinate[1]){
        this.coordinatesRemove(coordinate);
      }
    })
    if(this.foodCoordinates.length === 0){
      alert("Total moves to complete: "+String(this.moves));
      clearInterval(this.gameLoop);
      window.location.reload();
    }
  }


  // returns true if the coordinates already exists in foodCoordinates array.
  coordinatesExists(search) {
		let exists = false;
		this.foodCoordinates.forEach(row => {
		  if(row[0] === search[0] && row[1] === search[1]){
			  exists = true;
		  }
		});
		return exists;
  }
  
  // removes coordinates from the foodCoordinates array
  coordinatesRemove(coordinate){	
    this.foodCoordinates = this.foodCoordinates.filter(row => {
		  if(!(row[0] === coordinate[0] && row[1] === coordinate[1])){
        return row;
      }
		});    
  }
  
  // clears the canvas
	cleanGround(): void {
		this.context.clearRect(0, 0, CONFIG.playGroundWidth, CONFIG.playGroundHeight);
  }
  
	animationFrame(n: number): boolean {
		if ((this.frameNumber / n) % 1 === 0) { return true; }
		return false;
	}

	suffleProperties(): void {
		this.frameNumber += 1;
	}

}
