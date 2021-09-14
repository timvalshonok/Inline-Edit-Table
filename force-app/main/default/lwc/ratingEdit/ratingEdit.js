import { LightningElement, wire, api } from 'lwc';
import getPickListValues from '@salesforce/apex/AccountsController.getPickListValues';

export default class RatingEdit extends LightningElement {
    @api account;
    items = [];
    value = '';
    options = [];
    previousValue;

    @api openRatingPickList() {
        let div = this.template.querySelector('div[data-div="' + this.account.Id + '"]');
        div.classList.toggle("slds-hidden");
        let select = this.template.querySelector('select');
        select.focus();
        select.value = this.account.Rating;
        this.previousValue = this.account.Rating;
    }

    closeRatingPickList() {
        let div = this.template.querySelector('div[data-div="' + this.account.Id + '"]');
        div.classList.toggle("slds-hidden");
        let select = this.template.querySelector('select');

        if (this.previousValue === select.value) {
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
            this.options = data.map(options => options, {label: data.label, value: data.value})
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.contacts = undefined;
        }
    }
}