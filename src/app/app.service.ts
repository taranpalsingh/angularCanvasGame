import { Injectable, EventEmitter } from '@angular/core';
import { GameService } from './game.service';

@Injectable({
  providedIn: 'root'
})

export class AppService {
  isImageLoaded: EventEmitter<number> = new EventEmitter();
	constructor(private gameService: GameService) { }

	createPlayGround(canvasElement): void {
		this.gameService.loadAssets(canvasElement).then( (image) => {
      setTimeout( () =>{
        	this.isImageLoaded.emit();
      },1000);
		});
	}

	getImageLoadEmitter() {
		return this.isImageLoaded;
	}

  movePlayer(event: KeyboardEvent, type: string): void {
		if (type === 'keydown') {
			if (event.keyCode === 37) {
        this.gameService.moveLeft();
      } 
      else if (event.keyCode === 39) {
        this.gameService.moveRight();
      } 
      else if (event.keyCode === 38) {
        this.gameService.moveUp();
      } 
      else if (event.keyCode === 40) {
        this.gameService.moveDown()
			}
    } 
	}
}
