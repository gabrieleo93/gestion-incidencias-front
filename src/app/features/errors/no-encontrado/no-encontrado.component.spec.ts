import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { NoEncontradoComponent } from './no-encontrado.component';

describe('NoEncontradoComponent', () => {
  let component: NoEncontradoComponent;
  let fixture: ComponentFixture<NoEncontradoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoEncontradoComponent],
      providers: [
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NoEncontradoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the not found information', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const statusCode = compiled.querySelector('.status-code');
    const title = compiled.querySelector('h1');
    const description = compiled.querySelector(
      '.not-found-description'
    );

    expect(statusCode?.textContent?.trim()).toBe('404');
    expect(title?.textContent?.trim())
      .toBe('No encontramos esta página');
    expect(description?.textContent)
      .toContain('La dirección solicitada no existe');
  });

  it('should provide a link to return home', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const link = compiled.querySelector(
      'a.home-link'
    ) as HTMLAnchorElement | null;

    expect(link).not.toBeNull();
    expect(link?.getAttribute('href')).toBe('/');
  });
});
