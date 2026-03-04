@backend @api @data
Feature: CRM Data Ingestion and Synchronization Engine
  As a GoldFisch backend service,
  I want to connect to external CRM APIs and ingest client data using priority queuing and auto-detection,
  so that the scoring engine has fresh, accurate data for the 80/20 squared segmentation.

  Background:
    Given the GoldFisch system is integrated with "Salesforce" and "Wealthbox" APIs
    And the database has "Versioned Snapshots" enabled for client records

  Scenario: Successful Auto-Detect Schema mapping for a new CRM connection
    Given a user initiates a new "Salesforce" CRM connection
    And the CRM contains fields: "Total_AUM_c", "Client_Net_Worth", and "Avg_Meeting_Minutes"
    When the system runs the Auto-Detect Schema logic
    Then the system should map "Total_AUM_c" to the "Revenue" scoring category using "Draggable Chips" metadata
    And the system should map "Avg_Meeting_Minutes" to the "Respect for Time" scoring category
    And the sync status should be updated to "Schema Mapped" in the Integration List

  Scenario: Priority Queue processing based on client tiers
    Given the system has identified the following client distribution:
      | Client ID | Current Tier | Revenue   |
      | 001       | Premier      | 500000    |
      | 002       | Core         | 100000    |
      | 003       | Drainy 80    | 5000      |
    When a global "Re-sync" command is triggered via the Priority Queue
    Then the system must process Client "001" (Premier) in the "High" priority batch
    And the system must process Client "003" (Drainy 80) in the "Low" priority batch
    And the "Data Freshness" status for Client "001" should be "Just Now" while "003" is "Pending"

  Scenario: Handling data conflicts with Shadow Records from external APIs
    Given an existing CRM record for "John Doe" with "Net Worth" of "$1,000,000"
    And a "Plaid" API sync identifies a "Shadow Record" for "John Doe" with different "Net Worth" of "$2,500,000"
    When the system processes the Asynchronous Webhook from Plaid
    Then the system should trigger a "Conflict Resolution Modal" event for the frontend
    And the internal "Shadow Record" should persist the Plaid data without overwriting the primary CRM field
    And the "Respect for Time" score should remain unchanged during this conflict

  Scenario: Rate limiting and backoff during massive data ingestion
    Given the system is concurrently pulling 5000 records from "Wealthbox"
    When the Wealthbox API returns a "429 Too Many Requests" response
    Then the Priority Queue should pause processing for "Low" and "Medium" priority batches
    And the system should implement an exponential backoff strategy
    And the "Status Indicators" in the Integration List should reflect "Throttled"

  Scenario: Dynamic weight redistribution for incomplete CRM profiles
    Given a client record is ingested from "Salesforce"
    And the record is missing data for "Referral History" and "Respect for Time"
    When the Scoring Algorithm processes this record
    Then the system should apply "Dynamic Weight Re-distribution" across the remaining 3 categories
    And the internal log should flag the profile as "Incomplete - Auto-Weighted"
    And the system should trigger an Asynchronous Transcription job to attempt to fill the "Respect for Time" gap

  Scenario: Rolling Re-rank triggered by major revenue fluctuation
    Given a "Premier" client record is updated via CRM Sync
    And their "Total AUM" has dropped by 80% due to a massive withdrawal
    When the "Rolling Re-rank" service detects the change
    Then the system should immediately recalculate tiers across the entire book of business
    And the system should generate a "Snapshot-based" state capture of the new distribution
    And the client tier shift should be logged for the "Tiered Growth Ribbon" visualization