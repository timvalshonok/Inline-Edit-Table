import { LightningElement, api, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import getAccounts from '@salesforce/apex/AccountsController.getAccounts';
import updateField from '@salesforce/apex/AccountsController.updateField';
import { deleteRecord } from 'lightning/uiRecordApi';

export default class InlineTable extends LightningElement {

    accounts;
    @api account;
    wiredAccountsResult;
    inputId;
    accountId;
    currentValue;
    previousValue;
    currentAccountId;
    currentEditId;

    @wire(getAccounts)
    wiredGetAccounts(result) {
        this.wiredAccountsResult = result;
        if (result.data) {
            this.accounts = copy(result.data);
            for (let i = 0; i < this.accounts.length; i++) {
                this.accounts[i].idName = this.accounts[i].Id + 'Name';
                this.accounts[i].idRating = this.accounts[i].Id + 'Rating';
            }
            this.error = undefined;
        } else if (result.error) {
            this.error = result.error;
            this.accounts = undefined;
        }
    }

    deleteField(event) {
        const deleteId = event.target.dataset.accountid;
        deleteRecord(deleteId)
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Record deleted',
                        variant: 'success'
                    })
                );
                this.toggleButtons(false);
                refreshApex(this.wiredAccountsResult);
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error deleting record',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            })
    }

    editField(event) {
        this.toggleButtons(true);
        const inputId = event.target.dataset.inputid;
        const inputIdName = this.template.querySelector('lightning-input[data-editid="' + inputId + '"]');
        inputIdName.classList.toggle("slds-hidden");
        inputIdName.focus();
        this.currentValue = event.target.dataset.accountname;
    }

    hideEditField(event) {
        const editId = event.target.dataset.editid;
        let editField = this.template.querySelector('lightning-input[data-editid="' + editId + '"]');
        editField.classList.toggle("slds-hidden");
        const newValue = event.target.value;
        const accountId = event.target.dataset.accountid;
        const isEqual = (this.currentValue === newValue);
        if (!isEqual) {
            this.accounts = this.accounts.map(account => {
                if (account.Id === accountId) {
                    account.Name = newValue;
                }
                return account;
            });
            this.template.querySelector('td[data-tdid="' + editId + '"]').style.backgroundColor = "#d7de85";
            this.template.querySelector('div[data-buttonsid="cancelSave"').classList.toggle("slds-hidden");
            this.currentAccountId = accountId;
            this.currentEditId = editId;
            this.toggleButtons(true);
        } else {
            this.toggleButtons(false);
        }
    }

    toggleButtons(value) {
        let buttons = this.template.querySelectorAll('button[data-buttonid="id"]');
        buttons.forEach(button => {
            button.disabled = value;
        });
    }

    saveChanges(event) {
        let accountToUpdate;
        const currentAccount = this.currentAccountId;
        let updatedAccounts = this.accounts;
        accountToUpdate = updatedAccounts.find(updatedAccounts => updatedAccounts.Id == currentAccount);
       
        updateField({ updatedAccount: accountToUpdate })
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Record is updated',
                        variant: 'success'
                    }),
                );
                this.template.querySelector('td[data-tdid="' + this.currentEditId + '"]').style.backgroundColor = "white";
                this.template.querySelector('div[data-buttonsid="cancelSave"]').classList.toggle("slds-hidden");
                refreshApex(this.wiredAccountsResult);
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error',
                        message: 'account update error',
                        variant: 'error'
                    })
                );
            });
            this.toggleButtons(false);
    }

    cancel() {
        eval("$A.get('e.force:refreshView').fire();");
    }

    reRenderAccounts(event) {
        const accountFromChild = event.detail;
        this.accounts = this.accounts.map(account => {
            if (account.Id === accountFromChild.Id) {
                account.Rating = accountFromChild.Rating;
            }
            return account;
        });
        this.template.querySelector('td[data-tdid="' + accountFromChild.idRating + '"]').style.backgroundColor = "#d7de85";
        this.template.querySelector('div[data-buttonsid="cancelSave"]').classList.toggle("slds-hidden");
        this.currentEditId = accountFromChild.idRating;
        this.currentAccountId = accountFromChild.Id;
    }

    enableButtons() {
        let buttons = this.template.querySelectorAll('button[data-buttonid="id"]');
        buttons.forEach(button => {
            button.disabled = false;
        })
    }

    openRatingPickList(event) {
        this.toggleButtons(true);
        let tabletds = this.template.querySelectorAll('td[data-tds="tabletds"]');
        this.template.querySelector('div[data-buttonsid="cancelSave"]').classList.add("slds-hidden");
        const accountId = event.target.dataset.accountid;
        this.template.querySelector('tr[data-trid="' + accountId + '"] c-rating-edit').openRatingPickList();
    }
}

function copy(obj) {
    if (Object(obj) !== obj) {
        return obj;  
    }
    if (Array.isArray(obj)) {
        const object = [];
        const length = obj.length;
        for (let i = 0; i < length; i++) {
            object.push(copy(obj[i]));
        }
        return object;
    }
    const result = Object.create({});
    let keys = Object.keys(obj);
    const length = keys.length;
    for (let i = 0; i < length; i++) {
        const key = keys[i];
        result[key] = copy(obj[key]);
    }
    return result;
}
