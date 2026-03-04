@backend @analytics @forecasting
Feature: Growth Forecasting Engine
  The engine calculates the compounded ROI, capacity displacement, and valuation multipliers 
  for 'What If' growth scenarios based on the 80/20 Squared segmentation. It allows 
  advisors to project the financial impact of acquiring new Premier clients and 
  calculating the long-term value of high-quality referrals.

  Background:
    Given the advisor has a fully segmented book of business:
      | Tier    | Population % | Revenue Share % |
      | Premier | 4%           | 65%             |
      | Core    | 16%          | 15%             |
      | Drainy  | 80%          | 20%             |
    And the current "Status Quo" hourly value is calculated via Blended Revenue/Hours

  Scenario: Calculate Projected Revenue Jump for new Premier Client acquisition
    Given a "What If" scenario is created for "Premier Growth"
    When the advisor forecasts onboarding 1 new client into the "Premier" tier
    Then the system should generate an "Incremental Step Chart" data series
    And the "Projected Revenue Jump" should equal the average revenue of the existing Top 4%
    And the total book valuation should update using the user-defined "Valuation Multiplier Meter"

  Scenario: Project Compounded ROI from high-quality referrals
    Given a referral forecast with the following "Confidence Gauges":
      | Metric                     | Value |
      | Referral Rate per Premier  | 0.25  |
      | Conversion Probability     | 80%   |
      | Horizon                    | 3 years|
    When the forecasting engine runs the "Compounded ROI Matrix"
    Then the system should render a "Growth Curve" visualization
    And the projected revenue for year 3 should include the compounded value of the new referral's own referral potential

  Scenario: Calculate Capacity Displacement when shifting to Max Effectiveness
    Given the advisor inputs a "Max Effectiveness" target:
      | Tier    | Target Time Allocation % |
      | Premier | 80%                      |
      | Drainy  | 5%                       |
    And "Variable Time-Savers" for the Drainy 80 are set to "90% automation efficiency"
    When the "Capacity Displacement" service calculates available growth hours
    Then the "Impact Scorecard" should display the "Recovered Capacity" in hours per week
    And the "Projected Revenue Increase %" should be calculated based on reallocating those hours to Premier prospecting

  Scenario: Determine Succession Planning impact through Tier Distribution Shift
    Given the advisor models a transition of 5 "Core" clients into the "Premier" tier
    When the system processes the "Tiered Growth Ribbon" calculation
    Then the "Valuation Multiplier Meter" should reflect a higher enterprise value
    And the system should create a "Versioned Snapshot" of this forecast for the "Succession Planning" report
    And the "Stacked Glass Pillars" should visually distinguish "Confirmed" revenue from "Projected" transition revenue

  Scenario: Realistic probability weighting for Growth Projections
    Given a "What If" scenario with a high-growth aggressive toggle
    When the "Confidence Gauges" for a new referral drop below 40%
    Then the forecasting engine must apply a "Risk Penalty" to the "Projected Revenue Jump"
    And the "Overlay Projected Layer" should display a shaded confidence interval around the "Growth Curve"

  Scenario: Impact of Operationalizing the Drainy 80 on overall firm valuation
    Given an advisor switches from "Manual Reviews" to "Automated Webinars" for the "Drainy 80"
    When the "Comparison Toggle" for "Operationalization" is enabled
    Then the "Efficiency Progress Bars" should show a reduction in "Cost to Serve"
    And the "Cumulative Valuation Increase" should reflect the improved profit margins as a "Tiered Growth Ribbon" update