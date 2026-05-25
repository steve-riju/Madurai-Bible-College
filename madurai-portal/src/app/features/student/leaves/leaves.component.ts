import { Component } from '@angular/core';

@Component({
  selector: 'app-leaves',
  templateUrl: './leaves.component.html',
  styleUrls: ['./leaves.component.scss']
})
export class LeavesComponent {
  refreshKey = 0;

  onLeaveApplied(): void {
    this.refreshKey++;
  }
}
