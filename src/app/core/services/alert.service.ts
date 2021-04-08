import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  private snackConfig: MatSnackBarConfig = {
    horizontalPosition: 'center',
    verticalPosition: 'bottom',
    duration: 5000
  };

  private infoConfig: MatSnackBarConfig = {
    ...this.snackConfig,
    panelClass: 'snackbar-info',
  };

  private warningConfig: MatSnackBarConfig = {
    ...this.snackConfig,
    panelClass: 'snackbar-warning',
  };

  private errorConfig: MatSnackBarConfig = {
    ...this.snackConfig,
    panelClass: 'snackbar-error',
  };

  private successConfig: MatSnackBarConfig = {
    ...this.snackConfig,
    panelClass: 'snackbar-success',
  };

  constructor(
    private snackbar: MatSnackBar
  ) { }

  public info(message: string, action?: string): void {
    return this.open(message, this.infoConfig, action);
  }

  public warning(message: string, action?: string): void {
    return this.open(message, this.warningConfig, action);
  }

  public error(message: string, action?: string): void {
    return this.open(message, this.errorConfig, action);
  }

  public success(message: string, action?: string): void {
    return this.open(message, this.successConfig, action);
  }

  private open(message: string, config: MatSnackBarConfig, action?: string): void {
    if (action) {
      config.duration = undefined;
    }
    this.snackbar.open(message, action, config);
  }
}
