@frontend @ui @segmentation
Feature: Client Segmentation Dashboard
  As a Wealth Manager,
  I want a visual representation of my 80/20 squared client segments,
  So that I can immediately identify my Premier relationships and operationalize the Drainy 80.

  Background:
    Given the advisor has successfully integrated with "Wealthbox" CRM
    And the Scoring Algorithm has processed the current book of business
    And I am on the "Segmentation Engine" dashboard page

  Scenario: Visualize client tiers in a Kanban layout
    Then I should see three distinct columns: "Premier (Top 4%)", "Core (Next 16%)", and "Drainy 80 (Bottom 80%)"
    And each column should contain client "Draggable Chips" showing the client name and annual revenue
    And the "Premier" column should show a summary stating "Target Revenue: 60-65%"
    And the "Drainy 80" column should show an "Efficiency Progress Bar" indicating current automation levels

  Scenario: Adjust segment thresholds using Draggable Brackets
    When I drag the "Premier/Core" threshold bracket from "4%" to "5%"
    Then the "Rolling Re-rank" logic should execute immediately
    And clients near the threshold should move between columns in real-time
    And the "Incremental Step Chart" should update to reflects the new revenue distribution

  Scenario: Identify manually overridden clients via Iconic Badges
    Given client "John Doe" was manually moved to the "Premier" tier by the advisor
    Then the client chip for "John Doe" should display an "Iconic Badge" indicating a manual override
    When I hover over the "Iconic Badge"
    Then I should see a tooltip with the reason: "Legacy relationship value"

  Scenario: Transition a client between tiers via Drag-and-Drop
    When I drag the client "Jane Smith" from "Drainy 80" to "Core"
    Then a "Conflict Resolution Modal" should appear asking for confirmation
    When I confirm the move
    Then "Jane Smith" should display a "Status Badge" as "Manually Promoted"
    And the "Tiered Growth Ribbon" should update the projected firm valuation

  Scenario: View mathematical breakdown of a specific client score
    Given the client "Alice Johnson" has a nuanced 5-category score
    When I click on "Alice Johnson" in the "Core" column
    Then I should see "Stacked Micro-Bars" representing:
      | Category           | Weight |
      | Referral History   | 25%    |
      | Revenue            | 30%    |
      | Potential          | 20%    |
      | Respect for Time   | 15%    |
      | Strategic Fit      | 10%    |
    And if Alice has a "Respect for Time" penalty, I should see a "Subtraction Badge" next to that micro-bar

  Scenario: Visualizing high-maintenance penalties
    Given a client "Big Spender Corp" has high revenue but low "Respect for Time"
    And the "Penalty Toggle Switch" for "High Maintenance" is enabled
    Then the "Big Spender Corp" chip should appear in the "Core" column instead of "Premier"
    And the chip should display a "Subtraction Badge" showing the point deduction

  Scenario: Analyze the Drainy 80 for operationalization
    When I focus on the "Drainy 80" column
    Then I should see "Action-Oriented Cards" for specific clients suggesting:
      | Client        | Recommended Action          |
      | Small Account | Switch to Automated Webinar |
      | Low Respect   | Email-only Communication    |
    And the "Split Comparison Bar" should show "Manual: 40 hrs" vs "Target: 5 hrs" for this tier