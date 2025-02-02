/*
 * Copyright (c) 2022, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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

import Utils from "@support/utils";

describe("Publish thirdparty api", () => {
    const publisher = 'publisher';
    const publisherPassword = 'test123';
    const subscriber = 'subscriber';
    const subscriberPassword = 'test123';
    const carbonUsername = 'admin';
    const carbonPassword = 'admin';

    before(function () {
        cy.carbonLogin(carbonUsername, carbonPassword);
        cy.addNewUser(publisher, ['Internal/publisher', 'Internal/creator', 'Internal/everyone'], publisherPassword);
        cy.addNewUser(subscriber, ['Internal/subscriber','Internal/everyone'], subscriberPassword);
        cy.loginToPublisher(publisher, publisherPassword);
    })

    it.only("Publish thirdparty api", () => {
        cy.publishThirdPartyApi();
        cy.logoutFromPublisher();
        cy.loginToDevportal(subscriber, subscriberPassword);
        cy.viewThirdPartyApi();
        cy.logoutFromDevportal();

    });

    after(function () {
        // Test is done. Now delete the api
        cy.loginToPublisher(publisher, publisherPassword);
        cy.deleteApi('ThirdPartyAPI', '1.0.0');

        cy.visit(`${Utils.getAppOrigin()}/carbon/user/user-mgt.jsp`);
        cy.deleteUser(publisher);
        cy.deleteUser(subscriber);

    })
});

