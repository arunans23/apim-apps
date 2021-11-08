/*
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *  
 * http://www.apache.org/licenses/LICENSE-2.0
 *  
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

describe("do nothing", () => {
    const username = 'admin';
    const password = 'admin';
    const appName = 'changeTierApp';
    const appDescription = 'change tier app description';
    const apiName = 'changeTierApi';
    const apiVersion = '1.0.0';

    beforeEach(function () {
        cy.loginToPublisher(username, password)
        // login before each test
    });

    it.only("Download swagger", () => {
        cy.createAndPublishAPIByRestAPIDesign(apiName, apiVersion);

        // Create an app and subscribe
        cy.createApp(appName, appDescription);
        cy.visit('/devportal/applications?tenant=carbon.super');
        cy.get(`[data-testid="application-listing-table"] td a`).contains(appName).click();

        // Go to application subscription page
        cy.get('[data-testid="left-menu-subscriptions"]').click();
        cy.get('[data-testid="subscribe-api-btn"]').click();
        cy.get(`[data-testid="policy-select-${apiName}"]`).click();
        cy.get(`[data-testid="policy-select-${apiName}-Unlimited"]`).click();
        cy.get(`[data-testid="policy-subscribe-btn-${apiName}"]`).click();
        cy.get('[data-testid="close-btn"]').click();

        // Check the subscriptions existence
        cy.get(`[data-testid="subscriptions-table"] td a`).contains(`${apiName} - ${apiVersion}`).should('exist');

        // Edit the subscription
        cy.get(`[data-testid="edit-api-subscription-${apiName}"]`).click();
        cy.get('[data-testid="edit-api-subscription-select"]').click();
        cy.get(`[data-testid="select-Silver"]`).click();
        cy.get('button span').contains('Update').click();

        // Checking the update is success.
        cy.get(`[data-testid="policy-for-${apiName}"]`).contains('Silver').should('exist');
    });

    after(function () {
        // Test is done. Now delete the api
        cy.visit('/devportal/applications?tenant=carbon.super');
        cy.get(`[data-testid="delete-${appName}-btn"]`, { timeout: 30000 });
        cy.get(`[data-testid="delete-${appName}-btn"]`).click();
        cy.get(`[data-testid="application-delete-confirm-btn"]`).click();

        cy.deleteAllApis();
    })
});