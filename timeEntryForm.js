import { LightningElement, track } from 'lwc';
import saveWeeklyHours from '@salesforce/apex/WeeklyHoursManager.saveWeeklyHours';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';


export default class TimeEntryForm extends LightningElement {
	//State Variables
    @track isSundaySelected = false;
    @track weekHours = {
        Sunday__c: null,
        Monday__c: null,
        Tuesday__c: null,
		Wednesday__c: null,
		Thursday__c: null,
		Friday__c: null,
        Saturday__c: null
    };

    handleDateChange(event) {
        // Timezone setting to ensure accurate Sunday
        const selectedDate = new Date(event.target.value);
		const userTimezoneOffset = selectedDate.getTimezoneOffset() * 60000;
    	const adjustedDate = new Date(selectedDate.getTime() + userTimezoneOffset);
		console.log('Selected date:', selectedDate);
        if (adjustedDate.getDay() === 0) { // 0 is Sunday
            this.isSundaySelected = true;
			event.target.setCustomValidity("")
			this.weekHours.Week_Starting__c = adjustedDate;
			console.log('Sunday selected, showing input fields');
        } else {
            this.isSundaySelected = false;
			console.log('Not a Sunday, hiding input fields');
            event.target.setCustomValidity("Date must be a Sunday");
        }
		event.target.reportValidity();
    }

    handleHoursChange(event) {
		// Hour input to hande negative and non-number values
        const hoursInput = parseFloat(event.target.value);
        const day = event.target.dataset.day;

        if (isNaN(hoursInput) || hoursInput < 0) {
            event.target.setCustomValidity("Hours must be a positive number");
        } else {
            event.target.setCustomValidity("");
            this.weekHours[day] = hoursInput;
        }
        event.target.reportValidity();
    }

    saveHours() {
        const params = {
            weekStarting: this.weekHours.Week_Starting__c, // Field Inputs
            sundayHours: this.weekHours.Sunday__c,
            mondayHours: this.weekHours.Monday__c,
            tuesdayHours: this.weekHours.Tuesday__c,
			wednesdayHours: this.weekHours.Wednesday__c,
			thursdayHours: this.weekHours.Thursday__c,
			fridayHours: this.weekHours.Friday__c,
            saturdayHours: this.weekHours.Saturday__c
        };
		//Save to Custom Object
		saveWeeklyHours(params)
            .then((result) => {
                this.dispatchEvent(
					//Success Event
					new ShowToastEvent({
						title: 'Success',
						message: 'The record has been saved successfully.',
						variant: 'success'
					})
				);
            })
            .catch((error) => {
                this.dispatchEvent(
					//Test Failure
					new ShowToastEvent({
						title: 'Error saving record',
						message: error.body.message,
						variant: 'error'
					})
				);
            });

    }
}
