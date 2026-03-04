@frontend @ai @ui
Feature: AI Insight Reviews
  As a financial advisor,
  I want to review and approve AI-generated insights from call transcriptions and external data,
  so that my client scoring and segmentation reflect accurate qualitative nuances.

  Background:
    Given the advisor is logged into the GoldFisch "Dashboard-Centric Hub"
    And a CRM sync via "Priority Queue" has completed for recently recorded client meetings
    And the "Asynchronous Transcription Service" has processed Whisper/Deepgram data

  Scenario: Reviewing Sentiment Chip Tags from call transcriptions
    Given I am on the "AI Insight Review" page for client "John Doe"
    When I view the "Highlight Snippets" section
    Then I should see a "Sentiment Chip Tag" labeled "Poor Respect for Time"
    And I should see a "Sentiment Chip Tag" labeled "Hidden Potential"
    When I click the "Poor Respect for Time" chip
    Then the system should display the specific "Highlight Snippet" from the transcript that triggered the tag
    And I should see a "Substraction Badge" indicating a -15% impact on the "Respect for Time" category score

  Scenario: Resolving data conflicts between CRM and Shadow Records
    Given the AI has detected a conflict between Wealthbox AUM and Plaid external assets for "Jane Smith"
    When I open the "Conflict Resolution Modal" for "Jane Smith"
    Then I should see a "Split-Screen Diff" comparing "CRM Data" vs "Shadow Record"
    And the "CRM Data" side should show "AUM: $500,000"
    And the "Shadow Record" side should show "Plaid Assets: $2,500,000"
    When I select the "Shadow Record" value as the source of truth
    And I click "Confirm Resolve"
    Then the client's "Potential" score should immediately recalculate
    And the "80/20 Squared Engine" should trigger a "Rolling Re-rank"

  Scenario: Manually overriding an AI-generated score penalty
    Given I am reviewing "Sentiment Chip Tags" for "Robert Miller"
    And the system has applied a "Penalty Multiplier" because the AI flagged "Flight Risk"
    And I see a "Subtraction Badge" on his profile
    When I click the "Penalty Toggle Switch" to "Disable"
    Then the system should prompt for an override reason
    And I enter "Legacy long-term family relationship"
    And I click "Save Override"
    Then the client "Robert Miller" should display an "Iconic Badge" indicating a manual override
    And the "Penalty Multiplier" should no longer affect the final client score

  Scenario: Verifying data freshness and sync status for AI inputs
    Given I am in the "Integration List" settings
    Then I should see "Status Indicators" for "Salesforce", "Plaid", and "Deepgram"
    And the "Salesforce" indicator should show "Last Synced: 5 minutes ago"
    And the "Deepgram" indicator should show "Processing Transcription: 2 pending"
    When the transcription finishes
    Then the "Deepgram" status should change to "Sync Complete"
    And a notification should appear in the "Glow Sidebar" for "New Insights Available"

  Scenario: Dynamic weighting update after missing data resolution
    Given a client "Emily Chen" has an "Incomplete Profile" due to missing email frequency data
    And the system is using "Dynamic Weight Re-distribution" for her score
    When I review the "Shadow Records" and confirm an "Email Sync" via the "Split-Screen Diff"
    Then the "Stacked Micro-Bars" for her score should update to include "Respect for Time"
    And the weights for "Revenue", "Potential", and "Referral History" should automatically re-balance
    And the final tier should be updated on the "Drag-and-Drop Kanban" board