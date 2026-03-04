@backend @ai @realtime
Feature: AI Enrichment and Asynchronous Data Processing
  As the GoldFisch backend system,
  I want to process asynchronous webhooks and batch transcription data,
  so that I can generate shadow records, identify hidden potential, and update client scoring metrics without blocking the advisor interface.

  Background:
    Given the "Asynchronous Transcription Service" is connected to Whisper/Deepgram APIs
    And the "Priority Queue" is configured to process Premier clients before the Drainy 80
    And the "Shadow Records" internal schema is initialized for external data persistence

  Scenario: Processing external asset data via Plaid webhook to identify Hidden Potential
    Given an existing client "John Doe" in the "Core" tier
    When a Plaid "INITIAL_UPDATE" webhook is received with external account balances totaling "$500,000"
    Then the system should create a "Shadow Record" containing these external asset details
    And the AI-driven "hidden potential" analysis should calculate a "Potential" score boost
    And the client "John Doe" should be marked with a "Glow Sidebar" alert in the dashboard
    And the system should emit a "Snapshot-based" event to update the historical tier state

  Scenario: Extracting 'Respect for Time' metrics from meeting transcriptions
    Given a batch of "Asynchronous Transcription" jobs for the current week
    When the Whisper API returns a transcript containing phrases "constantly rescheduling" and "late for the third time"
    Then the system should generate "Sentiment Chip Tags" for "High Maintenance" and "Low Respect"
    And the "Scoring Algorithm" should apply a "Variable Multiplier" penalty of 0.8x to the "Respect for Time" category
    And the client profile should display a "Subtraction Badge" next to their recalculated score

  Scenario: Priority-based sync where Premier clients are processed first
    Given a queue containing:
      | Client Name | Tier      | Data Source |
      | Alice Smith | Drainy 80 | Email       |
      | Bob Jones   | Premier   | Plaid       |
      | Charlie Day | Core      | Whisper     |
    When the "Priority Queue" starts processing the batch
    Then the system must process "Bob Jones" before "Alice Smith"
    And the "Status Indicators" for "Bob Jones" should reflect "Sync Complete" while "Alice Smith" is "Pending"

  Scenario: Conflict resolution between CRM and Shadow Records
    Given a client "Sarah Jenkins" with "Total AUM" of "$1,000,000" in the CRM
    But the "Plaid" shadow record indicates actual "Total AUM" of "$2,500,000"
    When the "Auto-Detect Schema" process identifies the discrepancy
    Then the system should trigger a "Conflict Resolution Modal" for the advisor
    And no automated tier shift should occur until the "Split-Screen Diff" is reviewed and confirmed

  Scenario: Calculating 'Respect for Time' from Email frequency and timing
    Given an asynchronous webhook from the Email Provider API
    When the system analyzes interaction data for "Client X"
    And the data shows "15 emails sent after 10 PM" and "Average response time < 1 hour"
    Then the system updates the "Shadow Record" with high "Interaction Frequency"
    And the "Scoring Algorithm" applies a "Respect for Time" penalty due to boundary violations
    And the "Rolling Re-rank" service evaluates if "Client X" should move to the "Drainy 80" tier

  Scenario: Dynamic weighting when enrichment data is missing
    Given a new CSV ingestion via "Auto-Detect Schema"
    When a client profile is missing "Email Interaction" data for the "Respect for Time" category
    Then the "Dynamic Weight Re-distribution" service should increase the weight of "Revenue" and "Referral History"
    And the "Stacked Micro-Bars" visualization should indicate a "Null" or "Estimated" state for the missing metric