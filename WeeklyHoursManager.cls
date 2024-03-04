public with sharing class WeeklyHoursManager {
    //AuraEnabled to interact with LWC
    @AuraEnabled(cacheable=true)
    public static List<Weekly_Hours__c> getWeeklyHours() {
        // Query the Weekly_Hours__c records from Custom Object
        return [SELECT Id, Week_Starting__c, Sunday__c, Monday__c, Tuesday__c, Wednesday__c, Thursday__c, Friday__c, Saturday__c FROM Weekly_Hours__c];
    }

    @AuraEnabled
    public static String saveWeeklyHours(Date weekStarting, Decimal sundayHours, Decimal mondayHours, Decimal tuesdayHours, Decimal wednesdayHours, Decimal thursdayHours, Decimal fridayHours, Decimal saturdayHours) {
        try {
            // Check if a record already exists for the given week starting date
            List<Weekly_Hours__c> existingEntries = [SELECT Id FROM Weekly_Hours__c WHERE Week_Starting__c = :weekStarting LIMIT 1];
            
            // Initialize a new entry or assign the existing one
            Weekly_Hours__c entry = existingEntries.isEmpty() ? new Weekly_Hours__c() : existingEntries[0];

            // Set the fields
            entry.Week_Starting__c = weekStarting;
            entry.Sunday__c = sundayHours;
            entry.Monday__c = mondayHours;
            entry.Tuesday__c = tuesdayHours;
            entry.Wednesday__c = wednesdayHours;
            entry.Thursday__c = thursdayHours;
            entry.Friday__c = fridayHours;
            entry.Saturday__c = saturdayHours;

            // Upsert the entry
            upsert entry;
            return 'Success';
        } catch (Exception e) {
            // Error Handling
            return 'Error: ' + e.getMessage();
        }
    }

}