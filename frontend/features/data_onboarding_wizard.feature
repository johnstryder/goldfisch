@frontend @onboarding @api
Feature: Data Onboarding Wizard
  As a financial advisor setting up the GoldFisch system,
  I want a guided step-through process to connect my data sources and map my CRM fields,
  so that the 5-category scoring engine has accurate inputs for my client book.

  Background:
    Given the advisor has logged into the GoldFisch Dashboard-Centric Hub
    And is navigating to the "Initial Data Ingestion" setup page

  Scenario: Successfully connecting external data integrations
    When I navigate to the "Integration List" section
    Then I should see connection options for "Salesforce", "Wealthbox", "Plaid", and "Email Provider"
    When I click "Connect" on the "Salesforce" integration card
    And I complete the OAuth authentication process
    Then the "Salesforce" status indicator should change to "Active" with a "Data Freshness" timestamp of "Just Now"
    And the "Integration List" health status should show "1 Active / 3 Pending"

  Scenario: Mapping CRM fields to the 5-category scoring inputs using Draggable Chips
    Given the "Salesforce" integration is "Active"
    And the system has completed the "Auto-Detect Schema" process
    When I proceed to the "Guided Step-through" mapping screen
    Then I should see "Draggable Chips" representing CRM fields: "Total AUM", "Annual Revenue", "Email Count", "Last Meeting"
    And I should see target drop zones for: "Revenue", "Potential", "Respect for Time", "Referral History"
    When I drag the "Total AUM" chip to the "Potential" drop zone
    And I drag the "Email Count" chip to the "Respect for Time" drop zone
    And I click "Save Mapping"
    Then the system should confirm the field mapping is persisted
    And the "Scoring Algorithm" should be ready for the initial "Rolling Re-rank"

  Scenario: Resolving data conflicts between CRM and Shadow Records
    Given the system has ingested data from both "Salesforce" and "Plaid"
    When a "Shadow Record" from Plaid (Held-away assets) conflicts with the CRM "Total AUM" field
    Then the "Conflict Resolution Modal" should automatically appear
    And I should see a "Split-Screen Diff" comparing CRM values vs. Plaid values
    When I select the "Plaid" value as the source of truth for the "Potential" category
    And I click "Confirm Resolution"
    Then the client profile should be updated with the external asset data
    And the "Shadow Record" should be successfully merged into the primary profile

  Scenario: Handling incomplete profiles during onboarding
    Given I am mapping a CSV import via the "Auto-Detect Schema" wizard
    And the input data is missing "Referral History" for 40% of the clients
    When I attempt to finalize the data ingestion
    Then I should see a notification about "Incomplete Profiles"
    And the system should apply "Dynamic Weight Re-distribution" to the 5-category scoring
    And the "Status Indicators" should show a warning icon next to "Data Integrity: Partial"

  Scenario: Verifying data health and sync status before final segmentation
    Given all integrations are configured in the "Integration List"
    When the "Priority Queue" starts syncing data
    Then I should see "Premier" clients syncing first in the progress bar
    And the "Status Indicators" should display a "Syncing..." animation for each provider
    When the sync completes
    Then I should see a total count of "Mapped Households"
    And the "Proceed to Scoring" button should be enabled
    And the "Data Freshness" indicator should reflect the completion time across all "Salesforce", "Plaid", and "Email" sources