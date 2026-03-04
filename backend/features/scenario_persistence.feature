@backend @data @forecasting
Feature: Scenario Persistence and Historical Tier Tracking
  As a financial advisor using the GoldFisch system,
  I want the system to save versioned snapshots of my "What If" scenarios and track historical tier shifts,
  so that I can audit my strategic decisions and measure the long-term impact of my business development efforts.

  Background:
    Given the backend service is connected to the primary PostgreSQL database
    And the "80/20 Squared" segmentation engine is initialized with default weights
    And a client portfolio exists with a baseline revenue distribution

  Scenario: Create a versioned snapshot of a "What If" scenario
    Given I have navigated to the "Growth Forecasting" module
    And I have adjusted the "Max Effectiveness" sliders to reallocate 80% of time to the Premier tier
    When I submit a request to save the current scenario as "2024 Optimistic Growth"
    Then the system should generate a new entry in the 'scenario_snapshots' table
    And the snapshot should persist the following data:
      | Field                  | Value                    |
      | scenario_name          | 2024 Optimistic Growth   |
      | total_production_weeks | 48                       |
      | premier_time_alloc     | 0.80                     |
      | drainy_80_time_alloc   | 0.05                     |
    And the system should return a unique 'scenario_uuid' for future retrieval

  Scenario: Track historical tier distribution shift after recalculation
    Given a client "John Doe" currently resides in the "Core" segment (Next 16%)
    And the last recorded snapshot for "John Doe" was '2023-Q4-Baseline'
    When the segmentation engine runs a "Rolling Re-rank" due to a 500k AUM increase from Plaid data
    Then the system should update "John Doe" to the "Premier" segment (Top 4%)
    And a new entry should be created in the 'tier_history' table with:
      | Field           | Value            |
      | client_id       | John Doe         |
      | previous_tier   | Core             |
      | current_tier    | Premier          |
      | change_trigger  | Revenue_Increase |
    And the 'Tier Distribution Shift' visualization should reflect a 1% increase in the Premier population

  Scenario: Retrieve and compare two versioned snapshots
    Given I have a saved snapshot "Status Quo 2023"
    And I have a saved snapshot "Efficiency Model 2024"
    When I request a "Snapshot-based" comparison between these two IDs
    Then the system should return a 'Compounded ROI Matrix' containing:
      | Metric                     | Delta Calculation           |
      | projected_revenue_increase | Efficiency - Status Quo     |
      | recovered_capacity_hours   | Status Quo - Efficiency     |
      | valuation_multiplier       | Projected Tier Distribution |

  Scenario: Audit log persistence for manual tier overrides
    Given a client "Legacy Smith" is automatically categorized as "Drainy 80"
    When an advisor applies a "Manual Override" to move the client to "Core"
    And provides the reason "Founding client legacy value"
    Then the 'client_metadata' should reflect the "Iconic Badge" status
    And the 'audit_logs' service should record:
      | Field        | Value                         |
      | action       | MANUAL_TIER_OVERRIDE          |
      | user_id      | current_advisor_id            |
      | metadata     | { "reason": "Founding client" } |

  Scenario: Historical data cleanup and retention policy
    Given the system data retention policy is set to 5 years
    When a snapshot or tier history record is older than the retention threshold
    Then the asynchronous cleanup worker should archive the record to cold storage
    And the record should no longer appear in the active 'Tiered Growth Ribbon' visualization