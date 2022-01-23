import { CdkStepper } from '@angular/cdk/stepper';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppMaterialModule } from '@app/modules/material.module';
import { WaitingRoomComponent } from './waiting-room.component';

describe('WaitingRoomComponent', () => {
    let component: WaitingRoomComponent;
    let fixture: ComponentFixture<WaitingRoomComponent>;
    const mockDialogSpy: { close: jasmine.Spy } = 
    {
        close: jasmine.createSpy('close'),
    };

    // const resetSpy: { reset: jasmine.Spy } = 
    // {
    //     reset: jasmine.createSpy('reset'),
    // };


    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [WaitingRoomComponent],
            imports: [AppMaterialModule,BrowserAnimationsModule],
            providers: [
                {
                    provide: CdkStepper,
                    // useValue: resetSpy,
                },
                {
                    provide: MatDialogRef,
                    useValue: mockDialogSpy,
                },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(WaitingRoomComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should close the window when the begin button is clicked', () => {
        component.closeDialog();
        expect(mockDialogSpy.close).toHaveBeenCalled();
    });


      //A adapter lors de la vrai venue d'un joueur 2
      it('The démarrer button should be disabled when player 2 is coming', () => {
        component.playerArrival();
        fixture.detectChanges();
        const beginButton = fixture.debugElement.nativeElement.querySelector('#begin-button');
        expect(beginButton.attributes.getNamedItem('ng-reflect-disabled').value).toBeTruthy();
       });
       
       //A adapter lors de la vrai venue d'un joueur 2
       it('should hide the waiting-section if the player 2 is here', () => {
        component.playerArrival();
        fixture.detectChanges();
        expect(fixture.debugElement.query(By.css('#waiting-section'))).toBeNull()
       });
   

    it("should test the error", () => {
        expect( function(){ WaitingRoomComponent.dialog("a","s"); } ).toThrow(new Error("Method not implemented."));
    });


     //BLOQUER MARCHE PAS
    //  it('should reset and redirect the user to the party creation interface', () => {
        //const resetStepper = spyOn(component.stepper, 'reset');
    //     component.stepper.reset();
    //     const cancelButton = fixture.debugElement.nativeElement.querySelector('#cancel-button');
    //     fixture.detectChanges();
    //     expect(cancelButton.click()).toHaveBeenCalled();
    //    });


    // it('should return true when the disable button is clicked and when the page is refreshed', () => {
        //component.stepper.next();
        // const cancelButton = fixture.debugElement.nativeElement.querySelector('#cancel-button');
        // cancelButton.click();
        // fixture.detectChanges();
        // expect(resetSpy.reset).toHaveBeenCalled();
        // spyOn(component.stepper, 'next');
        // const cancelButton = fixture.debugElement.nativeElement.querySelector('#cancel-button');
        // cancelButton.click();
        //expect(stepperNextSpy).toHaveBeenCalled();
    // });
    

    //   it("should close the window when the begin button is clicked", () => {
    //     const beginButton = fixture.debugElement.nativeElement.querySelector('#begin-button');
    //     beginButton.removeAttribute("disabled");
    //     spyOn(component, "closeDialog");
    //     beginButton.click();
    //     fixture.detectChanges();
    //     expect(component.closeDialog).toHaveBeenCalled();
    //   });

    // it("TEST setPlayer2", () => {
    //     let setName = spyOnProperty(component, 'setPlayer2', 'set');
    //     component.player2
    //     setName.and.callThrough();
    //     component.setPlayer2(component.player2)
    //     expect(setName).toHaveBeenCalledWith('Francis');
    //  });
});
