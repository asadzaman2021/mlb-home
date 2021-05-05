Feature: Authentication

    @loggedout
    Scenario: Logged out user is redirected to the mlb.tv sell page
        Given A logged out user visits the mlb.tv homepage
        Then They are redirected to the mlb.tv sell page

    Scenario: Clicking login in the header directs the user to the mlb.tv login page
        Given A logged out user visits the mlb.tv sell page
        When The user clicks the login button
        Then They are redirected to the mlb.tv login page

    @loggedin
    Scenario: A logged in user is able to view the mlb.tv homepage
        Given A logged in and entitled user visits the mlb.tv homepage
        Then They can view the mlb.tv homepage