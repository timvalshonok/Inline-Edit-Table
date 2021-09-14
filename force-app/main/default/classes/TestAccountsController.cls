@isTest
public with sharing class TestAccountsController {
    
    @isTest public static void testGetAccounts() {
        List<Account> account = new List<Account>();
        account.add(new account(Name = 'abc'));
        insert account;

        test.startTest();
        List<Account> actual = AccountsController.getAccounts();
        test.stopTest();

        List<Account> expected = [SELECT Id, Name, Rating FROM Account];
        System.assertEquals(expected, actual);
    }

    // @isTest public static void testUpdateField() {
    //     Account account = new Account(Name = 'Test', Rating = 'Cold');
    //     insert account;
    //     Account updatedAccount = new Account(Id = account.Id, Name = 'Tested', Rating = 'Warm');

    //     test.startTest();
    //     Account actual = AccountsController.updateField(updatedAccount);
    //     test.stopTest();

    //     Account expected = [SELECT Name, Rating FROM Account WHERE Id = :account.Id];
    //     System.assertEquals(expected, actual);
    // }

}
