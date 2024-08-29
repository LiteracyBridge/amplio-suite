// @ts-check
/// <reference types="cypress" />

import user from "../fixtures/login.json";

describe("User roles test", () => {
  before(() => {
    // Login to account
    cy.visit("http://localhost:8080");

    cy.get("form").within(() => {
      cy.get('input[name="username"]').type(user.email);
      cy.get('input[name="password"]').type(user.password);
      cy.contains('button', 'Sign in').click();
    });

    // Visit users page
    cy.wait(7000)
    cy.get('a[href="/users"]').click();
  });

  it("can create new role", () => {
    cy.get('a[href="/users/manage-roles"]').click();
    cy.get('button[id="btn-new-role"]').click();

    cy.contains("Create Custom Role");
    // TODO: fill forms
  });
});
