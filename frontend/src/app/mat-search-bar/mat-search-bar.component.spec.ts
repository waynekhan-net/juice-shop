/*
 * Copyright (c) 2014-2026 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import {type ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { fakeAsync, tick } from '@angular/core/testing'

import { MatSearchBarComponent } from './mat-search-bar.component'

describe('MatSearchBarComponent', () => {
  let component: MatSearchBarComponent
  let fixture: ComponentFixture<MatSearchBarComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, MatSearchBarComponent]
    }).compileComponents()

    fixture = TestBed.createComponent(MatSearchBarComponent)
    component = fixture.componentInstance
    fixture.detectChanges()

    component.inputElement = { nativeElement: { focus: jasmine.createSpy('focus') } } as any
    component.alwaysOpen = false
  }))

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should have disabled state when search is not visible', () => {
    component.searchVisible = false
    expect(component.isDisabled).toBe('disabled')
  })

  it('should be enabled when search is visible', () => {
    component.searchVisible = true
    expect(component.isDisabled).toBeNull()
  })

  it('should focus input on opening the search', fakeAsync(() => {
    spyOn(component.opened, 'emit')
    component.open()
    tick()
    expect(component.searchVisible).toBeTrue()
    expect((component.inputElement.nativeElement.focus as jasmine.Spy)).toHaveBeenCalled()
    expect(component.opened.emit).toHaveBeenCalled()
  }))

  it('should clear value on closing the search', () => {
    spyOn(component.closed, 'emit')
    component.value = 'test'
    component.searchVisible = true
    component.close()
    expect(component.searchVisible).toBeFalse()
    expect(component.value).toBe('')
    expect(component.closed.emit).toHaveBeenCalled()
  })

  it('should not close the search when set to be always open', () => {
    spyOn(component.closed, 'emit')
    component.alwaysOpen = true
    component.searchVisible = true
    component.close()
    expect(component.searchVisible).toBeTrue()
    expect(component.closed.emit).toHaveBeenCalled()
  })

  it('should open search by default when set to be always open', () => {
    component.alwaysOpen = true
    component.searchVisible = false
    component.ngOnInit()
    expect(component.searchVisible).toBeTrue()
  })

  it('should hide search on blur when value is empty', () => {
    spyOn(component.blur, 'emit')
    component.searchVisible = true
    component.onBlurring('')
    expect(component.blur.emit).toHaveBeenCalledWith('')
    expect(component.searchVisible).toBeFalse()
  })

  it('should keep search visible on blur if set to be always open', () => {
    spyOn(component.blur, 'emit')
    component.alwaysOpen = true
    component.searchVisible = true
    component.onBlurring('')
    expect(component.blur.emit).toHaveBeenCalledWith('')
    expect(component.searchVisible).toBeTrue()
  })

  it('should emit provided value when enterring', () => {
    spyOn(component.enter, 'emit')
    component.onEnterring('query')
    expect(component.enter.emit).toHaveBeenCalledWith('query')
  })

  it('should emit provided value when focussing', () => {
    spyOn(component.focus, 'emit')
    component.onFocussing('query')
    expect(component.focus.emit).toHaveBeenCalledWith('query')
  })
})
