import { LightningElement, wire, api } from 'lwc';
import getPickListValues from '@salesforce/apex/AccountsController.getPickListValues';

export default class RatingEdit extends LightningElement {
    @api account;
    items = [];
    value = '';
    options = [];
    previousValue;

    @api openRatingPickList() {
        let mainDiv = this.template.querySelector('div[data-maindiv="' + this.account.Id + '"]');
        mainDiv.classList.toggle("slds-hidden");
        let select = this.template.querySelector('select');
        select.focus();
        select.value = this.account.Rating;
        this.previousValue = this.account.Rating;
    }

    closeRatingPickList() {
        let mainDiv = this.template.querySelector('div[data-maindiv="' + this.account.Id + '"]');
        mainDiv.classList.toggle("slds-hidden");
        let select = this.template.querySelector('select');
        const isEqual = (this.previousValue === select.value);

        if (isEqual) {
            this.dispatchEvent(new CustomEvent('enablebuttons'));
        } else {
            this.account.Rating = select.value;
            this.account.previousValue = this.previousValue;
            this.dispatchEvent(new CustomEvent('rerenderaccounts', {
                detail: this.account
            }));
        }
    }

    @wire(getPickListValues)
    getPickList({ error, data }) {
        if (data) {
            for (let i = 0; i < data.length; i++) {
                this.options = [...this.options, {label: data[i].label, value: data[i].value}];
            }
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.contacts = undefined;
        }
    }
}