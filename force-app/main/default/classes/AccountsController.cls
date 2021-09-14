public with sharing class AccountsController {

    @AuraEnabled(cacheable=true)
    public static List<Account> getAccounts() {
        return [SELECT Id, Name, Rating FROM Account LIMIT 20];
    }

    @AuraEnabled
    public static Account updateField(Account updatedAccount) { 
        update updatedAccount;
        return updatedAccount;
    }

    @AuraEnabled(cacheable=true)
    public static List<Map<String, String>> getPickListValues() {
        List<Map<String, String>> options = new List<Map<String, String>>();
        List<Schema.PicklistEntry> ratingPickList = Account.Rating.getDescribe().getPicklistValues();
        for (Schema.PicklistEntry entry :ratingPickList) {
            if (entry.isActive() == true) {
                options.add(new Map<String, String>{'label' => entry.getLabel(), 'value' => entry.getValue()});
            }
        }
        return options;
    }
}