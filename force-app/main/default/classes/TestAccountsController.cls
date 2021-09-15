@isTest
public with sharing class TestAccountsController {
    
    @TestSetup
    static void setup(){
        
        List<Account> accounts = new List<Account>();
        Account account = new Account(Name = 'Test', Rating = 'Cold');
        accounts.add(account);
        insert accounts;
    }
    
    @isTest public static void testGetAccounts() {

        test.startTest();
        List<Account> actual = AccountsController.getAccounts();
        test.stopTest();

        List<Account> expected = [SELECT Id, Name, Rating FROM Account];
        System.assertEquals(expected, actual, 'Should be list of accounts with columns Name, Rating');
    }

    @isTest public static void testUpdateField() {

        Account account = [SELECT Id, Name, Rating FROM Account WHERE Name='Test' AND Rating='Cold' LIMIT 1];
        account.Name = 'Tested';
        account.Rating = 'Warm';

        test.startTest();
        AccountsController.updateField(account);
        test.stopTest();

        Account expected = [SELECT Name, Rating FROM Account WHERE Name='Tested' AND Rating='Warm'];
        System.assertEquals(expected, account, 'Should be account with updated Name, Rating columns ("Tested", "Warm")');
    }

    @isTest public static void testGetPickListValues() {
        
        test.startTest();
        List<Map<String, String>> actual = AccountsController.getPickListValues();
        test.stopTest();

        List<Map<String, String>> expected = AccountsController.getPickListValues();
        System.assertEquals(expected, actual, 'Should be list of options');
    }
}
