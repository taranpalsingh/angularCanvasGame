import { Component, AfterViewInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { AppService } from './app.service';
import { GameService } from './game.service';
import * as CONFIG from './config/config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements AfterViewInit{
  
  size = 10;
  numbers = [];
  subscription: any;20
  width = CONFIG.playGroundWidth;
  sizeEntered = false;

  @ViewChild('canvas') public canvas: ElementRef;

  constructor(
      private appService: AppService,
      private gameService: GameService
  ){

    let goAhead = true;
    while(goAhead){
      this.size = Number(prompt("Board width (6 - 20): ","10"));
      if(this.size >= 6 && this.size <= 20){
        goAhead = false;
      }
    }
    for(let i=0; i<this.size; i++){
      this.numbers.push(i);
    }    
  }

	public ngAfterViewInit() {
		const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
		this.appService.createPlayGround(canvasEl);
		this.subscription = this.appService.getImageLoadEmitter()
			.subscribe((item) => {
				this.gameService.startGameLoop(this.size);
			});
	}

	@HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    this.appService.movePlayer(event, 'keydown');
	}
}
