@backend @analytics @segmentation
Feature: 80/20 Squared Segmentation Engine
  As a practice manager, I want the system to automatically group my scored clients into three specific tiers (Premier, Core, and Drainy 80),
  so that I have immediate mathematical clarity on which households drive the bulk of my revenue and where capacity is being wasted.

  Background:
    Given the scoring algorithm uses a Custom Weighted Schema with Variable Multipliers
    And the system is integrated with the Wealthbox CRM API
    And the Revenue-Weighted Thresholds are set to the default 4%/16%/80% population buckets

  Scenario: Successful categorization of a full book of business using 80/20 squared logic
    Given the following client data exists in the system:
      | Client Name | Revenue | Score |
      | Client A    | 500000  | 95    |
      | Client B    | 450000  | 92    |
      | Client C    | 120000  | 85    |
      | Client D    | 110000  | 80    |
      | Client E    | 10000   | 40    |
      | Client F    | 5000    | 35    |
      | Client G    | 2000    | 20    |
    When the segmentation engine runs a full recalculation
    Then the client "Client A" should be assigned to the "Premier Relationships" tier
    And the tier "Premier Relationships" should represent approximately 4% of the population
    And the tier "Core Clients" should contain "Client B" and "Client C"
    And the "Drainy 80" tier should contain "Client E", "Client F", and "Client G"
    And the system should persist a "Snapshot-based" state of the segments for historical tracking

  Scenario: Rolling re-rank triggered by a significant revenue fluctuation
    Given "Client B" is currently in the "Core Clients" tier
    And "Client A" is currently in the "Premier Relationships" tier
    When the CRM API reports a "massive deposit" of 1000000 for "Client B"
    And an "Event-Driven Update" is triggered in the segmentation engine
    Then the system must perform a "Rolling Re-rank" across the entire book of business
    And "Client B" should be promoted to the "Premier Relationships" tier
    And "Client A" may be demoted to "Core Clients" if they fall out of the top 4% population bucket
    And the "Snapshot-based" segment history should record the tier shift with a timestamp

  Scenario: High-maintenance penalty forces a high-revenue client out of the Premier tier
    Given a client "Difficult High-Earner" with $600,000 in revenue
    And the "Respect for Time" category is processed via "Asynchronous Transcription Service"
    When the "Variable Multipliers" apply a heavy penalty for "high-maintenance" behavior
    Then the overall score should be significantly reduced
    And the segmentation engine should place "Difficult High-Earner" in the "Core Clients" tier despite their high revenue
    And a "Subtraction Badge" should be visible on their profile in the "Stacked Micro-Bars" view

  Scenario: Handling population distribution with Revenue-Weighted Thresholds
    Given an advisor has 100 clients in their book of business
    When the "Draggable Bracket" is used to define thresholds for 80/20 Squared
    Then the system should mathematically enforce the following partitions:
      | Tier                  | Population Count | Revenue Target |
      | Premier Relationships | 4                | ~60-65%        |
      | Core Clients          | 16               | ~15-20%        |
      | Drainy 80             | 80               | ~20%           |
    And the "Diverging Bar Chart" should reflect the financial cost of servicing the "Drainy 80" relative to their revenue contribution

  Scenario: Immediate tier transition via Manual Override
    Given a client "Legacy Founder" is categorized in the "Drainy 80" due to low current revenue
    When the advisor applies a "Manual Override" via the "Status Badge" UI
    Then the "Legacy Founder" should be moved to the "Premier Relationships" tier
    And the client should be marked with an "Iconic Badge" to distinguish them from AI-categorized clients
    And the "Rolling Re-rank" logic should exclude this client from automatic demotion in the next sync