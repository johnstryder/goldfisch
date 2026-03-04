@backend @data @scoring
Feature: Client Scoring Algorithm
  The GoldFisch Client Scoring Algorithm evaluates clients based on five weighted categories
  to determine their true value beyond revenue. This includes handling qualitative data,
  applying penalty multipliers for high-maintenance clients, and redistributing weights
  when data is incomplete to ensure an accurate 80/20 squared segmentation.

  Background:
    Given the scoring engine is initialized with the following default weights:
      | category            | weight |
      | Revenue             | 0.40   |
      | Referral History    | 0.20   |
      | Future Potential    | 0.15   |
      | Respect for Time    | 0.15   |
      | Relationship Focus  | 0.10   |

  Scenario: Calculate weighted score for a Premier relationship
    Given a client "John Smith" with the following categorical inputs:
      | category            | raw_score (1-100) |
      | Revenue             | 95                |
      | Referral History    | 80                |
      | Future Potential    | 90                |
      | Respect for Time    | 85                |
      | Relationship Focus  | 90                |
    When the scoring algorithm processes the client data
    Then the overall client score should be 91.0
    And the client should be marked as "Eligible for Premier"

  Scenario: Apply Variable Multipliers to penalize high-maintenance revenue drivers
    Given a client "High-Maintenance Tycoon" with high revenue:
      | category            | raw_score (1-100) |
      | Revenue             | 100               |
      | Referral History    | 10                |
      | Future Potential    | 20                |
      | Respect for Time    | 10                |
      | Relationship Focus  | 30                |
    And the following Penalty Multipliers are active:
      | trait               | multiplier |
      | High Maintenance    | 0.7        |
      | Flight Risk         | 0.8        |
    When the scoring algorithm identifies the "High Maintenance" trait via Whisper transcription analysis
    Then the final score should be reduced by the 0.7 multiplier
    And the system should attach a Subtraction Badge to the client profile
    And the final score should be 32.55

  Scenario: Dynamic Weight Re-distribution for incomplete profiles
    Given a CRM import for client "Jane Doe" is missing "Referral History" data
    When the scoring algorithm detects the missing "Referral History" metric
    Then the system should trigger Dynamic Weight Re-distribution
    And the remaining 0.20 weight should be distributed proportionally across "Revenue", "Future Potential", "Respect for Time", and "Relationship Focus"
    And the final score should be calculated based on the 4 available categories totaling 1.0 weight

  Scenario Outline: Rolling Re-rank impacts tier distribution
    Given a book of business with a stable 80/20 squared distribution
    When a client's "Revenue" changes from <old_revenue> to <new_revenue>
    And the scoring algorithm performs an Immediate Tier Shift
    Then the client <client_id> should move from <old_tier> to <new_tier>
    And the system should record a Versioned Snapshot of the entire book

    Examples:
      | client_id | old_revenue | new_revenue | old_tier  | new_tier |
      | 101       | 50000       | 150000      | Core      | Premier  |
      | 202       | 20000       | 5000        | Core      | Drainy 80|
      | 303       | 100000      | 95000       | Premier   | Premier  |

  Scenario: Conflict Resolution for Shadow Records
    Given a "Shadow Record" internal field from Plaid shows "External Assets" of $2M
    And the primary CRM field "Total AUM" shows $500k
    When the scoring engine attempts to calculate the "Future Potential" score
    Then the system must trigger a Conflict Resolution Modal
    And the score calculation for "Future Potential" should be suspended until the Advisor manually resolves the conflict

  Scenario: Sentiment Chip Tags influence Respect for Time metric
    Given the Asynchronous Transcription Service processes a meeting for "Client B"
    And the following Sentiment Chip Tags are identified:
      | tag                | impact |
      | "Late to meeting"  | -15 pts|
      | "Demanding"        | -10 pts|
    When the scoring algorithm aggregates raw scores
    Then the "Respect for Time" category score should be decreased by 25 points
    And the Stacked Micro-Bars should visually represent this deduction in the UI