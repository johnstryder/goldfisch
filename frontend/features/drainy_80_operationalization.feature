@frontend @automation @admin
Feature: Drainy 80 Operationalization
  As a practice manager
  I want to systematize the service model for the "Drainy 80" client tier
  So that I can recover advisor capacity and reduce the financial cost of servicing low-ROI accounts.

  Background:
    Given the advisor has a fully scored book of business in the "GoldFisch" system
    And the "Drainy 80" segment has been identified via the 80/20 Squared Engine
    And the current "Status Quo" shows 50% of time spent on the bottom 80%

  Scenario: Viewing recommended service model changes for low-ROI accounts
    Given I am on the "Operationalization" dashboard for the "Drainy 80" tier
    Then I should see a list of "Action-Oriented Cards" for service model conversion
    And the first card should suggest "Transition from Manual Quarterly Reviews to Automated Webinars"
    And the second card should suggest "Shift to Self-Service Client Portal for Transactional Requests"
    And each card should display a "Estimated Hours Saved" metric

  Scenario: Comparing manual workload vs automated workflows
    Given I am reviewing a "Drainy 80" client profile for operationalization
    When I look at the "Workload Analysis" section
    Then I should see a "Split Comparison Bar"
    And the left side of the bar must represent "Current Manual Workload" in hours
    And the right side of the bar must represent "Projected Automated Workload" in hours
    And the "Efficiency Progress Bar" should indicate a "75%" decrease in manual touchpoints

  Scenario: Activating an automated workflow for a specific client
    Given I am on the "Drainy 80" management view
    When I select a "Action-Oriented Card" labeled "Automated Email Sequences"
    And I click "Apply to Tier"
    Then the system should update the "Comparison Toggle" to show "Max Effectiveness" active
    And the "Recovered Capacity" scorecard should increment based on the "Variable Time-Savers" logic
    And the dashboard should display an "Efficiency Progress Bar" showing the transition status

  Scenario: Visualizing recovered capacity after operationalizing the Drainy 80
    Given I have accepted 3 "Action-Oriented Card" recommendations for the "Drainy 80" tier
    When I navigate to the "Impact Scorecard"
    Then I should see the "Recovered Capacity" expressed in "Hours per Month"
    And the "Diverging Bar Chart" should show a decrease in "Sunk Cost" for the bottom 80%
    And the "Valuation Multiplier Meter" should trend upwards due to increased operational efficiency

  Scenario: Overriding automation for a legacy client in the Drainy 80
    Given a client "John Doe" is categorized in the "Drainy 80"
    And the system recommends "Automated Only" service
    When I apply a "Manual Override" to "John Doe" using the "Status Badge"
    Then the "Split Comparison Bar" for "John Doe" should revert to "Manual" workload levels
    And the "Recovered Capacity" projection should automatically recalibrate to exclude this client
    And the client should be marked with an "Iconic Badge" indicating a manual service override