// https://docs.cypress.io/api/introduction/api.html

describe("Flight Search Page", () => {
  it("Visits the flight search page", () => {
    cy.visit("/");
    cy.contains("From")
    cy.contains("Round Trip")
    cy.get("#from-city-selector").type("delhi");
    cy.contains("New Delhi").click()
    cy.get("#to-city-selector").type("mumbai")
    cy.contains("Mumbai").click()
    cy.get("#departure-date-picker")
  });
});
