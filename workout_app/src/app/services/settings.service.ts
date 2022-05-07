import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { Storage } from '@capacitor/storage';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private renderer: Renderer2;

  constructor(
    private rendererFactory: RendererFactory2
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.init();
  }

  public async init() {
    this.applyTheme();
  }

  public async setTheme(isDarkTheme: boolean) {
    await this.saveTheme(isDarkTheme);
    this.updateTheme(isDarkTheme);
  }

  public async getTheme(): Promise<boolean> {
    const result = await Storage.get({ key: 'theme' });
    let isDarkTheme: boolean = JSON.parse(result.value);

    if (isDarkTheme === null) {
      isDarkTheme = false;
    }

    return isDarkTheme;
  }
  
  private async saveTheme(isDarkTheme: boolean) {
    await Storage.set({ key: 'theme', value: isDarkTheme ? 'true' : 'false' });
  }

  private async applyTheme(isDarkTheme: boolean = null) {
    if (isDarkTheme === null) {
      isDarkTheme = await this.getTheme();
    }

    this.setTheme(isDarkTheme);
    this.updateTheme(isDarkTheme);
  }

  private updateTheme(isDarkTheme: boolean) {
    if (isDarkTheme) {
      this.renderer.setAttribute(document.body, 'colour-theme', 'dark');
    } else {
      this.renderer.setAttribute(document.body, 'colour-theme', 'light');
    }
  }
}
