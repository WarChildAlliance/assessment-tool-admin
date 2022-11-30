import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-score-indicator',
  templateUrl: './score-indicator.component.html',
  styleUrls: ['./score-indicator.component.scss']
})
export class ScoreIndicatorComponent {

  @Input() score: number;
  @Input() borderColor = '#EEEEEE';

  constructor() { }

  public getIndicatorColor(score: number): string {
    this.score = Math.round(score);
    if (!score && score !== 0) {
      return 'inherit';
    }
    if (score < 40) {
      return '#FF5722';
    }
    if (score < 71) {
      return '#FFC107';
    }
    return '#8BC34A';
  }

}
