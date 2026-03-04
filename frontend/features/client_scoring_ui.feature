@frontend @ui @scoring
Feature: Client Scoring User Interface
  As a financial advisor, I want a highly visual and interactive interface to score my clients
  based on the 5-category GoldFisch system, so that I can immediately see how qualitative 
  factors and penalties impact a client's overall rank and tier.

  Background:
    Given I am logged into the GoldFisch Client Segmentation system
    And I have navigated to the "Client Profile" page for "John Doe"
    And the current scoring weights are set to the default "Custom Weighted Schema"

  Scenario: Adjusting qualitative scores using Iconic Sliders
    When I locate the "Scoring" section on the dashboard
    And I move the "Respect for Time" Iconic Slider to a value of "2"
    And I move the "Referral History" Iconic Slider to a value of "5"
    Then the "Respect for Time" micro-bar should decrease in length relative to the weighted maximum
    And the "Referral History" micro-bar should increase to its maximum length
    And the "Overall Score" should automatically recalculate based on the new slider positions

  Scenario: Visualizing the 5-category score breakdown with Stacked Micro-Bars
    When I view the "Score Breakdown" component
    Then I should see five visual "Stacked Micro-Bars" representing:
      | Category            |
      | Revenue             |
      | Referral History    |
      | Growth Potential    |
      | Respect for Time    |
      | Business Alignment  |
    And each micro-bar should display a "Tooltip Hover" showing the raw numerical value and its weighted contribution

  Scenario: Applying a High-Maintenance penalty with Variable Multipliers
    Given "John Doe" currently has an overall score of "85"
    When I toggle the "High Maintenance" Penalty Switch to "ON"
    Then a red "Subtraction Badge" should appear next to the overall score labeled "-15%"
    And the "Overall Score" should update to "72" (rounded)
    And the "Tier" indicator should reflect a "Rolling Re-rank" change if the score falls below the "Premier" threshold

  Scenario: Flight-Risk penalty visibility
    When I toggle the "Flight Risk" Penalty Switch to "ON"
    Then I should see a "Visibility Icon" changed to a "Subtraction Badge"
    And the "Overall Score" color should transition from Green to Amber to indicate risk
    And the system should display the "Variable Multipliers" applied in the detailed calculation breakdown

  Scenario: Handling Incomplete Profiles with Dynamic Weight Re-distribution
    Given a client profile missing "Email Frequency" data for "Respect for Time"
    When I view the "Scoring" interface
    Then the "Respect for Time" slider should be disabled with a "Missing Data" status indicator
    And the other four "Stacked Micro-Bars" should expand to fill the total 100% weight distribution
    And a notification should suggest "Connect Email Integration" to unlock full scoring accuracy

  Scenario: Manual Score Override with Iconic Badge
    When I click the "Override" button on the Client Scorecard
    And I manually select the "Premier" tier from the dropdown
    And I provide the reason "Legacy Family Relationship"
    Then an "Iconic Badge" (star icon) should appear next to the client's name
    And the client should be placed in the "Premier Relationships" bucket regardless of the 80/20 math
    And the "Tier Distribution Shift" should be reflected in the "Global Portfolio View"