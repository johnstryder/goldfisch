@frontend @ui @analytics
Feature: Time Allocation & ROI Calculator
  As a financial advisor,
  I want to model my current time distribution against an ideal "Max Effectiveness" state
  So that I can visualize the opportunity cost of the "Drainy 80" and the revenue potential of "Premier" relationships.

  Background:
    Given the advisor has a fully segmented book of business:
      | Segment | Client Count | Revenue % |
      | Premier | 4            | 65%       |
      | Core    | 16           | 20%       |
      | Drainy  | 80           | 15%       |
    And the advisor's "Blended Revenue/Hours" is calculated at $500/hr
    And the current production capacity is set to 40 hours per week over 48 weeks

  Scenario: Modeling Status Quo vs Max Effectiveness with Linked Multi-Sliders
    Given I am on the "Time Allocation Modeling" dashboard
    When I adjust the "Linked Multi-Sliders" for the "Status Quo" configuration:
      | Tier       | Time Allocation % |
      | Premier    | 20%               |
      | Core       | 30%               |
      | Drainy 80  | 50%               |
    And I toggle the "Max Effectiveness" mode to ON
    And I adjust the "Max Effectiveness" sliders to:
      | Tier       | Time Allocation % |
      | Premier    | 60%               |
      | Core       | 30%               |
      | Drainy 80  | 10%               |
    Then the "Impact Scorecard" should display a "Recovered Capacity" of "16 hours/week" from the Drainy 80
    And the "Diverging Bar Chart" should show a decrease in "Servicing Cost" for the Bottom 80%
    And the "Projected Revenue Increase %" should reflect the redirected focus on Premier relationships

  Scenario: Visualizing Opportunity Cost of the Drainy 80
    Given I have "80" clients in the "Drainy 80" segment
    When I set the "Manual Workload" slider for Drainy 80 to "Standard/High"
    Then the "Impact Scorecard" should show a "Hidden Tax" value based on the Opportunity Cost
    And the "Split Comparison Bar" should visualize:
      | Mode                 | Manual Time | Automated Efficiency |
      | Current Status Quo   | 20 hours    | 0%                   |
      | Recommended Model    | 2 hours     | 90%                  |
    And the system should display "Action-Oriented Cards" recommending "Automated Webinars" and "Digital Service Tiers"

  Scenario: Projecting Revenue Growth from Capacity Displacement
    Given I am viewing the "Growth Forecasting" section
    When I adjust the "Premier" tier time allocation to 80% using the "Linked Multi-Sliders"
    And I set the "Valuation Multiplier Meter" to "3x" for recurring revenue
    Then the "Overlay Projected Layer" on the revenue chart should show a "Projected Revenue Jump" 
    And the "Incremental Step Chart" should display the financial impact of adding "1" new Premier client per year
    And the "Growth Curve" should calculate a 3-year "Compounded Revenue Impact" for these saved hours

  Scenario: Dynamic Efficiency Gains via Operationalization
    Given the "Variable Time-Savers" setting is visible
    When I toggle between "50% Automation" and "90% Automation" for the "Drainy 80"
    Then the "Efficiency Progress Bars" should update in real-time
    And the "Impact Scorecard" must immediately update the "Recovered Capacity" metric
    And the "Tiered Growth Ribbon" should expand to show higher firm valuation at the 90% efficiency level