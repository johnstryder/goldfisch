@frontend @visuals @forecasting
Feature: ROI Visualization and Growth Forecasting
  As a financial advisor,
  I want to visualize the financial impact of my client segmentation and time reallocation,
  so that I can clearly see the opportunity cost of the "Drainy 80" and the growth potential of "Premier" relationships.

  Background:
    Given I am logged into the GoldFisch Client Segmentation system
    And my client book is segmented into Premier (4%), Core (16%), and Drainy 80 (80%)
    And I have navigated to the "ROI & Growth Forecasting" dashboard

  Scenario: Visualizing Opportunity Cost of the Drainy 80
    When I view the "Opportunity Cost" section
    Then I should see a "Diverging Bar Chart" comparing tiers
    And the chart should show a negative red bar for the "Drainy 80" representing the financial cost of current time spent
    And the chart should show a positive green bar for "Premier Relationships" representing the high ROI per hour
    And the chart labels should display the "Blended Revenue/Hours" metric for each tier

  Scenario: Forecasting Revenue Growth with Stacked Glass Pillars
    Given the current confirmed revenue is "$1,000,000"
    When I enable the "What If" toggle for the Premier tier
    And I set the "New Premier Clients" slider to "2"
    Then I should see "Stacked Glass Pillars" on the revenue forecast chart
    And the bottom solid layer of the pillar should represent "Confirmed Existing Revenue"
    And the top translucent "glass" layer should represent "Projected Revenue" from new onboarding
    And an "Overlay Projected Layer" should display the total estimated jump of "$250,000"

  Scenario: Simulating Max Effectiveness and Recovered Capacity
    When I adjust the "Max Effectiveness" Linked Multi-Sliders
    And I move the "Drainy 80" time allocation from "50%" to "10%"
    And I move the "Premier" time allocation to "60%"
    Then the "Impact Scorecard" should update in real-time
    And it should display a "Projected Revenue Increase %" of "35%"
    And it should show "Recovered Capacity" of "16 hours per week"
    And the "Efficiency Progress Bars" should show a transition from "Manual Workload" to "Automated Workflows"

  Scenario: Projecting Long-term Referral Impact with Growth Curves
    Given I have "10" clients in the Premier tier
    When I set the "Referral Probability" slider to "0.5 high-quality referrals per 2 clients"
    And I select a "3-year horizon" on the forecast timeline
    Then the system should render a "Growth Curve" visualization
    And the curve should show the compounded revenue impact of the new referral chain
    And a "Confidence Gauge" should appear indicating a "75%" probability based on historical referral data

  Scenario: Evaluating Total Firm Value and Succession Planning
    When I navigate to the "Enterprise Value" view
    Then I should see a "Valuation Multiplier Meter"
    And the meter should show an increase in the "Succession Value" as I shift time from the Drainy 80 to Premier
    And the "Tiered Growth Ribbon" should visualize the historical and projected migration of clients into higher tiers
    And the "Cumulative Valuation Increase" should be highlighted as a total dollar amount figure